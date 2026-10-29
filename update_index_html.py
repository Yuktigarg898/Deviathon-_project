# -*- coding: utf-8 -*-
import re

with open("index.html", "r", encoding="utf-8") as f:
    html = f.read()

# 1. Update the coordinator section:
old_coordinator_section = """    <!-- ========================================================================= -->
    <!-- 1. CARE COORDINATOR VIEW                                                  -->
    <!-- Requirement: A ranked daily list of seniors to prioritise, with the       -->
    <!-- reason for each alert and a suggested action.                             -->
    <!-- ========================================================================= -->
    <section id="view-coordinator" class="hidden flex-grow p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
      <!-- Top Title & Action Bar -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div class="flex items-center space-x-2">
            <span
              class="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
              Role: Care Coordinator
            </span>
            <span class="text-xs text-slate-500">Shift Zone: South Delhi & NCR Cluster</span>
          </div>
          <h2 class="text-2xl font-extrabold text-[#0e294b] mt-1 font-sans">
            Daily Senior Priority Triage Queue
          </h2>
          <p class="text-xs sm:text-sm text-slate-500">
            Intelligently ranked order of vulnerable elders requiring proactive clinical or buddy contact today.
          </p>
        </div>

        <!-- Quick Simulation Button to show incoming emergency live! -->
        <div class="flex items-center space-x-2">
          <button onclick="simulateIncomingAlert()"
            class="inline-flex items-center px-3.5 py-2 border border-rose-300 text-xs font-bold rounded-xl text-rose-700 bg-rose-50 hover:bg-rose-100 transition-all shadow-sm">
            <i class="fa-solid fa-circle-exclamation mr-1.5 text-rose-500 animate-bounce"></i>
            <span>Simulate Incoming Emergency</span>
          </button>
          <button onclick="refreshCoordinatorQueue()"
            class="inline-flex items-center px-3 py-2 border border-slate-200 text-xs font-medium rounded-xl text-slate-700 bg-white hover:bg-slate-50 transition-all shadow-sm"
            title="Refresh List">
            <i class="fa-solid fa-arrows-rotate mr-1.5 text-slate-400"></i>
            <span>Sync</span>
          </button>
        </div>
      </div>

      <!-- Quick Metrics Summary Bar -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <div class="bg-white rounded-xl p-4 border border-rose-200 shadow-sm flex items-center space-x-3">
          <div
            class="w-10 h-10 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center font-bold text-lg">
            <i class="fa-solid fa-triangle-exclamation"></i>
          </div>
          <div>
            <div id="stat-critical-count" class="text-xl font-extrabold text-rose-600">2</div>
            <div class="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Critical Priority</div>
          </div>
        </div>

        <div class="bg-white rounded-xl p-4 border border-amber-200 shadow-sm flex items-center space-x-3">
          <div
            class="w-10 h-10 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center font-bold text-lg">
            <i class="fa-solid fa-bell"></i>
          </div>
          <div>
            <div id="stat-high-count" class="text-xl font-extrabold text-amber-600">2</div>
            <div class="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">High Attention</div>
          </div>
        </div>

        <div class="bg-white rounded-xl p-4 border border-teal-200 shadow-sm flex items-center space-x-3">
          <div
            class="w-10 h-10 rounded-lg bg-teal-100 text-[#00a896] flex items-center justify-center font-bold text-lg">
            <i class="fa-solid fa-user-clock"></i>
          </div>
          <div>
            <div id="stat-active-cases" class="text-xl font-extrabold text-[#00a896]">4</div>
            <div class="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Pending Today</div>
          </div>
        </div>

        <div class="bg-white rounded-xl p-4 border border-emerald-200 shadow-sm flex items-center space-x-3">
          <div
            class="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-lg">
            <i class="fa-solid fa-circle-check"></i>
          </div>
          <div>
            <div id="stat-resolved-count" class="text-xl font-extrabold text-emerald-600">18</div>
            <div class="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Handled / Safe</div>
          </div>
        </div>
      </div>

      <!-- Filters & Search Toolbar -->
      <div
        class="bg-white rounded-xl border border-slate-200 p-3 mb-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div class="flex items-center space-x-2 w-full sm:w-auto">
          <div class="relative flex-grow sm:w-72">
            <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 text-xs">
              <i class="fa-solid fa-magnifying-glass"></i>
            </span>
            <input id="coordinator-search-input" oninput="filterCoordinatorAlerts()" type="text"
              placeholder="Search senior name, alert cause, area..."
              class="w-full pl-8 pr-3 py-1.5 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-teal-500 focus:border-teal-500">
          </div>
          <select id="coordinator-priority-filter" onchange="filterCoordinatorAlerts()"
            class="border border-slate-300 rounded-lg text-xs py-1.5 px-2 bg-white text-slate-700">
            <option value="all">All Priorities</option>
            <option value="critical">🚨 Critical Only</option>
            <option value="high">⚠️ High Attention</option>
            <option value="moderate">🟡 Moderate Review</option>
          </select>
        </div>

        <div class="text-xs font-semibold text-slate-500 flex items-center space-x-2">
          <span>Ranking Algorithm:</span>
          <span class="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono">Biometric Delta + Inactivity +
            Sentiment</span>
        </div>
      </div>

      <!-- Ranked List of Seniors Container -->
      <div id="coordinator-alert-list" class="space-y-4">
        <!-- Rendered dynamically by app.js -->
      </div>
    </section>"""

