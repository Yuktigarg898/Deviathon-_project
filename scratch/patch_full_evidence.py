import os
import re

print("Starting full evidence patch...")

# -------------------------------------------------------------
# 1. PATCH index.html
# -------------------------------------------------------------
with open("index.html", "r", encoding="utf-8") as f:
    html = f.read()

# A. Add Preferable Date & Time Slot to modal-ops-assign
assign_coord_block = """          <!-- Coordinator Select -->
          <div>
            <label class="block font-bold text-slate-700 mb-1.5">Select Care Coordinator</label>
            <select id="ops-assign-coordinator-select" class="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-teal-500 focus:outline-none">
              <option value="Ananya">Ananya (Clinical Specialist &bull; 3 Pending)</option>
              <option value="Rishabh">Rishabh (Care Nurse &bull; 2 Pending)</option>
              <option value="Amrita">Amrita (Tele-care Specialist &bull; 3 Pending)</option>
              <option value="Karan">Karan (Field Coordinator &bull; 2 Pending)</option>
              <option value="Megha" disabled>Megha (On Leave)</option>
            </select>
          </div>"""

assign_coord_with_dateslot = """          <!-- Coordinator Select -->
          <div>
            <label class="block font-bold text-slate-700 mb-1.5">Select Care Coordinator</label>
            <select id="ops-assign-coordinator-select" class="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-teal-500 focus:outline-none">
              <option value="Sister Kavita, RN">Sister Kavita, RN (Clinical Specialist &bull; Active)</option>
              <option value="Brother Amit">Brother Amit (Trauma & Mobility &bull; Active)</option>
              <option value="Rajesh Kumar">Rajesh Kumar (Field Care Buddy &bull; Active)</option>
              <option value="Ananya">Ananya (Clinical Specialist &bull; 3 Pending)</option>
              <option value="Rishabh">Rishabh (Care Nurse &bull; 2 Pending)</option>
              <option value="Amrita">Amrita (Tele-care Specialist &bull; 3 Pending)</option>
              <option value="Karan">Karan (Field Coordinator &bull; 2 Pending)</option>
              <option value="Megha" disabled>Megha (On Leave)</option>
            </select>
          </div>

          <!-- Preferable Visit Date & Time Slot (User Specification) -->
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block font-bold text-slate-700 mb-1.5 flex items-center space-x-1">
                <i class="fa-regular fa-calendar text-teal-600"></i>
                <span>Preferable Visit Date</span>
              </label>
              <input type="date" id="ops-assign-date" value="2026-10-31"
                class="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-medium text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none cursor-pointer">
            </div>
            <div>
              <label class="block font-bold text-slate-700 mb-1.5 flex items-center space-x-1">
                <i class="fa-regular fa-clock text-teal-600"></i>
                <span>Preferable Time Slot</span>
              </label>
              <select id="ops-assign-timeslot"
                class="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-medium text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none cursor-pointer">
                <option value="09:00 AM - 11:00 AM">Morning: 09:00 AM - 11:00 AM</option>
                <option value="11:00 AM - 01:00 PM">Midday: 11:00 AM - 01:00 PM</option>
                <option value="02:00 PM - 04:00 PM" selected>Afternoon: 02:00 PM - 04:00 PM</option>
                <option value="04:00 PM - 06:00 PM">Evening: 04:00 PM - 06:00 PM</option>
                <option value="Immediate (<30m)">Urgent / Immediate (&lt;30m)</option>
              </select>
            </div>
          </div>"""

if assign_coord_block in html:
    html = html.replace(assign_coord_block, assign_coord_with_dateslot, 1)
    print("Added Date & Time Slot fields to modal-ops-assign")
else:
    print("assign_coord_block not found in index.html")

# B. Replace Proof Track column in ops-subview-tracking to include:
# 1. Scheduled Date & Time Slot
# 2. Doorstep GPS & Live Location
# 3. Bedside Vitals Stream & Checkups list
# 4. Verified Bedside Photo Proof with elder ("unke sath pic upload karke")
# 5. Clinical Visit Summary ("even summarize a visit karega")
# 6. Senior Handshake Token & OTP
# 7. Action: Record / Submit Live Visit Proof button

old_proof_column_marker = '<!-- Right 5 cols: 3. PROOF TRACK (Care Delivery & Verification Dossier) -->'
end_proof_column_marker = '<!-- ========================================================================= -->\n          <!-- TAB 8: PROFILE & ACCOUNT SETTINGS'

