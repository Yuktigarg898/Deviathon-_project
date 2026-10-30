import subprocess, urllib.request, json, asyncio, websockets, time, sys, base64
sys.stdout.reconfigure(encoding='utf-8')

async def test_taskbar_actions():
    print("Launching headless Chrome...")
    p = subprocess.Popen([
        r'C:\Program Files\Google\Chrome\Application\chrome.exe',
        '--headless=new',
        '--remote-debugging-port=9231',
        '--window-size=1440,1100',
        'http://127.0.0.1:5000/'
    ])
    await asyncio.sleep(2.0)
    
    try:
        tabs = json.loads(urllib.request.urlopen('http://127.0.0.1:9231/json').read())
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

        # 1. Check syntax compilation of app.js
        with open('app.js', 'r', encoding='utf-8') as f:
            code = f.read()

        comp = await call_method('Runtime.compileScript', {
            'expression': code,
            'sourceURL': 'app.js',
            'persistScript': True
        })
        assert 'exceptionDetails' not in comp.get('result', {}), f"Compilation error in app.js: {comp}"
        print("1. app.js syntax compiled cleanly!")

        # 2. Enter Senior Portal
        await eval_js("enterDashboard('senior')")
        await asyncio.sleep(0.5)

        # 3. Check presence of Top Taskbar SOS button in Global Header
        header_sos_exists = await eval_js("Boolean(document.getElementById('header-sos-btn'))")
        header_add_fam_exists = await eval_js("Boolean(document.getElementById('header-add-family-btn'))")
        print(f"2. Global Header SOS button exists: {header_sos_exists}")
        print(f"3. Global Header Add Family button exists: {header_add_fam_exists}")
        assert header_sos_exists, "Global header SOS button missing!"
        assert header_add_fam_exists, "Global header Add Family button missing!"

        # 4. Click Top Header Add Family Member button
        print("4. Testing click on Top Header Add Family Member button...")
        await eval_js("document.getElementById('header-add-family-btn').click()")
        await asyncio.sleep(0.3)
        modal_open = await eval_js("!document.getElementById('modal-add-family-member').classList.contains('hidden')")
        print(f"   Add Family Modal open: {modal_open}")
        assert modal_open, "Clicking header Add Family button did not open modal!"
        await eval_js("closeAddFamilyMemberModal()")
        await asyncio.sleep(0.2)

        # 5. Click Top Header Emergency SOS button
        print("5. Testing click on Top Header Emergency SOS button...")
        await eval_js("document.getElementById('header-sos-btn').click()")
        await asyncio.sleep(0.4)
        is_serious = await eval_js("state.seniorStatus.isSerious")
        ramesh_rank = await eval_js("state.alerts.find(a => a.seniorName.includes('Ramesh')).rank")
        print(f"   State isSerious: {is_serious}, Ramesh Alert Priority Rank: {ramesh_rank}")
        assert is_serious is True, "Emergency SOS did not set isSerious!"
        assert ramesh_rank == 1, "Emergency SOS did not promote alert to Rank 1!"

        # 6. Check Senior View Quick Actions Taskbar
        senior_taskbar_exists = await eval_js("Boolean(document.querySelector('#view-senior .bg-gradient-to-r button'))")
        print(f"6. Senior View Quick Actions Taskbar exists: {senior_taskbar_exists}")
        assert senior_taskbar_exists, "Senior View top taskbar buttons missing!"

        # 7. Capture screenshot of top taskbar in Senior View
        snap = await call_method('Page.captureScreenshot')
        img_data = base64.b64decode(snap['result']['data'])
        with open(r'd:\OneDrive\Desktop\Deviathon\Deviathon\top_taskbar_screenshot.png', 'wb') as f:
            f.write(img_data)
        print("7. Screenshot saved to top_taskbar_screenshot.png!")

        print("\n==========================================")
        print("TOP TASKBAR VERIFICATION: 100% PASSED!")
        print("==========================================")

    finally:
        p.terminate()

asyncio.run(test_taskbar_actions())
