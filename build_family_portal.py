# -*- coding: utf-8 -*-
"""
Build Family Portal:
1. Senior's Comprehensive Health Report (सीनियर की हेल्थ रिपोर्ट)
2. AI Analyze Summary (क्लिनिकल एनालिसिस व वेलबीइंग समरी)
3. Complete Assessment History (असेसमेंट हिस्ट्री - Vitals, ADL, Pain, Sleep, Voice Notes)
"""

import json
from patient_data_seed import PATIENTS_DATA

patients_json = json.dumps(PATIENTS_DATA, ensure_ascii=False)

# ==============================================================================
# 1. NEW HTML FOR VIEW-FAMILY
# ==============================================================================
new_family_html = """    <!-- ========================================================================= -->
    <!-- 3. FAMILY MEMBER PORTAL (परिवार का वेलबीइंग व हेल्थ मॉनिटर)               -->
    <!-- Features: Senior Health Report, AI Analyze Summary, Assessment History     -->
    <!-- ========================================================================= -->
    <section id="view-family" class="hidden flex-grow p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto w-full">
      <!-- Top Context Banner & Senior Switcher -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white p-5 sm:p-6 rounded-3xl shadow-xl border border-purple-700/50">
        <div class="flex items-center space-x-4">
          <img id="family-senior-avatar" src="https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&auto=format&fit=crop&q=80"
            alt="Senior Photo" class="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-purple-300 shadow-md flex-shrink-0">
          <div>
            <div class="flex flex-wrap items-center gap-2">
              <span class="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-purple-500/30 text-purple-200 border border-purple-400/40">
                Role: Family Member
              </span>
              <span id="family-senior-tier-badge" class="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-rose-500/30 text-rose-300 border border-rose-400/40 flex items-center space-x-1">
                <i class="fa-solid fa-triangle-exclamation mr-1"></i>
                <span>🚨 Critical Risk Tier (Score 80/100)</span>
              </span>
            </div>
            <h2 id="family-senior-name-heading" class="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              Ramesh Sharma (Father, 74y)
            </h2>
            <p id="family-senior-meta-sub" class="text-xs text-purple-200 font-medium">
              @senior_ramesh • South Delhi (Greater Kailash, C-42) • Primary Nurse: Sister Kavita, RN
            </p>
          </div>
        </div>

        <!-- Right Side: Senior Selector Dropdown & Quick Actions -->
        <div class="flex flex-col sm:flex-row items-start sm:items-center gap-2.5">
          <div class="bg-white/10 backdrop-blur-md rounded-2xl p-2 border border-purple-300/30">
            <label class="block text-[10px] font-bold text-purple-200 uppercase tracking-wider mb-1">
              <i class="fa-solid fa-user-group mr-1"></i> Switch Linked Senior:
            </label>
            <select id="family-senior-selector" onchange="changeFamilyLinkedSenior(this.value)"
              class="bg-slate-900 text-white text-xs font-bold rounded-xl px-3 py-1.5 border border-purple-400/50 focus:ring-2 focus:ring-purple-400">
              <option value="PAT-101">Ramesh Sharma (Father • @senior_ramesh)</option>
              <option value="PAT-102">Savitri Devi (Mother • @senior_savitri)</option>
              <option value="PAT-103">Anand Verma (Uncle • @senior_anand)</option>
              <option value="PAT-104">Meena Iyer (Aunt • @senior_meena)</option>
              <option value="PAT-105">Harish Patel (Grandfather • @senior_harish)</option>
            </select>
          </div>

          <div class="flex items-center space-x-2">
            <button onclick="printSeniorReport()"
              class="px-3.5 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold border border-white/20 transition-all flex items-center space-x-1.5 shadow-sm"
              title="Print Clinical Summary">
              <i class="fa-solid fa-print"></i>
              <span class="hidden sm:inline">Print Report</span>
            </button>
            <button onclick="simulateFamilyCallDad()"
              class="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md transition-all flex items-center space-x-1.5">
              <i class="fa-solid fa-phone"></i>
              <span>Call Senior</span>
            </button>
          </div>
        </div>
      </div>

      <!-- CRITICAL / SERIOUS ALERT CARD (Shown ONLY when an alert is active) -->
      <div id="family-serious-alert-card"
        class="bg-gradient-to-r from-rose-600 via-rose-700 to-red-800 text-white rounded-3xl p-5 sm:p-6 shadow-xl shadow-rose-600/25 mb-6 border-2 border-rose-400 relative overflow-hidden transition-all duration-300">
        <div class="absolute -right-10 -bottom-10 w-44 h-44 bg-white/10 rounded-full blur-xl pointer-events-none"></div>

        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div class="flex items-start space-x-4">
            <div
              class="w-12 h-12 rounded-2xl bg-white/20 text-white flex items-center justify-center text-2xl flex-shrink-0 animate-pulse">
              <i class="fa-solid fa-triangle-exclamation"></i>
            </div>
            <div>
              <div
                class="inline-flex items-center space-x-2 bg-rose-950/60 px-2.5 py-0.5 rounded-md text-xs font-black uppercase tracking-wider text-rose-200 mb-1">
                <span>🚨 Immediate Critical Alert Dispatched</span>
                <span>•</span>
                <span id="family-alert-time">Today, 08:30 AM</span>
              </div>
              <h3 id="family-alert-title" class="text-lg sm:text-xl font-bold">
                Ramesh Sharma: Resting HR Spiked to 114 bpm & BP 158/96 mmHg
              </h3>
              <p id="family-alert-desc" class="text-xs sm:text-sm text-rose-100 mt-1 max-w-3xl leading-relaxed">
                Suggested clinical response initiated: Care Coordinator Sister Kavita placed a 2-way call and Field Nurse has been dispatched to Greater Kailash. Automated SMS & WhatsApp notification delivered to Rahul Sharma (Son).
              </p>
            </div>
          </div>

          <!-- Quick Action Buttons for Family -->
          <div class="flex flex-wrap sm:flex-nowrap items-center gap-2 pt-2 md:pt-0">
            <button onclick="simulateFamilyCallDad()"
              class="px-4 py-2.5 rounded-xl bg-white text-rose-700 hover:bg-rose-50 text-xs font-bold shadow-md transition-all flex items-center space-x-1.5">
              <i class="fa-solid fa-phone"></i>
              <span>Direct Dial</span>
            </button>
            <button onclick="simulateFamilyCallCoordinator()"
              class="px-4 py-2.5 rounded-xl bg-rose-950/70 hover:bg-rose-950 text-white border border-rose-400 text-xs font-bold transition-all flex items-center space-x-1.5">
              <i class="fa-solid fa-user-nurse"></i>
              <span>Talk to Nurse</span>
            </button>
            <button onclick="dismissFamilyAlert()"
              class="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs transition-colors"
              title="Acknowledge & Dismiss">
              <i class="fa-solid fa-check"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- NORMAL SAFE STATUS BANNER (Shown when senior vitals are peaceful) -->
      <div id="family-calm-status-banner"
        class="hidden bg-emerald-50 border-2 border-emerald-200 rounded-3xl p-5 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm">
        <div class="flex items-center space-x-3.5">
          <div class="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center text-lg flex-shrink-0">
            <i class="fa-solid fa-circle-check"></i>
          </div>
          <div>
            <div class="text-xs font-bold uppercase tracking-wider text-emerald-800">Status: Safe Baseline & Normal Vitals</div>
            <div id="family-calm-status-text" class="text-sm font-semibold text-slate-800">
              No serious issues detected. Senior checked in on schedule and physiological parameters are normal.
            </div>
          </div>
        </div>
        <button onclick="simulateSeriousEmergencyForFamily()"
          class="text-xs font-bold text-rose-600 hover:text-rose-800 underline flex-shrink-0">
          Simulate Critical Alert Mode
        </button>
      </div>

      <!-- ========================================================================= -->
      <!-- THREE MAIN TABS: 1. Analyze Summary | 2. Health Report | 3. Assessment History -->
      <!-- ========================================================================= -->
      <div class="flex items-center space-x-2 border-b border-slate-200 mb-6 pb-2 overflow-x-auto">
        <button id="family-tab-btn-summary" onclick="switchFamilyTab('summary')"
          class="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center space-x-2 bg-purple-700 text-white shadow-sm">
          <i class="fa-solid fa-chart-pie"></i>
          <span>1. Analyze Summary (एनालिसिस समरी)</span>
        </button>

        <button id="family-tab-btn-report" onclick="switchFamilyTab('report')"
          class="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all flex items-center space-x-2">
          <i class="fa-solid fa-file-waveform text-teal-600"></i>
          <span>2. Senior Health Report (हेल्थ रिपोर्ट)</span>
        </button>

        <button id="family-tab-btn-history" onclick="switchFamilyTab('history')"
          class="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all flex items-center space-x-2">
          <i class="fa-solid fa-clock-rotate-left text-indigo-600"></i>
          <span>3. Assessment History (असेसमेंट हिस्ट्री)</span>
          <span id="family-badge-history-count" class="px-2 py-0.5 rounded-full text-[10px] bg-indigo-100 text-indigo-800 font-extrabold">4</span>
        </button>
      </div>

      <!-- ========================================================================= -->
      <!-- TAB 1: ANALYZE SUMMARY (क्लिनिकल एनालिसिस व वेलबीइंग समरी)               -->
      <!-- ========================================================================= -->
      <div id="family-tab-content-summary">
        <div class="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm mb-6">
          
          <!-- Summary Top Title with Health Index Score -->
          <div class="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 gap-4">
            <div>
              <div class="flex items-center space-x-2">
                <span class="text-xs font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
                  AI Clinical Digest
                </span>
                <span class="text-xs text-slate-400">Past 7 Days Wellbeing Analysis</span>
              </div>
              <h3 class="text-xl font-extrabold text-[#0e294b] mt-1">Short Weekly Wellbeing Summary</h3>
              <p class="text-xs sm:text-sm text-slate-500">
                Concise overview of your senior's vital signs, mood, medication adherence, and sleep trajectory.
              </p>
            </div>

            <!-- Health Score Badge -->
            <div class="bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 flex items-center space-x-3">
              <div id="family-health-score-circle"
                class="w-12 h-12 rounded-full border-4 border-emerald-500 flex items-center justify-center font-extrabold text-slate-900 text-lg">
                88
              </div>
              <div>
                <div class="text-[11px] font-bold text-slate-400 uppercase">Overall Health Score</div>
                <div id="family-health-score-label" class="text-xs font-bold text-emerald-700">Healthy & Stable (+3%)</div>
              </div>
            </div>
          </div>

          <!-- AI Model Clinical Risk Explanation Banner -->
          <div id="family-ai-analysis-banner" class="my-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start space-x-3.5">
            <div class="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center text-lg flex-shrink-0">
              <i class="fa-solid fa-brain"></i>
            </div>
            <div>
              <h4 class="text-xs sm:text-sm font-extrabold text-amber-950">
                AI Clinical Model Analysis: Key Risk Drivers & Observations
              </h4>
              <p id="family-ai-analysis-text" class="text-xs text-amber-900 mt-1 leading-relaxed">
                Elevated blood pressure (158/96 mmHg) detected alongside resting heart rate spike (114 bpm). Oxygen saturation is at 94.0%. Functional mobility requires grab bar / cane assistance. Sister Kavita has adjusted monitoring protocol.
              </p>
            </div>
          </div>

          <!-- 7-Day Quick Day-by-Day Consistency Strip -->
          <div class="my-6">
            <div class="text-xs font-bold text-slate-700 mb-2 flex items-center justify-between">
              <span>7-Day Daily Check-in Consistency:</span>
              <span class="text-emerald-700 font-bold">100% (7/7 days verified)</span>
            </div>
            <div class="grid grid-cols-7 gap-2 text-center">
              <div class="bg-emerald-50 border border-emerald-200 rounded-xl p-2.5">
                <div class="text-[10px] font-bold text-slate-500 uppercase">Thu</div>
                <div class="text-emerald-600 text-sm mt-1"><i class="fa-solid fa-circle-check"></i></div>
                <div class="text-[10px] font-semibold text-slate-700 mt-1">Great</div>
              </div>
              <div class="bg-emerald-50 border border-emerald-200 rounded-xl p-2.5">
                <div class="text-[10px] font-bold text-slate-500 uppercase">Fri</div>
                <div class="text-emerald-600 text-sm mt-1"><i class="fa-solid fa-circle-check"></i></div>
                <div class="text-[10px] font-semibold text-slate-700 mt-1">Great</div>
              </div>
              <div class="bg-emerald-50 border border-emerald-200 rounded-xl p-2.5">
                <div class="text-[10px] font-bold text-slate-500 uppercase">Sat</div>
                <div class="text-emerald-600 text-sm mt-1"><i class="fa-solid fa-circle-check"></i></div>
                <div class="text-[10px] font-semibold text-slate-700 mt-1">Great</div>
              </div>
              <div class="bg-amber-50 border border-amber-200 rounded-xl p-2.5">
                <div class="text-[10px] font-bold text-slate-500 uppercase">Sun</div>
                <div class="text-amber-600 text-sm mt-1"><i class="fa-solid fa-triangle-exclamation"></i></div>
                <div class="text-[10px] font-semibold text-slate-700 mt-1">Tired</div>
              </div>
              <div class="bg-emerald-50 border border-emerald-200 rounded-xl p-2.5">
                <div class="text-[10px] font-bold text-slate-500 uppercase">Mon</div>
                <div class="text-emerald-600 text-sm mt-1"><i class="fa-solid fa-circle-check"></i></div>
                <div class="text-[10px] font-semibold text-slate-700 mt-1">Great</div>
              </div>
              <div class="bg-emerald-50 border border-emerald-200 rounded-xl p-2.5">
                <div class="text-[10px] font-bold text-slate-500 uppercase">Tue</div>
                <div class="text-emerald-600 text-sm mt-1"><i class="fa-solid fa-circle-check"></i></div>
                <div class="text-[10px] font-semibold text-slate-700 mt-1">Great</div>
              </div>
              <div class="bg-purple-50 border border-purple-300 rounded-xl p-2.5 ring-2 ring-purple-500/30">
                <div class="text-[10px] font-bold text-purple-800 uppercase">Today</div>
                <div class="text-purple-600 text-sm mt-1"><i class="fa-solid fa-heart-pulse"></i></div>
                <div class="text-[10px] font-bold text-purple-800 mt-1">Active</div>
              </div>
            </div>
          </div>

          <!-- 4 Core Wellness Pillar Cards -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div class="bg-slate-50 rounded-2xl p-4 border border-slate-200">
              <div class="text-xs font-bold text-slate-500 mb-1 flex items-center">
                <i class="fa-solid fa-pills text-blue-500 mr-1.5"></i> Medication Adherence
              </div>
              <div id="family-stat-meds" class="text-xl font-extrabold text-slate-900">93%</div>
              <p id="family-stat-meds-sub" class="text-[11px] text-slate-500 mt-0.5">Missed 1 morning dose on Sunday; refilled on Monday.</p>
            </div>

            <div class="bg-slate-50 rounded-2xl p-4 border border-slate-200">
              <div class="text-xs font-bold text-slate-500 mb-1 flex items-center">
                <i class="fa-solid fa-bed text-purple-500 mr-1.5"></i> Sleep Rest Cycle
              </div>
              <div id="family-stat-sleep" class="text-xl font-extrabold text-slate-900">5.2 hrs/night</div>
              <p id="family-stat-sleep-sub" class="text-[11px] text-slate-500 mt-0.5">Restless sleep cycle; 2 nighttime awakenings noted.</p>
            </div>

            <div class="bg-slate-50 rounded-2xl p-4 border border-slate-200">
              <div class="text-xs font-bold text-slate-500 mb-1 flex items-center">
                <i class="fa-solid fa-face-smile text-amber-500 mr-1.5"></i> Mood & Voice Sentiment
              </div>
              <div id="family-stat-mood" class="text-xl font-extrabold text-slate-900">86% Positive</div>
              <p id="family-stat-mood-sub" class="text-[11px] text-slate-500 mt-0.5">Voice transcript reported dizziness & chest heaviness.</p>
            </div>

            <div class="bg-slate-50 rounded-2xl p-4 border border-slate-200">
              <div class="text-xs font-bold text-slate-500 mb-1 flex items-center">
                <i class="fa-solid fa-heart-pulse text-rose-500 mr-1.5"></i> Resting Heart Rate
              </div>
              <div id="family-stat-hr" class="text-xl font-extrabold text-slate-900">114 bpm (Spike)</div>
              <p id="family-stat-hr-sub" class="text-[11px] text-slate-500 mt-0.5">7-day baseline: 72 bpm. Monitored for arrhythmia.</p>
            </div>
          </div>

          <!-- Weekly Mood & Blood Pressure Trend Chart -->
          <div class="bg-slate-50 rounded-2xl p-4 border border-slate-200 mb-6">
            <div class="flex items-center justify-between mb-3">
              <span class="text-xs font-bold text-slate-700">7-Day Vitals & Sentiment Trajectory</span>
              <span class="text-[11px] text-slate-400">Systolic Blood Pressure (mmHg) vs Mood Rating (1-5)</span>
            </div>
            <div class="h-48 w-full">
              <canvas id="familyVitalsChart"></canvas>
            </div>
          </div>

          <!-- Coordinator's Personal Weekly Note -->
          <div class="bg-teal-50/70 border border-teal-200 rounded-2xl p-4 flex items-start space-x-3.5">
            <div
              class="w-10 h-10 rounded-full bg-[#00a896] text-white flex items-center justify-center flex-shrink-0 font-bold text-sm">
              NK
            </div>
            <div>
              <div class="flex items-center space-x-2">
                <span class="text-xs font-bold text-teal-900">Weekly Clinical Care Note from Sister Kavita, RN</span>
                <span class="text-[10px] text-slate-500">Today, 08:45 AM</span>
              </div>
              <p id="family-coordinator-note-text" class="text-xs text-slate-700 mt-1 leading-relaxed">
                "Ramesh ji has been in wonderful spirits this week, but this morning his resting heart rate spiked to 114 bpm with elevated BP (158/96). We immediately called him, advised resting on the recliner, and dispatched field assistance. You don't need to panic — our medical team is actively managing his care!"
              </p>
            </div>
          </div>

        </div>

        <!-- Quick Message / Loving Note to Senior -->
        <div
          class="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 class="text-sm font-bold text-[#0e294b]">Send a loving message to your Senior</h4>
            <p class="text-xs text-slate-500">Will be read aloud to them on their companion view in Hindi/English.</p>
          </div>
          <div class="flex items-center space-x-2 w-full sm:w-auto">
            <input id="family-message-input" type="text" placeholder="e.g. Papa, take rest, we are coming this evening!"
              class="text-xs border border-slate-300 rounded-xl px-3 py-2 w-full sm:w-72 focus:ring-2 focus:ring-purple-500">
            <button onclick="sendFamilyMessageToDad()"
              class="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition-all flex-shrink-0">
              Send
            </button>
          </div>
        </div>
      </div>

      <!-- ========================================================================= -->
      <!-- TAB 2: SENIOR HEALTH REPORT (सीनियर की हेल्थ रिपोर्ट)                    -->
      <!-- ========================================================================= -->
      <div id="family-tab-content-report" class="hidden">
        <div class="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm mb-6 space-y-6">
          
          <!-- Report Header -->
          <div class="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-3">
            <div>
              <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-100 text-teal-800 uppercase tracking-wider">
                Official Clinical Health Dossier
              </span>
              <h3 id="report-senior-name-title" class="text-xl font-extrabold text-[#0e294b] mt-1">
                Medical & Vitals Report: Ramesh Sharma
              </h3>
              <p class="text-xs text-slate-500">
                Verified telemetry from Home IoT hub, doctor consultations, and nurse checkups.
              </p>
            </div>
            <button onclick="printSeniorReport()"
              class="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 self-start sm:self-center">
              <i class="fa-solid fa-file-pdf"></i>
              <span>Download / Print for Doctor</span>
            </button>
          </div>

          <!-- Section 1: Demographics & Emergency Contacts -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="bg-slate-50 rounded-2xl p-4 border border-slate-200">
              <div class="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Patient Demographics</div>
              <div class="space-y-1 text-xs">
                <div><span class="text-slate-500">Full Name:</span> <strong id="report-patient-name" class="text-slate-800">Ramesh Sharma</strong></div>
                <div><span class="text-slate-500">Username:</span> <code id="report-patient-username" class="text-purple-700 bg-purple-50 px-1 rounded">@senior_ramesh</code></div>
                <div><span class="text-slate-500">Age / Gender:</span> <span id="report-patient-age-gender" class="text-slate-800">74 Yrs • Male</span></div>
                <div><span class="text-slate-500">Blood Group:</span> <strong id="report-patient-blood-group" class="text-rose-600 font-extrabold">B +ve</strong></div>
              </div>
            </div>

            <div class="bg-slate-50 rounded-2xl p-4 border border-slate-200">
              <div class="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Medical Supervision</div>
              <div class="space-y-1 text-xs">
                <div><span class="text-slate-500">Consultant:</span> <strong id="report-patient-doctor" class="text-slate-800">Dr. V.K. Kapoor (Fortis)</strong></div>
                <div><span class="text-slate-500">Next Review:</span> <span id="report-patient-review-date" class="text-slate-800">15 Nov 2026</span></div>
                <div><span class="text-slate-500">Assigned Nurse:</span> <span id="report-patient-nurse" class="text-slate-800">Sister Kavita, RN</span></div>
                <div><span class="text-slate-500">Location:</span> <span id="report-patient-location" class="text-slate-800">Greater Kailash, Delhi</span></div>
              </div>
            </div>

            <div class="bg-slate-50 rounded-2xl p-4 border border-slate-200">
              <div class="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Designated Emergency Contact</div>
              <div class="space-y-1 text-xs">
                <div><span class="text-slate-500">Contact:</span> <strong id="report-emergency-name" class="text-purple-800">Rahul Sharma (Son)</strong></div>
                <div><span class="text-slate-500">Phone:</span> <strong id="report-emergency-phone" class="text-slate-800 font-mono">+91 98711-20931</strong></div>
                <div><span class="text-slate-500">Alt Phone:</span> <span id="report-emergency-alt" class="text-slate-700">+91 98110-55441</span></div>
                <div><span class="text-slate-500">Channels:</span> <span class="text-emerald-700 font-bold">SMS, WhatsApp, Push</span></div>
              </div>
            </div>
          </div>

          <!-- Section 2: Current Vitals Telemetry Snapshot -->
          <div>
            <h4 class="text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-3 flex items-center">
              <i class="fa-solid fa-heart-pulse text-rose-500 mr-2"></i> Current Physiological Vitals
            </h4>
            <div id="report-vitals-grid" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              <!-- Dynamically populated vitals cards -->
            </div>
          </div>

          <!-- Section 3: Diagnosed Chronic Conditions & Allergies -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="bg-slate-50 rounded-2xl p-4 border border-slate-200">
              <h4 class="text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-2 flex items-center">
                <i class="fa-solid fa-notes-medical text-teal-600 mr-2"></i> Chronic Medical Conditions
              </h4>
              <ul id="report-chronic-list" class="space-y-1.5 text-xs text-slate-700">
                <!-- Dynamically populated chronic list -->
              </ul>
            </div>

            <div class="bg-slate-50 rounded-2xl p-4 border border-slate-200">
              <h4 class="text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-2 flex items-center">
                <i class="fa-solid fa-hand-dots text-rose-500 mr-2"></i> Known Allergies & Surgical Notes
              </h4>
              <div class="space-y-2 text-xs">
                <div>
                  <span class="font-bold text-slate-600">Allergies:</span>
                  <span id="report-allergies-text" class="text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">Sulfa antibiotics</span>
                </div>
                <div>
                  <span class="font-bold text-slate-600">Previous Surgeries:</span>
                  <span id="report-surgeries-text" class="text-slate-700">Appendectomy (1998), Right Eye Cataract (2021)</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Section 4: Prescribed Medications & Adherence Schedule -->
          <div>
            <h4 class="text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-3 flex items-center justify-between">
              <span class="flex items-center">
                <i class="fa-solid fa-pills text-blue-600 mr-2"></i> Prescribed Medications & Adherence
              </span>
              <span class="text-[11px] text-slate-500 font-normal">Active Regimen Verified by Clinical Pharmacist</span>
            </h4>
            <div class="overflow-x-auto rounded-2xl border border-slate-200">
              <table class="w-full text-left text-xs text-slate-700">
                <thead class="bg-slate-50 text-[10px] uppercase font-bold text-slate-500 border-b border-slate-200">
                  <tr>
                    <th class="p-3">Medication</th>
                    <th class="p-3">Dosage</th>
                    <th class="p-3">Schedule</th>
                    <th class="p-3">Purpose</th>
                    <th class="p-3 text-right">Adherence</th>
                  </tr>
                </thead>
                <tbody id="report-medications-table" class="divide-y divide-slate-100">
                  <!-- Dynamically populated medications -->
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>

      <!-- ========================================================================= -->
      <!-- TAB 3: ASSESSMENT HISTORY (असेसमेंट व चेकअप हिस्ट्री)                      -->
      <!-- ========================================================================= -->
      <div id="family-tab-content-history" class="hidden">
        <div class="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm mb-6">
          
          <!-- History Header & Category Filter Pills -->
          <div class="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-slate-100 gap-4">
            <div>
              <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-800 uppercase tracking-wider">
                Audit Timeline
              </span>
              <h3 class="text-xl font-extrabold text-[#0e294b] mt-1">
                Senior Assessment History & Voice Transcripts
              </h3>
              <p class="text-xs text-slate-500">
                Chronological timeline of daily vitals checkups, functional ADL independence tests, pain, sleep, and senior voice notes.
              </p>
            </div>

            <!-- Filter Pills for History -->
            <div class="flex flex-wrap items-center gap-1.5">
              <button onclick="filterFamilyAssessments('all')" id="family-filter-btn-all"
                class="px-3 py-1.5 rounded-xl text-xs font-extrabold bg-indigo-700 text-white shadow-sm transition-all">
                All Records
              </button>
              <button onclick="filterFamilyAssessments('vitals')" id="family-filter-btn-vitals"
                class="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-all">
                Vitals Checkups
              </button>
              <button onclick="filterFamilyAssessments('adl')" id="family-filter-btn-adl"
                class="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-all">
                ADL Mobility
              </button>
              <button onclick="filterFamilyAssessments('pain_sleep')" id="family-filter-btn-pain_sleep"
                class="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-all">
                Pain & Sleep
              </button>
              <button onclick="filterFamilyAssessments('voice')" id="family-filter-btn-voice"
                class="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-all">
                Voice Notes
              </button>
            </div>
          </div>

          <!-- Chronological Assessment Cards Timeline Container -->
          <div id="family-assessment-timeline-list" class="mt-6 space-y-4">
            <!-- Dynamically populated assessment timeline cards -->
          </div>

        </div>
      </div>

    </section>
"""

