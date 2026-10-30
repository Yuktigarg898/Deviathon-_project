import subprocess, urllib.request, json, asyncio, websockets, time, sys, base64, tempfile, shutil

sys.stdout.reconfigure(encoding='utf-8')

async def test_coordinator_hub():
    print("Launching headless Chrome to test Care Coordinator ML Triage, Operator Assignment & Proofs Verification Hub...")
    temp_dir = tempfile.mkdtemp()
    p = subprocess.Popen([
        r'C:\Program Files\Google\Chrome\Application\chrome.exe',
        '--headless=new',
        '--remote-debugging-port=9295',
        f'--user-data-dir={temp_dir}',
        '--disable-extensions',
        '--window-size=1440,1100',
        'http://127.0.0.1:5000/'
    ])
    await asyncio.sleep(2.5)
    
    try:
        tabs = json.loads(urllib.request.urlopen('http://127.0.0.1:9295/json').read().decode())
        target_tab = None
        for t in tabs:
            if '127.0.0.1:5000' in t.get('url', ''):
                target_tab = t
                break
        if not target_tab:
            target_tab = tabs[0]
            
        target_ws = target_tab['webSocketDebuggerUrl']
        print(f"Connected to CareConnect tab WebSocket: {target_ws}")

        async with websockets.connect(target_ws, max_size=50*1024*1024) as ws:
            msg_id = 1
            async def send_cmd(method, params=None):
                nonlocal msg_id
                cid = msg_id
                msg_id += 1
                await ws.send(json.dumps({'id': cid, 'method': method, 'params': params or {}}))
                while True:
                    res = json.loads(await ws.recv())
                    if res.get('id') == cid:
                        return res.get('result', {})

            async def eval_js(expression):
                res = await send_cmd('Runtime.evaluate', {
                    'expression': expression,
                    'returnByValue': True,
                    'awaitPromise': True
                })
                return res.get('result', {}).get('value')

            async def capture_screenshot(filename):
                res = await send_cmd('Page.captureScreenshot', {'format': 'png'})
                img_data = base64.b64decode(res['data'])
                with open(filename, 'wb') as f:
                    f.write(img_data)
                print(f"  [SCREENSHOT SAVED]: {filename}")

            await send_cmd('Page.enable')
            await asyncio.sleep(1.5)

            # 1. Check body text for git conflict markers or [object Object]
            body_text = await eval_js("document.body.innerText")
            assert "<<<<<<<" not in body_text, "Found git marker in body!"
            assert "Updated upstream" not in body_text, "Found Updated upstream in body!"
            assert ">>>>>>>" not in body_text, "Found git marker in body!"
            assert "[object Object]" not in body_text, "Found [object Object] in body!"
            print("  [CHECK 1 PASSED] 0 git conflict markers, 0 [object Object] in DOM.")

            # 2. Navigate to Care Coordinator Portal
            print("Navigating to Care Coordinator Portal via enterDashboard('coordinator')...")
            await eval_js("enterDashboard('coordinator')")
            await asyncio.sleep(1.0)

            # Verify coordinator view is visible
            is_coord_visible = await eval_js("!document.getElementById('view-coordinator').classList.contains('hidden')")
            print(f"  [CHECK 2] Coordinator view visible: {is_coord_visible}")
            assert is_coord_visible, "Coordinator view should be visible!"

            # 3. Verify ML Risk Stratification Chart metrics
            high_count = await eval_js("document.getElementById('coord-stat-high-count').innerText")
            high_pct = await eval_js("document.getElementById('coord-stat-high-pct').innerText")
            med_count = await eval_js("document.getElementById('coord-stat-med-count').innerText")
            med_pct = await eval_js("document.getElementById('coord-stat-med-pct').innerText")
            low_count = await eval_js("document.getElementById('coord-stat-low-count').innerText")
            low_pct = await eval_js("document.getElementById('coord-stat-low-pct').innerText")
            
            print(f"  [CHECK 3] ML Risk Chart Metrics: High={high_count} ({high_pct}), Med={med_count} ({med_pct}), Low={low_count} ({low_pct})")
            assert "3" in high_count and "30%" in high_pct, f"Expected 3 (30%) High Risk, got {high_count} ({high_pct})"
            assert "4" in med_count and "40%" in med_pct, f"Expected 4 (40%) Med Risk, got {med_count} ({med_pct})"
            assert "3" in low_count and "30%" in low_pct, f"Expected 3 (30%) Low Risk, got {low_count} ({low_pct})"

            # 4. Verify Seniors Queue is Sorted High to Low Risk
            seniors_count = await eval_js("document.querySelectorAll('#coordinator-alert-list > div').length")
            first_senior_name = await eval_js("document.querySelector('#coordinator-alert-list > div:first-child h3').innerText")
            print(f"  [CHECK 4] Seniors rendered: {seniors_count}. Highest Risk Senior: {first_senior_name}")
            assert seniors_count == 10, f"Expected 10 seniors, found {seniors_count}"
            assert "Ramesh Sharma" in first_senior_name, f"Expected Ramesh Sharma first (highest risk), got {first_senior_name}"

            # Verify strictly descending ML risk scores across all 10 cards
            scores = await eval_js("""
                (() => {
                    const cards = Array.from(document.querySelectorAll('#coordinator-alert-list > div'));
                    return cards.map(c => {
                        const m = c.innerText.match(/(\\d+)%\\s*(?:ML\\s*Risk|Risk)/i);
                        return m ? parseInt(m[1]) : null;
                    }).filter(x => x !== null);
                })()
            """)
            print(f"  [CHECK 4b] ML Risk Scores extracted in order: {scores}")
            for i in range(len(scores)-1):
                assert scores[i] >= scores[i+1], f"Scores not strictly descending! {scores[i]} < {scores[i+1]} at index {i}"
            print("  [CHECK 4 PASSED] All 10 seniors are sorted strictly High to Low risk!")

            await capture_screenshot("screenshot_coordinator_ml_chart.png")

            # 5. Test Risk Filter Pills
            print("Testing Risk Filters (High, Medium, Low)...")
            await eval_js("filterCoordinatorByRisk('high')")
            await asyncio.sleep(0.3)
            high_visible = await eval_js("document.querySelectorAll('#coordinator-alert-list > div:not(.hidden)').length")
            print(f"  Filtered High Risk Seniors count: {high_visible} (Expected: 3)")
            assert high_visible == 3, f"Expected 3 high risk seniors, got {high_visible}"

            await eval_js("filterCoordinatorByRisk('all')")
            await asyncio.sleep(0.3)

            # 6. Test Assign Operator Modal for High Risk Senior Ramesh Sharma
            print("Opening Operator Assignment Modal for Ramesh Sharma...")
            await eval_js("openAssignOperatorModal('SNR-101')")
            await asyncio.sleep(0.5)

            modal_visible = await eval_js("!document.getElementById('modal-coord-assign-operator').classList.contains('hidden')")
            target_senior_text = await eval_js("document.getElementById('assign-modal-senior-name').innerText")
            target_family_text = await eval_js("document.getElementById('assign-modal-family-info').innerText")
            print(f"  [CHECK 6] Assign Operator Modal visible: {modal_visible}")
            print(f"  Target Senior: {target_senior_text}")
            print(f"  Target Family: {target_family_text}")
            assert modal_visible, "Assign modal should be visible"
            assert "Ramesh Sharma" in target_senior_text, "Target senior should be Ramesh Sharma"
            assert "Rahul Sharma" in target_family_text, "Family contact should be Rahul Sharma"

            await capture_screenshot("screenshot_coordinator_assign_operator.png")

            # 7. Dispatch Operator Assignment
            print("Dispatching Sister Kavita for urgent doorstep home visit & family call...")
            await eval_js("""
                (() => {
                    document.getElementById('assign-operator-select').value = 'Sister Kavita, RN (Lead Emergency Care)';
                    document.getElementById('assign-deadline-select').value = 'URGENT (2 Hours SLA)';
                    document.getElementById('assign-instructions-text').value = 'Cardiac telemetry anomaly detected. Measure BP, SpO2, blood sugar and secure family signature.';
                    handleDispatchOperatorAssignment(new Event('submit'));
                })()
            """)
            await asyncio.sleep(1.0)

            # Modal should be closed now
            modal_closed = await eval_js("document.getElementById('modal-coord-assign-operator').classList.contains('hidden')")
            print(f"  Assign modal closed after submit: {modal_closed}")
            assert modal_closed, "Assign modal should be closed after submit"

            # 8. Switch to Tab 2: Complaints & Field Tasks Fulfillment Record
            print("Switching to Tab 2: Complaints & Field Tasks Fulfillment Record...")
            await eval_js("switchCoordinatorViewTab('tasks')")
            await asyncio.sleep(0.6)

            tasks_count = await eval_js("document.querySelectorAll('#coordinator-tasks-record-list > div').length")
            print(f"  [CHECK 8] Total Tasks & Complaints in Record: {tasks_count}")
            assert tasks_count >= 6, f"Expected at least 6 tasks in record, got {tasks_count}"

            first_task_title = await eval_js("document.querySelector('#coordinator-tasks-record-list > div:first-child h4').innerText")
            print(f"  First Task in Record: {first_task_title}")

            await capture_screenshot("screenshot_coordinator_tasks_record.png")

            # 9. Test Proofs Checking System
            print("Opening Proofs Verification Dialog for Task with Submitted Proofs...")
            await eval_js("openVerifyProofModal('TSK-501')")
            await asyncio.sleep(0.5)

            proof_modal_visible = await eval_js("!document.getElementById('modal-verify-proof').classList.contains('hidden')")
            print(f"  [CHECK 9] Proofs Verification Modal Visible: {proof_modal_visible}")
            assert proof_modal_visible, "Proof verification modal should be open"

            # Inspect proof components inside dialog:
            has_photo = await eval_js("document.getElementById('proof-photo-img').src.length > 5")
            has_gps = await eval_js("document.getElementById('proof-watermark-gps').innerText.length > 5")
            has_sig = await eval_js("document.getElementById('proof-family-sign-name').innerText.length > 3")
            has_vitals = await eval_js("document.getElementById('proof-vitals-bp').innerText.length > 2")
            print(f"  Proof Checklist: Photo={has_photo}, GPS={has_gps}, Signature/OTP={has_sig}, Vitals={has_vitals}")
            assert has_photo, "Proof photo missing"
            assert has_gps, "GPS watermark missing"
            assert has_sig, "Digital signature / OTP confirmation missing"
            assert has_vitals, "On-site recorded vitals missing"

            await capture_screenshot("screenshot_coordinator_proofs_checking.png")

            # 10. Click Coordinator "Approve Proof & Mark Fulfilled"
            print("Coordinator Approving Proof...")
            await eval_js("approveTaskProof()")
            await asyncio.sleep(0.6)

            # Check that TSK-501 now has status 'fulfilled'
            task1_status = await eval_js("""
                (() => {
                    const task = getCoordinatorTasks().find(t => t.id === 'TSK-501');
                    return task ? task.status : null;
                })()
            """)
            print(f"  TSK-501 status after Coordinator Approval: {task1_status}")
            assert task1_status == 'fulfilled', f"Expected status 'fulfilled', got {task1_status}"

            # 11. Test Reject Proof flow
            print("Testing Reject Proof for re-visit flow...")
            await eval_js("openVerifyProofModal('TSK-502')")
            await asyncio.sleep(0.5)
            await eval_js("rejectTaskProof()")
            await asyncio.sleep(0.6)

            task2_status = await eval_js("""
                (() => {
                    const task = getCoordinatorTasks().find(t => t.id === 'TSK-502');
                    return task ? task.status : null;
                })()
            """)
            print(f"  TSK-502 status after Coordinator Rejection: {task2_status}")
            assert task2_status == 'assigned', f"Expected status 'assigned' for re-visit, got {task2_status}"

            # 12. Filter by Fulfilled Status
            await eval_js("filterTasksByStatus('fulfilled')")
            await asyncio.sleep(0.3)
            fulfilled_visible = await eval_js("document.querySelectorAll('#coordinator-tasks-record-list > div:not(.hidden)').length")
            print(f"  Fulfilled & Verified Tasks Count: {fulfilled_visible}")
            assert fulfilled_visible >= 3, f"Expected at least 3 fulfilled tasks, got {fulfilled_visible}"

            await capture_screenshot("screenshot_coordinator_fulfilled_tasks.png")

            print("\n=======================================================")
            print("ALL CARE COORDINATOR ML & PROOFS CHECKING TESTS PASSED!")
            print("=======================================================")

    finally:
        p.terminate()
        try:
            shutil.rmtree(temp_dir, ignore_errors=True)
        except:
            pass

if __name__ == '__main__':
    asyncio.run(test_coordinator_hub())
