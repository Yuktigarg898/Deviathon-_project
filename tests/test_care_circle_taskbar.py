import subprocess, urllib.request, json, asyncio, websockets, time, sys, base64
sys.stdout.reconfigure(encoding='utf-8')

async def test_care_circle():
    print("Launching headless Chrome...")
    p = subprocess.Popen([
        r'C:\Program Files\Google\Chrome\Application\chrome.exe',
        '--headless=new',
        '--remote-debugging-port=9236',
        '--window-size=1440,1100',
        'http://127.0.0.1:5000/'
    ])
    await asyncio.sleep(2.5)
    
    try:
        tabs = json.loads(urllib.request.urlopen('http://127.0.0.1:9236/json').read())
        target = [t for t in tabs if t.get('type') == 'page'][0]
        ws = await websockets.connect(target['webSocketDebuggerUrl'])

        current_id = 100
        async def call_method(method, params=None):
            nonlocal current_id
            current_id += 1
            msg_id = current_id
            payload = {'id': msg_id, 'method': method}
            if params:
                payload['params'] = params
            await ws.send(json.dumps(payload))
            while True:
                raw = await ws.recv()
                msg = json.loads(raw)
                if msg.get('id') == msg_id:
                    return msg

        async def eval_js(expr):
            res = await call_method('Runtime.evaluate', {'expression': expr, 'returnByValue': True})
            return res.get('result', {}).get('result', {}).get('value')

        await call_method('Runtime.enable')

        # 1. Compile script check
        with open('app.js', 'r', encoding='utf-8') as f:
            code = f.read()

        comp = await call_method('Runtime.compileScript', {
            'expression': code,
            'sourceURL': 'app.js',
            'persistScript': True
        })
        assert 'exceptionDetails' not in comp.get('result', {}), f"Compilation error: {comp}"
        print("1. app.js compiled cleanly with zero syntax errors!")

        # 2. Enter Senior Portal
        await eval_js("enterDashboard('senior')")
        await asyncio.sleep(0.5)

        # 3. Check presence of Family Care Circle button in Global Header
        h_circle_exists = await eval_js("document.getElementById('header-family-circle-btn') !== null")
        h_sos_exists = await eval_js("document.getElementById('header-sos-btn') !== null")
        print(f"2. Header Family Care Circle button exists: {h_circle_exists}")
        print(f"3. Header Emergency SOS button exists: {h_sos_exists}")
        assert h_circle_exists, "Header Family Care Circle button missing!"
        assert h_sos_exists, "Header Emergency SOS button missing!"

        # 4. Click Header Family Care Circle button
        print("4. Clicking Header Family Care Circle button...")
        await eval_js("document.getElementById('header-family-circle-btn').click()")
        await asyncio.sleep(0.4)

        modal_open = await eval_js("!document.getElementById('modal-family-care-circle').classList.contains('hidden')")
        print(f"   Family Care Circle Modal open: {modal_open}")
        assert modal_open, "Family Care Circle modal failed to open!"

        # Check rendered members inside modal
        members_count = await eval_js("document.querySelectorAll('#modal-family-members-list > div').length")
        badge_text = await eval_js("document.getElementById('circle-members-count-badge').textContent")
        print(f"   Connected members in modal: {members_count} ({badge_text})")
        assert members_count >= 2, f"Expected at least 2 members in modal, got {members_count}"

        # 5. Click '+ Add Family Member' inside the modal
        print("5. Clicking '+ Add Family Member' inside the modal...")
        await eval_js("document.getElementById('btn-toggle-add-fam').click()")
        await asyncio.sleep(0.3)

        form_visible = await eval_js("!document.getElementById('inline-add-family-form-container').classList.contains('hidden')")
        print(f"   Inline Add Member Form visible inside modal: {form_visible}")
        assert form_visible, "Inline form failed to open inside modal!"

        # 6. Fill and submit new member inside modal
        print("6. Submitting new family member (Dr. Rohit Sharma - Grandson) inside modal...")
        await eval_js("""
            document.getElementById('inline-fam-name').value = 'Dr. Rohit Sharma';
            document.getElementById('inline-fam-relation').value = 'Grandchild (पोता / पोती)';
            document.getElementById('inline-fam-phone').value = '+91 98112-99887';
            document.getElementById('inline-fam-email').value = 'rohit.doc@gmail.com';
            submitInlineAddFamilyMember();
        """)
        await asyncio.sleep(0.5)

        updated_members_count = await eval_js("document.querySelectorAll('#modal-family-members-list > div').length")
        print(f"   Updated members count inside modal: {updated_members_count}")
        assert updated_members_count == members_count + 1, "Failed to add new family member inside modal!"

        # 7. Close modal
        await eval_js("closeFamilyCareCircleModal()")
        await asyncio.sleep(0.2)
        modal_closed = await eval_js("document.getElementById('modal-family-care-circle').classList.contains('hidden')")
        print(f"7. Modal closed successfully: {modal_closed}")
        assert modal_closed, "Modal did not close!"

        # 8. Check bottom of Senior View - ensure old cards are not present
        bottom_circle_exists = await eval_js("document.getElementById('senior-family-members-list') !== null")
        print(f"8. Bottom Family Care Circle card removed from page body: {not bottom_circle_exists} (should be True)")
        assert not bottom_circle_exists, "Bottom Family Care Circle still in page body!"

        # Take screenshot of open Family Care Circle Modal
        await eval_js("openFamilyCareCircleModal()")
        await asyncio.sleep(0.4)
        snap = await call_method('Page.captureScreenshot')
        img_data = base64.b64decode(snap['result']['data'])
        with open(r'd:\OneDrive\Desktop\Deviathon\Deviathon\family_circle_modal_screenshot.png', 'wb') as f:
            f.write(img_data)
        print("9. Screenshot saved to family_circle_modal_screenshot.png!")

        print("\n==========================================")
        print("FAMILY CARE CIRCLE TASKBAR: 100% VERIFIED!")
        print("==========================================")

    finally:
        p.terminate()

asyncio.run(test_care_circle())

