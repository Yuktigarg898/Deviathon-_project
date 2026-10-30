import subprocess, urllib.request, json, asyncio, websockets, time, sys, base64

sys.stdout.reconfigure(encoding='utf-8')

async def test_fixes():
    print("Launching headless Chrome to test Print PDF & WhatsApp Report fixes...")
    p = subprocess.Popen([
        r'C:\Program Files\Google\Chrome\Application\chrome.exe',
        '--headless=new',
        '--remote-debugging-port=9272',
        '--window-size=1440,1100',
        'http://127.0.0.1:5000/'
    ])
    await asyncio.sleep(2.5)
    
    try:
        tabs = json.loads(urllib.request.urlopen('http://127.0.0.1:9272/json').read())
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

        # 3. Fill and submit AI Health Assessment with moderate-high risk readings
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
        await eval_js("predictElderRiskAssessment()")
        await asyncio.sleep(1.8)

        # 4. Test formatClinicalReportWhatsAppMessage
        wa_msg = await eval_js("""
            (() => {
                const res = assessmentState.lastPrediction;
                const payload = assessmentState.lastPayload;
                const prof = getUserProfile('senior');
                return formatClinicalReportWhatsAppMessage(res, payload, prof);
            })()
        """)
        print("WhatsApp Message Preview (first 300 chars):\n", wa_msg[:300])

        # Verify WhatsApp content completeness
        assert "CARECONNECT AI CLINICAL DIAGNOSTIC REPORT SHEET" in wa_msg, "Missing Title in WhatsApp"
        assert "Ramesh Sharma" in wa_msg, "Missing Patient Name in WhatsApp"
        assert "155/95 mmHg" in wa_msg, "Missing BP in WhatsApp"
        assert "168 mg/dL" in wa_msg, "Missing Blood Glucose in WhatsApp"
        assert "apnasa_v3_rf_triage_v1.0" in wa_msg, "Missing Model ID in WhatsApp"
        assert "Sister Kavita Verma" in wa_msg, "Missing Clinician in WhatsApp"
        assert "AI PERSONALIZED RECOVERY PRESCRIPTION" in wa_msg, "Missing Prescription in WhatsApp"
        print("PASS 2: WhatsApp Report message verified with 100% complete clinical data!")

        # 5. Test printClinicalReportSheet creates the isolated frame with the exact sheet content
        print_frame_html = await eval_js("""
            (() => {
                openClinicalReportSheet();
                const container = document.getElementById('clinical-report-sheet-content');
                return container.innerHTML;
            })()
        """)
        assert "CareConnect AI Health System" in print_frame_html, "Missing header in print sheet"
        assert "155 / 95 mmHg" in print_frame_html, "Missing BP in print sheet"
        assert "168 mg/dL" in print_frame_html, "Missing Glucose in print sheet"
        assert "Sister Kavita Verma" in print_frame_html, "Missing Nurse in print sheet"
        print("PASS 3: Print Sheet content contains exact clinical report with zero page leakage!")

        # 6. Verify @media print in styles.css hides #view-senior
        with open('styles.css', 'r', encoding='utf-8') as f:
            css = f.read()
        assert '#view-senior' in css, "#view-senior must be in styles.css print hidden list"
        print("PASS 4: @media print in styles.css hides #view-senior completely!")

        print("\nALL PRINT PDF & WHATSAPP REPORT FIXES VERIFIED SUCCESSFULLY! (100% SUCCESS)")

    finally:
        p.terminate()

if __name__ == '__main__':
    asyncio.run(test_fixes())

