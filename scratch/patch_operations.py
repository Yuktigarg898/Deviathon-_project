import os

with open("index.html", "r", encoding="utf-8") as f:
    html = f.read()

# 1. Update aside in index.html
aside_old = '<aside class="w-full md:w-64 bg-white border-r border-slate-200 flex-shrink-0 flex flex-col justify-between p-4 z-20">'
aside_new = '<aside class="w-full md:w-64 lg:w-72 bg-white border-r border-slate-200 flex-shrink-0 flex flex-col justify-between p-4 z-20 md:h-screen md:overflow-y-auto select-none custom-scrollbar">'
if aside_old in html:
    html = html.replace(aside_old, aside_new, 1)
    print("Updated aside class")
else:
    print("aside_old not found")

# 2. Add ops-nav-tracking in sidebar
alerts_btn = """            <button type="button" onclick="switchOpsTab('alerts')" id="ops-nav-alerts"
              class="ops-nav-btn w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-all">
              <i class="fa-solid fa-bell w-4 text-center text-amber-500"></i>
              <span data-i18n="ops_nav_alerts">Alerts & Cases</span>
            </button>"""

alerts_btn_with_tracking = """            <button type="button" onclick="switchOpsTab('alerts')" id="ops-nav-alerts"
              class="ops-nav-btn w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-all">
              <i class="fa-solid fa-bell w-4 text-center text-amber-500"></i>
              <span data-i18n="ops_nav_alerts">Alerts & Cases</span>
            </button>

            <!-- LIVE TRANSIT & PROOF TRACK -->
            <button type="button" onclick="switchOpsTab('tracking')" id="ops-nav-tracking"
              class="ops-nav-btn w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-all">
              <i class="fa-solid fa-route w-4 text-center text-teal-600"></i>
              <span class="flex-1 text-left" data-i18n="ops_nav_tracking">Transit & Proof Track</span>
              <span class="px-1.5 py-0.5 rounded-md text-[9px] font-black bg-rose-100 text-rose-700 animate-pulse">LIVE</span>
            </button>"""

if alerts_btn in html:
    html = html.replace(alerts_btn, alerts_btn_with_tracking, 1)
    print("Added ops-nav-tracking button")
else:
    print("alerts_btn not found")

# 3. Update main content container & header
main_cnt_old = '<div class="flex-1 flex flex-col min-w-0 bg-[#f8fafc] overflow-x-hidden">'
main_cnt_new = '<div class="flex-1 flex flex-col min-w-0 bg-[#f8fafc] md:h-screen md:overflow-y-auto custom-scrollbar overflow-x-hidden relative">'
if main_cnt_old in html:
    html = html.replace(main_cnt_old, main_cnt_new, 1)
    print("Updated main content container to md:h-screen md:overflow-y-auto")
else:
    print("main_cnt_old not found")

header_old = '<header class="h-16 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">'
header_new = '<header class="h-16 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs flex-shrink-0">'
if header_old in html:
    html = html.replace(header_old, header_new, 1)
    print("Updated ops header to flex-shrink-0")
else:
    print("header_old not found")

# 4. Replace Operations Manager photos with OM initials badges
img_chip_old = """                <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80"
                  alt="Operations Manager" class="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover ring-2 ring-teal-500/30">"""
img_chip_new = """                <div class="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-teal-600 text-white font-extrabold flex items-center justify-center text-[11px] ring-2 ring-teal-500/30 shadow-xs">OM</div>"""
if img_chip_old in html:
    html = html.replace(img_chip_old, img_chip_new, 1)
    print("Replaced user chip img")
else:
    print("img_chip_old not found")

img_dropdown_old = """                  <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80"
                    alt="Operations Manager" class="w-10 h-10 rounded-full object-cover">"""
img_dropdown_new = """                  <div class="w-10 h-10 rounded-full bg-teal-700 text-white font-black flex items-center justify-center text-sm shadow-xs">OM</div>"""
if img_dropdown_old in html:
    html = html.replace(img_dropdown_old, img_dropdown_new, 1)
    print("Replaced user dropdown img")
