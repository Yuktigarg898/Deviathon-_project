# -*- coding: utf-8 -*-
import subprocess, urllib.request, json, asyncio, base64, os

async def main():
    print("Launching headless Chrome on port 9226...")
    p = subprocess.Popen([
        r'C:\Program Files\Google\Chrome\Application\chrome.exe',
        '--headless=new',
        '--remote-debugging-port=9226',
        '--window-size=1440,960',
        'http://127.0.0.1:5000/'
    ])
    await asyncio.sleep(2.5)

    try:
        import websockets
        tabs = json.loads(urllib.request.urlopen('http://127.0.0.1:9226/json').read())
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

        # 1. Switch to Senior / Elder Portal using enterDashboard('senior')
        print("Switching to Senior / Elder Portal via enterDashboard('senior')...")
        r_role = await send_cmd('Runtime.evaluate', {'expression': "enterDashboard('senior')"})
        await asyncio.sleep(1.0)

        # 2. Verify Age & Gender Auto-detected banner and badges
        check_badges_res = await send_cmd('Runtime.evaluate', {
            'expression': """
            (() => {
                const ageBadge = document.getElementById('badge-chk-age');
                const genderBadge = document.getElementById('badge-chk-gender');
                const profileBanner = document.getElementById('badge-auto-profile-banner');
                const ageVal = document.getElementById('assess-age')?.value;
                const genderVal = document.getElementById('assess-gender')?.value;
                return {
                    ageBadgeClass: ageBadge ? ageBadge.className : null,
                    ageBadgeText: ageBadge ? ageBadge.innerText : null,
                    genderBadgeClass: genderBadge ? genderBadge.className : null,
                    genderBadgeText: genderBadge ? genderBadge.innerText : null,
                    profileBannerText: profileBanner ? profileBanner.innerText : null,
                    ageVal: ageVal,
                    genderVal: genderVal
                };
            })()
            """,
            'returnByValue': True
        })
        b_data = check_badges_res['result']['result']['value']
        print("Checklist Age & Gender status:", json.dumps(b_data, indent=2, ensure_ascii=True))
        assert "status-provided" in b_data['ageBadgeClass'], "Age badge must have status-provided (GREEN)"
        assert "status-provided" in b_data['genderBadgeClass'], "Gender badge must have status-provided (GREEN)"
        assert "74" in b_data['ageVal'], "Age must be 74"
        assert "Male" in b_data['genderVal'], "Gender must be Male"

        # Capture screenshot of Elder Assessment Form with Green Auto-detected Badges
        s1 = await send_cmd('Page.captureScreenshot')
        with open('screenshot_elder_assessment_auto_detected.png', 'wb') as f:
            f.write(base64.b64decode(s1['result']['data']))
        print("Captured screenshot_elder_assessment_auto_detected.png")

        # 3. Simulate voice extraction with Hindi synonyms
        print("Simulating voice input extraction with Hindi synonyms...")
        voice_extract_res = await send_cmd('Runtime.evaluate', {
            'expression': """
            (async () => {
                const text = "mujhe sir me bahut tez dard hai, bp 150/90 hai, dhadkan 82 hai, oxygen 96 hai, 5 ghante soya, chalne me lathi chahiye, kal ki dawa bhool gaya tha, sugar 160 hai, saans phoolti hai";
                const res = await fetch('/api/audio/extract-form', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ transcript: text, language: 'hi-IN', current_entities: cumulativeExtracted })
                });
                const json = await res.json();
                applyExtractedEntities(json);
                return json;
            })()
            """,
            'awaitPromise': True,
            'returnByValue': True
        })
        extracted_data = voice_extract_res['result']['result']['value']['extracted']
        print("Voice extraction applied:", json.dumps(extracted_data, indent=2, ensure_ascii=True))

        # Check draft persistence before running assessment
        draft_check = await send_cmd('Runtime.evaluate', {
            'expression': "localStorage.getItem('careconnect_elder_assessment_draft')",
            'returnByValue': True
        })
        draft_str = draft_check['result']['result']['value']
        print("Saved Draft before assessment length:", len(draft_str))
        assert draft_str is not None, "Draft must be safely stored in localStorage"

        # 4. Run AI ML Assessment
        print("Running AI ML Health Assessment (predictElderRiskAssessment)...")
        # Ensure height and weight are entered so validation passes
        await send_cmd('Runtime.evaluate', {'expression': "document.getElementById('assess-height').value = '165'; document.getElementById('assess-weight').value = '68'; saveAssessmentDraft();"})
        await asyncio.sleep(0.5)

        run_assess_res = await send_cmd('Runtime.evaluate', {
            'expression': """
            (async () => {
                await predictElderRiskAssessment();
                const resBox = document.getElementById('assessment-result-box');
                const ageValAfter = document.getElementById('assess-age')?.value;
                const bpSysValAfter = document.getElementById('assess-bp-sys')?.value;
                const hrValAfter = document.getElementById('assess-hr')?.value;
                const draftAfter = localStorage.getItem('careconnect_elder_assessment_draft');
                const historyAfter = JSON.parse(localStorage.getItem('careconnect_elder_assessment_history') || '[]');
                return {
                    resBoxHidden: resBox ? resBox.classList.contains('hidden') : true,
                    ageValAfter: ageValAfter,
                    bpSysValAfter: bpSysValAfter,
                    hrValAfter: hrValAfter,
                    draftCleared: (draftAfter === null),
                    historyCount: historyAfter.length,
                    latestHistoryEntry: historyAfter[0]
                };
            })()
            """,
            'awaitPromise': True,
            'returnByValue': True
        })
        assess_info = run_assess_res['result']['result']['value']
        print("Assessment Run Info:", json.dumps({
            'resBoxHidden': assess_info['resBoxHidden'],
            'ageValAfter': assess_info['ageValAfter'],
            'bpSysValAfter': assess_info['bpSysValAfter'],
            'hrValAfter': assess_info['hrValAfter'],
            'draftCleared': assess_info['draftCleared'],
            'historyCount': assess_info['historyCount'],
            'latestRiskLevel': assess_info['latestHistoryEntry']['riskLevel'],
            'latestRiskScore': assess_info['latestHistoryEntry']['riskScore']
        }, indent=2, ensure_ascii=True))

        assert assess_info['bpSysValAfter'] == "", "BP Systolic must be reset to BLANK post-assessment!"
        assert assess_info['hrValAfter'] == "", "Heart Rate must be reset to BLANK post-assessment!"
        assert assess_info['ageValAfter'] == "74", "Age must stay auto-detected (74)!"
        assert assess_info['draftCleared'] == True, "Draft must be cleared from localStorage!"
        assert assess_info['historyCount'] >= 1, "History must contain the saved assessment!"

        # Capture screenshot of form reset & result card
        s2 = await send_cmd('Page.captureScreenshot')
        with open('screenshot_elder_form_reset_after_assessment.png', 'wb') as f:
            f.write(base64.b64decode(s2['result']['data']))
        print("Captured screenshot_elder_form_reset_after_assessment.png")

        # 5. Open Slide Drawer and verify Assessment History button
        print("Opening Slide Drawer...")
        await send_cmd('Runtime.evaluate', {'expression': "toggleSlideDrawer(true)"})
        await asyncio.sleep(0.7)

        s3 = await send_cmd('Page.captureScreenshot')
        with open('screenshot_slide_bar_with_history_option.png', 'wb') as f:
            f.write(base64.b64decode(s3['result']['data']))
        print("Captured screenshot_slide_bar_with_history_option.png")

        # 6. Click Assessment History option -> Open Modal
        print("Opening Assessment History Modal...")
        await send_cmd('Runtime.evaluate', {'expression': "toggleSlideDrawer(false); openElderAssessmentHistoryModal();"})
        await asyncio.sleep(0.7)

        s4 = await send_cmd('Page.captureScreenshot')
        with open('screenshot_elder_assessment_history_modal.png', 'wb') as f:
            f.write(base64.b64decode(s4['result']['data']))
        print("Captured screenshot_elder_assessment_history_modal.png")

        # 7. Click "View Clinical Sheet (उस समय की रिपोर्ट देखें)" on the latest history entry
        print("Viewing Clinical Sheet from History entry...")
        latest_id = assess_info['latestHistoryEntry']['id']
        await send_cmd('Runtime.evaluate', {'expression': f"viewClinicalSheetFromHistory('{latest_id}')"})
        await asyncio.sleep(0.7)

        s5 = await send_cmd('Page.captureScreenshot')
        with open('screenshot_clinical_sheet_from_history.png', 'wb') as f:
            f.write(base64.b64decode(s5['result']['data']))
        print("Captured screenshot_clinical_sheet_from_history.png")

        print("\n=== ALL VERIFICATIONS PASSED SUCCESSFULLY! ===")

    finally:
        p.terminate()

if __name__ == '__main__':
    asyncio.run(main())
