import subprocess, urllib.request, json, asyncio, time

async def test():
    p = subprocess.Popen([r'C:\Program Files\Google\Chrome\Application\chrome.exe', '--headless=new', '--remote-debugging-port=9241', 'about:blank'])
    await asyncio.sleep(2)
    try:
        import websockets
        tabs = json.loads(urllib.request.urlopen('http://127.0.0.1:9241/json').read())
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

        with open('app.js', encoding='utf-8') as f:
            code = f.read()

        print("Compiling app.js in Chrome V8...")
        compile_res = await call('Runtime.compileScript', {
            'expression': code,
            'sourceURL': 'http://127.0.0.1:5000/app.js',
            'persistScript': True
        })
        if 'exceptionDetails' in compile_res.get('result', {}):
            print("SYNTAX ERROR FOUND IN APP.JS:")
            print(json.dumps(compile_res['result']['exceptionDetails'], indent=2))
        else:
            print("app.js compiled successfully with ZERO syntax errors!")
            script_id = compile_res['result']['scriptId']
            run_res = await call('Runtime.runScript', {'scriptId': script_id})
            if 'exceptionDetails' in run_res.get('result', {}):
                print("RUNTIME ERROR WHEN EXECUTING APP.JS:")
                print(json.dumps(run_res['result']['exceptionDetails'], indent=2))
            else:
                print("app.js executed with ZERO errors!")
                check = await call('Runtime.evaluate', {
                    'expression': 'typeof window.selectRoleForAuth'
                })
                print("typeof window.selectRoleForAuth:", check['result']['result']['value'])

    finally:
        p.kill()

if __name__ == '__main__':
    asyncio.run(test())

