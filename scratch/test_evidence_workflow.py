import subprocess
import urllib.request
import json
import asyncio
import base64
import websockets

async def main():
    chrome_path = r'C:\Program Files\Google\Chrome\Application\chrome.exe'
    proc = subprocess.Popen([
        chrome_path,
        '--headless=new',
        '--remote-debugging-port=9240',
        '--window-size=1440,960',
        'http://127.0.0.1:5000/'
    ])
    await asyncio.sleep(2.5)

    try:
        tabs = json.loads(urllib.request.urlopen('http://127.0.0.1:9240/json').read())
        target = [t for t in tabs if t.get('type') == 'page'][0]
        ws = await websockets.connect(target['webSocketDebuggerUrl'])

        msg_counter = 1
        console_logs = []

        async def send_cmd(method, params=None):
            nonlocal msg_counter
            msg_counter += 1
            mid = msg_counter
            await ws.send(json.dumps({'id': mid, 'method': method, 'params': params or {}}))
            while True:
                resp = json.loads(await ws.recv())
                if resp.get('method') == 'Runtime.consoleAPICalled':
                    console_logs.append(resp.get('params', {}))
                if resp.get('method') == 'Runtime.exceptionThrown':
                    console_logs.append({'type': 'EXCEPTION', 'details': resp.get('params', {})})
                if resp.get('id') == mid:
                    return resp

        await send_cmd('Runtime.enable')

        # 1. Login as Operations Manager
        await send_cmd('Runtime.evaluate', {'expression': "enterDashboard('operations');"})
        await asyncio.sleep(0.8)

        # 2. Open Assign Modal with Date & Time Slot
        await send_cmd('Runtime.evaluate', {'expression': "openOpsAssignModal('Ramesh Sharma', 'High', 'Missed check-in & HR spike', 'Sister Kavita, RN');"})
        await asyncio.sleep(0.5)

        shot1 = await send_cmd('Page.captureScreenshot', {'format': 'png'})
        with open('screenshot_assign_with_slot.png', 'wb') as f:
            f.write(base64.b64decode(shot1['result']['data']))
        print("Saved screenshot_assign_with_slot.png")

        # 3. Confirm Assignment with Date & Slot
        await send_cmd('Runtime.evaluate', {'expression': """
        (() => {
            const dateInput = document.getElementById('ops-assign-date');
            const slotSelect = document.getElementById('ops-assign-timeslot');
            if (dateInput) dateInput.value = '2026-10-31';
            if (slotSelect) slotSelect.value = '02:00 PM - 04:00 PM';
            confirmOpsAssignModal();
        })()
        """})
        await asyncio.sleep(0.8)

        # 4. Open Live Transit & Proof Track view
        await send_cmd('Runtime.evaluate', {'expression': "openOpsTrackingForSenior('Ramesh Sharma');"})
        await asyncio.sleep(1.0)

        # Scroll right container down slightly so photo and summary are clearly visible
        await send_cmd('Runtime.evaluate', {'expression': "document.querySelector('#view-operations > div.flex-1').scrollTop = 260;"})
        await asyncio.sleep(0.5)

        shot2 = await send_cmd('Page.captureScreenshot', {'format': 'png'})
        with open('screenshot_tracking_evidence_dossier.png', 'wb') as f:
            f.write(base64.b64decode(shot2['result']['data']))
        print("Saved screenshot_tracking_evidence_dossier.png")

        # 5. Open the Record & Submit Visit Proof Modal
        await send_cmd('Runtime.evaluate', {'expression': "openOpsSubmitVisitProofModal('Ramesh Sharma');"})
        await asyncio.sleep(0.8)

        shot3 = await send_cmd('Page.captureScreenshot', {'format': 'png'})
        with open('screenshot_submit_visit_proof_modal.png', 'wb') as f:
            f.write(base64.b64decode(shot3['result']['data']))
        print("Saved screenshot_submit_visit_proof_modal.png")

        # 6. Simulate Live Doorstep GPS fetch and Submit Visit Evidence
        await send_cmd('Runtime.evaluate', {'expression': """
        (() => {
            fetchLiveDoorstepLocation();
            document.getElementById('modal-proof-bp-input').value = '126/82';
            document.getElementById('modal-proof-hr-input').value = '76';
            document.getElementById('modal-proof-sugar-input').value = '134';
            document.getElementById('modal-proof-spo2-input').value = '99';
            document.getElementById('modal-proof-summary-input').value = 'Coordinator completed physical home visit at GK-1 doorstep. Elder vitals stabilized at BP 126/82, HR 76. 7-Day medication organizer reviewed and verified. Elder is fully oriented and in good spirits. Family notified with photo evidence.';
            document.getElementById('modal-proof-otp-input').value = '7194';
            submitOpsVisitProof();
        })()
        """})
        await asyncio.sleep(0.8)

        # 7. Capture the sealed evidence in the proof card
        shot4 = await send_cmd('Page.captureScreenshot', {'format': 'png'})
        with open('screenshot_evidence_sealed.png', 'wb') as f:
            f.write(base64.b64decode(shot4['result']['data']))
        print("Saved screenshot_evidence_sealed.png")

        # 8. Test Coordinator View: navigate to coordinator and view buttons
        await send_cmd('Runtime.evaluate', {'expression': "navigateRole('coordinator');"})
        await asyncio.sleep(0.8)

        shot5 = await send_cmd('Page.captureScreenshot', {'format': 'png'})
        with open('screenshot_coordinator_proof_actions.png', 'wb') as f:
            f.write(base64.b64decode(shot5['result']['data']))
        print("Saved screenshot_coordinator_proof_actions.png")

        print("\nAll evidence workflow steps completed successfully!")

    finally:
        proc.terminate()

if __name__ == '__main__':
    asyncio.run(main())

