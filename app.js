/**
 * CareConnect - Core Application Logic & State Engine
 * Four Connected Stakeholder Perspectives:
 * 1. Care Coordinator (Ranked daily prioritisation list, alert root causes & clinical actions)
 * 2. Senior (Voice note, zero-cost missed call check-in, one-tap reply in Hindi or English)
 * 3. Family Member (Weekly wellbeing summary, immediate alert ONLY for serious events)
 * 4. Operations Manager (Alert volumes, SLA response times & outcomes across city or team)
 */

function toggleEnterpriseLogin() {
  const container = document.getElementById('enterprise-form-container');
  const caret = document.getElementById('enterprise-caret');
  if (container) {
    if (container.classList.contains('hidden')) {
      container.classList.remove('hidden');
      if (caret) caret.className = 'fa-solid fa-chevron-up text-[10px] ml-1';
    } else {
      container.classList.add('hidden');
      if (caret) caret.className = 'fa-solid fa-chevron-down text-[10px] ml-1';
    }
  }
}

// Global Application State
const state = {
  currentRole: 'login', // 'login' | 'coordinator' | 'senior' | 'family' | 'operations'
  seniorLanguage: 'en', // 'en' | 'hi'
  audioEnabled: true,
  seniorStatus: {
    checkedIn: false,
    statusType: null, // 'great' | 'tired' | 'medicine' | 'unwell' | 'voice' | 'missed_call'
    lastCheckInTime: null,
    voiceNoteTranscript: null,
    isSerious: true, // Default to true so Family Member sees the serious alert demonstration immediately
  },
  alerts: [
    {
      id: 'ALT-1091',
      rank: 1,
      priority: 'critical',
      priorityScore: 98,
      seniorName: 'Ramesh Sharma',
      age: 74,
      gender: 'M',
      location: 'South Delhi (C-Block, Greater Kailash)',
      phone: '+91 98110-44912',
      familyContact: 'Rahul Sharma (Son) • +91 98711-20931',
      assignedNurse: 'Sister Kavita, RN',
      timeAgo: '14 mins ago',
      vitals: { bp: '158/96', hr: '114 bpm', spo2: '94%', glucose: '138 mg/dL' },
      reason: 'Missed 08:00 AM scheduled check-in + Resting Heart Rate spiked to 114 bpm + zero motion detected for 4 hours.',
      suggestedAction: 'Step 1: Initiate immediate 2-way emergency call. Step 2: Dispatch nearest Field Nurse Sister Kavita (ETA 12 mins). Step 3: Notify son Rahul.',
      status: 'pending' // 'pending' | 'in_progress' | 'resolved'
    },
    {
      id: 'ALT-1088',
      rank: 2,
      priority: 'critical',
      priorityScore: 92,
      seniorName: 'Savitri Devi',
      age: 81,
      gender: 'F',
      location: 'Hauz Khas (Enclave 4)',
      phone: '+91 98103-99210',
      familyContact: 'Priya Verma (Daughter) • +91 99100-33421',
      assignedNurse: 'Brother Amit, Paramedic',
      timeAgo: '28 mins ago',
      vitals: { bp: '142/88', hr: '88 bpm', spo2: '97%', glucose: '110 mg/dL' },
      reason: 'Bathroom motion impact sensor triggered at 06:45 AM. Voice note transcript analysis: "अचानक चक्कर आ गए थे और उठने में दर्द हो रहा है" (Reported sudden dizziness and pain on standing).',
      suggestedAction: 'Priority dispatch field paramedic Brother Amit for fracture/hip assessment. Coordinate tele-radiology if immobilized.',
      status: 'pending'
    },
    {
      id: 'ALT-1074',
      rank: 3,
      priority: 'high',
      priorityScore: 84,
      seniorName: 'Anand Verma',
      age: 78,
      gender: 'M',
      location: 'Saket (Sector 3)',
      phone: '+91 98734-11823',
      familyContact: 'Deepak Verma (Son) • +91 98112-99881',
      assignedNurse: 'Rajesh Kumar (Buddy)',
      timeAgo: '1 hr ago',
      vitals: { bp: '132/84', hr: '76 bpm', spo2: '98%', glucose: '228 mg/dL' },
      reason: 'Consecutive 2-day missed evening Insulin intake reminder + Bluetooth glucometer sync indicates elevated fasting sugar (228 mg/dL).',
      suggestedAction: 'Dispatch Community Buddy Rajesh for doorstep medication adherence check & verify cold-chain storage of insulin pens.',
      status: 'pending'
    },
    {
      id: 'ALT-1065',
      rank: 4,
      priority: 'high',
      priorityScore: 78,
      seniorName: 'Meena Iyer',
      age: 72,
      gender: 'F',
      location: 'Vasant Kunj (Pocket B)',
      phone: '+91 98188-77219',
      familyContact: 'Karthik Iyer (Son in Bengaluru) • +91 97400-55120',
      assignedNurse: 'Sister Sunita, Counselor',
      timeAgo: '2 hrs ago',
      vitals: { bp: '124/80', hr: '72 bpm', spo2: '98%', glucose: '105 mg/dL' },
      reason: 'Hindi voice note sentiment score classified as "Severe Sadness & Disorientation" on bereavement anniversary.',
      suggestedAction: 'Schedule a 15-minute compassionate reassurance call with Senior Buddy Sunita & send wellness update to son Karthik.',
      status: 'pending'
    },
    {
      id: 'ALT-1051',
      rank: 5,
      priority: 'moderate',
      priorityScore: 62,
      seniorName: 'Harish Patel',
      age: 76,
      gender: 'M',
      location: 'Malviya Nagar',
      phone: '+91 98199-33812',
      familyContact: 'Sneha Patel (Daughter) • +91 98200-44910',
      assignedNurse: 'Sister Kavita, RN',
      timeAgo: '3 hrs ago',
      vitals: { bp: '138/86', hr: '74 bpm', spo2: '97%', glucose: '120 mg/dL' },
      reason: 'Automated weekly blood pressure cuff sync offline for 48 hours.',
      suggestedAction: 'Send automated IVR call to prompt senior to turn on Bluetooth cuff or offer phone-guided reading.',
      status: 'pending'
    }
  ],
  resolvedAlerts: [
    {
      id: 'ALT-1040',
      seniorName: 'Gurdial Singh (79 yrs)',
      reason: 'Morning check-in delay (was at Gurudwara)',
      resolvedBy: 'Sister Kavita',
      outcome: 'Telephonic confirmation of safety',
      resolvedAt: 'Today, 09:15 AM'
    },
    {
      id: 'ALT-1038',
      seniorName: 'Kamla Nehru (75 yrs)',
      reason: 'Slight cough reported via voice note',
      resolvedBy: 'Dr. Kapoor (Tele-consult)',
      outcome: 'Cough syrup prescription dispatched',
      resolvedAt: 'Today, 08:45 AM'
    }
  ],
  opsMetrics: {
    city: 'delhi',
    team: 'all',
    timeRange: 'today',
    totalAlerts: 342,
    activeAlerts: 14,
    resolvedAlerts: 328,
    criticalAlerts: 18,
    highAlerts: 64,
    routineAlerts: 260,
    avgResponseMinutes: 6.4,
    criticalSlaMinutes: 2.1,
    p95ResponseMinutes: 11.4,
    nurseEtaMinutes: 14.2,
    avertedERCount: 24,
    teleResolvedPercent: 62,
    nurseResolvedPercent: 28,
    erEscalatedPercent: 2.4,
  },
  charts: {
    familyVitals: null,
    opsVolume: null,
    opsOutcomes: null
  }
};

