import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Global Header Profile Button
old_header_user = '''          <!-- Current Logged User Profile -->
          <div class="flex items-center pl-2 border-l border-slate-200 space-x-2.5">
            <div id="current-user-avatar"
              class="w-8 h-8 rounded-full bg-teal-100 border border-teal-300 text-teal-800 flex items-center justify-center font-bold text-xs">
              CC
            </div>
            <div class="hidden lg:block text-left">
              <div id="current-user-name" class="text-xs font-bold text-slate-800">Nurse Kavita</div>
              <div id="current-user-role-label"
                class="text-[10px] text-[#00a896] font-semibold uppercase tracking-wider">Care Coordinator</div>
            </div>
          </div>'''

new_header_user = '''          <!-- Current Logged User Profile (Clickable to Manage Profile) -->
          <div onclick="openProfileModal()"
            class="flex items-center pl-2 border-l border-slate-200 space-x-2.5 cursor-pointer hover:bg-slate-100/80 px-2 py-1 rounded-xl transition-all"
            title="Click to view and edit profile / प्रोफाइल प्रबंधित करें">
            <div id="current-user-avatar"
              class="w-8 h-8 rounded-full bg-teal-100 border border-teal-300 text-teal-800 flex items-center justify-center font-bold text-xs shadow-sm">
              CC
            </div>
            <div class="hidden lg:block text-left">
              <div id="current-user-name" class="text-xs font-bold text-slate-800">Nurse Kavita</div>
              <div id="current-user-role-label"
                class="text-[10px] text-[#00a896] font-semibold uppercase tracking-wider">Care Coordinator</div>
            </div>
          </div>

          <!-- Dedicated Profile Management Button in Header -->
          <button onclick="openProfileModal()"
            class="inline-flex items-center px-2.5 py-1.5 border border-slate-200 text-xs font-bold rounded-xl text-slate-700 bg-white hover:bg-slate-50 transition-all shadow-sm"
            title="Manage Profile / प्रोफाइल प्रबंधित करें">
            <i class="fa-solid fa-user-pen mr-1 text-teal-600"></i>
            <span class="hidden sm:inline">Profile</span>
          </button>'''

# 2. Coordinator Toolbar Profile Button
old_coord_btns = '''          <button onclick="refreshCoordinatorQueue()"
            class="inline-flex items-center px-3 py-2 border border-slate-200 text-xs font-medium rounded-xl text-slate-700 bg-white hover:bg-slate-50 transition-all shadow-sm"
            title="Refresh List">
            <i class="fa-solid fa-arrows-rotate mr-1.5 text-slate-400"></i>
            <span>Sync</span>
          </button>
        </div>'''

new_coord_btns = '''          <button onclick="refreshCoordinatorQueue()"
            class="inline-flex items-center px-3 py-2 border border-slate-200 text-xs font-medium rounded-xl text-slate-700 bg-white hover:bg-slate-50 transition-all shadow-sm"
            title="Refresh List">
            <i class="fa-solid fa-arrows-rotate mr-1.5 text-slate-400"></i>
            <span>Sync</span>
          </button>
          <button onclick="openProfileModal()"
            class="inline-flex items-center px-3 py-2 border border-teal-200 text-xs font-bold rounded-xl text-teal-800 bg-teal-50 hover:bg-teal-100 transition-all shadow-sm"
            title="Manage Coordinator Profile & Credentials">
            <i class="fa-solid fa-user-nurse mr-1.5 text-teal-600"></i>
            <span>Coordinator Profile</span>
          </button>
        </div>'''

# 3. Senior View Header Profile Button
old_senior_lang = '''          <!-- Bilingual Language Switcher (Hindi / English) -->
          <div class="flex flex-col items-center sm:items-end">
            <span class="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">भाषा चुनें / Choose
              Language</span>
            <div class="inline-flex rounded-2xl border-2 border-[#00a896] p-1 bg-teal-50">
              <button onclick="setSeniorLanguage('en')" id="lang-btn-en"
                class="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all bg-[#00a896] text-white shadow-sm">
                English 🇬🇧
              </button>
              <button onclick="setSeniorLanguage('hi')" id="lang-btn-hi"
                class="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all text-teal-800 hover:bg-teal-100">
                हिन्दी 🇮🇳
              </button>
            </div>
          </div>'''

