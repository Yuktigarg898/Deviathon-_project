# -*- coding: utf-8 -*-
import subprocess, urllib.request, json, asyncio, base64

async def main():
    print("Launching headless Chrome on port 9228...")
    p = subprocess.Popen([
        r'C:\Program Files\Google\Chrome\Application\chrome.exe',
        '--headless=new',
        '--remote-debugging-port=9228',
        '--window-size=1440,960',
        'http://127.0.0.1:5000/'
    ])
    await asyncio.sleep(2.5)

    try:
        import websockets
        tabs = json.loads(urllib.request.urlopen('http://127.0.0.1:9228/json').read())
        target = [t for t in tabs if t.get('type') == 'page'][0]
        ws = await websockets.connect(target['webSocketDebuggerUrl'])

        async def send_cmd(method, params=None):
            import time
            msg_id = int(time.time() * 1000) % 100000
            await ws.send(json.dumps({'id': msg_id, 'method': method, 'params': params or {}}))
            while True:
                resp = json.loads(await ws.recv())
                if resp.get('id') == msg_id:
                    return resp

        await send_cmd('Runtime.enable')

        # 1. Switch to Senior Portal
        print("Entering Senior Portal...")
        await send_cmd('Runtime.evaluate', {'expression': "enterDashboard('senior')"})
        await asyncio.sleep(0.5)

        # 2. Reset form to test blank mandatory validation
        print("Resetting form to blank state...")
        await send_cmd('Runtime.evaluate', {'expression': "resetElderAssessmentForm(true)"})
        await asyncio.sleep(0.5)

        # 3. Test validation when mandatory fields are missing
        print("Testing mandatory validation when inputs are missing...")
        val_res_empty = await send_cmd('Runtime.evaluate', {
            'expression': """
            (() => {
                const isValid = validateAssessmentInputsBeforeSubmit();
                const alertEl = document.getElementById('assessment-validation-alert');
                const pills = Array.from(document.querySelectorAll('#assessment-missing-fields-list span')).map(s => s.innerText.trim());
                return {
                    isValid: isValid,
                    alertHidden: alertEl ? alertEl.classList.contains('hidden') : true,
                    missingPillsCount: pills.length,
                    firstThreePills: pills.slice(0, 3)
                };
            })()
            """,
            'returnByValue': True
        })
        v_info = val_res_empty['result']['result']['value']
        print("Validation Result (Empty Form):", json.dumps(v_info, indent=2, ensure_ascii=True))
        assert v_info['isValid'] == False, "Validator must block submission when mandatory inputs are missing!"
        assert v_info['alertHidden'] == False, "Validation alert banner must be visible!"
        assert v_info['missingPillsCount'] > 0, "Missing pills must be populated!"

        # Screenshot of validation alert highlighting missing mandatory fields
        s1 = await send_cmd('Page.captureScreenshot')
        with open('screenshot_mandatory_fields_alert.png', 'wb') as f:
            f.write(base64.b64decode(s1['result']['data']))
        print("Captured screenshot_mandatory_fields_alert.png")

        # 4. Fill all 19 mandatory inputs via natural bilingual Audio/Voice Transcript
        print("Injecting comprehensive voice input with all 19 clinical parameters...")
        transcript = (
            "meri lambai 5 foot 5 inch hai aur vajan 68 kilo hai, "
            "bp 140/85 hai, dhadkan 78 hai, oxygen 97 hai, "
            "ghutne me dard hai level 5, "
            "7 ghante neend aayi, "
            "khud chal leta hu, khana khud kha leta hu, bistar se khud uth jata hu, toilet khud chala jata hu, "
            "3 dawai roz leta hu, subah ki ek goli chhoot gayi thi, "
            "sugar hai aur sugar level 140 hai, "
            "hearing theek hai normal sunta hu, "
            "gathiya aur bp ki bimari hai"
        )

        voice_res = await send_cmd('Runtime.evaluate', {
            'expression': f"""
            (async () => {{
                const res = await fetch('/api/audio/extract-form', {{
                    method: 'POST',
                    headers: {{ 'Content-Type': 'application/json' }},
                    body: JSON.stringify({{ transcript: {json.dumps(transcript)}, language: 'hi-IN', current_entities: cumulativeExtracted }})
                }});
                const json = await res.json();
                applyExtractedEntities(json);
                return json;
            }})()
            """,
            'awaitPromise': True,
            'returnByValue': True
        })
        extracted = voice_res['result']['result']['value']['extracted']
        print("Extracted 19 parameters from voice:\n", json.dumps(extracted, indent=2, ensure_ascii=True))

        assert extracted.get('height') is not None, "Height must be extracted!"
        assert extracted.get('weight') is not None, "Weight must be extracted!"
        assert extracted.get('bp_sys') == 140, "BP Systolic must be 140!"
        assert extracted.get('bp_dia') == 85, "BP Diastolic must be 85!"
        assert extracted.get('heart_rate') == 78, "Heart rate must be 78!"
        assert extracted.get('spo2') == 97.0, "SpO2 must be 97!"
        assert extracted.get('pain_loc') == 'Knee', "Pain location must be Knee!"
        assert extracted.get('pain_level') == 5.0, "Pain level must be 5!"
        assert extracted.get('sleep_hours') == 7.0, "Sleep hours must be 7!"
        assert extracted.get('walk') == 1, "Walk must be 1!"
        assert extracted.get('eat') == 1, "Eat must be 1!"
        assert extracted.get('move') == 1, "Move must be 1!"
        assert extracted.get('toilet') == 1, "Toilet must be 1!"
        assert extracted.get('med_count') == 3, "Med count must be 3!"
        assert extracted.get('missed_doses') == 1, "Missed doses must be 1!"
        assert extracted.get('diabetic') == 1, "Diabetic must be 1!"
        assert extracted.get('sugar_level') == 140, "Sugar level must be 140!"
        assert extracted.get('hearing_level') == 0, "Hearing level must be 0!"
        assert extracted.get('arth') == 1, "Arthritis must be 1!"
        assert extracted.get('htn') == 1, "Hypertension must be 1!"

        # 5. Now verify that validateAssessmentInputsBeforeSubmit passes
        print("Testing mandatory validation after full voice extraction...")
        val_res_filled = await send_cmd('Runtime.evaluate', {
            'expression': "validateAssessmentInputsBeforeSubmit()",
            'returnByValue': True
        })
        is_valid_after = val_res_filled['result']['result']['value']
        print("Validation Result (Filled Form):", is_valid_after)
        assert is_valid_after == True, "Validator must pass when all mandatory inputs are provided!"

        # 6. Run assessment inference
        print("Running Assessment Inference...")
        await send_cmd('Runtime.evaluate', {'expression': "predictElderRiskAssessment()"})
        await asyncio.sleep(1.0)

        # Screenshot of successful assessment with all parameters filled
        s2 = await send_cmd('Page.captureScreenshot')
        with open('screenshot_mandatory_inputs_completed.png', 'wb') as f:
            f.write(base64.b64decode(s2['result']['data']))
        print("Captured screenshot_mandatory_inputs_completed.png")

        print("\n=== ALL MANDATORY INPUTS SUITE TESTS PASSED! ===")

    finally:
        p.terminate()

if __name__ == '__main__':
    asyncio.run(main())

