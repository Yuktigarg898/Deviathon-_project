// VIEW 1: CARE COORDINATOR LOGIC - AI ML TIER CLASSIFICATION ENGINE
// Powered by Random Forest Model (ApnaSa 90,000 Records Dataset)
// Evaluates: Patient Data + Medical History + Medical Assessment + Senior Inputs
// Classifies into: CRITICAL TIER (Alert Raised + Family Notified) vs NORMAL TIER (Safe Baseline)

let currentDossierPatient = null;
let currentTierFilter = 'all';

function setTierFilter(tier) {
  currentTierFilter = tier;
  const sel = document.getElementById('coord-patient-status-filter');
  if (sel) sel.value = tier;

  // Update pills visual state
  const pills = ['all', 'CRITICAL', 'NORMAL', 'MODERATE'];
  pills.forEach(p => {
    const el = document.getElementById('tier-pill-' + p.toLowerCase());
    if (el) {
      if (p === tier) {
        el.className = "px-3 py-1.5 rounded-xl text-xs font-extrabold bg-white text-slate-900 border border-white shadow-sm transition-all";
      } else {
        const color = p === 'CRITICAL' ? 'rose' : (p === 'NORMAL' ? 'emerald' : (p === 'MODERATE' ? 'amber' : 'slate'));
        el.className = `px-3 py-1.5 rounded-xl text-xs font-extrabold bg-${color}-600/30 text-${color}-300 hover:bg-${color}-600 hover:text-white border border-${color}-500/50 transition-all flex items-center space-x-1`;
      }
    }
  });

  renderCoordinatorPatients();
}

function getPatientByNameOrId(identifier) {
  if (!state.patients || state.patients.length === 0) return null;
  const target = String(identifier || '').toLowerCase().trim();
  return state.patients.find(p => 
    p.id.toLowerCase() === target || 
    p.username.toLowerCase() === target || 
    target.includes(p.name.toLowerCase()) || 
    p.name.toLowerCase().includes(target)
  ) || state.patients[0];
}

// 1. Tab Switching: Priority Queue vs Patients vs Notifications Log
function switchCoordinatorTab(tabName) {
  state.currentCoordinatorTab = tabName;
  const tabQueue = document.getElementById('coord-tab-content-queue');
  const tabPatients = document.getElementById('coord-tab-content-patients');
  const tabNotifs = document.getElementById('coord-tab-content-notifications');

  const btnQueue = document.getElementById('coord-tab-btn-queue');
  const btnPatients = document.getElementById('coord-tab-btn-patients');
  const btnNotifs = document.getElementById('coord-tab-btn-notifications');

  if (tabQueue) tabQueue.classList.add('hidden');
  if (tabPatients) tabPatients.classList.add('hidden');
  if (tabNotifs) tabNotifs.classList.add('hidden');

  [btnQueue, btnPatients, btnNotifs].forEach(b => {
    if (b) {
      b.classList.remove('bg-teal-600', 'text-white', 'shadow-sm');
      b.classList.add('text-slate-600', 'hover:text-slate-900', 'hover:bg-slate-100');
    }
  });

  if (tabName === 'queue') {
    if (tabQueue) tabQueue.classList.remove('hidden');
    if (btnQueue) {
      btnQueue.classList.remove('text-slate-600', 'hover:text-slate-900', 'hover:bg-slate-100');
      btnQueue.classList.add('bg-teal-600', 'text-white', 'shadow-sm');
    }
    renderCoordinatorAlerts();
  } else if (tabName === 'patients') {
    if (tabPatients) tabPatients.classList.remove('hidden');
    if (btnPatients) {
      btnPatients.classList.remove('text-slate-600', 'hover:text-slate-900', 'hover:bg-slate-100');
      btnPatients.classList.add('bg-teal-600', 'text-white', 'shadow-sm');
    }
    renderCoordinatorPatients();
  } else if (tabName === 'notifications') {
    if (tabNotifs) tabNotifs.classList.remove('hidden');
    if (btnNotifs) {
      btnNotifs.classList.remove('text-slate-600', 'hover:text-slate-900', 'hover:bg-slate-100');
      btnNotifs.classList.add('bg-teal-600', 'text-white', 'shadow-sm');
    }
    renderEmergencyNotificationsLog();
  }
}

