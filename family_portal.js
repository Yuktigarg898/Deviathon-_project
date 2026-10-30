// =========================================================================
// VIEW 3: FAMILY MEMBER LOGIC (परिवार का वेलबीइंग व हेल्थ मॉनिटर)
// Features: 
// 1. AI Analyze Summary & Wellbeing Metrics
// 2. Comprehensive Senior Health Report (Demographics, Vitals, History, Meds)
// 3. Complete Assessment History (Chronological Timeline, ADL, Pain, Voice Notes)
// 4. Download & Print Simple Assessment Report (Isolated Clinical Slip)
// =========================================================================

let familySelectedSeniorId = 'PAT-101'; // Default: Ramesh Sharma
let currentFamilyTab = 'summary'; // 'summary' | 'report' | 'history'
let currentFamilyHistoryFilter = 'all';

// Helper: Formats brackets with Relation of user with patient, along with age and gender
function getSeniorBracketInfo(p) {
  if (!p) return '(Senior)';
  const relationMap = {
    'PAT-101': 'Father',
    'PAT-102': 'Mother',
    'PAT-103': 'Uncle',
    'PAT-104': 'Aunt',
    'PAT-105': 'Father'
  };
  const rel = relationMap[p.id] || (p.emergencyContact && p.emergencyContact.relation ? p.emergencyContact.relation.split(' ')[0] : 'Senior');
  const age = p.age || 70;
  const gender = p.gender || 'Male';
  return `(${rel} • ${age} Yrs • ${gender})`;
}

// 1. Switch between Family Portal Tabs
function switchFamilyTab(tab) {
  currentFamilyTab = tab;
  const tabSummary = document.getElementById('family-tab-content-summary');
  const tabReport = document.getElementById('family-tab-content-report');
  const tabHistory = document.getElementById('family-tab-content-history');

  const btnSummary = document.getElementById('family-tab-btn-summary');
  const btnReport = document.getElementById('family-tab-btn-report');
  const btnHistory = document.getElementById('family-tab-btn-history');

  const activeBtnClass = "px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center space-x-2 bg-purple-700 text-white shadow-sm";
  const inactiveBtnClass = "px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all flex items-center space-x-2";

  if (tabSummary) tabSummary.classList.toggle('hidden', tab !== 'summary');
  if (tabReport) tabReport.classList.toggle('hidden', tab !== 'report');
  if (tabHistory) tabHistory.classList.toggle('hidden', tab !== 'history');

  if (btnSummary) btnSummary.className = tab === 'summary' ? activeBtnClass : inactiveBtnClass;
  if (btnReport) btnReport.className = tab === 'report' ? activeBtnClass : inactiveBtnClass;
  if (btnHistory) btnHistory.className = tab === 'history' ? activeBtnClass : inactiveBtnClass;

  if (tab === 'summary') {
    setTimeout(initFamilyVitalsChart, 50);
  } else if (tab === 'report') {
    renderFamilySeniorReport(familySelectedSeniorId);
  } else if (tab === 'history') {
    renderFamilyAssessmentHistory(currentFamilyHistoryFilter);
  }
}

// 2. Switch Linked Senior (Dropdown)
function changeFamilyLinkedSenior(seniorId) {
  familySelectedSeniorId = seniorId;
  const p = (state.patients || []).find(pt => pt.id === seniorId) || (state.patients ? state.patients[0] : null);
  if (!p) return;

  // Update top banner details
  const avatar = document.getElementById('family-senior-avatar');
  const nameHeading = document.getElementById('family-senior-name-heading');
  const metaSub = document.getElementById('family-senior-meta-sub');
  const tierBadge = document.getElementById('family-senior-tier-badge');
  const selector = document.getElementById('family-senior-selector');

  const bracketStr = getSeniorBracketInfo(p);

  if (selector && selector.value !== seniorId) selector.value = seniorId;
  if (avatar) avatar.src = p.avatar || "https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&auto=format&fit=crop&q=80";
  if (nameHeading) nameHeading.textContent = `${p.name} ${bracketStr}`;
  if (metaSub) metaSub.textContent = `@${p.username} • ${p.location} • Primary Nurse: ${p.assignedNurse || 'Sister Kavita, RN'}`;

  // Tier Badge
  if (tierBadge) {
    if (p.predictedTier === 'CRITICAL') {
      tierBadge.className = "px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-rose-500/30 text-rose-300 border border-rose-400/40 flex items-center space-x-1";
      tierBadge.innerHTML = `<i class="fa-solid fa-triangle-exclamation mr-1"></i><span>${p.tierLabel || '🚨 Critical Risk Tier'}</span>`;
      state.seniorStatus.isSerious = true;
    } else if (p.predictedTier === 'NORMAL') {
      tierBadge.className = "px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-emerald-500/30 text-emerald-300 border border-emerald-400/40 flex items-center space-x-1";
      tierBadge.innerHTML = `<i class="fa-solid fa-circle-check mr-1"></i><span>${p.tierLabel || '🟢 Normal Stable Baseline'}</span>`;
      state.seniorStatus.isSerious = false;
    } else {
      tierBadge.className = "px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-amber-500/30 text-amber-300 border border-amber-400/40 flex items-center space-x-1";
      tierBadge.innerHTML = `<i class="fa-solid fa-clock mr-1"></i><span>${p.tierLabel || '🟡 Moderate Monitoring'}</span>`;
      state.seniorStatus.isSerious = false;
    }
  }

  updateFamilyAlertBanner();
  renderFamilyAnalyzeSummary(p);
  renderFamilySeniorReport(seniorId);
  renderFamilyAssessmentHistory(currentFamilyHistoryFilter);

  showToast(`Viewing Family Portal for ${p.name}`, 'info');
}