// Bilingual Localization Dictionary for Senior View (English & Hindi)
const translations = {
  en: {
    senior_badge: "Senior Companion View",
    senior_greeting: "Good Morning, Ramesh ji! 🙏",
    senior_subgreeting: "How are you feeling today? Tap, talk, or give a missed call.",
    today_status_label: "Today's Check-in Status:",
    status_pending: "Check-in Pending for Today",
    status_done_great: "Checked In: Feeling Great! 😊 (Updated to Care Team)",
    status_done_tired: "Checked In: A Bit Tired 🥱 (Caregiver Alerted)",
    status_done_medicine: "Checked In: Medicine Taken 💊 (Recorded)",
    status_done_unwell: "Alert Sent: Feeling Unwell 🤒 (Priority Coordinator Calling)",
    status_done_missed_call: "Missed Call Check-in Logged! 📞 Safe & Sound",
    status_done_voice: "Voice Note Sent to Care Team 🎙️ (Transcribed)",
    read_aloud_btn: "Listen Aloud / बोलकर सुनाएं",
    way1_title: "1. One-Tap Reply",
    way1_subtitle: "Tap how you feel right now",
    status_btn_great: "Feeling Great!",
    status_btn_great_sub: "Sab badhiya hai",
    status_btn_tired: "A Bit Tired",
    status_btn_tired_sub: "Thoda thaka hua",
    status_btn_meds: "Took Medicine",
    status_btn_meds_sub: "Dawa le li hai",
    status_btn_unwell: "Feeling Unwell",
    status_btn_unwell_sub: "Tabiyat theek nahi",
    way2_title: "2. Voice Note",
    ai_transcription_pill: "AI Voice Sentiment Active",
    voice_desc: "Press the big microphone button, speak naturally in Hindi or English, and we will update your care team immediately.",
    mic_instruction: "Tap to Start Speaking",
    mic_recording: "Listening... speak freely (Tap to Stop)",
    transcript_title: "Transcribed Voice Note:",
    send_voice_btn: "Send to Coordinator",
    way3_title: "3. Missed-Call Check-in",
    free_pill: "100% Free Toll-Free",
    missed_call_desc: "No internet or smartphone required. Simply dial this number and disconnect after 1 ring. We automatically register your safety.",
    missed_call_action: "Simulate Missed Call Now",
    sos_title: "Emergency SOS Assistance",
    sos_desc: "Feel severe chest pain, fall, or sudden distress? Press this to alert your Care Coordinator and son Rahul immediately.",
    sos_btn: "PRESS FOR SOS (मदद)",
    spoken_greeting: "Namaste Ramesh ji. We are here with you. Please tap how you feel, speak a voice note, or give a missed call.",
  },
  hi: {
    senior_badge: "वरिष्ठ साथी सेवा (बुज़ुर्ग व्यू)",
    senior_greeting: "सुप्रभात रमेश जी! 🙏",
    senior_subgreeting: "आज आप कैसा महसूस कर रहे हैं? टैप करें, बोलें या मिस्ड कॉल दें।",
    today_status_label: "आज का चेक-इन विवरण:",
    status_pending: "आज का चेक-इन अभी बाकी है",
    status_done_great: "चेक-इन पूरा: सब बढ़िया है! 😊 (केयर टीम को सूचित)",
    status_done_tired: "चेक-इन पूरा: थोड़ा थकावट महसूस हो रही है 🥱",
    status_done_medicine: "चेक-इन पूरा: दवाइयाँ समय पर ले ली हैं 💊",
    status_done_unwell: "सहायता अलर्ट भेजा गया: स्वास्थ्य ठीक नहीं 🤒",
    status_done_missed_call: "मिस्ड कॉल चेक-इन दर्ज हुआ! 📞 आप सुरक्षित हैं",
    status_done_voice: "आवाज़ संदेश केयर टीम को भेज दिया गया 🎙️",
    read_aloud_btn: "बोलकर सुनाएं (आवाज़ में सुनें)",
    way1_title: "१. एक टैप से बताएं",
    way1_subtitle: "बस एक बटन दबाकर अपनी स्थिति बताएं",
    status_btn_great: "सब बढ़िया है!",
    status_btn_great_sub: "स्वस्थ और प्रसन्न",
    status_btn_tired: "थोड़ा थका हुआ",
    status_btn_tired_sub: "कमजोरी महसूस हो रही है",
    status_btn_meds: "दवा ले ली है",
    status_btn_meds_sub: "सुबह की सभी गोलियां खाई",
    status_btn_unwell: "तबियत ठीक नहीं",
    status_btn_unwell_sub: "डॉक्टर / नर्स की जरूरत है",
    way2_title: "२. आवाज़ संदेश भेजें",
    ai_transcription_pill: "आर्टिफिशियल इंटेलिजेंस आवाज़ पहचान",
    voice_desc: "माइक बटन दबाएं और हिंदी या अंग्रेजी में बेझिझक बोलें। हम आपकी बात तुरंत केयर कोऑर्डिनेटर तक पहुंचाएंगे।",
    mic_instruction: "बोलने के लिए माइक दबाएं",
    mic_recording: "सुन रहे हैं... बोलिए (रोकने के लिए दोबारा दबाएं)",
    transcript_title: "लिखा हुआ आवाज़ संदेश:",
    send_voice_btn: "केयर टीम को भेजें",
    way3_title: "३. निःशुल्क मिस्ड कॉल चेक-इन",
    free_pill: "निःशुल्क टोल-फ्री",
    missed_call_desc: "इंटरनेट या ऐप चलाने की जरूरत नहीं। बस १८००-२०२-२२७३ पर एक घंटी देकर फोन काट दें। हम समझ जाएंगे आप सुरक्षित हैं।",
    missed_call_action: "अभी मिस्ड कॉल दर्ज करें",
    sos_title: "आपातकालीन एसओएस सहायता",
    sos_desc: "गंभीर छाती में दर्द, चक्कर, गिरने या बेचैनी में तुरंत यह लाल बटन दबाएं। नर्स और बेटे राहुल को तुरंत सायरन अलर्ट पहुंचेगा।",
    sos_btn: "आपातकालीन मदद (SOS)",
    spoken_greeting: "नमस्ते रमेश जी। हम हमेशा आपके साथ हैं। कृपया बताएं आज आप कैसा महसूस कर रहे हैं, या एक मिस्ड कॉल दें।",
  }
};

