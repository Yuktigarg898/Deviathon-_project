# -*- coding: utf-8 -*-
import json
from patient_data_seed import PATIENTS_DATA, EMERGENCY_NOTIFICATIONS_SEED

patients_json = json.dumps(PATIENTS_DATA, ensure_ascii=False)
notifs_json = json.dumps(EMERGENCY_NOTIFICATIONS_SEED, ensure_ascii=False)

# ==========================================
# 1. UPDATE index.html
# ==========================================
with open("index.html", "r", encoding="utf-8") as f:
    html = f.read()

# Replace patient directory filter controls with clear Tier-based filters
old_patient_controls = """        <!-- Patient Directory Controls -->
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
        </div>"""

new_patient_controls = """        <!-- AI ML TIER CLASSIFICATION BAR -->
        <div class="bg-gradient-to-r from-slate-900 via-[#0e294b] to-slate-800 text-white rounded-2xl p-4 sm:p-5 mb-5 shadow-md border border-slate-700">
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div class="flex items-center space-x-2">
                <span class="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-extrabold uppercase tracking-wider bg-teal-500/20 text-teal-300 border border-teal-400/30">
                  ApnaSa 90,000 Records Random Forest Engine
                </span>
                <span class="text-xs text-slate-300">Live Clinical Risk Classification</span>
              </div>
              <h3 class="text-lg sm:text-xl font-extrabold mt-1">
                Patients Categorized by Machine Learning Predicted Tiers
              </h3>
              <p class="text-xs text-slate-300 mt-0.5">
                Evaluates Patient Data + Medical History + Medical Assessments + Senior Inputs to classify into <strong>Critical</strong>, <strong>Moderate</strong>, or <strong>Normal</strong> Tiers. Critical cases auto-raise emergency alarms & notify family contacts.
              </p>
            </div>

            <!-- Quick Tier Stats Pills -->
            <div class="flex flex-wrap items-center gap-2">
              <button onclick="setTierFilter('all')" id="tier-pill-all"
                class="px-3 py-1.5 rounded-xl text-xs font-extrabold bg-white text-slate-900 border border-white shadow-sm transition-all">
                All Tiers (5)
              </button>
              <button onclick="setTierFilter('CRITICAL')" id="tier-pill-critical"
                class="px-3 py-1.5 rounded-xl text-xs font-extrabold bg-rose-600/30 text-rose-300 hover:bg-rose-600 hover:text-white border border-rose-500/50 transition-all flex items-center space-x-1">
                <span>🚨 Critical (3)</span>
              </button>
              <button onclick="setTierFilter('NORMAL')" id="tier-pill-normal"
                class="px-3 py-1.5 rounded-xl text-xs font-extrabold bg-emerald-600/30 text-emerald-300 hover:bg-emerald-600 hover:text-white border border-emerald-500/50 transition-all flex items-center space-x-1">
                <span>🟢 Normal (1)</span>
              </button>
              <button onclick="setTierFilter('MODERATE')" id="tier-pill-moderate"
                class="px-3 py-1.5 rounded-xl text-xs font-extrabold bg-amber-600/30 text-amber-300 hover:bg-amber-600 hover:text-white border border-amber-500/50 transition-all flex items-center space-x-1">
                <span>🟡 Moderate (1)</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Patient Directory Controls -->
        <div class="bg-white rounded-2xl border border-slate-200 p-4 mb-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
          <div class="flex items-center space-x-2 w-full md:w-auto flex-grow max-w-lg">
            <div class="relative flex-grow">
              <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 text-xs">
                <i class="fa-solid fa-user-magnifying-glass"></i>
              </span>
              <input id="coord-patient-search" oninput="filterCoordinatorPatients()" type="text"
                placeholder="Search by @username, patient name, medical condition, or city..."
                class="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
            </div>
            <select id="coord-patient-status-filter" onchange="filterCoordinatorPatients()"
              class="border border-slate-300 rounded-xl text-xs py-2 px-3 bg-white text-slate-700 font-semibold">
              <option value="all">All Tiers (सभी टियर्स)</option>
              <option value="CRITICAL">🚨 Critical Tier (गंभीर जोखिम)</option>
              <option value="NORMAL">🟢 Normal Tier (सामान्य / सुरक्षित)</option>
              <option value="MODERATE">🟡 Moderate Tier (मध्यम निगरानी)</option>
            </select>
          </div>

          <div class="flex items-center space-x-2 w-full md:w-auto justify-end">
            <button onclick="openRaiseCriticalModal()"
              class="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center space-x-1.5">
              <i class="fa-solid fa-bolt"></i>
              <span>Simulate Tier Escalation & Notify</span>
            </button>
          </div>
        </div>"""

if old_patient_controls in html:
    html = html.replace(old_patient_controls, new_patient_controls, 1)

with open("index.html", "w", encoding="utf-8") as f:
    f.write(html)
print("index.html updated with AI ML Tier Classification Bar & Quick Tier Filter Pills!")

# ==========================================
# 2. UPDATE app.js
# ==========================================
with open("app.js", "r", encoding="utf-8") as f:
    app_code = f.read()

# Update patients state with refreshed PATIENTS_DATA
p_start = app_code.find("patients: ")
if p_start != -1:
    p_end = app_code.find(",\n  emergencyNotifications: ", p_start)
    if p_end != -1:
        app_code = app_code[:p_start] + "patients: " + patients_json + app_code[p_end:]

notif_start = app_code.find("emergencyNotifications: ")
if notif_start != -1:
    notif_end = app_code.find(",\n  alerts: [", notif_start)
    if notif_end != -1:
        app_code = app_code[:notif_start] + "emergencyNotifications: " + notifs_json + app_code[notif_end:]

marker = "// VIEW 1: CARE COORDINATOR LOGIC"
cut_point = app_code.find(marker)
assert cut_point != -1, "Could not find marker in app.js!"

with open("coordinator_tier_code.js", "r", encoding="utf-8") as f:
    new_coordinator_code = f.read()

app_code = app_code[:cut_point] + new_coordinator_code

with open("app.js", "w", encoding="utf-8") as f:
    f.write(app_code)

print("app.js successfully updated with Tier-Centric AI Model Classification!")
