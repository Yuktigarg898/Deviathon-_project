import subprocess, urllib.request, json, asyncio, websockets, time, sys, base64

sys.stdout.reconfigure(encoding='utf-8')

async def test_report_sheet():
    print("Launching headless Chrome for Clinical Report Sheet verification...")
    p = subprocess.Popen([
        r'C:\Program Files\Google\Chrome\Application\chrome.exe',
        '--headless=new',
        '--remote-debugging-port=9260',
        '--window-size=1440,1200',
        'http://127.0.0.1:5000/'
    ])
    await asyncio.sleep(2.5)
    
    try:
        tabs = json.loads(urllib.request.urlopen('http://127.0.0.1:9260/json').read())
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
            res = await call_method('Runtime.evaluate', {'expression': expr, 'returnByValue': True, 'awaitPromise': True})
            return res.get('result', {}).get('result', {}).get('value')

        await call_method('Runtime.enable')
        await call_method('Page.enable')

        # 1. Compile check
        with open('app.js', 'r', encoding='utf-8') as f:
            code = f.read()

        comp = await call_method('Runtime.compileScript', {
            'expression': code,
            'sourceURL': 'app.js',
            'persistScript': True
        })
        assert 'exceptionDetails' not in comp.get('result', {}), f"Compilation error: {comp}"
        print("PASS 1: app.js compiled cleanly with zero syntax errors!")

        # 2. Enter Senior Portal
        await eval_js("enterDashboard('senior')")
        await asyncio.sleep(0.5)

        # 3. Fill and submit AI Health Assessment
        print("Filling assessment inputs & triggering predictElderRiskAssessment()...")
        await eval_js("""
            (() => {
                document.getElementById('assess-bp-sys').value = 155;
                document.getElementById('assess-bp-dia').value = 95;
                document.getElementById('assess-hr').value = 88;
                document.getElementById('assess-spo2').value = 96;
                document.getElementById('assess-sleep').value = 5.0;
                document.getElementById('assess-sugar').value = 168;
                document.getElementById('chk-htn').checked = true;
                document.getElementById('chk-arth').checked = true;
                setPainPresent(true);
                updatePainSlider(4);
            })()
        """)
        
        # Call and await promise
        await eval_js("predictElderRiskAssessment()")
        
        # Wait until result box is visible
        result_visible = False
        for _ in range(25):
            await asyncio.sleep(0.2)
            result_visible = await eval_js("!document.getElementById('assessment-result-box').classList.contains('hidden')")
            if result_visible:
                break

        print(f"PASS 2: Assessment result card visible: {result_visible}")
        assert result_visible == True, "Result box must be visible after assessment"

        # Check that the separate PDF Print button is REMOVED from the result box!
        separate_print_exists = await eval_js("""
            (() => {
                const btns = Array.from(document.querySelectorAll('#assessment-result-box button'));
                return btns.some(b => b.innerText.includes('प्रिंट / PDF') || b.innerText.includes('Print / PDF'));
            })()
        """)
        print(f"PASS 3: Separate Print / PDF button successfully removed: {not separate_print_exists}")
        assert separate_print_exists == False, "Separate Print / PDF button must NOT be present in result box"

        # Check that the View Clinical Report Sheet button IS present in the result box
        sheet_btn_exists = await eval_js("""
            (() => {
                const btns = Array.from(document.querySelectorAll('#assessment-result-box button'));
                return btns.some(b => b.innerText.includes('रिपोर्ट शीट') || b.innerText.includes('Report Sheet'));
            })()
        """)
        print(f"PASS 4: 'View Clinical Report Sheet' button present: {sheet_btn_exists}")
        assert sheet_btn_exists == True, "View Clinical Report Sheet button must be rendered"

        # 4. Open the Clinical Report Sheet Modal
        await eval_js("openClinicalReportSheet()")
        await asyncio.sleep(0.5)

        modal_open = await eval_js("!document.getElementById('modal-clinical-report-sheet').classList.contains('hidden')")
        print(f"PASS 5: Clinical Report Sheet Modal is open: {modal_open}")
        assert modal_open == True, "Modal must be visible when openClinicalReportSheet is called"

        # Verify sections inside the sheet
        sheet_text = await eval_js("document.getElementById('clinical-report-sheet-content').innerText")
        has_patient = 'Ramesh Sharma' in sheet_text
        has_bp = '155 / 95 mmHg' in sheet_text
        has_glucose = '168 mg/dL' in sheet_text
        has_nurse = 'Sister Kavita Verma' in sheet_text
        print(f"PASS 6: Report Sheet Content verified -> Patient: {has_patient}, BP 155/95: {has_bp}, Glucose 168: {has_glucose}, Nurse: {has_nurse}")
        assert has_patient and has_bp and has_glucose and has_nurse, "All required report sections must be present"

        # Close modal test
        await eval_js("closeClinicalReportSheet()")
        await asyncio.sleep(0.3)
        modal_closed = await eval_js("document.getElementById('modal-clinical-report-sheet').classList.contains('hidden')")
        print(f"PASS 7: Modal closed cleanly: {modal_closed}")
        assert modal_closed == True, "Modal must be hidden after close"

        print("\nALL RERUN TESTS PASSED WITH 100% SUCCESS!")

    finally:
        p.terminate()

if __name__ == '__main__':
    asyncio.run(test_report_sheet())