// Web Audio API Synthesizer (Zero external dependencies; works 100% offline)
const soundEngine = {
  ctx: null,
  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
  },
  playTone(freq, type, duration, delay = 0) {
    if (!state.audioEnabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime + delay);
      
      gain.gain.setValueAtTime(0.15, this.ctx.currentTime + delay);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + delay + duration);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(this.ctx.currentTime + delay);
      osc.stop(this.ctx.currentTime + delay + duration);
    } catch (e) {
      console.warn('Audio play error:', e);
    }
  },
  playSuccessChime() {
    this.playTone(523.25, 'sine', 0.15, 0);    // C5
    this.playTone(659.25, 'sine', 0.15, 0.12); // E5
    this.playTone(783.99, 'sine', 0.3, 0.24);  // G5
  },
  playWarningChime() {
    this.playTone(440, 'triangle', 0.2, 0);
    this.playTone(370, 'triangle', 0.35, 0.2);
  },
  playEmergencySiren() {
    this.playTone(880, 'sawtooth', 0.25, 0);
    this.playTone(659, 'sawtooth', 0.25, 0.25);
    this.playTone(880, 'sawtooth', 0.25, 0.5);
  },
  playPhoneRing() {
    this.playTone(440, 'sine', 0.4, 0);
    this.playTone(480, 'sine', 0.4, 0);
    this.playTone(440, 'sine', 0.4, 0.6);
    this.playTone(480, 'sine', 0.4, 0.6);
  }
};

// =========================================================================
// APPLICATION INITIALIZATION
// =========================================================================
document.addEventListener('DOMContentLoaded', () => {
  // Start on the Login / Role Selection Page
  navigateRole('login');
  renderCoordinatorAlerts();
  renderOpsTeamTable();
  populateOpsIncidentStream();
});

