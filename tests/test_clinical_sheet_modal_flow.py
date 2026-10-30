import subprocess, urllib.request, json, asyncio, websockets, time, sys, base64, tempfile, shutil

sys.stdout.reconfigure(encoding='utf-8')

async def test_clinical_sheet():
    print("Launching headless Chrome to test Coordinator Clinical Sheet & New User integration...")
    temp_dir = tempfile.mkdtemp()
    p = subprocess.Popen([
        r'C:\Program Files\Google\Chrome\Application\chrome.exe',
        '--headless=new',
        '--remote-debugging-port=9298',
        f'--user-data-dir={temp_dir}',
        '--disable-extensions',
        '--window-size=1440,1100',
        'http://127.0.0.1:5000/'
    ])
    await asyncio.sleep(2.5)

    try:
        tabs = json.loads(urllib.request.urlopen('http://127.0.0.1:9298/json').read().decode())
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
            print("Entering Coordinator Dashboard...")
            await eval_js("enterDashboard('coordinator')")
            await asyncio.sleep(0.8)

            # 2. Test Clinical Sheet for Ramesh Sharma (SNR-101)
            print("Opening Clinical Sheet for Ramesh Sharma (SNR-101)...")
            await eval_js("openClinicalReportSheet('SNR-101')")
            await asyncio.sleep(0.8)

            modal_visible = await eval_js("!document.getElementById('modal-clinical-report-sheet').classList.contains('hidden')")
            print(f"  [CHECK 1] Modal visible: {modal_visible}")
            assert modal_visible, "Clinical Sheet Modal should be visible!"

            ramesh_content = await eval_js("document.getElementById('clinical-report-sheet-content').innerText")
            assert "Ramesh Sharma" in ramesh_content, "Expected Ramesh Sharma in report content"
            assert "158" in ramesh_content, "Expected BP 158 in report"
            assert "114" in ramesh_content, "Expected Pulse 114 bpm in report"
            assert "98" in ramesh_content, "Expected 98 ML Risk Score in report"
            assert "Rahul Sharma" in ramesh_content, "Expected Rahul Sharma (Son) in emergency contact"
            print("  [CHECK 1 PASSED] Ramesh Sharma clinical dataset validated on report sheet!")

            await capture_screenshot("screenshot_ramesh_clinical_sheet.png")

            # Close modal
            await eval_js("closeClinicalReportSheet()")
            await asyncio.sleep(0.3)

            # 3. Test Clinical Sheet for Savitri Devi (SNR-102)
            print("Opening Clinical Sheet for Savitri Devi (SNR-102)...")
            await eval_js("openClinicalReportSheet('SNR-102')")
            await asyncio.sleep(0.8)

            savitri_content = await eval_js("document.getElementById('clinical-report-sheet-content').innerText")
            assert "Savitri Devi" in savitri_content, "Expected Savitri Devi in report content"
            assert "92" in savitri_content, "Expected 92 ML Risk Score in report"
            assert "Priya Verma" in savitri_content, "Expected Priya Verma (Daughter) in report"
            assert "Hip" in savitri_content or "Bathroom" in savitri_content, "Expected hip contusion in findings"
            print("  [CHECK 2 PASSED] Savitri Devi clinical dataset validated on report sheet!")

            await capture_screenshot("screenshot_savitri_clinical_sheet.png")

            # Close modal
            await eval_js("closeClinicalReportSheet()")
            await asyncio.sleep(0.3)

            # 4. Test Clinical Sheet for Anand Verma (SNR-103)
            print("Opening Clinical Sheet for Anand Verma (SNR-103)...")
            await eval_js("openClinicalReportSheet('SNR-103')")
            await asyncio.sleep(0.8)

            anand_content = await eval_js("document.getElementById('clinical-report-sheet-content').innerText")
            assert "Anand Verma" in anand_content, "Expected Anand Verma in report content"
            assert "228" in anand_content, "Expected 228 mg/dL blood glucose in report"
            assert "Deepak Verma" in anand_content, "Expected Deepak Verma in emergency contact"
            print("  [CHECK 3 PASSED] Anand Verma clinical dataset validated on report sheet!")

            # Close modal
            await eval_js("closeClinicalReportSheet()")
            await asyncio.sleep(0.3)

            # 5. Test NEW USER Registration and Sheet Generation
            print("Testing Dynamic Sheet Generation for NEW REGISTERED USER (Anil Kapoor)...")
            await eval_js("""
                (() => {
                    const newUserProfile = {
                        name: 'Anil Kapoor',
                        age: 75,
                        gender: 'Male',
                        dob: '1951-08-19',
                        phone: '+91 98990-11223',
                        email: 'anil.kapoor@example.com',
                        address: 'B-12, Sector 15, Noida, UP - 201301',
                        bloodGroup: 'O+',
                        doctor: 'Dr. Alok Mehta, MD (Senior Geriatrician)',
                        allergies: 'None',
                        emergencyContact: 'Sunil Kapoor (Son)',
                        emergencyPhone: '+91 98990-44556',
                        emergencyNotes: 'Sunil Kapoor (Son) • +91 98990-44556',
                        isNewUser: true,
                        profileCompleted: true
                    };
                    localStorage.setItem('careconnect_profile_senior', JSON.stringify(newUserProfile));
                    
                    // Trigger coordinator hub refresh so new user is integrated into queue
                    if (typeof renderCoordinatorHub === 'function') {
                        renderCoordinatorHub();
                    }
                })()
            """)
            await asyncio.sleep(1.0)

            # Verify Anil Kapoor appears in coordinator queue
            alert_list_text = await eval_js("document.getElementById('coordinator-alert-list').innerText")
            print(f"  Is 'Anil Kapoor' in coordinator queue: {'Anil Kapoor' in alert_list_text}")
            assert "Anil Kapoor" in alert_list_text, "Newly registered user Anil Kapoor should appear in triage queue!"

            # Open clinical sheet for the new user
            print("Opening Clinical Sheet for New User Anil Kapoor...")
            await eval_js("openClinicalReportSheet('Anil Kapoor')")
            await asyncio.sleep(0.8)

            new_user_content = await eval_js("document.getElementById('clinical-report-sheet-content').innerText")
            assert "Anil Kapoor" in new_user_content, "Expected Anil Kapoor in new user clinical report"
            assert "75" in new_user_content, "Expected age 75 in report"
            assert "Noida" in new_user_content or "Sector 15" in new_user_content, "Expected address in report"
            assert "Sunil Kapoor" in new_user_content, "Expected emergency contact Sunil Kapoor in report"
            print("  [CHECK 4 PASSED] New User Anil Kapoor clinical report sheet dynamically generated and displayed!")

            await capture_screenshot("screenshot_new_user_clinical_sheet.png")

            # 6. Test Alias openClinicalReportSheetModal
            print("Testing alias openClinicalReportSheetModal('SNR-101')...")
            await eval_js("closeClinicalReportSheet()")
            await asyncio.sleep(0.3)
            await eval_js("openClinicalReportSheetModal('SNR-101')")
            await asyncio.sleep(0.5)
            is_open_again = await eval_js("!document.getElementById('modal-clinical-report-sheet').classList.contains('hidden')")
            assert is_open_again, "openClinicalReportSheetModal alias must open the modal!"
            print("  [CHECK 5 PASSED] openClinicalReportSheetModal alias verified!")

            print("\n=======================================================")
            print("ALL CLINICAL REPORT SHEET & NEW USER TESTS PASSED 100%!")
            print("=======================================================")

    finally:
        p.terminate()
        try:
            shutil.rmtree(temp_dir, ignore_errors=True)
        except:
            pass

if __name__ == '__main__':
    asyncio.run(test_clinical_sheet())
