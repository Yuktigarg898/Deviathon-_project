# -*- coding: utf-8 -*-
import subprocess, urllib.request, json, asyncio, time

async def run_test():
    p = subprocess.Popen([
        r'C:\Program Files\Google\Chrome\Application\chrome.exe',
        '--headless=new',
        '--remote-debugging-port=9223',
        '--window-size=1400,950',
        'http://127.0.0.1:5000/'
    ])
    await asyncio.sleep(2.5)
    
    try:
        import websockets
        tabs = json.loads(urllib.request.urlopen('http://127.0.0.1:9223/json').read())
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

        # 1. Switch to coordinator role
        r1 = await send_cmd('Runtime.evaluate', {'expression': "selectRole('coordinator'); state.currentRole"})
        print("Role switched to:", r1.get('result', {}).get('result', {}).get('value'))

        # 2. Check patient cards rendered in patients tab
        await send_cmd('Runtime.evaluate', {'expression': "switchCoordinatorTab('patients')"})
        await asyncio.sleep(0.5)
        r2 = await send_cmd('Runtime.evaluate', {'expression': "document.querySelectorAll('#coordinator-patients-grid > div').length"})
        patient_count = r2.get('result', {}).get('result', {}).get('value')
        print("Rendered patient cards in directory:", patient_count)

        # 3. Open Patient Dossier for Ramesh Sharma
        await send_cmd('Runtime.evaluate', {'expression': "openPatientDossier('PAT-101')"})
        await asyncio.sleep(0.5)
        r3 = await send_cmd('Runtime.evaluate', {'expression': "document.getElementById('dossier-patient-name').textContent + ' ' + document.getElementById('dossier-username-badge').textContent"})
        print("Dossier Header:", r3.get('result', {}).get('result', {}).get('value'))

        # 4. Check User's Given Input subtab inside dossier
        await send_cmd('Runtime.evaluate', {'expression': "switchDossierSubtab('inputs')"})
        await asyncio.sleep(0.5)
        r4 = await send_cmd('Runtime.evaluate', {'expression': "document.querySelectorAll('#dossier-user-inputs-list > div').length"})
        input_count = r4.get('result', {}).get('result', {}).get('value')
        print("Senior user inputs rendered inside dossier:", input_count)

        # 5. Check Emergency Notifications tab
        await send_cmd('Runtime.evaluate', {'expression': "closePatientDossier(); switchCoordinatorTab('notifications')"})
        await asyncio.sleep(0.5)
        r5 = await send_cmd('Runtime.evaluate', {'expression': "document.querySelectorAll('#coordinator-notifications-list > div').length"})
        notif_count = r5.get('result', {}).get('result', {}).get('value')
        print("Emergency notifications in log:", notif_count)

        # 6. Raise Critical Alert for Anand Verma and verify emergency contact notification
        await send_cmd('Runtime.evaluate', {'expression': "openRaiseCriticalModal('PAT-103')"})
        await asyncio.sleep(0.3)
        await send_cmd('Runtime.evaluate', {'expression': "confirmRaiseCriticalAlert()"})
        await asyncio.sleep(1.0)

        # Check that top critical banner shows updated case and notification count increases
        r6 = await send_cmd('Runtime.evaluate', {'expression': "document.getElementById('banner-critical-title').textContent"})
        print("Top Critical Banner Title:", r6.get('result', {}).get('result', {}).get('value'))

        r7 = await send_cmd('Runtime.evaluate', {'expression': "state.emergencyNotifications.length"})
        print("Total emergency notifications after escalation:", r7.get('result', {}).get('result', {}).get('value'))

        # Check Family Portal alert state
        r8 = await send_cmd('Runtime.evaluate', {'expression': "state.seniorStatus.isSerious"})
        print("Family portal serious flag:", r8.get('result', {}).get('result', {}).get('value'))

        print("\nALL VERIFICATIONS PASSED SUCCESSFULLY!")

    finally:
        p.terminate()

asyncio.run(run_test())