// Navigation between the 4 Stakeholder Views + Login
function navigateRole(role) {
  state.currentRole = role;
  
  // View elements
  const views = {
    login: document.getElementById('view-login'),
    coordinator: document.getElementById('view-coordinator'),
    senior: document.getElementById('view-senior'),
    family: document.getElementById('view-family'),
    operations: document.getElementById('view-operations')
  };

  const header = document.getElementById('global-header');
  const mobileNav = document.getElementById('mobile-role-nav');

  // Toggle Visibility
  Object.keys(views).forEach(key => {
    if (views[key]) {
      if (key === role) {
        views[key].classList.remove('hidden');
      } else {
        views[key].classList.add('hidden');
      }
    }
  });

  // Global header visibility
  if (role === 'login') {
    if (header) header.classList.add('hidden');
    if (mobileNav) mobileNav.classList.add('hidden');
    document.title = "CareConnect - Connected Healthcare & Elder Support";
  } else {
    if (header) header.classList.remove('hidden');
    if (mobileNav) mobileNav.classList.remove('hidden');
    updateHeaderUserBadge(role);
    updateNavPills(role);
    
    // View-specific initializations
    if (role === 'family') {
      setTimeout(initFamilyVitalsChart, 100);
    } else if (role === 'operations') {
      setTimeout(initOpsCharts, 100);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

// 1-Click Quick Login as a specific role
function loginAs(role) {
  soundEngine.playSuccessChime();
  navigateRole(role);
  showToast(`Signed in as ${getRoleDisplayName(role)}`, 'success');
}

// Handle traditional form submission
function handleFormLogin(e) {
  e.preventDefault();
  const select = document.getElementById('login-role-select');
  const targetRole = select ? select.value : 'coordinator';
  loginAs(targetRole);
}

function logout() {
  soundEngine.playWarningChime();
  navigateRole('login');
  showToast('Logged out to Role Selector', 'info');
}

function getRoleDisplayName(role) {
  switch (role) {
    case 'coordinator': return 'Care Coordinator';
    case 'senior': return 'Senior Companion';
    case 'family': return 'Family Member';
    case 'operations': return 'Operations Manager';
    default: return 'User';
  }
}

function updateHeaderUserBadge(role) {
  const avatar = document.getElementById('current-user-avatar');
  const name = document.getElementById('current-user-name');
  const label = document.getElementById('current-user-role-label');

  if (!avatar || !name || !label) return;

  if (role === 'coordinator') {
    avatar.textContent = 'NK';
    avatar.className = 'w-8 h-8 rounded-full bg-teal-100 border border-teal-300 text-teal-800 flex items-center justify-center font-bold text-xs';
    name.textContent = 'Nurse Kavita';
    label.textContent = 'Care Coordinator';
    label.className = 'text-[10px] text-teal-600 font-semibold uppercase tracking-wider';
  } else if (role === 'senior') {
    avatar.textContent = 'RS';
    avatar.className = 'w-8 h-8 rounded-full bg-amber-100 border border-amber-300 text-amber-800 flex items-center justify-center font-bold text-xs';
    name.textContent = 'Ramesh Sharma';
    label.textContent = 'Senior (74 Yrs)';
    label.className = 'text-[10px] text-amber-600 font-semibold uppercase tracking-wider';
  } else if (role === 'family') {
    avatar.textContent = 'RS';
    avatar.className = 'w-8 h-8 rounded-full bg-indigo-100 border border-indigo-300 text-indigo-800 flex items-center justify-center font-bold text-xs';
    name.textContent = 'Rahul Sharma';
    label.textContent = 'Son / Family Member';
    label.className = 'text-[10px] text-indigo-600 font-semibold uppercase tracking-wider';
  } else if (role === 'operations') {
    avatar.textContent = 'AK';
    avatar.className = 'w-8 h-8 rounded-full bg-blue-100 border border-blue-300 text-blue-800 flex items-center justify-center font-bold text-xs';
    name.textContent = 'Arun Kapoor';
    label.textContent = 'Operations Director';
    label.className = 'text-[10px] text-blue-600 font-semibold uppercase tracking-wider';
  }
}

function updateNavPills(activeRole) {
  const pills = ['coordinator', 'senior', 'family', 'operations'];
  pills.forEach(p => {
    const el = document.getElementById(`pill-${p}`);
    if (el) {
      if (p === activeRole) {
        el.classList.add('active');
      } else {
        el.classList.remove('active');
      }
    }
  });

  // Update alert badge count in Coordinator pill
  const activeCount = state.alerts.filter(a => a.status !== 'resolved').length;
  const countBadge = document.getElementById('nav-alert-count');
  if (countBadge) {
    countBadge.textContent = activeCount;
    countBadge.style.display = activeCount > 0 ? 'inline-flex' : 'none';
  }
}

function toggleAudioEffects() {
  state.audioEnabled = !state.audioEnabled;
  const icon = document.getElementById('sound-icon');
  if (icon) {
    if (state.audioEnabled) {
      icon.className = 'fa-solid fa-volume-high text-sm text-teal-600';
      showToast('Audio & chimes enabled', 'info');
      soundEngine.playSuccessChime();
    } else {
      icon.className = 'fa-solid fa-volume-xmark text-sm text-slate-400';
      showToast('Audio muted', 'info');
    }
  }
}

// =========================================================================
// VIEW 1: CARE COORDINATOR LOGIC
// Requirement: A ranked daily list of seniors to prioritise, with the reason
// for each alert and a suggested action.
// =========================================================================
function renderCoordinatorAlerts() {
  const container = document.getElementById('coordinator-alert-list');
  if (!container) return;

  const searchInput = document.getElementById('coordinator-search-input');
  const priorityFilter = document.getElementById('coordinator-priority-filter');
  
  const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
  const filter = priorityFilter ? priorityFilter.value : 'all';

  // Filter alerts
  let list = state.alerts.filter(item => {
    if (item.status === 'resolved') return false;
    if (filter !== 'all' && item.priority !== filter) return false;
    if (query) {
      const match = item.seniorName.toLowerCase().includes(query) ||
                    item.reason.toLowerCase().includes(query) ||
                    item.location.toLowerCase().includes(query);
      if (!match) return false;
    }
    return true;
  });

  // Sort strictly by priority rank
  list.sort((a, b) => a.rank - b.rank);

  // Update Summary Stats
  const critCount = state.alerts.filter(a => a.priority === 'critical' && a.status !== 'resolved').length;
  const highCount = state.alerts.filter(a => a.priority === 'high' && a.status !== 'resolved').length;
  const totalActive = state.alerts.filter(a => a.status !== 'resolved').length;
  const totalResolved = state.resolvedAlerts.length;

  document.getElementById('stat-critical-count').textContent = critCount;
  document.getElementById('stat-high-count').textContent = highCount;
  document.getElementById('stat-active-cases').textContent = totalActive;
  document.getElementById('stat-resolved-count').textContent = totalResolved;

  if (list.length === 0) {
    container.innerHTML = `
      <div class="bg-white rounded-2xl p-12 text-center border border-slate-200">
        <div class="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center text-2xl mb-3">
          <i class="fa-solid fa-circle-check"></i>
        </div>
        <h3 class="text-base font-bold text-slate-800">Priority Queue Clear!</h3>
        <p class="text-xs text-slate-500 mt-1">All seniors for this filter have been attended to or verified safe.</p>
        <button onclick="refreshCoordinatorQueue()" class="mt-4 px-4 py-2 bg-teal-600 text-white rounded-xl text-xs font-bold shadow-sm">
          Reset Filter & Sync
        </button>
      </div>
    `;
    return;
  }

  container.innerHTML = list.map(item => {
    // Style configurations based on priority
    let borderClass = 'border-slate-200';
    let badgeClass = 'bg-slate-100 text-slate-700';
    let rankBadgeClass = 'bg-slate-800 text-white';
    let pulseEffect = '';

    if (item.priority === 'critical') {
      borderClass = 'border-rose-300 ring-1 ring-rose-200 bg-rose-50/20';
      badgeClass = 'bg-rose-100 text-rose-800 border border-rose-200';
      rankBadgeClass = 'bg-rose-600 text-white shadow-md shadow-rose-600/30';
      pulseEffect = '<span class="w-2 h-2 rounded-full bg-rose-500 animate-ping mr-1"></span>';
    } else if (item.priority === 'high') {
      borderClass = 'border-amber-300 bg-amber-50/15';
      badgeClass = 'bg-amber-100 text-amber-800 border border-amber-200';
      rankBadgeClass = 'bg-amber-600 text-white';
    } else {
      borderClass = 'border-slate-200';
      badgeClass = 'bg-blue-100 text-blue-800';
      rankBadgeClass = 'bg-blue-600 text-white';
    }

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
          </div>

          <!-- Risk Score & Care Specialist Pill -->
          <div class="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100">
            <div class="text-xs font-semibold text-slate-500">Triage Risk Score:</div>
            <div class="font-extrabold text-sm sm:text-base ${item.priority === 'critical' ? 'text-rose-600' : 'text-slate-800'}">
              ${item.priorityScore} / 100
            </div>
          </div>
        </div>

        <!-- Middle Row: ROOT CAUSE ALERT REASON & SUGGESTED ACTION -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
          
          <!-- 1. Reason for Alert -->
          <div class="bg-slate-50 rounded-xl p-3.5 border border-slate-200/80">
            <div class="flex items-center space-x-1.5 text-xs font-bold text-rose-700 uppercase tracking-wider mb-1.5">
              <i class="fa-solid fa-circle-exclamation"></i>
              <span>Root Reason for Alert:</span>
            </div>
            <p class="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
              ${item.reason}
            </p>
            
            <!-- Biometric telemetry tags -->
            <div class="mt-3 flex flex-wrap items-center gap-1.5 text-[11px]">
              <span class="bg-white px-2 py-0.5 rounded border border-slate-200 font-mono text-slate-600">BP: <strong class="text-slate-900">${item.vitals.bp}</strong></span>
              <span class="bg-white px-2 py-0.5 rounded border border-slate-200 font-mono text-slate-600">HR: <strong class="${item.priority === 'critical' ? 'text-rose-600 font-bold' : 'text-slate-900'}">${item.vitals.hr}</strong></span>
              <span class="bg-white px-2 py-0.5 rounded border border-slate-200 font-mono text-slate-600">SpO2: <strong class="text-slate-900">${item.vitals.spo2}</strong></span>
            </div>
          </div>

          <!-- 2. Suggested Clinical Action -->
          <div class="bg-teal-50/60 rounded-xl p-3.5 border border-teal-200/80 flex flex-col justify-between">
            <div>
              <div class="flex items-center space-x-1.5 text-xs font-bold text-teal-800 uppercase tracking-wider mb-1.5">
                <i class="fa-solid fa-list-check"></i>
                <span>Suggested Clinical Action:</span>
              </div>
              <p class="text-xs sm:text-sm text-teal-950 leading-relaxed font-semibold">
                ${item.suggestedAction}
              </p>
            </div>
            <div class="mt-2 text-[11px] text-teal-700 flex items-center justify-between">
              <span>Assigned Specialist: <strong>${item.assignedNurse}</strong></span>
              <span class="font-bold text-teal-800">SLA Target: &lt;15 mins</span>
            </div>
          </div>

        </div>

        <!-- Bottom Action Buttons: Call, Dispatch, Resolve -->
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
        </div>

      </div>
    `;
  }).join('');
}

function filterCoordinatorAlerts() {
  renderCoordinatorAlerts();
}

function refreshCoordinatorQueue() {
  soundEngine.playSuccessChime();
  const searchInput = document.getElementById('coordinator-search-input');
  const priorityFilter = document.getElementById('coordinator-priority-filter');
  if (searchInput) searchInput.value = '';
  if (priorityFilter) priorityFilter.value = 'all';
  renderCoordinatorAlerts();
  showToast('Queue synced with real-time biometric feed', 'info');
}

// Interactive Call Simulation
let callInterval = null;
function openCallModal(alertId, name, phone) {
  soundEngine.playPhoneRing();
  const modal = document.getElementById('modal-call');
  const modalName = document.getElementById('modal-call-name');
  const modalPhone = document.getElementById('modal-call-phone');
  const modalStatus = document.getElementById('modal-call-status');
  const modalTimer = document.getElementById('modal-call-timer');

  if (modalName) modalName.textContent = name;
  if (modalPhone) modalPhone.textContent = `${phone} • Direct Line`;
  if (modalStatus) modalStatus.textContent = "Connecting 2-Way Line...";
  if (modalTimer) modalTimer.textContent = "Dialing senior home terminal...";

  modal.classList.remove('hidden');

  let seconds = 0;
  if (callInterval) clearInterval(callInterval);
  setTimeout(() => {
    if (modalStatus) modalStatus.textContent = "Call Connected • Audio Stream Active";
    soundEngine.playTone(600, 'sine', 0.1);
    callInterval = setInterval(() => {
      seconds++;
      const m = Math.floor(seconds / 60).toString().padStart(2, '0');
      const s = (seconds % 60).toString().padStart(2, '0');
      if (modalTimer) modalTimer.textContent = `Call in progress: ${m}:${s} • Two-way audio active`;
    }, 1000);
  }, 1500);
}

function endSimulatedCall() {
  if (callInterval) clearInterval(callInterval);
  const modal = document.getElementById('modal-call');
  if (modal) modal.classList.add('hidden');
  soundEngine.playSuccessChime();
  showToast('Simulated call concluded. Call log saved.', 'info');
}

// Dispatch Modal
let currentDispatchAlertId = null;
function openDispatchModal(alertId, name) {
  currentDispatchAlertId = alertId;
  const modal = document.getElementById('modal-dispatch');
  const nameLabel = document.getElementById('dispatch-modal-senior-name');
  if (nameLabel) nameLabel.textContent = `For: ${name}`;
  if (modal) modal.classList.remove('hidden');
}

function closeDispatchModal() {
  const modal = document.getElementById('modal-dispatch');
  if (modal) modal.classList.add('hidden');
}

function confirmDispatch() {
  const select = document.getElementById('dispatch-nurse-select');
  const nurse = select ? select.value : 'Sister Kavita, RN';
  soundEngine.playSuccessChime();
  closeDispatchModal();
  showToast(`Specialist dispatched: ${nurse}! SMS sent to family.`, 'success');
  
  // Log incident in Ops stream
  addOpsIncidentLog(`Dispatch initiated: ${nurse} en route to senior`);
}

// Resolve Modal
let currentResolveAlertId = null;
function openResolveModal(alertId, name) {
  currentResolveAlertId = alertId;
  const modal = document.getElementById('modal-resolve');
  const nameLabel = document.getElementById('resolve-modal-senior-name');
  if (nameLabel) nameLabel.textContent = `For: ${name}`;
  if (modal) modal.classList.remove('hidden');
}

function closeResolveModal() {
  const modal = document.getElementById('modal-resolve');
  if (modal) modal.classList.add('hidden');
}

function confirmResolveAlert() {
  if (!currentResolveAlertId) return;
  const idx = state.alerts.findIndex(a => a.id === currentResolveAlertId);
  if (idx !== -1) {
    const alertItem = state.alerts[idx];
    alertItem.status = 'resolved';
    state.resolvedAlerts.unshift({
      id: alertItem.id,
      seniorName: alertItem.seniorName,
      reason: alertItem.reason,
      resolvedBy: 'Nurse Kavita',
      outcome: document.getElementById('resolve-outcome-category').value,
      resolvedAt: 'Just now'
    });

    // If it was Ramesh Sharma, also clear the serious family alert!
    if (alertItem.seniorName.includes('Ramesh')) {
      state.seniorStatus.isSerious = false;
      updateFamilyAlertBanner();
    }

    // Update ops metrics
    state.opsMetrics.activeAlerts = Math.max(0, state.opsMetrics.activeAlerts - 1);
    state.opsMetrics.resolvedAlerts++;
    updateOpsTelemetryDisplay();
    addOpsIncidentLog(`Resolved: Alert ${alertItem.id} for ${alertItem.seniorName} verified safe`);
  }

  closeResolveModal();
  soundEngine.playSuccessChime();
  renderCoordinatorAlerts();
  updateNavPills('coordinator');
  showToast('Alert successfully resolved & marked safe.', 'success');
}

// Simulate Incoming Emergency Live (Adds a high priority case on the fly)
function simulateIncomingAlert() {
  soundEngine.playEmergencySiren();
  const newAlert = {
    id: `ALT-${Math.floor(1100 + Math.random() * 100)}`,
    rank: 1, // Becomes #1 rank immediately
    priority: 'critical',
    priorityScore: 99,
    seniorName: 'Col. K.S. Rathore',
    age: 82,
    gender: 'M',
    location: 'Defence Colony (Block A)',
    phone: '+91 98111-77889',
    familyContact: 'Varun Rathore (Son) • +91 99990-11223',
    assignedNurse: 'Sister Kavita, RN',
    timeAgo: 'Just now (LIVE TRIGGER)',
    vitals: { bp: '168/104', hr: '122 bpm', spo2: '91%', glucose: '142 mg/dL' },
    reason: '🚨 LIVE INCOMING: Sudden SOS trigger + Smartwatch recorded arrhythmia (122 bpm) & oxygen saturation dip to 91%.',
    suggestedAction: 'Immediate triage dispatch to Quick-Response Emergency Squad + trigger nearest ambulance dispatch.',
    status: 'pending'
  };

  // Bump all other ranks by 1
  state.alerts.forEach(a => { a.rank++; });
  state.alerts.unshift(newAlert);

  state.opsMetrics.totalAlerts++;
  state.opsMetrics.activeAlerts++;
  state.opsMetrics.criticalAlerts++;
  updateOpsTelemetryDisplay();
  addOpsIncidentLog(`🚨 CRITICAL INCOMING: Col. K.S. Rathore SOS triggered in Defence Colony`);

  renderCoordinatorAlerts();
  updateNavPills(state.currentRole);
  showToast('🚨 NEW CRITICAL EMERGENCY DETECTED! Priority queue re-ranked.', 'danger');
}


// =========================================================================
// VIEW 2: SENIOR LOGIC (बुज़ुर्ग व्यू)
// Requirement: Simple ways to share how they feel: a voice note, a missed-
// call check-in or a one-tap reply, in Hindi or English.
// =========================================================================

// Bilingual Language Switcher for Senior
function setSeniorLanguage(lang) {
  state.seniorLanguage = lang;
  soundEngine.playTone(500, 'sine', 0.1);

  // Update button active state
  const btnEn = document.getElementById('lang-btn-en');
  const btnHi = document.getElementById('lang-btn-hi');
  if (lang === 'en') {
    btnEn.className = 'px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all bg-teal-600 text-white shadow-sm';
    btnHi.className = 'px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all text-teal-800 hover:bg-teal-100';
  } else {
    btnHi.className = 'px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all bg-teal-600 text-white shadow-sm';
    btnEn.className = 'px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all text-teal-800 hover:bg-teal-100';
  }

  // Update DOM strings with data-i18n attributes
  const dict = translations[lang];
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (dict[key]) {
      el.textContent = dict[key];
    }
  });

  showToast(lang === 'hi' ? 'भाषा बदलकर हिंदी कर दी गई है' : 'Language set to English', 'info');
}

// Web Speech Synthesis (Read aloud in Hindi or English)
function speakSeniorInstructions() {
  const dict = translations[state.seniorLanguage];
  const textToSpeak = dict.spoken_greeting;

  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = state.seniorLanguage === 'hi' ? 'hi-IN' : 'en-IN';
    utterance.rate = 0.9; // Speak gently and clearly for elders
    window.speechSynthesis.speak(utterance);
    showToast(state.seniorLanguage === 'hi' ? 'आवाज़ में निर्देश सुनाए जा रहे हैं...' : 'Speaking instructions aloud...', 'info');
  } else {
    showToast('Speech synthesis not supported in this browser.', 'warning');
  }
}

// 1. One-Tap Reply Handler
function sendOneTapStatus(type) {
  soundEngine.playSuccessChime();
  state.seniorStatus.checkedIn = true;
  state.seniorStatus.statusType = type;
  state.seniorStatus.lastCheckInTime = 'Just now';

  const dict = translations[state.seniorLanguage];
  const statusLabel = document.getElementById('senior-status-text');
  const statusIcon = document.getElementById('senior-status-icon');

  if (type === 'great') {
    statusLabel.textContent = dict.status_done_great;
    statusLabel.className = 'text-sm sm:text-base font-bold text-emerald-700';
    statusIcon.className = 'w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-lg';
    statusIcon.innerHTML = '<i class="fa-solid fa-face-smile"></i>';
    state.seniorStatus.isSerious = false;
    updateFamilyAlertBanner();
    showToast(state.seniorLanguage === 'hi' ? 'आपका चेक-इन पूरा हुआ! सब बढ़िया है।' : 'Great to hear! Your check-in is logged.', 'success');
    addOpsIncidentLog(`Senior check-in: Ramesh Sharma reported 'Feeling Great'`);
  } else if (type === 'tired') {
    statusLabel.textContent = dict.status_done_tired;
    statusLabel.className = 'text-sm sm:text-base font-bold text-amber-700';
    statusIcon.className = 'w-10 h-10 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-lg';
    statusIcon.innerHTML = '<i class="fa-solid fa-bed"></i>';
    showToast(state.seniorLanguage === 'hi' ? 'दर्ज हुआ: थोड़ा आराम करें, केयर टीम सूचित है।' : 'Logged: Rest well, caregiver informed.', 'info');
    addOpsIncidentLog(`Senior check-in: Ramesh Sharma reported 'A Bit Tired'`);
  } else if (type === 'medicine') {
    statusLabel.textContent = dict.status_done_medicine;
    statusLabel.className = 'text-sm sm:text-base font-bold text-blue-700';
    statusIcon.className = 'w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-lg';
    statusIcon.innerHTML = '<i class="fa-solid fa-pills"></i>';
    showToast(state.seniorLanguage === 'hi' ? 'दवा लेने का समय दर्ज कर लिया गया है।' : 'Medication adherence verified!', 'success');
  } else if (type === 'unwell') {
    soundEngine.playEmergencySiren();
    statusLabel.textContent = dict.status_done_unwell;
    statusLabel.className = 'text-sm sm:text-base font-bold text-rose-700';
    statusIcon.className = 'w-10 h-10 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center text-lg';
    statusIcon.innerHTML = '<i class="fa-solid fa-heart-pulse"></i>';
    
    // Elevates to serious alert for Family & Coordinator!
    state.seniorStatus.isSerious = true;
    updateFamilyAlertBanner();

    // Re-prioritize Ramesh in Coordinator queue
    const rameshAlert = state.alerts.find(a => a.seniorName.includes('Ramesh'));
    if (rameshAlert) {
      rameshAlert.priority = 'critical';
      rameshAlert.priorityScore = 99;
      rameshAlert.rank = 1;
      rameshAlert.reason = '🚨 ONE-TAP UNWELL ALERT: Ramesh tapped "Feeling Unwell / तबियत ठीक नहीं" on Senior Companion portal.';
      rameshAlert.suggestedAction = 'Immediate 2-way call & dispatch Sister Kavita for urgent doorstep evaluation.';
      renderCoordinatorAlerts();
    }
    showToast(state.seniorLanguage === 'hi' ? 'अलर्ट भेजा गया! केयर कोऑर्डिनेटर कविता आपसे तुरंत संपर्क कर रही हैं।' : 'Alert dispatched! Coordinator Kavita is calling you now.', 'danger');
    addOpsIncidentLog(`🚨 ALERT: Ramesh Sharma pressed 'Feeling Unwell'`);
  }
}

// 2. Voice Note Recording Simulation
let isRecordingVoice = false;
let voiceRecordTimer = null;
let recordingSeconds = 0;

function toggleVoiceRecording() {
  const micBtn = document.getElementById('senior-mic-btn');
  const micIcon = document.getElementById('mic-icon');
  const pulseRing = document.getElementById('recording-pulse-ring');
  const statusLabel = document.getElementById('voice-recording-status');
  const waveform = document.getElementById('waveform-container');
  const transcriptCard = document.getElementById('voice-transcript-card');
  const dict = translations[state.seniorLanguage];

  if (!isRecordingVoice) {
    // START RECORDING
    isRecordingVoice = true;
    soundEngine.playTone(600, 'sine', 0.15);
    micBtn.className = 'w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-rose-600 text-white flex flex-col items-center justify-center text-3xl sm:text-4xl shadow-xl shadow-rose-600/40 hover:scale-105 active:scale-95 transition-all relative';
    micIcon.className = 'fa-solid fa-stop';
    pulseRing.classList.remove('hidden');
    waveform.classList.remove('hidden');
    transcriptCard.classList.add('hidden');
    
    recordingSeconds = 0;
    statusLabel.textContent = `${dict.mic_recording} (00:01)`;

    voiceRecordTimer = setInterval(() => {
      recordingSeconds++;
      const s = recordingSeconds.toString().padStart(2, '0');
      statusLabel.textContent = `${dict.mic_recording} (00:${s})`;

      // Auto-stop after 5 seconds of speaking
      if (recordingSeconds >= 5) {
        toggleVoiceRecording();
      }
    }, 1000);

  } else {
    // STOP RECORDING
    isRecordingVoice = false;
    soundEngine.playTone(400, 'sine', 0.15);
    clearInterval(voiceRecordTimer);
    
    micBtn.className = 'w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-tr from-teal-600 to-emerald-500 text-white flex flex-col items-center justify-center text-3xl sm:text-4xl shadow-xl shadow-teal-500/30 hover:scale-105 active:scale-95 transition-all relative';
    micIcon.className = 'fa-solid fa-microphone';
    pulseRing.classList.add('hidden');
    waveform.classList.add('hidden');
    statusLabel.textContent = dict.mic_instruction;

    // Show simulated transcription
    transcriptCard.classList.remove('hidden');
    const transcriptText = document.getElementById('voice-transcript-text');
    const durationLabel = document.getElementById('voice-duration-label');
    if (durationLabel) durationLabel.textContent = `00:0${Math.max(1, recordingSeconds)}`;

    if (state.seniorLanguage === 'hi') {
      transcriptText.textContent = '"नमस्ते बेटा, आज सुबह थोड़ा चक्कर आ रहा था और सिर में भारीपन लग रहा है। क्या नर्स दीदी आ सकती हैं?"';
    } else {
      transcriptText.textContent = '"Hello, feeling a little dizzy and slight heaviness in my head this morning. Could someone check in on me?"';
    }

    soundEngine.playSuccessChime();
    showToast(state.seniorLanguage === 'hi' ? 'आवाज़ रिकॉर्ड हो गई! नीचे भेजा जा सकता है।' : 'Voice note captured and transcribed!', 'info');
  }
}

function dispatchVoiceNote() {
  soundEngine.playSuccessChime();
  const transcriptCard = document.getElementById('voice-transcript-card');
  if (transcriptCard) transcriptCard.classList.add('hidden');

  state.seniorStatus.checkedIn = true;
  state.seniorStatus.statusType = 'voice';
  
  const dict = translations[state.seniorLanguage];
  const statusLabel = document.getElementById('senior-status-text');
  statusLabel.textContent = dict.status_done_voice;
  statusLabel.className = 'text-sm sm:text-base font-bold text-teal-700';

  showToast(state.seniorLanguage === 'hi' ? 'आवाज़ संदेश केयर कोऑर्डिनेटर को भेजा गया!' : 'Voice note transmitted to Care Coordinator Kavita!', 'success');
  addOpsIncidentLog(`Voice note received: Ramesh Sharma (Sentiment: Needs Attention)`);
}

// 3. Missed-Call Check-in Simulation
function simulateMissedCall() {
  const btn = document.getElementById('missed-call-sim-btn');
  btn.disabled = true;
  btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-2"></i> Connecting toll-free line...';
  
  soundEngine.playPhoneRing();

  setTimeout(() => {
    soundEngine.playSuccessChime();
    btn.disabled = false;
    btn.innerHTML = `<i class="fa-solid fa-phone-arrow-up-right text-base"></i> <span>${translations[state.seniorLanguage].missed_call_action}</span>`;

    state.seniorStatus.checkedIn = true;
    state.seniorStatus.statusType = 'missed_call';

    const dict = translations[state.seniorLanguage];
    const statusLabel = document.getElementById('senior-status-text');
    const statusIcon = document.getElementById('senior-status-icon');
    
    statusLabel.textContent = dict.status_done_missed_call;
    statusLabel.className = 'text-sm sm:text-base font-bold text-emerald-700';
    statusIcon.className = 'w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-lg';
    statusIcon.innerHTML = '<i class="fa-solid fa-phone-volume"></i>';

    showToast(state.seniorLanguage === 'hi' ? 'मिस्ड कॉल दर्ज! आप आज सुरक्षित चिह्नित हो गए हैं।' : 'Missed call registered! Marked safe for today.', 'success');
    addOpsIncidentLog(`Toll-Free Missed Call logged: Ramesh Sharma (Safety confirmed)`);
  }, 2000);
}

// Emergency SOS Trigger
function triggerEmergencySOS() {
  soundEngine.playEmergencySiren();
  state.seniorStatus.isSerious = true;
  updateFamilyAlertBanner();

  // Highlight in Coordinator list
  const rameshAlert = state.alerts.find(a => a.seniorName.includes('Ramesh'));
  if (rameshAlert) {
    rameshAlert.priority = 'critical';
    rameshAlert.priorityScore = 100;
    rameshAlert.rank = 1;
    rameshAlert.reason = '🚨 SOS BUTTON PRESSED: Senior triggered emergency alarm from home companion screen.';
    rameshAlert.suggestedAction = 'Emergency rapid response: Immediate siren call to family + nearest paramedic dispatch.';
    renderCoordinatorAlerts();
  }

  showToast(state.seniorLanguage === 'hi' ? '🚨 आपातकालीन सहायता सक्रिय! केयर टीम और परिवार को सायरन सूचना भेज दी गई है।' : '🚨 EMERGENCY SOS ACTIVE! Care team and family alerted with sirens.', 'danger');
  addOpsIncidentLog(`🚨 SOS TRIGGERED: Ramesh Sharma pressed Emergency SOS button`);
}


// =========================================================================
// VIEW 3: FAMILY MEMBER LOGIC
// Requirement: A short weekly wellbeing summary and an immediate alert only
// when something is serious.
// =========================================================================
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
  openCallModal('DAD-CALL', 'Dad (Ramesh Sharma)', '+91 98110-44912');
}

function simulateFamilyCallCoordinator() {
  openCallModal('COORD-CALL', 'Nurse Kavita (Care Coordinator)', '+91 98711-00122');
}

function sendFamilyMessageToDad() {
  const input = document.getElementById('family-message-input');
  if (!input || !input.value.trim()) return;
  const msg = input.value.trim();
  soundEngine.playSuccessChime();
  input.value = '';
  showToast(`Message sent to Dad: "${msg}" (Will be read aloud to him)`, 'success');
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
          title: { display: true, text: 'Mood (1-5)', font: { size: 9 } },
          grid: { drawOnChartArea: false }
        },
        x: {
          grid: { display: false },
          ticks: { font: { size: 10 } }
        }
      }
    }
  });
}


// =========================================================================
// VIEW 4: OPERATIONS MANAGER LOGIC
// Requirement: A view of alert volumes, response times and outcomes
// across a city or team.
// =========================================================================
function updateOpsTelemetryDisplay() {
  const m = state.opsMetrics;
  
  const elTotal = document.getElementById('ops-total-alerts');
  const elActive = document.getElementById('ops-active-alerts');
  const elCrit = document.getElementById('ops-critical-alerts');
  const elHigh = document.getElementById('ops-high-alerts');
  const elRoutine = document.getElementById('ops-routine-alerts');
  const elAvgResp = document.getElementById('ops-avg-response');
  const elCritResp = document.getElementById('ops-crit-response');
  const elP95Resp = document.getElementById('ops-p95-response');
  const elNurseEta = document.getElementById('ops-nurse-eta');
  const elPrevER = document.getElementById('ops-prevented-er');
  const elTeleRes = document.getElementById('ops-tele-resolved');
  const elNurseRes = document.getElementById('ops-nurse-resolved');
  const elHospEsc = document.getElementById('ops-hospital-escalated');

  if (elTotal) elTotal.textContent = m.totalAlerts;
  if (elActive) elActive.textContent = `${m.activeAlerts} Active`;
  if (elCrit) elCrit.textContent = m.criticalAlerts;
  if (elHigh) elHigh.textContent = m.highAlerts;
  if (elRoutine) elRoutine.textContent = m.routineAlerts;
  if (elAvgResp) elAvgResp.innerHTML = `${m.avgResponseMinutes} <span class="text-lg font-bold">mins</span>`;
  if (elCritResp) elCritResp.textContent = `${m.criticalSlaMinutes}m`;
  if (elP95Resp) elP95Resp.textContent = `${m.p95ResponseMinutes}m`;
  if (elNurseEta) elNurseEta.textContent = `${m.nurseEtaMinutes}m`;
  if (elPrevER) elPrevER.textContent = m.avertedERCount;
  if (elTeleRes) elTeleRes.textContent = `${m.teleResolvedPercent}%`;
  if (elNurseRes) elNurseRes.textContent = `${m.nurseResolvedPercent}%`;
  if (elHospEsc) elHospEsc.textContent = `${m.erEscalatedPercent}%`;
}

function updateOpsDashboard() {
  soundEngine.playTone(550, 'sine', 0.08);
  const city = document.getElementById('ops-city-filter').value;
  const team = document.getElementById('ops-team-filter').value;
  const period = document.getElementById('ops-time-filter').value;

  // Simulate metric modulation based on city/filter
  if (city === 'mumbai') {
    state.opsMetrics.totalAlerts = 286;
    state.opsMetrics.activeAlerts = 9;
    state.opsMetrics.avgResponseMinutes = 7.1;
    state.opsMetrics.avertedERCount = 19;
  } else if (city === 'bengaluru') {
    state.opsMetrics.totalAlerts = 210;
    state.opsMetrics.activeAlerts = 7;
    state.opsMetrics.avgResponseMinutes = 5.9;
    state.opsMetrics.avertedERCount = 16;
  } else {
    state.opsMetrics.totalAlerts = 342;
    state.opsMetrics.activeAlerts = 14;
    state.opsMetrics.avgResponseMinutes = 6.4;
    state.opsMetrics.avertedERCount = 24;
  }

  updateOpsTelemetryDisplay();
  renderOpsTeamTable();
  initOpsCharts();
  showToast(`Operations telemetry filtered: ${city.toUpperCase()} • ${team}`, 'info');
}

function renderOpsTeamTable() {
  const tbody = document.getElementById('ops-team-table-body');
  if (!tbody) return;

  const teams = [
    { name: 'Team Alpha (Lead: Sister Kavita)', zone: 'South Delhi (GK, Saket, Vasant Kunj)', seniors: 420, alerts: 112, avgResp: '5.8 mins', compliance: '98.2%', status: 'Active (On Shift)' },
    { name: 'Team Beta (Lead: Sister Sunita)', zone: 'East & Central Delhi (Connaught Pl, Mayur Vihar)', seniors: 380, alerts: 94, avgResp: '6.9 mins', compliance: '96.4%', status: 'Active (On Shift)' },
    { name: 'Rapid Response Unit 1 (Paramedic Amit)', zone: 'Hauz Khas & Ring Road Hub', seniors: 150, alerts: 42, avgResp: '3.4 mins', compliance: '99.1%', status: 'Dispatched (In Transit)' },
    { name: 'Buddy Volunteers Corps (Rajesh)', zone: 'Malviya Nagar & Panchsheel', seniors: 260, alerts: 68, avgResp: '8.2 mins', compliance: '94.8%', status: 'Active (Field)' },
    { name: 'Night Shift Triage Standby', zone: 'NCR Municipal Command', seniors: 1210, alerts: 26, avgResp: '4.5 mins', compliance: '99.5%', status: 'Standby' }
  ];

  tbody.innerHTML = teams.map(t => `
    <tr class="hover:bg-slate-50 transition-colors">
      <td class="py-3 px-4 font-bold text-slate-900">${t.name}</td>
      <td class="py-3 px-4 text-slate-500">${t.zone}</td>
      <td class="py-3 px-4 text-center font-mono font-bold">${t.seniors}</td>
      <td class="py-3 px-4 text-center font-mono font-bold text-teal-700">${t.alerts}</td>
      <td class="py-3 px-4 text-center font-mono font-bold text-slate-800">${t.avgResp}</td>
      <td class="py-3 px-4 text-center"><span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">${t.compliance}</span></td>
      <td class="py-3 px-4 text-center"><span class="inline-flex items-center text-[10px] font-semibold text-slate-600"><span class="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5"></span>${t.status}</span></td>
    </tr>
  `).join('');
}

function initOpsCharts() {
  const canvasVolume = document.getElementById('opsVolumeChart');
  const canvasOutcomes = document.getElementById('opsOutcomesChart');

  if (canvasVolume) {
    if (state.charts.opsVolume) state.charts.opsVolume.destroy();
    const ctxVol = canvasVolume.getContext('2d');
    state.charts.opsVolume = new Chart(ctxVol, {
      type: 'bar',
      data: {
        labels: ['06:00', '08:00', '10:00', '12:00', '14:00 (Now)', '16:00', '18:00', '20:00'],
        datasets: [
          {
            label: 'Alerts Received',
            data: [28, 86, 74, 52, 64, 42, 38, 22],
            backgroundColor: '#3b82f6',
            borderRadius: 6
          },
          {
            label: 'Alerts Resolved Within SLA',
            data: [27, 82, 70, 50, 61, 40, 37, 21],
            backgroundColor: '#14b8a6',
            borderRadius: 6
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: { grid: { color: 'rgba(226, 232, 240, 0.6)' } },
          x: { grid: { display: false } }
        }
      }
    });
  }

  if (canvasOutcomes) {
    if (state.charts.opsOutcomes) state.charts.opsOutcomes.destroy();
    const ctxOut = canvasOutcomes.getContext('2d');
    state.charts.opsOutcomes = new Chart(ctxOut, {
      type: 'doughnut',
      data: {
        labels: ['Tele-Triage Resolved', 'Field Nurse Visited', 'Family Handled', 'Emergency ER Transfer'],
        datasets: [{
          data: [58, 26, 12, 4],
          backgroundColor: ['#14b8a6', '#6366f1', '#f59e0b', '#ef4444'],
          borderWidth: 2,
          borderColor: '#ffffff'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: { boxWidth: 10, font: { size: 9, family: 'Inter' } }
          }
        },
        cutout: '65%'
      }
    });
  }
}

function populateOpsIncidentStream() {
  const container = document.getElementById('ops-incident-stream');
  if (!container) return;

  const initialLogs = [
    '14:44:12 [South Delhi] Nurse Kavita dispatched to Ramesh Sharma (BP spike alert)',
    '14:41:05 [Hauz Khas] Paramedic Amit arrived at Savitri Devi residence (Fall assessment complete)',
    '14:38:22 [Saket] Insulin intake verified for Anand Verma via Buddy Rajesh',
    '14:32:19 [Indiranagar] Toll-free missed call safety check-in logged for 14 seniors',
    '14:26:02 [Mumbai West] Alert #1072 marked resolved; Senior reported feeling well'
  ];

  container.innerHTML = initialLogs.map(log => `
    <div class="flex items-center space-x-2 text-slate-300">
      <span class="text-teal-400">&gt;</span>
      <span>${log}</span>
    </div>
  `).join('');
}

function addOpsIncidentLog(message) {
  const container = document.getElementById('ops-incident-stream');
  if (!container) return;

  const now = new Date();
  const timeStr = now.toTimeString().split(' ')[0];
  const newRow = document.createElement('div');
  newRow.className = 'flex items-center space-x-2 text-emerald-300 font-bold';
  newRow.innerHTML = `<span class="text-teal-400">&gt;</span><span>${timeStr} ${message}</span>`;
  container.prepend(newRow);
}

// Toast Notification Utility
function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  let bgClass = 'bg-slate-900 text-white border-slate-700';
  let icon = '<i class="fa-solid fa-circle-info text-teal-400 mr-2"></i>';

  if (type === 'success') {
    bgClass = 'bg-emerald-900 text-white border-emerald-700';
    icon = '<i class="fa-solid fa-circle-check text-emerald-400 mr-2"></i>';
  } else if (type === 'danger') {
    bgClass = 'bg-rose-900 text-white border-rose-700';
    icon = '<i class="fa-solid fa-triangle-exclamation text-rose-400 mr-2"></i>';
  } else if (type === 'warning') {
    bgClass = 'bg-amber-900 text-white border-amber-700';
    icon = '<i class="fa-solid fa-bell text-amber-400 mr-2"></i>';
  }

  const toast = document.createElement('div');
  toast.className = `pointer-events-auto flex items-center px-4 py-3 rounded-xl border shadow-xl text-xs font-semibold toast-slide-in ${bgClass}`;
  toast.innerHTML = `
    <div class="flex items-center flex-grow">
      ${icon}
      <span>${message}</span>
    </div>
    <button onclick="this.parentElement.remove()" class="ml-3 text-slate-400 hover:text-white"><i class="fa-solid fa-xmark"></i></button>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    if (toast.parentElement) {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }
  }, 4000);
}