// 3. Render Tab 1: AI Analyze Summary
function renderFamilyAnalyzeSummary(patient) {
  const p = patient || (state.patients || []).find(pt => pt.id === familySelectedSeniorId) || (state.patients ? state.patients[0] : null);
  if (!p) return;

  const aiText = document.getElementById('family-ai-analysis-text');
  if (aiText) {
    const drivers = p.modelDrivers && p.modelDrivers.length > 0
      ? p.modelDrivers.slice(0, 3).join('. ') + '.'
      : 'All vital signs, functional mobility, and medication compliance remain within safe clinical baseline.';
    aiText.textContent = drivers;
  }

  // Update Alert Box texts
  const alertTitle = document.getElementById('family-alert-title');
  const alertDesc = document.getElementById('family-alert-desc');
  const alertTime = document.getElementById('family-alert-time');

  if (alertTitle) alertTitle.textContent = `${p.name}: ${p.predictedTier === 'CRITICAL' ? 'Critical Vitals Alert & Attention Required' : 'Status Under Routine Observation'}`;
  if (alertDesc) alertDesc.textContent = p.suggestedAction || 'Automated health telemetry monitored by Care Coordinator Sister Kavita.';
  if (alertTime) alertTime.textContent = p.checkups && p.checkups[0] ? p.checkups[0].date : 'Today, Live';

  // Update Calm text
  const calmText = document.getElementById('family-calm-status-text');
  if (calmText) {
    calmText.textContent = `No critical issues detected for ${p.name}. Checked in on schedule and physiological parameters are safe.`;
  }

  // Update Stats cards
  const statMeds = document.getElementById('family-stat-meds');
  const statSleep = document.getElementById('family-stat-sleep');
  const statMood = document.getElementById('family-stat-mood');
  const statHr = document.getElementById('family-stat-hr');

  if (p.assessments && p.assessments.sleep) {
    if (statSleep) statSleep.textContent = `${p.assessments.sleep.hours} hrs/night`;
  }
  if (p.checkups && p.checkups[0]) {
    if (statHr) statHr.textContent = `${p.checkups[0].hr} (${p.checkups[0].hrStatus || 'Normal'})`;
  }
}

// 4. Render Tab 2: Senior Comprehensive Health Report
function renderFamilySeniorReport(seniorId) {
  const p = (state.patients || []).find(pt => pt.id === seniorId) || (state.patients ? state.patients[0] : null);
  if (!p) return;

  const bracketStr = getSeniorBracketInfo(p);

  // Title & Demographics
  const title = document.getElementById('report-senior-name-title');
  if (title) title.textContent = `Medical & Vitals Report: ${p.name} ${bracketStr}`;

  const pName = document.getElementById('report-patient-name');
  if (pName) pName.textContent = `${p.name} ${bracketStr}`;
  const pUser = document.getElementById('report-patient-username');
  if (pUser) pUser.textContent = `@${p.username}`;
  const pAgeGen = document.getElementById('report-patient-age-gender');
  if (pAgeGen) pAgeGen.textContent = `${p.age} Yrs • ${p.gender}`;
  const pBlood = document.getElementById('report-patient-blood-group');
  if (pBlood) pBlood.textContent = p.medicalHistory ? p.medicalHistory.bloodGroup || 'B +ve' : 'B +ve';

  const pDoc = document.getElementById('report-patient-doctor');
  if (pDoc) pDoc.textContent = p.medicalHistory ? p.medicalHistory.doctor || 'Dr. V.K. Kapoor' : 'Dr. V.K. Kapoor';
  const pRev = document.getElementById('report-patient-review-date');
  if (pRev) pRev.textContent = p.medicalHistory ? p.medicalHistory.nextReview || '15 Nov 2026' : '15 Nov 2026';
  const pNurse = document.getElementById('report-patient-nurse');
  if (pNurse) pNurse.textContent = p.assignedNurse || 'Sister Kavita, RN';
  const pLoc = document.getElementById('report-patient-location');
  if (pLoc) pLoc.textContent = p.location;

  // Emergency contact
  if (p.emergencyContact) {
    const eName = document.getElementById('report-emergency-name');
    if (eName) eName.textContent = `${p.emergencyContact.name} (${p.emergencyContact.relation})`;
    const ePhone = document.getElementById('report-emergency-phone');
    if (ePhone) ePhone.textContent = p.emergencyContact.phone;
    const eAlt = document.getElementById('report-emergency-alt');
    if (eAlt) eAlt.textContent = p.emergencyContact.altPhone || 'None';
  }

  // Vitals Grid (6 Telemetry Cards)
  const vitalsGrid = document.getElementById('report-vitals-grid');
  if (vitalsGrid && p.checkups && p.checkups[0]) {
    const v = p.checkups[0];
    const isBpHigh = parseInt(v.bp) >= 140;
    const isHrHigh = parseInt(v.hr) >= 100;
    const isSpo2Low = parseInt(v.spo2) < 95;

    vitalsGrid.innerHTML = `
      <div class="bg-white rounded-2xl p-3 border ${isBpHigh ? 'border-rose-300 bg-rose-50/40' : 'border-slate-200'} shadow-sm">
        <div class="text-[10px] font-bold text-slate-500 uppercase">Blood Pressure</div>
        <div class="text-base font-extrabold ${isBpHigh ? 'text-rose-600' : 'text-slate-800'} mt-0.5">${v.bp}</div>
        <span class="text-[10px] px-1.5 py-0.2 rounded font-bold ${isBpHigh ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'}">${v.bpStatus || 'Normal'}</span>
      </div>
      <div class="bg-white rounded-2xl p-3 border ${isHrHigh ? 'border-rose-300 bg-rose-50/40' : 'border-slate-200'} shadow-sm">
        <div class="text-[10px] font-bold text-slate-500 uppercase">Heart Rate</div>
        <div class="text-base font-extrabold ${isHrHigh ? 'text-rose-600' : 'text-slate-800'} mt-0.5">${v.hr}</div>
        <span class="text-[10px] px-1.5 py-0.2 rounded font-bold ${isHrHigh ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'}">${v.hrStatus || 'Normal'}</span>
      </div>
      <div class="bg-white rounded-2xl p-3 border ${isSpo2Low ? 'border-amber-300 bg-amber-50/40' : 'border-slate-200'} shadow-sm">
        <div class="text-[10px] font-bold text-slate-500 uppercase">Oxygen (SpO2)</div>
        <div class="text-base font-extrabold ${isSpo2Low ? 'text-amber-600' : 'text-slate-800'} mt-0.5">${v.spo2}</div>
        <span class="text-[10px] px-1.5 py-0.2 rounded font-bold ${isSpo2Low ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}">${v.spo2Status || 'Healthy'}</span>
      </div>
      <div class="bg-white rounded-2xl p-3 border border-slate-200 shadow-sm">
        <div class="text-[10px] font-bold text-slate-500 uppercase">Blood Glucose</div>
        <div class="text-base font-extrabold text-slate-800 mt-0.5">${v.glucose}</div>
        <span class="text-[10px] px-1.5 py-0.2 rounded font-bold bg-slate-100 text-slate-700">Fasting</span>
      </div>
      <div class="bg-white rounded-2xl p-3 border border-slate-200 shadow-sm">
        <div class="text-[10px] font-bold text-slate-500 uppercase">Temperature</div>
        <div class="text-base font-extrabold text-slate-800 mt-0.5">${v.temp}</div>
        <span class="text-[10px] px-1.5 py-0.2 rounded font-bold bg-emerald-100 text-emerald-700">Afebrile</span>
      </div>
      <div class="bg-white rounded-2xl p-3 border border-slate-200 shadow-sm">
        <div class="text-[10px] font-bold text-slate-500 uppercase">Weight & BMI</div>
        <div class="text-base font-extrabold text-slate-800 mt-0.5">${v.weight} (BMI ${v.bmi})</div>
        <span class="text-[10px] px-1.5 py-0.2 rounded font-bold bg-slate-100 text-slate-700">Healthy Range</span>
      </div>
    `;
  }

  // Chronic Conditions
  const chronicList = document.getElementById('report-chronic-list');
  if (chronicList && p.medicalHistory && p.medicalHistory.chronicConditions) {
    chronicList.innerHTML = p.medicalHistory.chronicConditions.map(c => `
      <li class="flex items-center space-x-2">
        <i class="fa-solid fa-circle-check text-teal-600 text-[10px]"></i>
        <span><strong>${c}</strong></span>
      </li>
    `).join('');
  }

  // Allergies & Surgeries
  const allergies = document.getElementById('report-allergies-text');
  if (allergies && p.medicalHistory) {
    allergies.textContent = (p.medicalHistory.allergies || ['None reported']).join(', ');
  }
  const surgeries = document.getElementById('report-surgeries-text');
  if (surgeries && p.medicalHistory) {
    surgeries.textContent = (p.medicalHistory.surgeries || ['None']).join(', ');
  }

  // Medications Table
  const medTable = document.getElementById('report-medications-table');
  if (medTable && p.medicalHistory && p.medicalHistory.medications) {
    medTable.innerHTML = p.medicalHistory.medications.map(m => `
      <tr class="hover:bg-slate-50 transition-colors">
        <td class="p-3 font-bold text-slate-900">${m.name}</td>
        <td class="p-3 font-mono text-slate-600">${m.dosage}</td>
        <td class="p-3 font-medium text-slate-700">${m.schedule}</td>
        <td class="p-3 text-slate-600">${m.purpose}</td>
        <td class="p-3 text-right">
          <span class="px-2 py-0.5 rounded-full text-[11px] font-extrabold bg-emerald-100 text-emerald-800">
            ${m.adherence}
          </span>
        </td>
      </tr>
    `).join('');
  }
}

