import os

with open("app.js", "r", encoding="utf-8") as f:
    code = f.read()

# 1. Add tracking tab trigger in switchOpsTab
target_switch = """  if (tabId === 'area') {
    setTimeout(initOpsRealMap, 100);
  }"""

replacement_switch = """  if (tabId === 'area') {
    setTimeout(initOpsRealMap, 100);
  }
  if (tabId === 'tracking') {
    setTimeout(initOpsTrackingView, 50);
  }"""

if target_switch in code and "tabId === 'tracking'" not in code:
    code = code.replace(target_switch, replacement_switch, 1)
    print("Added tracking hook to switchOpsTab")
else:
    print("switchOpsTab hook already present or target not found")

# 2. Hook confirmOpsAssignModal to create dispatch
target_assign = """  closeOpsAssignModal();
  showToast(`Case assigned to ${chosenCoord} successfully!`, 'success');"""

replacement_assign = """  if (typeof createOrUpdateOpsDispatch === 'function' && currentAssignTargetSenior) {
    createOrUpdateOpsDispatch(currentAssignTargetSenior, chosenCoord, 'Assigned via Command Center');
  }
  closeOpsAssignModal();
  showToast(`Case assigned to ${chosenCoord}! Live Transit & Proof Track activated.`, 'success');"""

if target_assign in code:
    code = code.replace(target_assign, replacement_assign, 1)
    print("Hooked confirmOpsAssignModal")
else:
    print("target_assign not found or already hooked")

# 3. Hook triggerOpsDispatchNurseFor to create dispatch
target_dispatch = """  showToast(`Emergency Nurse ${nurse} dispatched for ${seniorName}! ETA: 12 mins. GPS dispatch tracker active.`, 'success');"""

replacement_dispatch = """  if (typeof createOrUpdateOpsDispatch === 'function') {
    createOrUpdateOpsDispatch(seniorName, nurse, 'Emergency Nurse Dispatched');
  }
  showToast(`Emergency Coordinator ${nurse} dispatched for ${seniorName}! ETA: 12m. Live transit & proof tracking active.`, 'success');"""

if target_dispatch in code:
    code = code.replace(target_dispatch, replacement_dispatch, 1)
    print("Hooked triggerOpsDispatchNurseFor")
else:
    print("target_dispatch not found or already hooked")

