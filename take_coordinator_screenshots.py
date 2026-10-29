# -*- coding: utf-8 -*-
import subprocess, urllib.request, json, asyncio, base64

async def capture_screens():
    p = subprocess.Popen([
        r'C:\Program Files\Google\Chrome\Application\chrome.exe',
        '--headless=new',
        '--remote-debugging-port=9224',
        '--window-size=1440,960',
        'http://127.0.0.1:5000/'
    ])
    await asyncio.sleep(2.5)
    
    try:
        import websockets
        tabs = json.loads(urllib.request.urlopen('http://127.0.0.1:9224/json').read())
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

        # Select coordinator view
        await send_cmd('Runtime.evaluate', {'expression': "selectRole('coordinator')"})
        await asyncio.sleep(0.5)

        # 1. Capture Coordinator Patients Directory Tab
        await send_cmd('Runtime.evaluate', {'expression': "switchCoordinatorTab('patients')"})
        await asyncio.sleep(0.5)
        s1 = await send_cmd('Page.captureScreenshot')
        with open('screenshot_coordinator_patients.png', 'wb') as f:
            f.write(base64.b64decode(s1['result']['data']))
        print("Captured screenshot_coordinator_patients.png")

        # 2. Open Dossier on User Inputs subtab
        await send_cmd('Runtime.evaluate', {'expression': "openPatientDossier('PAT-101'); switchDossierSubtab('inputs')"})
        await asyncio.sleep(0.5)
        s2 = await send_cmd('Page.captureScreenshot')
        with open('screenshot_patient_dossier_inputs.png', 'wb') as f:
            f.write(base64.b64decode(s2['result']['data']))
        print("Captured screenshot_patient_dossier_inputs.png")

        # 3. Capture Notifications Log Tab
        await send_cmd('Runtime.evaluate', {'expression': "closePatientDossier(); switchCoordinatorTab('notifications')"})
        await asyncio.sleep(0.5)
        s3 = await send_cmd('Page.captureScreenshot')
        with open('screenshot_emergency_notifications.png', 'wb') as f:
            f.write(base64.b64decode(s3['result']['data']))
        print("Captured screenshot_emergency_notifications.png")

    finally:
        p.terminate()

asyncio.run(capture_screens())

