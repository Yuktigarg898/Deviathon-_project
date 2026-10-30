with open("index.html", "r", encoding="utf-8") as f:
    content = f.read()

target = """            <button type="button" onclick="switchOpsTab('alerts')" id="ops-nav-alerts"
              class="ops-nav-btn w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-all">
              <i class="fa-solid fa-bell w-4 text-center text-amber-500"></i>
              <span data-i18n="ops_nav_alerts">Alerts & Cases</span>
            </button>"""

print("Target in content?", target in content)
print("Target CRLF in content?", target.replace('\n', '\r\n') in content)