new_senior_lang = '''          <!-- Bilingual Language Switcher & Profile Button -->
          <div class="flex flex-col sm:flex-row items-center sm:items-end gap-2.5">
            <div class="flex flex-col items-center sm:items-end">
              <span class="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">भाषा चुनें / Choose Language</span>
              <div class="inline-flex rounded-2xl border-2 border-[#00a896] p-1 bg-teal-50">
                <button onclick="setSeniorLanguage('en')" id="lang-btn-en"
                  class="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all bg-[#00a896] text-white shadow-sm">
                  English 🇬🇧
                </button>
                <button onclick="setSeniorLanguage('hi')" id="lang-btn-hi"
                  class="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all text-teal-800 hover:bg-teal-100">
                  हिन्दी 🇮🇳
                </button>
              </div>
            </div>
            <button onclick="openProfileModal()"
              class="inline-flex items-center px-3.5 py-2 rounded-2xl border-2 border-sky-300 text-xs sm:text-sm font-extrabold text-sky-800 bg-sky-50 hover:bg-sky-100 shadow-sm transition-all"
              title="View and Edit Health Profile">
              <i class="fa-solid fa-address-card mr-1.5 text-sky-600 text-base"></i>
              <span>My Profile / मेरी प्रोफाइल</span>
            </button>
          </div>'''

# 4. Family Care Circle Section in Senior View
old_sos_section = '''        <!-- SENIOR EMERGENCY SOS SECTION (Peace of Mind) -->'''

new_family_circle = '''        <!-- SENIOR FAMILY CARE CIRCLE & CAREGIVERS -->
        <div class="bg-white rounded-3xl p-6 sm:p-8 border-2 border-indigo-200/90 shadow-md mb-6 transition-all">
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div class="flex items-center space-x-3.5">
              <div class="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center text-xl shadow-sm">
                <i class="fa-solid fa-people-roof"></i>
              </div>
              <div>
                <div class="flex items-center space-x-2">
                  <h3 class="text-lg sm:text-xl font-extrabold text-[#0e294b]">Family Care Circle / परिवार व देखभालकर्ता</h3>
                  <span class="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-100 text-indigo-800">
                    <i class="fa-solid fa-shield-heart mr-1"></i> Connected
                  </span>
                </div>
                <p class="text-xs sm:text-sm text-slate-500 font-medium">
                  Connected family members who receive instant SOS emergency alerts, weekly health digests, and medication alerts.
                </p>
              </div>
            </div>
            <button onclick="openAddFamilyMemberModal()"
              class="px-4 py-2.5 rounded-xl bg-[#0e294b] hover:bg-slate-800 text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center space-x-2 flex-shrink-0">
              <i class="fa-solid fa-user-plus text-indigo-400"></i>
              <span>+ Add Family Member / सदस्य जोड़ें</span>
            </button>
          </div>

          <!-- Dynamic Family Members List -->
          <div id="senior-family-members-list" class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
            <!-- Injected by renderFamilyCareCircle() in app.js -->
          </div>
        </div>

        <!-- SENIOR EMERGENCY SOS SECTION (Peace of Mind) -->'''

# 5. Family View Toolbar Profile Button
old_family_filter = '''        <div class="flex items-center space-x-2">
          <!-- Notification Filter Preference Badge -->
          <span
            class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
            <i class="fa-solid fa-filter text-purple-600 mr-1.5"></i> Serious Alerts Only: <strong
              class="ml-1 text-emerald-600">Active</strong>
          </span>
        </div>'''

new_family_filter = '''        <div class="flex items-center space-x-2">
          <!-- Notification Filter Preference Badge -->
          <span
            class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
            <i class="fa-solid fa-filter text-purple-600 mr-1.5"></i> Serious Alerts Only: <strong
              class="ml-1 text-emerald-600">Active</strong>
          </span>
          <button onclick="openProfileModal()"
            class="inline-flex items-center px-3 py-1.5 border border-purple-300 text-xs font-bold rounded-xl text-purple-800 bg-purple-50 hover:bg-purple-100 transition-all shadow-sm"
            title="Manage Family Member Profile & Alert Channels">
            <i class="fa-solid fa-user-gear mr-1.5 text-purple-600"></i>
            <span>Family Profile</span>
          </button>
        </div>'''

# 6. Operations View Toolbar Profile Button
old_ops_filter = '''        <!-- City and Team Dropdown Filters -->
        <div class="flex flex-wrap items-center gap-2">'''

