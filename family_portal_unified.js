// =========================================================================
// VIEW 3: FAMILY MEMBER LOGIC (परिवार का वेलबीइंग व हेल्थ मॉनिटर)
// Features: 
// 1. AI Analyze Summary & Wellbeing Metrics
// 2. Comprehensive Senior Health Report (Demographics, Vitals, History, Meds)
// 3. Complete Assessment History (Chronological Timeline, ADL, Pain, Voice Notes)
// 4. Download & Print Full Health Assessment PDF & Plain Text Reports
// =========================================================================

let familySelectedSeniorId = 'PAT-101'; // Default: Ramesh Sharma
let currentFamilyTab = 'summary'; // 'summary' | 'report' | 'history'
let currentFamilyHistoryFilter = 'all';

// Helper 1: Formats brackets with Relation of user with patient, along with age and gender
// e.g. [Father • 74 Yrs • Male]
function getSeniorBracketInfo(p) {
  if (!p) return '[Senior]';
  const relationMap = {
    'PAT-101': 'Father',
    'PAT-102': 'Mother',
    'PAT-103': 'Uncle',
    'PAT-104': 'Aunt',
    'PAT-105': 'Father'
  };
  const rel = relationMap[p.id] || (p.emergencyContact && p.emergencyContact.relation ? p.emergencyContact.relation.split(' ')[0] : 'Senior');
  const age = p.age || 74;
  const gender = p.gender || 'Male';
  return `[${rel} • ${age} Yrs • ${gender}]`;
}

// Helper 2: Formats second bracket under patient name containing name, gender and age of person related to patient
// e.g. [Caregiver: Rahul Sharma • Male • 42 Yrs]
function getCaregiverBracketInfo(p) {
  if (!p) return '[Caregiver: Rahul Sharma • Male • 42 Yrs]';
  const caregiverMap = {
    'PAT-101': { name: 'Rahul Sharma', gender: 'Male', age: 42, role: 'Caregiver / Son' },
    'PAT-102': { name: 'Pooja Sharma', gender: 'Female', age: 48, role: 'Caregiver / Daughter' },
    'PAT-103': { name: 'Vikas Verma', gender: 'Male', age: 45, role: 'Caregiver / Nephew' },
    'PAT-104': { name: 'Deepa Iyer', gender: 'Female', age: 39, role: 'Caregiver / Niece' },
    'PAT-105': { name: 'Ketan Patel', gender: 'Male', age: 44, role: 'Caregiver / Son' }
  };
  const c = caregiverMap[p.id] || { name: 'Rahul Sharma', gender: 'Male', age: 42, role: 'Caregiver' };
  return `[Caregiver: ${c.name} • ${c.gender} • ${c.age} Yrs]`;
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

  const currentPatient = (state.patients || []).find(p => p.id === familySelectedSeniorId) || (state.patients ? state.patients[0] : null);
  if (currentPatient) {
    if (tab === 'summary') renderFamilyAnalyzeSummary(currentPatient);
    if (tab === 'report') renderFamilySeniorReport(currentPatient);
    if (tab === 'history') renderFamilyAssessmentHistory(currentPatient);
  }
}

// 2. Change Linked Senior from dropdown
function changeFamilyLinkedSenior(patientId) {
  familySelectedSeniorId = patientId;
  const p = (state.patients || []).find(pt => pt.id === patientId);
  if (!p) return;

  const bracketStr = getSeniorBracketInfo(p);
  const caregiverStr = getCaregiverBracketInfo(p);

  // Update Top Banner Senior Name with Dual Brackets
  const heading = document.getElementById('family-senior-name-heading');
  if (heading) {
    heading.innerHTML = `${p.name} <span class="text-lg sm:text-xl font-bold text-purple-200">${bracketStr}</span>`;
  }
  const caregiverHeading = document.getElementById('family-caregiver-heading');
  if (caregiverHeading) {
    caregiverHeading.textContent = caregiverStr;
  }
  const selectorCaregiverSub = document.getElementById('family-selector-caregiver-sub');
  if (selectorCaregiverSub) {
    selectorCaregiverSub.textContent = caregiverStr;
  }

  const metaSub = document.getElementById('family-senior-meta-sub');
  if (metaSub) {
    metaSub.textContent = `@${p.username} • ${p.location} • Primary Nurse: ${p.assignedNurse || 'Sister Kavita, RN'}`;
  }

  // Update Dropdown value if needed
  const selector = document.getElementById('family-senior-selector');
  if (selector && selector.value !== patientId) {
    selector.value = patientId;
  }

  // Re-render current active view tab
  renderFamilyAnalyzeSummary(p);
  renderFamilySeniorReport(p);
  renderFamilyAssessmentHistory(p);

  showToast(`Switched view to ${p.name} ${bracketStr}`, 'info');
}