else:
    print("img_dropdown_old not found")

# Replace profile pane photo
img_profile_old = """                  <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80"
                    alt="Operations Manager" class="w-24 h-24 rounded-full object-cover ring-4 ring-teal-500/20 shadow-md">"""
img_profile_new = """                  <div class="w-24 h-24 rounded-full bg-teal-700 text-white text-2xl font-black flex items-center justify-center ring-4 ring-teal-500/20 shadow-md">OM</div>"""
if img_profile_old in html:
    html = html.replace(img_profile_old, img_profile_new, 1)
    print("Replaced profile pane img")
else:
    print("img_profile_old not found")

# Replace team avatars
team_imgs = [
    ('<img src="https://images.unsplash.com/photo-1594824813571-638f026385a7?w=60&auto=format&fit=crop&q=80" class="w-6 h-6 rounded-full object-cover">', '<div class="w-6 h-6 rounded-full bg-teal-600 text-white text-[10px] font-black flex items-center justify-center">AN</div>'),
    ('<img src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=60&auto=format&fit=crop&q=80" class="w-6 h-6 rounded-full object-cover">', '<div class="w-6 h-6 rounded-full bg-blue-600 text-white text-[10px] font-black flex items-center justify-center">RS</div>'),
    ('<img src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=60&auto=format&fit=crop&q=80" class="w-6 h-6 rounded-full object-cover">', '<div class="w-6 h-6 rounded-full bg-purple-600 text-white text-[10px] font-black flex items-center justify-center">AM</div>'),
    ('<img src="https://images.unsplash.com/photo-1580489944761-15a19d654956?w=60&auto=format&fit=crop&q=80" class="w-6 h-6 rounded-full object-cover">', '<div class="w-6 h-6 rounded-full bg-amber-600 text-white text-[10px] font-black flex items-center justify-center">MG</div>'),
    ('<img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60&auto=format&fit=crop&q=80" class="w-6 h-6 rounded-full object-cover">', '<div class="w-6 h-6 rounded-full bg-emerald-600 text-white text-[10px] font-black flex items-center justify-center">KR</div>')
]
for old_t, new_t in team_imgs:
    if old_t in html:
        html = html.replace(old_t, new_t, 1)
        print("Replaced team table img")

# 5. Replace "Call Senior" with "Call Care Coordinator" in modal-ops-alert-detail
call_senior_btn_old = """            <button type="button" onclick="triggerSimulatedCall('Sharma Ji', '+91 98765 43210'); closeOpsAlertDetail()" class="px-3.5 py-2 rounded-xl bg-teal-50 text-teal-700 hover:bg-teal-100 font-bold text-xs flex items-center space-x-1.5">
              <i class="fa-solid fa-phone"></i>
              <span>Call Senior</span>
            </button>"""

call_senior_btn_new = """            <button type="button" onclick="triggerSimulatedCall('Care Coordinator Sister Kavita', '+91 98765 43210'); closeOpsAlertDetail()" class="px-3.5 py-2 rounded-xl bg-teal-50 text-teal-700 hover:bg-teal-100 font-bold text-xs flex items-center space-x-1.5">
              <i class="fa-solid fa-phone"></i>
              <span>Call Care Coordinator</span>
            </button>"""

if call_senior_btn_old in html:
    html = html.replace(call_senior_btn_old, call_senior_btn_new, 1)
    print("Updated Call Senior button to Call Care Coordinator")
else:
    print("call_senior_btn_old not found")

