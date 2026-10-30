with open("index.html", "r", encoding="utf-8") as f:
    html = f.read()

# Add Track Transit & Proof button to alert detail modal
target_modal_btns = """          <div class="flex items-center space-x-2">
            <button type="button" onclick="triggerSimulatedCall('Care Coordinator Sister Kavita', '+91 98765 43210'); closeOpsAlertDetail()" class="px-3.5 py-2 rounded-xl bg-teal-50 text-teal-700 hover:bg-teal-100 font-bold text-xs flex items-center space-x-1.5">
              <i class="fa-solid fa-phone"></i>
              <span>Call Care Coordinator</span>
            </button>
            <button type="button" onclick="showToast('Nurse dispatched successfully for Sharma Ji', 'success'); closeOpsAlertDetail()" class="px-4 py-2 rounded-xl bg-[#00a896] hover:bg-[#008779] text-white font-extrabold text-xs shadow-md">
              Dispatch Nurse
            </button>
          </div>"""

replacement_modal_btns = """          <div class="flex items-center space-x-2">
            <button type="button" onclick="triggerSimulatedCall('Care Coordinator Sister Kavita', '+91 98765 43210'); closeOpsAlertDetail()" class="px-3.5 py-2 rounded-xl bg-teal-50 text-teal-700 hover:bg-teal-100 font-bold text-xs flex items-center space-x-1.5">
              <i class="fa-solid fa-phone"></i>
              <span>Call Care Coordinator</span>
            </button>
            <button type="button" onclick="const seniorName = document.getElementById('ops-detail-senior')?.textContent || 'Ramesh Sharma'; closeOpsAlertDetail(); triggerOpsDispatchNurse(); openOpsTrackingForSenior(seniorName);" class="px-4 py-2 rounded-xl bg-[#00a896] hover:bg-[#008779] text-white font-extrabold text-xs shadow-md flex items-center space-x-1.5">
              <i class="fa-solid fa-truck-medical"></i>
              <span>Dispatch & Track</span>
            </button>
            <button type="button" onclick="const seniorName = document.getElementById('ops-detail-senior')?.textContent || 'Ramesh Sharma'; closeOpsAlertDetail(); openOpsTrackingForSenior(seniorName);" class="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center space-x-1.5 transition-all">
              <i class="fa-solid fa-route text-teal-600"></i>
              <span>Track Transit</span>
            </button>
          </div>"""

if target_modal_btns in html:
    html = html.replace(target_modal_btns, replacement_modal_btns, 1)
    print("Updated modal-ops-alert-detail buttons")

with open("index.html", "w", encoding="utf-8") as f:
    f.write(html)

with open("app.js", "r", encoding="utf-8") as f:
    app_js = f.read()

# Add route button in renderOpsCasesTable
target_table_btn = """              <button type="button" onclick="triggerOpsDispatchNurseById('${item.id}')" title="Dispatch Emergency Nurse" class="p-1.5 px-2 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg text-xs font-bold transition-all"><i class="fa-solid fa-truck-medical"></i></button>
              <button type="button" onclick="openOpsAssignModalById('${item.id}')" class="px-2.5 py-1 bg-[#00a896] hover:bg-[#008779] text-white rounded-lg text-xs font-bold transition-all shadow-sm">Assign</button>"""

replacement_table_btn = """              <button type="button" onclick="triggerOpsDispatchNurseById('${item.id}')" title="Dispatch Emergency Nurse" class="p-1.5 px-2 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg text-xs font-bold transition-all"><i class="fa-solid fa-truck-medical"></i></button>
              <button type="button" onclick="openOpsTrackingForSenior('${item.senior}')" title="Track Live Transit & Proof" class="p-1.5 px-2 bg-teal-50 hover:bg-teal-100 text-teal-700 rounded-lg text-xs font-bold transition-all"><i class="fa-solid fa-route"></i></button>
              <button type="button" onclick="openOpsAssignModalById('${item.id}')" class="px-2.5 py-1 bg-[#00a896] hover:bg-[#008779] text-white rounded-lg text-xs font-bold transition-all shadow-sm">Assign</button>"""

if target_table_btn in app_js:
    app_js = app_js.replace(target_table_btn, replacement_table_btn, 1)
    print("Added route track button to renderOpsCasesTable")

with open("app.js", "w", encoding="utf-8") as f:
    f.write(app_js)

print("Patch applied successfully!")