// 3. Render Tab 1: Analyze Summary
function renderFamilyAnalyzeSummary(p) {
  if (!p) return;
  const v = (p.checkups && p.checkups[0]) ? p.checkups[0] : {};
  const isCritical = p.predictedTier === 'CRITICAL';
  const bracketStr = getSeniorBracketInfo(p);
  const caregiverStr = getCaregiverBracketInfo(p);

  // Update Emergency Alert Banner
  const alertBanner = document.getElementById('family-serious-alert-banner');
  if (alertBanner) {
    alertBanner.classList.toggle('hidden', !isCritical);
  }

  // Update Patient Name Display in cards
  const summaryName = document.getElementById('family-summary-senior-name');
  if (summaryName) summaryName.textContent = `${p.name} ${bracketStr}`;

  const summaryCaregiver = document.getElementById('family-summary-caregiver-name');
  if (summaryCaregiver) summaryCaregiver.textContent = caregiverStr;

  // Vitals summary cards
  const elBp = document.getElementById('family-vital-bp');
  if (elBp) {
    elBp.textContent = v.bp || '120/80';
    elBp.className = `text-2xl font-black ${parseInt(v.bp) >= 140 ? 'text-rose-600' : 'text-slate-800'}`;
  }
  const elBpStatus = document.getElementById('family-vital-bp-status');
  if (elBpStatus) elBpStatus.textContent = v.bpStatus || 'Normal';

  const elHr = document.getElementById('family-vital-hr');
  if (elHr) {
    elHr.textContent = v.hr || '72 bpm';
    elHr.className = `text-2xl font-black ${parseInt(v.hr) >= 100 ? 'text-rose-600' : 'text-slate-800'}`;
  }
  const elHrStatus = document.getElementById('family-vital-hr-status');
  if (elHrStatus) elHrStatus.textContent = v.hrStatus || 'Normal';

  const elSpo2 = document.getElementById('family-vital-spo2');
  if (elSpo2) {
    elSpo2.textContent = v.spo2 || '98%';
    elSpo2.className = `text-2xl font-black ${parseInt(v.spo2) < 95 ? 'text-amber-600' : 'text-slate-800'}`;
  }
  const elSpo2Status = document.getElementById('family-vital-spo2-status');
  if (elSpo2Status) elSpo2Status.textContent = v.spo2Status || 'Optimal';

  const elAdherence = document.getElementById('family-vital-adherence');
  if (elAdherence) elAdherence.textContent = isCritical ? '89%' : '96%';

  // Routine & Safety Status
  const sleepStatus = document.getElementById('family-routine-sleep');
  if (sleepStatus) sleepStatus.textContent = p.assessments && p.assessments.sleep ? `${p.assessments.sleep.hours} hrs (${p.assessments.sleep.quality})` : '7.0 hrs (Normal)';

  const painStatus = document.getElementById('family-routine-pain');
  if (painStatus) {
    const pain = p.assessments && p.assessments.pain ? p.assessments.pain : { score: 0 };
    painStatus.textContent = pain.score > 0 ? `Level ${pain.score}/10 (${pain.location || 'Reported'})` : 'No Significant Pain (0/10)';
  }

  // AI Insights Drivers List
  const insightsContainer = document.getElementById('family-ai-insights-list');
  if (insightsContainer && p.modelDrivers) {
    insightsContainer.innerHTML = p.modelDrivers.map(d => `
      <div class="flex items-start space-x-2.5 p-2.5 rounded-xl bg-purple-50/70 border border-purple-100 text-xs">
        <i class="fa-solid fa-circle-check text-purple-600 mt-0.5 flex-shrink-0"></i>
        <span class="text-slate-700 font-medium">${d}</span>
      </div>
    `).join('');
  }
}

// 4. Render Tab 2: Comprehensive Senior Health Report
function renderFamilySeniorReport(p) {
  if (!p) return;
  const bracketStr = getSeniorBracketInfo(p);
  const caregiverStr = getCaregiverBracketInfo(p);
  const v = (p.checkups && p.checkups[0]) ? p.checkups[0] : {};
  const medHistory = p.medicalHistory || {};

  const titleEl = document.getElementById('report-senior-name-title');
  if (titleEl) titleEl.textContent = `Medical & Vitals Report: ${p.name} ${bracketStr}`;

  const reportCaregiverSub = document.getElementById('report-caregiver-sub');
  if (reportCaregiverSub) reportCaregiverSub.textContent = caregiverStr;

  // Demographics
  const patName = document.getElementById('report-patient-name');
  if (patName) patName.textContent = `${p.name} ${bracketStr}`;

  const patCaregiver = document.getElementById('report-patient-caregiver');
  if (patCaregiver) patCaregiver.textContent = caregiverStr;

  const patUser = document.getElementById('report-patient-username');
  if (patUser) patUser.textContent = `@${p.username}`;

  const patAge = document.getElementById('report-patient-age-gender');
  if (patAge) patAge.textContent = `${p.age} Yrs / ${p.gender}`;

  const patBlood = document.getElementById('report-patient-blood');
  if (patBlood) patBlood.textContent = medHistory.bloodGroup || 'B +ve';

  const patContact = document.getElementById('report-patient-contact');
  if (patContact) patContact.textContent = p.phone || '+91 98110-44912';

  const patAddress = document.getElementById('report-patient-address');
  if (patAddress) patAddress.textContent = p.location || 'South Delhi, New Delhi';

  // Medical Team & Review
  const patNurse = document.getElementById('report-patient-nurse');
  if (patNurse) patNurse.textContent = p.assignedNurse || 'Sister Kavita, RN';

  const patDoctor = document.getElementById('report-patient-doctor');
  if (patDoctor) patDoctor.textContent = medHistory.doctor || 'Dr. V.K. Kapoor (Fortis Escorts)';

  const patNextReview = document.getElementById('report-patient-next-review');
  if (patNextReview) patNextReview.textContent = medHistory.nextReview || '15 Nov 2026';

  // Chronic Conditions
  const conditionsEl = document.getElementById('report-chronic-conditions');
  if (conditionsEl && medHistory.chronicConditions) {
    conditionsEl.innerHTML = medHistory.chronicConditions.map(c => `
      <span class="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 border border-slate-200 text-xs font-semibold">
        <i class="fa-solid fa-notes-medical text-teal-600 mr-1"></i>${c}
      </span>
    `).join('');
  }

  // Medications Table
  const medsTbody = document.getElementById('report-medications-tbody');
  if (medsTbody && medHistory.medications) {
    medsTbody.innerHTML = medHistory.medications.map(m => `
      <tr class="border-b border-slate-100 hover:bg-slate-50/50">
        <td class="py-2.5 px-3 font-bold text-slate-800">${m.name}</td>
        <td class="py-2.5 px-3 text-slate-600">${m.dosage}</td>
        <td class="py-2.5 px-3 text-slate-600">${m.schedule}</td>
        <td class="py-2.5 px-3 text-slate-500">${m.purpose}</td>
        <td class="py-2.5 px-3 font-semibold text-emerald-700">${m.adherence || '95%'}</td>
      </tr>
    `).join('');
  }

  // Checkup Vitals
  const vBp = document.getElementById('report-vital-bp');
  if (vBp) vBp.textContent = v.bp || '120/80 mmHg';

  const vHr = document.getElementById('report-vital-hr');
  if (vHr) vHr.textContent = v.hr || '72 bpm';

  const vSpo2 = document.getElementById('report-vital-spo2');
  if (vSpo2) vSpo2.textContent = v.spo2 || '98%';

  const vGlucose = document.getElementById('report-vital-glucose');
  if (vGlucose) vGlucose.textContent = v.glucose || '110 mg/dL';

  const vTemp = document.getElementById('report-vital-temp');
  if (vTemp) vTemp.textContent = v.temp || '98.4 °F';

  const vBmi = document.getElementById('report-vital-bmi');
  if (vBmi) vBmi.textContent = v.bmi ? `BMI ${v.bmi} (${v.weight || '68kg'})` : 'BMI 24.8 (Normal)';
}