# 6. Add #ops-subview-tracking before </main>
tracking_subview_html = """
          <!-- ========================================================================= -->
          <!-- TAB: LIVE TRANSIT & PROOF TRACK                                          -->
          <!-- ========================================================================= -->
          <div id="ops-subview-tracking" class="ops-subview hidden space-y-6">

            <!-- Top Header & Live Dispatch Status Ribbon -->
            <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <div class="flex items-center space-x-2.5">
                  <span class="px-2.5 py-1 rounded-lg text-xs font-black bg-rose-100 text-rose-700 border border-rose-200 flex items-center space-x-1.5">
                    <span class="w-2 h-2 rounded-full bg-rose-600 animate-ping"></span>
                    <span>LIVE SATELLITE DISPATCH</span>
                  </span>
                  <span class="text-xs text-slate-400 font-medium">Pan-India Rapid Transit Fleet • Mission Control</span>
                </div>
                <h1 class="text-2xl sm:text-3xl font-extrabold text-[#0e294b] tracking-tight mt-1.5">Care Coordinator Transit & Proof Track</h1>
                <p class="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">Real-time transport telematics, GPS transit corridor, and cryptographic care delivery proof.</p>
              </div>

              <!-- Dispatch Simulation & Action Controls -->
              <div class="flex flex-wrap items-center gap-2">
                <button type="button" onclick="stepOpsTransitSimulation()" class="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 shadow-xs flex items-center space-x-1.5 transition-all">
                  <i class="fa-solid fa-forward-step text-teal-600"></i>
                  <span>Step Transit Forward</span>
                </button>
                <button type="button" onclick="toggleOpsTransitAutoPlay()" id="ops-transit-autoplay-btn" class="px-4 py-2 rounded-xl bg-[#00a896] hover:bg-[#008779] text-white text-xs font-extrabold shadow-sm flex items-center space-x-1.5 transition-all">
                  <i class="fa-solid fa-play" id="ops-transit-play-icon"></i>
                  <span id="ops-transit-play-text">Auto-Simulate Transit</span>
                </button>
                <button type="button" onclick="openOpsProofCertificateModal()" class="px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-extrabold shadow-xs flex items-center space-x-1.5 transition-all">
                  <i class="fa-solid fa-certificate text-emerald-600"></i>
                  <span>View Proof Certificate</span>
                </button>
              </div>
            </div>

            <!-- Active Dispatches Selector Banner -->
            <div class="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
              <div class="flex items-center justify-between mb-3">
                <span class="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center space-x-2">
                  <i class="fa-solid fa-satellite-dish text-teal-600"></i>
                  <span>Active Dispatches & Coordinators (Click to Switch Senior)</span>
                </span>
                <span class="text-[11px] font-bold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full" id="ops-tracking-count-pill">3 Dispatches Active</span>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-3" id="ops-dispatch-selector-container">
                <!-- Dynamically rendered via renderOpsDispatchPills() -->
              </div>
            </div>

            <!-- Main Split: Left Column (Vo Kese Gya + Location Track) & Right Column (Proof Track Dossier) -->
            <div class="grid grid-cols-1 xl:grid-cols-12 gap-6">

              <!-- Left 7 cols: 1. VO KESE GYA SENIOR TAK (Transit Mode) & 2. LOCATION TRACK (Live Route Map) -->
              <div class="xl:col-span-7 space-y-6">

                <!-- 1. TRANSIT MODE CARD ("Vo Kese Gya Senior Tak") -->
                <div class="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
                  <div class="flex items-center justify-between pb-3.5 border-b border-slate-100 mb-4">
                    <div class="flex items-center space-x-2.5">
                      <div class="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-black text-lg shadow-xs" id="ops-transit-vehicle-icon-box">
                        <i class="fa-solid fa-motorcycle" id="ops-transit-vehicle-icon"></i>
                      </div>
                      <div>
                        <div class="text-[10px] font-black text-slate-400 uppercase tracking-wider">Transport & Transit Mode (Vo Kese Gya)</div>
                        <h3 class="text-sm sm:text-base font-extrabold text-slate-900" id="ops-transit-vehicle-title">Rapid EV Medical Two-Wheeler (#DL-01-EV-4421)</h3>
                      </div>
                    </div>
                    <span class="px-2.5 py-1 rounded-full text-[11px] font-black bg-blue-100 text-blue-800" id="ops-transit-status-pill">
                      In Transit • ETA 4m 30s
                    </span>
                  </div>

                  <!-- Telematics Metrics 4-Box Grid -->
                  <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                    <div class="p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <div class="text-[10px] text-slate-400 font-bold uppercase flex items-center justify-between">
                        <span>Transit Speed</span>
                        <i class="fa-solid fa-gauge-high text-teal-600"></i>
                      </div>
                      <div class="text-base sm:text-lg font-black text-slate-900 mt-0.5" id="ops-transit-speed">38 km/h</div>
                      <div class="text-[10px] text-emerald-600 font-bold">Signal Priority Active</div>
                    </div>

                    <div class="p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <div class="text-[10px] text-slate-400 font-bold uppercase flex items-center justify-between">
                        <span>Battery / Charge</span>
                        <i class="fa-solid fa-bolt text-amber-500"></i>
                      </div>
                      <div class="text-base sm:text-lg font-black text-slate-900 mt-0.5" id="ops-transit-battery">84% LFP</div>
                      <div class="text-[10px] text-slate-500 font-medium">68 km range reserve</div>
                    </div>

                    <div class="p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <div class="text-[10px] text-slate-400 font-bold uppercase flex items-center justify-between">
                        <span>Distance Left</span>
                        <i class="fa-solid fa-arrows-left-right text-indigo-500"></i>
                      </div>
                      <div class="text-base sm:text-lg font-black text-slate-900 mt-0.5" id="ops-transit-distance">1.4 km</div>
                      <div class="text-[10px] text-slate-500 font-medium">of 4.2 km corridor</div>
                    </div>

                    <div class="p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <div class="text-[10px] text-slate-400 font-bold uppercase flex items-center justify-between">
                        <span>Live ETA</span>
                        <i class="fa-solid fa-stopwatch text-rose-500"></i>
                      </div>
                      <div class="text-base sm:text-lg font-black text-rose-600 mt-0.5 font-mono" id="ops-transit-eta">04:18</div>
                      <div class="text-[10px] text-rose-700 font-bold animate-pulse">Approaching Doorstep</div>
                    </div>
                  </div>

                  <!-- Transit Corridor & Stowed Medical Equipment -->
                  <div class="bg-gradient-to-r from-teal-50/70 via-slate-50 to-blue-50/70 p-3.5 rounded-xl border border-slate-200">
                    <div class="text-xs font-bold text-slate-800 mb-2 flex items-center justify-between">
                      <span class="flex items-center space-x-2">
                        <i class="fa-solid fa-kit-medical text-teal-600"></i>
                        <span>Medical Equipment Stowed on Transit Vehicle:</span>
                      </span>
                      <span class="text-[10px] text-slate-400 font-mono">Payload Checked: 16:08</span>
                    </div>
                    <div class="flex flex-wrap gap-1.5 text-[11px] font-semibold text-slate-700">
                      <span class="px-2.5 py-1 rounded-lg bg-white border border-slate-200 shadow-2xs flex items-center space-x-1.5">
                        <i class="fa-solid fa-heart-pulse text-rose-500"></i><span>12-Lead Bluetooth ECG Device</span>
                      </span>
                      <span class="px-2.5 py-1 rounded-lg bg-white border border-slate-200 shadow-2xs flex items-center space-x-1.5">
                        <i class="fa-solid fa-lungs text-blue-500"></i><span>2L Emergency O2 Cylinder + Mask</span>
                      </span>
                      <span class="px-2.5 py-1 rounded-lg bg-white border border-slate-200 shadow-2xs flex items-center space-x-1.5">
                        <i class="fa-solid fa-droplet text-amber-500"></i><span>Point-of-Care Glucometer & Troponin</span>
                      </span>
                      <span class="px-2.5 py-1 rounded-lg bg-white border border-slate-200 shadow-2xs flex items-center space-x-1.5">
                        <i class="fa-solid fa-pills text-purple-500"></i><span>Cold-Chain Emergency Meds Pack</span>
                      </span>
                      <span class="px-2.5 py-1 rounded-lg bg-white border border-slate-200 shadow-2xs flex items-center space-x-1.5">
                        <i class="fa-solid fa-tablet-screen-button text-teal-600"></i><span>Biometric Satellite Tablet & Bodycam</span>
                      </span>
                    </div>
                  </div>
                </div>

                <!-- 2. LOCATION TRACK CARD (Live Route Map & GPS Corridor) -->
                <div class="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
                  <div class="flex items-center justify-between pb-3.5 border-b border-slate-100 mb-4">
                    <div class="flex items-center space-x-2.5">
                      <div class="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-black text-lg shadow-xs">
                        <i class="fa-solid fa-map-location-dot"></i>
                      </div>
                      <div>
                        <div class="text-[10px] font-black text-slate-400 uppercase tracking-wider">Location Track • Live GPS Corridor</div>
                        <h3 class="text-sm sm:text-base font-extrabold text-slate-900" id="ops-route-title">Saket Triage Hub ➔ B-42 Greater Kailash 1</h3>
                      </div>
                    </div>
                    <div class="flex items-center space-x-2">
                      <span class="text-[11px] font-mono font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg" id="ops-gps-coords">
                        28.5355° N, 77.2410° E
                      </span>
                    </div>
                  </div>

                  <!-- Stylized Live Vector Route Track Canvas / Map Container -->
                  <div class="relative w-full h-72 sm:h-80 rounded-2xl bg-gradient-to-tr from-slate-900 via-[#0d1b2a] to-[#1b263b] p-4 text-white overflow-hidden shadow-inner border border-slate-700 flex flex-col justify-between">
                    
                    <!-- HUD Top Bar -->
                    <div class="flex items-center justify-between z-10 text-xs">
                      <div class="flex items-center space-x-2 bg-slate-800/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-600 text-slate-200">
                        <span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                        <span class="font-bold">GPS Accuracy: ±3.2m (Dual-band RTK Lock)</span>
                      </div>
                      <div class="flex items-center space-x-2">
                        <button type="button" onclick="triggerOpsSirenPing()" class="px-2.5 py-1 rounded-lg bg-rose-600/90 hover:bg-rose-500 text-white font-bold text-[11px] transition-all shadow-sm flex items-center space-x-1">
                          <i class="fa-solid fa-bullhorn text-xs"></i>
                          <span>Signal Priority</span>
                        </button>
                      </div>
                    </div>

                    <!-- Live Graphical SVG Corridor & Moving Vehicle Marker -->
                    <div class="relative flex-1 my-3 flex items-center justify-center">
                      <svg class="w-full h-full max-h-44" viewBox="0 0 700 180" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <!-- Route Polyline (Roadway Corridor) -->
                        <path d="M 50 140 C 180 140, 240 40, 380 40 C 500 40, 560 130, 650 130" stroke="#0ea5e9" stroke-width="8" stroke-linecap="round" opacity="0.3"/>
                        <path id="ops-svg-route-path" d="M 50 140 C 180 140, 240 40, 380 40 C 500 40, 560 130, 650 130" stroke="#10b981" stroke-width="4" stroke-linecap="round" stroke-dasharray="8 6"/>

                        <!-- Waypoint 1: Triage Hub -->
                        <g transform="translate(50, 140)">
                          <circle r="14" fill="#0284c7" fill-opacity="0.2"/>
                          <circle r="7" fill="#0284c7"/>
                          <text x="0" y="26" fill="#93c5fd" font-size="11" font-weight="bold" text-anchor="middle">Saket Hub</text>
                        </g>

                        <!-- Waypoint 2: Chirag Delhi -->
                        <g transform="translate(260, 75)">
                          <circle r="10" fill="#10b981" fill-opacity="0.2"/>
                          <circle r="5" fill="#10b981"/>
                          <text x="0" y="-14" fill="#6ee7b7" font-size="10" font-weight="bold" text-anchor="middle">Chirag Flyover</text>
                        </g>

                        <!-- Waypoint 3: Geofence Gate -->
                        <g transform="translate(480, 55)">
                          <circle r="10" fill="#f59e0b" fill-opacity="0.2"/>
                          <circle r="5" fill="#f59e0b"/>
                          <text x="0" y="-14" fill="#fcd34d" font-size="10" font-weight="bold" text-anchor="middle">GK-1 Geofence</text>
                        </g>

                        <!-- Waypoint 4: Senior Residence -->
                        <g transform="translate(650, 130)">
                          <circle r="16" fill="#f43f5e" fill-opacity="0.25"/>
                          <circle r="8" fill="#f43f5e"/>
                          <text x="0" y="26" fill="#fda4af" font-size="11" font-weight="bold" text-anchor="middle">Senior Home</text>
                        </g>

                        <!-- Live Moving Vehicle Group (Position dynamic in JS) -->
                        <g id="ops-svg-moving-marker" transform="translate(380, 40)" class="transition-all duration-700 ease-out">
                          <circle r="18" fill="#10b981" fill-opacity="0.3" class="animate-ping"/>
                          <circle r="14" fill="#00a896" stroke="#ffffff" stroke-width="2.5"/>
                          <text x="0" y="4" fill="#ffffff" font-size="10" font-weight="black" text-anchor="middle" id="ops-svg-vehicle-emoji">🛵</text>
                        </g>
                      </svg>
                    </div>

                    <!-- HUD Bottom Milestone Status Bar -->
                    <div class="grid grid-cols-4 gap-2 z-10 text-[11px] font-semibold">
                      <div class="bg-slate-800/80 px-2 py-1.5 rounded-lg border border-slate-700 text-center" id="ops-wp-1">
                        <span class="text-emerald-400 font-bold block">1. Hub Departed</span>
                        <span class="text-slate-400 text-[10px]">16:10 IST</span>
                      </div>
                      <div class="bg-slate-800/80 px-2 py-1.5 rounded-lg border border-slate-700 text-center" id="ops-wp-2">
                        <span class="text-emerald-400 font-bold block">2. Chirag Pass</span>
                        <span class="text-slate-400 text-[10px]">16:14 IST</span>
                      </div>
                      <div class="bg-slate-800/80 px-2 py-1.5 rounded-lg border border-slate-700 text-center" id="ops-wp-3">
                        <span class="text-amber-400 font-bold block">3. In GK-1 Zone</span>
                        <span class="text-slate-400 text-[10px]">Active</span>
                      </div>
                      <div class="bg-slate-800/80 px-2 py-1.5 rounded-lg border border-slate-700 text-center" id="ops-wp-4">
                        <span class="text-slate-400 font-bold block">4. Doorstep</span>
                        <span class="text-slate-400 text-[10px]">Target 16:22</span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              <!-- Right 5 cols: 3. PROOF TRACK (Care Delivery & Verification Dossier) -->
              <div class="xl:col-span-5 space-y-6">

                <div class="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
                  <div class="flex items-center justify-between pb-3.5 border-b border-slate-100">
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

                  <!-- Proof 1: Satellite Geofence GPS Fix -->
                  <div class="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                    <div class="flex items-center justify-between mb-1.5">
                      <span class="text-xs font-bold text-slate-800 flex items-center space-x-1.5">
                        <i class="fa-solid fa-location-crosshairs text-teal-600"></i>
                        <span>1. Satellite GPS Arrival Geofence</span>
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

                  <!-- Proof 2: On-Site Bluetooth Biometric Vitals Sync -->
                  <div class="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                    <div class="flex items-center justify-between mb-2">
                      <span class="text-xs font-bold text-slate-800 flex items-center space-x-1.5">
                        <i class="fa-solid fa-heart-pulse text-rose-500"></i>
                        <span>2. Bedside Bluetooth Vitals Stream</span>
                      </span>
                      <span class="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-blue-100 text-blue-800">Direct Sensor Sync</span>
                    </div>
                    <div class="grid grid-cols-4 gap-2 text-center">
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
                    <div class="text-[10px] text-slate-500 mt-1.5 flex items-center justify-between">
                      <span id="ops-proof-device">Device: OMRON-BLE-9921 / AccuChek</span>
                      <span class="text-emerald-700 font-bold"><i class="fa-solid fa-circle-check text-[9px] mr-1"></i>Calibrated</span>
                    </div>
                  </div>

                  <!-- Proof 3: Senior / Caregiver 4-Digit Handshake OTP -->
                  <div class="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                    <div class="flex items-center justify-between mb-2">
                      <span class="text-xs font-bold text-slate-800 flex items-center space-x-1.5">
                        <i class="fa-solid fa-key text-amber-500"></i>
                        <span>3. Senior Handshake Token & OTP</span>
                      </span>
                      <span class="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-emerald-100 text-emerald-800">Identity Confirmed</span>
                    </div>
                    <div class="flex items-center justify-between bg-white p-2.5 rounded-lg border border-slate-200">
                      <div class="text-xs text-slate-600">
                        <span class="text-[10px] font-bold text-slate-400 block uppercase">4-Digit Security Handshake</span>
                        <span class="font-extrabold text-slate-900" id="ops-proof-senior-otp-name">Ramesh Sharma (Senior)</span>
                      </div>
                      <div class="flex items-center space-x-1 font-mono text-sm font-black text-teal-800" id="ops-proof-otp-digits">
                        <span class="w-6 h-7 bg-teal-50 border border-teal-200 rounded flex items-center justify-center">7</span>
                        <span class="w-6 h-7 bg-teal-50 border border-teal-200 rounded flex items-center justify-center">1</span>
                        <span class="w-6 h-7 bg-teal-50 border border-teal-200 rounded flex items-center justify-center">9</span>
                        <span class="w-6 h-7 bg-teal-50 border border-teal-200 rounded flex items-center justify-center">4</span>
                      </div>
                    </div>
                  </div>

                  <!-- Proof 4: Clinical Audio Debrief & Coordinator Voice Note -->
                  <div class="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                    <div class="flex items-center justify-between mb-2">
                      <span class="text-xs font-bold text-slate-800 flex items-center space-x-1.5">
                        <i class="fa-solid fa-microphone-lines text-teal-600"></i>
                        <span>4. Coordinator Clinical Audio Debrief</span>
                      </span>
                      <button type="button" onclick="playOpsAudioDebrief()" class="px-2.5 py-1 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-bold text-[10px] flex items-center space-x-1 shadow-2xs">
                        <i class="fa-solid fa-play text-[9px]" id="ops-audio-play-icon"></i>
                        <span id="ops-audio-play-label">Play Voice Note</span>
                      </button>
                    </div>
                    <!-- Audio Wave Visualizer -->
                    <div class="h-6 bg-white rounded-lg border border-slate-200 px-3 flex items-center justify-center space-x-1 mb-2">
                      <span class="w-1 bg-teal-500 rounded-full h-2 transition-all duration-300" id="ops-wave-1"></span>
                      <span class="w-1 bg-teal-600 rounded-full h-4 transition-all duration-300" id="ops-wave-2"></span>
                      <span class="w-1 bg-teal-500 rounded-full h-3 transition-all duration-300" id="ops-wave-3"></span>
                      <span class="w-1 bg-teal-400 rounded-full h-5 transition-all duration-300" id="ops-wave-4"></span>
                      <span class="w-1 bg-teal-600 rounded-full h-2 transition-all duration-300" id="ops-wave-5"></span>
                      <span class="w-1 bg-teal-500 rounded-full h-4 transition-all duration-300" id="ops-wave-6"></span>
                      <span class="w-1 bg-teal-400 rounded-full h-3 transition-all duration-300" id="ops-wave-7"></span>
                    </div>
                    <p class="text-[11px] text-slate-600 italic bg-white p-2.5 rounded-lg border border-slate-200 leading-relaxed" id="ops-proof-audio-transcript">
                      "Senior had mild postural dizziness after skipping morning fluids. Administered oral electrolyte therapy and monitored vitals for 25 mins. Vitals restored to safe baseline. Family alerted via app. Hospitalization avoided."
                    </p>
                    <div class="text-[10px] text-slate-500 font-bold mt-1 text-right" id="ops-proof-coordinator-sign">
                      — Recorded by Sister Kavita Verma, RN
                    </div>
                  </div>

                  <!-- Proof 5: Resolution Certificate Action -->
                  <div class="p-3.5 bg-emerald-50/70 rounded-xl border border-emerald-200 flex items-center justify-between">
                    <div>
                      <div class="text-xs font-black text-emerald-900" id="ops-proof-outcome-badge">Stabilized • Hospitalization Averted</div>
                      <div class="text-[10px] text-emerald-700 font-medium">Estimated emergency triage cost saved: ₹45,000</div>
                    </div>
                    <button type="button" onclick="openOpsProofCertificateModal()" class="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-sm transition-all flex items-center space-x-1.5">
                      <i class="fa-solid fa-file-shield text-xs"></i>
                      <span>View Certificate</span>
                    </button>
                  </div>

                </div>

              </div>

            </div>

          </div>
"""

