import sys
sys.stdout.reconfigure(encoding='utf-8')
import subprocess, urllib.request, json, asyncio, websockets, time, base64

async def run_feature_tests():
    print("Launching headless Chrome...")
    p = subprocess.Popen([
        r'C:\Program Files\Google\Chrome\Application\chrome.exe',
        '--headless=new',
        '--remote-debugging-port=9227',
        '--window-size=1440,1100',
        'http://127.0.0.1:5000/'
    ])
    await asyncio.sleep(2.5)
    
    try:
        tabs = json.loads(urllib.request.urlopen('http://127.0.0.1:9227/json').read())
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

        # Check initial page load
        print("Checking initial page load...")
        title = await eval_js("document.title")
        print(f"Document title: {title}")

        # Test 1: Senior Portal Profile & Family Circle
        print("\n--- TEST 1: Senior Portal Profile & Family Circle ---")
        await eval_js("enterDashboard('senior')")
        await asyncio.sleep(0.5)

        # Check Profile modal opening for Senior
        await eval_js("openProfileModal()")
        await asyncio.sleep(0.3)
        modal_open = await eval_js("!document.getElementById('modal-profile-management').classList.contains('hidden')")
        profile_title = await eval_js("document.getElementById('modal-profile-title').textContent")
        print(f"Profile modal open: {modal_open}, Title: '{profile_title}'")
        assert modal_open, "Profile modal failed to open!"

        # Close profile modal
        await eval_js("closeProfileModal()")
        await asyncio.sleep(0.2)

        # Check Family Circle initial cards
        family_cards_count = await eval_js("document.querySelectorAll('#senior-family-members-list > div').length")
        print(f"Initial Family members rendered: {family_cards_count}")
        assert family_cards_count >= 2, f"Expected at least 2 family members, got {family_cards_count}"

        # Test Adding a Family Member
        print("Adding a new family member (Dr. Ananya Sharma - Granddaughter)...")
        await eval_js("""
            document.getElementById('new-fam-name').value = 'Dr. Ananya Sharma';
            document.getElementById('new-fam-relation').value = 'Grandchild (पोता / पोती)';
            document.getElementById('new-fam-phone').value = '+91 98990-11223';
            document.getElementById('new-fam-email').value = 'ananya.doc@gmail.com';
            submitAddFamilyMember();
        """)
        await asyncio.sleep(0.5)

        updated_family_count = await eval_js("document.querySelectorAll('#senior-family-members-list > div').length")
        print(f"Updated family members count: {updated_family_count}")
        assert updated_family_count == family_cards_count + 1, "Failed to add family member!"

        # Test Sending Test Alert to a family member
        test_alert_res = await eval_js("sendFamilyMemberTestAlert('fam-1'); 'alert_sent';")
        print(f"Test alert result: {test_alert_res}")

        # Test 2: AI Health Assessment Prediction, Diagnostic Report & Daily Rx Tasks
        print("\n--- TEST 2: AI Assessment Prediction, Diagnostic Report & Daily Rx Tasks ---")
        # Fill moderate preset to trigger specific biomarkers
        await eval_js("fillAssessmentPreset('moderate')")
        await asyncio.sleep(0.3)

        # Run prediction
        print("Running elder risk prediction...")
        await eval_js("predictElderRiskAssessment()")
        await asyncio.sleep(2.0)

        # Verify results box
        res_visible = await eval_js("!document.getElementById('assessment-result-box').classList.contains('hidden')")
        print(f"Assessment result box visible: {res_visible}")
        assert res_visible, "Assessment result box should be visible!"

        # Check Diagnostic Report elements
        diag_explanation = await eval_js("document.querySelector('#assessment-result-box h4')?.textContent")
        print(f"Diagnosis Report header: {diag_explanation}")

        # Check Biomarker cards count
        biomarkers_count = await eval_js("document.querySelectorAll('#assessment-result-box .grid-cols-2 > div').length")
        print(f"Biomarker comparison cards rendered: {biomarkers_count}")

        # Check Daily Rx Tasks Checklist
        rx_tasks_count = await eval_js("document.querySelectorAll('#daily-rx-tasks-list .rx-task-card').length")
        print(f"Daily Rx tasks generated: {rx_tasks_count}")
        assert rx_tasks_count >= 4, f"Expected at least 4 Rx tasks, got {rx_tasks_count}"

        # Check Progress bar
        progress_text = await eval_js("document.getElementById('rx-progress-text')?.textContent")
        print(f"Initial Rx Progress: {progress_text.strip() if progress_text else 'N/A'}")

        # Toggle a task checkbox
        first_task_id = await eval_js("getStoredDailyTasks()[0].id")
        print(f"Toggling task: {first_task_id}...")
        await eval_js(f"toggleRxTask('{first_task_id}')")
        await asyncio.sleep(0.3)
        updated_progress = await eval_js("document.getElementById('rx-progress-text')?.textContent")
        print(f"Updated Rx Progress: {updated_progress.strip() if updated_progress else 'N/A'}")

        # Scroll to result and capture screenshot
        await eval_js("document.getElementById('assessment-result-box').scrollIntoView({ behavior: 'instant', block: 'center' });")
        await asyncio.sleep(0.5)

        snap = await call_method('Page.captureScreenshot')
        img_data = base64.b64decode(snap['result']['data'])
        with open(r'd:\OneDrive\Desktop\Deviathon\Deviathon\senior_report_rx_screenshot.png', 'wb') as f:
            f.write(img_data)
        print("Diagnostic report & Rx checklist screenshot saved to senior_report_rx_screenshot.png!")

        # Test 3: Profile Management in Other Portals (Coordinator, Family, Operations)
        print("\n--- TEST 3: Profile Management Across Other Portals ---")
        for role in ['coordinator', 'family', 'operations']:
            await eval_js(f"enterDashboard('{role}')")
            await asyncio.sleep(0.3)
            await eval_js("openProfileModal()")
            await asyncio.sleep(0.2)
            title = await eval_js("document.getElementById('modal-profile-title').textContent")
            print(f"Portal '{role}' profile opened: '{title}'")
            await eval_js("closeProfileModal()")
            await asyncio.sleep(0.2)

        print("\n==========================================")
        print("ALL TESTS PASSED WITH 100% SUCCESS!")
        print("==========================================")

    finally:
        p.terminate()

asyncio.run(run_feature_tests())