new_proof_column = """<!-- Right 5 cols: 3. PROOF TRACK (Care Delivery & Verification Dossier) -->
              <div class="xl:col-span-5 space-y-6">

                <div class="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
                  <div class="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div class="flex items-center space-x-2.5">
                      <div class="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-black text-lg shadow-xs">
                        <i class="fa-solid fa-shield-halved"></i>
                      </div>
                      <div>
                        <div class="text-[10px] font-black text-slate-400 uppercase tracking-wider">Proof Track • Visit & Care Dossier</div>
                        <h3 class="text-sm sm:text-base font-extrabold text-slate-900" id="ops-proof-senior-title">Senior: Ramesh Sharma</h3>
                      </div>
                    </div>
                    <span class="px-2.5 py-1 rounded-full text-[11px] font-black bg-emerald-100 text-emerald-800 flex items-center space-x-1" id="ops-proof-status-pill">
                      <i class="fa-solid fa-check"></i>
                      <span>Verified Fix</span>
                    </span>
                  </div>

                  <!-- Scheduled Date & Time Slot Ribbon (From Operator Assignment) -->
                  <div class="p-2.5 rounded-xl bg-indigo-50/80 border border-indigo-200 text-xs flex items-center justify-between text-indigo-950 font-bold">
                    <span class="flex items-center space-x-1.5">
                      <i class="fa-regular fa-calendar-check text-indigo-600"></i>
                      <span>Scheduled Visit Slot:</span>
                    </span>
                    <span id="ops-proof-scheduled-slot" class="font-extrabold text-indigo-800">30 Oct 2026 • 02:00 PM - 04:00 PM</span>
                  </div>

                  <!-- Action: Record / Submit Live On-Site Visit Proof Button -->
                  <button type="button" onclick="openOpsSubmitVisitProofModal()"
                    class="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-black text-xs shadow-md transition-all flex items-center justify-center space-x-2 active:scale-[0.99] cursor-pointer">
                    <i class="fa-solid fa-clipboard-check text-sm"></i>
                    <span>Record / Submit Live On-Site Visit Proof</span>
                  </button>

                  <!-- Proof 1: Satellite Geofence GPS Fix -->
                  <div class="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                    <div class="flex items-center justify-between mb-1.5">
                      <span class="text-xs font-bold text-slate-800 flex items-center space-x-1.5">
                        <i class="fa-solid fa-location-crosshairs text-teal-600"></i>
                        <span>1. Doorstep GPS & Geofence Check-in</span>
                      </span>
                      <span class="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-emerald-100 text-emerald-800" id="ops-proof-geofence-dist">8.4m from Doorstep</span>
                    </div>
                    <div class="text-[11px] text-slate-600">
                      Satellite GNSS lock confirmed within senior residence boundary: <strong class="text-slate-900" id="ops-proof-address">B-42, GK-1, New Delhi</strong>.
                    </div>
                    <div class="text-[10px] text-slate-400 mt-1 font-mono flex items-center justify-between">
                      <span id="ops-proof-gps-time">Fix Timestamp: Today, 16:22:14 IST</span>
                      <span id="ops-proof-hash">Hash: 0x89e2...c419</span>
                    </div>
                  </div>

                  <!-- Proof 2: On-Site Bluetooth Biometric Vitals & Clinical Checkup -->
                  <div class="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                    <div class="flex items-center justify-between mb-2">
                      <span class="text-xs font-bold text-slate-800 flex items-center space-x-1.5">
                        <i class="fa-solid fa-heart-pulse text-rose-500"></i>
                        <span>2. Bedside Vitals & Clinical Checkups</span>
                      </span>
                      <span class="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-blue-100 text-blue-800">Direct Sensor Sync</span>
                    </div>
                    <div class="grid grid-cols-4 gap-2 text-center mb-2.5">
                      <div class="bg-white p-2 rounded-lg border border-slate-200">
                        <span class="text-[9px] text-slate-400 font-bold block uppercase">Blood Press.</span>
                        <span class="text-xs font-black text-slate-800" id="ops-proof-bp">136/88</span>
                      </div>
                      <div class="bg-white p-2 rounded-lg border border-slate-200">
                        <span class="text-[9px] text-slate-400 font-bold block uppercase">Pulse</span>
                        <span class="text-xs font-black text-emerald-700" id="ops-proof-hr">82 bpm</span>
                      </div>
                      <div class="bg-white p-2 rounded-lg border border-slate-200">
                        <span class="text-[9px] text-slate-400 font-bold block uppercase">SpO2</span>
                        <span class="text-xs font-black text-teal-700" id="ops-proof-spo2">98%</span>
                      </div>
                      <div class="bg-white p-2 rounded-lg border border-slate-200">
                        <span class="text-[9px] text-slate-400 font-bold block uppercase">Glucose</span>
                        <span class="text-xs font-black text-amber-700" id="ops-proof-sugar">142 mg/dL</span>
                      </div>
                    </div>
                    <!-- Checkups checklist -->
                    <div class="bg-white p-2 rounded-lg border border-slate-200 space-y-1 text-[11px] text-slate-700" id="ops-proof-checkups-list">
                      <div class="flex items-center space-x-1.5 text-emerald-800 font-semibold">
                        <i class="fa-solid fa-check-circle text-emerald-600 text-xs"></i>
                        <span>Physical mobility & fall risk checked (Ambulatory)</span>
                      </div>
                      <div class="flex items-center space-x-1.5 text-emerald-800 font-semibold">
                        <i class="fa-solid fa-check-circle text-emerald-600 text-xs"></i>
                        <span>7-Day medication refill box reviewed & administered</span>
                      </div>
                      <div class="flex items-center space-x-1.5 text-emerald-800 font-semibold">
                        <i class="fa-solid fa-check-circle text-emerald-600 text-xs"></i>
                        <span>Hydration & oral electrolyte therapy completed</span>
                      </div>
                    </div>
                    <div class="text-[10px] text-slate-500 mt-1.5 flex items-center justify-between">
                      <span id="ops-proof-device">Device: OMRON-BLE-9921 / AccuChek</span>
                      <span class="text-emerald-700 font-bold"><i class="fa-solid fa-circle-check text-[9px] mr-1"></i>Calibrated</span>
                    </div>
                  </div>

                  <!-- Proof 3: Verified Bedside Photo Proof with Elder ("Pic with Elder") -->
                  <div class="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                    <div class="flex items-center justify-between mb-2">
                      <span class="text-xs font-bold text-slate-800 flex items-center space-x-1.5">
                        <i class="fa-solid fa-camera text-indigo-600"></i>
                        <span>3. Bedside Photo Proof (On-Site Verification)</span>
                      </span>
                      <button type="button" onclick="document.getElementById('ops-direct-photo-input').click()"
                        class="text-[10px] font-bold text-teal-700 hover:text-teal-900 bg-teal-50 px-2 py-0.5 rounded border border-teal-200 flex items-center space-x-1 cursor-pointer">
                        <i class="fa-solid fa-upload text-[9px]"></i>
                        <span>Upload Pic</span>
                      </button>
                      <input type="file" id="ops-direct-photo-input" accept="image/*" class="hidden" onchange="handleDirectPhotoUpload(event)">
                    </div>

                    <!-- Photo Preview Container with Security Watermark Overlay -->
                    <div class="relative w-full h-44 rounded-xl overflow-hidden border border-slate-200 bg-slate-900 shadow-inner group">
                      <img id="ops-proof-visit-photo-img" src="senior-nurse-photo.png?v=2" alt="Bedside Visit Verification Photo" class="w-full h-full object-cover">
                      
                      <!-- Geotag Watermark Overlay -->
                      <div class="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent flex flex-col justify-between p-2.5 text-white pointer-events-none">
                        <div class="flex items-center justify-between">
                          <span class="px-2 py-0.5 rounded bg-emerald-600/90 backdrop-blur-md text-[9px] font-black uppercase tracking-wider flex items-center space-x-1">
                            <span class="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                            <span>PHYSICAL ON-SITE PROOF</span>
                          </span>
                          <span class="text-[9px] font-mono bg-black/60 px-1.5 py-0.5 rounded text-slate-200" id="ops-proof-photo-watermark-time">30-OCT-2026 16:22 IST</span>
                        </div>
                        <div>
                          <div class="text-xs font-black tracking-tight" id="ops-proof-photo-watermark-senior">Elder: Ramesh Sharma • B-42 GK-1</div>
                          <div class="text-[10px] text-slate-300 font-mono mt-0.5" id="ops-proof-photo-watermark-gps">GPS: 28.5355° N, 77.2410° E (±2.8m Accuracy)</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Proof 4: Clinical Visit Summary -->
                  <div class="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                    <div class="flex items-center justify-between mb-2">
                      <span class="text-xs font-bold text-slate-800 flex items-center space-x-1.5">
                        <i class="fa-solid fa-file-lines text-teal-600"></i>
                        <span>4. Clinical Visit Summary & Observations</span>
                      </span>
                      <span class="px-2 py-0.5 rounded text-[10px] font-extrabold bg-emerald-100 text-emerald-800">Visit Completed</span>
                    </div>
                    <div class="p-2.5 bg-white rounded-lg border border-slate-200 text-xs text-slate-700 leading-relaxed font-medium" id="ops-proof-visit-summary">
                      "Visited Ramesh Sharma ji for scheduled afternoon health check-in. Elder reported morning dizziness. Administered oral electrolyte therapy and assisted with evening prescribed medications. All vital signs checked and verified within safe limits. Reviewed medicine organizer for the next 7 days. Senior is comfortable and resting. Family notified via CareConnect portal."
                    </div>
                    <div class="text-[10px] text-slate-500 font-bold mt-1 text-right" id="ops-proof-coordinator-sign">
                      — Recorded by Sister Kavita Verma, RN
                    </div>
                  </div>

                  <!-- Proof 5: Senior / Caregiver 4-Digit Handshake OTP -->
                  <div class="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                    <div class="flex items-center justify-between mb-2">
                      <span class="text-xs font-bold text-slate-800 flex items-center space-x-1.5">
                        <i class="fa-solid fa-key text-amber-500"></i>
                        <span>5. Senior Handshake Token & OTP</span>
                      </span>
                      <span class="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-emerald-100 text-emerald-800">Identity Confirmed</span>
                    </div>
                    <div class="flex items-center justify-between bg-white p-2.5 rounded-lg border border-slate-200">
                      <div class="text-xs text-slate-600">
                        <span class="text-[10px] font-bold text-slate-400 block uppercase">4-Digit Security Handshake</span>
                        <span class="font-extrabold text-slate-900" id="ops-proof-senior-otp-name">Ramesh Sharma (Senior)</span>
                      </div>
                      <div class="flex items-center space-x-1 font-mono text-sm font-black text-teal-800" id="ops-proof-otp-digits">
                        <span class="w-6 h-7 bg-teal-50 border border-teal-200 rounded flex items-center justify-center font-black">7</span>
                        <span class="w-6 h-7 bg-teal-50 border border-teal-200 rounded flex items-center justify-center font-black">1</span>
                        <span class="w-6 h-7 bg-teal-50 border border-teal-200 rounded flex items-center justify-center font-black">9</span>
                        <span class="w-6 h-7 bg-teal-50 border border-teal-200 rounded flex items-center justify-center font-black">4</span>
                      </div>
                    </div>
                  </div>

                  <!-- Proof 6: Resolution Certificate Action -->
                  <div class="p-3.5 bg-emerald-50/70 rounded-xl border border-emerald-200 flex items-center justify-between">
                    <div>
                      <div class="text-xs font-black text-emerald-900" id="ops-proof-outcome-badge">Stabilized • Hospitalization Averted</div>
                      <div class="text-[10px] text-emerald-700 font-medium">Estimated emergency triage cost saved: ₹45,000</div>
                    </div>
                    <button type="button" onclick="openOpsProofCertificateModal()" class="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-sm transition-all flex items-center space-x-1.5 cursor-pointer">
                      <i class="fa-solid fa-file-shield text-xs"></i>
                      <span>View Certificate</span>
                    </button>
                  </div>

                </div>

              </div>

            </div>

          </div>
"""