# ==============================================================================
# 2. UPDATE index.html
# ==============================================================================
with open("index.html", "r", encoding="utf-8") as f:
    html = f.read()

# Locate section view-family
f_start = html.find('<section id="view-family"')
assert f_start != -1, "Could not find view-family in index.html"
f_end = html.find('</section>', f_start) + 10

html = html[:f_start] + new_family_html + html[f_end:]

with open("index.html", "w", encoding="utf-8") as f:
    f.write(html)

print("index.html updated with Family Portal (Summary, Health Report, Assessment History)!")

# ==============================================================================
# 3. JAVASCRIPT LOGIC FOR FAMILY PORTAL IN app.js
# ==============================================================================
family_js = f"""// =========================================================================
// VIEW 3: FAMILY MEMBER LOGIC (परिवार का वेलबीइंग व हेल्थ मॉनिटर)
// Features: 
// 1. AI Analyze Summary & Wellbeing Metrics
// 2. Comprehensive Senior Health Report (Demographics, Vitals, History, Meds)
// 3. Complete Assessment History (Chronological Timeline, ADL, Pain, Voice Notes)
// =========================================================================

let familySelectedSeniorId = 'PAT-101'; // Default: Ramesh Sharma
let currentFamilyTab = 'summary'; // 'summary' | 'report' | 'history'
let currentFamilyHistoryFilter = 'all';

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
  const p = (state.patients || []).find(pt => pt.id === seniorId) || state.patients[0];
  if (!p) return;

  // Update top banner details
  const avatar = document.getElementById('family-senior-avatar');
  const nameHeading = document.getElementById('family-senior-name-heading');
  const metaSub = document.getElementById('family-senior-meta-sub');
  const tierBadge = document.getElementById('family-senior-tier-badge');

  if (avatar) avatar.src = p.avatar || "https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&auto=format&fit=crop&q=80";
  if (nameHeading) nameHeading.textContent = `${{p.name}} (${{p.emergencyContact ? p.emergencyContact.relation.split(' ')[0] : 'Senior'}}, ${{p.age}}y)`;
  if (metaSub) metaSub.textContent = `@${{p.username}} • ${{p.location}} • Primary Nurse: ${{p.assignedNurse || 'Sister Kavita, RN'}}`;

  // Tier Badge
  if (tierBadge) {
    if (p.predictedTier === 'CRITICAL') {
      tierBadge.className = "px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-rose-500/30 text-rose-300 border border-rose-400/40 flex items-center space-x-1";
      tierBadge.innerHTML = `<i class="fa-solid fa-triangle-exclamation mr-1"></i><span>${{p.tierLabel || '🚨 Critical Risk Tier'}}</span>`;
      state.seniorStatus.isSerious = true;
    } else if (p.predictedTier === 'NORMAL') {
      tierBadge.className = "px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-emerald-500/30 text-emerald-300 border border-emerald-400/40 flex items-center space-x-1";
      tierBadge.innerHTML = `<i class="fa-solid fa-circle-check mr-1"></i><span>${{p.tierLabel || '🟢 Normal Stable Baseline'}}</span>`;
      state.seniorStatus.isSerious = false;
    } else {
      tierBadge.className = "px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-amber-500/30 text-amber-300 border border-amber-400/40 flex items-center space-x-1";
      tierBadge.innerHTML = `<i class="fa-solid fa-clock mr-1"></i><span>${{p.tierLabel || '🟡 Moderate Monitoring'}}</span>`;
      state.seniorStatus.isSerious = false;
    }
  }

  updateFamilyAlertBanner();
  renderFamilyAnalyzeSummary(p);
  renderFamilySeniorReport(seniorId);
  renderFamilyAssessmentHistory(currentFamilyHistoryFilter);

  showToast(`Switched Family View to ${{p.name}}`, 'info');
}

// 3. Render Tab 1: AI Analyze Summary
function renderFamilyAnalyzeSummary(patient) {
  const p = patient || (state.patients || []).find(pt => pt.id === familySelectedSeniorId) || state.patients[0];
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

  if (alertTitle) alertTitle.textContent = `${{p.name}}: ${{p.predictedTier === 'CRITICAL' ? 'Critical Vitals Alert & Attention Required' : 'Status Under Routine Observation'}}`;
  if (alertDesc) alertDesc.textContent = p.suggestedAction || 'Automated health telemetry monitored by Care Coordinator Sister Kavita.';
  if (alertTime) alertTime.textContent = p.checkups && p.checkups[0] ? p.checkups[0].date : 'Today, Live';

  // Update Calm text
  const calmText = document.getElementById('family-calm-status-text');
  if (calmText) {
    calmText.textContent = `No critical issues detected for ${{p.name}}. Checked in on schedule and physiological parameters are safe.`;
  }

  // Update Stats cards
  const statMeds = document.getElementById('family-stat-meds');
  const statSleep = document.getElementById('family-stat-sleep');
  const statMood = document.getElementById('family-stat-mood');
  const statHr = document.getElementById('family-stat-hr');

  if (p.assessments && p.assessments.sleep) {
    if (statSleep) statSleep.textContent = `${{p.assessments.sleep.hours}} hrs/night`;
  }
  if (p.checkups && p.checkups[0]) {
    if (statHr) statHr.textContent = `${{p.checkups[0].hr}} (${{p.checkups[0].hrStatus || 'Normal'}})`;
  }
}

// 4. Render Tab 2: Senior Comprehensive Health Report
function renderFamilySeniorReport(seniorId) {
  const p = (state.patients || []).find(pt => pt.id === seniorId) || state.patients[0];
  if (!p) return;

  // Title & Demographics
  const title = document.getElementById('report-senior-name-title');
  if (title) title.textContent = `Medical & Vitals Report: ${{p.name}}`;

  const pName = document.getElementById('report-patient-name');
  if (pName) pName.textContent = p.name;
  const pUser = document.getElementById('report-patient-username');
  if (pUser) pUser.textContent = `@${{p.username}}`;
  const pAgeGen = document.getElementById('report-patient-age-gender');
  if (pAgeGen) pAgeGen.textContent = `${{p.age}} Yrs • ${{p.gender}}`;
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
    if (eName) eName.textContent = `${{p.emergencyContact.name}} (${{p.emergencyContact.relation}})`;
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
      <div class="bg-white rounded-2xl p-3 border ${{isBpHigh ? 'border-rose-300 bg-rose-50/40' : 'border-slate-200'}} shadow-sm">
        <div class="text-[10px] font-bold text-slate-500 uppercase">Blood Pressure</div>
        <div class="text-base font-extrabold ${{isBpHigh ? 'text-rose-600' : 'text-slate-800'}} mt-0.5">${{v.bp}}</div>
        <span class="text-[10px] px-1.5 py-0.2 rounded font-bold ${{isBpHigh ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'}}">${{v.bpStatus || 'Normal'}}</span>
      </div>
      <div class="bg-white rounded-2xl p-3 border ${{isHrHigh ? 'border-rose-300 bg-rose-50/40' : 'border-slate-200'}} shadow-sm">
        <div class="text-[10px] font-bold text-slate-500 uppercase">Heart Rate</div>
        <div class="text-base font-extrabold ${{isHrHigh ? 'text-rose-600' : 'text-slate-800'}} mt-0.5">${{v.hr}}</div>
        <span class="text-[10px] px-1.5 py-0.2 rounded font-bold ${{isHrHigh ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'}}">${{v.hrStatus || 'Normal'}}</span>
      </div>
      <div class="bg-white rounded-2xl p-3 border ${{isSpo2Low ? 'border-amber-300 bg-amber-50/40' : 'border-slate-200'}} shadow-sm">
        <div class="text-[10px] font-bold text-slate-500 uppercase">Oxygen (SpO2)</div>
        <div class="text-base font-extrabold ${{isSpo2Low ? 'text-amber-600' : 'text-slate-800'}} mt-0.5">${{v.spo2}}</div>
        <span class="text-[10px] px-1.5 py-0.2 rounded font-bold ${{isSpo2Low ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}}">${{v.spo2Status || 'Healthy'}}</span>
      </div>
      <div class="bg-white rounded-2xl p-3 border border-slate-200 shadow-sm">
        <div class="text-[10px] font-bold text-slate-500 uppercase">Blood Glucose</div>
        <div class="text-base font-extrabold text-slate-800 mt-0.5">${{v.glucose}}</div>
        <span class="text-[10px] px-1.5 py-0.2 rounded font-bold bg-slate-100 text-slate-700">Fasting</span>
      </div>
      <div class="bg-white rounded-2xl p-3 border border-slate-200 shadow-sm">
        <div class="text-[10px] font-bold text-slate-500 uppercase">Temperature</div>
        <div class="text-base font-extrabold text-slate-800 mt-0.5">${{v.temp}}</div>
        <span class="text-[10px] px-1.5 py-0.2 rounded font-bold bg-emerald-100 text-emerald-700">Afebrile</span>
      </div>
      <div class="bg-white rounded-2xl p-3 border border-slate-200 shadow-sm">
        <div class="text-[10px] font-bold text-slate-500 uppercase">Weight & BMI</div>
        <div class="text-base font-extrabold text-slate-800 mt-0.5">${{v.weight}} (BMI ${{v.bmi}})</div>
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
        <span><strong>${{c}}</strong></span>
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
        <td class="p-3 font-bold text-slate-900">${{m.name}}</td>
        <td class="p-3 font-mono text-slate-600">${{m.dosage}}</td>
        <td class="p-3 font-medium text-slate-700">${{m.schedule}}</td>
        <td class="p-3 text-slate-600">${{m.purpose}}</td>
        <td class="p-3 text-right">
          <span class="px-2 py-0.5 rounded-full text-[11px] font-extrabold bg-emerald-100 text-emerald-800">
            ${{m.adherence}}
          </span>
        </td>
      </tr>
    `).join('');
  }
}

// 5. Render Tab 3: Complete Assessment History
function renderFamilyAssessmentHistory(filterCategory) {
  const p = (state.patients || []).find(pt => pt.id === familySelectedSeniorId) || state.patients[0];
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
                  <span class="text-xs text-slate-400 font-medium">${{c.date}}</span>
                </div>
                <span class="text-xs text-slate-500 font-semibold">${{c.conductedBy || 'IoT Hub & Nurse'}}</span>
              </div>
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 my-2 text-xs">
                <div class="bg-slate-50 p-2 rounded-lg border border-slate-100">
                  <span class="text-slate-400 text-[10px] block">BP:</span>
                  <strong class="text-slate-800">${{c.bp}}</strong> (${{c.bpStatus}})
                </div>
                <div class="bg-slate-50 p-2 rounded-lg border border-slate-100">
                  <span class="text-slate-400 text-[10px] block">Heart Rate:</span>
                  <strong class="text-slate-800">${{c.hr}}</strong> (${{c.hrStatus}})
                </div>
                <div class="bg-slate-50 p-2 rounded-lg border border-slate-100">
                  <span class="text-slate-400 text-[10px] block">SpO2 Oxygen:</span>
                  <strong class="text-slate-800">${{c.spo2}}</strong> (${{c.spo2Status}})
                </div>
                <div class="bg-slate-50 p-2 rounded-lg border border-slate-100">
                  <span class="text-slate-400 text-[10px] block">Sugar:</span>
                  <strong class="text-slate-800">${{c.glucose}}</strong>
                </div>
              </div>
              <p class="text-xs text-slate-600 mt-1 italic">${{c.notes}}</p>
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
                  <span class="text-xs text-slate-400 font-medium">${{u.timestamp}}</span>
                </div>
                <span class="px-2 py-0.5 rounded text-[10px] font-bold ${{u.sentimentBadge || 'bg-rose-100 text-rose-800'}}">
                  ${{u.sentiment}} (${{u.duration}})
                </span>
              </div>
              <div class="bg-white p-3 rounded-xl border border-purple-100 mt-2">
                <p class="text-xs text-slate-800 font-medium leading-relaxed font-sans">
                  "${{u.hindiText}}"
                </p>
                <p class="text-[11px] text-slate-500 mt-1 border-t border-slate-100 pt-1 italic">
                  Translation: "${{u.englishTranslation}}"
                </p>
              </div>
              <div class="mt-2.5 flex items-center space-x-2">
                <button onclick="playFamilySeniorVoiceNote('${{u.hindiText.replace(/'/g, "\\\\\\'")}}')"
                  class="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-all flex items-center space-x-1.5 shadow-sm">
                  <i class="fa-solid fa-volume-high"></i>
                  <span>Play Dad's Voice Note</span>
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
                  <span class="text-xs text-slate-400 font-medium">${{u.timestamp}}</span>
                </div>
                <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                  ${{u.selection}}
                </span>
              </div>
              <p class="text-xs text-slate-700 mt-1">${{u.recordedNote || 'Reported via 1-tap companion interface'}}</p>
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
                  <strong class="text-emerald-700">${{adl.eating ? adl.eating.score : '10/10'}}</strong>
                  <div class="text-[10px] text-slate-500">${{adl.eating ? adl.eating.status : 'Independent'}}</div>
                </div>
                <div class="bg-white p-2.5 rounded-xl border border-indigo-100">
                  <span class="text-slate-400 text-[10px] block">🚽 Toileting:</span>
                  <strong class="text-amber-700">${{adl.toileting ? adl.toileting.score : '7/10'}}</strong>
                  <div class="text-[10px] text-slate-500">${{adl.toileting ? adl.toileting.status : 'Grab bar aid'}}</div>
                </div>
                <div class="bg-white p-2.5 rounded-xl border border-indigo-100">
                  <span class="text-slate-400 text-[10px] block">🚶 Walking:</span>
                  <strong class="text-amber-700">${{adl.walking ? adl.walking.score : '6/10'}}</strong>
                  <div class="text-[10px] text-slate-500">${{adl.walking ? adl.walking.status : 'With Cane'}}</div>
                </div>
                <div class="bg-white p-2.5 rounded-xl border border-indigo-100">
                  <span class="text-slate-400 text-[10px] block">🛏️ Moving/Bed:</span>
                  <strong class="text-indigo-700">${{adl.moving ? adl.moving.score : '7/10'}}</strong>
                  <div class="text-[10px] text-slate-500">${{adl.moving ? adl.moving.status : 'Mild stiffness'}}</div>
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
                    Pain Severity: <span class="ml-1 text-rose-600 font-extrabold">${{pain ? pain.score : 4}} / 10</span>
                  </div>
                  <div class="text-slate-600 mt-1">Location: <strong>${{pain ? pain.location : 'Lower Back'}}</strong></div>
                  <div class="text-slate-500 text-[11px] mt-0.5">${{pain ? pain.sensation : 'Dull ache'}}</div>
                </div>
                <div class="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <div class="font-bold text-slate-700 flex items-center">
                    <i class="fa-solid fa-moon text-indigo-500 mr-1.5"></i>
                    Sleep Duration: <span class="ml-1 text-indigo-600 font-extrabold">${{sleep ? sleep.hours : 5.2}} hrs</span>
                  </div>
                  <div class="text-slate-600 mt-1">Quality: <strong>${{sleep ? sleep.quality : 'Restless'}}</strong></div>
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
    showToast(`Playing recorded voice note from Dad...`, 'info');
  } else {
    showToast(`Voice transcript: "${{hindiText}}"`, 'info');
  }
}

// 8. Print Clean Clinical Summary for Hospital/Doctor
function printSeniorReport() {
  window.print();
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
  const p = (state.patients || []).find(pt => pt.id === familySelectedSeniorId) || state.patients[0];
  const name = p ? p.name : 'Dad';
  const phone = p ? p.phone : '+91 98110-44912';
  openCallModal('DAD-CALL', `${{name}} (Senior)`, phone);
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
  showToast(`Message sent to Senior: "${{msg}}" (Will be read aloud to them)`, 'success');
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
"""

