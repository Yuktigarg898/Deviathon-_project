import subprocess, urllib.request, json, asyncio, websockets, time, sys, base64

sys.stdout.reconfigure(encoding='utf-8')

async def test_senior_app_and_sos_flow():
    print("Launching headless Chrome to test Senior App UI & Location + Voice SOS Calling...")
    p = subprocess.Popen([
        r'C:\Program Files\Google\Chrome\Application\chrome.exe',
        '--headless=new',
        '--remote-debugging-port=9288',
        '--window-size=1440,1100',
        'http://127.0.0.1:5000/'
    ])
    await asyncio.sleep(2.5)
    
    try:
        tabs = json.loads(urllib.request.urlopen('http://127.0.0.1:9288/json').read())
        target = [t for t in tabs if t.get('type') == 'page'][0]
        ws = await websockets.connect(target['webSocketDebuggerUrl'])

        current_id = 100
        async def call_method(method, params=None):
            nonlocal current_id
            current_id += 1
            msg_id = current_id
            payload = {'id': msg_id, 'method': method}
            if params:
                payload['params'] = params
            await ws.send(json.dumps(payload))
            while True:
                raw = await ws.recv()
                msg = json.loads(raw)
                if msg.get('id') == msg_id:
                    return msg

        async def eval_js(expr):
            res = await call_method('Runtime.evaluate', {'expression': expr, 'returnByValue': True, 'awaitPromise': True})
            return res.get('result', {}).get('result', {}).get('value')

        await call_method('Runtime.enable')

        # 1. Compile check
        print("Checking app.js syntax compilation...")
        with open('app.js', 'r', encoding='utf-8') as f:
            code = f.read()

        comp = await call_method('Runtime.compileScript', {
            'expression': code,
            'sourceURL': 'app.js',
            'persistScript': True
        })
        if 'exceptionDetails' in comp.get('result', {}):
            print("ERROR IN app.js SYNTAX:", comp['result']['exceptionDetails'])
            return False
        else:
            print("SUCCESS: app.js compiled cleanly without errors!")

        await asyncio.sleep(1.0)

        # 2. Switch to senior role
        print("Entering dashboard as senior...")
        await eval_js("selectRole('senior'); enterDashboard('senior');")
        await asyncio.sleep(1.0)

        # 3. Verify Quick Action Taskbar is removed
        qa_count = await eval_js("document.querySelectorAll('.fa-bolt').length")
        print(f"Quick actions bolt icon count: {qa_count} (should be 0 in senior view)")
        
        has_qa_text = await eval_js("document.getElementById('view-senior').innerText.includes('Quick Actions Taskbar')")
        print(f"Quick Actions Taskbar present in senior view: {has_qa_text} (Must be False)")
        assert not has_qa_text, "Quick Actions Taskbar was not removed!"

        # 4. Verify Native App Nav Tabs
        has_nav_tabs = await eval_js("!!document.getElementById('senior-app-nav-tabs')")
        print(f"Native App Nav Tabs present: {has_nav_tabs}")
        assert has_nav_tabs, "senior-app-nav-tabs missing!"

        # 5. Verify Floating Quick SOS Button
        has_floating_sos = await eval_js("!!document.getElementById('senior-floating-sos-bar')")
        print(f"Floating Quick SOS Bar present: {has_floating_sos}")
        assert has_floating_sos, "senior-floating-sos-bar missing!"

        # Capture Screenshot of Native Elder App Dashboard
        shot1 = await call_method('Page.captureScreenshot', {'format': 'png'})
        with open('screenshot_elder_app_dashboard.png', 'wb') as f:
            f.write(base64.b64decode(shot1['result']['data']))
        print("Saved screenshot_elder_app_dashboard.png")

        # 6. Test App Navigation Tabs
        print("Testing App Tab switching...")
        await eval_js("switchSeniorAppTab('reminders')")
        await asyncio.sleep(0.5)
        rem_active = await eval_js("document.getElementById('tab-btn-reminders').classList.contains('text-teal-800')")
        print(f"Reminders tab highlighted: {rem_active}")

        await eval_js("switchSeniorAppTab('checkin')")
        await asyncio.sleep(0.5)

        # 7. Test Emergency SOS Flow: Open Voice SOS Modal
        print("Triggering Emergency SOS (Location + Voice Distress Flow)...")
        await eval_js("openVoiceEmergencySOSModal()")
        await asyncio.sleep(1.0)

        voice_modal_visible = await eval_js("!document.getElementById('modal-emergency-voice-sos').classList.contains('hidden')")
        print(f"Emergency Voice SOS modal visible: {voice_modal_visible}")
        assert voice_modal_visible, "modal-emergency-voice-sos not visible!"

        gps_addr = await eval_js("document.getElementById('sos-gps-address').textContent.trim()")
        gps_badge = await eval_js("document.getElementById('sos-gps-badge').textContent.trim()")
        countdown_val = await eval_js("document.getElementById('sos-countdown-seconds').textContent.trim()")
        print(f"Detected GPS Address: {gps_addr}")
        print(f"GPS Verification Badge: {gps_badge}")
        print(f"SOS Auto Countdown: {countdown_val}")

        # Capture Screenshot of Location + Voice Distress Modal
        shot2 = await call_method('Page.captureScreenshot', {'format': 'png'})
        with open('screenshot_sos_voice_gps_modal.png', 'wb') as f:
            f.write(base64.b64decode(shot2['result']['data']))
        print("Saved screenshot_sos_voice_gps_modal.png")

        # 8. Test Selecting Distress Preset & Triggering Dual Emergency Calls
        print("Selecting Distress Preset: Chest Pain & Heavy Breathing...")
        await eval_js("selectSosDistressPreset('Severe chest pain and heavy breathing / सीने में तेज दर्द')")
        await asyncio.sleep(1.0)

        call_modal_visible = await eval_js("!document.getElementById('modal-emergency-calling-hub').classList.contains('hidden')")
        print(f"Emergency Calling Hub modal visible: {call_modal_visible}")
        assert call_modal_visible, "modal-emergency-calling-hub not visible!"

        coord_status_initial = await eval_js("document.getElementById('sos-call-status-coordinator').textContent.trim()")
        family_status_initial = await eval_js("document.getElementById('sos-call-status-family').textContent.trim()")
        print(f"Initial Coordinator Call Status: {coord_status_initial}")
        print(f"Initial Family Call Status: {family_status_initial}")

        # Wait for call connection progression (at 4 seconds)
        print("Waiting for dual calls to progress to connected...")
        await asyncio.sleep(4.2)

        coord_status_connected = await eval_js("document.getElementById('sos-call-status-coordinator').textContent.trim()")
        family_status_connected = await eval_js("document.getElementById('sos-call-status-family').textContent.trim()")
        call_timer = await eval_js("document.getElementById('sos-call-duration-timer').textContent.trim()")
        print(f"Connected Coordinator Call Status: {coord_status_connected}")
        print(f"Connected Family Call Status: {family_status_connected}")
        print(f"Live In-Call Timer: {call_timer}")

        assert "CONNECTED" in coord_status_connected, "Coordinator call did not connect!"
        assert "CONNECTED" in family_status_connected, "Family call did not connect!"

        # Capture Screenshot of Active Dual Emergency Calling Hub
        shot3 = await call_method('Page.captureScreenshot', {'format': 'png'})
        with open('screenshot_active_emergency_calling_hub.png', 'wb') as f:
            f.write(base64.b64decode(shot3['result']['data']))
        print("Saved screenshot_active_emergency_calling_hub.png")

        # 9. Test In-Call Controls
        print("Testing In-Call controls (Mute / Speaker)...")
        await eval_js("toggleEmergencyMicMute()")
        mute_txt = await eval_js("document.getElementById('sos-mute-text').textContent.trim()")
        print(f"Mute Button Text after toggle: {mute_txt}")

        # 10. Test Ending Emergency Calls
        print("Ending Emergency Calls...")
        await eval_js("endEmergencyCalls()")
        await asyncio.sleep(0.5)

        call_modal_closed = await eval_js("document.getElementById('modal-emergency-calling-hub').classList.contains('hidden')")
        print(f"Emergency Calling Hub closed after end: {call_modal_closed}")
        assert call_modal_closed, "Calling Hub did not close!"

        print("==================================================================")
        print("ALL TESTS PASSED WITH 100% SUCCESS!")
        print("==================================================================")
        return True

    finally:
        p.terminate()

if __name__ == '__main__':
    asyncio.run(test_senior_app_and_sos_flow())