pos1 = html.find(old_proof_column_marker)
pos2 = html.find('<!-- ========================================================================= -->\n          <!-- TAB 8: PROFILE')
if pos1 != -1 and pos2 != -1:
    html = html[:pos1] + new_proof_column + '\n\n          ' + html[pos2:]
    print("Replaced Proof Track column with full Evidence Dossier UI")
else:
    print(f"Could not locate proof column bounds: pos1={pos1}, pos2={pos2}")

# C. Add Modal 7: Record On-Site Visit Proof Modal (#modal-ops-submit-visit-proof)
modal_submit_proof_html = """
    <!-- 7. RECORD & SUBMIT ON-SITE VISIT PROOF MODAL (USER SPECIFICATION) -->
    <div id="modal-ops-submit-visit-proof" class="hidden fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div class="bg-white rounded-2xl max-w-xl w-full p-6 sm:p-7 shadow-2xl border border-slate-200 animate-scaleUp">
        <div class="flex items-center justify-between pb-3.5 border-b border-slate-100">
          <div class="flex items-center space-x-2.5">
            <span class="w-9 h-9 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-black text-base shadow-xs">
              <i class="fa-solid fa-clipboard-check"></i>
            </span>
            <div>
              <h3 class="font-extrabold text-base text-slate-900">Record On-Site Visit Proof & Evidence</h3>
              <p class="text-[11px] text-slate-400 font-semibold">Live doorstep check-in, vitals, photo proof & clinical summary</p>
            </div>
          </div>
          <button type="button" onclick="closeOpsSubmitVisitProofModal()" class="text-slate-400 hover:text-slate-600 p-1">
            <i class="fa-solid fa-xmark text-lg"></i>
          </button>
        </div>

        <form id="ops-submit-visit-proof-form" onsubmit="submitOpsVisitProof(event)" class="py-4 space-y-4 text-xs">
          <!-- Senior Info & Scheduled Slot Header -->
          <div class="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
            <div>
              <div class="text-[10px] text-slate-400 uppercase font-black">Elder & Address</div>
              <div class="font-black text-sm text-slate-900" id="modal-proof-senior-name">Ramesh Sharma</div>
              <div class="text-[11px] text-slate-500" id="modal-proof-address">B-42, Greater Kailash 1, New Delhi</div>
            </div>
            <div class="text-right">
              <span class="px-2.5 py-1 rounded-full text-[10px] font-black bg-indigo-100 text-indigo-800" id="modal-proof-slot-badge">
                Slot: 02:00 PM - 04:00 PM
              </span>
              <div class="text-[10px] text-slate-400 mt-1" id="modal-proof-coord-name">Coord: Sister Kavita, RN</div>
            </div>
          </div>

          <!-- Step 1: Live Doorstep GPS Location -->
          <div class="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <div class="flex items-center justify-between">
              <span class="font-bold text-slate-800 flex items-center space-x-1.5">
                <i class="fa-solid fa-location-crosshairs text-teal-600"></i>
                <span>1. Live Doorstep GPS Location Stamp</span>
              </span>
              <button type="button" onclick="fetchLiveDoorstepLocation()"
                class="px-2.5 py-1 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-[10px] font-bold shadow-2xs flex items-center space-x-1 cursor-pointer">
                <i class="fa-solid fa-crosshairs text-[9px]"></i>
                <span>Fetch Live GPS Now</span>
              </button>
            </div>
            <div class="grid grid-cols-2 gap-2 text-[11px]">
              <div>
                <label class="block text-[10px] font-bold text-slate-500">Live Latitude</label>
                <input type="text" id="modal-proof-lat" value="28.5355" class="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg font-mono text-xs">
              </div>
              <div>
                <label class="block text-[10px] font-bold text-slate-500">Live Longitude</label>
                <input type="text" id="modal-proof-lng" value="77.2410" class="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg font-mono text-xs">
              </div>
            </div>
            <div class="text-[10px] text-emerald-700 font-bold flex items-center justify-between" id="modal-proof-gps-status">
              <span><i class="fa-solid fa-circle-check text-[9px] mr-1"></i>Geofence verified within 4.8m of doorstep</span>
              <span class="font-mono text-slate-400">RTK Lock: ±2.8m</span>
            </div>
          </div>

          <!-- Step 2: Elder Vitals & Clinical Checkup -->
          <div class="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <div class="font-bold text-slate-800 flex items-center space-x-1.5">
              <i class="fa-solid fa-heart-pulse text-rose-500"></i>
              <span>2. Elder Vitals & Bedside Measurements</span>
            </div>
            <div class="grid grid-cols-4 gap-2">
              <div>
                <label class="block text-[10px] font-bold text-slate-500">BP (mmHg)</label>
                <input type="text" id="modal-proof-bp-input" value="136/88" class="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-center">
              </div>
              <div>
                <label class="block text-[10px] font-bold text-slate-500">Pulse (bpm)</label>
                <input type="number" id="modal-proof-hr-input" value="82" class="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-center">
              </div>
              <div>
                <label class="block text-[10px] font-bold text-slate-500">SpO2 (%)</label>
                <input type="number" id="modal-proof-spo2-input" value="98" class="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-center">
              </div>
              <div>
                <label class="block text-[10px] font-bold text-slate-500">Sugar (mg/dL)</label>
                <input type="number" id="modal-proof-sugar-input" value="142" class="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-center">
              </div>
            </div>
            <div class="space-y-1 pt-1 text-[11px] text-slate-700">
              <label class="flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" id="modal-proof-chk-mobility" checked class="rounded text-teal-600 accent-teal-600">
                <span>Physical mobility & fall risk checked (Elder is alert & ambulatory)</span>
              </label>
              <label class="flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" id="modal-proof-chk-meds" checked class="rounded text-teal-600 accent-teal-600">
                <span>7-Day medication organizer verified & morning dose confirmed</span>
              </label>
              <label class="flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" id="modal-proof-chk-hydration" checked class="rounded text-teal-600 accent-teal-600">
                <span>Oral hydration & nutrition therapy completed</span>
              </label>
            </div>
          </div>

          <!-- Step 3: Bedside Photo Proof with Elder ("Upload Pic") -->
          <div class="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <div class="flex items-center justify-between">
              <span class="font-bold text-slate-800 flex items-center space-x-1.5">
                <i class="fa-solid fa-camera text-indigo-600"></i>
                <span>3. Upload Photo with Elder (Strong Proof Evidence)</span>
              </span>
              <label for="modal-proof-photo-file" class="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-[10px] font-bold shadow-2xs flex items-center space-x-1 cursor-pointer">
                <i class="fa-solid fa-folder-open text-teal-600"></i>
                <span>Choose Image</span>
              </label>
              <input type="file" id="modal-proof-photo-file" accept="image/*" class="hidden" onchange="previewModalProofPhoto(event)">
            </div>
            <div class="flex items-center space-x-3">
              <div class="w-24 h-20 rounded-lg bg-slate-900 border border-slate-300 overflow-hidden flex-shrink-0 relative">
                <img id="modal-proof-photo-preview" src="senior-nurse-photo.png?v=2" alt="Preview" class="w-full h-full object-cover">
                <div class="absolute bottom-0 inset-x-0 bg-black/70 text-[8px] text-white text-center font-mono py-0.5">GEO-TAGGED</div>
              </div>
              <div class="text-[11px] text-slate-600 flex-1">
                <div class="font-bold text-slate-900">Bedside Verification Snapshot</div>
                <div class="text-[10px] text-slate-400 mt-0.5">Captures physical presence of coordinator with elder at their residence. Automatic cryptographic timestamp and coordinates stamped.</div>
              </div>
            </div>
          </div>

          <!-- Step 4: Visit Summary ("even summarize a visit karega") -->
          <div>
            <label class="block font-bold text-slate-700 mb-1 flex items-center justify-between">
              <span class="flex items-center space-x-1">
                <i class="fa-solid fa-file-pen text-teal-600"></i>
                <span>4. Clinical Visit Summary & Debrief</span>
              </span>
              <span class="text-[10px] text-slate-400">Visible to Operator & Family</span>
            </label>
            <textarea id="modal-proof-summary-input" rows="3" required
              class="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-teal-500 focus:outline-none leading-relaxed">Visited Ramesh Sharma ji for scheduled afternoon health check-in. Elder reported morning dizziness. Administered oral electrolyte therapy and assisted with evening prescribed medications. All vital signs checked and verified within safe limits. Reviewed medicine organizer for the next 7 days. Senior is comfortable and resting. Family notified via CareConnect portal.</textarea>
          </div>

          <!-- Step 5: Senior Handshake OTP Token -->
          <div class="flex items-center justify-between p-2.5 bg-teal-50/70 rounded-xl border border-teal-200">
            <div>
              <div class="font-bold text-teal-900">5. Senior Handshake OTP Token</div>
              <div class="text-[10px] text-teal-700">Elder verifies coordinator visit completion with 4-digit code.</div>
            </div>
            <input type="text" id="modal-proof-otp-input" maxlength="4" value="7194"
              class="w-20 px-2 py-1.5 bg-white border border-teal-300 rounded-lg text-center font-mono font-black text-sm text-teal-900 tracking-widest focus:ring-2 focus:ring-teal-500 focus:outline-none">
          </div>

          <div class="pt-3 border-t border-slate-100 flex items-center justify-end space-x-2">
            <button type="button" onclick="closeOpsSubmitVisitProofModal()" class="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold text-xs cursor-pointer">
              Cancel
            </button>
            <button type="submit" class="px-5 py-2.5 rounded-xl bg-[#00a896] hover:bg-[#008779] text-white font-extrabold text-xs shadow-md shadow-teal-500/20 flex items-center space-x-1.5 cursor-pointer">
              <i class="fa-solid fa-shield-check"></i>
              <span>Seal & Verify Visit Evidence</span>
            </button>
          </div>
        </form>
      </div>
    </div>
"""

