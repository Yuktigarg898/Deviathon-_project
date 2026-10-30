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
        '--remote-debugging-port=9234',
        '--window-size=1440,960',
        'http://127.0.0.1:5000/'
    ])
    await asyncio.sleep(2.5)

    try:
        tabs = json.loads(urllib.request.urlopen('http://127.0.0.1:9234/json').read())
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

        # 1. Login directly via enterDashboard('operations')
        await send_cmd('Runtime.evaluate', {
            'expression': "enterDashboard('operations');",
            'returnByValue': True
        })
        await asyncio.sleep(1.0)

        # 2. Test stable sidebar: Measure aside position before and after scrolling the right pane
        scroll_eval = await send_cmd('Runtime.evaluate', {
            'expression': """
            (() => {
                const aside = document.querySelector('#view-operations aside');
                const rightPane = document.querySelector('#view-operations > div.flex-1');
                const beforeAsideRect = aside.getBoundingClientRect();
                
                // Scroll right container
                rightPane.scrollTop = 500;
                const afterAsideRect = aside.getBoundingClientRect();
                const rightScrollTop = rightPane.scrollTop;
                
                return {
                    beforeTop: beforeAsideRect.top,
                    afterTop: afterAsideRect.top,
                    beforeLeft: beforeAsideRect.left,
                    afterLeft: afterAsideRect.left,
                    isAsideStationary: beforeAsideRect.top === afterAsideRect.top && beforeAsideRect.left === afterAsideRect.left,
                    rightPaneScrolled: rightScrollTop > 0,
                    rightScrollTop: rightScrollTop
                };
            })()
            """,
            'returnByValue': True
        })
        print("Sidebar Stability Test Result:", scroll_eval.get('result', {}).get('value'))

        # Reset scroll
        await send_cmd('Runtime.evaluate', {'expression': "document.querySelector('#view-operations > div.flex-1').scrollTop = 0;"})

        # Capture Dashboard Screenshot
        shot = await send_cmd('Page.captureScreenshot', {'format': 'png'})
        with open('screenshot_ops_stable_sidebar.png', 'wb') as f:
            f.write(base64.b64decode(shot['result']['data']))
        print("Saved screenshot_ops_stable_sidebar.png")

        # 3. Switch to Tracking tab
        await send_cmd('Runtime.evaluate', {'expression': "switchOpsTab('tracking');"})
        await asyncio.sleep(1.0)

        # Verify tracking elements populated
        track_eval = await send_cmd('Runtime.evaluate', {
            'expression': """
            (() => {
                const trackingView = document.getElementById('ops-subview-tracking');
                const isVisible = trackingView && !trackingView.classList.contains('hidden');
                const vehicleTitle = document.getElementById('ops-transit-vehicle-title')?.textContent;
                const speed = document.getElementById('ops-transit-speed')?.textContent;
                const battery = document.getElementById('ops-transit-battery')?.textContent;
                const route = document.getElementById('ops-route-title')?.textContent;
                const seniorProof = document.getElementById('ops-proof-senior-title')?.textContent;
                const otpDigits = document.getElementById('ops-proof-otp-digits')?.textContent;
                const dispatchesCount = document.querySelectorAll('#ops-dispatch-selector-container > div').length;

                return {
                    isVisible,
                    vehicleTitle,
                    speed,
                    battery,
                    route,
                    seniorProof,
                    otpDigits,
                    dispatchesCount
                };
            })()
            """,
            'returnByValue': True
        })
        print("Tracking Elements Validation:", track_eval.get('result', {}).get('value'))

        # Capture Tracking Overview Screenshot
        shot2 = await send_cmd('Page.captureScreenshot', {'format': 'png'})
        with open('screenshot_ops_transit_proof_track.png', 'wb') as f:
            f.write(base64.b64decode(shot2['result']['data']))
        print("Saved screenshot_ops_transit_proof_track.png")

        # 4. Test switching to Savitri Devi (DSP-902 - Arrived status)
        await send_cmd('Runtime.evaluate', {'expression': "selectOpsDispatch('DSP-902');"})
        await asyncio.sleep(0.5)

        savitri_eval = await send_cmd('Runtime.evaluate', {
            'expression': """
            (() => {
                return {
                    vehicle: document.getElementById('ops-transit-vehicle-title')?.textContent,
                    status: document.getElementById('ops-transit-status-pill')?.textContent,
                    otp: document.getElementById('ops-proof-otp-digits')?.textContent,
                    senior: document.getElementById('ops-proof-senior-title')?.textContent
                };
            })()
            """,
            'returnByValue': True
        })
        print("Savitri Devi Dispatch Switch Test:", savitri_eval.get('result', {}).get('value'))

        # 5. Open Proof Certificate Modal and capture screenshot
        await send_cmd('Runtime.evaluate', {'expression': "openOpsProofCertificateModal();"})
        await asyncio.sleep(0.8)

        shot3 = await send_cmd('Page.captureScreenshot', {'format': 'png'})
        with open('screenshot_ops_proof_certificate.png', 'wb') as f:
            f.write(base64.b64decode(shot3['result']['data']))
        print("Saved screenshot_ops_proof_certificate.png")

        # Close Certificate modal
        await send_cmd('Runtime.evaluate', {'expression': "closeOpsProofCertificateModal();"})

        print("\nAll UI tests completed successfully!")

    finally:
        proc.terminate()

if __name__ == '__main__':
    asyncio.run(main())
