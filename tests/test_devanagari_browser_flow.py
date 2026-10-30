# -*- coding: utf-8 -*-
"""
End-to-End Browser Verification for Devanagari Hindi Voice Input, Separate Badges,
Auto-detected Age/Gender, and Retrained ML Risk Inference.
"""

import subprocess
import urllib.request
import json
import asyncio
import base64
import time
import sys
import os

sys.stdout.reconfigure(encoding='utf-8')

async def run_browser_verification():
    print("Launching headless Chrome on port 9230...")
    p = subprocess.Popen([
        r'C:\Program Files\Google\Chrome\Application\chrome.exe',
        '--headless=new',
        '--remote-debugging-port=9230',
        '--window-size=1440,1100',
        'http://127.0.0.1:5000/'
    ])
    await asyncio.sleep(2.5)

    try:
        import websockets
        tabs = json.loads(urllib.request.urlopen('http://127.0.0.1:9230/json').read())
        target = [t for t in tabs if t.get('type') == 'page'][0]
        ws = await websockets.connect(target['webSocketDebuggerUrl'])

        async def send_cmd(method, params=None):
            msg_id = int(time.time() * 1000) % 100000
            await ws.send(json.dumps({'id': msg_id, 'method': method, 'params': params or {}}))
            while True:
                resp = json.loads(await ws.recv())
                if resp.get('id') == msg_id:
                    return resp

        await send_cmd('Runtime.enable')

        # 1. Switch to Senior Portal and reset form to test empty badge state
        print("1. Entering Senior Dashboard and resetting to blank form state...")
        await send_cmd('Runtime.evaluate', {'expression': "enterDashboard('senior')"})
        await asyncio.sleep(0.5)
        await send_cmd('Runtime.evaluate', {'expression': "window.__resetCumulativeVoiceState()"})
        await asyncio.sleep(0.5)

        # 2. Check initial status of Age and Gender badges, and presence of separated badges
        print("2. Checking status of Age, Gender, Height, Weight, BP, HR, SpO2...")
        badges_audit = await send_cmd('Runtime.evaluate', {
            'expression': """
            (() => {
                const getBadge = (id) => {
                    const el = document.getElementById(id);
                    if (!el) return null;
                    const style = window.getComputedStyle(el);
                    return {
                        id: id,
                        className: el.className,
                        text: el.innerText.replace(/\\s+/g, ' ').trim(),
                        statusSpan: el.querySelector('.badge-tag-status')?.innerText.trim(),
                        bg: style.backgroundColor,
                        color: style.color
                    };
                };

                return {
                    age: getBadge('badge-chk-age'),
                    gender: getBadge('badge-chk-gender'),
                    height: getBadge('badge-chk-height'),
                    weight: getBadge('badge-chk-weight'),
                    bp: getBadge('badge-chk-bp'),
                    hr: getBadge('badge-chk-hr'),
                    spo2: getBadge('badge-chk-spo2')
                };
            })()
            """,
            'returnByValue': True
        })
        audit1 = badges_audit['result']['result']['value']
        print("Badges after reset:")
        print(f"  Age: {audit1['age']['text']} (Class: {audit1['age']['className']}, BG: {audit1['age']['bg']})")
        print(f"  Gender: {audit1['gender']['text']} (Class: {audit1['gender']['className']}, BG: {audit1['gender']['bg']})")
        print(f"  Height: {audit1['height']['text']} (Class: {audit1['height']['className']})")
        print(f"  Weight: {audit1['weight']['text']} (Class: {audit1['weight']['className']})")
        print(f"  BP: {audit1['bp']['text']} (Class: {audit1['bp']['className']})")
        print(f"  Pulse/HR: {audit1['hr']['text']} (Class: {audit1['hr']['className']})")
        print(f"  SpO2: {audit1['spo2']['text']} (Class: {audit1['spo2']['className']})")

        assert 'status-provided' in audit1['age']['className'], "Age must be status-provided (green)"
        assert 'status-provided' in audit1['gender']['className'], "Gender must be status-provided (green)"
        assert 'status-missing' in audit1['height']['className'], "Height after reset must be status-missing"
        assert 'status-missing' in audit1['weight']['className'], "Weight after reset must be status-missing"

        # 3. Simulate pure Devanagari Hindi Voice Speech
        print("\n3. Simulating pure Devanagari Hindi voice input through full API & client loop...")
        hindi_phrase = (
            "मेरा वजन अड़सठ किलो है और लंबाई एक सौ पैंसठ सेंटीमीटर है। "
            "रक्तचाप एक सौ चालीस और पचासी है, धड़कन अठहत्तर है, ऑक्सीजन ९७ प्रतिशत है। "
            "मुझे घुटने में दर्द है और दर्द का पैमाना पांच है। "
            "नींद सात घंटे आती है। "
            "मैं बिना सहारे खुद चल लेता हूँ, खाना खुद खा लेता हूँ, बिस्तर से अपने आप उठ जाता हूँ, और शौचालय खुद चला जाता हूँ। "
            "दिन में तीन दवाइयां लेता हूँ और कोई खुराक नहीं छूटी। "
            "मुझे मधुमेह नहीं है और शुगर एक सौ चालीस है। "
            "सुनने में कोई दिक्कत नहीं है बिल्कुल सामान्य सुनता हूँ। "
            "मुझे उच्च रक्तचाप और गठिया की बीमारी है।"
        )

        sim_res = await send_cmd('Runtime.evaluate', {
            'expression': f"""
            (async () => {{
                await processTranscriptWithNLP({json.dumps(hindi_phrase)});
                return true;
            }})()
            """,
            'awaitPromise': True,
            'returnByValue': True
        })
        print("Simulation called successfully!")

        await asyncio.sleep(1.0)

        # 4. Audit Badges After Devanagari Speech Input
        print("\n4. Auditing checklist badges after Devanagari Hindi speech...")
        audit2_res = await send_cmd('Runtime.evaluate', {
            'expression': """
            (() => {
                const keys = ['age', 'gender', 'height', 'weight', 'bp', 'hr', 'spo2', 'pain', 'sleep', 'adl-walk', 'adl-eat', 'adl-move', 'adl-toilet', 'meds', 'sugar', 'hearing', 'diseases'];
                const res = {};
                keys.forEach(k => {
                    const el = document.getElementById(`badge-chk-${k}`);
                    res[k] = el ? {
                        class: el.className,
                        text: el.innerText.replace(/\\s+/g, ' ').trim()
                    } : null;
                });
                return res;
            })()
            """,
            'returnByValue': True
        })
        badges_after = audit2_res['result']['result']['value']
        for k, b in badges_after.items():
            print(f"  {k}: {b['text']} -> {b['class']}")
            assert 'status-provided' in b['class'], f"Badge {k} should be status-provided (green), got {b['class']}"

        print("\n>>> ALL 17 CHECKLIST BADGES ARE GREEN!")

        # 5. Run ML Risk Assessment with the retrained models
        print("\n5. Triggering predictElderRiskAssessment()...")
        pred_res = await send_cmd('Runtime.evaluate', {
            'expression': """
            (async () => {
                await predictElderRiskAssessment();
                const resBox = document.getElementById('assessment-result-box');
                return {
                    visible: !resBox.classList.contains('hidden'),
                    boxText: resBox.innerText.replace(/\\s+/g, ' ').slice(0, 200),
                    lastPrediction: assessmentState?.lastPrediction
                };
            })()
            """,
            'awaitPromise': True,
            'returnByValue': True
        })
        pred_val = pred_res['result']['result']['value']
        print("ML Assessment Prediction Result:")
        print(f"  Box visible: {pred_val['visible']}")
        print(f"  Box preview: {pred_val['boxText']}")
        print(f"  Predicted Risk: {pred_val['lastPrediction'].get('predicted_risk_level')}")
        print(f"  Health Score: {pred_val['lastPrediction'].get('health_score')}")
        print(f"  Telemetry: {pred_val['lastPrediction'].get('models_telemetry')}")

        assert pred_val['visible'] is True, "Result box should be visible"
        assert pred_val['lastPrediction'] is not None, "Last prediction must exist"

        # 6. Take Screenshot of the full UI showing all green badges & assessment result
        print("\n6. Capturing screenshot...")
        screenshot_data = await send_cmd('Page.captureScreenshot', {'format': 'png'})
        img_bytes = base64.b64decode(screenshot_data['result']['data'])
        
        artifact_path = r'C:\Users\DELL\.gemini\antigravity\brain\60fdf384-9a93-43ee-8ae3-0c467a8809e6\screenshot_devanagari_all_green_ml_result.png'
        with open(artifact_path, 'wb') as f:
            f.write(img_bytes)
        print(f"Screenshot saved to {artifact_path}")

        workspace_shot = r'd:\OneDrive\Desktop\Deviathon\screenshots\screenshot_devanagari_all_green_ml_result.png'
        with open(workspace_shot, 'wb') as f:
            f.write(img_bytes)
        print(f"Screenshot also saved to {workspace_shot}")

        print("\n=======================================================")
        print("ALL END-TO-END DEVANAGARI NLP & ML TESTS PASSED 100%!")
        print("=======================================================")

    finally:
        p.kill()

if __name__ == "__main__":
    asyncio.run(run_browser_verification())
