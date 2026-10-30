import sys, subprocess, urllib.request, json, asyncio, time, os
sys.stdout.reconfigure(encoding='utf-8')

async def run_e2e():
    chrome_path = r'C:\Program Files\Google\Chrome\Application\chrome.exe'
    p = subprocess.Popen([
        chrome_path,
        '--headless=new',
        '--remote-debugging-port=9242',
        '--window-size=1280,900',
        'http://127.0.0.1:5000/'
    ])
    await asyncio.sleep(2.5)

    try:
        import websockets
        tabs = json.loads(urllib.request.urlopen('http://127.0.0.1:9242/json').read())
        page_tabs = [t for t in tabs if t.get('type') == 'page']
        ws_url = page_tabs[0]['webSocketDebuggerUrl']
        ws = await websockets.connect(ws_url)

        async def cdp(method, params=None):
            mid = int(time.time()*1000)%100000
            await ws.send(json.dumps({'id': mid, 'method': method, 'params': params or {}}))
            while True:
                msg = json.loads(await ws.recv())
                if msg.get('id') == mid:
                    return msg.get('result', {})

        await cdp('Runtime.enable')
        await cdp('Page.enable')

        async def eval_js(expr):
            r = await cdp('Runtime.evaluate', {'expression': expr, 'returnByValue': True})
            return r.get('result', {}).get('value')

        async def screenshot(filename):
            r = await cdp('Page.captureScreenshot', {'format': 'png'})
            data = r.get('data')
            if data:
                import base64
                art_dir = r'C:\Users\DELL\.gemini\antigravity\brain\60fdf384-9a93-43ee-8ae3-0c467a8809e6'
                out_path = os.path.join(art_dir, filename)
                with open(out_path, 'wb') as f:
                    f.write(base64.b64decode(data))
                print(f"Saved screenshot: {out_path}")

        print("Waiting for page load...")
        await asyncio.sleep(1)

        # 1. Test Senior Create Account
        print("\n--- Test 1: Senior Create Account ---")
        await eval_js("selectRoleForAuth('senior')")
        await eval_js("switchAuthTab('signup')")
        await asyncio.sleep(0.3)

        fields_html = await eval_js("document.getElementById('signup-role-specific-fields').innerHTML")
        has_object = "[object Object]" in fields_html
        print(f"Role fields contains [object Object]: {has_object}")
        assert not has_object, "Role fields had [object Object]!"

        has_age_input = await eval_js("!!document.getElementById('signup-age')")
        print(f"Senior has signup-age input: {has_age_input}")
        assert has_age_input, "Missing signup-age input"

        await eval_js("""
            document.getElementById('signup-name').value = 'Dinanath Sharma';
            document.getElementById('signup-email').value = 'dinanath@careconnect.in';
            document.getElementById('signup-age').value = 78;
            document.getElementById('signup-gender').value = 'Male';
            handleSignUpSubmit();
        """)
        await asyncio.sleep(1)

        senior_visible = await eval_js("!document.getElementById('view-senior').classList.contains('hidden')")
        greeting_text = await eval_js("document.getElementById('senior-greeting').innerText")
        vitals_meta = await eval_js("document.getElementById('senior-vitals-meta-badge').innerText")
        print(f"Senior view visible: {senior_visible}")
        print(f"Senior greeting: {greeting_text}")
        print(f"Vitals meta: {vitals_meta}")
        assert senior_visible, "Senior view not visible after signup!"
        assert 'Dinanath' in greeting_text, "Greeting does not include user name"

        # Check Reminders section is NOT above assessment in main view
        reminders_parent = await eval_js("document.getElementById('senior-reminders-section').parentElement.id")
        print(f"Parent of senior-reminders-section: {reminders_parent}")
        assert reminders_parent == 'view-add-reminder', f"Expected view-add-reminder, got {reminders_parent}"

        # Open Dedicated Add / Manage Reminders page
        print("Testing openAddReminderPage()...")
        await eval_js("openAddReminderPage()")
        await asyncio.sleep(0.5)

        add_rem_visible = await eval_js("!document.getElementById('view-add-reminder').classList.contains('hidden')")
        rem_grid_count = await eval_js("document.querySelectorAll('#senior-reminders-grid > div').length")
        clock_text = await eval_js("document.getElementById('reminders-live-clock').innerText")
        print(f"Add Reminder page visible: {add_rem_visible}")
        print(f"Reminders in grid inside Add Reminder page: {rem_grid_count}")
        print(f"Reminders live clock: {clock_text}")
        assert add_rem_visible, "Add Reminder page not visible!"
        assert rem_grid_count > 0, "No reminders rendered in grid!"

        await screenshot('screenshot_add_reminders_all_features.png')

        # Return to senior dashboard
        await eval_js("closeAddReminderPage()")
        await asyncio.sleep(0.3)
        await screenshot('screenshot_senior_dashboard_decluttered.png')

        # 2. Test Coordinator Create Account
        print("\n--- Test 2: Coordinator Create Account ---")
        await eval_js("logout()")
        await asyncio.sleep(0.3)
        await eval_js("selectRoleForAuth('coordinator')")
        await eval_js("switchAuthTab('signup')")
        await asyncio.sleep(0.3)

        has_desig = await eval_js("!!document.getElementById('signup-designation')")
        print(f"Coordinator has signup-designation: {has_desig}")
        assert has_desig, "Missing signup-designation"

        await eval_js("""
            document.getElementById('signup-name').value = 'Sister Ananya, RN';
            document.getElementById('signup-email').value = 'ananya.nurse@careconnect.org';
            document.getElementById('signup-designation').value = 'Registered Nurse (RN)';
            handleSignUpSubmit();
        """)
        await asyncio.sleep(1)

        coord_visible = await eval_js("!document.getElementById('view-coordinator').classList.contains('hidden')")
        coord_top = await eval_js("document.getElementById('coord-topbar-name').innerText")
        coord_greet = await eval_js("document.getElementById('coord-greeting-name').innerText")
        print(f"Coordinator view visible: {coord_visible}")
        print(f"Coordinator topbar name: {coord_top}")
        print(f"Coordinator greeting name: {coord_greet}")
        assert coord_visible, "Coordinator view not visible after signup!"
        assert 'Ananya' in coord_top, "Coordinator topbar name not updated"

        await screenshot('screenshot_coordinator_new_account.png')

        # 3. Test Family Create Account
        print("\n--- Test 3: Family Create Account ---")
        await eval_js("logout()")
        await asyncio.sleep(0.3)
        await eval_js("selectRoleForAuth('family')")
        await eval_js("switchAuthTab('signup')")
        await asyncio.sleep(0.3)

        has_rel = await eval_js("!!document.getElementById('signup-relation')")
        print(f"Family has signup-relation: {has_rel}")
        assert has_rel, "Missing signup-relation"

        await eval_js("""
            document.getElementById('signup-name').value = 'Vikram Sharma';
            document.getElementById('signup-email').value = 'vikram.family@gmail.com';
            handleSignUpSubmit();
        """)
        await asyncio.sleep(1)

        fam_visible = await eval_js("!document.getElementById('view-family').classList.contains('hidden')")
        print(f"Family view visible: {fam_visible}")
        assert fam_visible, "Family view not visible after signup!"

        await screenshot('screenshot_family_new_account.png')

        # 4. Test Operations Create Account
        print("\n--- Test 4: Operations Create Account ---")
        await eval_js("logout()")
        await asyncio.sleep(0.3)
        await eval_js("selectRoleForAuth('operations')")
        await eval_js("switchAuthTab('signup')")
        await asyncio.sleep(0.3)

        has_city = await eval_js("!!document.getElementById('signup-city')")
        print(f"Operations has signup-city: {has_city}")
        assert has_city, "Missing signup-city"

        await eval_js("""
            document.getElementById('signup-name').value = 'Deepak Verma';
            document.getElementById('signup-email').value = 'deepak.ops@careconnect.org';
            handleSignUpSubmit();
        """)
        await asyncio.sleep(1)

        ops_visible = await eval_js("!document.getElementById('view-operations').classList.contains('hidden')")
        print(f"Operations view visible: {ops_visible}")
        assert ops_visible, "Operations view not visible after signup!"

        await screenshot('screenshot_operations_new_account.png')

        # 5. Test Forgot Password & OTP Flow
        print("\n--- Test 5: Forgot Password & OTP Flow ---")
        await eval_js("logout()")
        await asyncio.sleep(0.3)
        await eval_js("selectRoleForAuth('senior')")
        await eval_js("toggleForgotPasswordOtp(true)")
        await asyncio.sleep(0.3)

        otp_panel_visible = await eval_js("!document.getElementById('auth-panel-otp').classList.contains('hidden')")
        print(f"OTP panel visible: {otp_panel_visible}")
        assert otp_panel_visible, "OTP panel not visible!"

        await eval_js("sendPasswordResetOtp()")
        await asyncio.sleep(0.5)

        banner_visible = await eval_js("!document.getElementById('otp-live-banner').classList.contains('hidden')")
        otp_display = await eval_js("document.getElementById('otp-code-display').innerText")
        d1 = await eval_js("document.getElementById('otp-d1').value")
        d4 = await eval_js("document.getElementById('otp-d4').value")
        print(f"OTP banner visible: {banner_visible}")
        print(f"OTP generated code: {otp_display}")
        print(f"OTP digits auto-filled: {d1}...{d4}")
        assert banner_visible, "OTP banner not displayed"
        assert len(otp_display) == 4, "OTP not 4 digits"

        await screenshot('screenshot_forgot_password_otp_flow.png')

        # Verify OTP and access portal
        await eval_js("verifyOtpAndLogin()")
        await asyncio.sleep(1)

        senior_visible_otp = await eval_js("!document.getElementById('view-senior').classList.contains('hidden')")
        print(f"Access granted via OTP: {senior_visible_otp}")
        assert senior_visible_otp, "Did not enter dashboard after OTP verification!"

        print("\n ALL TESTS PASSED SUCCESSFULLY! ")

    finally:
        p.kill()

if __name__ == '__main__':
    asyncio.run(run_e2e())
