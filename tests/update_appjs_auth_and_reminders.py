import sys

def update_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Fix line in selectRoleForAuth
    old_role_fields = """  // Render role-specific signup fields
  if (roleFieldsContainer) {
    roleFieldsContainer.innerHTML = cfg.signupFieldsHtml;
  }"""

    new_role_fields = """  // Render role-specific signup fields
  if (roleFieldsContainer) {
    const curLang = (state && state.currentLanguage) || 'en';
    roleFieldsContainer.innerHTML = typeof cfg.signupFieldsHtml === 'object' ? (cfg.signupFieldsHtml[curLang] || cfg.signupFieldsHtml.en) : cfg.signupFieldsHtml;
    const btnSignupLabel = document.getElementById('btn-signup-label');
    if (btnSignupLabel) {
      btnSignupLabel.textContent = (curLang === 'hi')
        ? `${getRoleDisplayName(role, 'hi')} खाता बनाएं एवं पोर्टल खोलें`
        : `Create Account & Enter ${getRoleDisplayName(role, 'en')} Portal`;
    }
  }"""

    if old_role_fields in content:
        content = content.replace(old_role_fields, new_role_fields)
        print("Replaced roleFieldsContainer in selectRoleForAuth")
    else:
        print("Warning: old_role_fields not found")

    # 2. Update switchAuthTab
    old_switch = """// 3. Switch between Sign In and Create Account tabs
function switchAuthTab(tab) {
  const tabSignin = document.getElementById('tab-auth-signin');
  const tabSignup = document.getElementById('tab-auth-signup');
  const formSignin = document.getElementById('auth-form-signin');
  const formSignup = document.getElementById('auth-form-signup');
  const panelOtp = document.getElementById('auth-panel-otp');

  if (panelOtp) panelOtp.classList.add('hidden');

  if (tab === 'signin') {
    if (tabSignin) tabSignin.className = 'py-2 text-xs font-bold rounded-lg transition-all bg-white text-slate-900 shadow-sm';
    if (tabSignup) tabSignup.className = 'py-2 text-xs font-bold rounded-lg transition-all text-slate-500 hover:text-slate-800';
    if (formSignin) formSignin.classList.remove('hidden');
    if (formSignup) formSignup.classList.add('hidden');
  } else {
    if (tabSignup) tabSignup.className = 'py-2 text-xs font-bold rounded-lg transition-all bg-white text-slate-900 shadow-sm';
    if (tabSignin) tabSignin.className = 'py-2 text-xs font-bold rounded-lg transition-all text-slate-500 hover:text-slate-800';
    if (formSignin) formSignin.classList.add('hidden');
    if (formSignup) formSignup.classList.remove('hidden');
  }
}"""

    new_switch = """// 3. Switch between Sign In and Create Account tabs
function switchAuthTab(tab) {
  const tabSignin = document.getElementById('tab-auth-signin');
  const tabSignup = document.getElementById('tab-auth-signup');
  const formSignin = document.getElementById('auth-form-signin');
  const formSignup = document.getElementById('auth-form-signup');
  const panelOtp = document.getElementById('auth-panel-otp');

  if (panelOtp) panelOtp.classList.add('hidden');

  const curLang = (typeof state !== 'undefined' && state.currentLanguage) || 'en';
  const role = selectedAuthRole || 'senior';
  const cfg = authRoleConfigs[role] || authRoleConfigs.senior;

  if (tab === 'signin') {
    if (tabSignin) tabSignin.className = 'py-2 text-xs font-bold rounded-lg transition-all bg-white text-slate-900 shadow-sm';
    if (tabSignup) tabSignup.className = 'py-2 text-xs font-bold rounded-lg transition-all text-slate-500 hover:text-slate-800';
    if (formSignin) formSignin.classList.remove('hidden');
    if (formSignup) formSignup.classList.add('hidden');
  } else {
    if (tabSignup) tabSignup.className = 'py-2 text-xs font-bold rounded-lg transition-all bg-white text-slate-900 shadow-sm';
    if (tabSignin) tabSignin.className = 'py-2 text-xs font-bold rounded-lg transition-all text-slate-500 hover:text-slate-800';
    if (formSignin) formSignin.classList.add('hidden');
    if (formSignup) formSignup.classList.remove('hidden');

    // Populate role fields and button text
    const roleFieldsContainer = document.getElementById('signup-role-specific-fields');
    if (roleFieldsContainer && cfg.signupFieldsHtml) {
      roleFieldsContainer.innerHTML = typeof cfg.signupFieldsHtml === 'object' ? (cfg.signupFieldsHtml[curLang] || cfg.signupFieldsHtml.en) : cfg.signupFieldsHtml;
    }
    const btnSignupLabel = document.getElementById('btn-signup-label');
    if (btnSignupLabel) {
      btnSignupLabel.textContent = (curLang === 'hi')
        ? `${getRoleDisplayName(role, 'hi')} खाता बनाएं एवं पोर्टल खोलें`
        : `Create Account & Enter ${getRoleDisplayName(role, 'en')} Portal`;
    }
  }
}"""

    if old_switch in content:
        content = content.replace(old_switch, new_switch)
        print("Replaced switchAuthTab")
    else:
        print("Warning: old_switch not found")

    # 3. Update sendPasswordResetOtp and verifyOtpAndLogin and handleSignInSubmit and handleSignUpSubmit
    old_auth_handlers = """// 6. Send OTP Simulation
function sendPasswordResetOtp() {
  const recipient = document.getElementById('otp-input-recipient')?.value || 'user@careconnect.in';
  activeOtpCode = Math.floor(1000 + Math.random() * 9000).toString();

  soundEngine.playTone(650, 'sine', 0.15);
  const banner = document.getElementById('otp-live-banner');
  const codeDisplay = document.getElementById('otp-code-display');
  const timerLabel = document.getElementById('otp-timer-label');

  if (codeDisplay) codeDisplay.textContent = activeOtpCode;
  if (banner) banner.classList.remove('hidden');

  // Auto-fill OTP fields for seamless testing
  document.getElementById('otp-d1').value = activeOtpCode[0];
  document.getElementById('otp-d2').value = activeOtpCode[1];
  document.getElementById('otp-d3').value = activeOtpCode[2];
  document.getElementById('otp-d4').value = activeOtpCode[3];

  let seconds = 30;
  if (otpTimerInterval) clearInterval(otpTimerInterval);
  otpTimerInterval = setInterval(() => {
    seconds--;
    if (timerLabel) timerLabel.textContent = `0:${seconds < 10 ? '0' : ''}${seconds}s`;
    if (seconds <= 0) {
      clearInterval(otpTimerInterval);
    }
  }, 1000);

  showToast(`OTP ${activeOtpCode} dispatched to ${recipient}`, 'success');
}

// 7. Verify OTP and Sign In
function verifyOtpAndLogin() {
  const d1 = document.getElementById('otp-d1')?.value || '';
  const d2 = document.getElementById('otp-d2')?.value || '';
  const d3 = document.getElementById('otp-d3')?.value || '';
  const d4 = document.getElementById('otp-d4')?.value || '';
  const entered = d1 + d2 + d3 + d4;

  if (entered.length < 4) {
    showToast('Please enter the complete 4-digit OTP', 'warning');
    return;
  }

  soundEngine.playSuccessChime();
  showToast('OTP verified successfully! Access granted.', 'success');
  const cfg = authRoleConfigs[selectedAuthRole];
  enterDashboard(selectedAuthRole, {
    name: cfg.defaultName,
    email: cfg.defaultEmail,
    role: selectedAuthRole,
    badge: cfg.defaultBadge,
    initials: cfg.avatarInitials
  });
}

// 8. Handle Standard Sign In
function handleSignInSubmit(e) {
  if (e) e.preventDefault();
  const email = document.getElementById('signin-email')?.value.trim();
  const password = document.getElementById('signin-password')?.value;

  if (!email || !password) {
    showToast('Please fill in both email and password', 'warning');
    return;
  }

  const cfg = authRoleConfigs[selectedAuthRole];
  soundEngine.playSuccessChime();
  enterDashboard(selectedAuthRole, {
    name: cfg.defaultName,
    email: email,
    role: selectedAuthRole,
    badge: cfg.defaultBadge,
    initials: cfg.avatarInitials
  });
}"""

    new_auth_handlers = """// 6. Send OTP Simulation
function sendPasswordResetOtp() {
  const recipient = document.getElementById('otp-input-recipient')?.value || 'user@careconnect.in';
  activeOtpCode = Math.floor(1000 + Math.random() * 9000).toString();

  soundEngine.playTone(650, 'sine', 0.15);
  const banner = document.getElementById('otp-live-banner');
  const codeDisplay = document.getElementById('otp-code-display');
  const timerLabel = document.getElementById('otp-timer-label');

  if (codeDisplay) codeDisplay.textContent = activeOtpCode;
  if (banner) banner.classList.remove('hidden');

  // Auto-fill OTP fields for seamless testing
  const d1 = document.getElementById('otp-d1');
  const d2 = document.getElementById('otp-d2');
  const d3 = document.getElementById('otp-d3');
  const d4 = document.getElementById('otp-d4');
  if (d1) d1.value = activeOtpCode[0];
  if (d2) d2.value = activeOtpCode[1];
  if (d3) d3.value = activeOtpCode[2];
  if (d4) d4.value = activeOtpCode[3];

  let seconds = 30;
  if (otpTimerInterval) clearInterval(otpTimerInterval);
  otpTimerInterval = setInterval(() => {
    seconds--;
    if (timerLabel) timerLabel.textContent = `0:${seconds < 10 ? '0' : ''}${seconds}s`;
    if (seconds <= 0) {
      clearInterval(otpTimerInterval);
    }
  }, 1000);

  // Notify backend API
  try {
    fetch('/api/auth/otp/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ recipient: recipient, role: selectedAuthRole })
    }).catch(() => {});
  } catch(e) {}

  showToast(`OTP ${activeOtpCode} dispatched to ${recipient}`, 'success');
}

// 7. Verify OTP and Sign In
function verifyOtpAndLogin() {
  const d1 = document.getElementById('otp-d1')?.value || '';
  const d2 = document.getElementById('otp-d2')?.value || '';
  const d3 = document.getElementById('otp-d3')?.value || '';
  const d4 = document.getElementById('otp-d4')?.value || '';
  const entered = d1 + d2 + d3 + d4;

  if (entered.length < 4) {
    showToast('Please enter the complete 4-digit OTP', 'warning');
    return;
  }

  const role = selectedAuthRole || 'senior';
  const cfg = authRoleConfigs[role] || authRoleConfigs.senior;

  soundEngine.playSuccessChime();
  showToast('OTP verified successfully! Access granted.', 'success');

  // Check if profile exists in localStorage
  let prof = null;
  try {
    prof = JSON.parse(localStorage.getItem(`careconnect_profile_${role}`));
  } catch(e) {}
  const userName = (prof && prof.name) ? prof.name : cfg.defaultName;
  const parts = userName.split(' ');
  const initials = parts.length > 1 ? (parts[0][0] + parts[1][0]).toUpperCase() : userName.substring(0, 2).toUpperCase();

  enterDashboard(role, {
    name: userName,
    email: (prof && prof.email) ? prof.email : cfg.defaultEmail,
    role: role,
    badge: cfg.defaultBadge,
    initials: initials
  });
}

// 8. Handle Standard Sign In
function handleSignInSubmit(e) {
  if (e) e.preventDefault();
  const email = document.getElementById('signin-email')?.value.trim();
  const password = document.getElementById('signin-password')?.value;

  if (!email || !password) {
    showToast('Please fill in both email and password', 'warning');
    return;
  }

  const role = selectedAuthRole || 'senior';
  const cfg = authRoleConfigs[role] || authRoleConfigs.senior;

  // Check if this user registered in localStorage
  let matchedUser = null;
  try {
    const users = JSON.parse(localStorage.getItem('careconnect_users') || '[]');
    matchedUser = users.find(u => u.role === role && (u.email.toLowerCase() === email.toLowerCase() || u.email === email));
  } catch(err) {}

  let prof = null;
  try {
    prof = JSON.parse(localStorage.getItem(`careconnect_profile_${role}`));
  } catch(e) {}

  const userName = matchedUser ? matchedUser.name : (prof && prof.name ? prof.name : cfg.defaultName);
  const parts = userName.split(' ');
  const userInitials = parts.length > 1 ? (parts[0][0] + parts[1][0]).toUpperCase() : userName.substring(0, 2).toUpperCase();

  soundEngine.playSuccessChime();

  // Update UI headers
  if (role === 'coordinator') {
    const topName = document.getElementById('coord-topbar-name');
    const greetName = document.getElementById('coord-greeting-name');
    if (topName) topName.textContent = userName;
    if (greetName) greetName.textContent = userName;
  } else if (role === 'senior') {
    const greetEl = document.getElementById('senior-greeting');
    if (greetEl) greetEl.textContent = `Good Morning, ${userName} ji! 👋`;
  }

  // Inform backend via REST API
  try {
    fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: role, email: email, password: password })
    }).catch(() => {});
  } catch (e) {}

  enterDashboard(role, {
    name: userName,
    email: email,
    role: role,
    badge: cfg.defaultBadge,
    initials: userInitials
  });
  showToast(`Welcome back, ${userName}!`, 'success');
}"""

    if old_auth_handlers in content:
        content = content.replace(old_auth_handlers, new_auth_handlers)
        print("Replaced sendPasswordResetOtp, verifyOtpAndLogin, and handleSignInSubmit")
    else:
        print("Warning: old_auth_handlers not found")

    # 4. Update handleSignUpSubmit
    old_signup = """// 11. Handle Create Account (Sign Up)
function handleSignUpSubmit(e) {
  if (e) e.preventDefault();
  const name = document.getElementById('signup-name')?.value.trim();
  const email = document.getElementById('signup-email')?.value.trim();
  const password = document.getElementById('signup-password')?.value;

  if (!name || !email || !password) {
    showToast('Please complete all required fields to create your account', 'warning');
    return;
  }

  const cfg = authRoleConfigs[selectedAuthRole];
  soundEngine.playSuccessChime();
  
  // Compute initials
  const parts = name.split(' ');
  const initials = parts.length > 1 ? (parts[0][0] + parts[1][0]).toUpperCase() : name.substring(0, 2).toUpperCase();

  // Create initial profile for the new user marking profileCompleted as false
  const newProfile = {
    role: selectedAuthRole,
    name: name,
    email: email,
    dob: '',
    age: '',
    gender: '',
    phone: '',
    profileCompleted: false,
    isNewUser: true
  };
  try {
    localStorage.setItem(`careconnect_profile_${selectedAuthRole}`, JSON.stringify(newProfile));
    sessionStorage.removeItem('careconnect_dismiss_profile_prompt');
  } catch (err) {
    console.error('Failed to initialize new user profile in localStorage:', err);
  }

  enterDashboard(selectedAuthRole, {
    name: name,
    email: email,
    role: selectedAuthRole,
    badge: `${getRoleDisplayName(selectedAuthRole)} (New Member)`,
    initials: initials
  });

  showToast(`Account created successfully! Welcome to CareConnect, ${name}`, 'success');
}"""

    new_signup = """// 11. Handle Create Account (Sign Up)
function handleSignUpSubmit(e) {
  if (e) e.preventDefault();
  const name = document.getElementById('signup-name')?.value.trim();
  const email = document.getElementById('signup-email')?.value.trim();
  const password = document.getElementById('signup-password')?.value;

  if (!name || !email || !password) {
    showToast('Please complete all required fields to create your account', 'warning');
    return;
  }

  const role = selectedAuthRole || 'senior';
  const cfg = authRoleConfigs[role] || authRoleConfigs.senior;
  soundEngine.playSuccessChime();
  
  // Compute initials
  const parts = name.split(' ');
  const initials = parts.length > 1 ? (parts[0][0] + parts[1][0]).toUpperCase() : name.substring(0, 2).toUpperCase();

  // Extract role-specific extra fields
  let extraData = {};
  if (role === 'senior') {
    const ageVal = parseInt(document.getElementById('signup-age')?.value) || 74;
    const genderVal = document.getElementById('signup-gender')?.value || 'Male';
    const contactVal = document.getElementById('signup-contact')?.value || '';
    extraData = { age: ageVal, gender: genderVal, contact: contactVal };
  } else if (role === 'coordinator') {
    const desigVal = document.getElementById('signup-designation')?.value || 'Registered Nurse (RN)';
    const licVal = document.getElementById('signup-license')?.value || 'RN-DL-49201';
    extraData = { designation: desigVal, license: licVal };
  } else if (role === 'family') {
    const relVal = document.getElementById('signup-relation')?.value || 'Son';
    const seniorVal = document.getElementById('signup-linked-senior')?.value || 'Ramesh Sharma';
    extraData = { relation: relVal, linkedSenior: seniorVal };
  } else if (role === 'operations') {
    const cityVal = document.getElementById('signup-city')?.value || 'Delhi NCR';
    const secKeyVal = document.getElementById('signup-seckey')?.value || 'OPS-SEC-9981';
    extraData = { city: cityVal, secKey: secKeyVal };
  }

  // Create initial profile for the new user
  const newProfile = {
    role: role,
    name: name,
    email: email,
    dob: '',
    phone: '',
    profileCompleted: true,
    isNewUser: false,
    ...extraData
  };
  try {
    localStorage.setItem(`careconnect_profile_${role}`, JSON.stringify(newProfile));
    
    // Store in registered users directory
    let users = [];
    try {
      users = JSON.parse(localStorage.getItem('careconnect_users') || '[]');
    } catch(err) { users = []; }
    users = users.filter(u => !(u.email === email && u.role === role));
    users.push({
      name: name,
      email: email,
      password: password,
      role: role,
      extra: extraData
    });
    localStorage.setItem('careconnect_users', JSON.stringify(users));
  } catch (err) {
    console.error('Failed to save user profile in localStorage:', err);
  }

  // Non-blocking fetch to backend API
  try {
    fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: role, name: name, email: email, ...extraData })
    }).catch(() => {});
  } catch (e) {}

  // Update UI headers & badges according to role
  if (role === 'coordinator') {
    const topName = document.getElementById('coord-topbar-name');
    const greetName = document.getElementById('coord-greeting-name');
    if (topName) topName.textContent = name;
    if (greetName) greetName.textContent = name;
  } else if (role === 'senior') {
    const greetEl = document.getElementById('senior-greeting');
    if (greetEl) greetEl.textContent = `Good Morning, ${name} ji! 👋`;
    const vitalsMeta = document.getElementById('senior-vitals-meta-badge');
    if (vitalsMeta) vitalsMeta.textContent = `${extraData.age || 74} Yrs • ${extraData.gender || 'Male'} • New Delhi`;
    const ageInput = document.getElementById('assess-age');
    if (ageInput && extraData.age) ageInput.value = extraData.age;
    const genderInput = document.getElementById('assess-gender');
    if (genderInput && extraData.gender) genderInput.value = extraData.gender;
  }

  enterDashboard(role, {
    name: name,
    email: email,
    role: role,
    badge: `${getRoleDisplayName(role)}`,
    initials: initials
  });

  showToast(`Account created successfully! Welcome to CareConnect, ${name}`, 'success');
}"""

    if old_signup in content:
        content = content.replace(old_signup, new_signup)
        print("Replaced handleSignUpSubmit")
    else:
        print("Warning: old_signup not found")

    # 5. Update openAddReminderPage
    old_open_page = """function openAddReminderPage() {
  if (typeof toggleSlideDrawer === 'function') toggleSlideDrawer(false);
  
  const allViews = ['coordinator', 'senior', 'family', 'operations'];
  allViews.forEach(v => {
    const el = document.getElementById(`view-${v}`);
    if (el) el.classList.add('hidden');
  });

  const page = document.getElementById('view-add-reminder');
  if (page) page.classList.remove('hidden');

  const header = document.getElementById('global-header');
  if (header) header.classList.remove('hidden');

  window.scrollTo({ top: 0, behavior: 'smooth' });
}"""

    new_open_page = """function openAddReminderPage() {
  if (typeof toggleSlideDrawer === 'function') toggleSlideDrawer(false);
  
  const allViews = ['coordinator', 'senior', 'family', 'operations'];
  allViews.forEach(v => {
    const el = document.getElementById(`view-${v}`);
    if (el) el.classList.add('hidden');
  });

  const page = document.getElementById('view-add-reminder');
  if (page) page.classList.remove('hidden');

  const header = document.getElementById('global-header');
  if (header) header.classList.remove('hidden');

  if (typeof renderSeniorReminders === 'function') {
    renderSeniorReminders(currentRemindersFilter || 'all');
  }
  if (typeof updateHydrationUi === 'function') {
    updateHydrationUi();
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
}"""

    if old_open_page in content:
        content = content.replace(old_open_page, new_open_page)
        print("Replaced openAddReminderPage")
    else:
        print("Warning: old_open_page not found")

    # 6. Update handleSaveNewReminder to keep list rendered in view-add-reminder
    old_save_reminder = """  // Close page view or modal
  const pageView = document.getElementById('view-add-reminder');
  if (pageView && !pageView.classList.contains('hidden')) {
    closeAddReminderPage();
    setTimeout(scrollToRemindersSection, 150);
  } else {
    const modal = document.getElementById('modal-add-reminder');
    if (modal) modal.classList.add('hidden');
  }

  soundEngine.playSuccessChime();
  showToast(`Reminder saved: ${title} at ${newReminder.timeDisplay}! ⏰`, 'success');"""

    new_save_reminder = """  // Reset form inputs for next reminder
  const tInput = document.getElementById('rem-page-input-title') || document.getElementById('rem-input-title');
  if (tInput) tInput.value = '';
  const nInput = document.getElementById('rem-page-input-notes') || document.getElementById('rem-input-notes');
  if (nInput) nInput.value = '';

  const remSec = document.getElementById('senior-reminders-section');
  if (remSec) {
    remSec.scrollIntoView({ behavior: 'smooth' });
  }

  const modal = document.getElementById('modal-add-reminder');
  if (modal && !modal.classList.contains('hidden')) modal.classList.add('hidden');

  soundEngine.playSuccessChime();
  showToast(`Reminder saved: ${title} at ${newReminder.timeDisplay}! ⏰`, 'success');"""

    if old_save_reminder in content:
        content = content.replace(old_save_reminder, new_save_reminder)
        print("Replaced handleSaveNewReminder")
    else:
        print("Warning: old_save_reminder not found")

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Finished updating {filepath}")

if __name__ == '__main__':
    update_file('app.js')
    import os
    if os.path.exists('Deviathon/app.js'):
        update_file('Deviathon/app.js')