modal_cert_marker = '<div id="modal-ops-proof-certificate"'
if modal_cert_marker in html and 'modal-ops-submit-visit-proof' not in html:
    html = html.replace(modal_cert_marker, modal_submit_proof_html + '\n    ' + modal_cert_marker, 1)
    print("Added modal-ops-submit-visit-proof to index.html")

with open("index.html", "w", encoding="utf-8") as f:
    f.write(html)
print("Updated index.html successfully!")


# -------------------------------------------------------------
# 2. PATCH app.js
# -------------------------------------------------------------
with open("app.js", "r", encoding="utf-8") as f:
    js = f.read()

# A. Update confirmOpsAssignModal to read date and time slot
assign_func_old = """function confirmOpsAssignModal() {
  const coordSelect = document.getElementById('ops-assign-coordinator-select');
  const chosenCoord = coordSelect ? coordSelect.value : 'Sister Kavita, RN';

  if (currentAssignTargetSenior) {"""

assign_func_new = """function confirmOpsAssignModal() {
  const coordSelect = document.getElementById('ops-assign-coordinator-select');
  const chosenCoord = coordSelect ? coordSelect.value : 'Sister Kavita, RN';
  const dateInput = document.getElementById('ops-assign-date');
  const slotSelect = document.getElementById('ops-assign-timeslot');
  const chosenDate = dateInput ? dateInput.value : '2026-10-31';
  const chosenSlot = slotSelect ? slotSelect.value : '02:00 PM - 04:00 PM';

  if (currentAssignTargetSenior) {"""

