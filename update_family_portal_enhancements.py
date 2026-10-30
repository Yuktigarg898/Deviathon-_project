# -*- coding: utf-8 -*-
"""
Script to apply:
1. Family onboarding bracket: 'Ramesh Sharma (Father • 74 Yrs • Male)' with relation, age and gender.
2. Simple assessment report download and clean slip preview (avoiding whole portal dump).
"""

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# -------------------------------------------------------------
# 1. Update index.html: Selector options & Banner Heading
# -------------------------------------------------------------
old_heading = '<h2 id="family-senior-name-heading" class="text-2xl sm:text-3xl font-extrabold text-white mt-1">\n              Ramesh Sharma (Father, 74y)\n            </h2>'
new_heading = '<h2 id="family-senior-name-heading" class="text-2xl sm:text-3xl font-extrabold text-white mt-1">\n              Ramesh Sharma (Father • 74 Yrs • Male)\n            </h2>'

if old_heading in html:
    html = html.replace(old_heading, new_heading)
    print("Updated family-senior-name-heading in index.html")

old_options = """              <option value="PAT-101">Ramesh Sharma (Father • @senior_ramesh)</option>
              <option value="PAT-102">Savitri Devi (Mother • @senior_savitri)</option>
              <option value="PAT-103">Anand Verma (Uncle • @senior_anand)</option>
              <option value="PAT-104">Meena Iyer (Aunt • @senior_meena)</option>
              <option value="PAT-105">Harish Patel (Grandfather • @senior_harish)</option>"""

new_options = """              <option value="PAT-101">Ramesh Sharma (Father • 74 Yrs • Male)</option>
              <option value="PAT-102">Savitri Devi (Mother • 81 Yrs • Female)</option>
              <option value="PAT-103">Anand Verma (Uncle • 78 Yrs • Male)</option>
              <option value="PAT-104">Meena Iyer (Aunt • 72 Yrs • Female)</option>
              <option value="PAT-105">Harish Patel (Father • 76 Yrs • Male)</option>"""

if old_options in html:
    html = html.replace(old_options, new_options)
    print("Updated selector options with (Relation • Age • Gender)")

# Update report section buttons in index.html
old_report_header = """            <button onclick="printSeniorReport()"
              class="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 self-start sm:self-center">
              <i class="fa-solid fa-file-pdf"></i>
              <span>Download / Print for Doctor</span>
            </button>"""

new_report_header = """            <div class="flex flex-wrap items-center gap-2 self-start sm:self-center">
              <button onclick="downloadSimpleAssessmentReport()"
                class="px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 shadow-sm">
                <i class="fa-solid fa-download"></i>
                <span>Download Assessment Report (.txt)</span>
              </button>
              <button onclick="openSimpleAssessmentModal()"
                class="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 shadow-sm">
                <i class="fa-solid fa-file-lines"></i>
                <span>Preview & Print Slip</span>
              </button>
            </div>"""

if old_report_header in html:
    html = html.replace(old_report_header, new_report_header)
    print("Updated report section buttons in index.html")

# Update top banner print button
old_top_btn = """            <button onclick="printSeniorReport()"
              class="px-3.5 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold border border-white/20 transition-all flex items-center space-x-1.5 shadow-sm"
              title="Print Clinical Summary">
              <i class="fa-solid fa-print"></i>
              <span class="hidden sm:inline">Print Report</span>
            </button>"""

new_top_btn = """            <button onclick="openSimpleAssessmentModal()"
              class="px-3.5 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold border border-white/20 transition-all flex items-center space-x-1.5 shadow-sm"
              title="View & Print Simple Assessment Slip">
              <i class="fa-solid fa-file-waveform"></i>
              <span class="hidden sm:inline">Assessment Slip</span>
            </button>"""

if old_top_btn in html:
    html = html.replace(old_top_btn, new_top_btn)
    print("Updated top banner button in index.html")

# Add the Simple Assessment Report Modal right before </body>
modal_html = """
  <!-- ========================================================================= -->
  <!-- MODAL: SIMPLE HEALTH ASSESSMENT REPORT (CONCISE SLIP - NOT WHOLE PORTAL) -->
  <!-- ========================================================================= -->
  <div id="modal-simple-assessment" class="hidden fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm overflow-y-auto">
    <div class="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden my-6 animate-scaleUp">
      <!-- Modal Top Bar -->
      <div class="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white p-4 sm:p-5 flex items-center justify-between">
        <div class="flex items-center space-x-2.5">
          <div class="w-9 h-9 rounded-xl bg-purple-500/30 text-purple-200 flex items-center justify-center text-lg border border-purple-400/40">
            <i class="fa-solid fa-file-waveform"></i>
          </div>
          <div>
            <h3 class="text-sm sm:text-base font-extrabold text-white">Simple Health Assessment Report</h3>
            <p class="text-[11px] text-purple-200">Concise physiological & functional clinical assessment summary</p>
          </div>
        </div>
        <button onclick="closeSimpleAssessmentModal()" class="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-sm transition-colors">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>

      <!-- Printable Assessment Slip Container -->
      <div id="simple-assessment-slip-content" class="p-5 sm:p-6 text-xs text-slate-800 space-y-4 max-h-[70vh] overflow-y-auto font-sans">
        <!-- Dynamically injected simple assessment summary slip -->
      </div>

      <!-- Modal Footer Action Buttons -->
      <div class="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2">
        <span class="text-[11px] text-slate-500 italic">
          <i class="fa-solid fa-shield-halved text-emerald-600 mr-1"></i> Isolated assessment summary (Portal elements excluded)
        </span>
        <div class="flex items-center space-x-2">
          <button onclick="closeSimpleAssessmentModal()" class="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors">
            Close
          </button>
          <button onclick="downloadSimpleAssessmentReport()" class="px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 shadow-sm">
            <i class="fa-solid fa-download"></i>
            <span>Download .txt File</span>
          </button>
          <button onclick="printSimpleAssessmentSlipOnly()" class="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 shadow-sm">
            <i class="fa-solid fa-print"></i>
            <span>Print Clean Slip</span>
          </button>
        </div>
      </div>
    </div>
  </div>
"""

if "id=\"modal-simple-assessment\"" not in html:
    pos_body = html.rfind('</body>')
    if pos_body != -1:
        html = html[:pos_body] + modal_html + "\n" + html[pos_body:]
        print("Injected modal-simple-assessment into index.html")

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)

print("index.html fully updated!")