new_ops_filter = '''        <!-- City and Team Dropdown Filters -->
        <div class="flex flex-wrap items-center gap-2">
          <button onclick="openProfileModal()"
            class="inline-flex items-center px-3 py-1.5 border border-orange-300 text-xs font-bold rounded-xl text-orange-800 bg-orange-50 hover:bg-orange-100 transition-all shadow-sm"
            title="Operations Director Profile & Security Clearance">
            <i class="fa-solid fa-shield-halved mr-1.5 text-orange-600"></i>
            <span>Ops Profile</span>
          </button>'''

# 7. Modals at the bottom
modals_html = '''
  <!-- ========================================================================= -->
  <!-- MODAL: UNIVERSAL PROFILE MANAGEMENT (FOR ALL 4 PORTALS)                   -->
  <!-- ========================================================================= -->
  <div id="modal-profile-management"
    class="hidden fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
    <div class="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl border border-slate-200 my-8 transition-all">
      <!-- Modal Header -->
      <div class="flex items-center justify-between pb-4 border-b border-slate-200 mb-6">
        <div class="flex items-center space-x-3">
          <div id="modal-profile-role-avatar" class="w-12 h-12 rounded-2xl bg-teal-600 text-white flex items-center justify-center text-xl font-bold shadow-sm">
            RS
          </div>
          <div>
            <div class="flex items-center space-x-2">
              <h3 id="modal-profile-title" class="text-xl font-extrabold text-[#0e294b]">Manage Profile</h3>
              <span id="modal-profile-role-badge" class="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-sky-100 text-sky-800">
                Senior Citizen
              </span>
            </div>
            <p id="modal-profile-subtitle" class="text-xs text-slate-500 font-medium">
              Update personal details, contact information, and preferences
            </p>
          </div>
        </div>
        <button onclick="closeProfileModal()" class="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-700 flex items-center justify-center transition-colors">
          <i class="fa-solid fa-xmark text-lg"></i>
        </button>
      </div>

      <!-- Dynamic Profile Form Container -->
      <form id="profile-management-form" onsubmit="event.preventDefault(); saveUserProfile();" class="space-y-4">
        <div id="profile-dynamic-fields-container" class="space-y-4">
          <!-- Injected dynamically by renderProfileFields() based on activeRole -->
        </div>

        <!-- Form Actions -->
        <div class="flex items-center justify-end space-x-3 pt-5 border-t border-slate-200 mt-6">
          <button type="button" onclick="closeProfileModal()"
            class="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">
            Cancel / रद्द करें
          </button>
          <button type="submit"
            class="px-6 py-2.5 text-xs font-extrabold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-md transition-all flex items-center space-x-2">
            <i class="fa-solid fa-floppy-disk"></i>
            <span>Save Profile / प्रोफाइल सहेजें</span>
          </button>
        </div>
      </form>
    </div>
  </div>


  <!-- ========================================================================= -->
  <!-- MODAL: ADD FAMILY MEMBER TO SENIOR CARE CIRCLE                            -->
  <!-- ========================================================================= -->
  <div id="modal-add-family-member"
    class="hidden fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
    <div class="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-200 my-8 transition-all">
      <!-- Modal Header -->
      <div class="flex items-center justify-between pb-4 border-b border-slate-200 mb-5">
        <div class="flex items-center space-x-3">
          <div class="w-11 h-11 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center text-xl shadow-sm">
            <i class="fa-solid fa-user-plus"></i>
          </div>
          <div>
            <h3 class="text-lg font-extrabold text-[#0e294b]">Add Family Member / नया सदस्य जोड़ें</h3>
            <p class="text-xs text-slate-500 font-medium">Link a family member or caregiver to elder's circle</p>
          </div>
        </div>
        <button onclick="closeAddFamilyMemberModal()" class="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-700 flex items-center justify-center transition-colors">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>

      <!-- Add Family Form -->
      <form id="add-family-member-form" onsubmit="event.preventDefault(); submitAddFamilyMember();" class="space-y-4">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">Full Name (पूरा नाम) *</label>
            <input type="text" id="new-fam-name" required placeholder="e.g. Rahul Sharma"
              class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none">
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">Relationship (रिश्ता) *</label>
            <select id="new-fam-relation" required
              class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 bg-white">
              <option value="Son (बेटा)">Son (बेटा)</option>
              <option value="Daughter (बेटी)">Daughter (बेटी)</option>
              <option value="Spouse (जीवनसाथी)">Spouse (जीवनसाथी)</option>
              <option value="Grandchild (पोता / पोती)">Grandchild (पोता / पोती)</option>
              <option value="Daughter-in-law (बहू)">Daughter-in-law (बहू)</option>
              <option value="Son-in-law (दामाद)">Son-in-law (दामाद)</option>
              <option value="Primary Caregiver (देखभालकर्ता)">Primary Caregiver (देखभालकर्ता)</option>
              <option value="Other Relative (अन्य रिश्तेदार)">Other Relative (अन्य)</option>
            </select>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">Mobile / WhatsApp No. (+91) *</label>
            <input type="tel" id="new-fam-phone" required placeholder="+91 98111-XXXXX"
              class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none">
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">Email Address (ईमेल)</label>
            <input type="email" id="new-fam-email" placeholder="name@example.com"
              class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none">
          </div>
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">Living Situation (रहने की स्थिति)</label>
          <select id="new-fam-residence"
            class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 bg-white">
            <option value="Lives with elder (साथ रहते हैं)">Lives in same house (साथ रहते हैं)</option>
            <option value="Same city (उसी शहर में)">Same city / Nearby (उसी शहर में)</option>
            <option value="Different city / Metro (दूसरे शहर में)">Different city / Outstation (दूसरे शहर में)</option>
            <option value="Overseas / NRI (विदेश में)">Overseas / NRI (विदेश में)</option>
          </select>
        </div>

        <!-- Alert Permissions Checkboxes -->
        <div class="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-2">
          <label class="block text-xs font-bold text-slate-800 mb-1">Notification Permissions (अलर्ट प्राथमिकताएं):</label>
          <label class="flex items-center space-x-2 text-xs text-slate-700 cursor-pointer">
            <input type="checkbox" id="new-fam-alert-sos" checked class="rounded text-indigo-600 focus:ring-indigo-500">
            <span><strong>Immediate SOS Alerts:</strong> Instant WhatsApp & SMS on fall, chest pain, or distress</span>
          </label>
          <label class="flex items-center space-x-2 text-xs text-slate-700 cursor-pointer">
            <input type="checkbox" id="new-fam-alert-daily" checked class="rounded text-indigo-600 focus:ring-indigo-500">
            <span><strong>Daily Check-in Digest:</strong> Morning check-in status and vital signs</span>
          </label>
          <label class="flex items-center space-x-2 text-xs text-slate-700 cursor-pointer">
            <input type="checkbox" id="new-fam-alert-weekly" checked class="rounded text-indigo-600 focus:ring-indigo-500">
            <span><strong>Weekly Health Summary:</strong> Filtered doctor report & mobility trends</span>
          </label>
        </div>

        <!-- Form Actions -->
        <div class="flex items-center justify-end space-x-3 pt-4 border-t border-slate-200">
          <button type="button" onclick="closeAddFamilyMemberModal()"
            class="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">
            Cancel
          </button>
          <button type="submit"
            class="px-5 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md transition-all flex items-center space-x-2">
            <i class="fa-solid fa-check"></i>
            <span>Add to Family Circle / जोड़ें</span>
          </button>
        </div>
      </form>
    </div>
  </div>
'''

changes = [
    (old_header_user, new_header_user, "Global Header User Profile & Button"),
    (old_coord_btns, new_coord_btns, "Coordinator Toolbar Profile Button"),
    (old_senior_lang, new_senior_lang, "Senior Header Profile Button"),
    (old_sos_section, new_family_circle, "Senior Family Care Circle Section"),
    (old_family_filter, new_family_filter, "Family Toolbar Profile Button"),
    (old_ops_filter, new_ops_filter, "Operations Toolbar Profile Button")
]

for old, new, desc in changes:
    if old in content:
        content = content.replace(old, new, 1)
        print(f"Applied: {desc}")
    else:
        print(f"FAILED TO FIND: {desc}")
        sys.exit(1)

# Add modals right before </body>
if '</body>' in content:
    content = content.replace('</body>', modals_html + '\n</body>', 1)
    print("Applied: New Universal Modals before </body>")
else:
    print("FAILED TO FIND </body>")
    sys.exit(1)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("SUCCESS: index.html updated successfully!")