if assign_func_old in js:
    js = js.replace(assign_func_old, assign_func_new, 1)
    print("Updated confirmOpsAssignModal to read date and timeslot")

# Update createOrUpdateOpsDispatch call inside confirmOpsAssignModal
call_create_old = "createOrUpdateOpsDispatch(currentAssignTargetSenior, chosenCoord, 'Assigned via Command Center');"
call_create_new = "createOrUpdateOpsDispatch(currentAssignTargetSenior, chosenCoord, 'Assigned via Command Center', chosenDate, chosenSlot);"
if call_create_old in js:
    js = js.replace(call_create_old, call_create_new, 1)
    print("Updated createOrUpdateOpsDispatch call with chosenDate and chosenSlot")

# B. Add Track button in Dashboard Elders Table (renderOpsDashboardEldersTable)
table_btn_old = """          <!-- Diagnostic Report Button -->
          <td class="p-3.5 align-top text-center">
            <button type="button" onclick="openOpsElderClinicalReport('${item.id}')"
              class="px-3 py-2 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200/90 font-bold text-xs transition-all shadow-2xs hover:shadow active:scale-95 flex items-center justify-center space-x-1.5 mx-auto cursor-pointer">
              <i class="fa-solid fa-file-waveform text-teal-600"></i>
              <span>Report Sheet</span>
            </button>
            <div class="text-[9px] text-slate-400 mt-1 font-mono">${item.lastReportDate}</div>
          </td>"""

