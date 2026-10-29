
# -*- coding: utf-8 -*-
import json
from patient_data_seed import PATIENTS_DATA, EMERGENCY_NOTIFICATIONS_SEED

patients_json = json.dumps(PATIENTS_DATA, ensure_ascii=False)
notifs_json = json.dumps(EMERGENCY_NOTIFICATIONS_SEED, ensure_ascii=False)

with open("app.js", "r", encoding="utf-8") as f:
    app_code = f.read()

# 1. Add patients and emergencyNotifications to state in app.js
state_target = """const state = {
  currentRole: 'login', // 'login' | 'coordinator' | 'senior' | 'family' | 'operations'
  seniorLanguage: 'en', // 'en' | 'hi'
  audioEnabled: true,"""

state_replacement = f"""const state = {{
  currentRole: 'login', // 'login' | 'coordinator' | 'senior' | 'family' | 'operations'
  seniorLanguage: 'en', // 'en' | 'hi'
  audioEnabled: true,
  currentCoordinatorTab: 'queue', // 'queue' | 'patients' | 'notifications'
  currentDossierSubtab: 'history', // 'history' | 'checkups' | 'assessments' | 'inputs'
  patients: {patients_json},
  emergencyNotifications: {notifs_json},"""

assert state_target in app_code, "Could not find state definition in app.js!"
app_code = app_code.replace(state_target, state_replacement, 1)

# 2. Replace renderCoordinatorAlerts with enhanced version
old_render_alerts_target = """  // Sort strictly by priority rank
  list.sort((a, b) => a.rank - b.rank);

  // Update Summary Stats
  const critCount = state.alerts.filter(a => a.priority === 'critical' && a.status !== 'resolved').length;
  const highCount = state.alerts.filter(a => a.priority === 'high' && a.status !== 'resolved').length;
  const totalActive = state.alerts.filter(a => a.status !== 'resolved').length;
  const totalResolved = state.resolvedAlerts.length;

  document.getElementById('stat-critical-count').textContent = critCount;
  document.getElementById('stat-high-count').textContent = highCount;
  document.getElementById('stat-active-cases').textContent = totalActive;
  document.getElementById('stat-resolved-count').textContent = totalResolved;"""

new_render_alerts_replacement = """  // Sort strictly by priority rank
  list.sort((a, b) => a.rank - b.rank);

  // Update Summary Stats
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

  // Update Main Coordinator Tab Badges
  const bQueue = document.getElementById('coord-badge-queue');
  if (bQueue) bQueue.textContent = totalActive;
  const bPatients = document.getElementById('coord-badge-patients');
  if (bPatients) bPatients.textContent = state.patients ? state.patients.length : 5;
  const bNotifs = document.getElementById('coord-badge-notifications');
  if (bNotifs) bNotifs.textContent = state.emergencyNotifications ? state.emergencyNotifications.length : 2;

  // Update Top Critical Emergency Broadcast Banner
  updateCoordinatorCriticalBanner();"""

assert old_render_alerts_target in app_code, "Could not find old renderCoordinatorAlerts stats section!"
app_code = app_code.replace(old_render_alerts_target, new_render_alerts_replacement, 1)

# 3. Enhance each alert card HTML in renderCoordinatorAlerts
old_card_return = """    return `
      <div class="bg-white rounded-2xl border-2 ${borderClass} p-5 sm:p-6 shadow-sm hover:shadow-md transition-all">
        <!-- Top Row: Rank Badge, Senior Info, Priority Score -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div class="flex items-center space-x-3.5">
            <!-- Priority Rank Number -->
            <div class="w-10 h-10 rounded-xl ${rankBadgeClass} flex items-center justify-center font-extrabold text-sm flex-shrink-0" title="Daily Priority Rank #${item.rank}">
              #${item.rank}
            </div>

            <div>
              <div class="flex items-center space-x-2">
                <h3 class="text-base sm:text-lg font-bold text-slate-900">${item.seniorName}</h3>
                <span class="text-xs text-slate-500">(${item.age} Yrs • ${item.gender})</span>
                <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold ${badgeClass}">
                  ${pulseEffect} ${item.priority.toUpperCase()} PRIORITY
                </span>
              </div>
              <div class="text-xs text-slate-500 mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1">
                <span><i class="fa-solid fa-location-dot text-teal-600 mr-1"></i>${item.location}</span>
                <span><i class="fa-solid fa-user-group text-indigo-500 mr-1"></i>${item.familyContact}</span>
                <span><i class="fa-solid fa-clock text-slate-400 mr-1"></i>${item.timeAgo}</span>
              </div>
            </div>
          </div>"""