profile_end = '          </div>\n\n        </main>'
if profile_end in html:
    html = html.replace(profile_end, '          </div>' + tracking_subview_html + '\n        </main>', 1)
    print("Added ops-subview-tracking to main")
else:
    # Try alternative matching
    marker = '<div id="ops-subview-profile"'
    pos = html.find(marker)
    if pos != -1:
        end_main = html.find('</main>', pos)
        if end_main != -1:
            html = html[:end_main] + tracking_subview_html + '\n' + html[end_main:]
            print("Added ops-subview-tracking before </main> via offset")
        else:
            print("</main> after profile not found")
    else:
        print("marker ops-subview-profile not found")

# 7. Add #modal-ops-proof-certificate
proof_modal_html = """
    <!-- 6. PROOF DOSSIER & RESOLUTION CERTIFICATE MODAL -->
    <div id="modal-ops-proof-certificate" class="hidden fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div class="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 animate-scaleUp">
        <div class="flex items-center justify-between pb-4 border-b border-slate-100">
          <div class="flex items-center space-x-3">
            <img src="careconnect-emblem.png" alt="CareConnect" class="w-9 h-9 object-contain rounded-xl shadow-xs border border-slate-100 p-0.5">
            <div>
              <h3 class="font-extrabold text-base text-slate-900">Care Delivery Proof & Resolution Certificate</h3>
              <p class="text-[11px] text-slate-400 font-semibold">Cryptographically Verified Clinical Intervention Dossier</p>
            </div>
          </div>
          <button type="button" onclick="closeOpsProofCertificateModal()" class="text-slate-400 hover:text-slate-600 p-1">
            <i class="fa-solid fa-xmark text-lg"></i>
          </button>
        </div>

        <div class="py-5 space-y-4 text-xs text-slate-700" id="ops-certificate-content">
          <!-- Populated dynamically via renderOpsProofCertificate() -->
        </div>

        <div class="pt-4 border-t border-slate-100 flex items-center justify-between">
          <button type="button" onclick="closeOpsProofCertificateModal()" class="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold text-xs">
            Close
          </button>
          <div class="flex items-center space-x-2">
            <button type="button" onclick="exportOpsProofJSON()" class="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center space-x-1.5">
              <i class="fa-solid fa-code text-xs"></i>
              <span>Export Audit JSON</span>
            </button>
            <button type="button" onclick="window.print()" class="px-4 py-2 rounded-xl bg-[#00a896] hover:bg-[#008779] text-white font-extrabold text-xs shadow-md flex items-center space-x-1.5">
              <i class="fa-solid fa-print text-xs"></i>
              <span>Print Certificate</span>
            </button>
          </div>
        </div>
      </div>
    </div>
"""

help_modal = '<div id="modal-ops-help"'
if help_modal in html and 'modal-ops-proof-certificate' not in html:
    html = html.replace(help_modal, proof_modal_html + '\n    ' + help_modal, 1)
    print("Added modal-ops-proof-certificate")

with open("index.html", "w", encoding="utf-8") as f:
    f.write(html)

print("Updated index.html successfully!")