table_btn_new = """          <!-- Diagnostic Report & Track Buttons -->
          <td class="p-3.5 align-top text-center space-y-1.5">
            <button type="button" onclick="openOpsElderClinicalReport('${item.id}')"
              class="w-full px-2.5 py-1.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200/90 font-bold text-[11px] transition-all shadow-2xs hover:shadow active:scale-95 flex items-center justify-center space-x-1 mx-auto cursor-pointer">
              <i class="fa-solid fa-file-waveform text-teal-600 text-xs"></i>
              <span>Report Sheet</span>
            </button>
            <button type="button" onclick="openOpsTrackingForSenior('${item.senior}')"
              class="w-full px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 font-bold text-[11px] transition-all shadow-2xs active:scale-95 flex items-center justify-center space-x-1 mx-auto cursor-pointer"
              title="Track Visit & Proof">
              <i class="fa-solid fa-route text-teal-600 text-xs"></i>
              <span>Track Visit</span>
            </button>
            <div class="text-[9px] text-slate-400 mt-0.5 font-mono">${item.lastReportDate}</div>
          </td>"""

if table_btn_old in js:
    js = js.replace(table_btn_old, table_btn_new, 1)
    print("Added Track Visit button to renderOpsDashboardEldersTable")

# C. Add Submit Proof and Track buttons to Care Coordinator Queue (renderCoordinatorAlerts)
coord_actions_old = """          <div class="flex items-center space-x-2">
            <button onclick="openResolveModal('${item.id}', '${item.seniorName}')" class="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center space-x-1.5">
              <i class="fa-solid fa-circle-check"></i>
              <span>Resolve & Mark Safe</span>
            </button>
          </div>"""

coord_actions_new = """          <div class="flex items-center space-x-2">
            <button onclick="openCoordinatorVisitProofModal('${item.id}', '${item.seniorName}')" class="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center space-x-1.5 cursor-pointer">
              <i class="fa-solid fa-clipboard-check text-emerald-600"></i>
              <span>Submit Visit Proof & Vitals</span>
            </button>
            <button onclick="openOpsTrackingForSenior('${item.seniorName}')" class="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center space-x-1.5 cursor-pointer">
              <i class="fa-solid fa-route text-teal-600"></i>
              <span>Track Dispatch</span>
            </button>
            <button onclick="openResolveModal('${item.id}', '${item.seniorName}')" class="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center space-x-1.5">
              <i class="fa-solid fa-circle-check"></i>
              <span>Resolve</span>
            </button>
          </div>"""

if coord_actions_old in js:
    js = js.replace(coord_actions_old, coord_actions_new, 1)
    print("Added Submit Visit Proof & Track Dispatch buttons to renderCoordinatorAlerts")

