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
        '--remote-debugging-port=9230',
        '--window-size=1400,1050',
        'http://127.0.0.1:5000/'
    ])
    await asyncio.sleep(2.5)

    try:
        tabs = json.loads(urllib.request.urlopen('http://127.0.0.1:9230/json').read())
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

        # Check document state
        state_eval = await send_cmd('Runtime.evaluate', {'expression': """
        ({
            readyState: document.readyState,
            viewLoginHidden: document.getElementById('view-login')?.classList.contains('hidden'),
            authRoleSelectorHidden: document.getElementById('auth-role-selector-step')?.classList.contains('hidden'),
            authCredentialHidden: document.getElementById('auth-credential-step')?.classList.contains('hidden'),
            currentRole: window.state?.currentRole,
            selectedAuthRole: window.selectedAuthRole,
            globalHeaderHidden: document.getElementById('global-header')?.classList.contains('hidden'),
            hash: window.location.hash
        })
        """, 'returnByValue': True})
        print("INITIAL PAGE STATE:", json.dumps(state_eval.get('result', {}).get('value', {}), indent=2))

        # Check console logs
        print("CONSOLE LOGS SO FAR:", json.dumps(console_logs, indent=2))

        # Capture initial screenshot
        s1 = await send_cmd('Page.captureScreenshot')
        with open('screenshot_debug_login_init.png', 'wb') as f:
            f.write(base64.b64decode(s1['result']['data']))
        print("Saved screenshot_debug_login_init.png")

        # Now test clicking on 'Family Member' role card
        click_res = await send_cmd('Runtime.evaluate', {'expression': """
        (function() {
            try {
                if (typeof selectRoleForAuth === 'function') {
                    selectRoleForAuth('family');
                    return {
                        success: true,
                        authRoleSelectorHidden: document.getElementById('auth-role-selector-step')?.classList.contains('hidden'),
                        authCredentialHidden: document.getElementById('auth-credential-step')?.classList.contains('hidden'),
                        portalTitle: document.getElementById('auth-portal-title')?.textContent
                    };
                } else {
                    return { success: false, reason: 'selectRoleForAuth is not a function' };
                }
            } catch (err) {
                return { success: false, error: err.toString(), stack: err.stack };
            }
        })()
        """, 'returnByValue': True})
        print("CLICK ROLE RESULT:", json.dumps(click_res.get('result', {}).get('value', {}), indent=2))

        # Test clicking signin or quick demo
        signin_test = await send_cmd('Runtime.evaluate', {'expression': """
        (function() {
            try {
                if (typeof handleSignInSubmit === 'function') {
                    handleSignInSubmit({ preventDefault: () => {} });
                    return {
                        success: true,
                        currentRole: window.state?.currentRole,
                        viewFamilyHidden: document.getElementById('view-family')?.classList.contains('hidden')
                    };
                } else {
                    return { success: false, reason: 'handleSignInSubmit is not a function' };
                }
            } catch (err) {
                return { success: false, error: err.toString(), stack: err.stack };
            }
        })()
        """, 'returnByValue': True})
        print("SIGNIN TEST RESULT:", json.dumps(signin_test.get('result', {}).get('value', {}), indent=2))

        # Capture post-click screenshot
        s2 = await send_cmd('Page.captureScreenshot')
        with open('screenshot_debug_login_after_click.png', 'wb') as f:
            f.write(base64.b64decode(s2['result']['data']))
        print("Saved screenshot_debug_login_after_click.png")

        await ws.close()
    finally:
        proc.terminate()

if __name__ == '__main__':
    asyncio.run(main())