new_coordinator_section = """    <!-- ========================================================================= -->
    <!-- 1. CARE COORDINATOR VIEW                                                  -->
    <!-- Features: Daily Priority Queue, Patient Dossier (Medical History, Checkups,-->
    <!-- Assessments, User Inputs), and Auto Emergency Contact Notifications      -->
    <!-- ========================================================================= -->
    <section id="view-coordinator" class="hidden flex-grow p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
      <!-- Top Title & Action Bar -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <div>
          <div class="flex items-center space-x-2">
            <span
              class="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
              Role: Care Coordinator
            </span>
            <span class="text-xs text-slate-500">Shift Zone: South Delhi & NCR Cluster • Sister Kavita, RN</span>
          </div>
          <h2 class="text-2xl font-extrabold text-[#0e294b] mt-1 font-sans">
            Care Coordinator Portal & Clinical Command Center
          </h2>
          <p class="text-xs sm:text-sm text-slate-500">
            Prioritised senior triage queue, patient medical history, checkup telemetry, senior inputs, and automated emergency family notifications.
          </p>
        </div>

        <!-- Quick Action Buttons -->
        <div class="flex flex-wrap items-center gap-2">
          <button onclick="openRaiseCriticalModal()"
            class="inline-flex items-center px-3.5 py-2 border border-rose-400 text-xs font-bold rounded-xl text-white bg-rose-600 hover:bg-rose-700 transition-all shadow-md shadow-rose-600/20">
            <i class="fa-solid fa-triangle-exclamation mr-1.5 animate-pulse"></i>
            <span>Raise Critical Alert</span>
          </button>
          <button onclick="simulateIncomingAlert()"
            class="inline-flex items-center px-3.5 py-2 border border-rose-300 text-xs font-bold rounded-xl text-rose-700 bg-rose-50 hover:bg-rose-100 transition-all shadow-sm">
            <i class="fa-solid fa-circle-exclamation mr-1.5 text-rose-500 animate-bounce"></i>
            <span>Simulate Emergency</span>
          </button>
          <button onclick="refreshCoordinatorQueue()"
            class="inline-flex items-center px-3 py-2 border border-slate-200 text-xs font-medium rounded-xl text-slate-700 bg-white hover:bg-slate-50 transition-all shadow-sm"
            title="Refresh List">
            <i class="fa-solid fa-arrows-rotate mr-1.5 text-slate-400"></i>
            <span>Sync</span>
          </button>
        </div>
      </div>

      <!-- CRITICAL EMERGENCY BROADCAST BANNER (Appears when a Critical case is active) -->
      <div id="coordinator-critical-emergency-banner" class="mb-6 rounded-2xl bg-gradient-to-r from-rose-600 via-rose-700 to-red-800 text-white p-4 sm:p-5 shadow-lg border border-rose-400 animate-pulse hidden">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div class="flex items-start sm:items-center space-x-3.5">
            <div class="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-2xl flex-shrink-0 text-white">
              <i class="fa-solid fa-circle-exclamation animate-bounce"></i>
            </div>
            <div>
              <div class="flex items-center space-x-2">
                <span class="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-white text-rose-800">
                  CRITICAL CASE ACTIVE
                </span>
                <span id="banner-critical-time" class="text-xs text-rose-100">Live Incident</span>
              </div>
              <h3 id="banner-critical-title" class="text-base sm:text-lg font-extrabold mt-0.5">
                Ramesh Sharma (@senior_ramesh) • Tachycardia & Inactivity
              </h3>
              <p id="banner-critical-desc" class="text-xs sm:text-sm text-rose-100 mt-0.5 line-clamp-1">
                Resting HR spiked to 114 bpm with zero motion for 4 hrs. Automated emergency SMS & WhatsApp sent to son Rahul.
              </p>
            </div>
          </div>
          <div class="flex flex-wrap items-center gap-2">
            <span class="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-400/20 text-emerald-100 border border-emerald-400/30">
              <i class="fa-solid fa-check-double mr-1.5 text-emerald-300"></i>
              Family Notified (SMS & WhatsApp)
            </span>
            <button onclick="openPatientDossier('PAT-101')"
              class="px-3 py-1.5 bg-white text-rose-800 hover:bg-rose-50 rounded-xl text-xs font-extrabold shadow-sm transition-all flex items-center space-x-1">
              <i class="fa-solid fa-folder-open"></i>
              <span>Open Patient Dossier</span>
            </button>
            <button onclick="openCallModal('ALT-1091', 'Rahul Sharma (Son)', '+91 98711-20931')"
              class="px-3 py-1.5 bg-rose-900/60 hover:bg-rose-900 text-white rounded-xl text-xs font-bold border border-rose-400/40 transition-all flex items-center space-x-1">
              <i class="fa-solid fa-phone"></i>
              <span>Call Contact</span>
            </button>
          </div>
        </div>
      </div>

      <!-- THREE MAIN TABS FOR CARE COORDINATOR -->
      <div class="flex items-center space-x-2 border-b border-slate-200 mb-6 pb-2 overflow-x-auto">
        <button id="coord-tab-btn-queue" onclick="switchCoordinatorTab('queue')"
          class="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center space-x-2 bg-teal-600 text-white shadow-sm">
          <i class="fa-solid fa-list-check"></i>
          <span>Priority Triage Queue</span>
          <span id="coord-badge-queue" class="px-2 py-0.5 rounded-full text-[10px] bg-white text-teal-800 font-extrabold">4</span>
        </button>

        <button id="coord-tab-btn-patients" onclick="switchCoordinatorTab('patients')"
          class="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all flex items-center space-x-2">
          <i class="fa-solid fa-hospital-user text-indigo-500"></i>
          <span>Patients & Health Records</span>
          <span id="coord-badge-patients" class="px-2 py-0.5 rounded-full text-[10px] bg-indigo-100 text-indigo-800 font-extrabold">5</span>
        </button>

        <button id="coord-tab-btn-notifications" onclick="switchCoordinatorTab('notifications')"
          class="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all flex items-center space-x-2">
          <i class="fa-solid fa-bell text-rose-500"></i>
          <span>Emergency Contact Dispatch Log</span>
          <span id="coord-badge-notifications" class="px-2 py-0.5 rounded-full text-[10px] bg-rose-100 text-rose-800 font-extrabold">2</span>
        </button>
      </div>

      <!-- ========================================================================= -->
      <!-- TAB 1: PRIORITY TRIAGE QUEUE                                              -->
      <!-- ========================================================================= -->
      <div id="coord-tab-content-queue">
        <!-- Quick Metrics Summary Bar -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
          <div class="bg-white rounded-xl p-4 border border-rose-200 shadow-sm flex items-center space-x-3">
            <div
              class="w-10 h-10 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center font-bold text-lg">
              <i class="fa-solid fa-triangle-exclamation"></i>
            </div>
            <div>
              <div id="stat-critical-count" class="text-xl font-extrabold text-rose-600">2</div>
              <div class="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Critical Priority</div>
            </div>
          </div>

          <div class="bg-white rounded-xl p-4 border border-amber-200 shadow-sm flex items-center space-x-3">
            <div
              class="w-10 h-10 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center font-bold text-lg">
              <i class="fa-solid fa-bell"></i>
            </div>
            <div>
              <div id="stat-high-count" class="text-xl font-extrabold text-amber-600">2</div>
              <div class="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">High Attention</div>
            </div>
          </div>

          <div class="bg-white rounded-xl p-4 border border-teal-200 shadow-sm flex items-center space-x-3">
            <div
              class="w-10 h-10 rounded-lg bg-teal-100 text-[#00a896] flex items-center justify-center font-bold text-lg">
              <i class="fa-solid fa-user-clock"></i>
            </div>
            <div>
              <div id="stat-active-cases" class="text-xl font-extrabold text-[#00a896]">4</div>
              <div class="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Pending Today</div>
            </div>
          </div>

          <div class="bg-white rounded-xl p-4 border border-emerald-200 shadow-sm flex items-center space-x-3">
            <div
              class="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-lg">
              <i class="fa-solid fa-circle-check"></i>
            </div>
            <div>
              <div id="stat-resolved-count" class="text-xl font-extrabold text-emerald-600">18</div>
              <div class="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Handled / Safe</div>
            </div>
          </div>
        </div>

        <!-- Filters & Search Toolbar -->
        <div
          class="bg-white rounded-xl border border-slate-200 p-3 mb-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
          <div class="flex items-center space-x-2 w-full sm:w-auto">
            <div class="relative flex-grow sm:w-72">
              <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 text-xs">
                <i class="fa-solid fa-magnifying-glass"></i>
              </span>
              <input id="coordinator-search-input" oninput="filterCoordinatorAlerts()" type="text"
                placeholder="Search senior username, name, cause, area..."
                class="w-full pl-8 pr-3 py-1.5 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-teal-500 focus:border-teal-500">
            </div>
            <select id="coordinator-priority-filter" onchange="filterCoordinatorAlerts()"
              class="border border-slate-300 rounded-lg text-xs py-1.5 px-2 bg-white text-slate-700">
              <option value="all">All Priorities</option>
              <option value="critical">🚨 Critical Only</option>
              <option value="high">⚠️ High Attention</option>
              <option value="moderate">🟡 Moderate Review</option>
            </select>
          </div>

          <div class="text-xs font-semibold text-slate-500 flex items-center space-x-2">
            <span>Triage Engine:</span>
            <span class="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono">Random Forest ML + Real-time Biometric Delta</span>
          </div>
        </div>

        <!-- Ranked List of Seniors Container -->
        <div id="coordinator-alert-list" class="space-y-4">
          <!-- Rendered dynamically by app.js -->
        </div>
      </div>

      <!-- ========================================================================= -->
      <!-- TAB 2: PATIENTS & HEALTH DOSSIER (मरीज़ डेटा, मेडिकल हिस्ट्री व इनपुट्स)   -->
      <!-- ========================================================================= -->
      <div id="coord-tab-content-patients" class="hidden">
        <!-- Patient Directory Controls -->
        <div class="bg-white rounded-2xl border border-slate-200 p-4 mb-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
          <div class="flex items-center space-x-2 w-full md:w-auto flex-grow max-w-lg">
            <div class="relative flex-grow">
              <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 text-xs">
                <i class="fa-solid fa-user-magnifying-glass"></i>
              </span>
              <input id="coord-patient-search" oninput="filterCoordinatorPatients()" type="text"
                placeholder="Search patient by @username, name, condition, or city..."
                class="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
            </div>
            <select id="coord-patient-status-filter" onchange="filterCoordinatorPatients()"
              class="border border-slate-300 rounded-xl text-xs py-2 px-3 bg-white text-slate-700">
              <option value="all">All Statuses</option>
              <option value="critical">🚨 Critical Cases</option>
              <option value="high">⚠️ High Attention</option>
              <option value="moderate">🟡 Moderate</option>
            </select>
          </div>

          <div class="flex items-center space-x-2 w-full md:w-auto justify-end">
            <button onclick="openRaiseCriticalModal()"
              class="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center space-x-1.5">
              <i class="fa-solid fa-bell"></i>
              <span>Raise Critical Alert for Patient</span>
            </button>
          </div>
        </div>

        <!-- Patient Cards Grid -->
        <div id="coordinator-patients-grid" class="grid grid-cols-1 md:grid-cols-2 gap-5">
          <!-- Rendered dynamically by app.js -->
        </div>
      </div>

      <!-- ========================================================================= -->
      <!-- TAB 3: EMERGENCY CONTACT NOTIFICATIONS LOG (आपातकालीन सूचना रिकॉर्ड)         -->
      <!-- ========================================================================= -->
      <div id="coord-tab-content-notifications" class="hidden">
        <div class="bg-white rounded-2xl border border-slate-200 p-5 mb-6 shadow-sm">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <h3 class="text-base font-extrabold text-[#0e294b] flex items-center space-x-2">
                <i class="fa-solid fa-paper-plane text-rose-500"></i>
                <span>Automated Emergency Contact Dispatch Audit Trail</span>
              </h3>
              <p class="text-xs text-slate-500 mt-0.5">
                Real-time multi-channel notifications (SMS, WhatsApp & App Push) transmitted to emergency family contacts upon critical events.
              </p>
            </div>
            <button onclick="openRaiseCriticalModal()"
              class="px-3.5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center space-x-1.5 flex-shrink-0">
              <i class="fa-solid fa-bullhorn"></i>
              <span>Dispatch Emergency Notice</span>
            </button>
          </div>

          <div id="coordinator-notifications-list" class="space-y-3.5 mt-4">
            <!-- Rendered dynamically by app.js -->
          </div>
        </div>
      </div>

    </section>"""

