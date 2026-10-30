import subprocess, urllib.request, json, asyncio, time

async def test():
    p = subprocess.Popen([r'C:\Program Files\Google\Chrome\Application\chrome.exe', '--headless=new', '--remote-debugging-port=9240', 'http://127.0.0.1:5000/'])
    await asyncio.sleep(2.5)
    try:
        import websockets
        tabs = json.loads(urllib.request.urlopen('http://127.0.0.1:9240/json').read())
        target = [t for t in tabs if t.get('type') == 'page'][0]
        ws = await websockets.connect(target['webSocketDebuggerUrl'])

        async def call(method, params=None):
            mid = int(time.time()*1000)%100000
            await ws.send(json.dumps({'id': mid, 'method': method, 'params': params or {}}))
            while True:
                msg = json.loads(await ws.recv())
                if msg.get('id') == mid:
                    return msg
        
        await call('Runtime.enable')

        r = await call('Runtime.evaluate', {
            'expression': 'window.enterDashboard ? window.enterDashboard.toString().slice(0, 300) : "not defined"'
        })
        print("window.enterDashboard:")
        print(r['result']['result']['value'])

    finally:
        p.kill()

if __name__ == '__main__':
    asyncio.run(test())