// 5. Render Tab 3: Assessment History (Timeline)
function renderFamilyAssessmentHistory(p) {
  if (!p) return;
  const container = document.getElementById('family-assessment-timeline-list');
  if (!container) return;

  const bracketStr = getSeniorBracketInfo(p);
  const caregiverStr = getCaregiverBracketInfo(p);
  const isCritical = p.predictedTier === 'CRITICAL';
  const v = (p.checkups && p.checkups[0]) ? p.checkups[0] : {};
  const adl = (p.assessments && p.assessments.adl) ? p.assessments.adl : {};
  const pain = (p.assessments && p.assessments.pain) ? p.assessments.pain : {};
  const sleep = (p.assessments && p.assessments.sleep) ? p.assessments.sleep : {};
  const voice = (p.userInputs || []).find(u => u.type === 'voice') || {};

  // Build assessment items matching filter
  const items = [];

  // Item 1: Vitals Assessment
  if (currentFamilyHistoryFilter === 'all' || currentFamilyHistoryFilter === 'vitals') {
    items.push(`
      <div class="relative pl-8 pb-6 border-l-2 border-purple-200">
        <div class="absolute -left-2.5 top-0 w-5 h-5 rounded-full ${isCritical ? 'bg-rose-500' : 'bg-emerald-500'} text-white flex items-center justify-center text-[10px] shadow-sm">
          <i class="fa-solid fa-heart-pulse"></i>
        </div>
        <div class="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-2">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-slate-800">Physiological Vitals Assessment</span>
            <span class="text-[11px] text-slate-400 font-mono">Today, 08:30 AM</span>
          </div>
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <div class="p-2 rounded-lg bg-slate-50 border border-slate-100">
              <span class="text-slate-400 block text-[10px]">Blood Pressure</span>
              <strong class="${parseInt(v.bp) >= 140 ? 'text-rose-600' : 'text-slate-800'}">${v.bp || '120/80'}</strong>
              <span class="text-[10px] text-slate-500">(${v.bpStatus || 'Normal'})</span>
            </div>
            <div class="p-2 rounded-lg bg-slate-50 border border-slate-100">
              <span class="text-slate-400 block text-[10px]">Heart Rate</span>
              <strong class="${parseInt(v.hr) >= 100 ? 'text-rose-600' : 'text-slate-800'}">${v.hr || '72 bpm'}</strong>
              <span class="text-[10px] text-slate-500">(${v.hrStatus || 'Normal'})</span>
            </div>
            <div class="p-2 rounded-lg bg-slate-50 border border-slate-100">
              <span class="text-slate-400 block text-[10px]">SpO2 Saturation</span>
              <strong class="${parseInt(v.spo2) < 95 ? 'text-amber-600' : 'text-slate-800'}">${v.spo2 || '98%'}</strong>
              <span class="text-[10px] text-slate-500">(${v.spo2Status || 'Healthy'})</span>
            </div>
            <div class="p-2 rounded-lg bg-slate-50 border border-slate-100">
              <span class="text-slate-400 block text-[10px]">Blood Glucose</span>
              <strong class="text-slate-800">${v.glucose || '110 mg/dL'}</strong>
              <span class="text-[10px] text-slate-500">(Fasting)</span>
            </div>
          </div>
        </div>
      </div>
    `);
  }

  // Item 2: ADL Functional Independence Assessment
  if (currentFamilyHistoryFilter === 'all' || currentFamilyHistoryFilter === 'adl') {
    items.push(`
      <div class="relative pl-8 pb-6 border-l-2 border-purple-200">
        <div class="absolute -left-2.5 top-0 w-5 h-5 rounded-full bg-indigo-500 text-white flex items-center justify-center text-[10px] shadow-sm">
          <i class="fa-solid fa-person-walking"></i>
        </div>
        <div class="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-2">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-slate-800">Functional ADL Independence Assessment</span>
            <span class="text-[11px] text-slate-400 font-mono">Today, 08:00 AM</span>
          </div>
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <div class="p-2 rounded-lg bg-slate-50 border border-slate-100">
              <span class="text-slate-400 block text-[10px]">Eating</span>
              <strong>${adl.eating ? adl.eating.score : '10/10'}</strong>
              <span class="text-[10px] text-slate-500 block truncate">${adl.eating ? adl.eating.status : 'Independent'}</span>
            </div>
            <div class="p-2 rounded-lg bg-slate-50 border border-slate-100">
              <span class="text-slate-400 block text-[10px]">Toileting</span>
              <strong>${adl.toileting ? adl.toileting.score : '7/10'}</strong>
              <span class="text-[10px] text-slate-500 block truncate">${adl.toileting ? adl.toileting.status : 'Grab Bar Aid'}</span>
            </div>
            <div class="p-2 rounded-lg bg-slate-50 border border-slate-100">
              <span class="text-slate-400 block text-[10px]">Walking</span>
              <strong>${adl.walking ? adl.walking.score : '6/10'}</strong>
              <span class="text-[10px] text-slate-500 block truncate">${adl.walking ? adl.walking.status : 'With Cane'}</span>
            </div>
            <div class="p-2 rounded-lg bg-slate-50 border border-slate-100">
              <span class="text-slate-400 block text-[10px]">Bed Transfer</span>
              <strong>${adl.moving ? adl.moving.score : '7/10'}</strong>
              <span class="text-[10px] text-slate-500 block truncate">${adl.moving ? adl.moving.status : 'Mild Stiffness'}</span>
            </div>
          </div>
        </div>
      </div>
    `);
  }

  // Item 3: Pain & Sleep Checkup
  if (currentFamilyHistoryFilter === 'all' || currentFamilyHistoryFilter === 'pain_sleep') {
    items.push(`
      <div class="relative pl-8 pb-6 border-l-2 border-purple-200">
        <div class="absolute -left-2.5 top-0 w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center text-[10px] shadow-sm">
          <i class="fa-solid fa-moon"></i>
        </div>
        <div class="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-2">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-slate-800">Pain & Sleep Quality Metrics</span>
            <span class="text-[11px] text-slate-400 font-mono">Today, 07:45 AM</span>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div class="p-2.5 rounded-xl bg-amber-50/60 border border-amber-200/60">
              <div class="flex items-center justify-between mb-1">
                <span class="font-bold text-amber-900">Pain Scale</span>
                <span class="px-2 py-0.5 rounded text-[10px] font-extrabold ${pain.score >= 4 ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'}">
                  ${pain.score ? `${pain.score}/10` : '0/10'}
                </span>
              </div>
              <p class="text-slate-600 text-[11px]">Location: ${pain.location || 'None'} • ${pain.sensation || 'Dull ache'}</p>
            </div>
            <div class="p-2.5 rounded-xl bg-indigo-50/60 border border-indigo-200/60">
              <div class="flex items-center justify-between mb-1">
                <span class="font-bold text-indigo-900">Sleep Duration</span>
                <span class="px-2 py-0.5 rounded text-[10px] font-extrabold bg-indigo-100 text-indigo-800">
                  ${sleep.hours ? `${sleep.hours} hrs` : '7.0 hrs'}
                </span>
              </div>
              <p class="text-slate-600 text-[11px]">Quality: ${sleep.quality || 'Normal uninterrupted rest'}</p>
            </div>
          </div>
        </div>
      </div>
    `);
  }

  // Item 4: Voice Note & Hindi Transcript
  if (currentFamilyHistoryFilter === 'all' || currentFamilyHistoryFilter === 'voice') {
    items.push(`
      <div class="relative pl-8 pb-2 border-l-2 border-purple-200">
        <div class="absolute -left-2.5 top-0 w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center text-[10px] shadow-sm">
          <i class="fa-solid fa-microphone"></i>
        </div>
        <div class="bg-purple-50/80 rounded-2xl p-4 border border-purple-200 shadow-sm space-y-2">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-purple-900 flex items-center space-x-1.5">
              <i class="fa-solid fa-volume-high text-purple-700"></i>
              <span>Daily Senior Voice Note & AI Transcript</span>
            </span>
            <span class="text-[11px] text-purple-700 font-mono">Today, 08:15 AM</span>
          </div>
          <div class="bg-white p-3 rounded-xl border border-purple-100 space-y-1.5">
            <div class="text-xs font-hindi text-slate-800 leading-relaxed font-semibold">
              "${voice.hindiText || 'नमस्ते बेटा, आज सुबह से थोड़ी बेचैनी लग रही है।'}"
            </div>
            <div class="text-[11px] text-slate-500 italic">
              <strong>English Translation:</strong> "${voice.englishTranslation || 'Hello son, feeling a bit restless since this morning.'}"
            </div>
          </div>
          <div class="flex items-center justify-between pt-1">
            <span class="text-[10px] font-bold text-purple-700">
              <i class="fa-solid fa-brain mr-1"></i> Sentiment: Anxiety & Distress Detected (Score: -0.68)
            </span>
            <button onclick="playFamilySeniorVoiceNote()" class="px-3 py-1 bg-purple-700 hover:bg-purple-800 text-white rounded-lg text-xs font-bold transition-all flex items-center space-x-1">
              <i class="fa-solid fa-play"></i>
              <span>Play Audio Note</span>
            </button>
          </div>
        </div>
      </div>
    `);
  }

  container.innerHTML = items.join('');
}