# ==============================================================================
# 4. UPDATE app.js
# ==============================================================================
with open("app.js", "r", encoding="utf-8") as f:
    app_code = f.read()

# Replace View 3 Family Member logic in app.js
js_start = app_code.find("// =========================================================================")
family_marker = "// VIEW 3: FAMILY MEMBER LOGIC"
pos_family = app_code.find(family_marker)
assert pos_family != -1, "Could not find VIEW 3: FAMILY MEMBER LOGIC in app.js"

# Find beginning of banner comment above VIEW 3
pos_banner_start = app_code.rfind("// =========================================================================", 0, pos_family)
assert pos_banner_start != -1

pos_ops = app_code.find("// VIEW 4: OPERATIONS MANAGER LOGIC")
assert pos_ops != -1, "Could not find VIEW 4 in app.js"
pos_ops_banner = app_code.rfind("// =========================================================================", 0, pos_ops)

app_code = app_code[:pos_banner_start] + family_js + "\n\n" + app_code[pos_ops_banner:]

# Also ensure state has patients loaded
if "patients: [" not in app_code:
    state_marker = "  alerts: ["
    pos_state = app_code.find(state_marker)
    if pos_state != -1:
        app_code = app_code[:pos_state] + f"  patients: {patients_json},\n" + app_code[pos_state:]

# Ensure navigateRole and enterDashboard call Family view setup
family_init_code = """    if (role === 'family') {
      changeFamilyLinkedSenior('PAT-101');
      switchFamilyTab('summary');
      setTimeout(initFamilyVitalsChart, 100);
    }"""

if "if (role === 'family') {" in app_code:
    app_code = app_code.replace("if (role === 'family') {\n      setTimeout(initFamilyVitalsChart, 100);\n    }", family_init_code)
    app_code = app_code.replace("if (role === 'family') {\n    setTimeout(initFamilyVitalsChart, 100);\n  }", family_init_code)

with open("app.js", "w", encoding="utf-8") as f:
    f.write(app_code)

print("app.js updated with Family Portal logic (Summary, Report, History, Voice Playback, Printing)!")

