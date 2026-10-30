import subprocess, urllib.request, json, asyncio, websockets, time

async def take_screen():
    p = subprocess.Popen([r'C:\Program Files\Google\Chrome\Application\chrome.exe', '--headless=new', '--remote-debugging-port=9222', '--window-size=1400,950', 'http://127.0.0.1:5000/'])
    await asyncio.sleep(2.0)
    try:
        tabs = json.loads(urllib.request.urlopen('http://127.0.0.1:9222/json').read())
        target = [t for t in tabs if t.get('type') == 'page'][0]
        ws = await websockets.connect(target['webSocketDebuggerUrl'])

        await ws.send(json.dumps({'id': 1, 'method': 'Runtime.enable'}))
        await ws.recv()

        # Step 2: Click senior role
        await ws.send(json.dumps({
            'id': 2,
            'method': 'Runtime.evaluate',
            'params': {'expression': "selectRoleForAuth('senior')"}
        }))
        await ws.recv()
        await asyncio.sleep(0.5)

        # Take screenshot of credential screen
        await ws.send(json.dumps({'id': 3, 'method': 'Page.captureScreenshot'}))
        while True:
            resp = json.loads(await ws.recv())
            if resp.get('id') == 3:
                import base64
                img_data = base64.b64decode(resp['result']['data'])
                with open(r'd:\OneDrive\Desktop\Deviathon\Deviathon\login_step2_screenshot.png', 'wb') as f:
                    f.write(img_data)
                print("Credential screen screenshot saved!")
                break
    finally:
        p.terminate()

asyncio.run(take_screen())