// 5. Render Tab 3: Complete Assessment History
function renderFamilyAssessmentHistory(filterCategory) {
  const p = (state.patients || []).find(pt => pt.id === familySelectedSeniorId) || (state.patients ? state.patients[0] : null);
  if (!p) return;

  const container = document.getElementById('family-assessment-timeline-list');
  if (!container) return;

  const cards = [];

  // 1. Checkups (Vitals)
  if (p.checkups) {
    p.checkups.forEach((c, idx) => {
      if (filterCategory === 'all' || filterCategory === 'vitals') {
        cards.push(`
          <div class="p-4 sm:p-5 rounded-2xl border border-slate-200 bg-white shadow-sm flex items-start space-x-3.5 hover:border-teal-300 transition-all">
            <div class="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center text-lg flex-shrink-0 border border-teal-200">
              <i class="fa-solid fa-heart-pulse"></i>
            </div>
            <div class="flex-grow">
              <div class="flex flex-wrap items-center justify-between gap-1 mb-1">
                <div class="flex items-center space-x-2">
                  <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-100 text-teal-800 uppercase tracking-wider">
                    Vitals Telemetry Checkup
                  </span>
                  <span class="text-xs text-slate-400 font-medium">${c.date}</span>
                </div>
                <span class="text-xs text-slate-500 font-semibold">${c.conductedBy || 'IoT Hub & Nurse'}</span>
              </div>
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 my-2 text-xs">
                <div class="bg-slate-50 p-2 rounded-lg border border-slate-100">
                  <span class="text-slate-400 text-[10px] block">BP:</span>
                  <strong class="text-slate-800">${c.bp}</strong> (${c.bpStatus})
                </div>
                <div class="bg-slate-50 p-2 rounded-lg border border-slate-100">
                  <span class="text-slate-400 text-[10px] block">Heart Rate:</span>
                  <strong class="text-slate-800">${c.hr}</strong> (${c.hrStatus})
                </div>
                <div class="bg-slate-50 p-2 rounded-lg border border-slate-100">
                  <span class="text-slate-400 text-[10px] block">SpO2 Oxygen:</span>
                  <strong class="text-slate-800">${c.spo2}</strong> (${c.spo2Status})
                </div>
                <div class="bg-slate-50 p-2 rounded-lg border border-slate-100">
                  <span class="text-slate-400 text-[10px] block">Sugar:</span>
                  <strong class="text-slate-800">${c.glucose}</strong>
                </div>
              </div>
              <p class="text-xs text-slate-600 mt-1 italic">${c.notes}</p>
            </div>
          </div>
        `);
      }
    });
  }

  // 2. Direct Senior Inputs (Voice, One-tap)
  if (p.userInputs) {
    p.userInputs.forEach(u => {
      if (u.type === 'voice' && (filterCategory === 'all' || filterCategory === 'voice')) {
        const escapedText = u.hindiText.replace(/'/g, "\\'");
        cards.push(`
          <div class="p-4 sm:p-5 rounded-2xl border border-purple-200 bg-purple-50/40 shadow-sm flex items-start space-x-3.5 hover:border-purple-300 transition-all">
            <div class="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center text-lg flex-shrink-0 shadow-sm">
              <i class="fa-solid fa-microphone-lines"></i>
            </div>
            <div class="flex-grow">
              <div class="flex flex-wrap items-center justify-between gap-1 mb-1">
                <div class="flex items-center space-x-2">
                  <span class="px-2 py-0.5 rounded text-[10px] font-extrabold bg-purple-100 text-purple-800 uppercase tracking-wider">
                    Senior Voice Note Check-in
                  </span>
                  <span class="text-xs text-slate-400 font-medium">${u.timestamp}</span>
                </div>
                <span class="px-2 py-0.5 rounded text-[10px] font-bold ${u.sentimentBadge || 'bg-rose-100 text-rose-800'}">
                  ${u.sentiment} (${u.duration})
                </span>
              </div>
              <div class="bg-white p-3 rounded-xl border border-purple-100 mt-2">
                <p class="text-xs text-slate-800 font-medium leading-relaxed font-sans">
                  "${u.hindiText}"
                </p>
                <p class="text-[11px] text-slate-500 mt-1 border-t border-slate-100 pt-1 italic">
                  Translation: "${u.englishTranslation}"
                </p>
              </div>
              <div class="mt-2.5 flex items-center space-x-2">
                <button onclick="playFamilySeniorVoiceNote('${escapedText}')"
                  class="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-all flex items-center space-x-1.5 shadow-sm">
                  <i class="fa-solid fa-volume-high"></i>
                  <span>Play Senior Voice Note</span>
                </button>
                <span class="text-[11px] text-slate-400">Audio playback verified</span>
              </div>
            </div>
          </div>
        `);
      } else if (u.type === 'one_tap' && (filterCategory === 'all' || filterCategory === 'voice')) {
        cards.push(`
          <div class="p-4 sm:p-5 rounded-2xl border border-slate-200 bg-white shadow-sm flex items-start space-x-3.5 hover:border-slate-300 transition-all">
            <div class="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center text-lg flex-shrink-0 shadow-sm">
              <i class="fa-solid fa-hand-pointer"></i>
            </div>
            <div class="flex-grow">
              <div class="flex flex-wrap items-center justify-between gap-1 mb-1">
                <div class="flex items-center space-x-2">
                  <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 uppercase tracking-wider">
                    One-Tap Daily Mood Reply
                  </span>
                  <span class="text-xs text-slate-400 font-medium">${u.timestamp}</span>
                </div>
                <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                  ${u.selection}
                </span>
              </div>
              <p class="text-xs text-slate-700 mt-1">${u.recordedNote || 'Reported via 1-tap companion interface'}</p>
            </div>
          </div>
        `);
      }
    });
  }

  // 3. ADL Functional Independence & Pain Assessments
  if (p.assessments) {
    if (filterCategory === 'all' || filterCategory === 'adl') {
      const adl = p.assessments.adl;
      if (adl) {
        cards.push(`
          <div class="p-4 sm:p-5 rounded-2xl border border-indigo-200 bg-indigo-50/30 shadow-sm flex items-start space-x-3.5 hover:border-indigo-300 transition-all">
            <div class="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center text-lg flex-shrink-0 shadow-sm">
              <i class="fa-solid fa-person-walking"></i>
            </div>
            <div class="flex-grow">
              <div class="flex flex-wrap items-center justify-between gap-1 mb-1">
                <span class="px-2 py-0.5 rounded text-[10px] font-extrabold bg-indigo-100 text-indigo-800 uppercase tracking-wider">
                  ADL Functional Independence Assessment
                </span>
                <span class="text-xs text-slate-400 font-medium">Assessed by Sister Kavita, RN</span>
              </div>
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 my-2 text-xs">
                <div class="bg-white p-2.5 rounded-xl border border-indigo-100">
                  <span class="text-slate-400 text-[10px] block">🍽️ Eating:</span>
                  <strong class="text-emerald-700">${adl.eating ? adl.eating.score : '10/10'}</strong>
                  <div class="text-[10px] text-slate-500">${adl.eating ? adl.eating.status : 'Independent'}</div>
                </div>
                <div class="bg-white p-2.5 rounded-xl border border-indigo-100">
                  <span class="text-slate-400 text-[10px] block">🚽 Toileting:</span>
                  <strong class="text-amber-700">${adl.toileting ? adl.toileting.score : '7/10'}</strong>
                  <div class="text-[10px] text-slate-500">${adl.toileting ? adl.toileting.status : 'Grab bar aid'}</div>
                </div>
                <div class="bg-white p-2.5 rounded-xl border border-indigo-100">
                  <span class="text-slate-400 text-[10px] block">🚶 Walking:</span>
                  <strong class="text-amber-700">${adl.walking ? adl.walking.score : '6/10'}</strong>
                  <div class="text-[10px] text-slate-500">${adl.walking ? adl.walking.status : 'With Cane'}</div>
                </div>
                <div class="bg-white p-2.5 rounded-xl border border-indigo-100">
                  <span class="text-slate-400 text-[10px] block">🛏️ Moving/Bed:</span>
                  <strong class="text-indigo-700">${adl.moving ? adl.moving.score : '7/10'}</strong>
                  <div class="text-[10px] text-slate-500">${adl.moving ? adl.moving.status : 'Mild stiffness'}</div>
                </div>
              </div>
            </div>
          </div>
        `);
      }
    }

    if (filterCategory === 'all' || filterCategory === 'pain_sleep') {
      const pain = p.assessments.pain;
      const sleep = p.assessments.sleep;
      if (pain || sleep) {
        cards.push(`
          <div class="p-4 sm:p-5 rounded-2xl border border-slate-200 bg-white shadow-sm flex items-start space-x-3.5 hover:border-slate-300 transition-all">
            <div class="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center text-lg flex-shrink-0 border border-rose-200">
              <i class="fa-solid fa-bed"></i>
            </div>
            <div class="flex-grow">
              <div class="flex flex-wrap items-center justify-between gap-1 mb-1">
                <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 uppercase tracking-wider">
                  Pain & Sleep Quality Evaluation
                </span>
                <span class="text-xs text-slate-400 font-medium">Routine Weekly Check</span>
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 my-2 text-xs">
                <div class="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <div class="font-bold text-slate-700 flex items-center">
                    <i class="fa-solid fa-triangle-exclamation text-amber-500 mr-1.5"></i>
                    Pain Severity: <span class="ml-1 text-rose-600 font-extrabold">${pain ? pain.score : 4} / 10</span>
                  </div>
                  <div class="text-slate-600 mt-1">Location: <strong>${pain ? pain.location : 'Lower Back'}</strong></div>
                  <div class="text-slate-500 text-[11px] mt-0.5">${pain ? pain.sensation : 'Dull ache'}</div>
                </div>
                <div class="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <div class="font-bold text-slate-700 flex items-center">
                    <i class="fa-solid fa-moon text-indigo-500 mr-1.5"></i>
                    Sleep Duration: <span class="ml-1 text-indigo-600 font-extrabold">${sleep ? sleep.hours : 5.2} hrs</span>
                  </div>
                  <div class="text-slate-600 mt-1">Quality: <strong>${sleep ? sleep.quality : 'Restless'}</strong></div>
                  <div class="text-slate-500 text-[11px] mt-0.5">Reported 2 nighttime awakenings</div>
                </div>
              </div>
            </div>
          </div>
        `);
      }
    }
  }

  container.innerHTML = cards.join('');
  const badgeCount = document.getElementById('family-badge-history-count');
  if (badgeCount) badgeCount.textContent = cards.length;
}

// 6. Filter Assessment History
function filterFamilyAssessments(category) {
  currentFamilyHistoryFilter = category;
  const categories = ['all', 'vitals', 'adl', 'pain_sleep', 'voice'];
  categories.forEach(c => {
    const btn = document.getElementById('family-filter-btn-' + c);
    if (btn) {
      if (c === category) {
        btn.className = "px-3 py-1.5 rounded-xl text-xs font-extrabold bg-indigo-700 text-white shadow-sm transition-all";
      } else {
        btn.className = "px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-all";
      }
    }
  });

  renderFamilyAssessmentHistory(category);
}

// 7. Play Senior Recorded Voice Note (Speech Synthesis)
function playFamilySeniorVoiceNote(hindiText) {
  soundEngine.playTone(600, 'sine', 0.1);
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(hindiText);
    utterance.lang = 'hi-IN';
    utterance.rate = 0.95;
    window.speechSynthesis.speak(utterance);
    showToast(`Playing recorded voice note from Senior...`, 'info');
  } else {
    showToast(`Voice transcript: "${hindiText}"`, 'info');
  }
}