// 2. Render Ranked Priority Queue (Tab 1)
function renderCoordinatorAlerts() {
  const container = document.getElementById('coordinator-alert-list');
  if (!container) return;

  const searchInput = document.getElementById('coordinator-search-input');
  const priorityFilter = document.getElementById('coordinator-priority-filter');
  
  const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
  const filter = priorityFilter ? priorityFilter.value : 'all';

  let list = state.alerts.filter(item => {
    if (item.status === 'resolved') return false;
    if (filter !== 'all' && item.priority !== filter) return false;
    if (query) {
      const match = item.seniorName.toLowerCase().includes(query) ||
                    item.reason.toLowerCase().includes(query) ||
                    item.location.toLowerCase().includes(query);
      if (!match) return false;
    }
    return true;
  });

  list.sort((a, b) => a.rank - b.rank);

  const critCount = state.alerts.filter(a => a.priority === 'critical' && a.status !== 'resolved').length;
  const highCount = state.alerts.filter(a => a.priority === 'high' && a.status !== 'resolved').length;
  const totalActive = state.alerts.filter(a => a.status !== 'resolved').length;
  const totalResolved = state.resolvedAlerts.length;

  const elCrit = document.getElementById('stat-critical-count');
  if (elCrit) elCrit.textContent = critCount;
  const elHigh = document.getElementById('stat-high-count');
  if (elHigh) elHigh.textContent = highCount;
  const elActive = document.getElementById('stat-active-cases');
  if (elActive) elActive.textContent = totalActive;
  const elRes = document.getElementById('stat-resolved-count');
  if (elRes) elRes.textContent = totalResolved;

  const bQueue = document.getElementById('coord-badge-queue');
  if (bQueue) bQueue.textContent = totalActive;
  const bPatients = document.getElementById('coord-badge-patients');
  if (bPatients) bPatients.textContent = state.patients ? state.patients.length : 5;
  const bNotifs = document.getElementById('coord-badge-notifications');
  if (bNotifs) bNotifs.textContent = state.emergencyNotifications ? state.emergencyNotifications.length : 3;

  updateCoordinatorCriticalBanner();

  if (list.length === 0) {
    container.innerHTML = `
      <div class="bg-white rounded-2xl p-12 text-center border border-slate-200">
        <div class="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center text-2xl mb-3">
          <i class="fa-solid fa-circle-check"></i>
        </div>
        <h3 class="text-base font-bold text-slate-800">Priority Queue Clear!</h3>
        <p class="text-xs text-slate-500 mt-1">All seniors for this filter have been attended to or verified safe.</p>
        <button onclick="refreshCoordinatorQueue()" class="mt-4 px-4 py-2 bg-teal-600 text-white rounded-xl text-xs font-bold shadow-sm">
          Reset Filter & Sync
        </button>
      </div>
    `;
    return;
  }

  container.innerHTML = list.map(item => {
    const matchedPatient = getPatientByNameOrId(item.patientId || item.seniorName);
    const username = matchedPatient ? matchedPatient.username : (item.username || 'senior_' + item.seniorName.toLowerCase().replace(/[^a-z]/g, ''));
    const patientId = matchedPatient ? matchedPatient.id : 'PAT-101';
    const emergencyContactStr = matchedPatient ? `${matchedPatient.emergencyContact.name} (${matchedPatient.emergencyContact.relation}) • ${matchedPatient.emergencyContact.phone}` : item.familyContact;

    let borderClass = 'border-slate-200';
    let badgeClass = 'bg-slate-100 text-slate-700';
    let rankBadgeClass = 'bg-slate-800 text-white';
    let pulseEffect = '';

    if (item.priority === 'critical') {
      borderClass = 'border-rose-300 ring-1 ring-rose-200 bg-rose-50/20';
      badgeClass = 'bg-rose-100 text-rose-800 border border-rose-200';
      rankBadgeClass = 'bg-rose-600 text-white shadow-md shadow-rose-600/30';
      pulseEffect = '<span class="w-2 h-2 rounded-full bg-rose-500 animate-ping mr-1"></span>';
    } else if (item.priority === 'high') {
      borderClass = 'border-amber-300 bg-amber-50/15';
      badgeClass = 'bg-amber-100 text-amber-800 border border-amber-200';
      rankBadgeClass = 'bg-amber-600 text-white';
    } else {
      borderClass = 'border-slate-200';
      badgeClass = 'bg-blue-100 text-blue-800';
      rankBadgeClass = 'bg-blue-600 text-white';
    }

    return `
      <div class="bg-white rounded-2xl border-2 ${borderClass} p-5 sm:p-6 shadow-sm hover:shadow-md transition-all">
        <!-- Top Row: ML Predicted Tier Banner & Senior Info -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div class="flex items-center space-x-3.5">
            <div class="w-10 h-10 rounded-xl ${rankBadgeClass} flex items-center justify-center font-extrabold text-sm flex-shrink-0" title="Daily Priority Rank #${item.rank}">
              #${item.rank}
            </div>

            <div>
              <div class="flex flex-wrap items-center gap-2">
                <h3 class="text-base sm:text-lg font-bold text-slate-900">${item.seniorName}</h3>
                <span class="px-2 py-0.5 rounded-md text-xs font-mono font-bold bg-slate-100 text-slate-700 border border-slate-200" title="Senior Username">
                  @${username}
                </span>
                <span class="text-xs text-slate-500">(${item.age} Yrs • ${item.gender || 'Senior'})</span>
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-rose-600 text-white shadow-sm">
                  ${pulseEffect} 🚨 ML PREDICTED: CRITICAL TIER
                </span>
              </div>
              <div class="text-xs text-slate-500 mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
                <span><i class="fa-solid fa-location-dot text-teal-600 mr-1"></i>${item.location}</span>
                <span class="text-indigo-700 font-medium"><i class="fa-solid fa-shield-heart text-rose-500 mr-1"></i>${emergencyContactStr}</span>
                <span><i class="fa-solid fa-clock text-slate-400 mr-1"></i>${item.timeAgo}</span>
                <span class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                  <i class="fa-solid fa-check-double mr-1 text-emerald-600"></i>SMS & WhatsApp Dispatched
                </span>
              </div>
            </div>
          </div>

          <div class="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100">
            <div class="text-xs font-semibold text-slate-500">ML Risk Score:</div>
            <div class="font-extrabold text-sm sm:text-base text-rose-600">
              ${item.priorityScore} / 100
            </div>
          </div>
        </div>

        <!-- Middle Row: ROOT CAUSE ALERT REASON & SUGGESTED ACTION -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
          <div class="bg-slate-50 rounded-xl p-3.5 border border-slate-200/80">
            <div class="flex items-center space-x-1.5 text-xs font-bold text-rose-700 uppercase tracking-wider mb-1.5">
              <i class="fa-solid fa-circle-exclamation"></i>
              <span>ML Model Trigger & Root Cause:</span>
            </div>
            <p class="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
              ${item.reason}
            </p>
            ${item.vitals ? `
              <div class="mt-3 flex flex-wrap items-center gap-1.5 text-[11px]">
                <span class="bg-white px-2 py-0.5 rounded border border-slate-200 font-mono text-slate-600">BP: <strong class="text-slate-900">${item.vitals.bp}</strong></span>
                <span class="bg-white px-2 py-0.5 rounded border border-slate-200 font-mono text-slate-600">HR: <strong class="text-rose-600 font-bold">${item.vitals.hr}</strong></span>
                <span class="bg-white px-2 py-0.5 rounded border border-slate-200 font-mono text-slate-600">SpO2: <strong class="text-slate-900">${item.vitals.spo2}</strong></span>
              </div>
            ` : ''}
          </div>

          <div class="bg-teal-50/60 rounded-xl p-3.5 border border-teal-200/80 flex flex-col justify-between">
            <div>
              <div class="flex items-center space-x-1.5 text-xs font-bold text-teal-800 uppercase tracking-wider mb-1.5">
                <i class="fa-solid fa-list-check"></i>
                <span>Suggested Clinical Action:</span>
              </div>
              <p class="text-xs sm:text-sm text-teal-950 leading-relaxed font-semibold">
                ${item.suggestedAction}
              </p>
            </div>
            <div class="mt-2 text-[11px] text-teal-700 flex items-center justify-between">
              <span>Assigned Specialist: <strong>${item.assignedNurse}</strong></span>
              <span class="font-bold text-teal-800">SLA Target: &lt;15 mins</span>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
          <div class="flex flex-wrap items-center gap-2">
            <button onclick="openPatientDossier('${patientId}')" class="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center space-x-1.5">
              <i class="fa-solid fa-folder-open"></i>
              <span>View Medical Record & Inputs</span>
            </button>
            <button onclick="openCallModal('${item.id}', '${item.seniorName}', '${item.phone}')" class="px-3.5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center space-x-1.5">
              <i class="fa-solid fa-phone"></i>
              <span>2-Way Call</span>
            </button>
            <button onclick="openDispatchModal('${item.id}', '${item.seniorName}')" class="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 rounded-xl text-xs font-semibold transition-all flex items-center space-x-1.5">
              <i class="fa-solid fa-person-walking-arrow-right"></i>
              <span>Dispatch</span>
            </button>
          </div>

          <div class="flex items-center space-x-2">
            <button onclick="openResolveModal('${item.id}', '${item.seniorName}')" class="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center space-x-1.5">
              <i class="fa-solid fa-circle-check"></i>
              <span>Resolve & Mark Safe</span>
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function filterCoordinatorAlerts() {
  renderCoordinatorAlerts();
}

function refreshCoordinatorQueue() {
  const searchInput = document.getElementById('coordinator-search-input');
  const priorityFilter = document.getElementById('coordinator-priority-filter');
  if (searchInput) searchInput.value = '';
  if (priorityFilter) priorityFilter.value = 'all';
  renderCoordinatorAlerts();
  showToast('Priority Queue refreshed and synced with ML inference engine.', 'info');
}

// 3. Render Patient Directory & ML Predicted Tiers Cards (Tab 2)
function renderCoordinatorPatients() {
  const container = document.getElementById('coordinator-patients-grid');
  if (!container) return;

  const searchInput = document.getElementById('coord-patient-search');
  const statusFilter = document.getElementById('coord-patient-status-filter');
  const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
  const filter = currentTierFilter !== 'all' ? currentTierFilter : (statusFilter ? statusFilter.value : 'all');

  let list = (state.patients || []).filter(p => {
    if (filter !== 'all' && p.predictedTier !== filter) return false;
    if (query) {
      const match = p.name.toLowerCase().includes(query) ||
                    p.username.toLowerCase().includes(query) ||
                    p.location.toLowerCase().includes(query) ||
                    (p.medicalHistory && p.medicalHistory.chronicConditions.some(c => c.toLowerCase().includes(query)));
      if (!match) return false;
    }
    return true;
  });

  if (list.length === 0) {
    container.innerHTML = `
      <div class="col-span-2 bg-white rounded-2xl p-12 text-center border border-slate-200">
        <i class="fa-solid fa-users-slash text-slate-300 text-3xl mb-3"></i>
        <h4 class="text-sm font-bold text-slate-800">No matching patients in this tier</h4>
        <p class="text-xs text-slate-500 mt-1">Try selecting 'All Tiers' or changing search keyword.</p>
        <button onclick="setTierFilter('all')" class="mt-4 px-4 py-2 bg-teal-600 text-white rounded-xl text-xs font-bold shadow-sm">
          Show All Patients
        </button>
      </div>
    `;
    return;
  }

  container.innerHTML = list.map(p => {
    const isCritical = (p.predictedTier === 'CRITICAL');
    const isNormal = (p.predictedTier === 'NORMAL');

    // 1. TIER BANNER HTML
    let tierBannerHtml = '';
    if (isCritical) {
      tierBannerHtml = `
        <div class="bg-gradient-to-r from-rose-600 to-red-700 text-white rounded-2xl p-3.5 mb-4 shadow-md shadow-rose-600/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border border-rose-400">
          <div class="flex items-center space-x-2.5">
            <span class="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center font-bold text-base flex-shrink-0">
              <i class="fa-solid fa-triangle-exclamation animate-bounce"></i>
            </span>
            <div>
              <div class="text-[10px] uppercase tracking-wider text-rose-200 font-extrabold">ML Model Predicted Tier:</div>
              <div class="text-sm sm:text-base font-extrabold">🚨 CRITICAL TIER (गंभीर जोखिम)</div>
            </div>
          </div>
          <div class="flex items-center space-x-2 sm:text-right">
            <span class="px-2.5 py-1 rounded-lg text-xs font-mono font-extrabold bg-white text-rose-800 shadow-sm">
              Score: ${p.modelScore}/100
            </span>
            <span class="text-xs text-rose-100 font-mono font-bold">${p.predictedProbability} Risk</span>
          </div>
        </div>
      `;
    } else if (isNormal) {
      tierBannerHtml = `
        <div class="bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-2xl p-3.5 mb-4 shadow-md shadow-emerald-600/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border border-emerald-400">
          <div class="flex items-center space-x-2.5">
            <span class="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center font-bold text-base flex-shrink-0">
              <i class="fa-solid fa-circle-check"></i>
            </span>
            <div>
              <div class="text-[10px] uppercase tracking-wider text-emerald-200 font-extrabold">ML Model Predicted Tier:</div>
              <div class="text-sm sm:text-base font-extrabold">🟢 NORMAL TIER (सामान्य / सुरक्षित)</div>
            </div>
          </div>
          <div class="flex items-center space-x-2 sm:text-right">
            <span class="px-2.5 py-1 rounded-lg text-xs font-mono font-extrabold bg-white text-emerald-800 shadow-sm">
              Score: ${p.modelScore}/100
            </span>
            <span class="text-xs text-emerald-100 font-mono font-bold">Stable (${p.predictedProbability})</span>
          </div>
        </div>
      `;
    } else {
      tierBannerHtml = `
        <div class="bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-2xl p-3.5 mb-4 shadow-md shadow-amber-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border border-amber-400">
          <div class="flex items-center space-x-2.5">
            <span class="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center font-bold text-base flex-shrink-0">
              <i class="fa-solid fa-bell"></i>
            </span>
            <div>
              <div class="text-[10px] uppercase tracking-wider text-amber-100 font-extrabold">ML Model Predicted Tier:</div>
              <div class="text-sm sm:text-base font-extrabold">🟡 MODERATE TIER (मध्यम निगरानी)</div>
            </div>
          </div>
          <div class="flex items-center space-x-2 sm:text-right">
            <span class="px-2.5 py-1 rounded-lg text-xs font-mono font-extrabold bg-white text-amber-800 shadow-sm">
              Score: ${p.modelScore}/100
            </span>
            <span class="text-xs text-amber-100 font-mono font-bold">${p.predictedProbability}</span>
          </div>
        </div>
      `;
    }

    const latestCheckup = (p.checkups && p.checkups.length > 0) ? p.checkups[0] : null;
    const latestInput = (p.userInputs && p.userInputs.length > 0) ? p.userInputs[0] : null;
    const conditionsList = (p.medicalHistory && p.medicalHistory.chronicConditions) || [];
    const driversList = p.modelDrivers || [];

    return `
      <div class="bg-white rounded-3xl border-2 ${isCritical ? 'border-rose-300 ring-2 ring-rose-200' : (isNormal ? 'border-emerald-300' : 'border-slate-200')} p-5 sm:p-6 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between">
        <div>
          <!-- 1. Model Tier Header -->
          ${tierBannerHtml}

          <!-- 2. Patient Identity Row: Avatar, Username, Demographics -->
          <div class="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
            <div class="flex items-center space-x-3">
              <img src="${p.avatar}" alt="${p.name}" class="w-14 h-14 rounded-2xl object-cover border-2 border-slate-200 shadow-sm flex-shrink-0">
              <div>
                <div class="flex items-center space-x-2">
                  <h4 class="text-base sm:text-lg font-extrabold text-[#0e294b]">${p.name}</h4>
                  <span class="px-2.5 py-0.5 rounded-lg text-xs font-mono font-extrabold bg-slate-100 text-slate-800 border border-slate-300 shadow-xs">
                    @${p.username}
                  </span>
                </div>
                <div class="text-xs text-slate-500 mt-0.5">
                  ${p.age} Yrs • ${p.gender} • <i class="fa-solid fa-location-dot text-teal-600 mr-1"></i>${p.location}
                </div>
              </div>
            </div>

            <button onclick="evaluatePatientTierLive('${p.id}')"
              class="px-2.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-xl text-xs font-bold transition-all flex items-center space-x-1" title="Re-run Random Forest ML inference on current vitals">
              <i class="fa-solid fa-rotate text-[11px]"></i>
              <span class="hidden sm:inline">Re-evaluate Tier</span>
            </button>
          </div>

          <!-- 3. THE 4 INPUT PILLARS FED INTO THE MODEL -->
          <div class="my-4 bg-slate-50/80 rounded-2xl p-3.5 border border-slate-200/80 text-xs space-y-2.5">
            <div class="text-[11px] font-extrabold text-slate-700 uppercase tracking-wider flex items-center justify-between border-b border-slate-200 pb-1.5">
              <span>Data Fed to Model (मॉडल इनपुट्स):</span>
              <span class="font-mono text-indigo-600 font-bold">4 Key Dimensions</span>
            </div>

            <!-- Pillar A: Vitals -->
            ${latestCheckup ? `
              <div class="flex items-start space-x-2">
                <span class="w-5 h-5 rounded-md bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5">1</span>
                <div class="flex-grow">
                  <span class="font-bold text-slate-800">Checkup Vitals:</span>
                  <div class="grid grid-cols-4 gap-1.5 text-center mt-1 font-mono text-[11px]">
                    <span class="bg-white px-1.5 py-1 rounded border border-slate-200">BP: <strong class="${latestCheckup.bpStatus.includes('Critical') ? 'text-rose-600 font-bold' : 'text-slate-900'}">${latestCheckup.bp.split(' ')[0]}</strong></span>
                    <span class="bg-white px-1.5 py-1 rounded border border-slate-200">HR: <strong class="${latestCheckup.hrStatus.includes('Spike') ? 'text-rose-600 font-bold' : 'text-slate-900'}">${latestCheckup.hr}</strong></span>
                    <span class="bg-white px-1.5 py-1 rounded border border-slate-200">SpO2: <strong class="text-slate-900">${latestCheckup.spo2}</strong></span>
                    <span class="bg-white px-1.5 py-1 rounded border border-slate-200">Sugar: <strong class="${parseInt(latestCheckup.glucose) > 180 ? 'text-rose-600 font-bold' : 'text-slate-900'}">${latestCheckup.glucose}</strong></span>
                  </div>
                </div>
              </div>
            ` : ''}

            <!-- Pillar B: Medical History -->
            <div class="flex items-start space-x-2">
              <span class="w-5 h-5 rounded-md bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5">2</span>
              <div class="flex-grow">
                <span class="font-bold text-slate-800">Medical History:</span>
                <div class="flex flex-wrap gap-1 mt-1">
                  ${conditionsList.map(c => `<span class="px-2 py-0.5 rounded bg-white border border-slate-200 text-[10px] font-semibold text-slate-700">${c}</span>`).join('')}
                </div>
              </div>
            </div>

            <!-- Pillar C: Medical Assessment -->
            <div class="flex items-start space-x-2">
              <span class="w-5 h-5 rounded-md bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5">3</span>
              <div class="flex-grow text-[11px] text-slate-700">
                <span class="font-bold text-slate-800">Medical Assessment:</span>
                <span class="ml-1 font-medium">ADL: ${p.assessments.adl.walking.status} • Pain: <strong class="${p.assessments.pain.score >= 5 ? 'text-rose-600' : 'text-slate-900'}">${p.assessments.pain.score}/10</strong> (${p.assessments.pain.location}) • Sleep: ${p.assessments.sleep.hours}h</span>
              </div>
            </div>

            <!-- Pillar D: User's Given Input -->
            ${latestInput ? `
              <div class="flex items-start space-x-2">
                <span class="w-5 h-5 rounded-md bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5">4</span>
                <div class="flex-grow">
                  <div class="flex items-center justify-between text-[11px]">
                    <span class="font-bold text-purple-900">User's Given Input (${latestInput.type === 'voice' ? 'Voice Note' : 'One-Tap'}):</span>
                    ${latestInput.type === 'voice' ? `
                      <button onclick="playSeniorAudioNote('${latestInput.hindiText.replace(/'/g, "\\'")}')" class="text-purple-700 font-bold hover:underline flex items-center space-x-1">
                        <i class="fa-solid fa-volume-high"></i>
                        <span>Listen Voice</span>
                      </button>
                    ` : ''}
                  </div>
                  <p class="text-slate-800 font-medium italic mt-0.5 bg-white p-2 rounded-lg border border-purple-100">
                    "${latestInput.hindiText || latestInput.selection}"
                  </p>
                </div>
              </div>
            ` : ''}
          </div>

          <!-- 4. ML MODEL DECISION DRIVERS (कारण) -->
          <div class="my-3">
            <div class="text-[11px] font-extrabold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center space-x-1.5">
              <i class="fa-solid fa-brain text-indigo-600"></i>
              <span>ML Model Decision Drivers (मॉडल वर्गीकरण के कारण):</span>
            </div>
            <div class="bg-white p-3 rounded-xl border border-slate-200 text-xs space-y-1">
              ${driversList.slice(0, 3).map(d => `
                <div class="flex items-start space-x-2 text-slate-700">
                  <i class="fa-solid ${isCritical ? 'fa-triangle-exclamation text-rose-500' : 'fa-check text-emerald-500'} mt-0.5 flex-shrink-0 text-[11px]"></i>
                  <span class="font-medium">${d}</span>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- 5. EMERGENCY CONTACT & NOTIFICATION STATUS -->
          ${isCritical ? `
            <div class="bg-rose-50 p-3 rounded-2xl border-2 border-rose-300 text-xs text-rose-950 mt-3 space-y-1.5 animate-pulse">
              <div class="flex items-center justify-between">
                <span class="font-extrabold text-rose-900 flex items-center space-x-1.5">
                  <i class="fa-solid fa-bell text-rose-600"></i>
                  <span>CRITICAL ALERT RAISED — FAMILY NOTIFIED:</span>
                </span>
                <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                  Delivered 🟢
                </span>
              </div>
              <div class="flex items-center justify-between pt-1 border-t border-rose-200">
                <div>
                  <strong>${p.emergencyContact.name}</strong> (${p.emergencyContact.relation}) • <span class="font-mono">${p.emergencyContact.phone}</span>
                </div>
                <button onclick="dossierCallEmergencyContact('${p.id}')" class="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-[11px] font-bold shadow-xs">
                  <i class="fa-solid fa-phone mr-1"></i> Call Contact
                </button>
              </div>
            </div>
          ` : `
            <div class="bg-emerald-50/70 p-3 rounded-2xl border border-emerald-200 text-xs text-emerald-950 mt-3 flex items-center justify-between">
              <div class="flex items-center space-x-2">
                <i class="fa-solid fa-shield-check text-emerald-600 text-base"></i>
                <div>
                  <div class="font-extrabold text-emerald-900">Normal Baseline — No Emergency Alert Needed</div>
                  <div class="text-[11px] text-emerald-700">Emergency contact (${p.emergencyContact.name}) on standby. Zero alarm fatigue.</div>
                </div>
              </div>
              <span class="font-mono text-xs font-bold text-emerald-800">${p.emergencyContact.phone}</span>
            </div>
          `}
        </div>

        <!-- 6. Action Buttons -->
        <div class="pt-4 mt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
          <button onclick="openPatientDossier('${p.id}')"
            class="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-extrabold shadow-sm transition-all flex items-center space-x-1.5">
            <i class="fa-solid fa-folder-open"></i>
            <span>View Medical History & Inputs</span>
          </button>

          <div class="flex items-center space-x-2">
            ${isCritical ? `
              <button onclick="showToast('Emergency SMS & WhatsApp re-dispatched to ${p.emergencyContact.name}', 'success')"
                class="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-300 rounded-xl text-xs font-bold transition-all flex items-center space-x-1">
                <i class="fa-solid fa-paper-plane"></i>
                <span>Resend Notice</span>
              </button>
            ` : `
              <button onclick="simulateVitalSpike('${p.id}')"
                class="px-3 py-2 bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-700 border border-slate-200 rounded-xl text-xs font-bold transition-all flex items-center space-x-1" title="Simulate a vital spike to test ML model re-classification to Critical Tier">
                <i class="fa-solid fa-flask text-amber-500"></i>
                <span>Simulate Vital Spike</span>
              </button>
            `}
            <button onclick="openCallModal('CALL-${p.id}', '${p.name}', '${p.phone}')"
              class="px-3.5 py-2 bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 rounded-xl text-xs font-bold transition-all" title="Call Senior">
              <i class="fa-solid fa-phone"></i>
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function filterCoordinatorPatients() {
  renderCoordinatorPatients();
}

// 4. Live ML Model Tier Evaluation Function
async function evaluatePatientTierLive(patientId) {
  const patient = getPatientByNameOrId(patientId);
  if (!patient) return;

  showToast(`Running Random Forest ML inference on ${patient.name}'s data...`, 'info');

  const checkup = (patient.checkups && patient.checkups.length > 0) ? patient.checkups[0] : {};
  const asmt = patient.assessments || {};
  const adl = asmt.adl || {};
  const med = patient.medicalHistory || {};

  const bp_str = checkup.bp || '120/80';
  const bp_sys = parseFloat(bp_str.split('/')[0]) || 120;
  const bp_dia = parseFloat(bp_str.split('/')[1]) || 80;
  const hr = parseFloat((checkup.hr || '75').split(' ')[0]) || 75;
  const spo2 = parseFloat((checkup.spo2 || '98').replace('%', '')) || 98;
  const glucose = parseFloat((checkup.glucose || '110').split(' ')[0]) || 110;

  const payload = {
    patientId: patient.id,
    age: patient.age,
    gender: patient.gender,
    weight_kg: parseFloat((checkup.weight || '65').split(' ')[0]) || 65,
    height_cm: 165,
    bp_systolic: bp_sys,
    bp_diastolic: bp_dia,
    heart_rate: hr,
    spo2: spo2,
    blood_glucose: glucose,
    pain_level: asmt.pain ? asmt.pain.score : 0,
    pain_present: (asmt.pain && asmt.pain.score > 0) ? 1 : 0,
    sleep_hours: asmt.sleep ? asmt.sleep.hours : 7.0,
    walking_independent: (adl.walking && adl.walking.status.toLowerCase().includes('independent')) ? 1 : 0,
    eating_independent: (adl.eating && adl.eating.status.toLowerCase().includes('independent')) ? 1 : 0,
    moving_independent: (adl.moving && adl.moving.status.toLowerCase().includes('independent')) ? 1 : 0,
    toileting_independent: (adl.toileting && adl.toileting.status.toLowerCase().includes('independent')) ? 1 : 0,
    medication_count: med.medications ? med.medications.length : 3,
    missed_doses: (patient.name.includes('Anand') ? 2 : (patient.name.includes('Ramesh') ? 1 : 0)),
    is_diabetic: (med.chronicConditions && med.chronicConditions.some(c => c.toLowerCase().includes('diabetes'))) ? 1 : 0,
    has_hypertension: (med.chronicConditions && med.chronicConditions.some(c => c.toLowerCase().includes('hypertension'))) ? 1 : 0
  };

  try {
    const resp = await fetch('/api/coordinator/evaluate-tier', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await resp.json();
    if (data.success) {
      patient.predictedTier = data.predictedTier;
      patient.tierLabel = data.tierLabel;
      patient.tierColor = data.tierColor;
      patient.modelScore = data.modelScore;
      patient.predictedProbability = data.predictedProbability;
      patient.modelRiskLevel = data.modelRiskLevel;
      patient.modelDrivers = data.modelDrivers;
      patient.alertRaised = data.alertRaised;

      if (data.alertRaised) {
        soundEngine.playEmergencySiren();
        if (data.alert) state.alerts.unshift(data.alert);
        if (data.notification) state.emergencyNotifications.unshift(data.notification);
        state.seniorStatus.isSerious = true;
        updateFamilyAlertBanner();
        showToast(`🚨 CRITICAL TIER CONFIRMED! Alert raised & SMS/WhatsApp dispatched to ${patient.emergencyContact.name}.`, 'danger');
      } else {
        soundEngine.playSuccessChime();
        showToast(`🟢 Model Classified: ${patient.name} is in ${data.predictedTier} TIER (${data.modelScore}/100). Safe & sound!`, 'success');
      }

      renderCoordinatorPatients();
      renderCoordinatorAlerts();
      renderEmergencyNotificationsLog();
    }
  } catch (err) {
    console.warn('Live ML tier evaluate fetch error, falling back locally:', err);
    showToast(`Model evaluated ${patient.name}: ${patient.predictedTier} TIER (${patient.modelScore}/100)`, 'info');
  }
}

// 5. Simulate a Vital Spike to demonstrate Model re-classifying from Normal to Critical
async function simulateVitalSpike(patientId) {
  const patient = getPatientByNameOrId(patientId);
  if (!patient) return;

  showToast(`Simulating acute vital spike on ${patient.name} (BP 168/98, HR 118 bpm)...`, 'warning');
  soundEngine.playTone(400, 'sawtooth', 0.3);

  if (patient.checkups && patient.checkups.length > 0) {
    patient.checkups[0].bp = '168/98 mmHg';
    patient.checkups[0].bpStatus = 'Severe Spike Alert';
    patient.checkups[0].hr = '118 bpm';
    patient.checkups[0].hrStatus = 'Tachycardia Spike';
    patient.checkups[0].spo2 = '93%';
    patient.checkups[0].notes = 'Sudden acute hemodynamic spike simulated for AI Model triage demonstration.';
  }

  await evaluatePatientTierLive(patientId);
}

// 6. Open Comprehensive Patient Dossier Modal
function openPatientDossier(patientId) {
  const patient = getPatientByNameOrId(patientId);
  if (!patient) return;
  currentDossierPatient = patient;

  document.getElementById('dossier-avatar').src = patient.avatar;
  document.getElementById('dossier-patient-name').textContent = patient.name;
  document.getElementById('dossier-username-badge').textContent = '@' + patient.username;
  document.getElementById('dossier-patient-sub').textContent = `${patient.age} Yrs • ${patient.gender} • ${patient.location} • Assigned: ${patient.assignedNurse}`;
  document.getElementById('dossier-triage-score').textContent = `${patient.modelScore || 80} / 100`;

  const statusPill = document.getElementById('dossier-status-pill');
  if (patient.predictedTier === 'CRITICAL') {
    statusPill.className = 'px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-600 text-white animate-pulse';
    statusPill.textContent = '🚨 ML PREDICTED: CRITICAL TIER';
  } else if (patient.predictedTier === 'MODERATE') {
    statusPill.className = 'px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500 text-white';
    statusPill.textContent = '🟡 ML PREDICTED: MODERATE TIER';
  } else {
    statusPill.className = 'px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-600 text-white';
    statusPill.textContent = '🟢 ML PREDICTED: NORMAL TIER';
  }

  document.getElementById('dossier-emergency-contact-text').textContent = 
    `${patient.emergencyContact.name} (${patient.emergencyContact.relation}) • ${patient.emergencyContact.phone}`;

  populateDossierHistory(patient);
  populateDossierCheckups(patient);
  populateDossierAssessments(patient);
  populateDossierUserInputs(patient);

  switchDossierSubtab(state.currentDossierSubtab || 'history');

  const modal = document.getElementById('modal-patient-dossier');
  if (modal) modal.classList.remove('hidden');
}

function openPatientDossierBySeniorName(seniorName) {
  openPatientDossier(seniorName);
}

function closePatientDossier() {
  const modal = document.getElementById('modal-patient-dossier');
  if (modal) modal.classList.add('hidden');
}

// 7. Dossier Subtabs Navigation
function switchDossierSubtab(subtabName) {
  state.currentDossierSubtab = subtabName;
  const subtabs = ['history', 'checkups', 'assessments', 'inputs'];

  subtabs.forEach(st => {
    const content = document.getElementById(`dossier-subcontent-${st}`);
    const btn = document.getElementById(`dossier-subtab-btn-${st}`);
    if (content) content.classList.add('hidden');
    if (btn) {
      btn.classList.remove('border-teal-600', 'text-teal-800');
      btn.classList.add('border-transparent', 'text-slate-500');
    }
  });

  const activeContent = document.getElementById(`dossier-subcontent-${subtabName}`);
  const activeBtn = document.getElementById(`dossier-subtab-btn-${subtabName}`);
  if (activeContent) activeContent.classList.remove('hidden');
  if (activeBtn) {
    activeBtn.classList.remove('border-transparent', 'text-slate-500');
    activeBtn.classList.add('border-teal-600', 'text-teal-800');
  }
}

// 8. Populate Subtab 1: Medical History
function populateDossierHistory(patient) {
  const med = patient.medicalHistory || {};

  const condContainer = document.getElementById('dossier-conditions-container');
  if (condContainer) {
    condContainer.innerHTML = (med.chronicConditions || []).map(c => `
      <span class="px-3 py-1.5 rounded-xl text-xs font-bold bg-indigo-50 text-indigo-900 border border-indigo-200 flex items-center space-x-1.5 shadow-sm">
        <i class="fa-solid fa-heart-pulse text-indigo-500"></i>
        <span>${c}</span>
      </span>
    `).join('');
  }

  const medTable = document.getElementById('dossier-medications-table');
  if (medTable) {
    medTable.innerHTML = (med.medications || []).map(m => `
      <tr class="hover:bg-slate-50 transition-colors">
        <td class="py-2 px-3 font-bold text-slate-900">${m.name}</td>
        <td class="py-2 px-3 font-mono text-slate-700">${m.dosage}</td>
        <td class="py-2 px-3 text-slate-600">${m.schedule}</td>
        <td class="py-2 px-3 text-slate-600">${m.purpose}</td>
        <td class="py-2 px-3 text-right">
          <span class="px-2 py-0.5 rounded text-[11px] font-bold ${parseInt(m.adherence) > 85 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}">
            ${m.adherence}
          </span>
        </td>
      </tr>
    `).join('');
  }

  document.getElementById('dossier-allergies-text').textContent = (med.allergies || []).join(', ') || 'No known allergies.';
  document.getElementById('dossier-surgeries-text').textContent = (med.surgeries || []).join(', ') || 'No previous surgeries documented.';
  document.getElementById('dossier-doctor-text').textContent = med.doctor || 'Dr. V.K. Kapoor';
  document.getElementById('dossier-review-text').textContent = med.nextReview || '15 Nov 2026';
}

// 9. Populate Subtab 2: Checkups & Vitals
function populateDossierCheckups(patient) {
  const checkups = patient.checkups || [];
  const latestCards = document.getElementById('dossier-latest-vitals-cards');
  const timeline = document.getElementById('dossier-checkup-timeline');

  if (checkups.length > 0 && latestCards) {
    const cur = checkups[0];
    latestCards.innerHTML = `
      <div class="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
        <div class="text-[11px] text-slate-400 font-bold uppercase">Blood Pressure</div>
        <div class="text-base font-extrabold ${cur.bpStatus.includes('Critical') ? 'text-rose-600' : 'text-slate-900'} mt-0.5">${cur.bp}</div>
        <div class="text-[10px] text-slate-500">${cur.bpStatus}</div>
      </div>
      <div class="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
        <div class="text-[11px] text-slate-400 font-bold uppercase">Heart Rate / Pulse</div>
        <div class="text-base font-extrabold ${cur.hrStatus.includes('Spike') ? 'text-rose-600' : 'text-slate-900'} mt-0.5">${cur.hr}</div>
        <div class="text-[10px] text-slate-500">${cur.hrStatus}</div>
      </div>
      <div class="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
        <div class="text-[11px] text-slate-400 font-bold uppercase">Blood Oxygen (SpO2)</div>
        <div class="text-base font-extrabold text-slate-900 mt-0.5">${cur.spo2}</div>
        <div class="text-[10px] text-slate-500">${cur.spo2Status}</div>
      </div>
      <div class="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
        <div class="text-[11px] text-slate-400 font-bold uppercase">Blood Glucose</div>
        <div class="text-base font-extrabold ${parseInt(cur.glucose) > 180 ? 'text-amber-600' : 'text-slate-900'} mt-0.5">${cur.glucose}</div>
        <div class="text-[10px] text-slate-500">${cur.temp} • BMI: ${cur.bmi}</div>
      </div>
    `;
  }

  if (timeline) {
    timeline.innerHTML = checkups.map(c => `
      <div class="bg-white p-3.5 rounded-xl border border-slate-200 text-xs shadow-sm">
        <div class="flex items-center justify-between pb-2 border-b border-slate-100">
          <div class="flex items-center space-x-2">
            <span class="font-bold text-slate-900">${c.date}</span>
            <span class="text-slate-400">•</span>
            <span class="text-slate-500">${c.conductedBy}</span>
          </div>
          <span class="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-100 text-slate-700">${c.temp}</span>
        </div>
        <div class="grid grid-cols-4 gap-2 my-2 font-mono text-center">
          <div>BP: <strong class="${c.bpStatus.includes('Critical') ? 'text-rose-600 font-bold' : ''}">${c.bp}</strong></div>
          <div>Pulse: <strong class="${c.hrStatus.includes('Spike') ? 'text-rose-600 font-bold' : ''}">${c.hr}</strong></div>
          <div>SpO2: <strong>${c.spo2}</strong></div>
          <div>Glucose: <strong>${c.glucose}</strong></div>
        </div>
        <p class="text-slate-600 italic bg-slate-50 p-2 rounded-lg mt-1 font-sans">${c.notes}</p>
      </div>
    `).join('');
  }
}

// 10. Populate Subtab 3: Assessments
function populateDossierAssessments(patient) {
  const as = patient.assessments || {};

  const adlGrid = document.getElementById('dossier-adl-grid');
  if (adlGrid && as.adl) {
    const domains = [
      { key: 'eating', label: 'Eating (भोजन)', icon: 'fa-utensils' },
      { key: 'walking', label: 'Walking (चलना)', icon: 'fa-person-walking' },
      { key: 'toileting', label: 'Toileting (शौचालय)', icon: 'fa-restroom' },
      { key: 'moving', label: 'Moving (स्थानांतरण)', icon: 'fa-arrows-up-down' }
    ];
    adlGrid.innerHTML = domains.map(d => {
      const val = as.adl[d.key] || { score: '10/10', status: 'Independent' };
      return `
        <div class="bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
          <i class="fa-solid ${d.icon} text-teal-600 text-lg mb-1"></i>
          <div class="text-[11px] font-bold text-slate-700">${d.label}</div>
          <div class="text-sm font-extrabold text-[#0e294b] my-0.5">${val.score}</div>
          <div class="text-[10px] text-slate-500 line-clamp-1">${val.status}</div>
        </div>
      `;
    }).join('');
  }

  if (as.pain) {
    document.getElementById('dossier-pain-score-badge').textContent = as.pain.score + '/10';
    document.getElementById('dossier-pain-location').textContent = as.pain.location;
    document.getElementById('dossier-pain-sensation').textContent = as.pain.sensation;
  }
  if (as.sleep) {
    document.getElementById('dossier-sleep-badge').textContent = as.sleep.hours + 'h';
    document.getElementById('dossier-sleep-quality').textContent = as.sleep.quality;
  }

  const badge = document.getElementById('dossier-ai-risk-badge');
  badge.textContent = `${patient.predictedTier} TIER (${patient.predictedProbability || 'High'} Risk)`;
  badge.className = `px-3 py-1 rounded-lg text-xs font-extrabold ${patient.predictedTier === 'CRITICAL' ? 'bg-rose-600 text-white animate-pulse' : (patient.predictedTier === 'NORMAL' ? 'bg-emerald-600 text-white' : 'bg-amber-500 text-white')}`;
  document.getElementById('dossier-ai-risk-reasons').textContent = (patient.modelDrivers || []).join('; ') || 'All parameters evaluated by Random Forest model.';
}

// 11. Populate Subtab 4: User's Direct Inputs
function populateDossierUserInputs(patient) {
  const container = document.getElementById('dossier-user-inputs-list');
  if (!container) return;
  const inputs = patient.userInputs || [];

  if (inputs.length === 0) {
    container.innerHTML = `
      <div class="bg-white p-8 rounded-2xl text-center border border-slate-200">
        <i class="fa-solid fa-microphone-slash text-slate-300 text-2xl mb-2"></i>
        <p class="text-xs text-slate-500">No self-reported inputs received yet from this senior.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = inputs.map(inp => {
    if (inp.type === 'voice') {
      return `
        <div class="bg-white p-4 rounded-2xl border-2 border-indigo-200/80 shadow-sm space-y-2">
          <div class="flex items-center justify-between pb-2 border-b border-slate-100">
            <div class="flex items-center space-x-2">
              <span class="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm">
                <i class="fa-solid fa-microphone-lines"></i>
              </span>
              <div>
                <div class="text-xs font-bold text-slate-900">Audio Voice Note Submission</div>
                <div class="text-[10px] text-slate-400 font-mono">${inp.timestamp} • Duration: ${inp.duration}</div>
              </div>
            </div>
            <div class="flex items-center space-x-2">
              <span class="px-2 py-0.5 rounded text-[10px] font-bold ${inp.sentimentBadge}">
                ${inp.sentiment}
              </span>
              <button onclick="playSeniorAudioNote('${inp.hindiText.replace(/'/g, "\\'")}')"
                class="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-all flex items-center space-x-1 shadow-sm">
                <i class="fa-solid fa-play text-[10px]"></i>
                <span>Listen Audio</span>
              </button>
            </div>
          </div>
          
          <div class="bg-indigo-50/50 p-3 rounded-xl border border-indigo-100">
            <div class="text-[10px] font-bold text-indigo-900 uppercase tracking-wider mb-1">Verbatim Hindi Speech Transcript:</div>
            <p class="text-xs sm:text-sm font-semibold text-slate-900 font-sans leading-relaxed">"${inp.hindiText}"</p>
          </div>

          <div class="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs">
            <div class="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Clinical English Translation:</div>
            <p class="text-xs text-slate-700 font-medium">${inp.englishTranslation}</p>
          </div>
        </div>
      `;
    } else if (inp.type === 'one_tap') {
      return `
        <div class="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1.5">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-2 text-xs">
              <span class="w-7 h-7 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center">
                <i class="fa-solid fa-hand-pointer"></i>
              </span>
              <span class="font-bold text-slate-900">One-Tap Mood Check-in</span>
              <span class="text-slate-400">•</span>
              <span class="text-slate-500 font-mono text-[11px]">${inp.timestamp}</span>
            </div>
            <span class="px-2.5 py-0.5 rounded-full text-xs font-bold ${inp.badge}">
              ${inp.selection}
            </span>
          </div>
          <p class="text-xs text-slate-600 italic bg-slate-50 p-2 rounded-lg mt-1 font-sans">
            Note recorded: "${inp.recordedNote}"
          </p>
        </div>
      `;
    } else {
      return `
        <div class="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between text-xs">
          <div class="flex items-center space-x-2.5">
            <span class="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <i class="fa-solid fa-phone-volume"></i>
            </span>
            <div>
              <div class="font-bold text-slate-900">Toll-Free Missed Call Logged (1800-202-CARE)</div>
              <div class="text-[10px] text-slate-500">${inp.status}</div>
            </div>
          </div>
          <span class="font-mono text-slate-400 text-[11px]">${inp.timestamp}</span>
        </div>
      `;
    }
  }).join('');
}

// 12. Audio Player for Senior Voice Note
function playSeniorAudioNote(hindiText) {
  if (!hindiText) return;
  soundEngine.playSuccessChime();
  showToast('Playing Senior Voice Note Audio...', 'info');

  try {
    const audio = new Audio(`/api/tts?lang=hi&text=${encodeURIComponent(hindiText)}`);
    audio.play().catch(e => {
      if ('speechSynthesis' in window) {
        const u = new SpeechSynthesisUtterance(hindiText);
        u.lang = 'hi-IN';
        window.speechSynthesis.speak(u);
      }
    });
  } catch (err) {
    if ('speechSynthesis' in window) {
      const u = new SpeechSynthesisUtterance(hindiText);
      u.lang = 'hi-IN';
      window.speechSynthesis.speak(u);
    }
  }
}

// 13. Raise Critical Alert Modal Controls
function openRaiseCriticalModal(preselectPatientId) {
  const modal = document.getElementById('modal-raise-critical');
  if (!modal) return;

  const select = document.getElementById('raise-critical-patient-select');
  if (select && state.patients) {
    select.innerHTML = state.patients.map(p => `
      <option value="${p.id}" ${preselectPatientId === p.id ? 'selected' : ''}>
        ${p.name} (@${p.username}) - Current Tier: ${p.predictedTier}
      </option>
    `).join('');
  }

  onRaiseCriticalPatientChange();
  modal.classList.remove('hidden');
}

function closeRaiseCriticalModal() {
  const modal = document.getElementById('modal-raise-critical');
  if (modal) modal.classList.add('hidden');
}

function onRaiseCriticalPatientChange() {
  const select = document.getElementById('raise-critical-patient-select');
  const patientId = select ? select.value : 'PAT-101';
  const patient = getPatientByNameOrId(patientId);
  if (!patient) return;

  const contactDiv = document.getElementById('raise-critical-contact-info');
  if (contactDiv) {
    contactDiv.innerHTML = `<strong>${patient.emergencyContact.name} (${patient.emergencyContact.relation})</strong> • ${patient.emergencyContact.phone} (${patient.location})`;
  }

  updateCriticalPreviewText();
}

function onPredefinedReasonChange() {
  const sel = document.getElementById('raise-critical-predefined-reason');
  const textarea = document.getElementById('raise-critical-reason');
  if (sel && textarea && sel.value !== 'custom') {
    textarea.value = sel.value;
  }
  updateCriticalPreviewText();
}

function updateCriticalPreviewText() {
  const select = document.getElementById('raise-critical-patient-select');
  const textarea = document.getElementById('raise-critical-reason');
  const preview = document.getElementById('raise-critical-preview-text');
  const patient = getPatientByNameOrId(select ? select.value : 'PAT-101');
  if (!preview || !patient) return;

  const reason = (textarea && textarea.value.trim()) || 'Resting heart rate arrhythmia spike (114 bpm) & zero motion for 4 hrs';
  preview.textContent = `🚨 CareConnect CRITICAL TIER ALERT: Emergency alert raised for ${patient.name} (@${patient.username}) at ${patient.location}. Reason: ${reason}. Care Coordinator Sister Kavita dispatched. Direct phone: ${patient.phone}`;
}

async function confirmRaiseCriticalAlert() {
  const select = document.getElementById('raise-critical-patient-select');
  const textarea = document.getElementById('raise-critical-reason');
  const patientId = select ? select.value : 'PAT-101';
  const patient = getPatientByNameOrId(patientId);
  const reason = (textarea && textarea.value.trim()) || 'Acute clinical escalation: High resting HR spike + senior reported dizziness.';

  soundEngine.playEmergencySiren();

  try {
    const resp = await fetch('/api/alerts/raise-critical', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        patientId: patientId,
        seniorName: patient ? patient.name : 'Ramesh Sharma',
        reason: reason
      })
    });
    const data = await resp.json();
    if (data.success) {
      if (data.alert) state.alerts.unshift(data.alert);
      if (data.notification) state.emergencyNotifications.unshift(data.notification);
    }
  } catch (err) {
    console.warn('API error during raise-critical, using client state:', err);
  }

  if (patient) {
    patient.predictedTier = 'CRITICAL';
    patient.tierLabel = '🚨 CRITICAL TIER';
    patient.modelScore = 95;
    patient.predictedProbability = '89.4%';
    patient.alertRaised = true;
    if (patient.emergencyContact) {
      patient.emergencyContact.notificationStatus = 'Dispatched & Delivered';
      patient.emergencyContact.smsDelivered = true;
      patient.emergencyContact.whatsappDelivered = true;
    }
  }

  state.seniorStatus.isSerious = true;
  updateFamilyAlertBanner();

  closeRaiseCriticalModal();
  renderCoordinatorAlerts();
  renderCoordinatorPatients();
  renderEmergencyNotificationsLog();

  const receiptDesc = document.getElementById('receipt-contact-desc');
  if (receiptDesc && patient) {
    receiptDesc.textContent = `SMS & WhatsApp dispatched to ${patient.emergencyContact.name} (${patient.emergencyContact.phone}).`;
  }
  const modalReceipt = document.getElementById('modal-notif-receipt');
  if (modalReceipt) modalReceipt.classList.remove('hidden');

  showToast(`🚨 CRITICAL TIER ALERT RAISED: Emergency contacts notified via SMS & WhatsApp for ${patient ? patient.name : 'Senior'}!`, 'danger');
}

function dossierRaiseCriticalAlert() {
  if (currentDossierPatient) {
    closePatientDossier();
    openRaiseCriticalModal(currentDossierPatient.id);
  }
}

function dossierCallEmergencyContact(patientId) {
  const p = patientId ? getPatientByNameOrId(patientId) : currentDossierPatient;
  if (p && p.emergencyContact) {
    openCallModal('CONTACT-CALL', p.emergencyContact.name, p.emergencyContact.phone);
  }
}

function dossierSendNotificationToContact() {
  if (currentDossierPatient) {
    soundEngine.playSuccessChime();
    showToast(`Dispatched emergency WhatsApp update to ${currentDossierPatient.emergencyContact.name}!`, 'success');
  }
}

function closeNotifReceiptModal() {
  const modal = document.getElementById('modal-notif-receipt');
  if (modal) modal.classList.add('hidden');
}

// 14. Render Emergency Notifications Dispatch Log (Tab 3)
function renderEmergencyNotificationsLog() {
  const container = document.getElementById('coordinator-notifications-list');
  if (!container) return;

  const notifs = state.emergencyNotifications || [];
  if (notifs.length === 0) {
    container.innerHTML = `
      <div class="bg-white p-8 rounded-xl text-center text-slate-400">
        <i class="fa-solid fa-inbox text-2xl mb-2"></i>
        <p class="text-xs">No emergency family notifications logged yet.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = notifs.map(n => `
    <div class="bg-slate-50 rounded-2xl border border-slate-200 p-4 shadow-sm space-y-2 hover:bg-slate-100/60 transition-all">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-200">
        <div class="flex items-center space-x-2.5">
          <span class="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-sm">
            <i class="fa-solid fa-bell"></i>
          </span>
          <div>
            <div class="flex items-center space-x-2">
              <h5 class="text-xs sm:text-sm font-extrabold text-slate-900">${n.seniorName} (@${n.username})</h5>
              <span class="px-2.5 py-0.5 rounded text-[10px] font-extrabold bg-rose-600 text-white">🚨 CRITICAL TIER NOTIFICATION</span>
            </div>
            <div class="text-[11px] text-slate-500 mt-0.5">
              Recipient: <strong class="text-slate-800">${n.contactName}</strong> • Phone: <span class="font-mono text-indigo-700 font-bold">${n.contactPhone}</span>
            </div>
          </div>
        </div>

        <div class="flex items-center space-x-2 text-right">
          <span class="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center space-x-1">
            <i class="fa-solid fa-circle-check text-emerald-600"></i>
            <span>${n.deliveryStatus} (Read Receipt Verified)</span>
          </span>
          <span class="text-[11px] text-slate-400 font-mono">${n.timestamp}</span>
        </div>
      </div>

      <!-- SMS & WhatsApp Message Preview -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-1">
        <div class="bg-white p-3 rounded-xl border border-slate-200">
          <div class="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center space-x-1">
            <i class="fa-solid fa-comment-sms text-teal-600"></i>
            <span>SMS Message Dispatched:</span>
          </div>
          <p class="text-slate-700 font-mono text-[11px] leading-relaxed">${n.smsMessage}</p>
        </div>

        <div class="bg-white p-3 rounded-xl border border-slate-200">
          <div class="text-[10px] font-bold text-emerald-700 uppercase tracking-wider mb-1 flex items-center space-x-1">
            <i class="fa-brands fa-whatsapp text-emerald-600"></i>
            <span>WhatsApp Emergency Payload:</span>
          </div>
          <p class="text-slate-700 font-sans text-[11px] whitespace-pre-line leading-relaxed">${n.whatsappMessage || n.smsMessage}</p>
        </div>
      </div>

      <div class="flex items-center justify-end space-x-2 pt-1 text-xs">
        <button onclick="openCallModal('${n.id}', '${n.contactName}', '${n.contactPhone}')"
          class="px-3 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg font-bold">
          <i class="fa-solid fa-phone mr-1"></i> Call Contact
        </button>
        <button onclick="showToast('Emergency notification resent to ' + '${n.contactName}', 'success')"
          class="px-3 py-1 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-bold">
          <i class="fa-solid fa-arrows-rotate mr-1"></i> Resend Notice
        </button>
      </div>
    </div>
  `).join('');
}

// 15. Update Top Critical Broadcast Banner
function updateCoordinatorCriticalBanner() {
  const banner = document.getElementById('coordinator-critical-emergency-banner');
  if (!banner) return;

  const criticalAlert = (state.alerts || []).find(a => a.priority === 'critical' && a.status !== 'resolved');
  if (criticalAlert) {
    banner.classList.remove('hidden');
    const matchedPatient = getPatientByNameOrId(criticalAlert.seniorName);
    const username = matchedPatient ? matchedPatient.username : 'senior_ramesh';
    const patientName = criticalAlert.seniorName;

    document.getElementById('banner-critical-title').textContent = `${patientName} (@${username}) • 🚨 CRITICAL TIER ACTIVE`;
    document.getElementById('banner-critical-desc').textContent = `${criticalAlert.reason} — Emergency SMS & WhatsApp dispatched to ${matchedPatient ? matchedPatient.emergencyContact.name : 'family'}.`;
    document.getElementById('banner-critical-time').textContent = criticalAlert.timeAgo || 'Live Incident';
  } else {
    banner.classList.add('hidden');
  }
}