// Filter Assessment History Tabs
function filterFamilyAssessments(category) {
  currentFamilyHistoryFilter = category;
  const categories = ['all', 'vitals', 'adl', 'pain_sleep', 'voice'];
  categories.forEach(cat => {
    const btn = document.getElementById(`family-filter-btn-${cat}`);
    if (btn) {
      if (cat === category) {
        btn.className = "px-3 py-1.5 rounded-lg text-xs font-bold bg-purple-700 text-white shadow-sm transition-all";
      } else {
        btn.className = "px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all";
      }
    }
  });

  const p = (state.patients || []).find(pt => pt.id === familySelectedSeniorId) || (state.patients ? state.patients[0] : null);
  renderFamilyAssessmentHistory(p);
}

// Audio player simulation
function playFamilySeniorVoiceNote() {
  soundEngine.playTone(440, 'sine', 0.2);
  setTimeout(() => soundEngine.playTone(550, 'sine', 0.3), 200);
  showToast("Playing Ramesh Sharma's Hindi Voice Note...", 'info');
}

// =========================================================================
// BUILD WHOLE HEALTH ASSESSMENT (ELEGANT CLINICAL SLIP & PDF FORMAT)
// =========================================================================
function buildSimpleAssessmentHtml(p) {
  const v = (p.checkups && p.checkups[0]) ? p.checkups[0] : {};
  const adl = (p.assessments && p.assessments.adl) ? p.assessments.adl : {};
  const pain = (p.assessments && p.assessments.pain) ? p.assessments.pain : {};
  const sleep = (p.assessments && p.assessments.sleep) ? p.assessments.sleep : {};
  const voice = (p.userInputs || []).find(u => u.type === 'voice') || {};
  const medHistory = p.medicalHistory || {};
  const meds = medHistory.medications || [];
  const drivers = p.modelDrivers || [];
  const bracketStr = getSeniorBracketInfo(p);
  const caregiverStr = getCaregiverBracketInfo(p);
  const isCritical = p.predictedTier === 'CRITICAL';
  const reportDate = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

  return `
    <div id="printable-assessment-document" style="font-family: 'Plus Jakarta Sans', Inter, -apple-system, sans-serif; color: #0f172a; background: #ffffff; padding: 20px; border-radius: 16px; border: 1.5px solid #cbd5e1; max-width: 760px; margin: 0 auto; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
      
      <!-- Top Branding & Telemetry Header -->
      <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #0e294b; padding-bottom: 12px; margin-bottom: 14px;">
        <div>
          <div style="display: flex; align-items: center; gap: 8px;">
            <h1 style="font-size: 18px; font-weight: 800; color: #0e294b; margin: 0; letter-spacing: -0.02em;">CareConnect AI</h1>
            <span style="background: #f1f5f9; color: #475569; font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: 4px; border: 1px solid #cbd5e1;">CLINICAL DOSSIER</span>
            <span style="background: ${isCritical ? '#ffe4e6' : '#dcfce7'}; color: ${isCritical ? '#be123c' : '#15803d'}; font-size: 10px; font-weight: 800; padding: 2px 8px; border-radius: 4px; border: 1px solid ${isCritical ? '#f43f5e' : '#22c55e'};">
              ${isCritical ? '🚨 CRITICAL RISK TIER' : '🟢 STABLE TIER'}
            </span>
          </div>
          <p style="font-size: 12px; color: #008779; font-weight: 700; margin: 3px 0 0 0;">Comprehensive Senior Health Assessment & Telemetry Summary</p>
        </div>
        <div style="text-align: right; font-family: monospace; font-size: 11px; color: #64748b;">
          <div><strong>ID:</strong> CC-${p.id || 'PAT-101'}</div>
          <div><strong>Date:</strong> ${reportDate}</div>
          <div><strong>Status:</strong> Verified Telemetry</div>
        </div>
      </div>

      <!-- 1. Patient & Caregiver Identification Banner -->
      <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 12px; margin-bottom: 14px;">
        <div style="font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; color: #64748b; margin-bottom: 6px;">1. Patient & Connected Caregiver</div>
        <div style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px; font-size: 12px;">
          <div>
            <div style="color: #64748b; font-size: 11px;">Patient Name:</div>
            <strong style="color: #0e294b; font-size: 13px;">${p.name}</strong> 
            <span style="background: #f3e8ff; color: #6b21a8; font-weight: 700; font-size: 11px; padding: 1px 6px; border-radius: 4px; margin-left: 4px; border: 1px solid #d8b4fe;">${bracketStr}</span>
          </div>
          <div>
            <div style="color: #64748b; font-size: 11px;">Connected Family Person:</div>
            <span style="background: #e0e7ff; color: #3730a3; font-weight: 700; font-size: 11px; padding: 2px 6px; border-radius: 4px; border: 1px solid #c7d2fe;">${caregiverStr}</span>
          </div>
          <div>
            <span style="color: #64748b;">Location / Phone:</span> <strong>${p.location || 'South Delhi'} • ${p.phone || '+91 98110-44912'}</strong>
          </div>
          <div>
            <span style="color: #64748b;">Assigned Clinical Team:</span> <strong>${p.assignedNurse || 'Sister Kavita, RN'} • ${medHistory.doctor || 'Dr. V.K. Kapoor'}</strong>
          </div>
        </div>
      </div>

      <!-- 2. AI Risk Triage & Clinical Drivers -->
      <div style="border: 1px solid ${isCritical ? '#fecdd3' : '#bbf7d0'}; background: ${isCritical ? '#fff1f2' : '#f0fdf4'}; border-radius: 12px; padding: 12px; margin-bottom: 14px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
          <span style="font-size: 10px; font-weight: 800; text-transform: uppercase; color: ${isCritical ? '#9f1239' : '#166534'};">2. AI Predictive Model Triage & Drivers</span>
          <span style="font-size: 11px; font-weight: 800; color: ${isCritical ? '#be123c' : '#15803d'};">Model Risk Score: ${p.modelScore || 80}/100 (${p.predictedProbability || '64.3%'})</span>
        </div>
        <ul style="margin: 0; padding-left: 18px; font-size: 11.5px; color: #1e293b; line-height: 1.5;">
          ${drivers.map(d => `<li style="margin-bottom: 2px;"><strong>${d}</strong></li>`).join('')}
        </ul>
        <div style="margin-top: 8px; padding-top: 6px; border-top: 1px dashed ${isCritical ? '#fda4af' : '#86efac'}; font-size: 11.5px; color: #0e294b;">
          <strong>Suggested Clinical Action:</strong> ${p.suggestedAction || 'Immediate 2-way tele-call, notify family, and dispatch home nurse.'}
        </div>
      </div>

      <!-- 3. Physiological Telemetry (All Core Vitals) -->
      <div style="margin-bottom: 14px;">
        <div style="font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; color: #64748b; margin-bottom: 6px;">3. Current Physiological Telemetry</div>
        <div style="display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px; font-size: 11px;">
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 8px;">
            <div style="color: #64748b; font-size: 10px; text-transform: uppercase;">Blood Pressure</div>
            <div style="font-size: 15px; font-weight: 800; color: ${parseInt(v.bp) >= 140 ? '#e11d48' : '#0f172a'};">${v.bp || '120/80 mmHg'}</div>
            <div style="color: #64748b; font-size: 10px;">Status: ${v.bpStatus || 'Normal'}</div>
          </div>
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 8px;">
            <div style="color: #64748b; font-size: 10px; text-transform: uppercase;">Heart Rate</div>
            <div style="font-size: 15px; font-weight: 800; color: ${parseInt(v.hr) >= 100 ? '#e11d48' : '#0f172a'};">${v.hr || '72 bpm'}</div>
            <div style="color: #64748b; font-size: 10px;">Status: ${v.hrStatus || 'Normal'}</div>
          </div>
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 8px;">
            <div style="color: #64748b; font-size: 10px; text-transform: uppercase;">Oxygen (SpO2)</div>
            <div style="font-size: 15px; font-weight: 800; color: ${parseInt(v.spo2) < 95 ? '#d97706' : '#0f172a'};">${v.spo2 || '98%'}</div>
            <div style="color: #64748b; font-size: 10px;">Status: ${v.spo2Status || 'Optimal'}</div>
          </div>
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 8px;">
            <div style="color: #64748b; font-size: 10px; text-transform: uppercase;">Blood Glucose</div>
            <div style="font-size: 15px; font-weight: 800; color: #0f172a;">${v.glucose || '110 mg/dL'}</div>
            <div style="color: #64748b; font-size: 10px;">Type: Fasting / Checkup</div>
          </div>
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 8px;">
            <div style="color: #64748b; font-size: 10px; text-transform: uppercase;">Body Temperature</div>
            <div style="font-size: 15px; font-weight: 800; color: #0f172a;">${v.temp || '98.4 °F'}</div>
            <div style="color: #64748b; font-size: 10px;">Status: Afebrile</div>
          </div>
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 8px;">
            <div style="color: #64748b; font-size: 10px; text-transform: uppercase;">Weight & BMI</div>
            <div style="font-size: 15px; font-weight: 800; color: #0f172a;">${v.weight || '71.5 kg'}</div>
            <div style="color: #64748b; font-size: 10px;">BMI: ${v.bmi || '25.1'}</div>
          </div>
        </div>
      </div>

      <!-- 4. Functional ADL Independence & Pain / Sleep -->
      <div style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; margin-bottom: 14px;">
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 10px;">
          <div style="font-size: 10px; font-weight: 800; text-transform: uppercase; color: #475569; margin-bottom: 6px;">4. Functional ADL Assessment</div>
          <div style="font-size: 11.5px; line-height: 1.6; color: #1e293b;">
            <div>🍽️ <strong>Eating:</strong> ${adl.eating ? adl.eating.score : '10/10'} (${adl.eating ? adl.eating.status : 'Independent'})</div>
            <div>🚽 <strong>Toileting:</strong> ${adl.toileting ? adl.toileting.score : '7/10'} (${adl.toileting ? adl.toileting.status : 'Grab Bar Aid'})</div>
            <div>🚶 <strong>Walking:</strong> ${adl.walking ? adl.walking.score : '6/10'} (${adl.walking ? adl.walking.status : 'With Cane / Unsteady'})</div>
            <div>🛏️ <strong>Bed Transfer:</strong> ${adl.moving ? adl.moving.score : '7/10'} (${adl.moving ? adl.moving.status : 'Morning Stiffness'})</div>
          </div>
        </div>

        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 10px;">
          <div style="font-size: 10px; font-weight: 800; text-transform: uppercase; color: #475569; margin-bottom: 6px;">5. Pain & Sleep Assessment</div>
          <div style="font-size: 11.5px; line-height: 1.6; color: #1e293b;">
            <div>⚡ <strong>Pain Level:</strong> <span style="font-weight: 800; color: ${pain.score >= 4 ? '#e11d48' : '#0f172a'};">${pain.score ? `${pain.score}/10` : '0/10'}</span></div>
            <div>📍 <strong>Location:</strong> ${pain.location || 'None'} (${pain.sensation || 'Dull ache'})</div>
            <div>🌙 <strong>Sleep Rest:</strong> ${sleep.hours ? `${sleep.hours} hrs/night` : '7.0 hrs'}</div>
            <div>💤 <strong>Quality:</strong> ${sleep.quality || 'Normal'}</div>
          </div>
        </div>
      </div>

      <!-- 5. Senior Direct Voice Input (Hindi & Translation) -->
      <div style="background: #faf5ff; border: 1px solid #e9d5ff; border-radius: 12px; padding: 10px; margin-bottom: 14px;">
        <div style="font-size: 10px; font-weight: 800; text-transform: uppercase; color: #6b21a8; margin-bottom: 4px;">6. Senior Direct Check-in Voice Note & Transcript</div>
        <div style="font-size: 12px; font-weight: 600; color: #3b0764; font-style: italic;">
          "${voice.hindiText || 'नमस्ते बेटा, आज सुबह से थोड़ी बेचैनी लग रही है।'}"
        </div>
        <div style="font-size: 11px; color: #6b7280; margin-top: 3px;">
          <strong>Clinical Translation:</strong> "${voice.englishTranslation || 'Hello son, feeling a bit restless since this morning.'}"
        </div>
      </div>

      <!-- 6. Active Medications Table -->
      <div style="margin-bottom: 14px;">
        <div style="font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; color: #64748b; margin-bottom: 6px;">7. Active Prescriptions & Adherence</div>
        <table style="width: 100%; border-collapse: collapse; font-size: 11px; text-align: left;">
          <thead>
            <tr style="background: #f1f5f9; border-bottom: 1.5px solid #cbd5e1; color: #475569;">
              <th style="padding: 6px 8px;">Medicine</th>
              <th style="padding: 6px 8px;">Dosage</th>
              <th style="padding: 6px 8px;">Schedule</th>
              <th style="padding: 6px 8px;">Purpose</th>
              <th style="padding: 6px 8px;">Adherence</th>
            </tr>
          </thead>
          <tbody>
            ${meds.length > 0 ? meds.map(m => `
              <tr style="border-bottom: 1px solid #f1f5f9;">
                <td style="padding: 5px 8px; font-weight: 700; color: #0f172a;">${m.name}</td>
                <td style="padding: 5px 8px; color: #475569;">${m.dosage}</td>
                <td style="padding: 5px 8px; color: #475569;">${m.schedule}</td>
                <td style="padding: 5px 8px; color: #64748b;">${m.purpose}</td>
                <td style="padding: 5px 8px; font-weight: 700; color: #059669;">${m.adherence || '95%'}</td>
              </tr>
            `).join('') : `
              <tr><td colspan="5" style="padding: 6px; text-align: center; color: #94a3b8;">No prescription recorded.</td></tr>
            `}
          </tbody>
        </table>
      </div>

      <!-- Document Footer & Sign-off -->
      <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1.5px solid #e2e8f0; padding-top: 10px; font-size: 10px; color: #64748b;">
        <div>
          <span>CareConnect AI Telemetry Engine</span> • <span>ISO-27001 & HIPAA Compliant Data Flow</span>
        </div>
        <div style="text-align: right; font-weight: 700; color: #0f172a;">
          Reviewed By: Sister Kavita, RN (Assigned Care Coordinator)
        </div>
      </div>

    </div>
  `;
}

