# -*- coding: utf-8 -*-
import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('app.js', 'r', encoding='utf-8') as f:
    app_js = f.read()

target = """  // Render role-specific signup fields
  if (roleFieldsContainer) {
    roleFieldsContainer.innerHTML = cfg.signupFieldsHtml;
  }"""

replacement = """  // Render role-specific signup fields with language resolution
  if (roleFieldsContainer) {
    const lang = state.currentLanguage || 'en';
    roleFieldsContainer.innerHTML = typeof cfg.signupFieldsHtml === 'object'
      ? (cfg.signupFieldsHtml[lang] || cfg.signupFieldsHtml.en)
      : cfg.signupFieldsHtml;
  }

  // Onboarding Signin Tab: Add patient and caregiver dual brackets card if Family role
  const existingSigninCard = document.getElementById('auth-family-signin-patient-card');
  if (existingSigninCard) existingSigninCard.remove();

  if (role === 'family') {
    const formSignin = document.getElementById('auth-form-signin');
    if (formSignin) {
      const card = document.createElement('div');
      card.id = 'auth-family-signin-patient-card';
      card.className = 'p-3 bg-purple-50/90 border border-purple-200 rounded-2xl space-y-1.5 mb-2 shadow-sm';
      card.innerHTML = `
        <div class="text-xs font-bold text-slate-800 flex flex-wrap items-center gap-1.5">
          <span class="text-slate-500 font-semibold">Linked Patient:</span>
          <span class="text-purple-950 font-extrabold text-sm">Ramesh Sharma</span>
          <span class="text-xs font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded-md border border-purple-300">[Father • 74 Yrs • Male]</span>
        </div>
        <div class="text-xs font-medium text-slate-600 flex flex-wrap items-center gap-1 pt-1 border-t border-purple-200/60">
          <span class="text-slate-500 font-semibold">Connected Person:</span>
          <span class="text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200">[Caregiver: Rahul Sharma • Male • 42 Yrs]</span>
        </div>
      `;
      formSignin.insertBefore(card, formSignin.firstChild);
    }
  }"""

if target in app_js:
    app_js = app_js.replace(target, replacement)
    print("Fixed roleFieldsContainer language resolution and added signin dual brackets card!")
else:
    print("Target not found in app.js")

with open('app.js', 'w', encoding='utf-8') as f:
    f.write(app_js)

print("app.js updated.")