# D. Now append / replace the Tracking system functions in app.js
evidence_helpers = """

// ============================================================================
// VISIT PROOF & EVIDENCE SUBMISSION FUNCTIONS (OPERATOR & COORDINATOR)
// ============================================================================

// Open the Record & Submit On-Site Visit Proof Modal
function openOpsSubmitVisitProofModal(optionalSeniorName) {
  const seniorName = optionalSeniorName || (OPS_ACTIVE_DISPATCHES.find(d => d.id === currentOpsSelectedDispatchId)?.seniorName) || 'Ramesh Sharma';
  const d = OPS_ACTIVE_DISPATCHES.find(item => item.seniorName.toLowerCase() === seniorName.toLowerCase()) || OPS_ACTIVE_DISPATCHES[0];
  if (!d) return;

  currentOpsSelectedDispatchId = d.id;

  const modal = document.getElementById('modal-ops-submit-visit-proof');
  if (!modal) return;

  const seniorEl = document.getElementById('modal-proof-senior-name');
  const addressEl = document.getElementById('modal-proof-address');
  const slotBadge = document.getElementById('modal-proof-slot-badge');
  const coordEl = document.getElementById('modal-proof-coord-name');
  const latEl = document.getElementById('modal-proof-lat');
  const lngEl = document.getElementById('modal-proof-lng');
  const bpInput = document.getElementById('modal-proof-bp-input');
  const hrInput = document.getElementById('modal-proof-hr-input');
  const sugarInput = document.getElementById('modal-proof-sugar-input');
  const spo2Input = document.getElementById('modal-proof-spo2-input');
  const summaryInput = document.getElementById('modal-proof-summary-input');
  const otpInput = document.getElementById('modal-proof-otp-input');
  const photoPreview = document.getElementById('modal-proof-photo-preview');

  if (seniorEl) seniorEl.textContent = d.seniorName;
  if (addressEl) addressEl.textContent = d.address;
  if (slotBadge) slotBadge.textContent = `Slot: ${d.scheduledSlot || '02:00 PM - 04:00 PM'}`;
  if (coordEl) coordEl.textContent = `Coord: ${d.assignedCoordinator}`;
  if (latEl) latEl.value = d.transit.gpsLat ? d.transit.gpsLat.toFixed(4) : '28.5355';
  if (lngEl) lngEl.value = d.transit.gpsLng ? d.transit.gpsLng.toFixed(4) : '77.2410';

  if (bpInput) bpInput.value = d.proof.bedsideVitals.bp ? d.proof.bedsideVitals.bp.replace(' mmHg', '') : '136/88';
  if (hrInput) hrInput.value = d.proof.bedsideVitals.hr ? parseInt(d.proof.bedsideVitals.hr) : 82;
  if (sugarInput) sugarInput.value = d.proof.bedsideVitals.sugar ? parseInt(d.proof.bedsideVitals.sugar) : 142;
  if (spo2Input) spo2Input.value = d.proof.bedsideVitals.spo2 ? parseInt(d.proof.bedsideVitals.spo2) : 98;
  if (otpInput) otpInput.value = d.proof.handshakeOtp || '7194';
  if (summaryInput) summaryInput.value = d.proof.visitSummary || `Visited ${d.seniorName} for scheduled health check-in. Vitals monitored and verified within safe limits. Prescribed medication schedule reviewed. Elder is comfortable and resting. Family briefed.`;
  if (photoPreview && d.proof.visitPhoto) photoPreview.src = d.proof.visitPhoto;

  modal.classList.remove('hidden');
}

function closeOpsSubmitVisitProofModal() {
  const modal = document.getElementById('modal-ops-submit-visit-proof');
  if (modal) modal.classList.add('hidden');
}

// Fetch live GPS location at elder's doorstep
function fetchLiveDoorstepLocation() {
  const latEl = document.getElementById('modal-proof-lat');
  const lngEl = document.getElementById('modal-proof-lng');
  const statusEl = document.getElementById('modal-proof-gps-status');

  // Realistic GNSS fix within 3-5 meters
  const randomOffsetLat = (Math.random() - 0.5) * 0.0003;
  const randomOffsetLng = (Math.random() - 0.5) * 0.0003;

  if (latEl) latEl.value = (28.5355 + randomOffsetLat).toFixed(4);
  if (lngEl) lngEl.value = (77.2410 + randomOffsetLng).toFixed(4);

  if (statusEl) {
    statusEl.innerHTML = `<span><i class="fa-solid fa-circle-check text-[9px] mr-1"></i>Live Geofence Locked (3.4m from doorstep)</span><span class="font-mono text-slate-400">RTK Lock: ±1.8m</span>`;
  }

  showToast('Live Doorstep GPS satellite fix captured successfully!', 'success');
}

// Preview uploaded photo in modal
function previewModalProofPhoto(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    const preview = document.getElementById('modal-proof-photo-preview');
    if (preview) preview.src = e.target.result;
    showToast('Bedside visit photo loaded. Digital watermark applied.', 'info');
  };
  reader.readAsDataURL(file);
}

// Handle direct photo upload from the tracking card
function handleDirectPhotoUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    const d = OPS_ACTIVE_DISPATCHES.find(item => item.id === currentOpsSelectedDispatchId);
    if (d) {
      d.proof.visitPhoto = e.target.result;
      const img = document.getElementById('ops-proof-visit-photo-img');
      if (img) img.src = e.target.result;
      showToast(`Bedside photo proof updated for ${d.seniorName}!`, 'success');
    }
  };
  reader.readAsDataURL(file);
}

// Submit & Seal Visit Evidence
function submitOpsVisitProof(event) {
  if (event && event.preventDefault) event.preventDefault();

  const d = OPS_ACTIVE_DISPATCHES.find(item => item.id === currentOpsSelectedDispatchId) || OPS_ACTIVE_DISPATCHES[0];
  if (!d) return;

  const lat = parseFloat(document.getElementById('modal-proof-lat')?.value) || 28.5355;
  const lng = parseFloat(document.getElementById('modal-proof-lng')?.value) || 77.2410;
  const bp = document.getElementById('modal-proof-bp-input')?.value || '136/88';
  const hr = document.getElementById('modal-proof-hr-input')?.value || '82';
  const sugar = document.getElementById('modal-proof-sugar-input')?.value || '142';
  const spo2 = document.getElementById('modal-proof-spo2-input')?.value || '98';
  const summary = document.getElementById('modal-proof-summary-input')?.value || 'Visit successfully completed with on-site vitals verified.';
  const otp = document.getElementById('modal-proof-otp-input')?.value || '7194';
  const photoSrc = document.getElementById('modal-proof-photo-preview')?.src || 'senior-nurse-photo.png?v=2';

  // Update dispatch record
  d.status = 'Arrived';
  d.transit.speedKmh = 0;
  d.transit.remainingDistanceKm = 0.0;
  d.transit.etaSeconds = 0;
  d.transit.progressPercent = 100;
  d.transit.gpsLat = lat;
  d.transit.gpsLng = lng;

  d.proof.geofenceVerified = true;
  d.proof.geofenceDistance = '3.8m from Doorstep (Verified)';
  d.proof.geofenceTimestamp = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' IST';
  d.proof.geofenceHash = '0x' + Math.random().toString(16).substring(2, 10) + '...verified';

  d.proof.bedsideVitals = {
    bp: bp + ' mmHg',
    hr: hr + ' bpm',
    spo2: spo2 + '%',
    sugar: sugar + ' mg/dL',
    temp: '98.4°F',
    device: 'OMRON-BLE-9921 / AccuChek Guide'
  };

  d.proof.visitPhoto = photoSrc;
  d.proof.visitSummary = summary;
  d.proof.handshakeOtp = otp;
  d.proof.handshakeVerified = true;

  // Add audit record
  if (typeof addOpsAuditRecord === 'function') {
    addOpsAuditRecord(d.seniorName, `On-site visit completed & proof sealed by ${d.assignedCoordinator} (Vitals: ${bp}, HR: ${hr}, Photo verified)`, 'Care Coordinator Field Telemetry');
  }

  // Close modal and refresh UI
  closeOpsSubmitVisitProofModal();
  selectOpsDispatch(d.id);

  if (soundEngine && typeof soundEngine.playSuccessChime === 'function') {
    soundEngine.playSuccessChime();
  }

  showToast(`Strong Visit Evidence locked & verified for ${d.seniorName}! Geotagged photo, vitals & summary recorded.`, 'success');
}

// Coordinator Portal bridge
function openCoordinatorVisitProofModal(alertId, seniorName) {
  openOpsSubmitVisitProofModal(seniorName);
}
"""