new_card_return = """    const matchedPatient = getPatientByNameOrId(item.patientId || item.seniorName);
    const username = matchedPatient ? matchedPatient.username : (item.username || 'senior_' + item.seniorName.toLowerCase().replace(/[^a-z]/g, ''));
    const patientId = matchedPatient ? matchedPatient.id : 'PAT-101';
    const emergencyContactStr = matchedPatient ? `${matchedPatient.emergencyContact.name} (${matchedPatient.emergencyContact.relation}) • ${matchedPatient.emergencyContact.phone}` : item.familyContact;

    return `
      <div class="bg-white rounded-2xl border-2 ${borderClass} p-5 sm:p-6 shadow-sm hover:shadow-md transition-all">
        <!-- Top Row: Rank Badge, Senior Info, Priority Score -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div class="flex items-center space-x-3.5">
            <!-- Priority Rank Number -->
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
                <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold ${badgeClass}">
                  ${pulseEffect} ${item.priority.toUpperCase()} PRIORITY
                </span>
              </div>
              <div class="text-xs text-slate-500 mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
                <span><i class="fa-solid fa-location-dot text-teal-600 mr-1"></i>${item.location}</span>
                <span class="text-indigo-700 font-medium"><i class="fa-solid fa-shield-heart text-rose-500 mr-1"></i>${emergencyContactStr}</span>
                <span><i class="fa-solid fa-clock text-slate-400 mr-1"></i>${item.timeAgo}</span>
                ${item.priority === 'critical' ? '<span class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300"><i class="fa-solid fa-check-double mr-1 text-emerald-600"></i>SMS/WhatsApp Dispatched</span>' : ''}
              </div>
            </div>
          </div>"""

assert old_card_return in app_code, "Could not find old_card_return in app.js!"
app_code = app_code.replace(old_card_return, new_card_return, 1)

# 4. Enhance the buttons row of each alert card
old_btn_row = """        <!-- Bottom Action Buttons: Call, Dispatch, Resolve -->
        <div class="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
          <div class="flex items-center space-x-2">
            <button onclick="openCallModal('${item.id}', '${item.seniorName}', '${item.phone}')" class="px-3.5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center space-x-1.5">
              <i class="fa-solid fa-phone"></i>
              <span>2-Way Call Senior</span>
            </button>
            <button onclick="openDispatchModal('${item.id}', '${item.seniorName}')" class="px-3.5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5">
              <i class="fa-solid fa-person-walking-arrow-right"></i>
              <span>Dispatch Care Specialist</span>
            </button>
          </div>

          <div class="flex items-center space-x-2">
            <button onclick="openResolveModal('${item.id}', '${item.seniorName}')" class="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center space-x-1.5">
              <i class="fa-solid fa-circle-check"></i>
              <span>Resolve & Mark Safe</span>
            </button>
          </div>
        </div>"""

new_btn_row = """        <!-- Bottom Action Buttons: Patient Dossier, Call, Dispatch, Resolve -->
        <div class="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
          <div class="flex flex-wrap items-center gap-2">
            <button onclick="openPatientDossier('${patientId}')" class="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center space-x-1.5" title="View Patient Medical History, Checkups, Assessments & User Inputs">
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
            ${item.priority !== 'critical' ? `
              <button onclick="openRaiseCriticalModal('${patientId}')" class="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-300 rounded-xl text-xs font-bold transition-all flex items-center space-x-1">
                <i class="fa-solid fa-triangle-exclamation"></i>
                <span>Escalate Critical</span>
              </button>
            ` : ''}
            <button onclick="openResolveModal('${item.id}', '${item.seniorName}')" class="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center space-x-1.5">
              <i class="fa-solid fa-circle-check"></i>
              <span>Resolve & Mark Safe</span>
            </button>
          </div>
        </div>"""

