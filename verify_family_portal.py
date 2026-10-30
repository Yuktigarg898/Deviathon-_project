import asyncio
import subprocess
import json
import urllib.request
import os
import base64
import websockets

async def run_test():
    chrome = r'C:\Program Files\Google\Chrome\Application\chrome.exe'
    proc = subprocess.Popen([
        chrome, '--headless=new', '--remote-debugging-port=9223',
        '--disable-gpu', '--window-size=1280,950',
        'http://127.0.0.1:5000'
    ])
    
    await asyncio.sleep(2)
    try:
        with urllib.request.urlopen('http://127.0.0.1:9223/json') as r:
            tabs = json.loads(r.read().decode('utf-8'))
        ws_url = tabs[0].get('webSocketDebuggerUrl')
        
        async with websockets.connect(ws_url) as ws:
            msg_id = 0
            async def send_cmd(method, params=None):
                nonlocal msg_id
                msg_id += 1
                req = {"id": msg_id, "method": method, "params": params or {}}
                await ws.send(json.dumps(req))
                while True:
                    resp = json.loads(await ws.recv())
                    if resp.get("id") == msg_id:
                        return resp.get("result", {})

            async def eval_js(expr):
                res = await send_cmd("Runtime.evaluate", {"expression": expr, "returnByValue": True})
                return res.get("result", {}).get("value")

            async def capture_png(filename):
                res = await send_cmd("Page.captureScreenshot", {"format": "png"})
                data = base64.b64decode(res.get("data", ""))
                filepath = os.path.join(r"C:\Users\hp\Deviathon", filename)
                with open(filepath, "wb") as f:
                    f.write(data)
                print(f"Captured: {filename} ({len(data)} bytes)")

            print("--- 1. Login as Family Member ---")
            await eval_js("selectRoleForAuth('family')")
            await asyncio.sleep(0.3)
            await eval_js("handleQuickDemoSignIn()")
            await asyncio.sleep(0.5)

            # Screenshot Tab 1: Analyze Summary
            print("--- 2. Family Tab 1: Analyze Summary ---")
            await eval_js("switchFamilyTab('summary')")
            await asyncio.sleep(0.5)
            await capture_png("family_tab1_summary.png")

            # Screenshot Tab 2: Senior Health Report
            print("--- 3. Family Tab 2: Senior Health Report ---")
            await eval_js("switchFamilyTab('report')")
            await asyncio.sleep(0.5)
            await capture_png("family_tab2_report.png")

            # Screenshot Tab 3: Assessment History
            print("--- 4. Family Tab 3: Assessment History ---")
            await eval_js("switchFamilyTab('history')")
            await asyncio.sleep(0.5)
            await capture_png("family_tab3_history.png")

            # Switch Senior to Harish Patel (Normal Tier)
            print("--- 5. Switch to Harish Patel ---")
            await eval_js("changeFamilyLinkedSenior('PAT-105')")
            await asyncio.sleep(0.5)
            await eval_js("switchFamilyTab('report')")
            await asyncio.sleep(0.5)
            await capture_png("family_harish_report.png")

            # Check Care Coordinator view (Clean & original)
            print("--- 6. Verify Care Coordinator view is clean ---")
            await eval_js("navigateRole('coordinator')")
            await asyncio.sleep(0.5)
            await capture_png("coordinator_clean_view.png")

            print("\n>>> ALL FAMILY PORTAL & CLEAN COORDINATOR SCREENSHOTS CAPTURED! <<<")

    finally:
        proc.terminate()

if __name__ == "__main__":
    asyncio.run(run_test())