// =========================================================================
// SIMPLE ASSESSMENT REPORT BUILDER & CLEAN DOWNLOAD / PRINT ENGINE
// (Generates a clean assessment summary slip - NOT the whole portal)
// =========================================================================

function buildSimpleAssessmentText(p) {
  const v = (p.checkups && p.checkups[0]) ? p.checkups[0] : {};
  const adl = (p.assessments && p.assessments.adl) ? p.assessments.adl : {};
  const pain = (p.assessments && p.assessments.pain) ? p.assessments.pain : {};
  const sleep = (p.assessments && p.assessments.sleep) ? p.assessments.sleep : {};
  const voice = (p.userInputs || []).find(u => u.type === 'voice') || {};
  const bracketStr = getSeniorBracketInfo(p);

  return `================================================================================
                    CARECONNECT TELEMETRY & CLINICAL CARE
                       SIMPLE HEALTH ASSESSMENT REPORT
================================================================================
Report Generated : ${new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
Report ID        : CC-ASMT-${p.id || 'PAT-101'}-${Date.now().toString().slice(-4)}
Assessed By      : ${p.assignedNurse || 'Sister Kavita, RN'} (Care Coordinator)
Consulting Doc   : ${p.medicalHistory ? p.medicalHistory.doctor || 'Dr. V.K. Kapoor' : 'Dr. V.K. Kapoor'}

--------------------------------------------------------------------------------
1. PATIENT & CAREGIVER INFORMATION
--------------------------------------------------------------------------------
Patient Name     : ${p.name} ${bracketStr}
Username / ID    : @${p.username} | ${p.id}
Blood Group      : ${p.medicalHistory ? p.medicalHistory.bloodGroup || 'B +ve' : 'B +ve'}
Location         : ${p.location}
Emergency Contact: ${p.emergencyContact ? `${p.emergencyContact.name} (${p.emergencyContact.relation}) • ${p.emergencyContact.phone}` : 'Family Member'}

--------------------------------------------------------------------------------
2. CLINICAL RISK TRIAGE ASSESSMENT
--------------------------------------------------------------------------------
Predicted Tier   : ${p.tierLabel || p.predictedTier || 'NORMAL TIER'}
Risk Score       : ${p.modelScore || 80}/100 • ${p.modelRiskLevel || 'Monitored'}
Key Observations :
${(p.modelDrivers && p.modelDrivers.length > 0) ? p.modelDrivers.map(d => `  • ${d}`).join('\n') : '  • Physiological and functional vitals verified within baseline limits.'}

--------------------------------------------------------------------------------
3. CURRENT PHYSIOLOGICAL VITALS (LATEST TELEMETRY)
--------------------------------------------------------------------------------
  • Blood Pressure  : ${v.bp || '120/80 mmHg'} (${v.bpStatus || 'Normal'})
  • Heart Rate      : ${v.hr || '72 bpm'} (${v.hrStatus || 'Normal'})
  • Oxygen (SpO2)   : ${v.spo2 || '98%'} (${v.spo2Status || 'Healthy'})
  • Blood Glucose   : ${v.glucose || '110 mg/dL'} (Fasting)
  • Temperature     : ${v.temp || '98.4 °F'} (Afebrile)
  • Weight & BMI    : ${v.weight || '68 kg'} (BMI: ${v.bmi || '24.8'})

--------------------------------------------------------------------------------
4. FUNCTIONAL ADL (ACTIVITIES OF DAILY LIVING) ASSESSMENT
--------------------------------------------------------------------------------
  • Eating / Feeding    : ${adl.eating ? `${adl.eating.score} - ${adl.eating.status}` : '10/10 - Independent'}
  • Toileting           : ${adl.toileting ? `${adl.toileting.score} - ${adl.toileting.status}` : '7/10 - Requires Grab Bar'}
  • Walking / Mobility  : ${adl.walking ? `${adl.walking.score} - ${adl.walking.status}` : '6/10 - Unsteady, Cane Supported'}
  • Bed / Chair Transfer: ${adl.moving ? `${adl.moving.score} - ${adl.moving.status}` : '7/10 - Morning Stiffness'}

--------------------------------------------------------------------------------
5. PAIN & SLEEP ASSESSMENT
--------------------------------------------------------------------------------
  • Pain Severity : ${pain.score ? `${pain.score} / 10` : '0 / 10'} (${pain.location || 'None'})
  • Sensation     : ${pain.sensation || 'No discomfort'}
  • Sleep Cycle   : ${sleep.hours ? `${sleep.hours} hrs/night` : '7.0 hrs'} (${sleep.quality || 'Normal'})

--------------------------------------------------------------------------------
6. SENIOR DIRECT INPUT & SYMPTOMS SUMMARY
--------------------------------------------------------------------------------
  • Voice Check-in: "${voice.hindiText || 'Sab theek hai, koi takleef nahi hai.'}"
  • Translation   : "${voice.englishTranslation || 'Everything is fine, feeling comfortable.'}"
  • Sentiment     : ${voice.sentiment || 'Calm / Normal'}

--------------------------------------------------------------------------------
7. CLINICAL ACTION PLAN & RECOMMENDATIONS
--------------------------------------------------------------------------------
  • ${p.suggestedAction || 'Routine daily remote biometric monitoring and weekly nurse review.'}

================================================================================
           CareConnect Healthcare Systems • Verified Clinical Document
================================================================================
`;
}