// Plain text assessment summary
function buildSimpleAssessmentText(p) {
  const v = (p.checkups && p.checkups[0]) ? p.checkups[0] : {};
  const adl = (p.assessments && p.assessments.adl) ? p.assessments.adl : {};
  const pain = (p.assessments && p.assessments.pain) ? p.assessments.pain : {};
  const sleep = (p.assessments && p.assessments.sleep) ? p.assessments.sleep : {};
  const voice = (p.userInputs || []).find(u => u.type === 'voice') || {};
  const bracketStr = getSeniorBracketInfo(p);
  const caregiverStr = getCaregiverBracketInfo(p);
  const isCritical = p.predictedTier === 'CRITICAL';
  const reportDate = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

  return `========================================================================
CARECONNECT AI - PATIENT HEALTH ASSESSMENT REPORT
========================================================================
Date: ${reportDate}
Patient ID: ${p.id || 'PAT-101'}
Patient Name: ${p.name} ${bracketStr}
Connected Person: ${caregiverStr}
Contact: ${p.phone || '+91 98110-44912'}
Location: ${p.location || 'South Delhi, New Delhi'}
Assigned Nurse: ${p.assignedNurse || 'Sister Kavita, RN'}
Consulting Doctor: ${p.medicalHistory ? p.medicalHistory.doctor || 'Dr. V.K. Kapoor' : 'Dr. V.K. Kapoor'}
Blood Group: ${p.medicalHistory ? p.medicalHistory.bloodGroup || 'B +ve' : 'B +ve'}

------------------------------------------------------------------------
1. AI RISK CLASSIFICATION & CLINICAL DRIVERS
------------------------------------------------------------------------
Risk Tier: ${isCritical ? 'CRITICAL RISK TIER (🚨 IMMEDIATE ATTENTION)' : 'STABLE TIER (🟢 ROUTINE SUPERVISION)'}
Model Risk Score: ${p.modelScore || 80}/100 (${p.predictedProbability || '64.3%'})
Key AI Drivers Detected:
${(p.modelDrivers || []).map((d, i) => `  ${i+1}. ${d}`).join('\n')}

Clinical Action Protocol:
  ${p.suggestedAction || 'Proactive biometric monitoring and assigned nurse dispatch.'}

------------------------------------------------------------------------
2. PHYSIOLOGICAL VITALS TELEMETRY
------------------------------------------------------------------------
- Blood Pressure: ${v.bp || '120/80 mmHg'} (${v.bpStatus || 'Normal'})
- Heart Rate: ${v.hr || '72 bpm'} (${v.hrStatus || 'Normal'})
- SpO2 Oxygen Saturation: ${v.spo2 || '98%'} (${v.spo2Status || 'Optimal'})
- Blood Glucose: ${v.glucose || '110 mg/dL'} (Fasting)
- Body Temperature: ${v.temp || '98.4 °F'} (Afebrile)
- Weight & BMI: ${v.weight || '71.5 kg'} (BMI ${v.bmi || '25.1'})

------------------------------------------------------------------------
3. FUNCTIONAL ADL INDEPENDENCE ASSESSMENT
------------------------------------------------------------------------
- Eating / Nutrition: ${adl.eating ? adl.eating.score : '10/10'} (${adl.eating ? adl.eating.status : 'Fully Independent'})
- Toileting: ${adl.toileting ? adl.toileting.score : '7/10'} (${adl.toileting ? adl.toileting.status : 'Requires Grab Bar Support'})
- Walking / Ambulation: ${adl.walking ? adl.walking.score : '6/10'} (${adl.walking ? adl.walking.status : 'Walks with Cane / Mild Instability'})
- Bed Transfer & Moving: ${adl.moving ? adl.moving.score : '7/10'} (${adl.moving ? adl.moving.status : 'Morning Stiffness'})

------------------------------------------------------------------------
4. PAIN & SLEEP ASSESSMENT
------------------------------------------------------------------------
- Pain Scale: ${pain.score ? `${pain.score}/10` : '0/10'}
- Pain Location & Sensation: ${pain.location || 'None'} (${pain.sensation || 'Dull ache'})
- Night Sleep Rest: ${sleep.hours ? `${sleep.hours} hrs/night` : '7.0 hrs'}
- Sleep Quality: ${sleep.quality || 'Normal'}

------------------------------------------------------------------------
5. SENIOR DIRECT VOICE INPUT & TRANSCRIPT
------------------------------------------------------------------------
Hindi Voice Input: "${voice.hindiText || 'Sab theek hai, regular routine chal raha hai.'}"
English Clinical Translation: "${voice.englishTranslation || 'Everything is fine, regular routine is going on.'}"

------------------------------------------------------------------------
6. ACTIVE PRESCRIPTIONS & ADHERENCE
------------------------------------------------------------------------
${(p.medicalHistory && p.medicalHistory.medications ? p.medicalHistory.medications : []).map(m => `- ${m.name} (${m.dosage}) | Schedule: ${m.schedule} | Purpose: ${m.purpose} | Adherence: ${m.adherence || '95%'}`).join('\n')}

========================================================================
Verified by: Sister Kavita, RN • CareConnect AI Clinical Protocol
========================================================================
`;
}