if "VISIT PROOF & EVIDENCE SUBMISSION FUNCTIONS" not in js:
    js += evidence_helpers
    print("Appended evidence submission helpers to app.js")

# Now update selectOpsDispatch in app.js to populate the new fields:
# scheduledSlot, visitPhoto, visitSummary
old_select_code = """  if (proofOutcomeBadgeEl) proofOutcomeBadgeEl.textContent = d.proof.resolutionOutcome;
}"""

new_select_code = """  if (proofOutcomeBadgeEl) proofOutcomeBadgeEl.textContent = d.proof.resolutionOutcome;

  // Populate Scheduled Slot
  const scheduledSlotEl = document.getElementById('ops-proof-scheduled-slot');
  if (scheduledSlotEl) {
    scheduledSlotEl.textContent = `${d.scheduledDate || '30 Oct 2026'} • ${d.scheduledSlot || '02:00 PM - 04:00 PM'}`;
  }

  // Populate Visit Photo Proof
  const photoImgEl = document.getElementById('ops-proof-visit-photo-img');
  const watermarkSenior = document.getElementById('ops-proof-photo-watermark-senior');
  const watermarkGps = document.getElementById('ops-proof-photo-watermark-gps');
  const watermarkTime = document.getElementById('ops-proof-photo-watermark-time');
  if (photoImgEl && d.proof.visitPhoto) {
    photoImgEl.src = d.proof.visitPhoto;
  }
  if (watermarkSenior) watermarkSenior.textContent = `Elder: ${d.seniorName} • ${d.address}`;
  if (watermarkGps) watermarkGps.textContent = `GPS: ${d.transit.gpsLat.toFixed(4)}° N, ${d.transit.gpsLng.toFixed(4)}° E (±2.8m Accuracy)`;
  if (watermarkTime) watermarkTime.textContent = d.proof.geofenceTimestamp || '30-OCT-2026 16:22 IST';

  // Populate Visit Summary
  const summaryEl = document.getElementById('ops-proof-visit-summary');
  if (summaryEl) {
    summaryEl.textContent = d.proof.visitSummary || `"Visited ${d.seniorName} for scheduled health check-in. Elder reported morning dizziness. Administered oral electrolyte therapy and assisted with evening prescribed medications. All vital signs checked and verified within safe limits. Reviewed medicine organizer for the next 7 days. Senior is comfortable and resting. Family notified via CareConnect portal."`;
  }
}"""

if old_select_code in js:
    js = js.replace(old_select_code, new_select_code, 1)
    print("Updated selectOpsDispatch to populate scheduled slot, visit photo, and visit summary")

# Also update createOrUpdateOpsDispatch to accept date and timeslot
old_create_def = "function createOrUpdateOpsDispatch(seniorName, coordinatorName, note) {"
new_create_def = "function createOrUpdateOpsDispatch(seniorName, coordinatorName, note, assignedDate, assignedTimeSlot) {"
if old_create_def in js:
    js = js.replace(old_create_def, new_create_def, 1)
    print("Updated createOrUpdateOpsDispatch signature")

# Inside createOrUpdateOpsDispatch, set scheduledDate and scheduledSlot
old_create_body = """  if (existing) {
    existing.assignedCoordinator = coordinatorName;
    existing.status = 'In Transit';
    existing.transit.progressPercent = 35;
    existing.transit.remainingDistanceKm = 2.6;
    existing.transit.etaSeconds = 360;
  }"""

new_create_body = """  if (existing) {
    existing.assignedCoordinator = coordinatorName;
    if (assignedDate) existing.scheduledDate = assignedDate;
    if (assignedTimeSlot) existing.scheduledSlot = assignedTimeSlot;
    existing.status = 'In Transit';
    existing.transit.progressPercent = 35;
    existing.transit.remainingDistanceKm = 2.6;
    existing.transit.etaSeconds = 360;
  }"""

if old_create_body in js:
    js = js.replace(old_create_body, new_create_body, 1)
    print("Updated createOrUpdateOpsDispatch body for existing items")

with open("app.js", "w", encoding="utf-8") as f:
    f.write(js)
print("Updated app.js successfully!")

