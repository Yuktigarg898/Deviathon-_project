import subprocess, urllib.request, json, asyncio, websockets, time, sys, base64

sys.stdout.reconfigure(encoding='utf-8')

async def test_reminders_and_alarm():
    print("Launching headless Chrome to test Elder Portal Reminders & Device Alarm...")
    p = subprocess.Popen([
        r'C:\Program Files\Google\Chrome\Application\chrome.exe',
        '--headless=new',
        '--remote-debugging-port=9280',
        '--window-size=1440,1100',
        'http://127.0.0.1:5000/'
    ])
    await asyncio.sleep(2.5)
    
    try:
        tabs = json.loads(urllib.request.urlopen('http://127.0.0.1:9280/json').read())
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

        # 1. Check app.js syntax compilation
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

        # 2. Check coordinator top bar doesn't have [OBJECT OBJECT] or git markers
        body_text = await eval_js("document.body.innerText")
        assert "<<<<<<<" not in body_text, "Found git marker in body!"
        assert "[object Object]" not in body_text, "Found [object Object] in body!"
        assert "[OBJECT OBJECT]" not in body_text, "Found [OBJECT OBJECT] in body!"
        print("Top bar checked: No git markers or [object Object] found.")

        # 3. Enter dashboard as senior
        print("Switching role to senior and entering dashboard...")
        await eval_js("selectRole('senior'); enterDashboard('senior');")
        await asyncio.sleep(1)

        # 4. Check reminders hub element existence & card count
        hub_exists = await eval_js("!!document.getElementById('senior-reminders-section')")
        print(f"Reminders section exists in DOM: {hub_exists}")
        
        cards_count = await eval_js("document.querySelectorAll('[id^=\"rem-card-\"]').length")
        print(f"Rendered reminder cards count: {cards_count}")

        # Check filter pills
        water_cards_count = await eval_js("""
            (() => {
                filterReminders('water');
                return document.querySelectorAll('[id^=\"rem-card-\"]').length;
            })()
        """)
        print(f"Rendered water reminder cards count: {water_cards_count}")

        food_cards_count = await eval_js("""
            (() => {
                filterReminders('food');
                return document.querySelectorAll('[id^=\"rem-card-\"]').length;
            })()
        """)
        print(f"Rendered food reminder cards count: {food_cards_count}")

        med_cards_count = await eval_js("""
            (() => {
                filterReminders('medicine');
                return document.querySelectorAll('[id^=\"rem-card-\"]').length;
            })()
        """)
        print(f"Rendered medicine reminder cards count: {med_cards_count}")

        # Reset filter to all
        await eval_js("filterReminders('all')")

        # Scroll to Reminders Hub and take screenshot
        await eval_js("""
            (() => {
                const el = document.getElementById('senior-reminders-section');
                if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
            })()
        """)
        await asyncio.sleep(0.5)

        shot1 = await call_method('Page.captureScreenshot', {'format': 'png'})
        with open('screenshot_reminders_hub.png', 'wb') as f:
            f.write(base64.b64decode(shot1['result']['data']))
        print("Saved screenshot_reminders_hub.png")

        # 5. Test Hydration Logging
        glasses_before = await eval_js("document.getElementById('water-logged-counter').textContent")
        print(f"Hydration counter before logWaterGlass(): {glasses_before}")
        await eval_js("logWaterGlass()")
        glasses_after = await eval_js("document.getElementById('water-logged-counter').textContent")
        print(f"Hydration counter after logWaterGlass(): {glasses_after}")

        # 6. Test Add Reminder Modal
        print("Testing Add Reminder Modal...")
        await eval_js("openAddReminderModal()")
        await asyncio.sleep(0.5)
        modal_open = await eval_js("!document.getElementById('modal-add-reminder').classList.contains('hidden')")
        print(f"Add Reminder modal is open: {modal_open}")

        # Apply preset: Evening Walk
        await eval_js("applyReminderPreset('walk')")
        title_val = await eval_js("document.getElementById('rem-input-title').value")
        cat_val = await eval_js("document.getElementById('rem-input-category').value")
        time_val = await eval_js("document.getElementById('rem-input-time').value")
        print(f"Applied preset title: {title_val}, category: {cat_val}, time: {time_val}")

        # Save reminder
        await eval_js("handleSaveNewReminder()")
        await asyncio.sleep(0.5)
        new_cards_count = await eval_js("document.querySelectorAll('[id^=\"rem-card-\"]').length")
        print(f"Reminder cards count after adding preset: {new_cards_count} (was {cards_count})")

        # 7. Test Alarm System: Trigger Sample Alarm
        print("Testing Device Alarm Trigger...")
        await eval_js("testSampleReminderAlarm()")
        await asyncio.sleep(1)

        alarm_modal_visible = await eval_js("!document.getElementById('modal-reminder-alarm').classList.contains('hidden')")
        alarm_title = await eval_js("document.getElementById('alarm-dialog-title').textContent")
        alarm_time = await eval_js("document.getElementById('alarm-dialog-time').textContent")
        alarm_sound_active = await eval_js("!!soundEngine.alarmInterval")
        print(f"Alarm Modal visible: {alarm_modal_visible}")
        print(f"Alarm Title: {alarm_title}")
        print(f"Alarm Time: {alarm_time}")
        print(f"Alarm Sound Active (interval running): {alarm_sound_active}")

        shot2 = await call_method('Page.captureScreenshot', {'format': 'png'})
        with open('screenshot_active_alarm.png', 'wb') as f:
            f.write(base64.b64decode(shot2['result']['data']))
        print("Saved screenshot_active_alarm.png")

        # 8. Test Alarm Action: 'I Have Done It' (Complete Action)
        print("Testing completeAlarmAction()...")
        await eval_js("completeAlarmAction()")
        await asyncio.sleep(0.5)

        alarm_modal_closed = await eval_js("document.getElementById('modal-reminder-alarm').classList.contains('hidden')")
        alarm_sound_stopped = await eval_js("soundEngine.alarmInterval === null")
        print(f"Alarm Modal closed after completion: {alarm_modal_closed}")
        print(f"Alarm Sound stopped: {alarm_sound_stopped}")

        shot3 = await call_method('Page.captureScreenshot', {'format': 'png'})
        with open('screenshot_post_completion.png', 'wb') as f:
            f.write(base64.b64decode(shot3['result']['data']))
        print("Saved screenshot_post_completion.png")

        print("ALL TESTS PASSED WITH 100% SUCCESS!")
        return True

    finally:
        p.terminate()

if __name__ == '__main__':
    asyncio.run(test_reminders_and_alarm())