// =========================================================================
// ACTION: DOWNLOAD WHOLE HEALTH ASSESSMENT AS PDF & OPEN PREVIEW
// =========================================================================
function downloadPatientAssessmentPdf() {
  const p = (state.patients || []).find(pt => pt.id === familySelectedSeniorId) || (state.patients ? state.patients[0] : null);
  if (!p) {
    showToast('No patient data found to generate assessment.', 'error');
    return;
  }

  soundEngine.playTone(600, 'sine', 0.15);
  showToast(`Preparing Full Health Assessment PDF for ${p.name}...`, 'info');

  // 1. Populate the modal content so user has instant visual preview
  const modalContainer = document.getElementById('simple-assessment-slip-content');
  if (modalContainer) {
    modalContainer.innerHTML = buildSimpleAssessmentHtml(p);
  }

  // 2. Open modal so user sees assessment document right away
  const modal = document.getElementById('modal-simple-assessment');
  if (modal) {
    modal.classList.remove('hidden');
  }

  const safeName = p.name.replace(/[^a-zA-Z0-9]/g, '_');
  const filename = `${safeName}_Full_Health_Assessment.pdf`;

  // 3. If html2pdf library is available, trigger direct PDF download
  if (typeof html2pdf !== 'undefined') {
    const element = document.getElementById('printable-assessment-document') || modalContainer;
    const opt = {
      margin: [8, 8, 8, 8],
      filename: filename,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, logging: false },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save().then(() => {
      showToast(`Downloaded: ${filename}`, 'success');
    }).catch(err => {
      console.warn('html2pdf direct save error, triggering print/save fallback:', err);
      fallbackDownloadClinicalHtml(p);
    });
  } else {
    // Elegant fallback: Download complete self-contained printable HTML dossier file
    fallbackDownloadClinicalHtml(p);
  }
}

