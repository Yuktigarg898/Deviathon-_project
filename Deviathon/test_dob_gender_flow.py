import subprocess, urllib.request, json, asyncio, websockets, time, sys, base64

sys.stdout.reconfigure(encoding='utf-8')

async def test_dob_gender_and_new_user_prompt():
    print("Launching headless Chrome for DOB, Gender, and New User prompt verification...")
    p = subprocess.Popen([
        r'C:\Program Files\Google\Chrome\Application\chrome.exe',
        '--headless=new',
        '--remote-debugging-port=9247',
        '--window-size=1440,1100',
        'http://127.0.0.1:5000/'
    ])
    await asyncio.sleep(2.5)
    
    try:
        tabs = json.loads(urllib.request.urlopen('http://127.0.0.1:9247/json').read())
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
            res = await call_method('Runtime.evaluate', {'expression': expr, 'returnByValue': True})
            return res.get('result', {}).get('result', {}).get('value')

        async def capture_screenshot(filename):
            res = await call_method('Page.captureScreenshot', {'format': 'png'})
            data = res.get('result', {}).get('data')
            if data:
                with open(filename, 'wb') as f:
                    f.write(base64.b64decode(data))
                print(f"Captured screenshot: {filename}")

        await call_method('Runtime.enable')
        await call_method('Page.enable')

        # 1. Compile script check
        with open('app.js', 'r', encoding='utf-8') as f:
            code = f.read()

        comp = await call_method('Runtime.compileScript', {
            'expression': code,
            'sourceURL': 'app.js',
            'persistScript': True
        })
        assert 'exceptionDetails' not in comp.get('result', {}), f"Compilation error: {comp}"
        print("PASS 1: app.js compiled cleanly with zero syntax errors!")

        # 2. Existing default user (Ramesh Sharma) test
        await eval_js("enterDashboard('senior')")
        await asyncio.sleep(0.5)

        age_val = await eval_js("document.getElementById('assess-age').value")
        gender_val = await eval_js("document.getElementById('assess-gender').value")
        meta_text = await eval_js("document.getElementById('senior-vitals-meta-badge')?.innerText")
        prompt_hidden = await eval_js("document.getElementById('new-user-profile-prompt').classList.contains('hidden')")

        print(f"PASS 2: Existing User Defaults -> Age: {age_val}, Gender: {gender_val}, Meta: '{meta_text}', Prompt Hidden: {prompt_hidden}")
        assert str(age_val) == '74', f"Expected age 74, got {age_val}"
        assert gender_val == 'Male', f"Expected gender Male, got {gender_val}"
        assert prompt_hidden == True, "Prompt should be hidden for completed existing user"

        # 3. Test Profile Modal DOB -> Age calculation and save
        await eval_js("openProfileModal()")
        await asyncio.sleep(0.3)
        modal_open = await eval_js("!document.getElementById('modal-profile-management').classList.contains('hidden')")
        dob_input_exists = await eval_js("document.getElementById('prof-senior-dob') !== null")
        assert modal_open and dob_input_exists, "Profile modal with DOB input should be visible"

        # Change DOB to 1950-01-01 and trigger calculation
        calc_age = await eval_js("""
            (() => {
                const dob = document.getElementById('prof-senior-dob');
                dob.value = '1950-01-01';
                handleSeniorDobChange('1950-01-01');
                const g = document.getElementById('prof-senior-gender');
                g.value = 'Female';
                return document.getElementById('prof-senior-age').value;
            })()
        """)
        print(f"PASS 3: Live DOB Change to 1950-01-01 -> Calculated Age in modal: {calc_age}")
        assert int(calc_age) >= 76, f"Expected calculated age ~76, got {calc_age}"

        # Save profile
        await eval_js("saveUserProfile()")
        await asyncio.sleep(0.3)

        updated_age = await eval_js("document.getElementById('assess-age').value")
        updated_gender = await eval_js("document.getElementById('assess-gender').value")
        updated_meta = await eval_js("document.getElementById('senior-vitals-meta-badge')?.innerText")
        print(f"PASS 4: Auto-Fill in Assessment Form -> Age: {updated_age}, Gender: {updated_gender}, Header Meta: '{updated_meta}'")
        assert updated_age == str(calc_age), f"Expected assess-age to be {calc_age}, got {updated_age}"
        assert updated_gender == 'Female', f"Expected assess-gender to be Female, got {updated_gender}"
        assert 'Female' in updated_meta, f"Expected Female in meta, got {updated_meta}"

        # 4. Test New User Sign Up & Incomplete Profile Prompt Banner
        print("\nTesting New User Sign Up & Incomplete Profile Prompt...")
        await eval_js("logout()")
        await asyncio.sleep(0.3)

        # Switch to senior signup in login hub
        await eval_js("""
            (() => {
                selectRoleForAuth('senior');
                switchAuthTab('signup');
                document.getElementById('signup-name').value = 'Kalyani Devi';
                document.getElementById('signup-email').value = 'kalyani@example.com';
                document.getElementById('signup-password').value = 'password123';
            })()
        """)
        await asyncio.sleep(0.3)

        # Submit signup
        await eval_js("handleSignUpSubmit()")
        await asyncio.sleep(0.6)

        # Check that prompt is now visible!
        prompt_visible = await eval_js("!document.getElementById('new-user-profile-prompt').classList.contains('hidden')")
        user_name_display = await eval_js("document.getElementById('current-user-name').innerText")
        print(f"PASS 5: New User Dashboard -> User: {user_name_display}, Incomplete Profile Prompt Visible: {prompt_visible}")
        assert prompt_visible == True, "New user must see the profile completion prompt banner!"
        assert user_name_display == 'Kalyani Devi', f"Expected Kalyani Devi, got {user_name_display}"

        await capture_screenshot("new_user_prompt_visible_screenshot.png")

        # Click prompt's button to open Profile Modal and complete it
        await eval_js("openProfileModal()")
        await asyncio.sleep(0.3)

        # New user selects DOB 1948-06-15 and Gender 'Female'
        new_user_age = await eval_js("""
            (() => {
                const dob = document.getElementById('prof-senior-dob');
                dob.value = '1948-06-15';
                handleSeniorDobChange('1948-06-15');
                document.getElementById('prof-senior-gender').value = 'Female';
                document.getElementById('prof-senior-phone').value = '+91 98222-33445';
                return document.getElementById('prof-senior-age').value;
            })()
        """)
        print(f"PASS 6: New User Profile Modal -> DOB '1948-06-15' calculated Age: {new_user_age}")
        assert int(new_user_age) >= 77, f"Expected age ~78, got {new_user_age}"

        await capture_screenshot("new_user_profile_modal_screenshot.png")

        # Save profile
        await eval_js("saveUserProfile()")
        await asyncio.sleep(0.5)

        # Check prompt is now dismissed and form is auto-filled!
        prompt_now_hidden = await eval_js("document.getElementById('new-user-profile-prompt').classList.contains('hidden')")
        new_assess_age = await eval_js("document.getElementById('assess-age').value")
        new_assess_gender = await eval_js("document.getElementById('assess-gender').value")
        new_meta_badge = await eval_js("document.getElementById('senior-vitals-meta-badge')?.innerText")

        print(f"PASS 7: Post-Save -> Prompt Hidden: {prompt_now_hidden}, Auto-filled Age: {new_assess_age}, Gender: {new_assess_gender}, Meta: '{new_meta_badge}'")
        assert prompt_now_hidden == True, "Prompt must be hidden after profile is saved"
        assert new_assess_age == str(new_user_age), f"Expected assess-age {new_user_age}, got {new_assess_age}"
        assert new_assess_gender == 'Female', f"Expected assess-gender Female, got {new_assess_gender}"

        await capture_screenshot("new_user_post_save_screenshot.png")

        print("\nALL DOB, GENDER & NOTIFICATION PROMPT TESTS PASSED SUCCESSFULLY! (100% SUCCESS)")

    finally:
        p.terminate()

if __name__ == '__main__':
    asyncio.run(test_dob_gender_and_new_user_prompt())