function buildSimpleAssessmentHtml(p) {
  const v = (p.checkups && p.checkups[0]) ? p.checkups[0] : {};
  const adl = (p.assessments && p.assessments.adl) ? p.assessments.adl : {};
  const pain = (p.assessments && p.assessments.pain) ? p.assessments.pain : {};
  const sleep = (p.assessments && p.assessments.sleep) ? p.assessments.sleep : {};
  const voice = (p.userInputs || []).find(u => u.type === 'voice') || {};
  const bracketStr = getSeniorBracketInfo(p);
  const isCritical = p.predictedTier === 'CRITICAL';

  return `
    <div class="border-2 border-slate-300 rounded-2xl p-5 bg-white text-slate-800 space-y-4">
      <!-- Report Header -->
      <div class="border-b-2 border-slate-800 pb-3 flex items-start justify-between">
        <div>
          <div class="flex items-center space-x-2">
            <h2 class="text-base font-extrabold text-[#0e294b] tracking-tight">CareConnect Telemetry Core</h2>
            <span class="px-2 py-0.5 rounded text-[10px] font-bold ${isCritical ? 'bg-rose-100 text-rose-800 border border-rose-300' : 'bg-emerald-100 text-emerald-800 border border-emerald-300'}">
              ${isCritical ? '🚨 CRITICAL ASSESSMENT' : '🟢 STABLE ASSESSMENT'}
            </span>
          </div>
          <p class="text-[11px] text-slate-500 font-semibold mt-0.5">Simple Clinical Health Assessment Slip</p>
        </div>
        <div class="text-right text-[10px] text-slate-500 font-mono">
          <div>Report: CC-ASMT-${p.id || 'PAT-101'}</div>
          <div>Date: ${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
        </div>
      </div>

      <!-- 1. Patient Demographics & Caregiver -->
      <div class="bg-slate-50 rounded-xl p-3 border border-slate-200">
        <div class="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 mb-1.5">1. Patient & Caregiver Summary</div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          <div><span class="text-slate-500">Patient:</span> <strong class="text-slate-900">${p.name} ${bracketStr}</strong></div>
          <div><span class="text-slate-500">ID / Username:</span> <code class="bg-purple-100 text-purple-800 px-1 rounded">${p.id} • @${p.username}</code></div>
          <div><span class="text-slate-500">Blood Group:</span> <strong class="text-rose-600">${p.medicalHistory ? p.medicalHistory.bloodGroup || 'B +ve' : 'B +ve'}</strong></div>
          <div><span class="text-slate-500">Caregiver Contact:</span> <strong>${p.emergencyContact ? `${p.emergencyContact.name} (${p.emergencyContact.phone})` : 'Family'}</strong></div>
          <div><span class="text-slate-500">Care Coordinator:</span> <span>${p.assignedNurse || 'Sister Kavita, RN'}</span></div>
          <div><span class="text-slate-500">Physician:</span> <span>${p.medicalHistory ? p.medicalHistory.doctor || 'Dr. V.K. Kapoor' : 'Dr. V.K. Kapoor'}</span></div>
        </div>
      </div>

      <!-- 2. Physiological Vitals (Latest) -->
      <div>
        <div class="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 mb-1.5">2. Current Physiological Vitals</div>
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
          <div class="p-2 rounded-lg border border-slate-200 bg-slate-50">
            <span class="text-[10px] text-slate-500 block uppercase">Blood Pressure</span>
            <strong class="text-sm ${parseInt(v.bp) >= 140 ? 'text-rose-600' : 'text-slate-800'}">${v.bp || '120/80'}</strong>
            <span class="text-[10px] text-slate-500">(${v.bpStatus || 'Normal'})</span>
          </div>
          <div class="p-2 rounded-lg border border-slate-200 bg-slate-50">
            <span class="text-[10px] text-slate-500 block uppercase">Heart Rate</span>
            <strong class="text-sm ${parseInt(v.hr) >= 100 ? 'text-rose-600' : 'text-slate-800'}">${v.hr || '72 bpm'}</strong>
            <span class="text-[10px] text-slate-500">(${v.hrStatus || 'Normal'})</span>
          </div>
          <div class="p-2 rounded-lg border border-slate-200 bg-slate-50">
            <span class="text-[10px] text-slate-500 block uppercase">Oxygen (SpO2)</span>
            <strong class="text-sm ${parseInt(v.spo2) < 95 ? 'text-amber-600' : 'text-slate-800'}">${v.spo2 || '98%'}</strong>
            <span class="text-[10px] text-slate-500">(${v.spo2Status || 'Healthy'})</span>
          </div>
          <div class="p-2 rounded-lg border border-slate-200 bg-slate-50">
            <span class="text-[10px] text-slate-500 block uppercase">Blood Glucose</span>
            <strong class="text-sm text-slate-800">${v.glucose || '110 mg/dL'}</strong>
            <span class="text-[10px] text-slate-500">(Fasting)</span>
          </div>
          <div class="p-2 rounded-lg border border-slate-200 bg-slate-50">
            <span class="text-[10px] text-slate-500 block uppercase">Body Temp</span>
            <strong class="text-sm text-slate-800">${v.temp || '98.4 °F'}</strong>
            <span class="text-[10px] text-slate-500">(Afebrile)</span>
          </div>
          <div class="p-2 rounded-lg border border-slate-200 bg-slate-50">
            <span class="text-[10px] text-slate-500 block uppercase">Weight / BMI</span>
            <strong class="text-sm text-slate-800">${v.weight || '68 kg'}</strong>
            <span class="text-[10px] text-slate-500">(BMI ${v.bmi || '24.8'})</span>
          </div>
        </div>
      </div>

      <!-- 3. Functional ADL Independence & Pain/Sleep -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div class="p-3 rounded-xl border border-slate-200 bg-slate-50">
          <div class="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 mb-1">3. ADL Independence Tests</div>
          <div class="space-y-1 text-xs">
            <div>🍽️ Eating: <strong>${adl.eating ? adl.eating.score : '10/10'}</strong> (${adl.eating ? adl.eating.status : 'Independent'})</div>
            <div>🚽 Toileting: <strong>${adl.toileting ? adl.toileting.score : '7/10'}</strong> (${adl.toileting ? adl.toileting.status : 'Grab Bar Aid'})</div>
            <div>🚶 Walking: <strong>${adl.walking ? adl.walking.score : '6/10'}</strong> (${adl.walking ? adl.walking.status : 'With Cane'})</div>
            <div>🛏️ Bed Transfer: <strong>${adl.moving ? adl.moving.score : '7/10'}</strong> (${adl.moving ? adl.moving.status : 'Morning Stiffness'})</div>
          </div>
        </div>

        <div class="p-3 rounded-xl border border-slate-200 bg-slate-50">
          <div class="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 mb-1">4. Pain & Sleep Assessment</div>
          <div class="space-y-1 text-xs">
            <div>⚠️ Pain Scale: <strong class="${pain.score >= 4 ? 'text-rose-600' : 'text-slate-800'}">${pain.score ? `${pain.score} / 10` : '0 / 10'}</strong></div>
            <div class="text-slate-600">Location: ${pain.location || 'None'} (${pain.sensation || 'Dull ache'})</div>
            <div>🌙 Sleep Rest: <strong>${sleep.hours ? `${sleep.hours} hrs/night` : '7.0 hrs'}</strong> (${sleep.quality || 'Normal'})</div>
            <div class="text-[11px] text-slate-500">Restless sleep cycle noted.</div>
          </div>
        </div>
      </div>

      <!-- 4. Senior Direct Voice Input -->
      <div class="p-3 rounded-xl border border-purple-200 bg-purple-50/50">
        <div class="text-[10px] font-extrabold uppercase tracking-wider text-purple-900 mb-1">5. Senior Direct Input Transcript</div>
        <p class="text-xs text-purple-950 font-medium italic">"${voice.hindiText || 'Sab theek hai, regular routine follow kar rahe hain.'}"</p>
        <p class="text-[11px] text-slate-500 mt-0.5">Translation: "${voice.englishTranslation || 'Everything is fine, following regular routine.'}"</p>
      </div>

      <!-- 5. Clinical Recommendations -->
      <div class="p-3 rounded-xl border border-teal-200 bg-teal-50/50">
        <div class="text-[10px] font-extrabold uppercase tracking-wider text-teal-900 mb-1">6. Clinical Recommendation</div>
        <p class="text-xs text-teal-950">${p.suggestedAction || 'Continue routine biometric supervision and nurse checkup schedule.'}</p>
      </div>
    </div>
  `;
}