// Self-contained printable HTML dossier file fallback
function fallbackDownloadClinicalHtml(p) {
  const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${p.name} - Full Health Assessment</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #f8fafc; padding: 20px; }
    @media print { body { background: #ffffff; padding: 0; } }
  </style>
</head>
<body>
  ${buildSimpleAssessmentHtml(p)}
  <script>
    window.onload = function() {
      // Auto prompt print to save as PDF if desired
      setTimeout(function() { window.print(); }, 400);
    };
  </script>
</body>
</html>`;

  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const safeName = p.name.replace(/[^a-zA-Z0-9]/g, '_');
  a.href = url;
  a.download = `${safeName}_Full_Health_Assessment_Printable.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showToast(`Assessment downloaded as printable dossier file.`, 'success');
}

// Open Simple Assessment Modal
function openSimpleAssessmentModal() {
  const p = (state.patients || []).find(pt => pt.id === familySelectedSeniorId) || (state.patients ? state.patients[0] : null);
  if (!p) return;

  const content = document.getElementById('simple-assessment-slip-content');
  if (content) {
    content.innerHTML = buildSimpleAssessmentHtml(p);
  }

  const modal = document.getElementById('modal-simple-assessment');
  if (modal) {
    modal.classList.remove('hidden');
    soundEngine.playTone(500, 'sine', 0.1);
  }
}

// Close Simple Assessment Modal
function closeSimpleAssessmentModal() {
  const modal = document.getElementById('modal-simple-assessment');
  if (modal) {
    modal.classList.add('hidden');
  }
}

// Print Clean Assessment Slip Only
function printSimpleAssessmentSlipOnly() {
  const p = (state.patients || []).find(pt => pt.id === familySelectedSeniorId) || (state.patients ? state.patients[0] : null);
  if (!p) return;

  const content = document.getElementById('simple-assessment-slip-content');
  if (content) {
    content.innerHTML = buildSimpleAssessmentHtml(p);
  }

  const modal = document.getElementById('modal-simple-assessment');
  if (modal) modal.classList.remove('hidden');

  showToast('Opening clean print / PDF save dialog...', 'info');
  setTimeout(() => {
    window.print();
  }, 250);
}

// Download Simple Assessment Report (.txt file)
function downloadSimpleAssessmentReport() {
  const p = (state.patients || []).find(pt => pt.id === familySelectedSeniorId) || (state.patients ? state.patients[0] : null);
  if (!p) return;

  const textContent = buildSimpleAssessmentText(p);
  const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const safeName = p.name.replace(/[^a-zA-Z0-9]/g, '_');
  a.href = url;
  a.download = `${safeName}_Health_Assessment_Report.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  showToast(`Downloaded: ${safeName}_Health_Assessment_Report.txt`, 'success');
}

// Print full senior report
function printSeniorReport() {
  openSimpleAssessmentModal();
}

// Emergency alert actions
function updateFamilyAlertBanner() {
  const p = (state.patients || []).find(pt => pt.id === familySelectedSeniorId);
  const isCritical = p && p.predictedTier === 'CRITICAL';
  const alertBanner = document.getElementById('family-serious-alert-banner');
  if (alertBanner) alertBanner.classList.toggle('hidden', !isCritical);
}

function dismissFamilyAlert() {
  const banner = document.getElementById('family-serious-alert-banner');
  if (banner) banner.classList.add('hidden');
  showToast('Alert banner minimized for current session.', 'info');
}

function simulateSeriousEmergencyForFamily() {
  changeFamilyLinkedSenior('PAT-101');
  const banner = document.getElementById('family-serious-alert-banner');
  if (banner) banner.classList.remove('hidden');
  soundEngine.playTone(800, 'triangle', 0.4);
  showToast('Simulated Critical Health Alert for Ramesh Sharma!', 'warning');
}

function simulateFamilyCallDad() {
  soundEngine.playTone(500, 'sine', 0.2);
  const p = (state.patients || []).find(pt => pt.id === familySelectedSeniorId);
  const name = p ? p.name : 'Dad';
  const phone = p ? p.phone : '+91 98110-44912';
  showToast(`Initiating direct call to ${name} (${phone})...`, 'info');
}

function simulateFamilyCallCoordinator() {
  soundEngine.playTone(600, 'sine', 0.2);
  const p = (state.patients || []).find(pt => pt.id === familySelectedSeniorId);
  const nurse = p ? (p.assignedNurse || 'Sister Kavita, RN') : 'Sister Kavita, RN';
  showToast(`Connecting to Primary Care Nurse (${nurse})...`, 'info');
}

function sendFamilyMessageToDad() {
  soundEngine.playTone(700, 'sine', 0.15);
  const input = document.getElementById('family-message-input');
  const msg = input ? input.value.trim() : '';
  const p = (state.patients || []).find(pt => pt.id === familySelectedSeniorId);
  const name = p ? p.name : 'Dad';
  if (!msg) {
    showToast('Please type a message first.', 'warning');
    return;
  }
  showToast(`Sent message to ${name}: "${msg}"`, 'success');
  if (input) input.value = '';
}

function initFamilyVitalsChart() {
  // Chart initialization placeholder if needed
}