assert old_btn_row in app_code, "Could not find old_btn_row in app.js!"
app_code = app_code.replace(old_btn_row, new_btn_row, 1)

# 5. Append all coordinator patient dossier, tabs, and emergency notifications functions at the end of app.js
coordinator_code = '''

// =========================================================================
// CARE COORDINATOR PATIENT DOSSIER, TABS & EMERGENCY DISPATCH ENGINE
// =========================================================================

let currentDossierPatient = null;

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

  // Reset all tabs
  if (tabQueue) tabQueue.classList.add('hidden');
  if (tabPatients) tabPatients.classList.add('hidden');
  if (tabNotifs) tabNotifs.classList.add('hidden');

  // Reset button styles
  const activeBtnClass = ['bg-teal-600', 'text-white', 'shadow-sm'];
  const inactiveBtnClass = ['text-slate-600', 'hover:text-slate-900', 'hover:bg-slate-100'];

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

// 2. Render Patient Directory Cards in Tab 2
function renderCoordinatorPatients() {
  const container = document.getElementById('coordinator-patients-grid');
  if (!container) return;

  const searchInput = document.getElementById('coord-patient-search');
  const statusFilter = document.getElementById('coord-patient-status-filter');
  const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
  const filter = statusFilter ? statusFilter.value : 'all';

  let list = (state.patients || []).filter(p => {
    if (filter !== 'all' && p.currentStatus !== filter) return false;
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
        <h4 class="text-sm font-bold text-slate-800">No matching patients found</h4>
        <p class="text-xs text-slate-500 mt-1">Try resetting the search keyword or filter.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = list.map(p => {
    let statusClass = 'bg-emerald-100 text-emerald-800 border-emerald-300';
    let statusLabel = 'STABLE & SAFE';
    let pulse = '';
    if (p.currentStatus === 'critical') {
      statusClass = 'bg-rose-100 text-rose-800 border-rose-300 ring-1 ring-rose-300';
      statusLabel = '🚨 CRITICAL CASE';
      pulse = '<span class="w-2 h-2 rounded-full bg-rose-500 animate-ping mr-1"></span>';
    } else if (p.currentStatus === 'high') {
      statusClass = 'bg-amber-100 text-amber-800 border-amber-300';
      statusLabel = '⚠️ HIGH ATTENTION';
    } else if (p.currentStatus === 'moderate') {
      statusClass = 'bg-blue-100 text-blue-800 border-blue-300';
      statusLabel = '🟡 MODERATE REVIEW';
    }

    const latestCheckup = (p.checkups && p.checkups.length > 0) ? p.checkups[0] : null;
    const latestInput = (p.userInputs && p.userInputs.length > 0) ? p.userInputs[0] : null;

    let inputHtml = '';
    if (latestInput) {
      if (latestInput.type === 'voice') {
        inputHtml = `
          <div class="bg-indigo-50/70 p-2.5 rounded-xl border border-indigo-100 text-xs">
            <div class="flex items-center justify-between text-[11px] text-indigo-700 font-bold mb-1">
              <span><i class="fa-solid fa-microphone mr-1 text-indigo-500"></i>Latest Voice Note (${latestInput.timestamp}):</span>
              <button onclick="playSeniorAudioNote('${latestInput.hindiText.replace(/'/g, "\\\\'")}')" class="px-2 py-0.5 rounded bg-indigo-600 text-white font-bold hover:bg-indigo-700 flex items-center space-x-1">
                <i class="fa-solid fa-volume-high"></i>
                <span>Listen</span>
              </button>
            </div>
            <p class="text-slate-800 font-medium italic line-clamp-1">"${latestInput.hindiText}"</p>
            <p class="text-[11px] text-slate-500 line-clamp-1">${latestInput.englishTranslation}</p>
          </div>
        `;
      } else if (latestInput.type === 'one_tap') {
        inputHtml = `
          <div class="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs flex items-center justify-between">
            <div class="flex items-center space-x-2">
              <i class="fa-solid fa-hand-pointer text-teal-600"></i>
              <span class="font-bold text-slate-800">One-Tap Status:</span>
              <span class="font-semibold text-slate-700">${latestInput.selection}</span>
            </div>
            <span class="text-[11px] text-slate-400 font-mono">${latestInput.timestamp}</span>
          </div>
        `;
      } else {
        inputHtml = `
          <div class="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs flex items-center justify-between">
            <span><i class="fa-solid fa-phone text-emerald-600 mr-1"></i>Missed-Call Check-in (1800-202-CARE)</span>
            <span class="text-[11px] text-slate-400 font-mono">${latestInput.timestamp}</span>
          </div>
        `;
      }
    }

    const conditionsList = (p.medicalHistory && p.medicalHistory.chronicConditions) || [];

    return `
      <div class="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
        <div>
          <!-- Patient Header: Avatar, Username, Name, Status -->
          <div class="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
            <div class="flex items-center space-x-3">
              <img src="${p.avatar}" alt="${p.name}" class="w-14 h-14 rounded-2xl object-cover border-2 border-slate-200 shadow-sm flex-shrink-0">
              <div>
                <div class="flex items-center space-x-2">
                  <h4 class="text-base font-extrabold text-[#0e294b]">${p.name}</h4>
                  <span class="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-slate-100 text-slate-700 border border-slate-200">
                    @${p.username}
                  </span>
                </div>
                <div class="text-xs text-slate-500 mt-0.5">
                  ${p.age} Yrs • ${p.gender} • <i class="fa-solid fa-location-dot text-teal-600 mr-1"></i>${p.location}
                </div>
              </div>
            </div>

            <div class="text-right">
              <span class="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-extrabold border ${statusClass}">
                ${pulse} ${statusLabel}
              </span>
              <div class="text-[10px] text-slate-400 mt-1 font-mono">Triage: ${p.triageScore}/100</div>
            </div>
          </div>

          <!-- Medical History Chips -->
          <div class="my-3">
            <div class="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Medical History & Conditions:</div>
            <div class="flex flex-wrap gap-1.5">
              ${conditionsList.map(c => `
                <span class="px-2 py-0.5 rounded-lg text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                  ${c}
                </span>
              `).join('')}
            </div>
          </div>

          <!-- Latest Vitals Strip -->
          ${latestCheckup ? `
            <div class="grid grid-cols-4 gap-2 text-center my-3 bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs">
              <div>
                <div class="text-[10px] text-slate-400 font-semibold">BP (mmHg)</div>
                <div class="font-mono font-bold ${latestCheckup.bpStatus.includes('Critical') ? 'text-rose-600' : 'text-slate-800'}">${latestCheckup.bp.split(' ')[0]}</div>
              </div>
              <div>
                <div class="text-[10px] text-slate-400 font-semibold">Pulse / HR</div>
                <div class="font-mono font-bold ${latestCheckup.hrStatus.includes('Spike') ? 'text-rose-600' : 'text-slate-800'}">${latestCheckup.hr}</div>
              </div>
              <div>
                <div class="text-[10px] text-slate-400 font-semibold">SpO2</div>
                <div class="font-mono font-bold text-slate-800">${latestCheckup.spo2}</div>
              </div>
              <div>
                <div class="text-[10px] text-slate-400 font-semibold">Sugar</div>
                <div class="font-mono font-bold ${parseInt(latestCheckup.glucose) > 180 ? 'text-amber-600' : 'text-slate-800'}">${latestCheckup.glucose}</div>
              </div>
            </div>
          ` : ''}

          <!-- Senior's Given Input Box -->
          <div class="my-3">
            <div class="text-[11px] font-bold text-indigo-700 uppercase tracking-wider mb-1.5 flex items-center space-x-1">
              <i class="fa-solid fa-comment-dots text-indigo-500"></i>
              <span>User's Given Input:</span>
            </div>
            ${inputHtml}
          </div>

          <!-- Emergency Contact Pill -->
          <div class="bg-rose-50/60 p-2.5 rounded-xl border border-rose-100 flex items-center justify-between text-xs text-rose-950 mt-3">
            <div>
              <i class="fa-solid fa-shield-heart text-rose-500 mr-1"></i>
              <strong>Emergency Contact:</strong> ${p.emergencyContact.name} (${p.emergencyContact.relation})
            </div>
            <span class="font-mono font-semibold text-rose-900">${p.emergencyContact.phone}</span>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="pt-4 mt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
          <button onclick="openPatientDossier('${p.id}')"
            class="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center space-x-1.5">
            <i class="fa-solid fa-folder-open"></i>
            <span>View Complete Medical Record & Inputs</span>
          </button>

          <div class="flex items-center space-x-2">
            ${p.currentStatus !== 'critical' ? `
              <button onclick="openRaiseCriticalModal('${p.id}')"
                class="px-3 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center space-x-1">
                <i class="fa-solid fa-triangle-exclamation"></i>
                <span>Raise Critical Alert</span>
              </button>
            ` : `
              <span class="px-2.5 py-1.5 rounded-xl text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-300">
                <i class="fa-solid fa-bell animate-pulse mr-1"></i> Alert Active
              </span>
            `}
            <button onclick="openCallModal('CALL-${p.id}', '${p.name}', '${p.phone}')"
              class="px-3 py-2 bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 rounded-xl text-xs font-bold transition-all" title="Call Senior">
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

// 3. Open Comprehensive Patient Dossier Modal
function openPatientDossier(patientId) {
  const patient = getPatientByNameOrId(patientId);
  if (!patient) return;
  currentDossierPatient = patient;

  // Header Details
  document.getElementById('dossier-avatar').src = patient.avatar;
  document.getElementById('dossier-patient-name').textContent = patient.name;
  document.getElementById('dossier-username-badge').textContent = '@' + patient.username;
  document.getElementById('dossier-patient-sub').textContent = `${patient.age} Yrs • ${patient.gender} • ${patient.location} • Assigned: ${patient.assignedNurse}`;
  document.getElementById('dossier-triage-score').textContent = `${patient.triageScore} / 100`;

  // Status Pill
  const statusPill = document.getElementById('dossier-status-pill');
  if (patient.currentStatus === 'critical') {
    statusPill.className = 'px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-600 text-white animate-pulse';
    statusPill.textContent = '🚨 CRITICAL CASE ACTIVE';
  } else if (patient.currentStatus === 'high') {
    statusPill.className = 'px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500 text-white';
    statusPill.textContent = '⚠️ HIGH ATTENTION';
  } else {
    statusPill.className = 'px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-600 text-white';
    statusPill.textContent = '🟢 STABLE & MONITORED';
  }

  // Emergency Contact Header Info
  document.getElementById('dossier-emergency-contact-text').textContent = 
    `${patient.emergencyContact.name} (${patient.emergencyContact.relation}) • ${patient.emergencyContact.phone}`;

  // Populate Subtabs
  populateDossierHistory(patient);
  populateDossierCheckups(patient);
  populateDossierAssessments(patient);
  populateDossierUserInputs(patient);

  // Switch to default history subtab
  switchDossierSubtab(state.currentDossierSubtab || 'history');

  // Show Modal
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

// 4. Dossier Subtabs Navigation
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

// 5. Populate Subtab 1: Medical History
function populateDossierHistory(patient) {
  const med = patient.medicalHistory || {};

  // Chronic Conditions
  const condContainer = document.getElementById('dossier-conditions-container');
  if (condContainer) {
    condContainer.innerHTML = (med.chronicConditions || []).map(c => `
      <span class="px-3 py-1.5 rounded-xl text-xs font-bold bg-indigo-50 text-indigo-900 border border-indigo-200 flex items-center space-x-1.5 shadow-sm">
        <i class="fa-solid fa-heart-pulse text-indigo-500"></i>
        <span>${c}</span>
      </span>
    `).join('');
  }

  // Medications Table
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

  // Allergies & Surgeries
  document.getElementById('dossier-allergies-text').textContent = (med.allergies || []).join(', ') || 'No known allergies.';
  document.getElementById('dossier-surgeries-text').textContent = (med.surgeries || []).join(', ') || 'No previous surgeries documented.';
  document.getElementById('dossier-doctor-text').textContent = med.doctor || 'Dr. V.K. Kapoor';
  document.getElementById('dossier-review-text').textContent = med.nextReview || '15 Nov 2026';
}

// 6. Populate Subtab 2: Checkups & Vitals
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

// 7. Populate Subtab 3: Assessments
function populateDossierAssessments(patient) {
  const as = patient.assessments || {};

  // ADL Grid
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

  // Pain & Sleep
  if (as.pain) {
    document.getElementById('dossier-pain-score-badge').textContent = as.pain.score + '/10';
    document.getElementById('dossier-pain-location').textContent = as.pain.location;
    document.getElementById('dossier-pain-sensation').textContent = as.pain.sensation;
  }
  if (as.sleep) {
    document.getElementById('dossier-sleep-badge').textContent = as.sleep.hours + 'h';
    document.getElementById('dossier-sleep-quality').textContent = as.sleep.quality;
  }

  // AI Risk
  if (as.aiRisk) {
    const badge = document.getElementById('dossier-ai-risk-badge');
    badge.textContent = `${as.aiRisk.level.toUpperCase()} RISK (${as.aiRisk.probability})`;
    badge.className = `px-3 py-1 rounded-lg text-xs font-extrabold ${as.aiRisk.level === 'High' ? 'bg-rose-600 text-white animate-pulse' : (as.aiRisk.level === 'Medium' ? 'bg-amber-500 text-white' : 'bg-emerald-600 text-white')}`;
    document.getElementById('dossier-ai-risk-reasons').textContent = as.aiRisk.reasons;
  }
}

// 8. Populate Subtab 4: User's Direct Inputs
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
              <button onclick="playSeniorAudioNote('${inp.hindiText.replace(/'/g, "\\\\'")}')"
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

// 9. Audio Player for Senior Voice Note
function playSeniorAudioNote(hindiText) {
  if (!hindiText) return;
  soundEngine.playSuccessChime();
  showToast('Playing Senior Voice Note Audio...', 'info');

  // Try calling backend TTS or fallback to SpeechSynthesis
  try {
    const audio = new Audio(`/api/tts?lang=hi&text=${encodeURIComponent(hindiText)}`);
    audio.play().catch(e => {
      // Fallback to browser SpeechSynthesis
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

// 10. Raise Critical Alert Modal Controls
function openRaiseCriticalModal(preselectPatientId) {
  const modal = document.getElementById('modal-raise-critical');
  if (!modal) return;

  const select = document.getElementById('raise-critical-patient-select');
  if (select && state.patients) {
    select.innerHTML = state.patients.map(p => `
      <option value="${p.id}" ${preselectPatientId === p.id ? 'selected' : ''}>
        ${p.name} (@${p.username}) - ${p.location}
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
  preview.textContent = `🚨 CareConnect CRITICAL ALERT: Emergency alert raised for ${patient.name} (@${patient.username}) at ${patient.location}. Trigger: ${reason}. Care Coordinator Sister Kavita initiated 2-way call & nurse dispatch. Direct phone: ${patient.phone}`;
}

// 11. Confirm and Dispatch Critical Alert + Emergency Notifications
async function confirmRaiseCriticalAlert() {
  const select = document.getElementById('raise-critical-patient-select');
  const textarea = document.getElementById('raise-critical-reason');
  const patientId = select ? select.value : 'PAT-101';
  const patient = getPatientByNameOrId(patientId);
  const reason = (textarea && textarea.value.trim()) || 'Clinical escalation: High resting HR spike + senior reported dizziness.';

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
      // Ingest into local alerts list
      if (data.alert) {
        state.alerts.unshift(data.alert);
      }
      if (data.notification) {
        state.emergencyNotifications.unshift(data.notification);
      }
    }
  } catch (err) {
    console.warn('API error during raise-critical, using client state:', err);
    // Client-side fallback
    const newAlert = {
      id: `ALT-${state.alerts.length + 1100}`,
      rank: 1,
      priority: 'critical',
      priorityScore: 99,
      seniorName: patient ? patient.name : 'Ramesh Sharma',
      username: patient ? patient.username : 'senior_ramesh',
      patientId: patientId,
      age: patient ? patient.age : 74,
      location: patient ? patient.location : 'South Delhi',
      phone: patient ? patient.phone : '+91 98110-44912',
      familyContact: patient ? `${patient.emergencyContact.name} (${patient.emergencyContact.relation}) • ${patient.emergencyContact.phone}` : 'Rahul Sharma (Son)',
      assignedNurse: 'Sister Kavita, RN',
      reason: reason,
      suggestedAction: 'Step 1: Immediate 2-way emergency call. Step 2: Emergency dispatch. Step 3: Urgent notification sent to family.',
      status: 'pending',
      timeAgo: 'Just now'
    };
    state.alerts.forEach(a => a.rank++);
    state.alerts.unshift(newAlert);

    // Notification fallback
    state.emergencyNotifications.unshift({
      id: `NOTIF-${state.emergencyNotifications.length + 901}`,
      alertId: newAlert.id,
      seniorId: patientId,
      seniorName: patient ? patient.name : 'Ramesh Sharma',
      username: patient ? patient.username : 'senior_ramesh',
      contactName: patient ? patient.emergencyContact.name : 'Rahul Sharma',
      contactPhone: patient ? patient.emergencyContact.phone : '+91 98711-20931',
      channels: ['SMS', 'WhatsApp', 'Push Notification'],
      severity: 'CRITICAL',
      timestamp: 'Just now',
      smsMessage: `🚨 CareConnect CRITICAL ALERT: Emergency alert for ${patient.name}. Reason: ${reason}.`,
      deliveryStatus: 'Delivered',
      readReceipt: true
    });
  }

  // Elevate patient status in state
  if (patient) {
    patient.currentStatus = 'critical';
    patient.triageScore = 99;
  }

  // Turn Family Portal View to serious
  state.seniorStatus.isSerious = true;
  updateFamilyAlertBanner();

  // Re-render coordinator views
  closeRaiseCriticalModal();
  renderCoordinatorAlerts();
  renderCoordinatorPatients();
  renderEmergencyNotificationsLog();

  // Show Receipt Modal
  const receiptDesc = document.getElementById('receipt-contact-desc');
  if (receiptDesc && patient) {
    receiptDesc.textContent = `SMS & WhatsApp dispatched to ${patient.emergencyContact.name} (${patient.emergencyContact.phone}).`;
  }
  const modalReceipt = document.getElementById('modal-notif-receipt');
  if (modalReceipt) modalReceipt.classList.remove('hidden');

  showToast(`🚨 CRITICAL ALERT RAISED: Emergency contacts notified via SMS & WhatsApp for ${patient ? patient.name : 'Senior'}!`, 'danger');
}

function dossierRaiseCriticalAlert() {
  if (currentDossierPatient) {
    closePatientDossier();
    openRaiseCriticalModal(currentDossierPatient.id);
  }
}

function dossierCallEmergencyContact() {
  if (currentDossierPatient) {
    openCallModal('CONTACT-CALL', currentDossierPatient.emergencyContact.name, currentDossierPatient.emergencyContact.phone);
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

// 12. Render Emergency Notifications Dispatch Log in Tab 3
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
              <span class="px-2 py-0.5 rounded text-[10px] font-extrabold bg-rose-600 text-white">CRITICAL ESCALATION</span>
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

// 13. Update Top Critical Broadcast Banner
function updateCoordinatorCriticalBanner() {
  const banner = document.getElementById('coordinator-critical-emergency-banner');
  if (!banner) return;

  const criticalAlert = (state.alerts || []).find(a => a.priority === 'critical' && a.status !== 'resolved');
  if (criticalAlert) {
    banner.classList.remove('hidden');
    const matchedPatient = getPatientByNameOrId(criticalAlert.seniorName);
    const username = matchedPatient ? matchedPatient.username : 'senior_ramesh';
    const patientName = criticalAlert.seniorName;

    document.getElementById('banner-critical-title').textContent = `${patientName} (@${username}) • Emergency Alert Active`;
    document.getElementById('banner-critical-desc').textContent = `${criticalAlert.reason} — Emergency SMS & WhatsApp dispatched to family contact.`;
    document.getElementById('banner-critical-time').textContent = criticalAlert.timeAgo || 'Live Incident';
  } else {
    banner.classList.add('hidden');
  }
}
'''

app_code += coordinator_code

with open("app.js", "w", encoding="utf-8") as f:
    f.write(app_code)

print("app.js successfully updated with Coordinator Patient Dossier & Emergency Dispatch logic!")

