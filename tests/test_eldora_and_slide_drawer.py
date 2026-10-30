import subprocess, urllib.request, json, asyncio, websockets, time, sys, base64

sys.stdout.reconfigure(encoding='utf-8')

async def test_eldora_and_drawer():
    print("Launching headless Chrome to test Eldora App Layout & Slide Drawer...")
    p = subprocess.Popen([
        r'C:\Program Files\Google\Chrome\Application\chrome.exe',
        '--headless=new',
        '--remote-debugging-port=9292',
        '--window-size=1440,1100',
        'http://127.0.0.1:5000/'
    ])
    await asyncio.sleep(2.5)
    
    try:
        tabs = json.loads(urllib.request.urlopen('http://127.0.0.1:9292/json').read())
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

        # 2. Enter dashboard as senior
        print("Entering dashboard as senior...")
        await eval_js("selectRole('senior'); enterDashboard('senior');")
        await asyncio.sleep(1.0)

        # 3. Check Streamlined Header elements
        has_drawer_btn = await eval_js("!!document.getElementById('header-menu-drawer-btn')")
        has_rem_btn = await eval_js("!!document.getElementById('header-reminders-btn')")
        has_sos_btn = await eval_js("!!document.getElementById('header-sos-btn')")
        has_avatar = await eval_js("!!document.getElementById('current-user-avatar')")
        print(f"Header Drawer Button present: {has_drawer_btn}")
        print(f"Header Reminders Button present: {has_rem_btn}")
        print(f"Header SOS Button present: {has_sos_btn}")
        print(f"Header Avatar present: {has_avatar}")
        assert has_drawer_btn and has_sos_btn, "Header essential buttons missing!"

        # 4. Check Eldora Elder Portal Layout
        has_daily_wellness = await eval_js("document.getElementById('view-senior').innerText.includes('Daily Wellness')")
        has_feature_grid = await eval_js("document.getElementById('view-senior').innerText.includes('What would you like to do?')")
        has_upcoming = await eval_js("document.getElementById('view-senior').innerText.includes('Upcoming Routine')")
        has_bottom_nav = await eval_js("!!document.getElementById('senior-bottom-nav')")

        print(f"Daily Wellness Card present: {has_daily_wellness}")
        print(f"Eldora 6-Feature Tiles Grid present: {has_feature_grid}")
        print(f"Upcoming Routine Schedule Card present: {has_upcoming}")
        print(f"Eldora Bottom App Navigation Bar present: {has_bottom_nav}")

        assert has_daily_wellness, "Daily Wellness Card missing!"
        assert has_feature_grid, "Eldora Feature Grid missing!"
        assert has_upcoming, "Upcoming Routine Card missing!"
        assert has_bottom_nav, "Bottom App Navigation Bar missing!"

        # Screenshot of Eldora Elder Portal
        shot1 = await call_method('Page.captureScreenshot', {'format': 'png'})
        with open('screenshot_eldora_elder_portal.png', 'wb') as f:
            f.write(base64.b64decode(shot1['result']['data']))
        print("Saved screenshot_eldora_elder_portal.png")

        # 5. Test Opening Slide-out Sidebar Drawer
        print("Opening Slide-out Drawer...")
        await eval_js("toggleSlideDrawer(true)")
        await asyncio.sleep(0.5)

        drawer_open = await eval_js("document.getElementById('slide-drawer-menu').classList.contains('translate-x-0')")
        backdrop_visible = await eval_js("!document.getElementById('slide-drawer-backdrop').classList.contains('hidden')")
        drawer_user_name = await eval_js("document.getElementById('drawer-user-name').textContent.trim()")
        print(f"Drawer is open (translate-x-0): {drawer_open}")
        print(f"Drawer Backdrop visible: {backdrop_visible}")
        print(f"Drawer User Name: {drawer_user_name}")

        assert drawer_open, "Drawer did not open!"
        assert backdrop_visible, "Backdrop did not show!"

        # Screenshot of Open Slide Drawer
        shot2 = await call_method('Page.captureScreenshot', {'format': 'png'})
        with open('screenshot_slide_drawer_open.png', 'wb') as f:
            f.write(base64.b64decode(shot2['result']['data']))
        print("Saved screenshot_slide_drawer_open.png")

        # 6. Test Language Switch in Drawer
        print("Testing language switch in drawer to Hindi...")
        await eval_js("setAppLanguage('hi')")
        await asyncio.sleep(0.3)
        lang_is_hi = await eval_js("state.seniorLanguage === 'hi'")
        print(f"Language updated to Hindi: {lang_is_hi}")
        assert lang_is_hi, "Language not updated!"

        await eval_js("setAppLanguage('en')")
        await asyncio.sleep(0.3)

        # 7. Test Sound Toggle in Drawer
        print("Testing audio toggle in drawer...")
        initial_audio = await eval_js("state.audioEnabled")
        await eval_js("toggleAudioEffects()")
        toggled_audio = await eval_js("state.audioEnabled")
        print(f"Audio toggled from {initial_audio} to {toggled_audio}")
        assert initial_audio != toggled_audio, "Audio toggle failed!"
        await eval_js("toggleAudioEffects()") # Toggle back to enabled

        # 8. Test Closing Slide Drawer
        print("Closing Slide Drawer...")
        await eval_js("toggleSlideDrawer(false)")
        await asyncio.sleep(0.5)

        drawer_closed = await eval_js("document.getElementById('slide-drawer-menu').classList.contains('-translate-x-full')")
        backdrop_hidden = await eval_js("document.getElementById('slide-drawer-backdrop').classList.contains('hidden')")
        print(f"Drawer is closed (-translate-x-full): {drawer_closed}")
        print(f"Backdrop is hidden: {backdrop_hidden}")
        assert drawer_closed and backdrop_hidden, "Drawer did not close properly!"

        # 9. Test One-Tap Wellness reaction from Eldora Card
        print("Testing One-Tap Wellness reaction...")
        await eval_js("sendOneTapStatus('great')")
        await asyncio.sleep(0.5)
        status_text = await eval_js("document.getElementById('senior-status-text').textContent.trim()")
        print(f"Updated Wellness Status: {status_text}")

        print("==================================================================")
        print("ALL TESTS PASSED WITH 100% SUCCESS!")
        print("==================================================================")
        return True

    finally:
        p.terminate()

if __name__ == '__main__':
    asyncio.run(test_eldora_and_drawer())

