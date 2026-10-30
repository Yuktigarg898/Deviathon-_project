# -*- coding: utf-8 -*-
import subprocess, urllib.request, json, asyncio, base64, time, sys

async def main():
    print("Launching headless Chrome on port 9229...")
    p = subprocess.Popen([
        r'C:\Program Files\Google\Chrome\Application\chrome.exe',
        '--headless=new',
        '--remote-debugging-port=9229',
        '--window-size=1440,1080',
        'http://127.0.0.1:5000/'
    ])
    await asyncio.sleep(2.5)

    try:
        import websockets
        tabs = json.loads(urllib.request.urlopen('http://127.0.0.1:9229/json').read())
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

        # 1. Switch to Senior Portal
        print("Entering Senior Portal...")
        await send_cmd('Runtime.evaluate', {'expression': "enterDashboard('senior')"})
        await asyncio.sleep(0.5)

        # 2. Check initial status of Age and Gender badges, and presence of separated badges
        print("Auditing initial checklist badges...")
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
                        color: style.color,
                        border: style.borderColor
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
        print("Initial Badges Audit:")
        print(json.dumps(audit1, indent=2, ensure_ascii=True))

        assert audit1['age'] is not None, "badge-chk-age must exist!"
        assert 'status-provided' in audit1['age']['className'], "badge-chk-age must have class status-provided!"
        assert 'Auto-detected' in audit1['age']['statusSpan'], "badge-chk-age status must be Auto-detected!"

        assert audit1['gender'] is not None, "badge-chk-gender must exist!"
        assert 'status-provided' in audit1['gender']['className'], "badge-chk-gender must have class status-provided!"
        assert 'Auto-detected' in audit1['gender']['statusSpan'], "badge-chk-gender status must be Auto-detected!"

        assert audit1['height'] is not None, "badge-chk-height must exist as its own badge!"
        assert audit1['weight'] is not None, "badge-chk-weight must exist as its own badge!"
        assert audit1['bp'] is not None, "badge-chk-bp must exist as its own badge!"
        assert audit1['hr'] is not None, "badge-chk-hr must exist as its own badge!"
        assert audit1['spo2'] is not None, "badge-chk-spo2 must exist as its own badge!"

        # 3. Test that resetElderAssessmentForm or __resetCumulativeVoiceState keeps Age and Gender GREEN
        print("\nCalling __resetCumulativeVoiceState() and auditing Age & Gender...")
        await send_cmd('Runtime.evaluate', {'expression': "window.__resetCumulativeVoiceState()"})
        await asyncio.sleep(0.3)

        badges_audit2 = await send_cmd('Runtime.evaluate', {
            'expression': """
            (() => {
                const age = document.getElementById('badge-chk-age');
                const gen = document.getElementById('badge-chk-gender');
                return {
                    ageClass: age.className,
                    ageText: age.innerText.replace(/\\s+/g, ' ').trim(),
                    genClass: gen.className,
                    genText: gen.innerText.replace(/\\s+/g, ' ').trim()
                };
            })()
            """,
            'returnByValue': True
        })
        audit2 = badges_audit2['result']['result']['value']
        print("Post-Reset Badges Audit:", json.dumps(audit2, indent=2, ensure_ascii=True))
        assert 'status-provided' in audit2['ageClass'], "badge-chk-age must remain status-provided after reset!"
        assert 'Auto-detected' in audit2['ageText'], "badge-chk-age must say Auto-detected after reset!"
        assert 'status-provided' in audit2['genClass'], "badge-chk-gender must remain status-provided after reset!"
        assert 'Auto-detected' in audit2['genText'], "badge-chk-gender must say Auto-detected after reset!"

        # Capture screenshot of initial clean state with Green Age/Gender and separate missing badges
        s1 = await send_cmd('Page.captureScreenshot')
        with open('screenshot_age_gender_green_initial.png', 'wb') as f:
            f.write(base64.b64decode(s1['result']['data']))
        print("Captured screenshot_age_gender_green_initial.png")

        # 4. Test asking for Weight separately
        print("\nSimulating separate voice input for Weight only ('Mera vajan 72 kilo hai')...")
        await send_cmd('Runtime.evaluate', {
            'expression': """
            (async () => {
                simulateVoiceHealthInput('Mera vajan 72 kilo hai');
            })()
            """
        })
        await asyncio.sleep(1.0)

        weight_check = await send_cmd('Runtime.evaluate', {
            'expression': """
            (() => {
                const w = document.getElementById('badge-chk-weight');
                const h = document.getElementById('badge-chk-height');
                return {
                    weightClass: w.className,
                    weightText: w.innerText.replace(/\\s+/g, ' ').trim(),
                    heightClass: h.className,
                    heightText: h.innerText.replace(/\\s+/g, ' ').trim()
                };
            })()
            """,
            'returnByValue': True
        })
        w_res = weight_check['result']['result']['value']
        print("After Weight Only Speech:", json.dumps(w_res, indent=2, ensure_ascii=True))
        assert 'status-provided' in w_res['weightClass'], "Weight badge should now be green/provided!"
        assert 'status-missing' in w_res['heightClass'], "Height badge should still be missing/amber!"

        # 5. Test asking for Height separately
        print("\nSimulating separate voice input for Height only ('Meri height 168 cm hai')...")
        await send_cmd('Runtime.evaluate', {
            'expression': """
            (async () => {
                simulateVoiceHealthInput('Meri height 168 cm hai');
            })()
            """
        })
        await asyncio.sleep(1.0)

        height_check = await send_cmd('Runtime.evaluate', {
            'expression': """
            (() => {
                const h = document.getElementById('badge-chk-height');
                return {
                    heightClass: h.className,
                    heightText: h.innerText.replace(/\\s+/g, ' ').trim()
                };
            })()
            """,
            'returnByValue': True
        })
        h_res = height_check['result']['result']['value']
        print("After Height Speech:", json.dumps(h_res, indent=2, ensure_ascii=True))
        assert 'status-provided' in h_res['heightClass'], "Height badge should now be green/provided!"

        # 6. Test BP, Pulse (HR), SpO2
        print("\nSimulating separate voice input for BP, Heart Rate, and SpO2 ('BP 130/82 hai, dhadkan pulse 76, oxygen 98 percent')...")
        await send_cmd('Runtime.evaluate', {
            'expression': """
            (async () => {
                simulateVoiceHealthInput('BP 130/82 hai, dhadkan pulse 76, oxygen 98 percent');
            })()
            """
        })
        await asyncio.sleep(1.0)

        vitals_check = await send_cmd('Runtime.evaluate', {
            'expression': """
            (() => {
                const bp = document.getElementById('badge-chk-bp');
                const hr = document.getElementById('badge-chk-hr');
                const spo2 = document.getElementById('badge-chk-spo2');
                return {
                    bpClass: bp.className,
                    bpText: bp.innerText.replace(/\\s+/g, ' ').trim(),
                    hrClass: hr.className,
                    hrText: hr.innerText.replace(/\\s+/g, ' ').trim(),
                    spo2Class: spo2.className,
                    spo2Text: spo2.innerText.replace(/\\s+/g, ' ').trim()
                };
            })()
            """,
            'returnByValue': True
        })
        v_res = vitals_check['result']['result']['value']
        print("After Vitals Speech:", json.dumps(v_res, indent=2, ensure_ascii=True))
        assert 'status-provided' in v_res['bpClass'], "BP badge must be green/provided!"
        assert 'status-provided' in v_res['hrClass'], "Heart Rate badge must be green/provided!"
        assert 'status-provided' in v_res['spo2Class'], "SpO2 badge must be green/provided!"

        # 7. Complete remaining parameters and check all green
        print("\nSupplying remaining parameters...")
        await send_cmd('Runtime.evaluate', {
            'expression': """
            (async () => {
                simulateVoiceHealthInput('koi dard nahi hai no pain, 7 ghante neend, chal leta hu, khana khud, uthna baithna khud, toilet khud, 2 dawai li koi nahi chhooti, normal sunta hu, non diabetic sugar nahi hai, koi bimari nahi');
            })()
            """
        })
        await asyncio.sleep(1.0)

        # Check all badges in grid
        all_grid_check = await send_cmd('Runtime.evaluate', {
            'expression': """
            (() => {
                const badges = Array.from(document.querySelectorAll('.voice-check-badge'));
                return badges.map(b => ({
                    id: b.id,
                    className: b.className,
                    text: b.innerText.replace(/\\s+/g, ' ').trim()
                }));
            })()
            """,
            'returnByValue': True
        })
        all_badges = all_grid_check['result']['result']['value']
        print(f"\nAll Badges Total: {len(all_badges)}")
        all_green = all('status-provided' in b['className'] for b in all_badges)
        print("Are all badges green/status-provided?:", all_green)
        assert all_green, f"All badges should be green! Found: {[b['id'] for b in all_badges if 'status-provided' not in b['className']]}"

        # 8. Test mandatory validation succeeds now
        val_success = await send_cmd('Runtime.evaluate', {
            'expression': "validateAssessmentInputsBeforeSubmit()",
            'returnByValue': True
        })
        assert val_success['result']['result']['value'] == True, "Validation must pass when all inputs provided!"

        # 9. Run assessment prediction
        print("Running Assessment Prediction...")
        await send_cmd('Runtime.evaluate', {'expression': "predictElderRiskAssessment()"})
        await asyncio.sleep(1.2)

        # Screenshot of all parameters green & completed prediction
        s2 = await send_cmd('Page.captureScreenshot')
        with open('screenshot_all_mandatory_green.png', 'wb') as f:
            f.write(base64.b64decode(s2['result']['data']))
        print("Captured screenshot_all_mandatory_green.png")

        print("\n=== ALL SEPARATED BADGES & MANDATORY VALIDATION TESTS PASSED SUCCESSFULLY! ===")

    finally:
        p.terminate()

if __name__ == '__main__':
    asyncio.run(main())
