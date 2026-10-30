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
        '--remote-debugging-port=9238',
        '--window-size=1440,960',
        'http://127.0.0.1:5000/'
    ])
    await asyncio.sleep(2.5)

    try:
        tabs = json.loads(urllib.request.urlopen('http://127.0.0.1:9238/json').read())
        target = [t for t in tabs if t.get('type') == 'page'][0]
        ws = await websockets.connect(target['webSocketDebuggerUrl'])

        msg_counter = 1

        async def send_cmd(method, params=None):
            nonlocal msg_counter
            msg_counter += 1
            mid = msg_counter
            await ws.send(json.dumps({'id': mid, 'method': method, 'params': params or {}}))
            while True:
                resp = json.loads(await ws.recv())
                if resp.get('id') == mid:
                    return resp

        await send_cmd('Runtime.enable')

        # Login and go to tracking
        await send_cmd('Runtime.evaluate', {'expression': "enterDashboard('operations');"})
        await asyncio.sleep(0.5)
        await send_cmd('Runtime.evaluate', {'expression': "switchOpsTab('tracking');"})
        await asyncio.sleep(0.5)

        # Scroll right container
        await send_cmd('Runtime.evaluate', {'expression': "document.querySelector('#view-operations > div.flex-1').scrollTop = 440;"})
        await asyncio.sleep(0.5)

        shot = await send_cmd('Page.captureScreenshot', {'format': 'png'})
        with open('screenshot_ops_tracking_scrolled_lower.png', 'wb') as f:
            f.write(base64.b64decode(shot['result']['data']))
        print("Saved screenshot_ops_tracking_scrolled_lower.png")

    finally:
        proc.terminate()

if __name__ == '__main__':
    asyncio.run(main())