// 8. Download Simple Assessment Report (.txt file)
function downloadSimpleAssessmentReport() {
  const p = (state.patients || []).find(pt => pt.id === familySelectedSeniorId) || (state.patients ? state.patients[0] : null);
  if (!p) return;

  const textContent = buildSimpleAssessmentText(p);
  const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const safeName = p.name.replace(/[^a-zA-Z0-9]/g, '_');
  a.href = url;
  a.download = `${safeName}_Simple_Health_Assessment_Report.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  showToast(`Downloaded Simple Health Assessment Report for ${p.name}!`, 'success');
}

// 9. Open Simple Assessment Modal
function openSimpleAssessmentModal() {
  const p = (state.patients || []).find(pt => pt.id === familySelectedSeniorId) || (state.patients ? state.patients[0] : null);
  if (!p) return;

  const modal = document.getElementById('modal-simple-assessment');
  const slipContainer = document.getElementById('simple-assessment-slip-content');
  if (slipContainer) {
    slipContainer.innerHTML = buildSimpleAssessmentHtml(p);
  }
  if (modal) modal.classList.remove('hidden');
}

// 10. Close Simple Assessment Modal
function closeSimpleAssessmentModal() {
  const modal = document.getElementById('modal-simple-assessment');
  if (modal) modal.classList.add('hidden');
}

// 11. Print Clean Assessment Slip Only (Isolated from Portal)
function printSimpleAssessmentSlipOnly() {
  const p = (state.patients || []).find(pt => pt.id === familySelectedSeniorId) || (state.patients ? state.patients[0] : null);
  if (!p) return;

  const htmlContent = buildSimpleAssessmentHtml(p);
  const printWindow = window.open('', '_blank', 'width=800,height=900');
  if (!printWindow) {
    showToast('Popup blocked. Please allow popups to print.', 'warning');
    return;
  }

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>CareConnect - Simple Health Assessment Report</title>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; font-size: 12px; color: #1e293b; padding: 25px; line-height: 1.5; }
          .header { text-align: center; border-bottom: 2px solid #0e294b; padding-bottom: 12px; margin-bottom: 16px; }
          .header h1 { margin: 0; font-size: 18px; color: #0e294b; }
          .header p { margin: 2px 0 0 0; font-size: 11px; color: #64748b; }
          .grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; }
          .vitals-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
          .badge { display: inline-block; padding: 2px 6px; border-radius: 4px; font-size: 10px; font-weight: bold; }
          .footer { text-align: center; margin-top: 20px; font-size: 10px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 8px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>CareConnect Telemetry Core</h1>
          <p>Simple Health & Vitals Assessment Report</p>
        </div>
        ${htmlContent}
        <div class="footer">
          CareConnect Clinical Systems • Simple Assessment Document • Verified Telemetry
        </div>
        <script>
          window.onload = function() {
            window.print();
            setTimeout(function() { window.close(); }, 500);
          };
        <\/script>
      </body>
    </html>
  `);
  printWindow.document.close();
}

