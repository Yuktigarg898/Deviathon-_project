import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('app.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Define the new code blocks

# Profile Management & Family Care Circle Code to insert
features_code = '''
// =========================================================================
// UNIVERSAL PROFILE MANAGEMENT ENGINE (FOR ALL 4 STAKEHOLDER PORTALS)
// =========================================================================

const defaultRoleProfiles = {
  senior: {
    role: 'senior',
    name: 'Ramesh Sharma',
    age: 74,
    gender: 'Male',
    phone: '+91 98110-44912',
    email: 'ramesh.sharma@example.in',
    bloodGroup: 'B+',
    address: 'Flat 402, Shivalik Apts, Sector 14, Rohini, New Delhi - 110085',
    doctor: 'Dr. Alok Mehta (Cardiology, Max Healthcare)',
    allergies: 'Penicillin allergy, mild knee osteoarthritis',
    emergencyNotes: 'Prefers Hindi audio. Uses walking cane when outside.'
  },
  coordinator: {
    role: 'coordinator',
    name: 'Sister Kavita Verma',
    title: 'Lead Clinical Nurse & Triage Coordinator',
    phone: '+91 98765-43210',
    email: 'kavita.nurse@careconnect.ai',
    license: 'DEL-RN-884920',
    zone: 'North & South Delhi Outreach Cluster',
    shift: '08:00 AM - 04:00 PM IST',
    department: 'Geriatric Tele-Triage Unit'
  },
  family: {
    role: 'family',
    name: 'Rahul Sharma',
    relationship: 'Son (Primary Caregiver)',
    phone: '+91 98111-22334',
    email: 'rahul.sharma@techcorp.in',
    city: 'Cyber City, Gurugram, Haryana',
    alertPreferences: 'Immediate SOS via WhatsApp + Weekly Email Health Digest'
  },
  operations: {
    role: 'operations',
    name: 'Arun Kapoor',
    title: 'Regional Operations & SLA Command Director',
    phone: '+91 99999-88888',
    email: 'arun.ops@careconnect.ai',
    securityKey: 'OPS-SEC-9981',
    jurisdiction: 'Pan-India Metro Hubs (Delhi NCR, Mumbai, Bengaluru)',
    dispatchAuth: 'Certified Level-3 Rapid Response & 108 Fleet'
  }
};

function getUserProfile(role) {
  const current = role || state.currentRole || 'senior';
  try {
    const raw = localStorage.getItem(`careconnect_profile_${current}`);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('Error reading profile from localStorage:', e);
  }
  return Object.assign({}, defaultRoleProfiles[current] || defaultRoleProfiles.senior);
}

function openProfileModal() {
  const modal = document.getElementById('modal-profile-management');
  if (!modal) return;
  soundEngine.playTone(520, 'sine', 0.1);

  const role = state.currentRole || 'senior';
  const prof = getUserProfile(role);
  const container = document.getElementById('profile-dynamic-fields-container');
  const avatar = document.getElementById('modal-profile-role-avatar');
  const title = document.getElementById('modal-profile-title');
  const badge = document.getElementById('modal-profile-role-badge');
  const subtitle = document.getElementById('modal-profile-subtitle');

  const parts = (prof.name || 'User').split(' ');
  const initials = parts.length > 1 ? (parts[0][0] + parts[1][0]).toUpperCase() : prof.name.substring(0, 2).toUpperCase();

  if (avatar) avatar.textContent = initials;

  if (role === 'senior') {
    if (avatar) avatar.className = 'w-12 h-12 rounded-2xl bg-sky-600 text-white flex items-center justify-center text-xl font-bold shadow-sm';
    if (title) title.textContent = 'Senior Health Profile / बुज़ुर्ग स्वास्थ्य प्रोफाइल';
    if (badge) {
      badge.textContent = 'Senior Citizen (बुज़ुर्ग)';
      badge.className = 'px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-sky-100 text-sky-800';
    }
    if (subtitle) subtitle.textContent = 'Manage medical history, primary physician, home address, and emergency details';

    if (container) {
      container.innerHTML = `
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          <div class="sm:col-span-2">
            <label class="profile-field-label">Full Name (पूरा नाम) *</label>
            <input type="text" id="prof-senior-name" value="${prof.name || ''}" class="profile-field-input" required>
          </div>
          <div>
            <label class="profile-field-label">Age (उम्र)</label>
            <input type="number" id="prof-senior-age" value="${prof.age || 74}" class="profile-field-input">
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          <div>
            <label class="profile-field-label">Gender (लिंग)</label>
            <select id="prof-senior-gender" class="profile-field-input bg-white">
              <option value="Male" ${prof.gender === 'Male' ? 'selected' : ''}>Male (पुरुष)</option>
              <option value="Female" ${prof.gender === 'Female' ? 'selected' : ''}>Female (महिला)</option>
              <option value="Other" ${prof.gender === 'Other' ? 'selected' : ''}>Other</option>
            </select>
          </div>
          <div>
            <label class="profile-field-label">Blood Group (रक्त समूह)</label>
            <select id="prof-senior-blood" class="profile-field-input bg-white">
              <option value="B+" ${prof.bloodGroup === 'B+' ? 'selected' : ''}>B+ (Positive)</option>
              <option value="O+" ${prof.bloodGroup === 'O+' ? 'selected' : ''}>O+ (Positive)</option>
              <option value="A+" ${prof.bloodGroup === 'A+' ? 'selected' : ''}>A+ (Positive)</option>
              <option value="AB+" ${prof.bloodGroup === 'AB+' ? 'selected' : ''}>AB+ (Positive)</option>
              <option value="B-" ${prof.bloodGroup === 'B-' ? 'selected' : ''}>B- (Negative)</option>
              <option value="O-" ${prof.bloodGroup === 'O-' ? 'selected' : ''}>O- (Negative)</option>
            </select>
          </div>
          <div>
            <label class="profile-field-label">Mobile (+91) *</label>
            <input type="tel" id="prof-senior-phone" value="${prof.phone || ''}" class="profile-field-input" required>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label class="profile-field-label">Email Address (ईमेल)</label>
            <input type="email" id="prof-senior-email" value="${prof.email || ''}" class="profile-field-input">
          </div>
          <div>
            <label class="profile-field-label">Primary Doctor / Hospital (प्रमुख चिकित्सक)</label>
            <input type="text" id="prof-senior-doctor" value="${prof.doctor || ''}" class="profile-field-input">
          </div>
        </div>

        <div>
          <label class="profile-field-label">Home Address (निवास का पूरा पता)</label>
          <input type="text" id="prof-senior-address" value="${prof.address || ''}" class="profile-field-input">
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label class="profile-field-label">Allergies & Conditions (एलर्जी व बीमारियां)</label>
            <input type="text" id="prof-senior-allergies" value="${prof.allergies || ''}" class="profile-field-input">
          </div>
          <div>
            <label class="profile-field-label">Emergency Care Notes (आपातकालीन निर्देश)</label>
            <input type="text" id="prof-senior-notes" value="${prof.emergencyNotes || ''}" class="profile-field-input">
          </div>
        </div>
      `;
    }
  } else if (role === 'coordinator') {
    if (avatar) avatar.className = 'w-12 h-12 rounded-2xl bg-teal-600 text-white flex items-center justify-center text-xl font-bold shadow-sm';
    if (title) title.textContent = 'Care Coordinator Profile & License';
    if (badge) {
      badge.textContent = 'Care Coordinator';
      badge.className = 'px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-teal-100 text-teal-800';
    }
    if (subtitle) subtitle.textContent = 'Clinical credentials, active triage shift, and outreach cluster assignment';

    if (container) {
      container.innerHTML = `
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label class="profile-field-label">Full Name & Credentials *</label>
            <input type="text" id="prof-coord-name" value="${prof.name || ''}" class="profile-field-input" required>
          </div>
          <div>
            <label class="profile-field-label">Professional Role / Title</label>
            <input type="text" id="prof-coord-title" value="${prof.title || ''}" class="profile-field-input">
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label class="profile-field-label">Nursing / Medical Council Registration No. *</label>
            <input type="text" id="prof-coord-license" value="${prof.license || ''}" class="profile-field-input" required>
          </div>
          <div>
            <label class="profile-field-label">Duty Shift Hours</label>
            <input type="text" id="prof-coord-shift" value="${prof.shift || ''}" class="profile-field-input">
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label class="profile-field-label">Direct Mobile Line (+91) *</label>
            <input type="tel" id="prof-coord-phone" value="${prof.phone || ''}" class="profile-field-input" required>
          </div>
          <div>
            <label class="profile-field-label">Official Clinical Email</label>
            <input type="email" id="prof-coord-email" value="${prof.email || ''}" class="profile-field-input">
          </div>
        </div>

        <div>
          <label class="profile-field-label">Assigned Outreach Cluster & Hub Zone</label>
          <input type="text" id="prof-coord-zone" value="${prof.zone || ''}" class="profile-field-input">
        </div>
      `;
    }
  } else if (role === 'family') {
    if (avatar) avatar.className = 'w-12 h-12 rounded-2xl bg-purple-600 text-white flex items-center justify-center text-xl font-bold shadow-sm';
    if (title) title.textContent = 'Family Member Profile & Alert Channels';
    if (badge) {
      badge.textContent = 'Family Member';
      badge.className = 'px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-100 text-purple-800';
    }
    if (subtitle) subtitle.textContent = 'Contact details for urgent WhatsApp/SMS alerts and weekly digests';

    if (container) {
      container.innerHTML = `
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label class="profile-field-label">Full Name *</label>
            <input type="text" id="prof-fam-name" value="${prof.name || ''}" class="profile-field-input" required>
          </div>
          <div>
            <label class="profile-field-label">Relationship to Elder *</label>
            <input type="text" id="prof-fam-relation" value="${prof.relationship || ''}" class="profile-field-input" required>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label class="profile-field-label">Mobile Number / WhatsApp (+91) *</label>
            <input type="tel" id="prof-fam-phone" value="${prof.phone || ''}" class="profile-field-input" required>
          </div>
          <div>
            <label class="profile-field-label">Email Address (for Weekly Digest)</label>
            <input type="email" id="prof-fam-email" value="${prof.email || ''}" class="profile-field-input">
          </div>
        </div>

        <div>
          <label class="profile-field-label">Residential City / Work Location</label>
          <input type="text" id="prof-fam-city" value="${prof.city || ''}" class="profile-field-input">
        </div>
      `;
    }
  } else if (role === 'operations') {
    if (avatar) avatar.className = 'w-12 h-12 rounded-2xl bg-orange-600 text-white flex items-center justify-center text-xl font-bold shadow-sm';
    if (title) title.textContent = 'Operations Director Profile & Command Clearance';
    if (badge) {
      badge.textContent = 'Operations Director';
      badge.className = 'px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-orange-100 text-orange-800';
    }
    if (subtitle) subtitle.textContent = 'Command jurisdiction, dispatch clearance, and municipal SLA monitoring';

    if (container) {
      container.innerHTML = `
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label class="profile-field-label">Full Name *</label>
            <input type="text" id="prof-ops-name" value="${prof.name || ''}" class="profile-field-input" required>
          </div>
          <div>
            <label class="profile-field-label">Operational Designation</label>
            <input type="text" id="prof-ops-title" value="${prof.title || ''}" class="profile-field-input">
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label class="profile-field-label">Emergency Operations Contact (+91) *</label>
            <input type="tel" id="prof-ops-phone" value="${prof.phone || ''}" class="profile-field-input" required>
          </div>
          <div>
            <label class="profile-field-label">Official Command Email</label>
            <input type="email" id="prof-ops-email" value="${prof.email || ''}" class="profile-field-input">
          </div>
        </div>

        <div>
          <label class="profile-field-label">Metro Jurisdictions Covered</label>
          <input type="text" id="prof-ops-jurisdiction" value="${prof.jurisdiction || ''}" class="profile-field-input">
        </div>
      `;
    }
  }

  modal.classList.remove('hidden');
}

function closeProfileModal() {
  const modal = document.getElementById('modal-profile-management');
  if (modal) modal.classList.add('hidden');
}

function saveUserProfile() {
  const role = state.currentRole || 'senior';
  const prof = getUserProfile(role);

  if (role === 'senior') {
    prof.name = document.getElementById('prof-senior-name')?.value.trim() || prof.name;
    prof.age = parseInt(document.getElementById('prof-senior-age')?.value) || prof.age;
    prof.gender = document.getElementById('prof-senior-gender')?.value || prof.gender;
    prof.phone = document.getElementById('prof-senior-phone')?.value.trim() || prof.phone;
    prof.email = document.getElementById('prof-senior-email')?.value.trim() || prof.email;
    prof.bloodGroup = document.getElementById('prof-senior-blood')?.value || prof.bloodGroup;
    prof.address = document.getElementById('prof-senior-address')?.value.trim() || prof.address;
    prof.doctor = document.getElementById('prof-senior-doctor')?.value.trim() || prof.doctor;
    prof.allergies = document.getElementById('prof-senior-allergies')?.value.trim() || prof.allergies;
    prof.emergencyNotes = document.getElementById('prof-senior-notes')?.value.trim() || prof.emergencyNotes;

    const greetingEl = document.getElementById('senior-greeting');
    if (greetingEl) {
      const isHi = state.seniorLanguage === 'hi';
      const firstName = prof.name.split(' ')[0];
      greetingEl.textContent = isHi ? `नमस्ते, ${firstName} जी! 🙏` : `Good Morning, ${firstName} ji! 🙏`;
    }
  } else if (role === 'coordinator') {
    prof.name = document.getElementById('prof-coord-name')?.value.trim() || prof.name;
    prof.title = document.getElementById('prof-coord-title')?.value.trim() || prof.title;
    prof.license = document.getElementById('prof-coord-license')?.value.trim() || prof.license;
    prof.phone = document.getElementById('prof-coord-phone')?.value.trim() || prof.phone;
    prof.email = document.getElementById('prof-coord-email')?.value.trim() || prof.email;
    prof.zone = document.getElementById('prof-coord-zone')?.value.trim() || prof.zone;
    prof.shift = document.getElementById('prof-coord-shift')?.value.trim() || prof.shift;
  } else if (role === 'family') {
    prof.name = document.getElementById('prof-fam-name')?.value.trim() || prof.name;
    prof.relationship = document.getElementById('prof-fam-relation')?.value.trim() || prof.relationship;
    prof.phone = document.getElementById('prof-fam-phone')?.value.trim() || prof.phone;
    prof.email = document.getElementById('prof-fam-email')?.value.trim() || prof.email;
    prof.city = document.getElementById('prof-fam-city')?.value.trim() || prof.city;
  } else if (role === 'operations') {
    prof.name = document.getElementById('prof-ops-name')?.value.trim() || prof.name;
    prof.title = document.getElementById('prof-ops-title')?.value.trim() || prof.title;
    prof.phone = document.getElementById('prof-ops-phone')?.value.trim() || prof.phone;
    prof.email = document.getElementById('prof-ops-email')?.value.trim() || prof.email;
    prof.jurisdiction = document.getElementById('prof-ops-jurisdiction')?.value.trim() || prof.jurisdiction;
  }

  try {
    localStorage.setItem(`careconnect_profile_${role}`, JSON.stringify(prof));
  } catch (e) {
    console.error('Failed to save profile:', e);
  }

  const nameLabel = document.getElementById('current-user-name');
  const avatar = document.getElementById('current-user-avatar');
  if (nameLabel) nameLabel.textContent = prof.name;
  if (avatar) {
    const parts = prof.name.split(' ');
    const initials = parts.length > 1 ? (parts[0][0] + parts[1][0]).toUpperCase() : prof.name.substring(0, 2).toUpperCase();
    avatar.textContent = initials;
  }

  soundEngine.playSuccessChime();
  showToast('Profile updated successfully! / प्रोफाइल सफलतापूर्वक सहेजी गई।', 'success');
  closeProfileModal();
}


// =========================================================================
// FAMILY CARE CIRCLE & CAREGIVER MANAGEMENT (ELDER PORTAL)
// =========================================================================

const defaultFamilyMembers = [
  {
    id: 'fam-1',
    name: 'Rahul Sharma',
    relation: 'Son (बेटा)',
    phone: '+91 98111-22334',
    email: 'rahul.sharma@techcorp.in',
    isPrimary: true,
    residence: 'Same City (Gurugram)',
    alerts: { sos: true, daily: true, weekly: true }
  },
  {
    id: 'fam-2',
    name: 'Sunita Sharma',
    relation: 'Daughter (बेटी)',
    phone: '+91 98765-11223',
    email: 'sunita.sharma@gmail.com',
    isPrimary: false,
    residence: 'Mumbai',
    alerts: { sos: true, daily: false, weekly: true }
  }
];

function getFamilyMembers() {
  try {
    const raw = localStorage.getItem('careconnect_family_members');
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('Error reading family members:', e);
  }
  return defaultFamilyMembers.slice();
}

function saveFamilyMembers(list) {
  try {
    localStorage.setItem('careconnect_family_members', JSON.stringify(list));
  } catch (e) {
    console.error('Failed to save family members:', e);
  }
}

function renderFamilyCareCircle() {
  const container = document.getElementById('senior-family-members-list');
  if (!container) return;

  const members = getFamilyMembers();
  if (members.length === 0) {
    container.innerHTML = `
      <div class="col-span-1 md:col-span-2 p-6 bg-slate-50 border border-slate-200 rounded-2xl text-center">
        <p class="text-sm font-bold text-slate-600">No family members linked yet.</p>
        <p class="text-xs text-slate-400 mt-1">Tap "+ Add Family Member" to connect your loved ones for emergency peace of mind.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = members.map(m => {
    const initial = (m.name || 'F').charAt(0).toUpperCase();
    return `
      <div class="bg-slate-50/90 hover:bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 hover:border-indigo-300 shadow-sm transition-all duration-200">
        <div class="flex items-start justify-between gap-3">
          <div class="flex items-center space-x-3">
            <div class="w-11 h-11 rounded-2xl bg-indigo-100 text-indigo-800 flex items-center justify-center font-black text-base shadow-sm">
              ${initial}
            </div>
            <div>
              <div class="flex items-center space-x-2">
                <h4 class="text-sm sm:text-base font-extrabold text-[#0e294b]">${m.name}</h4>
                ${m.isPrimary ? `
                  <span class="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-200">
                    Primary Contact
                  </span>
                ` : ''}
              </div>
              <p class="text-xs font-semibold text-indigo-700">${m.relation} • <span class="text-slate-500 font-normal">${m.residence}</span></p>
            </div>
          </div>

          <button onclick="removeFamilyMember('${m.id}')" class="text-slate-400 hover:text-rose-600 p-1 transition-colors" title="Remove member">
            <i class="fa-solid fa-trash-can text-xs"></i>
          </button>
        </div>

        <div class="mt-3 pt-3 border-t border-slate-200/80 text-xs text-slate-600 space-y-1">
          <div class="flex items-center justify-between">
            <span><i class="fa-solid fa-phone text-teal-600 mr-1.5"></i><strong>${m.phone}</strong></span>
            ${m.email ? `<span class="text-slate-400 truncate max-w-[150px]"><i class="fa-solid fa-envelope mr-1"></i>${m.email}</span>` : ''}
          </div>
          <div class="flex flex-wrap items-center gap-1.5 pt-1.5">
            ${m.alerts.sos ? `<span class="px-2 py-0.5 bg-rose-100 text-rose-800 rounded-md text-[10px] font-bold"><i class="fa-solid fa-triangle-exclamation mr-1"></i>SOS Alert</span>` : ''}
            ${m.alerts.daily ? `<span class="px-2 py-0.5 bg-sky-100 text-sky-800 rounded-md text-[10px] font-bold"><i class="fa-solid fa-calendar-check mr-1"></i>Daily Digest</span>` : ''}
            ${m.alerts.weekly ? `<span class="px-2 py-0.5 bg-purple-100 text-purple-800 rounded-md text-[10px] font-bold"><i class="fa-solid fa-chart-line mr-1"></i>Weekly Summary</span>` : ''}
          </div>
        </div>

        <div class="mt-4 flex items-center space-x-2">
          <button onclick="sendFamilyMemberTestAlert('${m.id}')"
            class="flex-1 py-2 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center space-x-1.5">
            <i class="fa-brands fa-whatsapp text-emerald-600 text-sm"></i>
            <span>Send Test Alert / अलर्ट भेजें</span>
          </button>
          <a href="tel:${m.phone}"
            class="py-2 px-3 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center space-x-1">
            <i class="fa-solid fa-phone text-xs text-teal-600"></i>
            <span>Call</span>
          </a>
        </div>
      </div>
    `;
  }).join('');
}

function openAddFamilyMemberModal() {
  const modal = document.getElementById('modal-add-family-member');
  if (modal) {
    soundEngine.playTone(550, 'sine', 0.1);
    modal.classList.remove('hidden');
  }
}

function closeAddFamilyMemberModal() {
  const modal = document.getElementById('modal-add-family-member');
  if (modal) modal.classList.add('hidden');
}

function submitAddFamilyMember() {
  const name = document.getElementById('new-fam-name')?.value.trim();
  const relation = document.getElementById('new-fam-relation')?.value;
  const phone = document.getElementById('new-fam-phone')?.value.trim();
  const email = document.getElementById('new-fam-email')?.value.trim();
  const residence = document.getElementById('new-fam-residence')?.value;
  const sos = document.getElementById('new-fam-alert-sos')?.checked ?? true;
  const daily = document.getElementById('new-fam-alert-daily')?.checked ?? true;
  const weekly = document.getElementById('new-fam-alert-weekly')?.checked ?? true;

  if (!name || !phone) {
    showToast('Please enter both name and mobile number.', 'warning');
    return;
  }

  const list = getFamilyMembers();
  const newMember = {
    id: 'fam-' + Date.now(),
    name: name,
    relation: relation,
    phone: phone,
    email: email || '',
    residence: residence,
    isPrimary: list.length === 0,
    alerts: { sos, daily, weekly }
  };

  list.push(newMember);
  saveFamilyMembers(list);
  renderFamilyCareCircle();

  soundEngine.playSuccessChime();
  showToast(`Family member ${name} (${relation}) added to care circle!`, 'success');
  closeAddFamilyMemberModal();

  document.getElementById('add-family-member-form')?.reset();
}

function removeFamilyMember(id) {
  const list = getFamilyMembers();
  const member = list.find(m => m.id === id);
  if (!member) return;

  if (confirm(`Are you sure you want to remove ${member.name} from the family care circle?`)) {
    const updated = list.filter(m => m.id !== id);
    saveFamilyMembers(updated);
    renderFamilyCareCircle();
    soundEngine.playWarningChime();
    showToast(`${member.name} removed from care circle.`, 'info');
  }
}

function sendFamilyMemberTestAlert(id) {
  const list = getFamilyMembers();
  const m = list.find(mem => mem.id === id);
  if (!m) return;

  soundEngine.playTone(660, 'sine', 0.2);
  const isHi = state.seniorLanguage === 'hi';
  const vitalsText = assessmentState.lastPrediction
    ? `Risk: ${assessmentState.lastPrediction.predicted_risk_level} (${assessmentState.lastPrediction.risk_score}/100)`
    : 'Status: Routine Morning Telemetry Active';

  showToast(
    isHi
      ? `व्हाट्सएप टेस्ट अलर्ट ${m.name} (${m.phone}) को भेजा गया: ${vitalsText}`
      : `WhatsApp Test Alert dispatched to ${m.name} (${m.phone}): ${vitalsText}`,
    'success'
  );
}


// =========================================================================
// AI PRESCRIPTION & DAILY HEALTH IMPROVEMENT TASKS ENGINE
// =========================================================================

function getTodayDateString() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}

function getStoredDailyTasks() {
  const dateKey = getTodayDateString();
  try {
    const raw = localStorage.getItem(`careconnect_rx_tasks_${dateKey}`);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('Error reading stored daily tasks:', e);
  }
  return null;
}

function saveStoredDailyTasks(tasks) {
  const dateKey = getTodayDateString();
  try {
    localStorage.setItem(`careconnect_rx_tasks_${dateKey}`, JSON.stringify(tasks));
  } catch (e) {
    console.error('Failed to save daily tasks:', e);
  }
}

function getHealthStreak() {
  return parseInt(localStorage.getItem('careconnect_health_streak') || '3');
}

function incrementHealthStreak() {
  const current = getHealthStreak();
  localStorage.setItem('careconnect_health_streak', String(current + 1));
}

function generateHealthPrescriptionTasks(res, inputData) {
  const existing = getStoredDailyTasks();
  if (existing && existing.length > 0) {
    return existing;
  }

  const tasks = [];

  // 1. Blood Pressure Task
  if (inputData.bp_systolic >= 135 || inputData.bp_diastolic >= 88 || inputData.has_hypertension) {
    tasks.push({
      id: 'task-bp',
      titleEn: 'Low-Sodium DASH Diet & BP Medication Timing',
      titleHi: 'कम नमक वाला आहार (DASH डाइट) व बीपी की दवा का समय पर सेवन',
      descEn: 'Avoid extra table salt in today\'s meals. Take prescribed BP medicine with warm water after light breakfast. Rest 10 mins before measuring.',
      descHi: 'आज दाल/सब्जी में ऊपर से नमक न डालें। नाश्ते के बाद गुनगुने पानी से बीपी की दवा लें और 10 मिनट शांत बैठकर आराम करें।',
      timeSlot: 'Morning / सुबह',
      category: '🩺 Vitals & Medication',
      badgeClass: 'bg-rose-100 text-rose-800 border border-rose-200',
      completed: false
    });
  } else {
    tasks.push({
      id: 'task-bp-check',
      titleEn: 'Morning Resting Blood Pressure Log',
      titleHi: 'शांत अवस्था में बीपी व पल्स की नियमित जांच',
      descEn: 'Sit relaxed for 5 minutes and record your morning BP. Target resting reading is < 125/80 mmHg.',
      descHi: '5 मिनट कुर्सी पर आराम से बैठें और अपना ब्लड प्रेशर नापें। सामान्य मान 120/80 के करीब रखें।',
      timeSlot: 'Morning / सुबह',
      category: '🩺 Vitals Monitoring',
      badgeClass: 'bg-emerald-100 text-emerald-800 border border-emerald-200',
      completed: true
    });
  }

  // 2. Blood Sugar / Diabetes Task
  if (inputData.blood_glucose >= 140 || inputData.is_diabetic) {
    tasks.push({
      id: 'task-glucose',
      titleEn: 'Post-Meal 15-Min Light Walk & Glucose Regulation',
      titleHi: 'भोजन के बाद 15 मिनट की धीमी सैर व मीठे से परहेज',
      descEn: 'Stroll slowly inside home or balcony after lunch. Do not sit or lie down immediately. Skip sugary beverages or sweets today.',
      descHi: 'दोपहर भोजन के बाद तुरंत न बैठें; कमरे या बरामदे में 10-15 मिनट धीरे-धीरे टहलें। मीठी चाय या मिठाई बिल्कुल न लें।',
      timeSlot: 'Afternoon / दोपहर',
      category: '🚶 Sugar Control',
      badgeClass: 'bg-amber-100 text-amber-800 border border-amber-200',
      completed: false
    });
  }

  // 3. Joint Pain / Arthritis / Mobility Task
  if (inputData.pain_level >= 4 || inputData.walking_independent === 0 || inputData.has_arthritis) {
    tasks.push({
      id: 'task-joint',
      titleEn: 'Knee Warm Compress + 8 Seated Leg Lifts',
      titleHi: 'घुटनों की गर्म सिकाई व कुर्सी पर बैठकर पैरों की हल्की कसरत',
      descEn: 'Apply warm towel or heating pad to stiff knees for 10 mins. Slowly straighten and lower legs 8 times while sitting comfortably.',
      descHi: 'घुटनों पर 10 मिनट के लिए गर्म सिकाई करें। कुर्सी पर बैठकर पैरों को धीरे-धीरे सीधा करें और नीचे लाएं (8 बार)।',
      timeSlot: 'Evening / शाम',
      category: '🦵 Physical Therapy',
      badgeClass: 'bg-indigo-100 text-indigo-800 border border-indigo-200',
      completed: false
    });
  }

  // 4. Sleep Hygiene & Rest Deficit Task
  if (inputData.sleep_hours < 6) {
    tasks.push({
      id: 'task-sleep',
      titleEn: '30-Min Restorative Afternoon Nap & Screen-Free Night',
      titleHi: 'दोपहर का 30 मिनट विश्राम व रात्रि में 9 बजे स्क्रीन बंद करना',
      descEn: 'Take a quiet 30-min nap after lunch. Switch off TV/phone by 9:00 PM; drink warm milk or water to target 7+ hours of deep sleep tonight.',
      descHi: 'दोपहर भोजन के बाद 30 मिनट शांत विश्राम करें। रात 9 बजे टीवी व फोन बंद कर दें और हल्का गुनगुना दूध पीकर सोएं।',
      timeSlot: 'Bedtime / रात',
      category: '🌙 Sleep Hygiene',
      badgeClass: 'bg-purple-100 text-purple-800 border border-purple-200',
      completed: false
    });
  }

  // 5. Breathing & Lung Capacity (Pranayama)
  tasks.push({
    id: 'task-breathing',
    titleEn: '5-Minute Mindful Deep Breathing (Pranayama)',
    titleHi: '5 मिनट अनुलोम-विलोम व गहरी सांस का अभ्यास (प्राणायाम)',
    descEn: 'Inhale slowly for 4 seconds, exhale gently for 6 seconds. Increases lung oxygenation (SpO2) and calms heart rate.',
    descHi: 'सीधे बैठें, 4 सेकंड नाक से धीमी सांस लें और 6 सेकंड में छोड़ें। इससे फेफड़ों में ऑक्सीजन बढ़ती है और मन शांत रहता है।',
    timeSlot: 'Morning / सुबह',
    category: '🧘 Mind & Lungs',
    badgeClass: 'bg-sky-100 text-sky-800 border border-sky-200',
    completed: true
  });

  // 6. Universal Hydration Milestone
  tasks.push({
    id: 'task-hydration',
    titleEn: 'Daily Hydration Target: 6 Glasses of Lukewarm Water',
    titleHi: 'दिनभर में 6 गिलास स्वच्छ गुनगुना पानी पीने का लक्ष्य',
    descEn: 'Drink small sips throughout the day. Keeps blood circulation smooth and supports kidney & joint function.',
    descHi: 'पूरे दिन में थोड़े-थोड़े अंतराल पर 6 गिलास पानी पिएं। इससे रक्त प्रवाह सही रहता है और शरीर में ताजगी बनी रहती है।',
    timeSlot: 'All Day / दिनभर',
    category: '💧 Hydration',
    badgeClass: 'bg-teal-100 text-teal-800 border border-teal-200',
    completed: false
  });

  saveStoredDailyTasks(tasks);
  return tasks;
}

function toggleRxTask(taskId) {
  const tasks = getStoredDailyTasks();
  if (!tasks) return;

  const target = tasks.find(t => t.id === taskId);
  if (!target) return;

  target.completed = !target.completed;
  saveStoredDailyTasks(tasks);

  if (target.completed) {
    soundEngine.playSuccessChime();
  } else {
    soundEngine.playTone(400, 'sine', 0.1);
  }

  updateRxTasksUI(tasks);
}

function updateRxTasksUI(tasks) {
  const meter = document.getElementById('rx-progress-bar');
  const meterText = document.getElementById('rx-progress-text');
  const celebration = document.getElementById('rx-celebration-banner');
  const encouragement = document.getElementById('rx-encouragement-text');

  if (!meter || !meterText) return;

  const isHi = state.seniorLanguage === 'hi';
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const pct = Math.round((completed / total) * 100);

  meter.style.width = `${pct}%`;
  meterText.textContent = `${completed} / ${total} ${isHi ? 'कार्य पूरे हुए' : 'Tasks Completed'} (${pct}%)`;

  const prof = getUserProfile('senior');
  const seniorName = prof.name ? prof.name.split(' ')[0] : 'Ramesh';

  if (pct === 100) {
    if (celebration) celebration.classList.remove('hidden');
    if (encouragement) {
      encouragement.textContent = isHi 
        ? `शानदार ${seniorName} जी! 🎉 आज के सभी स्वास्थ्य सुधार कार्य पूरे हो गए! आपका स्वास्थ्य स्कोर बढ़ रहा है।`
        : `Brilliant job, ${seniorName} ji! 🎉 100% of today's health recovery tasks are complete! Your health resilience has improved.`;
    }
    soundEngine.playSuccessChime();
    incrementHealthStreak();
    const streakBadge = document.getElementById('rx-streak-count');
    if (streakBadge) streakBadge.textContent = `${getHealthStreak()} Days`;
  } else {
    if (celebration) celebration.classList.add('hidden');
    const remaining = total - completed;
    if (encouragement) {
      encouragement.textContent = isHi
        ? `शाबाश ${seniorName} जी! आज का 100% लक्ष्य पूरा करने के लिए सिर्फ ${remaining} कार्य शेष हैं। 🙏`
        : `Keep it up, ${seniorName} ji! Only ${remaining} tasks remaining to achieve today's 100% wellness goal. 🙏`;
    }
  }

  tasks.forEach(t => {
    const card = document.getElementById(`rx-card-${t.id}`);
    const chk = document.getElementById(`rx-chk-${t.id}`);
    if (chk) chk.checked = t.completed;
    if (card) {
      if (t.completed) {
        card.classList.add('task-completed');
      } else {
        card.classList.remove('task-completed');
      }
    }
  });
}

function restoreDailyTasks() {
  const tasks = getStoredDailyTasks();
  if (tasks && tasks.length > 0) {
    updateRxTasksUI(tasks);
  }
}


// =========================================================================
// ENHANCED CLINICAL DIAGNOSIS REPORT & MULTI-PERSPECTIVE VISUALIZER
// =========================================================================

function renderAssessmentResult(res, inputData, alertCreated) {
  const box = document.getElementById('assessment-result-box');
  if (!box) return;

  const isHindi = state.seniorLanguage === 'hi';
  const riskLevel = res.predicted_risk_level;
  const isHigh = (riskLevel === 'High');
  const isMed = (riskLevel === 'Medium');
  const isLow = (riskLevel === 'Low');

  const prof = getUserProfile('senior');
  const seniorFirstName = prof.name ? prof.name.split(' ')[0] : 'Ramesh';

  let theme = {
    bg: 'bg-emerald-50/90 border-emerald-300',
    titleColor: 'text-emerald-950',
    badgeBg: 'bg-emerald-600 text-white',
    gaugeBg: 'bg-emerald-500',
    icon: 'fa-solid fa-circle-check text-emerald-600'
  };

  if (isHigh) {
    theme = {
      bg: 'bg-rose-50/95 border-rose-400 shadow-xl shadow-rose-500/10',
      titleColor: 'text-rose-950',
      badgeBg: 'bg-rose-600 text-white animate-pulse',
      gaugeBg: 'bg-rose-600',
      icon: 'fa-solid fa-triangle-exclamation text-rose-600'
    };
  } else if (isMed) {
    theme = {
      bg: 'bg-amber-50/90 border-amber-300 shadow-lg shadow-amber-500/10',
      titleColor: 'text-amber-950',
      badgeBg: 'bg-amber-600 text-white',
      gaugeBg: 'bg-amber-500',
      icon: 'fa-solid fa-circle-exclamation text-amber-600'
    };
  }

  const riskTitle = isHindi ? res.predicted_risk_level_hi : `${riskLevel} Risk Condition`;
  const urgencyTag = isHindi ? res.status_tag_hi : res.status_tag_en;

  // Generate Personalized Prescription Tasks
  const rxTasks = generateHealthPrescriptionTasks(res, inputData);
  const totalTasks = rxTasks.length;
  const completedTasks = rxTasks.filter(t => t.completed).length;
  const pctTasks = Math.round((completedTasks / totalTasks) * 100);

  // Plain-Language Diagnosis Explanation Text
  let plainDiagnosisHi = '';
  let plainDiagnosisEn = '';

  if (isHigh) {
    plainDiagnosisHi = `${seniorFirstName} जी, आपकी रिपोर्ट बताती है कि आपका रक्तचाप (${inputData.bp_systolic}/${inputData.bp_diastolic}) सामान्य से अधिक है और नींद में कमी (${inputData.sleep_hours} घंटे) है। इससे आपके दिल व शरीर को अधिक श्रम करना पड़ रहा है। लेकिन चिंता की कोई बात नहीं है: तुरंत अस्पताल जाने की आवश्यकता नहीं है। नीचे दिए गए कार्यों को पूरा करें, समय पर दवा लें, और सिस्टर कविता आपसे जल्द संपर्क करेंगी।`;
    plainDiagnosisEn = `${seniorFirstName} ji, your assessment shows that your blood pressure (${inputData.bp_systolic}/${inputData.bp_diastolic}) is running elevated alongside reduced sleep (${inputData.sleep_hours} hrs). This causes fatigue and strains your cardiovascular resilience. There is NO immediate emergency right now. Following today\'s recovery tasks and taking your scheduled medicine will help stabilize your body comfortably.`;
  } else if (isMed) {
    plainDiagnosisHi = `${seniorFirstName} जी, आपका सामान्य स्वास्थ्य स्थिर है, लेकिन कुछ बिंदुओं पर हल्का ध्यान देने की आवश्यकता है - विशेषकर रक्तचाप व हल्का दर्द। नाश्ते के बाद गुनगुना पानी लें, नमक सीमित रखें और 15 मिनट की हल्की चहलकदमी से आपकी ऊर्जा तुरंत बेहतर होगी।`;
    plainDiagnosisEn = `${seniorFirstName} ji, your overall health is stable, but a couple of telemetry markers require gentle attention—specifically your blood pressure and joint stiffness. Staying hydrated, having a low-sodium lunch, and completing a 15-minute gentle stroll will quickly restore your comfort.`;
  } else {
    plainDiagnosisHi = `बहुत बढ़िया ${seniorFirstName} जी! आपके सभी वाइटल्स (ऑक्सीजन ${inputData.spo2}%, हृदय गति ${inputData.heart_rate} bpm) एकदम सुरक्षित व सामान्य श्रेणी में हैं। आपकी दैनिक दिनचर्या बहुत अच्छी है, इसे निरंतर बनाए रखें!`;
    plainDiagnosisEn = `Excellent news, ${seniorFirstName} ji! All your critical vitals (SpO2 ${inputData.spo2}%, Heart Rate ${inputData.heart_rate} bpm) are in an optimal, safe range. Keep maintaining your daily hydration, walks, and healthy routine!`;
  }

  // Biomarkers Evaluation
  const bpStatus = (inputData.bp_systolic >= 140 || inputData.bp_diastolic >= 90) ? { label: 'High (बढ़ा हुआ)', class: 'bg-rose-100 text-rose-800' } : ((inputData.bp_systolic >= 125) ? { label: 'Elevated (हल्का अधिक)', class: 'bg-amber-100 text-amber-800' } : { label: 'Optimal (सामान्य)', class: 'bg-emerald-100 text-emerald-800' });
  const sugarStatus = (inputData.blood_glucose >= 140) ? { label: 'Needs Control (नियंत्रण चाहिए)', class: 'bg-amber-100 text-amber-800' } : { label: 'Safe Range (सुरक्षित)', class: 'bg-emerald-100 text-emerald-800' };
  const spo2Status = (inputData.spo2 >= 95) ? { label: 'Excellent (उत्कृष्ट)', class: 'bg-emerald-100 text-emerald-800' } : { label: 'Low Oxygen (कम)', class: 'bg-rose-100 text-rose-800' };
  const hrStatus = (inputData.heart_rate >= 60 && inputData.heart_rate <= 95) ? { label: 'Normal Rhythm (सामान्य)', class: 'bg-emerald-100 text-emerald-800' } : { label: 'Attention (ध्यान दें)', class: 'bg-amber-100 text-amber-800' };
  const sleepStatus = (inputData.sleep_hours >= 7) ? { label: 'Adequate Rest (पर्याप्त)', class: 'bg-emerald-100 text-emerald-800' } : { label: 'Sleep Deficit (नींद की कमी)', class: 'bg-amber-100 text-amber-800' };

  box.className = `mt-8 p-6 sm:p-8 rounded-3xl border-2 transition-all duration-300 ${theme.bg}`;
  box.classList.remove('hidden');

  box.innerHTML = `
    <!-- Top Result Header with Print & Audio Buttons -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200/80">
      <div class="flex items-center space-x-4">
        <div class="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white shadow-md flex items-center justify-center text-3xl sm:text-4xl flex-shrink-0">
          <i class="${theme.icon}"></i>
        </div>
        <div>
          <div class="flex items-center space-x-2">
            <span class="text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${theme.badgeBg}">
              ${riskTitle}
            </span>
            <span class="text-xs font-bold text-slate-500">
              Score: ${res.risk_score}/100
            </span>
          </div>
          <h3 class="text-xl sm:text-2xl font-black ${theme.titleColor} mt-1">
            ${isHindi ? 'स्वास्थ्य डायग्नोसिस एवं व्यक्तिगत प्रिस्क्रिप्शन' : 'Health Diagnosis Report & Personalized Rx'}
          </h3>
          <p class="text-xs sm:text-sm font-semibold text-slate-600">
            ${urgencyTag}
          </p>
        </div>
      </div>

      <!-- Quick Action Buttons -->
      <div class="flex flex-wrap items-center gap-2 w-full sm:w-auto">
        <button onclick="speakDiagnosticReport()"
          class="flex-1 sm:flex-none px-3.5 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 text-xs font-extrabold transition-all shadow-sm flex items-center justify-center space-x-1.5"
          title="Listen to Diagnosis in Voice">
          <i class="fa-solid fa-volume-high text-teal-600"></i>
          <span>${isHindi ? 'रिपोर्ट सुनें' : 'Listen Report'}</span>
        </button>
        <button onclick="printDiagnosticReport()"
          class="flex-1 sm:flex-none px-3.5 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 text-xs font-extrabold transition-all shadow-sm flex items-center justify-center space-x-1.5"
          title="Print or Save PDF for Doctor">
          <i class="fa-solid fa-print text-sky-600"></i>
          <span>${isHindi ? 'प्रिंट रिपोर्ट (PDF)' : 'Print / PDF'}</span>
        </button>
        <button onclick="shareReportViaWhatsApp()"
          class="flex-1 sm:flex-none px-3.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold transition-all shadow-sm flex items-center justify-center space-x-1.5"
          title="Share Report to Family via WhatsApp">
          <i class="fa-brands fa-whatsapp text-white"></i>
          <span>${isHindi ? 'परिवार को भेजें' : 'Share WhatsApp'}</span>
        </button>
      </div>
    </div>


    <!-- 1. PLAIN LANGUAGE DIAGNOSIS EXPLANATION (EASY TO UNDERSTAND) -->
    <div class="mt-6 bg-white/95 rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-sm">
      <div class="flex items-center space-x-3 mb-3">
        <div class="w-9 h-9 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center text-lg">
          <i class="fa-solid fa-user-doctor"></i>
        </div>
        <div>
          <h4 class="text-sm sm:text-base font-extrabold text-[#0e294b]">
            ${isHindi ? 'अपनी रिपोर्ट को समझें (सरल भाषा में विश्लेषण)' : 'Understand Your Diagnosis (Plain Language Summary)'}
          </h4>
          <p class="text-xs text-slate-400">Doctor-verified non-alarmist explanation of your telemetry</p>
        </div>
      </div>
      <p class="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium bg-sky-50/60 p-4 rounded-xl border border-sky-100">
        ${isHindi ? plainDiagnosisHi : plainDiagnosisEn}
      </p>
    </div>


    <!-- 2. BIOMARKER COMPARISON CARDS (YOUR VALUE VS NORMAL RANGE) -->
    <div class="mt-6">
      <h4 class="text-xs sm:text-sm font-extrabold text-[#0e294b] mb-3 flex items-center space-x-2">
        <i class="fa-solid fa-chart-simple text-teal-600"></i>
        <span>${isHindi ? 'आपके स्वास्थ्य संकेतक बनाम सामान्य सीमा (Biomarker Analysis):' : 'Your Vitals vs Safe Clinical Ranges (Biomarker Comparison):'}</span>
      </h4>

      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <!-- BP -->
        <div class="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm text-center">
          <span class="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Blood Pressure</span>
          <span class="text-lg sm:text-xl font-black text-slate-800">${inputData.bp_systolic}/${inputData.bp_diastolic}</span>
          <span class="text-[10px] text-slate-500 block">Target: &lt;120/80</span>
          <span class="mt-1.5 inline-block text-[10px] font-black px-2 py-0.5 rounded-full ${bpStatus.class}">${bpStatus.label}</span>
        </div>

        <!-- Sugar -->
        <div class="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm text-center">
          <span class="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Blood Glucose</span>
          <span class="text-lg sm:text-xl font-black text-slate-800">${inputData.blood_glucose} <span class="text-xs font-normal">mg/dL</span></span>
          <span class="text-[10px] text-slate-500 block">Safe: 70-130</span>
          <span class="mt-1.5 inline-block text-[10px] font-black px-2 py-0.5 rounded-full ${sugarStatus.class}">${sugarStatus.label}</span>
        </div>

        <!-- SpO2 -->
        <div class="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm text-center">
          <span class="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Oxygen SpO2</span>
          <span class="text-lg sm:text-xl font-black text-teal-700">${inputData.spo2}%</span>
          <span class="text-[10px] text-slate-500 block">Normal: ≥95%</span>
          <span class="mt-1.5 inline-block text-[10px] font-black px-2 py-0.5 rounded-full ${spo2Status.class}">${spo2Status.label}</span>
        </div>

        <!-- Heart Rate -->
        <div class="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm text-center">
          <span class="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Heart Rate</span>
          <span class="text-lg sm:text-xl font-black text-slate-800">${inputData.heart_rate} <span class="text-xs font-normal">bpm</span></span>
          <span class="text-[10px] text-slate-500 block">Normal: 60-90</span>
          <span class="mt-1.5 inline-block text-[10px] font-black px-2 py-0.5 rounded-full ${hrStatus.class}">${hrStatus.label}</span>
        </div>

        <!-- Sleep -->
        <div class="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm text-center col-span-2 sm:col-span-1">
          <span class="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Sleep Duration</span>
          <span class="text-lg sm:text-xl font-black text-slate-800">${inputData.sleep_hours} <span class="text-xs font-normal">hrs</span></span>
          <span class="text-[10px] text-slate-500 block">Target: 7-8 hrs</span>
          <span class="mt-1.5 inline-block text-[10px] font-black px-2 py-0.5 rounded-full ${sleepStatus.class}">${sleepStatus.label}</span>
        </div>
      </div>
    </div>


    <!-- 3. PERSONALIZED HEALTH IMPROVEMENT PRESCRIPTION & DAILY TASKS CHECKLIST -->
    <div class="mt-7 bg-white rounded-3xl p-5 sm:p-7 border-2 border-teal-300 shadow-md">
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
        <div class="flex items-center space-x-3">
          <div class="w-12 h-12 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center text-xl shadow-sm">
            <i class="fa-solid fa-list-check"></i>
          </div>
          <div>
            <div class="flex items-center space-x-2">
              <h4 class="text-base sm:text-lg font-black text-[#0e294b]">
                ${isHindi ? 'स्वास्थ्य सुधार प्रिस्क्रिप्शन एवं दैनिक कार्य सूची' : 'Personalized Health Improvement Prescription'}
              </h4>
              <span class="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-900 border border-amber-200 flex items-center space-x-1">
                <span class="streak-flame">🔥</span>
                <span id="rx-streak-count">${getHealthStreak()} Days Streak</span>
              </span>
            </div>
            <p class="text-xs text-slate-500 font-medium">
              Daily recovery milestones tailored directly to your ML prediction and biomarkers.
            </p>
          </div>
        </div>

        <!-- Completion Percentage Badge -->
        <div class="bg-slate-50 px-3.5 py-1.5 rounded-xl border border-slate-200 text-right">
          <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Today's Progress</span>
          <span id="rx-progress-text" class="text-xs sm:text-sm font-extrabold text-teal-800">
            ${completedTasks} / ${totalTasks} ${isHindi ? 'कार्य पूरे हुए' : 'Tasks Completed'} (${pctTasks}%)
          </span>
        </div>
      </div>

      <!-- Progress Bar -->
      <div class="w-full bg-slate-100 h-2.5 rounded-full mt-4 overflow-hidden">
        <div id="rx-progress-bar" class="h-full bg-gradient-to-r from-[#00a896] to-emerald-500 rounded-full transition-all duration-300"
          style="width: ${pctTasks}%"></div>
      </div>

      <!-- Dynamic Encouragement Banner -->
      <div class="mt-3 text-xs sm:text-sm font-bold text-slate-700 flex items-center space-x-1.5">
        <i class="fa-solid fa-heart-pulse text-teal-600"></i>
        <span id="rx-encouragement-text">
          ${isHindi 
            ? `शाबाश ${seniorFirstName} जी! आज का 100% लक्ष्य पूरा करने के लिए सिर्फ ${totalTasks - completedTasks} कार्य शेष हैं। 🙏`
            : `Keep it up, ${seniorFirstName} ji! Only ${totalTasks - completedTasks} tasks remaining to achieve today's 100% wellness goal. 🙏`}
        </span>
      </div>

      <!-- 100% Celebration Banner (Hidden by default unless 100%) -->
      <div id="rx-celebration-banner" class="${pctTasks === 100 ? '' : 'hidden'} mt-4 p-4 rounded-2xl bg-gradient-to-r from-amber-100 via-emerald-100 to-teal-100 border border-emerald-300 text-center shadow-sm">
        <span class="text-2xl">🎉 🏆 👏</span>
        <h5 class="font-black text-sm sm:text-base text-emerald-950 mt-1">
          ${isHindi ? 'अद्भुत! आज के सभी स्वास्थ्य सुधार कार्य सफलतापूर्वक पूरे हो गए!' : 'Outstanding! All daily recovery tasks completed for today!'}
        </h5>
        <p class="text-xs text-emerald-800 font-medium">
          Your adherence improves blood pressure regulation, glucose control, and prevents hospital visits.
        </p>
      </div>

      <!-- Task Items Grid -->
      <div id="daily-rx-tasks-list" class="space-y-3 mt-5">
        ${rxTasks.map(t => {
          const isDone = t.completed;
          return `
            <div id="rx-card-${t.id}"
              class="rx-task-card p-4 rounded-2xl bg-white flex items-start justify-between gap-3 ${isDone ? 'task-completed' : ''}">
              <div class="flex items-start space-x-3.5">
                <input type="checkbox" id="rx-chk-${t.id}" onchange="toggleRxTask('${t.id}')"
                  class="rx-task-checkbox mt-0.5" ${isDone ? 'checked' : ''}>
                <div>
                  <div class="flex flex-wrap items-center gap-1.5 mb-1">
                    <span class="text-[10px] font-bold px-2 py-0.5 rounded-md ${t.badgeClass}">
                      ${t.timeSlot}
                    </span>
                    <span class="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                      ${t.category}
                    </span>
                  </div>
                  <h5 class="task-title-text text-xs sm:text-sm font-extrabold text-slate-900">
                    ${isHindi ? t.titleHi : t.titleEn}
                  </h5>
                  <p class="text-xs text-slate-600 mt-1 leading-relaxed">
                    ${isHindi ? t.descHi : t.descEn}
                  </p>
                </div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>


    <!-- 4. CARE COORDINATOR CLINICAL NOTE & CONTACT -->
    <div class="mt-6 bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200/90 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div class="flex items-center space-x-3">
        <div class="w-12 h-12 rounded-2xl bg-teal-600 text-white flex items-center justify-center font-bold text-base shadow-sm">
          KV
        </div>
        <div>
          <div class="flex items-center space-x-2">
            <h5 class="text-xs sm:text-sm font-extrabold text-slate-900">Sister Kavita Verma, RN</h5>
            <span class="text-[10px] font-bold px-2 py-0.5 bg-teal-100 text-teal-800 rounded-full">Your Care Coordinator</span>
          </div>
          <p class="text-xs text-slate-600 mt-0.5">
            ${isHindi 
              ? '“रमेश जी, मैंने आपकी टेलीमेट्री देखी है। दवा समय पर लें; मैं शाम 4:30 बजे फोन करके आपका हालचाल पूछूंगी।”' 
              : '“Ramesh ji, I have reviewed your telemetry readings. Please follow your tasks; I will call you at 4:30 PM for a quick check-in.”'}
          </p>
        </div>
      </div>

      <div class="flex items-center space-x-2 w-full sm:w-auto">
        <a href="tel:+919876543210"
          class="w-full sm:w-auto px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center space-x-1.5">
          <i class="fa-solid fa-phone"></i>
          <span>${isHindi ? 'सिस्टर कविता को कॉल करें' : 'Call Coordinator'}</span>
        </a>
      </div>
    </div>


    <!-- 5. COORDINATOR ESCALATION ALERT BANNER (IF MEDIUM OR HIGH RISK) -->
    ${alertCreated ? `
      <div class="mt-5 p-4 rounded-2xl bg-rose-100 border border-rose-300 flex items-center justify-between text-xs sm:text-sm text-rose-900">
        <div class="flex items-center space-x-3">
          <i class="fa-solid fa-bell-concierge text-xl text-rose-600 animate-bounce"></i>
          <div>
            <span class="font-black block">${isHindi ? 'केयर कोऑर्डिनेटर सिस्टर कविता को लाइव अलर्ट भेजा गया' : 'Live Alert Created for Care Coordinator Sister Kavita'}</span>
            <span class="text-xs text-rose-700">${isHindi ? 'आपकी प्राथमिकता सूची #1 पर अपडेट कर दी गई है।' : 'Triage priority has been placed at Rank #1 in View 1 dashboard.'}</span>
          </div>
        </div>
        <button onclick="navigateRole('coordinator')" class="px-3 py-1.5 rounded-xl bg-rose-600 text-white font-bold text-xs hover:bg-rose-700 transition-colors shadow-sm">
          ${isHindi ? 'कोऑर्डिनेटर व्यू देखें' : 'View in Coordinator'}
        </button>
      </div>
    ` : ''}
  `;

  box.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function speakDiagnosticReport() {
  if (!assessmentState.lastPrediction) {
    showToast('No assessment results to read.', 'warning');
    return;
  }

  const res = assessmentState.lastPrediction;
  const isHindi = state.seniorLanguage === 'hi';
  const prof = getUserProfile('senior');
  const seniorName = prof.name ? prof.name.split(' ')[0] : 'Ramesh';

  let text = '';
  if (isHindi) {
    text = `नमस्ते ${seniorName} जी। आपकी स्वास्थ्य रिपोर्ट का परिणाम: ${res.predicted_risk_level_hi}। जोखिम स्कोर ${res.risk_score} है। ${res.alert_reason_summary_hi}। आज के लिए सलाह: दवा समय पर लें, नमक कम रखें और हल्के व्यायाम करें। सिस्टर कविता आपसे फोन पर संपर्क करेंगी।`;
  } else {
    text = `Hello ${seniorName} ji. Your health condition is evaluated as ${res.predicted_risk_level} Risk. Risk index score is ${res.risk_score} out of 100. Primary finding: ${res.alert_reason_summary}. Recommended recovery actions: take medicine on time, limit salt, and stay well hydrated. Care Coordinator Sister Kavita is monitoring your progress.`;
  }

  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = isHindi ? 'hi-IN' : 'en-IN';
    utterance.rate = 0.88;
    window.speechSynthesis.speak(utterance);
    showToast(isHindi ? 'स्वास्थ्य रिपोर्ट बोलकर सुनाई जा रही है...' : 'Reading diagnostic report aloud...', 'info');
  } else {
    showToast('Text-to-speech is not supported in this browser.', 'warning');
  }
}

function speakAssessmentResult() {
  speakDiagnosticReport();
}

function printDiagnosticReport() {
  soundEngine.playTone(600, 'sine', 0.1);
  window.print();
}

function shareReportViaWhatsApp() {
  if (!assessmentState.lastPrediction) {
    showToast('Run an assessment first to share report.', 'warning');
    return;
  }

  const res = assessmentState.lastPrediction;
  const prof = getUserProfile('senior');
  const family = getFamilyMembers();
  const recipient = family.length > 0 ? family[0] : null;

  const msg = `*CareConnect Health Diagnosis Report for ${prof.name || 'Senior'}*\n` +
    `Risk Status: ${res.predicted_risk_level} Risk (Score: ${res.risk_score}/100)\n` +
    `Primary Observation: ${res.alert_reason_summary || 'Telemetry recorded'}\n` +
    `Assigned Coordinator: Sister Kavita Verma, RN\n` +
    `Daily Rx Tasks: Scheduled and being completed.`;

  soundEngine.playSuccessChime();
  if (recipient) {
    showToast(`WhatsApp report dispatched to ${recipient.name} (${recipient.phone})!`, 'success');
  } else {
    showToast('Report shared via WhatsApp successfully!', 'success');
  }

  const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`;
  window.open(url, '_blank');
}
'''

# Find the location of renderAssessmentResult
target_marker = 'function renderAssessmentResult('
idx = content.find(target_marker)

if idx == -1:
    print("FAILED TO FIND renderAssessmentResult in app.js")
    sys.exit(1)

# Find where speakAssessmentResult ends (around line 2030)
speak_marker = 'function escalateAssessmentToCoordinator()'
idx_speak = content.find(speak_marker)

if idx_speak == -1:
    print("FAILED TO FIND escalateAssessmentToCoordinator in app.js")
    sys.exit(1)

# We replace from idx to idx_speak with the new code
content = content[:idx] + features_code + '\n' + content[idx_speak:]

# In enterDashboard, ensure renderFamilyCareCircle and restoreDailyTasks are called, and apply custom profile name
enter_dashboard_target = "  } else if (role === 'senior') {"
if enter_dashboard_target in content:
    replacement = """  } else if (role === 'senior') {
    setTimeout(() => {
      if (typeof restoreAssessmentDraft === 'function') {
        restoreAssessmentDraft();
      }
      if (typeof renderFamilyCareCircle === 'function') {
        renderFamilyCareCircle();
      }
      if (typeof restoreDailyTasks === 'function') {
        restoreDailyTasks();
      }
    }, 100);"""
    content = content.replace("""  } else if (role === 'senior') {
    setTimeout(() => {
      if (typeof restoreAssessmentDraft === 'function') {
        restoreAssessmentDraft();
      }
    }, 100);""", replacement, 1)
    print("Applied: enterDashboard senior hook updated")
else:
    print("Warning: enterDashboard hook not found")

# On initial DOMContentLoaded, render family care circle as well
dom_content_target = "  populateOpsIncidentStream();\n});"
if dom_content_target in content:
    content = content.replace(dom_content_target, "  populateOpsIncidentStream();\n  if (typeof renderFamilyCareCircle === 'function') renderFamilyCareCircle();\n});", 1)
    print("Applied: DOMContentLoaded hook updated")

with open('app.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("SUCCESS: app.js updated successfully with all 4 major features!")