# 4. Add the complete Tracking & Proof Module at the end of app.js
tracking_module = """

// ============================================================================
// OPERATIONS MANAGER: LIVE TRANSIT MODE, LOCATION TRACK & PROOF TRACK SYSTEM
// ============================================================================

let OPS_ACTIVE_DISPATCHES = [
  {
    id: "DSP-901",
    seniorId: "PAT-101",
    seniorName: "Ramesh Sharma",
    age: 78,
    gender: "Male",
    phone: "+91 98110-44912",
    address: "B-42, Greater Kailash 1, New Delhi",
    triageIssue: "Critical Missed Check-in & Tachycardic Spike (114 bpm)",
    riskLevel: "High",
    assignedCoordinator: "Sister Kavita Verma, RN",
    coordinatorRole: "Clinical Specialist & Rapid Responder",
    coordinatorPhone: "+91 98765-43210",
    status: "In Transit", // "In Transit" | "Arrived"
    transit: {
      vehicleType: "Rapid EV Medical Two-Wheeler",
      vehicleId: "#DL-01-EV-4421",
      vehicleEmoji: "🛵",
      speedKmh: 38,
      batteryPct: 84,
      batteryRangeKm: 68,
      totalDistanceKm: 4.8,
      remainingDistanceKm: 1.4,
      etaSeconds: 258, // ~4m 18s
      startHub: "Saket Ops Triage Hub (Station #4)",
      routeCorridor: "Outer Ring Road Green Corridor (Saket ➔ Chirag Underpass ➔ GK-1)",
      progressPercent: 65,
      gpsLat: 28.5355,
      gpsLng: 77.2410,
      gpsAccuracy: "±3.2m (Dual-band RTK Lock)",
      signalPriority: true
    },
    proof: {
      geofenceVerified: true,
      geofenceDistance: "8.4m from Doorstep",
      geofenceTimestamp: "Today, 16:22:14 IST",
      geofenceHash: "0x89e27b14c419",
      bedsideVitals: {
        bp: "136/88 mmHg",
        hr: "82 bpm",
        spo2: "98%",
        sugar: "142 mg/dL",
        temp: "98.4°F",
        device: "OMRON-BLE-9921 / AccuChek Guide"
      },
      handshakeOtp: "7194",
      handshakeVerified: true,
      handshakeSignedBy: "Ramesh Sharma (Senior Handshake Token)",
      audioDebrief: {
        duration: "0:38",
        file: "audio_debrief_ramesh.mp3",
        transcript: "Senior experienced postural lightheadedness after missing morning hydration and medication. Administered oral hydration therapy and stabilized for 25 minutes. Vitals normalized. Hospitalization averted.",
        recordedBy: "Sister Kavita Verma, RN"
      },
      resolutionOutcome: "Home Stabilization Achieved • Hospitalization Averted",
      costSaved: "₹45,000 (Emergency ER/ICU Avoided)",
      auditCertificateId: "CERT-DELHI-2026-901"
    }
  },
  {
    id: "DSP-902",
    seniorId: "PAT-102",
    seniorName: "Savitri Devi",
    age: 72,
    gender: "Female",
    phone: "+91 98110-33418",
    address: "C-14, Hauz Khas Enclave, New Delhi",
    triageIssue: "Fall Risk & Acute Hip Pain Detection",
    riskLevel: "High",
    assignedCoordinator: "Brother Amit Banerjee, EMT",
    coordinatorRole: "Emergency Medical Technician & Trauma Care",
    coordinatorPhone: "+91 98765-11223",
    status: "Arrived",
    transit: {
      vehicleType: "Rapid Paramedic Transit Van",
      vehicleId: "#DL-02-MD-8812",
      vehicleEmoji: "🚑",
      speedKmh: 0,
      batteryPct: 92,
      batteryRangeKm: 210,
      totalDistanceKm: 3.6,
      remainingDistanceKm: 0.0,
      etaSeconds: 0,
      startHub: "Safdarjung Emergency Base",
      routeCorridor: "Aurobindo Marg ➔ Hauz Khas Main Arterial",
      progressPercent: 100,
      gpsLat: 28.5494,
      gpsLng: 77.2001,
      gpsAccuracy: "±2.1m (RTK Sat-Lock)",
      signalPriority: false
    },
    proof: {
      geofenceVerified: true,
      geofenceDistance: "4.8m from Doorstep",
      geofenceTimestamp: "Today, 16:02:40 IST",
      geofenceHash: "0x77c10b98a230",
      bedsideVitals: {
        bp: "128/82 mmHg",
        hr: "74 bpm",
        spo2: "99%",
        sugar: "118 mg/dL",
        temp: "98.6°F",
        device: "WelchAllyn-Connex-BT / Braun-77"
      },
      handshakeOtp: "4381",
      handshakeVerified: true,
      handshakeSignedBy: "Savitri Devi (Digital Thumbprint + OTP)",
      audioDebrief: {
        duration: "0:45",
        file: "audio_debrief_savitri.mp3",
        transcript: "Full physical assessment performed. Hip mobility intact; mild soft tissue contusion on lateral thigh with no fracture signs. Applied cold compress, prescribed analgesia SOP, and family notified. Patient comfortable.",
        recordedBy: "Brother Amit Banerjee, EMT"
      },
      resolutionOutcome: "Trauma Cleared • Stabilization at Home",
      costSaved: "₹38,000 (Trauma Bay & Imaging Triage Avoided)",
      auditCertificateId: "CERT-DELHI-2026-902"
    }
  },
  {
    id: "DSP-903",
    seniorId: "PAT-103",
    seniorName: "Anand Verma",
    age: 81,
    gender: "Male",
    phone: "+91 98110-77621",
    address: "E-8, Vasant Vihar, New Delhi",
    triageIssue: "Missed Insulin Dose & Glucose Spike (228 mg/dL)",
    riskLevel: "High",
    assignedCoordinator: "Rajesh Kumar",
    coordinatorRole: "Field Care Buddy & Diabetic Support",
    coordinatorPhone: "+91 98765-88990",
    status: "In Transit",
    transit: {
      vehicleType: "Rapid EV Medical Two-Wheeler",
      vehicleId: "#DL-01-EV-9014",
      vehicleEmoji: "🛵",
      speedKmh: 42,
      batteryPct: 78,
      batteryRangeKm: 56,
      totalDistanceKm: 6.2,
      remainingDistanceKm: 2.8,
      etaSeconds: 495, // 8m 15s
      startHub: "Munirka Triage Post #2",
      routeCorridor: "Nelson Mandela Marg ➔ Vasant Vihar Sector D",
      progressPercent: 45,
      gpsLat: 28.5583,
      gpsLng: 77.1637,
      gpsAccuracy: "±3.8m (Differential GPS)",
      signalPriority: true
    },
    proof: {
      geofenceVerified: false,
      geofenceDistance: "Approaching (1.8km out)",
      geofenceTimestamp: "In Transit (ETA 8m 15s)",
      geofenceHash: "0x3f98...pending",
      bedsideVitals: {
        bp: "148/92 mmHg",
        hr: "88 bpm",
        spo2: "97%",
        sugar: "228 mg/dL",
        temp: "98.6°F",
        device: "Continuous Glucose Monitor Sync"
      },
      handshakeOtp: "5820",
      handshakeVerified: false,
      handshakeSignedBy: "Pending Coordinator Handshake",
      audioDebrief: {
        duration: "0:25",
        file: "audio_prebrief_anand.mp3",
        transcript: "Pre-brief: Insulin delivery kit pre-cleared by Tele-Endocrinologist. Rapid transit unit carrying short-acting insulin analog and ketone test strips. Approaching Vasant Vihar geofence.",
        recordedBy: "Rajesh Kumar (In Transit)"
      },
      resolutionOutcome: "Glycemic Stabilization Protocol Active",
      costSaved: "₹52,000 (Diabetic Ketoacidosis ER Stay Avoided)",
      auditCertificateId: "CERT-DELHI-2026-903"
    }
  }
];

let currentOpsSelectedDispatchId = 'DSP-901';
let opsTransitAutoPlayTimer = null;
let opsTransitIsPlaying = false;
let opsTransitCountdownTimer = null;

// Initialize Live Transit & Proof Track View
function initOpsTrackingView() {
  renderOpsDispatchPills();
  selectOpsDispatch(currentOpsSelectedDispatchId);
  startOpsTransitCountdown();
}

// Render the 3 Dispatch Selector Pills
function renderOpsDispatchPills() {
  const container = document.getElementById('ops-dispatch-selector-container');
  if (!container) return;

  const countPill = document.getElementById('ops-tracking-count-pill');
  if (countPill) countPill.textContent = `${OPS_ACTIVE_DISPATCHES.length} Dispatches Active`;

  container.innerHTML = OPS_ACTIVE_DISPATCHES.map(d => {
    const isSelected = d.id === currentOpsSelectedDispatchId;
    const isArrived = d.status === 'Arrived';
    const statusBg = isArrived ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800';
    const statusText = isArrived ? 'Arrived & Verified' : `In Transit (ETA ${formatEtaMinutes(d.transit.etaSeconds)})`;
    const borderClass = isSelected ? 'border-teal-600 ring-2 ring-teal-500/30 bg-teal-50/30' : 'border-slate-200 hover:border-slate-300 bg-white';

    return `
      <div onclick="selectOpsDispatch('${d.id}')"
        class="cursor-pointer p-3.5 rounded-xl border transition-all text-left shadow-xs ${borderClass}">
        <div class="flex items-center justify-between mb-1">
          <span class="text-xs font-black text-slate-900">${d.seniorName}</span>
          <span class="px-2 py-0.5 rounded-full text-[10px] font-black ${statusBg}">${statusText}</span>
        </div>
        <div class="text-[11px] text-slate-600 flex items-center space-x-1.5 mt-0.5">
          <span>${d.transit.vehicleEmoji}</span>
          <span class="font-bold text-slate-800">${d.assignedCoordinator}</span>
        </div>
        <div class="text-[10px] text-slate-400 mt-1 truncate">
          ${d.triageIssue}
        </div>
      </div>
    `;
  }).join('');
}

// Select a Dispatch and populate all cards
function selectOpsDispatch(dispatchId) {
  currentOpsSelectedDispatchId = dispatchId;
  const d = OPS_ACTIVE_DISPATCHES.find(item => item.id === dispatchId) || OPS_ACTIVE_DISPATCHES[0];
  if (!d) return;

  renderOpsDispatchPills();

  // 1. VO KESE GYA SENIOR TAK (Transit Mode)
  const vehicleTitleEl = document.getElementById('ops-transit-vehicle-title');
  const vehicleIconBoxEl = document.getElementById('ops-transit-vehicle-icon-box');
  const statusPillEl = document.getElementById('ops-transit-status-pill');
  const speedEl = document.getElementById('ops-transit-speed');
  const batteryEl = document.getElementById('ops-transit-battery');
  const distanceEl = document.getElementById('ops-transit-distance');
  const etaEl = document.getElementById('ops-transit-eta');

  if (vehicleTitleEl) vehicleTitleEl.textContent = `${d.transit.vehicleType} (${d.transit.vehicleId})`;
  if (vehicleIconBoxEl) {
    vehicleIconBoxEl.innerHTML = d.transit.vehicleEmoji === '🚑' 
      ? '<i class="fa-solid fa-truck-medical"></i>' 
      : '<i class="fa-solid fa-motorcycle"></i>';
  }

  const isArrived = d.status === 'Arrived';
  if (statusPillEl) {
    statusPillEl.className = isArrived 
      ? 'px-2.5 py-1 rounded-full text-[11px] font-black bg-emerald-100 text-emerald-800'
      : 'px-2.5 py-1 rounded-full text-[11px] font-black bg-blue-100 text-blue-800';
    statusPillEl.textContent = isArrived ? 'Arrived • Doorstep Geofence Verified' : `In Transit • ETA ${formatEtaMinutes(d.transit.etaSeconds)}`;
  }

  if (speedEl) speedEl.textContent = `${d.transit.speedKmh} km/h`;
  if (batteryEl) batteryEl.textContent = `${d.transit.batteryPct}% LFP`;
  if (distanceEl) distanceEl.textContent = `${d.transit.remainingDistanceKm.toFixed(1)} km`;
  if (etaEl) etaEl.textContent = formatEtaDisplay(d.transit.etaSeconds);

  // 2. LOCATION TRACK
  const routeTitleEl = document.getElementById('ops-route-title');
  const gpsCoordsEl = document.getElementById('ops-gps-coords');
  if (routeTitleEl) routeTitleEl.textContent = `${d.transit.startHub} ➔ ${d.address}`;
  if (gpsCoordsEl) gpsCoordsEl.textContent = `${d.transit.gpsLat.toFixed(4)}° N, ${d.transit.gpsLng.toFixed(4)}° E`;

  updateOpsSvgMarkerPosition(d.transit.progressPercent, d.transit.vehicleEmoji);
  updateOpsMilestones(d.transit.progressPercent);

  // 3. PROOF TRACK
  const proofSeniorTitleEl = document.getElementById('ops-proof-senior-title');
  const proofStatusPillEl = document.getElementById('ops-proof-status-pill');
  const proofGeofenceDistEl = document.getElementById('ops-proof-geofence-dist');
  const proofAddressEl = document.getElementById('ops-proof-address');
  const proofGpsTimeEl = document.getElementById('ops-proof-gps-time');
  const proofHashEl = document.getElementById('ops-proof-hash');
  const proofBpEl = document.getElementById('ops-proof-bp');
  const proofHrEl = document.getElementById('ops-proof-hr');
  const proofSpo2El = document.getElementById('ops-proof-spo2');
  const proofSugarEl = document.getElementById('ops-proof-sugar');
  const proofDeviceEl = document.getElementById('ops-proof-device');
  const proofSeniorOtpNameEl = document.getElementById('ops-proof-senior-otp-name');
  const proofOtpDigitsEl = document.getElementById('ops-proof-otp-digits');
  const proofTranscriptEl = document.getElementById('ops-proof-audio-transcript');
  const proofSignEl = document.getElementById('ops-proof-coordinator-sign');
  const proofOutcomeBadgeEl = document.getElementById('ops-proof-outcome-badge');

  if (proofSeniorTitleEl) proofSeniorTitleEl.textContent = `Senior: ${d.seniorName} (${d.seniorId})`;
  if (proofStatusPillEl) {
    proofStatusPillEl.className = d.proof.geofenceVerified 
      ? 'px-2.5 py-1 rounded-full text-[11px] font-black bg-emerald-100 text-emerald-800 flex items-center space-x-1'
      : 'px-2.5 py-1 rounded-full text-[11px] font-black bg-amber-100 text-amber-800 flex items-center space-x-1';
    proofStatusPillEl.innerHTML = d.proof.geofenceVerified 
      ? '<i class="fa-solid fa-check mr-1"></i>Verified Fix' 
      : '<i class="fa-solid fa-clock mr-1"></i>En Route';
  }

  if (proofGeofenceDistEl) proofGeofenceDistEl.textContent = d.proof.geofenceDistance;
  if (proofAddressEl) proofAddressEl.textContent = d.address;
  if (proofGpsTimeEl) proofGpsTimeEl.textContent = `Fix Timestamp: ${d.proof.geofenceTimestamp}`;
  if (proofHashEl) proofHashEl.textContent = `Hash: ${d.proof.geofenceHash}`;

  if (proofBpEl) proofBpEl.textContent = d.proof.bedsideVitals.bp;
  if (proofHrEl) proofHrEl.textContent = d.proof.bedsideVitals.hr;
  if (proofSpo2El) proofSpo2El.textContent = d.proof.bedsideVitals.spo2;
  if (proofSugarEl) proofSugarEl.textContent = d.proof.bedsideVitals.sugar;
  if (proofDeviceEl) proofDeviceEl.textContent = `Device: ${d.proof.bedsideVitals.device}`;

  if (proofSeniorOtpNameEl) proofSeniorOtpNameEl.textContent = `${d.seniorName} (Handshake Token)`;
  if (proofOtpDigitsEl && d.proof.handshakeOtp) {
    const chars = d.proof.handshakeOtp.split('');
    proofOtpDigitsEl.innerHTML = chars.map(c => 
      `<span class="w-6 h-7 bg-teal-50 border border-teal-200 rounded flex items-center justify-center font-black">${c}</span>`
    ).join('');
  }

  if (proofTranscriptEl) proofTranscriptEl.textContent = `"${d.proof.audioDebrief.transcript}"`;
  if (proofSignEl) proofSignEl.textContent = `— Recorded by ${d.proof.audioDebrief.recordedBy}`;
  if (proofOutcomeBadgeEl) proofOutcomeBadgeEl.textContent = d.proof.resolutionOutcome;
}

// Update SVG Moving Marker along corridor path
function updateOpsSvgMarkerPosition(pct, emoji) {
  const marker = document.getElementById('ops-svg-moving-marker');
  const emojiEl = document.getElementById('ops-svg-vehicle-emoji');
  if (!marker) return;

  if (emojiEl) emojiEl.textContent = emoji || '🛵';

  // Interpolate along the SVG curve:
  // Waypoint 1: (50, 140)
  // Waypoint 2: (260, 75)
  // Waypoint 3: (480, 55)
  // Waypoint 4: (650, 130)
  let x = 50, y = 140;
  const p = Math.max(0, Math.min(100, pct)) / 100;

  if (p <= 0.35) {
    const t = p / 0.35;
    x = 50 + t * (260 - 50);
    y = 140 + t * (75 - 140);
  } else if (p <= 0.70) {
    const t = (p - 0.35) / 0.35;
    x = 260 + t * (480 - 260);
    y = 75 + t * (55 - 75);
  } else {
    const t = (p - 0.70) / 0.30;
    x = 480 + t * (650 - 480);
    y = 55 + t * (130 - 55);
  }

  marker.setAttribute('transform', `translate(${Math.round(x)}, ${Math.round(y)})`);
}

// Update Milestones HUD
function updateOpsMilestones(pct) {
  const wp1 = document.getElementById('ops-wp-1');
  const wp2 = document.getElementById('ops-wp-2');
  const wp3 = document.getElementById('ops-wp-3');
  const wp4 = document.getElementById('ops-wp-4');

  if (wp1) wp1.innerHTML = '<span class="text-emerald-400 font-bold block">1. Hub Departed</span><span class="text-slate-400 text-[10px]">16:10 IST</span>';
  if (wp2) {
    wp2.innerHTML = pct >= 35 
      ? '<span class="text-emerald-400 font-bold block">2. Chirag Pass</span><span class="text-slate-400 text-[10px]">Cleared</span>'
      : '<span class="text-slate-400 font-bold block">2. Chirag Pass</span><span class="text-slate-500 text-[10px]">Approaching</span>';
  }
  if (wp3) {
    wp3.innerHTML = pct >= 70
      ? '<span class="text-emerald-400 font-bold block">3. In GK-1 Zone</span><span class="text-slate-400 text-[10px]">Geofence Crossed</span>'
      : pct >= 35
      ? '<span class="text-amber-400 font-bold block">3. In GK-1 Zone</span><span class="text-slate-400 text-[10px]">Active</span>'
      : '<span class="text-slate-400 font-bold block">3. In GK-1 Zone</span><span class="text-slate-500 text-[10px]">Pending</span>';
  }
  if (wp4) {
    wp4.innerHTML = pct >= 100
      ? '<span class="text-emerald-400 font-bold block">4. Doorstep</span><span class="text-emerald-300 text-[10px] font-black">Arrived & Verified</span>'
      : '<span class="text-slate-400 font-bold block">4. Doorstep</span><span class="text-slate-400 text-[10px]">Target 16:22</span>';
  }
}

// Format Seconds into MM:SS
function formatEtaDisplay(seconds) {
  if (seconds <= 0) return 'ARRIVED';
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

function formatEtaMinutes(seconds) {
  if (seconds <= 0) return '0m';
  return `${Math.ceil(seconds / 60)}m`;
}

// Step Simulation Forward manually
function stepOpsTransitSimulation() {
  const d = OPS_ACTIVE_DISPATCHES.find(item => item.id === currentOpsSelectedDispatchId);
  if (!d) return;

  if (d.transit.progressPercent < 100) {
    d.transit.progressPercent = Math.min(100, d.transit.progressPercent + 15);
    d.transit.remainingDistanceKm = Math.max(0, d.transit.remainingDistanceKm - 0.6);
    d.transit.etaSeconds = Math.max(0, d.transit.etaSeconds - 50);

    // Update GPS coordinates slightly towards destination
    d.transit.gpsLat += 0.0012;
    d.transit.gpsLng += 0.0010;

    if (d.transit.progressPercent >= 100) {
      d.status = 'Arrived';
      d.transit.speedKmh = 0;
      d.transit.remainingDistanceKm = 0.0;
      d.transit.etaSeconds = 0;
      d.proof.geofenceVerified = true;
      d.proof.geofenceDistance = '5.4m from Doorstep';
      d.proof.handshakeVerified = true;
      if (soundEngine && typeof soundEngine.playSuccessChime === 'function') soundEngine.playSuccessChime();
      showToast(`Coordinator ${d.assignedCoordinator} arrived at senior ${d.seniorName}'s doorstep! Geofence verified.`, 'success');
    }
  } else {
    // Reset to initial to allow re-simulation
    d.transit.progressPercent = 20;
    d.status = 'In Transit';
    d.transit.speedKmh = 40;
    d.transit.remainingDistanceKm = 2.4;
    d.transit.etaSeconds = 240;
    d.proof.geofenceVerified = false;
    showToast(`Transit simulation reset for ${d.seniorName}.`, 'info');
  }

  selectOpsDispatch(d.id);
}

// Auto-Play Simulation Loop
function toggleOpsTransitAutoPlay() {
  const btn = document.getElementById('ops-transit-autoplay-btn');
  const icon = document.getElementById('ops-transit-play-icon');
  const text = document.getElementById('ops-transit-play-text');

  if (opsTransitIsPlaying) {
    clearInterval(opsTransitAutoPlayTimer);
    opsTransitIsPlaying = false;
    if (btn) btn.className = 'px-4 py-2 rounded-xl bg-[#00a896] hover:bg-[#008779] text-white text-xs font-extrabold shadow-sm flex items-center space-x-1.5 transition-all';
    if (icon) icon.className = 'fa-solid fa-play';
    if (text) text.textContent = 'Auto-Simulate Transit';
  } else {
    opsTransitIsPlaying = true;
    if (btn) btn.className = 'px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-extrabold shadow-sm flex items-center space-x-1.5 transition-all';
    if (icon) icon.className = 'fa-solid fa-pause';
    if (text) text.textContent = 'Pause Simulation';

    opsTransitAutoPlayTimer = setInterval(() => {
      const d = OPS_ACTIVE_DISPATCHES.find(item => item.id === currentOpsSelectedDispatchId);
      if (!d || d.transit.progressPercent >= 100) {
        toggleOpsTransitAutoPlay(); // Stop when arrived
        return;
      }
      stepOpsTransitSimulation();
    }, 1200);
  }
}

// Real-time ticking ETA timer
function startOpsTransitCountdown() {
  if (opsTransitCountdownTimer) clearInterval(opsTransitCountdownTimer);
  opsTransitCountdownTimer = setInterval(() => {
    OPS_ACTIVE_DISPATCHES.forEach(d => {
      if (d.status === 'In Transit' && d.transit.etaSeconds > 0) {
        d.transit.etaSeconds--;
      }
    });

    const activeD = OPS_ACTIVE_DISPATCHES.find(item => item.id === currentOpsSelectedDispatchId);
    if (activeD) {
      const etaEl = document.getElementById('ops-transit-eta');
      if (etaEl) etaEl.textContent = formatEtaDisplay(activeD.transit.etaSeconds);
    }
  }, 1000);
}

// Play Audio Debrief Note with Wave animation
function playOpsAudioDebrief() {
  const d = OPS_ACTIVE_DISPATCHES.find(item => item.id === currentOpsSelectedDispatchId) || OPS_ACTIVE_DISPATCHES[0];
  const icon = document.getElementById('ops-audio-play-icon');
  const label = document.getElementById('ops-audio-play-label');

  if (icon) icon.className = 'fa-solid fa-volume-high animate-bounce text-[9px]';
  if (label) label.textContent = 'Playing Note...';

  if (soundEngine && typeof soundEngine.playTone === 'function') {
    soundEngine.playTone(523, 'sine', 0.2);
    setTimeout(() => soundEngine.playTone(659, 'sine', 0.25), 250);
    setTimeout(() => soundEngine.playTone(784, 'sine', 0.3), 550);
  }

  // Animate waves
  const waveIds = ['ops-wave-1', 'ops-wave-2', 'ops-wave-3', 'ops-wave-4', 'ops-wave-5', 'ops-wave-6', 'ops-wave-7'];
  const originalHeights = ['8px', '16px', '12px', '20px', '8px', '16px', '12px'];

  let waveStep = 0;
  const waveInterval = setInterval(() => {
    waveIds.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.style.height = `${Math.floor(Math.random() * 18 + 6)}px`;
    });
    waveStep++;
    if (waveStep > 12) {
      clearInterval(waveInterval);
      waveIds.forEach((id, idx) => {
        const el = document.getElementById(id);
        if (el) el.style.height = originalHeights[idx];
      });
      if (icon) icon.className = 'fa-solid fa-play text-[9px]';
      if (label) label.textContent = 'Replay Voice Note';
    }
  }, 200);

  showToast(`Playing encrypted clinical debrief voice note from ${d.assignedCoordinator}...`, 'info');
}

// Emergency Signal Priority Siren Ping
function triggerOpsSirenPing() {
  const d = OPS_ACTIVE_DISPATCHES.find(item => item.id === currentOpsSelectedDispatchId) || OPS_ACTIVE_DISPATCHES[0];
  if (soundEngine && typeof soundEngine.playTone === 'function') {
    soundEngine.playTone(880, 'sawtooth', 0.15);
    setTimeout(() => soundEngine.playTone(1174, 'sawtooth', 0.2), 200);
  }
  showToast(`Traffic Signal Priority beacon broadcasted for vehicle ${d.transit.vehicleId}! Green corridor cleared.`, 'success');
}

// Open Proof Certificate Modal
function openOpsProofCertificateModal() {
  const d = OPS_ACTIVE_DISPATCHES.find(item => item.id === currentOpsSelectedDispatchId) || OPS_ACTIVE_DISPATCHES[0];
  const modal = document.getElementById('modal-ops-proof-certificate');
  const content = document.getElementById('ops-certificate-content');
  if (!modal || !content) return;

  content.innerHTML = `
    <!-- Certificate Header Banner -->
    <div class="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-blue-50 border border-emerald-200">
      <div class="flex items-center justify-between">
        <div>
          <span class="text-[10px] font-black uppercase text-emerald-800 tracking-wider">Official Certificate of Clinical Resolution</span>
          <h4 class="text-base font-black text-slate-900 mt-0.5">${d.seniorName} • Case #${d.id}</h4>
          <p class="text-[11px] text-slate-600">${d.address}</p>
        </div>
        <div class="text-right">
          <span class="px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800">
            <i class="fa-solid fa-circle-check mr-1"></i>VERIFIED RESOLUTION
          </span>
          <div class="text-[10px] text-slate-400 mt-1 font-mono">${d.proof.auditCertificateId}</div>
        </div>
      </div>
    </div>

    <!-- 1. Mode of Transit Record -->
    <div class="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
      <div class="font-extrabold text-slate-900 mb-1 flex items-center space-x-1.5">
        <i class="fa-solid fa-route text-teal-600"></i>
        <span>1. Mode of Transit & Response Telematics</span>
      </div>
      <div class="grid grid-cols-3 gap-2 mt-2">
        <div class="bg-white p-2 rounded-lg border border-slate-100">
          <span class="text-[9px] text-slate-400 font-bold uppercase block">Vehicle Unit</span>
          <span class="font-extrabold text-slate-800">${d.transit.vehicleType}</span>
          <span class="text-[10px] text-slate-500 block font-mono">${d.transit.vehicleId}</span>
        </div>
        <div class="bg-white p-2 rounded-lg border border-slate-100">
          <span class="text-[9px] text-slate-400 font-bold uppercase block">Corridor & Distance</span>
          <span class="font-extrabold text-slate-800">${d.transit.totalDistanceKm} km Total</span>
          <span class="text-[10px] text-emerald-600 block font-bold">Signal Priority Used</span>
        </div>
        <div class="bg-white p-2 rounded-lg border border-slate-100">
          <span class="text-[9px] text-slate-400 font-bold uppercase block">Coordinator / EMT</span>
          <span class="font-extrabold text-slate-800">${d.assignedCoordinator}</span>
          <span class="text-[10px] text-slate-500 block">${d.coordinatorRole}</span>
        </div>
      </div>
    </div>

    <!-- 2. Satellite Location & Geofence Fix -->
    <div class="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
      <div class="font-extrabold text-slate-900 mb-1 flex items-center space-x-1.5">
        <i class="fa-solid fa-location-crosshairs text-teal-600"></i>
        <span>2. Satellite GNSS Arrival Geofence Lock</span>
      </div>
      <div class="flex items-center justify-between text-[11px] mt-1 text-slate-600">
        <span>Coordinates: <strong>${d.transit.gpsLat.toFixed(5)}° N, ${d.transit.gpsLng.toFixed(5)}° E</strong></span>
        <span>Accuracy: <strong>${d.transit.gpsAccuracy}</strong></span>
      </div>
      <div class="flex items-center justify-between text-[10px] text-slate-400 mt-1 font-mono">
        <span>Timestamp: ${d.proof.geofenceTimestamp}</span>
        <span>Cryptographic Hash: ${d.proof.geofenceHash}</span>
      </div>
    </div>

    <!-- 3. Bedside Vitals Stream & 4-Digit Handshake OTP -->
    <div class="grid grid-cols-2 gap-3">
      <div class="p-3 bg-slate-50 rounded-xl border border-slate-200">
        <div class="font-extrabold text-slate-900 text-xs mb-1.5">Bedside Vitals Stream</div>
        <div class="space-y-1 text-[11px] text-slate-700">
          <div class="flex justify-between"><span>Blood Pressure:</span><strong class="text-slate-900">${d.proof.bedsideVitals.bp}</strong></div>
          <div class="flex justify-between"><span>Heart Rate:</span><strong class="text-emerald-700">${d.proof.bedsideVitals.hr}</strong></div>
          <div class="flex justify-between"><span>SpO2 Oxygen:</span><strong class="text-teal-700">${d.proof.bedsideVitals.spo2}</strong></div>
          <div class="flex justify-between"><span>Blood Sugar:</span><strong class="text-amber-700">${d.proof.bedsideVitals.sugar}</strong></div>
        </div>
      </div>

      <div class="p-3 bg-slate-50 rounded-xl border border-slate-200">
        <div class="font-extrabold text-slate-900 text-xs mb-1.5">Senior Handshake Token</div>
        <div class="space-y-1.5 text-[11px] text-slate-700">
          <div class="flex items-center justify-between">
            <span>Handshake OTP:</span>
            <span class="font-mono font-black text-sm text-teal-800 bg-white px-2 py-0.5 rounded border border-slate-200">${d.proof.handshakeOtp}</span>
          </div>
          <div class="text-[10px] text-slate-500">${d.proof.handshakeSignedBy}</div>
          <div class="text-[10px] text-emerald-700 font-bold"><i class="fa-solid fa-circle-check mr-1"></i>Zero-Trust Signature Verified</div>
        </div>
      </div>
    </div>

    <!-- 4. Clinical Resolution & Economic Value -->
    <div class="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between">
      <div>
        <span class="text-xs font-black text-emerald-950 block">${d.proof.resolutionOutcome}</span>
        <span class="text-[11px] text-emerald-800 font-medium">${d.proof.costSaved}</span>
      </div>
      <div class="text-right font-mono text-[10px] text-emerald-700 font-bold">
        STATUS: CLOSED & AUDITED
      </div>
    </div>
  `;

  modal.classList.remove('hidden');
}

function closeOpsProofCertificateModal() {
  const modal = document.getElementById('modal-ops-proof-certificate');
  if (modal) modal.classList.add('hidden');
}

// Export Proof Dossier as JSON File
function exportOpsProofJSON() {
  const d = OPS_ACTIVE_DISPATCHES.find(item => item.id === currentOpsSelectedDispatchId) || OPS_ACTIVE_DISPATCHES[0];
  const payload = {
    system: "CareConnect Operations Command Center",
    version: "2.4-RTK",
    exportTimestamp: new Date().toISOString(),
    dispatchRecord: d
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Proof_Dossier_${d.seniorName.replace(/\\s+/g, '_')}_${d.id}.json`;
  a.click();
  URL.revokeObjectURL(url);
  showToast(`Proof Dossier for ${d.seniorName} exported successfully!`, 'success');
}

// Add or update an active dispatch when coordinator is assigned
function createOrUpdateOpsDispatch(seniorName, coordinatorName, note) {
  let existing = OPS_ACTIVE_DISPATCHES.find(d => d.seniorName.toLowerCase() === seniorName.toLowerCase());
  if (existing) {
    existing.assignedCoordinator = coordinatorName;
    existing.status = 'In Transit';
    existing.transit.progressPercent = 35;
    existing.transit.remainingDistanceKm = 2.6;
    existing.transit.etaSeconds = 360;
  } else {
    const newId = `DSP-${900 + OPS_ACTIVE_DISPATCHES.length + 1}`;
    existing = {
      id: newId,
      seniorId: `PAT-${200 + OPS_ACTIVE_DISPATCHES.length}`,
      seniorName: seniorName,
      age: 74,
      gender: "Senior Citizen",
      phone: "+91 98110-55443",
      address: "South Extension Part 2, New Delhi",
      triageIssue: note || "Rapid Response Dispatch",
      riskLevel: "High",
      assignedCoordinator: coordinatorName || "Sister Kavita Verma, RN",
      coordinatorRole: "Field Care Coordinator",
      coordinatorPhone: "+91 98765-43210",
      status: "In Transit",
      transit: {
        vehicleType: "Rapid EV Medical Two-Wheeler",
        vehicleId: `#DL-01-EV-${Math.floor(1000 + Math.random() * 9000)}`,
        vehicleEmoji: "🛵",
        speedKmh: 40,
        batteryPct: 86,
        batteryRangeKm: 72,
        totalDistanceKm: 3.8,
        remainingDistanceKm: 2.1,
        etaSeconds: 310,
        startHub: "Saket Ops Triage Hub (Station #4)",
        routeCorridor: "Ring Road Express Corridor",
        progressPercent: 30,
        gpsLat: 28.5670,
        gpsLng: 77.2210,
        gpsAccuracy: "±3.0m (RTK Fix)",
        signalPriority: true
      },
      proof: {
        geofenceVerified: false,
        geofenceDistance: "Approaching (2.1km out)",
        geofenceTimestamp: "In Transit",
        geofenceHash: `0x${Math.random().toString(16).substring(2, 10)}...`,
        bedsideVitals: {
          bp: "138/86 mmHg (Pending bedside sync)",
          hr: "84 bpm",
          spo2: "98%",
          sugar: "136 mg/dL",
          temp: "98.4°F",
          device: "OMRON-BLE-9921 / Bluetooth Sync"
        },
        handshakeOtp: String(Math.floor(1000 + Math.random() * 9000)),
        handshakeVerified: false,
        handshakeSignedBy: `${seniorName} (Zero-Trust Token)`,
        audioDebrief: {
          duration: "0:30",
          file: "audio_debrief_new.mp3",
          transcript: `Coordinator dispatched to address ${note}. Bedside kit prepared.`,
          recordedBy: coordinatorName || "Sister Kavita Verma, RN"
        },
        resolutionOutcome: "Active Field Care Protocol Initiated",
        costSaved: "₹45,000 (Preventive Stabilization)",
        auditCertificateId: `CERT-DELHI-2026-${newId}`
      }
    };
    OPS_ACTIVE_DISPATCHES.unshift(existing);
  }

  currentOpsSelectedDispatchId = existing.id;
  renderOpsDispatchPills();
}

// Quick action to switch directly to Live Transit & Proof Track for a specific senior
function openOpsTrackingForSenior(seniorName) {
  if (typeof switchOpsTab === 'function') switchOpsTab('tracking');
  let match = OPS_ACTIVE_DISPATCHES.find(d => d.seniorName.toLowerCase() === seniorName.toLowerCase());
  if (!match) {
    createOrUpdateOpsDispatch(seniorName, 'Sister Kavita Verma, RN', 'Direct Triage Inspection');
    match = OPS_ACTIVE_DISPATCHES[0];
  }
  if (match) {
    selectOpsDispatch(match.id);
  }
}
"""

if "OPERATIONS MANAGER: LIVE TRANSIT MODE, LOCATION TRACK & PROOF TRACK SYSTEM" not in code:
    code += tracking_module
    print("Appended Tracking & Proof module to app.js")

with open("app.js", "w", encoding="utf-8") as f:
    f.write(code)

print("Updated app.js successfully!")