// Backward compatibility helper
function printSeniorReport() {
  openSimpleAssessmentModal();
}

function updateFamilyAlertBanner() {
  const alertCard = document.getElementById('family-serious-alert-card');
  const calmBanner = document.getElementById('family-calm-status-banner');
  const navDot = document.getElementById('nav-family-alert-dot');

  if (!alertCard || !calmBanner) return;

  if (state.seniorStatus.isSerious) {
    alertCard.classList.remove('hidden');
    calmBanner.classList.add('hidden');
    if (navDot) navDot.classList.remove('hidden');
  } else {
    alertCard.classList.add('hidden');
    calmBanner.classList.remove('hidden');
    if (navDot) navDot.classList.add('hidden');
  }
}

function dismissFamilyAlert() {
  soundEngine.playSuccessChime();
  state.seniorStatus.isSerious = false;
  updateFamilyAlertBanner();
  showToast('Alert acknowledged. Switching to calm monitoring view.', 'info');
}

function simulateSeriousEmergencyForFamily() {
  soundEngine.playEmergencySiren();
  state.seniorStatus.isSerious = true;
  updateFamilyAlertBanner();
  showToast('🚨 Serious alert simulated for Family View demonstration.', 'danger');
}

function simulateFamilyCallDad() {
  const p = (state.patients || []).find(pt => pt.id === familySelectedSeniorId) || (state.patients ? state.patients[0] : null);
  const name = p ? p.name : 'Senior';
  const phone = p ? p.phone : '+91 98110-44912';
  openCallModal('DAD-CALL', `${name} (Senior)`, phone);
}