assert old_coordinator_section in html, "Could not find old coordinator section!"
html = html.replace(old_coordinator_section, new_coordinator_section, 1)

# 2. Add the Modals right before `<!-- Global Footer -->`
modals_html = """  <!-- ========================================================================= -->
  <!-- MODAL: Comprehensive Patient Clinical Dossier & Senior Inputs Viewer       -->
  <!-- Shows: Username, Medical History, Checkups, Assessments, Senior Inputs     -->
  <!-- ========================================================================= -->
  <div id="modal-patient-dossier" class="hidden fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-sm overflow-y-auto">
    <div class="bg-white rounded-3xl max-w-4xl w-full shadow-2xl border border-slate-200 my-auto overflow-hidden animate-scaleUp">
      
      <!-- Dossier Header -->
      <div class="bg-gradient-to-r from-slate-900 via-[#0e294b] to-slate-800 text-white p-5 sm:p-6">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div class="flex items-center space-x-4">
            <img id="dossier-avatar" src="https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&auto=format&fit=crop&q=80"
              alt="Patient Avatar" class="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-teal-400 shadow-md">
            <div>
              <div class="flex items-center space-x-2">
                <span id="dossier-username-badge" class="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-teal-500/30 text-teal-300 border border-teal-400/30">
                  @senior_ramesh
                </span>
                <span id="dossier-status-pill" class="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-600 text-white">
                  🚨 CRITICAL CASE
                </span>
              </div>
              <h3 id="dossier-patient-name" class="text-xl sm:text-2xl font-extrabold mt-1">Ramesh Sharma</h3>
              <p id="dossier-patient-sub" class="text-xs text-slate-300 mt-0.5">
                74 Yrs • Male • South Delhi (GK-1) • Assigned Nurse: Sister Kavita, RN
              </p>
            </div>
          </div>

          <div class="flex sm:flex-col items-center sm:items-end justify-between gap-2 border-t sm:border-t-0 pt-3 sm:pt-0 border-white/10">
            <button onclick="closePatientDossier()" class="text-slate-400 hover:text-white p-1 rounded-lg">
              <i class="fa-solid fa-xmark text-xl"></i>
            </button>
            <div class="text-right">
              <div class="text-[11px] text-slate-300 font-semibold">Triage Score</div>
              <div id="dossier-triage-score" class="text-xl font-extrabold text-rose-400">98 / 100</div>
            </div>
          </div>
        </div>

        <!-- Emergency Contact Strip in Header -->
        <div class="mt-4 pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div class="flex items-center space-x-2 text-slate-200">
            <i class="fa-solid fa-shield-heart text-rose-400"></i>
            <span>Emergency Contact:</span>
            <strong id="dossier-emergency-contact-text" class="text-white">Rahul Sharma (Son) • +91 98711-20931</strong>
          </div>
          <div class="flex items-center space-x-2">
            <button id="dossier-btn-call-contact" onclick="dossierCallEmergencyContact()"
              class="px-2.5 py-1 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-bold transition-all">
              <i class="fa-solid fa-phone mr-1"></i> Call Contact
            </button>
            <button id="dossier-btn-notify-contact" onclick="dossierSendNotificationToContact()"
              class="px-2.5 py-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-400/30 rounded-lg text-xs font-bold transition-all">
              <i class="fa-brands fa-whatsapp mr-1 text-emerald-400"></i> Send Alert
            </button>
          </div>
        </div>
      </div>

      <!-- Dossier Sub-Navigation Tabs -->
      <div class="bg-slate-50 border-b border-slate-200 px-6 flex items-center space-x-4 overflow-x-auto text-xs font-bold">
        <button id="dossier-subtab-btn-history" onclick="switchDossierSubtab('history')"
          class="py-3 border-b-2 border-teal-600 text-teal-800 transition-all flex items-center space-x-1.5">
          <i class="fa-solid fa-notes-medical"></i>
          <span>Medical History (मेडिकल हिस्ट्री)</span>
        </button>
        <button id="dossier-subtab-btn-checkups" onclick="switchDossierSubtab('checkups')"
          class="py-3 border-b-2 border-transparent text-slate-500 hover:text-slate-800 transition-all flex items-center space-x-1.5">
          <i class="fa-solid fa-stethoscope"></i>
          <span>Checkups & Vitals (चेकअप्स)</span>
        </button>
        <button id="dossier-subtab-btn-assessments" onclick="switchDossierSubtab('assessments')"
          class="py-3 border-b-2 border-transparent text-slate-500 hover:text-slate-800 transition-all flex items-center space-x-1.5">
          <i class="fa-solid fa-chart-line"></i>
          <span>Assessments (असेसमेंट)</span>
        </button>
        <button id="dossier-subtab-btn-inputs" onclick="switchDossierSubtab('inputs')"
          class="py-3 border-b-2 border-transparent text-slate-500 hover:text-slate-800 transition-all flex items-center space-x-1.5">
          <i class="fa-solid fa-comment-dots text-indigo-600"></i>
          <span>User's Given Input (यूजर का इनपुट)</span>
          <span class="px-1.5 py-0.2 rounded-full text-[10px] bg-indigo-100 text-indigo-800 font-extrabold">Live</span>
        </button>
      </div>

      <!-- Dossier Body Content Container -->
      <div class="p-5 sm:p-6 max-h-[60vh] overflow-y-auto">
        
        <!-- 1. MEDICAL HISTORY SUBTAB -->
        <div id="dossier-subcontent-history" class="space-y-5">
          <div>
            <h4 class="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Chronic Conditions (पुरानी बीमारियां)</h4>
            <div id="dossier-conditions-container" class="flex flex-wrap gap-2">
              <!-- Rendered dynamically -->
            </div>
          </div>

          <div>
            <h4 class="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Prescribed Active Medications (दवाइयों का विवरण)</h4>
            <div class="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
              <table class="w-full text-left text-xs">
                <thead class="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th class="py-2.5 px-3">Medication Name</th>
                    <th class="py-2.5 px-3">Dosage</th>
                    <th class="py-2.5 px-3">Schedule / Timing</th>
                    <th class="py-2.5 px-3">Purpose</th>
                    <th class="py-2.5 px-3 text-right">Adherence</th>
                  </tr>
                </thead>
                <tbody id="dossier-medications-table" class="divide-y divide-slate-100 text-slate-700">
                  <!-- Rendered dynamically -->
                </tbody>
              </table>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <h5 class="text-xs font-bold text-slate-700 mb-1 flex items-center space-x-1.5">
                <i class="fa-solid fa-triangle-exclamation text-amber-500"></i>
                <span>Known Allergies (एलर्जी)</span>
              </h5>
              <p id="dossier-allergies-text" class="text-xs text-slate-600">Sulfa antibiotics (causes skin rash)</p>
            </div>
            <div class="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <h5 class="text-xs font-bold text-slate-700 mb-1 flex items-center space-x-1.5">
                <i class="fa-solid fa-hospital text-indigo-500"></i>
                <span>Past Surgeries & Hospitalizations</span>
              </h5>
              <p id="dossier-surgeries-text" class="text-xs text-slate-600">Appendectomy (1998), Cataract Surgery (2021)</p>
            </div>
          </div>

          <div class="bg-teal-50/60 p-3.5 rounded-xl border border-teal-200 flex items-center justify-between text-xs">
            <div>
              <span class="font-bold text-teal-900">Attending Physician:</span>
              <span id="dossier-doctor-text" class="text-teal-800 ml-1">Dr. V.K. Kapoor (Fortis Escorts)</span>
            </div>
            <div>
              <span class="font-bold text-teal-900">Next Clinical Review:</span>
              <span id="dossier-review-text" class="text-teal-800 ml-1 font-mono font-bold">15 Nov 2026</span>
            </div>
          </div>
        </div>

        <!-- 2. CHECKUPS & VITALS SUBTAB -->
        <div id="dossier-subcontent-checkups" class="hidden space-y-5">
          <div>
            <h4 class="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Latest Biometric Checkup & Vitals Snapshot</h4>
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-3" id="dossier-latest-vitals-cards">
              <!-- Rendered dynamically -->
            </div>
          </div>

          <div>
            <h4 class="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Historical Checkup Timeline (हाल के चेकअप्स)</h4>
            <div id="dossier-checkup-timeline" class="space-y-3">
              <!-- Rendered dynamically -->
            </div>
          </div>
        </div>

        <!-- 3. ASSESSMENTS SUBTAB -->
        <div id="dossier-subcontent-assessments" class="hidden space-y-5">
          <!-- ADL Score Card -->
          <div class="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <h4 class="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center space-x-2">
              <i class="fa-solid fa-person-walking text-teal-600"></i>
              <span>Functional Independence (ADL Domains)</span>
            </h4>
            <div id="dossier-adl-grid" class="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <!-- Rendered dynamically -->
            </div>
          </div>

          <!-- Pain & Sleep -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <h4 class="text-xs font-bold text-rose-700 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
                <i class="fa-solid fa-heart-pulse"></i>
                <span>Pain Profile (दर्द का मूल्यांकन)</span>
              </h4>
              <div class="flex items-center space-x-3 my-2">
                <div id="dossier-pain-score-badge" class="w-12 h-12 rounded-xl bg-rose-100 text-rose-700 font-extrabold text-lg flex items-center justify-center">
                  4/10
                </div>
                <div>
                  <div id="dossier-pain-location" class="text-xs font-bold text-slate-800">Lower Back & Left Knee</div>
                  <div id="dossier-pain-sensation" class="text-[11px] text-slate-500">Dull ache (धीमा दर्द व जकड़न)</div>
                </div>
              </div>
            </div>

            <div class="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <h4 class="text-xs font-bold text-indigo-700 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
                <i class="fa-solid fa-moon"></i>
                <span>Sleep Monitoring (नींद)</span>
              </h4>
              <div class="flex items-center space-x-3 my-2">
                <div id="dossier-sleep-badge" class="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-700 font-extrabold text-lg flex items-center justify-center">
                  5.2h
                </div>
                <div>
                  <div id="dossier-sleep-quality" class="text-xs font-bold text-slate-800">Restless Sleep Pattern</div>
                  <div class="text-[11px] text-slate-500">2 nighttime awakenings detected</div>
                </div>
              </div>
            </div>
          </div>

          <!-- AI ML Risk Prediction Box -->
          <div class="bg-gradient-to-r from-teal-50 to-emerald-50 p-4 rounded-xl border border-teal-200">
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold text-teal-900 uppercase tracking-wider">AI Geriatric ML Risk Prediction</span>
              <span class="text-[10px] font-mono text-teal-700">ApnaSa 90,000 Records Model</span>
            </div>
            <div class="mt-2 flex items-center space-x-3">
              <div id="dossier-ai-risk-badge" class="px-3 py-1 rounded-lg text-xs font-extrabold bg-rose-600 text-white">
                HIGH RISK (84.2%)
              </div>
              <p id="dossier-ai-risk-reasons" class="text-xs text-slate-700 font-medium">
                Tachycardia spike (114 bpm) + Missed 08:00 AM check-in + 4hr immobility
              </p>
            </div>
          </div>
        </div>

        <!-- 4. USER'S GIVEN INPUT SUBTAB -->
        <div id="dossier-subcontent-inputs" class="hidden space-y-4">
          <div class="bg-indigo-50/70 p-4 rounded-2xl border border-indigo-200 mb-4">
            <h4 class="text-xs font-bold text-indigo-900 uppercase tracking-wider flex items-center space-x-2">
              <i class="fa-solid fa-microphone-lines text-indigo-600"></i>
              <span>Patient's Self-Reported Voice Notes & Check-in Messages</span>
            </h4>
            <p class="text-xs text-indigo-700 mt-0.5">
              Care coordinators can inspect verbatim Hindi & English voice note transcripts, one-tap responses, and missed-calls submitted directly by the senior.
            </p>
          </div>

          <div id="dossier-user-inputs-list" class="space-y-3.5">
            <!-- Rendered dynamically by app.js -->
          </div>
        </div>

      </div>

      <!-- Dossier Footer Action Bar -->
      <div class="bg-slate-100 p-4 sm:p-5 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
        <div class="flex flex-wrap items-center gap-2">
          <button id="dossier-btn-raise-alert" onclick="dossierRaiseCriticalAlert()"
            class="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-extrabold shadow-md transition-all flex items-center space-x-1.5">
            <i class="fa-solid fa-bell animate-pulse"></i>
            <span>Raise Critical Alert & Notify Family</span>
          </button>
          <button onclick="openCallModal('DOSSIER-CALL', currentDossierPatient.name, currentDossierPatient.phone)"
            class="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center space-x-1.5">
            <i class="fa-solid fa-phone"></i>
            <span>2-Way Call Senior</span>
          </button>
          <button onclick="openDispatchModal('DOSSIER-DISPATCH', currentDossierPatient.name)"
            class="px-4 py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5">
            <i class="fa-solid fa-person-walking-arrow-right"></i>
            <span>Dispatch Specialist</span>
          </button>
        </div>

        <button onclick="closePatientDossier()"
          class="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-xl">
          Close Dossier
        </button>
      </div>

    </div>
  </div>

  <!-- ========================================================================= -->
  <!-- MODAL: Raise Critical Alert & Notify Emergency Contacts Dialog            -->
  <!-- ========================================================================= -->
  <div id="modal-raise-critical" class="hidden fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm">
    <div class="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-rose-200 animate-scaleUp">
      <div class="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center text-lg">
            <i class="fa-solid fa-triangle-exclamation"></i>
          </div>
          <div>
            <h3 class="text-base font-extrabold text-[#0e294b]">Raise Critical Alert & Notify Family</h3>
            <p class="text-xs text-slate-500">Auto-elevates priority and dispatches multi-channel alerts</p>
          </div>
        </div>
        <button onclick="closeRaiseCriticalModal()" class="text-slate-400 hover:text-slate-600">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>

      <div class="space-y-4 text-xs">
        <div>
          <label class="block font-bold text-slate-700 mb-1">Select Patient / Senior</label>
          <select id="raise-critical-patient-select" onchange="onRaiseCriticalPatientChange()"
            class="w-full border border-slate-300 rounded-xl p-2.5 text-xs bg-white text-slate-800 font-medium">
            <!-- Populated dynamically -->
          </select>
        </div>

        <div>
          <label class="block font-bold text-slate-700 mb-1">Clinical Reason for Emergency Alert</label>
          <select id="raise-critical-predefined-reason" onchange="onPredefinedReasonChange()"
            class="w-full border border-slate-300 rounded-xl p-2 text-xs bg-slate-50 text-slate-700 mb-1.5">
            <option value="custom">-- Choose or Write Reason --</option>
            <option value="Spike in resting heart rate (>114 bpm) + Inactivity detected for 4 hours">Spike in resting HR (>114 bpm) + 4hr Inactivity</option>
            <option value="Bathroom impact sensor triggered + Senior reported sharp fall pain">Fall impact sensor triggered + Acute pain</option>
            <option value="Senior reported severe chest heaviness and dizziness via Hindi voice note">Chest heaviness & dizziness via voice note</option>
            <option value="Consecutive missed insulin doses + Blood glucose spiked to 228 mg/dL">Missed insulin + Blood glucose 228 mg/dL</option>
          </select>
          <textarea id="raise-critical-reason" rows="2"
            placeholder="Describe the clinical trigger, vitals anomaly, or sensor event..."
            class="w-full border border-slate-300 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-rose-500 text-slate-800"></textarea>
        </div>

        <!-- Emergency Contact Card Preview -->
        <div class="bg-rose-50/80 p-3.5 rounded-xl border border-rose-200">
          <div class="flex items-center justify-between mb-1.5">
            <span class="font-extrabold text-rose-900">Designated Emergency Contact:</span>
            <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-200 text-rose-900">Auto-Dispatched</span>
          </div>
          <div id="raise-critical-contact-info" class="text-xs text-rose-950 font-medium">
            <strong>Rahul Sharma (Son)</strong> • +91 98711-20931 (GK-1, New Delhi)
          </div>
          <div class="mt-2 pt-2 border-t border-rose-200/60 flex items-center space-x-3 text-[11px] text-rose-800">
            <label class="flex items-center space-x-1 cursor-pointer">
              <input type="checkbox" id="chk-send-sms" checked class="rounded border-rose-300 text-rose-600">
              <span>SMS Alert</span>
            </label>
            <label class="flex items-center space-x-1 cursor-pointer">
              <input type="checkbox" id="chk-send-whatsapp" checked class="rounded border-rose-300 text-rose-600">
              <span>WhatsApp Alert</span>
            </label>
            <label class="flex items-center space-x-1 cursor-pointer">
              <input type="checkbox" id="chk-send-push" checked class="rounded border-rose-300 text-rose-600">
              <span>Family App Push</span>
            </label>
          </div>
        </div>

        <!-- Notification Message Live Preview -->
        <div class="bg-slate-50 p-3 rounded-xl border border-slate-200">
          <div class="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            <i class="fa-brands fa-whatsapp text-emerald-600 mr-1"></i> SMS & WhatsApp Preview:
          </div>
          <p id="raise-critical-preview-text" class="text-[11px] font-mono text-slate-700 bg-white p-2 rounded-lg border border-slate-200 leading-relaxed">
            🚨 CareConnect CRITICAL ALERT: Emergency alert raised for Ramesh Sharma.
          </p>
        </div>
      </div>

      <div class="mt-6 flex items-center justify-end space-x-2">
        <button onclick="closeRaiseCriticalModal()"
          class="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl">
          Cancel
        </button>
        <button onclick="confirmRaiseCriticalAlert()"
          class="px-5 py-2.5 text-xs font-extrabold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-md transition-all flex items-center space-x-1.5">
          <i class="fa-solid fa-paper-plane"></i>
          <span>Raise Alert & Dispatch Notifications</span>
        </button>
      </div>
    </div>
  </div>

  <!-- ========================================================================= -->
  <!-- MODAL: Emergency Notification Dispatched Confirmation Receipt              -->
  <!-- ========================================================================= -->
  <div id="modal-notif-receipt" class="hidden fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm">
    <div class="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200 text-center animate-scaleUp">
      <div class="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center text-3xl mb-4">
        <i class="fa-solid fa-circle-check"></i>
      </div>
      <span class="px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200">
        🚨 Emergency Escalation Complete
      </span>
      <h3 class="text-lg font-extrabold text-[#0e294b] mt-2">Emergency Contacts Notified!</h3>
      <p id="receipt-contact-desc" class="text-xs text-slate-500 mt-1">
        SMS & WhatsApp dispatched to Rahul Sharma (+91 98711-20931).
      </p>

      <div class="my-4 p-3 bg-slate-50 rounded-xl border border-slate-200 text-left text-xs space-y-1 text-slate-700">
        <div class="flex items-center justify-between">
          <span>SMS Gateway:</span>
          <strong class="text-emerald-600 font-mono">DELIVERED (0s)</strong>
        </div>
        <div class="flex items-center justify-between">
          <span>WhatsApp Business API:</span>
          <strong class="text-emerald-600 font-mono">DELIVERED & READ</strong>
        </div>
        <div class="flex items-center justify-between">
          <span>Family Member Portal:</span>
          <strong class="text-rose-600 font-mono">CRITICAL BANNER FLASHING</strong>
        </div>
      </div>

      <button onclick="closeNotifReceiptModal()"
        class="w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-md transition-all">
        Back to Coordinator Dashboard
      </button>
    </div>
  </div>
"""

target_footer = "  <!-- Global Footer -->"
assert target_footer in html, "Could not find global footer in index.html"
html = html.replace(target_footer, modals_html + "\n" + target_footer, 1)

with open("index.html", "w", encoding="utf-8") as f:
    f.write(html)

print("index.html successfully updated with Coordinator Tabs, Patient Dossier, and Emergency Dispatch Modals!")

