import subprocess, urllib.request, json, asyncio, websockets, time, sys, base64, tempfile, shutil

sys.stdout.reconfigure(encoding='utf-8')

async def test_coordinator_workflow():
    print("Launching headless Chrome to test NEW Coordinator Portal (Profile Edit, Assigned Calls, Visits, GPS Tracking & Proof)...")
    temp_dir = tempfile.mkdtemp()
    p = subprocess.Popen([
        r'C:\Program Files\Google\Chrome\Application\chrome.exe',
        '--headless=new',
        '--remote-debugging-port=9285',
        f'--user-data-dir={temp_dir}',
        '--disable-extensions',
        '--window-size=1440,1100',
        'http://127.0.0.1:5000/'
    ])
    await asyncio.sleep(2.5)

    try:
        tabs = json.loads(urllib.request.urlopen('http://127.0.0.1:9285/json').read().decode())
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
                        if 'exceptionDetails' in res.get('result', {}):
                            print("JS EXCEPTION:", json.dumps(res['result']['exceptionDetails']))
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
            await asyncio.sleep(1.0)

            # 1. Enter Coordinator Dashboard
            print("Entering Coordinator Dashboard via enterDashboard('coordinator')...")
            await eval_js("enterDashboard('coordinator')")
            await asyncio.sleep(1.0)

            # Verify coordinator view is visible
            is_coord_visible = await eval_js("!document.getElementById('view-coordinator').classList.contains('hidden')")
            print(f"  [CHECK 1] Coordinator view visible: {is_coord_visible}")
            assert is_coord_visible, "Coordinator view should be visible!"

            # 2. Check Coordinator Profile Banner
            coord_name = await eval_js("document.getElementById('coord-profile-name').innerText")
            coord_zone = await eval_js("document.getElementById('coord-profile-zone').innerText")
            print(f"  [CHECK 2] Coordinator Name: {coord_name} | Zone: {coord_zone}")
            assert "Sister Kavita" in coord_name, "Expected Sister Kavita in coordinator banner"

            await capture_screenshot("screenshot_coord_main_dashboard.png")

            # 3. Test Coordinator Profile Edit
            print("Opening Coordinator Profile Edit Modal...")
            await eval_js("openCoordinatorProfileEditModal()")
            await asyncio.sleep(0.5)

            edit_modal_visible = await eval_js("!document.getElementById('modal-coord-edit-profile').classList.contains('hidden')")
            print(f"  [CHECK 3] Profile Edit Modal visible: {edit_modal_visible}")
            assert edit_modal_visible, "Profile Edit Modal should be open"

            await capture_screenshot("screenshot_coord_edit_profile_modal.png")

            # Update Coordinator Phone & Zone
            await eval_js("""
                (() => {
                    document.getElementById('input-coord-phone').value = '+91 98111-99888';
                    document.getElementById('input-coord-zone').value = 'South Delhi & NCR Cluster (GK, Saket, Hauz Khas)';
                    handleSaveCoordinatorProfile(new Event('submit'));
                })()
            """)
            await asyncio.sleep(0.6)

            updated_phone = await eval_js("document.getElementById('coord-profile-phone').innerText")
            print(f"  [CHECK 3b] Updated Coordinator Phone: {updated_phone}")
            assert "+91 98111-99888" in updated_phone, "Phone should be updated"

            # 4. Check Tele-Care Calls Queue
            calls_count = await eval_js("document.querySelectorAll('#coord-calls-list-container > div').length")
            first_call_patient = await eval_js("document.querySelector('#coord-calls-list-container > div:first-child h4').innerText")
            print(f"  [CHECK 4] Pending Tele-Care Calls Count: {calls_count}. First Patient: {first_call_patient}")
            assert calls_count >= 2, f"Expected at least 2 pending calls, got {calls_count}"
            assert "Meena Iyer" in first_call_patient, f"Expected Meena Iyer first, got {first_call_patient}"

            # 5. Test "View Last Assessment Report" from Tele-Care Call
            print("Opening Meena Iyer's Last Assessment Report from Call Card...")
            await eval_js("openClinicalReportSheet('SNR-104')")
            await asyncio.sleep(0.8)

            sheet_open = await eval_js("!document.getElementById('modal-clinical-report-sheet').classList.contains('hidden')")
            sheet_text = await eval_js("document.getElementById('clinical-report-sheet-content').innerText")
            print(f"  [CHECK 5] Clinical Sheet Open: {sheet_open}")
            assert sheet_open, "Report sheet modal must open"
            assert "Meena Iyer" in sheet_text, "Expected Meena Iyer in report content"
            assert "78" in sheet_text, "Expected 78 ML Risk in report"

            # Close sheet
            await eval_js("closeClinicalReportSheet()")
            await asyncio.sleep(0.3)

            # 6. Test Logging Tele-Care Call
            print("Logging Outreach Call for Meena Iyer (CALL-101)...")
            await eval_js("openLogCallModal('CALL-101')")
            await asyncio.sleep(0.5)

            call_modal_visible = await eval_js("!document.getElementById('modal-coord-log-call').classList.contains('hidden')")
            print(f"  [CHECK 6] Call Log Modal visible: {call_modal_visible}")
            assert call_modal_visible, "Call log modal must open"

            await capture_screenshot("screenshot_coord_log_call_modal.png")

            # Submit call log
            await eval_js("""
                (() => {
                    document.getElementById('call-log-feedback').value = 'Spoke with son Karthik in Bengaluru. Confirmed neighbor Mrs. Gupta visits every evening. Mother feeling cheerful.';
                    document.getElementById('call-log-recommendation').value = 'Continue daily check-in habit and schedule weekend video call.';
                    handleSaveCallLog(new Event('submit'));
                })()
            """)
            await asyncio.sleep(0.8)

            # 7. Switch to Tab 2: Doorstep Physical Visits
            print("Switching to Tab 2: Doorstep Physical Visits...")
            await eval_js("switchCoordinatorTaskTab('visits')")
            await asyncio.sleep(0.5)

            visits_count = await eval_js("document.querySelectorAll('#coord-visits-list-container > div').length")
            first_visit_patient = await eval_js("document.querySelector('#coord-visits-list-container > div:first-child h4').innerText")
            print(f"  [CHECK 7] Pending Doorstep Visits Count: {visits_count}. First Patient: {first_visit_patient}")
            assert visits_count >= 1, f"Expected pending visits, got {visits_count}"
            assert "Ramesh Sharma" in first_visit_patient, f"Expected Ramesh Sharma first, got {first_visit_patient}"

            await capture_screenshot("screenshot_coord_visits_queue.png")

            # 8. Test Doorstep Physical Visit Proof Modal
            print("Opening Doorstep Visit Proof Modal for Ramesh Sharma (VISIT-201)...")
            await eval_js("openSubmitVisitProofModal('VISIT-201')")
            await asyncio.sleep(0.6)

            visit_modal_visible = await eval_js("!document.getElementById('modal-coord-submit-visit-proof').classList.contains('hidden')")
            print(f"  [CHECK 8] Visit Proof Modal visible: {visit_modal_visible}")
            assert visit_modal_visible, "Visit proof modal must open"

            # Auto-detect GPS button test
            await eval_js("autoDetectCoordinatorGPS()")
            await asyncio.sleep(0.5)

            gps_coords = await eval_js("document.getElementById('visit-gps-coords-label').innerText")
            gps_acc = await eval_js("document.getElementById('visit-gps-accuracy-badge').innerText")
            print(f"  [CHECK 8b] Live GPS Logged: {gps_coords} | Accuracy: {gps_acc}")
            assert "° N" in gps_coords, f"Expected coordinates in label, got {gps_coords}"

            await capture_screenshot("screenshot_coord_visit_proof_modal.png")

            # 9. Record Patient Vitals & Condition during Visit
            print("Recording patient vitals (BP, SpO2, Pulse, Sugar) & Condition...")
            await eval_js("""
                (() => {
                    document.getElementById('visit-vital-bp').value = '126/82';
                    document.getElementById('visit-vital-spo2').value = '98';
                    document.getElementById('visit-vital-hr').value = '74';
                    document.getElementById('visit-vital-glucose').value = '112';
                    document.getElementById('visit-vital-temp').value = '98.4';
                    document.getElementById('visit-cond-mobility').value = 'Independent Walking without Support';
                    document.getElementById('visit-cond-mood').value = 'Alert, Calm & Conversational';
                    document.getElementById('visit-cond-meds').value = 'All Prescribed Doses Verified & Taken';
                    document.getElementById('visit-cond-notes').value = 'Visited doorstep at Greater Kailash. Measured physical vitals. Pulse stabilized from 114 bpm to 74 bpm. Patient had glass of electrolyte water with son Rahul present.';
                    handleSaveVisitProof(new Event('submit'));
                })()
            """)
            await asyncio.sleep(1.0)

            visit_modal_closed = await eval_js("document.getElementById('modal-coord-submit-visit-proof').classList.contains('hidden')")
            print(f"  [CHECK 9] Visit Proof Modal closed after submission: {visit_modal_closed}")
            assert visit_modal_closed, "Visit modal should be closed after submit"

            # 10. Switch to Tab 3: Completed & Verified Proofs
            print("Switching to Tab 3: Completed & Verified Proofs Audit...")
            await eval_js("switchCoordinatorTaskTab('fulfilled')")
            await asyncio.sleep(0.5)

            fulfilled_count = await eval_js("document.querySelectorAll('#coord-fulfilled-list-container > div').length")
            print(f"  [CHECK 10] Fulfilled Tasks Count: {fulfilled_count}")
            assert fulfilled_count >= 3, f"Expected at least 3 fulfilled tasks, got {fulfilled_count}"

            await capture_screenshot("screenshot_coord_fulfilled_records.png")

            # 11. Open Verified Proof Audit Modal
            print("Opening Verified Proof Audit for completed visit VISIT-201...")
            await eval_js("openViewProofModal('VISIT-201')")
            await asyncio.sleep(0.6)

            audit_modal_visible = await eval_js("!document.getElementById('modal-coord-view-proof').classList.contains('hidden')")
            audit_bp = await eval_js("document.getElementById('audit-vital-bp').innerText")
            audit_spo2 = await eval_js("document.getElementById('audit-vital-spo2').innerText")
            audit_coords = await eval_js("document.getElementById('audit-proof-coords').innerText")
            audit_notes = await eval_js("document.getElementById('audit-notes-text').innerText")

            print(f"  [CHECK 11] Audit Modal Visible: {audit_modal_visible}")
            print(f"  Audit Vitals: BP={audit_bp}, SpO2={audit_spo2}")
            print(f"  Audit GPS: {audit_coords}")
            print(f"  Audit Notes: {audit_notes}")

            assert audit_modal_visible, "Audit modal must open"
            assert "126/82" in audit_bp, "Expected 126/82 BP in audit"
            assert "98%" in audit_spo2, "Expected 98% SpO2 in audit"
            assert "electrolyte" in audit_notes.lower() or "pulse stabilized" in audit_notes.lower(), "Notes must match"

            await capture_screenshot("screenshot_coord_audit_proof_modal.png")

            # Close audit modal
            await eval_js("closeViewProofModal()")
            await asyncio.sleep(0.3)

            print("\n=======================================================")
            print("ALL CARE COORDINATOR NEW WORKFLOW TESTS PASSED 100%!")
            print("=======================================================")

    finally:
        p.terminate()
        try:
            shutil.rmtree(temp_dir, ignore_errors=True)
        except:
            pass

if __name__ == '__main__':
    asyncio.run(test_coordinator_workflow())