function simulateFamilyCallCoordinator() {
  openCallModal('COORD-CALL', 'Sister Kavita, RN (Care Coordinator)', '+91 98711-00122');
}

function sendFamilyMessageToDad() {
  const input = document.getElementById('family-message-input');
  if (!input || !input.value.trim()) return;
  const msg = input.value.trim();
  soundEngine.playSuccessChime();
  input.value = '';
  showToast(`Message sent to Senior: "${msg}" (Will be read aloud to them)`, 'success');
}

// 7-Day Vitals & Sentiment Trajectory Chart (Chart.js)
function initFamilyVitalsChart() {
  const canvas = document.getElementById('familyVitalsChart');
  if (!canvas) return;

  if (state.charts.familyVitals) {
    state.charts.familyVitals.destroy();
  }

  const ctx = canvas.getContext('2d');
  state.charts.familyVitals = new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['Thu (Oct 22)', 'Fri (Oct 23)', 'Sat (Oct 24)', 'Sun (Oct 25)', 'Mon (Oct 26)', 'Tue (Oct 27)', 'Today (Oct 28)'],
      datasets: [
        {
          label: 'Systolic BP (mmHg)',
          data: [126, 128, 125, 142, 130, 128, 158],
          borderColor: '#f43f5e',
          backgroundColor: 'rgba(244, 63, 94, 0.08)',
          tension: 0.35,
          fill: true,
          pointRadius: 4,
          pointBackgroundColor: '#f43f5e',
          yAxisID: 'y'
        },
        {
          label: 'Mood & Energy (1 to 5)',
          data: [4.5, 4.8, 4.6, 2.5, 4.2, 4.4, 3.0],
          borderColor: '#14b8a6',
          backgroundColor: 'transparent',
          borderDash: [4, 4],
          tension: 0.3,
          pointRadius: 4,
          pointBackgroundColor: '#14b8a6',
          yAxisID: 'y1'
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'top',
          labels: { boxWidth: 12, font: { size: 10, family: 'Inter' } }
        },
        tooltip: {
          padding: 8,
          bodyFont: { size: 11 }
        }
      },
      scales: {
        y: {
          type: 'linear',
          display: true,
          position: 'left',
          min: 100,
          max: 180,
          title: { display: true, text: 'BP (mmHg)', font: { size: 9 } },
          grid: { color: 'rgba(226, 232, 240, 0.6)' }
        },
        y1: {
          type: 'linear',
          display: true,
          position: 'right',
          min: 1,
          max: 5,
          title: { display: true, text: 'Mood', font: { size: 9 } },
          grid: { drawOnChartArea: false }
        }
      }
    }
  });
}
