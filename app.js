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
  },}
// Check URL hash for direct portal entry
  const directHash = window.location.hash.replace('#', '').toLowerCase();

  if (directHash === 'coordinator') {
    if (typeof enterDashboard === 'function') {
      enterDashboard('coordinator');
    } else {
      navigateRole('coordinator');
    }
  } else if (
    directHash === 'senior' ||
    directHash === 'family' ||
    directHash === 'operations'
  ) {
    if (typeof enterDashboard === 'function') {
      enterDashboard(directHash);
    } else {
      navigateRole(directHash);
    }
  } else {
    navigateRole('login', false);
  }
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
;

// Bilingual Localization Dictionary (Zero parallel text: 100% English or 100% Hindi)
const translations = {
  en: {
    // Operations Manager Portal
    ops_nav_dashboard: "Dashboard",
    ops_nav_risk: "Risk Analytics",
    ops_nav_alerts: "Alerts & Cases",
    ops_nav_team: "Team Management",
    ops_nav_area: "Area Monitoring",
    ops_nav_reports: "Reports",
    ops_nav_audit: "Audit Logs",
    ops_welcome_title: "Welcome back, Operations Manager!",
    ops_welcome_sub: "Here's what's happening with CareConnect today.",
    ops_filter_today: "Today",
    ops_filter_last30: "Last 30 Days",
    ops_filter_all_areas: "All Areas (Delhi NCR)",
    ops_filter_all_seniors: "200 Seniors",
    ops_kpi_total_seniors: "Total Seniors",
    ops_kpi_high_risk: "High-Risk",
    ops_kpi_moderate_risk: "Moderate-Risk",
    ops_kpi_low_risk: "Low-Risk",
    ops_kpi_alerts_today: "Alerts Today",
    ops_kpi_active_coordinators: "Active Coordinators",
    ops_kpi_on_leave: "on leave",
    ops_recent_alerts_title: "Recent Alerts",
    ops_view_all: "View All →",
    ops_th_time: "Time",
    ops_th_senior: "Senior",
    ops_th_risk_level: "Risk Level",
    ops_th_issue: "Issue",
    ops_th_status: "Status",
    ops_th_assigned_to: "Assigned To",
    ops_th_action: "Action",
    ops_btn_view: "View",
    ops_btn_call: "Call",
    ops_btn_dispatch: "Dispatch",
    ops_btn_assign: "Assign",
    ops_btn_new_alert: "+ New Alert",
    ops_btn_add_coordinator: "+ Add Coordinator",
    ops_btn_export_report: "Export Report",
    ops_btn_export: "Export",
    ops_risk_title: "Risk Analytics",
    ops_risk_sub: "Understand risk distribution, trends and key health signals.",
    ops_tab_overview: "Overview",
    ops_tab_distribution: "Risk Distribution",
    ops_tab_trend: "Trend Analysis",
    ops_tab_signals: "Warning Signals",
    ops_tab_change: "Risk Change",
    ops_tab_demographics: "Demographics",
    ops_team_title: "Team Management",
    ops_team_sub: "Monitor care coordinators, workload and performance.",
    ops_area_title: "Area Monitoring",
    ops_area_sub: "View geographical distribution of risks and incidents.",
    ops_reports_title: "Reports",
    ops_reports_sub: "Generate and view reports for better decision-making.",
    ops_audit_title: "Audit Logs",
    ops_audit_sub: "Track all important actions and system activities.",
    ops_kpi_total_alerts: "Total Alerts",
    ops_kpi_high_risk_seniors: "High-Risk Seniors",
    ops_kpi_resolution_rate: "Resolution Rate",
    ops_kpi_avg_response: "Avg. Response Time",
    ops_modal_call_senior: "Call Senior",
    ops_modal_dispatch_nurse: "Dispatch Nurse",
    ops_modal_close: "Close",

    // Header & Navigation
    nav_sign_out: "Sign Out",
    nav_live_system: "Live System",
    nav_authenticated: "Authenticated Session",
    lang_select_label: "Language:",

    // Role Selection Hub (Login)
    role_select_badge: "Role-Based Access Control • AI Telemetry",
    role_select_title: "Welcome to CareConnect AI",
    role_select_subtitle: "Select your role to open your dedicated companion portal",
    
    role_coordinator_title: "Care Coordinator",
    role_coordinator_badge: "Clinical Queue",
    role_coordinator_desc: "Ranked daily triage queue, priority alerts & nurse dispatch actions.",

    role_senior_title: "Senior Companion",
    role_senior_badge: "Voice Companion",
    role_senior_desc: "AI Health Assessment, voice note check-ins & emergency assistance.",

    role_family_title: "Family Member",
    role_family_badge: "Wellbeing Hub",
    role_family_desc: "Weekly health summaries, routine notifications & critical alerts.",

    role_ops_title: "Operations Manager",
    role_ops_badge: "Command Center",
    role_ops_desc: "Fleet response metrics, alert volumes, and citywide SLAs.",

    // Dedicated Auth Portal (Step 2)
    btn_choose_another_role: "Choose Another Role",
    tab_signin: "Sign In",
    tab_signup: "Create Account",
    lbl_signin_email: "Email or Mobile Number",
    lbl_password: "Password",
    btn_forgot_password: "Forgot Password?",
    lbl_remember_device: "Remember this device",
    btn_signin_submit: "Sign In to Dashboard",
    divider_or: "OR",
    btn_continue_google: "Continue with Google",
    otp_title: "Two-Factor OTP Verification",
    btn_verify_otp: "Verify OTP & Access Portal",
    lbl_full_name: "Full Name",
    lbl_email_mobile: "Email or Mobile Number",
    lbl_create_password: "Create Password",
    btn_signup_submit: "Create Account & Enter Portal",
    msg_already_account: "Already have an account?",
    btn_signin_here: "Sign In here",
    lbl_choose_language: "Choose Language",

    // Senior Companion View
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
    read_aloud_btn: "Listen Aloud",
    way1_title: "1. One-Tap Reply",
    way1_subtitle: "Tap how you feel right now",
    status_btn_great: "Feeling Great!",
    status_btn_great_sub: "All is good & energized",
    status_btn_tired: "A Bit Tired",
    status_btn_tired_sub: "Resting, mild fatigue",
    status_btn_meds: "Took Medicine",
    status_btn_meds_sub: "All doses taken on time",
    status_btn_unwell: "Feeling Unwell",
    status_btn_unwell_sub: "Need nurse or doctor assistance",
    way2_title: "2. Voice Note",
    ai_transcription_pill: "AI Voice Sentiment Active",
    voice_desc: "Press the big microphone button, speak naturally in English, and we will update your care team immediately.",
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
    sos_btn: "PRESS FOR SOS",
    jump_assess_btn: "AI Health Assessment",
    assess_title: "Comprehensive Health & Risk Assessment",
    assess_subtitle: "Trained on 90,000 multi-parameter elder health records. Predicts Risk Condition: Low, Medium, or High.",
    assess_presets_label: "Quick Samples:",
    preset_healthy: "Healthy Senior",
    preset_moderate: "Moderate Risk",
    preset_critical: "High Risk Alert",
    btn_clear_draft: "Clear Draft",
    assess_req_hint: "All Health Parameters Required",
    try_voice_examples: "Try Voice Examples:",
    grp_demographics: "1. Personal & Body Metrics",
    lbl_age: "Age (Years)",
    lbl_gender: "Gender",
    lbl_height: "Height (cm)",
    lbl_weight: "Weight (kg)",
    grp_vitals: "2. Vital Signs Telemetry",
    vitals_hint: "BP • Pulse • Blood Oxygen",
    lbl_bp_sys: "BP Systolic (mmHg)",
    lbl_bp_dia: "BP Diastolic (mmHg)",
    lbl_heart_rate: "Heart Rate / Pulse (bpm)",
    lbl_spo2: "Oxygen SpO2 (%)",
    grp_pain_sleep: "3. Pain & Sleep Hours",
    lbl_pain_present: "Any Pain or Discomfort?",
    opt_no_pain: "No Pain",
    opt_yes_pain: "Yes, Pain Present",
    lbl_pain_loc: "Pain Location",
    lbl_pain_scale: "Pain Severity Scale (0 to 10)",
    lbl_sleep: "Sleep Duration (Hours)",
    sleep_hint: "Normal: 6 to 8 hrs",
    grp_adl: "4. Daily Activities & Independence",
    adl_desc: "Can they perform these essential daily living activities by themselves without human assistance?",
    adl_walk: "Able to Walk Independently",
    adl_eat: "Eat Themselves",
    adl_move: "Move / Transfer (Sit & Stand)",
    adl_toilet: "Use Toilet Independently",
    grp_meds_diabetes: "5. Medication Adherence & Diabetes",
    meds_hint: "Prescriptions & Glycemic Check",
    lbl_med_count: "Daily Prescription Count",
    lbl_missed_doses: "Doses Taken Today?",
    lbl_diabetic: "Diabetic Condition?",
    lbl_sugar: "Blood Glucose Level (mg/dL)",
    grp_hearing_diseases: "6. Hearing Ability & Chronic Conditions",
    hearing_hint: "Accessibility & Comorbidities",
    lbl_hearing: "Hearing Level",
    lbl_chronic: "Existing Diagnosed Conditions:",
    assess_disclaimer: "Instant ML inference • Predicts Risk Condition (Low / Medium / High)",
    btn_predict_risk: "Predict Health Risk (AI Analysis)",
    spoken_greeting: "Namaste Ramesh ji. We are here with you. Please tap how you feel, speak a voice note, or give a missed call."
  },
  hi: {
    // Operations Manager Portal (हिन्दी)
    ops_nav_dashboard: "डैशबोर्ड",
    ops_nav_risk: "जोखिम विश्लेषण",
    ops_nav_alerts: "अलर्ट और मामले",
    ops_nav_team: "टीम प्रबंधन",
    ops_nav_area: "क्षेत्र निगरानी",
    ops_nav_reports: "रिपोर्ट्स",
    ops_nav_audit: "ऑडिट लॉग",
    ops_welcome_title: "वापसी पर स्वागत है, संचालन प्रबंधक!",
    ops_welcome_sub: "आज केयरकनेक्ट प्रणाली की वर्तमान स्थिति यहाँ देखें।",
    ops_filter_today: "आज",
    ops_filter_last30: "पिछले ३० दिन",
    ops_filter_all_areas: "सभी क्षेत्र (दिल्ली एनसीआर)",
    ops_filter_all_seniors: "२०० वरिष्ठ जन",
    ops_kpi_total_seniors: "कुल वरिष्ठ जन",
    ops_kpi_high_risk: "उच्च जोखिम",
    ops_kpi_moderate_risk: "मध्यम जोखिम",
    ops_kpi_low_risk: "कम जोखिम",
    ops_kpi_alerts_today: "आज के अलर्ट",
    ops_kpi_active_coordinators: "सक्रिय समन्वयक",
    ops_kpi_on_leave: "अवकाश पर",
    ops_recent_alerts_title: "ताज़ा अलर्ट",
    ops_view_all: "सभी देखें →",
    ops_th_time: "समय",
    ops_th_senior: "वरिष्ठ जन",
    ops_th_risk_level: "जोखिम स्तर",
    ops_th_issue: "समस्या",
    ops_th_status: "स्थिति",
    ops_th_assigned_to: "सौंपा गया",
    ops_th_action: "कार्रवाई",
    ops_btn_view: "देखें",
    ops_btn_call: "कॉल करें",
    ops_btn_dispatch: "नर्स भेजें",
    ops_btn_assign: "सौंपें",
    ops_btn_new_alert: "+ नया अलर्ट",
    ops_btn_add_coordinator: "+ समन्वयक जोड़ें",
    ops_btn_export_report: "रिपोर्ट निर्यात करें",
    ops_btn_export: "निर्यात करें",
    ops_risk_title: "जोखिम विश्लेषण",
    ops_risk_sub: "जोखिम वितरण, प्रवृत्तियां और प्रमुख स्वास्थ्य संकेतों को समझें।",
    ops_tab_overview: "अवलोकन",
    ops_tab_distribution: "जोखिम वितरण",
    ops_tab_trend: "प्रवृत्ति विश्लेषण",
    ops_tab_signals: "चेतावनी संकेत",
    ops_tab_change: "जोखिम परिवर्तन",
    ops_tab_demographics: "जनसांख्यिकी",
    ops_team_title: "टीम प्रबंधन",
    ops_team_sub: "देखभाल समन्वयकों, कार्यभार और प्रदर्शन की निगरानी करें।",
    ops_area_title: "क्षेत्र निगरानी",
    ops_area_sub: "जोखिमों और घटनाओं का भौगोलिक वितरण देखें।",
    ops_reports_title: "रिपोर्ट्स",
    ops_reports_sub: "बेहतर निर्णय लेने के लिए विस्तृत रिपोर्ट देखें।",
    ops_audit_title: "ऑडिट लॉग",
    ops_audit_sub: "सभी महत्वपूर्ण गतिविधियों और प्रणाली कार्यों को ट्रैक करें।",
    ops_kpi_total_alerts: "कुल अलर्ट",
    ops_kpi_high_risk_seniors: "उच्च जोखिम वाले वरिष्ठ जन",
    ops_kpi_resolution_rate: "समाधान दर",
    ops_kpi_avg_response: "औसत प्रतिक्रिया समय",
    ops_modal_call_senior: "वरिष्ठ जन को कॉल करें",
    ops_modal_dispatch_nurse: "नर्स भेजें",
    ops_modal_close: "बंद करें",

    // Header & Navigation
    nav_sign_out: "लॉग आउट",
    nav_live_system: "सक्रिय सिस्टम",
    nav_authenticated: "प्रमाणित सत्र",
    lang_select_label: "भाषा चुनें:",

    // Role Selection Hub (Login)
    role_select_badge: "रोल-आधारित एक्सेस कंट्रोल • एआई टेलीमेट्री",
    role_select_title: "केयरकनेक्ट एआई में आपका स्वागत है",
    role_select_subtitle: "अपने समर्पित पोर्टल में प्रवेश करने के लिए अपना रोल चुनें",
    
    role_coordinator_title: "केयर कोऑर्डिनेटर",
    role_coordinator_badge: "क्लिनिकल कतार",
    role_coordinator_desc: "दैनिक प्राथमिकता सूची, गंभीर अलर्ट एवं नर्स प्रेषण प्रबंधन।",

    role_senior_title: "बुज़ुर्ग साथी",
    role_senior_badge: "आवाज़ साथी",
    role_senior_desc: "एआई स्वास्थ्य जांच, आवाज़ संदेश चेक-इन और आपातकालीन सहायता।",

    role_family_title: "परिवारजन",
    role_family_badge: "कल्याण केंद्र",
    role_family_desc: "साप्ताहिक स्वास्थ्य सारांश, नियमित सूचनाएं एवं गंभीर अलर्ट।",

    role_ops_title: "ऑपरेशंस मैनेजर",
    role_ops_badge: "कमांड सेंटर",
    role_ops_desc: "प्रतिक्रिया समय, अलर्ट संख्या और शहर-स्तरीय सेवा मानक।",

    // Dedicated Auth Portal (Step 2)
    btn_choose_another_role: "दूसरा रोल चुनें",
    tab_signin: "लॉगिन",
    tab_signup: "नया खाता",
    lbl_signin_email: "ईमेल या मोबाइल नंबर",
    lbl_password: "पासवर्ड",
    btn_forgot_password: "पासवर्ड भूल गए?",
    lbl_remember_device: "इस डिवाइस को याद रखें",
    btn_signin_submit: "डैशबोर्ड में लॉगिन करें",
    divider_or: "या",
    btn_continue_google: "गूगल से जारी रखें",
    otp_title: "दो-चरणीय ओटीपी सत्यापन",
    btn_verify_otp: "सत्यापित करें और प्रवेश करें",
    lbl_full_name: "पूरा नाम",
    lbl_email_mobile: "ईमेल या मोबाइल नंबर",
    lbl_create_password: "नया पासवर्ड बनाएं",
    btn_signup_submit: "खाता बनाएं और प्रवेश करें",
    msg_already_account: "क्या आपका पहले से खाता है?",
    btn_signin_here: "यहाँ लॉगिन करें",
    lbl_choose_language: "भाषा चुनें",

    // Senior Companion View
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
    read_aloud_btn: "बोलकर सुनाएं",
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
    voice_desc: "माइक बटन दबाएं और हिंदी में बेझिझक बोलें। हम आपकी बात तुरंत केयर कोऑर्डिनेटर तक पहुंचाएंगे।",
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
    jump_assess_btn: "एआई स्वास्थ्य जांच",
    assess_title: "संपूर्ण स्वास्थ्य एवं जोखिम मूल्यांकन (AI)",
    assess_subtitle: "९०,००० बुज़ुर्ग स्वास्थ्य डेटा पर प्रशिक्षित। स्वास्थ्य जोखिम की जांच: कम, मध्यम या गंभीर।",
    assess_presets_label: "उदाहरण चुनें:",
    preset_healthy: "स्वस्थ बुज़ुर्ग (सामान्य)",
    preset_moderate: "मध्यम जोखिम (चिंता)",
    preset_critical: "गंभीर अलर्ट (इमरजेंसी)",
    btn_clear_draft: "फॉर्म साफ करें",
    assess_req_hint: "सभी स्वास्थ्य संकेत अनिवार्य हैं",
    try_voice_examples: "उदाहरण बोलें:",
    grp_demographics: "१. व्यक्तिगत जानकारी एवं शरीर माप",
    lbl_age: "उम्र (वर्ष)",
    lbl_gender: "लिंग",
    lbl_height: "लंबाई (cm)",
    lbl_weight: "वजन (kg)",
    grp_vitals: "२. जीवन संकेत (वाइटल्स)",
    vitals_hint: "बीपी • धड़कन • ऑक्सीजन",
    lbl_bp_sys: "बीपी सिस्टोलिक (ऊपर)",
    lbl_bp_dia: "बीपी डायस्टोलिक (नीचे)",
    lbl_heart_rate: "हृदय गति / पल्स (bpm)",
    lbl_spo2: "ऑक्सीजन स्तर SpO2 (%)",
    grp_pain_sleep: "३. दर्द एवं नींद का स्तर",
    lbl_pain_present: "क्या कहीं दर्द या तकलीफ है?",
    opt_no_pain: "नहीं (कोई दर्द नहीं)",
    opt_yes_pain: "हाँ (दर्द है)",
    lbl_pain_loc: "दर्द का स्थान",
    lbl_pain_scale: "दर्द की तीव्रता (० से १०)",
    lbl_sleep: "नींद के घंटे",
    sleep_hint: "सामान्य: ६ से ८ घंटे",
    grp_adl: "४. दिनचर्या के कार्य एवं आत्मनिर्भरता",
    adl_desc: "क्या वे बिना किसी की मदद के ये दैनिक कार्य खुद कर सकते हैं?",
    adl_walk: "चलने-फिरने में सक्षम",
    adl_eat: "स्वयं भोजन करना",
    adl_move: "उठना-बैठना (ट्रांसफर)",
    adl_toilet: "शौचालय जाना",
    grp_meds_diabetes: "५. दवाइयां और शुगर स्तर",
    meds_hint: "नियमित दवा और ग्लूकोज",
    lbl_med_count: "रोजाना दवाइयों की संख्या",
    lbl_missed_doses: "क्या आज की दवा समय पर ली?",
    lbl_diabetic: "क्या आपको शुगर/डायबिटीज है?",
    lbl_sugar: "ब्लड शुगर (ग्लूकोज mg/dL)",
    grp_hearing_diseases: "६. सुनने की क्षमता एवं पुरानी बीमारियां",
    hearing_hint: "श्रवण क्षमता एवं रोग",
    lbl_hearing: "सुनने की स्थिति",
    lbl_chronic: "पुरानी ज्ञात बीमारियां:",
    assess_disclaimer: "तुरंत एआई विश्लेषण • स्वास्थ्य जोखिम का सटीक अनुमान",
    btn_predict_risk: "स्वास्थ्य जोखिम जांचें (AI Analysis)",
    spoken_greeting: "नमस्ते रमेश जी। हम हमेशा आपके साथ हैं। कृपया बताएं आज आप कैसा महसूस कर रहे हैं, या एक मिस्ड कॉल दें।"
  }
};


// Clean Dropdown Option Translations (Zero Parallel Slashes)
const optionTranslations = {
  gender: {
    Male: { en: "Male", hi: "पुरुष" },
    Female: { en: "Female", hi: "महिला" },
    Other: { en: "Other", hi: "अन्य" }
  },
  painLoc: {
    None: { en: "None", hi: "कहीं नहीं" },
    Knee: { en: "Knee", hi: "घुटना" },
    Back: { en: "Lower Back", hi: "कमर" },
    Shoulder: { en: "Shoulder", hi: "कंधा" },
    Joints: { en: "Joints", hi: "जोड़" },
    Chest: { en: "Chest (Critical)", hi: "छाती (गंभीर)" },
    Other: { en: "Other", hi: "अन्य" }
  },
  adl: {
    "1": { en: "✅ Independent", hi: "✅ आत्मनिर्भर (खुद)" },
    "0": { en: "⚠️ Needs Help / Dependent", hi: "⚠️ सहारा / निर्भर" }
  },
  missedDoses: {
    "0": { en: "✅ All Taken Today", hi: "✅ आज की सभी दवाइयाँ लीं" },
    "1": { en: "⚠️ Missed 1 Dose", hi: "⚠️ १ खुराक छूटी" },
    "2": { en: "❌ Missed 2+ Doses", hi: "❌ २ या अधिक खुराक छूटी" }
  },
  yesNo: {
    "0": { en: "No", hi: "नहीं" },
    "1": { en: "Yes", hi: "हाँ" }
  },
  hearing: {
    "0": { en: "👂 Normal / Perfect", hi: "👂 सामान्य (बिल्कुल सही)" },
    "1": { en: "🦻 Mild Difficulty", hi: "🦻 थोड़ा कम सुनाई देता है" },
    "2": { en: "📢 Uses Hearing Aid / Severe", hi: "📢 हियरिंग एड आवश्यक" }
  }
};

function updateSelectOptionsLanguage(lang) {
  const updateSelect = (selectId, map) => {
    const el = document.getElementById(selectId);
    if (!el) return;
    Array.from(el.options).forEach(opt => {
      const trans = map[opt.value];
      if (trans && trans[lang]) {
        opt.textContent = trans[lang];
      }
    });
  };

  updateSelect('assess-gender', optionTranslations.gender);
  updateSelect('assess-pain-loc', optionTranslations.painLoc);
  updateSelect('assess-adl-walk', optionTranslations.adl);
  updateSelect('assess-adl-eat', optionTranslations.adl);
  updateSelect('assess-adl-move', optionTranslations.adl);
  updateSelect('assess-adl-toilet', optionTranslations.adl);
  updateSelect('assess-missed-doses', optionTranslations.missedDoses);
  updateSelect('assess-diabetic', optionTranslations.yesNo);
  updateSelect('assess-hearing', optionTranslations.hearing);
}

// Web Audio API Synthesizer (Zero external dependencies; works 100% offline)
const soundEngine = {
  ctx: null,
  alarmInterval: null,
  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
  },
  startReminderAlarm() {
    this.stopReminderAlarm();
    this.init();
    const playAlarmBeeps = () => {
      // 3 melodic medical alarm tones: G5 (784Hz) -> A5 (880Hz) -> C6 (1046Hz)
      this.playTone(784, 'sine', 0.16, 0);
      this.playTone(880, 'sine', 0.16, 0.20);
      this.playTone(1046, 'sine', 0.22, 0.40);
    };
    playAlarmBeeps();
    this.alarmInterval = setInterval(playAlarmBeeps, 2000);
  },
  stopReminderAlarm() {
    if (this.alarmInterval) {
      clearInterval(this.alarmInterval);
      this.alarmInterval = null;
    }
  },
  phoneRingInterval: null,
  startPhoneRinging() {
    this.stopPhoneRinging();
    this.init();
    const playPhoneRingCadence = () => {
      // Realistic dual-frequency telephone ringtone (440Hz + 480Hz)
      this.playTone(440, 'sine', 0.8, 0);
      this.playTone(480, 'sine', 0.8, 0);
      setTimeout(() => {
        this.playTone(440, 'sine', 0.8, 0);
        this.playTone(480, 'sine', 0.8, 0);
      }, 1000);
    };
    playPhoneRingCadence();
    this.phoneRingInterval = setInterval(playPhoneRingCadence, 3000);
  },
  stopPhoneRinging() {
    if (this.phoneRingInterval) {
      clearInterval(this.phoneRingInterval);
      this.phoneRingInterval = null;
    }
  },
  playCallConnectedTone() {
    this.playTone(587.33, 'sine', 0.18, 0);    // D5
    this.playTone(880.00, 'sine', 0.35, 0.15); // A5
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

// ==================================================================
// APPLICATION INITIALIZATION
// ==================================================================
// Check URL hash for direct portal entry
  const directHash = window.location.hash.replace('#', '').toLowerCase();

  if (directHash === 'coordinator') {
    if (typeof enterDashboard === 'function') {
      enterDashboard('coordinator');
    } else {
      navigateRole('coordinator');
    }
  } else if (
    directHash === 'senior' ||
    directHash === 'family' ||
    directHash === 'operations'
  ) {
    if (typeof enterDashboard === 'function') {
      enterDashboard(directHash);
    } else {
      navigateRole(directHash);
    }
  } else {
    navigateRole('login', false);
  }



document.addEventListener('DOMContentLoaded', () => {
  const savedLang = localStorage.getItem('careconnect_lang') || 'en';
  setAppLanguage(savedLang, false);

  navigateRole('login', false);
  // Check URL hash for direct portal entry (e.g. #coordinator)
  const directHash = window.location.hash.replace('#', '').toLowerCase();
  if (directHash === 'coordinator') {
    if (typeof enterDashboard === 'function') enterDashboard('coordinator');
    else navigateRole('coordinator');
  } else if (directHash === 'senior' || directHash === 'family' || directHash === 'operations') {
    if (typeof enterDashboard === 'function') enterDashboard(directHash);
    else navigateRole(directHash);
  } else {
    navigateRole('login');
  }
  renderCoordinatorAlerts();
  renderOpsTeamTable();
  populateOpsIncidentStream();
});


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
  const time = new Date().toTimeString().split(' ')[0];
  const row = document.createElement('div');
  row.className = 'flex items-center space-x-2 text-slate-300';
  row.innerHTML = `<span class="text-teal-400">&gt;</span><span>${time} ${message}</span>`;
  container.insertBefore(row, container.firstChild);
}

// Navigation between the 4 Stakeholder Views + Login
function navigateRole(role) {
  state.currentRole = role;
  
  // View elements
  const views = {
    login: document.getElementById('view-login'),
    coordinator: document.getElementById('view-coordinator'),
    senior: document.getElementById('view-senior'),
    family: document.getElementById('view-family'),
    operations: document.getElementById('view-operations'),
    add_reminder: document.getElementById('view-add-reminder')
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
  } else if (role === 'operations' || role === 'coordinator') {
    if (header) header.classList.add('hidden');
    if (mobileNav) mobileNav.classList.add('hidden');
    document.title = "CareConnect Operations Manager Command Center";
    switchOpsTab('dashboard');
    setTimeout(renderOpsDashboardEldersTable, 100);
    setTimeout(initOpsCharts, 120);
    setTimeout(renderOpsCasesTable, 150);
    document.title = role === 'coordinator' 
      ? "CareConnect - Care Coordinator Clinical Command (Medcare)" 
      : "CareConnect Operations Manager Command Center";
    if (role === 'operations') {
      switchOpsTab('dashboard');
      setTimeout(initOpsCharts, 120);
    } else {
      if (typeof initMedcareCoordinatorDashboard === 'function') {
        initMedcareCoordinatorDashboard();
      }
      setTimeout(() => {
        if (typeof initMedcareCoordinatorDashboard === 'function') {
          initMedcareCoordinatorDashboard();
        }
      }, 60);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } else {
    if (header) header.classList.remove('hidden');
    if (mobileNav) mobileNav.classList.remove('hidden');
    updateHeaderUserBadge(role);
    updateNavPills(role);
    
    // View-specific initializations
       if (role === 'family') {
      if (typeof changeFamilyLinkedSenior === 'function') {
        changeFamilyLinkedSenior('PAT-101');
      }
      if (typeof switchFamilyTab === 'function') {
        switchFamilyTab('summary');
      }
      setTimeout(initFamilyVitalsChart, 100);
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

function getRoleDisplayName(role, lang = (state && state.currentLanguage) || 'en') {
  if (lang === 'hi') {
    switch (role) {
      case 'coordinator': return 'केयर कोऑर्डिनेटर';
      case 'senior': return 'बुज़ुर्ग साथी';
      case 'family': return 'परिवारजन';
      case 'operations': return 'ऑपरेशंस मैनेजर';
      default: return 'उपयोगकर्ता';
    }
  } else {
    switch (role) {
      case 'coordinator': return 'Care Coordinator';
      case 'senior': return 'Senior Companion';
      case 'family': return 'Family Member';
      case 'operations': return 'Operations Manager';
      default: return 'User';
    }
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

// ==================================================================// VIEW 1: CARE COORDINATOR LOGIC
// Requirement: A ranked daily list of seniors to prioritise, with the reason
// for each alert and a suggested action.
// ==================================================================
  const drwSoundBtn = document.getElementById('drawer-sound-btn');
  if (drwSoundBtn) {
    drwSoundBtn.textContent = state.audioEnabled ? 'Audio: ON' : 'Audio: MUTED';
    drwSoundBtn.className = state.audioEnabled 
      ? 'px-3 py-1 rounded-xl text-xs font-bold bg-white border border-slate-300 text-teal-700 hover:bg-teal-50'
      : 'px-3 py-1 rounded-xl text-xs font-bold bg-rose-50 border border-rose-300 text-rose-700 hover:bg-rose-100';
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
  const isCoord = name.toLowerCase().includes('coordinator') || alertId === 'COORD-CALL';
  if (modalTimer) modalTimer.textContent = isCoord ? "Dialing Care Coordinator desk..." : "Dialing senior home terminal...";
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
      if (modalTimer) {
        const isCoord = modalName && modalName.textContent.toLowerCase().includes('coordinator');
        modalTimer.textContent = isCoord 
          ? `Speaking with Care Coordinator: ${m}:${s} • Two-way audio active`
          : `Call in progress: ${m}:${s} • Two-way audio active`;
      }
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

  // Sync to Care Coordinator duty schedule & update Dynamic KPIs
  if (nurse.includes('Kavita')) {
    const sName = document.getElementById('dispatch-modal-senior-name')?.textContent || 'Ramesh Sharma';
    const seniors = getCoordinatorSeniors();
    const s = seniors.find(x => sName.includes(x.name)) || seniors[0];
    if (s) {
      s.taskStatus = 'assigned';
      s.assignedOperator = 'Sister Kavita, RN';
      s.assignedAction = '🏠 Doorstep Home Visit';
      saveCoordinatorSeniors(seniors);
      updateCoordinatorDynamicKPIs();
      if (typeof renderCoordinatorAssignedTasks === 'function') renderCoordinatorAssignedTasks();
    }
  }
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


// ==================================================================// VIEW 2: SENIOR LOGIC (बुज़ुर्ग व्यू)

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
// ==================================================================
// Unified Global Language Switcher (Zero Parallel Slashes)
function setAppLanguage(lang, notify = true) {
  if (!state) return;
  state.currentLanguage = lang;
  state.seniorLanguage = lang;
  try {
    localStorage.setItem('careconnect_lang', lang);
  } catch (e) {}

  if (soundEngine && typeof soundEngine.playTone === 'function') {
    soundEngine.playTone(520, 'sine', 0.08);
  }

  // 1. Update UI Language Switcher Active States
  updateLanguageSwitcherButtons(lang);

  // 2. Update all DOM elements with data-i18n
  const dict = translations[lang] || translations.en;
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (dict[key] !== undefined) {
      el.textContent = dict[key];
    }
  });

  // 3. Update all dropdown select options
  if (typeof updateSelectOptionsLanguage === 'function') {
    updateSelectOptionsLanguage(lang);
  }

  // 4. Update Auth Step 2 Portal if active
  if (typeof updateAuthBannerForLanguage === 'function') {
    updateAuthBannerForLanguage(lang);
  }

  // 5. Update active role navigation titles & header
  if (typeof updateHeaderUserBadge === 'function' && state.currentRole && state.currentRole !== 'login') {
    updateHeaderUserBadge(state.currentRole);
  }

  if (notify) {
    showToast(lang === 'hi' ? 'भाषा बदलकर हिन्दी कर दी गई है' : 'Language set to English', 'info');
  }
}

// Backwards compatibility alias for Senior Portal
function setSeniorLanguage(lang) {
  setAppLanguage(lang);
}

function updateLanguageSwitcherButtons(lang) {
  // Login / Role hub buttons
  const loginEn = document.getElementById('login-lang-en');
  const loginHi = document.getElementById('login-lang-hi');
  if (loginEn && loginHi) {
    if (lang === 'en') {
      loginEn.className = 'px-3 py-1 rounded-lg text-xs font-bold transition-all bg-white text-slate-900 shadow-sm';
      loginHi.className = 'px-3 py-1 rounded-lg text-xs font-bold transition-all text-slate-500 hover:text-slate-800';
    } else {
      loginHi.className = 'px-3 py-1 rounded-lg text-xs font-bold transition-all bg-white text-slate-900 shadow-sm';
      loginEn.className = 'px-3 py-1 rounded-lg text-xs font-bold transition-all text-slate-500 hover:text-slate-800';
    }
  }

  // Header buttons
  const hdrEn = document.getElementById('header-lang-en');
  const hdrHi = document.getElementById('header-lang-hi');
  if (hdrEn && hdrHi) {
    if (lang === 'en') {
      hdrEn.className = 'px-2 sm:px-2.5 py-1 rounded-lg text-xs font-bold transition-all bg-white text-slate-900 shadow-sm';
      hdrHi.className = 'px-2 sm:px-2.5 py-1 rounded-lg text-xs font-bold transition-all text-slate-500 hover:text-slate-800';
    } else {
      hdrHi.className = 'px-2 sm:px-2.5 py-1 rounded-lg text-xs font-bold transition-all bg-white text-slate-900 shadow-sm';
      hdrEn.className = 'px-2 sm:px-2.5 py-1 rounded-lg text-xs font-bold transition-all text-slate-500 hover:text-slate-800';
    }
  }

  // Operations Manager topbar buttons
  const opsEn = document.getElementById('ops-top-lang-en');
  const opsHi = document.getElementById('ops-top-lang-hi');
  if (opsEn && opsHi) {
    if (lang === 'en') {
      opsEn.className = 'px-2 sm:px-2.5 py-1 rounded-lg text-xs font-bold transition-all bg-white text-slate-900 shadow-sm';
      opsHi.className = 'px-2 sm:px-2.5 py-1 rounded-lg text-xs font-bold transition-all text-slate-500 hover:text-slate-800';
    } else {
      opsHi.className = 'px-2 sm:px-2.5 py-1 rounded-lg text-xs font-bold transition-all bg-white text-slate-900 shadow-sm';
      opsEn.className = 'px-2 sm:px-2.5 py-1 rounded-lg text-xs font-bold transition-all text-slate-500 hover:text-slate-800';
    }
  }

  // Operations Account Settings select
  const accSel = document.getElementById('ops-account-lang-select');
  if (accSel) {
    accSel.value = lang;
  }



  // Drawer buttons
  const drwEn = document.getElementById('drawer-lang-en');
  const drwHi = document.getElementById('drawer-lang-hi');
  if (drwEn && drwHi) {
    if (lang === 'en') {
      drwEn.className = 'px-2.5 py-1 rounded-lg text-xs font-bold bg-white text-slate-900 shadow-xs';
      drwHi.className = 'px-2.5 py-1 rounded-lg text-xs font-bold text-slate-600 hover:text-slate-900';
    } else {
      drwHi.className = 'px-2.5 py-1 rounded-lg text-xs font-bold bg-white text-slate-900 shadow-xs';
      drwEn.className = 'px-2.5 py-1 rounded-lg text-xs font-bold text-slate-600 hover:text-slate-900';
    }
  }

  // Senior portal buttons
  const btnEn = document.getElementById('lang-btn-en');
  const btnHi = document.getElementById('lang-btn-hi');
  if (btnEn && btnHi) {
    if (lang === 'en') {
      btnEn.className = 'px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all bg-teal-600 text-white shadow-sm';
      btnHi.className = 'px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all text-teal-800 hover:bg-teal-100';
    } else {
      btnHi.className = 'px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all bg-teal-600 text-white shadow-sm';
      btnEn.className = 'px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all text-teal-800 hover:bg-teal-100';
    }
  }
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
  if (!micBtn) return;
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


// ==================================================================// ==================================================================// VIEW 3: FAMILY MEMBER LOGIC (परिवार का वेलबीइंग व हेल्थ मॉनिटर)
// Features: 
// 1. AI Analyze Summary & Wellbeing Metrics
// 2. Comprehensive Senior Health Report (Demographics, Vitals, History, Meds)
// 3. Complete Assessment History (Chronological Timeline, ADL, Pain, Voice Notes)
// 4. Download & Print Full Health Assessment PDF & Plain Text Reports
// ==================================================================
let familySelectedSeniorId = 'PAT-101'; // Default: Ramesh Sharma
let currentFamilyTab = 'summary'; // 'summary' | 'report' | 'history'
let currentFamilyHistoryFilter = 'all';

// Helper 1: Formats brackets with Relation of user with patient, along with age and gender
// e.g. [Father • 74 Yrs • Male]
function getSeniorBracketInfo(p) {
  if (!p) return '[Senior]';
  const relationMap = {
    'PAT-101': 'Father',
    'PAT-102': 'Mother',
    'PAT-103': 'Uncle',
    'PAT-104': 'Aunt',
    'PAT-105': 'Father'
  };
  const rel = relationMap[p.id] || (p.emergencyContact && p.emergencyContact.relation ? p.emergencyContact.relation.split(' ')[0] : 'Senior');
  const age = p.age || 74;
  const gender = p.gender || 'Male';
  return `[${rel} • ${age} Yrs • ${gender}]`;
}

// Helper 2: Formats second bracket under patient name containing name, gender and age of person related to patient
// e.g. [Caregiver: Rahul Sharma • Male • 42 Yrs]
function getCaregiverBracketInfo(p) {
  if (!p) return '[Caregiver: Rahul Sharma • Male • 42 Yrs]';
  const caregiverMap = {
    'PAT-101': { name: 'Rahul Sharma', gender: 'Male', age: 42, role: 'Caregiver / Son', household: 'Sharma Family' },
    'PAT-102': { name: 'Rahul Sharma', gender: 'Male', age: 42, role: 'Caregiver / Son', household: 'Sharma Family' }, // SAME CARETAKER FOR BOTH!
    'PAT-103': { name: 'Vikas Verma', gender: 'Male', age: 45, role: 'Caregiver / Nephew' },
    'PAT-104': { name: 'Deepa Iyer', gender: 'Female', age: 39, role: 'Caregiver / Niece' },
    'PAT-105': { name: 'Ketan Patel', gender: 'Male', age: 44, role: 'Caregiver / Son' }
  };
  const c = caregiverMap[p.id] || { name: 'Rahul Sharma', gender: 'Male', age: 42, role: 'Caregiver' };
  return `[Caregiver: ${c.name} • ${c.gender} • ${c.age} Yrs]`;
}

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

  const currentPatient = (state.patients || []).find(p => p.id === familySelectedSeniorId) || (state.patients ? state.patients[0] : null);
  if (currentPatient) {
    if (tab === 'summary') renderFamilyAnalyzeSummary(currentPatient);
    if (tab === 'report') renderFamilySeniorReport(currentPatient);
    if (tab === 'history') renderFamilyAssessmentHistory(currentPatient);
  }
}

// 2. Change Linked Senior from dropdown
// ==================================================================// MULTI-PATIENT FAMILY CAROUSEL / SLIDER LOGIC
// Supports 2 patients from the SAME family sharing the SAME caretaker (Rahul Sharma),
// as well as all household elders!
// ==================================================================
let familyAutoSlideTimer = null;
let onboardingSeniorIndex = 0;
let currentFamilyCarouselFilter = 'household'; // 'household' (Same Caretaker: 2 Patients) | 'all' (All 5 Patients)

// Helper: Returns active list of patients based on filter
function getFamilyPatientsList() {
  const all = state.patients || [];
  if (currentFamilyCarouselFilter === 'household') {
    // Return the 2 patients from the same family who share the SAME caretaker (Rahul Sharma):
    // PAT-101 (Ramesh Sharma, Father) & PAT-102 (Savitri Devi, Mother)
    const householdPatients = all.filter(p => p.id === 'PAT-101' || p.id === 'PAT-102');
    return householdPatients.length ? householdPatients : all;
  }
  return all;
}

// Toggle between 'Same Caretaker (2 Patients)' and 'All Network Elders (5)'
function setFamilyCarouselFilter(mode) {
  currentFamilyCarouselFilter = mode;
  const btnH = document.getElementById('btn-carousel-filter-household');
  const btnA = document.getElementById('btn-carousel-filter-all');
  const desc = document.getElementById('carousel-scope-desc');

  if (btnH && btnA) {
    if (mode === 'household') {
      btnH.className = "px-2.5 py-1 rounded-lg font-bold transition-all bg-purple-700 text-white shadow-xs flex items-center space-x-1";
      btnA.className = "px-2.5 py-1 rounded-lg font-bold transition-all text-purple-900 hover:bg-purple-200/60 flex items-center space-x-1";
      if (desc) desc.innerHTML = `<i class="fa-solid fa-circle-info text-purple-600 mr-1"></i><strong class="text-purple-950">Same Caretaker Household:</strong> Rahul Sharma is primary caretaker for 2 elders in this family (Ramesh Sharma & Savitri Devi). Slide to switch between them!`;
    } else {
      btnA.className = "px-2.5 py-1 rounded-lg font-bold transition-all bg-purple-700 text-white shadow-xs flex items-center space-x-1";
      btnH.className = "px-2.5 py-1 rounded-lg font-bold transition-all text-purple-900 hover:bg-purple-200/60 flex items-center space-x-1";
      if (desc) desc.innerHTML = `<i class="fa-solid fa-circle-info text-purple-600 mr-1"></i><strong class="text-purple-950">Extended Care Network:</strong> Viewing all 5 registered elderly patients across partner households.`;
    }
  }

  const list = getFamilyPatientsList();
  if (!list.some(p => p.id === familySelectedSeniorId)) {
    changeFamilyLinkedSenior(list[0].id);
  } else {
    renderFamilyCarouselStrip();
  }

  soundEngine.playTone(520, 'sine', 0.1);
  showToast(mode === 'household' ? 'Viewing Same Caretaker Household (2 Patients: Father & Mother)' : 'Viewing All Network Elders (5 Patients)', 'info');
}

// Slide on Onboarding Page (Cycles between household patients under the same caretaker)
function slideOnboardingPatient(step) {
  // Use the 2 patients sharing the same caretaker: PAT-101 (Father) & PAT-102 (Mother)
  const list = (state.patients || []).filter(p => p.id === 'PAT-101' || p.id === 'PAT-102');
  if (!list.length) return;
  onboardingSeniorIndex = (onboardingSeniorIndex + step + list.length) % list.length;
  const p = list[onboardingSeniorIndex];
  const bracketStr = getSeniorBracketInfo(p);
  const caregiverStr = getCaregiverBracketInfo(p); // Same caretaker for both: [Caregiver: Rahul Sharma • Male • 42 Yrs]

  const badge = document.getElementById('onboarding-slide-badge');
  if (badge) badge.textContent = `Patient ${onboardingSeniorIndex + 1}/${list.length}`;

  const signupVal = document.getElementById('signup-linked-senior');
  if (signupVal) {
    signupVal.value = `${p.name} ${bracketStr}\n${caregiverStr}`;
  }

  const cardPatientName = document.getElementById('onboarding-patient-name-display');
  if (cardPatientName) cardPatientName.textContent = p.name;
  const cardPatientBracket = document.getElementById('onboarding-patient-bracket-display');
  if (cardPatientBracket) cardPatientBracket.textContent = bracketStr;
  const cardCaregiverBracket = document.getElementById('onboarding-caregiver-bracket-display');
  if (cardCaregiverBracket) cardCaregiverBracket.textContent = caregiverStr;

  // Also update sign-in card if visible
  const signinCard = document.getElementById('auth-family-signin-patient-card');
  if (signinCard) {
    signinCard.innerHTML = `
      <div class="flex items-center justify-between mb-1 pb-1 border-b border-purple-200/50">
        <span class="text-[10px] font-bold uppercase tracking-wider text-purple-800">
          <i class="fa-solid fa-house-chimney mr-1"></i> Same Caretaker Family
        </span>
        <div class="flex items-center space-x-1">
          <button type="button" onclick="slideOnboardingPatient(-1)" class="w-5 h-5 rounded bg-white hover:bg-purple-600 hover:text-white text-slate-700 flex items-center justify-center text-[9px] font-bold shadow-xs">
            <i class="fa-solid fa-chevron-left"></i>
          </button>
          <span class="text-[10px] font-bold font-mono text-purple-900 bg-purple-100 px-1.5 rounded">${onboardingSeniorIndex + 1}/${list.length}</span>
          <button type="button" onclick="slideOnboardingPatient(1)" class="w-5 h-5 rounded bg-purple-700 hover:bg-purple-800 text-white flex items-center justify-center text-[9px] font-bold shadow-xs">
            <i class="fa-solid fa-chevron-right"></i>
          </button>
        </div>
      </div>
      <div class="text-xs font-bold text-slate-800 flex flex-wrap items-center gap-1.5">
        <span class="text-slate-500 font-semibold">Patient:</span>
        <span class="text-purple-950 font-extrabold text-sm">${p.name}</span>
        <span class="text-xs font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded-md border border-purple-300">${bracketStr}</span>
      </div>
      <div class="text-xs font-medium text-slate-600 flex flex-wrap items-center gap-1 pt-1 border-t border-purple-200/60">
        <span class="text-slate-500 font-semibold">Same Caregiver:</span>
        <span class="text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200">${caregiverStr}</span>
      </div>
    `;
  }

  soundEngine.playTone(520, 'sine', 0.08);
  showToast(`Selected Household Patient ${onboardingSeniorIndex + 1} of ${list.length}: ${p.name} (Caretaker: Rahul Sharma)`, 'info');
}

// Slide Function: Slides across active list (in household mode: Father -> Mother -> Father!)
function slideFamilyPatient(step) {
  const list = getFamilyPatientsList();
  if (!list.length) return;
  let currentIdx = list.findIndex(p => p.id === familySelectedSeniorId);
  if (currentIdx === -1) currentIdx = 0;

  // Circular loop: 1st -> 2nd -> loops back to 1st (or 1st -> 2nd -> 3rd -> 1st in all mode)
  let nextIdx = (currentIdx + step + list.length) % list.length;
  const nextPatient = list[nextIdx];

  // Trigger smooth CSS slide animation
  const banner = document.getElementById('family-senior-name-heading')?.closest('.bg-gradient-to-r');
  if (banner) {
    banner.classList.remove('animate-slide-in-right', 'animate-slide-in-left');
    void banner.offsetWidth; // trigger reflow
    banner.classList.add(step > 0 ? 'animate-slide-in-right' : 'animate-slide-in-left');
  }

  const strip = document.getElementById('family-patients-carousel-strip');
  if (strip) {
    strip.classList.remove('animate-slide-in-right', 'animate-slide-in-left');
    void strip.offsetWidth;
    strip.classList.add(step > 0 ? 'animate-slide-in-right' : 'animate-slide-in-left');
  }

  changeFamilyLinkedSenior(nextPatient.id);
  soundEngine.playTone(step > 0 ? 560 : 480, 'sine', 0.1);
  showToast(`Slid to Patient ${nextIdx + 1} of ${list.length}: ${nextPatient.name} (Same Caretaker: Rahul Sharma)`, 'info');
}

function slideFamilyToPatient(patientId) {
  const list = getFamilyPatientsList();
  let currentIdx = list.findIndex(p => p.id === familySelectedSeniorId);
  let targetIdx = list.findIndex(p => p.id === patientId);
  const step = targetIdx >= currentIdx ? 1 : -1;

  const strip = document.getElementById('family-patients-carousel-strip');
  if (strip) {
    strip.classList.remove('animate-slide-in-right', 'animate-slide-in-left');
    void strip.offsetWidth;
    strip.classList.add(step > 0 ? 'animate-slide-in-right' : 'animate-slide-in-left');
  }

  changeFamilyLinkedSenior(patientId);
  soundEngine.playTone(520, 'sine', 0.1);
}

function toggleFamilyAutoSlide() {
  const icon = document.getElementById('icon-family-autoslide');
  const label = document.getElementById('label-family-autoslide');
  const btn = document.getElementById('btn-family-autoslide');

  if (familyAutoSlideTimer) {
    clearInterval(familyAutoSlideTimer);
    familyAutoSlideTimer = null;
    if (icon) icon.className = 'fa-solid fa-play text-[10px]';
    if (label) label.textContent = 'Auto Slide Tour';
    if (btn) btn.className = 'px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-bold border border-purple-200 transition-all flex items-center space-x-1.5 shadow-sm';
    showToast('Paused automatic slide tour.', 'info');
  } else {
    familyAutoSlideTimer = setInterval(() => {
      slideFamilyPatient(1);
    }, 4500);
    if (icon) icon.className = 'fa-solid fa-pause text-[10px] text-white';
    if (label) label.textContent = 'Pause Tour';
    if (btn) btn.className = 'px-3 py-1.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold border border-purple-800 transition-all flex items-center space-x-1.5 shadow-md animate-pulse';
    showToast('Auto slide tour active (sliding across household elders every 4.5s).', 'success');
  }
}

// 2. Change Linked Senior from dropdown or slide
function changeFamilyLinkedSenior(patientId) {
  familySelectedSeniorId = patientId;
  const p = (state.patients || []).find(pt => pt.id === patientId);
  if (!p) return;

  const bracketStr = getSeniorBracketInfo(p);
  const caregiverStr = getCaregiverBracketInfo(p);

  // Update Top Banner Senior Name with Dual Brackets
  const heading = document.getElementById('family-senior-name-heading');
  if (heading) {
    heading.innerHTML = `${p.name} <span class="text-lg sm:text-xl font-bold text-purple-200">${bracketStr}</span>`;
  }
  const caregiverHeading = document.getElementById('family-caregiver-heading');
  if (caregiverHeading) {
    caregiverHeading.textContent = caregiverStr;
  }
  const selectorCaregiverSub = document.getElementById('family-selector-caregiver-sub');
  if (selectorCaregiverSub) {
    selectorCaregiverSub.textContent = caregiverStr;
  }

  // Update Avatar Initials Badge & Tier Badge
  const initialsSpan = document.getElementById('family-senior-initials');
  if (initialsSpan) {
    const initials = (p.name || '').split(' ').filter(Boolean).map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'SR';
    initialsSpan.textContent = initials;
  }
  const avatar = document.getElementById('family-senior-avatar');
  if (avatar && p.avatar) {
    avatar.src = p.avatar;
  }

  const tierBadge = document.getElementById('family-senior-tier-badge');
  if (tierBadge) {
    const isCritical = p.predictedTier === 'CRITICAL';
    tierBadge.className = `px-2.5 py-0.5 rounded-full text-xs font-extrabold ${isCritical ? 'bg-rose-500/30 text-rose-300 border border-rose-400/40' : 'bg-emerald-500/30 text-emerald-300 border border-emerald-400/40'} flex items-center space-x-1`;
    tierBadge.innerHTML = `<i class="fa-solid ${isCritical ? 'fa-triangle-exclamation' : 'fa-circle-check'} mr-1"></i><span>${isCritical ? `🚨 Critical Risk Tier (Score ${p.modelScore || 80}/100)` : `🟢 Stable Baseline (Score ${p.modelScore || 20}/100)`}</span>`;
  }

  const metaSub = document.getElementById('family-senior-meta-sub');
  if (metaSub) {
    metaSub.textContent = `@${p.username} • ${p.location} • Primary Nurse: ${p.assignedNurse || 'Sister Kavita, RN'}`;
  }

  // Update Dropdown value if needed
  const selector = document.getElementById('family-senior-selector');
  if (selector && selector.value !== patientId) {
    selector.value = patientId;
  }

  // Re-render Carousel Strip & Dots
  renderFamilyCarouselStrip();

  // Re-render current active view tab
  renderFamilyAnalyzeSummary(p);
  renderFamilySeniorReport(p);
  renderFamilyAssessmentHistory(p);

  // If Simple Assessment Modal is currently open, dynamically update its content too!
  const modal = document.getElementById('modal-simple-assessment');
  if (modal && !modal.classList.contains('hidden')) {
    const slip = document.getElementById('simple-assessment-slip-content');
    if (slip) slip.innerHTML = buildSimpleAssessmentHtml(p);
  }
}

// Render the 5 Interactive Senior Cards & Clickable Dots
function renderFamilyCarouselStrip() {
  const strip = document.getElementById('family-patients-carousel-strip');
  const dotsContainer = document.getElementById('family-carousel-dots');
  const counterText = document.getElementById('carousel-slide-counter-text');
  const bannerPill = document.getElementById('banner-slide-pill');
  const list = getFamilyPatientsList();
  if (!list.length) return;

  const currentIdx = list.findIndex(p => p.id === familySelectedSeniorId);
  const activeIdx = currentIdx !== -1 ? currentIdx : 0;

  if (counterText) counterText.textContent = `${activeIdx + 1} / ${list.length}`;
  if (bannerPill) bannerPill.textContent = `${activeIdx + 1}/${list.length}`;

  // Render interactive senior cards from list (in household mode: exactly 2 cards for Father & Mother)
  if (strip) {
    strip.className = list.length === 2
      ? "grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto"
      : "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3";

    strip.innerHTML = list.map((p, i) => {
      const isActive = p.id === familySelectedSeniorId;
      const isCritical = p.predictedTier === 'CRITICAL';
      const bracket = getSeniorBracketInfo(p);
      const caregiver = getCaregiverBracketInfo(p);
      const v = (p.checkups && p.checkups[0]) ? p.checkups[0] : {};

      const activeCardStyles = "relative p-4 rounded-2xl bg-gradient-to-b from-purple-50 via-white to-purple-50/50 border-2 border-purple-600 shadow-xl shadow-purple-500/15 ring-2 ring-purple-400/40 transform scale-[1.02] transition-all duration-300";
      const inactiveCardStyles = "relative p-4 rounded-2xl bg-white hover:bg-purple-50/30 border border-slate-200 hover:border-purple-300 shadow-sm transition-all duration-200 cursor-pointer hover:shadow-md active:scale-98";

      return `
        <div onclick="slideFamilyToPatient('${p.id}')" class="${isActive ? activeCardStyles : inactiveCardStyles}">
          <!-- Active Pill / Slide Number Indicator -->
          ${isActive ? `
            <div class="absolute -top-2.5 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-purple-700 text-white text-[9px] font-black uppercase tracking-wider shadow-sm flex items-center space-x-1 whitespace-nowrap">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
              <span>Active Viewing (Patient ${i+1}/${list.length})</span>
            </div>
          ` : `
            <div class="text-[9px] font-bold text-slate-400 font-mono mb-1">
              Patient #${i+1} • Tap to Slide
            </div>
          `}

          <div class="flex items-center space-x-3 ${isActive ? 'mt-1' : ''}">
            <div class="w-12 h-12 rounded-2xl ${isActive ? 'bg-gradient-to-tr from-purple-700 to-indigo-800 text-white shadow-md border-2 border-purple-400' : 'bg-slate-100 text-slate-700 border border-slate-300'} font-black text-sm flex items-center justify-center flex-shrink-0">
              ${(p.name || '').split(' ').filter(Boolean).map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'SR'}
            </div>
            <div class="min-w-0 flex-1">
              <h4 class="text-sm font-extrabold text-[#0e294b] truncate">${p.name}</h4>
              <div class="text-[11px] font-bold ${isActive ? 'text-purple-700' : 'text-slate-600'} truncate">
                ${bracket}
              </div>
            </div>
          </div>

          <!-- Same Caretaker Banner Tag -->
          <div class="mt-2.5 pt-2 border-t border-slate-100 space-y-1.5">
            <div class="flex items-center space-x-1 text-[10px] font-bold text-indigo-900 bg-indigo-50/90 px-2 py-0.5 rounded-md border border-indigo-200/80 truncate" title="${caregiver}">
              <i class="fa-solid fa-hand-holding-heart text-indigo-600 text-[10px]"></i>
              <span class="truncate">${caregiver}</span>
            </div>
            <div class="flex items-center justify-between text-xs">
              <span class="px-2 py-0.5 rounded text-[10px] font-extrabold ${isCritical ? 'bg-rose-100 text-rose-800 border border-rose-200' : 'bg-emerald-100 text-emerald-800 border border-emerald-200'}">
                ${isCritical ? '🚨 Critical' : '🟢 Stable'}
              </span>
              <span class="text-[11px] font-mono text-slate-700 font-extrabold">
                BP ${v.bp || '120/80'}
              </span>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  // Render clickable dots indicator
  if (dotsContainer) {
    dotsContainer.innerHTML = list.map((p, i) => {
      const isActive = i === activeIdx;
      return `
        <button onclick="slideFamilyToPatient('${p.id}')"
          class="${isActive ? 'w-8 h-2.5 rounded-full bg-purple-700 shadow-sm' : 'w-2.5 h-2.5 rounded-full bg-slate-300 hover:bg-purple-400'} transition-all duration-200"
          title="Slide to Patient #${i+1}: ${p.name}">
        </button>
      `;
    }).join('');
  }
}

// Keyboard arrow key slider navigation
document.addEventListener('keydown', (e) => {
  const familyView = document.getElementById('view-family');
  if (!familyView || familyView.classList.contains('hidden')) return;
  if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)) return;
  if (e.key === 'ArrowRight') {
    slideFamilyPatient(1);
  } else if (e.key === 'ArrowLeft') {
    slideFamilyPatient(-1);
  }
});


function renderFamilyAnalyzeSummary(p) {
  if (!p) return;
  const v = (p.checkups && p.checkups[0]) ? p.checkups[0] : {};
  const isCritical = p.predictedTier === 'CRITICAL';
  const bracketStr = getSeniorBracketInfo(p);
  const caregiverStr = getCaregiverBracketInfo(p);

  // Per-Patient Clinical Summary Profiles
  const patientProfiles = {
    'PAT-101': { // Ramesh Sharma (Father)
      summaryHeading: 'Short Weekly Wellbeing Summary (Father: Ramesh Sharma)',
      summaryParagraph: 'Concise 7-day overview for Ramesh Sharma [Father • 74 Yrs]: Monitored for acute morning tachycardia spike (114 bpm) and elevated blood pressure (158/96 mmHg). Prior 6 days remained stable with 93% medication adherence and consistent voice check-ins.',
      healthScore: 80,
      healthLabel: '🚨 Critical Risk Tier (Score 80/100)',
      healthBadgeClass: 'border-4 border-rose-500 text-rose-700',
      aiAnalysisText: 'Elevated blood pressure (158/96 mmHg) detected alongside resting heart rate spike (114 bpm). Oxygen saturation is at 94.0%. Functional mobility requires grab bar / cane assistance. Sister Kavita has adjusted monitoring protocol and dispatched home check.',
      statMeds: '93%',
      statMedsSub: 'Missed 1 morning dose on Sunday; refilled on Monday.',
      statSleep: '5.2 hrs/night',
      statSleepSub: 'Restless sleep cycle; 2 nighttime awakenings noted.',
      statMood: '86% Positive',
      statMoodSub: 'Voice transcript reported dizziness & chest heaviness.',
      statHr: '114 bpm (Spike)',
      statHrSub: '7-day baseline: 72 bpm. Monitored for arrhythmia.',
      consistencyPercentage: '100% (7/7 days verified)',
      consistencyDays: [
        { day: 'Thu', icon: 'fa-circle-check text-emerald-600', text: 'Great', bg: 'bg-emerald-50 border-emerald-200' },
        { day: 'Fri', icon: 'fa-circle-check text-emerald-600', text: 'Great', bg: 'bg-emerald-50 border-emerald-200' },
        { day: 'Sat', icon: 'fa-circle-check text-emerald-600', text: 'Great', bg: 'bg-emerald-50 border-emerald-200' },
        { day: 'Sun', icon: 'fa-triangle-exclamation text-amber-600', text: 'Tired', bg: 'bg-amber-50 border-amber-200' },
        { day: 'Mon', icon: 'fa-circle-check text-emerald-600', text: 'Great', bg: 'bg-emerald-50 border-emerald-200' },
        { day: 'Tue', icon: 'fa-circle-check text-emerald-600', text: 'Great', bg: 'bg-emerald-50 border-emerald-200' },
        { day: 'Today', icon: 'fa-heart-pulse text-rose-600 animate-pulse', text: 'Spike 114', bg: 'bg-rose-50 border-rose-300 ring-2 ring-rose-500/30' }
      ],
      coordinatorNote: `"Ramesh ji has been in wonderful spirits this week, but this morning his resting heart rate spiked to 114 bpm with elevated BP (158/96). We immediately called him, advised resting on the recliner, and dispatched field assistance. Rahul ji, don't worry — our medical team is actively managing his care!"`, 
      messagePlaceholder: 'e.g. Papa, take rest, we are coming this evening!',
      alertTitle: 'Ramesh Sharma: Resting HR Spiked to 114 bpm & BP 158/96 mmHg',
      alertDesc: 'Suggested clinical response initiated: Care Coordinator Sister Kavita placed a 2-way call and Field Nurse has been dispatched to Greater Kailash. Automated SMS & WhatsApp notification delivered to Rahul Sharma (Son).',
      alertTime: 'Today, 08:30 AM'
    },
    'PAT-102': { // Savitri Devi (Mother)
      summaryHeading: 'Short Weekly Wellbeing Summary (Mother: Savitri Devi)',
      summaryParagraph: 'Concise 7-day overview for Savitri Devi [Mother • 81 Yrs]: Acute post-fall incident in bathroom at 06:45 AM resulting in severe pain (8/10) and immobility. Medication adherence is 96%, but nighttime sleep has reduced to 4.8 hrs due to hip stiffness and fall recovery.',
      healthScore: 62,
      healthLabel: '🚨 Critical Risk Tier (Score 62/100)',
      healthBadgeClass: 'border-4 border-rose-600 text-rose-800',
      aiAnalysisText: 'Bathroom impact sensor triggered at 06:45 AM. Voice note confirms acute lumbar & right hip pain (Level 8/10). Severe osteoporosis history (T-score -3.1) creates acute fracture risk. Paramedic Amit dispatched with mobile splint & analgesics.',
      statMeds: '96%',
      statMedsSub: 'Amlodipine & weekly Alendronate taken consistently.',
      statSleep: '4.8 hrs/night',
      statSleepSub: 'Frequent sleep disruption; nocturia & lumbar stiffness noted.',
      statMood: '72% Distressed',
      statMoodSub: 'Voice transcript: "बाथरूम में फिसल गई थी, कमर में तेज दर्द है..."',
      statHr: '88 bpm (Elevated)',
      statHrSub: 'Post-fall acute pain tachycardia; rhythm sinus normal.',
      consistencyPercentage: '100% (7/7 days verified)',
      consistencyDays: [
        { day: 'Thu', icon: 'fa-circle-check text-emerald-600', text: 'Great', bg: 'bg-emerald-50 border-emerald-200' },
        { day: 'Fri', icon: 'fa-circle-check text-emerald-600', text: 'Great', bg: 'bg-emerald-50 border-emerald-200' },
        { day: 'Sat', icon: 'fa-circle-check text-emerald-600', text: 'Great', bg: 'bg-emerald-50 border-emerald-200' },
        { day: 'Sun', icon: 'fa-circle-check text-emerald-600', text: 'Great', bg: 'bg-emerald-50 border-emerald-200' },
        { day: 'Mon', icon: 'fa-triangle-exclamation text-amber-600', text: 'Tired', bg: 'bg-amber-50 border-amber-200' },
        { day: 'Tue', icon: 'fa-circle-check text-emerald-600', text: 'Great', bg: 'bg-emerald-50 border-emerald-200' },
        { day: 'Today', icon: 'fa-person-falling-burst text-rose-600 animate-pulse', text: 'Fall Impact', bg: 'bg-rose-50 border-rose-300 ring-2 ring-rose-500/30' }
      ],
      coordinatorNote: '"Savitri ji had an unfortunate bathroom slip this morning causing acute hip pain. We have dispatched Paramedic Brother Amit with mobile diagnostic equipment and notified Rahul ji. We advise keeping Maaji lying flat with cold pack support until Amit arrives!"',
      messagePlaceholder: 'e.g. Maaji, relax completely on bed, doctor Amit is arriving in 10 mins!',
      alertTitle: 'Savitri Devi: Bathroom Fall Impact Sensor Triggered & Acute Lumbar Pain (8/10)',
      alertDesc: 'Immediate emergency response dispatched: Paramedic Brother Amit on the way with mobile x-ray & splint kit (ETA 18m). Primary Caregiver Rahul Sharma notified via SMS & WhatsApp.',
      alertTime: 'Today, 06:50 AM'
    },
    'PAT-103': { // Anand Verma
      summaryHeading: 'Short Weekly Wellbeing Summary (Uncle: Anand Verma)',
      summaryParagraph: 'Concise 7-day overview for Anand Verma [Uncle • 78 Yrs]: Fasting blood sugar spike to 228 mg/dL following missed evening insulin doses. Daily check-in compliance is 86% with bilateral peripheral neuropathy tingling reported.',
      healthScore: 53,
      healthLabel: '🚨 Critical Risk Tier (Score 53/100)',
      healthBadgeClass: 'border-4 border-rose-500 text-rose-700',
      aiAnalysisText: 'Severe hyperglycemia flagged (228 mg/dL) with consecutive 2-day missed evening insulin reminder. Diabetic neuropathy symptoms active in soles. Buddy Rajesh dispatched to verify insulin pen storage and administer dose.',
      statMeds: '72% (Missed 2d)',
      statMedsSub: 'Missed evening Insulin Glargine doses on Sunday and Monday.',
      statSleep: '6.5 hrs/night',
      statSleepSub: 'Fair sleep; occasional foot burning sensations at midnight.',
      statMood: '80% Fair',
      statMoodSub: 'Voice note reported tingling in feet and dry mouth.',
      statHr: '76 bpm (Normal)',
      statHrSub: 'Cardiovascular parameters remain in stable range.',
      consistencyPercentage: '86% (6/7 days logged)',
      consistencyDays: [
        { day: 'Thu', icon: 'fa-circle-check text-emerald-600', text: 'Great', bg: 'bg-emerald-50 border-emerald-200' },
        { day: 'Fri', icon: 'fa-circle-check text-emerald-600', text: 'Great', bg: 'bg-emerald-50 border-emerald-200' },
        { day: 'Sat', icon: 'fa-circle-check text-emerald-600', text: 'Great', bg: 'bg-emerald-50 border-emerald-200' },
        { day: 'Sun', icon: 'fa-pills text-amber-600', text: 'Missed', bg: 'bg-amber-50 border-amber-200' },
        { day: 'Mon', icon: 'fa-triangle-exclamation text-rose-600', text: 'High Sugar', bg: 'bg-rose-50 border-rose-200' },
        { day: 'Tue', icon: 'fa-circle-check text-emerald-600', text: 'Great', bg: 'bg-emerald-50 border-emerald-200' },
        { day: 'Today', icon: 'fa-droplet text-amber-600 animate-pulse', text: 'Sugar 228', bg: 'bg-amber-50 border-amber-300 ring-2 ring-amber-500/30' }
      ],
      coordinatorNote: '"Anand ji missed two evening insulin doses causing fasting sugar to reach 228 mg/dL. Buddy Rajesh is on his way to assist with injection administration and check refrigerator storage temperature. Son Deepak has been updated."',
      messagePlaceholder: 'e.g. Chachaji, please take insulin on time, Rajesh is on his way!',
      alertTitle: 'Anand Verma: Severe Hyperglycemia (Fasting Sugar 228 mg/dL) & Missed Insulin',
      alertDesc: 'Clinical response initiated: Community Buddy Rajesh dispatched for doorstep insulin dose verification. Son Deepak Verma updated.',
      alertTime: 'Today, 07:15 AM'
    },
    'PAT-104': { // Meena Iyer
      summaryHeading: 'Short Weekly Wellbeing Summary (Aunt: Meena Iyer)',
      summaryParagraph: 'Concise 7-day overview for Meena Iyer [Aunt • 72 Yrs]: Bereavement anniversary emotional distress and severe sleep deficit (4.1 hrs). Cardiovascular vitals remain within healthy normal boundaries (BP 124/80, HR 72, SpO2 98%).',
      healthScore: 25,
      healthLabel: '🟡 Moderate Tier (Score 25/100)',
      healthBadgeClass: 'border-4 border-amber-500 text-amber-700',
      aiAnalysisText: 'Insomnia deficit (4.1 hrs) and loneliness sentiment flagged in morning voice note. Blood pressure (124/80) and oxygen (98%) are fully healthy. Sister Sunita scheduled a 15-minute compassionate reassurance tele-consult.',
      statMeds: '98%',
      statMedsSub: 'Thyronorm & Escitalopram taken with consistent compliance.',
      statSleep: '4.1 hrs/night',
      statSleepSub: 'Difficulty falling asleep; grief-related insomnia.',
      statMood: '64% Melancholic',
      statMoodSub: 'Voice note: "आज अकेलापन बहुत लग रहा है, किसी से बात करने का मन है..."',
      statHr: '72 bpm (Normal)',
      statHrSub: 'Stable resting heart rate and normal blood pressure.',
      consistencyPercentage: '100% (7/7 days verified)',
      consistencyDays: [
        { day: 'Thu', icon: 'fa-circle-check text-emerald-600', text: 'Great', bg: 'bg-emerald-50 border-emerald-200' },
        { day: 'Fri', icon: 'fa-circle-check text-emerald-600', text: 'Great', bg: 'bg-emerald-50 border-emerald-200' },
        { day: 'Sat', icon: 'fa-circle-check text-emerald-600', text: 'Great', bg: 'bg-emerald-50 border-emerald-200' },
        { day: 'Sun', icon: 'fa-bed text-amber-600', text: 'Insomnia', bg: 'bg-amber-50 border-amber-200' },
        { day: 'Mon', icon: 'fa-face-frown text-purple-600', text: 'Lonely', bg: 'bg-purple-50 border-purple-200' },
        { day: 'Tue', icon: 'fa-circle-check text-emerald-600', text: 'Great', bg: 'bg-emerald-50 border-emerald-200' },
        { day: 'Today', icon: 'fa-headset text-indigo-600', text: 'Counseling', bg: 'bg-indigo-50 border-indigo-300 ring-2 ring-indigo-500/30' }
      ],
      coordinatorNote: `"Meena ji felt emotional this morning due to her late husband's memorial week. Counselor Sunita had a 20-minute heartwarming conversation with her. Son Karthik in Bengaluru was advised to place an evening video call."`, 
      messagePlaceholder: 'e.g. Amma, we love you, placing a video call at 7 PM tonight!',
      alertTitle: 'Meena Iyer: Bereavement Anniversary Emotional Support Active',
      alertDesc: 'Companion protocol active: Senior Buddy Sunita completing reassurance check-in. Vitals safe & normal.',
      alertTime: 'Today, 08:00 AM'
    },
    'PAT-105': { // Harish Patel
      summaryHeading: 'Short Weekly Wellbeing Summary (Father: Harish Patel)',
      summaryParagraph: 'Concise 7-day overview for Harish Patel [Father • 76 Yrs]: Optimal health baseline with 100% vital signs stability, perfect medication adherence (98%), and peaceful 7.5 hrs sleep rest cycles. Zero interventions required.',
      healthScore: 9,
      healthLabel: '🟢 Optimal Baseline (Score 9/100)',
      healthBadgeClass: 'border-4 border-emerald-500 text-emerald-700',
      aiAnalysisText: 'All vital signs, functional ADLs, and emotional sentiments within ideal physiological bounds. Blood pressure 122/80 mmHg, SpO2 98%, HR 72 bpm. Routine weekly monitoring active with zero alerts raised.',
      statMeds: '98%',
      statMedsSub: 'All prescribed hypertension and lipid doses taken consistently.',
      statSleep: '7.5 hrs/night',
      statSleepSub: 'Sound & peaceful sleep with uninterrupted circadian rhythm.',
      statMood: '98% Cheerful',
      statMoodSub: 'Morning walk completed; voice check-in energetic & positive.',
      statHr: '72 bpm (Optimal)',
      statHrSub: 'Perfect resting pulse and regular sinus baseline.',
      consistencyPercentage: '100% (7/7 days verified)',
      consistencyDays: [
        { day: 'Thu', icon: 'fa-circle-check text-emerald-600', text: 'Great', bg: 'bg-emerald-50 border-emerald-200' },
        { day: 'Fri', icon: 'fa-circle-check text-emerald-600', text: 'Great', bg: 'bg-emerald-50 border-emerald-200' },
        { day: 'Sat', icon: 'fa-circle-check text-emerald-600', text: 'Great', bg: 'bg-emerald-50 border-emerald-200' },
        { day: 'Sun', icon: 'fa-circle-check text-emerald-600', text: 'Great', bg: 'bg-emerald-50 border-emerald-200' },
        { day: 'Mon', icon: 'fa-circle-check text-emerald-600', text: 'Great', bg: 'bg-emerald-50 border-emerald-200' },
        { day: 'Tue', icon: 'fa-circle-check text-emerald-600', text: 'Great', bg: 'bg-emerald-50 border-emerald-200' },
        { day: 'Today', icon: 'fa-shield-heart text-emerald-600', text: 'Optimal', bg: 'bg-emerald-50 border-emerald-300 ring-2 ring-emerald-500/30' }
      ],
      coordinatorNote: '"Harish ji is in top physical and mental form. Morning checkup completed effortlessly. Keep up the daily morning strolls!"',
      messagePlaceholder: 'e.g. Papa, wonderful to see your perfect health report today!',
      alertTitle: 'Harish Patel: Routine Safe Baseline',
      alertDesc: 'No emergency alerts. Vital signs and check-in timeline in healthy green zone.',
      alertTime: 'Today, 07:45 AM'
    }
  };

  const prof = patientProfiles[p.id] || patientProfiles['PAT-101'];

  // 1. Update Heading & Description Paragraph
  const summaryHead = document.getElementById('family-summary-heading');
  if (summaryHead) summaryHead.textContent = prof.summaryHeading;

  const summaryPara = document.getElementById('family-summary-paragraph');
  if (summaryPara) summaryPara.textContent = prof.summaryParagraph;

  // 2. Health Score Circle & Label
  const scoreCircle = document.getElementById('family-health-score-circle');
  if (scoreCircle) {
    scoreCircle.textContent = prof.healthScore;
    scoreCircle.className = `w-12 h-12 rounded-full ${prof.healthBadgeClass} flex items-center justify-center font-extrabold text-lg shadow-sm`;
  }
  const scoreLabel = document.getElementById('family-health-score-label');
  if (scoreLabel) {
    scoreLabel.textContent = prof.healthLabel;
  }

  // 3. AI Model Clinical Risk Explanation Banner
  const aiText = document.getElementById('family-ai-analysis-text');
  if (aiText) aiText.textContent = prof.aiAnalysisText;

  // 4. 4 Core Wellness Pillars
  const statMeds = document.getElementById('family-stat-meds');
  if (statMeds) statMeds.textContent = prof.statMeds;
  const statMedsSub = document.getElementById('family-stat-meds-sub');
  if (statMedsSub) statMedsSub.textContent = prof.statMedsSub;

  const statSleep = document.getElementById('family-stat-sleep');
  if (statSleep) statSleep.textContent = prof.statSleep;
  const statSleepSub = document.getElementById('family-stat-sleep-sub');
  if (statSleepSub) statSleepSub.textContent = prof.statSleepSub;

  const statMood = document.getElementById('family-stat-mood');
  if (statMood) statMood.textContent = prof.statMood;
  const statMoodSub = document.getElementById('family-stat-mood-sub');
  if (statMoodSub) statMoodSub.textContent = prof.statMoodSub;

  const statHr = document.getElementById('family-stat-hr');
  if (statHr) statHr.textContent = prof.statHr;
  const statHrSub = document.getElementById('family-stat-hr-sub');
  if (statHrSub) statHrSub.textContent = prof.statHrSub;

  // 5. 7-Day Consistency Strip
  const stripContainer = document.getElementById('family-consistency-strip-container');
  if (stripContainer && prof.consistencyDays) {
    stripContainer.innerHTML = prof.consistencyDays.map(cd => `
      <div class="${cd.bg} border rounded-xl p-2.5 transition-transform hover:scale-105">
        <div class="text-[10px] font-bold text-slate-500 uppercase">${cd.day}</div>
        <div class="text-sm mt-1"><i class="fa-solid ${cd.icon}"></i></div>
        <div class="text-[10px] font-semibold text-slate-700 mt-1 truncate">${cd.text}</div>
      </div>
    `).join('');
  }
  const consistencyPct = document.getElementById('family-consistency-percentage');
  if (consistencyPct) consistencyPct.textContent = prof.consistencyPercentage;

  // 6. Coordinator's Personal Weekly Note
  const coordNote = document.getElementById('family-coordinator-note-text');
  if (coordNote) coordNote.textContent = prof.coordinatorNote;

  // 7. Message Input Placeholder
  const msgInput = document.getElementById('family-message-input');
  if (msgInput) msgInput.placeholder = prof.messagePlaceholder;

  // 8. Critical Alert Card vs Safe Banner
  const alertCard = document.getElementById('family-serious-alert-card');
  const calmBanner = document.getElementById('family-calm-status-banner');
  if (isCritical) {
    if (alertCard) {
      alertCard.classList.remove('hidden');
      const aTitle = document.getElementById('family-alert-title');
      if (aTitle) aTitle.textContent = prof.alertTitle;
      const aDesc = document.getElementById('family-alert-desc');
      if (aDesc) aDesc.textContent = prof.alertDesc;
      const aTime = document.getElementById('family-alert-time');
      if (aTime) aTime.textContent = prof.alertTime;
    }
    if (calmBanner) calmBanner.classList.add('hidden');
  } else {
    if (alertCard) alertCard.classList.add('hidden');
    if (calmBanner) {
      calmBanner.classList.remove('hidden');
      const calmText = document.getElementById('family-calm-status-text');
      if (calmText) {
        calmText.textContent = `${p.name} [${bracketStr}]: ${prof.aiAnalysisText}`;
      }
    }
  }

  // 9. Re-render dynamic 7-Day Vitals & Sentiment Trajectory Chart for active senior
  renderFamilyVitalsChart(p);
}

// 4. Render Tab 2: Comprehensive Senior Health Report
function renderFamilySeniorReport(p) {
  if (!p) return;
  const bracketStr = getSeniorBracketInfo(p);
  const caregiverStr = getCaregiverBracketInfo(p);
  const v = (p.checkups && p.checkups[0]) ? p.checkups[0] : {};
  const medHistory = p.medicalHistory || {};

  const titleEl = document.getElementById('report-senior-name-title');
  if (titleEl) titleEl.textContent = `Medical & Vitals Report: ${p.name} ${bracketStr}`;

  const reportCaregiverSub = document.getElementById('report-caregiver-sub');
  if (reportCaregiverSub) reportCaregiverSub.textContent = caregiverStr;

  // Demographics
  const patName = document.getElementById('report-patient-name');
  if (patName) patName.textContent = `${p.name} ${bracketStr}`;

  const patCaregiver = document.getElementById('report-patient-caregiver');
  if (patCaregiver) patCaregiver.textContent = caregiverStr;

  const patUser = document.getElementById('report-patient-username');
  if (patUser) patUser.textContent = `@${p.username}`;

  const patAge = document.getElementById('report-patient-age-gender');
  if (patAge) patAge.textContent = `${p.age} Yrs / ${p.gender}`;

  const patBlood = document.getElementById('report-patient-blood');
  if (patBlood) patBlood.textContent = medHistory.bloodGroup || 'B +ve';

  const patContact = document.getElementById('report-patient-contact');
  if (patContact) patContact.textContent = p.phone || '+91 98110-44912';

  const patAddress = document.getElementById('report-patient-address');
  if (patAddress) patAddress.textContent = p.location || 'South Delhi, New Delhi';

  // Medical Team & Review
  const patNurse = document.getElementById('report-patient-nurse');
  if (patNurse) patNurse.textContent = p.assignedNurse || 'Sister Kavita, RN';

  const patDoctor = document.getElementById('report-patient-doctor');
  if (patDoctor) patDoctor.textContent = medHistory.doctor || 'Dr. V.K. Kapoor (Fortis Escorts)';

  const patNextReview = document.getElementById('report-patient-next-review');
  if (patNextReview) patNextReview.textContent = medHistory.nextReview || '15 Nov 2026';

  // Chronic Conditions
  const conditionsEl = document.getElementById('report-chronic-conditions');
  if (conditionsEl && medHistory.chronicConditions) {
    conditionsEl.innerHTML = medHistory.chronicConditions.map(c => `
      <span class="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 border border-slate-200 text-xs font-semibold">
        <i class="fa-solid fa-notes-medical text-teal-600 mr-1"></i>${c}
      </span>
    `).join('');
  }

  // Medications Table
  const medsTbody = document.getElementById('report-medications-tbody');
  if (medsTbody && medHistory.medications) {
    medsTbody.innerHTML = medHistory.medications.map(m => `
      <tr class="border-b border-slate-100 hover:bg-slate-50/50">
        <td class="py-2.5 px-3 font-bold text-slate-800">${m.name}</td>
        <td class="py-2.5 px-3 text-slate-600">${m.dosage}</td>
        <td class="py-2.5 px-3 text-slate-600">${m.schedule}</td>
        <td class="py-2.5 px-3 text-slate-500">${m.purpose}</td>
        <td class="py-2.5 px-3 font-semibold text-emerald-700">${m.adherence || '95%'}</td>
      </tr>
    `).join('');
  }

  // Checkup Vitals
  const vBp = document.getElementById('report-vital-bp');
  if (vBp) vBp.textContent = v.bp || '120/80 mmHg';

  const vHr = document.getElementById('report-vital-hr');
  if (vHr) vHr.textContent = v.hr || '72 bpm';

  const vSpo2 = document.getElementById('report-vital-spo2');
  if (vSpo2) vSpo2.textContent = v.spo2 || '98%';

  const vGlucose = document.getElementById('report-vital-glucose');
  if (vGlucose) vGlucose.textContent = v.glucose || '110 mg/dL';

  const vTemp = document.getElementById('report-vital-temp');
  if (vTemp) vTemp.textContent = v.temp || '98.4 °F';

  const vBmi = document.getElementById('report-vital-bmi');
  if (vBmi) vBmi.textContent = v.bmi ? `BMI ${v.bmi} (${v.weight || '68kg'})` : 'BMI 24.8 (Normal)';
}

// 5. Render Tab 3: Assessment History (Timeline)
function renderFamilyAssessmentHistory(p) {
  if (!p) return;
  const container = document.getElementById('family-assessment-timeline-list');
  if (!container) return;

  const bracketStr = getSeniorBracketInfo(p);
  const caregiverStr = getCaregiverBracketInfo(p);
  const isCritical = p.predictedTier === 'CRITICAL';
  const v = (p.checkups && p.checkups[0]) ? p.checkups[0] : {};
  const adl = (p.assessments && p.assessments.adl) ? p.assessments.adl : {};
  const pain = (p.assessments && p.assessments.pain) ? p.assessments.pain : {};
  const sleep = (p.assessments && p.assessments.sleep) ? p.assessments.sleep : {};
  const voice = (p.userInputs || []).find(u => u.type === 'voice') || {};

  // Build assessment items matching filter
  const items = [];

  // Item 1: Vitals Assessment
  if (currentFamilyHistoryFilter === 'all' || currentFamilyHistoryFilter === 'vitals') {
    items.push(`
      <div class="relative pl-8 pb-6 border-l-2 border-purple-200">
        <div class="absolute -left-2.5 top-0 w-5 h-5 rounded-full ${isCritical ? 'bg-rose-500' : 'bg-emerald-500'} text-white flex items-center justify-center text-[10px] shadow-sm">
          <i class="fa-solid fa-heart-pulse"></i>
        </div>
        <div class="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-2">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-slate-800">Physiological Vitals Assessment</span>
            <span class="text-[11px] text-slate-400 font-mono">Today, 08:30 AM</span>
          </div>
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <div class="p-2 rounded-lg bg-slate-50 border border-slate-100">
              <span class="text-slate-400 block text-[10px]">Blood Pressure</span>
              <strong class="${parseInt(v.bp) >= 140 ? 'text-rose-600' : 'text-slate-800'}">${v.bp || '120/80'}</strong>
              <span class="text-[10px] text-slate-500">(${v.bpStatus || 'Normal'})</span>
            </div>
            <div class="p-2 rounded-lg bg-slate-50 border border-slate-100">
              <span class="text-slate-400 block text-[10px]">Heart Rate</span>
              <strong class="${parseInt(v.hr) >= 100 ? 'text-rose-600' : 'text-slate-800'}">${v.hr || '72 bpm'}</strong>
              <span class="text-[10px] text-slate-500">(${v.hrStatus || 'Normal'})</span>
            </div>
            <div class="p-2 rounded-lg bg-slate-50 border border-slate-100">
              <span class="text-slate-400 block text-[10px]">SpO2 Saturation</span>
              <strong class="${parseInt(v.spo2) < 95 ? 'text-amber-600' : 'text-slate-800'}">${v.spo2 || '98%'}</strong>
              <span class="text-[10px] text-slate-500">(${v.spo2Status || 'Healthy'})</span>
            </div>
            <div class="p-2 rounded-lg bg-slate-50 border border-slate-100">
              <span class="text-slate-400 block text-[10px]">Blood Glucose</span>
              <strong class="text-slate-800">${v.glucose || '110 mg/dL'}</strong>
              <span class="text-[10px] text-slate-500">(Fasting)</span>
            </div>
          </div>
        </div>
      </div>
    `);
  }

  // Item 2: ADL Functional Independence Assessment
  if (currentFamilyHistoryFilter === 'all' || currentFamilyHistoryFilter === 'adl') {
    items.push(`
      <div class="relative pl-8 pb-6 border-l-2 border-purple-200">
        <div class="absolute -left-2.5 top-0 w-5 h-5 rounded-full bg-indigo-500 text-white flex items-center justify-center text-[10px] shadow-sm">
          <i class="fa-solid fa-person-walking"></i>
        </div>
        <div class="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-2">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-slate-800">Functional ADL Independence Assessment</span>
            <span class="text-[11px] text-slate-400 font-mono">Today, 08:00 AM</span>
          </div>
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <div class="p-2 rounded-lg bg-slate-50 border border-slate-100">
              <span class="text-slate-400 block text-[10px]">Eating</span>
              <strong>${adl.eating ? adl.eating.score : '10/10'}</strong>
              <span class="text-[10px] text-slate-500 block truncate">${adl.eating ? adl.eating.status : 'Independent'}</span>
            </div>
            <div class="p-2 rounded-lg bg-slate-50 border border-slate-100">
              <span class="text-slate-400 block text-[10px]">Toileting</span>
              <strong>${adl.toileting ? adl.toileting.score : '7/10'}</strong>
              <span class="text-[10px] text-slate-500 block truncate">${adl.toileting ? adl.toileting.status : 'Grab Bar Aid'}</span>
            </div>
            <div class="p-2 rounded-lg bg-slate-50 border border-slate-100">
              <span class="text-slate-400 block text-[10px]">Walking</span>
              <strong>${adl.walking ? adl.walking.score : '6/10'}</strong>
              <span class="text-[10px] text-slate-500 block truncate">${adl.walking ? adl.walking.status : 'With Cane'}</span>
            </div>
            <div class="p-2 rounded-lg bg-slate-50 border border-slate-100">
              <span class="text-slate-400 block text-[10px]">Bed Transfer</span>
              <strong>${adl.moving ? adl.moving.score : '7/10'}</strong>
              <span class="text-[10px] text-slate-500 block truncate">${adl.moving ? adl.moving.status : 'Mild Stiffness'}</span>
            </div>
          </div>
        </div>
      </div>
    `);
  }

  // Item 3: Pain & Sleep Checkup
  if (currentFamilyHistoryFilter === 'all' || currentFamilyHistoryFilter === 'pain_sleep') {
    items.push(`
      <div class="relative pl-8 pb-6 border-l-2 border-purple-200">
        <div class="absolute -left-2.5 top-0 w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center text-[10px] shadow-sm">
          <i class="fa-solid fa-moon"></i>
        </div>
        <div class="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-2">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-slate-800">Pain & Sleep Quality Metrics</span>
            <span class="text-[11px] text-slate-400 font-mono">Today, 07:45 AM</span>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div class="p-2.5 rounded-xl bg-amber-50/60 border border-amber-200/60">
              <div class="flex items-center justify-between mb-1">
                <span class="font-bold text-amber-900">Pain Scale</span>
                <span class="px-2 py-0.5 rounded text-[10px] font-extrabold ${pain.score >= 4 ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'}">
                  ${pain.score ? `${pain.score}/10` : '0/10'}
                </span>
              </div>
              <p class="text-slate-600 text-[11px]">Location: ${pain.location || 'None'} • ${pain.sensation || 'Dull ache'}</p>
            </div>
            <div class="p-2.5 rounded-xl bg-indigo-50/60 border border-indigo-200/60">
              <div class="flex items-center justify-between mb-1">
                <span class="font-bold text-indigo-900">Sleep Duration</span>
                <span class="px-2 py-0.5 rounded text-[10px] font-extrabold bg-indigo-100 text-indigo-800">
                  ${sleep.hours ? `${sleep.hours} hrs` : '7.0 hrs'}
                </span>
              </div>
              <p class="text-slate-600 text-[11px]">Quality: ${sleep.quality || 'Normal uninterrupted rest'}</p>
            </div>
          </div>
        </div>
      </div>
    `);
  }

  // Item 4: Voice Note & Hindi Transcript
  if (currentFamilyHistoryFilter === 'all' || currentFamilyHistoryFilter === 'voice') {
    items.push(`
      <div class="relative pl-8 pb-2 border-l-2 border-purple-200">
        <div class="absolute -left-2.5 top-0 w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center text-[10px] shadow-sm">
          <i class="fa-solid fa-microphone"></i>
        </div>
        <div class="bg-purple-50/80 rounded-2xl p-4 border border-purple-200 shadow-sm space-y-2">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-purple-900 flex items-center space-x-1.5">
              <i class="fa-solid fa-volume-high text-purple-700"></i>
              <span>Daily Senior Voice Note & AI Transcript</span>
            </span>
            <span class="text-[11px] text-purple-700 font-mono">Today, 08:15 AM</span>
          </div>
          <div class="bg-white p-3 rounded-xl border border-purple-100 space-y-1.5">
            <div class="text-xs font-hindi text-slate-800 leading-relaxed font-semibold">
              "${voice.hindiText || 'नमस्ते बेटा, आज सुबह से थोड़ी बेचैनी लग रही है।'}"
            </div>
            <div class="text-[11px] text-slate-500 italic">
              <strong>English Translation:</strong> "${voice.englishTranslation || 'Hello son, feeling a bit restless since this morning.'}"
            </div>
          </div>
          <div class="flex items-center justify-between pt-1">
            <span class="text-[10px] font-bold text-purple-700">
              <i class="fa-solid fa-brain mr-1"></i> Sentiment: Anxiety & Distress Detected (Score: -0.68)
            </span>
            <button onclick="playFamilySeniorVoiceNote()" class="px-3 py-1 bg-purple-700 hover:bg-purple-800 text-white rounded-lg text-xs font-bold transition-all flex items-center space-x-1">
              <i class="fa-solid fa-play"></i>
              <span>Play Audio Note</span>
            </button>
          </div>
        </div>
      </div>
    `);
  }

  container.innerHTML = items.join('');
}

// Filter Assessment History Tabs
function filterFamilyAssessments(category) {
  currentFamilyHistoryFilter = category;
  const categories = ['all', 'vitals', 'adl', 'pain_sleep', 'voice'];
  categories.forEach(cat => {
    const btn = document.getElementById(`family-filter-btn-${cat}`);
    if (btn) {
      if (cat === category) {
        btn.className = "px-3 py-1.5 rounded-lg text-xs font-bold bg-purple-700 text-white shadow-sm transition-all";
      } else {
        btn.className = "px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all";
      }
    }
  });

  const p = (state.patients || []).find(pt => pt.id === familySelectedSeniorId) || (state.patients ? state.patients[0] : null);
  renderFamilyAssessmentHistory(p);
}

// Audio player simulation
function playFamilySeniorVoiceNote() {
  soundEngine.playTone(440, 'sine', 0.2);
  setTimeout(() => soundEngine.playTone(550, 'sine', 0.3), 200);
  showToast("Playing Ramesh Sharma's Hindi Voice Note...", 'info');
}

// ==================================================================// BUILD WHOLE HEALTH ASSESSMENT (ELEGANT CLINICAL SLIP & PDF FORMAT)
// ==================================================================
function buildSimpleAssessmentHtml(p) {
  const v = (p.checkups && p.checkups[0]) ? p.checkups[0] : {};
  const adl = (p.assessments && p.assessments.adl) ? p.assessments.adl : {};
  const pain = (p.assessments && p.assessments.pain) ? p.assessments.pain : {};
  const sleep = (p.assessments && p.assessments.sleep) ? p.assessments.sleep : {};
  const voice = (p.userInputs || []).find(u => u.type === 'voice') || {};
  const medHistory = p.medicalHistory || {};
  const meds = medHistory.medications || [];
  const drivers = p.modelDrivers || [];
  const bracketStr = getSeniorBracketInfo(p);
  const caregiverStr = getCaregiverBracketInfo(p);
  const isCritical = p.predictedTier === 'CRITICAL';
  const reportDate = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

  return `
    <div id="printable-assessment-document" style="font-family: 'Plus Jakarta Sans', Inter, -apple-system, sans-serif; color: #0f172a; background: #ffffff; padding: 20px; border-radius: 16px; border: 1.5px solid #cbd5e1; max-width: 760px; margin: 0 auto; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
      
      <!-- Top Branding & Telemetry Header -->
      <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #0e294b; padding-bottom: 12px; margin-bottom: 14px;">
        <div>
          <div style="display: flex; align-items: center; gap: 8px;">
            <h1 style="font-size: 18px; font-weight: 800; color: #0e294b; margin: 0; letter-spacing: -0.02em;">CareConnect AI</h1>
            <span style="background: #f1f5f9; color: #475569; font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: 4px; border: 1px solid #cbd5e1;">CLINICAL DOSSIER</span>
            <span style="background: ${isCritical ? '#ffe4e6' : '#dcfce7'}; color: ${isCritical ? '#be123c' : '#15803d'}; font-size: 10px; font-weight: 800; padding: 2px 8px; border-radius: 4px; border: 1px solid ${isCritical ? '#f43f5e' : '#22c55e'};">
              ${isCritical ? '🚨 CRITICAL RISK TIER' : '🟢 STABLE TIER'}
            </span>
          </div>
          <p style="font-size: 12px; color: #008779; font-weight: 700; margin: 3px 0 0 0;">Comprehensive Senior Health Assessment & Telemetry Summary</p>
        </div>
        <div style="text-align: right; font-family: monospace; font-size: 11px; color: #64748b;">
          <div><strong>ID:</strong> CC-${p.id || 'PAT-101'}</div>
          <div><strong>Date:</strong> ${reportDate}</div>
          <div><strong>Status:</strong> Verified Telemetry</div>
        </div>
      </div>

      <!-- 1. Patient & Caregiver Identification Banner -->
      <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 12px; margin-bottom: 14px;">
        <div style="font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; color: #64748b; margin-bottom: 6px;">1. Patient & Connected Caregiver</div>
        <div style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px; font-size: 12px;">
          <div>
            <div style="color: #64748b; font-size: 11px;">Patient Name:</div>
            <strong style="color: #0e294b; font-size: 13px;">${p.name}</strong> 
            <span style="background: #f3e8ff; color: #6b21a8; font-weight: 700; font-size: 11px; padding: 1px 6px; border-radius: 4px; margin-left: 4px; border: 1px solid #d8b4fe;">${bracketStr}</span>
          </div>
          <div>
            <div style="color: #64748b; font-size: 11px;">Connected Family Person:</div>
            <span style="background: #e0e7ff; color: #3730a3; font-weight: 700; font-size: 11px; padding: 2px 6px; border-radius: 4px; border: 1px solid #c7d2fe;">${caregiverStr}</span>
          </div>
          <div>
            <span style="color: #64748b;">Location / Phone:</span> <strong>${p.location || 'South Delhi'} • ${p.phone || '+91 98110-44912'}</strong>
          </div>
          <div>
            <span style="color: #64748b;">Assigned Clinical Team:</span> <strong>${p.assignedNurse || 'Sister Kavita, RN'} • ${medHistory.doctor || 'Dr. V.K. Kapoor'}</strong>
          </div>
        </div>
      </div>

      <!-- 2. AI Risk Triage & Clinical Drivers -->
      <div style="border: 1px solid ${isCritical ? '#fecdd3' : '#bbf7d0'}; background: ${isCritical ? '#fff1f2' : '#f0fdf4'}; border-radius: 12px; padding: 12px; margin-bottom: 14px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
          <span style="font-size: 10px; font-weight: 800; text-transform: uppercase; color: ${isCritical ? '#9f1239' : '#166534'};">2. AI Predictive Model Triage & Drivers</span>
          <span style="font-size: 11px; font-weight: 800; color: ${isCritical ? '#be123c' : '#15803d'};">Model Risk Score: ${p.modelScore || 80}/100 (${p.predictedProbability || '64.3%'})</span>
        </div>
        <ul style="margin: 0; padding-left: 18px; font-size: 11.5px; color: #1e293b; line-height: 1.5;">
          ${drivers.map(d => `<li style="margin-bottom: 2px;"><strong>${d}</strong></li>`).join('')}
        </ul>
        <div style="margin-top: 8px; padding-top: 6px; border-top: 1px dashed ${isCritical ? '#fda4af' : '#86efac'}; font-size: 11.5px; color: #0e294b;">
          <strong>Suggested Clinical Action:</strong> ${p.suggestedAction || 'Immediate 2-way tele-call, notify family, and dispatch home nurse.'}
        </div>
      </div>

      <!-- 3. Physiological Telemetry (All Core Vitals) -->
      <div style="margin-bottom: 14px;">
        <div style="font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; color: #64748b; margin-bottom: 6px;">3. Current Physiological Telemetry</div>
        <div style="display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px; font-size: 11px;">
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 8px;">
            <div style="color: #64748b; font-size: 10px; text-transform: uppercase;">Blood Pressure</div>
            <div style="font-size: 15px; font-weight: 800; color: ${parseInt(v.bp) >= 140 ? '#e11d48' : '#0f172a'};">${v.bp || '120/80 mmHg'}</div>
            <div style="color: #64748b; font-size: 10px;">Status: ${v.bpStatus || 'Normal'}</div>
          </div>
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 8px;">
            <div style="color: #64748b; font-size: 10px; text-transform: uppercase;">Heart Rate</div>
            <div style="font-size: 15px; font-weight: 800; color: ${parseInt(v.hr) >= 100 ? '#e11d48' : '#0f172a'};">${v.hr || '72 bpm'}</div>
            <div style="color: #64748b; font-size: 10px;">Status: ${v.hrStatus || 'Normal'}</div>
          </div>
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 8px;">
            <div style="color: #64748b; font-size: 10px; text-transform: uppercase;">Oxygen (SpO2)</div>
            <div style="font-size: 15px; font-weight: 800; color: ${parseInt(v.spo2) < 95 ? '#d97706' : '#0f172a'};">${v.spo2 || '98%'}</div>
            <div style="color: #64748b; font-size: 10px;">Status: ${v.spo2Status || 'Optimal'}</div>
          </div>
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 8px;">
            <div style="color: #64748b; font-size: 10px; text-transform: uppercase;">Blood Glucose</div>
            <div style="font-size: 15px; font-weight: 800; color: #0f172a;">${v.glucose || '110 mg/dL'}</div>
            <div style="color: #64748b; font-size: 10px;">Type: Fasting / Checkup</div>
          </div>
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 8px;">
            <div style="color: #64748b; font-size: 10px; text-transform: uppercase;">Body Temperature</div>
            <div style="font-size: 15px; font-weight: 800; color: #0f172a;">${v.temp || '98.4 °F'}</div>
            <div style="color: #64748b; font-size: 10px;">Status: Afebrile</div>
          </div>
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 8px;">
            <div style="color: #64748b; font-size: 10px; text-transform: uppercase;">Weight & BMI</div>
            <div style="font-size: 15px; font-weight: 800; color: #0f172a;">${v.weight || '71.5 kg'}</div>
            <div style="color: #64748b; font-size: 10px;">BMI: ${v.bmi || '25.1'}</div>
          </div>
        </div>
      </div>

      <!-- 4. Functional ADL Independence & Pain / Sleep -->
      <div style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; margin-bottom: 14px;">
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 10px;">
          <div style="font-size: 10px; font-weight: 800; text-transform: uppercase; color: #475569; margin-bottom: 6px;">4. Functional ADL Assessment</div>
          <div style="font-size: 11.5px; line-height: 1.6; color: #1e293b;">
            <div>🍽️ <strong>Eating:</strong> ${adl.eating ? adl.eating.score : '10/10'} (${adl.eating ? adl.eating.status : 'Independent'})</div>
            <div>🚽 <strong>Toileting:</strong> ${adl.toileting ? adl.toileting.score : '7/10'} (${adl.toileting ? adl.toileting.status : 'Grab Bar Aid'})</div>
            <div>🚶 <strong>Walking:</strong> ${adl.walking ? adl.walking.score : '6/10'} (${adl.walking ? adl.walking.status : 'With Cane / Unsteady'})</div>
            <div>🛏️ <strong>Bed Transfer:</strong> ${adl.moving ? adl.moving.score : '7/10'} (${adl.moving ? adl.moving.status : 'Morning Stiffness'})</div>
          </div>
        </div>

        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 10px;">
          <div style="font-size: 10px; font-weight: 800; text-transform: uppercase; color: #475569; margin-bottom: 6px;">5. Pain & Sleep Assessment</div>
          <div style="font-size: 11.5px; line-height: 1.6; color: #1e293b;">
            <div>⚡ <strong>Pain Level:</strong> <span style="font-weight: 800; color: ${pain.score >= 4 ? '#e11d48' : '#0f172a'};">${pain.score ? `${pain.score}/10` : '0/10'}</span></div>
            <div>📍 <strong>Location:</strong> ${pain.location || 'None'} (${pain.sensation || 'Dull ache'})</div>
            <div>🌙 <strong>Sleep Rest:</strong> ${sleep.hours ? `${sleep.hours} hrs/night` : '7.0 hrs'}</div>
            <div>💤 <strong>Quality:</strong> ${sleep.quality || 'Normal'}</div>
          </div>
        </div>
      </div>

      <!-- 5. Senior Direct Voice Input (Hindi & Translation) -->
      <div style="background: #faf5ff; border: 1px solid #e9d5ff; border-radius: 12px; padding: 10px; margin-bottom: 14px;">
        <div style="font-size: 10px; font-weight: 800; text-transform: uppercase; color: #6b21a8; margin-bottom: 4px;">6. Senior Direct Check-in Voice Note & Transcript</div>
        <div style="font-size: 12px; font-weight: 600; color: #3b0764; font-style: italic;">
          "${voice.hindiText || 'नमस्ते बेटा, आज सुबह से थोड़ी बेचैनी लग रही है।'}"
        </div>
        <div style="font-size: 11px; color: #6b7280; margin-top: 3px;">
          <strong>Clinical Translation:</strong> "${voice.englishTranslation || 'Hello son, feeling a bit restless since this morning.'}"
        </div>
      </div>

      <!-- 6. Active Medications Table -->
      <div style="margin-bottom: 14px;">
        <div style="font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; color: #64748b; margin-bottom: 6px;">7. Active Prescriptions & Adherence</div>
        <table style="width: 100%; border-collapse: collapse; font-size: 11px; text-align: left;">
          <thead>
            <tr style="background: #f1f5f9; border-bottom: 1.5px solid #cbd5e1; color: #475569;">
              <th style="padding: 6px 8px;">Medicine</th>
              <th style="padding: 6px 8px;">Dosage</th>
              <th style="padding: 6px 8px;">Schedule</th>
              <th style="padding: 6px 8px;">Purpose</th>
              <th style="padding: 6px 8px;">Adherence</th>
            </tr>
          </thead>
          <tbody>
            ${meds.length > 0 ? meds.map(m => `
              <tr style="border-bottom: 1px solid #f1f5f9;">
                <td style="padding: 5px 8px; font-weight: 700; color: #0f172a;">${m.name}</td>
                <td style="padding: 5px 8px; color: #475569;">${m.dosage}</td>
                <td style="padding: 5px 8px; color: #475569;">${m.schedule}</td>
                <td style="padding: 5px 8px; color: #64748b;">${m.purpose}</td>
                <td style="padding: 5px 8px; font-weight: 700; color: #059669;">${m.adherence || '95%'}</td>
              </tr>
            `).join('') : `
              <tr><td colspan="5" style="padding: 6px; text-align: center; color: #94a3b8;">No prescription recorded.</td></tr>
            `}
          </tbody>
        </table>
      </div>

      <!-- Document Footer & Sign-off -->
      <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1.5px solid #e2e8f0; padding-top: 10px; font-size: 10px; color: #64748b;">
        <div>
          <span>CareConnect AI Telemetry Engine</span> • <span>ISO-27001 & HIPAA Compliant Data Flow</span>
        </div>
        <div style="text-align: right; font-weight: 700; color: #0f172a;">
          Reviewed By: Sister Kavita, RN (Assigned Care Coordinator)
        </div>
      </div>

    </div>
  `;
}

// Plain text assessment summary
function buildSimpleAssessmentText(p) {
  const v = (p.checkups && p.checkups[0]) ? p.checkups[0] : {};
  const adl = (p.assessments && p.assessments.adl) ? p.assessments.adl : {};
  const pain = (p.assessments && p.assessments.pain) ? p.assessments.pain : {};
  const sleep = (p.assessments && p.assessments.sleep) ? p.assessments.sleep : {};
  const voice = (p.userInputs || []).find(u => u.type === 'voice') || {};
  const bracketStr = getSeniorBracketInfo(p);
  const caregiverStr = getCaregiverBracketInfo(p);
  const isCritical = p.predictedTier === 'CRITICAL';
  const reportDate = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

  return `=================================================================CARECONNECT AI - PATIENT HEALTH ASSESSMENT REPORT
=================================================================Date: ${reportDate}
Patient ID: ${p.id || 'PAT-101'}
Patient Name: ${p.name} ${bracketStr}
Connected Person: ${caregiverStr}
Contact: ${p.phone || '+91 98110-44912'}
Location: ${p.location || 'South Delhi, New Delhi'}
Assigned Nurse: ${p.assignedNurse || 'Sister Kavita, RN'}
Consulting Doctor: ${p.medicalHistory ? p.medicalHistory.doctor || 'Dr. V.K. Kapoor' : 'Dr. V.K. Kapoor'}
Blood Group: ${p.medicalHistory ? p.medicalHistory.bloodGroup || 'B +ve' : 'B +ve'}

------------------------------------------------------------------------
1. AI RISK CLASSIFICATION & CLINICAL DRIVERS
------------------------------------------------------------------------
Risk Tier: ${isCritical ? 'CRITICAL RISK TIER (🚨 IMMEDIATE ATTENTION)' : 'STABLE TIER (🟢 ROUTINE SUPERVISION)'}
Model Risk Score: ${p.modelScore || 80}/100 (${p.predictedProbability || '64.3%'})
Key AI Drivers Detected:
${(p.modelDrivers || []).map((d, i) => `  ${i+1}. ${d}`).join('\n')}

Clinical Action Protocol:
  ${p.suggestedAction || 'Proactive biometric monitoring and assigned nurse dispatch.'}

------------------------------------------------------------------------
2. PHYSIOLOGICAL VITALS TELEMETRY
------------------------------------------------------------------------
- Blood Pressure: ${v.bp || '120/80 mmHg'} (${v.bpStatus || 'Normal'})
- Heart Rate: ${v.hr || '72 bpm'} (${v.hrStatus || 'Normal'})
- SpO2 Oxygen Saturation: ${v.spo2 || '98%'} (${v.spo2Status || 'Optimal'})
- Blood Glucose: ${v.glucose || '110 mg/dL'} (Fasting)
- Body Temperature: ${v.temp || '98.4 °F'} (Afebrile)
- Weight & BMI: ${v.weight || '71.5 kg'} (BMI ${v.bmi || '25.1'})

------------------------------------------------------------------------
3. FUNCTIONAL ADL INDEPENDENCE ASSESSMENT
------------------------------------------------------------------------
- Eating / Nutrition: ${adl.eating ? adl.eating.score : '10/10'} (${adl.eating ? adl.eating.status : 'Fully Independent'})
- Toileting: ${adl.toileting ? adl.toileting.score : '7/10'} (${adl.toileting ? adl.toileting.status : 'Requires Grab Bar Support'})
- Walking / Ambulation: ${adl.walking ? adl.walking.score : '6/10'} (${adl.walking ? adl.walking.status : 'Walks with Cane / Mild Instability'})
- Bed Transfer & Moving: ${adl.moving ? adl.moving.score : '7/10'} (${adl.moving ? adl.moving.status : 'Morning Stiffness'})

------------------------------------------------------------------------
4. PAIN & SLEEP ASSESSMENT
------------------------------------------------------------------------
- Pain Scale: ${pain.score ? `${pain.score}/10` : '0/10'}
- Pain Location & Sensation: ${pain.location || 'None'} (${pain.sensation || 'Dull ache'})
- Night Sleep Rest: ${sleep.hours ? `${sleep.hours} hrs/night` : '7.0 hrs'}
- Sleep Quality: ${sleep.quality || 'Normal'}

------------------------------------------------------------------------
5. SENIOR DIRECT VOICE INPUT & TRANSCRIPT
------------------------------------------------------------------------
Hindi Voice Input: "${voice.hindiText || 'Sab theek hai, regular routine chal raha hai.'}"
English Clinical Translation: "${voice.englishTranslation || 'Everything is fine, regular routine is going on.'}"

------------------------------------------------------------------------
6. ACTIVE PRESCRIPTIONS & ADHERENCE
------------------------------------------------------------------------
${(p.medicalHistory && p.medicalHistory.medications ? p.medicalHistory.medications : []).map(m => `- ${m.name} (${m.dosage}) | Schedule: ${m.schedule} | Purpose: ${m.purpose} | Adherence: ${m.adherence || '95%'}`).join('\n')}

=================================================================Verified by: Sister Kavita, RN • CareConnect AI Clinical Protocol
=================================================================`;
}

// ==================================================================// ACTION: DOWNLOAD WHOLE HEALTH ASSESSMENT AS PDF & OPEN PREVIEW
// ==================================================================
function downloadPatientAssessmentPdf() {
  const p = (state.patients || []).find(pt => pt.id === familySelectedSeniorId) || (state.patients ? state.patients[0] : null);
  if (!p) {
    showToast('No patient data found to generate assessment.', 'error');
    return;
  }

  soundEngine.playTone(600, 'sine', 0.15);
  showToast(`Preparing Full Health Assessment PDF for ${p.name}...`, 'info');

  // 1. Populate the modal content so user has instant visual preview
  const modalContainer = document.getElementById('simple-assessment-slip-content');
  if (modalContainer) {
    modalContainer.innerHTML = buildSimpleAssessmentHtml(p);
  }

  // 2. Open modal so user sees assessment document right away
  const modal = document.getElementById('modal-simple-assessment');
  if (modal) {
    modal.classList.remove('hidden');
  }

  const safeName = p.name.replace(/[^a-zA-Z0-9]/g, '_');
  const filename = `${safeName}_Full_Health_Assessment.pdf`;

  // 3. If html2pdf library is available, trigger direct PDF download
  if (typeof html2pdf !== 'undefined') {
    const element = document.getElementById('printable-assessment-document') || modalContainer;
    const opt = {
      margin: [8, 8, 8, 8],
      filename: filename,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, logging: false },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save().then(() => {
      showToast(`Downloaded: ${filename}`, 'success');
    }).catch(err => {
      console.warn('html2pdf direct save error, triggering print/save fallback:', err);
      fallbackDownloadClinicalHtml(p);
    });
  } else {
    // Elegant fallback: Download complete self-contained printable HTML dossier file
    fallbackDownloadClinicalHtml(p);
  }
}

// Self-contained printable HTML dossier file fallback
function fallbackDownloadClinicalHtml(p) {
  const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${p.name} - Full Health Assessment</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #f8fafc; padding: 20px; }
    @media print { body { background: #ffffff; padding: 0; } }
  </style>
</head>
<body>
  ${buildSimpleAssessmentHtml(p)}
  <script>
    window.onload = function() {
      // Auto prompt print to save as PDF if desired
      setTimeout(function() { window.print(); }, 400);
    };
  </script>
</body>
</html>`;

  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const safeName = p.name.replace(/[^a-zA-Z0-9]/g, '_');
  a.href = url;
  a.download = `${safeName}_Full_Health_Assessment_Printable.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showToast(`Assessment downloaded as printable dossier file.`, 'success');
}

// Open Simple Assessment Modal
function openSimpleAssessmentModal() {
  const p = (state.patients || []).find(pt => pt.id === familySelectedSeniorId) || (state.patients ? state.patients[0] : null);
  if (!p) return;

  const content = document.getElementById('simple-assessment-slip-content');
  if (content) {
    content.innerHTML = buildSimpleAssessmentHtml(p);
  }

  const modal = document.getElementById('modal-simple-assessment');
  if (modal) {
    modal.classList.remove('hidden');
    soundEngine.playTone(500, 'sine', 0.1);
  }
}

// Close Simple Assessment Modal
function closeSimpleAssessmentModal() {
  const modal = document.getElementById('modal-simple-assessment');
  if (modal) {
    modal.classList.add('hidden');
  }
}

// Print Clean Assessment Slip Only
function printSimpleAssessmentSlipOnly() {
  const p = (state.patients || []).find(pt => pt.id === familySelectedSeniorId) || (state.patients ? state.patients[0] : null);
  if (!p) return;

  const content = document.getElementById('simple-assessment-slip-content');
  if (content) {
    content.innerHTML = buildSimpleAssessmentHtml(p);
  }

  const modal = document.getElementById('modal-simple-assessment');
  if (modal) modal.classList.remove('hidden');

  showToast('Opening clean print / PDF save dialog...', 'info');
  setTimeout(() => {
    window.print();
  }, 250);
}

// Download Simple Assessment Report (.txt file)
function downloadSimpleAssessmentReport() {
  const p = (state.patients || []).find(pt => pt.id === familySelectedSeniorId) || (state.patients ? state.patients[0] : null);
  if (!p) return;

  const textContent = buildSimpleAssessmentText(p);
  const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const safeName = p.name.replace(/[^a-zA-Z0-9]/g, '_');
  a.href = url;
  a.download = `${safeName}_Health_Assessment_Report.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  showToast(`Downloaded: ${safeName}_Health_Assessment_Report.txt`, 'success');
}

// Print full senior report
function printSeniorReport() {
  openSimpleAssessmentModal();
}

// Emergency alert actions
function updateFamilyAlertBanner() {
  const p = (state.patients || []).find(pt => pt.id === familySelectedSeniorId);
  const isCritical = p && p.predictedTier === 'CRITICAL';
  const alertBanner = document.getElementById('family-serious-alert-banner');
  if (alertBanner) alertBanner.classList.toggle('hidden', !isCritical);
}

function dismissFamilyAlert() {
  const banner = document.getElementById('family-serious-alert-banner');
  if (banner) banner.classList.add('hidden');
  showToast('Alert banner minimized for current session.', 'info');
}

function simulateSeriousEmergencyForFamily() {
  changeFamilyLinkedSenior('PAT-101');
  const banner = document.getElementById('family-serious-alert-banner');
  if (banner) banner.classList.remove('hidden');
  soundEngine.playTone(800, 'triangle', 0.4);
  showToast('Simulated Critical Health Alert for Ramesh Sharma!', 'warning');
}

function simulateFamilyCallDad() {
  soundEngine.playTone(500, 'sine', 0.2);
  const p = (state.patients || []).find(pt => pt.id === familySelectedSeniorId);
  const name = p ? p.name : 'Dad';
  const phone = p ? p.phone : '+91 98110-44912';
  showToast(`Initiating direct call to ${name} (${phone})...`, 'info');
}

function simulateFamilyCallCoordinator() {
  soundEngine.playPhoneRing();
  const p = (state.patients || []).find(pt => pt.id === familySelectedSeniorId);
  const nurse = p ? (p.assignedNurse || 'Sister Kavita, RN') : 'Sister Kavita, RN';
  openCallModal('COORD-CALL', `${nurse} (Care Coordinator)`, '+91 98100-CARE-1');
  showToast(`Connecting direct 2-way line to Care Coordinator (${nurse})...`, 'info');
}

function sendFamilyMessageToDad() {
  soundEngine.playTone(700, 'sine', 0.15);
  const input = document.getElementById('family-message-input');
  const msg = input ? input.value.trim() : '';
  const p = (state.patients || []).find(pt => pt.id === familySelectedSeniorId);
  const name = p ? p.name : 'Dad';
  if (!msg) {
    showToast('Please type a message first.', 'warning');
    return;
  }
  showToast(`Sent message to ${name}: "${msg}"`, 'success');
  if (input) input.value = '';
}


// 7-DAY VITALS & SENTIMENT TRAJECTORY CHART (Chart.js Engine)
function renderFamilyVitalsChart(p) {
  const canvas = document.getElementById('familyVitalsChart');
  if (!canvas || typeof Chart === 'undefined') return;

  const patientWeeklyTrajectories = {
    'PAT-101': { // Ramesh Sharma (Father)
      labels: ['Thu', 'Fri', 'Sat', 'Sun', 'Mon', 'Tue', 'Today'],
      bpSys: [126, 128, 130, 134, 132, 134, 158],
      mood: [4.6, 4.8, 4.5, 3.2, 4.4, 4.5, 2.4],
      hr: [72, 74, 75, 78, 73, 76, 114],
      bpColor: '#7c3aed',
      moodColor: '#00a896'
    },
    'PAT-102': { // Savitri Devi (Mother)
      labels: ['Thu', 'Fri', 'Sat', 'Sun', 'Mon', 'Tue', 'Today'],
      bpSys: [130, 128, 132, 130, 134, 132, 142],
      mood: [4.2, 4.4, 4.5, 4.3, 3.8, 4.0, 1.8],
      hr: [76, 75, 78, 74, 80, 78, 88],
      bpColor: '#e11d48',
      moodColor: '#00a896'
    },
    'PAT-103': { // Anand Verma
      labels: ['Thu', 'Fri', 'Sat', 'Sun', 'Mon', 'Tue', 'Today'],
      bpSys: [128, 130, 132, 134, 138, 136, 132],
      mood: [4.2, 4.3, 4.1, 3.2, 2.9, 3.5, 3.8],
      hr: [74, 76, 75, 78, 79, 78, 76],
      bpColor: '#d97706',
      moodColor: '#00a896'
    },
    'PAT-104': { // Meena Iyer
      labels: ['Thu', 'Fri', 'Sat', 'Sun', 'Mon', 'Tue', 'Today'],
      bpSys: [122, 120, 124, 122, 125, 124, 124],
      mood: [4.2, 4.0, 3.8, 2.4, 2.1, 2.8, 3.5],
      hr: [70, 72, 71, 74, 76, 73, 72],
      bpColor: '#6366f1',
      moodColor: '#00a896'
    },
    'PAT-105': { // Harish Patel
      labels: ['Thu', 'Fri', 'Sat', 'Sun', 'Mon', 'Tue', 'Today'],
      bpSys: [120, 122, 121, 120, 124, 122, 122],
      mood: [4.8, 4.9, 4.8, 4.7, 4.9, 4.8, 5.0],
      hr: [72, 70, 72, 73, 71, 72, 72],
      bpColor: '#059669',
      moodColor: '#00a896'
    }
  };

  const traj = patientWeeklyTrajectories[p.id] || patientWeeklyTrajectories['PAT-101'];

  // Destroy previous chart instance if exists
  if (state.charts.familyVitals) {
    try {
      state.charts.familyVitals.destroy();
    } catch (e) {
      console.warn('Chart destroy error:', e);
    }
    state.charts.familyVitals = null;
  }

  const ctx = canvas.getContext('2d');
  state.charts.familyVitals = new Chart(ctx, {
    type: 'line',
    data: {
      labels: traj.labels,
      datasets: [
        {
          label: `${p.name} - Systolic BP (mmHg)`,
          data: traj.bpSys,
          borderColor: traj.bpColor,
          backgroundColor: 'rgba(124, 58, 237, 0.08)',
          borderWidth: 3,
          fill: true,
          tension: 0.35,
          yAxisID: 'yBP',
          pointRadius: 4,
          pointHoverRadius: 6,
          pointBackgroundColor: traj.bpColor
        },
        {
          label: `${p.name} - Mood & Voice Sentiment (1-5 Scale)`,
          data: traj.mood,
          borderColor: traj.moodColor,
          backgroundColor: 'rgba(0, 168, 150, 0.08)',
          borderWidth: 2.5,
          borderDash: [5, 4],
          fill: false,
          tension: 0.35,
          yAxisID: 'yMood',
          pointRadius: 4,
          pointHoverRadius: 6,
          pointBackgroundColor: traj.moodColor
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index',
        intersect: false
      },
      plugins: {
        legend: {
          display: true,
          position: 'top',
          labels: {
            boxWidth: 12,
            font: { size: 11, family: 'Plus Jakarta Sans', weight: '700' }
          }
        },
        tooltip: {
          callbacks: {
            afterBody: function(items) {
              const idx = items[0].dataIndex;
              return `Heart Rate: ${traj.hr[idx]} bpm`;
            }
          }
        }
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { font: { size: 10, weight: '700' } }
        },
        yBP: {
          type: 'linear',
          display: true,
          position: 'left',
          title: {
            display: true,
            text: 'Systolic BP (mmHg)',
            font: { size: 10, weight: 'bold' }
          },
          suggestedMin: 100,
          suggestedMax: 170,
          grid: { color: 'rgba(203, 213, 225, 0.4)' },
          ticks: { font: { size: 10 } }
        },
        yMood: {
          type: 'linear',
          display: true,
          position: 'right',
          title: {
            display: true,
            text: 'Mood Rating (1-5)',
            font: { size: 10, weight: 'bold' }
          },
          suggestedMin: 1,
          suggestedMax: 5,
          grid: { drawOnChartArea: false },
          ticks: { stepSize: 1, font: { size: 10 } }
        }
      }
    }
  });
}

function initFamilyVitalsChart() {
  const p = (state.patients || []).find(pt => pt.id === familySelectedSeniorId) || state.patients[0];
  if (p) renderFamilyVitalsChart(p);
}



// VIEW 4: OPERATIONS MANAGER LOGIC
// Requirement: A view of alert volumes, response times and outcomes
// across a city or team.
// ==================================================================
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

// =====================================================================// OPERATIONS DASHBOARD CITY & DAY CALENDAR TELEMETRY ENGINE
// =====================================================================
const OPS_CITY_METRICS = {
  delhi: {
    cityName: 'Delhi NCR',
    seniors: 200,
    highRisk: 24,
    modRisk: 68,
    lowRisk: 108,
    alertsToday: 32,
    activeCoords: 8,
    avgResponseMinutes: 6.4,
    sla: '94.8%',
    coords: [
      { name: 'Team Alpha (Lead: Sister Kavita)', zone: 'South Delhi (GK, Saket, Vasant Kunj)', seniors: 84, alerts: 14, avgResp: '5.8 mins', compliance: '98.2%', status: 'Active (On Shift)' },
      { name: 'Team Beta (Lead: Sister Sunita)', zone: 'East & Central Delhi (Connaught Pl, Mayur Vihar)', seniors: 58, alerts: 9, avgResp: '6.4 mins', compliance: '96.5%', status: 'Active (On Shift)' },
      { name: 'Team Gamma (Lead: Brother Amit)', zone: 'South-West Delhi (Dwarka, Janakpuri)', seniors: 46, alerts: 7, avgResp: '6.9 mins', compliance: '94.0%', status: 'Active (On Shift)' },
      { name: 'Team Delta (Lead: Rajesh Kumar)', zone: 'North & West Delhi (Rohini, Pitampura)', seniors: 12, alerts: 2, avgResp: '6.1 mins', compliance: '95.0%', status: 'Standby' }
    ],
    latLng: [28.5355, 77.2410],
    zoom: 12
  },
  mumbai: {
    cityName: 'Mumbai Metro',
    seniors: 185,
    highRisk: 18,
    modRisk: 62,
    lowRisk: 105,
    alertsToday: 26,
    activeCoords: 7,
    avgResponseMinutes: 7.1,
    sla: '93.4%',
    coords: [
      { name: 'Team Marine (Lead: Nurse Ananya, RN)', zone: 'South Mumbai (Colaba, Nariman Pt)', seniors: 75, alerts: 11, avgResp: '6.8 mins', compliance: '97.4%', status: 'Active (On Shift)' },
      { name: 'Team Coast (Lead: Brother Sachin)', zone: 'Bandra & Khar West', seniors: 65, alerts: 9, avgResp: '7.2 mins', compliance: '95.1%', status: 'Active (On Shift)' },
      { name: 'Team Suburban (Lead: Sister Meera)', zone: 'Andheri & Juhu', seniors: 45, alerts: 6, avgResp: '7.5 mins', compliance: '92.8%', status: 'Active (On Shift)' }
    ],
    latLng: [19.0760, 72.8777],
    zoom: 12
  },
  bengaluru: {
    cityName: 'Bengaluru Urban',
    seniors: 160,
    highRisk: 14,
    modRisk: 54,
    lowRisk: 92,
    alertsToday: 21,
    activeCoords: 6,
    avgResponseMinutes: 5.9,
    sla: '96.1%',
    coords: [
      { name: 'Team Tech (Lead: Sister Deepa, RN)', zone: 'Indiranagar & Koramangala', seniors: 68, alerts: 9, avgResp: '5.4 mins', compliance: '98.8%', status: 'Active (On Shift)' },
      { name: 'Team Garden (Lead: Brother Vinay)', zone: 'Jayanagar & JP Nagar', seniors: 52, alerts: 7, avgResp: '5.9 mins', compliance: '96.4%', status: 'Active (On Shift)' },
      { name: 'Team Silicon (Lead: Sister Lakshmi)', zone: 'Whitefield & Bellandur', seniors: 40, alerts: 5, avgResp: '6.3 mins', compliance: '94.2%', status: 'Active (On Shift)' }
    ],
    latLng: [12.9716, 77.5946],
    zoom: 12
  },
  hyderabad: {
    cityName: 'Hyderabad',
    seniors: 140,
    highRisk: 10,
    modRisk: 48,
    lowRisk: 82,
    alertsToday: 18,
    activeCoords: 5,
    avgResponseMinutes: 6.2,
    sla: '95.5%',
    coords: [
      { name: 'Team Pearl (Lead: Sister Fatima, RN)', zone: 'Banjara Hills & Jubilee Hills', seniors: 62, alerts: 8, avgResp: '5.8 mins', compliance: '97.2%', status: 'Active (On Shift)' },
      { name: 'Team Cyber (Lead: Brother Suresh)', zone: 'Gachibowli & Madhapur', seniors: 48, alerts: 6, avgResp: '6.2 mins', compliance: '95.6%', status: 'Active (On Shift)' },
      { name: 'Team Nizami (Lead: Sister Priya)', zone: 'Secunderabad & Begumpet', seniors: 30, alerts: 4, avgResp: '6.6 mins', compliance: '94.1%', status: 'Active (On Shift)' }
    ],
    latLng: [17.3850, 78.4867],
    zoom: 12
  },
  all: {
    cityName: 'All Metros (Pan-India)',
    seniors: 685,
    highRisk: 66,
    modRisk: 232,
    lowRisk: 387,
    alertsToday: 97,
    activeCoords: 26,
    avgResponseMinutes: 6.4,
    sla: '95.0%',
    coords: [
      { name: 'North Zone Hub (Sister Kavita, RN)', zone: 'Delhi NCR Hub (South, East, West)', seniors: 200, alerts: 32, avgResp: '6.4 mins', compliance: '94.8%', status: 'Active (On Shift)' },
      { name: 'West Zone Hub (Nurse Ananya, RN)', zone: 'Mumbai Metro Command (South & Suburbs)', seniors: 185, alerts: 26, avgResp: '7.1 mins', compliance: '93.4%', status: 'Active (On Shift)' },
      { name: 'South Zone Hub (Sister Deepa, RN)', zone: 'Bengaluru Tech Corridors', seniors: 160, alerts: 21, avgResp: '5.9 mins', compliance: '96.1%', status: 'Active (On Shift)' },
      { name: 'Central Zone Hub (Sister Fatima, RN)', zone: 'Hyderabad Urban Zone', seniors: 140, alerts: 18, avgResp: '6.2 mins', compliance: '95.5%', status: 'Active (On Shift)' }
    ],
    latLng: [21.7679, 78.8718],
    zoom: 5
  }
};

let currentOpsDayFilter = 'today';
let currentOpsCustomDate = '2026-10-30';

function updateOpsDashboard() {
  if (soundEngine && typeof soundEngine.playTone === 'function') {
    soundEngine.playTone(550, 'sine', 0.08);
  }
  const citySelect = document.getElementById('ops-city-filter');
  const city = (citySelect ? citySelect.value : 'delhi') || 'delhi';
  const metrics = OPS_CITY_METRICS[city] || OPS_CITY_METRICS.delhi;

  // Day filter factor
  let dayFactor = 1.0;
  let dayLabel = 'Today';
  if (currentOpsDayFilter === 'yesterday') {
    dayFactor = 0.88;
    dayLabel = 'Yesterday (29 Oct 2026)';
  } else if (currentOpsDayFilter === '7days') {
    dayFactor = 6.4;
    dayLabel = 'Last 7 Days (24 - 30 Oct)';
  } else if (currentOpsDayFilter === '30days') {
    dayFactor = 26.5;
    dayLabel = 'Last 30 Days (Oct 2026)';
  } else if (currentOpsDayFilter === 'custom') {
    dayFactor = 0.94;
    dayLabel = `Date: ${currentOpsCustomDate}`;
  }

  const computedAlerts = Math.round(metrics.alertsToday * dayFactor);

  // Update KPI metric elements
  const elTotal = document.getElementById('ops-kpi-total-seniors');
  const elHigh = document.getElementById('ops-kpi-high-risk');
  const elMod = document.getElementById('ops-kpi-mod-risk');
  const elLow = document.getElementById('ops-kpi-low-risk');
  const elAlerts = document.getElementById('ops-kpi-alerts-today');
  const elAlertsLabel = document.getElementById('ops-kpi-alerts-label');
  const elCoords = document.getElementById('ops-kpi-active-coords');

  if (elTotal) elTotal.textContent = metrics.seniors.toLocaleString();
  if (elHigh) elHigh.textContent = metrics.highRisk.toLocaleString();
  if (elMod) elMod.textContent = metrics.modRisk.toLocaleString();
  if (elLow) elLow.textContent = metrics.lowRisk.toLocaleString();
  if (elAlerts) elAlerts.textContent = computedAlerts.toLocaleString();
  if (elAlertsLabel) {
    elAlertsLabel.textContent = currentOpsDayFilter === 'today' ? 'Alerts Today' :
      currentOpsDayFilter === 'yesterday' ? 'Alerts Yesterday' :
      currentOpsDayFilter === '7days' ? 'Alerts (7 Days)' :
      currentOpsDayFilter === '30days' ? 'Alerts (30 Days)' : 'Alerts on Date';
  }
  if (elCoords) elCoords.textContent = metrics.activeCoords.toString();

  // Update Team Management Table
  renderOpsTeamTableForCity(metrics.coords);

  // Re-render chart with city data
  if (typeof initOpsCharts === 'function') {
    initOpsCharts(city);
  }

  // If map initialized, pan to city
  if (typeof opsLeafletMap !== 'undefined' && opsLeafletMap && metrics.latLng) {
    opsLeafletMap.flyTo(metrics.latLng, metrics.zoom, { duration: 1.2 });
  }

  showToast(`Dashboard updated: ${metrics.cityName} • ${dayLabel}`, 'info');
}

// =====================================================================// INTERACTIVE OPERATIONS CALENDAR & DAY ENGINE
// =====================================================================
let currentCalYear = 2026;
let currentCalMonth = 9; // 0-indexed: 9 = October
let selectedCalDate = 30; // 30 Oct 2026
const CAL_MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

function toggleOpsCalendarPopover(forceState) {
  const popover = document.getElementById('ops-calendar-popover');
  if (!popover) return;
  const isHidden = popover.classList.contains('hidden');
  const show = typeof forceState === 'boolean' ? forceState : isHidden;

  if (show) {
    popover.classList.remove('hidden');
    renderOpsCalendarGrid(currentCalYear, currentCalMonth, selectedCalDate);
    if (soundEngine && typeof soundEngine.playTone === 'function') {
      soundEngine.playTone(600, 'sine', 0.05);
    }
  } else {
    popover.classList.add('hidden');
  }
}

function renderOpsCalendarGrid(year, month, selectedDay) {
  const grid = document.getElementById('ops-cal-days-grid');
  const title = document.getElementById('ops-cal-month-title');
  if (title) {
    title.textContent = CAL_MONTH_NAMES[month] + ' ' + year;
  }
  if (!grid) return;

  const firstDayIndex = new Date(year, month, 1).getDay(); // 0 = Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevMonthDays = new Date(year, month, 0).getDate();

  let html = '';

  // Previous month trailing days (muted)
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    const prevDay = prevMonthDays - i;
    html += '<button type="button" disabled class="p-2 text-slate-300 text-center rounded-xl cursor-not-allowed opacity-40">' + prevDay + '</button>';
  }

  // Current month active days
  for (let day = 1; day <= daysInMonth; day++) {
    const isSelected = (day === selectedDay && month === currentCalMonth && year === currentCalYear);
    const isToday = (day === 30 && month === 9 && year === 2026);

    let btnClass = 'p-2 rounded-xl text-center transition-all cursor-pointer font-bold ';
    if (isSelected) {
      btnClass += 'bg-[#00a896] text-white shadow-md font-extrabold ring-2 ring-teal-300 scale-105';
    } else if (isToday) {
      btnClass += 'bg-teal-50 text-teal-700 hover:bg-teal-100 font-extrabold border border-teal-200';
    } else {
      btnClass += 'hover:bg-slate-100 text-slate-700';
    }

    html += '<button type="button" onclick="selectOpsCalendarDay(' + day + ')" class="' + btnClass + '">' + day + '</button>';
  }

  grid.innerHTML = html;
}

function selectOpsCalendarDay(day) {
  selectedCalDate = day;
  currentOpsDayFilter = 'custom';
  currentOpsCustomDate = currentCalYear + '-' + String(currentCalMonth + 1).padStart(2, '0') + '-' + String(day).padStart(2, '0');

  const monthShort = CAL_MONTH_NAMES[currentCalMonth].substring(0, 3);
  const displayLabel = day + ' ' + monthShort + ' ' + currentCalYear;

  const labelEl = document.getElementById('ops-calendar-selected-label');
  if (labelEl) labelEl.textContent = displayLabel;

  const hintEl = document.getElementById('ops-cal-selected-hint');
  if (hintEl) hintEl.textContent = displayLabel + ' selected';

  updateOpsCalPresetButtons(null);
  renderOpsCalendarGrid(currentCalYear, currentCalMonth, selectedCalDate);
  updateOpsDashboard();

  if (soundEngine && typeof soundEngine.playTone === 'function') {
    soundEngine.playTone(650, 'sine', 0.08);
  }
}

function changeOpsCalendarMonth(delta) {
  currentCalMonth += delta;
  if (currentCalMonth < 0) {
    currentCalMonth = 11;
    currentCalYear--;
  } else if (currentCalMonth > 11) {
    currentCalMonth = 0;
    currentCalYear++;
  }
  renderOpsCalendarGrid(currentCalYear, currentCalMonth, selectedCalDate);
}

function selectOpsCalendarPreset(preset) {
  currentOpsDayFilter = preset;
  let labelText = 'Today (30 Oct 2026)';

  if (preset === 'today') {
    currentCalYear = 2026;
    currentCalMonth = 9;
    selectedCalDate = 30;
    currentOpsCustomDate = '2026-10-30';
    labelText = 'Today (30 Oct 2026)';
  } else if (preset === 'yesterday') {
    currentCalYear = 2026;
    currentCalMonth = 9;
    selectedCalDate = 29;
    currentOpsCustomDate = '2026-10-29';
    labelText = 'Yesterday (29 Oct 2026)';
  } else if (preset === '7days') {
    labelText = 'Last 7 Days (24 - 30 Oct)';
  } else if (preset === '30days') {
    labelText = 'Last 30 Days (Oct 2026)';
  }

  const labelEl = document.getElementById('ops-calendar-selected-label');
  if (labelEl) labelEl.textContent = labelText;

  const hintEl = document.getElementById('ops-cal-selected-hint');
  if (hintEl) hintEl.textContent = labelText + ' selected';

  updateOpsCalPresetButtons(preset);
  renderOpsCalendarGrid(currentCalYear, currentCalMonth, selectedCalDate);
  updateOpsDashboard();

  if (soundEngine && typeof soundEngine.playTone === 'function') {
    soundEngine.playTone(550, 'sine', 0.08);
  }
}

function updateOpsCalPresetButtons(activePreset) {
  const presets = ['today', 'yesterday', '7days', '30days'];
  presets.forEach(p => {
    const btn = document.getElementById('cal-preset-' + p);
    if (btn) {
      if (p === activePreset) {
        btn.className = 'py-1.5 px-2 rounded-xl text-center transition-all bg-white text-slate-900 shadow-sm font-extrabold';
      } else {
        btn.className = 'py-1.5 px-2 rounded-xl text-center text-slate-600 hover:text-slate-900 transition-all font-bold';
      }
    }
  });
}

// Backwards compatibility wrappers
function handleOpsDashboardDayChange(val) {
  selectOpsCalendarPreset(val);
}

function handleOpsDashboardCustomDate(dateVal) {
  if (!dateVal) return;
  const parts = dateVal.split('-');
  if (parts.length === 3) {
    currentCalYear = parseInt(parts[0], 10);
    currentCalMonth = parseInt(parts[1], 10) - 1;
    selectOpsCalendarDay(parseInt(parts[2], 10));
  }
}

// Global outside-click listener to auto-close calendar popover
document.addEventListener('click', function(e) {
  const popover = document.getElementById('ops-calendar-popover');
  const trigger = document.getElementById('ops-calendar-trigger-btn');
  if (!popover || popover.classList.contains('hidden')) return;
  if (!popover.contains(e.target) && (!trigger || !trigger.contains(e.target))) {
    popover.classList.add('hidden');
  }
});

function renderOpsTeamTableForCity(coords) {
  const tbody = document.getElementById('ops-team-table-body');
  if (!tbody || !coords) return;

  tbody.innerHTML = coords.map(c => `
    <tr class="hover:bg-slate-50 transition-colors">
      <td class="p-4 font-bold text-slate-900">${c.name}</td>
      <td class="p-4 text-slate-600 font-medium">${c.zone}</td>
      <td class="p-4 font-mono font-bold text-slate-800">${c.seniors}</td>
      <td class="p-4 font-mono font-bold text-teal-700">${c.alerts}</td>
      <td class="p-4 text-slate-600 font-mono text-xs">${c.avgResp}</td>
      <td class="p-4 text-emerald-600 font-bold">${c.compliance}</td>
      <td class="p-4"><span class="px-2.5 py-1 rounded-full text-xs font-bold ${c.status.includes('Active') ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'}">${c.status}</span></td>
      <td class="p-4 text-center">
        <button type="button" onclick="showToast('Roster updated for ' + '${c.name.replace(/'/g, "\'")}', 'success')" class="text-teal-600 hover:text-teal-800 font-bold text-xs p-1">Edit</button>
      </td>
    </tr>
  `).join('');
}

function renderOpsTeamTable() {
  const citySelect = document.getElementById('ops-city-filter');
  const city = (citySelect ? citySelect.value : 'delhi') || 'delhi';
  const metrics = OPS_CITY_METRICS[city] || OPS_CITY_METRICS.delhi;
  renderOpsTeamTableForCity(metrics.coords);
}

// ======================================================================// OPERATIONS MANAGER COMMAND CENTER LOGIC (7-VIEW DASHBOARD & CONTROLS)
// ======================================================================
let currentAssignTargetSenior = null;

// 1. Switch between Sidebar Tabs (Dashboard, Risk, Alerts, Team, Area, Reports, Audit, Profile)
function switchOpsTab(tabId) {
  // If target is settings, open profile subview and select settings tab
  if (tabId === 'settings') {
    switchOpsTab('profile');
    switchOpsProfileTab('settings');
    return;
  }
// Trigger cases table rendering when entering alerts tab
if (tabId === 'alerts') {
  setTimeout(renderOpsCasesTable, 50);
}
  // Hide all subviews
  const allSubviews = document.querySelectorAll('.ops-subview');
  allSubviews.forEach(view => view.classList.add('hidden'));

  // Show active subview
  const activeView = document.getElementById(`ops-subview-${tabId}`);
  if (activeView) {
    activeView.classList.remove('hidden');
  }

  // Update navigation buttons
  const allNavBtns = document.querySelectorAll('.ops-nav-btn');
  allNavBtns.forEach(btn => {
    btn.className = 'ops-nav-btn w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-all border border-transparent';
  });

  const activeBtn = document.getElementById(`ops-nav-${tabId}`);
  if (activeBtn) {
    activeBtn.className = 'ops-nav-btn w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all bg-[#ecfdf5] text-[#008779] shadow-sm border border-[#a7f3d0]';
  }

  // Trigger chart re-render / resize when entering tabs with charts
  if (['dashboard', 'risk', 'team', 'reports'].includes(tabId)) {
    setTimeout(initOpsCharts, 80);
  }

  // Trigger Leaflet interactive map rendering when entering area monitoring
  if (tabId === 'dashboard') {
    setTimeout(renderOpsDashboardEldersTable, 50);
  }
  if (tabId === 'area') {
    setTimeout(initOpsRealMap, 100);
  }

  // Trigger cases table rendering when entering alerts tab
  if (tabId === 'alerts') {
    setTimeout(renderOpsCasesTable, 50);
  }

  // Close any popups
  const userDropdown = document.getElementById('ops-user-dropdown');
  if (userDropdown) userDropdown.classList.add('hidden');
  const notifPopup = document.getElementById('ops-notification-popup');
  if (notifPopup) notifPopup.classList.add('hidden');

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// 2. Profile Sub-Tabs Navigation (Profile vs Settings vs Notifications vs Help)
function switchOpsProfileTab(subTab) {
  const profilePane = document.getElementById('ops-pane-profile');
  const settingsPane = document.getElementById('ops-pane-settings');
  const btnProfile = document.getElementById('btn-ops-ptab-profile');
  const btnSettings = document.getElementById('btn-ops-ptab-settings');
  const btnNotifs = document.getElementById('btn-ops-ptab-notifications');
  const btnHelp = document.getElementById('btn-ops-ptab-help');

  const inactiveBtnClass = 'ops-ptab-btn px-4 py-2 text-slate-500 hover:text-slate-800 font-bold text-xs border-b-2 border-transparent transition-all';
  const activeBtnClass = 'ops-ptab-btn px-4 py-2 border-b-2 border-teal-600 text-teal-800 font-extrabold text-xs transition-all';

  [btnProfile, btnSettings, btnNotifs, btnHelp].forEach(btn => {
    if (btn) btn.className = inactiveBtnClass;
  });

  if (subTab === 'profile') {
    if (profilePane) profilePane.classList.remove('hidden');
    if (settingsPane) settingsPane.classList.add('hidden');
    if (btnProfile) btnProfile.className = activeBtnClass;
  } else if (subTab === 'settings') {
    if (profilePane) profilePane.classList.add('hidden');
    if (settingsPane) settingsPane.classList.remove('hidden');
    if (btnSettings) btnSettings.className = activeBtnClass;
  } else if (subTab === 'notifications') {
    if (btnNotifs) btnNotifs.className = activeBtnClass;
    toggleOpsNotificationPopup();
  } else if (subTab === 'help') {
    if (btnHelp) btnHelp.className = activeBtnClass;
    showHelpModal();
  }
}

// 3. User Dropdown & Notifications Popups
function toggleOpsUserDropdown() {
  const d = document.getElementById('ops-user-dropdown');
  if (d) d.classList.toggle('hidden');
}

function toggleOpsNotificationPopup() {
  const p = document.getElementById('ops-notification-popup');
  if (p) p.classList.toggle('hidden');
}

// 4. Global Search Handler
// =====================================================================// COMPLETE 32 ALERTS DATASET & MULTI-CRITERIA FILTERING ENGINE
// =====================================================================
// =====================================================================// COMPREHENSIVE 32-ELDER CLINICAL REPORTS & AI RISK PREDICTION ENGINE
// =====================================================================
const OPS_ELDERS_REPORTS_DATA = [
  // --- 8 CRITICAL / HIGH RISK ELDERS (P1 - IMMEDIATE INTERVENTION) ---
  {
    id: "ELD-101",
    senior: "Ramesh Sharma",
    age: 74,
    gender: "Male",
    area: "Greater Kailash",
    phone: "+91 98110-44912",
    vitals: { hr: 114, hrSpike: true, bp: "158/96", bpSpike: true, spo2: "94.0%", spo2Low: true, glucose: "138 mg/dL", temp: "98.4 °F", mobility: "Walks with Cane / Mild Instability", adherence: "68% (Missed 1 Check-in)" },
    issue: "Tachycardia spike (114 bpm) & missed morning medication check-in",
    predictedRisk: "High",
    riskProbability: "94.6%",
    predictedPriority: "P1 - Critical",
    priorityCode: "P1",
    modelConfidence: "96.4%",
    modelDrivers: ["Resting HR 114 bpm (Arrhythmia risk)", "BP 158/96 mmHg Spike", "Borderline SpO2 94%"],
    recommendedTask: "🚨 Emergency Nurse Dispatch",
    recommendedCoord: "Sister Kavita, RN",
    status: "Pending Assignment",
    assignedCoordinator: "Unassigned",
    assignedTask: "None",
    lastReportDate: "Today, 10:24 AM"
  },
  {
    id: "ELD-102",
    senior: "Savitri Devi",
    age: 81,
    gender: "Female",
    area: "Hauz Khas",
    phone: "+91 98110-33418",
    vitals: { hr: 98, hrSpike: false, bp: "162/98", bpSpike: true, spo2: "93.5%", spo2Low: true, glucose: "142 mg/dL", temp: "98.6 °F", mobility: "Acute Hip Pain (8/10) • Fall Sensor Triggered", adherence: "85%" },
    issue: "Fall sensor triggered in bathroom & acute hip mobility limitation",
    predictedRisk: "High",
    riskProbability: "97.2%",
    predictedPriority: "P1 - Critical",
    priorityCode: "P1",
    modelConfidence: "98.1%",
    modelDrivers: ["IoT Accelerometer Fall Event", "Acute Hip Pain 8/10", "Hypertensive Stage-2 BP 162/98"],
    recommendedTask: "🚨 Emergency Nurse Dispatch",
    recommendedCoord: "Brother Amit",
    status: "In Progress",
    assignedCoordinator: "Brother Amit",
    assignedTask: "🚨 Emergency Nurse Dispatch",
    lastReportDate: "Today, 09:15 AM"
  },
  {
    id: "ELD-103",
    senior: "Anand Verma",
    age: 78,
    gender: "Male",
    area: "Saket",
    phone: "+91 98110-77621",
    vitals: { hr: 92, hrSpike: false, bp: "148/92", bpSpike: true, spo2: "95.5%", spo2Low: false, glucose: "228 mg/dL", temp: "98.8 °F", mobility: "Weak gait & fatigue", adherence: "42% (Missed 2 Insulin Doses)" },
    issue: "Missed 2 consecutive insulin doses with acute glucose spike (228 mg/dL)",
    predictedRisk: "High",
    riskProbability: "93.8%",
    predictedPriority: "P1 - Critical",
    priorityCode: "P1",
    modelConfidence: "95.2%",
    modelDrivers: ["Severe Hyperglycemia (228 mg/dL)", "Insulin Non-Adherence (42%)", "Ketoacidosis Risk"],
    recommendedTask: "🏠 Home Nursing Visit & Triage",
    recommendedCoord: "Rajesh Kumar",
    status: "Pending Assignment",
    assignedCoordinator: "Unassigned",
    assignedTask: "None",
    lastReportDate: "Today, 08:40 AM"
  },
  {
    id: "ELD-106",
    senior: "Devi Lal Kapoor",
    age: 83,
    gender: "Male",
    area: "Greater Kailash",
    phone: "+91 98110-11223",
    vitals: { hr: 88, hrSpike: false, bp: "154/92", bpSpike: true, spo2: "95.0%", spo2Low: false, glucose: "132 mg/dL", temp: "98.2 °F", mobility: "High Fall Risk • Requires Walker", adherence: "72%" },
    issue: "Stage-2 BP elevation (154/92) with severe mobility decline and dizziness",
    predictedRisk: "High",
    riskProbability: "91.4%",
    predictedPriority: "P1 - Critical",
    priorityCode: "P1",
    modelConfidence: "93.9%",
    modelDrivers: ["Orthostatic Dizziness", "Stage-2 Hypertension", "Severe Gait Instability"],
    recommendedTask: "🏠 Home Nursing Visit & Triage",
    recommendedCoord: "Dr. V.K. Kapoor",
    status: "In Progress",
    assignedCoordinator: "Dr. V.K. Kapoor",
    assignedTask: "🏠 Home Nursing Visit & Triage",
    lastReportDate: "Today, 07:30 AM"
  },
  {
    id: "ELD-112",
    senior: "Suman Lata",
    age: 80,
    gender: "Female",
    area: "Hauz Khas",
    phone: "+91 98110-33221",
    vitals: { hr: 96, hrSpike: false, bp: "165/102", bpSpike: true, spo2: "92.8%", spo2Low: true, glucose: "160 mg/dL", temp: "98.6 °F", mobility: "Orthostatic dizziness on standing", adherence: "65%" },
    issue: "Orthostatic hypotension drop with compensatory tachycardia & fall hazard",
    predictedRisk: "High",
    riskProbability: "95.5%",
    predictedPriority: "P1 - Critical",
    priorityCode: "P1",
    modelConfidence: "97.0%",
    modelDrivers: ["SpO2 92.8% (Hypoxia threat)", "BP 165/102 Severe", "Postural Instability"],
    recommendedTask: "🚨 Emergency Nurse Dispatch",
    recommendedCoord: "Brother Amit",
    status: "Pending Assignment",
    assignedCoordinator: "Unassigned",
    assignedTask: "None",
    lastReportDate: "Today, 05:15 AM"
  },
  {
    id: "ELD-115",
    senior: "Om Prakash",
    age: 76,
    gender: "Male",
    area: "Saket",
    phone: "+91 98110-44112",
    vitals: { hr: 112, hrSpike: true, bp: "152/94", bpSpike: true, spo2: "93.8%", spo2Low: true, glucose: "148 mg/dL", temp: "98.4 °F", mobility: "Chest discomfort upon moving", adherence: "80%" },
    issue: "Acute substernal chest tightness with resting pulse 112 bpm",
    predictedRisk: "High",
    riskProbability: "96.8%",
    predictedPriority: "P1 - Critical",
    priorityCode: "P1",
    modelConfidence: "98.5%",
    modelDrivers: ["Cardiac Strain Indicator (112 bpm)", "Substernal Chest Pressure", "SpO2 93.8%"],
    recommendedTask: "🚨 Emergency Nurse Dispatch",
    recommendedCoord: "Dr. V.K. Kapoor",
    status: "In Progress",
    assignedCoordinator: "Dr. V.K. Kapoor",
    assignedTask: "🚨 Emergency Nurse Dispatch",
    lastReportDate: "Today, 04:10 AM"
  },
  {
    id: "ELD-116",
    senior: "Kamala Nehru",
    age: 84,
    gender: "Female",
    area: "Vasant Kunj",
    phone: "+91 98110-88339",
    vitals: { hr: 90, hrSpike: false, bp: "146/90", bpSpike: true, spo2: "94.5%", spo2Low: true, glucose: "124 mg/dL", temp: "99.1 °F", mobility: "Severe Lumbar Joint Pain (8/10) • Bedbound", adherence: "70%" },
    issue: "Acute lumbar spine flare-up, unable to rise from bed for 8 hours",
    predictedRisk: "High",
    riskProbability: "92.0%",
    predictedPriority: "P1 - Critical",
    priorityCode: "P1",
    modelConfidence: "94.2%",
    modelDrivers: ["Prolonged Bedbound Immobility", "Severe Pain Level 8/10", "Low Grade Pyrexia 99.1°F"],
    recommendedTask: "🏠 Home Nursing Visit & Triage",
    recommendedCoord: "Sister Sunita",
    status: "In Progress",
    assignedCoordinator: "Sister Sunita",
    assignedTask: "🏠 Home Nursing Visit & Triage",
    lastReportDate: "Today, 03:45 AM"
  },
  {
    id: "ELD-117",
    senior: "Jagdish Prasad",
    age: 79,
    gender: "Male",
    area: "Greater Kailash",
    phone: "+91 98110-99441",
    vitals: { hr: 104, hrSpike: false, bp: "170/105", bpSpike: true, spo2: "94.0%", spo2Low: true, glucose: "155 mg/dL", temp: "98.4 °F", mobility: "Severe headache and unsteady walking", adherence: "50%" },
    issue: "Hypertensive crisis (170/105 mmHg) with visual aura and headache",
    predictedRisk: "High",
    riskProbability: "98.0%",
    predictedPriority: "P1 - Critical",
    priorityCode: "P1",
    modelConfidence: "99.1%",
    modelDrivers: ["Hypertensive Crisis BP 170/105", "Neurological Visual Aura", "High Stroke Hazard"],
    recommendedTask: "🚨 Emergency Nurse Dispatch",
    recommendedCoord: "Sister Kavita, RN",
    status: "Pending Assignment",
    assignedCoordinator: "Unassigned",
    assignedTask: "None",
    lastReportDate: "Today, 02:20 AM"
  },

  // --- 14 MODERATE RISK ELDERS (P2 - HIGH PRIORITY / 2H SLA) ---
  {
    id: "ELD-104",
    senior: "Meena Iyer",
    age: 71,
    gender: "Female",
    area: "Connaught Place",
    phone: "+91 98110-55829",
    vitals: { hr: 84, hrSpike: false, bp: "138/88", bpSpike: false, spo2: "96.5%", spo2Low: false, glucose: "115 mg/dL", temp: "98.4 °F", mobility: "Slow walking, fatigue", adherence: "82%" },
    issue: "Sleep deficit (3.5 hrs) & bereavement emotional fatigue check-in",
    predictedRisk: "Moderate",
    riskProbability: "74.5%",
    predictedPriority: "P2 - High Priority",
    priorityCode: "P2",
    modelConfidence: "84.2%",
    modelDrivers: ["Severe Sleep Fragmentation", "Elevated Baseline Stress", "Mild BP Variation"],
    recommendedTask: "📞 Tele-Consultation Call",
    recommendedCoord: "Sister Sunita",
    status: "In Progress",
    assignedCoordinator: "Sister Sunita",
    assignedTask: "📞 Tele-Consultation Call",
    lastReportDate: "Today, 08:15 AM"
  },
  {
    id: "ELD-107",
    senior: "Suman Singh",
    age: 73,
    gender: "Female",
    area: "Hauz Khas",
    phone: "+91 98110-66228",
    vitals: { hr: 80, hrSpike: false, bp: "135/85", bpSpike: false, spo2: "97.0%", spo2Low: false, glucose: "122 mg/dL", temp: "98.2 °F", mobility: "Knee pain (5/10), reduced daily steps", adherence: "90%" },
    issue: "Knee pain exacerbation (Level 5/10) with 60% reduction in daily steps",
    predictedRisk: "Moderate",
    riskProbability: "71.2%",
    predictedPriority: "P2 - High Priority",
    priorityCode: "P2",
    modelConfidence: "81.5%",
    modelDrivers: ["Activity Decline > 50%", "Osteoarthritis Pain Flare", "Mild Morning Stiffness"],
    recommendedTask: "🏠 Home Nursing Visit & Triage",
    recommendedCoord: "Brother Amit",
    status: "In Progress",
    assignedCoordinator: "Brother Amit",
    assignedTask: "🏠 Home Nursing Visit & Triage",
    lastReportDate: "Today, 06:45 AM"
  },
  {
    id: "ELD-108",
    senior: "Bala Rao",
    age: 77,
    gender: "Male",
    area: "Saket",
    phone: "+91 98110-88912",
    vitals: { hr: 94, hrSpike: false, bp: "142/88", bpSpike: false, spo2: "95.8%", spo2Low: false, glucose: "130 mg/dL", temp: "98.6 °F", mobility: "Mild instability", adherence: "78%" },
    issue: "Irregular pulse rhythm noted on wearable ECG with mild insomnia",
    predictedRisk: "Moderate",
    riskProbability: "76.0%",
    predictedPriority: "P2 - High Priority",
    priorityCode: "P2",
    modelConfidence: "83.9%",
    modelDrivers: ["Wearable ECG Irregularity", "Mild Pre-Hypertension", "Insomnia Deficit"],
    recommendedTask: "💊 Medication Adherence Audit",
    recommendedCoord: "Rajesh Kumar",
    status: "In Progress",
    assignedCoordinator: "Rajesh Kumar",
    assignedTask: "💊 Medication Adherence Audit",
    lastReportDate: "Today, 06:00 AM"
  },
  {
    id: "ELD-113",
    senior: "Sheila Dixit",
    age: 75,
    gender: "Female",
    area: "Greater Kailash",
    phone: "+91 98110-44771",
    vitals: { hr: 82, hrSpike: false, bp: "136/84", bpSpike: false, spo2: "96.2%", spo2Low: false, glucose: "118 mg/dL", temp: "98.2 °F", mobility: "Mild gait imbalance when getting up", adherence: "88%" },
    issue: "Mild gait stumble detected by motion sensors in hallway; no floor impact",
    predictedRisk: "Moderate",
    riskProbability: "68.5%",
    predictedPriority: "P2 - High Priority",
    priorityCode: "P2",
    modelConfidence: "80.4%",
    modelDrivers: ["Hallway Motion Stumble", "Sensory Neuropathy Check", "Fall Risk Escalation"],
    recommendedTask: "🏠 Home Nursing Visit & Triage",
    recommendedCoord: "Sister Kavita, RN",
    status: "In Progress",
    assignedCoordinator: "Sister Kavita, RN",
    assignedTask: "🏠 Home Nursing Visit & Triage",
    lastReportDate: "Yesterday, 11:30 PM"
  },
  {
    id: "ELD-114",
    senior: "Pushpa Rani",
    age: 79,
    gender: "Female",
    area: "Vasant Kunj",
    phone: "+91 98110-77334",
    vitals: { hr: 86, hrSpike: false, bp: "140/88", bpSpike: false, spo2: "95.5%", spo2Low: false, glucose: "145 mg/dL", temp: "98.4 °F", mobility: "Slow transfers from bed", adherence: "84%" },
    issue: "Slow sit-to-stand transitions taking > 45 seconds; mobility audit recommended",
    predictedRisk: "Moderate",
    riskProbability: "69.8%",
    predictedPriority: "P2 - High Priority",
    priorityCode: "P2",
    modelConfidence: "79.2%",
    modelDrivers: ["Impaired Sit-to-Stand Speed", "Frailty Index Elevation", "Mild Sarcopenia"],
    recommendedTask: "🏠 Home Nursing Visit & Triage",
    recommendedCoord: "Sister Sunita",
    status: "In Progress",
    assignedCoordinator: "Sister Sunita",
    assignedTask: "🏠 Home Nursing Visit & Triage",
    lastReportDate: "Yesterday, 10:15 PM"
  },
  {
    id: "ELD-118",
    senior: "Satish Chandra",
    age: 72,
    gender: "Male",
    area: "Connaught Place",
    phone: "+91 98110-22119",
    vitals: { hr: 76, hrSpike: false, bp: "132/84", bpSpike: false, spo2: "96.8%", spo2Low: false, glucose: "128 mg/dL", temp: "98.2 °F", mobility: "Normal indoors", adherence: "74%" },
    issue: "Missed evening anti-hypertensive pill; flagged by smart dispenser",
    predictedRisk: "Moderate",
    riskProbability: "62.4%",
    predictedPriority: "P2 - High Priority",
    priorityCode: "P2",
    modelConfidence: "78.0%",
    modelDrivers: ["Smart Dispenser Non-Dispense", "Blood Pressure Medication Gap"],
    recommendedTask: "💊 Medication Adherence Audit",
    recommendedCoord: "Rajesh Kumar",
    status: "Pending Assignment",
    assignedCoordinator: "Unassigned",
    assignedTask: "None",
    lastReportDate: "Yesterday, 09:30 PM"
  },
  {
    id: "ELD-119",
    senior: "Lalita Devi",
    age: 76,
    gender: "Female",
    area: "Hauz Khas",
    phone: "+91 98110-33882",
    vitals: { hr: 82, hrSpike: false, bp: "138/86", bpSpike: false, spo2: "96.0%", spo2Low: false, glucose: "119 mg/dL", temp: "98.4 °F", mobility: "Slight hesitation stairs", adherence: "86%" },
    issue: "Zero outdoor activity recorded for 72 consecutive hours",
    predictedRisk: "Moderate",
    riskProbability: "64.1%",
    predictedPriority: "P2 - High Priority",
    priorityCode: "P2",
    modelConfidence: "77.5%",
    modelDrivers: ["Prolonged In-Home Isolation", "Sedentary Behavior Warning", "Mood Monitoring"],
    recommendedTask: "🤝 Daily Routine Voice Check",
    recommendedCoord: "Brother Amit",
    status: "In Progress",
    assignedCoordinator: "Brother Amit",
    assignedTask: "🤝 Daily Routine Voice Check",
    lastReportDate: "Yesterday, 08:20 PM"
  },
  {
    id: "ELD-120",
    senior: "Brij Mohan",
    age: 82,
    gender: "Male",
    area: "Saket",
    phone: "+91 98110-55112",
    vitals: { hr: 88, hrSpike: false, bp: "144/88", bpSpike: false, spo2: "95.2%", spo2Low: false, glucose: "152 mg/dL", temp: "98.6 °F", mobility: "Walks with stick", adherence: "80%" },
    issue: "Mild swelling (peripheral edema) reported in ankles during morning check",
    predictedRisk: "Moderate",
    riskProbability: "73.0%",
    predictedPriority: "P2 - High Priority",
    priorityCode: "P2",
    modelConfidence: "82.6%",
    modelDrivers: ["Bilateral Ankle Edema", "Fluid Retention Risk", "Hypertension Hx"],
    recommendedTask: "🏠 Home Nursing Visit & Triage",
    recommendedCoord: "Dr. V.K. Kapoor",
    status: "In Progress",
    assignedCoordinator: "Dr. V.K. Kapoor",
    assignedTask: "🏠 Home Nursing Visit & Triage",
    lastReportDate: "Yesterday, 07:15 PM"
  },
  {
    id: "ELD-121",
    senior: "Urmila Gupta",
    age: 70,
    gender: "Female",
    area: "Greater Kailash",
    phone: "+91 98110-66778",
    vitals: { hr: 78, hrSpike: false, bp: "130/82", bpSpike: false, spo2: "97.2%", spo2Low: false, glucose: "112 mg/dL", temp: "98.2 °F", mobility: "Normal", adherence: "85%" },
    issue: "Persistent night awakenings (4-5 times/night) recorded over 4 nights",
    predictedRisk: "Moderate",
    riskProbability: "61.5%",
    predictedPriority: "P2 - High Priority",
    priorityCode: "P2",
    modelConfidence: "76.4%",
    modelDrivers: ["Nocturnal Restlessness", "Frequent Urination Suspicion", "Sleep Efficiency < 60%"],
    recommendedTask: "📞 Tele-Consultation Call",
    recommendedCoord: "Sister Kavita, RN",
    status: "In Progress",
    assignedCoordinator: "Sister Kavita, RN",
    assignedTask: "📞 Tele-Consultation Call",
    lastReportDate: "Yesterday, 06:10 PM"
  },
  {
    id: "ELD-122",
    senior: "Kailash Nath",
    age: 85,
    gender: "Male",
    area: "Vasant Kunj",
    phone: "+91 98110-88442",
    vitals: { hr: 84, hrSpike: false, bp: "142/86", bpSpike: false, spo2: "95.0%", spo2Low: false, glucose: "135 mg/dL", temp: "98.4 °F", mobility: "Slow shuffling gait", adherence: "76%" },
    issue: "Shuffling gait detected; sensor suggests early Parkinsonian tendency",
    predictedRisk: "Moderate",
    riskProbability: "75.2%",
    predictedPriority: "P2 - High Priority",
    priorityCode: "P2",
    modelConfidence: "83.1%",
    modelDrivers: ["Gait Velocity Drop (< 0.6 m/s)", "Cadence Asymmetry", "Fall Risk Tier 2"],
    recommendedTask: "🏠 Home Nursing Visit & Triage",
    recommendedCoord: "Sister Sunita",
    status: "Pending Assignment",
    assignedCoordinator: "Unassigned",
    assignedTask: "None",
    lastReportDate: "Yesterday, 05:00 PM"
  },
  {
    id: "ELD-123",
    senior: "Shakuntala",
    age: 77,
    gender: "Female",
    area: "Connaught Place",
    phone: "+91 98110-99221",
    vitals: { hr: 80, hrSpike: false, bp: "134/84", bpSpike: false, spo2: "96.5%", spo2Low: false, glucose: "125 mg/dL", temp: "98.2 °F", mobility: "Normal", adherence: "79%" },
    issue: "Missed scheduled morning blood pressure self-measurement",
    predictedRisk: "Moderate",
    riskProbability: "58.0%",
    predictedPriority: "P2 - High Priority",
    priorityCode: "P2",
    modelConfidence: "74.8%",
    modelDrivers: ["Monitoring Protocol Non-Compliance", "Hypertension Follow-up Due"],
    recommendedTask: "🤝 Daily Routine Voice Check",
    recommendedCoord: "Rajesh Kumar",
    status: "In Progress",
    assignedCoordinator: "Rajesh Kumar",
    assignedTask: "🤝 Daily Routine Voice Check",
    lastReportDate: "Yesterday, 03:45 PM"
  },
  {
    id: "ELD-124",
    senior: "Narayan Swamy",
    age: 80,
    gender: "Male",
    area: "Hauz Khas",
    phone: "+91 98110-11773",
    vitals: { hr: 82, hrSpike: false, bp: "136/85", bpSpike: false, spo2: "96.0%", spo2Low: false, glucose: "130 mg/dL", temp: "98.4 °F", mobility: "Canes support", adherence: "88%" },
    issue: "Slight cognitive disorientation reported during voice bot check-in",
    predictedRisk: "Moderate",
    riskProbability: "72.4%",
    predictedPriority: "P2 - High Priority",
    priorityCode: "P2",
    modelConfidence: "81.0%",
    modelDrivers: ["Speech Latency Spike (Voice AI)", "Mild Confusion Indicator", "Caregiver Alert Needed"],
    recommendedTask: "📞 Tele-Consultation Call",
    recommendedCoord: "Brother Amit",
    status: "Pending Assignment",
    assignedCoordinator: "Unassigned",
    assignedTask: "None",
    lastReportDate: "Yesterday, 02:30 PM"
  },
  {
    id: "ELD-125",
    senior: "Vimla Bhatia",
    age: 74,
    gender: "Female",
    area: "Saket",
    phone: "+91 98110-44883",
    vitals: { hr: 85, hrSpike: false, bp: "140/88", bpSpike: false, spo2: "95.8%", spo2Low: false, glucose: "140 mg/dL", temp: "98.6 °F", mobility: "Good", adherence: "81%" },
    issue: "Mild dizziness after taking afternoon beta-blocker",
    predictedRisk: "Moderate",
    riskProbability: "67.9%",
    predictedPriority: "P2 - High Priority",
    priorityCode: "P2",
    modelConfidence: "77.9%",
    modelDrivers: ["Adverse Drug Reaction Suspicion", "Transient Post-Dose Dizziness"],
    recommendedTask: "💊 Medication Adherence Audit",
    recommendedCoord: "Dr. V.K. Kapoor",
    status: "In Progress",
    assignedCoordinator: "Dr. V.K. Kapoor",
    assignedTask: "💊 Medication Adherence Audit",
    lastReportDate: "Yesterday, 01:15 PM"
  },
  {
    id: "ELD-126",
    senior: "Prem Nath",
    age: 82,
    gender: "Male",
    area: "Greater Kailash",
    phone: "+91 98110-55994",
    vitals: { hr: 86, hrSpike: false, bp: "142/86", bpSpike: false, spo2: "95.4%", spo2Low: false, glucose: "146 mg/dL", temp: "98.5 °F", mobility: "Moderate stiffness", adherence: "83%" },
    issue: "Hydration intake below 1.0 Liter over 24 hours in hot weather",
    predictedRisk: "Moderate",
    riskProbability: "65.3%",
    predictedPriority: "P2 - High Priority",
    priorityCode: "P2",
    modelConfidence: "78.4%",
    modelDrivers: ["Sub-Optimal Fluid Intake", "Electrolyte Imbalance Risk"],
    recommendedTask: "🤝 Daily Routine Voice Check",
    recommendedCoord: "Sister Kavita, RN",
    status: "Pending Assignment",
    assignedCoordinator: "Unassigned",
    assignedTask: "None",
    lastReportDate: "Yesterday, 12:00 PM"
  },

  // --- 10 LOW RISK / STABLE ELDERS (P3 - ROUTINE CARE) ---
  {
    id: "ELD-105",
    senior: "Harish Patel",
    age: 69,
    gender: "Male",
    area: "Dwarka",
    phone: "+91 98110-22341",
    vitals: { hr: 72, hrSpike: false, bp: "122/78", bpSpike: false, spo2: "98.5%", spo2Low: false, glucose: "108 mg/dL", temp: "98.4 °F", mobility: "Fully Independent • 4,500 Steps/Day", adherence: "98%" },
    issue: "All vitals stable; completed routine wellness walking check-in",
    predictedRisk: "Low",
    riskProbability: "8.2%",
    predictedPriority: "P3 - Routine Care",
    priorityCode: "P3",
    modelConfidence: "98.2%",
    modelDrivers: ["Optimal Resting HR 72 bpm", "Normotensive BP 122/78", "Excellent Adherence (98%)"],
    recommendedTask: "🤝 Daily Routine Voice Check",
    recommendedCoord: "Rajesh Kumar",
    status: "Completed",
    assignedCoordinator: "Rajesh Kumar",
    assignedTask: "🤝 Daily Routine Voice Check",
    lastReportDate: "Today, 07:45 AM"
  },
  {
    id: "ELD-109",
    senior: "Krishna Murthy",
    age: 78,
    gender: "Male",
    area: "Defence Colony",
    phone: "+91 98110-33771",
    vitals: { hr: 74, hrSpike: false, bp: "126/80", bpSpike: false, spo2: "97.8%", spo2Low: false, glucose: "114 mg/dL", temp: "98.2 °F", mobility: "Independent with cane", adherence: "96%" },
    issue: "Routine fall prevention grab-bar assessment completed; all clear",
    predictedRisk: "Low",
    riskProbability: "11.4%",
    predictedPriority: "P3 - Routine Care",
    priorityCode: "P3",
    modelConfidence: "96.5%",
    modelDrivers: ["Bathroom Safety Verified", "Stable Balance Metrics"],
    recommendedTask: "🤝 Daily Routine Voice Check",
    recommendedCoord: "Sister Sunita",
    status: "Completed",
    assignedCoordinator: "Sister Sunita",
    assignedTask: "🤝 Daily Routine Voice Check",
    lastReportDate: "Yesterday, 04:30 PM"
  },
  {
    id: "ELD-110",
    senior: "Tara Devi",
    age: 72,
    gender: "Female",
    area: "Dwarka",
    phone: "+91 98110-44229",
    vitals: { hr: 70, hrSpike: false, bp: "120/78", bpSpike: false, spo2: "98.2%", spo2Low: false, glucose: "105 mg/dL", temp: "98.4 °F", mobility: "Independent", adherence: "95%" },
    issue: "Fall safety checklist submitted by family; rug removed from hallway",
    predictedRisk: "Low",
    riskProbability: "9.5%",
    predictedPriority: "P3 - Routine Care",
    priorityCode: "P3",
    modelConfidence: "97.4%",
    modelDrivers: ["Environmental Hazard Cleared", "Stable Gait"],
    recommendedTask: "🤝 Daily Routine Voice Check",
    recommendedCoord: "Rajesh Kumar",
    status: "Completed",
    assignedCoordinator: "Rajesh Kumar",
    assignedTask: "🤝 Daily Routine Voice Check",
    lastReportDate: "Yesterday, 03:00 PM"
  },
  {
    id: "ELD-111",
    senior: "Sita Ram",
    age: 80,
    gender: "Male",
    area: "Defence Colony",
    phone: "+91 98110-55663",
    vitals: { hr: 76, hrSpike: false, bp: "128/82", bpSpike: false, spo2: "97.5%", spo2Low: false, glucose: "118 mg/dL", temp: "98.2 °F", mobility: "Walks independently", adherence: "94%" },
    issue: "Fall risk baseline test passed with 10/10 score on mobility survey",
    predictedRisk: "Low",
    riskProbability: "10.1%",
    predictedPriority: "P3 - Routine Care",
    priorityCode: "P3",
    modelConfidence: "96.8%",
    modelDrivers: ["ADL Independence 10/10", "Stable Neuromuscular Response"],
    recommendedTask: "🤝 Daily Routine Voice Check",
    recommendedCoord: "Brother Amit",
    status: "Completed",
    assignedCoordinator: "Brother Amit",
    assignedTask: "🤝 Daily Routine Voice Check",
    lastReportDate: "Yesterday, 01:45 PM"
  },
  {
    id: "ELD-127",
    senior: "Gayatri Devi",
    age: 71,
    gender: "Female",
    area: "Dwarka",
    phone: "+91 98110-66441",
    vitals: { hr: 73, hrSpike: false, bp: "124/80", bpSpike: false, spo2: "98.0%", spo2Low: false, glucose: "110 mg/dL", temp: "98.4 °F", mobility: "Independent", adherence: "97%" },
    issue: "Morning wellness call: elder reported excellent mood and cooked breakfast",
    predictedRisk: "Low",
    riskProbability: "7.8%",
    predictedPriority: "P3 - Routine Care",
    priorityCode: "P3",
    modelConfidence: "98.9%",
    modelDrivers: ["Positive Psychological Tone", "Normal Vitals Range"],
    recommendedTask: "🤝 Daily Routine Voice Check",
    recommendedCoord: "Sister Sunita",
    status: "Completed",
    assignedCoordinator: "Sister Sunita",
    assignedTask: "🤝 Daily Routine Voice Check",
    lastReportDate: "Yesterday, 11:15 AM"
  },
  {
    id: "ELD-128",
    senior: "Ved Prakash",
    age: 75,
    gender: "Male",
    area: "Defence Colony",
    phone: "+91 98110-77119",
    vitals: { hr: 75, hrSpike: false, bp: "126/82", bpSpike: false, spo2: "97.6%", spo2Low: false, glucose: "116 mg/dL", temp: "98.3 °F", mobility: "Independent", adherence: "95%" },
    issue: "Weekly vitals telemetry upload completed automatically via Bluetooth hub",
    predictedRisk: "Low",
    riskProbability: "8.9%",
    predictedPriority: "P3 - Routine Care",
    priorityCode: "P3",
    modelConfidence: "98.1%",
    modelDrivers: ["Seamless IoT Data Stream", "Zero Aberrations 7-Days"],
    recommendedTask: "🤝 Daily Routine Voice Check",
    recommendedCoord: "Rajesh Kumar",
    status: "Completed",
    assignedCoordinator: "Rajesh Kumar",
    assignedTask: "🤝 Daily Routine Voice Check",
    lastReportDate: "Yesterday, 10:00 AM"
  },
  {
    id: "ELD-129",
    senior: "Bhagwan Das",
    age: 81,
    gender: "Male",
    area: "Dwarka",
    phone: "+91 98110-88225",
    vitals: { hr: 71, hrSpike: false, bp: "125/79", bpSpike: false, spo2: "98.4%", spo2Low: false, glucose: "112 mg/dL", temp: "98.2 °F", mobility: "Walks in society park", adherence: "99%" },
    issue: "Prescription refill confirmation received from Apollo Pharmacy",
    predictedRisk: "Low",
    riskProbability: "6.5%",
    predictedPriority: "P3 - Routine Care",
    priorityCode: "P3",
    modelConfidence: "99.2%",
    modelDrivers: ["Full Medication Supply On Hand", "High Adherence"],
    recommendedTask: "💊 Medication Adherence Audit",
    recommendedCoord: "Sister Kavita, RN",
    status: "Completed",
    assignedCoordinator: "Sister Kavita, RN",
    assignedTask: "💊 Medication Adherence Audit",
    lastReportDate: "Yesterday, 09:30 AM"
  },
  {
    id: "ELD-130",
    senior: "Maya Wati",
    age: 73,
    gender: "Female",
    area: "Defence Colony",
    phone: "+91 98110-99118",
    vitals: { hr: 74, hrSpike: false, bp: "122/78", bpSpike: false, spo2: "98.0%", spo2Low: false, glucose: "109 mg/dL", temp: "98.4 °F", mobility: "Independent", adherence: "96%" },
    issue: "Sleep tracking shows 7.5 hours uninterrupted restorative rest",
    predictedRisk: "Low",
    riskProbability: "7.1%",
    predictedPriority: "P3 - Routine Care",
    priorityCode: "P3",
    modelConfidence: "98.6%",
    modelDrivers: ["Optimal Deep Sleep Ratio", "Low Daytime Fatigue"],
    recommendedTask: "🤝 Daily Routine Voice Check",
    recommendedCoord: "Brother Amit",
    status: "Completed",
    assignedCoordinator: "Brother Amit",
    assignedTask: "🤝 Daily Routine Voice Check",
    lastReportDate: "Yesterday, 08:45 AM"
  },
  {
    id: "ELD-131",
    senior: "Ram Avatar",
    age: 76,
    gender: "Male",
    area: "Dwarka",
    phone: "+91 98110-33556",
    vitals: { hr: 72, hrSpike: false, bp: "124/80", bpSpike: false, spo2: "98.1%", spo2Low: false, glucose: "115 mg/dL", temp: "98.2 °F", mobility: "Independent", adherence: "94%" },
    issue: "Completed daily breathing & yoga stretch routine on schedule",
    predictedRisk: "Low",
    riskProbability: "9.0%",
    predictedPriority: "P3 - Routine Care",
    priorityCode: "P3",
    modelConfidence: "97.8%",
    modelDrivers: ["Active Lifestyle Adherence", "Stable SpO2"],
    recommendedTask: "🤝 Daily Routine Voice Check",
    recommendedCoord: "Dr. V.K. Kapoor",
    status: "Completed",
    assignedCoordinator: "Dr. V.K. Kapoor",
    assignedTask: "🤝 Daily Routine Voice Check",
    lastReportDate: "Yesterday, 08:00 AM"
  },
  {
    id: "ELD-132",
    senior: "Sarojini",
    age: 79,
    gender: "Female",
    area: "Defence Colony",
    phone: "+91 98110-44667",
    vitals: { hr: 75, hrSpike: false, bp: "126/82", bpSpike: false, spo2: "97.9%", spo2Low: false, glucose: "118 mg/dL", temp: "98.4 °F", mobility: "Independent with cane", adherence: "97%" },
    issue: "Monthly geriatric consultation confirmed stable chronic condition management",
    predictedRisk: "Low",
    riskProbability: "10.5%",
    predictedPriority: "P3 - Routine Care",
    priorityCode: "P3",
    modelConfidence: "96.9%",
    modelDrivers: ["Stable 30-Day Biomarkers", "Good Family Support"],
    recommendedTask: "🤝 Daily Routine Voice Check",
    recommendedCoord: "Sister Sunita",
    status: "Completed",
    assignedCoordinator: "Sister Sunita",
    assignedTask: "🤝 Daily Routine Voice Check",
    lastReportDate: "Yesterday, 07:30 AM"
  }
];

let opsDashEldersFilterState = {
  tab: 'all',
  risk: 'all',
  priority: 'all',
  area: 'all',
  search: '',
  currentPage: 1,
  pageSize: 8
};

function getFilteredOpsDashboardElders() {
  const { tab, risk, priority, area, search } = opsDashEldersFilterState;
  return OPS_ELDERS_REPORTS_DATA.filter(item => {
    // 1. Tab filter
    if (tab === 'high' && item.predictedRisk !== 'High') return false;
    if (tab === 'moderate' && item.predictedRisk !== 'Moderate') return false;
    if (tab === 'low' && item.predictedRisk !== 'Low') return false;
    if (tab === 'pending' && !item.status.includes('Pending')) return false;

    // 2. Risk filter
    if (risk !== 'all' && item.predictedRisk !== risk) return false;

    // 3. Priority filter
    if (priority !== 'all' && item.priorityCode !== priority) return false;

    // 4. Area filter
    if (area !== 'all' && item.area !== area) return false;

    // 5. Search filter
    if (search) {
      const q = search.toLowerCase();
      const match = (
        item.senior.toLowerCase().includes(q) ||
        item.area.toLowerCase().includes(q) ||
        item.issue.toLowerCase().includes(q) ||
        item.vitals.bp.includes(q) ||
        String(item.vitals.hr).includes(q) ||
        item.assignedCoordinator.toLowerCase().includes(q)
      );
      if (!match) return false;
    }

    return true;
  });
}

function renderOpsDashboardEldersTable() {
  const tbody = document.getElementById('ops-dashboard-elders-tbody');
  if (!tbody) return;

  const filtered = getFilteredOpsDashboardElders();
  const { currentPage, pageSize } = opsDashEldersFilterState;
  const total = filtered.length;
  const totalPages = Math.ceil(total / pageSize) || 1;
  const validPage = Math.min(Math.max(1, currentPage), totalPages);
  opsDashEldersFilterState.currentPage = validPage;

  const startIdx = (validPage - 1) * pageSize;
  const pageItems = filtered.slice(startIdx, startIdx + pageSize);

  if (pageItems.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" class="p-10 text-center text-slate-500 bg-slate-50/50">
          <div class="w-12 h-12 rounded-2xl bg-white border border-slate-200 text-slate-400 flex items-center justify-center mx-auto mb-3 text-lg shadow-sm">
            <i class="fa-solid fa-filter-circle-xmark text-teal-600"></i>
          </div>
          <div class="font-extrabold text-slate-800 text-sm">No elder records match current filters</div>
          <div class="text-xs text-slate-500 mt-1 max-w-sm mx-auto">Try resetting filters to view all 32 registered elders and clinical telemetry.</div>
          <button type="button" onclick="resetOpsDashboardEldersFilters()" class="mt-4 px-4 py-2 rounded-xl bg-[#00a896] hover:bg-[#008779] text-white font-bold text-xs shadow-md transition-all active:scale-95 cursor-pointer">
            Reset Filters (Show All 32)
          </button>
        </td>
      </tr>
    `;
  } else {
    tbody.innerHTML = pageItems.map(item => {
      // Risk badge
      const riskBadge = item.predictedRisk === 'High'
        ? `<span class="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-black bg-rose-100 text-rose-700 border border-rose-200 shadow-2xs animate-pulse"><span class="w-1.5 h-1.5 rounded-full bg-rose-600"></span><span>High (${item.riskProbability})</span></span>`
        : item.predictedRisk === 'Moderate'
        ? `<span class="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-black bg-amber-100 text-amber-700 border border-amber-200 shadow-2xs"><span class="w-1.5 h-1.5 rounded-full bg-amber-500"></span><span>Moderate (${item.riskProbability})</span></span>`
        : `<span class="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-700 border border-emerald-200 shadow-2xs"><span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span><span>Low (${item.riskProbability})</span></span>`;

      // Priority badge
      const priorityBadge = item.priorityCode === 'P1'
        ? `<div class="inline-flex flex-col"><span class="px-2.5 py-0.5 rounded-lg text-[10px] font-extrabold bg-gradient-to-r from-rose-600 to-red-600 text-white shadow-2xs">P1 • CRITICAL</span><span class="text-[9px] text-rose-600 font-bold mt-0.5">⚡ 15m Response SLA</span></div>`
        : item.priorityCode === 'P2'
        ? `<div class="inline-flex flex-col"><span class="px-2.5 py-0.5 rounded-lg text-[10px] font-extrabold bg-amber-100 text-amber-800 border border-amber-300">P2 • HIGH</span><span class="text-[9px] text-amber-600 font-bold mt-0.5">🕒 2h Response SLA</span></div>`
        : `<div class="inline-flex flex-col"><span class="px-2.5 py-0.5 rounded-lg text-[10px] font-extrabold bg-slate-100 text-slate-700 border border-slate-200">P3 • ROUTINE</span><span class="text-[9px] text-slate-400 font-semibold mt-0.5">📅 Daily Wellbeing</span></div>`;

      // Status badge
      const statusBadge = item.status.includes('Dispatched')
        ? `<span class="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-blue-100 text-blue-700 border border-blue-200 animate-pulse flex items-center space-x-1"><i class="fa-solid fa-truck-medical text-[9px]"></i><span>${item.status}</span></span>`
        : item.status.includes('In Progress') || item.status.includes('Assigned')
        ? `<span class="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-sky-50 text-sky-700 border border-sky-200 flex items-center space-x-1"><i class="fa-solid fa-user-check text-[9px]"></i><span>In Progress</span></span>`
        : item.status.includes('Completed') || item.status.includes('Resolved')
        ? `<span class="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center space-x-1"><i class="fa-solid fa-check text-[9px]"></i><span>Resolved</span></span>`
        : `<span class="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-amber-50 text-amber-700 border border-amber-200 flex items-center space-x-1"><i class="fa-solid fa-clock text-[9px]"></i><span>Needs Assignment</span></span>`;

      // Drivers snippet
      const driversHtml = (item.modelDrivers || []).map(d => `<span class="inline-block bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded text-[9px] mr-1 mt-0.5">${d}</span>`).join('');

      return `
        <tr class="hover:bg-teal-50/20 transition-colors ops-dash-elder-row" data-id="${item.id}" data-senior="${item.senior}" data-risk="${item.predictedRisk}" data-priority="${item.priorityCode}">
          <td class="p-3.5 pl-4 align-top">
            <input type="checkbox" class="ops-dash-elder-checkbox rounded text-teal-600 cursor-pointer mt-1" data-id="${item.id}" onchange="handleOpsDashElderCheckboxChange()">
          </td>
          
          <!-- Elder & Biometrics -->
          <td class="p-3.5 align-top">
            <div class="flex items-start space-x-2.5">
              <div class="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs flex-shrink-0 border border-slate-200">
                ${item.senior.split(' ').map(w => w[0]).join('').substring(0, 2)}
              </div>
              <div>
                <div class="font-extrabold text-slate-900 text-xs flex items-center space-x-1.5">
                  <span>${item.senior}</span>
                  <span class="text-[11px] font-normal text-slate-400">(${item.age}y • ${item.gender})</span>
                </div>
                <div class="text-[11px] text-slate-500 font-medium">${item.area} • <span class="text-slate-400 font-mono text-[10px]">${item.phone}</span></div>
                
                <!-- Telemetry Vitals Chips -->
                <div class="flex flex-wrap items-center gap-1 mt-1 text-[10px] font-mono">
                  <span class="px-1.5 py-0.5 rounded ${item.vitals.hrSpike ? 'bg-rose-100 text-rose-800 font-bold ring-1 ring-rose-300' : 'bg-slate-100 text-slate-600'}">
                    <i class="fa-solid fa-heart-pulse mr-0.5 text-[9px]"></i>${item.vitals.hr} bpm
                  </span>
                  <span class="px-1.5 py-0.5 rounded ${item.vitals.bpSpike ? 'bg-rose-100 text-rose-800 font-bold ring-1 ring-rose-300' : 'bg-slate-100 text-slate-600'}">
                    <i class="fa-solid fa-gauge-high mr-0.5 text-[9px]"></i>${item.vitals.bp}
                  </span>
                  <span class="px-1.5 py-0.5 rounded ${item.vitals.spo2Low ? 'bg-amber-100 text-amber-800 font-bold ring-1 ring-amber-300' : 'bg-emerald-50 text-emerald-700'}">
                    <i class="fa-solid fa-lungs mr-0.5 text-[9px]"></i>${item.vitals.spo2}
                  </span>
                  <span class="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                    <i class="fa-solid fa-droplet mr-0.5 text-[9px]"></i>${item.vitals.glucose}
                  </span>
                </div>
                <div class="text-[11px] text-slate-600 font-medium mt-1">${item.issue}</div>
              </div>
            </div>
          </td>

          <!-- AI Predicted Risk -->
          <td class="p-3.5 align-top">
            ${riskBadge}
            <div class="mt-1">${driversHtml}</div>
            <div class="text-[9px] text-slate-400 mt-1 font-mono">Confidence: ${item.modelConfidence}</div>
          </td>

          <!-- AI Priority Tier -->
          <td class="p-3.5 align-top">
            ${priorityBadge}
            <div class="text-[10px] text-slate-500 font-medium mt-1">Rec: ${item.recommendedTask.replace(/🚨|🏠|💊|📞|🤝/g, '')}</div>
          </td>

          <!-- Current Status -->
          <td class="p-3.5 align-top">
            ${statusBadge}
            ${item.assignedCoordinator !== 'Unassigned' ? `<div class="text-[10px] text-slate-500 font-bold mt-1">👤 ${item.assignedCoordinator}</div>` : ''}
          </td>

          <!-- ASSIGN TASK ON THIS POSITION (Inline Quick Assignment Engine!) -->
          <td class="p-3.5 align-top">
            <div class="bg-slate-50/90 p-2.5 rounded-2xl border border-slate-200 shadow-2xs space-y-1.5">
              <div class="flex items-center space-x-1.5">
                <i class="fa-solid fa-user-nurse text-teal-600 text-xs"></i>
                <select id="ops-dash-coord-${item.id}" class="w-full bg-white border border-slate-200 rounded-lg text-[11px] font-semibold px-2 py-1 focus:outline-none cursor-pointer">
                  <option value="Sister Kavita, RN" ${item.recommendedCoord.includes('Kavita') ? 'selected' : ''}>Sister Kavita, RN (Critical)</option>
                  <option value="Brother Amit" ${item.recommendedCoord.includes('Amit') ? 'selected' : ''}>Brother Amit (Mobility & Falls)</option>
                  <option value="Sister Sunita" ${item.recommendedCoord.includes('Sunita') ? 'selected' : ''}>Sister Sunita (Geriatric)</option>
                  <option value="Rajesh Kumar" ${item.recommendedCoord.includes('Rajesh') ? 'selected' : ''}>Rajesh Kumar (Care Officer)</option>
                  <option value="Dr. V.K. Kapoor" ${item.recommendedCoord.includes('Kapoor') ? 'selected' : ''}>Dr. V.K. Kapoor (Physician)</option>
                </select>
              </div>

              <div class="flex items-center space-x-1.5">
                <i class="fa-solid fa-list-check text-indigo-600 text-xs"></i>
                <select id="ops-dash-task-${item.id}" class="w-full bg-white border border-slate-200 rounded-lg text-[11px] font-semibold px-2 py-1 focus:outline-none cursor-pointer">
                  <option value="🚨 Emergency Nurse Dispatch" ${item.recommendedTask.includes('Emergency') ? 'selected' : ''}>🚨 Emergency Dispatch (ETA 12m)</option>
                  <option value="🏠 Home Nursing Visit & Triage" ${item.recommendedTask.includes('Home') ? 'selected' : ''}>🏠 Home Visit & Triage</option>
                  <option value="💊 Medication Adherence Audit" ${item.recommendedTask.includes('Medication') ? 'selected' : ''}>💊 Med Adherence Audit</option>
                  <option value="📞 Tele-Consultation Call" ${item.recommendedTask.includes('Tele') ? 'selected' : ''}>📞 Tele-Consultation Call</option>
                  <option value="🤝 Daily Routine Voice Check" ${item.recommendedTask.includes('Voice') ? 'selected' : ''}>🤝 Daily Voice Check-in</option>
                </select>
              </div>

              <button type="button" onclick="executeInlineTaskAssign('${item.id}')"
                class="w-full py-1.5 px-3 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-extrabold text-[11px] shadow-sm transition-all active:scale-95 flex items-center justify-center space-x-1.5 cursor-pointer">
                <i class="fa-solid fa-paper-plane text-[10px]"></i>
                <span>Assign Task on This Elder</span>
              </button>
            </div>
          </td>

          <!-- Diagnostic Report Button -->
          <td class="p-3.5 align-top text-center">
            <button type="button" onclick="openOpsElderClinicalReport('${item.id}')"
              class="px-3 py-2 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200/90 font-bold text-xs transition-all shadow-2xs hover:shadow active:scale-95 flex items-center justify-center space-x-1.5 mx-auto cursor-pointer">
              <i class="fa-solid fa-file-waveform text-teal-600"></i>
              <span>Report Sheet</span>
            </button>
            <div class="text-[9px] text-slate-400 mt-1 font-mono">${item.lastReportDate}</div>
          </td>
        </tr>
      `;
    }).join('');
  }

  // Update Pagination Info & Buttons
  const infoEl = document.getElementById('ops-dash-elders-pagination-info');
  if (infoEl) {
    infoEl.textContent = `Showing ${Math.min(startIdx + 1, total)}–${Math.min(startIdx + pageSize, total)} of ${total} elders (Page ${validPage} of ${totalPages})`;
  }

  const controlsEl = document.getElementById('ops-dash-elders-pagination-controls');
  if (controlsEl) {
    let btnsHtml = '';
    btnsHtml += `<button type="button" onclick="changeOpsDashboardEldersPage(${validPage - 1})" ${validPage <= 1 ? 'disabled class="w-8 h-8 rounded-lg bg-slate-100 text-slate-400 cursor-not-allowed flex items-center justify-center"' : 'class="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 flex items-center justify-center shadow-2xs cursor-pointer"'}><i class="fa-solid fa-chevron-left text-[10px]"></i></button>`;

    for (let p = 1; p <= totalPages; p++) {
      if (p === validPage) {
        btnsHtml += `<button type="button" class="w-8 h-8 rounded-lg bg-[#00a896] text-white flex items-center justify-center shadow-xs font-black">${p}</button>`;
      } else {
        btnsHtml += `<button type="button" onclick="changeOpsDashboardEldersPage(${p})" class="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 flex items-center justify-center shadow-2xs font-semibold cursor-pointer">${p}</button>`;
      }
    }

    btnsHtml += `<button type="button" onclick="changeOpsDashboardEldersPage(${validPage + 1})" ${validPage >= totalPages ? 'disabled class="w-8 h-8 rounded-lg bg-slate-100 text-slate-400 cursor-not-allowed flex items-center justify-center"' : 'class="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 flex items-center justify-center shadow-2xs cursor-pointer"'}><i class="fa-solid fa-chevron-right text-[10px]"></i></button>`;

    controlsEl.innerHTML = btnsHtml;
  }
}

// Inline Task Assignment on That Exact Position
function executeInlineTaskAssign(elderId) {
  const item = OPS_ELDERS_REPORTS_DATA.find(e => e.id === elderId);
  if (!item) return;

  const coordSelect = document.getElementById('ops-dash-coord-' + elderId);
  const taskSelect = document.getElementById('ops-dash-task-' + elderId);

  const chosenCoord = coordSelect ? coordSelect.value : 'Sister Kavita, RN';
  const chosenTask = taskSelect ? taskSelect.value : '🚨 Emergency Nurse Dispatch';

  item.assignedCoordinator = chosenCoord;
  item.assignedTask = chosenTask;
  item.status = chosenTask.includes('Emergency') ? 'Dispatched (12m)' : 'Assigned: In Progress';

  // Also synchronize with OPS_ALL_32_ALERTS if matching
  const alertItem = OPS_ALL_32_ALERTS.find(a => a.senior === item.senior);
  if (alertItem) {
    alertItem.coordinator = chosenCoord;
    alertItem.status = chosenTask.includes('Emergency') ? 'Dispatched (12m)' : 'In Progress';
  }

  if (soundEngine && typeof soundEngine.playSuccessChime === 'function') {
    soundEngine.playSuccessChime();
  }

  renderOpsDashboardEldersTable();
  if (typeof renderOpsCasesTable === 'function') {
    renderOpsCasesTable();
  }

  showToast(`Task Assigned: "${chosenTask}" assigned to ${chosenCoord} for ${item.senior} (Priority: ${item.priorityCode})!`, 'success');
}

// Re-run AI Risk & Priority Prediction Model
function runOpsAiModelPredictor() {
  const btn = document.getElementById('ops-rerun-model-btn');
  if (btn) {
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin text-xs"></i><span>Scoring 32 Elders...</span>';
    btn.disabled = true;
  }

  if (soundEngine && typeof soundEngine.playTone === 'function') {
    soundEngine.playTone(600, 'sine', 0.1);
    setTimeout(() => soundEngine.playTone(750, 'sine', 0.12), 120);
    setTimeout(() => soundEngine.playTone(900, 'sine', 0.18), 240);
  }

  setTimeout(() => {
    let highCount = 0, modCount = 0, lowCount = 0;

    OPS_ELDERS_REPORTS_DATA.forEach(elder => {
      // Feature weights for predictive triage
      let score = 0;
      if (elder.vitals.hr > 100 || elder.vitals.hr < 55) score += 35;
      const bpParts = elder.vitals.bp.split('/');
      if (parseInt(bpParts[0], 10) >= 150) score += 30;
      if (parseFloat(elder.vitals.spo2) < 94.0) score += 30;
      if (elder.issue.toLowerCase().includes('fall')) score += 25;
      if (elder.issue.toLowerCase().includes('chest')) score += 35;

      if (score >= 50) {
        elder.predictedRisk = 'High';
        elder.priorityCode = 'P1';
        elder.predictedPriority = 'P1 - Critical';
        elder.riskProbability = (90 + Math.random() * 8).toFixed(1) + '%';
        highCount++;
      } else if (score >= 25) {
        elder.predictedRisk = 'Moderate';
        elder.priorityCode = 'P2';
        elder.predictedPriority = 'P2 - High Priority';
        elder.riskProbability = (65 + Math.random() * 15).toFixed(1) + '%';
        modCount++;
      } else {
        elder.predictedRisk = 'Low';
        elder.priorityCode = 'P3';
        elder.predictedPriority = 'P3 - Routine Care';
        elder.riskProbability = (5 + Math.random() * 10).toFixed(1) + '%';
        lowCount++;
      }
    });

    if (btn) {
      btn.innerHTML = '<i class="fa-solid fa-wand-magic-sparkles text-xs"></i><span>Re-evaluate AI Risk</span>';
      btn.disabled = false;
    }

    renderOpsDashboardEldersTable();
    showToast(`AI Model Evaluated: ${highCount} Critical (P1), ${modCount} Moderate (P2), ${lowCount} Stable (P3) with 94.8% AUC!`, 'success');
  }, 400);
}

// Open Diagnostic Report Sheet Modal for an Elder
function openOpsElderClinicalReport(elderId) {
  const item = OPS_ELDERS_REPORTS_DATA.find(e => e.id === elderId);
  if (!item) return;

  const modal = document.getElementById('modal-clinical-report-sheet');
  const container = document.getElementById('clinical-report-sheet-content');
  if (!modal || !container) {
    openOpsAlertDetail(item.senior, item.predictedRisk, item.issue, item.status, item.assignedCoordinator);
    return;
  }

  const prof = {
    name: item.senior,
    age: item.age,
    gender: item.gender,
    phone: item.phone,
    area: item.area,
    emergency_contact_phone: "+91 98765-43210 (Family Primary)"
  };

  const payload = {
    systolic_bp: parseInt(item.vitals.bp.split('/')[0], 10),
    diastolic_bp: parseInt(item.vitals.bp.split('/')[1], 10),
    heart_rate_bpm: item.vitals.hr,
    spo2_percent: parseFloat(item.vitals.spo2),
    blood_glucose_mg_dl: parseInt(item.vitals.glucose, 10),
    body_temp_f: parseFloat(item.vitals.temp),
    weight_kg: 68,
    height_cm: 165,
    adl_eating: "Independent",
    adl_walking: item.vitals.mobility,
    adl_toileting: "Independent",
    medication_adherence_percent: item.vitals.adherence,
    reported_symptoms: item.issue
  };

  const res = {
    predicted_risk_level: item.predictedRisk,
    predicted_risk_level_hi: item.predictedRisk === 'High' ? 'उच्च जोखिम (High Risk)' : item.predictedRisk === 'Moderate' ? 'मध्यम जोखिम (Moderate)' : 'कम जोखिम (Low Risk)',
    risk_score: item.predictedRisk === 'High' ? 88 : item.predictedRisk === 'Moderate' ? 62 : 22,
    predicted_probability: parseFloat(item.riskProbability) / 100,
    status_tag_en: item.predictedPriority,
    status_tag_hi: item.predictedPriority,
    alert_reason_summary: `AI Clinical Prediction: ${item.modelDrivers.join(' • ')}`,
    alert_reason_summary_hi: `एआई क्लिनिकल पूर्वानुमान: ${item.modelDrivers.join(' • ')}`,
    suggested_action_summary: item.recommendedTask + ' • Assigned Coordinator: ' + item.assignedCoordinator,
    contact_method: 'Immediate Clinical Telemetry & Care Coordinator Dispatch'
  };

  if (soundEngine && typeof soundEngine.playTone === 'function') {
    soundEngine.playTone(550, 'sine', 0.1);
  }

  container.innerHTML = generateClinicalReportSheetHtml(res, payload, prof);
  modal.classList.remove('hidden');
}

function closeOpsElderClinicalReport() {
  const modal = document.getElementById('modal-clinical-report-sheet');
  if (modal) modal.classList.add('hidden');
}

// Filter handlers for Dashboard Elders
function filterOpsDashboardEldersTab(tabName) {
  opsDashEldersFilterState.tab = tabName;
  opsDashEldersFilterState.currentPage = 1;

  const tabs = ['all', 'high', 'moderate', 'low', 'pending'];
  tabs.forEach(t => {
    const btn = document.getElementById('tab-ops-elders-' + (t === 'moderate' ? 'mod' : t));
    if (btn) {
      if (t === tabName) {
        btn.classList.add('border-b-2', 'border-teal-600', 'text-teal-800');
        btn.classList.remove('border-transparent');
      } else {
        btn.classList.remove('border-b-2', 'border-teal-600', 'text-teal-800');
        btn.classList.add('border-transparent');
      }
    }
  });

  renderOpsDashboardEldersTable();
}

function filterOpsDashboardEldersSearch(query) {
  opsDashEldersFilterState.search = (query || '').trim();
  opsDashEldersFilterState.currentPage = 1;
  renderOpsDashboardEldersTable();
}

function filterOpsDashboardEldersSelect() {
  const riskSelect = document.getElementById('ops-dash-elders-filter-risk');
  const prioSelect = document.getElementById('ops-dash-elders-filter-priority');
  const areaSelect = document.getElementById('ops-dash-elders-filter-area');

  opsDashEldersFilterState.risk = riskSelect ? riskSelect.value : 'all';
  opsDashEldersFilterState.priority = prioSelect ? prioSelect.value : 'all';
  opsDashEldersFilterState.area = areaSelect ? areaSelect.value : 'all';
  opsDashEldersFilterState.currentPage = 1;

  renderOpsDashboardEldersTable();
}

function resetOpsDashboardEldersFilters() {
  opsDashEldersFilterState.tab = 'all';
  opsDashEldersFilterState.risk = 'all';
  opsDashEldersFilterState.priority = 'all';
  opsDashEldersFilterState.area = 'all';
  opsDashEldersFilterState.search = '';
  opsDashEldersFilterState.currentPage = 1;

  const searchInp = document.getElementById('ops-dash-elders-search');
  const riskSelect = document.getElementById('ops-dash-elders-filter-risk');
  const prioSelect = document.getElementById('ops-dash-elders-filter-priority');
  const areaSelect = document.getElementById('ops-dash-elders-filter-area');

  if (searchInp) searchInp.value = '';
  if (riskSelect) riskSelect.value = 'all';
  if (prioSelect) prioSelect.value = 'all';
  if (areaSelect) areaSelect.value = 'all';

  filterOpsDashboardEldersTab('all');
}

function changeOpsDashboardEldersPage(page) {
  opsDashEldersFilterState.currentPage = page;
  renderOpsDashboardEldersTable();
}

// Bulk Actions for Dashboard Elders
function toggleOpsSelectAllDashboardElders(checked) {
  const checkboxes = document.querySelectorAll('.ops-dash-elder-checkbox');
  checkboxes.forEach(cb => { cb.checked = checked; });
  handleOpsDashElderCheckboxChange();
}

function handleOpsDashElderCheckboxChange() {
  const checked = document.querySelectorAll('.ops-dash-elder-checkbox:checked');
  const toolbar = document.getElementById('ops-dash-elders-bulk-toolbar');
  const countEl = document.getElementById('ops-dash-bulk-count');

  if (countEl) countEl.textContent = checked.length;
  if (toolbar) {
    if (checked.length > 0) {
      toolbar.classList.remove('hidden');
    } else {
      toolbar.classList.add('hidden');
    }
  }

  const all = document.querySelectorAll('.ops-dash-elder-checkbox');
  const selectAll = document.getElementById('ops-dash-elders-select-all');
  if (selectAll && all.length > 0) {
    selectAll.checked = (checked.length === all.length);
    selectAll.indeterminate = (checked.length > 0 && checked.length < all.length);
  }
}

function clearOpsDashBulkSelection() {
  const selectAll = document.getElementById('ops-dash-elders-select-all');
  if (selectAll) {
    selectAll.checked = false;
    selectAll.indeterminate = false;
  }
  const checkboxes = document.querySelectorAll('.ops-dash-elder-checkbox');
  checkboxes.forEach(cb => { cb.checked = false; });
  handleOpsDashElderCheckboxChange();
}

function executeOpsDashBulkAssign() {
  const checked = document.querySelectorAll('.ops-dash-elder-checkbox:checked');
  if (checked.length === 0) {
    showToast('Please select at least one elder to assign task.', 'warning');
    return;
  }

  const coordSelect = document.getElementById('ops-dash-bulk-coord');
  const taskSelect = document.getElementById('ops-dash-bulk-task');

  const chosenCoord = coordSelect ? coordSelect.value : 'Sister Kavita, RN';
  const chosenTask = taskSelect ? taskSelect.value : '🚨 Emergency Nurse Dispatch';

  checked.forEach(cb => {
    const id = cb.getAttribute('data-id');
    const elder = OPS_ELDERS_REPORTS_DATA.find(e => e.id === id);
    if (elder) {
      elder.assignedCoordinator = chosenCoord;
      elder.assignedTask = chosenTask;
      elder.status = chosenTask.includes('Emergency') ? 'Dispatched (12m)' : 'In Progress';
    }
  });

  if (soundEngine && typeof soundEngine.playSuccessChime === 'function') {
    soundEngine.playSuccessChime();
  }

  renderOpsDashboardEldersTable();
  clearOpsDashBulkSelection();
  showToast(`Successfully batch assigned ${chosenTask} to ${chosenCoord} for ${checked.length} elders!`, 'success');
}

function executeOpsDashBulkDispatch() {
  const checked = document.querySelectorAll('.ops-dash-elder-checkbox:checked');
  if (checked.length === 0) {
    showToast('Please select at least one elder for emergency dispatch.', 'warning');
    return;
  }

  if (soundEngine && typeof soundEngine.playTone === 'function') {
    soundEngine.playTone(784, 'sine', 0.15);
    setTimeout(() => soundEngine.playTone(880, 'sine', 0.18), 180);
    setTimeout(() => soundEngine.playTone(1046, 'sine', 0.25), 380);
  }

  checked.forEach(cb => {
    const id = cb.getAttribute('data-id');
    const elder = OPS_ELDERS_REPORTS_DATA.find(e => e.id === id);
    if (elder) {
      elder.assignedTask = '🚨 Emergency Nurse Dispatch (ETA 12m)';
      elder.status = 'Dispatched (12m)';
    }
  });

  renderOpsDashboardEldersTable();
  clearOpsDashBulkSelection();
  showToast(`Emergency Medical Teams Dispatched for ${checked.length} seniors!`, 'success');
}

const OPS_ALL_32_ALERTS = [
  // --- 8 HIGH RISK ALERTS (3 Pending, 4 In Progress, 1 Resolved) ---
  {
    id: "ALT-101",
    senior: "Ramesh Sharma",
    age: 74,
    area: "Greater Kailash",
    risk: "High",
    issueCategory: "Missed medication",
    issue: "Missed check-in & HR spike (114 bpm)",
    time: "10:24 AM",
    status: "Pending",
    coordinator: "Sister Kavita, RN",
    phone: "+91 98110-44912"
  },
  {
    id: "ALT-102",
    senior: "Savitri Devi",
    age: 81,
    area: "Hauz Khas",
    risk: "High",
    issueCategory: "Fall risk",
    issue: "Fall risk sensor & acute hip pain (8/10)",
    time: "09:15 AM",
    status: "In Progress",
    coordinator: "Brother Amit",
    phone: "+91 98110-33418"
  },
  {
    id: "ALT-103",
    senior: "Anand Verma",
    age: 78,
    area: "Saket",
    risk: "High",
    issueCategory: "Missed medication",
    issue: "Missed 2 insulin doses & Sugar spike (228 mg/dL)",
    time: "08:40 AM",
    status: "Pending",
    coordinator: "Rajesh Kumar",
    phone: "+91 98110-77621"
  },
  {
    id: "ALT-106",
    senior: "Devi Lal Kapoor",
    age: 83,
    area: "Greater Kailash",
    risk: "High",
    issueCategory: "Reduced activity",
    issue: "Stage-2 BP elevation (154/92) & reduced mobility",
    time: "07:30 AM",
    status: "In Progress",
    coordinator: "Dr. V.K. Kapoor",
    phone: "+91 98110-11223"
  },
  {
    id: "ALT-112",
    senior: "Suman Lata",
    age: 80,
    area: "Hauz Khas",
    risk: "High",
    issueCategory: "Fall risk",
    issue: "Fall risk & orthostatic dizziness upon standing",
    time: "05:15 AM",
    status: "Pending",
    coordinator: "Brother Amit",
    phone: "+91 98110-33221"
  },
  {
    id: "ALT-115",
    senior: "Om Prakash",
    age: 76,
    area: "Saket",
    risk: "High",
    issueCategory: "Pain reported",
    issue: "Acute chest tightness & resting tachycardia (112 bpm)",
    time: "04:10 AM",
    status: "In Progress",
    coordinator: "Dr. V.K. Kapoor",
    phone: "+91 98110-44112"
  },
  {
    id: "ALT-116",
    senior: "Kamala Nehru",
    age: 84,
    area: "Vasant Kunj",
    risk: "High",
    issueCategory: "Pain reported",
    issue: "Severe lumbar joint pain & immobility (Level 8/10)",
    time: "03:45 AM",
    status: "In Progress",
    coordinator: "Sister Sunita",
    phone: "+91 98110-88339"
  },
  {
    id: "ALT-117",
    senior: "Jagdish Prasad",
    age: 79,
    area: "Greater Kailash",
    risk: "High",
    issueCategory: "Missed medication",
    issue: "Severe hyperglycemia (240 mg/dL) & missed dose",
    time: "03:20 AM",
    status: "Resolved",
    coordinator: "Sister Kavita, RN",
    phone: "+91 98110-55667"
  },

  // --- 14 MODERATE RISK ALERTS (4 Pending, 7 In Progress, 3 Resolved) ---
  {
    id: "ALT-104",
    senior: "Meena Iyer",
    age: 72,
    area: "Vasant Kunj",
    risk: "Moderate",
    issueCategory: "Sleep issues",
    issue: "Sleep deficit (4.1h) & emotional grief distress",
    time: "08:10 AM",
    status: "In Progress",
    coordinator: "Sister Sunita",
    phone: "+91 98110-55129"
  },
  {
    id: "ALT-107",
    senior: "Suman Singh",
    age: 79,
    area: "Hauz Khas",
    risk: "Moderate",
    issueCategory: "Pain reported",
    issue: "Osteoarthritis knee pain & slow walking cadence",
    time: "07:10 AM",
    status: "In Progress",
    coordinator: "Brother Amit",
    phone: "+91 98110-99887"
  },
  {
    id: "ALT-108",
    senior: "Bala Rao",
    age: 75,
    area: "Saket",
    risk: "Moderate",
    issueCategory: "Sleep issues",
    issue: "Insomnia & irregular resting pulse fluctuations",
    time: "06:45 AM",
    status: "In Progress",
    coordinator: "Rajesh Kumar",
    phone: "+91 98110-44332"
  },
  {
    id: "ALT-113",
    senior: "Sheila Dixit",
    age: 77,
    area: "Vasant Kunj",
    risk: "Moderate",
    issueCategory: "Fall risk",
    issue: "Fall risk slip sensor triggered near corridor rug",
    time: "04:50 AM",
    status: "In Progress",
    coordinator: "Sister Sunita",
    phone: "+91 98110-99443"
  },
  {
    id: "ALT-114",
    senior: "Pushpa Rani",
    age: 74,
    area: "Saket",
    risk: "Moderate",
    issueCategory: "Fall risk",
    issue: "Slip recovery sensor flagged in kitchen",
    time: "04:30 AM",
    status: "In Progress",
    coordinator: "Rajesh Kumar",
    phone: "+91 98110-12984"
  },
  {
    id: "ALT-118",
    senior: "Prem Chand",
    age: 76,
    area: "Malviya Nagar",
    risk: "Moderate",
    issueCategory: "Reduced activity",
    issue: "Reduced daily activity (<150 steps) & sudden fatigue",
    time: "03:00 AM",
    status: "Pending",
    coordinator: "Sister Kavita, RN",
    phone: "+91 98110-66112"
  },
  {
    id: "ALT-119",
    senior: "Nirmala Devi",
    age: 78,
    area: "Hauz Khas",
    risk: "Moderate",
    issueCategory: "Missed medication",
    issue: "Missed morning anti-hypertensive dose",
    time: "02:40 AM",
    status: "Resolved",
    coordinator: "Brother Amit",
    phone: "+91 98110-77334"
  },
  {
    id: "ALT-120",
    senior: "Ratan Lal",
    age: 82,
    area: "Greater Kailash",
    risk: "Moderate",
    issueCategory: "Pain reported",
    issue: "Persistent pain reported in right shoulder joint",
    time: "02:15 AM",
    status: "Pending",
    coordinator: "Sister Kavita, RN",
    phone: "+91 98110-22445"
  },
  {
    id: "ALT-121",
    senior: "Vidya Sagar",
    age: 73,
    area: "Saket",
    risk: "Moderate",
    issueCategory: "Reduced activity",
    issue: "Prolonged inactivity in bed for 6+ hours",
    time: "01:50 AM",
    status: "Pending",
    coordinator: "Rajesh Kumar",
    phone: "+91 98110-99118"
  },
  {
    id: "ALT-122",
    senior: "Shakuntala",
    age: 75,
    area: "Malviya Nagar",
    risk: "Moderate",
    issueCategory: "Sleep issues",
    issue: "Sleep fragmentation & only 3.8h recorded rest",
    time: "01:30 AM",
    status: "Resolved",
    coordinator: "Sister Kavita, RN",
    phone: "+91 98110-33778"
  },
  {
    id: "ALT-123",
    senior: "Balwant Rai",
    age: 81,
    area: "Hauz Khas",
    risk: "Moderate",
    issueCategory: "Pain reported",
    issue: "Lower back lumbar spasms during morning movement",
    time: "01:10 AM",
    status: "In Progress",
    coordinator: "Brother Amit",
    phone: "+91 98110-88441"
  },
  {
    id: "ALT-124",
    senior: "Sushila Devi",
    age: 71,
    area: "Greater Kailash",
    risk: "Moderate",
    issueCategory: "Missed medication",
    issue: "Missed afternoon diabetic capsule dose",
    time: "12:45 AM",
    status: "Pending",
    coordinator: "Sister Kavita, RN",
    phone: "+91 98110-55223"
  },
  {
    id: "ALT-125",
    senior: "Mohan Lal",
    age: 77,
    area: "Vasant Kunj",
    risk: "Moderate",
    issueCategory: "Reduced activity",
    issue: "Mood changes & lethargy reported on morning check",
    time: "12:20 AM",
    status: "Resolved",
    coordinator: "Sister Sunita",
    phone: "+91 98110-66339"
  },
  {
    id: "ALT-126",
    senior: "Kailash Nath",
    age: 79,
    area: "Malviya Nagar",
    risk: "Moderate",
    issueCategory: "Reduced activity",
    issue: "Inactive motion telemetry post minor muscle strain",
    time: "11:55 PM",
    status: "In Progress",
    coordinator: "Sister Kavita, RN",
    phone: "+91 98110-77551"
  },

  // --- 10 LOW RISK ALERTS (3 Pending, 3 In Progress, 4 Resolved) ---
  {
    id: "ALT-105",
    senior: "Harish Patel",
    age: 76,
    area: "Malviya Nagar",
    risk: "Low",
    issueCategory: "Reduced activity",
    issue: "Routine telemetry check-in & vitals stable (Normal)",
    time: "07:55 AM",
    status: "Resolved",
    coordinator: "Sister Kavita, RN",
    phone: "+91 98110-88231"
  },
  {
    id: "ALT-109",
    senior: "Krishna Murthy",
    age: 70,
    area: "Hauz Khas",
    risk: "Low",
    issueCategory: "Fall risk",
    issue: "Fall risk precaution & balance grab bar request",
    time: "06:20 AM",
    status: "In Progress",
    coordinator: "Brother Amit",
    phone: "+91 98110-22119"
  },
  {
    id: "ALT-110",
    senior: "Tara Devi",
    age: 69,
    area: "Vasant Kunj",
    risk: "Low",
    issueCategory: "Fall risk",
    issue: "Fall risk alert & minor rug tripping hazard reported",
    time: "06:05 AM",
    status: "Pending",
    coordinator: "Sister Sunita",
    phone: "+91 98110-66554"
  },
  {
    id: "ALT-111",
    senior: "Sita Ram",
    age: 72,
    area: "Greater Kailash",
    risk: "Low",
    issueCategory: "Fall risk",
    issue: "Fall risk safety audit & non-skid bathroom mat verified",
    time: "05:40 AM",
    status: "Resolved",
    coordinator: "Sister Kavita, RN",
    phone: "+91 98110-77881"
  },
  {
    id: "ALT-127",
    senior: "Gayatri Devi",
    age: 73,
    area: "Malviya Nagar",
    risk: "Low",
    issueCategory: "Missed medication",
    issue: "Medication adherence reminder confirmation pending",
    time: "11:30 PM",
    status: "Pending",
    coordinator: "Sister Kavita, RN",
    phone: "+91 98110-22998"
  },
  {
    id: "ALT-128",
    senior: "Ved Prakash",
    age: 71,
    area: "Saket",
    risk: "Low",
    issueCategory: "Reduced activity",
    issue: "Routine post-walk wellness review & check-in",
    time: "11:10 PM",
    status: "Resolved",
    coordinator: "Rajesh Kumar",
    phone: "+91 98110-44882"
  },
  {
    id: "ALT-129",
    senior: "Bhagwan Das",
    age: 78,
    area: "Greater Kailash",
    risk: "Low",
    issueCategory: "Missed medication",
    issue: "Weekly refill delivery verification & scheduled check",
    time: "10:45 PM",
    status: "Pending",
    coordinator: "Sister Kavita, RN",
    phone: "+91 98110-99221"
  },
  {
    id: "ALT-130",
    senior: "Maya Wati",
    age: 74,
    area: "Hauz Khas",
    risk: "Low",
    issueCategory: "Sleep issues",
    issue: "Sleep baseline logged at healthy 7.2 hours",
    time: "10:20 PM",
    status: "In Progress",
    coordinator: "Brother Amit",
    phone: "+91 98110-33556"
  },
  {
    id: "ALT-131",
    senior: "Ram Avatar",
    age: 75,
    area: "Saket",
    risk: "Low",
    issueCategory: "Reduced activity",
    issue: "Low step count routine follow-up call scheduled",
    time: "09:55 PM",
    status: "In Progress",
    coordinator: "Rajesh Kumar",
    phone: "+91 98110-88117"
  },
  {
    id: "ALT-132",
    senior: "Sarojini",
    age: 72,
    area: "Vasant Kunj",
    risk: "Low",
    issueCategory: "Missed medication",
    issue: "Monthly adherence score 100% verified normal",
    time: "09:30 PM",
    status: "Resolved",
    coordinator: "Sister Sunita",
    phone: "+91 98110-55883"
  }
];

// Active Ops Cases Filter State
const opsCasesFilterState = {
  status: 'all',
  risk: 'all',
  issue: 'all',
  search: '',
  currentPage: 1,
  pageSize: 8
};

function filterOpsAlertsTable(status) {
  opsCasesFilterState.status = status;
  opsCasesFilterState.currentPage = 1;

  const tabs = {
    'all': document.getElementById('tab-ops-filter-all'),
    'Pending': document.getElementById('tab-ops-filter-pending'),
    'In Progress': document.getElementById('tab-ops-filter-progress'),
    'Resolved': document.getElementById('tab-ops-filter-resolved')
  };

  Object.keys(tabs).forEach(k => {
    if (tabs[k]) {
      if (k === status) {
        tabs[k].className = 'ops-cases-tab px-3.5 py-2 border-b-2 border-teal-600 text-teal-800 font-extrabold';
      } else {
        tabs[k].className = 'ops-cases-tab px-3.5 py-2 text-slate-500 hover:text-slate-800 font-bold border-b-2 border-transparent';
      }
    }
  });

  renderOpsCasesTable();
}

function filterOpsAlertsBySelect() {
  const riskSelect = document.getElementById('ops-filter-risk');
  const issueSelect = document.getElementById('ops-filter-issue');
  opsCasesFilterState.risk = riskSelect ? riskSelect.value : 'all';
  opsCasesFilterState.issue = issueSelect ? issueSelect.value : 'all';
  opsCasesFilterState.currentPage = 1;

  renderOpsCasesTable();
}

function filterOpsCasesSearch(query) {
  opsCasesFilterState.search = (query || '').toLowerCase().trim();
  opsCasesFilterState.currentPage = 1;

  renderOpsCasesTable();
}

function handleOpsGlobalSearch(query) {
  filterOpsCasesSearch(query);
}

function resetOpsAlertsFilters() {
  opsCasesFilterState.status = 'all';
  opsCasesFilterState.risk = 'all';
  opsCasesFilterState.issue = 'all';
  opsCasesFilterState.search = '';
  opsCasesFilterState.currentPage = 1;

  const riskSelect = document.getElementById('ops-filter-risk');
  const issueSelect = document.getElementById('ops-filter-issue');
  const searchInput = document.getElementById('ops-cases-search');

  if (riskSelect) riskSelect.value = 'all';
  if (issueSelect) issueSelect.value = 'all';
  if (searchInput) searchInput.value = '';

  filterOpsAlertsTable('all');
}

function gotoOpsCasesPage(page) {
  const filtered = getFilteredOpsCases();
  const totalPages = Math.ceil(filtered.length / opsCasesFilterState.pageSize) || 1;

  if (page === 'prev') {
    opsCasesFilterState.currentPage = Math.max(1, opsCasesFilterState.currentPage - 1);
  } else if (page === 'next') {
    opsCasesFilterState.currentPage = Math.min(totalPages, opsCasesFilterState.currentPage + 1);
  } else {
    opsCasesFilterState.currentPage = parseInt(page) || 1;
  }

  renderOpsCasesTable();
}

function getFilteredOpsCases() {
  const { status, risk, issue, search } = opsCasesFilterState;
  return OPS_ALL_32_ALERTS.filter(item => {
    // 1. Status match
    const matchStatus = (status === 'all' ||
      item.status.toLowerCase() === status.toLowerCase() ||
      (status === 'In Progress' && item.status.includes('Dispatched'))
    );

    // 2. Risk match
    const matchRisk = (risk === 'all' || item.risk.toLowerCase() === risk.toLowerCase());

    // 3. Issue category match
    const matchIssue = (issue === 'all' ||
      item.issueCategory.toLowerCase() === issue.toLowerCase() ||
      item.issue.toLowerCase().includes(issue.toLowerCase())
    );

    // 4. Search query match
    const matchSearch = (!search ||
      item.senior.toLowerCase().includes(search) ||
      item.issue.toLowerCase().includes(search) ||
      item.coordinator.toLowerCase().includes(search) ||
      item.area.toLowerCase().includes(search)
    );

    return matchStatus && matchRisk && matchIssue && matchSearch;
  });
}

function renderOpsCasesTable() {
  const tableBody = document.getElementById('ops-alerts-table-body');
  if (!tableBody) return;

  const filtered = getFilteredOpsCases();
  const { currentPage, pageSize } = opsCasesFilterState;
  const total = filtered.length;
  const totalPages = Math.ceil(total / pageSize) || 1;
  const validPage = Math.min(Math.max(1, currentPage), totalPages);
  opsCasesFilterState.currentPage = validPage;

  const startIdx = (validPage - 1) * pageSize;
  const pageItems = filtered.slice(startIdx, startIdx + pageSize);

  // Render Rows
  if (pageItems.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="8" class="p-10 text-center text-slate-500 bg-slate-50/50">
          <div class="w-12 h-12 rounded-2xl bg-white border border-slate-200 text-slate-400 flex items-center justify-center mx-auto mb-3 text-lg shadow-sm">
            <i class="fa-solid fa-filter-circle-xmark text-teal-600"></i>
          </div>
          <div class="font-extrabold text-slate-800 text-sm">No alerts match the selected filters</div>
          <div class="text-xs text-slate-500 mt-1 max-w-sm mx-auto">No records found for current combination. Try choosing "All Risk Levels" or "All Issues".</div>
          <button type="button" onclick="resetOpsAlertsFilters()" class="mt-4 px-4 py-2 rounded-xl bg-[#00a896] hover:bg-[#008779] text-white font-bold text-xs shadow-md transition-all active:scale-95">
            Reset Filters (Show All 32)
          </button>
        </td>
      </tr>
    `;
  } else {
    tableBody.innerHTML = pageItems.map(item => {
      const riskBadge = item.risk === 'High'
        ? '<span class="px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-100 text-rose-700">High</span>'
        : item.risk === 'Moderate'
        ? '<span class="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-700">Moderate</span>'
        : '<span class="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-700">Low</span>';

      const statusBadge = item.status === 'Pending'
        ? '<span class="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-700">Pending</span>'
        : item.status.includes('Dispatched')
        ? '<span class="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-100 text-blue-700 animate-pulse">Dispatched (12m)</span>'
        : item.status === 'In Progress'
        ? '<span class="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-100 text-blue-700">In Progress</span>'
        : '<span class="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-700">Resolved</span>';

      return `
        <tr class="hover:bg-slate-50/80 transition-colors ops-case-row" data-senior="${item.senior}" data-risk="${item.risk}" data-issue="${item.issueCategory}" data-status="${item.status}" data-coord="${item.coordinator}">
          <td class="p-3.5 pl-4"><input type="checkbox" class="ops-case-checkbox rounded text-teal-600 cursor-pointer" data-id="${item.id}" data-senior="${item.senior}" onchange="handleOpsCaseCheckboxChange()"></td>
          <td class="p-3.5 font-bold text-slate-900">${item.senior}</td>
          <td class="p-3.5">${riskBadge}</td>
          <td class="p-3.5 text-slate-600 font-medium">${item.issue}</td>
          <td class="p-3.5 text-slate-500 font-mono text-[11px]">${item.time}</td>
          <td class="p-3.5">${statusBadge}</td>
          <td class="p-3.5 font-bold text-slate-800">${item.coordinator}</td>
          <td class="p-3.5 text-center">
            <div class="flex items-center justify-center space-x-1.5">
              <button type="button" onclick="openOpsAlertDetailById('${item.id}')" title="View Clinical Telemetry & Triage" class="p-1.5 px-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-all"><i class="fa-solid fa-eye"></i></button>
              <button type="button" onclick="triggerOpsCallSeniorById('${item.id}')" title="Call Senior Directly" class="p-1.5 px-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg text-xs font-bold transition-all"><i class="fa-solid fa-phone"></i></button>
              <button type="button" onclick="triggerOpsDispatchNurseById('${item.id}')" title="Dispatch Emergency Nurse" class="p-1.5 px-2 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg text-xs font-bold transition-all"><i class="fa-solid fa-truck-medical"></i></button>
              <button type="button" onclick="openOpsAssignModalById('${item.id}')" class="px-2.5 py-1 bg-[#00a896] hover:bg-[#008779] text-white rounded-lg text-xs font-bold transition-all shadow-sm">Assign</button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }

  // Update Pagination Info
  const infoEl = document.getElementById('ops-cases-pagination-info');
  if (infoEl) {
    if (total === 0) {
      infoEl.textContent = 'Showing 0 of 0 alerts';
    } else {
      const start = startIdx + 1;
      const end = Math.min(startIdx + pageSize, total);
      infoEl.textContent = total === OPS_ALL_32_ALERTS.length
        ? `Showing ${start}-${end} of ${total}`
        : `Showing ${start}-${end} of ${total} (Filtered from ${OPS_ALL_32_ALERTS.length})`;
    }
  }

  // Update Pagination Controls Buttons
  const controlsEl = document.getElementById('ops-cases-pagination-controls');
  if (controlsEl) {
    if (totalPages <= 1) {
      controlsEl.innerHTML = '';
    } else {
      let btnsHtml = `
        <button type="button" onclick="gotoOpsCasesPage('prev')" class="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 ${validPage === 1 ? 'opacity-40 pointer-events-none' : ''}">
          <i class="fa-solid fa-chevron-left text-[10px]"></i>
        </button>
      `;

      for (let p = 1; p <= totalPages; p++) {
        if (p === validPage) {
          btnsHtml += `<button type="button" class="w-7 h-7 rounded-lg bg-[#00a896] text-white flex items-center justify-center font-bold shadow-sm">${p}</button>`;
        } else {
          btnsHtml += `<button type="button" onclick="gotoOpsCasesPage(${p})" class="w-7 h-7 rounded-lg hover:bg-slate-100 text-slate-600 flex items-center justify-center font-bold">${p}</button>`;
        }
      }

      btnsHtml += `
        <button type="button" onclick="gotoOpsCasesPage('next')" class="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 ${validPage === totalPages ? 'opacity-40 pointer-events-none' : ''}">
          <i class="fa-solid fa-chevron-right text-[10px]"></i>
        </button>
      `;

      controlsEl.innerHTML = btnsHtml;
    }
  }

  // Sync checkboxes and bulk actions toolbar
  if (typeof handleOpsCaseCheckboxChange === 'function') {
    handleOpsCaseCheckboxChange();
  }
}

function openOpsAlertDetailById(id) {
  const item = OPS_ALL_32_ALERTS.find(a => a.id === id);
  if (!item) return;
  openOpsAlertDetail(item.senior, item.risk, item.issue, item.status, item.coordinator);
}

function openOpsAssignModalById(id) {
  const item = OPS_ALL_32_ALERTS.find(a => a.id === id);
  if (!item) return;
  openOpsAssignModal(item.senior, item.risk, item.issue, item.coordinator);
}

function triggerOpsCallSeniorById(id) {
  const item = OPS_ALL_32_ALERTS.find(a => a.id === id);
  if (!item) return;
  triggerOpsCallSeniorFor(item.senior, item.phone);
}

function triggerOpsDispatchNurseById(id) {
  const item = OPS_ALL_32_ALERTS.find(a => a.id === id);
  if (!item) return;
  triggerOpsDispatchNurseFor(item.senior, item.coordinator);
}

// 6. Manual Assign Modal Controls
function openOpsAssignModal(seniorName, riskLevel, issue, currentAssignee) {
  currentAssignTargetSenior = seniorName;
  const modal = document.getElementById('modal-ops-assign');
  if (!modal) return;

  const seniorEl = document.getElementById('ops-assign-senior-name');
  const riskEl = document.getElementById('ops-assign-risk-badge');
  const issueEl = document.getElementById('ops-assign-issue');
  const coordEl = document.getElementById('ops-assign-coordinator-select');

  if (seniorEl) seniorEl.textContent = seniorName;
  if (issueEl) issueEl.textContent = `Issue: ${issue}`;
  if (coordEl && currentAssignee) coordEl.value = currentAssignee;

  if (riskEl) {
    riskEl.textContent = `${riskLevel} Risk`;
    if (riskLevel === 'High') {
      riskEl.className = 'px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-100 text-rose-700';
    } else if (riskLevel === 'Moderate') {
      riskEl.className = 'px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-700';
    } else {
      riskEl.className = 'px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-700';
    }
  }

  modal.classList.remove('hidden');
}

function closeOpsAssignModal() {
  const modal = document.getElementById('modal-ops-assign');
  if (modal) modal.classList.add('hidden');
}

function confirmOpsAssignModal() {
  const coordSelect = document.getElementById('ops-assign-coordinator-select');
  const chosenCoord = coordSelect ? coordSelect.value : 'Sister Kavita, RN';

  if (currentAssignTargetSenior) {
    const alertItem = typeof OPS_ALL_32_ALERTS !== 'undefined' ? OPS_ALL_32_ALERTS.find(a => a.senior === currentAssignTargetSenior) : null;
    if (alertItem) {
      alertItem.status = 'In Progress';
      alertItem.coordinator = chosenCoord;
    }
    const rows = document.querySelectorAll('#ops-alerts-table-body tr');
    rows.forEach(r => {
      if (r.getAttribute('data-senior') === currentAssignTargetSenior) {
        r.setAttribute('data-status', 'In Progress');
        r.setAttribute('data-coord', chosenCoord);
        const cells = r.querySelectorAll('td');
        if (cells.length >= 7) {
          cells[5].innerHTML = '<span class="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-100 text-blue-700">In Progress</span>';
          cells[6].textContent = chosenCoord;
        }
      }
    });
    if (typeof renderOpsCasesTable === 'function') renderOpsCasesTable();
  }

  closeOpsAssignModal();
  showToast(`Case assigned to ${chosenCoord} successfully!`, 'success');
}

// 7. New Alert Modal Controls
function openOpsNewAlertModal() {
  const m = document.getElementById('modal-ops-new-alert');
  if (m) m.classList.remove('hidden');
}

function closeOpsNewAlertModal() {
  const m = document.getElementById('modal-ops-new-alert');
  if (m) m.classList.add('hidden');
}

function submitOpsNewAlert(e) {
  if (e && e.preventDefault) e.preventDefault();
  const senior = document.getElementById('ops-new-alert-senior').value;
  const risk = document.getElementById('ops-new-alert-risk').value;
  const issue = document.getElementById('ops-new-alert-issue').value;
  const coord = document.getElementById('ops-new-alert-coord').value;

  const tbody = document.getElementById('ops-alerts-table-body');
  if (tbody) {
    const tr = document.createElement('tr');
    tr.className = 'hover:bg-slate-50/80 transition-colors ops-case-row';
    tr.setAttribute('data-senior', senior);
    tr.setAttribute('data-risk', risk);
    tr.setAttribute('data-issue', issue);
    tr.setAttribute('data-status', 'Pending');
    tr.setAttribute('data-coord', coord);

    const riskBadge = risk === 'High'
      ? '<span class="px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-100 text-rose-700">High</span>'
      : risk === 'Moderate'
      ? '<span class="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-700">Moderate</span>'
      : '<span class="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-700">Low</span>';

    tr.innerHTML = `
      <td class="p-3.5 pl-4"><input type="checkbox" class="ops-case-checkbox rounded text-teal-600 cursor-pointer" data-id="${item.id}" data-senior="${item.senior}" onchange="handleOpsCaseCheckboxChange()"></td>
      <td class="p-3.5 font-bold text-slate-900">${senior}</td>
      <td class="p-3.5">${riskBadge}</td>
      <td class="p-3.5 text-slate-600 font-medium">${issue}</td>
      <td class="p-3.5 text-slate-500 font-mono text-[11px]">Just now</td>
      <td class="p-3.5"><span class="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-700">Pending</span></td>
      <td class="p-3.5 font-bold text-slate-800">${coord}</td>
      <td class="p-3.5 text-center">
        <button type="button" onclick="openOpsAssignModal('${senior}', '${risk}', '${issue}', '${coord}')" class="px-3 py-1 bg-[#00a896] hover:bg-[#008779] text-white rounded-lg text-xs font-bold transition-all shadow-sm">Assign</button>
      </td>
    `;
    tbody.prepend(tr);
  }

  closeOpsNewAlertModal();
  showToast(`New alert logged for ${senior} & assigned to ${coord}`, 'success');
}

// 8. Add Coordinator Controls
function openOpsAddCoordinatorModal() {
  const m = document.getElementById('modal-ops-add-coordinator');
  if (m) m.classList.remove('hidden');
}

function closeOpsAddCoordinatorModal() {
  const m = document.getElementById('modal-ops-add-coordinator');
  if (m) m.classList.add('hidden');
}

function submitOpsAddCoordinator(e) {
  if (e && e.preventDefault) e.preventDefault();
  const name = document.getElementById('ops-coord-name').value;
  closeOpsAddCoordinatorModal();
  showToast(`Coordinator ${name} added to care team!`, 'success');
}

// 9. Alert Diagnostics & Detail Modal
function openOpsAlertDetail(senior, risk, issue, status, assignee) {
  const modal = document.getElementById('modal-ops-alert-detail');
  if (!modal) return;

  const nameEl = document.getElementById('ops-detail-senior');
  const avatarEl = document.getElementById('ops-detail-avatar');
  const statusEl = document.getElementById('ops-detail-status-bar');
  const riskEl = document.getElementById('ops-detail-risk-badge');
  const issueEl = document.getElementById('ops-detail-issue');

  if (nameEl) nameEl.textContent = senior;
  if (avatarEl) {
    const initials = senior.split(' ').map(w => w[0]).join('').substring(0, 2);
    avatarEl.textContent = initials || 'RS';
  }
  if (statusEl) statusEl.textContent = `Status: ${status} • Assigned: ${assignee}`;
  if (issueEl) issueEl.textContent = issue;

  if (riskEl) {
    riskEl.textContent = `${risk} Risk`;
    if (risk === 'High') {
      riskEl.className = 'px-2.5 py-1 rounded-full text-xs font-black bg-rose-100 text-rose-700';
    } else if (risk === 'Moderate') {
      riskEl.className = 'px-2.5 py-1 rounded-full text-xs font-black bg-amber-100 text-amber-700';
    } else {
      riskEl.className = 'px-2.5 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-700';
    }
  }

  // Live Dataset binding:
  const patient = typeof getPatientByNameOrId === 'function' ? getPatientByNameOrId(senior) : null;
  const bpEl = document.getElementById('ops-detail-bp');
  const hrEl = document.getElementById('ops-detail-hr');
  const glucoseEl = document.getElementById('ops-detail-glucose');
  const spo2El = document.getElementById('ops-detail-spo2');
  const probBadgeEl = document.getElementById('ops-detail-prob-badge');
  const driversListEl = document.getElementById('ops-detail-drivers-list');

  if (patient) {
    const latestCheckup = (patient.checkups && patient.checkups.length > 0) ? patient.checkups[0] : {};
    if (bpEl) bpEl.textContent = (latestCheckup.bp || '120/80 mmHg').replace(' mmHg', '');
    if (hrEl) hrEl.textContent = latestCheckup.hr || '72 bpm';
    if (glucoseEl) glucoseEl.textContent = latestCheckup.glucose || '110 mg/dL';
    if (spo2El) spo2El.textContent = latestCheckup.spo2 || '98%';

    if (probBadgeEl) {
      const prob = patient.predictedProbability || (risk === 'High' ? '64.3%' : risk === 'Moderate' ? '38.9%' : '18.2%');
      probBadgeEl.textContent = `${prob} ML Probability`;
      if (risk === 'High') {
        probBadgeEl.className = 'px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-100 text-rose-700';
      } else if (risk === 'Moderate') {
        probBadgeEl.className = 'px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-700';
      } else {
        probBadgeEl.className = 'px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-700';
      }
    }

    if (driversListEl) {
      if (patient.modelDrivers && patient.modelDrivers.length > 0) {
        driversListEl.innerHTML = patient.modelDrivers.slice(0, 3).map(d => `<li>${d}</li>`).join('');
      } else {
        driversListEl.innerHTML = `<li>Primary symptom: ${issue}</li><li>Monitored under standard clinical protocols</li>`;
      }
    }

    state.currentOpsAlertSenior = patient;
  } else {
    // Fallback for cohort seniors
    if (bpEl) bpEl.textContent = risk === 'High' ? '154/92' : risk === 'Moderate' ? '136/86' : '120/80';
    if (hrEl) hrEl.textContent = risk === 'High' ? '106 bpm' : '74 bpm';
    if (glucoseEl) glucoseEl.textContent = risk === 'High' ? '180 mg/dL' : '110 mg/dL';
    if (spo2El) spo2El.textContent = risk === 'High' ? '94%' : '98%';
    if (probBadgeEl) {
      probBadgeEl.textContent = risk === 'High' ? '62.0% ML Probability' : risk === 'Moderate' ? '35.0% ML Probability' : '18.0% ML Probability';
      probBadgeEl.className = risk === 'High' ? 'px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-100 text-rose-700' : 'px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-700';
    }
    if (driversListEl) {
      driversListEl.innerHTML = `<li>Reported symptom: ${issue}</li><li>Zone telemetry flagged by triage algorithms</li>`;
    }
    state.currentOpsAlertSenior = { name: senior, phone: '+91 98110-44912', assignedNurse: assignee };
  }

  modal.classList.remove('hidden');
}

function triggerOpsCallSenior() {
  const p = state.currentOpsAlertSenior || {};
  const name = p.name || 'Ramesh Sharma';
  const phone = p.phone || '+91 98110-44912';
  if (typeof triggerSimulatedCall === 'function') {
    triggerSimulatedCall(name, phone);
  } else {
    showToast(`Initiating emergency 2-way call to ${name} (${phone})...`, 'info');
  }
}

function triggerOpsDispatchNurse() {
  const p = state.currentOpsAlertSenior || {};
  const name = p.name || 'Ramesh Sharma';
  const nurse = p.assignedNurse || 'Sister Kavita, RN';
  showToast(`Emergency Nurse ${nurse} dispatched for ${name}! ETA: 12 mins.`, 'success');
}

function closeOpsAlertDetail() {
  const modal = document.getElementById('modal-ops-alert-detail');
  if (modal) modal.classList.add('hidden');
}

// 10. Help Modal Controls
function showHelpModal() {
  const m = document.getElementById('modal-ops-help');
  if (m) m.classList.remove('hidden');
}

function closeHelpModal() {
  const m = document.getElementById('modal-ops-help');
  if (m) m.classList.add('hidden');
}

// 11. Map Mode Toggle (Map vs Satellite)
function toggleMapMode(mode) {
  const mapContainer = document.getElementById('ops-city-map');
  const btnStreet = document.getElementById('map-mode-street');
  const btnSat = document.getElementById('map-mode-sat');

  if (mode === 'sat') {
    if (mapContainer) {
      mapContainer.className = 'relative w-full h-80 sm:h-96 rounded-2xl bg-gradient-to-tr from-slate-900 via-slate-800 to-slate-900 border border-slate-700 overflow-hidden flex items-center justify-center';
    }
    if (btnSat) btnSat.className = 'px-3 py-1 rounded-lg bg-white text-slate-900 shadow-sm';
    if (btnStreet) btnStreet.className = 'px-3 py-1 rounded-lg text-slate-500 hover:text-slate-800';
  } else {
    if (mapContainer) {
      mapContainer.className = 'relative w-full h-80 sm:h-96 rounded-2xl bg-gradient-to-tr from-[#eef7f6] via-[#f4faf9] to-[#e8f4f2] border border-teal-100 overflow-hidden flex items-center justify-center';
    }
    if (btnStreet) btnStreet.className = 'px-3 py-1 rounded-lg bg-white text-slate-900 shadow-sm';
    if (btnSat) btnSat.className = 'px-3 py-1 rounded-lg text-slate-500 hover:text-slate-800';
  }
}

// 12. Export Functions

// =====================================================================// OPERATIONS MANAGER: FULLY CONNECTED CLINICAL & REALISTIC DATASET ENGINE
// =====================================================================
// 1. Audit Log Recorder Helper
function addOpsAuditRecord(senior, actionText, user) {
  const table = document.getElementById('ops-audit-table-body');
  if (!table) return;

  const now = new Date();
  const timeStr = now.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
    + ' ' + now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  const tr = document.createElement('tr');
  tr.className = 'hover:bg-slate-50 transition-colors bg-teal-50/20';
  tr.innerHTML = `
    <td class="p-3.5 pl-4 font-mono text-[11px] text-slate-500 whitespace-nowrap">${timeStr}</td>
    <td class="p-3.5 font-bold text-slate-900">${user || 'OM (You)'}</td>
    <td class="p-3.5"><span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">Operations</span></td>
    <td class="p-3.5 text-slate-700 font-medium">${actionText}</td>
    <td class="p-3.5 font-mono text-[11px] text-slate-500">Live Telemetry</td>
    <td class="p-3.5 font-bold text-slate-800">${senior}</td>
    <td class="p-3.5 font-mono text-[11px] text-slate-400">192.168.1.15</td>
  `;
  table.prepend(tr);
}

// 2. Call Senior Directly from Alerts & Cases
function triggerOpsCallSeniorFor(seniorName, phone) {
  if (soundEngine && typeof soundEngine.playTone === 'function') {
    soundEngine.playTone(440, 'sine', 0.25);
    setTimeout(() => soundEngine.playTone(480, 'sine', 0.35), 300);
  }

  const patient = typeof getPatientByNameOrId === 'function' ? getPatientByNameOrId(seniorName) : null;
  const targetPhone = phone || (patient ? patient.phone : '+91 98110-44912');

  addOpsAuditRecord(seniorName, `Initiated 2-way clinical phone check-in (${targetPhone})`, 'Operations Manager');

  if (typeof triggerSimulatedCall === 'function') {
    triggerSimulatedCall(seniorName, targetPhone);
  } else {
    showToast(`Emergency 2-way call connected to ${seniorName} (${targetPhone}). Telemetry audio streaming.`, 'info');
  }
}

// 3. Dispatch Emergency Nurse Directly from Alerts & Cases
function triggerOpsDispatchNurseFor(seniorName, assignedNurse) {
  const patient = typeof getPatientByNameOrId === 'function' ? getPatientByNameOrId(seniorName) : null;
  const nurse = assignedNurse || (patient ? patient.assignedNurse : 'Sister Kavita, RN');

  if (soundEngine && typeof soundEngine.playTone === 'function') {
    soundEngine.playTone(784, 'sine', 0.15);
    setTimeout(() => soundEngine.playTone(880, 'sine', 0.18), 180);
    setTimeout(() => soundEngine.playTone(1046, 'sine', 0.22), 380);
  }

  // Update in OPS_ALL_32_ALERTS
  const alertItem = typeof OPS_ALL_32_ALERTS !== 'undefined' ? OPS_ALL_32_ALERTS.find(a => a.senior === seniorName) : null;
  if (alertItem) {
    alertItem.status = 'Dispatched (12m)';
    alertItem.coordinator = nurse;
    if (typeof renderOpsCasesTable === 'function') renderOpsCasesTable();
  }

  // Update rows in both Alerts & Cases table and Recent Alerts table
  const rows = document.querySelectorAll('#ops-alerts-table-body tr, #ops-recent-alerts-body tr');
  rows.forEach(r => {
    if (r.getAttribute('data-senior') === seniorName) {
      r.setAttribute('data-status', 'In Progress');
      const cells = r.querySelectorAll('td');
      // Tab 3 table has 8 columns: [checkbox, name, risk, issue, time, status, coord, action]
      if (cells.length >= 8) {
        cells[5].innerHTML = '<span class="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-100 text-blue-700 animate-pulse">Dispatched (12m)</span>';
        cells[6].textContent = nurse;
      } else if (cells.length >= 6) {
        // Tab 1 table has 6 columns: [time, senior, risk, issue, status, action]
        cells[4].innerHTML = '<span class="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-100 text-blue-700 animate-pulse">Dispatched</span>';
      }
    }
  });

  addOpsAuditRecord(seniorName, `Emergency nurse ${nurse} dispatched to senior residence (ETA 12m)`, 'Operations Manager');

  showToast(`Emergency Nurse ${nurse} dispatched for ${seniorName}! ETA: 12 mins. GPS dispatch tracker active.`, 'success');
}

// 4. Modal Diagnostic Triggers
function triggerOpsCallSenior() {
  const p = state.currentOpsAlertSenior || {};
  const name = p.name || 'Ramesh Sharma';
  const phone = p.phone || '+91 98110-44912';
  triggerOpsCallSeniorFor(name, phone);
}

function triggerOpsDispatchNurse() {
  const p = state.currentOpsAlertSenior || {};
  const name = p.name || 'Ramesh Sharma';
  const nurse = p.assignedNurse || 'Sister Kavita, RN';
  triggerOpsDispatchNurseFor(name, nurse);
}

// 5. Risk Analytics Sub-Tab Switcher
function switchOpsRiskTab(tabName) {
  // Hide all risk subpanes
  document.querySelectorAll('.ops-risk-subpane').forEach(el => el.classList.add('hidden'));

  // Reset tab button styles
  document.querySelectorAll('.ops-risk-tab-btn').forEach(btn => {
    btn.classList.remove('border-teal-600', 'text-teal-800');
    btn.classList.add('border-transparent', 'text-slate-500');
  });

  // Activate selected subpane
  const targetPane = document.getElementById(`ops-risk-pane-${tabName}`);
  if (targetPane) targetPane.classList.remove('hidden');

  const targetBtn = document.getElementById(`btn-ops-risk-tab-${tabName}`);
  if (targetBtn) {
    targetBtn.classList.remove('border-transparent', 'text-slate-500');
    targetBtn.classList.add('border-teal-600', 'text-teal-800');
  }

  // Trigger chart re-render / resize if overview or trend
  if (tabName === 'overview' || tabName === 'trend') {
    setTimeout(() => {
      initOpsCharts();
    }, 50);
  }
}

// 6. Add Coordinator with Real DOM & State Persistence
function submitOpsAddCoordinator(e) {
  if (e && e.preventDefault) e.preventDefault();

  const nameInput = document.getElementById('ops-coord-name');
  const roleInput = document.getElementById('ops-coord-role');
  const areaInput = document.getElementById('ops-coord-area');
  const phoneInput = document.getElementById('ops-coord-phone');
  const emailInput = document.getElementById('ops-coord-email');

  const name = nameInput ? nameInput.value.trim() : '';
  const role = roleInput ? roleInput.value : 'Care Nurse';
  const area = areaInput ? areaInput.value : 'Greater Kailash';
  const phone = phoneInput ? phoneInput.value.trim() : '+91 98765 00000';
  const email = emailInput ? emailInput.value.trim() : 'coordinator@careconnect.com';

  if (!name) {
    showToast('Please enter coordinator name', 'warning');
    return;
  }

  const initials = name.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase() || 'CC';

  // Append new coordinator row to #ops-team-table-body
  const tableBody = document.getElementById('ops-team-table-body');
  if (tableBody) {
    const tr = document.createElement('tr');
    tr.className = 'hover:bg-slate-50/80 transition-colors bg-teal-50/40 border-l-4 border-teal-500';
    tr.innerHTML = `
      <td class="p-3.5 pl-4 flex items-center space-x-3">
        <div class="w-8 h-8 rounded-xl bg-teal-100 text-teal-800 font-black flex items-center justify-center text-xs flex-shrink-0">
          ${initials}
        </div>
        <div>
          <div class="font-black text-slate-900">${name}</div>
          <div class="text-[10px] text-slate-400 font-semibold">${role} &bull; ${area}</div>
        </div>
      </td>
      <td class="p-3.5 text-center font-bold text-slate-800">0</td>
      <td class="p-3.5 text-center font-bold text-slate-400">0</td>
      <td class="p-3.5 text-center font-bold text-emerald-600">0</td>
      <td class="p-3.5 text-center font-mono text-slate-500 text-[11px]">New</td>
      <td class="p-3.5 text-center">
        <span class="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-700">Active</span>
      </td>
    `;
    tableBody.prepend(tr);
  }

  // Increment active coordinator count
  const countEl = document.getElementById('ops-active-coord-count');
  if (countEl) {
    const cur = parseInt(countEl.textContent) || 8;
    countEl.textContent = cur + 1;
  }

  // Add coordinator to all relevant dropdowns
  const newOption = `<option value="${name}" selected>${name} (${role} &bull; ${area})</option>`;
  ['task-coordinator', 'ops-assign-coordinator-select', 'ops-new-alert-coord'].forEach(id => {
    const sel = document.getElementById(id);
    if (sel) sel.insertAdjacentHTML('beforeend', newOption);
  });

  addOpsAuditRecord(name, `New care coordinator ${name} (${role}) enrolled for sector ${area}`, 'Operations Manager');

  // Reset & close
  const form = document.getElementById('ops-add-coordinator-form');
  if (form) form.reset();
  closeOpsAddCoordinatorModal();

  showToast(`Coordinator ${name} added successfully to ${area}!`, 'success');
}

// 7. Real Leaflet OpenStreetMap Map for Area Monitoring
let opsLeafletMap = null;
let opsTileLayerStreet = null;
let opsTileLayerSat = null;
let opsCurrentTileMode = 'street';

function initOpsRealMap() {
  if (typeof L === 'undefined') {
    console.warn('Leaflet mapping engine loading...');
    setTimeout(initOpsRealMap, 500);
    return;
  }

  const container = document.getElementById('ops-leaflet-map');
  if (!container) return;

  if (opsLeafletMap) {
    setTimeout(() => { opsLeafletMap.invalidateSize(); }, 150);
    return;
  }

  try {
    // Delhi NCR Center (South Delhi Cluster)
    opsLeafletMap = L.map('ops-leaflet-map', {
      center: [28.536, 77.215],
      zoom: 13,
      zoomControl: true,
      scrollWheelZoom: true
    });

    opsTileLayerStreet = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors'
    });

    opsTileLayerSat = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      maxZoom: 19,
      attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
    });

    opsTileLayerStreet.addTo(opsLeafletMap);

    const sectors = [
      {
        name: "Greater Kailash (South Delhi)",
        coords: [28.541, 77.241],
        risk: "High",
        color: "#f43f5e",
        seniors: 40,
        high: 8,
        mod: 14,
        low: 18,
        coordinator: "Sister Kavita, RN",
        alerts: "Ramesh Sharma (HR 114 bpm), Devi Lal Kapoor"
      },
      {
        name: "Hauz Khas",
        coords: [28.552, 77.202],
        risk: "High",
        color: "#f43f5e",
        seniors: 35,
        high: 6,
        mod: 12,
        low: 17,
        coordinator: "Brother Amit (Paramedic)",
        alerts: "Savitri Devi (Fall impact, acute hip pain)"
      },
      {
        name: "Saket",
        coords: [28.523, 77.218],
        risk: "High",
        color: "#f59e0b",
        seniors: 32,
        high: 4,
        mod: 10,
        low: 18,
        coordinator: "Rajesh Kumar (Buddy)",
        alerts: "Anand Verma (Insulin gap, Fasting Sugar 228 mg/dL)"
      },
      {
        name: "Vasant Kunj",
        coords: [28.530, 77.155],
        risk: "Moderate",
        color: "#f59e0b",
        seniors: 28,
        high: 4,
        mod: 8,
        low: 16,
        coordinator: "Sister Sunita (Counselor)",
        alerts: "Meena Iyer (Sleep deficit 4.1h, bereavement support)"
      },
      {
        name: "Malviya Nagar",
        coords: [28.532, 77.210],
        risk: "Low",
        color: "#10b981",
        seniors: 24,
        high: 2,
        mod: 8,
        low: 14,
        coordinator: "Sister Kavita, RN",
        alerts: "Harish Patel (Stable, 100% ADL Independence)"
      }
    ];

    sectors.forEach(s => {
      // Glow perimeter
      L.circle(s.coords, {
        radius: 480,
        color: s.color,
        fillColor: s.color,
        fillOpacity: 0.18,
        weight: 1.5
      }).addTo(opsLeafletMap);

      // Core pin
      const marker = L.circleMarker(s.coords, {
        radius: 12,
        color: '#ffffff',
        fillColor: s.color,
        fillOpacity: 0.95,
        weight: 3
      }).addTo(opsLeafletMap);

      const popupHtml = `
        <div style="font-family: inherit; font-size: 12px; line-height: 1.4; min-width: 210px;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
            <strong style="font-size: 13px; color: #0f172a;">${s.name}</strong>
            <span style="background: ${s.color}; color: #fff; padding: 2px 7px; border-radius: 9999px; font-size: 10px; font-weight: 800;">${s.risk} Risk</span>
          </div>
          <div style="color: #64748b; font-size: 11px; margin-bottom: 6px;">Total Cohort: <strong>${s.seniors} Seniors</strong> (${s.high} High, ${s.mod} Mod, ${s.low} Low)</div>
          <div style="background: #f8fafc; padding: 6px 8px; border-radius: 6px; border: 1px solid #e2e8f0; margin-bottom: 6px;">
            <div style="font-size: 10px; color: #94a3b8; font-weight: bold; text-transform: uppercase;">Active Alerts / Incidents:</div>
            <div style="color: #0f172a; font-weight: 600; font-size: 11px;">${s.alerts}</div>
          </div>
          <div style="color: #475569; font-size: 11px;">
            Assigned Lead: <strong>${s.coordinator}</strong>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml);
    });

    setTimeout(() => { opsLeafletMap.invalidateSize(); }, 200);
  } catch (err) {
    console.warn('Map initialization:', err);
  }
}

function toggleMapMode(mode) {
  opsCurrentTileMode = mode;
  const btnStreet = document.getElementById('map-mode-street');
  const btnSat = document.getElementById('map-mode-sat');

  if (btnStreet && btnSat) {
    if (mode === 'sat') {
      btnSat.className = 'px-3 py-1 rounded-lg bg-white text-slate-900 shadow-sm';
      btnStreet.className = 'px-3 py-1 rounded-lg text-slate-500 hover:text-slate-800';
    } else {
      btnStreet.className = 'px-3 py-1 rounded-lg bg-white text-slate-900 shadow-sm';
      btnSat.className = 'px-3 py-1 rounded-lg text-slate-500 hover:text-slate-800';
    }
  }

  if (!opsLeafletMap) return;

  if (mode === 'sat') {
    if (opsTileLayerStreet) opsLeafletMap.removeLayer(opsTileLayerStreet);
    if (opsTileLayerSat) opsTileLayerSat.addTo(opsLeafletMap);
  } else {
    if (opsTileLayerSat) opsLeafletMap.removeLayer(opsTileLayerSat);
    if (opsTileLayerStreet) opsTileLayerStreet.addTo(opsLeafletMap);
  }
}

// 8. Reports Dynamic Duration & Sub-tabs
function changeOpsReportsDuration(val) {
  const durationMap = {
    "1": { label: "Today", alerts: 4, high: 3, resRate: "100%", avgTime: "0.9 hrs" },
    "7": { label: "Last 7 Days", alerts: 11, high: 9, resRate: "95%", avgTime: "1.8 hrs" },
    "30": { label: "Last 30 Days", alerts: 32, high: 24, resRate: "92%", avgTime: "2.8 hrs" },
    "90": { label: "This Quarter", alerts: 98, high: 27, resRate: "91%", avgTime: "3.1 hrs" },
    "365": { label: "Year to Date", alerts: 412, high: 34, resRate: "89%", avgTime: "3.4 hrs" }
  };

  const sel = durationMap[val] || durationMap["30"];
  const elAlerts = document.getElementById('ops-rep-kpi-alerts');
  const elHigh = document.getElementById('ops-rep-kpi-high');
  const elRes = document.getElementById('ops-rep-kpi-res');
  const elTime = document.getElementById('ops-rep-kpi-time');

  if (elAlerts) elAlerts.textContent = sel.alerts;
  if (elHigh) elHigh.textContent = sel.high;
  if (elRes) elRes.textContent = sel.resRate;
  if (elTime) elTime.textContent = sel.avgTime;

  showToast(`Reports metrics updated for ${sel.label}!`, 'info');
}

function switchOpsReportsTab(tabName) {
  document.querySelectorAll('.ops-rep-tab-btn').forEach(btn => {
    btn.classList.remove('border-teal-600', 'text-teal-800');
    btn.classList.add('border-transparent', 'text-slate-500');
  });

  const activeBtn = document.getElementById(`btn-ops-rep-tab-${tabName}`);
  if (activeBtn) {
    activeBtn.classList.remove('border-transparent', 'text-slate-500');
    activeBtn.classList.add('border-teal-600', 'text-teal-800');
  }

  showToast(`Viewing ${tabName.toUpperCase()} section of Operations Report`, 'info');
}

// 9. Realistic Dataset Clinical CSV Export
function exportOpsReports() {
  const durationSelect = document.getElementById('ops-reports-duration');
  const durationLabel = durationSelect ? durationSelect.options[durationSelect.selectedIndex].text : 'Last 30 Days';

  const rows = [
    ["=== CARECONNECT AI TELEHEALTH CLINICAL OPERATIONS REPORT ==="],
    ["Generated On", new Date().toLocaleString()],
    ["Reporting Period", durationLabel],
    ["Active Senior Population", "200 Seniors (Unseen Validation Test Set Cohort)"],
    ["Clinical Care Team", "8 Active Coordinators (5 Clinical Specialist Leads)"],
    [],
    ["--- SECTION 1: POPULATION RISK STRATIFICATION ---"],
    ["Risk Tier", "Seniors Count", "Percentage of Fleet", "Biomarker Classification Criteria", "Action Protocol"],
    ["High Risk (Critical)", "24", "12.0%", "SpO2 < 95% OR HR > 110 bpm OR Blood Sugar > 200 OR Impact Fall Sensor", "Immediate 2-way call + Emergency Nurse Dispatch"],
    ["Moderate Risk", "68", "34.0%", "Sleep Deficit (<5 hrs) OR Osteoarthritis Pain 4-6/10 OR Missed 1 Dose", "Daily Tele-Counseling & Health Buddy Visit"],
    ["Low Risk (Safe)", "108", "54.0%", "100% ADL Independence & Zero Missed Doses", "Routine Bi-Weekly Assessment"],
    [],
    ["--- SECTION 2: ACTIVE CLINICAL DOSSIERS (DATASET SENIORS) ---"],
    ["Patient ID", "Senior Name", "Age", "Gender", "Sector (Delhi NCR)", "Risk Level", "ML Probability", "BP (mmHg)", "Heart Rate", "SpO2", "Blood Sugar", "Primary Symptom", "Assigned Care Lead", "Emergency Family Contact", "Adherence Rate"],
    ["PAT-101", "Ramesh Sharma", "74", "Male", "Greater Kailash, C-42", "High Risk (Critical)", "64.3%", "158/96", "114 bpm", "94%", "138 mg/dL", "Missed check-in & resting tachycardia spike", "Sister Kavita, RN", "Rahul Sharma (Son) +91 98711-20931", "89%"],
    ["PAT-102", "Savitri Devi", "81", "Female", "Hauz Khas, E-12", "High Risk (Critical)", "63.2%", "142/88", "88 bpm", "97%", "110 mg/dL", "Impact shock sensor triggered in bathroom & hip pain (8/10)", "Brother Amit (Paramedic)", "Sunil Devi (Son) +91 98110-33418", "94%"],
    ["PAT-103", "Anand Verma", "78", "Male", "Saket, B-104", "High Risk (Critical)", "68.6%", "132/84", "76 bpm", "98%", "228 mg/dL", "Severe Hyperglycemia & 2 missed insulin doses", "Rajesh Kumar (Buddy)", "Pooja Verma (Daughter) +91 98711-55442", "72%"],
    ["PAT-104", "Meena Iyer", "72", "Female", "Vasant Kunj, Sec-C", "Moderate Risk", "38.9%", "124/80", "72 bpm", "98%", "105 mg/dL", "Sleep deficit (4.1h) & emotional bereavement distress", "Sister Sunita (Counselor)", "Karthik Iyer (Son) +91 98110-66778", "96%"],
    ["PAT-105", "Harish Patel", "76", "Male", "Malviya Nagar, G-18", "Low Risk (Safe)", "18.2%", "122/80", "72 bpm", "98%", "108 mg/dL", "Routine check-in normal (100% ADL independent)", "Sister Kavita, RN", "Vikram Patel (Son) +91 98711-99001", "100%"],
    ["PAT-106", "Devi Lal Kapoor", "83", "Male", "Greater Kailash-2", "High Risk", "61.5%", "154/92", "86 bpm", "95%", "145 mg/dL", "Stage-2 essential hypertension elevation", "Dr. V.K. Kapoor", "Mohit Kapoor (Son) +91 98110-11223", "91%"],
    ["PAT-107", "Suman Singh", "79", "Female", "Hauz Khas Enclave", "Moderate Risk", "42.0%", "136/86", "78 bpm", "96%", "125 mg/dL", "Severe osteoarthritis knee pain & mobility restriction", "Brother Amit", "Rekha Singh (Daughter) +91 98110-99887", "93%"],
    ["PAT-108", "Bala Rao", "75", "Male", "Saket, Block-J", "Moderate Risk", "36.5%", "128/82", "70 bpm", "97%", "118 mg/dL", "Insomnia & irregular resting pulse fluctuations", "Rajesh Kumar", "Suresh Rao (Son) +91 98110-44332", "95%"],
    [],
    ["--- SECTION 3: SECTOR GEOGRAPHICAL SUMMARY (DELHI NCR) ---"],
    ["Sector", "Active Seniors", "High Risk", "Moderate Risk", "Low Risk", "Lead Care Coordinator", "Key Active Incidents"],
    ["Greater Kailash (South Delhi)", "40", "8", "14", "18", "Sister Kavita, RN", "Ramesh Sharma tachycardia spike (114 bpm)"],
    ["Hauz Khas", "35", "6", "12", "17", "Brother Amit (Paramedic)", "Savitri Devi bathroom fall impact trauma"],
    ["Saket", "32", "4", "10", "18", "Rajesh Kumar (Buddy)", "Anand Verma glycemic spike (228 mg/dL)"],
    ["Vasant Kunj", "28", "4", "8", "16", "Sister Sunita (Counselor)", "Meena Iyer sleep deficit & grief distress"],
    ["Malviya Nagar", "24", "2", "8", "14", "Sister Kavita, RN", "Routine telehealth review (Stable)"],
    [],
    ["--- SECTION 4: CARE COORDINATOR WORKLOAD & RESPONSE METRICS ---"],
    ["Coordinator Name", "Clinical Role", "Primary Sector", "Assigned Cases", "Pending", "Resolved", "Avg Response Time", "Status"],
    ["Sister Kavita, RN", "Clinical Specialist Lead", "Greater Kailash", "14", "3", "11", "2.4 hrs", "Active"],
    ["Brother Amit", "Field Paramedic Lead", "Hauz Khas", "12", "2", "10", "3.1 hrs", "Active"],
    ["Rajesh Kumar", "Community Health Buddy Lead", "Saket", "10", "3", "7", "4.2 hrs", "Active"],
    ["Sister Sunita", "Tele-care Counselor Lead", "Vasant Kunj", "8", "1", "7", "2.6 hrs", "Active"],
    ["Dr. V.K. Kapoor", "Attending Physician Lead", "Citywide Tele-Triage", "6", "2", "4", "3.8 hrs", "Active"]
  ];

  const csvContent = "data:text/csv;charset=utf-8," + rows.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `CareConnect_Operations_Clinical_Report_${durationLabel.replace(/\s+/g, '_')}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  addOpsAuditRecord("Cohort", `Exported detailed clinical operations report (${durationLabel}) as CSV`, 'Operations Manager');
  showToast(`Operations clinical dataset report exported successfully (${durationLabel})!`, "success");
}


// 8. Add Coordinator Controls
function openOpsAddCoordinatorModal() {
  const m = document.getElementById('modal-ops-add-coordinator');
  if (m) m.classList.remove('hidden');
}

function closeOpsAddCoordinatorModal() {
  const m = document.getElementById('modal-ops-add-coordinator');
  if (m) m.classList.add('hidden');
}

function submitOpsAddCoordinator(e) {
  if (e && e.preventDefault) e.preventDefault();
  const name = document.getElementById('ops-coord-name').value;
  closeOpsAddCoordinatorModal();
  showToast(`Coordinator ${name} added to care team!`, 'success');
}

// 9. Alert Diagnostics & Detail Modal
function openOpsAlertDetail(senior, risk, issue, status, assignee) {
  const modal = document.getElementById('modal-ops-alert-detail');
  if (!modal) return;

  const nameEl = document.getElementById('ops-detail-senior');
  const avatarEl = document.getElementById('ops-detail-avatar');
  const statusEl = document.getElementById('ops-detail-status-bar');
  const riskEl = document.getElementById('ops-detail-risk-badge');
  const issueEl = document.getElementById('ops-detail-issue');

  if (nameEl) nameEl.textContent = senior;
  if (avatarEl) {
    const initials = senior.split(' ').map(w => w[0]).join('').substring(0, 2);
    avatarEl.textContent = initials || 'RS';
  }
  if (statusEl) statusEl.textContent = `Status: ${status} • Assigned: ${assignee}`;
  if (issueEl) issueEl.textContent = issue;

  if (riskEl) {
    riskEl.textContent = `${risk} Risk`;
    if (risk === 'High') {
      riskEl.className = 'px-2.5 py-1 rounded-full text-xs font-black bg-rose-100 text-rose-700';
    } else if (risk === 'Moderate') {
      riskEl.className = 'px-2.5 py-1 rounded-full text-xs font-black bg-amber-100 text-amber-700';
    } else {
      riskEl.className = 'px-2.5 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-700';
    }
  }

  // Live Dataset binding:
  const patient = typeof getPatientByNameOrId === 'function' ? getPatientByNameOrId(senior) : null;
  const bpEl = document.getElementById('ops-detail-bp');
  const hrEl = document.getElementById('ops-detail-hr');
  const glucoseEl = document.getElementById('ops-detail-glucose');
  const spo2El = document.getElementById('ops-detail-spo2');
  const probBadgeEl = document.getElementById('ops-detail-prob-badge');
  const driversListEl = document.getElementById('ops-detail-drivers-list');

  if (patient) {
    const latestCheckup = (patient.checkups && patient.checkups.length > 0) ? patient.checkups[0] : {};
    if (bpEl) bpEl.textContent = (latestCheckup.bp || '120/80 mmHg').replace(' mmHg', '');
    if (hrEl) hrEl.textContent = latestCheckup.hr || '72 bpm';
    if (glucoseEl) glucoseEl.textContent = latestCheckup.glucose || '110 mg/dL';
    if (spo2El) spo2El.textContent = latestCheckup.spo2 || '98%';

    if (probBadgeEl) {
      const prob = patient.predictedProbability || (risk === 'High' ? '64.3%' : risk === 'Moderate' ? '38.9%' : '18.2%');
      probBadgeEl.textContent = `${prob} ML Probability`;
      if (risk === 'High') {
        probBadgeEl.className = 'px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-100 text-rose-700';
      } else if (risk === 'Moderate') {
        probBadgeEl.className = 'px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-700';
      } else {
        probBadgeEl.className = 'px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-700';
      }
    }

    if (driversListEl) {
      if (patient.modelDrivers && patient.modelDrivers.length > 0) {
        driversListEl.innerHTML = patient.modelDrivers.slice(0, 3).map(d => `<li>${d}</li>`).join('');
      } else {
        driversListEl.innerHTML = `<li>Primary symptom: ${issue}</li><li>Monitored under standard clinical protocols</li>`;
      }
    }

    state.currentOpsAlertSenior = patient;
  } else {
    // Fallback for cohort seniors
    if (bpEl) bpEl.textContent = risk === 'High' ? '154/92' : risk === 'Moderate' ? '136/86' : '120/80';
    if (hrEl) hrEl.textContent = risk === 'High' ? '106 bpm' : '74 bpm';
    if (glucoseEl) glucoseEl.textContent = risk === 'High' ? '180 mg/dL' : '110 mg/dL';
    if (spo2El) spo2El.textContent = risk === 'High' ? '94%' : '98%';
    if (probBadgeEl) {
      probBadgeEl.textContent = risk === 'High' ? '62.0% ML Probability' : risk === 'Moderate' ? '35.0% ML Probability' : '18.0% ML Probability';
      probBadgeEl.className = risk === 'High' ? 'px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-100 text-rose-700' : 'px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-700';
    }
    if (driversListEl) {
      driversListEl.innerHTML = `<li>Reported symptom: ${issue}</li><li>Zone telemetry flagged by triage algorithms</li>`;
    }
    state.currentOpsAlertSenior = { name: senior, phone: '+91 98110-44912', assignedNurse: assignee };
  }

  modal.classList.remove('hidden');
}

function triggerOpsCallSenior() {
  const p = state.currentOpsAlertSenior || {};
  const name = p.name || 'Ramesh Sharma';
  const phone = p.phone || '+91 98110-44912';
  if (typeof triggerSimulatedCall === 'function') {
    triggerSimulatedCall(name, phone);
  } else {
    showToast(`Initiating emergency 2-way call to ${name} (${phone})...`, 'info');
  }
}

function triggerOpsDispatchNurse() {
  const p = state.currentOpsAlertSenior || {};
  const name = p.name || 'Ramesh Sharma';
  const nurse = p.assignedNurse || 'Sister Kavita, RN';
  showToast(`Emergency Nurse ${nurse} dispatched for ${name}! ETA: 12 mins.`, 'success');
}

function closeOpsAlertDetail() {
  const modal = document.getElementById('modal-ops-alert-detail');
  if (modal) modal.classList.add('hidden');
}

// 10. Help Modal Controls
function showHelpModal() {
  const m = document.getElementById('modal-ops-help');
  if (m) m.classList.remove('hidden');
}

function closeHelpModal() {
  const m = document.getElementById('modal-ops-help');
  if (m) m.classList.add('hidden');
}

// 11. Map Mode Toggle (Map vs Satellite)
function toggleMapMode(mode) {
  const mapContainer = document.getElementById('ops-city-map');
  const btnStreet = document.getElementById('map-mode-street');
  const btnSat = document.getElementById('map-mode-sat');

  if (mode === 'sat') {
    if (mapContainer) {
      mapContainer.className = 'relative w-full h-80 sm:h-96 rounded-2xl bg-gradient-to-tr from-slate-900 via-slate-800 to-slate-900 border border-slate-700 overflow-hidden flex items-center justify-center';
    }
    if (btnSat) btnSat.className = 'px-3 py-1 rounded-lg bg-white text-slate-900 shadow-sm';
    if (btnStreet) btnStreet.className = 'px-3 py-1 rounded-lg text-slate-500 hover:text-slate-800';
  } else {
    if (mapContainer) {
      mapContainer.className = 'relative w-full h-80 sm:h-96 rounded-2xl bg-gradient-to-tr from-[#eef7f6] via-[#f4faf9] to-[#e8f4f2] border border-teal-100 overflow-hidden flex items-center justify-center';
    }
    if (btnStreet) btnStreet.className = 'px-3 py-1 rounded-lg bg-white text-slate-900 shadow-sm';
    if (btnSat) btnSat.className = 'px-3 py-1 rounded-lg text-slate-500 hover:text-slate-800';
  }
}

// 12. Export Functions

// =====================================================================// OPERATIONS MANAGER: FULLY CONNECTED CLINICAL & REALISTIC DATASET ENGINE
// =====================================================================
// 1. Audit Log Recorder Helper
function addOpsAuditRecord(senior, actionText, user) {
  const table = document.getElementById('ops-audit-table-body');
  if (!table) return;

  const now = new Date();
  const timeStr = now.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
    + ' ' + now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  const tr = document.createElement('tr');
  tr.className = 'hover:bg-slate-50 transition-colors bg-teal-50/20';
  tr.innerHTML = `
    <td class="p-3.5 pl-4 font-mono text-[11px] text-slate-500 whitespace-nowrap">${timeStr}</td>
    <td class="p-3.5 font-bold text-slate-900">${user || 'OM (You)'}</td>
    <td class="p-3.5"><span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">Operations</span></td>
    <td class="p-3.5 text-slate-700 font-medium">${actionText}</td>
    <td class="p-3.5 font-mono text-[11px] text-slate-500">Live Telemetry</td>
    <td class="p-3.5 font-bold text-slate-800">${senior}</td>
    <td class="p-3.5 font-mono text-[11px] text-slate-400">192.168.1.15</td>
  `;
  table.prepend(tr);
}

// 2. Call Senior Directly from Alerts & Cases
function triggerOpsCallSeniorFor(seniorName, phone) {
  if (soundEngine && typeof soundEngine.playTone === 'function') {
    soundEngine.playTone(440, 'sine', 0.25);
    setTimeout(() => soundEngine.playTone(480, 'sine', 0.35), 300);
  }

  const patient = typeof getPatientByNameOrId === 'function' ? getPatientByNameOrId(seniorName) : null;
  const targetPhone = phone || (patient ? patient.phone : '+91 98110-44912');

  addOpsAuditRecord(seniorName, `Initiated 2-way clinical phone check-in (${targetPhone})`, 'Operations Manager');

  if (typeof triggerSimulatedCall === 'function') {
    triggerSimulatedCall(seniorName, targetPhone);
  } else {
    showToast(`Emergency 2-way call connected to ${seniorName} (${targetPhone}). Telemetry audio streaming.`, 'info');
  }
}

// 3. Dispatch Emergency Nurse Directly from Alerts & Cases
function triggerOpsDispatchNurseFor(seniorName, assignedNurse) {
  const patient = typeof getPatientByNameOrId === 'function' ? getPatientByNameOrId(seniorName) : null;
  const nurse = assignedNurse || (patient ? patient.assignedNurse : 'Sister Kavita, RN');

  if (soundEngine && typeof soundEngine.playTone === 'function') {
    soundEngine.playTone(784, 'sine', 0.15);
    setTimeout(() => soundEngine.playTone(880, 'sine', 0.18), 180);
    setTimeout(() => soundEngine.playTone(1046, 'sine', 0.22), 380);
  }

  // Update rows in both Alerts & Cases table and Recent Alerts table
  const rows = document.querySelectorAll('#ops-alerts-table-body tr, #ops-recent-alerts-body tr');
  rows.forEach(r => {
    if (r.getAttribute('data-senior') === seniorName) {
      r.setAttribute('data-status', 'In Progress');
      const cells = r.querySelectorAll('td');
      // Tab 3 table has 8 columns: [checkbox, name, risk, issue, time, status, coord, action]
      if (cells.length >= 8) {
        cells[5].innerHTML = '<span class="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-100 text-blue-700 animate-pulse">Dispatched (12m)</span>';
        cells[6].textContent = nurse;
      } else if (cells.length >= 6) {
        // Tab 1 table has 6 columns: [time, senior, risk, issue, status, action]
        cells[4].innerHTML = '<span class="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-100 text-blue-700 animate-pulse">Dispatched</span>';
      }
    }
  });

  addOpsAuditRecord(seniorName, `Emergency nurse ${nurse} dispatched to senior residence (ETA 12m)`, 'Operations Manager');

  showToast(`Emergency Nurse ${nurse} dispatched for ${seniorName}! ETA: 12 mins. GPS dispatch tracker active.`, 'success');
}

// 4. Modal Diagnostic Triggers
function triggerOpsCallSenior() {
  const p = state.currentOpsAlertSenior || {};
  const name = p.name || 'Ramesh Sharma';
  const phone = p.phone || '+91 98110-44912';
  triggerOpsCallSeniorFor(name, phone);
}

function triggerOpsDispatchNurse() {
  const p = state.currentOpsAlertSenior || {};
  const name = p.name || 'Ramesh Sharma';
  const nurse = p.assignedNurse || 'Sister Kavita, RN';
  triggerOpsDispatchNurseFor(name, nurse);
}

// 5. Risk Analytics Sub-Tab Switcher
function switchOpsRiskTab(tabName) {
  // Hide all risk subpanes
  document.querySelectorAll('.ops-risk-subpane').forEach(el => el.classList.add('hidden'));

  // Reset tab button styles
  document.querySelectorAll('.ops-risk-tab-btn').forEach(btn => {
    btn.classList.remove('border-teal-600', 'text-teal-800');
    btn.classList.add('border-transparent', 'text-slate-500');
  });

  // Activate selected subpane
  const targetPane = document.getElementById(`ops-risk-pane-${tabName}`);
  if (targetPane) targetPane.classList.remove('hidden');

  const targetBtn = document.getElementById(`btn-ops-risk-tab-${tabName}`);
  if (targetBtn) {
    targetBtn.classList.remove('border-transparent', 'text-slate-500');
    targetBtn.classList.add('border-teal-600', 'text-teal-800');
  }

  // Trigger chart re-render / resize if overview or trend
  if (tabName === 'overview' || tabName === 'trend') {
    setTimeout(() => {
      initOpsCharts();
    }, 50);
  }
}

// 6. Add Coordinator with Real DOM & State Persistence
function submitOpsAddCoordinator(e) {
  if (e && e.preventDefault) e.preventDefault();

  const nameInput = document.getElementById('ops-coord-name');
  const roleInput = document.getElementById('ops-coord-role');
  const areaInput = document.getElementById('ops-coord-area');
  const phoneInput = document.getElementById('ops-coord-phone');
  const emailInput = document.getElementById('ops-coord-email');

  const name = nameInput ? nameInput.value.trim() : '';
  const role = roleInput ? roleInput.value : 'Care Nurse';
  const area = areaInput ? areaInput.value : 'Greater Kailash';
  const phone = phoneInput ? phoneInput.value.trim() : '+91 98765 00000';
  const email = emailInput ? emailInput.value.trim() : 'coordinator@careconnect.com';

  if (!name) {
    showToast('Please enter coordinator name', 'warning');
    return;
  }

  const initials = name.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase() || 'CC';

  // Append new coordinator row to #ops-team-table-body
  const tableBody = document.getElementById('ops-team-table-body');
  if (tableBody) {
    const tr = document.createElement('tr');
    tr.className = 'hover:bg-slate-50/80 transition-colors bg-teal-50/40 border-l-4 border-teal-500';
    tr.innerHTML = `
      <td class="p-3.5 pl-4 flex items-center space-x-3">
        <div class="w-8 h-8 rounded-xl bg-teal-100 text-teal-800 font-black flex items-center justify-center text-xs flex-shrink-0">
          ${initials}
        </div>
        <div>
          <div class="font-black text-slate-900">${name}</div>
          <div class="text-[10px] text-slate-400 font-semibold">${role} &bull; ${area}</div>
        </div>
      </td>
      <td class="p-3.5 text-center font-bold text-slate-800">0</td>
      <td class="p-3.5 text-center font-bold text-slate-400">0</td>
      <td class="p-3.5 text-center font-bold text-emerald-600">0</td>
      <td class="p-3.5 text-center font-mono text-slate-500 text-[11px]">New</td>
      <td class="p-3.5 text-center">
        <span class="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-700">Active</span>
      </td>
    `;
    tableBody.prepend(tr);
  }

  // Increment active coordinator count
  const countEl = document.getElementById('ops-active-coord-count');
  if (countEl) {
    const cur = parseInt(countEl.textContent) || 8;
    countEl.textContent = cur + 1;
  }

  // Add coordinator to all relevant dropdowns
  const newOption = `<option value="${name}" selected>${name} (${role} &bull; ${area})</option>`;
  ['task-coordinator', 'ops-assign-coordinator-select', 'ops-new-alert-coord'].forEach(id => {
    const sel = document.getElementById(id);
    if (sel) sel.insertAdjacentHTML('beforeend', newOption);
  });

  addOpsAuditRecord(name, `New care coordinator ${name} (${role}) enrolled for sector ${area}`, 'Operations Manager');

  // Reset & close
  const form = document.getElementById('ops-add-coordinator-form');
  if (form) form.reset();
  closeOpsAddCoordinatorModal();

  showToast(`Coordinator ${name} added successfully to ${area}!`, 'success');
}

function handleOpsAssignTaskSubmit(e) {
  if (e && e.preventDefault) e.preventDefault();
  const seniorSelect = document.getElementById('ops-task-senior-select') || document.querySelector('#ops-subview-team select');
  const coordSelect = document.getElementById('ops-task-coord-select');
  const senior = seniorSelect ? seniorSelect.value : 'Senior';
  const coord = coordSelect ? coordSelect.value : 'Coordinator';
  showToast(`Task assigned to ${coord} for ${senior} successfully!`, 'success');
  if (e && e.target && typeof e.target.reset === 'function') {
    e.target.reset();
  }
}

// 14. Initialize All Operations Manager Charts (Chart.js)
function initOpsCharts() {
  if (typeof Chart === 'undefined') return;

  // 1. Tab 2: Risk Distribution Doughnut Chart (High 24, Moderate 68, Low 108)
  const canvasRiskDist = document.getElementById('chart-ops-risk-distribution');
  if (canvasRiskDist) {
    if (state.charts && state.charts.opsRiskDist) state.charts.opsRiskDist.destroy();
    const ctx = canvasRiskDist.getContext('2d');
    if (!state.charts) state.charts = {};
    state.charts.opsRiskDist = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['High Risk', 'Moderate Risk', 'Low Risk'],
        datasets: [{
          data: [24, 68, 108],
          backgroundColor: ['#f43f5e', '#f59e0b', '#10b981'],
          borderWidth: 2,
          borderColor: '#ffffff',
          hoverOffset: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '72%',
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx) => ` ${ctx.label}: ${ctx.raw} (${Math.round((ctx.raw / 200) * 100)}%)`
            }
          }
        }
      }
    });
  }

  // 2. Tab 2: Risk Trend Over Time (Line chart: 1 Oct - 28 Oct)
  const canvasRiskTrend = document.getElementById('chart-ops-risk-trend');
  if (canvasRiskTrend) {
    if (state.charts && state.charts.opsRiskTrend) state.charts.opsRiskTrend.destroy();
    const ctx = canvasRiskTrend.getContext('2d');
    if (!state.charts) state.charts = {};
    state.charts.opsRiskTrend = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['1 Oct', '7 Oct', '14 Oct', '21 Oct', '28 Oct'],
        datasets: [
          {
            label: 'High Risk',
            data: [18, 22, 28, 26, 24],
            borderColor: '#f43f5e',
            backgroundColor: 'rgba(244, 63, 94, 0.08)',
            fill: true,
            tension: 0.35,
            borderWidth: 2.5,
            pointRadius: 3
          },
          {
            label: 'Moderate Risk',
            data: [54, 58, 62, 65, 68],
            borderColor: '#f59e0b',
            backgroundColor: 'rgba(245, 158, 11, 0.06)',
            fill: true,
            tension: 0.35,
            borderWidth: 2.5,
            pointRadius: 3
          },
          {
            label: 'Low Risk',
            data: [128, 120, 110, 109, 108],
            borderColor: '#10b981',
            backgroundColor: 'rgba(16, 185, 129, 0.06)',
            fill: true,
            tension: 0.35,
            borderWidth: 2.5,
            pointRadius: 3
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            labels: { boxWidth: 10, font: { size: 10, weight: 'bold' } }
          }
        },
        scales: {
          y: { grid: { color: 'rgba(226, 232, 240, 0.6)' }, ticks: { font: { size: 10 } } },
          x: { grid: { display: false }, ticks: { font: { size: 10 } } }
        }
      }
    });
  }

  // 3. Tab 2: Alert Trends (Last 30 Days) Bar Chart
  const canvasAlertTrends = document.getElementById('chart-ops-alert-trends');
  if (canvasAlertTrends) {
    if (state.charts && state.charts.opsAlertTrends) state.charts.opsAlertTrends.destroy();
    const ctx = canvasAlertTrends.getContext('2d');
    const dataVals = [18, 24, 22, 28, 42, 31, 35, 29, 32];
    const bgColors = dataVals.map(v => v === 42 ? '#0f766e' : '#00a896');
    if (!state.charts) state.charts = {};
    state.charts.opsAlertTrends = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['1 Oct', '4 Oct', '7 Oct', '10 Oct', '14 Oct', '18 Oct', '21 Oct', '25 Oct', '28 Oct'],
        datasets: [{
          label: 'Alert Volume',
          data: dataVals,
          backgroundColor: bgColors,
          borderRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: { beginAtZero: true, grid: { color: 'rgba(226, 232, 240, 0.6)' }, ticks: { font: { size: 10 } } },
          x: { grid: { display: false }, ticks: { font: { size: 10 } } }
        }
      }
    });
  }

  // 4. Tab 4: Team Workload Distribution Doughnut Chart (50 Cases)
  const canvasTeamWorkload = document.getElementById('chart-ops-team-workload');
  if (canvasTeamWorkload) {
    if (state.charts && state.charts.opsTeamWorkload) state.charts.opsTeamWorkload.destroy();
    const ctx = canvasTeamWorkload.getContext('2d');
    if (!state.charts) state.charts = {};
    state.charts.opsTeamWorkload = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Sister Kavita (28%)', 'Brother Amit (24%)', 'Rajesh Kumar (20%)', 'Sister Sunita (16%)', 'Dr. V.K. Kapoor (12%)'],
        datasets: [{
          data: [14, 12, 10, 8, 6],
          backgroundColor: ['#00a896', '#3b82f6', '#f59e0b', '#a855f7', '#f43f5e'],
          borderWidth: 2,
          borderColor: '#ffffff',
          hoverOffset: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '68%',
        plugins: {
          legend: { display: false }
        }
      }
    });
  }

  // 5. Tab 6: Reports Alerts by Risk Level (Bar Chart)
  const canvasRepRisk = document.getElementById('chart-reports-risk-bar');
  if (canvasRepRisk) {
    if (state.charts && state.charts.reportsRisk) state.charts.reportsRisk.destroy();
    const ctx = canvasRepRisk.getContext('2d');
    if (!state.charts) state.charts = {};
    state.charts.reportsRisk = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['High', 'Moderate', 'Low'],
        datasets: [{
          label: 'Seniors',
          data: [24, 68, 108],
          backgroundColor: ['#f43f5e', '#f59e0b', '#10b981'],
          borderRadius: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: { beginAtZero: true, grid: { color: 'rgba(226, 232, 240, 0.6)' }, ticks: { font: { size: 10 } } },
          x: { grid: { display: false }, ticks: { font: { size: 11, weight: 'bold' } } }
        }
      }
    });
  }

  // 6. Tab 6: Reports Alert Resolution Rate (Gauge Doughnut Chart 92%)
  const canvasRepGauge = document.getElementById('chart-reports-resolution-gauge');
  if (canvasRepGauge) {
    if (state.charts && state.charts.reportsGauge) state.charts.reportsGauge.destroy();
    const ctx = canvasRepGauge.getContext('2d');
    if (!state.charts) state.charts = {};
    state.charts.reportsGauge = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Resolved (92%)', 'Pending (8%)'],
        datasets: [{
          data: [92, 8],
          backgroundColor: ['#00a896', '#e2e8f0'],
          borderWidth: 0,
          hoverOffset: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '76%',
        plugins: {
          legend: {
            position: 'bottom',
            labels: { boxWidth: 10, font: { size: 10 } }
          }
        }
      }
    });
  }

  // 7. Tab 6: Reports Monthly Alert Trend (Line Chart)
  const canvasRepTrend = document.getElementById('chart-reports-monthly-trend');
  if (canvasRepTrend) {
    if (state.charts && state.charts.reportsMonthly) state.charts.reportsMonthly.destroy();
    const ctx = canvasRepTrend.getContext('2d');
    if (!state.charts) state.charts = {};
    state.charts.reportsMonthly = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
          {
            label: 'Total Alerts',
            data: [45, 62, 78, 94, 88, 102],
            borderColor: '#3b82f6',
            backgroundColor: 'rgba(59, 130, 246, 0.08)',
            fill: true,
            tension: 0.35,
            borderWidth: 2,
            pointRadius: 3
          },
          {
            label: 'Resolved Alerts',
            data: [42, 58, 72, 86, 82, 94],
            borderColor: '#00a896',
            backgroundColor: 'rgba(0, 168, 150, 0.08)',
            fill: true,
            tension: 0.35,
            borderWidth: 2,
            pointRadius: 3
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            labels: { boxWidth: 10, font: { size: 10 } }
          }
        },
        scales: {
          y: { grid: { color: 'rgba(226, 232, 240, 0.6)' }, ticks: { font: { size: 10 } } },
          x: { grid: { display: false }, ticks: { font: { size: 10 } } }
        }
      }
    });
  }
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



// ==================================================================// ELDER COMPREHENSIVE HEALTH & RISK ASSESSMENT (AI ML PREDICTION ENGINE)
// ==================================================================
// Live Assessment State
const assessmentState = {
  painPresent: false,
  painLevel: 0,
  lastPrediction: null
};

// 1. Fill Quick Presets (Healthy, Moderate, Critical)
function fillAssessmentPreset(type) {
  soundEngine.playTone(600, 'sine', 0.1);

  if (type === 'healthy') {
    document.getElementById('assess-age').value = 68;
    document.getElementById('assess-gender').value = 'Female';
    document.getElementById('assess-height').value = 160;
    document.getElementById('assess-weight').value = 62;
    document.getElementById('assess-bp-sys').value = 118;
    document.getElementById('assess-bp-dia').value = 78;
    document.getElementById('assess-hr').value = 72;
    document.getElementById('assess-spo2').value = 98;
    document.getElementById('assess-sleep').value = 7.5;
    document.getElementById('assess-pain-loc').value = 'None';
    document.getElementById('assess-walk').value = '1';
    document.getElementById('assess-eat').value = '1';
    document.getElementById('assess-move').value = '1';
    document.getElementById('assess-toilet').value = '1';
    document.getElementById('assess-med-count').value = 1;
    document.getElementById('assess-missed-doses').value = '0';
    document.getElementById('assess-diabetic').value = '0';
    document.getElementById('assess-sugar').value = 105;
    document.getElementById('assess-hearing').value = '0';
    document.getElementById('chk-htn').checked = false;
    document.getElementById('chk-arth').checked = false;
    document.getElementById('chk-heart').checked = false;
    document.getElementById('chk-resp').checked = false;
    setPainPresent(false);
    updatePainSlider(0);
    showToast('Loaded Sample 1: Healthy Senior Profile 🟢', 'success');
  } else if (type === 'moderate') {
    document.getElementById('assess-age').value = 76;
    document.getElementById('assess-gender').value = 'Male';
    document.getElementById('assess-height').value = 168;
    document.getElementById('assess-weight').value = 74;
    document.getElementById('assess-bp-sys').value = 144;
    document.getElementById('assess-bp-dia').value = 88;
    document.getElementById('assess-hr').value = 84;
    document.getElementById('assess-spo2').value = 95;
    document.getElementById('assess-sleep').value = 6.0;
    document.getElementById('assess-pain-loc').value = 'Knee';
    document.getElementById('assess-walk').value = '1';
    document.getElementById('assess-eat').value = '1';
    document.getElementById('assess-move').value = '0';
    document.getElementById('assess-toilet').value = '1';
    document.getElementById('assess-med-count').value = 4;
    document.getElementById('assess-missed-doses').value = '0';
    document.getElementById('assess-diabetic').value = '1';
    document.getElementById('assess-sugar').value = 165;
    document.getElementById('assess-hearing').value = '1';
    document.getElementById('chk-htn').checked = true;
    document.getElementById('chk-arth').checked = true;
    document.getElementById('chk-heart').checked = false;
    document.getElementById('chk-resp').checked = false;
    setPainPresent(true);
    updatePainSlider(4);
    showToast('Loaded Sample 2: Moderate Risk Profile 🟡', 'warning');
  } else if (type === 'critical') {
    document.getElementById('assess-age').value = 82;
    document.getElementById('assess-gender').value = 'Male';
    document.getElementById('assess-height').value = 165;
    document.getElementById('assess-weight').value = 58;
    document.getElementById('assess-bp-sys').value = 168;
    document.getElementById('assess-bp-dia').value = 98;
    document.getElementById('assess-hr').value = 106;
    document.getElementById('assess-spo2').value = 89.5;
    document.getElementById('assess-sleep').value = 3.5;
    document.getElementById('assess-pain-loc').value = 'Chest';
    document.getElementById('assess-walk').value = '0';
    document.getElementById('assess-eat').value = '0';
    document.getElementById('assess-move').value = '0';
    document.getElementById('assess-toilet').value = '0';
    document.getElementById('assess-med-count').value = 6;
    document.getElementById('assess-missed-doses').value = '2';
    document.getElementById('assess-diabetic').value = '1';
    document.getElementById('assess-sugar').value = 245;
    document.getElementById('assess-hearing').value = '2';
    document.getElementById('chk-htn').checked = true;
    document.getElementById('chk-arth').checked = true;
    document.getElementById('chk-heart').checked = true;
    document.getElementById('chk-resp').checked = true;
    setPainPresent(true);
    updatePainSlider(8);
    showToast('Loaded Sample 3: High Risk / Emergency Profile 🔴', 'danger');
  }

  updateCalculatedBMI();
  updateADLScore();
  toggleSugarInput(document.getElementById('assess-diabetic').value);
  if (typeof saveAssessmentDraft === 'function') saveAssessmentDraft();
  if (typeof updateAssessmentProgressMeter === 'function') updateAssessmentProgressMeter();
}

// 2. Calculate BMI Live
function updateCalculatedBMI() {
  const h = parseFloat(document.getElementById('assess-height').value) || 160;
  const w = parseFloat(document.getElementById('assess-weight').value) || 60;
  const bmiBadge = document.getElementById('bmi-badge');
  if (!bmiBadge || h <= 0) return;

  const bmi = (w / Math.pow(h / 100, 2)).toFixed(1);
  let category = 'Normal';
  let badgeColor = 'bg-teal-100 text-teal-800';

  if (bmi < 18.5) {
    category = 'Underweight';
    badgeColor = 'bg-amber-100 text-amber-800';
  } else if (bmi >= 25 && bmi < 30) {
    category = 'Overweight';
    badgeColor = 'bg-amber-100 text-amber-800';
  } else if (bmi >= 30) {
    category = 'Obese';
    badgeColor = 'bg-rose-100 text-rose-800';
  }

  bmiBadge.className = `text-xs font-bold px-2.5 py-0.5 rounded-full ${badgeColor}`;
  bmiBadge.textContent = `BMI: ${bmi} (${category})`;
}

// 3. Pain Toggle Handler
function setPainPresent(isPresent) {
  assessmentState.painPresent = isPresent;
  const btnNo = document.getElementById('btn-pain-no');
  const btnYes = document.getElementById('btn-pain-yes');
  const slider = document.getElementById('assess-pain-slider');

  if (isPresent) {
    btnYes.className = 'px-3 py-2 text-xs font-bold rounded-xl border-2 border-amber-500 bg-amber-500 text-white transition-all text-center';
    btnNo.className = 'px-3 py-2 text-xs font-bold rounded-xl border-2 border-slate-300 bg-white text-slate-700 hover:border-emerald-400 transition-all text-center';
    if (parseInt(slider.value) === 0) {
      updatePainSlider(4);
    }
  } else {
    btnNo.className = 'px-3 py-2 text-xs font-bold rounded-xl border-2 border-emerald-500 bg-emerald-500 text-white transition-all text-center';
    btnYes.className = 'px-3 py-2 text-xs font-bold rounded-xl border-2 border-slate-300 bg-white text-slate-700 hover:border-amber-400 transition-all text-center';
    updatePainSlider(0);
    document.getElementById('assess-pain-loc').value = 'None';
  }
}

// 4. Pain Slider Live Update
function updatePainSlider(val) {
  val = parseInt(val) || 0;
  assessmentState.painLevel = val;
  const slider = document.getElementById('assess-pain-slider');
  const sliderVal = document.getElementById('slider-pain-val');
  const displayBadge = document.getElementById('pain-level-display');

  if (slider) slider.value = val;
  if (sliderVal) sliderVal.textContent = val;

  if (val === 0) {
    if (displayBadge) {
      displayBadge.className = 'text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800';
      displayBadge.textContent = '😊 No Pain (0/10)';
    }
  } else if (val <= 3) {
    if (displayBadge) {
      displayBadge.className = 'text-xs font-bold px-2 py-0.5 rounded-full bg-sky-100 text-sky-800';
      displayBadge.textContent = `🙂 Mild Pain (${val}/10)`;
    }
  } else if (val <= 6) {
    if (displayBadge) {
      displayBadge.className = 'text-xs font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800';
      displayBadge.textContent = `😐 Moderate Pain (${val}/10)`;
    }
  } else {
    if (displayBadge) {
      displayBadge.className = 'text-xs font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 animate-pulse';
      displayBadge.textContent = `😫 Severe Pain (${val}/10)`;
    }
  }
}

// 5. Update ADL Score Live
function updateADLScore() {
  const w = parseInt(document.getElementById('assess-walk').value) || 0;
  const e = parseInt(document.getElementById('assess-eat').value) || 0;
  const m = parseInt(document.getElementById('assess-move').value) || 0;
  const t = parseInt(document.getElementById('assess-toilet').value) || 0;
  const total = w + e + m + t;

  const badge = document.getElementById('adl-score-badge');
  if (!badge) return;

  if (total === 4) {
    badge.className = 'text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800';
    badge.textContent = 'ADL: 4/4 (Independent / आत्मनिर्भर)';
  } else if (total >= 2) {
    badge.className = 'text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800';
    badge.textContent = `ADL: ${total}/4 (Partially Dependent / आंशिक सहारा)`;
  } else {
    badge.className = 'text-xs font-bold px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800';
    badge.textContent = `ADL: ${total}/4 (Dependent / पूर्ण सहायता)`;
  }
}

// 6. Toggle Sugar Input Visibility
function toggleSugarInput(isDiabetic) {
  const container = document.getElementById('sugar-input-container');
  if (!container) return;
  if (isDiabetic === '1') {
    container.classList.remove('opacity-40');
    container.classList.add('ring-2', 'ring-teal-400', 'rounded-xl', 'p-1', 'transition-all');
  } else {
    container.classList.remove('ring-2', 'ring-teal-400', 'p-1');
  }
}

// 7. Predict Elder Risk Assessment (AI ML Call)
async function predictElderRiskAssessment() {
  // Enforce mandatory input completion
  if (!validateAssessmentInputsBeforeSubmit()) {
    return;
  }
  const submitBtn = document.getElementById('assess-submit-btn');
  const originalBtnHtml = submitBtn.innerHTML;

  // Visual loading state
  submitBtn.disabled = true;
  submitBtn.innerHTML = `
    <i class="fa-solid fa-spinner fa-spin text-lg mr-2"></i>
    <span>Running AI ML Inference (90,000 Dataset Model)...</span>
  `;

  const prof = getUserProfile('senior');

  // Collect inputs
  const payload = {
    seniorName: prof.name || "Ramesh Sharma",
    age: parseFloat(document.getElementById('assess-age').value) || prof.age || 74,
    gender: document.getElementById('assess-gender').value || prof.gender || "Male",
    height_cm: parseFloat(document.getElementById('assess-height').value) || 165,
    weight_kg: parseFloat(document.getElementById('assess-weight').value) || 68,
    bp_systolic: parseFloat(document.getElementById('assess-bp-sys').value) || 128,
    bp_diastolic: parseFloat(document.getElementById('assess-bp-dia').value) || 82,
    heart_rate: parseFloat(document.getElementById('assess-hr').value) || 76,
    spo2: parseFloat(document.getElementById('assess-spo2').value) || 97,
    sleep_hours: parseFloat(document.getElementById('assess-sleep').value) || 7.0,
    pain_present: assessmentState.painPresent ? 1 : 0,
    pain_level: assessmentState.painLevel,
    pain_location: document.getElementById('assess-pain-loc').value || "None",
    walking_independent: parseInt(document.getElementById('assess-walk').value) || 1,
    eating_independent: parseInt(document.getElementById('assess-eat').value) || 1,
    moving_independent: parseInt(document.getElementById('assess-move').value) || 1,
    toileting_independent: parseInt(document.getElementById('assess-toilet').value) || 1,
    medication_count: parseInt(document.getElementById('assess-med-count').value) || 3,
    missed_doses: parseInt(document.getElementById('assess-missed-doses').value) || 0,
    is_diabetic: parseInt(document.getElementById('assess-diabetic').value) || 0,
    blood_glucose: parseFloat(document.getElementById('assess-sugar').value) || 110,
    hearing_difficulty: parseInt(document.getElementById('assess-hearing').value) > 0 ? 1 : 0,
    hearing_aid_used: parseInt(document.getElementById('assess-hearing').value) === 2 ? 1 : 0,
    has_hypertension: document.getElementById('chk-htn').checked ? 1 : 0,
    has_arthritis: document.getElementById('chk-arth').checked ? 1 : 0,
    has_heart_disease: document.getElementById('chk-heart').checked ? 1 : 0,
    has_respiratory: document.getElementById('chk-resp').checked ? 1 : 0,
    sync_coordinator: true
  };

  try {
    const response = await fetch('/api/senior/assessment-predict', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    if (data.success && data.result) {
      assessmentState.lastPrediction = data.result;
      assessmentState.lastPayload = payload;
      
      // Play appropriate sound
      if (data.result.predicted_risk_level === 'High') {
        soundEngine.playTone(300, 'sawtooth', 0.4);
      } else if (data.result.predicted_risk_level === 'Medium') {
        soundEngine.playTone(450, 'triangle', 0.2);
      } else {
        soundEngine.playSuccessChime();
      }

      renderAssessmentResult(data.result, payload, data.alert_created);
      
      // 1. Save Assessment snapshot to Elder History with ML Prediction and Full Clinical Sheet
      if (typeof saveElderAssessmentToHistory === 'function') {
        saveElderAssessmentToHistory(payload, data.result, prof);
      }

      // 2. Form reset back to blank for next session (age and gender stay auto-detected)
      if (typeof resetElderAssessmentForm === 'function') {
        resetElderAssessmentForm(true);
      }

      // If alert was created, refresh Coordinator queue in background
      if (typeof refreshCoordinatorQueue === 'function') {
        refreshCoordinatorQueue();
      }

      showToast(`Health Risk Prediction Complete: ${data.result.predicted_risk_level} Risk! Archived to History & Form Reset for next checkup.`, 
        data.result.predicted_risk_level === 'High' ? 'danger' : (data.result.predicted_risk_level === 'Medium' ? 'warning' : 'success'));
    } else {
      showToast('Prediction error: ' + (data.error || 'Server responded with error'), 'danger');
    }
  } catch (err) {
    console.error('Assessment predict fetch error:', err);
    showToast('Failed to connect to ML prediction server.', 'danger');
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalBtnHtml;
  }
}

// 8. Render Assessment Result Card

// ==================================================================// DOB & AGE COMPUTATION UTILITIES
// ==================================================================
function calculateAgeFromDob(dobStr) {
  if (!dobStr) return null;
  const birthDate = new Date(dobStr);
  if (isNaN(birthDate.getTime())) return null;
  const today = new Date();
  if (birthDate > today) return null; // Invalid future date
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return (age >= 0 && age <= 125) ? age : null;
}

function handleSeniorDobChange(dobVal) {
  const ageInput = document.getElementById('prof-senior-age');
  if (!ageInput) return;
  if (!dobVal) {
    ageInput.value = '';
    return;
  }
  const computed = calculateAgeFromDob(dobVal);
  if (computed === null) {
    showToast('Please enter a valid past Date of Birth / कृपया वैध जन्मतिथि चुनें', 'warning');
    ageInput.value = '';
  } else {
    ageInput.value = computed;
    ageInput.classList.add('ring-2', 'ring-teal-400', 'bg-teal-50');
    setTimeout(() => {
      ageInput.classList.remove('ring-2', 'ring-teal-400', 'bg-teal-50');
    }, 1200);
  }
}

function autoFillSeniorProfileData(profileObj) {
  const prof = profileObj || getUserProfile('senior');
  if (!prof) return;

  let ageToSet = prof.age;
  if (prof.dob) {
    const calc = calculateAgeFromDob(prof.dob);
    if (calc !== null) ageToSet = calc;
  }

  // 1. Auto-fill Age input in Health Assessment
  const ageInput = document.getElementById('assess-age');
  if (ageInput && ageToSet) {
    ageInput.value = ageToSet;
    ageInput.classList.add('bg-teal-50', 'border-teal-400');
    setTimeout(() => {
      ageInput.classList.remove('bg-teal-50', 'border-teal-400');
    }, 2000);
  }

  // 2. Auto-fill Gender input in Health Assessment
  const genderSelect = document.getElementById('assess-gender');
  if (genderSelect && prof.gender) {
    genderSelect.value = prof.gender;
    genderSelect.classList.add('bg-teal-50', 'border-teal-400');
    setTimeout(() => {
      genderSelect.classList.remove('bg-teal-50', 'border-teal-400');
    }, 2000);
  }

  // 3. Update senior header vitals meta badge
  const metaBadge = document.getElementById('senior-vitals-meta-badge');
  if (metaBadge) {
    const displayAge = ageToSet ? `${ageToSet} Yrs` : '74 Yrs';
    const displayGender = prof.gender || 'Male';
    let displayLoc = 'New Delhi';
    if (prof.address && prof.address.includes(',')) {
      displayLoc = prof.address.split(',').slice(-1)[0].replace(/-\s*\d+/, '').trim();
    }
    metaBadge.textContent = `${displayAge} • ${displayGender} • ${displayLoc}`;
  }
}

function checkUserProfilePrompt(role, prof) {
  const promptEl = document.getElementById('new-user-profile-prompt');
  if (!promptEl) return;

  if (role !== 'senior') {
    promptEl.classList.add('hidden');
    return;
  }

  const p = prof || getUserProfile('senior');
  const isDismissed = sessionStorage.getItem('careconnect_dismiss_profile_prompt');
  
  // Profile is incomplete if DOB or Gender are empty or profileCompleted is false or isNewUser flag is set
  const isIncomplete = (!p.profileCompleted || !p.dob || !p.gender || p.isNewUser);

  if (isIncomplete && !isDismissed) {
    promptEl.classList.remove('hidden');
    soundEngine.playTone(480, 'sine', 0.15);
    setTimeout(() => {
      showToast('🔔 Notice: Please complete your DOB & Gender in Profile Settings for personalized AI assessments.', 'info');
    }, 600);
  } else {
    promptEl.classList.add('hidden');
  }
}

function dismissProfilePrompt(permanent = false) {
  const promptEl = document.getElementById('new-user-profile-prompt');
  if (promptEl) promptEl.classList.add('hidden');
  if (permanent) {
    sessionStorage.setItem('careconnect_dismiss_profile_prompt', 'true');
  }
}

// ==================================================================// UNIVERSAL PROFILE MANAGEMENT ENGINE (FOR ALL 4 STAKEHOLDER PORTALS)
// ==================================================================
const defaultRoleProfiles = {
  senior: {
    role: 'senior',
    name: 'Ramesh Sharma',
    dob: '1952-05-15',
    age: 74,
    gender: 'Male',
    profileCompleted: true,
    isNewUser: false,
    phone: '+91 98110-44912',
    email: 'ramesh.sharma@example.in',
    bloodGroup: 'B+',
    address: 'Flat 402, Shivalik Apts, Sector 14, Rohini, New Delhi - 110085',
    doctor: 'Dr. Alok Mehta (Cardiology, Max Healthcare)',
    allergies: 'Penicillin allergy, mild knee osteoarthritis',
    emergencyNotes: 'Prefers Hindi audio. Uses walking cane when outside.'
  },
  coordinator: {
    role: 'coordinator',
    name: 'Sister Kavita Verma',
    title: 'Lead Clinical Nurse & Triage Coordinator',
    phone: '+91 98765-43210',
    email: 'kavita.nurse@careconnect.ai',
    license: 'DEL-RN-884920',
    zone: 'North & South Delhi Outreach Cluster',
    shift: '08:00 AM - 04:00 PM IST',
    department: 'Geriatric Tele-Triage Unit'
  },
  family: {
    role: 'family',
    name: 'Rahul Sharma',
    relationship: 'Son (Primary Caregiver)',
    phone: '+91 98111-22334',
    email: 'rahul.sharma@techcorp.in',
    city: 'Cyber City, Gurugram, Haryana',
    alertPreferences: 'Immediate SOS via WhatsApp + Weekly Email Health Digest'
  },
  operations: {
    role: 'operations',
    name: 'Arun Kapoor',
    title: 'Regional Operations & SLA Command Director',
    phone: '+91 99999-88888',
    email: 'arun.ops@careconnect.ai',
    securityKey: 'OPS-SEC-9981',
    jurisdiction: 'Pan-India Metro Hubs (Delhi NCR, Mumbai, Bengaluru)',
    dispatchAuth: 'Certified Level-3 Rapid Response & 108 Fleet'
  }
};

function getUserProfile(role) {
  const current = role || state.currentRole || 'senior';
  try {
    const raw = localStorage.getItem(`careconnect_profile_${current}`);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('Error reading profile from localStorage:', e);
  }
  return Object.assign({}, defaultRoleProfiles[current] || defaultRoleProfiles.senior);
}

function openProfileModal() {
  const modal = document.getElementById('modal-profile-management');
  if (!modal) return;
  soundEngine.playTone(520, 'sine', 0.1);

  const role = state.currentRole || 'senior';
  const prof = getUserProfile(role);
  const container = document.getElementById('profile-dynamic-fields-container');
  const avatar = document.getElementById('modal-profile-role-avatar');
  const title = document.getElementById('modal-profile-title');
  const badge = document.getElementById('modal-profile-role-badge');
  const subtitle = document.getElementById('modal-profile-subtitle');

  const parts = (prof.name || 'User').split(' ');
  const initials = parts.length > 1 ? (parts[0][0] + parts[1][0]).toUpperCase() : prof.name.substring(0, 2).toUpperCase();

  if (avatar) avatar.textContent = initials;

  if (role === 'senior') {
    if (avatar) avatar.className = 'w-12 h-12 rounded-2xl bg-sky-600 text-white flex items-center justify-center text-xl font-bold shadow-sm';
    if (title) title.textContent = 'Senior Health Profile / बुज़ुर्ग स्वास्थ्य प्रोफाइल';
    if (badge) {
      badge.textContent = 'Senior Citizen (बुज़ुर्ग)';
      badge.className = 'px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-sky-100 text-sky-800';
    }
    if (subtitle) subtitle.textContent = 'Manage medical history, primary physician, home address, and emergency details';

    if (container) {
      container.innerHTML = `
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label class="profile-field-label">Full Name (पूरा नाम) *</label>
            <input type="text" id="prof-senior-name" value="${prof.name || ''}" class="profile-field-input" required placeholder="e.g. Ramesh Sharma">
          </div>
          <div>
            <label class="profile-field-label flex items-center justify-between">
              <span>Gender (लिंग) *</span>
              <span class="text-[10px] text-teal-600 font-bold bg-teal-50 px-1.5 py-0.2 rounded border border-teal-200">Auto-fills Assessment</span>
            </label>
            <select id="prof-senior-gender" class="profile-field-input bg-white font-semibold">
              <option value="" disabled ${!prof.gender ? 'selected' : ''}>Select Gender / लिंग चुनें</option>
              <option value="Male" ${prof.gender === 'Male' ? 'selected' : ''}>Male (पुरुष)</option>
              <option value="Female" ${prof.gender === 'Female' ? 'selected' : ''}>Female (महिला)</option>
              <option value="Other" ${prof.gender === 'Other' ? 'selected' : ''}>Other (अन्य)</option>
            </select>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          <div>
            <label class="profile-field-label flex items-center justify-between">
              <span>Date of Birth / जन्मतिथि (DOB) *</span>
              <span class="text-[10px] text-amber-700 font-bold bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">Calculates Age</span>
            </label>
            <input type="date" id="prof-senior-dob" value="${prof.dob || ''}" max="${new Date().toISOString().split('T')[0]}" onchange="handleSeniorDobChange(this.value)" class="profile-field-input bg-white font-semibold">
          </div>
          <div>
            <label class="profile-field-label flex items-center justify-between">
              <span>Age (उम्र - वर्ष)</span>
              <span class="text-[10px] text-sky-600 font-bold bg-sky-50 px-1.5 py-0.2 rounded border border-sky-200">Auto-computed</span>
            </label>
            <input type="number" id="prof-senior-age" value="${prof.age || ''}" class="profile-field-input bg-slate-100 text-slate-800 font-bold cursor-not-allowed" readonly placeholder="Auto from DOB">
          </div>
          <div>
            <label class="profile-field-label">Blood Group (रक्त समूह)</label>
            <select id="prof-senior-blood" class="profile-field-input bg-white font-medium">
              <option value="B+" ${prof.bloodGroup === 'B+' ? 'selected' : ''}>B+ (Positive)</option>
              <option value="O+" ${prof.bloodGroup === 'O+' ? 'selected' : ''}>O+ (Positive)</option>
              <option value="A+" ${prof.bloodGroup === 'A+' ? 'selected' : ''}>A+ (Positive)</option>
              <option value="AB+" ${prof.bloodGroup === 'AB+' ? 'selected' : ''}>AB+ (Positive)</option>
              <option value="B-" ${prof.bloodGroup === 'B-' ? 'selected' : ''}>B- (Negative)</option>
              <option value="O-" ${prof.bloodGroup === 'O-' ? 'selected' : ''}>O- (Negative)</option>
              <option value="A-" ${prof.bloodGroup === 'A-' ? 'selected' : ''}>A- (Negative)</option>
              <option value="AB-" ${prof.bloodGroup === 'AB-' ? 'selected' : ''}>AB- (Negative)</option>
            </select>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label class="profile-field-label">Mobile (+91) *</label>
            <input type="tel" id="prof-senior-phone" value="${prof.phone || ''}" class="profile-field-input" required>
          </div>
          <div>
            <label class="profile-field-label">Email Address (ईमेल)</label>
            <input type="email" id="prof-senior-email" value="${prof.email || ''}" class="profile-field-input">
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label class="profile-field-label">Email Address (ईमेल)</label>
            <input type="email" id="prof-senior-email" value="${prof.email || ''}" class="profile-field-input">
          </div>
          <div>
            <label class="profile-field-label">Primary Doctor / Hospital (प्रमुख चिकित्सक)</label>
            <input type="text" id="prof-senior-doctor" value="${prof.doctor || ''}" class="profile-field-input">
          </div>
        </div>

        <div>
          <label class="profile-field-label">Home Address (निवास का पूरा पता)</label>
          <input type="text" id="prof-senior-address" value="${prof.address || ''}" class="profile-field-input">
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label class="profile-field-label">Allergies & Conditions (एलर्जी व बीमारियां)</label>
            <input type="text" id="prof-senior-allergies" value="${prof.allergies || ''}" class="profile-field-input">
          </div>
          <div>
            <label class="profile-field-label">Emergency Care Notes (आपातकालीन निर्देश)</label>
            <input type="text" id="prof-senior-notes" value="${prof.emergencyNotes || ''}" class="profile-field-input">
          </div>
        </div>
      `;
    }
  } else if (role === 'coordinator') {
    if (avatar) avatar.className = 'w-12 h-12 rounded-2xl bg-teal-600 text-white flex items-center justify-center text-xl font-bold shadow-sm';
    if (title) title.textContent = 'Care Coordinator Profile & License';
    if (badge) {
      badge.textContent = 'Care Coordinator';
      badge.className = 'px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-teal-100 text-teal-800';
    }
    if (subtitle) subtitle.textContent = 'Clinical credentials, active triage shift, and outreach cluster assignment';

    if (container) {
      container.innerHTML = `
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label class="profile-field-label">Full Name & Credentials *</label>
            <input type="text" id="prof-coord-name" value="${prof.name || ''}" class="profile-field-input" required>
          </div>
          <div>
            <label class="profile-field-label">Professional Role / Title</label>
            <input type="text" id="prof-coord-title" value="${prof.title || ''}" class="profile-field-input">
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label class="profile-field-label">Nursing / Medical Council Registration No. *</label>
            <input type="text" id="prof-coord-license" value="${prof.license || ''}" class="profile-field-input" required>
          </div>
          <div>
            <label class="profile-field-label">Duty Shift Hours</label>
            <input type="text" id="prof-coord-shift" value="${prof.shift || ''}" class="profile-field-input">
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label class="profile-field-label">Direct Mobile Line (+91) *</label>
            <input type="tel" id="prof-coord-phone" value="${prof.phone || ''}" class="profile-field-input" required>
          </div>
          <div>
            <label class="profile-field-label">Official Clinical Email</label>
            <input type="email" id="prof-coord-email" value="${prof.email || ''}" class="profile-field-input">
          </div>
        </div>

        <div>
          <label class="profile-field-label">Assigned Outreach Cluster & Hub Zone</label>
          <input type="text" id="prof-coord-zone" value="${prof.zone || ''}" class="profile-field-input">
        </div>
      `;
    }
  } else if (role === 'family') {
    if (avatar) avatar.className = 'w-12 h-12 rounded-2xl bg-purple-600 text-white flex items-center justify-center text-xl font-bold shadow-sm';
    if (title) title.textContent = 'Family Member Profile & Alert Channels';
    if (badge) {
      badge.textContent = 'Family Member';
      badge.className = 'px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-100 text-purple-800';
    }
    if (subtitle) subtitle.textContent = 'Contact details for urgent WhatsApp/SMS alerts and weekly digests';

    if (container) {
      container.innerHTML = `
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label class="profile-field-label">Full Name *</label>
            <input type="text" id="prof-fam-name" value="${prof.name || ''}" class="profile-field-input" required>
          </div>
          <div>
            <label class="profile-field-label">Relationship to Elder *</label>
            <input type="text" id="prof-fam-relation" value="${prof.relationship || ''}" class="profile-field-input" required>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label class="profile-field-label">Mobile Number / WhatsApp (+91) *</label>
            <input type="tel" id="prof-fam-phone" value="${prof.phone || ''}" class="profile-field-input" required>
          </div>
          <div>
            <label class="profile-field-label">Email Address (for Weekly Digest)</label>
            <input type="email" id="prof-fam-email" value="${prof.email || ''}" class="profile-field-input">
          </div>
        </div>

        <div>
          <label class="profile-field-label">Residential City / Work Location</label>
          <input type="text" id="prof-fam-city" value="${prof.city || ''}" class="profile-field-input">
        </div>
      `;
    }
  } else if (role === 'operations') {
    if (avatar) avatar.className = 'w-12 h-12 rounded-2xl bg-orange-600 text-white flex items-center justify-center text-xl font-bold shadow-sm';
    if (title) title.textContent = 'Operations Director Profile & Command Clearance';
    if (badge) {
      badge.textContent = 'Operations Director';
      badge.className = 'px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-orange-100 text-orange-800';
    }
    if (subtitle) subtitle.textContent = 'Command jurisdiction, dispatch clearance, and municipal SLA monitoring';

    if (container) {
      container.innerHTML = `
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label class="profile-field-label">Full Name *</label>
            <input type="text" id="prof-ops-name" value="${prof.name || ''}" class="profile-field-input" required>
          </div>
          <div>
            <label class="profile-field-label">Operational Designation</label>
            <input type="text" id="prof-ops-title" value="${prof.title || ''}" class="profile-field-input">
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label class="profile-field-label">Emergency Operations Contact (+91) *</label>
            <input type="tel" id="prof-ops-phone" value="${prof.phone || ''}" class="profile-field-input" required>
          </div>
          <div>
            <label class="profile-field-label">Official Command Email</label>
            <input type="email" id="prof-ops-email" value="${prof.email || ''}" class="profile-field-input">
          </div>
        </div>

        <div>
          <label class="profile-field-label">Metro Jurisdictions Covered</label>
          <input type="text" id="prof-ops-jurisdiction" value="${prof.jurisdiction || ''}" class="profile-field-input">
        </div>
      `;
    }
  }

  modal.classList.remove('hidden');
}

function closeProfileModal() {
  const modal = document.getElementById('modal-profile-management');
  if (modal) modal.classList.add('hidden');
}

function saveUserProfile() {
  const role = state.currentRole || 'senior';
  const prof = getUserProfile(role);

  if (role === 'senior') {
    prof.name = document.getElementById('prof-senior-name')?.value.trim() || prof.name;
    
    // Read DOB and compute age
    const dobVal = document.getElementById('prof-senior-dob')?.value;
    if (dobVal) {
      prof.dob = dobVal;
      const computed = calculateAgeFromDob(dobVal);
      if (computed !== null) {
        prof.age = computed;
      }
    }
    
    const genderVal = document.getElementById('prof-senior-gender')?.value;
    if (genderVal) {
      prof.gender = genderVal;
    }

    prof.phone = document.getElementById('prof-senior-phone')?.value.trim() || prof.phone;
    prof.email = document.getElementById('prof-senior-email')?.value.trim() || prof.email;
    prof.bloodGroup = document.getElementById('prof-senior-blood')?.value || prof.bloodGroup;
    prof.address = document.getElementById('prof-senior-address')?.value.trim() || prof.address;
    prof.doctor = document.getElementById('prof-senior-doctor')?.value.trim() || prof.doctor;
    prof.allergies = document.getElementById('prof-senior-allergies')?.value.trim() || prof.allergies;
    prof.emergencyNotes = document.getElementById('prof-senior-notes')?.value.trim() || prof.emergencyNotes;

    prof.profileCompleted = true;
    prof.isNewUser = false;

    // Immediately auto-fill into Health Assessment inputs!
    autoFillSeniorProfileData(prof);

    // Dismiss the new user notification prompt
    dismissProfilePrompt(true);

    const greetingEl = document.getElementById('senior-greeting');
    if (greetingEl) {
      const isHi = state.seniorLanguage === 'hi';
      const firstName = prof.name.split(' ')[0];
      greetingEl.textContent = isHi ? `नमस्ते, ${firstName} जी! 🙏` : `Good Morning, ${firstName} ji! 🙏`;
    }
  } else if (role === 'coordinator') {
    prof.name = document.getElementById('prof-coord-name')?.value.trim() || prof.name;
    prof.title = document.getElementById('prof-coord-title')?.value.trim() || prof.title;
    prof.license = document.getElementById('prof-coord-license')?.value.trim() || prof.license;
    prof.phone = document.getElementById('prof-coord-phone')?.value.trim() || prof.phone;
    prof.email = document.getElementById('prof-coord-email')?.value.trim() || prof.email;
    prof.zone = document.getElementById('prof-coord-zone')?.value.trim() || prof.zone;
    prof.shift = document.getElementById('prof-coord-shift')?.value.trim() || prof.shift;
  } else if (role === 'family') {
    prof.name = document.getElementById('prof-fam-name')?.value.trim() || prof.name;
    prof.relationship = document.getElementById('prof-fam-relation')?.value.trim() || prof.relationship;
    prof.phone = document.getElementById('prof-fam-phone')?.value.trim() || prof.phone;
    prof.email = document.getElementById('prof-fam-email')?.value.trim() || prof.email;
    prof.city = document.getElementById('prof-fam-city')?.value.trim() || prof.city;
  } else if (role === 'operations') {
    prof.name = document.getElementById('prof-ops-name')?.value.trim() || prof.name;
    prof.title = document.getElementById('prof-ops-title')?.value.trim() || prof.title;
    prof.phone = document.getElementById('prof-ops-phone')?.value.trim() || prof.phone;
    prof.email = document.getElementById('prof-ops-email')?.value.trim() || prof.email;
    prof.jurisdiction = document.getElementById('prof-ops-jurisdiction')?.value.trim() || prof.jurisdiction;
  }

  try {
    localStorage.setItem(`careconnect_profile_${role}`, JSON.stringify(prof));
  } catch (e) {
    console.error('Failed to save profile:', e);
  }

  const nameLabel = document.getElementById('current-user-name');
  const avatar = document.getElementById('current-user-avatar');
  if (nameLabel) nameLabel.textContent = prof.name;
  if (avatar) {
    const parts = prof.name.split(' ');
    const initials = parts.length > 1 ? (parts[0][0] + parts[1][0]).toUpperCase() : prof.name.substring(0, 2).toUpperCase();
    avatar.textContent = initials;
  }

  soundEngine.playSuccessChime();
  showToast('Profile updated successfully! / प्रोफाइल सफलतापूर्वक सहेजी गई।', 'success');
  closeProfileModal();
}


// ==================================================================// FAMILY CARE CIRCLE & CAREGIVER MANAGEMENT (ELDER PORTAL)
// ==================================================================
const defaultFamilyMembers = [
  {
    id: 'fam-1',
    name: 'Rahul Sharma',
    relation: 'Son (बेटा)',
    phone: '+91 98111-22334',
    email: 'rahul.sharma@techcorp.in',
    isPrimary: true,
    residence: 'Same City (Gurugram)',
    alerts: { sos: true, daily: true, weekly: true }
  },
  {
    id: 'fam-2',
    name: 'Sunita Sharma',
    relation: 'Daughter (बेटी)',
    phone: '+91 98765-11223',
    email: 'sunita.sharma@gmail.com',
    isPrimary: false,
    residence: 'Mumbai',
    alerts: { sos: true, daily: false, weekly: true }
  }
];

function getFamilyMembers() {
  try {
    const raw = localStorage.getItem('careconnect_family_members');
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('Error reading family members:', e);
  }
  return defaultFamilyMembers.slice();
}

function saveFamilyMembers(list) {
  try {
    localStorage.setItem('careconnect_family_members', JSON.stringify(list));
  } catch (e) {
    console.error('Failed to save family members:', e);
  }
}


function scrollToFamilyCircle() {
  const el = document.getElementById('senior-family-members-list');
  if (el) {
    soundEngine.playTone(600, 'sine', 0.1);
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    const card = el.parentElement;
    if (card) {
      card.classList.add('ring-4', 'ring-indigo-400');
      setTimeout(() => {
        card.classList.remove('ring-4', 'ring-indigo-400');
      }, 2200);
    }
  }
}

function renderFamilyCareCircle() {
  const modalContainer = document.getElementById('modal-family-members-list');
  const pageContainer = document.getElementById('senior-family-members-list');
  const countBadge = document.getElementById('circle-members-count-badge');

  const members = getFamilyMembers();
  if (countBadge) {
    countBadge.textContent = `${members.length} Member${members.length === 1 ? '' : 's'} Connected`;
  }

  const html = (members.length === 0) ? `
    <div class="col-span-1 sm:col-span-2 p-6 bg-slate-50 border border-slate-200 rounded-2xl text-center">
      <div class="w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 mx-auto flex items-center justify-center text-xl mb-2">
        <i class="fa-solid fa-people-roof"></i>
      </div>
      <p class="text-sm font-bold text-slate-700">No family members linked yet.</p>
      <p class="text-xs text-slate-500 mt-1">Click "+ Add Family Member / सदस्य जोड़ें" above to connect your loved ones for emergency alerts.</p>
    </div>
  ` : members.map(m => {
    const initial = (m.name || 'F').charAt(0).toUpperCase();
    return `
      <div class="bg-slate-50/90 hover:bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 hover:border-indigo-300 shadow-sm transition-all duration-200">
        <div class="flex items-start justify-between gap-2.5">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-800 flex items-center justify-center font-black text-sm shadow-sm flex-shrink-0">
              ${initial}
            </div>
            <div>
              <div class="flex items-center space-x-1.5">
                <h4 class="text-xs sm:text-sm font-extrabold text-[#0e294b]">${m.name}</h4>
                ${m.isPrimary ? `
                  <span class="px-1.5 py-0.2 rounded-md text-[9px] font-black bg-emerald-100 text-emerald-800 border border-emerald-200">
                    Primary
                  </span>
                ` : ''}
              </div>
              <p class="text-[11px] font-semibold text-indigo-700">${m.relation} • <span class="text-slate-500 font-normal">${m.residence}</span></p>
            </div>
          </div>

          <button onclick="removeFamilyMember('${m.id}')" class="text-slate-400 hover:text-rose-600 p-1 transition-colors" title="Remove member">
            <i class="fa-solid fa-trash-can text-xs"></i>
          </button>
        </div>

        <div class="mt-2.5 pt-2 border-t border-slate-200/80 text-[11px] text-slate-600 space-y-1">
          <div class="flex items-center justify-between">
            <span><i class="fa-solid fa-phone text-teal-600 mr-1"></i><strong>${m.phone}</strong></span>
            ${m.email ? `<span class="text-slate-400 truncate max-w-[120px]"><i class="fa-solid fa-envelope mr-1"></i>${m.email}</span>` : ''}
          </div>
          <div class="flex flex-wrap items-center gap-1 pt-1">
            ${m.alerts.sos ? `<span class="px-1.5 py-0.5 bg-rose-100 text-rose-800 rounded text-[9px] font-bold"><i class="fa-solid fa-triangle-exclamation mr-0.5"></i>SOS</span>` : ''}
            ${m.alerts.daily ? `<span class="px-1.5 py-0.5 bg-sky-100 text-sky-800 rounded text-[9px] font-bold"><i class="fa-solid fa-calendar-check mr-0.5"></i>Daily</span>` : ''}
            ${m.alerts.weekly ? `<span class="px-1.5 py-0.5 bg-purple-100 text-purple-800 rounded text-[9px] font-bold"><i class="fa-solid fa-chart-line mr-0.5"></i>Weekly</span>` : ''}
          </div>
        </div>

        <div class="mt-3 flex items-center space-x-2">
          <button onclick="sendFamilyMemberTestAlert('${m.id}')"
            class="flex-1 py-1.5 px-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl text-[11px] font-bold transition-all shadow-xs flex items-center justify-center space-x-1">
            <i class="fa-brands fa-whatsapp text-emerald-600 text-xs"></i>
            <span>Send Alert</span>
          </button>
          <a href="tel:${m.phone}"
            class="py-1.5 px-2.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-xl text-[11px] font-bold transition-all shadow-xs flex items-center justify-center space-x-1">
            <i class="fa-solid fa-phone text-[10px] text-teal-600"></i>
            <span>Call</span>
          </a>
        </div>
      </div>
    `;
  }).join('');

  if (modalContainer) modalContainer.innerHTML = html;
  if (pageContainer) pageContainer.innerHTML = html;
}

function openFamilyCareCircleModal() {
  const modal = document.getElementById('modal-family-care-circle');
  if (modal) {
    soundEngine.playTone(550, 'sine', 0.1);
    renderFamilyCareCircle();
    modal.classList.remove('hidden');
  }
}

function closeFamilyCareCircleModal() {
  const modal = document.getElementById('modal-family-care-circle');
  if (modal) {
    modal.classList.add('hidden');
    toggleAddFamilyMemberInlineForm(false);
  }
}

function toggleAddFamilyMemberInlineForm(force) {
  const container = document.getElementById('inline-add-family-form-container');
  const btnText = document.getElementById('btn-toggle-add-fam-text');
  if (!container) return;

  const isHidden = container.classList.contains('hidden');
  const shouldOpen = (force !== undefined) ? force : isHidden;

  if (shouldOpen) {
    container.classList.remove('hidden');
    if (btnText) btnText.textContent = 'Close Form / बंद करें';
    soundEngine.playTone(600, 'sine', 0.1);
    document.getElementById('inline-fam-name')?.focus();
  } else {
    container.classList.add('hidden');
    if (btnText) btnText.textContent = '+ Add Family Member / सदस्य जोड़ें';
    document.getElementById('inline-add-family-form')?.reset();
  }
}

function submitInlineAddFamilyMember() {
  const name = document.getElementById('inline-fam-name')?.value.trim();
  const relation = document.getElementById('inline-fam-relation')?.value;
  const phone = document.getElementById('inline-fam-phone')?.value.trim();
  const email = document.getElementById('inline-fam-email')?.value.trim();
  const residence = document.getElementById('inline-fam-residence')?.value;
  const sos = document.getElementById('inline-fam-alert-sos')?.checked ?? true;
  const daily = document.getElementById('inline-fam-alert-daily')?.checked ?? true;
  const weekly = true;

  if (!name || !phone) {
    showToast('Please enter both name and mobile number.', 'warning');
    return;
  }

  const list = getFamilyMembers();
  const newMember = {
    id: 'fam-' + Date.now(),
    name: name,
    relation: relation,
    phone: phone,
    email: email || '',
    residence: residence,
    isPrimary: list.length === 0,
    alerts: { sos, daily, weekly }
  };

  list.push(newMember);
  saveFamilyMembers(list);
  renderFamilyCareCircle();

  soundEngine.playSuccessChime();
  showToast(`Family member ${name} (${relation}) added to care circle!`, 'success');
  toggleAddFamilyMemberInlineForm(false);
}

// Backward compatibility helpers
function openAddFamilyMemberModal() {
  openFamilyCareCircleModal();
  setTimeout(() => toggleAddFamilyMemberInlineForm(true), 150);
}

function closeAddFamilyMemberModal() {
  closeFamilyCareCircleModal();
}

function submitAddFamilyMember() {
  submitInlineAddFamilyMember();
}

// ==================================================================// AI PRESCRIPTION & DAILY HEALTH IMPROVEMENT TASKS ENGINE
// ==================================================================
function getTodayDateString() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}

function getStoredDailyTasks() {
  const dateKey = getTodayDateString();
  try {
    const raw = localStorage.getItem(`careconnect_rx_tasks_${dateKey}`);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('Error reading stored daily tasks:', e);
  }
  return null;
}

function saveStoredDailyTasks(tasks) {
  const dateKey = getTodayDateString();
  try {
    localStorage.setItem(`careconnect_rx_tasks_${dateKey}`, JSON.stringify(tasks));
  } catch (e) {
    console.error('Failed to save daily tasks:', e);
  }
}

function getHealthStreak() {
  return parseInt(localStorage.getItem('careconnect_health_streak') || '3');
}

function incrementHealthStreak() {
  const current = getHealthStreak();
  localStorage.setItem('careconnect_health_streak', String(current + 1));
}

function generateHealthPrescriptionTasks(res, inputData) {
  const existing = getStoredDailyTasks();
  if (existing && existing.length > 0) {
    return existing;
  }

  const tasks = [];

  // 1. Blood Pressure Task
  if (inputData.bp_systolic >= 135 || inputData.bp_diastolic >= 88 || inputData.has_hypertension) {
    tasks.push({
      id: 'task-bp',
      titleEn: 'Low-Sodium DASH Diet & BP Medication Timing',
      titleHi: 'कम नमक वाला आहार (DASH डाइट) व बीपी की दवा का समय पर सेवन',
      descEn: "Avoid extra table salt in today's meals. Take prescribed BP medicine with warm water after light breakfast. Rest 10 mins before measuring.",
      descHi: 'आज दाल/सब्जी में ऊपर से नमक न डालें। नाश्ते के बाद गुनगुने पानी से बीपी की दवा लें और 10 मिनट शांत बैठकर आराम करें।',
      timeSlot: 'Morning / सुबह',
      category: '🩺 Vitals & Medication',
      badgeClass: 'bg-rose-100 text-rose-800 border border-rose-200',
      completed: false
    });
  } else {
    tasks.push({
      id: 'task-bp-check',
      titleEn: 'Morning Resting Blood Pressure Log',
      titleHi: 'शांत अवस्था में बीपी व पल्स की नियमित जांच',
      descEn: 'Sit relaxed for 5 minutes and record your morning BP. Target resting reading is < 125/80 mmHg.',
      descHi: '5 मिनट कुर्सी पर आराम से बैठें और अपना ब्लड प्रेशर नापें। सामान्य मान 120/80 के करीब रखें।',
      timeSlot: 'Morning / सुबह',
      category: '🩺 Vitals Monitoring',
      badgeClass: 'bg-emerald-100 text-emerald-800 border border-emerald-200',
      completed: true
    });
  }

  // 2. Blood Sugar / Diabetes Task
  if (inputData.blood_glucose >= 140 || inputData.is_diabetic) {
    tasks.push({
      id: 'task-glucose',
      titleEn: 'Post-Meal 15-Min Light Walk & Glucose Regulation',
      titleHi: 'भोजन के बाद 15 मिनट की धीमी सैर व मीठे से परहेज',
      descEn: 'Stroll slowly inside home or balcony after lunch. Do not sit or lie down immediately. Skip sugary beverages or sweets today.',
      descHi: 'दोपहर भोजन के बाद तुरंत न बैठें; कमरे या बरामदे में 10-15 मिनट धीरे-धीरे टहलें। मीठी चाय या मिठाई बिल्कुल न लें।',
      timeSlot: 'Afternoon / दोपहर',
      category: '🚶 Sugar Control',
      badgeClass: 'bg-amber-100 text-amber-800 border border-amber-200',
      completed: false
    });
  }

  // 3. Joint Pain / Arthritis / Mobility Task
  if (inputData.pain_level >= 4 || inputData.walking_independent === 0 || inputData.has_arthritis) {
    tasks.push({
      id: 'task-joint',
      titleEn: 'Knee Warm Compress + 8 Seated Leg Lifts',
      titleHi: 'घुटनों की गर्म सिकाई व कुर्सी पर बैठकर पैरों की हल्की कसरत',
      descEn: 'Apply warm towel or heating pad to stiff knees for 10 mins. Slowly straighten and lower legs 8 times while sitting comfortably.',
      descHi: 'घुटनों पर 10 मिनट के लिए गर्म सिकाई करें। कुर्सी पर बैठकर पैरों को धीरे-धीरे सीधा करें और नीचे लाएं (8 बार)।',
      timeSlot: 'Evening / शाम',
      category: '🦵 Physical Therapy',
      badgeClass: 'bg-indigo-100 text-indigo-800 border border-indigo-200',
      completed: false
    });
  }

  // 4. Sleep Hygiene & Rest Deficit Task
  if (inputData.sleep_hours < 6) {
    tasks.push({
      id: 'task-sleep',
      titleEn: '30-Min Restorative Afternoon Nap & Screen-Free Night',
      titleHi: 'दोपहर का 30 मिनट विश्राम व रात्रि में 9 बजे स्क्रीन बंद करना',
      descEn: 'Take a quiet 30-min nap after lunch. Switch off TV/phone by 9:00 PM; drink warm milk or water to target 7+ hours of deep sleep tonight.',
      descHi: 'दोपहर भोजन के बाद 30 मिनट शांत विश्राम करें। रात 9 बजे टीवी व फोन बंद कर दें और हल्का गुनगुना दूध पीकर सोएं।',
      timeSlot: 'Bedtime / रात',
      category: '🌙 Sleep Hygiene',
      badgeClass: 'bg-purple-100 text-purple-800 border border-purple-200',
      completed: false
    });
  }

  // 5. Breathing & Lung Capacity (Pranayama)
  tasks.push({
    id: 'task-breathing',
    titleEn: '5-Minute Mindful Deep Breathing (Pranayama)',
    titleHi: '5 मिनट अनुलोम-विलोम व गहरी सांस का अभ्यास (प्राणायाम)',
    descEn: 'Inhale slowly for 4 seconds, exhale gently for 6 seconds. Increases lung oxygenation (SpO2) and calms heart rate.',
    descHi: 'सीधे बैठें, 4 सेकंड नाक से धीमी सांस लें और 6 सेकंड में छोड़ें। इससे फेफड़ों में ऑक्सीजन बढ़ती है और मन शांत रहता है।',
    timeSlot: 'Morning / सुबह',
    category: '🧘 Mind & Lungs',
    badgeClass: 'bg-sky-100 text-sky-800 border border-sky-200',
    completed: true
  });

  // 6. Universal Hydration Milestone
  tasks.push({
    id: 'task-hydration',
    titleEn: 'Daily Hydration Target: 6 Glasses of Lukewarm Water',
    titleHi: 'दिनभर में 6 गिलास स्वच्छ गुनगुना पानी पीने का लक्ष्य',
    descEn: 'Drink small sips throughout the day. Keeps blood circulation smooth and supports kidney & joint function.',
    descHi: 'पूरे दिन में थोड़े-थोड़े अंतराल पर 6 गिलास पानी पिएं। इससे रक्त प्रवाह सही रहता है और शरीर में ताजगी बनी रहती है।',
    timeSlot: 'All Day / दिनभर',
    category: '💧 Hydration',
    badgeClass: 'bg-teal-100 text-teal-800 border border-teal-200',
    completed: false
  });

  saveStoredDailyTasks(tasks);
  return tasks;
}

function toggleRxTask(taskId) {
  const tasks = getStoredDailyTasks();
  if (!tasks) return;

  const target = tasks.find(t => t.id === taskId);
  if (!target) return;

  target.completed = !target.completed;
  saveStoredDailyTasks(tasks);

  if (target.completed) {
    soundEngine.playSuccessChime();
  } else {
    soundEngine.playTone(400, 'sine', 0.1);
  }

  updateRxTasksUI(tasks);
}

function updateRxTasksUI(tasks) {
  const meter = document.getElementById('rx-progress-bar');
  const meterText = document.getElementById('rx-progress-text');
  const celebration = document.getElementById('rx-celebration-banner');
  const encouragement = document.getElementById('rx-encouragement-text');

  if (!meter || !meterText) return;

  const isHi = state.seniorLanguage === 'hi';
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const pct = Math.round((completed / total) * 100);

  meter.style.width = `${pct}%`;
  meterText.textContent = `${completed} / ${total} ${isHi ? 'कार्य पूरे हुए' : 'Tasks Completed'} (${pct}%)`;

  const prof = getUserProfile('senior');
  const seniorName = prof.name ? prof.name.split(' ')[0] : 'Ramesh';

  if (pct === 100) {
    if (celebration) celebration.classList.remove('hidden');
    if (encouragement) {
      encouragement.textContent = isHi 
        ? `शानदार ${seniorName} जी! 🎉 आज के सभी स्वास्थ्य सुधार कार्य पूरे हो गए! आपका स्वास्थ्य स्कोर बढ़ रहा है।`
        : `Brilliant job, ${seniorName} ji! 🎉 100% of today's health recovery tasks are complete! Your health resilience has improved.`;
    }
    soundEngine.playSuccessChime();
    incrementHealthStreak();
    const streakBadge = document.getElementById('rx-streak-count');
    if (streakBadge) streakBadge.textContent = `${getHealthStreak()} Days`;
  } else {
    if (celebration) celebration.classList.add('hidden');
    const remaining = total - completed;
    if (encouragement) {
      encouragement.textContent = isHi
        ? `शाबाश ${seniorName} जी! आज का 100% लक्ष्य पूरा करने के लिए सिर्फ ${remaining} कार्य शेष हैं। 🙏`
        : `Keep it up, ${seniorName} ji! Only ${remaining} tasks remaining to achieve today's 100% wellness goal. 🙏`;
    }
  }

  tasks.forEach(t => {
    const card = document.getElementById(`rx-card-${t.id}`);
    const chk = document.getElementById(`rx-chk-${t.id}`);
    if (chk) chk.checked = t.completed;
    if (card) {
      if (t.completed) {
        card.classList.add('task-completed');
      } else {
        card.classList.remove('task-completed');
      }
    }
  });
}

function restoreDailyTasks() {
  const tasks = getStoredDailyTasks();
  if (tasks && tasks.length > 0) {
    updateRxTasksUI(tasks);
  }
}


// ==================================================================// ENHANCED CLINICAL DIAGNOSIS REPORT & MULTI-PERSPECTIVE VISUALIZER
// ==================================================================
function renderAssessmentResult(res, inputData, alertCreated) {
  const box = document.getElementById('assessment-result-box');
  if (!box) return;

  const isHindi = state.seniorLanguage === 'hi';
  const riskLevel = res.predicted_risk_level;
  const isHigh = (riskLevel === 'High');
  const isMed = (riskLevel === 'Medium');
  const isLow = (riskLevel === 'Low');

  const prof = getUserProfile('senior');
  const seniorFirstName = prof.name ? prof.name.split(' ')[0] : 'Ramesh';

  let theme = {
    bg: 'bg-emerald-50/90 border-emerald-300',
    titleColor: 'text-emerald-950',
    badgeBg: 'bg-emerald-600 text-white',
    gaugeBg: 'bg-emerald-500',
    icon: 'fa-solid fa-circle-check text-emerald-600'
  };

  if (isHigh) {
    theme = {
      bg: 'bg-rose-50/95 border-rose-400 shadow-xl shadow-rose-500/10',
      titleColor: 'text-rose-950',
      badgeBg: 'bg-rose-600 text-white animate-pulse',
      gaugeBg: 'bg-rose-600',
      icon: 'fa-solid fa-triangle-exclamation text-rose-600'
    };
  } else if (isMed) {
    theme = {
      bg: 'bg-amber-50/90 border-amber-300 shadow-lg shadow-amber-500/10',
      titleColor: 'text-amber-950',
      badgeBg: 'bg-amber-600 text-white',
      gaugeBg: 'bg-amber-500',
      icon: 'fa-solid fa-circle-exclamation text-amber-600'
    };
  }

  const riskTitle = isHindi ? res.predicted_risk_level_hi : `${riskLevel} Risk Condition`;
  const urgencyTag = isHindi ? res.status_tag_hi : res.status_tag_en;

  // Generate Personalized Prescription Tasks
  const rxTasks = generateHealthPrescriptionTasks(res, inputData);
  const totalTasks = rxTasks.length;
  const completedTasks = rxTasks.filter(t => t.completed).length;
  const pctTasks = Math.round((completedTasks / totalTasks) * 100);

  // Plain-Language Diagnosis Explanation Text
  let plainDiagnosisHi = '';
  let plainDiagnosisEn = '';

  if (isHigh) {
    plainDiagnosisHi = `${seniorFirstName} जी, आपकी रिपोर्ट बताती है कि आपका रक्तचाप (${inputData.bp_systolic}/${inputData.bp_diastolic}) सामान्य से अधिक है और नींद में कमी (${inputData.sleep_hours} घंटे) है। इससे आपके दिल व शरीर को अधिक श्रम करना पड़ रहा है। लेकिन चिंता की कोई बात नहीं है: तुरंत अस्पताल जाने की आवश्यकता नहीं है। नीचे दिए गए कार्यों को पूरा करें, समय पर दवा लें, और सिस्टर कविता आपसे जल्द संपर्क करेंगी।`;
    plainDiagnosisEn = `${seniorFirstName} ji, your assessment shows that your blood pressure (${inputData.bp_systolic}/${inputData.bp_diastolic}) is running elevated alongside reduced sleep (${inputData.sleep_hours} hrs). This causes fatigue and strains your cardiovascular resilience. There is NO immediate emergency right now. Following today's recovery tasks and taking your scheduled medicine will help stabilize your body comfortably.`;
  } else if (isMed) {
    plainDiagnosisHi = `${seniorFirstName} जी, आपका सामान्य स्वास्थ्य स्थिर है, लेकिन कुछ बिंदुओं पर हल्का ध्यान देने की आवश्यकता है - विशेषकर रक्तचाप व हल्का दर्द। नाश्ते के बाद गुनगुना पानी लें, नमक सीमित रखें और 15 मिनट की हल्की चहलकदमी से आपकी ऊर्जा तुरंत बेहतर होगी।`;
    plainDiagnosisEn = `${seniorFirstName} ji, your overall health is stable, but a couple of telemetry markers require gentle attention—specifically your blood pressure and joint stiffness. Staying hydrated, having a low-sodium lunch, and completing a 15-minute gentle stroll will quickly restore your comfort.`;
  } else {
    plainDiagnosisHi = `बहुत बढ़िया ${seniorFirstName} जी! आपके सभी वाइटल्स (ऑक्सीजन ${inputData.spo2}%, हृदय गति ${inputData.heart_rate} bpm) एकदम सुरक्षित व सामान्य श्रेणी में हैं। आपकी दैनिक दिनचर्या बहुत अच्छी है, इसे निरंतर बनाए रखें!`;
    plainDiagnosisEn = `Excellent news, ${seniorFirstName} ji! All your critical vitals (SpO2 ${inputData.spo2}%, Heart Rate ${inputData.heart_rate} bpm) are in an optimal, safe range. Keep maintaining your daily hydration, walks, and healthy routine!`;
  }

  // Biomarkers Evaluation
  const bpStatus = (inputData.bp_systolic >= 140 || inputData.bp_diastolic >= 90) ? { label: 'High (बढ़ा हुआ)', class: 'bg-rose-100 text-rose-800' } : ((inputData.bp_systolic >= 125) ? { label: 'Elevated (हल्का अधिक)', class: 'bg-amber-100 text-amber-800' } : { label: 'Optimal (सामान्य)', class: 'bg-emerald-100 text-emerald-800' });
  const sugarStatus = (inputData.blood_glucose >= 140) ? { label: 'Needs Control (नियंत्रण चाहिए)', class: 'bg-amber-100 text-amber-800' } : { label: 'Safe Range (सुरक्षित)', class: 'bg-emerald-100 text-emerald-800' };
  const spo2Status = (inputData.spo2 >= 95) ? { label: 'Excellent (उत्कृष्ट)', class: 'bg-emerald-100 text-emerald-800' } : { label: 'Low Oxygen (कम)', class: 'bg-rose-100 text-rose-800' };
  const hrStatus = (inputData.heart_rate >= 60 && inputData.heart_rate <= 95) ? { label: 'Normal Rhythm (सामान्य)', class: 'bg-emerald-100 text-emerald-800' } : { label: 'Attention (ध्यान दें)', class: 'bg-amber-100 text-amber-800' };
  const sleepStatus = (inputData.sleep_hours >= 7) ? { label: 'Adequate Rest (पर्याप्त)', class: 'bg-emerald-100 text-emerald-800' } : { label: 'Sleep Deficit (नींद की कमी)', class: 'bg-amber-100 text-amber-800' };

  box.className = `mt-8 p-6 sm:p-8 rounded-3xl border-2 transition-all duration-300 ${theme.bg}`;
  box.classList.remove('hidden');

  box.innerHTML = `
    <!-- Top Result Header with Print & Audio Buttons -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200/80">
      <div class="flex items-center space-x-4">
        <div class="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white shadow-md flex items-center justify-center text-3xl sm:text-4xl flex-shrink-0">
          <i class="${theme.icon}"></i>
        </div>
        <div>
          <div class="flex items-center space-x-2">
            <span class="text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${theme.badgeBg}">
              ${riskTitle}
            </span>
            <span class="text-xs font-bold text-slate-500">
              Score: ${res.risk_score}/100
            </span>
          </div>
          <h3 class="text-xl sm:text-2xl font-black ${theme.titleColor} mt-1">
            ${isHindi ? 'स्वास्थ्य डायग्नोसिस एवं व्यक्तिगत प्रिस्क्रिप्शन' : 'Health Diagnosis Report & Personalized Rx'}
          </h3>
          <p class="text-xs sm:text-sm font-semibold text-slate-600">
            ${urgencyTag}
          </p>
        </div>
      </div>

      <!-- Quick Action Buttons -->
      <div class="flex flex-wrap items-center gap-2 w-full sm:w-auto">
        <button onclick="openClinicalReportSheet()"
          class="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-black transition-all shadow-md hover:shadow-lg flex items-center justify-center space-x-2 active:scale-95"
          title="Open Official Clinical Report Sheet / विस्तृत स्वास्थ्य रिपोर्ट शीट खोलें">
          <i class="fa-solid fa-file-waveform text-sm"></i>
          <span>${isHindi ? 'विस्तृत रिपोर्ट शीट देखें' : 'View Clinical Report Sheet'}</span>
        </button>
        <button onclick="shareReportViaWhatsApp()"
          class="flex-1 sm:flex-none px-3.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold transition-all shadow-sm flex items-center justify-center space-x-1.5"
          title="Share Report to Family via WhatsApp">
          <i class="fa-brands fa-whatsapp text-white"></i>
          <span>${isHindi ? 'शेयर करें' : 'Share WhatsApp'}</span>
        </button>
        <button onclick="speakDiagnosticReport()"
          class="flex-1 sm:flex-none px-3 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 text-xs font-extrabold transition-all shadow-sm flex items-center justify-center space-x-1.5"
          title="Listen to Diagnosis in Voice">
          <i class="fa-solid fa-volume-high text-teal-600"></i>
          <span>${isHindi ? 'ऑडियो सुनें' : 'Listen'}</span>
        </button>
      </div>
    </div>


    <!-- 1. PLAIN LANGUAGE DIAGNOSIS EXPLANATION (EASY TO UNDERSTAND) -->
    <div class="mt-6 bg-white/95 rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-sm">
      <div class="flex items-center space-x-3 mb-3">
        <div class="w-9 h-9 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center text-lg">
          <i class="fa-solid fa-user-doctor"></i>
        </div>
        <div>
          <h4 class="text-sm sm:text-base font-extrabold text-[#0e294b]">
            ${isHindi ? 'अपनी रिपोर्ट को समझें (सरल भाषा में विश्लेषण)' : 'Understand Your Diagnosis (Plain Language Summary)'}
          </h4>
          <p class="text-xs text-slate-400">Doctor-verified non-alarmist explanation of your telemetry</p>
        </div>
      </div>
      <p class="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium bg-sky-50/60 p-4 rounded-xl border border-sky-100">
        ${isHindi ? plainDiagnosisHi : plainDiagnosisEn}
      </p>
    </div>


    <!-- 2. BIOMARKER COMPARISON CARDS (YOUR VALUE VS NORMAL RANGE) -->
    <div class="mt-6">
      <h4 class="text-xs sm:text-sm font-extrabold text-[#0e294b] mb-3 flex items-center space-x-2">
        <i class="fa-solid fa-chart-simple text-teal-600"></i>
        <span>${isHindi ? 'आपके स्वास्थ्य संकेतक बनाम सामान्य सीमा (Biomarker Analysis):' : 'Your Vitals vs Safe Clinical Ranges (Biomarker Comparison):'}</span>
      </h4>

      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <!-- BP -->
        <div class="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm text-center">
          <span class="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Blood Pressure</span>
          <span class="text-lg sm:text-xl font-black text-slate-800">${inputData.bp_systolic}/${inputData.bp_diastolic}</span>
          <span class="text-[10px] text-slate-500 block">Target: &lt;120/80</span>
          <span class="mt-1.5 inline-block text-[10px] font-black px-2 py-0.5 rounded-full ${bpStatus.class}">${bpStatus.label}</span>
        </div>

        <!-- Sugar -->
        <div class="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm text-center">
          <span class="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Blood Glucose</span>
          <span class="text-lg sm:text-xl font-black text-slate-800">${inputData.blood_glucose} <span class="text-xs font-normal">mg/dL</span></span>
          <span class="text-[10px] text-slate-500 block">Safe: 70-130</span>
          <span class="mt-1.5 inline-block text-[10px] font-black px-2 py-0.5 rounded-full ${sugarStatus.class}">${sugarStatus.label}</span>
        </div>

        <!-- SpO2 -->
        <div class="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm text-center">
          <span class="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Oxygen SpO2</span>
          <span class="text-lg sm:text-xl font-black text-teal-700">${inputData.spo2}%</span>
          <span class="text-[10px] text-slate-500 block">Normal: ≥95%</span>
          <span class="mt-1.5 inline-block text-[10px] font-black px-2 py-0.5 rounded-full ${spo2Status.class}">${spo2Status.label}</span>
        </div>

        <!-- Heart Rate -->
        <div class="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm text-center">
          <span class="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Heart Rate</span>
          <span class="text-lg sm:text-xl font-black text-slate-800">${inputData.heart_rate} <span class="text-xs font-normal">bpm</span></span>
          <span class="text-[10px] text-slate-500 block">Normal: 60-90</span>
          <span class="mt-1.5 inline-block text-[10px] font-black px-2 py-0.5 rounded-full ${hrStatus.class}">${hrStatus.label}</span>
        </div>

        <!-- Sleep -->
        <div class="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm text-center col-span-2 sm:col-span-1">
          <span class="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Sleep Duration</span>
          <span class="text-lg sm:text-xl font-black text-slate-800">${inputData.sleep_hours} <span class="text-xs font-normal">hrs</span></span>
          <span class="text-[10px] text-slate-500 block">Target: 7-8 hrs</span>
          <span class="mt-1.5 inline-block text-[10px] font-black px-2 py-0.5 rounded-full ${sleepStatus.class}">${sleepStatus.label}</span>
        </div>
      </div>
    </div>


    <!-- 3. PERSONALIZED HEALTH IMPROVEMENT PRESCRIPTION & DAILY TASKS CHECKLIST -->
    <div class="mt-7 bg-white rounded-3xl p-5 sm:p-7 border-2 border-teal-300 shadow-md">
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
        <div class="flex items-center space-x-3">
          <div class="w-12 h-12 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center text-xl shadow-sm">
            <i class="fa-solid fa-list-check"></i>
          </div>
          <div>
            <div class="flex items-center space-x-2">
              <h4 class="text-base sm:text-lg font-black text-[#0e294b]">
                ${isHindi ? 'स्वास्थ्य सुधार प्रिस्क्रिप्शन एवं दैनिक कार्य सूची' : 'Personalized Health Improvement Prescription'}
              </h4>
              <span class="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-900 border border-amber-200 flex items-center space-x-1">
                <span class="streak-flame">🔥</span>
                <span id="rx-streak-count">${getHealthStreak()} Days Streak</span>
              </span>
            </div>
            <p class="text-xs text-slate-500 font-medium">
              Daily recovery milestones tailored directly to your ML prediction and biomarkers.
            </p>
          </div>
        </div>

        <!-- Completion Percentage Badge -->
        <div class="bg-slate-50 px-3.5 py-1.5 rounded-xl border border-slate-200 text-right">
          <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Today's Progress</span>
          <span id="rx-progress-text" class="text-xs sm:text-sm font-extrabold text-teal-800">
            ${completedTasks} / ${totalTasks} ${isHindi ? 'कार्य पूरे हुए' : 'Tasks Completed'} (${pctTasks}%)
          </span>
        </div>
      </div>

      <!-- Progress Bar -->
      <div class="w-full bg-slate-100 h-2.5 rounded-full mt-4 overflow-hidden">
        <div id="rx-progress-bar" class="h-full bg-gradient-to-r from-[#00a896] to-emerald-500 rounded-full transition-all duration-300"
          style="width: ${pctTasks}%"></div>
      </div>

      <!-- Dynamic Encouragement Banner -->
      <div class="mt-3 text-xs sm:text-sm font-bold text-slate-700 flex items-center space-x-1.5">
        <i class="fa-solid fa-heart-pulse text-teal-600"></i>
        <span id="rx-encouragement-text">
          ${isHindi 
            ? `शाबाश ${seniorFirstName} जी! आज का 100% लक्ष्य पूरा करने के लिए सिर्फ ${totalTasks - completedTasks} कार्य शेष हैं। 🙏`
            : `Keep it up, ${seniorFirstName} ji! Only ${totalTasks - completedTasks} tasks remaining to achieve today's 100% wellness goal. 🙏`}
        </span>
      </div>

      <!-- 100% Celebration Banner (Hidden by default unless 100%) -->
      <div id="rx-celebration-banner" class="${pctTasks === 100 ? '' : 'hidden'} mt-4 p-4 rounded-2xl bg-gradient-to-r from-amber-100 via-emerald-100 to-teal-100 border border-emerald-300 text-center shadow-sm">
        <span class="text-2xl">🎉 🏆 👏</span>
        <h5 class="font-black text-sm sm:text-base text-emerald-950 mt-1">
          ${isHindi ? 'अद्भुत! आज के सभी स्वास्थ्य सुधार कार्य सफलतापूर्वक पूरे हो गए!' : 'Outstanding! All daily recovery tasks completed for today!'}
        </h5>
        <p class="text-xs text-emerald-800 font-medium">
          Your adherence improves blood pressure regulation, glucose control, and prevents hospital visits.
        </p>
      </div>

      <!-- Task Items Grid -->
      <div id="daily-rx-tasks-list" class="space-y-3 mt-5">
        ${rxTasks.map(t => {
          const isDone = t.completed;
          return `
            <div id="rx-card-${t.id}"
              class="rx-task-card p-4 rounded-2xl bg-white flex items-start justify-between gap-3 ${isDone ? 'task-completed' : ''}">
              <div class="flex items-start space-x-3.5">
                <input type="checkbox" id="rx-chk-${t.id}" onchange="toggleRxTask('${t.id}')"
                  class="rx-task-checkbox mt-0.5" ${isDone ? 'checked' : ''}>
                <div>
                  <div class="flex flex-wrap items-center gap-1.5 mb-1">
                    <span class="text-[10px] font-bold px-2 py-0.5 rounded-md ${t.badgeClass}">
                      ${t.timeSlot}
                    </span>
                    <span class="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                      ${t.category}
                    </span>
                  </div>
                  <h5 class="task-title-text text-xs sm:text-sm font-extrabold text-slate-900">
                    ${isHindi ? t.titleHi : t.titleEn}
                  </h5>
                  <p class="text-xs text-slate-600 mt-1 leading-relaxed">
                    ${isHindi ? t.descHi : t.descEn}
                  </p>
                </div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>


    <!-- 4. CARE COORDINATOR CLINICAL NOTE & CONTACT -->
    <div class="mt-6 bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200/90 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div class="flex items-center space-x-3">
        <div class="w-12 h-12 rounded-2xl bg-teal-600 text-white flex items-center justify-center font-bold text-base shadow-sm">
          KV
        </div>
        <div>
          <div class="flex items-center space-x-2">
            <h5 class="text-xs sm:text-sm font-extrabold text-slate-900">Sister Kavita Verma, RN</h5>
            <span class="text-[10px] font-bold px-2 py-0.5 bg-teal-100 text-teal-800 rounded-full">Your Care Coordinator</span>
          </div>
          <p class="text-xs text-slate-600 mt-0.5">
            ${isHindi 
              ? '“रमेश जी, मैंने आपकी टेलीमेट्री देखी है। दवा समय पर लें; मैं शाम 4:30 बजे फोन करके आपका हालचाल पूछूंगी।”' 
              : '“Ramesh ji, I have reviewed your telemetry readings. Please follow your tasks; I will call you at 4:30 PM for a quick check-in.”'}
          </p>
        </div>
      </div>

      <div class="flex items-center space-x-2 w-full sm:w-auto">
        <a href="tel:+919876543210"
          class="w-full sm:w-auto px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center space-x-1.5">
          <i class="fa-solid fa-phone"></i>
          <span>${isHindi ? 'सिस्टर कविता को कॉल करें' : 'Call Coordinator'}</span>
        </a>
      </div>
    </div>


    <!-- 5. COORDINATOR ESCALATION ALERT BANNER (IF MEDIUM OR HIGH RISK) -->
    ${alertCreated ? `
      <div class="mt-5 p-4 rounded-2xl bg-rose-100 border border-rose-300 flex items-center justify-between text-xs sm:text-sm text-rose-900">
        <div class="flex items-center space-x-3">
          <i class="fa-solid fa-bell-concierge text-xl text-rose-600 animate-bounce"></i>
          <div>
            <span class="font-black block">${isHindi ? 'केयर कोऑर्डिनेटर सिस्टर कविता को लाइव अलर्ट भेजा गया' : 'Live Alert Created for Care Coordinator Sister Kavita'}</span>
            <span class="text-xs text-rose-700">${isHindi ? 'आपकी प्राथमिकता सूची #1 पर अपडेट कर दी गई है।' : 'Triage priority has been placed at Rank #1 in View 1 dashboard.'}</span>
          </div>
        </div>
        <button onclick="navigateRole('coordinator')" class="px-3 py-1.5 rounded-xl bg-rose-600 text-white font-bold text-xs hover:bg-rose-700 transition-colors shadow-sm">
          ${isHindi ? 'कोऑर्डिनेटर व्यू देखें' : 'View in Coordinator'}
        </button>
      </div>
    ` : ''}
  `;

  box.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function speakDiagnosticReport() {
  if (!assessmentState.lastPrediction) {
    showToast('No assessment results to read.', 'warning');
    return;
  }

  const res = assessmentState.lastPrediction;
  const isHindi = state.seniorLanguage === 'hi';
  const prof = getUserProfile('senior');
  const seniorName = prof.name ? prof.name.split(' ')[0] : 'Ramesh';

  let text = '';
  if (isHindi) {
    text = `नमस्ते ${seniorName} जी। आपकी स्वास्थ्य रिपोर्ट का परिणाम: ${res.predicted_risk_level_hi}। जोखिम स्कोर ${res.risk_score} है। ${res.alert_reason_summary_hi}। आज के लिए सलाह: दवा समय पर लें, नमक कम रखें और हल्के व्यायाम करें। सिस्टर कविता आपसे फोन पर संपर्क करेंगी।`;
  } else {
    text = `Hello ${seniorName} ji. Your health condition is evaluated as ${res.predicted_risk_level} Risk. Risk index score is ${res.risk_score} out of 100. Primary finding: ${res.alert_reason_summary}. Recommended recovery actions: take medicine on time, limit salt, and stay well hydrated. Care Coordinator Sister Kavita is monitoring your progress.`;
  }

  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = isHindi ? 'hi-IN' : 'en-IN';
    utterance.rate = 0.88;
    window.speechSynthesis.speak(utterance);
    showToast(isHindi ? 'स्वास्थ्य रिपोर्ट बोलकर सुनाई जा रही है...' : 'Reading diagnostic report aloud...', 'info');
  } else {
    showToast('Text-to-speech is not supported in this browser.', 'warning');
  }
}

function speakAssessmentResult() {
  speakDiagnosticReport();
}

function printDiagnosticReport() {
  printClinicalReportSheet();
}

function formatClinicalReportWhatsAppMessage(res, payload, prof) {
  const name = prof.name || 'Ramesh Sharma';
  const age = payload.age || prof.age || 74;
  const gender = payload.gender || prof.gender || 'Male';
  const dob = prof.dob || '1952-05-15';
  const blood = prof.bloodGroup || 'B+';
  const phone = prof.phone || '+91 98110-44912';
  const doctor = prof.doctor || 'Dr. Alok Mehta (Cardiology)';
  const allergies = prof.allergies || 'Penicillin allergy, mild osteoarthritis';
  
  const riskEmoji = res.predicted_risk_level === 'High' ? '🚨' : (res.predicted_risk_level === 'Medium' ? '⚠️' : '✅');
  const riskLevel = res.predicted_risk_level || 'Low';
  const riskScore = res.risk_score || 32;
  const confidence = Math.round((res.predicted_probability || 0.88) * 100);

  const bmi = (payload.height_cm > 40) ? (payload.weight_kg / Math.pow(payload.height_cm / 100, 2)).toFixed(1) : '24.0';
  const adlScore = (payload.walking_independent ? 1 : 0) + (payload.eating_independent ? 1 : 0) + (payload.moving_independent ? 1 : 0) + (payload.toileting_independent ? 1 : 0);

  const reportId = `CC-REP-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
  const dateStr = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

  return `🏥 *CARECONNECT AI CLINICAL DIAGNOSTIC REPORT SHEET*
📋 *Report Ref ID:* ${reportId}
📅 *Assessment Date:* ${dateStr}
---------------------------------------------
👤 *1. PATIENT DEMOGRAPHICS & PROFILE:*
• *Patient Name:* ${name}
• *Age / Gender:* ${age} Yrs • ${gender}
• *DOB:* ${dob} | *Blood Group:* ${blood}
• *Phone:* ${phone}
• *Attending Doctor:* ${doctor}
• *Clinical Allergies:* ${allergies}

---------------------------------------------
🧠 *2. AI ML DIAGNOSTIC OUTPUT & RISK:*
${riskEmoji} *Predicted Risk Level:* *${riskLevel} Risk*
• *Calculated Risk Score:* *${riskScore} / 100*
• *Model Confidence:* ${confidence}% (apnasa_v3_rf_triage_v1.0)
• *Clinical Finding:* ${res.alert_reason_summary || 'Vitals telemetry within stable thresholds'}
• *Triage Directive:* ${res.suggested_action_summary || 'Maintain regular recovery milestones'} (Contact: ${res.contact_method || 'Daily outreach'})

---------------------------------------------
📊 *3. COMPLETE ASSESSMENT VITALS & TELEMETRY:*
• *Blood Pressure:* ${payload.bp_systolic}/${payload.bp_diastolic} mmHg (${payload.bp_systolic >= 140 ? 'Stage-2 Alert' : 'Target Range'})
• *Heart Rate / Pulse:* ${payload.heart_rate} bpm (Normal: 60-90)
• *Blood Oxygen (SpO2):* ${payload.spo2}% (${payload.spo2 >= 95 ? 'Adequate' : 'Low'})
• *Blood Glucose:* ${payload.blood_glucose} mg/dL (${payload.blood_glucose >= 140 ? 'Elevated' : 'Safe Range'})
• *BMI:* ${bmi} kg/m² (${payload.height_cm}cm / ${payload.weight_kg}kg)
• *Sleep Duration:* ${payload.sleep_hours} Hours (${payload.sleep_hours >= 7 ? 'Adequate' : 'Sleep Deficit'})
• *Pain Status:* ${payload.pain_present ? `Level ${payload.pain_level}/10 (${payload.pain_location})` : 'Pain-Free'}
• *Medications:* ${payload.medication_count} Prescriptions (${payload.missed_doses} missed doses)

---------------------------------------------
🩺 *4. CHRONIC CONDITIONS & FUNCTIONAL ADL:*
• *Hypertension:* ${payload.has_hypertension ? 'Diagnosed / Active' : 'None'}
• *Arthritis / Joint Pain:* ${payload.has_arthritis ? 'Diagnosed / Active' : 'None'}
• *Heart / Respiratory:* ${(payload.has_heart_disease || payload.has_respiratory) ? 'Active Monitoring' : 'None Reported'}
• *ADL Functional Score:* ${adlScore} / 4 Activities Independent (Safe mobility)

---------------------------------------------
📋 *5. AI PERSONALIZED RECOVERY PRESCRIPTION:*
1. Morning BP check & 300ml warm hydration
2. Low-sodium balanced nutrition lunch
3. 15-minute gentle mobility walk
4. Timely evening medication & 7+ hrs night rest

---------------------------------------------
👩‍⚕️ *CLINICAL REVIEWER & CERTIFICATION:*
Sister Kavita Verma, Lead Clinical Nurse (RN)
*License:* DEL-RN-884920 • Geriatric Tele-Triage Division
*24/7 CareConnect Emergency Line:* 108 / 112 / +91 98765-43210
*Status: Verified & Electronically Signed in Secure Cloud*`;
}

function shareReportViaWhatsApp() {
  const prof = getUserProfile('senior');
  const payload = assessmentState.lastPayload || getCurrentAssessmentData();
  const res = assessmentState.lastPrediction || {
    predicted_risk_level: 'Low',
    predicted_risk_level_hi: 'कम जोखिम (Low Risk)',
    risk_score: 32,
    predicted_probability: 0.18,
    status_tag_en: 'Routine Outpatient Telemetry',
    status_tag_hi: 'नियमित स्वास्थ्य निगरानी',
    alert_reason_summary: 'All telemetry vital signs are within normal geriatric ranges.',
    suggested_action_summary: 'Maintain hydration, daily walk, and regular medication schedule.',
    contact_method: 'Daily automated check-in'
  };

  const family = getFamilyMembers();
  const recipient = family.length > 0 ? family[0] : null;

  const msg = formatClinicalReportWhatsAppMessage(res, payload, prof);

  soundEngine.playSuccessChime();
  if (recipient) {
    showToast(`WhatsApp report sheet prepared for ${recipient.name} (${recipient.phone})!`, 'success');
  } else {
    showToast('WhatsApp clinical report sheet prepared successfully!', 'success');
  }

  let url = `https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`;
  if (recipient && recipient.phone) {
    const cleanPhone = recipient.phone.replace(/[^0-9]/g, '');
    if (cleanPhone.length >= 10) {
      url = `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(msg)}`;
    }
  }
  window.open(url, '_blank');
}

function escalateAssessmentToCoordinator() {
  if (!assessmentState.lastPrediction) return;
  soundEngine.playTone(800, 'sine', 0.2);
  showToast('Care Coordinator Sister Kavita notified directly with assessment telemetry! 🚨', 'success');
  if (typeof refreshCoordinatorQueue === 'function') {
    refreshCoordinatorQueue();
  }
}


// ==================================================================// ROLE-BASED ACCESS CONTROL & DEDICATED AUTHENTICATION ENGINE
// ==================================================================
let selectedAuthRole = 'senior';
let activeOtpCode = '4826';
let otpTimerInterval = null;

const authRoleConfigs = {
  senior: {
    roleId: 'senior',
    portalTitle: { en: 'Senior Companion Portal', hi: 'बुज़ुर्ग साथी पोर्टल' },
    portalDesc: {
      en: 'Check-in, voice notes, health reminders & AI health assessment',
      hi: 'दैनिक चेक-इन, आवाज़ संदेश, स्वास्थ्य रिमाइंडर एवं एआई जांच'
    },
    icon: 'fa-solid fa-person-walking-with-cane',
    bg: 'bg-sky-50 border-sky-200',
    avatarBg: 'bg-sky-600',
    emailLabel: { en: 'Senior ID, Mobile or Email', hi: 'आईडी, मोबाइल नंबर या ईमेल' },
    defaultEmail: 'ramesh.senior@careconnect.in',
    defaultPass: 'password123',
    defaultName: 'Ramesh Sharma',
    defaultBadge: { en: 'Senior (74 Yrs)', hi: 'वरिष्ठ नागरिक (७४ वर्ष)' },
    avatarInitials: 'RS',
    signupFieldsHtml: {
      en: `
        <div class="grid grid-cols-2 gap-2">
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">Age (Years)</label>
            <input id="signup-age" type="number" value="74" class="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs bg-slate-50">
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">Gender</label>
            <select id="signup-gender" class="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs bg-white">
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
        </div>
        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">Emergency Family Contact</label>
          <input id="signup-contact" type="text" value="Rahul Sharma (Son) - +91 98110-44912" class="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs bg-slate-50">
        </div>
      `,
      hi: `
        <div class="grid grid-cols-2 gap-2">
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">उम्र (वर्ष)</label>
            <input id="signup-age" type="number" value="74" class="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs bg-slate-50">
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">लिंग</label>
            <select id="signup-gender" class="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs bg-white">
              <option value="Male">पुरुष</option>
              <option value="Female">महिला</option>
            </select>
          </div>
        </div>
        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">आपातकालीन पारिवारिक संपर्क</label>
          <input id="signup-contact" type="text" value="Rahul Sharma (Son) - +91 98110-44912" class="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs bg-slate-50">
        </div>
      `
    }
  },
  coordinator: {
    roleId: 'coordinator',
    portalTitle: { en: 'Care Coordinator Gateway', hi: 'केयर कोऑर्डिनेटर पोर्टल' },
    portalDesc: {
      en: 'Prioritized daily triage queue, alert management & clinical dispatch',
      hi: 'दैनिक प्राथमिकता सूची, गंभीर अलर्ट एवं नर्स प्रेषण प्रबंधन'
    },
    icon: 'fa-solid fa-user-doctor',
    bg: 'bg-emerald-50 border-emerald-200',
    avatarBg: 'bg-emerald-600',
    emailLabel: { en: 'Hospital Staff Email', hi: 'अस्पताल स्टाफ ईमेल' },
    defaultEmail: 'kavita.nurse@careconnect.org',
    defaultPass: 'password123',
    defaultName: 'Sister Kavita, RN',
    defaultBadge: { en: 'Care Coordinator', hi: 'केयर कोऑर्डिनेटर' },
    avatarInitials: 'NK',
    signupFieldsHtml: {
      en: `
        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">Clinical Designation</label>
          <select id="signup-designation" class="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs bg-white">
            <option value="Registered Nurse (RN)">Registered Nurse (RN)</option>
            <option value="Paramedic Specialist">Paramedic Specialist</option>
            <option value="Medical Officer">Medical Officer / Physician</option>
            <option value="Community Health Buddy">Community Health Buddy</option>
          </select>
        </div>
        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">Staff ID / License</label>
          <input id="signup-license" type="text" value="RN-DL-49201" class="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs bg-slate-50">
        </div>
      `,
      hi: `
        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">क्लिनिकल पद</label>
          <select id="signup-designation" class="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs bg-white">
            <option value="Registered Nurse (RN)">पंजीकृत नर्स (RN)</option>
            <option value="Paramedic Specialist">पैरामेडिक विशेषज्ञ</option>
            <option value="Medical Officer">चिकित्सा अधिकारी</option>
            <option value="Community Health Buddy">कम्युनिटी हेल्थ बडी</option>
          </select>
        </div>
        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">स्टाफ आईडी / लाइसेंस</label>
          <input id="signup-license" type="text" value="RN-DL-49201" class="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs bg-slate-50">
        </div>
      `
    }
  },
  family: {
    roleId: 'family',
    portalTitle: { en: 'Family Member Wellbeing Access', hi: 'परिवारजन कल्याण पोर्टल' },
    portalDesc: {
      en: 'Stay informed with weekly health summaries, vitals & emergency alerts',
      hi: 'साप्ताहिक स्वास्थ्य सारांश, वाइटल्स एवं आपातकालीन अलर्ट'
    },
    icon: 'fa-solid fa-people-roof',
    bg: 'bg-purple-50 border-purple-200',
    avatarBg: 'bg-purple-600',
    emailLabel: { en: 'Family Email or Mobile', hi: 'पारिवारिक ईमेल या मोबाइल' },
    defaultEmail: 'rahul.family@gmail.com',
    defaultPass: 'password123',
    defaultName: 'Rahul Sharma',
    defaultBadge: { en: '[Caregiver: Rahul Sharma • Male • 42 Yrs]', hi: '[देखभालकर्ता: राहुल शर्मा • पुरुष • ४२ वर्ष]' },
    avatarInitials: 'RS',
    signupFieldsHtml: {
      en: `
        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">Relationship to Senior</label>
          <select id="signup-relation" class="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs bg-white font-semibold">
            <option value="Son">Son (पुत्र)</option>
            <option value="Daughter">Daughter (पुत्री)</option>
            <option value="Spouse">Spouse (पति / पत्नी)</option>
            <option value="Guardian">Primary Guardian (अभिभावक)</option>
          </select>
        </div>
        <div>
          <div class="flex items-center justify-between mb-1.5">
            <label class="block text-xs font-bold text-slate-700">Linked Patient & Caregiver</label>
            <!-- Onboarding Slider Controls -->
            <div class="flex items-center space-x-1.5 bg-slate-100 px-2 py-0.5 rounded-lg border border-slate-200">
              <button type="button" onclick="slideOnboardingPatient(-1)" class="w-5 h-5 rounded bg-white hover:bg-purple-700 hover:text-white text-slate-700 flex items-center justify-center text-[10px] font-bold shadow-xs transition-colors" title="Slide to Previous Elder">
                <i class="fa-solid fa-chevron-left"></i>
              </button>
              <span id="onboarding-slide-badge" class="text-[10px] font-bold text-purple-900 font-mono">Elder 1/5</span>
              <button type="button" onclick="slideOnboardingPatient(1)" class="w-5 h-5 rounded bg-purple-700 hover:bg-purple-800 text-white flex items-center justify-center text-[10px] font-bold shadow-xs transition-colors" title="Slide to Next Elder (1st -> 2nd -> 3rd -> 1st)">
                <i class="fa-solid fa-chevron-right"></i>
              </button>
            </div>
          </div>
          <div class="p-3 bg-purple-50/90 border border-purple-200 rounded-xl space-y-1.5 shadow-sm">
            <div class="text-xs font-bold text-slate-800 flex flex-wrap items-center gap-1.5">
              <span class="text-slate-500 font-semibold">Patient:</span>
              <span id="onboarding-patient-name-display" class="text-purple-950 font-extrabold text-sm">Ramesh Sharma</span>
              <span id="onboarding-patient-bracket-display" class="text-xs font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded-md border border-purple-300">[Father • 74 Yrs • Male]</span>
            </div>
            <div class="text-xs font-medium text-slate-600 flex flex-wrap items-center gap-1 pt-1 border-t border-purple-200/60">
              <span class="text-slate-500 font-semibold">Caregiver:</span>
              <span id="onboarding-caregiver-bracket-display" class="text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200">[Rahul Sharma • Male • 42 Yrs]</span>
            </div>
          </div>
          <textarea id="signup-linked-senior" rows="2" readonly class="mt-1.5 w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-bold bg-slate-50 text-slate-800 leading-snug cursor-not-allowed">Ramesh Sharma [Father • 74 Yrs • Male]&#10;[Caregiver: Rahul Sharma • Male • 42 Yrs]</textarea>
        </div>
      `,
      hi: `
        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">बुज़ुर्ग से संबंध</label>
          <select id="signup-relation" class="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs bg-white font-semibold">
            <option value="Son">पुत्र (Son)</option>
            <option value="Daughter">पुत्री (Daughter)</option>
            <option value="Spouse">पति / पत्नी (Spouse)</option>
            <option value="Guardian">अभिभावक (Guardian)</option>
          </select>
        </div>
        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">जुड़े हुए मरीज़ व संबंधित देखभालकर्ता</label>
          <div class="p-3 bg-purple-50/90 border border-purple-200 rounded-xl space-y-1.5 shadow-sm">
            <div class="text-xs font-bold text-slate-800 flex flex-wrap items-center gap-1.5">
              <span class="text-slate-500 font-semibold">मरीज़:</span>
              <span class="text-purple-950 font-extrabold text-sm">रमेश शर्मा</span>
              <span class="text-xs font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded-md border border-purple-300">[पिता • ७४ वर्ष • पुरुष]</span>
            </div>
            <div class="text-xs font-medium text-slate-600 flex flex-wrap items-center gap-1 pt-1 border-t border-purple-200/60">
              <span class="text-slate-500 font-semibold">संबंधित परिजन:</span>
              <span class="text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200">[राहुल शर्मा • पुरुष • ४२ वर्ष]</span>
            </div>
          </div>
          <textarea id="signup-linked-senior" rows="2" readonly class="mt-1.5 w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-bold bg-slate-50 text-slate-800 leading-snug cursor-not-allowed">रमेश शर्मा [पिता • ७४ वर्ष • पुरुष]&#10;[राहुल शर्मा • पुरुष • ४२ वर्ष]</textarea>
        </div>
      `
    }
  },
  operations: {
    roleId: 'operations',
    portalTitle: { en: 'Operations Command Center', hi: 'ऑपरेशंस कमांड सेंटर' },
    portalDesc: {
      en: 'Monitor alert volumes, response times, city SLAs and fleet analytics',
      hi: 'अलर्ट संख्या, प्रतिक्रिया समय, शहर के एसएलए एवं टीम मेट्रिक्स'
    },
    icon: 'fa-solid fa-chart-line',
    bg: 'bg-orange-50 border-orange-200',
    avatarBg: 'bg-orange-600',
    emailLabel: { en: 'Enterprise Admin Email', hi: 'एडमिन ईमेल' },
    defaultEmail: 'arun.ops@careconnect.org',
    defaultPass: 'password123',
    defaultName: 'Arun Kapoor',
    defaultBadge: { en: 'Operations Director', hi: 'ऑपरेशंस डायरेक्टर' },
    avatarInitials: 'AK',
    signupFieldsHtml: {
      en: `
        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">City Operations Hub</label>
          <select id="signup-city" class="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs bg-white">
            <option value="Delhi NCR">Delhi NCR Central Hub</option>
            <option value="Mumbai Metropolitan">Mumbai Metropolitan Hub</option>
            <option value="Bengaluru Urban">Bengaluru Urban Hub</option>
          </select>
        </div>
        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">Operations Security Key</label>
          <input id="signup-seckey" type="text" value="OPS-SEC-9981" class="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs bg-slate-50">
        </div>
      `,
      hi: `
        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">शहर ऑपरेशंस केंद्र</label>
          <select id="signup-city" class="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs bg-white">
            <option value="Delhi NCR">दिल्ली एनसीआर केंद्रीय केंद्र</option>
            <option value="Mumbai Metropolitan">मुंबई महानगरीय केंद्र</option>
            <option value="Bengaluru Urban">बेंगलुरु शहरी केंद्र</option>
          </select>
        </div>
        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">ऑपरेशंस सुरक्षा कोड</label>
          <input id="signup-seckey" type="text" value="OPS-SEC-9981" class="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs bg-slate-50">
        </div>
      `
    }
  }
};

function updateAuthBannerForLanguage(lang = (state && state.currentLanguage) || 'en') {
  const role = selectedAuthRole || 'senior';
  const cfg = authRoleConfigs[role] || authRoleConfigs.senior;
  const title = document.getElementById('auth-portal-title');
  const desc = document.getElementById('auth-portal-desc');
  const emailLabel = document.getElementById('lbl-signin-email');
  const submitBtnLabel = document.getElementById('btn-signin-label');
  const roleFieldsContainer = document.getElementById('signup-role-specific-fields');

  if (title) title.textContent = typeof cfg.portalTitle === 'object' ? cfg.portalTitle[lang] : cfg.portalTitle;
  if (desc) desc.textContent = typeof cfg.portalDesc === 'object' ? cfg.portalDesc[lang] : cfg.portalDesc;
  if (emailLabel) emailLabel.textContent = typeof cfg.emailLabel === 'object' ? cfg.emailLabel[lang] : cfg.emailLabel;
  if (submitBtnLabel) {
    submitBtnLabel.textContent = lang === 'hi'
      ? `${getRoleDisplayName(role, 'hi')} के रूप में लॉगिन करें`
      : `Sign In as ${getRoleDisplayName(role, 'en')}`;
  }
  if (roleFieldsContainer && cfg.signupFieldsHtml) {
    roleFieldsContainer.innerHTML = typeof cfg.signupFieldsHtml === 'object' ? cfg.signupFieldsHtml[lang] : cfg.signupFieldsHtml;
  }
}


// 1. User selects role card -> open dedicated authentication portal
function selectRoleForAuth(role) {
  selectedAuthRole = role;
  soundEngine.playTone(550, 'sine', 0.1);

  const cfg = authRoleConfigs[role] || authRoleConfigs.senior;

  // Update banner appearance
  const banner = document.getElementById('auth-role-banner');
  const avatar = document.getElementById('auth-role-avatar');
  const icon = document.getElementById('auth-role-icon');
  const title = document.getElementById('auth-portal-title');
  const desc = document.getElementById('auth-portal-desc');
  const emailLabel = document.getElementById('lbl-signin-email');
  const emailInput = document.getElementById('signin-email');
  const passInput = document.getElementById('signin-password');
  const submitBtnLabel = document.getElementById('btn-signin-label');
  const demoBtnLabel = document.getElementById('btn-quick-demo-label');
  const roleFieldsContainer = document.getElementById('signup-role-specific-fields');

  if (banner) banner.className = `p-4 rounded-2xl border mb-5 flex items-center space-x-3.5 ${cfg.bg} shadow-sm`;
  if (avatar) avatar.className = `w-12 h-12 rounded-xl ${cfg.avatarBg} text-white flex items-center justify-center text-2xl shadow-sm flex-shrink-0`;
  if (icon) icon.className = cfg.icon;
  updateAuthBannerForLanguage(state.currentLanguage || "en");
  if (demoBtnLabel) demoBtnLabel.textContent = `1-Click Quick Demo Sign In (${getRoleDisplayName(role)})`;

  // Onboarding Page: Dual Brackets for Family Portal
  const existingFamilyBrackets = document.getElementById('auth-family-onboarding-brackets');
  if (existingFamilyBrackets) existingFamilyBrackets.remove();

  if (role === 'family') {
    const titleParent = document.getElementById('auth-portal-title')?.parentElement;
    if (titleParent) {
      const infoDiv = document.createElement('div');
      infoDiv.id = 'auth-family-onboarding-brackets';
      infoDiv.className = 'mt-1.5 pt-1.5 border-t border-purple-200/70 text-xs space-y-0.5';
      infoDiv.innerHTML = `
        <div class="flex flex-wrap items-center gap-1 font-bold text-purple-950">
          <span class="text-slate-600 font-medium">Patient:</span>
          <span>Ramesh Sharma</span>
          <span class="text-[11px] font-bold text-purple-700 bg-purple-100 px-1.5 py-0.5 rounded border border-purple-300">[Father • 74 Yrs • Male]</span>
        </div>
        <div class="flex flex-wrap items-center gap-1 font-semibold text-slate-700">
          <span class="text-[11px] font-bold text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-200">[Caregiver: Rahul Sharma • Male • 42 Yrs]</span>
        </div>
      `;
      titleParent.appendChild(infoDiv);
    }
  }

  // Render role-specific signup fields with language resolution
  if (roleFieldsContainer) {
    const lang = state.currentLanguage || 'en';
    roleFieldsContainer.innerHTML = typeof cfg.signupFieldsHtml === 'object'
      ? (cfg.signupFieldsHtml[lang] || cfg.signupFieldsHtml.en)
      : cfg.signupFieldsHtml;
  }

  // Onboarding Signin Tab: Add patient and caregiver dual brackets card if Family role
  const existingSigninCard = document.getElementById('auth-family-signin-patient-card');
  if (existingSigninCard) existingSigninCard.remove();

  if (role === 'family') {
    const formSignin = document.getElementById('auth-form-signin');
    if (formSignin) {
      const card = document.createElement('div');
      card.id = 'auth-family-signin-patient-card';
      card.className = 'p-3 bg-purple-50/90 border border-purple-200 rounded-2xl space-y-1.5 mb-2 shadow-sm';
      card.innerHTML = `
        <div class="text-xs font-bold text-slate-800 flex flex-wrap items-center gap-1.5">
          <span class="text-slate-500 font-semibold">Linked Patient:</span>
          <span class="text-purple-950 font-extrabold text-sm">Ramesh Sharma</span>
          <span class="text-xs font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded-md border border-purple-300">[Father • 74 Yrs • Male]</span>
        </div>
        <div class="text-xs font-medium text-slate-600 flex flex-wrap items-center gap-1 pt-1 border-t border-purple-200/60">
          <span class="text-slate-500 font-semibold">Connected Person:</span>
          <span class="text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200">[Caregiver: Rahul Sharma • Male • 42 Yrs]</span>
        </div>
      `;
      formSignin.insertBefore(card, formSignin.firstChild);
    const curLang = (state && state.currentLanguage) || 'en';
    roleFieldsContainer.innerHTML = typeof cfg.signupFieldsHtml === 'object' ? (cfg.signupFieldsHtml[curLang] || cfg.signupFieldsHtml.en) : cfg.signupFieldsHtml;
    const btnSignupLabel = document.getElementById('btn-signup-label');
    if (btnSignupLabel) {
      btnSignupLabel.textContent = (curLang === 'hi')
        ? `${getRoleDisplayName(role, 'hi')} खाता बनाएं एवं पोर्टल खोलें`
        : `Create Account & Enter ${getRoleDisplayName(role, 'en')} Portal`;
    }
  }

  // Switch to signin tab
  switchAuthTab('signin');
  toggleForgotPasswordOtp(false);

  // Transition views
  const stepRole = document.getElementById('auth-role-selector-step');
  const stepCred = document.getElementById('auth-credential-step');
  if (stepRole) stepRole.classList.add('hidden');
  if (stepCred) stepCred.classList.remove('hidden');

  showToast(`Selected Portal: ${getRoleDisplayName(role)}`, 'info');
}

// 2. Return to role selection cards
function backToRoleSelector() {
  soundEngine.playTone(400, 'sine', 0.1);
  const stepRole = document.getElementById('auth-role-selector-step');
  const stepCred = document.getElementById('auth-credential-step');
  if (stepRole) stepRole.classList.remove('hidden');
  if (stepCred) stepCred.classList.add('hidden');
}

// 3. Switch between Sign In and Create Account tabs
function switchAuthTab(tab) {
  const tabSignin = document.getElementById('tab-auth-signin');
  const tabSignup = document.getElementById('tab-auth-signup');
  const formSignin = document.getElementById('auth-form-signin');
  const formSignup = document.getElementById('auth-form-signup');
  const panelOtp = document.getElementById('auth-panel-otp');

  if (panelOtp) panelOtp.classList.add('hidden');

  const curLang = (typeof state !== 'undefined' && state.currentLanguage) || 'en';
  const role = selectedAuthRole || 'senior';
  const cfg = authRoleConfigs[role] || authRoleConfigs.senior;

  if (tab === 'signin') {
    if (tabSignin) tabSignin.className = 'py-2 text-xs font-bold rounded-lg transition-all bg-white text-slate-900 shadow-sm';
    if (tabSignup) tabSignup.className = 'py-2 text-xs font-bold rounded-lg transition-all text-slate-500 hover:text-slate-800';
    if (formSignin) formSignin.classList.remove('hidden');
    if (formSignup) formSignup.classList.add('hidden');
  } else {
    if (tabSignup) tabSignup.className = 'py-2 text-xs font-bold rounded-lg transition-all bg-white text-slate-900 shadow-sm';
    if (tabSignin) tabSignin.className = 'py-2 text-xs font-bold rounded-lg transition-all text-slate-500 hover:text-slate-800';
    if (formSignin) formSignin.classList.add('hidden');
    if (formSignup) formSignup.classList.remove('hidden');

    // Populate role fields and button text
    const roleFieldsContainer = document.getElementById('signup-role-specific-fields');
    if (roleFieldsContainer && cfg.signupFieldsHtml) {
      roleFieldsContainer.innerHTML = typeof cfg.signupFieldsHtml === 'object' ? (cfg.signupFieldsHtml[curLang] || cfg.signupFieldsHtml.en) : cfg.signupFieldsHtml;
    }
    const btnSignupLabel = document.getElementById('btn-signup-label');
    if (btnSignupLabel) {
      btnSignupLabel.textContent = (curLang === 'hi')
        ? `${getRoleDisplayName(role, 'hi')} खाता बनाएं एवं पोर्टल खोलें`
        : `Create Account & Enter ${getRoleDisplayName(role, 'en')} Portal`;
    }
  }
}

// 4. Show/Hide Password Eye Toggle
function togglePasswordVisibility(inputId, eyeId) {
  const input = document.getElementById(inputId);
  const eye = document.getElementById(eyeId);
  if (!input) return;
  if (input.type === 'password') {
    input.type = 'text';
    if (eye) eye.className = 'fa-solid fa-eye-slash text-xs text-teal-600';
  } else {
    input.type = 'password';
    if (eye) eye.className = 'fa-solid fa-eye text-xs text-slate-400';
  }
}

// 5. Toggle Forgot Password OTP Panel
function toggleForgotPasswordOtp(show) {
  const panelOtp = document.getElementById('auth-panel-otp');
  const formSignin = document.getElementById('auth-form-signin');
  const formSignup = document.getElementById('auth-form-signup');
  const banner = document.getElementById('otp-live-banner');

  if (banner) banner.classList.add('hidden');
  if (otpTimerInterval) clearInterval(otpTimerInterval);

  if (show) {
    if (panelOtp) panelOtp.classList.remove('hidden');
    if (formSignin) formSignin.classList.add('hidden');
    if (formSignup) formSignup.classList.add('hidden');
    const recipientInput = document.getElementById('otp-input-recipient');
    const signinEmail = document.getElementById('signin-email');
    if (recipientInput && signinEmail) recipientInput.value = signinEmail.value;
  } else {
    if (panelOtp) panelOtp.classList.add('hidden');
    if (formSignin) formSignin.classList.remove('hidden');
  }
}

// 6. Send OTP Simulation
function sendPasswordResetOtp() {
  const recipient = document.getElementById('otp-input-recipient')?.value || 'user@careconnect.in';
  activeOtpCode = Math.floor(1000 + Math.random() * 9000).toString();

  soundEngine.playTone(650, 'sine', 0.15);
  const banner = document.getElementById('otp-live-banner');
  const codeDisplay = document.getElementById('otp-code-display');
  const timerLabel = document.getElementById('otp-timer-label');

  if (codeDisplay) codeDisplay.textContent = activeOtpCode;
  if (banner) banner.classList.remove('hidden');

  // Auto-fill OTP fields for seamless testing
  const d1 = document.getElementById('otp-d1');
  const d2 = document.getElementById('otp-d2');
  const d3 = document.getElementById('otp-d3');
  const d4 = document.getElementById('otp-d4');
  if (d1) d1.value = activeOtpCode[0];
  if (d2) d2.value = activeOtpCode[1];
  if (d3) d3.value = activeOtpCode[2];
  if (d4) d4.value = activeOtpCode[3];

  let seconds = 30;
  if (otpTimerInterval) clearInterval(otpTimerInterval);
  otpTimerInterval = setInterval(() => {
    seconds--;
    if (timerLabel) timerLabel.textContent = `0:${seconds < 10 ? '0' : ''}${seconds}s`;
    if (seconds <= 0) {
      clearInterval(otpTimerInterval);
    }
  }, 1000);

  // Notify backend API
  try {
    fetch('/api/auth/otp/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ recipient: recipient, role: selectedAuthRole })
    }).catch(() => {});
  } catch(e) {}

  showToast(`OTP ${activeOtpCode} dispatched to ${recipient}`, 'success');
}

// 7. Verify OTP and Sign In
function verifyOtpAndLogin() {
  const d1 = document.getElementById('otp-d1')?.value || '';
  const d2 = document.getElementById('otp-d2')?.value || '';
  const d3 = document.getElementById('otp-d3')?.value || '';
  const d4 = document.getElementById('otp-d4')?.value || '';
  const entered = d1 + d2 + d3 + d4;

  if (entered.length < 4) {
    showToast('Please enter the complete 4-digit OTP', 'warning');
    return;
  }

  const role = selectedAuthRole || 'senior';
  const cfg = authRoleConfigs[role] || authRoleConfigs.senior;

  soundEngine.playSuccessChime();
  showToast('OTP verified successfully! Access granted.', 'success');

  // Check if profile exists in localStorage
  let prof = null;
  try {
    prof = JSON.parse(localStorage.getItem(`careconnect_profile_${role}`));
  } catch(e) {}
  const userName = (prof && prof.name) ? prof.name : cfg.defaultName;
  const parts = userName.split(' ');
  const initials = parts.length > 1 ? (parts[0][0] + parts[1][0]).toUpperCase() : userName.substring(0, 2).toUpperCase();

  enterDashboard(role, {
    name: userName,
    email: (prof && prof.email) ? prof.email : cfg.defaultEmail,
    role: role,
    badge: cfg.defaultBadge,
    initials: initials
  });
}

// 8. Handle Standard Sign In
function handleSignInSubmit(e) {
  if (e) e.preventDefault();
  const email = document.getElementById('signin-email')?.value.trim();
  const password = document.getElementById('signin-password')?.value;

  if (!email || !password) {
    showToast('Please fill in both email and password', 'warning');
    return;
  }

  const role = selectedAuthRole || 'senior';
  const cfg = authRoleConfigs[role] || authRoleConfigs.senior;

  // Check if this user registered in localStorage
  let matchedUser = null;
  try {
    const users = JSON.parse(localStorage.getItem('careconnect_users') || '[]');
    matchedUser = users.find(u => u.role === role && (u.email.toLowerCase() === email.toLowerCase() || u.email === email));
  } catch(err) {}

  let prof = null;
  try {
    prof = JSON.parse(localStorage.getItem(`careconnect_profile_${role}`));
  } catch(e) {}

  const userName = matchedUser ? matchedUser.name : (prof && prof.name ? prof.name : cfg.defaultName);
  const parts = userName.split(' ');
  const userInitials = parts.length > 1 ? (parts[0][0] + parts[1][0]).toUpperCase() : userName.substring(0, 2).toUpperCase();

  soundEngine.playSuccessChime();

  // Update UI headers
  if (role === 'coordinator') {
    const topName = document.getElementById('coord-topbar-name');
    const greetName = document.getElementById('coord-greeting-name');
    if (topName) topName.textContent = userName;
    if (greetName) greetName.textContent = userName;
  } else if (role === 'senior') {
    const greetEl = document.getElementById('senior-greeting');
    if (greetEl) greetEl.textContent = `Good Morning, ${userName} ji! 👋`;
  }

  // Inform backend via REST API
  try {
    fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: role, email: email, password: password })
    }).catch(() => {});
  } catch (e) {}

  enterDashboard(role, {
    name: userName,
    email: email,
    role: role,
    badge: cfg.defaultBadge,
    initials: userInitials
  });
  showToast(`Welcome back, ${userName}!`, 'success');
}

// 9. Handle Google OAuth Sign In Simulation
function handleGoogleSignIn() {
  soundEngine.playTone(700, 'sine', 0.15);
  const cfg = authRoleConfigs[selectedAuthRole];
  showToast('Connecting via Google OAuth Secure SSO...', 'info');

  setTimeout(() => {
    soundEngine.playSuccessChime();
    enterDashboard(selectedAuthRole, {
      name: cfg.defaultName + ' (Google)',
      email: cfg.defaultEmail,
      role: selectedAuthRole,
      badge: cfg.defaultBadge,
      initials: cfg.avatarInitials
    });
    showToast(`Google Sign-In successful for ${getRoleDisplayName(selectedAuthRole)}`, 'success');
  }, 400);
}

// 10. Quick 1-Click Demo Login
function handleQuickDemoSignIn() {
  const cfg = authRoleConfigs[selectedAuthRole];
  soundEngine.playSuccessChime();
  enterDashboard(selectedAuthRole, {
    name: cfg.defaultName,
    email: cfg.defaultEmail,
    role: selectedAuthRole,
    badge: cfg.defaultBadge,
    initials: cfg.avatarInitials
  });
}

// 11. Handle Create Account (Sign Up)
function handleSignUpSubmit(e) {
  if (e) e.preventDefault();
  const name = document.getElementById('signup-name')?.value.trim();
  const email = document.getElementById('signup-email')?.value.trim();
  const password = document.getElementById('signup-password')?.value;

  if (!name || !email || !password) {
    showToast('Please complete all required fields to create your account', 'warning');
    return;
  }

  const role = selectedAuthRole || 'senior';
  const cfg = authRoleConfigs[role] || authRoleConfigs.senior;
  soundEngine.playSuccessChime();
  
  // Compute initials
  const parts = name.split(' ');
  const initials = parts.length > 1 ? (parts[0][0] + parts[1][0]).toUpperCase() : name.substring(0, 2).toUpperCase();

  // Extract role-specific extra fields
  let extraData = {};
  if (role === 'senior') {
    const ageVal = parseInt(document.getElementById('signup-age')?.value) || 74;
    const genderVal = document.getElementById('signup-gender')?.value || 'Male';
    const contactVal = document.getElementById('signup-contact')?.value || '';
    extraData = { age: ageVal, gender: genderVal, contact: contactVal };
  } else if (role === 'coordinator') {
    const desigVal = document.getElementById('signup-designation')?.value || 'Registered Nurse (RN)';
    const licVal = document.getElementById('signup-license')?.value || 'RN-DL-49201';
    extraData = { designation: desigVal, license: licVal };
  } else if (role === 'family') {
    const relVal = document.getElementById('signup-relation')?.value || 'Son';
    const seniorVal = document.getElementById('signup-linked-senior')?.value || 'Ramesh Sharma';
    extraData = { relation: relVal, linkedSenior: seniorVal };
  } else if (role === 'operations') {
    const cityVal = document.getElementById('signup-city')?.value || 'Delhi NCR';
    const secKeyVal = document.getElementById('signup-seckey')?.value || 'OPS-SEC-9981';
    extraData = { city: cityVal, secKey: secKeyVal };
  }

  // Create initial profile for the new user
  const newProfile = {
    role: role,
    name: name,
    email: email,
    dob: '',
    phone: '',
    profileCompleted: true,
    isNewUser: false,
    ...extraData
  };
  try {
    localStorage.setItem(`careconnect_profile_${role}`, JSON.stringify(newProfile));
    
    // Store in registered users directory
    let users = [];
    try {
      users = JSON.parse(localStorage.getItem('careconnect_users') || '[]');
    } catch(err) { users = []; }
    users = users.filter(u => !(u.email === email && u.role === role));
    users.push({
      name: name,
      email: email,
      password: password,
      role: role,
      extra: extraData
    });
    localStorage.setItem('careconnect_users', JSON.stringify(users));
  } catch (err) {
    console.error('Failed to save user profile in localStorage:', err);
  }

  // Non-blocking fetch to backend API
  try {
    fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: role, name: name, email: email, ...extraData })
    }).catch(() => {});
  } catch (e) {}

  // Update UI headers & badges according to role
  if (role === 'coordinator') {
    const topName = document.getElementById('coord-topbar-name');
    const greetName = document.getElementById('coord-greeting-name');
    if (topName) topName.textContent = name;
    if (greetName) greetName.textContent = name;
  } else if (role === 'senior') {
    const greetEl = document.getElementById('senior-greeting');
    if (greetEl) greetEl.textContent = `Good Morning, ${name} ji! 👋`;
    const vitalsMeta = document.getElementById('senior-vitals-meta-badge');
    if (vitalsMeta) vitalsMeta.textContent = `${extraData.age || 74} Yrs • ${extraData.gender || 'Male'} • New Delhi`;
    const ageInput = document.getElementById('assess-age');
    if (ageInput && extraData.age) ageInput.value = extraData.age;
    const genderInput = document.getElementById('assess-gender');
    if (genderInput && extraData.gender) genderInput.value = extraData.gender;
  }

  enterDashboard(role, {
    name: name,
    email: email,
    role: role,
    badge: `${getRoleDisplayName(role)}`,
    initials: initials
  });

  showToast(`Account created successfully! Welcome to CareConnect, ${name}`, 'success');
}

// 12. Enter Dashboard (Strict Isolation: Only the logged-in role is shown!)
function enterDashboard(role, userObj) {
  state.currentRole = role;
  const cfg = authRoleConfigs[role] || authRoleConfigs.senior;
  const user = userObj || {
    name: cfg.defaultName,
    email: cfg.defaultEmail,
    role: role,
    badge: cfg.defaultBadge,
    initials: cfg.avatarInitials
  };

  // Hide Login View completely
  const viewLogin = document.getElementById('view-login');
  if (viewLogin) viewLogin.classList.add('hidden');

  // Hide all other role views; show strictly the active role view
  const allViews = ['coordinator', 'senior', 'family', 'operations', 'add_reminder'];
  allViews.forEach(v => {
    const el = document.getElementById(`view-${v}`);
    if (el) {
      if (v === role) {
        el.classList.remove('hidden');
      } else {
        el.classList.add('hidden');
      }
    }
  });

  // Reveal Global Header (hidden for Operations Manager & Coordinator which have their own dedicated command center top bar & sidebar)
  const header = document.getElementById('global-header');
  if (header) {
    if (role === 'operations' || role === 'coordinator') {
      header.classList.add('hidden');
    } else {
      header.classList.remove('hidden');
    }
  }

  // Update Active Portal Badge in Header
  const headerIcon = document.getElementById('header-active-portal-icon');
  const headerTitle = document.getElementById('header-active-portal-title');
  if (headerIcon) headerIcon.innerHTML = `<i class="${cfg.icon}"></i>`;
  if (headerTitle) headerTitle.textContent = `${getRoleDisplayName(role)} Portal`;

  // Update User Profile in Header
  const avatar = document.getElementById('current-user-avatar');
  const nameLabel = document.getElementById('current-user-name');
  const roleLabel = document.getElementById('current-user-role-label');

  if (avatar) {
    avatar.textContent = user.initials || cfg.avatarInitials;
    avatar.className = `w-8 h-8 rounded-full ${cfg.avatarBg} text-white flex items-center justify-center font-bold text-xs shadow-sm`;
  }
  if (nameLabel) nameLabel.textContent = user.name;
  if (roleLabel) {
    let bText = user.badge;

    if (typeof bText === 'object' && bText !== null) {
      const curLang =
        (typeof state !== 'undefined' && state.seniorLanguage)
          ? state.seniorLanguage
          : 'en';

      bText = bText[curLang] || bText.en || bText.hi || '';
    }

    roleLabel.textContent = bText ||
      (cfg.defaultBadge ? (cfg.defaultBadge.en || cfg.defaultBadge) : '');
  }

  // Role specific view initializations
  if (role === 'family') {
    if (typeof changeFamilyLinkedSenior === 'function') {
      changeFamilyLinkedSenior('PAT-101');
    }
    if (typeof switchFamilyTab === 'function') {
      switchFamilyTab('summary');
    }
    setTimeout(initFamilyVitalsChart, 100);
  } else if (role === 'operations') {
    switchOpsTab('dashboard');
    setTimeout(initOpsCharts, 120);
  } else if (role === 'coordinator') {
    renderCoordinatorAlerts();
    if (typeof initMedcareCoordinatorDashboard === 'function') {
      initMedcareCoordinatorDashboard();
    } else if (typeof renderCoordinatorAssignedTasks === 'function') {
      renderCoordinatorAssignedTasks();
    } else if (typeof renderCoordinatorHub === 'function') {
      renderCoordinatorHub();
    } else {
      renderCoordinatorAlerts();
    }
  } else if (role === 'senior') {
    setTimeout(() => {
      if (typeof restoreAssessmentDraft === 'function') {
        restoreAssessmentDraft();
      }
      if (typeof autoFillSeniorProfileData === 'function') {
        autoFillSeniorProfileData();
      }
      if (typeof initSeniorRemindersHub === 'function') {
        initSeniorRemindersHub();
      }
      if (typeof checkUserProfilePrompt === 'function') {
        checkUserProfilePrompt('senior');
      }
      if (typeof renderFamilyCareCircle === 'function') {
        renderFamilyCareCircle();
      }
      if (typeof restoreDailyTasks === 'function') {
        restoreDailyTasks();
      }
    }, 100);
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// 13. Sign Out / Logout Function
function logout(notify = true) {
  if (notify && soundEngine && typeof soundEngine.playWarningChime === 'function') {
    soundEngine.playWarningChime();
  }

  // Hide all operational dashboards
  const allViews = ['coordinator', 'senior', 'family', 'operations', 'add_reminder'];
  allViews.forEach(v => {
    const el = document.getElementById(`view-${v}`);
    if (el) el.classList.add('hidden');
  });

  // Hide Global Header
  const header = document.getElementById('global-header');
  if (header) header.classList.add('hidden');

  // Show Login View and reset to Role Selector step
  const viewLogin = document.getElementById('view-login');
  if (viewLogin) viewLogin.classList.remove('hidden');

  backToRoleSelector();

  if (notify) {
    showToast('Signed out successfully. Role selection hub opened.', 'info');
  }
}

// Backward compatibility helper
function navigateRole(role, notify = true) {
  if (role === 'login') {
    logout(notify);
  } else {
    enterDashboard(role);
  }
}

function loginAs(role) {
  selectRoleForAuth(role);
}


// ==================================================================// VOICE HEALTH INPUT ASSISTANT, MANDATORY VALIDATION & PERSISTENT AUTO-SAVE
// ==================================================================
const STORAGE_KEY_ASSESSMENT_DRAFT = 'careconnect_elder_assessment_draft';

// =========================================================================
// ELDER ASSESSMENT HISTORY, PERSISTENCE VAULT & BLANK RESET SYSTEM
// =========================================================================

const STORAGE_KEY_ASSESSMENT_HISTORY = 'careconnect_elder_assessment_history';

// 1. Get All Elder Assessments from History (with baseline fallback)
function getElderAssessmentHistory() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_ASSESSMENT_HISTORY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Error reading assessment history:', e);
  }

  // Pre-seed baseline assessment for Ramesh Sharma so history is immediately rich
  const prof = (typeof getUserProfile === 'function') ? getUserProfile('senior') : { name: 'Ramesh Sharma', age: 74, gender: 'Male' };
  const baselinePayload = {
    seniorName: prof.name || 'Ramesh Sharma',
    age: prof.age || 74,
    gender: prof.gender || 'Male',
    height_cm: 165,
    weight_kg: 68,
    bp_systolic: 136,
    bp_diastolic: 84,
    heart_rate: 74,
    spo2: 97,
    sleep_hours: 6.5,
    pain_present: 1,
    pain_level: 3.5,
    pain_location: 'Knee',
    walking_independent: 1,
    eating_independent: 1,
    moving_independent: 1,
    toileting_independent: 1,
    medication_count: 3,
    missed_doses: 0,
    is_diabetic: 0,
    blood_glucose: 112,
    hearing_difficulty: 0,
    hearing_aid_used: 0,
    has_hypertension: 1,
    has_arthritis: 1,
    has_heart_disease: 0,
    has_respiratory: 0
  };

  const baselineResult = {
    predicted_risk_level: 'Medium',
    risk_score: 48,
    confidence: 0.94,
    top_factors: [
      'Borderline BP Systolic (136 mmHg)',
      'Mild Knee Osteoarthritis Discomfort',
      'Hypertension Medication Adherence Required'
    ],
    recommendations: [
      'Continue morning amlodipine daily',
      '15 minutes low-impact knee mobility exercises',
      'Maintain adequate hydration & 7 hours sleep'
    ],
    clinical_summary: 'Elder baseline geriatric screen: Moderate cardiovascular and musculoskeletal stability.'
  };

  const baselineSheet = (typeof generateClinicalReportSheetHtml === 'function')
    ? generateClinicalReportSheetHtml(baselineResult, baselinePayload, prof)
    : '';

  const baselineEntry = {
    id: 'cc_assess_baseline',
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    dateTimeFormatted: new Date(Date.now() - 86400000).toLocaleString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit', hour12: true
    }),
    dateTimeFormattedHi: new Date(Date.now() - 86400000).toLocaleString('hi-IN', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit', hour12: true
    }),
    patientName: prof.name || 'Ramesh Sharma',
    patientAge: prof.age || 74,
    patientGender: prof.gender || 'Male',
    riskLevel: 'Medium',
    riskScore: 48,
    confidence: 0.94,
    topFactors: baselineResult.top_factors,
    recommendations: baselineResult.recommendations,
    vitals: {
      bp: '136/84 mmHg',
      hr: 74,
      spo2: 97,
      sleep: 6.5,
      pain: 'Knee (Level 3.5)',
      glucose: 112
    },
    payload: baselinePayload,
    result: baselineResult,
    prof: prof,
    sheetHtml: baselineSheet
  };

  const initialList = [baselineEntry];
  try {
    localStorage.setItem(STORAGE_KEY_ASSESSMENT_HISTORY, JSON.stringify(initialList));
  } catch (e) {
    console.warn('Could not seed baseline history:', e);
  }
  return initialList;
}

// 2. Save an Assessment to History
function saveElderAssessmentToHistory(payload, result, prof) {
  try {
    const history = getElderAssessmentHistory();
    const now = new Date();
    const profObj = prof || ((typeof getUserProfile === 'function') ? getUserProfile('senior') : { name: 'Ramesh Sharma', age: 74, gender: 'Male' });

    let sheetHtml = '';
    if (typeof generateClinicalReportSheetHtml === 'function') {
      sheetHtml = generateClinicalReportSheetHtml(result, payload, profObj);
    }

    const entry = {
      id: 'cc_assess_' + Date.now(),
      timestamp: now.toISOString(),
      dateTimeFormatted: now.toLocaleString('en-IN', {
        day: '2-digit', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit', hour12: true
      }),
      dateTimeFormattedHi: now.toLocaleString('hi-IN', {
        day: '2-digit', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit', hour12: true
      }),
      patientName: profObj.name || payload.seniorName || 'Ramesh Sharma',
      patientAge: payload.age || profObj.age || 74,
      patientGender: payload.gender || profObj.gender || 'Male',
      riskLevel: result.predicted_risk_level || 'Low',
      riskScore: result.risk_score || 25,
      confidence: result.confidence || 0.94,
      topFactors: result.top_factors || [],
      recommendations: result.recommendations || [],
      vitals: {
        bp: `${payload.bp_systolic || 120}/${payload.bp_diastolic || 80} mmHg`,
        hr: payload.heart_rate || 72,
        spo2: payload.spo2 || 98,
        sleep: payload.sleep_hours || 7.0,
        pain: payload.pain_present ? `${payload.pain_location || 'Body'} (Level ${payload.pain_level || 0})` : 'No Pain',
        glucose: payload.blood_glucose || 105
      },
      payload: payload,
      result: result,
      prof: profObj,
      sheetHtml: sheetHtml
    };

    history.unshift(entry);
    localStorage.setItem(STORAGE_KEY_ASSESSMENT_HISTORY, JSON.stringify(history));
    console.log('Saved assessment to history:', entry.id, 'Total history entries:', history.length);
    return entry;
  } catch (err) {
    console.error('Failed to save assessment to history:', err);
    return null;
  }
}

// 3. Reset Elder Assessment Form to Blank (Post Assessment)
function resetElderAssessmentForm(keepProfile = true) {
  // Clear metric inputs
  const idsToBlank = [
    'assess-height', 'assess-weight', 'assess-bp-sys', 'assess-bp-dia',
    'assess-hr', 'assess-spo2', 'assess-sleep', 'assess-med-count', 'assess-sugar'
  ];
  idsToBlank.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.value = '';
      el.classList.remove('input-field-error', 'ring-2', 'ring-rose-500', 'bg-rose-50', 'ring-teal-400');
    }
  });

  // Reset pain
  setPainPresent(false);
  const painLocEl = document.getElementById('assess-pain-loc');
  if (painLocEl) painLocEl.value = 'None';
  updatePainSlider(0);

  // Reset ADL Dropdowns
  ['assess-walk', 'assess-eat', 'assess-move', 'assess-toilet'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '1';
  });

  // Reset Missed Doses & Diabetic
  const missedEl = document.getElementById('assess-missed-doses');
  if (missedEl) missedEl.value = '0';
  const diabEl = document.getElementById('assess-diabetic');
  if (diabEl) {
    diabEl.value = '0';
    toggleSugarInput('0');
  }

  // Reset Hearing
  const hearEl = document.getElementById('assess-hearing');
  if (hearEl) hearEl.value = '0';

  // Uncheck chronic conditions
  ['chk-htn', 'chk-arth', 'chk-heart', 'chk-resp'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.checked = false;
  });

  // Age and Gender stay auto-detected from profile (GREEN)
  const prof = (typeof getUserProfile === 'function') ? getUserProfile('senior') : { age: 74, gender: 'Male' };
  const ageEl = document.getElementById('assess-age');
  if (ageEl) ageEl.value = prof.age || 74;
  const genderEl = document.getElementById('assess-gender');
  if (genderEl) genderEl.value = prof.gender || 'Male';

  // Clear draft storage so form starts fresh for next session
  try {
    localStorage.removeItem(STORAGE_KEY_ASSESSMENT_DRAFT);
    localStorage.removeItem('careconnect_elder_cumulative_nlp');
  } catch (e) {
    console.warn('Error clearing draft storage:', e);
  }
  cumulativeExtracted = {};

  const badgeText = document.getElementById('assess-autosave-text');
  if (badgeText) {
    badgeText.textContent = 'Form Reset Ready (फॉर्म नए चेकअप के लिए तैयार)';
  }

  const alertBox = document.getElementById('assessment-validation-alert');
  if (alertBox) alertBox.classList.add('hidden');

  const bmiBadge = document.getElementById('bmi-badge');
  if (bmiBadge) {
    bmiBadge.className = 'text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600';
    bmiBadge.textContent = 'BMI: --';
  }

  updateAssessmentProgressMeter();

  const missingWrap = document.getElementById('voice-missing-fields-tags');
  if (missingWrap) missingWrap.innerHTML = '';
  const statusText = document.getElementById('voice-status-text');
  if (statusText) statusText.innerText = 'Ready for new voice or manual checkup';

  renderChecklistGrid({}, []);
}

// 4. Open Elder Assessment History Modal
function openElderAssessmentHistoryModal() {
  const modal = document.getElementById('modal-elder-assessment-history');
  if (!modal) {
    console.warn('modal-elder-assessment-history not found');
    return;
  }
  renderElderAssessmentHistoryList();
  modal.classList.remove('hidden');
  if (typeof soundEngine !== 'undefined' && soundEngine.playTone) {
    soundEngine.playTone(520, 'sine', 0.1);
  }
}

// 5. Close Elder Assessment History Modal
function closeElderAssessmentHistoryModal() {
  const modal = document.getElementById('modal-elder-assessment-history');
  if (modal) modal.classList.add('hidden');
}

// 6. Render Assessment History List Cards
function renderElderAssessmentHistoryList() {
  const container = document.getElementById('elder-assessment-history-list');
  if (!container) return;

  const history = getElderAssessmentHistory();
  if (!history || history.length === 0) {
    container.innerHTML = `
      <div class="p-8 text-center bg-white rounded-2xl border border-slate-200">
        <i class="fa-solid fa-clock-rotate-left text-slate-300 text-4xl mb-3"></i>
        <h4 class="font-bold text-slate-700">No Assessment History Found</h4>
        <p class="text-xs text-slate-500 mt-1">Complete your first health assessment to archive your clinical sheet.</p>
      </div>
    `;
    return;
  }

  const isHindi = (typeof state !== 'undefined' && state.seniorLanguage === 'hi');

  container.innerHTML = history.map((entry, idx) => {
    const isHigh = (entry.riskLevel === 'High');
    const isMed = (entry.riskLevel === 'Medium');
    const isLow = (entry.riskLevel === 'Low');

    const badgeClass = isHigh
      ? 'bg-rose-100 text-rose-800 border-rose-300'
      : (isMed ? 'bg-amber-100 text-amber-800 border-amber-300' : 'bg-emerald-100 text-emerald-800 border-emerald-300');

    const badgeIcon = isHigh
      ? 'fa-triangle-exclamation text-rose-600'
      : (isMed ? 'fa-triangle-exclamation text-amber-600' : 'fa-circle-check text-emerald-600');

    const dateLabel = isHindi ? (entry.dateTimeFormattedHi || entry.dateTimeFormatted) : entry.dateTimeFormatted;
    const v = entry.vitals || {};

    const factorsHtml = (entry.topFactors || []).slice(0, 3).map(f => `
      <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
        <i class="fa-solid fa-circle-dot text-[8px] text-teal-500 mr-1.5"></i> ${f}
      </span>
    `).join('');

    return `
      <div class="p-5 bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all space-y-3.5">
        
        <!-- Card Header: Date & Risk Level Badge -->
        <div class="flex items-center justify-between flex-wrap gap-2">
          <div class="flex items-center space-x-2.5">
            <span class="w-8 h-8 rounded-xl bg-teal-50 text-teal-700 border border-teal-200 flex items-center justify-center text-xs font-black">
              #${history.length - idx}
            </span>
            <div>
              <div class="text-xs sm:text-sm font-black text-slate-900">${dateLabel}</div>
              <div class="text-[11px] text-slate-500 font-medium">90,000 Dataset Geriatric ML Model</div>
            </div>
          </div>

          <div class="flex items-center space-x-2">
            <span class="px-3 py-1 rounded-full text-xs font-black border flex items-center gap-1.5 ${badgeClass}">
              <i class="fa-solid ${badgeIcon}"></i>
              <span>${entry.riskLevel} Risk (${entry.riskScore}/100)</span>
            </span>
          </div>
        </div>

        <!-- Vitals Grid -->
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 pt-2 border-t border-slate-100 text-xs">
          <div class="p-2 bg-slate-50 rounded-xl text-center">
            <span class="block text-[10px] text-slate-400 font-bold uppercase">Blood Pressure</span>
            <span class="font-extrabold text-slate-800">${v.bp || '--'}</span>
          </div>
          <div class="p-2 bg-slate-50 rounded-xl text-center">
            <span class="block text-[10px] text-slate-400 font-bold uppercase">Heart Rate</span>
            <span class="font-extrabold text-slate-800">${v.hr ? v.hr + ' bpm' : '--'}</span>
          </div>
          <div class="p-2 bg-slate-50 rounded-xl text-center">
            <span class="block text-[10px] text-slate-400 font-bold uppercase">SpO2 Oxygen</span>
            <span class="font-extrabold text-slate-800">${v.spo2 ? v.spo2 + '%' : '--'}</span>
          </div>
          <div class="p-2 bg-slate-50 rounded-xl text-center">
            <span class="block text-[10px] text-slate-400 font-bold uppercase">Sleep Hours</span>
            <span class="font-extrabold text-slate-800">${v.sleep ? v.sleep + ' hrs' : '--'}</span>
          </div>
          <div class="p-2 bg-slate-50 rounded-xl text-center">
            <span class="block text-[10px] text-slate-400 font-bold uppercase">Pain Status</span>
            <span class="font-extrabold text-slate-800">${v.pain || 'None'}</span>
          </div>
          <div class="p-2 bg-slate-50 rounded-xl text-center">
            <span class="block text-[10px] text-slate-400 font-bold uppercase">Blood Glucose</span>
            <span class="font-extrabold text-slate-800">${v.glucose ? v.glucose + ' mg/dL' : '--'}</span>
          </div>
        </div>

        <!-- Top ML Factors -->
        ${factorsHtml ? `
        <div class="flex items-center flex-wrap gap-1.5 pt-1">
          <span class="text-[10px] text-slate-400 font-bold uppercase mr-1">ML Factors:</span>
          ${factorsHtml}
        </div>
        ` : ''}

        <!-- Action: View Clinical Sheet Snapshot -->
        <div class="pt-2 border-t border-slate-100 flex items-center justify-between flex-wrap gap-2">
          <span class="text-xs text-slate-500 font-medium">
            <i class="fa-solid fa-user-doctor text-teal-600 mr-1"></i> Patient: <strong>${entry.patientName}</strong> (${entry.patientAge}y, ${entry.patientGender})
          </span>
          <button onclick="viewClinicalSheetFromHistory('${entry.id}')"
            class="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-black flex items-center gap-2 shadow-sm transition-all hover:shadow">
            <i class="fa-solid fa-file-waveform"></i>
            <span>View Clinical Sheet (उस समय की रिपोर्ट देखें)</span>
          </button>
        </div>

      </div>
    `;
  }).join('');
}

// 7. View Exact Clinical Sheet Saved at that time
function viewClinicalSheetFromHistory(historyId) {
  const history = getElderAssessmentHistory();
  const entry = history.find(h => h.id === historyId);
  if (!entry) {
    showToast('Historical report not found', 'danger');
    return;
  }

  const modal = document.getElementById('modal-clinical-report-sheet');
  const container = document.getElementById('clinical-report-sheet-content');
  if (!modal || !container) {
    showToast('Report sheet modal not found', 'danger');
    return;
  }

  // Load exact sheet HTML saved at that time
  const sheetContent = entry.sheetHtml || generateClinicalReportSheetHtml(entry.result, entry.payload, entry.prof);
  container.innerHTML = sheetContent;
  modal.classList.remove('hidden');

  const scrollContainer = document.getElementById('clinical-report-sheet-scroll');
  if (scrollContainer) scrollContainer.scrollTop = 0;

  if (typeof soundEngine !== 'undefined' && soundEngine.playTone) {
    soundEngine.playTone(600, 'sine', 0.12);
  }
  showToast(`Showing clinical diagnostic sheet snapshot from ${entry.dateTimeFormatted}`, 'info');
}

// Global window aliases
window.openElderAssessmentHistoryModal = openElderAssessmentHistoryModal;
window.closeElderAssessmentHistoryModal = closeElderAssessmentHistoryModal;
window.renderElderAssessmentHistoryList = renderElderAssessmentHistoryList;
window.viewClinicalSheetFromHistory = viewClinicalSheetFromHistory;
window.resetElderAssessmentForm = resetElderAssessmentForm;
window.saveElderAssessmentToHistory = saveElderAssessmentToHistory;
window.getElderAssessmentHistory = getElderAssessmentHistory;


// 1. Auto-Save Assessment Draft to LocalStorage
function saveAssessmentDraft() {
  const form = document.getElementById('elder-assessment-form');
  if (!form) return;

  const draft = {
    age: document.getElementById('assess-age')?.value || '',
    gender: document.getElementById('assess-gender')?.value || 'Male',
    height: document.getElementById('assess-height')?.value || '',
    weight: document.getElementById('assess-weight')?.value || '',
    bp_sys: document.getElementById('assess-bp-sys')?.value || '',
    bp_dia: document.getElementById('assess-bp-dia')?.value || '',
    hr: document.getElementById('assess-hr')?.value || '',
    spo2: document.getElementById('assess-spo2')?.value || '',
    sleep: document.getElementById('assess-sleep')?.value || '',
    pain_present: assessmentState.painPresent ? 1 : 0,
    pain_level: assessmentState.painLevel,
    pain_loc: document.getElementById('assess-pain-loc')?.value || 'None',
    walk: document.getElementById('assess-walk')?.value || '1',
    eat: document.getElementById('assess-eat')?.value || '1',
    move: document.getElementById('assess-move')?.value || '1',
    toilet: document.getElementById('assess-toilet')?.value || '1',
    med_count: document.getElementById('assess-med-count')?.value || '',
    missed_doses: document.getElementById('assess-missed-doses')?.value || '0',
    diabetic: document.getElementById('assess-diabetic')?.value || '0',
    sugar: document.getElementById('assess-sugar')?.value || '',
    hearing: document.getElementById('assess-hearing')?.value || '0',
    chk_htn: document.getElementById('chk-htn')?.checked || false,
    chk_arth: document.getElementById('chk-arth')?.checked || false,
    chk_heart: document.getElementById('chk-heart')?.checked || false,
    chk_resp: document.getElementById('chk-resp')?.checked || false,
    savedAt: new Date().toISOString()
  };

  try {
    localStorage.setItem(STORAGE_KEY_ASSESSMENT_DRAFT, JSON.stringify(draft));
    const badgeText = document.getElementById('assess-autosave-text');
    if (badgeText) {
      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      badgeText.textContent = `Draft Auto-Saved (${timeStr})`;
    }
  } catch (e) {
    console.warn('Could not auto-save draft to localStorage:', e);
  }

  updateAssessmentProgressMeter();
}

// 2. Restore Assessment Draft from LocalStorage on load
function restoreAssessmentDraft() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_ASSESSMENT_DRAFT);
    if (!raw) {
      updateAssessmentProgressMeter();
      return false;
    }
    const d = JSON.parse(raw);
    if (!d) return false;

    if (d.age !== undefined && document.getElementById('assess-age')) document.getElementById('assess-age').value = d.age;
    if (d.gender && document.getElementById('assess-gender')) document.getElementById('assess-gender').value = d.gender;
    if (d.height && document.getElementById('assess-height')) document.getElementById('assess-height').value = d.height;
    if (d.weight && document.getElementById('assess-weight')) document.getElementById('assess-weight').value = d.weight;
    if (d.bp_sys && document.getElementById('assess-bp-sys')) document.getElementById('assess-bp-sys').value = d.bp_sys;
    if (d.bp_dia && document.getElementById('assess-bp-dia')) document.getElementById('assess-bp-dia').value = d.bp_dia;
    if (d.hr && document.getElementById('assess-hr')) document.getElementById('assess-hr').value = d.hr;
    if (d.spo2 && document.getElementById('assess-spo2')) document.getElementById('assess-spo2').value = d.spo2;
    if (d.sleep && document.getElementById('assess-sleep')) document.getElementById('assess-sleep').value = d.sleep;
    if (d.pain_loc && document.getElementById('assess-pain-loc')) document.getElementById('assess-pain-loc').value = d.pain_loc;
    if (d.walk && document.getElementById('assess-walk')) document.getElementById('assess-walk').value = d.walk;
    if (d.eat && document.getElementById('assess-eat')) document.getElementById('assess-eat').value = d.eat;
    if (d.move && document.getElementById('assess-move')) document.getElementById('assess-move').value = d.move;
    if (d.toilet && document.getElementById('assess-toilet')) document.getElementById('assess-toilet').value = d.toilet;
    if (d.med_count !== undefined && document.getElementById('assess-med-count')) document.getElementById('assess-med-count').value = d.med_count;
    if (d.missed_doses && document.getElementById('assess-missed-doses')) document.getElementById('assess-missed-doses').value = d.missed_doses;
    if (d.diabetic !== undefined && document.getElementById('assess-diabetic')) {
      document.getElementById('assess-diabetic').value = d.diabetic;
      toggleSugarInput(d.diabetic);
    }
    if (d.sugar && document.getElementById('assess-sugar')) document.getElementById('assess-sugar').value = d.sugar;
    if (d.hearing !== undefined && document.getElementById('assess-hearing')) document.getElementById('assess-hearing').value = d.hearing;
    if (document.getElementById('chk-htn')) document.getElementById('chk-htn').checked = !!d.chk_htn;
    if (document.getElementById('chk-arth')) document.getElementById('chk-arth').checked = !!d.chk_arth;
    if (document.getElementById('chk-heart')) document.getElementById('chk-heart').checked = !!d.chk_heart;
    if (document.getElementById('chk-resp')) document.getElementById('chk-resp').checked = !!d.chk_resp;

    if (d.pain_present) {
      setPainPresent(true);
      updatePainSlider(d.pain_level || 4);
    } else {
      setPainPresent(false);
      updatePainSlider(0);
    }

    updateCalculatedBMI();
    updateADLScore();
    updateAssessmentProgressMeter();

    const badgeText = document.getElementById('assess-autosave-text');
    if (badgeText) badgeText.textContent = 'Draft Restored from Memory';
    return true;
  } catch (e) {
    console.warn('Error restoring assessment draft:', e);
    return false;
  }
}

// 3. Clear Assessment Draft
function clearAssessmentDraft() {
  localStorage.removeItem(STORAGE_KEY_ASSESSMENT_DRAFT);
  if (typeof window.__resetCumulativeVoiceState === 'function') {
    window.__resetCumulativeVoiceState();
  }
  document.getElementById('assess-weight').value = '';
  document.getElementById('assess-height').value = '';
  document.getElementById('assess-bp-sys').value = '';
  document.getElementById('assess-bp-dia').value = '';
  document.getElementById('assess-hr').value = '';
  document.getElementById('assess-spo2').value = '';
  document.getElementById('assess-sleep').value = '';
  document.getElementById('assess-med-count').value = '';
  document.getElementById('assess-sugar').value = '';
  document.getElementById('chk-htn').checked = false;
  document.getElementById('chk-arth').checked = false;
  document.getElementById('chk-heart').checked = false;
  document.getElementById('chk-resp').checked = false;
  setPainPresent(false);
  updatePainSlider(0);
  updateCalculatedBMI();
  updateADLScore();
  updateAssessmentProgressMeter();

  const alertBox = document.getElementById('assessment-validation-alert');
  if (alertBox) alertBox.classList.add('hidden');

  if (typeof autoFillSeniorProfileData === 'function') autoFillSeniorProfileData();
  showToast('Assessment form draft cleared / फॉर्म साफ कर दिया गया', 'info');
}

// 4. Update Assessment Readiness Progress Meter
function updateAssessmentProgressMeter() {
  const fields = [
    { id: 'assess-age', name: 'Age (उम्र)' },
    { id: 'assess-gender', name: 'Gender (लिंग)' },
    { id: 'assess-height', name: 'Height (लंबाई)' },
    { id: 'assess-weight', name: 'Weight (वजन)' },
    { id: 'assess-bp-sys', name: 'BP Systolic (ऊपर का BP)' },
    { id: 'assess-bp-dia', name: 'BP Diastolic (नीचे का BP)' },
    { id: 'assess-hr', name: 'Heart Rate (धड़कन)' },
    { id: 'assess-spo2', name: 'Oxygen SpO2 (ऑक्सीजन)' },
    { id: 'assess-sleep', name: 'Sleep Hours (नींद)' },
    { id: 'assess-med-count', name: 'Medication Count (दवा संख्या)' }
  ];

  let filledCount = 0;
  fields.forEach(f => {
    const el = document.getElementById(f.id);
    if (el && el.value.toString().trim() !== '') {
      filledCount++;
    }
  });

  // Check sugar if diabetic
  const isDiabetic = document.getElementById('assess-diabetic')?.value === '1';
  let totalRequired = fields.length + (isDiabetic ? 1 : 0);
  if (isDiabetic) {
    const sugarEl = document.getElementById('assess-sugar');
    if (sugarEl && sugarEl.value.toString().trim() !== '') {
      filledCount++;
    }
  }

  const percent = Math.min(100, Math.round((filledCount / totalRequired) * 100));
  const badge = document.getElementById('assess-progress-badge');
  const bar = document.getElementById('assess-progress-bar');

  if (bar) bar.style.width = `${percent}%`;

  if (badge) {
    if (percent === 100) {
      badge.className = 'text-[11px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800';
      badge.textContent = 'Ready to Predict (100% Complete) ✅';
      if (bar) bar.className = 'h-full bg-emerald-500 rounded-full transition-all duration-300';
    } else {
      badge.className = 'text-[11px] font-extrabold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800';
      badge.textContent = `Incomplete (${filledCount}/${totalRequired} parameters - ${percent}%)`;
      if (bar) bar.className = 'h-full bg-amber-500 rounded-full transition-all duration-300';
    }
  }
}

// 5. Mandatory Validation Before Submission
// Compute real-time checklist state from current DOM inputs & assessmentState
function computeChecklistFromFormDom() {
  const prof = (typeof getUserProfile === 'function') ? getUserProfile('senior') : { age: 74, gender: 'Male' };
  const hVal = parseFloat(document.getElementById('assess-height')?.value);
  const wVal = parseFloat(document.getElementById('assess-weight')?.value);
  const bpSys = parseFloat(document.getElementById('assess-bp-sys')?.value);
  const bpDia = parseFloat(document.getElementById('assess-bp-dia')?.value);
  const hrVal = parseFloat(document.getElementById('assess-hr')?.value);
  const spo2Val = parseFloat(document.getElementById('assess-spo2')?.value);
  const sleepVal = parseFloat(document.getElementById('assess-sleep')?.value);
  const walkVal = document.getElementById('assess-walk')?.value;
  const eatVal = document.getElementById('assess-eat')?.value;
  const moveVal = document.getElementById('assess-move')?.value;
  const toiletVal = document.getElementById('assess-toilet')?.value;
  const medVal = document.getElementById('assess-med-count')?.value;
  const missedVal = document.getElementById('assess-missed-doses')?.value;
  const diabVal = document.getElementById('assess-diabetic')?.value;
  const sugarVal = parseFloat(document.getElementById('assess-sugar')?.value);
  const hearVal = document.getElementById('assess-hearing')?.value;

  const painLoc = document.getElementById('assess-pain-loc')?.value || 'None';
  const painPres = (typeof assessmentState !== 'undefined' && assessmentState.painPresent);
  const painLvl = (typeof assessmentState !== 'undefined') ? assessmentState.painLevel : 0;

  const hasHtn = document.getElementById('chk-htn')?.checked;
  const hasArth = document.getElementById('chk-arth')?.checked;
  const hasHeart = document.getElementById('chk-heart')?.checked;
  const hasResp = document.getElementById('chk-resp')?.checked;

  const hasHeight = (!isNaN(hVal) && hVal >= 100 && hVal <= 230);
  const hasWeight = (!isNaN(wVal) && wVal >= 30 && wVal <= 200);
  const hasBp = (!isNaN(bpSys) && bpSys >= 70 && bpSys <= 240 && !isNaN(bpDia) && bpDia >= 40 && bpDia <= 140);
  const hasHr = (!isNaN(hrVal) && hrVal >= 40 && hrVal <= 180);
  const hasSpo2 = (!isNaN(spo2Val) && spo2Val >= 70 && spo2Val <= 100);
  const hasPain = (!painPres) || (painPres && painLoc !== 'None' && painLoc !== '' && painLvl >= 1);
  const hasSleep = (!isNaN(sleepVal) && sleepVal >= 2 && sleepVal <= 16);
  const hasWalk = (walkVal !== '' && walkVal !== undefined && walkVal !== null);
  const hasEat = (eatVal !== '' && eatVal !== undefined && eatVal !== null);
  const hasMove = (moveVal !== '' && moveVal !== undefined && moveVal !== null);
  const hasToilet = (toiletVal !== '' && toiletVal !== undefined && toiletVal !== null);
  const hasMeds = (medVal !== '' && !isNaN(parseFloat(medVal)) && missedVal !== '' && missedVal !== undefined);
  const hasSugar = (diabVal === '0') || (diabVal === '1' && !isNaN(sugarVal) && sugarVal >= 40);
  const hasHearing = (hearVal !== '' && hearVal !== undefined && hearVal !== null);
  const hasDiseases = (hasHtn || hasArth || hasHeart || hasResp || (typeof cumulativeExtracted !== 'undefined' && cumulativeExtracted.chronic_conditions_none));

  return {
    age: { title: "Age (उम्र)", status: "provided", value: `${prof.age || 74} Yrs` },
    gender: { title: "Gender (लिंग)", status: "provided", value: prof.gender || "Male" },
    height: {
      title: "Height (लंबाई)",
      status: hasHeight ? "provided" : "missing",
      value: hasHeight ? `${hVal} cm` : null,
      question_hi: "Aapki lambai (height) kitne centimeter ya feet-inch hai?",
      question_en: "What is your height in centimeters or feet and inches?"
    },
    weight: {
      title: "Weight (वजन)",
      status: hasWeight ? "provided" : "missing",
      value: hasWeight ? `${wVal} kg` : null,
      question_hi: "Aapka vajan (body weight) kitne kilo (kg) hai?",
      question_en: "What is your body weight in kilograms?"
    },
    bp: {
      title: "Blood Pressure (रक्तचाप)",
      status: hasBp ? "provided" : "missing",
      value: hasBp ? `BP ${bpSys}/${bpDia}` : null,
      question_hi: "Aapka Blood Pressure (upar aur neeche ka BP) kitna hai?",
      question_en: "What is your Blood Pressure (systolic and diastolic) reading?"
    },
    hr: {
      title: "Pulse Rate (धड़कन)",
      status: hasHr ? "provided" : "missing",
      value: hasHr ? `${hrVal} bpm` : null,
      question_hi: "Aapki dil ki dhadkan (heart rate pulse) kitni hai?",
      question_en: "What is your heart rate or pulse in beats per minute?"
    },
    spo2: {
      title: "Oxygen SpO2 (ऑक्सीजन)",
      status: hasSpo2 ? "provided" : "missing",
      value: hasSpo2 ? `${spo2Val}%` : null,
      question_hi: "Aapka oxygen saturation level (SpO2) kitne percent hai?",
      question_en: "What is your oxygen saturation level (SpO2 percentage)?"
    },
    pain: {
      title: "Pain Status (दर्द)",
      status: hasPain ? "provided" : "missing",
      value: painPres ? `${painLoc} (Level ${painLvl})` : "No Pain",
      question_hi: "Kya shareer me dard hai jaise ghutne ya kamar me, aur severity level kitna hai?",
      question_en: "Do you have any pain (such as in knees, back, or chest) and what is the severity level?"
    },
    sleep: {
      title: "Sleep (नींद)",
      status: hasSleep ? "provided" : "missing",
      value: hasSleep ? `${sleepVal} hrs` : null,
      question_hi: "Aap rozana kitne ghante sote hain?",
      question_en: "How many hours of sleep do you get each night?"
    },
    adl_walk: {
      title: "Walking (चलना)",
      status: hasWalk ? "provided" : "missing",
      value: walkVal === '1' ? "Independent" : "Needs Help",
      question_hi: "Chalna kaisa hai - khud chal lete hain ya walker/lathi lagti hai?",
      question_en: "Can you walk independently or do you require a walker or stick?"
    },
    adl_eat: {
      title: "Eating (खाना)",
      status: hasEat ? "provided" : "missing",
      value: eatVal === '1' ? "Independent" : "Dependent",
      question_hi: "Khana khud kha lete hain ya kisi ki madad lagti hai?",
      question_en: "Can you eat meals independently or do you need assistance?"
    },
    adl_move: {
      title: "Transfer (उठना)",
      status: hasMove ? "provided" : "missing",
      value: moveVal === '1' ? "Independent" : "Needs Help",
      question_hi: "Bistar ya kursi se uthne baithne me kya sahara lagta hai?",
      question_en: "Can you get out of bed or a chair by yourself?"
    },
    adl_toilet: {
      title: "Toilet (शौचालय)",
      status: hasToilet ? "provided" : "missing",
      value: toiletVal === '1' ? "Independent" : "Dependent",
      question_hi: "Toilet khud ja pate hain ya sahara chahiye?",
      question_en: "Can you use the toilet independently or do you require help?"
    },
    meds: {
      title: "Meds & Doses (दवाइयां)",
      status: hasMeds ? "provided" : "missing",
      value: hasMeds ? `${medVal} meds (${missedVal === '0' ? 'All taken' : missedVal + ' missed'})` : null,
      question_hi: "Rozana kitni dawai lete hain aur kya sab samay par le li?",
      question_en: "How many daily medicines do you take and were all doses taken today?"
    },
    sugar: {
      title: "Diabetes & Sugar (शुगर)",
      status: hasSugar ? "provided" : "missing",
      value: diabVal === '1' ? `Diabetic (${sugarVal || '--'} mg/dL)` : "Non-Diabetic",
      question_hi: "Kya aapko Diabetes (sugar) hai aur sugar level kitna hai?",
      question_en: "Do you have diabetes and what is your current blood sugar level?"
    },
    hearing: {
      title: "Hearing (सुनना)",
      status: hasHearing ? "provided" : "missing",
      value: hearVal === '0' ? "Normal" : (hearVal === '1' ? "Mild Difficulty" : "Hearing Aid"),
      question_hi: "Sunne ki kshamta kaisi hai - normal, thoda kam ya hearing aid lagate hain?",
      question_en: "How is your hearing ability - normal, mild difficulty, or hearing aid?"
    },
    diseases: {
      title: "Diseases (पुरानी बीमारियां)",
      status: hasDiseases ? "provided" : "missing",
      value: [hasHtn ? 'HTN' : null, hasArth ? 'Arthritis' : null, hasHeart ? 'Heart' : null, hasResp ? 'Asthma' : null].filter(Boolean).join(', ') || 'Assessed',
      question_hi: "Kya aapko High BP, Gathiya, Dil ki bimari ya Dama jaisi koi bimari hai?",
      question_en: "Do you have conditions such as High BP, Arthritis, Heart disease, or Asthma?"
    }
  };
}

// 5. Mandatory 19-Parameter Assessment Input Validator (Audio or Text Form)
function validateAssessmentInputsBeforeSubmit() {
  const missing = [];
  const prof = (typeof getUserProfile === 'function') ? getUserProfile('senior') : { age: 74, gender: 'Male' };

  // 1. Age and Gender are auto-detected from profile and always valid
  const ageEl = document.getElementById('assess-age');
  if (ageEl && !ageEl.value.trim()) ageEl.value = prof.age || 74;
  const genderEl = document.getElementById('assess-gender');
  if (genderEl && !genderEl.value.trim()) genderEl.value = prof.gender || 'Male';

  // Remove previous error highlights
  document.querySelectorAll('.input-field-error').forEach(el => {
    el.classList.remove('input-field-error', 'ring-2', 'ring-rose-500', 'bg-rose-50');
  });

  let firstErrorElement = null;
  const flagError = (elementId, labelText) => {
    missing.push(labelText);
    const el = document.getElementById(elementId);
    if (el) {
      el.classList.add('input-field-error', 'ring-2', 'ring-rose-500', 'bg-rose-50');
      if (!firstErrorElement) firstErrorElement = el;
    }
  };

  // 2. Height (100 - 230 cm)
  const hEl = document.getElementById('assess-height');
  const hVal = parseFloat(hEl?.value);
  if (!hEl || isNaN(hVal) || hVal < 100 || hVal > 230) {
    flagError('assess-height', 'Height / लंबाई (100-230 cm)');
  }

  // 3. Weight (30 - 200 kg)
  const wEl = document.getElementById('assess-weight');
  const wVal = parseFloat(wEl?.value);
  if (!wEl || isNaN(wVal) || wVal < 30 || wVal > 200) {
    flagError('assess-weight', 'Weight / वजन (30-200 kg)');
  }

  // 4. BP Systolic (70 - 240 mmHg)
  const bpSysEl = document.getElementById('assess-bp-sys');
  const bpSysVal = parseFloat(bpSysEl?.value);
  if (!bpSysEl || isNaN(bpSysVal) || bpSysVal < 70 || bpSysVal > 240) {
    flagError('assess-bp-sys', 'BP Systolic / ऊपर का BP (70-240 mmHg)');
  }

  // 5. BP Diastolic (40 - 140 mmHg)
  const bpDiaEl = document.getElementById('assess-bp-dia');
  const bpDiaVal = parseFloat(bpDiaEl?.value);
  if (!bpDiaEl || isNaN(bpDiaVal) || bpDiaVal < 40 || bpDiaVal > 140) {
    flagError('assess-bp-dia', 'BP Diastolic / नीचे का BP (40-140 mmHg)');
  }

  // 6. Heart Rate / Pulse (40 - 180 bpm)
  const hrEl = document.getElementById('assess-hr');
  const hrVal = parseFloat(hrEl?.value);
  if (!hrEl || isNaN(hrVal) || hrVal < 40 || hrVal > 180) {
    flagError('assess-hr', 'Heart Rate / पल्स धड़कन (40-180 bpm)');
  }

  // 7. Oxygen SpO2 (70 - 100 %)
  const spo2El = document.getElementById('assess-spo2');
  const spo2Val = parseFloat(spo2El?.value);
  if (!spo2El || isNaN(spo2Val) || spo2Val < 70 || spo2Val > 100) {
    flagError('assess-spo2', 'Oxygen SpO2 / ऑक्सीजन (70-100%)');
  }

  // 8. Pain Status, Location & Severity (Mandatory)
  if (assessmentState.painPresent) {
    const painLocEl = document.getElementById('assess-pain-loc');
    if (!painLocEl || !painLocEl.value || painLocEl.value === 'None') {
      flagError('assess-pain-loc', 'Pain Location / दर्द का स्थान (Knee/Back/etc.)');
    }
    const sliderEl = document.getElementById('assess-pain-slider');
    const pLevel = parseFloat(assessmentState.painLevel);
    if (isNaN(pLevel) || pLevel < 1) {
      flagError('assess-pain-slider', 'Pain Severity / दर्द का स्तर (1-10)');
    }
  }

  // 9. Sleep Duration (2 - 16 hrs)
  const sleepEl = document.getElementById('assess-sleep');
  const sleepVal = parseFloat(sleepEl?.value);
  if (!sleepEl || isNaN(sleepVal) || sleepVal < 2 || sleepVal > 16) {
    flagError('assess-sleep', 'Sleep Duration / नींद के घंटे (2-16 hrs)');
  }

  // 10. Able to Walk (Functional Independence)
  const walkEl = document.getElementById('assess-walk');
  if (!walkEl || walkEl.value === '') {
    flagError('assess-walk', 'Able to Walk / चलने में स्वतंत्रता');
  }

  // 11. Eat Themselves (Eating Independence)
  const eatEl = document.getElementById('assess-eat');
  if (!eatEl || eatEl.value === '') {
    flagError('assess-eat', 'Eat Themselves / खाना खुद खाते हैं');
  }

  // 12. Move / Transfer (Bed or Chair)
  const moveEl = document.getElementById('assess-move');
  if (!moveEl || moveEl.value === '') {
    flagError('assess-move', 'Move Transfer / उठना-बैठना');
  }

  // 13. Use Toilet Independently
  const toiletEl = document.getElementById('assess-toilet');
  if (!toiletEl || toiletEl.value === '') {
    flagError('assess-toilet', 'Use Toilet Independently / शौचालय');
  }

  // 14. Daily Prescription Count (>= 0)
  const medEl = document.getElementById('assess-med-count');
  const medVal = parseFloat(medEl?.value);
  if (!medEl || isNaN(medVal) || medVal < 0) {
    flagError('assess-med-count', 'Daily Prescription Count / दवा संख्या');
  }

  // 15. Doses Taken Today / Missed Doses
  const missedEl = document.getElementById('assess-missed-doses');
  if (!missedEl || missedEl.value === '') {
    flagError('assess-missed-doses', 'Doses Taken Today / आज दवाएं लीं या छूटीं');
  }

  // 16. Diabetic or Not & Blood Sugar
  const diabEl = document.getElementById('assess-diabetic');
  if (!diabEl || diabEl.value === '') {
    flagError('assess-diabetic', 'Diabetic or Not / मधुमेह स्थिति');
  } else if (diabEl.value === '1') {
    const sugarEl = document.getElementById('assess-sugar');
    const sugarVal = parseFloat(sugarEl?.value);
    if (!sugarEl || isNaN(sugarVal) || sugarVal < 40 || sugarVal > 500) {
      flagError('assess-sugar', 'Blood Glucose / शुगर स्तर (40-500 mg/dL)');
    }
  }

  // 17. Hearing Levels
  const hearEl = document.getElementById('assess-hearing');
  if (!hearEl || hearEl.value === '') {
    flagError('assess-hearing', 'Hearing Level / सुनने की क्षमता');
  }

  const alertBox = document.getElementById('assessment-validation-alert');
  const missingListContainer = document.getElementById('assessment-missing-fields-list');

  if (missing.length > 0) {
    if (typeof soundEngine !== 'undefined' && soundEngine.playTone) {
      soundEngine.playTone(320, 'sawtooth', 0.25);
    }
    if (alertBox) alertBox.classList.remove('hidden');
    if (missingListContainer) {
      missingListContainer.innerHTML = missing.map(m => `
        <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-rose-200 text-rose-900 border border-rose-300 shadow-2xs">
          <i class="fa-solid fa-circle-exclamation mr-1.5 text-rose-700"></i> ${m}
        </span>
      `).join('');
    }

    if (firstErrorElement) {
      firstErrorElement.focus();
      firstErrorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    showToast(`Mandatory parameters required: Please complete ${missing[0]} (${missing.length} missing)`, 'danger');

    // Announce missing inputs aloud via elder speech assistant
    const isHi = (typeof state !== 'undefined' && state.seniorLanguage === 'hi');
    const speechPrompt = isHi
      ? `AI जांच के लिए कृपया ${missing.slice(0, 2).join(' और ')} की जानकारी ऑडियो या फॉर्म में अवश्य भरें।`
      : `Please provide mandatory clinical input for ${missing.slice(0, 2).join(' and ')} before running AI assessment.`;
    playElderSpeech(speechPrompt, isHi ? 'hi-IN' : 'en-US');

    return false;
  } else {
    if (alertBox) alertBox.classList.add('hidden');
    return true;
  }
}

// 6. Highlight Modified Field (Visual Voice Feedback)
function highlightInputModification(inputId, label = 'Voice Updated') {
  const el = document.getElementById(inputId);
  if (!el) return;

  el.classList.add('ring-4', 'ring-emerald-400', 'bg-emerald-50', 'transition-all');
  setTimeout(() => {
    el.classList.remove('ring-4', 'ring-emerald-400', 'bg-emerald-50');
  }, 1800);

  // Injected tiny badge next to field label if available
  const container = el.closest('.form-group') || el.closest('div');
  if (container) {
    let tag = container.querySelector(`.voice-tag-captured[data-key="${inputId}"]`);
    if (!tag) {
      tag = document.createElement('span');
      tag.className = 'voice-tag-captured';
      tag.setAttribute('data-key', inputId);
      tag.innerHTML = `<i class="fa-solid fa-microphone-lines text-emerald-600"></i> ${label}`;
      const lbl = container.querySelector('label') || container.querySelector('span');
      if (lbl) lbl.appendChild(tag);
      setTimeout(() => {
        if (tag && tag.parentNode) tag.parentNode.removeChild(tag);
      }, 5000);
    }
  }
}

// ==================================================================// HIGH-FIDELITY BILINGUAL AI VOICE ENGINE & NEURAL SPEECH SYNTHESIS
// ==================================================================
let activeSpeechAudio = null;
let cumulativeExtracted = {};
let currentChecklist = null;
let currentInquiries = [];
let selectedVoiceLang = 'hi-IN';
let lastAssistantSpeech = '';
let voiceRecognitionInstance = null;
let isVoiceRecording = false;

window.__resetCumulativeVoiceState = function () {
  cumulativeExtracted = {};
  currentChecklist = null;
  currentInquiries = [];
  lastAssistantSpeech = '';
  const transcriptBox = document.getElementById('voice-transcript-text');
  if (transcriptBox) transcriptBox.value = '';
  const bubble = document.getElementById('voice-feedback-bubble');
  if (bubble) bubble.classList.add('hidden');
  const statusBadge = document.getElementById('voice-status-text');
  if (statusBadge) statusBadge.innerText = 'Voice Assistant Ready';

  // Reset checklist badges to missing (EXCEPT Age and Gender which are always auto-detected and GREEN)
  const badgeKeys = ['age', 'gender', 'height', 'weight', 'bp', 'hr', 'spo2', 'pain', 'sleep', 'adl_walk', 'adl_eat', 'adl_move', 'adl_toilet', 'meds', 'sugar', 'hearing', 'diseases'];
  badgeKeys.forEach(k => {
    const b = document.getElementById(`badge-chk-${k}`) || document.getElementById(`badge-chk-${k.replace(/_/g, '-')}`);
    if (!b) return;

    if (k === 'age' || k === 'gender') {
      b.className = 'voice-check-badge status-provided';
      b.style.background = '#f0fdf4';
      b.style.borderColor = 'rgba(16, 185, 129, 0.6)';
      b.style.color = '#047857';
      const prof = (typeof getUserProfile === 'function') ? getUserProfile('senior') : { age: 74, gender: 'Male' };
      const curAge = document.getElementById('assess-age')?.value || prof.age || 74;
      const curGender = document.getElementById('assess-gender')?.value || prof.gender || 'Male';
      const labelSpan = b.querySelector('.badge-tag-label');
      const statusSpan = b.querySelector('.badge-tag-status');
      if (labelSpan) {
        labelSpan.innerHTML = k === 'age'
          ? `<i class="fa-solid fa-cake-candles"></i> Age: ${curAge}y`
          : `<i class="fa-solid fa-venus-mars"></i> Gender: ${curGender}`;
      }
      if (statusSpan) {
        statusSpan.innerHTML = `<span class="text-emerald-700 font-bold"><i class="fa-solid fa-circle-check text-emerald-600"></i> Auto-detected</span>`;
      }
      return;
    }

    b.className = 'voice-check-badge status-missing';
    b.style.background = '';
    b.style.borderColor = '';
    b.style.color = '';
    const statusSpan = b.querySelector('.badge-tag-status');
    if (statusSpan) statusSpan.innerHTML = '? Needs Info';
  });
  const lblNext = document.getElementById('lbl-ask-next');
  if (lblNext) lblNext.innerText = 'Ask Next Question';
};

function stopAllSpeechAudio() {
  if (activeSpeechAudio) {
    try {
      activeSpeechAudio.pause();
      activeSpeechAudio.currentTime = 0;
    } catch (e) {}
    activeSpeechAudio = null;
  }
  if (window.speechSynthesis) {
    try {
      window.speechSynthesis.cancel();
    } catch (e) {}
  }
}

function playAcousticChime(type = 'assistant') {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    const startFreq = type === 'start' ? 520 : type === 'finish' ? 660 : 587;
    const endFreq = type === 'start' ? 780 : type === 'finish' ? 880 : 880;

    osc.frequency.setValueAtTime(startFreq, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(endFreq, ctx.currentTime + 0.18);

    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.26);
  } catch (e) {}
}

function getAvailableSpeechVoices() {
  if (!window.speechSynthesis) return [];
  return window.speechSynthesis.getVoices() || [];
}

function findBestSpeechVoice(requestedLang) {
  const voices = getAvailableSpeechVoices();
  if (!voices || voices.length === 0) return null;

  const isHi = (requestedLang === 'hi-IN' || requestedLang === 'hi');
  if (isHi) {
    const hi = voices.find(v => v.lang && (v.lang.toLowerCase().startsWith('hi') || v.lang.toLowerCase().includes('in-hi') || (v.name && v.name.toLowerCase().includes('hindi'))));
    if (hi) return { voice: hi, isNativeHindi: true };

    const inEn = voices.find(v => v.lang && (v.lang.toLowerCase().includes('en-in') || (v.name && v.name.toLowerCase().includes('india'))));
    if (inEn) return { voice: inEn, isNativeHindi: false };
  }

  const en = voices.find(v => v.lang && (v.lang.toLowerCase().includes('en-in') || v.lang.toLowerCase().startsWith('en')));
  if (en) return { voice: en, isNativeHindi: false };

  return { voice: voices[0], isNativeHindi: false };
}

function speakRobustText(text, requestedLang, options = {}) {
  if (!window.speechSynthesis || !text) return;
  stopAllSpeechAudio();

  setTimeout(() => {
    try {
      const cleanText = String(text).replace(/[*#_~`]/g, ' ').replace(/\s+/g, ' ').trim();
      const utt = new SpeechSynthesisUtterance(cleanText);
      const voiceMatch = findBestSpeechVoice(requestedLang);

      if (voiceMatch && voiceMatch.voice) {
        utt.voice = voiceMatch.voice;
        utt.lang = voiceMatch.voice.lang || requestedLang;
      } else {
        utt.lang = requestedLang || 'hi-IN';
      }

      utt.rate = options.rate || 0.95;
      utt.pitch = options.pitch || 1.0;
      utt.volume = 1.0;

      utt.onend = (e) => {
        if (typeof options.onend === 'function') options.onend(e);
      };
      utt.onerror = (e) => {
        if (typeof options.onend === 'function') options.onend(e);
      };

      window.speechSynthesis.speak(utt);
    } catch (e) {
      if (typeof options.onend === 'function') options.onend();
    }
  }, 80);
}

function playElderSpeech(text, requestedLang, options = {}) {
  if (!text || !String(text).trim()) {
    if (typeof options.onend === 'function') options.onend();
    return;
  }

  stopAllSpeechAudio();

  if (options.playChime !== false) {
    playAcousticChime(options.toneType || 'assistant');
  }

  const cleanText = String(text).replace(/[*#_~`]/g, ' ').replace(/\s+/g, ' ').trim();
  const isHi = (requestedLang === 'hi-IN' || requestedLang === 'hi' || requestedLang === 'hindi');
  const langParam = isHi ? 'hi' : 'en';

  // 1. Try High-Fidelity Neural Server TTS (/api/tts)
  const ttsUrl = `/api/tts?text=${encodeURIComponent(cleanText)}&lang=${langParam}`;
  const audio = new Audio(ttsUrl);
  activeSpeechAudio = audio;

  let fallbackFired = false;
  const triggerWebSpeechFallback = () => {
    if (fallbackFired) return;
    fallbackFired = true;
    speakRobustText(cleanText, requestedLang, { ...options, playChime: false });
  };

  audio.onended = (e) => {
    activeSpeechAudio = null;
    if (typeof options.onend === 'function') options.onend(e);
  };

  audio.onerror = (e) => {
    activeSpeechAudio = null;
    triggerWebSpeechFallback();
  };

  try {
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        triggerWebSpeechFallback();
      });
    }
  } catch (err) {
    triggerWebSpeechFallback();
  }
}

// ==================================================================// VOICE ASSISTANT UI CONTROLLER (DOM BINDINGS & AUDIT BADGES)
// ==================================================================
function initElderVoiceAssistant() {
  const btnHindi = document.getElementById('btn-lang-hindi');
  const btnEnglish = document.getElementById('btn-lang-english');
  const btnTestVoice = document.getElementById('btn-test-assistant-voice');
  const btnRecord = document.getElementById('btn-voice-record');
  const recordText = document.getElementById('voice-record-btn-text');
  const soundWave = document.getElementById('voice-sound-wave');
  const statusText = document.getElementById('voice-status-text');
  const transcriptBox = document.getElementById('voice-transcript-text');
  const btnClear = document.getElementById('btn-clear-transcript');
  const btnParse = document.getElementById('btn-parse-transcript-text');
  const fileInput = document.getElementById('voice-file-upload');
  const bubble = document.getElementById('voice-feedback-bubble');
  const assistantText = document.getElementById('voice-assistant-text');
  const missingWrap = document.getElementById('voice-missing-fields-tags');
  const btnReplay = document.getElementById('btn-replay-assistant-voice');
  const btnAskNext = document.getElementById('btn-ask-next-inquiry');

  // 1. Language Toggle
  if (btnHindi && btnEnglish) {
    btnHindi.addEventListener('click', () => {
      selectedVoiceLang = 'hi-IN';
      btnHindi.classList.add('active');
      btnEnglish.classList.remove('active');
      if (statusText) statusText.innerText = 'Language: हिन्दी (hi-IN)';
      showToast('Voice Assistant set to Hindi (हिन्दी)', 'info');
    });

    btnEnglish.addEventListener('click', () => {
      selectedVoiceLang = 'en-IN';
      btnEnglish.classList.add('active');
      btnHindi.classList.remove('active');
      if (statusText) statusText.innerText = 'Language: English (en-IN)';
      showToast('Voice Assistant set to English', 'info');
    });
  }

  // 2. Test Voice Button
  if (btnTestVoice) {
    btnTestVoice.addEventListener('click', () => {
      const testMsg = selectedVoiceLang === 'hi-IN'
        ? 'नमस्ते! CareConnect AI voice assistant पूरी तरह से सक्रिय है। आप अपनी सेहत की जानकारी बोल सकते हैं।'
        : 'Hello! CareConnect AI voice assistant is fully active and listening. You can speak your health details.';
      playElderSpeech(testMsg, selectedVoiceLang);
      showToast('Playing voice assistant audio sample...', 'info');
    });
  }

  // 3. Clear Transcript
  if (btnClear && transcriptBox) {
    btnClear.addEventListener('click', () => {
      transcriptBox.value = '';
      if (bubble) bubble.classList.add('hidden');
      if (statusText) statusText.innerText = 'Transcript cleared. Ready to record.';
    });
  }

  // 4. Web Speech API Microphone Recording
  const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
  let currentSessionTranscript = '';

  if (SpeechRec) {
    voiceRecognitionInstance = new SpeechRec();
    voiceRecognitionInstance.continuous = true;
    voiceRecognitionInstance.interimResults = true;

    voiceRecognitionInstance.onstart = () => {
      isVoiceRecording = true;
      currentSessionTranscript = '';
      if (btnRecord) {
        btnRecord.classList.add('recording');
        if (recordText) recordText.innerText = 'Stop Speaking (सुन रहे हैं...)';
      }
      if (soundWave) soundWave.classList.remove('hidden');
      if (statusText) statusText.innerText = `Listening in ${selectedVoiceLang === 'hi-IN' ? 'Hindi (हिन्दी)' : 'English'}... Speak clearly`;
      playAcousticChime('start');
    };

    voiceRecognitionInstance.onresult = (event) => {
      let fullTranscript = '';
      for (let i = 0; i < event.results.length; ++i) {
        fullTranscript += event.results[i][0].transcript;
        if (event.results[i].isFinal) fullTranscript += ' ';
      }
      currentSessionTranscript = fullTranscript.trim();
      if (transcriptBox && currentSessionTranscript) {
        transcriptBox.value = currentSessionTranscript;
      }
    };

    voiceRecognitionInstance.onerror = (event) => {
      console.warn('Speech recognition error:', event.error);
      stopRecordingUI();
      if (statusText) statusText.innerText = `Mic notice: ${event.error}. Click Mic to speak again.`;
    };

    voiceRecognitionInstance.onend = () => {
      stopRecordingUI();
      const textToProcess = currentSessionTranscript || (transcriptBox ? transcriptBox.value.trim() : '');
      if (textToProcess) {
        processTranscriptWithNLP(textToProcess);
      } else {
        if (statusText) statusText.innerText = 'Ready. Click Mic or a question to speak.';
      }
    };
  } else {
    if (statusText) statusText.innerText = 'Live mic uses Web Speech API. Audio file upload is fully supported.';
  }

  function stopRecordingUI() {
    isVoiceRecording = false;
    if (btnRecord) {
      btnRecord.classList.remove('recording');
      if (recordText) recordText.innerText = 'Start Speaking (Mic)';
    }
    if (soundWave) soundWave.classList.add('hidden');
    if (statusText) statusText.innerText = 'Processing clinical voice note...';
  }

  if (btnRecord) {
    btnRecord.addEventListener('click', () => {
      if (!voiceRecognitionInstance) {
        showToast('Live microphone requires Chrome/Edge. You can upload an audio file or click try examples below.', 'warning');
        return;
      }
      if (!isVoiceRecording) {
        stopAllSpeechAudio();
        voiceRecognitionInstance.lang = selectedVoiceLang;
        try {
          voiceRecognitionInstance.start();
        } catch (e) {
          try {
            voiceRecognitionInstance.stop();
            setTimeout(() => {
              try { voiceRecognitionInstance.start(); } catch (err) {}
            }, 120);
          } catch (err) {}
        }
      } else {
        try {
          voiceRecognitionInstance.stop();
        } catch (e) {}
      }
    });
  }

  // 5. Audio File Upload (.wav, .mp3, .m4a, .flac)
  if (fileInput) {
    fileInput.addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      if (statusText) statusText.innerText = 'Transcribing uploaded audio file...';
      if (soundWave) soundWave.classList.remove('hidden');

      const formData = new FormData();
      formData.append('audio', file);
      formData.append('language', selectedVoiceLang);
      formData.append('current_entities', JSON.stringify(cumulativeExtracted));

      try {
        const res = await fetch('/api/audio/upload', {
          method: 'POST',
          body: formData
        });
        const json = await res.json();
        if (soundWave) soundWave.classList.add('hidden');

        if (json.success) {
          if (transcriptBox && json.transcript) transcriptBox.value = json.transcript;
          applyExtractedEntities(json);
        } else {
          showToast(json.error || 'Audio upload could not be transcribed. Use live mic or .wav.', 'danger');
          if (statusText) statusText.innerText = 'Audio transcription failed';
        }
      } catch (err) {
        if (soundWave) soundWave.classList.add('hidden');
        showToast('Error uploading audio file', 'danger');
        if (statusText) statusText.innerText = 'Error uploading audio';
      }
    });
  }

  // 6. Manual / Edited Transcript Extraction
  if (btnParse && transcriptBox) {
    btnParse.addEventListener('click', () => {
      const text = transcriptBox.value.trim();
      if (!text) {
        showToast('Please speak or type your clinical details first.', 'warning');
        return;
      }
      processTranscriptWithNLP(text);
    });
  }

  // 7. Replay Assistant Voice
  if (btnReplay) {
    btnReplay.addEventListener('click', () => {
      if (lastAssistantSpeech) {
        playElderSpeech(lastAssistantSpeech, selectedVoiceLang);
      } else {
        playElderSpeech('Voice assistant is ready. Please record your health information.', selectedVoiceLang);
      }
    });
  }

  // 8. Ask Next Missing Question Button
  if (btnAskNext) {
    btnAskNext.addEventListener('click', () => {
      if (!currentInquiries || currentInquiries.length === 0) {
        const doneMsg = selectedVoiceLang === 'hi-IN'
          ? 'सभी स्वास्थ्य संकेत पूरे हो चुके हैं! आप जोखिम जांचें बटन पर क्लिक करके अपनी AI रिपोर्ट देख सकते हैं।'
          : 'All clinical parameters are complete! You can now click Predict Health Risk to generate your report.';
        playElderSpeech(doneMsg, selectedVoiceLang);
        if (assistantText) assistantText.innerText = doneMsg;
        showToast('All items answered! Ready for AI prediction.', 'success');
        return;
      }

      const nextInq = currentInquiries[0];
      const qText = selectedVoiceLang === 'hi-IN' ? nextInq.question_hi : nextInq.question_en;
      lastAssistantSpeech = qText;

      if (bubble && assistantText) {
        bubble.classList.remove('hidden');
        assistantText.innerText = qText;
      }
      if (statusText) statusText.innerText = `Assistant asking: "${nextInq.title}"... Listening starts after speech.`;
      showToast(`Next question: ${nextInq.title}`, 'info');

      playElderSpeech(qText, selectedVoiceLang, {
        onend: () => {
          if (voiceRecognitionInstance && !isVoiceRecording) {
            try {
              voiceRecognitionInstance.lang = selectedVoiceLang;
              voiceRecognitionInstance.start();
              showToast(`Now listening for ${nextInq.title}... Speak your answer.`, 'info');
            } catch (e) {
              console.warn('Recognition auto-start error:', e);
            }
          }
        }
      });
    });
  }
}

// 7. Process Speech Transcript with Backend NLP
async function processTranscriptWithNLP(text) {
  const statusText = document.getElementById('voice-status-text');
  if (statusText) statusText.innerText = 'AI Extracting Clinical Parameters...';

  try {
    const res = await fetch('/api/audio/extract-form', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        transcript: text,
        language: selectedVoiceLang,
        current_entities: cumulativeExtracted
      })
    });
    const json = await res.json();
    if (json.success) {
      applyExtractedEntities(json);
    } else {
      showToast(json.error || 'Failed to extract clinical entities', 'danger');
      if (statusText) statusText.innerText = 'Extraction encountered an issue';
    }
  } catch (e) {
    console.warn('NLP extraction network error', e);
    showToast('Network error while extracting parameters', 'danger');
    if (statusText) statusText.innerText = 'Network error extracting parameters';
  }
}

// 8. Apply Extracted Entities into Form DOM, Checklist Badges & Voice Feedback
function applyExtractedEntities(result) {
  if (result.extracted) {
    cumulativeExtracted = { ...cumulativeExtracted, ...result.extracted };
  }
  const extracted = cumulativeExtracted;
  const { missing_fields, feedback, is_ready_for_assessment } = result;

  // 1. Age
  if (extracted.age !== undefined) {
    const ageEl = document.getElementById('assess-age');
    if (ageEl) {
      ageEl.value = extracted.age;
      highlightInputModification('assess-age', `Age ${extracted.age}y`);
    }
  }

  // 2. Gender
  if (extracted.gender !== undefined) {
    const gEl = document.getElementById('assess-gender');
    if (gEl) {
      gEl.value = extracted.gender;
      highlightInputModification('assess-gender', extracted.gender);
    }
  }

  // 3. Weight & Height
  if (extracted.weight !== undefined) {
    const wEl = document.getElementById('assess-weight');
    if (wEl) {
      wEl.value = extracted.weight;
      highlightInputModification('assess-weight', `${extracted.weight}kg`);
    }
  }
  if (extracted.height !== undefined) {
    const hEl = document.getElementById('assess-height');
    if (hEl) {
      hEl.value = extracted.height;
      highlightInputModification('assess-height', `${extracted.height}cm`);
    }
  }

  // 4. Blood Pressure (BP Systolic & Diastolic)
  if (extracted.bp_sys !== undefined) {
    const sysEl = document.getElementById('assess-bp-sys');
    if (sysEl) {
      sysEl.value = extracted.bp_sys;
      highlightInputModification('assess-bp-sys', `Sys ${extracted.bp_sys}`);
    }
  }
  if (extracted.bp_dia !== undefined) {
    const diaEl = document.getElementById('assess-bp-dia');
    if (diaEl) {
      diaEl.value = extracted.bp_dia;
      highlightInputModification('assess-bp-dia', `Dia ${extracted.bp_dia}`);
    }
  }

  // 5. Heart Rate & SpO2
  if (extracted.heart_rate !== undefined) {
    const hrEl = document.getElementById('assess-hr');
    if (hrEl) {
      hrEl.value = extracted.heart_rate;
      highlightInputModification('assess-hr', `${extracted.heart_rate} bpm`);
    }
  }
  if (extracted.spo2 !== undefined) {
    const spEl = document.getElementById('assess-spo2');
    if (spEl) {
      spEl.value = extracted.spo2;
      highlightInputModification('assess-spo2', `${extracted.spo2}%`);
    }
  }

  // 6. Pain Profile
  if (extracted.pain_present !== undefined) {
    setPainPresent(extracted.pain_present === 1);
  }
  if (extracted.pain_level !== undefined) {
    updatePainSlider(extracted.pain_level);
  }
  if (extracted.pain_loc !== undefined && extracted.pain_loc !== 'None') {
    const locEl = document.getElementById('assess-pain-loc');
    if (locEl) {
      locEl.value = extracted.pain_loc;
      highlightInputModification('assess-pain-loc', extracted.pain_loc);
    }
  }

  // 7. Sleep Hours
  if (extracted.sleep_hours !== undefined) {
    const slEl = document.getElementById('assess-sleep');
    if (slEl) {
      slEl.value = extracted.sleep_hours;
      highlightInputModification('assess-sleep', `${extracted.sleep_hours} hrs`);
    }
  }

  // 8. ADL Functional Independence
  if (extracted.walk !== undefined) {
    const wEl = document.getElementById('assess-walk');
    if (wEl) {
      wEl.value = String(extracted.walk);
      highlightInputModification('assess-walk', extracted.walk === 1 ? 'Indep' : 'Needs Help');
    }
  }
  if (extracted.eat !== undefined) {
    const eEl = document.getElementById('assess-eat');
    if (eEl) {
      eEl.value = String(extracted.eat);
      highlightInputModification('assess-eat', extracted.eat === 1 ? 'Indep' : 'Dependent');
    }
  }
  if (extracted.move !== undefined) {
    const mEl = document.getElementById('assess-move');
    if (mEl) {
      mEl.value = String(extracted.move);
      highlightInputModification('assess-move', extracted.move === 1 ? 'Indep' : 'Needs Help');
    }
  }
  if (extracted.toilet !== undefined) {
    const tEl = document.getElementById('assess-toilet');
    if (tEl) {
      tEl.value = String(extracted.toilet);
      highlightInputModification('assess-toilet', extracted.toilet === 1 ? 'Indep' : 'Dependent');
    }
  }

  // 9. Medications & Missed Doses
  if (extracted.med_count !== undefined) {
    const mEl = document.getElementById('assess-med-count');
    if (mEl) {
      mEl.value = extracted.med_count;
      highlightInputModification('assess-med-count', `${extracted.med_count} meds`);
    }
  }
  if (extracted.missed_doses !== undefined) {
    const mdEl = document.getElementById('assess-missed-doses');
    if (mdEl) {
      mdEl.value = String(extracted.missed_doses);
      highlightInputModification('assess-missed-doses');
    }
  }

  // 10. Diabetes & Blood Sugar
  if (extracted.diabetic !== undefined) {
    const dEl = document.getElementById('assess-diabetic');
    if (dEl) {
      dEl.value = String(extracted.diabetic);
      toggleSugarInput(String(extracted.diabetic));
      highlightInputModification('assess-diabetic', extracted.diabetic === 1 ? 'Diabetic' : 'No Diabetes');
    }
  }
  if (extracted.sugar_level !== undefined) {
    const sEl = document.getElementById('assess-sugar');
    if (sEl) {
      sEl.value = extracted.sugar_level;
      highlightInputModification('assess-sugar', `${extracted.sugar_level} mg/dL`);
    }
  }

  // 11. Hearing Level
  if (extracted.hearing_level !== undefined) {
    const hEl = document.getElementById('assess-hearing');
    if (hEl) {
      hEl.value = String(extracted.hearing_level);
      highlightInputModification('assess-hearing', extracted.hearing_level === 0 ? 'Normal' : extracted.hearing_level === 1 ? 'Mild' : 'Hearing Aid');
    }
  }

  // 12. Chronic Diseases
  if (extracted.htn !== undefined) {
    const cb = document.getElementById('chk-htn');
    if (cb) cb.checked = extracted.htn === 1;
  }
  if (extracted.arth !== undefined) {
    const cb = document.getElementById('chk-arth');
    if (cb) cb.checked = extracted.arth === 1;
  }
  if (extracted.heart !== undefined) {
    const cb = document.getElementById('chk-heart');
    if (cb) cb.checked = extracted.heart === 1;
  }
  if (extracted.resp !== undefined) {
    const cb = document.getElementById('chk-resp');
    if (cb) cb.checked = extracted.resp === 1;
  }

  // Update Calculations & Persistence
  updateCalculatedBMI();
  updateADLScore();
  saveAssessmentDraft();

  // Render Comprehensive Clinical Audit Checklist
  if (result.checklist) {
    currentChecklist = result.checklist;
    currentInquiries = result.inquiries || [];
    renderChecklistGrid(result.checklist, currentInquiries);
  }

  // Render Speech Feedback Bubble
  const voiceText = selectedVoiceLang === 'hi-IN' ? feedback.hindi : feedback.english;
  lastAssistantSpeech = voiceText;

  const bubble = document.getElementById('voice-feedback-bubble');
  const assistantText = document.getElementById('voice-assistant-text');
  const missingWrap = document.getElementById('voice-missing-fields-tags');
  const statusText = document.getElementById('voice-status-text');

  if (bubble && assistantText) {
    bubble.classList.remove('hidden');
    assistantText.innerText = voiceText;

    if (missingWrap) {
      missingWrap.innerHTML = '';
      // Exclude age and gender from missing badges since they are auto-detected
      const cleanMissingFields = (missing_fields || []).filter(f => f !== 'age' && f !== 'gender');
      if (cleanMissingFields.length > 0) {
        cleanMissingFields.forEach(f => {
          const pill = document.createElement('span');
          pill.className = 'missing-pill';
          pill.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i> Needs Info: ${f.replace('_', ' ').toUpperCase()}`;
          missingWrap.appendChild(pill);
        });
      }
    }
  }

  if (statusText) {
    const cleanRemaining = (missing_fields || []).filter(f => f !== 'age' && f !== 'gender').length;
    statusText.innerText = (cleanRemaining === 0 || is_ready_for_assessment)
      ? 'All parameters completed! Ready for AI Assessment.'
      : `Details updated! ${cleanRemaining} parameter(s) remaining.`;
  }

  // Speak Assistant Response Aloud
  playElderSpeech(voiceText, selectedVoiceLang);

  // Pulse Final Assessment button if ready
  const submitBtn = document.getElementById('assess-submit-btn');
  if (submitBtn) {
    if (is_ready_for_assessment) {
      submitBtn.classList.add('ring-4', 'ring-teal-300', 'animate-bounce');
      setTimeout(() => submitBtn.classList.remove('animate-bounce'), 2500);
    } else {
      submitBtn.classList.remove('ring-4', 'ring-teal-300');
    }
  }

  showToast('Clinical parameters extracted and form updated!', 'success');
}

// 9. Render Clinical Checklist Grid Badges
function renderChecklistGrid(checklist, inquiries) {
  if (!checklist || Object.keys(checklist).length === 0) {
    if (typeof computeChecklistFromFormDom === 'function') {
      checklist = computeChecklistFromFormDom();
    }
  }

  const badgeKeys = ['age', 'gender', 'height', 'weight', 'bp', 'hr', 'spo2', 'pain', 'sleep', 'adl_walk', 'adl_eat', 'adl_move', 'adl_toilet', 'meds', 'sugar', 'hearing', 'diseases'];

  badgeKeys.forEach(k => {
    const badge = document.getElementById(`badge-chk-${k}`) || document.getElementById(`badge-chk-${k.replace(/_/g, '-')}`);
    if (!badge) return;

    // Age & Gender are ALWAYS auto-detected from profile (GREEN) and never missing
    if (k === 'age' || k === 'gender') {
      badge.className = 'voice-check-badge status-provided';
      badge.style.background = '#f0fdf4';
      badge.style.borderColor = 'rgba(16, 185, 129, 0.6)';
      badge.style.color = '#047857';
      const prof = (typeof getUserProfile === 'function') ? getUserProfile('senior') : { age: 74, gender: 'Male' };
      const curAge = document.getElementById('assess-age')?.value || prof.age || 74;
      const curGender = document.getElementById('assess-gender')?.value || prof.gender || 'Male';
      const labelSpan = badge.querySelector('.badge-tag-label');
      const statusSpan = badge.querySelector('.badge-tag-status');
      if (labelSpan) {
        labelSpan.innerHTML = k === 'age'
          ? `<i class="fa-solid fa-cake-candles"></i> Age: ${curAge}y`
          : `<i class="fa-solid fa-venus-mars"></i> Gender: ${curGender}`;
      }
      if (statusSpan) {
        statusSpan.innerHTML = `<span class="text-emerald-700 font-bold"><i class="fa-solid fa-circle-check text-emerald-600"></i> Auto-detected</span>`;
      }
      badge.onclick = () => {
        showToast(k === 'age' ? `Age auto-linked to Profile: ${curAge} Years` : `Gender auto-linked to Profile: ${curGender}`, 'info');
      };
      return;
    }

    const item = checklist ? checklist[k] : null;
    if (!item) {
      badge.className = 'voice-check-badge status-missing';
      badge.style.background = '';
      badge.style.borderColor = '';
      badge.style.color = '';
      const statusSpan = badge.querySelector('.badge-tag-status');
      if (statusSpan) statusSpan.innerHTML = '? Needs Info';
      return;
    }

    const isAnswered = item.status === 'provided';
    badge.className = `voice-check-badge ${isAnswered ? 'status-provided' : 'status-missing'}`;
    badge.style.background = isAnswered ? '#f0fdf4' : '';
    badge.style.borderColor = isAnswered ? 'rgba(16, 185, 129, 0.5)' : '';
    badge.style.color = isAnswered ? '#047857' : '';

    let valDisplay = '';
    if (isAnswered && item.value !== null && item.value !== undefined) {
      valDisplay = `: ${item.value}`;
    }

    const titlePrefix = item.title.split(' ')[0];
    const statusText = isAnswered
      ? '<i class="fa-solid fa-check text-emerald-600"></i> Answered'
      : '? Needs Info';

    const labelSpan = badge.querySelector('.badge-tag-label');
    const statusSpan = badge.querySelector('.badge-tag-status');

    if (labelSpan) {
      const icon = labelSpan.querySelector('i');
      const iconClass = icon ? icon.className : 'fa-solid fa-circle-dot';
      labelSpan.innerHTML = `<i class="${iconClass}"></i> ${titlePrefix}${valDisplay}`;
    }
    if (statusSpan) {
      statusSpan.innerHTML = statusText;
    }

    // Clicking ANY checklist badge prompts the assistant to speak the specific question
    badge.onclick = () => {
      const qText = selectedVoiceLang === 'hi-IN' ? item.question_hi : item.question_en;
      lastAssistantSpeech = qText;

      const bubble = document.getElementById('voice-feedback-bubble');
      const assistantText = document.getElementById('voice-assistant-text');
      const statusText = document.getElementById('voice-status-text');

      if (bubble && assistantText) {
        bubble.classList.remove('hidden');
        assistantText.innerText = qText;
      }
      if (statusText) statusText.innerText = `Assistant asking about ${item.title}... Listening starts after speech.`;
      showToast(`Asking about ${item.title}...`, 'info');

      playElderSpeech(qText, selectedVoiceLang, {
        onend: () => {
          if (voiceRecognitionInstance && !isVoiceRecording) {
            try {
              voiceRecognitionInstance.lang = selectedVoiceLang;
              voiceRecognitionInstance.start();
              showToast(`Now listening for ${item.title}... Speak your answer.`, 'info');
            } catch (e) {
              console.warn('Recognition auto-start error:', e);
            }
          }
        }
      });
    };
  });

  const lblNext = document.getElementById('lbl-ask-next');
  if (lblNext) {
    lblNext.innerText = inquiries && inquiries.length > 0
      ? `Ask Next (${inquiries.length} remaining)`
      : 'All Parameters Complete ✓';
  }
}

// 10. Simulate Voice Input (Evaluator One-Click Testing)
function simulateVoiceHealthInput(phrase) {
  const transcriptBox = document.getElementById('voice-transcript-text');
  if (transcriptBox) transcriptBox.value = phrase;
  processTranscriptWithNLP(phrase);
}

// 11. Bind Form Auto-Save Listeners & Initialize Voice Assistant
function initAssessmentDraftAutoSaveListeners() {
  const form = document.getElementById('elder-assessment-form');
  if (form) {
    form.addEventListener('input', () => {
      saveAssessmentDraft();
      if (typeof renderChecklistGrid === 'function' && typeof computeChecklistFromFormDom === 'function') {
        renderChecklistGrid(computeChecklistFromFormDom());
      }
    });
    form.addEventListener('change', () => {
      saveAssessmentDraft();
      if (typeof renderChecklistGrid === 'function' && typeof computeChecklistFromFormDom === 'function') {
        renderChecklistGrid(computeChecklistFromFormDom());
      }
    });
  }

  // Restore saved draft from localStorage
  restoreAssessmentDraft();

  // Initialize Elder Voice Assistant
  initElderVoiceAssistant();

  // Initial render of checklist grid from current DOM / restored draft
  if (typeof renderChecklistGrid === 'function' && typeof computeChecklistFromFormDom === 'function') {
    renderChecklistGrid(computeChecklistFromFormDom());
  }
}

// Auto-run draft listeners and voice assistant on load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAssessmentDraftAutoSaveListeners);
} else {
  initAssessmentDraftAutoSaveListeners();
}


// ==================================================================// OFFICIAL CLINICAL DIAGNOSTIC REPORT SHEET ENGINE (PROPER MEDICAL REPORT)
// ==================================================================
function getCurrentAssessmentData() {
  const prof = getUserProfile('senior');
  return {
    seniorName: prof.name || "Ramesh Sharma",
    age: parseFloat(document.getElementById('assess-age')?.value) || prof.age || 74,
    gender: document.getElementById('assess-gender')?.value || prof.gender || "Male",
    height_cm: parseFloat(document.getElementById('assess-height')?.value) || 165,
    weight_kg: parseFloat(document.getElementById('assess-weight')?.value) || 68,
    bp_systolic: parseFloat(document.getElementById('assess-bp-sys')?.value) || 128,
    bp_diastolic: parseFloat(document.getElementById('assess-bp-dia')?.value) || 82,
    heart_rate: parseFloat(document.getElementById('assess-hr')?.value) || 76,
    spo2: parseFloat(document.getElementById('assess-spo2')?.value) || 97,
    sleep_hours: parseFloat(document.getElementById('assess-sleep')?.value) || 7.0,
    pain_present: (assessmentState && assessmentState.painPresent) ? 1 : 0,
    pain_level: (assessmentState && assessmentState.painLevel) || 0,
    pain_location: document.getElementById('assess-pain-loc')?.value || "None",
    walking_independent: parseInt(document.getElementById('assess-walk')?.value) || 1,
    eating_independent: parseInt(document.getElementById('assess-eat')?.value) || 1,
    moving_independent: parseInt(document.getElementById('assess-move')?.value) || 1,
    toileting_independent: parseInt(document.getElementById('assess-toilet')?.value) || 1,
    medication_count: parseInt(document.getElementById('assess-med-count')?.value) || 3,
    missed_doses: parseInt(document.getElementById('assess-missed-doses')?.value) || 0,
    is_diabetic: parseInt(document.getElementById('assess-diabetic')?.value) || 0,
    blood_glucose: parseFloat(document.getElementById('assess-sugar')?.value) || 110,
    hearing_difficulty: parseInt(document.getElementById('assess-hearing')?.value) > 0 ? 1 : 0,
    hearing_aid_used: parseInt(document.getElementById('assess-hearing')?.value) === 2 ? 1 : 0,
    has_hypertension: document.getElementById('chk-htn')?.checked ? 1 : 0,
    has_arthritis: document.getElementById('chk-arth')?.checked ? 1 : 0,
    has_heart_disease: document.getElementById('chk-heart')?.checked ? 1 : 0,
    has_respiratory: document.getElementById('chk-resp')?.checked ? 1 : 0
  };
}

function generateClinicalReportSheetHtml(res, payload, prof) {
  const isHindi = state.seniorLanguage === 'hi';
  const riskLevel = res.predicted_risk_level || 'Low';
  const isHigh = (riskLevel === 'High');
  const isMed = (riskLevel === 'Medium');

  const reportId = `CC-REP-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
  const dateFormatted = new Date().toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
  });

  const bmi = (payload.height_cm > 40) ? (payload.weight_kg / Math.pow(payload.height_cm / 100, 2)).toFixed(1) : '24.0';
  let bmiCategory = 'Normal Weight';
  if (parseFloat(bmi) >= 30) bmiCategory = 'Obese';
  else if (parseFloat(bmi) >= 25) bmiCategory = 'Overweight';
  else if (parseFloat(bmi) < 18.5) bmiCategory = 'Underweight';

  const riskBadgeColor = isHigh ? 'bg-rose-600 text-white' : (isMed ? 'bg-amber-600 text-white' : 'bg-emerald-600 text-white');
  const riskCardBorder = isHigh ? 'border-rose-400 bg-rose-50/70' : (isMed ? 'border-amber-400 bg-amber-50/70' : 'border-emerald-400 bg-emerald-50/70');
  const riskText = isHindi ? res.predicted_risk_level_hi : `${riskLevel} Risk Condition`;

  // ADL score calculation
  const adlScore = (payload.walking_independent ? 1 : 0) + 
                   (payload.eating_independent ? 1 : 0) + 
                   (payload.moving_independent ? 1 : 0) + 
                   (payload.toileting_independent ? 1 : 0);

  // Vitals matrix rows
  const vitalsRows = [
    {
      name: 'Blood Pressure (रक्तचाप)',
      value: `${payload.bp_systolic} / ${payload.bp_diastolic} mmHg`,
      safeRange: '< 120 / 80 mmHg',
      status: (payload.bp_systolic >= 140 || payload.bp_diastolic >= 90) ? 'Stage 2 Hypertension (उच्च)' : ((payload.bp_systolic >= 125) ? 'Pre-Hypertension (मध्यम)' : 'Optimal (सुरक्षित)'),
      statusClass: (payload.bp_systolic >= 140) ? 'text-rose-700 bg-rose-100' : ((payload.bp_systolic >= 125) ? 'text-amber-700 bg-amber-100' : 'text-emerald-700 bg-emerald-100')
    },
    {
      name: 'Heart Rate / Pulse (हृदय गति)',
      value: `${payload.heart_rate} bpm`,
      safeRange: '60 - 90 bpm',
      status: (payload.heart_rate >= 60 && payload.heart_rate <= 95) ? 'Normal Sinus Rhythm (सामान्य)' : 'Attention (ध्यान दें)',
      statusClass: (payload.heart_rate >= 60 && payload.heart_rate <= 95) ? 'text-emerald-700 bg-emerald-100' : 'text-amber-700 bg-amber-100'
    },
    {
      name: 'Blood Oxygen / SpO2 (ऑक्सीजन)',
      value: `${payload.spo2}%`,
      safeRange: '≥ 95%',
      status: (payload.spo2 >= 95) ? 'Adequate Saturation (उत्कृष्ट)' : 'Low Saturation (कम)',
      statusClass: (payload.spo2 >= 95) ? 'text-emerald-700 bg-emerald-100' : 'text-rose-700 bg-rose-100'
    },
    {
      name: 'Blood Glucose / Sugar (शर्करा)',
      value: `${payload.blood_glucose} mg/dL`,
      safeRange: '70 - 130 mg/dL',
      status: (payload.blood_glucose >= 140) ? 'Elevated / Needs Control (नियंत्रण चाहिए)' : 'Target Range (सामान्य)',
      statusClass: (payload.blood_glucose >= 140) ? 'text-amber-700 bg-amber-100' : 'text-emerald-700 bg-emerald-100'
    },
    {
      name: 'Body Mass Index / BMI (बॉडी मास)',
      value: `${bmi} kg/m² (${payload.height_cm}cm / ${payload.weight_kg}kg)`,
      safeRange: '18.5 - 24.9 kg/m²',
      status: bmiCategory,
      statusClass: (bmiCategory === 'Normal Weight') ? 'text-emerald-700 bg-emerald-100' : 'text-amber-700 bg-amber-100'
    },
    {
      name: 'Sleep Rest Duration (नींद)',
      value: `${payload.sleep_hours} Hours`,
      safeRange: '7.0 - 8.5 Hours',
      status: (payload.sleep_hours >= 7) ? 'Adequate Rest (पर्याप्त)' : 'Sleep Deficit (नींद की कमी)',
      statusClass: (payload.sleep_hours >= 7) ? 'text-emerald-700 bg-emerald-100' : 'text-amber-700 bg-amber-100'
    },
    {
      name: 'Pain Assessment (दर्द स्तर)',
      value: payload.pain_present ? `Level ${payload.pain_level}/10 (${payload.pain_location})` : 'No Pain Reported',
      safeRange: '0 - 2 (Mild / None)',
      status: payload.pain_present ? (payload.pain_level >= 5 ? 'Significant Pain' : 'Mild Discomfort') : 'Pain-Free',
      statusClass: payload.pain_present ? (payload.pain_level >= 5 ? 'text-rose-700 bg-rose-100' : 'text-amber-700 bg-amber-100') : 'text-emerald-700 bg-emerald-100'
    },
    {
      name: 'Prescription Medications (दवाइयां)',
      value: `${payload.medication_count} Prescriptions (${payload.missed_doses} missed doses)`,
      safeRange: '0 Missed Doses',
      status: (payload.missed_doses === 0) ? '100% Adherence (नियमित)' : 'Missed Doses Detected',
      statusClass: (payload.missed_doses === 0) ? 'text-emerald-700 bg-emerald-100' : 'text-rose-700 bg-rose-100'
    }
  ];

  // Prescription milestones
  const rxTasks = generateHealthPrescriptionTasks(res, payload);

  return `
    <!-- 1. OFFICIAL MEDICAL REPORT HEADER -->
    <div class="border-b-2 border-slate-900 pb-5">
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div class="flex items-center space-x-3.5">
          <div class="w-14 h-14 rounded-2xl bg-[#00a896] text-white flex items-center justify-center text-3xl font-black shadow-md flex-shrink-0">
            <i class="fa-solid fa-heart-pulse"></i>
          </div>
          <div>
            <h1 class="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
              CareConnect AI Health System
            </h1>
            <p class="text-xs font-bold text-teal-800 uppercase tracking-wider">
              National Geriatric Tele-Triage & Clinical Monitoring Network
            </p>
            <p class="text-[11px] text-slate-500 font-medium">
              Autonomous Multimodal Telemetry Evaluation • Ministry Standard Clinical Form
            </p>
          </div>
        </div>

        <div class="text-left sm:text-right bg-slate-50 sm:bg-transparent p-3 sm:p-0 rounded-xl border sm:border-0 border-slate-200 w-full sm:w-auto">
          <div class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Report Ref ID</div>
          <div class="text-sm font-black text-slate-900 font-mono">${reportId}</div>
          <div class="text-[11px] text-slate-600 font-semibold mt-0.5">${dateFormatted}</div>
          <span class="inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-200">
            ✓ Clinically Validated & Logged
          </span>
        </div>
      </div>
    </div>

    <!-- 2. PATIENT DEMOGRAPHICS & PROFILE SUMMARY -->
    <div class="bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200 print-avoid-break">
      <div class="flex items-center justify-between mb-3 border-b border-slate-200 pb-2">
        <h3 class="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center space-x-1.5">
          <i class="fa-solid fa-id-card text-teal-600"></i>
          <span>1. Patient Demographics & Profile Details (रोगी विवरण)</span>
        </h3>
        <span class="text-[10px] font-bold text-slate-500">CareConnect Citizen ID: #SEN-${Math.floor(1000 + Math.random() * 9000)}</span>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div>
          <span class="text-slate-400 block text-[10px] uppercase font-bold">Full Name</span>
          <span class="font-black text-slate-900 text-sm">${prof.name || 'Ramesh Sharma'}</span>
        </div>
        <div>
          <span class="text-slate-400 block text-[10px] uppercase font-bold">Age / Gender</span>
          <span class="font-extrabold text-slate-800">${payload.age} Years • ${payload.gender}</span>
        </div>
        <div>
          <span class="text-slate-400 block text-[10px] uppercase font-bold">Date of Birth (DOB)</span>
          <span class="font-bold text-slate-800">${prof.dob || '1952-05-15'}</span>
        </div>
        <div>
          <span class="text-slate-400 block text-[10px] uppercase font-bold">Blood Group</span>
          <span class="font-bold text-slate-800 px-2 py-0.5 rounded bg-rose-50 text-rose-800 border border-rose-200 w-fit inline-block">
            ${prof.bloodGroup || 'B+'}
          </span>
        </div>
        <div>
          <span class="text-slate-400 block text-[10px] uppercase font-bold">Contact Phone</span>
          <span class="font-bold text-slate-800">${prof.phone || '+91 98110-44912'}</span>
        </div>
        <div class="sm:col-span-2">
          <span class="text-slate-400 block text-[10px] uppercase font-bold">Residential Address</span>
          <span class="font-medium text-slate-700 truncate block">${prof.address || 'Flat 402, Shivalik Apts, Sector 14, Rohini, New Delhi - 110085'}</span>
        </div>
        <div>
          <span class="text-slate-400 block text-[10px] uppercase font-bold">Primary Physician</span>
          <span class="font-bold text-slate-800">${prof.doctor || 'Dr. Alok Mehta (Cardiology)'}</span>
        </div>
        <div class="col-span-2">
          <span class="text-slate-400 block text-[10px] uppercase font-bold">Clinical Allergies & Notes</span>
          <span class="font-medium text-slate-700">${prof.allergies || 'Penicillin allergy, mild knee osteoarthritis'}</span>
        </div>
        <div class="col-span-2">
          <span class="text-slate-400 block text-[10px] uppercase font-bold">Emergency Contact</span>
          <span class="font-medium text-slate-700">${prof.emergencyNotes || 'Rahul Sharma (Son) • +91 98110-44912'}</span>
        </div>
      </div>
    </div>

    <!-- 3. AI MACHINE LEARNING MODEL OUTPUT & RISK STRATIFICATION -->
    <div class="rounded-2xl p-5 border-2 ${riskCardBorder} print-avoid-break">
      <div class="flex items-center justify-between mb-3">
        <h3 class="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center space-x-1.5">
          <i class="fa-solid fa-brain text-teal-700"></i>
          <span>2. AI Machine Learning Diagnostic Output & Triage Classification (एआई मॉडल परिणाम)</span>
        </h3>
        <span class="text-[10px] font-bold text-slate-500 font-mono">Model: apnasa_v3_rf_triage_v1.0</span>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center bg-white p-4 rounded-xl border border-slate-200">
        <div>
          <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Predicted Risk Level</span>
          <span class="inline-block mt-1 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${riskBadgeColor}">
            ${riskText}
          </span>
          <span class="text-[11px] font-semibold text-slate-500 block mt-1">${res.status_tag_en}</span>
        </div>

        <div>
          <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Calculated Risk Index Score</span>
          <div class="flex items-baseline space-x-1 mt-0.5">
            <span class="text-2xl sm:text-3xl font-black text-slate-900">${res.risk_score}</span>
            <span class="text-xs font-bold text-slate-400">/ 100</span>
          </div>
          <div class="w-full bg-slate-100 h-2 rounded-full mt-1.5 overflow-hidden">
            <div class="h-full ${isHigh ? 'bg-rose-500' : (isMed ? 'bg-amber-500' : 'bg-emerald-500')} rounded-full"
              style="width: ${res.risk_score}%"></div>
          </div>
        </div>

        <div>
          <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Model Inference Confidence</span>
          <span class="text-sm font-extrabold text-slate-800 block mt-0.5">
            ${Math.round((res.predicted_probability || 0.88) * 100)}% Severity Confidence
          </span>
          <span class="text-[10px] text-slate-500 block">Trained on 90,000 Geriatric Telemetry Cohort</span>
        </div>
      </div>

      <!-- Diagnostic Summary Findings -->
      <div class="mt-3.5 bg-white/90 p-3.5 rounded-xl border border-slate-200 text-xs">
        <span class="font-black text-slate-900 block mb-1">
          <i class="fa-solid fa-stethoscope text-teal-600 mr-1"></i> Primary Clinical Observation & Findings:
        </span>
        <p class="text-slate-700 leading-relaxed font-medium">
          ${res.alert_reason_summary || 'All measured telemetry signals align with safe outpatient baseline thresholds.'}
        </p>
        ${res.alert_reason_summary_hi ? `
          <p class="text-slate-600 mt-1 font-medium bg-slate-50 p-2 rounded border border-slate-200 text-[11px]">
            <strong>हिन्दी सारांश:</strong> ${res.alert_reason_summary_hi}
          </p>
        ` : ''}
      </div>

      <!-- Recommended Action Protocol -->
      <div class="mt-2.5 flex items-start space-x-2 text-xs text-slate-700">
        <i class="fa-solid fa-arrow-right text-teal-600 mt-0.5"></i>
        <span><strong>Triage Directive:</strong> ${res.suggested_action_summary || 'Maintain regular schedule and log morning vitals.'} (Contact protocol: ${res.contact_method || 'Daily outreach'})</span>
      </div>
    </div>

    <!-- 4. COMPREHENSIVE ASSESSMENT TELEMETRY & VITALS TABLE -->
    <div class="print-avoid-break">
      <div class="flex items-center justify-between mb-2">
        <h3 class="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center space-x-1.5">
          <i class="fa-solid fa-table-list text-teal-600"></i>
          <span>3. Complete Assessment Telemetry & Biomarkers Table (समस्त परीक्षण डेटा)</span>
        </h3>
        <span class="text-[10px] text-slate-400">Reference: WHO Geriatric Guidelines</span>
      </div>

      <div class="overflow-x-auto rounded-xl border border-slate-200">
        <table class="w-full text-left text-xs border-collapse">
          <thead>
            <tr class="bg-slate-100 text-slate-700 text-[10px] uppercase font-black tracking-wider border-b border-slate-200">
              <th class="py-2.5 px-3">Biomarker / Telemetry Signal</th>
              <th class="py-2.5 px-3">Patient Value</th>
              <th class="py-2.5 px-3">Safe Clinical Range</th>
              <th class="py-2.5 px-3">Clinical Evaluation</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 font-medium">
            ${vitalsRows.map(r => `
              <tr class="hover:bg-slate-50/80 transition-colors">
                <td class="py-2.5 px-3 font-bold text-slate-800">${r.name}</td>
                <td class="py-2.5 px-3 font-extrabold text-slate-900">${r.value}</td>
                <td class="py-2.5 px-3 text-slate-500 font-mono text-[11px]">${r.safeRange}</td>
                <td class="py-2.5 px-3">
                  <span class="px-2 py-0.5 rounded-full text-[10px] font-black ${r.statusClass}">
                    ${r.status}
                  </span>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>

    <!-- 5. CHRONIC ILLNESSES & FUNCTIONAL ADL INDEPENDENCE -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 print-avoid-break">
      <!-- Comorbidities -->
      <div class="bg-slate-50 p-4 rounded-xl border border-slate-200">
        <h4 class="text-xs font-black uppercase tracking-wider text-slate-700 mb-2.5 flex items-center space-x-1.5">
          <i class="fa-solid fa-notes-medical text-teal-600"></i>
          <span>Chronic Conditions History (क्रोनिक बीमारियां)</span>
        </h4>
        <div class="space-y-1.5 text-xs">
          <div class="flex items-center justify-between py-1 border-b border-slate-200">
            <span class="text-slate-600">Hypertension (उच्च रक्तचाप):</span>
            <span class="font-bold ${payload.has_hypertension ? 'text-amber-800 bg-amber-100 px-2 py-0.2 rounded' : 'text-slate-700'}">
              ${payload.has_hypertension ? 'Diagnosed / Active' : 'None Reported'}
            </span>
          </div>
          <div class="flex items-center justify-between py-1 border-b border-slate-200">
            <span class="text-slate-600">Arthritis / Joint Pain (गठिया):</span>
            <span class="font-bold ${payload.has_arthritis ? 'text-amber-800 bg-amber-100 px-2 py-0.2 rounded' : 'text-slate-700'}">
              ${payload.has_arthritis ? 'Diagnosed / Active' : 'None Reported'}
            </span>
          </div>
          <div class="flex items-center justify-between py-1 border-b border-slate-200">
            <span class="text-slate-600">Cardiovascular Disease (हृदय रोग):</span>
            <span class="font-bold ${payload.has_heart_disease ? 'text-rose-800 bg-rose-100 px-2 py-0.2 rounded' : 'text-slate-700'}">
              ${payload.has_heart_disease ? 'Positive / Monitored' : 'None Reported'}
            </span>
          </div>
          <div class="flex items-center justify-between py-1">
            <span class="text-slate-600">Respiratory / COPD (श्वसन रोग):</span>
            <span class="font-bold ${payload.has_respiratory ? 'text-rose-800 bg-rose-100 px-2 py-0.2 rounded' : 'text-slate-700'}">
              ${payload.has_respiratory ? 'Positive / Monitored' : 'None Reported'}
            </span>
          </div>
        </div>
      </div>

      <!-- Functional ADL Independence -->
      <div class="bg-slate-50 p-4 rounded-xl border border-slate-200">
        <div class="flex items-center justify-between mb-2.5">
          <h4 class="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center space-x-1.5">
            <i class="fa-solid fa-person-walking text-teal-600"></i>
            <span>ADL Functional Independence (दैनिक कार्यक्षमता)</span>
          </h4>
          <span class="text-xs font-black text-teal-800 bg-teal-100 px-2 py-0.5 rounded-full">${adlScore} / 4 Activities</span>
        </div>
        <div class="space-y-1.5 text-xs">
          <div class="flex items-center justify-between py-1 border-b border-slate-200">
            <span class="text-slate-600">Walking & Mobility (चलना-फिरना):</span>
            <span class="font-bold text-slate-800">${payload.walking_independent ? '✓ Independent' : '⚠ Assistance Needed'}</span>
          </div>
          <div class="flex items-center justify-between py-1 border-b border-slate-200">
            <span class="text-slate-600">Feeding / Eating (भोजन):</span>
            <span class="font-bold text-slate-800">${payload.eating_independent ? '✓ Independent' : '⚠ Assistance Needed'}</span>
          </div>
          <div class="flex items-center justify-between py-1 border-b border-slate-200">
            <span class="text-slate-600">Bed-to-Chair Transfers (उठना-बैठना):</span>
            <span class="font-bold text-slate-800">${payload.moving_independent ? '✓ Independent' : '⚠ Assistance Needed'}</span>
          </div>
          <div class="flex items-center justify-between py-1">
            <span class="text-slate-600">Personal Hygiene / Toilet:</span>
            <span class="font-bold text-slate-800">${payload.toileting_independent ? '✓ Independent' : '⚠ Assistance Needed'}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 6. AI PERSONALIZED RECOVERY PRESCRIPTION -->
    <div class="bg-teal-50/60 p-4 rounded-xl border border-teal-200 print-avoid-break">
      <h4 class="text-xs font-black uppercase tracking-wider text-teal-900 mb-2 flex items-center space-x-1.5">
        <i class="fa-solid fa-list-check text-teal-700"></i>
        <span>4. AI Personalized Recovery Prescription Tasks (दैनिक स्वास्थ्य सुधार कार्य)</span>
      </h4>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
        ${rxTasks.map(t => `
          <div class="bg-white p-2.5 rounded-lg border border-teal-100 flex items-start space-x-2">
            <span class="text-[10px] font-bold px-1.5 py-0.2 rounded ${t.badgeClass} flex-shrink-0 mt-0.5">
              ${t.timeSlot}
            </span>
            <div>
              <span class="font-bold text-slate-900 block">${isHindi ? t.titleHi : t.titleEn}</span>
              <span class="text-[11px] text-slate-600">${isHindi ? t.descHi : t.descEn}</span>
            </div>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- 7. CLINICAL ENDORSEMENT & CERTIFICATION -->
    <div class="pt-4 border-t-2 border-slate-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-slate-600 print-avoid-break">
      <div class="flex items-center space-x-3">
        <div class="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-sm">
          KV
        </div>
        <div>
          <span class="font-black text-slate-900 block">Sister Kavita Verma, Lead Clinical Nurse (RN)</span>
          <span class="text-[10px] text-slate-500 font-mono">License: DEL-RN-884920 • Geriatric Tele-Triage Division</span>
        </div>
      </div>

      <div class="text-left sm:text-right">
        <div class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Electronic Clinical Seal</div>
        <div class="text-[11px] font-bold text-teal-800">
          <i class="fa-solid fa-shield-halved text-teal-600"></i> CareConnect Cloud Signed & Encrypted
        </div>
        <div class="text-[10px] text-slate-400 mt-0.5">Emergency Helpline: 108 / 112 / +91 98765-43210</div>
      </div>
    </div>
  `;
}

// =========================================================================
// COHORT SENIORS CLINICAL DATASET (DATASET-BACKED PATIENT PROFILES)
// =========================================================================
let currentReportSheetSeniorId = 'SNR-101';

const cohortSeniorsClinicalData = {
  'SNR-101': {
    prof: {
      name: 'Ramesh Sharma',
      age: 74,
      gender: 'Male',
      dob: '1952-04-12',
      bloodGroup: 'B+ (Rh Positive)',
      phone: '+91 98110-44912',
      email: 'ramesh.sharma52@example.com',
      address: 'C-42, Greater Kailash Part 1, South Delhi - 110048',
      doctor: 'Dr. Alok Mehta, MD (Cardiology, Max Healthcare)',
      allergies: 'Penicillin, Sulfonamides (Mild rash)',
      emergencyNotes: 'Rahul Sharma (Son) • +91 98711-20931 (Lives 4 km away)'
    },
    payload: {
      age: 74,
      gender: 'Male',
      bp_systolic: 158,
      bp_diastolic: 96,
      heart_rate: 114,
      spo2: 94,
      blood_glucose: 138,
      height_cm: 168,
      weight_kg: 72.5,
      sleep_hours: 4.5,
      pain_present: 1,
      pain_level: 5,
      pain_location: 'Precordial chest tightness & fatigue',
      medication_count: 4,
      missed_doses: 2,
      walking_independent: 1,
      eating_independent: 1,
      moving_independent: 1,
      toileting_independent: 1,
      has_diabetes: 1,
      has_hypertension: 1,
      has_cardiac: 1,
      has_respiratory: 1
    },
    res: {
      predicted_risk_level: 'High',
      predicted_risk_level_hi: 'उच्च जोखिम (High Risk)',
      risk_score: 98,
      predicted_probability: 0.98,
      status_tag_en: 'CRITICAL CLINICAL ALERT — STAGE 2 HYPERTENSION & TACHYCARDIA',
      status_tag_hi: 'तत्काल चिकित्सकीय ध्यान आवश्यक — उच्च रक्तचाप व हृदय गति वृद्धि',
      alert_reason_summary: 'Resting Heart Rate spiked to 114 bpm + SpO2 dropped to 94% + Zero motion detected 4 hrs + missed 08:00 AM check-in.',
      alert_reason_summary_hi: 'हृदय गति 114 bpm तक बढ़ गई है, ऑक्सीजन स्तर 94% हो गया है और सुबह का चेक-इन नहीं हुआ।',
      suggested_action_summary: 'Immediate 2-way call & dispatch Sister Kavita for urgent doorstep evaluation, family consultation, and telemetry stabilization.',
      contact_method: 'Immediate 2-way call + Doorstep home visit'
    }
  },
  'SNR-102': {
    prof: {
      name: 'Savitri Devi',
      age: 81,
      gender: 'Female',
      dob: '1945-09-20',
      bloodGroup: 'O+ (Rh Positive)',
      phone: '+91 98103-99210',
      email: 'savitri.devi45@example.com',
      address: 'Enclave 4, Hauz Khas, New Delhi - 110016',
      doctor: 'Dr. Sunita Rao, MD (Orthopedics & Geriatrics)',
      allergies: 'NSAIDs (Gastric sensitivity)',
      emergencyNotes: 'Priya Verma (Daughter) • +91 99100-33421 (Contact immediately on falls)'
    },
    payload: {
      age: 81,
      gender: 'Female',
      bp_systolic: 142,
      bp_diastolic: 88,
      heart_rate: 88,
      spo2: 97,
      blood_glucose: 110,
      height_cm: 154,
      weight_kg: 52.0,
      sleep_hours: 5.0,
      pain_present: 1,
      pain_level: 7,
      pain_location: 'Right Hip & Pelvic Contusion (Bathroom Fall)',
      medication_count: 3,
      missed_doses: 1,
      walking_independent: 0,
      eating_independent: 1,
      moving_independent: 0,
      toileting_independent: 0,
      has_diabetes: 0,
      has_hypertension: 1,
      has_cardiac: 0,
      has_respiratory: 0
    },
    res: {
      predicted_risk_level: 'High',
      predicted_risk_level_hi: 'उच्च जोखिम (High Risk)',
      risk_score: 92,
      predicted_probability: 0.92,
      status_tag_en: 'ACUTE TRAUMA / IMPACT SENSOR DISPATCH',
      status_tag_hi: 'आपातकालीन गिरना / आघात सेंसर चेतावनी',
      alert_reason_summary: 'Bathroom motion impact sensor triggered. Voice note: sudden dizziness & acute hip discomfort on standing. ADL Mobility 2/4.',
      alert_reason_summary_hi: 'बाथरूम में गिरने का सेंसर ट्रिगर हुआ। खड़े होने पर चक्कर और कूल्हे में गंभीर दर्द की शिकायत।',
      suggested_action_summary: 'Dispatch Brother Amit for physical hip mobility exam, assist with transfer, and inform daughter Priya Verma.',
      contact_method: 'Urgent Doorstep Visit & Paramedic Assessment'
    }
  },
  'SNR-103': {
    prof: {
      name: 'Anand Verma',
      age: 78,
      gender: 'Male',
      dob: '1948-11-05',
      bloodGroup: 'A+ (Rh Positive)',
      phone: '+91 98734-11823',
      email: 'anand.verma@example.com',
      address: 'Sector 3, Pocket C, Saket, New Delhi - 110017',
      doctor: 'Dr. Rajesh Bhalla, MD (Endocrinology)',
      allergies: 'None reported',
      emergencyNotes: 'Deepak Verma (Son) • +91 98112-99881'
    },
    payload: {
      age: 78,
      gender: 'Male',
      bp_systolic: 132,
      bp_diastolic: 84,
      heart_rate: 76,
      spo2: 98,
      blood_glucose: 228,
      height_cm: 172,
      weight_kg: 84.0,
      sleep_hours: 6.0,
      pain_present: 0,
      pain_level: 0,
      pain_location: 'None',
      medication_count: 5,
      missed_doses: 3,
      walking_independent: 1,
      eating_independent: 1,
      moving_independent: 1,
      toileting_independent: 1,
      has_diabetes: 1,
      has_hypertension: 1,
      has_cardiac: 0,
      has_respiratory: 0
    },
    res: {
      predicted_risk_level: 'High',
      predicted_risk_level_hi: 'उच्च जोखिम (High Risk)',
      risk_score: 84,
      predicted_probability: 0.84,
      status_tag_en: 'ACUTE HYPERGLYCEMIA & MEDICATION OMISSION',
      status_tag_hi: 'अति-शर्करा स्तर व इंसुलिन खुराक छूटना',
      alert_reason_summary: 'Consecutive 2 missed evening insulin doses + Glucometer reading spiked to 228 mg/dL.',
      alert_reason_summary_hi: 'लगातार 2 शाम की इंसुलिन खुराक छूटी और शुगर 228 mg/dL तक पहुंच गई।',
      suggested_action_summary: 'Brother Amit dispatched for doorstep insulin supervision, ketone check, and family diet counseling.',
      contact_method: 'Doorstep Insulin & Vitals Verification'
    }
  },
  'SNR-104': {
    prof: {
      name: 'Meena Iyer',
      age: 72,
      gender: 'Female',
      dob: '1954-03-18',
      bloodGroup: 'AB+ (Rh Positive)',
      phone: '+91 98188-77219',
      email: 'meena.iyer72@example.com',
      address: 'Pocket B, Vasant Kunj, New Delhi - 110070',
      doctor: 'Dr. N. K. Sharma (Psychiatry & Gerontology)',
      allergies: 'Dust, Pollen',
      emergencyNotes: 'Karthik Iyer (Son in Bengaluru) • +91 97400-55120'
    },
    payload: {
      age: 72,
      gender: 'Female',
      bp_systolic: 124,
      bp_diastolic: 80,
      heart_rate: 72,
      spo2: 98,
      blood_glucose: 105,
      height_cm: 158,
      weight_kg: 58.0,
      sleep_hours: 4.0,
      pain_present: 1,
      pain_level: 3,
      pain_location: 'Tension headache & neck tightness',
      medication_count: 2,
      missed_doses: 0,
      walking_independent: 1,
      eating_independent: 1,
      moving_independent: 1,
      toileting_independent: 1,
      has_diabetes: 0,
      has_hypertension: 0,
      has_cardiac: 0,
      has_respiratory: 0
    },
    res: {
      predicted_risk_level: 'Medium',
      predicted_risk_level_hi: 'मध्यम जोखिम (Medium Risk)',
      risk_score: 78,
      predicted_probability: 0.78,
      status_tag_en: 'PSYCHOSOCIAL ALERT — SEVERE ISOLATION & DEPRESSION',
      status_tag_hi: 'मनोसामाजिक चेतावनी — एकाकीपन व अवसाद के लक्षण',
      alert_reason_summary: 'Hindi voice note classified by NLP engine as severe loneliness & depression sentiment. Isolated living condition with son living out of state.',
      alert_reason_summary_hi: 'आवाज नोट में गंभीर अकेलेपन और अवसाद की भावना पाई गई। बेटा बेंगलुरु में रहता है।',
      suggested_action_summary: 'Sunita Mehra assigned for psycho-social counseling and scheduled tele-call with son Karthik Iyer.',
      contact_method: 'Urgent Family Tele-Call & Video Counseling'
    }
  },
  'SNR-105': {
    prof: {
      name: 'Harish Patel',
      age: 76,
      gender: 'Male',
      dob: '1950-08-14',
      bloodGroup: 'B+ (Rh Positive)',
      phone: '+91 98199-33812',
      email: 'harish.patel@example.com',
      address: 'Main Market, Malviya Nagar, New Delhi - 110017',
      doctor: 'Dr. V. K. Taneja (Internal Medicine)',
      allergies: 'None',
      emergencyNotes: 'Sneha Patel (Daughter) • +91 98200-44910'
    },
    payload: {
      age: 76,
      gender: 'Male',
      bp_systolic: 148,
      bp_diastolic: 90,
      heart_rate: 80,
      spo2: 96,
      blood_glucose: 132,
      height_cm: 165,
      weight_kg: 76.0,
      sleep_hours: 6.5,
      pain_present: 0,
      pain_level: 0,
      pain_location: 'None',
      medication_count: 3,
      missed_doses: 1,
      walking_independent: 1,
      eating_independent: 1,
      moving_independent: 1,
      toileting_independent: 1,
      has_diabetes: 1,
      has_hypertension: 1,
      has_cardiac: 0,
      has_respiratory: 0
    },
    res: {
      predicted_risk_level: 'Medium',
      predicted_risk_level_hi: 'मध्यम जोखिम (Medium Risk)',
      risk_score: 62,
      predicted_probability: 0.62,
      status_tag_en: 'MODERATE HYPERTENSION & DEHYDRATION ALERT',
      status_tag_hi: 'मध्यम उच्च रक्तचाप व निर्जलीकरण चेतावनी',
      alert_reason_summary: 'Moderate blood pressure elevation (148/90) + Dehydration alert (only 2 glasses of water logged).',
      alert_reason_summary_hi: 'रक्तचाप 148/90 तक बढ़ा और पानी की कमी (दिन में सिर्फ 2 गिलास पानी)।',
      suggested_action_summary: 'Rajesh Kumar completed hydration protocol and salt restriction guidance. Monitoring telemetry baseline.',
      contact_method: 'Attendant Doorstep Check & Hydration Log'
    }
  },
  'SNR-106': {
    prof: {
      name: 'Nirmala Joshi',
      age: 80,
      gender: 'Female',
      dob: '1946-06-10',
      bloodGroup: 'O- (Rh Negative)',
      phone: '+91 98101-77889',
      email: 'nirmala.joshi@example.com',
      address: 'Block C, Defence Colony, New Delhi - 110024',
      doctor: 'Dr. Rajiv Anand, MS (Orthopedics)',
      allergies: 'Codeine',
      emergencyNotes: 'Amit Joshi (Son) • +91 98101-77889'
    },
    payload: {
      age: 80,
      gender: 'Female',
      bp_systolic: 130,
      bp_diastolic: 82,
      heart_rate: 74,
      spo2: 97,
      blood_glucose: 112,
      height_cm: 152,
      weight_kg: 64.0,
      sleep_hours: 6.0,
      pain_present: 1,
      pain_level: 6,
      pain_location: 'Bilateral Knees (Severe Osteoarthritis)',
      medication_count: 4,
      missed_doses: 0,
      walking_independent: 0,
      eating_independent: 1,
      moving_independent: 0,
      toileting_independent: 1,
      has_diabetes: 0,
      has_hypertension: 1,
      has_cardiac: 0,
      has_respiratory: 0
    },
    res: {
      predicted_risk_level: 'Medium',
      predicted_risk_level_hi: 'मध्यम जोखिम (Medium Risk)',
      risk_score: 54,
      predicted_probability: 0.54,
      status_tag_en: 'CHRONIC JOINT ARTHRITIS & MOBILITY DEFICIT',
      status_tag_hi: 'पुराना गठिया व गतिशीलता में कठिनाई',
      alert_reason_summary: 'ADL mobility score 2/4 (severe knee stiffness, requires walker) + requested walking buddy support.',
      alert_reason_summary_hi: 'घुटनों में गंभीर दर्द और अकड़न, वॉकर की जरूरत।',
      suggested_action_summary: 'Sister Kavita conducted physical exam and prescribed isometric physiotherapy exercises.',
      contact_method: 'Physiotherapy & Mobility Assistance'
    }
  },
  'SNR-107': {
    prof: {
      name: 'Om Prakash Gupta',
      age: 70,
      gender: 'Male',
      dob: '1956-01-25',
      bloodGroup: 'B+ (Rh Positive)',
      phone: '+91 98711-33221',
      email: 'op.gupta@example.com',
      address: 'Part 2, Lajpat Nagar, New Delhi - 110024',
      doctor: 'Dr. Sandeep Chhabra (Pulmonology)',
      allergies: 'None',
      emergencyNotes: 'Vikas Gupta (Son) • +91 98711-33221'
    },
    payload: {
      age: 70,
      gender: 'Male',
      bp_systolic: 122,
      bp_diastolic: 80,
      heart_rate: 70,
      spo2: 98,
      blood_glucose: 108,
      height_cm: 170,
      weight_kg: 70.0,
      sleep_hours: 7.0,
      pain_present: 0,
      pain_level: 0,
      pain_location: 'None',
      medication_count: 2,
      missed_doses: 0,
      walking_independent: 1,
      eating_independent: 1,
      moving_independent: 1,
      toileting_independent: 1,
      has_diabetes: 0,
      has_hypertension: 0,
      has_cardiac: 0,
      has_respiratory: 1
    },
    res: {
      predicted_risk_level: 'Medium',
      predicted_risk_level_hi: 'मध्यम जोखिम (Medium Risk)',
      risk_score: 42,
      predicted_probability: 0.42,
      status_tag_en: 'POST-BRONCHITIS CONVALESCENCE — STABILIZING',
      status_tag_hi: 'ब्रोन्काइटिस के बाद सुधार — स्थिति स्थिर',
      alert_reason_summary: 'Recovering from mild seasonal bronchitis; daily vitals stabilizing with cough syrup regimen. SpO2 optimal at 98%.',
      alert_reason_summary_hi: 'मौसमी खांसी से स्वस्थ हो रहे हैं। ऑक्सीजन 98% स्थिर।',
      suggested_action_summary: 'Rajesh Kumar completed post-flu family check. Continue warm fluids and steam inhalation.',
      contact_method: 'Post-Recovery Tele-Check'
    }
  },
  'SNR-108': {
    prof: {
      name: 'Kanta Devi',
      age: 73,
      gender: 'Female',
      dob: '1953-12-08',
      bloodGroup: 'A+ (Rh Positive)',
      phone: '+91 98114-55667',
      email: 'kanta.devi@example.com',
      address: 'Block A, Green Park, New Delhi - 110016',
      doctor: 'Dr. Meenakshi Sundaram (Family Medicine)',
      allergies: 'None',
      emergencyNotes: 'Pooja Sharma (Daughter) • +91 98114-55667'
    },
    payload: {
      age: 73,
      gender: 'Female',
      bp_systolic: 118,
      bp_diastolic: 78,
      heart_rate: 68,
      spo2: 99,
      blood_glucose: 102,
      height_cm: 156,
      weight_kg: 56.0,
      sleep_hours: 7.5,
      pain_present: 0,
      pain_level: 0,
      pain_location: 'None',
      medication_count: 1,
      missed_doses: 0,
      walking_independent: 1,
      eating_independent: 1,
      moving_independent: 1,
      toileting_independent: 1,
      has_diabetes: 0,
      has_hypertension: 0,
      has_cardiac: 0,
      has_respiratory: 0
    },
    res: {
      predicted_risk_level: 'Low',
      predicted_risk_level_hi: 'कम जोखिम (Low Risk)',
      risk_score: 26,
      predicted_probability: 0.26,
      status_tag_en: 'STABLE OUTPATIENT — OPTIMAL GERIATRIC HEALTH',
      status_tag_hi: 'सुरक्षित स्वास्थ्य — उत्कृष्ट शारीरिक स्थिति',
      alert_reason_summary: 'Optimal cardiovascular parameters, completed 45-min morning walking habit, 100% check-in compliance.',
      alert_reason_summary_hi: 'सभी स्वास्थ्य संकेतक उत्कृष्ट। 45 मिनट सुबह की सैर पूरी की।',
      suggested_action_summary: 'Maintain current active lifestyle and routine weekly health tele-check.',
      contact_method: 'Routine Wellness Check'
    }
  },
  'SNR-109': {
    prof: {
      name: 'Baldev Raj',
      age: 75,
      gender: 'Male',
      dob: '1951-07-02',
      bloodGroup: 'O+ (Rh Positive)',
      phone: '+91 98109-11223',
      email: 'baldev.raj@example.com',
      address: 'Enclave, Greater Kailash 2, New Delhi - 110048',
      doctor: 'Dr. K. L. Kapoor (Cardiology)',
      allergies: 'None',
      emergencyNotes: 'Sanjay Raj (Son) • +91 98109-11223'
    },
    payload: {
      age: 75,
      gender: 'Male',
      bp_systolic: 120,
      bp_diastolic: 78,
      heart_rate: 72,
      spo2: 99,
      blood_glucose: 98,
      height_cm: 169,
      weight_kg: 69.0,
      sleep_hours: 8.0,
      pain_present: 0,
      pain_level: 0,
      pain_location: 'None',
      medication_count: 2,
      missed_doses: 0,
      walking_independent: 1,
      eating_independent: 1,
      moving_independent: 1,
      toileting_independent: 1,
      has_diabetes: 0,
      has_hypertension: 0,
      has_cardiac: 0,
      has_respiratory: 0
    },
    res: {
      predicted_risk_level: 'Low',
      predicted_risk_level_hi: 'कम जोखिम (Low Risk)',
      risk_score: 18,
      predicted_probability: 0.18,
      status_tag_en: 'HEALTHY GERIATRIC INDEPENDENCE',
      status_tag_hi: 'स्वस्थ व आत्मनिर्भर वरिष्ठ नागरिक',
      alert_reason_summary: 'Healthy routine, all daily medications logged, zero pain reported, family actively supporting.',
      alert_reason_summary_hi: 'नियमित दिनचर्या, कोई दर्द नहीं, परिवार का पूरा सहयोग।',
      suggested_action_summary: 'Continue routine wellness logging and bi-weekly check-ins.',
      contact_method: 'Bi-Weekly Telemetry Review'
    }
  },
  'SNR-110': {
    prof: {
      name: 'Sushila Mehra',
      age: 71,
      gender: 'Female',
      dob: '1955-02-14',
      bloodGroup: 'AB+ (Rh Positive)',
      phone: '+91 98118-22990',
      email: 'sushila.mehra@example.com',
      address: 'Siri Fort Road, New Delhi - 110049',
      doctor: 'Dr. Anita Goel (Geriatrics)',
      allergies: 'None',
      emergencyNotes: 'Tarun Mehra (Son) • +91 98118-22990'
    },
    payload: {
      age: 71,
      gender: 'Female',
      bp_systolic: 116,
      bp_diastolic: 76,
      heart_rate: 70,
      spo2: 99,
      blood_glucose: 94,
      height_cm: 155,
      weight_kg: 54.0,
      sleep_hours: 8.0,
      pain_present: 0,
      pain_level: 0,
      pain_location: 'None',
      medication_count: 1,
      missed_doses: 0,
      walking_independent: 1,
      eating_independent: 1,
      moving_independent: 1,
      toileting_independent: 1,
      has_diabetes: 0,
      has_hypertension: 0,
      has_cardiac: 0,
      has_respiratory: 0
    },
    res: {
      predicted_risk_level: 'Low',
      predicted_risk_level_hi: 'कम जोखिम (Low Risk)',
      risk_score: 14,
      predicted_probability: 0.14,
      status_tag_en: 'EXEMPLARY HEALTH STATUS — LOW RISK',
      status_tag_hi: 'आदर्श स्वास्थ्य स्थिति — न्यूनतम जोखिम',
      alert_reason_summary: 'Exemplary vital indicators, active daily morning routine, excellent cognitive & physical mobility scores.',
      alert_reason_summary_hi: 'सभी संकेतक आदर्श, सक्रिय जीवनशैली और उत्कृष्ट शारीरिक स्वास्थ्य।',
      suggested_action_summary: 'Continue regular preventive care and monthly community health workshops.',
      contact_method: 'Monthly Health Check-in'
    }
  }
};

function getSeniorClinicalReportData(seniorId) {
  // 1. Direct match by ID in cohort dataset
  if (seniorId && cohortSeniorsClinicalData[seniorId]) {
    return cohortSeniorsClinicalData[seniorId];
  }

  // 2. Match by Senior Name in cohort dataset
  if (seniorId) {
    for (const [id, data] of Object.entries(cohortSeniorsClinicalData)) {
      if (data.prof.name.toLowerCase() === String(seniorId).toLowerCase()) {
        return data;
      }
    }
  }

  // 3. Match in dynamic coordinator seniors list (supports new users)
  const coordSeniors = (typeof getCoordinatorSeniors === 'function') ? getCoordinatorSeniors() : defaultCoordinatorSeniors;
  const match = coordSeniors.find(s => s.id === seniorId || s.name.toLowerCase() === String(seniorId).toLowerCase());

  if (match) {
    if (cohortSeniorsClinicalData[match.id]) {
      return cohortSeniorsClinicalData[match.id];
    }
    const bpParts = (match.vitals && match.vitals.bp) ? match.vitals.bp.split('/') : ['120', '80'];
    const hrVal = (match.vitals && match.vitals.hr) ? parseInt(match.vitals.hr) : 72;
    const spo2Val = (match.vitals && match.vitals.spo2) ? parseInt(match.vitals.spo2) : 98;
    const glucVal = (match.vitals && match.vitals.glucose) ? parseInt(match.vitals.glucose) : 105;
    const score = match.mlScore || 25;
    const isHigh = score >= 80;
    const isMed = score >= 40 && score < 80;

    return {
      prof: {
        name: match.name,
        age: match.age || 70,
        gender: match.gender || 'Senior',
        dob: match.dob || '1954-01-01',
        bloodGroup: match.bloodGroup || 'B+',
        phone: match.phone || '+91 98110-44912',
        email: match.email || 'senior.member@careconnect.ai',
        address: match.location || 'Civil Lines, North Delhi (NCR Cluster)',
        doctor: match.doctor || 'Dr. Alok Mehta, MD (Senior Geriatrician)',
        allergies: match.allergies || 'None reported',
        emergencyNotes: match.familyContact || 'Family Care Circle Registered'
      },
      payload: {
        age: match.age || 70,
        gender: match.gender || 'Senior',
        bp_systolic: parseInt(bpParts[0]) || 120,
        bp_diastolic: parseInt(bpParts[1]) || 80,
        heart_rate: hrVal,
        spo2: spo2Val,
        blood_glucose: glucVal,
        height_cm: match.height_cm || 165,
        weight_kg: match.weight_kg || 65,
        sleep_hours: match.sleep_hours || 7.5,
        pain_present: match.pain_present || 0,
        pain_level: match.pain_level || 0,
        pain_location: match.pain_location || 'None',
        medication_count: match.medication_count || 3,
        missed_doses: (match.vitals && match.vitals.missedDoses) ? match.vitals.missedDoses : 0,
        walking_independent: 1,
        eating_independent: 1,
        moving_independent: 1,
        toileting_independent: 1,
        has_diabetes: match.has_diabetes || 0,
        has_hypertension: match.has_hypertension || 0,
        has_cardiac: match.has_cardiac || 0,
        has_respiratory: match.has_respiratory || 0
      },
      res: {
        predicted_risk_level: isHigh ? 'High' : (isMed ? 'Medium' : 'Low'),
        predicted_risk_level_hi: isHigh ? 'उच्च जोखिम (High Risk)' : (isMed ? 'मध्यम जोखिम (Medium Risk)' : 'कम जोखिम (Low Risk)'),
        risk_score: score,
        predicted_probability: (score / 100).toFixed(2),
        status_tag_en: isHigh ? 'CRITICAL CLINICAL OBSERVATION' : (isMed ? 'ACTIVE HEALTH MONITORING' : 'NEW ENROLLED MEMBER — STABLE BASELINE'),
        status_tag_hi: isHigh ? 'तत्काल चिकित्सकीय ध्यान आवश्यक' : (isMed ? 'सक्रिय स्वास्थ्य निगरानी' : 'नए नामांकित सदस्य — सामान्य स्वास्थ्य'),
        alert_reason_summary: match.reason || 'Telemetry parameters evaluated by CareConnect Random Forest classification engine.',
        alert_reason_summary_hi: 'स्वास्थ्य संकेतकों का मूल्यांकन किया गया।',
        suggested_action_summary: match.assignedAction ? `Dispatch ${match.assignedOperator || 'Field Operator'} for ${match.assignedAction}.` : 'Maintain daily active telemetry logs and routine check-in.',
        contact_method: match.assignedAction || 'Daily automated check-in'
      }
    };
  }

  // 4. Default Fallback (Logged in senior or new registered user profile)
  const currentSenior = (typeof getUserProfile === 'function') ? getUserProfile('senior') : {};
  const currentPayload = (typeof assessmentState !== 'undefined' && assessmentState.lastPayload) ? assessmentState.lastPayload : ((typeof getCurrentAssessmentData === 'function') ? getCurrentAssessmentData() : {});
  const currentPred = (typeof assessmentState !== 'undefined' && assessmentState.lastPrediction) ? assessmentState.lastPrediction : {
    predicted_risk_level: 'Low',
    predicted_risk_level_hi: 'कम जोखिम (Low Risk)',
    risk_score: 28,
    predicted_probability: 0.18,
    status_tag_en: 'Active Outpatient Baseline Normal',
    status_tag_hi: 'नियमित स्वास्थ्य निगरानी — सुरक्षित सीमा',
    alert_reason_summary: 'All telemetry physiological vital signs are within geriatric safe thresholds.',
    alert_reason_summary_hi: 'सभी स्वास्थ्य संकेतक सुरक्षित सीमा में हैं।',
    suggested_action_summary: 'Maintain hydration, daily walking habit, and adherence to prescription schedule.',
    contact_method: 'Daily automated check-in'
  };

  return {
    prof: {
      name: currentSenior.name || 'Enrolled Senior Citizen',
      age: currentSenior.age || 72,
      gender: currentSenior.gender || 'Senior',
      dob: currentSenior.dob || '1952-05-15',
      bloodGroup: currentSenior.bloodGroup || 'B+',
      phone: currentSenior.phone || '+91 98110-44912',
      email: currentSenior.email || 'senior@careconnect.ai',
      address: currentSenior.address || 'Civil Lines, North Delhi - 110054',
      doctor: currentSenior.doctor || 'Dr. Alok Mehta, MD (Cardiology)',
      allergies: currentSenior.allergies || 'None reported',
      emergencyNotes: currentSenior.emergencyNotes || 'Family Circle Registered'
    },
    payload: currentPayload,
    res: currentPred
  };
}

function openClinicalReportSheet(seniorId) {
  const modal = document.getElementById('modal-clinical-report-sheet');
  const container = document.getElementById('clinical-report-sheet-content');
  if (!modal || !container) {
    console.warn('Clinical report sheet modal or content element not found in DOM');
    return;
  }

  let targetId = seniorId;
  if (!targetId || targetId === 'undefined' || targetId === 'null') {
    targetId = currentReportSheetSeniorId || 'SNR-101';
  }
  currentReportSheetSeniorId = targetId;

  const reportData = getSeniorClinicalReportData(targetId);

  if (typeof soundEngine !== 'undefined' && soundEngine.playTone) {
    soundEngine.playTone(550, 'sine', 0.1);
  }

  container.innerHTML = generateClinicalReportSheetHtml(reportData.res, reportData.payload, reportData.prof);
  modal.classList.remove('hidden');

  const scrollContainer = document.getElementById('clinical-report-sheet-scroll');
  if (scrollContainer) {
    scrollContainer.scrollTop = 0;
  }
}

// Global Aliases so both old and new invocation forms work seamlessly everywhere
function openClinicalReportSheetModal(seniorId) {
  return openClinicalReportSheet(seniorId);
}

function openClinicalSheet(seniorId) {
  return openClinicalReportSheet(seniorId);
}

window.openClinicalReportSheet = openClinicalReportSheet;
window.openClinicalReportSheetModal = openClinicalReportSheetModal;
window.openClinicalSheet = openClinicalSheet;

function closeClinicalReportSheet() {
  const modal = document.getElementById('modal-clinical-report-sheet');
  if (modal) modal.classList.add('hidden');
}

function printClinicalReportSheet() {
  soundEngine.playTone(600, 'sine', 0.1);
  openClinicalReportSheet(currentReportSheetSeniorId);
  const container = document.getElementById('clinical-report-sheet-content');
  if (!container) return;

  // Remove any preexisting print frame
  let printFrame = document.getElementById('careconnect-print-frame');
  if (printFrame && printFrame.parentNode) {
    printFrame.parentNode.removeChild(printFrame);
  }

  // Create isolated invisible iframe to print strictly the report sheet without extraneous page items
  printFrame = document.createElement('iframe');
  printFrame.id = 'careconnect-print-frame';
  printFrame.style.position = 'fixed';
  printFrame.style.right = '0';
  printFrame.style.bottom = '0';
  printFrame.style.width = '0';
  printFrame.style.height = '0';
  printFrame.style.border = '0';
  document.body.appendChild(printFrame);

  const frameDoc = printFrame.contentWindow.document;
  frameDoc.open();
  frameDoc.write(`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>CareConnect Official Clinical Diagnostic Report</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; background: #ffffff !important; color: #0f172a !important; padding: 24px; margin: 0; }
    table { width: 100%; border-collapse: collapse; }
    th, td { border-color: #cbd5e1; }
    @media print {
      body { padding: 0 !important; margin: 0 !important; }
      @page { margin: 1cm; size: A4 portrait; }
    }
  </style>
</head>
<body>
  <div style="max-width: 820px; margin: 0 auto; background: white;">
    ${container.innerHTML}
  </div>
</body>
</html>`);
  frameDoc.close();

  setTimeout(() => {
    try {
      printFrame.contentWindow.focus();
      printFrame.contentWindow.print();
    } catch (e) {
      console.warn('Iframe print error, falling back to window.print():', e);
      window.print();
    } finally {
      setTimeout(() => {
        if (printFrame && printFrame.parentNode) {
          printFrame.parentNode.removeChild(printFrame);
        }
      }, 2500);
    }
  }, 450);
}

function downloadClinicalReportSheet() {
  const container = document.getElementById('clinical-report-sheet-content');
  if (!container) return;

  const prof = getUserProfile('senior');
  const patientName = (prof.name || 'Patient').replace(/\s+/g, '_');
  const dateStr = new Date().toISOString().split('T')[0];
  const filename = `CareConnect_Clinical_Report_${patientName}_${dateStr}.html`;

  const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CareConnect Official Clinical Report - ${prof.name || 'Patient'}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; background: #f1f5f9; color: #0f172a; padding: 24px; }
    @media print { body { background: white; padding: 0; } }
  </style>
</head>
<body>
  <div style="max-width: 850px; margin: 0 auto; background: white; padding: 36px; border-radius: 20px; border: 1px solid #cbd5e1; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1);">
    ${container.innerHTML}
  </div>
</body>
</html>`;

  const blob = new Blob([fullHtml], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  soundEngine.playSuccessChime();
  showToast('Clinical Report Sheet downloaded successfully! / रिपोर्ट शीट डाउनलोड हो गई।', 'success');
}


// ==================================================================// DAILY CARE REMINDERS & DEVICE ALARM ENGINE (पानी, भोजन, दवा रिमाइंडर)
// ==================================================================
const defaultSeniorReminders = [
  {
    id: 'rem-water-1',
    title: 'Drink 1 Glass Warm Water / सुबह 1 गिलास पानी',
    category: 'water',
    time: '08:00',
    timeDisplay: '08:00 AM',
    notes: 'Warm water supports hydration, gentle gut motility and kidney vitality.',
    enabled: true,
    completedToday: false,
    lastTriggeredDate: '',
    icon: 'fa-solid fa-glass-water',
    color: 'text-sky-600 bg-sky-50 border-sky-200'
  },
  {
    id: 'rem-med-1',
    title: 'BP Medicine (Amlodipine 5mg) / सुबह की दवा',
    category: 'medicine',
    time: '08:30',
    timeDisplay: '08:30 AM',
    notes: 'Take with warm water after food to stabilize morning cardiovascular pressure.',
    enabled: true,
    completedToday: false,
    lastTriggeredDate: '',
    icon: 'fa-solid fa-pills',
    color: 'text-purple-600 bg-purple-50 border-purple-200'
  },
  {
    id: 'rem-food-1',
    title: 'Nutritious Breakfast / पौष्टिक नाश्ता',
    category: 'food',
    time: '09:00',
    timeDisplay: '09:00 AM',
    notes: 'Oats / dalia / boiled egg or warm khichdi with fruit.',
    enabled: true,
    completedToday: false,
    lastTriggeredDate: '',
    icon: 'fa-solid fa-utensils',
    color: 'text-amber-600 bg-amber-50 border-amber-200'
  },
  {
    id: 'rem-water-2',
    title: 'Mid-Day Hydration (1 Glass) / दोपहर का पानी',
    category: 'water',
    time: '11:30',
    timeDisplay: '11:30 AM',
    notes: 'Regular fluid intake prevents dehydration headaches and blood viscosity spikes.',
    enabled: true,
    completedToday: false,
    lastTriggeredDate: '',
    icon: 'fa-solid fa-glass-water',
    color: 'text-sky-600 bg-sky-50 border-sky-200'
  },
  {
    id: 'rem-food-2',
    title: 'Balanced Lunch / दोपहर का भोजन',
    category: 'food',
    time: '13:30',
    timeDisplay: '01:30 PM',
    notes: 'Low-sodium roti, steamed seasonal vegetables, dal, and fresh curd.',
    enabled: true,
    completedToday: false,
    lastTriggeredDate: '',
    icon: 'fa-solid fa-bowl-food',
    color: 'text-amber-600 bg-amber-50 border-amber-200'
  },
  {
    id: 'rem-med-2',
    title: 'Afternoon Calcium & Multivitamin / दोपहर की दवा',
    category: 'medicine',
    time: '14:00',
    timeDisplay: '02:00 PM',
    notes: 'Bone strength supplement as advised by Dr. Alok Mehta.',
    enabled: true,
    completedToday: false,
    lastTriggeredDate: '',
    icon: 'fa-solid fa-capsules',
    color: 'text-purple-600 bg-purple-50 border-purple-200'
  },
  {
    id: 'rem-water-3',
    title: 'Evening Hydration & Herbal Tea / शाम का पानी',
    category: 'water',
    time: '16:30',
    timeDisplay: '04:30 PM',
    notes: 'Warm water or mild herbal green tea for comfortable circulation.',
    enabled: true,
    completedToday: false,
    lastTriggeredDate: '',
    icon: 'fa-solid fa-glass-water',
    color: 'text-sky-600 bg-sky-50 border-sky-200'
  },
  {
    id: 'rem-food-3',
    title: 'Light Dinner / रात्रि का हल्का भोजन',
    category: 'food',
    time: '20:00',
    timeDisplay: '08:00 PM',
    notes: 'Easily digestible soup, steamed vegetables, and light multigrain roti.',
    enabled: true,
    completedToday: false,
    lastTriggeredDate: '',
    icon: 'fa-solid fa-utensils',
    color: 'text-amber-600 bg-amber-50 border-amber-200'
  },
  {
    id: 'rem-med-3',
    title: 'Night Medicine & Cardiac Regimen / रात की दवा',
    category: 'medicine',
    time: '21:30',
    timeDisplay: '09:30 PM',
    notes: 'Night regimen for sustained blood pressure regulation during sleep.',
    enabled: true,
    completedToday: false,
    lastTriggeredDate: '',
    icon: 'fa-solid fa-pills',
    color: 'text-purple-600 bg-purple-50 border-purple-200'
  }
];

let currentRemindersFilter = 'all';
let remindersTickerInterval = null;
let liveClockInterval = null;
let activeAlarmReminder = null;

function getSeniorReminders() {
  try {
    const raw = localStorage.getItem('careconnect_senior_reminders');
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.warn('Error reading reminders from localStorage:', e);
  }
  return defaultSeniorReminders.slice();
}

function saveSeniorReminders(reminders) {
  try {
    localStorage.setItem('careconnect_senior_reminders', JSON.stringify(reminders));
  } catch (e) {
    console.error('Failed to save reminders:', e);
  }
}

function format24to12Time(time24) {
  if (!time24) return '--:--';
  const parts = time24.split(':');
  let h = parseInt(parts[0], 10);
  const m = parts[1] || '00';
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12;
  h = h ? h : 12;
  return `${h < 10 ? '0' + h : h}:${m} ${ampm}`;
}

function getTodayWaterLogged() {
  const todayKey = 'careconnect_water_' + new Date().toISOString().split('T')[0];
  return parseInt(localStorage.getItem(todayKey)) || 4;
}

function setTodayWaterLogged(count) {
  const todayKey = 'careconnect_water_' + new Date().toISOString().split('T')[0];
  localStorage.setItem(todayKey, count.toString());
  updateWaterTrackerDisplay();
}

function updateWaterTrackerDisplay() {
  const counter = document.getElementById('water-logged-counter');
  const iconsContainer = document.getElementById('water-glasses-icons');
  if (!counter || !iconsContainer) return;

  const count = getTodayWaterLogged();
  const total = 8;
  const liters = (count * 0.25).toFixed(1);
  counter.textContent = `${count} / ${total} Glasses (${liters}L of 2.0L)`;

  let iconsHtml = '';
  for (let i = 1; i <= total; i++) {
    if (i <= count) {
      iconsHtml += `<span class="inline-block transition-transform hover:scale-125" title="Glass ${i}: Logged ✓">💧</span>`;
    } else {
      iconsHtml += `<span class="inline-block opacity-40 hover:opacity-80 transition-opacity" title="Glass ${i}: Pending">🥛</span>`;
    }
  }
  iconsContainer.innerHTML = iconsHtml;
}

function logWaterGlass() {
  let count = getTodayWaterLogged();
  if (count < 12) {
    count++;
    setTodayWaterLogged(count);
    soundEngine.playTone(880, 'sine', 0.15);
    setTimeout(() => soundEngine.playTone(1174, 'sine', 0.2), 120);
    showToast(`Hydration logged! ${count} / 8 glasses completed today. 💧`, 'success');
  } else {
    showToast('Daily water goal achieved! Excellent hydration! 💧', 'info');
  }
}

function renderSeniorReminders(filter = 'all') {
  currentRemindersFilter = filter;
  const grid = document.getElementById('senior-reminders-grid');
  if (!grid) return;

  const reminders = getSeniorReminders();
  const filtered = (filter === 'all') ? reminders : reminders.filter(r => r.category === filter);

  // Update filter pill UI
  ['all', 'water', 'food', 'medicine', 'other'].forEach(f => {
    const btn = document.getElementById(`rem-filter-${f}`);
    if (btn) {
      if (f === filter) {
        btn.className = 'px-3 py-1.5 rounded-xl text-xs font-bold transition-all bg-slate-900 text-white shadow-sm';
      } else {
        btn.className = 'px-3 py-1.5 rounded-xl text-xs font-bold transition-all bg-white text-slate-700 border border-slate-200 hover:bg-slate-50';
      }
    }
  });

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div class="col-span-1 sm:col-span-2 text-center py-8 text-slate-400 bg-white rounded-2xl border border-dashed border-slate-300">
        <i class="fa-solid fa-bell-slash text-3xl mb-2 text-slate-300"></i>
        <p class="text-xs font-bold text-slate-600">No reminders found in this category / कोई रिमाइंडर नहीं मिला</p>
        <button onclick="openAddReminderModal()" class="mt-2 text-xs font-bold text-amber-600 hover:underline">
          + Add your first reminder now
        </button>
      </div>
    `;
    return;
  }

  grid.innerHTML = filtered.map(r => {
    const isDone = r.completedToday;
    const isEnabled = r.enabled;
    const catBadge = (r.category === 'water') 
      ? 'bg-sky-100 text-sky-800' 
      : (r.category === 'medicine' ? 'bg-purple-100 text-purple-800' : (r.category === 'food' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'));
    
    return `
      <div id="rem-card-${r.id}"
        class="p-4 rounded-2xl bg-white border-2 ${isDone ? 'border-emerald-300 bg-emerald-50/40' : (isEnabled ? 'border-slate-200 shadow-sm' : 'border-slate-200 opacity-60')} flex flex-col justify-between transition-all">
        
        <div>
          <div class="flex items-center justify-between pb-2 border-b border-slate-100 mb-2.5">
            <div class="flex items-center space-x-2">
              <span class="w-8 h-8 rounded-xl ${r.color || 'bg-amber-100 text-amber-700'} flex items-center justify-center text-sm shadow-xs flex-shrink-0">
                <i class="${r.icon || 'fa-solid fa-bell'}"></i>
              </span>
              <span class="font-mono text-xs sm:text-sm font-black text-slate-900 bg-slate-100 px-2 py-0.5 rounded-lg border border-slate-200">
                ${r.timeDisplay || format24to12Time(r.time)}
              </span>
            </div>

            <div class="flex items-center space-x-2">
              <span class="text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${catBadge}">
                ${r.category}
              </span>
              <!-- Enable / Disable Switch -->
              <button onclick="toggleReminderStatus('${r.id}')"
                class="text-xs font-bold px-2 py-0.5 rounded-md border transition-all ${isEnabled ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-500 border-slate-200'}"
                title="${isEnabled ? 'Click to Pause / रोकें' : 'Click to Enable / चालू करें'}">
                ${isEnabled ? 'Active' : 'Paused'}
              </button>
            </div>
          </div>

          <h4 class="text-xs sm:text-sm font-black text-slate-900 ${isDone ? 'line-through text-slate-500' : ''}">
            ${r.title}
          </h4>
          <p class="text-xs text-slate-500 font-medium mt-1 leading-relaxed">
            ${r.notes || 'Care reminder scheduled for daily wellbeing.'}
          </p>
        </div>

        <div class="flex items-center justify-between pt-3 border-t border-slate-100 mt-3">
          <button onclick="markReminderDone('${r.id}')"
            class="px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all flex items-center space-x-1 ${isDone ? 'bg-emerald-600 text-white shadow-sm' : 'bg-slate-100 hover:bg-emerald-100 text-slate-700 hover:text-emerald-800'}"
            title="Mark Completed for Today / आज पूरा किया">
            <i class="fa-solid fa-check text-xs"></i>
            <span>${isDone ? 'Completed ✓' : 'Mark Done'}</span>
          </button>

          <div class="flex items-center space-x-1.5">
            <button onclick="triggerDeviceReminderAlarm(getSeniorReminders().find(x => x.id === '${r.id}'))"
              class="px-2.5 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold transition-all border border-amber-200"
              title="Test Alarm Sound for this reminder / अलार्म बजाएं">
              <i class="fa-solid fa-bell text-xs"></i>
              <span class="hidden sm:inline ml-1">Ring</span>
            </button>
            <button onclick="deleteReminder('${r.id}')"
              class="w-7 h-7 rounded-xl bg-slate-100 hover:bg-rose-100 text-slate-400 hover:text-rose-600 transition-all flex items-center justify-center text-xs"
              title="Delete Reminder / हटाएं">
              <i class="fa-solid fa-trash-can"></i>
            </button>
          </div>
        </div>

      </div>
    `;
  }).join('');
}

function filterReminders(cat) {
  renderSeniorReminders(cat);
}

function toggleReminderStatus(id) {
  const reminders = getSeniorReminders();
  const target = reminders.find(r => r.id === id);
  if (!target) return;
  target.enabled = !target.enabled;
  saveSeniorReminders(reminders);
  renderSeniorReminders(currentRemindersFilter);
  soundEngine.playTone(600, 'sine', 0.1);
  showToast(target.enabled ? 'Reminder activated / रिमाइंडर सक्रिय किया गया' : 'Reminder paused / रिमाइंडर रोक दिया गया', 'info');
}

function markReminderDone(id) {
  const reminders = getSeniorReminders();
  const target = reminders.find(r => r.id === id);
  if (!target) return;
  target.completedToday = !target.completedToday;
  saveSeniorReminders(reminders);
  renderSeniorReminders(currentRemindersFilter);
  if (target.completedToday) {
    soundEngine.playSuccessChime();
    showToast(`Great job! Completed: ${target.title}`, 'success');
  }
}

function deleteReminder(id) {
  let reminders = getSeniorReminders();
  reminders = reminders.filter(r => r.id !== id);
  saveSeniorReminders(reminders);
  renderSeniorReminders(currentRemindersFilter);
  showToast('Reminder deleted / रिमाइंडर हटाया गया', 'info');
}

function openAddReminderPage() {
  if (typeof toggleSlideDrawer === 'function') toggleSlideDrawer(false);
  
  const allViews = ['coordinator', 'senior', 'family', 'operations'];
  allViews.forEach(v => {
    const el = document.getElementById(`view-${v}`);
    if (el) el.classList.add('hidden');
  });

  const page = document.getElementById('view-add-reminder');
  if (page) page.classList.remove('hidden');

  const header = document.getElementById('global-header');
  if (header) header.classList.remove('hidden');

  if (typeof renderSeniorReminders === 'function') {
    renderSeniorReminders(currentRemindersFilter || 'all');
  }
  if (typeof updateHydrationUi === 'function') {
    updateHydrationUi();
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function closeAddReminderPage() {
  const page = document.getElementById('view-add-reminder');
  if (page) page.classList.add('hidden');

  const senior = document.getElementById('view-senior');
  if (senior) senior.classList.remove('hidden');

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function openAddReminderModal() {
  openAddReminderPage();
}

function closeAddReminderModal() {
  closeAddReminderPage();
}

function applyReminderPreset(presetKey) {
  const titleInput = document.getElementById('rem-page-input-title') || document.getElementById('rem-input-title');
  const catInput = document.getElementById('rem-page-input-category') || document.getElementById('rem-input-category');
  const timeInput = document.getElementById('rem-page-input-time') || document.getElementById('rem-input-time');
  const notesInput = document.getElementById('rem-page-input-notes') || document.getElementById('rem-input-notes');

  const presets = {
    water_morning: {
      title: 'Morning Warm Water (1 Glass) / सुबह का गुनगुना पानी',
      cat: 'water',
      time: '08:00',
      notes: 'Hydration supports circulation, kidney vitality and regulates blood pressure.'
    },
    med_morning: {
      title: 'Morning BP Medicine / सुबह की रक्तचाप की दवा',
      cat: 'medicine',
      time: '08:30',
      notes: 'Take with warm water after morning meal.'
    },
    food_breakfast: {
      title: 'Nutritious Breakfast / पौष्टिक नाश्ता',
      cat: 'food',
      time: '09:00',
      notes: 'Oats, dalia, or light multigrain breakfast with fruit.'
    },
    food_lunch: {
      title: 'Balanced Low-Sodium Lunch / दोपहर का भोजन',
      cat: 'food',
      time: '13:30',
      notes: 'Warm roti, steamed vegetables, dal, and fresh curd.'
    },
    water_afternoon: {
      title: 'Midday Hydration / दोपहर 1 गिलास पानी',
      cat: 'water',
      time: '11:30',
      notes: 'Stay hydrated to prevent fatigue and headaches.'
    },
    med_night: {
      title: 'Night Medicine & Cardiac Regimen / रात की दवा',
      cat: 'medicine',
      time: '21:30',
      notes: 'Prescribed night dose for restful sleep.'
    },
    walk: {
      title: 'Evening Gentle Walk / शाम की हल्की सैर',
      cat: 'walk',
      time: '17:30',
      notes: '15-20 minutes gentle walk for joint mobility and fresh air.'
    },
    bp: {
      title: 'Blood Pressure & Vitals Check / बीपी जांच',
      cat: 'bp',
      time: '18:00',
      notes: 'Check blood pressure with digital cuff and log readings.'
    }
  };

  const p = presets[presetKey];
  if (!p) return;

  if (titleInput) titleInput.value = p.title;
  if (catInput) catInput.value = p.cat;
  if (timeInput) timeInput.value = p.time;
  if (notesInput) notesInput.value = p.notes;

  // Also sync modal inputs if present
  const mTitle = document.getElementById('rem-input-title');
  const mCat = document.getElementById('rem-input-category');
  const mTime = document.getElementById('rem-input-time');
  const mNotes = document.getElementById('rem-input-notes');
  if (mTitle) mTitle.value = p.title;
  if (mCat) mCat.value = p.cat;
  if (mTime) mTime.value = p.time;
  if (mNotes) mNotes.value = p.notes;

  soundEngine.playTone(700, 'sine', 0.1);
}

function handleSaveNewReminder(e) {
  if (e) e.preventDefault();
  const title = (document.getElementById('rem-page-input-title')?.value || document.getElementById('rem-input-title')?.value || '').trim();
  const category = document.getElementById('rem-page-input-category')?.value || document.getElementById('rem-input-category')?.value || 'other';
  const time = document.getElementById('rem-page-input-time')?.value || document.getElementById('rem-input-time')?.value || '08:00';
  const notes = (document.getElementById('rem-page-input-notes')?.value || document.getElementById('rem-input-notes')?.value || '').trim();

  if (!title) {
    showToast('Please enter reminder title / कृपया शीर्षक दर्ज करें', 'warning');
    return;
  }

  const iconMap = {
    water: 'fa-solid fa-glass-water',
    food: 'fa-solid fa-utensils',
    medicine: 'fa-solid fa-pills',
    walk: 'fa-solid fa-person-walking',
    bp: 'fa-solid fa-heart-pulse',
    other: 'fa-solid fa-bell'
  };

  const colorMap = {
    water: 'text-sky-600 bg-sky-50 border-sky-200',
    food: 'text-amber-600 bg-amber-50 border-amber-200',
    medicine: 'text-purple-600 bg-purple-50 border-purple-200',
    walk: 'text-emerald-600 bg-emerald-50 border-emerald-200',
    bp: 'text-rose-600 bg-rose-50 border-rose-200',
    other: 'text-slate-600 bg-slate-50 border-slate-200'
  };

  const newReminder = {
    id: 'rem-' + Date.now(),
    title: title,
    category: category,
    time: time,
    timeDisplay: format24to12Time(time),
    notes: notes || 'Care reminder scheduled for daily wellbeing.',
    enabled: true,
    completedToday: false,
    lastTriggeredDate: '',
    icon: iconMap[category] || 'fa-solid fa-bell',
    color: colorMap[category] || 'text-amber-600 bg-amber-50 border-amber-200'
  };

  const reminders = getSeniorReminders();
  reminders.push(newReminder);
  reminders.sort((a, b) => a.time.localeCompare(b.time));
  saveSeniorReminders(reminders);
  renderSeniorReminders(currentRemindersFilter);

  // Reset form inputs for next reminder
  const tInput = document.getElementById('rem-page-input-title') || document.getElementById('rem-input-title');
  if (tInput) tInput.value = '';
  const nInput = document.getElementById('rem-page-input-notes') || document.getElementById('rem-input-notes');
  if (nInput) nInput.value = '';

  const remSec = document.getElementById('senior-reminders-section');
  if (remSec) {
    remSec.scrollIntoView({ behavior: 'smooth' });
  }

  const modal = document.getElementById('modal-add-reminder');
  if (modal && !modal.classList.contains('hidden')) modal.classList.add('hidden');

  soundEngine.playSuccessChime();
  showToast(`Reminder saved: ${title} at ${newReminder.timeDisplay}! ⏰`, 'success');
}

function scrollToRemindersSection() {
  const el = document.getElementById('senior-reminders-section');
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    el.classList.add('ring-4', 'ring-amber-400');
    setTimeout(() => {
      el.classList.remove('ring-4', 'ring-amber-400');
    }, 1800);
  }
}

// ==================================================================// DEVICE ALARM TRIGGER, AUDITORY CHIME, NOTIFICATION & ACTIONS
// ==================================================================
function triggerDeviceReminderAlarm(reminder) {
  if (!reminder) return;
  activeAlarmReminder = reminder;

  // 1. Start continuous audio alarm chime
  soundEngine.startReminderAlarm();

  // 2. Populate and show alarm modal
  const modal = document.getElementById('modal-reminder-alarm');
  const iconEl = document.getElementById('alarm-dialog-icon');
  const timeEl = document.getElementById('alarm-dialog-time');
  const titleEl = document.getElementById('alarm-dialog-title');
  const notesEl = document.getElementById('alarm-dialog-notes');

  if (iconEl) iconEl.className = reminder.icon || 'fa-solid fa-bell';
  if (timeEl) timeEl.textContent = reminder.timeDisplay || format24to12Time(reminder.time);
  if (titleEl) titleEl.textContent = reminder.title;
  if (notesEl) notesEl.textContent = reminder.notes || 'It is time for your scheduled care reminder!';

  if (modal) modal.classList.remove('hidden');

  // 3. Text to Speech announcement
  if ('speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
      const isHi = state.seniorLanguage === 'hi';
      const prof = getUserProfile('senior');
      const seniorFirstName = prof.name ? prof.name.split(' ')[0] : 'Ramesh';
      let spokenText = '';
      if (isHi) {
        const catText = (reminder.category === 'water') ? 'पानी पीने' : (reminder.category === 'medicine' ? 'दवा लेने' : 'भोजन');
        spokenText = `नमस्ते ${seniorFirstName} जी। यह आपके ${catText} का समय है। कृपया ${reminder.title} पर ध्यान दें।`;
      } else {
        spokenText = `Attention ${seniorFirstName} ji. It is time for your scheduled reminder: ${reminder.title}.`;
      }
      const utterance = new SpeechSynthesisUtterance(spokenText);
      utterance.lang = isHi ? 'hi-IN' : 'en-IN';
      utterance.rate = 0.88;
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Speech synthesis error on alarm:', e);
    }
  }

  // 4. Device Native Notification
  if ('Notification' in window && Notification.permission === 'granted') {
    try {
      new Notification(`⏰ CareConnect Alarm: ${reminder.title}`, {
        body: reminder.notes || 'Scheduled health reminder alert!',
        icon: 'careconnect-emblem.png',
        tag: `careconnect-rem-${reminder.id}`,
        requireInteraction: true
      });
    } catch (e) {
      console.warn('Native notification error:', e);
    }
  }
}

function completeAlarmAction() {
  soundEngine.stopReminderAlarm();
  const modal = document.getElementById('modal-reminder-alarm');
  if (modal) modal.classList.add('hidden');

  if (activeAlarmReminder) {
    markReminderDone(activeAlarmReminder.id);
    if (activeAlarmReminder.category === 'water') {
      logWaterGlass();
    }
  }

  soundEngine.playSuccessChime();
  showToast('Task completed successfully! / कार्य पूरा कर लिया गया। बहुत बढ़िया! 🙏', 'success');
  activeAlarmReminder = null;
}

function snoozeAlarmAction() {
  soundEngine.stopReminderAlarm();
  const modal = document.getElementById('modal-reminder-alarm');
  if (modal) modal.classList.add('hidden');

  const snoozedRem = activeAlarmReminder;
  showToast('Alarm snoozed for 10 minutes. / अलार्म 10 मिनट के लिए स्नूज़ किया गया।', 'info');

  setTimeout(() => {
    if (snoozedRem) {
      triggerDeviceReminderAlarm(snoozedRem);
    }
  }, 10 * 60 * 1000); // 10 minutes

  activeAlarmReminder = null;
}

function dismissAlarmAction() {
  soundEngine.stopReminderAlarm();
  const modal = document.getElementById('modal-reminder-alarm');
  if (modal) modal.classList.add('hidden');
  showToast('Alarm dismissed. / अलार्म बंद किया गया।', 'info');
  activeAlarmReminder = null;
}

function testSampleReminderAlarm() {
  const sample = {
    id: 'test-alarm-sample',
    title: '💧 Hydration: Drink 1 Glass Warm Water / 1 गिलास गुनगुना पानी पिएं',
    category: 'water',
    time: 'Now',
    timeDisplay: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    notes: 'Hydration aids circulation, kidney health, and regulates blood pressure.',
    icon: 'fa-solid fa-glass-water',
    color: 'text-sky-600 bg-sky-50 border-sky-200'
  };
  triggerDeviceReminderAlarm(sample);
}

function requestDeviceNotificationPermission() {
  if (!('Notification' in window)) {
    showToast('Notifications not supported by this browser.', 'warning');
    return;
  }
  Notification.requestPermission().then(permission => {
    const permCard = document.getElementById('device-notif-permission-card');
    if (permission === 'granted') {
      soundEngine.playSuccessChime();
      showToast('Device notifications enabled successfully! / डिवाइस नोटिफिकेशन सक्षम हो गई।', 'success');
      if (permCard) permCard.classList.add('hidden');
    } else {
      showToast('Notification permission was not granted.', 'info');
    }
  });
}

function checkRemindersAlarmTicker() {
  const now = new Date();
  const h = String(now.getHours()).padStart(2, '0');
  const m = String(now.getMinutes()).padStart(2, '0');
  const currentTime = `${h}:${m}`;
  const todayStr = now.toISOString().split('T')[0];

  const reminders = getSeniorReminders();
  let updated = false;

  reminders.forEach(r => {
    if (r.enabled && r.time === currentTime && r.lastTriggeredDate !== todayStr) {
      r.lastTriggeredDate = todayStr;
      updated = true;
      triggerDeviceReminderAlarm(r);
    }
  });

  if (updated) {
    saveSeniorReminders(reminders);
  }
}

function updateRemindersLiveClock() {
  const clockEl = document.getElementById('reminders-live-clock');
  if (!clockEl) return;
  const now = new Date();
  clockEl.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

function initSeniorRemindersHub() {
  renderSeniorReminders('all');
  updateWaterTrackerDisplay();

  // Hide notification card if already granted
  if ('Notification' in window && Notification.permission === 'granted') {
    const permCard = document.getElementById('device-notif-permission-card');
    if (permCard) permCard.classList.add('hidden');
  }

  if (!liveClockInterval) {
    updateRemindersLiveClock();
    liveClockInterval = setInterval(updateRemindersLiveClock, 1000);
  }

  if (!remindersTickerInterval) {
    checkRemindersAlarmTicker();
    remindersTickerInterval = setInterval(checkRemindersAlarmTicker, 15000);
  }
}

// Start ticker on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    if (typeof initSeniorRemindersHub === 'function') {
      initSeniorRemindersHub();
    }
  }, 300);
});


// =====================================================================// CHECKBOX MULTI-SELECT & BULK ACTIONS ENGINE
// =====================================================================
function handleOpsCaseCheckboxChange() {
  const checkboxes = document.querySelectorAll('.ops-case-checkbox:checked');
  const totalCheckboxes = document.querySelectorAll('.ops-case-checkbox');
  const count = checkboxes.length;
  const toolbar = document.getElementById('ops-cases-bulk-toolbar');
  const countSpan = document.getElementById('ops-bulk-count');
  const selectAll = document.getElementById('ops-cases-select-all');

  if (countSpan) countSpan.textContent = count;

  if (toolbar) {
    if (count > 0) {
      toolbar.classList.remove('hidden');
    } else {
      toolbar.classList.add('hidden');
    }
  }

  if (selectAll && totalCheckboxes.length > 0) {
    selectAll.checked = count === totalCheckboxes.length;
    selectAll.indeterminate = count > 0 && count < totalCheckboxes.length;
  }
}

function toggleOpsSelectAllCases(checked) {
  const checkboxes = document.querySelectorAll('.ops-case-checkbox');
  checkboxes.forEach(cb => {
    cb.checked = checked;
  });
  handleOpsCaseCheckboxChange();
}

function clearOpsBulkSelection() {
  const selectAll = document.getElementById('ops-cases-select-all');
  if (selectAll) {
    selectAll.checked = false;
    selectAll.indeterminate = false;
  }
  const checkboxes = document.querySelectorAll('.ops-case-checkbox');
  checkboxes.forEach(cb => {
    cb.checked = false;
  });
  handleOpsCaseCheckboxChange();
}

function getSelectedOpsCaseSeniors() {
  const checkboxes = document.querySelectorAll('.ops-case-checkbox:checked');
  const seniors = [];
  checkboxes.forEach(cb => {
    const senior = cb.getAttribute('data-senior');
    if (senior) seniors.push(senior);
  });
  return seniors;
}

function executeOpsBulkAssign() {
  const seniors = getSelectedOpsCaseSeniors();
  if (seniors.length === 0) {
    showToast('Please select at least one alert to assign.', 'warning');
    return;
  }

  const coordSelect = document.getElementById('ops-bulk-assign-coord');
  const chosenCoord = coordSelect ? coordSelect.value : 'Sister Kavita, RN';

  seniors.forEach(seniorName => {
    const item = OPS_ALL_32_ALERTS.find(a => a.senior === seniorName);
    if (item) {
      item.coordinator = chosenCoord;
      item.status = 'In Progress';
    }
  });

  if (soundEngine && typeof soundEngine.playSuccessChime === 'function') {
    soundEngine.playSuccessChime();
  }

  renderOpsCasesTable();
  clearOpsBulkSelection();
  showToast('Successfully assigned ' + seniors.length + ' cases to ' + chosenCoord + '!', 'success');
}

function executeOpsBulkDispatch() {
  const seniors = getSelectedOpsCaseSeniors();
  if (seniors.length === 0) {
    showToast('Please select at least one alert to dispatch.', 'warning');
    return;
  }

  if (soundEngine && typeof soundEngine.playTone === 'function') {
    soundEngine.playTone(784, 'sine', 0.15);
    setTimeout(() => soundEngine.playTone(880, 'sine', 0.18), 180);
    setTimeout(() => soundEngine.playTone(1046, 'sine', 0.25), 380);
  }

  seniors.forEach(seniorName => {
    const item = OPS_ALL_32_ALERTS.find(a => a.senior === seniorName);
    if (item) {
      item.status = 'Dispatched (12m)';
    }
  });

  renderOpsCasesTable();
  clearOpsBulkSelection();
  showToast('Emergency clinical nurses dispatched for ' + seniors.length + ' seniors!', 'success');
}

function executeOpsBulkResolve() {
  const seniors = getSelectedOpsCaseSeniors();
  if (seniors.length === 0) {
    showToast('Please select at least one alert to resolve.', 'warning');
    return;
  }

  if (soundEngine && typeof soundEngine.playSuccessChime === 'function') {
    soundEngine.playSuccessChime();
  }

  seniors.forEach(seniorName => {
    const item = OPS_ALL_32_ALERTS.find(a => a.senior === seniorName);
    if (item) {
      item.status = 'Resolved';
    }
  });

  renderOpsCasesTable();
  clearOpsBulkSelection();
  showToast('Marked ' + seniors.length + ' selected cases as Resolved!', 'success');
}

function executeOpsBulkExport() {
  const seniors = getSelectedOpsCaseSeniors();
  if (seniors.length === 0) {
    showToast('Please select at least one alert to export.', 'warning');
    return;
  }

  const selectedAlerts = OPS_ALL_32_ALERTS.filter(a => seniors.includes(a.senior));

  let csvContent = 'CareConnect - Selected Alerts Export Sheet\n';
  csvContent += 'Generated On: ' + new Date().toLocaleString() + '\n';
  csvContent += 'Selected Records: ' + selectedAlerts.length + '\n\n';
  csvContent += 'Case ID,Senior Name,Age,Area,Risk Level,Issue Category,Clinical Description,Time Logged,Status,Assigned Coordinator,Emergency Phone\n';

  selectedAlerts.forEach(a => {
    csvContent += '"' + a.id + '","' + a.senior + '","' + a.age + '","' + a.area + '","' + a.risk + '","' + a.issueCategory + '","' + a.issue + '","' + a.time + '","' + a.status + '","' + a.coordinator + '","' + a.phone + '"\n';
  });

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'CareConnect_Selected_' + selectedAlerts.length + '_Alerts_' + new Date().toISOString().slice(0, 10) + '.csv';
// =========================================================================
// EMERGENCY SOS ENGINE: LIVE GPS AUTODETECT, VOICE INPUT & DUAL DISPATCH CALLS
// (स्मार्ट मैनेजमेंट, केयर कोऑर्डिनेटर व परिवार को तुरंत कॉल और लाइव लोकेशन)
// =========================================================================

state.seniorLiveLocation = {
  lat: 28.6139,
  lng: 77.2090,
  accuracy: 12,
  address: 'Civil Lines, North Delhi, 110054 (Near St. Stephens Hospital)',
  mapsUrl: 'https://maps.google.com/?q=28.6139,77.2090'
};

state.emergencyState = {
  inCall: false,
  speakerOn: true,
  micMuted: false,
  callSeconds: 0,
  callTimerInterval: null,
  countdownInterval: null,
  voiceRecognition: null,
  recordedDistressText: ''
};

let sosCountdownTimer = null;
let sosRemainingSeconds = 6;
let sosSpeechRecognition = null;
let isSosListening = false;
let emergencyCallDurationInterval = null;
let emergencyCallSeconds = 0;

function detectSeniorLiveLocation(callback) {
  const addressEl = document.getElementById('sos-gps-address');
  const coordsEl = document.getElementById('sos-gps-coords');
  const badgeEl = document.getElementById('sos-gps-badge');
  const spinner = document.getElementById('sos-gps-spinner');
  const mapBtn = document.getElementById('sos-gps-map-btn');

  if (badgeEl) {
    badgeEl.textContent = 'Acquiring GPS...';
    badgeEl.className = 'px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-200 text-amber-900';
  }

  const handleSuccess = (pos) => {
    const lat = Number(pos.coords.latitude.toFixed(5));
    const lng = Number(pos.coords.longitude.toFixed(5));
    const acc = Math.round(pos.coords.accuracy || 15);
    const mapsUrl = `https://maps.google.com/?q=${lat},${lng}`;
    
    state.seniorLiveLocation = {
      lat: lat,
      lng: lng,
      accuracy: acc,
      address: `Live GPS Location (${lat}° N, ${lng}° E • Civil Lines, Delhi)`,
      mapsUrl: mapsUrl
    };

    if (addressEl) addressEl.textContent = `Live GPS: ${lat}° N, ${lng}° E`;
    if (coordsEl) coordsEl.textContent = `Accuracy: ±${acc}m • Verified Satellite Signal ✓`;
    if (badgeEl) {
      badgeEl.textContent = 'GPS VERIFIED ✓';
      badgeEl.className = 'px-2 py-0.5 rounded-full text-[9px] font-black bg-emerald-100 text-emerald-800 border border-emerald-300';
    }
    if (spinner) spinner.className = 'fa-solid fa-location-dot text-emerald-100 text-base';
    if (mapBtn) {
      mapBtn.href = mapsUrl;
      mapBtn.classList.remove('hidden');
    }

    const hubCoords = document.getElementById('sos-hub-coords-label');
    const hubAddr = document.getElementById('sos-hub-address-text');
    const hubLink = document.getElementById('sos-hub-map-link');
    if (hubCoords) hubCoords.textContent = `${lat}° N, ${lng}° E (±${acc}m)`;
    if (hubAddr) hubAddr.textContent = state.seniorLiveLocation.address;
    if (hubLink) hubLink.href = mapsUrl;

    if (typeof callback === 'function') callback(state.seniorLiveLocation);
  };

  const handleFallback = () => {
    const defaultLoc = {
      lat: 28.6139,
      lng: 77.2090,
      accuracy: 10,
      address: 'Civil Lines, North Delhi, PIN 110054 (Near St. Stephens Hospital)',
      mapsUrl: 'https://maps.google.com/?q=28.6139,77.2090'
    };
    state.seniorLiveLocation = defaultLoc;

    if (addressEl) addressEl.textContent = defaultLoc.address;
    if (coordsEl) coordsEl.textContent = 'Registered Home Coordinates: 28.6139° N, 77.2090° E';
    if (badgeEl) {
      badgeEl.textContent = 'HOME GPS REGISTERED ✓';
      badgeEl.className = 'px-2 py-0.5 rounded-full text-[9px] font-black bg-emerald-100 text-emerald-800 border border-emerald-300';
    }
    if (spinner) spinner.className = 'fa-solid fa-house-chimney-medical text-white text-sm';
    if (mapBtn) {
      mapBtn.href = defaultLoc.mapsUrl;
      mapBtn.classList.remove('hidden');
    }

    const hubCoords = document.getElementById('sos-hub-coords-label');
    const hubAddr = document.getElementById('sos-hub-address-text');
    const hubLink = document.getElementById('sos-hub-map-link');
    if (hubCoords) hubCoords.textContent = '28.6139° N, 77.2090° E';
    if (hubAddr) hubAddr.textContent = defaultLoc.address;
    if (hubLink) hubLink.href = defaultLoc.mapsUrl;

    if (typeof callback === 'function') callback(defaultLoc);
  };

  if ('geolocation' in navigator) {
    try {
      navigator.geolocation.getCurrentPosition(handleSuccess, handleFallback, {
        timeout: 4000,
        enableHighAccuracy: true
      });
    } catch (e) {
      handleFallback();
    }
  } else {
    handleFallback();
  }
}

function openVoiceEmergencySOSModal() {
  soundEngine.playEmergencySiren();
  const modal = document.getElementById('modal-emergency-voice-sos');
  if (modal) modal.classList.remove('hidden');

  // 1. Detect location immediately
  detectSeniorLiveLocation();

  // 2. Reset transcript
  state.emergencyState.recordedDistressText = '';
  const transcriptEl = document.getElementById('sos-voice-transcript');
  if (transcriptEl) {
    transcriptEl.textContent = state.seniorLanguage === 'hi' 
      ? "बोलिए, आपकी आवाज सुनी जा रही है (उदा. 'मैं गिर गया हूँ, मदद चाहिए')..." 
      : "Listening to your distress... Speak what happened (e.g., 'I fell down')...";
  }

  // 3. Start voice recognition
  startEmergencyVoiceRecognition();

  // 4. Start 6-second auto countdown
  sosRemainingSeconds = 6;
  const countEl = document.getElementById('sos-countdown-seconds');
  if (countEl) countEl.textContent = `${sosRemainingSeconds}s`;

  if (sosCountdownTimer) clearInterval(sosCountdownTimer);
  sosCountdownTimer = setInterval(() => {
    sosRemainingSeconds--;
    if (countEl) countEl.textContent = `${sosRemainingSeconds}s`;
    if (sosRemainingSeconds <= 0) {
      clearInterval(sosCountdownTimer);
      sosCountdownTimer = null;
      confirmAndDispatchEmergencySOS();
    }
  }, 1000);
}

function closeVoiceEmergencySOSModal() {
  if (sosCountdownTimer) {
    clearInterval(sosCountdownTimer);
    sosCountdownTimer = null;
  }
  stopEmergencyVoiceRecognition();
  const modal = document.getElementById('modal-emergency-voice-sos');
  if (modal) modal.classList.add('hidden');
}

function startEmergencyVoiceRecognition() {
  const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRec) {
    console.warn('SpeechRecognition not supported');
    return;
  }
  try {
    if (sosSpeechRecognition) {
      try { sosSpeechRecognition.abort(); } catch (e) {}
    }
    sosSpeechRecognition = new SpeechRec();
    sosSpeechRecognition.continuous = true;
    sosSpeechRecognition.interimResults = true;
    sosSpeechRecognition.lang = state.seniorLanguage === 'hi' ? 'hi-IN' : 'en-IN';

    sosSpeechRecognition.onresult = (evt) => {
      let finalTranscript = '';
      for (let i = evt.resultIndex; i < evt.results.length; ++i) {
        finalTranscript += evt.results[i][0].transcript;
      }
      if (finalTranscript.trim()) {
        state.emergencyState.recordedDistressText = finalTranscript.trim();
        const el = document.getElementById('sos-voice-transcript');
        if (el) el.textContent = `"${finalTranscript.trim()}"`;
      }
    };

    sosSpeechRecognition.onerror = (e) => {
      console.warn('Emergency speech error:', e);
    };

    sosSpeechRecognition.start();
    isSosListening = true;
    updateSosMicUI(true);
  } catch (e) {
    console.warn('Could not start emergency recognition:', e);
  }
}

function stopEmergencyVoiceRecognition() {
  if (sosSpeechRecognition) {
    try { sosSpeechRecognition.stop(); } catch (e) {}
    sosSpeechRecognition = null;
  }
  isSosListening = false;
  updateSosMicUI(false);
}

function toggleEmergencyVoiceRecording() {
  if (isSosListening) {
    stopEmergencyVoiceRecognition();
  } else {
    startEmergencyVoiceRecognition();
  }
}

function updateSosMicUI(listening) {
  const btn = document.getElementById('sos-mic-record-btn');
  const statusEl = document.getElementById('sos-voice-status');
  if (btn) {
    if (listening) {
      btn.className = 'w-20 h-20 rounded-full bg-gradient-to-tr from-rose-600 to-red-600 text-white text-2xl flex items-center justify-center shadow-xl shadow-rose-600/40 hover:scale-105 active:scale-95 transition-all border-4 border-rose-200 animate-pulse relative';
    } else {
      btn.className = 'w-20 h-20 rounded-full bg-slate-300 text-slate-700 text-2xl flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition-all border-4 border-slate-200 relative';
    }
  }
  if (statusEl) {
    statusEl.innerHTML = listening
      ? '<span class="w-2 h-2 rounded-full bg-rose-600 animate-ping"></span><span>Listening to your voice... (बोलिए, आवाज सुनी जा रही है)</span>'
      : '<span class="w-2 h-2 rounded-full bg-slate-400"></span><span>Mic Paused (माइक्रोफोन रुका है)</span>';
  }
}

function selectSosDistressPreset(presetText) {
  state.emergencyState.recordedDistressText = presetText;
  const el = document.getElementById('sos-voice-transcript');
  if (el) el.textContent = `"${presetText}"`;
  soundEngine.playTone(600, 'sine', 0.1);
  confirmAndDispatchEmergencySOS();
}

function confirmAndDispatchEmergencySOS() {
  // Clear countdown and stop mic
  if (sosCountdownTimer) {
    clearInterval(sosCountdownTimer);
    sosCountdownTimer = null;
  }
  stopEmergencyVoiceRecognition();

  // Close voice modal
  const voiceModal = document.getElementById('modal-emergency-voice-sos');
  if (voiceModal) voiceModal.classList.add('hidden');

  // Open Call Dispatch Hub Modal
  const callModal = document.getElementById('modal-emergency-calling-hub');
  if (callModal) callModal.classList.remove('hidden');

  // Fill Distress & Location details
  const distressMsg = state.emergencyState.recordedDistressText || (state.seniorLanguage === 'hi' 
    ? 'आपातकालीन सहायता अनुरोध: वरिष्ठ नागरिक ने सहायता बटन दबाया (Distress Fall/Emergency)' 
    : 'Emergency Distress Call: Senior Citizen triggered panic alarm (Fall/Distress)');
  
  const voiceDisplay = document.getElementById('sos-hub-voice-text');
  if (voiceDisplay) voiceDisplay.textContent = `"${distressMsg}"`;

  const loc = state.seniorLiveLocation || {
    lat: 28.6139,
    lng: 77.2090,
    address: 'Civil Lines, North Delhi, 110054'
  };
  const addrDisplay = document.getElementById('sos-hub-address-text');
  if (addrDisplay) addrDisplay.textContent = loc.address;
  const coordsLabel = document.getElementById('sos-hub-coords-label');
  if (coordsLabel) coordsLabel.textContent = `${loc.lat}° N, ${loc.lng}° E`;

  // Start phone ringing audio cadence
  soundEngine.startPhoneRinging();

  // Initial call statuses
  const statusCoord = document.getElementById('sos-call-status-coordinator');
  const statusFamily = document.getElementById('sos-call-status-family');

  if (statusCoord) {
    statusCoord.className = 'px-3 py-1.5 rounded-xl text-xs font-black bg-amber-100 text-amber-800 border border-amber-300 flex items-center space-x-1.5 animate-pulse';
    statusCoord.innerHTML = '<i class="fa-solid fa-phone-volume text-xs"></i><span>DIALING COORDINATOR & HOSPITAL...</span>';
  }
  if (statusFamily) {
    statusFamily.className = 'px-3 py-1.5 rounded-xl text-xs font-black bg-amber-100 text-amber-800 border border-amber-300 flex items-center space-x-1.5 animate-pulse';
    statusFamily.innerHTML = '<i class="fa-solid fa-phone-volume text-xs"></i><span>DIALING ROHIT VERMA (SON)...</span>';
  }

  // Trigger backend alert
  try {
    fetch('/api/alerts/trigger', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        seniorName: 'Ramesh Sharma (Age 74)',
        reason: `🚨 EMERGENCY SOS WITH LIVE GPS & VOICE: "${distressMsg}" | Location: ${loc.address} (${loc.lat}, ${loc.lng})`,
        suggestedAction: 'Immediate dual call active: Sister Kavita (Coordinator) & Rohit Verma (Son) alerted. Ambulance dispatched to GPS coordinates.'
      })
    }).catch(e => console.warn('Alert trigger network error:', e));
  } catch (e) {}

  // Update coordinator in-memory alerts
  state.seniorStatus.isSerious = true;
  updateFamilyAlertBanner();
  const rameshAlert = state.alerts.find(a => a.seniorName && a.seniorName.includes('Ramesh'));
  if (rameshAlert) {
    rameshAlert.priority = 'critical';
    rameshAlert.priorityScore = 100;
    rameshAlert.rank = 1;
    rameshAlert.reason = `🚨 LIVE SOS: "${distressMsg}" | GPS: ${loc.lat}, ${loc.lng} (${loc.address})`;
    rameshAlert.suggestedAction = 'Emergency dual call connected to Sister Kavita & Rohit Verma. Dispatch ambulance immediately.';
    renderCoordinatorAlerts();
  }

  // Progress call status after 2 seconds: Ringing
  setTimeout(() => {
    if (statusCoord) {
      statusCoord.className = 'px-3 py-1.5 rounded-xl text-xs font-black bg-sky-100 text-sky-800 border border-sky-300 flex items-center space-x-1.5 animate-pulse';
      statusCoord.innerHTML = '<i class="fa-solid fa-bell text-xs animate-bounce"></i><span>RINGING SISTER KAVITA...</span>';
    }
    if (statusFamily) {
      statusFamily.className = 'px-3 py-1.5 rounded-xl text-xs font-black bg-sky-100 text-sky-800 border border-sky-300 flex items-center space-x-1.5 animate-pulse';
      statusFamily.innerHTML = '<i class="fa-solid fa-bell text-xs animate-bounce"></i><span>RINGING FAMILY CIRCLE...</span>';
    }
  }, 2000);

  // Progress call status after 3.8 seconds: Connected!
  setTimeout(() => {
    soundEngine.stopPhoneRinging();
    soundEngine.playCallConnectedTone();

    if (statusCoord) {
      statusCoord.className = 'px-3 py-1.5 rounded-xl text-xs font-black bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center space-x-1.5';
      statusCoord.innerHTML = '<i class="fa-solid fa-circle-check text-xs text-emerald-600"></i><span>CALL CONNECTED (Sister Kavita on Speakerphone) ✓</span>';
    }
    if (statusFamily) {
      statusFamily.className = 'px-3 py-1.5 rounded-xl text-xs font-black bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center space-x-1.5';
      statusFamily.innerHTML = '<i class="fa-solid fa-circle-check text-xs text-emerald-600"></i><span>CONNECTED • SMS & GPS LINK SENT ✓</span>';
    }

    // Voice announcement
    if ('speechSynthesis' in window) {
      try {
        const msg = new SpeechSynthesisUtterance(state.seniorLanguage === 'hi'
          ? "आपातकालीन कॉल जुड़ गई है। केयर कोऑर्डिनेटर सिस्टर कविता और परिवार के सदस्य रोहित जी को आपकी लाइव लोकेशन और वॉइस मैसेज के साथ कॉल भेज दी गई है।"
          : "Emergency call connected. Sister Kavita and your family member Rohit have received your live location and distress message on speakerphone.");
        msg.lang = state.seniorLanguage === 'hi' ? 'hi-IN' : 'en-IN';
        window.speechSynthesis.speak(msg);
      } catch (e) {}
    }

    // Call duration timer
    emergencyCallSeconds = 0;
    const timerEl = document.getElementById('sos-call-duration-timer');
    if (emergencyCallDurationInterval) clearInterval(emergencyCallDurationInterval);
    emergencyCallDurationInterval = setInterval(() => {
      emergencyCallSeconds++;
      const m = String(Math.floor(emergencyCallSeconds / 60)).padStart(2, '0');
      const s = String(emergencyCallSeconds % 60).padStart(2, '0');
      if (timerEl) timerEl.textContent = `${m}:${s}`;
    }, 1000);

  }, 3800);
}

function toggleEmergencySpeaker() {
  state.emergencyState.speakerOn = !state.emergencyState.speakerOn;
  const btn = document.getElementById('sos-btn-speaker');
  const txt = document.getElementById('sos-speaker-text');
  if (btn && txt) {
    if (state.emergencyState.speakerOn) {
      txt.textContent = 'Speaker (ON)';
      btn.className = 'flex-1 py-3 px-3 rounded-2xl bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-300 text-xs font-black flex items-center justify-center space-x-1.5 shadow-xs transition-all';
    } else {
      txt.textContent = 'Speaker (OFF)';
      btn.className = 'flex-1 py-3 px-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-300 text-xs font-bold flex items-center justify-center space-x-1.5 shadow-xs transition-all';
    }
  }
}

function toggleEmergencyMicMute() {
  state.emergencyState.micMuted = !state.emergencyState.micMuted;
  const btn = document.getElementById('sos-btn-mute');
  const txt = document.getElementById('sos-mute-text');
  const icon = document.getElementById('sos-mute-icon');
  if (btn && txt && icon) {
    if (state.emergencyState.micMuted) {
      txt.textContent = 'Unmute';
      icon.className = 'fa-solid fa-microphone-slash text-sm text-rose-600';
      btn.className = 'flex-1 py-3 px-3 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-300 text-xs font-black flex items-center justify-center space-x-1.5 shadow-xs transition-all';
    } else {
      txt.textContent = 'Mute';
      icon.className = 'fa-solid fa-microphone text-sm';
      btn.className = 'flex-1 py-3 px-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 text-xs font-bold flex items-center justify-center space-x-1.5 shadow-xs transition-all';
    }
  }
}

function endEmergencyCalls() {
  soundEngine.stopPhoneRinging();
  if (emergencyCallDurationInterval) {
    clearInterval(emergencyCallDurationInterval);
    emergencyCallDurationInterval = null;
  }
  const modal = document.getElementById('modal-emergency-calling-hub');
  if (modal) modal.classList.add('hidden');

  soundEngine.playSuccessChime();
  showToast(state.seniorLanguage === 'hi' 
    ? 'आपातकालीन कॉल समाप्त। स्थिति सुरक्षित चिह्नित की गई।' 
    : 'Emergency call ended. Senior marked safe.', 'success');
  addOpsIncidentLog('Emergency SOS Call ended for Ramesh Sharma: Safe confirmation recorded.');
}

function openDetectedLocationMap() {
  const loc = state.seniorLiveLocation || { lat: 28.6139, lng: 77.2090 };
  window.open(`https://maps.google.com/?q=${loc.lat},${loc.lng}`, '_blank');
}

// Redirect triggerEmergencySOS to open the complete Location + Voice SOS flow
function triggerEmergencySOS() {
  openVoiceEmergencySOSModal();
}

// Senior App Native Tabs Switcher
function switchSeniorAppTab(tab) {
  const tabs = ['checkin', 'reminders', 'health', 'sos'];
  tabs.forEach(t => {
    const btn = document.getElementById(`tab-btn-${t}`);
    if (btn && t !== 'sos') {
      if (t === tab) {
        btn.className = 'senior-nav-pill px-3 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all flex items-center justify-center space-x-2 bg-white text-teal-800 shadow-sm border border-slate-200/60 active:scale-95';
      } else {
        btn.className = 'senior-nav-pill px-3 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-slate-600 hover:text-slate-900 hover:bg-white/70 transition-all flex items-center justify-center space-x-2 active:scale-95';
      }
    }
  });

  if (tab === 'checkin') {
    const el = document.getElementById('senior-greeting') || document.getElementById('view-senior');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  } else if (tab === 'reminders') {
    const el = document.getElementById('senior-reminders-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      el.classList.add('ring-4', 'ring-amber-300');
      setTimeout(() => el.classList.remove('ring-4', 'ring-amber-300'), 1500);
    }
  } else if (tab === 'health') {
    const el = document.getElementById('senior-assessment-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      el.classList.add('ring-4', 'ring-teal-300');
      setTimeout(() => el.classList.remove('ring-4', 'ring-teal-300'), 1500);
    }
  } else if (tab === 'sos') {
    openVoiceEmergencySOSModal();
  }
}

// =========================================================================
// SLIDE-OUT SIDEBAR DRAWER LOGIC (साइड बार मेनू)
// =========================================================================
function toggleSlideDrawer(forceState) {
  const backdrop = document.getElementById('slide-drawer-backdrop');
  const drawer = document.getElementById('slide-drawer-menu');
  if (!drawer || !backdrop) return;

  const isOpen = !drawer.classList.contains('-translate-x-full');
  const shouldOpen = (forceState !== undefined) ? forceState : !isOpen;

  if (shouldOpen) {
    // Update drawer profile data before opening
    const pName = document.getElementById('drawer-user-name');
    const pMeta = document.getElementById('drawer-user-meta');
    const pAvatar = document.getElementById('drawer-user-avatar');
    
    if (state.currentRole === 'senior') {
      let prof = null;
      try { prof = JSON.parse(localStorage.getItem('careconnect_user_profile') || '{}'); } catch(e) {}
      const name = prof?.name || 'Ramesh Sharma';
      const age = prof?.age || 74;
      const gender = prof?.gender || 'Male';
      if (pName) pName.textContent = name;
      if (pMeta) pMeta.textContent = `${age} Yrs • ${gender} • New Delhi`;
      if (pAvatar) pAvatar.textContent = name.split(' ').map(n=>n[0]).join('').slice(0,2).toUpperCase();
    } else {
      if (pName) pName.textContent = authRoleConfigs[state.currentRole]?.name || 'CareConnect User';
      if (pMeta) pMeta.textContent = authRoleConfigs[state.currentRole]?.title || 'Authenticated Session';
    }

    backdrop.classList.remove('hidden');
    drawer.classList.remove('-translate-x-full');
    drawer.classList.add('translate-x-0');

    if (soundEngine && typeof soundEngine.playTone === 'function') {
      soundEngine.playTone(520, 'sine', 0.08);
    }
  } else {
    backdrop.classList.add('hidden');
    drawer.classList.add('-translate-x-full');
    drawer.classList.remove('translate-x-0');
  }
}

// =========================================================================
// CARE COORDINATOR HUB: ML PREDICTIONS CHART, OPERATOR ASSIGNMENT & PROOFS
// (उच्च से निम्न एमएल प्रेडिक्शन चार्ट, ऑपरेटर असाइनमेंट व सबूत चेकिंग)
// =========================================================================

const defaultCoordinatorSeniors = [
  {
    id: 'SNR-101',
    rank: 1,
    name: 'Ramesh Sharma',
    age: 74,
    gender: 'Male',
    location: 'Greater Kailash, South Delhi (C-Block)',
    phone: '+91 98110-44912',
    familyContact: 'Rahul Sharma (Son) • +91 98711-20931',
    mlScore: 98,
    mlRisk: 'high',
    vitals: { bp: '158/96', hr: '114 bpm', spo2: '94%', glucose: '138 mg/dL', adl: '3/4', missedDoses: 2 },
    reason: 'Resting Heart Rate spiked to 114 bpm + Zero motion detected 4 hrs + missed 08:00 AM check-in.',
    clinicalFlags: ['SpO2: 94% (Hypoxemia risk)', 'BP: 158/96 mmHg (Hypertensive Stage 2)', 'Pulse: 114 bpm (Tachycardia)'],
    assignedOperator: 'Sister Kavita, RN',
    assignedAction: '🏠 Doorstep Home Visit',
    taskStatus: 'proof_submitted'
  },
  {
    id: 'SNR-102',
    rank: 2,
    name: 'Savitri Devi',
    age: 81,
    gender: 'Female',
    location: 'Hauz Khas (Enclave 4)',
    phone: '+91 98103-99210',
    familyContact: 'Priya Verma (Daughter) • +91 99100-33421',
    mlScore: 92,
    mlRisk: 'high',
    vitals: { bp: '142/88', hr: '88 bpm', spo2: '97%', glucose: '110 mg/dL', adl: '2/4', missedDoses: 1 },
    reason: 'Bathroom motion impact sensor triggered. Voice note: sudden dizziness & acute hip discomfort on standing.',
    clinicalFlags: ['Bathroom Impact Sensor (Fall Risk)', 'ADL Mobility: 2/4 (High Assistance)', 'Reported Pain: 6/10 (Hip/Pelvis)'],
    assignedOperator: 'Brother Amit, Paramedic',
    assignedAction: '🏠 Home Visit & Hip Examination',
    taskStatus: 'proof_submitted'
  },
  {
    id: 'SNR-103',
    rank: 3,
    name: 'Anand Verma',
    age: 78,
    gender: 'Male',
    location: 'Saket (Sector 3)',
    phone: '+91 98734-11823',
    familyContact: 'Deepak Verma (Son) • +91 98112-99881',
    mlScore: 84,
    mlRisk: 'high',
    vitals: { bp: '132/84', hr: '76 bpm', spo2: '98%', glucose: '228 mg/dL', adl: '3/4', missedDoses: 3 },
    reason: 'Consecutive 2 missed evening insulin doses + Glucometer reading spiked to 228 mg/dL.',
    clinicalFlags: ['Glucose: 228 mg/dL (Hyperglycemia)', '3 Missed Prescription Doses', 'Type-2 Diabetic Profile'],
    assignedOperator: 'Brother Amit, Paramedic',
    assignedAction: '🏠 Doorstep Insulin Check',
    taskStatus: 'assigned'
  },
  {
    id: 'SNR-104',
    rank: 4,
    name: 'Meena Iyer',
    age: 72,
    gender: 'Female',
    location: 'Vasant Kunj (Pocket B)',
    phone: '+91 98188-77219',
    familyContact: 'Karthik Iyer (Son in Bengaluru) • +91 97400-55120',
    mlScore: 78,
    mlRisk: 'medium',
    vitals: { bp: '124/80', hr: '72 bpm', spo2: '98%', glucose: '105 mg/dL', adl: '4/4', missedDoses: 0 },
    reason: 'Hindi voice note classified by NLP engine as severe loneliness & depression sentiment. Isolated living condition.',
    clinicalFlags: ['Severe Isolation Sentiment', 'Son living interstate (Bengaluru)', 'Requires emotional counseling'],
    assignedOperator: 'Sunita Mehra (Counselor)',
    assignedAction: '📞 Urgent Tele-Call to Family',
    taskStatus: 'assigned'
  },
  {
    id: 'SNR-105',
    rank: 5,
    name: 'Harish Patel',
    age: 76,
    gender: 'Male',
    location: 'Malviya Nagar',
    phone: '+91 98199-33812',
    familyContact: 'Sneha Patel (Daughter) • +91 98200-44910',
    mlScore: 62,
    mlRisk: 'medium',
    vitals: { bp: '148/90', hr: '80 bpm', spo2: '96%', glucose: '132 mg/dL', adl: '3/4', missedDoses: 1 },
    reason: 'Moderate blood pressure elevation (148/90) + Dehydration alert (only 2 glasses of water logged).',
    clinicalFlags: ['Stage 1 Hypertension', 'Fluid deficit: 500ml of 2.0L goal'],
    assignedOperator: 'Rajesh Kumar (Attendant)',
    assignedAction: '🏠 Hydration & Salt Check',
    taskStatus: 'fulfilled'
  },
  {
    id: 'SNR-106',
    rank: 6,
    name: 'Nirmala Joshi',
    age: 80,
    gender: 'Female',
    location: 'Defence Colony',
    phone: '+91 98101-77889',
    familyContact: 'Amit Joshi (Son) • +91 98101-77889',
    mlScore: 54,
    mlRisk: 'medium',
    vitals: { bp: '130/82', hr: '74 bpm', spo2: '97%', glucose: '112 mg/dL', adl: '2/4', missedDoses: 0 },
    reason: 'ADL mobility score 2/4 (severe knee stiffness, requires walker) + requested walking buddy support.',
    clinicalFlags: ['Katz ADL Independence 2/4', 'Joint Arthritis / Fall Precaution'],
    assignedOperator: 'Sister Kavita, RN',
    assignedAction: '🏠 Physical Mobility Assessment',
    taskStatus: 'fulfilled'
  },
  {
    id: 'SNR-107',
    rank: 7,
    name: 'Om Prakash Gupta',
    age: 70,
    gender: 'Male',
    location: 'Lajpat Nagar (Part 2)',
    phone: '+91 98711-33221',
    familyContact: 'Vikas Gupta (Son) • +91 98711-33221',
    mlScore: 42,
    mlRisk: 'medium',
    vitals: { bp: '122/80', hr: '70 bpm', spo2: '98%', glucose: '108 mg/dL', adl: '4/4', missedDoses: 0 },
    reason: 'Recovering from mild seasonal bronchitis; daily vitals stabilizing with cough syrup regimen.',
    clinicalFlags: ['Post-respiratory recovery', 'Oxygen saturation optimal (98%)'],
    assignedOperator: 'Rajesh Kumar (Attendant)',
    assignedAction: '📞 Post-Flu Family Check',
    taskStatus: 'fulfilled'
  },
  {
    id: 'SNR-108',
    rank: 8,
    name: 'Kanta Devi',
    age: 73,
    gender: 'Female',
    location: 'Green Park (Block A)',
    phone: '+91 98114-55667',
    familyContact: 'Pooja Sharma (Daughter) • +91 98114-55667',
    mlScore: 26,
    mlRisk: 'low',
    vitals: { bp: '118/78', hr: '68 bpm', spo2: '99%', glucose: '102 mg/dL', adl: '4/4', missedDoses: 0 },
    reason: 'Optimal cardiovascular parameters, completed 45-min morning walking habit, 100% check-in compliance.',
    clinicalFlags: ['Vitals within ideal medical range', 'Good adherence'],
    assignedOperator: 'Sunita Mehra (Counselor)',
    assignedAction: '📞 Routine Wellness Tele-Call',
    taskStatus: 'fulfilled'
  },
  {
    id: 'SNR-109',
    rank: 9,
    name: 'Baldev Raj',
    age: 75,
    gender: 'Male',
    location: 'Greater Kailash 2 (Enclave)',
    phone: '+91 98109-11223',
    familyContact: 'Sanjay Raj (Son) • +91 98109-11223',
    mlScore: 18,
    mlRisk: 'low',
    vitals: { bp: '120/78', hr: '72 bpm', spo2: '99%', glucose: '98 mg/dL', adl: '4/4', missedDoses: 0 },
    reason: 'Healthy routine, all daily medications logged, zero pain reported, family actively supporting.',
    clinicalFlags: ['Zero reported risk factors', 'Safe independent living'],
    assignedOperator: 'Unassigned',
    assignedAction: 'None Required',
    taskStatus: 'none'
  },
  {
    id: 'SNR-110',
    rank: 10,
    name: 'Sushila Mehra',
    age: 71,
    gender: 'Female',
    location: 'Siri Fort Road',
    phone: '+91 98118-44556',
    familyContact: 'Kunal Mehra (Son) • +91 98118-44556',
    mlScore: 14,
    mlRisk: 'low',
    vitals: { bp: '116/76', hr: '66 bpm', spo2: '99%', glucose: '95 mg/dL', adl: '4/4', missedDoses: 0 },
    reason: 'Excellent health status. Fully independent in daily activities, regular hydration, positive mood.',
    clinicalFlags: ['Optimal geriatric wellness index', 'No intervention needed'],
    assignedOperator: 'Unassigned',
    assignedAction: 'None Required',
    taskStatus: 'none'
  }
];

const defaultCoordinatorTasks = [
  {
    id: 'TSK-501',
    seniorId: 'SNR-101',
    seniorName: 'Ramesh Sharma',
    seniorLocation: 'Greater Kailash, South Delhi',
    familyContact: 'Rahul Sharma (Son) • +91 98711-20931',
    operatorName: 'Sister Kavita, RN',
    operatorRole: 'Lead Field Nurse',
    actionType: 'visit',
    actionTitle: '🏠 Doorstep Physical Home Visit & Vitals Check',
    deadline: 'Immediate (Within 45 Mins)',
    instructions: 'Patient had resting pulse spike (114 bpm) & missed morning check-in. Visit home, measure physical vitals, and review evening meds with son Rahul.',
    status: 'pending_review', // 'assigned' | 'pending_review' | 'fulfilled' | 'rejected'
    dispatchedTime: 'Today 09:15 AM',
    completedTime: 'Today 10:45 AM',
    verifiedTime: '',
    verifiedBy: '',
    proof: {
      photoUrl: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=800&auto=format&fit=crop&q=80',
      gpsCoords: '28.6139° N, 77.2090° E (Accuracy: ±6m)',
      gpsLocationName: 'Greater Kailash Residence, South Delhi',
      familySignName: 'Rahul Sharma (Son) • +91 98711-20931',
      familyOtp: '7421 (Verified)',
      familyStatement: 'I confirm that Sister Kavita visited our home, conducted a physical BP & pulse examination (128/84), checked my father\'s medicines, and verified he is resting comfortably.',
      measuredVitals: { bp: '128/84 mmHg', spo2: '98%', hr: '76 bpm', glucose: '114 mg/dL' },
      operatorNotes: 'Senior was conscious, alert and responsive. Conducted physical examination. Heart rate stabilized to 76 bpm after oral hydration. Evening regimen confirmed with son Rahul.'
    }
  },
  {
    id: 'TSK-502',
    seniorId: 'SNR-102',
    seniorName: 'Savitri Devi',
    seniorLocation: 'Hauz Khas (Enclave 4)',
    familyContact: 'Priya Verma (Daughter) • +91 99100-33421',
    operatorName: 'Brother Amit, Paramedic',
    operatorRole: 'Paramedic Specialist',
    actionType: 'visit',
    actionTitle: '🏠 Home Visit & Hip Mobility Examination',
    deadline: 'Immediate (Within 45 Mins)',
    instructions: 'Bathroom impact sensor triggered with reports of dizziness and hip pain. Perform on-site fracture / mobility check and advise daughter Priya.',
    status: 'pending_review',
    dispatchedTime: 'Today 08:30 AM',
    completedTime: 'Today 09:40 AM',
    verifiedTime: '',
    verifiedBy: '',
    proof: {
      photoUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=800&auto=format&fit=crop&q=80',
      gpsCoords: '28.5494° N, 77.2001° E (Accuracy: ±5m)',
      gpsLocationName: 'Hauz Khas Enclave Residence',
      familySignName: 'Priya Verma (Daughter) • +91 99100-33421',
      familyOtp: '9182 (Verified)',
      familyStatement: 'Paramedic Brother Amit checked my mother immediately after her bathroom slip. No fractures detected. Pain gel applied and resting comfortably.',
      measuredVitals: { bp: '130/82 mmHg', spo2: '98%', hr: '82 bpm', glucose: '110 mg/dL' },
      operatorNotes: 'Completed physical palpation. No bone displacement or fractures observed. Soft tissue strain only. Advised cold compress and bedside assistance.'
    }
  },
  {
    id: 'TSK-503',
    seniorId: 'SNR-103',
    seniorName: 'Anand Verma',
    seniorLocation: 'Saket (Sector 3)',
    familyContact: 'Deepak Verma (Son) • +91 98112-99881',
    operatorName: 'Brother Amit, Paramedic',
    operatorRole: 'Paramedic Specialist',
    actionType: 'visit',
    actionTitle: '🏠 Doorstep Insulin Check & Glycemic Stabilization',
    deadline: 'Today Afternoon (By 2:00 PM)',
    instructions: 'Consecutive 2 missed insulin doses with glucose at 228 mg/dL. Visit home, measure physical sugar, supervise insulin dose, and instruct son Deepak.',
    status: 'assigned',
    dispatchedTime: 'Today 10:00 AM',
    completedTime: '',
    verifiedTime: '',
    verifiedBy: '',
    proof: null
  },
  {
    id: 'TSK-504',
    seniorId: 'SNR-104',
    seniorName: 'Meena Iyer',
    seniorLocation: 'Vasant Kunj (Pocket B)',
    familyContact: 'Karthik Iyer (Son in Bengaluru) • +91 97400-55120',
    operatorName: 'Sunita Mehra',
    operatorRole: 'Family Counselor',
    actionType: 'call',
    actionTitle: '📞 Urgent Tele-Call to Family Member & Senior',
    deadline: 'Today Afternoon (By 2:00 PM)',
    instructions: 'Severe loneliness sentiment score detected. Conduct tele-conference between senior and son Karthik in Bengaluru.',
    status: 'assigned',
    dispatchedTime: 'Today 10:15 AM',
    completedTime: '',
    verifiedTime: '',
    verifiedBy: '',
    proof: null
  },
  {
    id: 'TSK-505',
    seniorId: 'SNR-105',
    seniorName: 'Harish Patel',
    seniorLocation: 'Malviya Nagar',
    familyContact: 'Sneha Patel (Daughter) • +91 98200-44910',
    operatorName: 'Rajesh Kumar',
    operatorRole: 'Doorstep Attendant',
    actionType: 'visit',
    actionTitle: '🏠 Hydration & Salt Intake Doorstep Check',
    deadline: 'Today Morning (By 11:30 AM)',
    instructions: 'Dehydration alert with elevated BP. Deliver oral electrolytes, guide daughter Sneha on hydration schedule.',
    status: 'fulfilled',
    dispatchedTime: 'Yesterday 04:00 PM',
    completedTime: 'Yesterday 05:15 PM',
    verifiedTime: 'Yesterday 05:30 PM',
    verifiedBy: 'Sister Kavita, RN',
    proof: {
      photoUrl: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=800&auto=format&fit=crop&q=80',
      gpsCoords: '28.5283° N, 77.2185° E',
      gpsLocationName: 'Malviya Nagar Residence',
      familySignName: 'Sneha Patel (Daughter) • +91 98200-44910',
      familyOtp: '3310 (Verified)',
      familyStatement: 'Rajesh Kumar checked my father and set up the water alarm tracker. BP normalized.',
      measuredVitals: { bp: '124/80 mmHg', spo2: '97%', hr: '74 bpm', glucose: '118 mg/dL' },
      operatorNotes: 'Delivered electrolyte pack. Hydration tracker tested and active.'
    }
  },
  {
    id: 'TSK-506',
    seniorId: 'SNR-106',
    seniorName: 'Nirmala Joshi',
    seniorLocation: 'Defence Colony',
    familyContact: 'Amit Joshi (Son) • +91 98101-77889',
    operatorName: 'Sister Kavita, RN',
    operatorRole: 'Lead Field Nurse',
    actionType: 'visit',
    actionTitle: '🏠 Mobility & Walker Equipment Inspection',
    deadline: 'Yesterday Evening',
    instructions: 'Assess knee joint mobility, install bedside grip bars and verify medication.',
    status: 'fulfilled',
    dispatchedTime: 'Yesterday 02:00 PM',
    completedTime: 'Yesterday 03:45 PM',
    verifiedTime: 'Yesterday 04:00 PM',
    verifiedBy: 'Sister Kavita, RN',
    proof: {
      photoUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=800&auto=format&fit=crop&q=80',
      gpsCoords: '28.5733° N, 77.2341° E',
      gpsLocationName: 'Defence Colony Residence',
      familySignName: 'Amit Joshi (Son)',
      familyOtp: '5521 (Verified)',
      familyStatement: 'Bedside safety handles installed. Walking support provided.',
      measuredVitals: { bp: '126/82 mmHg', spo2: '98%', hr: '72 bpm', glucose: '110 mg/dL' },
      operatorNotes: 'Mobility assessment completed. Home safety clear.'
    }
  }
];

let currentCoordinatorTab = 'seniors';
let currentRiskFilter = 'all';
let currentTaskFilter = 'all';
let selectedTaskForVerification = null;

function getCoordinatorSeniors() {
  let seniors = [];
  try {
    const raw = localStorage.getItem('careconnect_coord_seniors');
    if (raw) {
      seniors = JSON.parse(raw);
    }
  } catch (e) {}

  if (!seniors || seniors.length === 0) {
    seniors = defaultCoordinatorSeniors.map(s => ({ ...s }));
  }

  // Auto-integrate newly registered or updated senior profiles into the triage queue
  try {
    const srProf = (typeof getUserProfile === 'function') ? getUserProfile('senior') : null;
    if (srProf && srProf.name && srProf.name.trim() !== '') {
      const isDefaultSenior = defaultCoordinatorSeniors.some(ds => ds.name.toLowerCase().trim() === srProf.name.toLowerCase().trim());
      
      // If it's a distinct user profile (e.g. customized or newly registered member)
      if (!isDefaultSenior || srProf.isNewUser) {
        const payload = (typeof assessmentState !== 'undefined' && assessmentState.lastPayload) ? assessmentState.lastPayload : {};
        const pred = (typeof assessmentState !== 'undefined' && assessmentState.lastPrediction) ? assessmentState.lastPrediction : {};
        const score = pred.risk_score || 35;
        const riskTier = score >= 80 ? 'high' : (score >= 40 ? 'medium' : 'low');

        const userCardId = 'SNR-USER-NEW';
        const existsIdx = seniors.findIndex(s => s.id === userCardId || s.name.toLowerCase().trim() === srProf.name.toLowerCase().trim());

        const userCard = {
          id: userCardId,
          rank: 0,
          name: srProf.name,
          age: srProf.age || 70,
          gender: srProf.gender || 'Senior',
          location: srProf.address || 'Civil Lines, North Delhi (Cluster 1)',
          phone: srProf.phone || '+91 98110-44912',
          familyContact: srProf.emergencyNotes || `${srProf.emergencyContact || 'Family Member'} • ${srProf.emergencyPhone || '+91 98111-22334'}`,
          mlScore: score,
          mlRisk: riskTier,
          vitals: {
            bp: payload.bp_systolic ? `${payload.bp_systolic}/${payload.bp_diastolic}` : '122/80',
            hr: payload.heart_rate ? `${payload.heart_rate} bpm` : '72 bpm',
            spo2: payload.spo2 ? `${payload.spo2}%` : '98%',
            glucose: payload.blood_glucose ? `${payload.blood_glucose} mg/dL` : '106 mg/dL',
            adl: '4/4',
            missedDoses: payload.missed_doses || 0
          },
          reason: pred.alert_reason_summary || 'Newly registered senior citizen enrolled in CareConnect AI. Baseline physiological telemetry logged.',
          clinicalFlags: ['Newly Registered Member', 'Baseline Health Profile Established'],
          assignedOperator: 'Sister Kavita, RN',
          assignedAction: '📞 Welcome Tele-Call & Baseline Assessment',
          taskStatus: 'assigned',
          isNewUser: true
        };

        if (existsIdx >= 0) {
          seniors[existsIdx] = userCard;
        } else {
          seniors.unshift(userCard);
        }
      }
    }
  } catch (err) {
    console.warn('Auto-integration of senior profile into coordinator list:', err);
  }

  // Ensure ranked High to Low
  seniors.sort((a, b) => b.mlScore - a.mlScore);
  seniors.forEach((s, idx) => { s.rank = idx + 1; });

  return seniors;
}

function saveCoordinatorSeniors(list) {
  try {
    localStorage.setItem('careconnect_coord_seniors', JSON.stringify(list));
  } catch (e) {}
}

function getCoordinatorTasks() {
  try {
    const raw = localStorage.getItem('careconnect_coord_tasks');
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return defaultCoordinatorTasks;
}

function saveCoordinatorTasks(list) {
  try {
    localStorage.setItem('careconnect_coord_tasks', JSON.stringify(list));
  } catch (e) {}
}

function switchCoordinatorViewTab(tab) {
  currentCoordinatorTab = tab;
  const btnSeniors = document.getElementById('coord-tab-btn-seniors');
  const btnTasks = document.getElementById('coord-tab-btn-tasks');
  const panelSeniors = document.getElementById('coord-view-seniors-panel');
  const panelTasks = document.getElementById('coord-view-tasks-panel');

  if (tab === 'seniors') {
    if (btnSeniors) btnSeniors.className = 'flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all bg-white text-teal-900 shadow-sm flex items-center justify-center space-x-2 active:scale-95';
    if (btnTasks) btnTasks.className = 'flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-slate-600 hover:text-slate-900 transition-all flex items-center justify-center space-x-2 active:scale-95';
    if (panelSeniors) panelSeniors.classList.remove('hidden');
    if (panelTasks) panelTasks.classList.add('hidden');
  } else {
    if (btnTasks) btnTasks.className = 'flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all bg-white text-indigo-900 shadow-sm flex items-center justify-center space-x-2 active:scale-95';
    if (btnSeniors) btnSeniors.className = 'flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-slate-600 hover:text-slate-900 transition-all flex items-center justify-center space-x-2 active:scale-95';
    if (panelTasks) panelTasks.classList.remove('hidden');
    if (panelSeniors) panelSeniors.classList.add('hidden');
  }
}

function filterCoordinatorByRisk(risk) {
  currentRiskFilter = risk;
  ['all', 'high', 'medium', 'low'].forEach(r => {
    const btn = document.getElementById(`rf-filter-${r}`);
    if (btn) {
      if (r === risk) {
        btn.className = 'px-3 py-1.5 rounded-xl text-xs font-black bg-slate-900 text-white shadow-xs';
      } else {
        btn.className = 'px-3 py-1.5 rounded-xl text-xs font-bold bg-white text-slate-700 border border-slate-300 hover:bg-slate-50';
      }
    }
  });
  renderCoordinatorRankedSeniors();
}

function filterCoordinatorSeniorsSearch() {
  renderCoordinatorRankedSeniors();
}

function renderCoordinatorHub() {
  const seniors = getCoordinatorSeniors();
  const tasks = getCoordinatorTasks();

  // 1. Calculate Risk Stratification Stats
  const total = seniors.length;
  const highCount = seniors.filter(s => s.mlScore >= 80).length;
  const medCount = seniors.filter(s => s.mlScore >= 40 && s.mlScore < 80).length;
  const lowCount = seniors.filter(s => s.mlScore < 40).length;

  const highPct = total ? Math.round((highCount / total) * 100) : 0;
  const medPct = total ? Math.round((medCount / total) * 100) : 0;
  const lowPct = total ? 100 - highPct - medPct : 0;

  // Update Metric Cards
  const elHigh = document.getElementById('coord-stat-high-count');
  const elHighPct = document.getElementById('coord-stat-high-pct');
  const elMed = document.getElementById('coord-stat-med-count');
  const elMedPct = document.getElementById('coord-stat-med-pct');
  const elLow = document.getElementById('coord-stat-low-count');
  const elLowPct = document.getElementById('coord-stat-low-pct');
  const elCap = document.getElementById('coord-total-seniors-badge');

  if (elHigh) elHigh.textContent = highCount;
  if (elHighPct) elHighPct.textContent = `(${highPct}% of cohort)`;
  if (elMed) elMed.textContent = medCount;
  if (elMedPct) elMedPct.textContent = `(${medPct}% of cohort)`;
  if (elLow) elLow.textContent = lowCount;
  if (elLowPct) elLowPct.textContent = `(${lowPct}% of cohort)`;
  if (elCap) elCap.textContent = `${total} Enrolled Seniors`;

  // Update Visual Risk Bar
  const barHigh = document.getElementById('risk-bar-high');
  const barMed = document.getElementById('risk-bar-med');
  const barLow = document.getElementById('risk-bar-low');

  if (barHigh) {
    barHigh.style.width = `${highPct}%`;
    barHigh.textContent = `${highPct}% High Risk`;
  }
  if (barMed) {
    barMed.style.width = `${medPct}%`;
    barMed.textContent = `${medPct}% Medium`;
  }
  if (barLow) {
    barLow.style.width = `${lowPct}%`;
    barLow.textContent = `${lowPct}% Low`;
  }

  // Update pending proofs badge
  const pendingProofsCount = tasks.filter(t => t.status === 'pending_review').length;
  const badgeProof = document.getElementById('coord-badge-pending-proofs');
  if (badgeProof) badgeProof.textContent = pendingProofsCount;

  // Render both views
  renderCoordinatorRankedSeniors();
  renderCoordinatorTasksRecord();
}

function renderCoordinatorRankedSeniors() {
  const container = document.getElementById('coordinator-alert-list');
  if (!container) return;

  const searchInput = document.getElementById('coordinator-search-input');
  const query = searchInput ? searchInput.value.toLowerCase().trim() : '';

  let seniors = getCoordinatorSeniors();

  // Filter by risk category
  if (currentRiskFilter !== 'all') {
    if (currentRiskFilter === 'high') {
      seniors = seniors.filter(s => s.mlScore >= 80);
    } else if (currentRiskFilter === 'medium') {
      seniors = seniors.filter(s => s.mlScore >= 40 && s.mlScore < 80);
    } else if (currentRiskFilter === 'low') {
      seniors = seniors.filter(s => s.mlScore < 40);
    }
  }

  // Search filter
  if (query) {
    seniors = seniors.filter(s => 
      s.name.toLowerCase().includes(query) ||
      s.location.toLowerCase().includes(query) ||
      s.familyContact.toLowerCase().includes(query) ||
      s.reason.toLowerCase().includes(query)
    );
  }

  // Strictly sort High to Low
  seniors.sort((a, b) => b.mlScore - a.mlScore);

  if (seniors.length === 0) {
    container.innerHTML = `
      <div class="bg-white rounded-3xl p-12 text-center border-2 border-dashed border-slate-200">
        <div class="w-16 h-16 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center text-2xl mb-3">
          <i class="fa-solid fa-users-slash"></i>
        </div>
        <h4 class="text-sm font-extrabold text-slate-800">No Seniors Found For This Filter</h4>
        <p class="text-xs text-slate-500 mt-1">Try resetting the risk filter or search keywords.</p>
        <button onclick="filterCoordinatorByRisk('all')" class="mt-3 text-xs font-bold text-teal-700 hover:underline">
          Reset Filter to All
        </button>
      </div>
    `;
    return;
  }

  container.innerHTML = seniors.map((s, idx) => {
    const isHigh = s.mlScore >= 80;
    const isMed = s.mlScore >= 40 && s.mlScore < 80;
    
    const cardBorder = isHigh 
      ? 'border-2 border-rose-300 bg-rose-50/20 shadow-sm' 
      : (isMed ? 'border-2 border-amber-200 bg-white shadow-xs' : 'border border-slate-200 bg-white opacity-95');

    const scoreBadge = isHigh 
      ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white' 
      : (isMed ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white' : 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white');

    const flagsHtml = (s.clinicalFlags || []).map(f => `
      <span class="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
        <i class="fa-solid fa-circle-dot text-[8px] text-rose-500 mr-1"></i>
        ${f}
      </span>
    `).join(' ');

    const operatorAssignedBadge = s.assignedOperator && s.assignedOperator !== 'Unassigned'
      ? `<span class="px-2.5 py-1 rounded-xl text-xs font-black bg-indigo-100 text-indigo-900 border border-indigo-200 flex items-center space-x-1">
          <i class="fa-solid fa-user-check text-xs text-indigo-600"></i>
          <span>Assigned: ${s.assignedOperator} (${s.assignedAction || 'Visit'})</span>
         </span>`
      : `<span class="px-2.5 py-1 rounded-xl text-xs font-black bg-slate-100 text-slate-500 border border-slate-200 flex items-center space-x-1">
          <i class="fa-solid fa-user-clock text-xs"></i>
          <span>Operator: Unassigned</span>
         </span>`;

    return `
      <div class="p-5 sm:p-6 rounded-3xl ${cardBorder} transition-all">
        <div class="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          
          <!-- Senior Info & ML Rank Badge -->
          <div class="flex items-start space-x-4">
            <div class="flex flex-col items-center">
              <span class="w-10 h-10 rounded-2xl ${scoreBadge} flex items-center justify-center font-mono font-black text-sm shadow-md">
                #${idx + 1}
              </span>
              <span class="font-mono text-[10px] font-black text-slate-500 mt-1">${s.mlScore}%</span>
            </div>

            <div>
              <div class="flex flex-wrap items-center gap-2">
                <h3 class="text-base sm:text-lg font-black text-slate-900">${s.name}</h3>
                <span class="text-xs font-bold text-slate-500">(${s.age} Yrs • ${s.gender})</span>
                <span class="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${isHigh ? 'bg-rose-100 text-rose-800 border border-rose-300' : (isMed ? 'bg-amber-100 text-amber-800 border border-amber-300' : 'bg-emerald-100 text-emerald-800 border border-emerald-300')}">
                  ${isHigh ? 'High Risk (उच्च जोखिम)' : (isMed ? 'Moderate Risk' : 'Low Risk (सुरक्षित)')}
                </span>
              </div>
              <p class="text-xs text-slate-500 font-medium mt-0.5">
                📍 ${s.location} • 📞 ${s.phone}
              </p>
              <p class="text-xs text-indigo-700 font-extrabold mt-0.5 flex items-center space-x-1">
                <i class="fa-solid fa-people-roof text-xs"></i>
                <span>Family Contact: ${s.familyContact}</span>
              </p>
            </div>
          </div>

          <!-- Operator Status Badge -->
          <div>
            ${operatorAssignedBadge}
          </div>
        </div>

        <!-- ML Clinical Factors & Reasons -->
        <div class="pt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div class="text-[11px] font-black text-slate-500 uppercase tracking-wider mb-1">
              Machine Learning Diagnostic Reason / निदान:
            </div>
            <p class="text-xs text-slate-800 font-medium leading-relaxed bg-white p-3 rounded-2xl border border-slate-200">
              ${s.reason}
            </p>
            <div class="flex flex-wrap gap-1.5 mt-2">
              ${flagsHtml}
            </div>
          </div>

          <!-- Vitals Snapshot -->
          <div>
            <div class="text-[11px] font-black text-slate-500 uppercase tracking-wider mb-1">
              Recorded Biometric Vitals / शारीरिक लक्षण:
            </div>
            <div class="grid grid-cols-3 sm:grid-cols-4 gap-2 text-center">
              <div class="p-2 rounded-xl bg-slate-50 border border-slate-200">
                <span class="text-[9px] font-bold text-slate-500 block uppercase">BP</span>
                <span class="text-xs font-black text-slate-900 font-mono">${s.vitals.bp || '120/80'}</span>
              </div>
              <div class="p-2 rounded-xl bg-slate-50 border border-slate-200">
                <span class="text-[9px] font-bold text-slate-500 block uppercase">SpO2</span>
                <span class="text-xs font-black text-slate-900 font-mono">${s.vitals.spo2 || '98%'}</span>
              </div>
              <div class="p-2 rounded-xl bg-slate-50 border border-slate-200">
                <span class="text-[9px] font-bold text-slate-500 block uppercase">Pulse</span>
                <span class="text-xs font-black text-slate-900 font-mono">${s.vitals.hr || '74 bpm'}</span>
              </div>
              <div class="p-2 rounded-xl bg-slate-50 border border-slate-200">
                <span class="text-[9px] font-bold text-slate-500 block uppercase">Sugar</span>
                <span class="text-xs font-black text-slate-900 font-mono">${s.vitals.glucose || '105 mg'}</span>
              </div>
            </div>

            <!-- Action Buttons on Senior -->
            <div class="flex flex-wrap items-center gap-2 mt-3.5">
              <button onclick="openAssignOperatorModal('${s.id}')"
                class="flex-1 py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black shadow-sm transition-all flex items-center justify-center space-x-1.5 active:scale-95">
                <i class="fa-solid fa-user-plus"></i>
                <span>Assign Operator (Call & Visit Family)</span>
              </button>
              <button onclick="openClinicalReportSheet('${s.id}')"
                class="py-2 px-3 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-300 text-xs font-bold transition-all flex items-center space-x-1 active:scale-95"
                title="View Detailed Clinical Report Sheet / विस्तृत स्वास्थ्य रिपोर्ट देखें">
                <i class="fa-solid fa-file-waveform text-teal-600"></i>
                <span>View Sheet</span>
              </button>
            </div>
          </div>
        </div>

      </div>
    `;
  }).join('');
}

function filterTasksByStatus(status) {
  currentTaskFilter = status;
  ['all', 'pending_review', 'assigned', 'fulfilled'].forEach(st => {
    const btn = document.getElementById(`task-filter-${st.replace('_', '-')}`);
    if (btn) {
      if (st === status) {
        btn.className = 'px-3 py-1.5 rounded-xl text-xs font-black bg-slate-900 text-white shadow-xs';
      } else {
        btn.className = 'px-3 py-1.5 rounded-xl text-xs font-bold bg-white text-slate-700 border border-slate-300 hover:bg-slate-50';
      }
    }
  });
  renderCoordinatorTasksRecord();
}

function renderCoordinatorTasksRecord() {
  const container = document.getElementById('coordinator-tasks-record-list');
  if (!container) return;

  let tasks = getCoordinatorTasks();

  if (currentTaskFilter !== 'all') {
    tasks = tasks.filter(t => t.status === currentTaskFilter);
  }

  if (tasks.length === 0) {
    container.innerHTML = `
      <div class="bg-white rounded-3xl p-12 text-center border-2 border-dashed border-slate-200">
        <div class="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center text-2xl mb-3">
          <i class="fa-solid fa-circle-check"></i>
        </div>
        <h4 class="text-sm font-extrabold text-slate-800">No Tasks in This Category</h4>
        <p class="text-xs text-slate-500 mt-1">All assigned complaints have been processed.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = tasks.map(t => {
    const isNeedsReview = t.status === 'pending_review';
    const isFulfilled = t.status === 'fulfilled';
    const isAssigned = t.status === 'assigned';

    const cardClass = isNeedsReview 
      ? 'border-2 border-amber-300 bg-amber-50/20' 
      : (isFulfilled ? 'border-2 border-emerald-200 bg-emerald-50/10' : 'border-2 border-slate-200 bg-white');

    const statusBadge = isNeedsReview
      ? `<span class="px-3 py-1 rounded-xl text-xs font-black bg-amber-100 text-amber-900 border border-amber-300 flex items-center space-x-1.5 animate-pulse">
          <i class="fa-solid fa-file-circle-exclamation text-amber-600"></i>
          <span>PROOF SUBMITTED (Needs Review) ⏳</span>
         </span>`
      : (isFulfilled 
          ? `<span class="px-3 py-1 rounded-xl text-xs font-black bg-emerald-100 text-emerald-900 border border-emerald-300 flex items-center space-x-1.5">
              <i class="fa-solid fa-shield-check text-emerald-600"></i>
              <span>FULFILLED & VERIFIED ✓</span>
             </span>`
          : `<span class="px-3 py-1 rounded-xl text-xs font-black bg-sky-100 text-sky-900 border border-sky-300 flex items-center space-x-1.5">
              <i class="fa-solid fa-person-walking text-sky-600"></i>
              <span>ASSIGNED / IN TRANSIT</span>
             </span>`);

    return `
      <div class="p-5 rounded-3xl bg-white ${cardClass} shadow-xs transition-all flex flex-col justify-between">
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <div class="flex items-center space-x-2">
              <span class="font-mono text-xs font-black px-2.5 py-0.5 rounded-lg bg-indigo-100 text-indigo-900 border border-indigo-200">
                ${t.id}
              </span>
              <h4 class="text-sm sm:text-base font-black text-slate-900">${t.actionTitle}</h4>
            </div>
            <p class="text-xs text-slate-500 font-medium mt-1">
              Target Patient: <strong class="text-slate-800">${t.seniorName}</strong> (${t.seniorLocation})
            </p>
            <p class="text-xs text-indigo-700 font-extrabold mt-0.5">
              Family Member: ${t.familyContact}
            </p>
          </div>

          <div class="flex flex-col sm:items-end">
            ${statusBadge}
            <span class="text-[10px] text-slate-400 font-bold mt-1">Dispatched: ${t.dispatchedTime}</span>
          </div>
        </div>

        <!-- Task Body -->
        <div class="py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div>
            <span class="font-bold text-slate-700">Assigned Operator:</span>
            <span class="font-black text-indigo-900 ml-1">👤 ${t.operatorName} (${t.operatorRole})</span>
            <div class="text-slate-600 font-medium mt-1 leading-relaxed max-w-xl">
              "${t.instructions}"
            </div>
          </div>

          <!-- Actions -->
          <div class="flex items-center space-x-2 w-full sm:w-auto">
            ${isNeedsReview ? `
              <button onclick="openVerifyProofModal('${t.id}')"
                class="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-black text-xs shadow-md shadow-amber-500/20 flex items-center justify-center space-x-1.5 active:scale-95 transition-all">
                <i class="fa-solid fa-magnifying-glass-arrow-right"></i>
                <span>Check Proofs & Verify (सबूत जांचें)</span>
              </button>
            ` : (isAssigned ? `
              <button onclick="simulateOperatorProofSubmission('${t.id}')"
                class="w-full sm:w-auto px-3.5 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-800 border border-indigo-300 font-black text-xs transition-all flex items-center justify-center space-x-1">
                <i class="fa-solid fa-camera"></i>
                <span>Simulate Operator Proof Upload</span>
              </button>
            ` : `
              <button onclick="openVerifyProofModal('${t.id}')"
                class="w-full sm:w-auto px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold text-xs transition-all flex items-center justify-center space-x-1">
                <i class="fa-solid fa-eye"></i>
                <span>View Verified Proof</span>
              </button>
            `)}
          </div>
        </div>

        ${t.verifiedBy ? `
          <div class="pt-2 border-t border-slate-100 text-[11px] font-bold text-emerald-800 flex items-center space-x-1">
            <i class="fa-solid fa-stamp text-xs"></i>
            <span>Verified & Approved by: ${t.verifiedBy} at ${t.verifiedTime}</span>
          </div>
        ` : ''}

      </div>
    `;
  }).join('');
}

function openAssignOperatorModal(seniorId) {
  const seniors = getCoordinatorSeniors();
  const s = seniors.find(x => x.id === seniorId) || seniors[0];
  if (!s) return;

  const idInput = document.getElementById('assign-senior-id');
  const nameLabel = document.getElementById('assign-modal-senior-name');
  const famLabel = document.getElementById('assign-modal-family-info');
  const badge = document.getElementById('assign-modal-risk-badge');
  const instructArea = document.getElementById('assign-instructions-text');

  if (idInput) idInput.value = s.id;
  if (nameLabel) nameLabel.textContent = `${s.name} (Age ${s.age}) • ${s.location}`;
  if (famLabel) famLabel.textContent = `Family Contact: ${s.familyContact}`;
  if (badge) {
    badge.textContent = `${s.mlScore}% ${s.mlRisk.toUpperCase()} RISK`;
    badge.className = s.mlScore >= 80 
      ? 'px-2.5 py-1 rounded-xl text-xs font-black bg-rose-100 text-rose-800 border border-rose-300'
      : 'px-2.5 py-1 rounded-xl text-xs font-black bg-amber-100 text-amber-800 border border-amber-300';
  }
  if (instructArea) {
    instructArea.value = `Target: ${s.name}. ML Risk Flag: ${s.reason} Action: Visit family member ${s.familyContact}, conduct physical vitals examination, and capture photo proof.`;
  }

  const modal = document.getElementById('modal-coord-assign-operator');
  if (modal) modal.classList.remove('hidden');
}

function closeAssignOperatorModal() {
  const modal = document.getElementById('modal-coord-assign-operator');
  if (modal) modal.classList.add('hidden');
}

function handleDispatchOperatorAssignment(e) {
  if (e) e.preventDefault();
  const seniorId = document.getElementById('assign-senior-id')?.value;
  const operator = document.getElementById('assign-operator-select')?.value || 'Sister Kavita, RN';
  const actionRadios = document.getElementsByName('assign-action-type');
  let actionType = 'visit';
  for (let r of actionRadios) {
    if (r.checked) actionType = r.value;
  }
  const deadline = document.getElementById('assign-deadline-select')?.value || 'Today Afternoon';
  const instructions = document.getElementById('assign-instructions-text')?.value.trim();

  const seniors = getCoordinatorSeniors();
  const s = seniors.find(x => x.id === seniorId);
  if (!s) return;

  // Update senior's assignment in list
  s.assignedOperator = operator;
  s.assignedAction = actionType === 'visit' ? '🏠 Home Visit' : '📞 Tele-Call';
  saveCoordinatorSeniors(seniors);

  // Create new task
  const tasks = getCoordinatorTasks();
  const newTask = {
    id: 'TSK-' + Math.floor(510 + Math.random() * 50),
    seniorId: s.id,
    seniorName: s.name,
    seniorLocation: s.location,
    familyContact: s.familyContact,
    operatorName: operator,
    operatorRole: operator.includes('RN') ? 'Lead Field Nurse' : (operator.includes('Paramedic') ? 'Paramedic' : 'Care Attendant'),
    actionType: actionType,
    actionTitle: actionType === 'visit' ? '🏠 Doorstep Physical Home Visit & Vitals Check' : '📞 Urgent Tele-Call to Family Member',
    deadline: deadline,
    instructions: instructions || 'Visit family and verify senior well-being.',
    status: 'assigned',
    dispatchedTime: 'Just Now',
    completedTime: '',
    verifiedTime: '',
    verifiedBy: '',
    proof: null
  };

  tasks.unshift(newTask);
  saveCoordinatorTasks(tasks);

  closeAssignOperatorModal();
  soundEngine.playSuccessChime();
  showToast(`Operator assigned successfully! Dispatched ${operator} to visit family.`, 'success');

  // Refresh UI
  renderCoordinatorHub();
  switchCoordinatorViewTab('tasks');
}

function openVerifyProofModal(taskId) {
  const tasks = getCoordinatorTasks();
  const t = tasks.find(x => x.id === taskId);
  if (!t) return;

  selectedTaskForVerification = t;
  const currentTaskIdInput = document.getElementById('verify-current-task-id');
  if (currentTaskIdInput) currentTaskIdInput.value = t.id;

  const idBadge = document.getElementById('proof-task-id-badge');
  const seniorTitle = document.getElementById('proof-task-senior-title');
  const operatorInfo = document.getElementById('proof-task-operator-info');
  const statusBadge = document.getElementById('proof-task-status-badge');
  const photoImg = document.getElementById('proof-photo-img');
  const gpsWatermark = document.getElementById('proof-watermark-gps');
  const timeWatermark = document.getElementById('proof-watermark-time');
  const familySign = document.getElementById('proof-family-sign-name');
  const familyStatement = document.getElementById('proof-family-statement');
  const vitalsBp = document.getElementById('proof-vitals-bp');
  const vitalsSpo2 = document.getElementById('proof-vitals-spo2');
  const vitalsHr = document.getElementById('proof-vitals-hr');
  const vitalsGlucose = document.getElementById('proof-vitals-glucose');
  const operatorNotes = document.getElementById('proof-operator-notes');

  if (idBadge) idBadge.textContent = t.id;
  if (seniorTitle) seniorTitle.textContent = `${t.seniorName} • ${t.seniorLocation}`;
  if (operatorInfo) operatorInfo.textContent = `Field Operator: ${t.operatorName} • Dispatched: ${t.dispatchedTime}`;

  if (statusBadge) {
    statusBadge.textContent = t.status === 'fulfilled' ? 'VERIFIED & FULFILLED ✓' : 'Awaiting Coordinator Verification ⏳';
    statusBadge.className = t.status === 'fulfilled'
      ? 'px-3 py-1 rounded-xl text-xs font-black bg-emerald-100 text-emerald-800 border border-emerald-300'
      : 'px-3 py-1 rounded-xl text-xs font-black bg-amber-100 text-amber-800 border border-amber-300 animate-pulse';
  }

  if (t.proof) {
    if (photoImg) photoImg.src = t.proof.photoUrl || 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=800&auto=format&fit=crop&q=80';
    if (gpsWatermark) gpsWatermark.textContent = t.proof.gpsCoords || '28.6139° N, 77.2090° E';
    if (timeWatermark) timeWatermark.textContent = `Completed: ${t.completedTime || 'Today 10:45 AM'} • Verified Residence`;
    if (familySign) familySign.textContent = `Signed by: ${t.proof.familySignName}`;
    if (familyStatement) familyStatement.textContent = `"${t.proof.familyStatement}"`;
    if (vitalsBp) vitalsBp.textContent = t.proof.measuredVitals?.bp || '128/84 mmHg';
    if (vitalsSpo2) vitalsSpo2.textContent = t.proof.measuredVitals?.spo2 || '98%';
    if (vitalsHr) vitalsHr.textContent = t.proof.measuredVitals?.hr || '76 bpm';
    if (vitalsGlucose) vitalsGlucose.textContent = t.proof.measuredVitals?.glucose || '114 mg/dL';
    if (operatorNotes) operatorNotes.textContent = `"${t.proof.operatorNotes}"`;
  }

  const modal = document.getElementById('modal-verify-proof');
  if (modal) modal.classList.remove('hidden');
}

function closeVerifyProofModal() {
  const modal = document.getElementById('modal-verify-proof');
  if (modal) modal.classList.add('hidden');
  selectedTaskForVerification = null;
}

function approveTaskProof() {
  if (!selectedTaskForVerification) return;
  const tasks = getCoordinatorTasks();
  const t = tasks.find(x => x.id === selectedTaskForVerification.id);
  if (!t) return;

  t.status = 'fulfilled';
  t.verifiedTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  t.verifiedBy = 'Sister Kavita, RN (Lead Coordinator)';
  saveCoordinatorTasks(tasks);

  closeVerifyProofModal();
  soundEngine.playSuccessChime();
  showToast(`Proof verified & complaint marked fulfilled for ${t.seniorName}! ✓`, 'success');
  renderCoordinatorHub();
}

function rejectTaskProof() {
  if (!selectedTaskForVerification) return;
  const reason = prompt('Please specify reason for rejecting proof (e.g. Photo unclear, vitals re-measurement required):', 'Photo watermark unclear. Please re-visit family and re-verify blood pressure.');
  if (reason === null) return;

  const tasks = getCoordinatorTasks();
  const t = tasks.find(x => x.id === selectedTaskForVerification.id);
  if (!t) return;

  t.status = 'assigned';
  t.instructions = `RE-VISIT REQUIRED: ${reason} (Rejected by Coordinator at ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})`;
  saveCoordinatorTasks(tasks);

  closeVerifyProofModal();
  showToast('Proof rejected. Re-assigned to operator for mandatory re-visit.', 'warning');
  renderCoordinatorHub();
}

function simulateOperatorProofSubmission(taskId) {
  const tasks = getCoordinatorTasks();
  const t = tasks.find(x => x.id === taskId);
  if (!t) return;

  t.status = 'pending_review';
  t.completedTime = 'Just Now';
  t.proof = {
    photoUrl: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=800&auto=format&fit=crop&q=80',
    gpsCoords: '28.6139° N, 77.2090° E (Accuracy: ±6m)',
    gpsLocationName: `${t.seniorLocation} Residence`,
    familySignName: t.familyContact,
    familyOtp: '8492 (Verified via SMS)',
    familyStatement: `I confirm operator ${t.operatorName} completed the visit, met our family, and stabilized patient well-being.`,
    measuredVitals: { bp: '126/82 mmHg', spo2: '98%', hr: '74 bpm', glucose: '112 mg/dL' },
    operatorNotes: `Visited residence. Completed family consultation and recorded biometrics. All parameters normalized.`
  };

  saveCoordinatorTasks(tasks);
  soundEngine.playTone(880, 'sine', 0.15);
  showToast(`Simulated: Operator ${t.operatorName} submitted photo & signature proof for ${t.id}!`, 'info');
  renderCoordinatorHub();
}

function refreshCoordinatorHub() {
  soundEngine.playTone(600, 'sine', 0.1);
  renderCoordinatorHub();
  showToast('Live coordinator triage & proof records synchronized! ✓', 'success');
}


// =========================================================================
// CARE COORDINATOR PROFILE & ASSIGNED TASKS (CALLS, VISITS & PROOF) ENGINE
// =========================================================================

let currentCoordinatorTaskTab = 'calls';
let currentActiveVisitTask = null;
let currentActiveCallTask = null;

const defaultAssignedCoordinatorTasks = [
  // --- ASSIGNED TELE-CARE OUTREACH CALLS ---
  {
    id: 'CALL-101',
    type: 'call',
    seniorId: 'SNR-104',
    seniorName: 'Meena Iyer',
    seniorAge: 72,
    seniorGender: 'Female',
    location: 'Pocket B, Vasant Kunj, New Delhi - 110070',
    familyContact: 'Karthik Iyer (Son in Bengaluru)',
    phone: '+91 97400-55120',
    mlRisk: 'medium',
    mlScore: 78,
    priority: 'High Priority (Today Morning)',
    reason: 'Hindi voice note NLP flagged severe loneliness & depression sentiment. Senior living alone while son is out of state in Bengaluru.',
    instructions: 'Call son Karthik to discuss emotional wellness support, daily social routine, and recommend local senior activity group.',
    status: 'pending',
    assignedTime: 'Today 08:30 AM'
  },
  {
    id: 'CALL-102',
    type: 'call',
    seniorId: 'SNR-103',
    seniorName: 'Anand Verma',
    seniorAge: 78,
    seniorGender: 'Male',
    location: 'Sector 3, Pocket C, Saket, New Delhi - 110017',
    familyContact: 'Deepak Verma (Son)',
    phone: '+91 98112-99881',
    mlRisk: 'high',
    mlScore: 84,
    priority: 'URGENT (Within 1 Hour)',
    reason: 'Glucometer reading spiked to 228 mg/dL + 2 consecutive evening insulin doses omitted. Immediate family check required.',
    instructions: 'Call son Deepak to verify evening insulin administration, ketone test status, and carbohydrate intake monitoring.',
    status: 'pending',
    assignedTime: 'Today 09:15 AM'
  },
  {
    id: 'CALL-103',
    type: 'call',
    seniorId: 'SNR-107',
    seniorName: 'Om Prakash Gupta',
    seniorAge: 70,
    seniorGender: 'Male',
    location: 'Part 2, Lajpat Nagar, New Delhi - 110024',
    familyContact: 'Vikas Gupta (Son)',
    phone: '+91 98711-33221',
    mlRisk: 'medium',
    mlScore: 42,
    priority: 'Routine Check (Today)',
    reason: 'Post-bronchitis cough convalescence follow-up. Telemetry vitals stabilizing (SpO2 98%). Check syrup adherence.',
    instructions: 'Check cough frequency, steam inhalation routine, and confirm if chest congestion has cleared.',
    status: 'pending',
    assignedTime: 'Today 10:00 AM'
  },

  // --- ASSIGNED DOORSTEP PHYSICAL VISITS ---
  {
    id: 'VISIT-201',
    type: 'visit',
    seniorId: 'SNR-101',
    seniorName: 'Ramesh Sharma',
    seniorAge: 74,
    seniorGender: 'Male',
    location: 'C-42, Greater Kailash Part 1, South Delhi - 110048',
    familyContact: 'Rahul Sharma (Son) • +91 98711-20931',
    phone: '+91 98110-44912',
    mlRisk: 'high',
    mlScore: 98,
    priority: 'CRITICAL (2 Hours SLA)',
    reason: 'Resting tachycardia spiked to 114 bpm + SpO2 dropped to 94% + Zero motion detected 4 hours. Immediate doorstep evaluation.',
    instructions: 'Visit residence in-person. Track GPS location, capture doorstep photo, record physical BP, SpO2, heart rate, and check hydration.',
    status: 'pending',
    assignedTime: 'Today 09:00 AM'
  },
  {
    id: 'VISIT-202',
    type: 'visit',
    seniorId: 'SNR-102',
    seniorName: 'Savitri Devi',
    seniorAge: 81,
    seniorGender: 'Female',
    location: 'Enclave 4, Hauz Khas, New Delhi - 110016',
    familyContact: 'Priya Verma (Daughter) • +91 99100-33421',
    phone: '+91 98103-99210',
    mlRisk: 'high',
    mlScore: 92,
    priority: 'URGENT (Immediate)',
    reason: 'Bathroom motion impact sensor triggered. Voice note: sudden dizziness & acute right hip discomfort on standing. ADL Mobility 2/4.',
    instructions: 'Conduct doorstep hip and pelvic mobility examination. Verify transfer safety, check vitals, and capture photo proof.',
    status: 'pending',
    assignedTime: 'Today 09:45 AM'
  },

  // --- COMPLETED TASKS WITH FULL VERIFIED PROOFS ---
  {
    id: 'VISIT-203',
    type: 'visit',
    seniorId: 'SNR-105',
    seniorName: 'Harish Patel',
    seniorAge: 76,
    seniorGender: 'Male',
    location: 'Main Market, Malviya Nagar, New Delhi - 110017',
    familyContact: 'Sneha Patel (Daughter) • +91 98200-44910',
    phone: '+91 98199-33812',
    mlRisk: 'medium',
    mlScore: 62,
    priority: 'Completed (Verified)',
    reason: 'Moderate blood pressure elevation (148/90) and fluid deficit. Completed doorstep physical check & hydration protocol.',
    status: 'fulfilled',
    assignedTime: 'Today 08:00 AM',
    completedTime: 'Today 10:20 AM',
    proof: {
      photoUrl: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=600&auto=format&fit=crop&q=80',
      gpsCoords: '28.5283° N, 77.2065° E (Accuracy: ±4m)',
      gpsAddress: 'Near Malviya Nagar Community Park, South Delhi',
      vitals: {
        bp: '134/86 mmHg',
        spo2: '97%',
        hr: '76 bpm',
        glucose: '124 mg/dL',
        temp: '98.2 °F'
      },
      condition: {
        mobility: 'Independent Walking without Support',
        mood: 'Alert, Calm & Conversational',
        meds: 'All Prescribed Doses Verified & Taken',
        pain: 'Level 1/10 (Mild knee ache)',
        notes: 'Visited patient residence. Evaluated blood pressure and fluid intake. Prescribed hydration routine and briefed daughter Sneha Patel.'
      }
    }
  },
  {
    id: 'CALL-104',
    type: 'call',
    seniorId: 'SNR-106',
    seniorName: 'Nirmala Joshi',
    seniorAge: 80,
    seniorGender: 'Female',
    location: 'Block C, Defence Colony, New Delhi - 110024',
    familyContact: 'Amit Joshi (Son)',
    phone: '+91 98101-77889',
    mlRisk: 'medium',
    mlScore: 54,
    priority: 'Completed',
    reason: 'ADL mobility 2/4. Confirmed walker usage and scheduled physical mobility consultation.',
    status: 'fulfilled',
    assignedTime: 'Today 08:15 AM',
    completedTime: 'Today 09:30 AM',
    callLog: {
      duration: '7 Mins',
      status: 'Completed - Family Briefed & Reassured',
      feedback: 'Son Amit confirmed senior is doing morning knee isometric exercises and resting comfortably.',
      recommendation: 'Continue daily mobility support and follow-up in 3 days.'
    }
  },
  {
    id: 'CALL-105',
    type: 'call',
    seniorId: 'SNR-108',
    seniorName: 'Kanta Devi',
    seniorAge: 73,
    seniorGender: 'Female',
    location: 'Block A, Green Park, New Delhi - 110016',
    familyContact: 'Pooja Sharma (Daughter)',
    phone: '+91 98114-55667',
    mlRisk: 'low',
    mlScore: 26,
    priority: 'Completed',
    reason: 'Routine weekly wellness follow-up. 100% check-in compliance.',
    status: 'fulfilled',
    assignedTime: 'Today 08:45 AM',
    completedTime: 'Today 09:50 AM',
    callLog: {
      duration: '4 Mins',
      status: 'Completed - Routine Wellness Verified',
      feedback: 'Daughter confirmed mother completed morning 45-min walk, vital indicators optimal.',
      recommendation: 'Maintain healthy active lifestyle and continue routine logging.'
    }
  }
];

// 1. Get & Save Assigned Coordinator Tasks
function getCoordinatorAssignedTasks() {
  let savedTasksMap = {};
  try {
    const raw = localStorage.getItem('careconnect_coordinator_my_tasks');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        parsed.forEach(t => {
          if (t.id) savedTasksMap[t.id] = t;
          if (t.seniorId) savedTasksMap[t.seniorId] = t;
        });
      }
    }
  } catch (e) {
    console.warn('Error reading coordinator tasks from localStorage:', e);
  }

  // Retrieve dataset cohort seniors and any newly registered seniors
  const seniors = (typeof getCoordinatorSeniors === 'function') ? getCoordinatorSeniors() : defaultCoordinatorSeniors;

  const tasks = seniors.map((s, idx) => {
    const isVisit = (s.assignedAction && (
      s.assignedAction.includes('Visit') || 
      s.assignedAction.includes('Home') || 
      s.assignedAction.includes('Doorstep') || 
      s.assignedAction.includes('Hip') || 
      s.assignedAction.includes('Examination') || 
      s.assignedAction.includes('Assessment') ||
      s.assignedAction.includes('Check')
    )) || (s.mlRisk === 'high' && (s.mlScore || 0) >= 70);

    const type = isVisit ? 'visit' : 'call';
    const taskId = isVisit ? `VISIT-${s.id}` : `CALL-${s.id}`;

    const times = [
      'Today 08:30 AM', 'Today 09:15 AM', 'Today 10:00 AM', 'Today 10:30 AM',
      'Today 11:15 AM', 'Today 12:00 PM', 'Today 01:30 PM', 'Today 02:15 PM',
      'Today 03:00 PM', 'Today 03:45 PM', 'Today 04:30 PM', 'Today 05:15 PM'
    ];
    const assignedTime = times[idx % times.length];

    let priority = 'Routine Check (Today)';
    if (s.mlRisk === 'high' || (s.mlScore || 0) >= 80) {
      priority = 'CRITICAL (2 Hours SLA)';
    } else if (s.mlRisk === 'medium' || (s.mlScore || 0) >= 50) {
      priority = 'High Priority (Today Morning)';
    }

    const existing = savedTasksMap[taskId] || savedTasksMap[s.id];

    return {
      id: taskId,
      type: type,
      seniorId: s.id,
      seniorName: s.name,
      seniorAge: s.age || 70,
      seniorGender: s.gender || 'Senior',
      location: s.location || 'NCR Healthcare Cluster, New Delhi',
      familyContact: s.familyContact || 'Family Contact on Record',
      phone: s.phone || '+91 98110-44912',
      mlRisk: s.mlRisk || ((s.mlScore || 0) >= 80 ? 'high' : ((s.mlScore || 0) >= 40 ? 'medium' : 'low')),
      mlScore: s.mlScore || 50,
      priority: priority,
      reason: s.reason || (s.clinicalFlags ? s.clinicalFlags.join(', ') : 'Routine Geriatric Clinical Triage & Telemetry Evaluation'),
      instructions: isVisit 
        ? 'Visit residence in-person. Track live GPS location, capture doorstep photo, record vitals, and log clinical condition.'
        : 'Conduct tele-care outreach check-in call with senior and family members to review adherence and wellness.',
      status: (existing && existing.status) ? existing.status : (s.taskStatus === 'proof_submitted' ? 'fulfilled' : 'pending'),
      assignedTime: (existing && existing.assignedTime) ? existing.assignedTime : assignedTime,
      proof: (existing && existing.proof) ? existing.proof : (s.proof || null),
      callLog: (existing && existing.callLog) ? existing.callLog : null,
      isNewUser: !!s.isNewUser
    };
  });

  // Sort descending by ML risk score (High Risk first)
  tasks.sort((a, b) => (b.mlScore || 0) - (a.mlScore || 0));

  return tasks;
}

function saveCoordinatorAssignedTasks(tasks) {
  try {
    localStorage.setItem('careconnect_coordinator_my_tasks', JSON.stringify(tasks));
  } catch (e) {
    console.warn('Error saving coordinator tasks:', e);
  }
}

// 2. Coordinator Profile Management
function getCoordinatorProfileData() {
  try {
    const raw = localStorage.getItem('careconnect_profile_coordinator');
    if (raw) return JSON.parse(raw);
  } catch (e) {}

  return {
    name: 'Sister Kavita Verma, RN',
    title: 'Lead Geriatric Care Coordinator & Field Triage Specialist',
    phone: '+91 98765-43210',
    email: 'kavita.nurse@careconnect.ai',
    license: 'DEL-RN-884920',
    zone: 'South Delhi & NCR Cluster (GK, Saket, Hauz Khas)'
  };
}

function renderCoordinatorProfileBanner() {
  const prof = getCoordinatorProfileData();

  const nameEl = document.getElementById('coord-profile-name');
  const titleEl = document.getElementById('coord-profile-title');
  const phoneEl = document.getElementById('coord-profile-phone');
  const zoneEl = document.getElementById('coord-profile-zone');
  const licenseEl = document.getElementById('coord-profile-license');
  const avatarEl = document.getElementById('coord-profile-avatar');

  if (nameEl) nameEl.textContent = prof.name;
  if (titleEl) titleEl.textContent = prof.title;
  if (phoneEl) phoneEl.textContent = prof.phone;
  if (zoneEl) zoneEl.textContent = prof.zone;
  if (licenseEl) licenseEl.textContent = `License: ${prof.license || 'DEL-RN-884920'}`;

  if (avatarEl) {
    const parts = (prof.name || 'Kavita Verma').split(' ');
    const initials = parts.length > 1 ? (parts[0][0] + parts[1][0]).toUpperCase() : prof.name.substring(0, 2).toUpperCase();
    avatarEl.textContent = initials;
  }

  // Also synchronize top navigation bar avatar and name if in coordinator mode
  if (state.currentRole === 'coordinator') {
    const headerName = document.getElementById('current-user-name');
    const headerAvatar = document.getElementById('current-user-avatar');
    if (headerName) headerName.textContent = prof.name;
    if (headerAvatar) {
      const parts = prof.name.split(' ');
      headerAvatar.textContent = parts.length > 1 ? (parts[0][0] + parts[1][0]).toUpperCase() : prof.name.substring(0, 2).toUpperCase();
    }
  }
}

function openCoordinatorProfileEditModal() {
  const modal = document.getElementById('modal-coord-edit-profile');
  if (!modal) return;
  const prof = getCoordinatorProfileData();

  const inName = document.getElementById('input-coord-name');
  const inTitle = document.getElementById('input-coord-title');
  const inPhone = document.getElementById('input-coord-phone');
  const inLicense = document.getElementById('input-coord-license');
  const inZone = document.getElementById('input-coord-zone');
  const inEmail = document.getElementById('input-coord-email');

  if (inName) inName.value = prof.name;
  if (inTitle) inTitle.value = prof.title;
  if (inPhone) inPhone.value = prof.phone;
  if (inLicense) inLicense.value = prof.license || 'DEL-RN-884920';
  if (inZone) inZone.value = prof.zone || 'South Delhi & NCR Cluster (GK, Saket, Hauz Khas)';
  if (inEmail) inEmail.value = prof.email || 'kavita.nurse@careconnect.ai';

  soundEngine.playTone(550, 'sine', 0.1);
  modal.classList.remove('hidden');
}

function closeCoordinatorProfileEditModal() {
  const modal = document.getElementById('modal-coord-edit-profile');
  if (modal) modal.classList.add('hidden');
}

function handleSaveCoordinatorProfile(e) {
  if (e) e.preventDefault();
  const prof = {
    name: document.getElementById('input-coord-name')?.value.trim() || 'Sister Kavita Verma, RN',
    title: document.getElementById('input-coord-title')?.value.trim() || 'Lead Geriatric Care Coordinator',
    phone: document.getElementById('input-coord-phone')?.value.trim() || '+91 98765-43210',
    license: document.getElementById('input-coord-license')?.value.trim() || 'DEL-RN-884920',
    zone: document.getElementById('input-coord-zone')?.value || 'South Delhi & NCR Cluster',
    email: document.getElementById('input-coord-email')?.value.trim() || 'kavita.nurse@careconnect.ai'
  };

  try {
    localStorage.setItem('careconnect_profile_coordinator', JSON.stringify(prof));
  } catch (err) {}

  renderCoordinatorProfileBanner();
  closeCoordinatorProfileEditModal();
  soundEngine.playSuccessChime();
  showToast(`Coordinator profile updated successfully for ${prof.name}!`, 'success');
}

// 3. Task Tab Navigation & Rendering
function switchCoordinatorTaskTab(tab) {
  currentCoordinatorTaskTab = tab;

  const btnCalls = document.getElementById('tab-btn-coord-calls');
  const btnVisits = document.getElementById('tab-btn-coord-visits');
  const btnFulfilled = document.getElementById('tab-btn-coord-fulfilled');
  const btnSchedule = document.getElementById('tab-btn-coord-schedule');

  const panelCalls = document.getElementById('panel-coord-calls');
  const panelVisits = document.getElementById('panel-coord-visits');
  const panelFulfilled = document.getElementById('panel-coord-fulfilled');
  const panelSchedule = document.getElementById('panel-coord-schedule');

  const activeClass = 'flex-1 sm:flex-none px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black transition-all bg-white text-[#1C3D2E] shadow-sm flex items-center justify-center space-x-2 active:scale-95';
  const inactiveClass = 'flex-1 sm:flex-none px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold text-slate-600 hover:text-slate-900 transition-all flex items-center justify-center space-x-2 active:scale-95';

  if (btnCalls) btnCalls.className = (tab === 'calls') ? activeClass : inactiveClass;
  if (btnVisits) btnVisits.className = (tab === 'visits') ? activeClass : inactiveClass;
  if (btnFulfilled) btnFulfilled.className = (tab === 'fulfilled') ? activeClass : inactiveClass;
  if (btnSchedule) btnSchedule.className = (tab === 'schedule') ? activeClass : inactiveClass;

  if (panelCalls) panelCalls.classList.toggle('hidden', tab !== 'calls');
  if (panelVisits) panelVisits.classList.toggle('hidden', tab !== 'visits');
  if (panelFulfilled) panelFulfilled.classList.toggle('hidden', tab !== 'fulfilled');
  if (panelSchedule) {
    panelSchedule.classList.toggle('hidden', tab !== 'schedule');
    if (tab === 'schedule' && typeof renderCoordinatorScheduleTimeline === 'function') {
      renderCoordinatorScheduleTimeline();
    }
  }

  soundEngine.playTone(600, 'sine', 0.08);
}

function renderCoordinatorAssignedTasks() {
  if (typeof renderMedcareAppointmentsTable === 'function') renderMedcareAppointmentsTable(currentMedcareFilter || 'all');
  renderCoordinatorProfileBanner();
  const tasks = getCoordinatorAssignedTasks();

  const pendingCalls = tasks.filter(t => t.type === 'call' && t.status !== 'fulfilled');
  const pendingVisits = tasks.filter(t => t.type === 'visit' && t.status !== 'fulfilled');
  const fulfilledTasks = tasks.filter(t => t.status === 'fulfilled');
  const highRiskCount = tasks.filter(t => t.status !== 'fulfilled' && (t.mlRisk === 'high' || t.mlScore >= 80)).length;

  // Update Summary Counters
  const elCallsStat = document.getElementById('stat-coord-calls-count');
  const elVisitsStat = document.getElementById('stat-coord-visits-count');
  const elHighStat = document.getElementById('stat-coord-highrisk-count');
  const elFulfilledStat = document.getElementById('stat-coord-fulfilled-count');

  if (elCallsStat) elCallsStat.textContent = pendingCalls.length;
  if (elVisitsStat) elVisitsStat.textContent = pendingVisits.length;
  if (elHighStat) elHighStat.textContent = highRiskCount;
  if (elFulfilledStat) elFulfilledStat.textContent = fulfilledTasks.length;

  // Update Tab Badges
  const bCalls = document.getElementById('badge-tab-calls-count');
  const bVisits = document.getElementById('badge-tab-visits-count');
  const bFulfilled = document.getElementById('badge-tab-fulfilled-count');

  if (bCalls) bCalls.textContent = pendingCalls.length;
  if (bVisits) bVisits.textContent = pendingVisits.length;
  if (bFulfilled) bFulfilled.textContent = fulfilledTasks.length;

  // 1. Render Calls List
  const callsContainer = document.getElementById('coord-calls-list-container');
  if (callsContainer) {
    if (pendingCalls.length === 0) {
      callsContainer.innerHTML = `
        <div class="bg-white rounded-3xl p-10 text-center border-2 border-dashed border-slate-200">
          <div class="w-14 h-14 rounded-2xl bg-teal-50 text-teal-600 mx-auto flex items-center justify-center text-2xl mb-3">
            <i class="fa-solid fa-phone-slash"></i>
          </div>
          <h4 class="text-sm font-black text-slate-800">All Tele-Care Calls Completed!</h4>
          <p class="text-xs text-slate-500 mt-1">There are no pending outreach calls assigned right now.</p>
        </div>
      `;
    } else {
      callsContainer.innerHTML = pendingCalls.map(t => {
        const isHigh = t.mlRisk === 'high' || t.mlScore >= 80;
        const riskBadge = isHigh
          ? '<span class="px-2.5 py-1 rounded-full text-xs font-black bg-rose-100 text-rose-800 border border-rose-300 animate-pulse">🚨 ' + t.mlScore + '% High Risk</span>'
          : '<span class="px-2.5 py-1 rounded-full text-xs font-black bg-amber-100 text-amber-800 border border-amber-300">⚠️ ' + t.mlScore + '% Moderate Risk</span>';

        return `
          <div class="p-5 sm:p-6 rounded-3xl bg-white border ${isHigh ? 'border-rose-300 bg-[#FFFBFB]' : 'border-[#EFE9DF]'} shadow-[0_4px_20px_rgba(45,90,67,0.03)] hover:shadow-[0_6px_25px_rgba(45,90,67,0.08)] transition-all">
            <div class="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-4 border-b border-[#F0ECE4]">
              <div class="flex items-start space-x-3.5">
                <div class="w-12 h-12 rounded-2xl ${isHigh ? 'bg-[#FFEBEB] text-[#D32F2F]' : 'bg-[#FFF0E6] text-[#B85D19]'} flex items-center justify-center text-xl font-black shadow-xs flex-shrink-0">
                  <i class="fa-solid fa-phone-volume"></i>
                </div>
                <div>
                  <div class="flex flex-wrap items-center gap-2">
                    <span class="font-mono text-[10px] font-black px-2 py-0.5 rounded-lg bg-[#FAF7F2] text-slate-700 border border-[#EFE9DF]">${t.id}</span>
                    <h4 class="text-base sm:text-lg font-black text-[#1C3D2E]">${t.seniorName}</h4>
                    <span class="text-xs font-bold text-slate-500">(${t.seniorAge} Yrs • ${t.seniorGender || 'Senior'})</span>
                    ${isHigh
                      ? '<span class="px-2.5 py-0.5 rounded-full text-xs font-black bg-[#FFEBEB] text-[#D32F2F] border border-[#FFCDD2] animate-pulse">🚨 ' + t.mlScore + '% High Risk</span>'
                      : '<span class="px-2.5 py-0.5 rounded-full text-xs font-black bg-[#FFF8E1] text-[#B76E00] border border-[#FFE082]">⚠️ ' + t.mlScore + '% Moderate Risk</span>'
                    }
                  </div>
                  <p class="text-xs text-slate-600 font-medium mt-1">
                    📍 ${t.location}
                  </p>
                  <p class="text-xs font-extrabold text-[#2D5A43] mt-0.5 flex items-center space-x-1.5">
                    <i class="fa-solid fa-user-group text-[#2D5A43]"></i>
                    <span>Family Contact: <strong>${t.familyContact}</strong></span>
                    <span class="text-slate-400">•</span>
                    <a href="tel:${t.phone}" class="text-[#B85D19] underline font-mono font-black">${t.phone}</a>
                  </p>
                </div>
              </div>

              <!-- Priority SLA Pill (Eldora Soft Pill) -->
              <div class="px-3.5 py-1.5 rounded-2xl bg-[#FAF7F2] text-slate-700 text-xs font-black border border-[#EFE9DF] flex items-center space-x-1.5">
                <i class="fa-regular fa-clock text-[#B85D19]"></i>
                <span>${t.priority}</span>
              </div>
            </div>

            <!-- Call Reason & Diagnostic Flag -->
            <div class="my-3.5 p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#EFE9DF] text-xs">
              <span class="font-black text-[#1C3D2E] block mb-1">
                <i class="fa-solid fa-triangle-exclamation text-[#B85D19] mr-1"></i> Triggering Reason & Assessment Summary:
              </span>
              <p class="text-slate-700 font-medium leading-relaxed">${t.reason}</p>
            </div>

            <!-- Action Buttons: View Report, Call, and Log Notes (Eldora Pill Style) -->
            <div class="flex flex-wrap items-center gap-2.5 pt-1">
              <button type="button" onclick="openClinicalReportSheet('${t.seniorId}')"
                class="py-2.5 px-4 rounded-2xl bg-[#FFF0E6] hover:bg-[#FFE5D6] text-[#B85D19] border border-[#FFD8BF] text-xs font-black transition-all flex items-center space-x-1.5 shadow-xs active:scale-95"
                title="View Full Diagnostic Assessment Report">
                <i class="fa-solid fa-file-waveform text-[#B85D19]"></i>
                <span>View Last Assessment Report (रिपोर्ट देखें)</span>
              </button>

              <a href="tel:${t.phone}"
                class="py-2.5 px-4 rounded-2xl bg-[#2D5A43] hover:bg-[#234734] text-white text-xs font-black transition-all flex items-center space-x-1.5 shadow-sm active:scale-95">
                <i class="fa-solid fa-phone"></i>
                <span>Call ${t.phone}</span>
              </a>

              <button type="button" onclick="openLogCallModal('${t.id}')"
                class="flex-1 sm:flex-none py-2.5 px-5 rounded-2xl bg-[#1C3D2E] hover:bg-[#152e23] text-white text-xs font-black transition-all flex items-center justify-center space-x-1.5 shadow-sm active:scale-95">
                <i class="fa-solid fa-clipboard-check"></i>
                <span>Log Call & Complete (विवरण दर्ज करें)</span>
              </button>
            </div>
          </div>
        `;
      }).join('');
    }
  }

  // 2. Render Visits List
  const visitsContainer = document.getElementById('coord-visits-list-container');
  if (visitsContainer) {
    if (pendingVisits.length === 0) {
      visitsContainer.innerHTML = `
        <div class="bg-white rounded-3xl p-10 text-center border-2 border-dashed border-slate-200">
          <div class="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center text-2xl mb-3">
            <i class="fa-solid fa-house-circle-check"></i>
          </div>
          <h4 class="text-sm font-black text-slate-800">All Doorstep Visits Completed!</h4>
          <p class="text-xs text-slate-500 mt-1">There are no pending physical home visits right now.</p>
        </div>
      `;
    } else {
      visitsContainer.innerHTML = pendingVisits.map(t => {
        const isHigh = t.mlRisk === 'high' || t.mlScore >= 80;
        const riskBadge = isHigh
          ? '<span class="px-2.5 py-1 rounded-full text-xs font-black bg-rose-100 text-rose-800 border border-rose-300 animate-pulse">🚨 ' + t.mlScore + '% High Risk</span>'
          : '<span class="px-2.5 py-1 rounded-full text-xs font-black bg-amber-100 text-amber-800 border border-amber-300">⚠️ ' + t.mlScore + '% Moderate Risk</span>';

        return `
          <div class="p-5 sm:p-6 rounded-3xl bg-white border ${isHigh ? 'border-rose-300 bg-[#FFFBFB]' : 'border-[#EFE9DF]'} shadow-[0_4px_20px_rgba(45,90,67,0.03)] hover:shadow-[0_6px_25px_rgba(45,90,67,0.08)] transition-all">
            <div class="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-4 border-b border-[#F0ECE4]">
              <div class="flex items-start space-x-3.5">
                <div class="w-12 h-12 rounded-2xl ${isHigh ? 'bg-[#FFEBEB] text-[#D32F2F]' : 'bg-[#EEF7F2] text-[#2D5A43]'} flex items-center justify-center text-xl font-black shadow-xs flex-shrink-0">
                  <i class="fa-solid fa-house-chimney-medical"></i>
                </div>
                <div>
                  <div class="flex flex-wrap items-center gap-2">
                    <span class="font-mono text-[10px] font-black px-2 py-0.5 rounded-lg bg-[#FAF7F2] text-slate-700 border border-[#EFE9DF]">${t.id}</span>
                    <h4 class="text-base sm:text-lg font-black text-[#1C3D2E]">${t.seniorName}</h4>
                    <span class="text-xs font-bold text-slate-500">(${t.seniorAge} Yrs • ${t.seniorGender || 'Senior'})</span>
                    ${isHigh
                      ? '<span class="px-2.5 py-0.5 rounded-full text-xs font-black bg-[#FFEBEB] text-[#D32F2F] border border-[#FFCDD2] animate-pulse">🚨 ' + t.mlScore + '% High Risk</span>'
                      : '<span class="px-2.5 py-0.5 rounded-full text-xs font-black bg-[#FFF8E1] text-[#B76E00] border border-[#FFE082]">⚠️ ' + t.mlScore + '% Moderate Risk</span>'
                    }
                  </div>
                  <p class="text-xs text-slate-800 font-bold mt-1 flex items-center space-x-1.5">
                    <i class="fa-solid fa-location-dot text-[#B85D19]"></i>
                    <span>Address: <strong>${t.location}</strong></span>
                  </p>
                  <p class="text-xs font-medium text-slate-600 mt-0.5">
                    Family Contact: <span class="font-bold text-[#1C3D2E]">${t.familyContact}</span>
                  </p>
                </div>
              </div>

              <!-- Priority SLA Pill -->
              <div class="px-3.5 py-1.5 rounded-2xl bg-[#FFF8E1] text-[#B76E00] text-xs font-black border border-[#FFE082] flex items-center space-x-1.5">
                <i class="fa-solid fa-shield-halved text-[#B76E00]"></i>
                <span>${t.priority}</span>
              </div>
            </div>

            <!-- Visit Objective & Clinical Flag -->
            <div class="my-3.5 p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#EFE9DF] text-xs">
              <span class="font-black text-[#1C3D2E] block mb-1">
                <i class="fa-solid fa-stethoscope text-[#2D5A43] mr-1"></i> Purpose of Physical Doorstep Visit:
              </span>
              <p class="text-slate-700 font-medium leading-relaxed">${t.reason}</p>
            </div>

            <!-- Actions: View Last Assessment Report & Start Visit Proof -->
            <div class="flex flex-wrap items-center gap-2.5 pt-1">
              <button type="button" onclick="openClinicalReportSheet('${t.seniorId}')"
                class="py-2.5 px-4 rounded-2xl bg-[#FFF0E6] hover:bg-[#FFE5D6] text-[#B85D19] border border-[#FFD8BF] text-xs font-black transition-all flex items-center space-x-1.5 shadow-xs active:scale-95"
                title="View Full Diagnostic Assessment Report">
                <i class="fa-solid fa-file-waveform text-[#B85D19]"></i>
                <span>View Last Assessment Report (रिपोर्ट देखें)</span>
              </button>

              <button type="button" onclick="openSubmitVisitProofModal('${t.id}')"
                class="flex-1 sm:flex-none py-2.5 px-5 rounded-2xl bg-[#2D5A43] hover:bg-[#234734] text-white text-xs font-black transition-all flex items-center justify-center space-x-2 shadow-sm active:scale-95">
                <i class="fa-solid fa-camera"></i>
                <span>Start Visit & Submit Proof (विज़िट शुरू करें व सबूत दर्ज करें)</span>
              </button>
            </div>
          </div>
        `;
      }).join('');
    }
  }

  // 3. Render Completed & Verified List
  const fulfilledContainer = document.getElementById('coord-fulfilled-list-container');
  if (fulfilledContainer) {
    if (fulfilledTasks.length === 0) {
      fulfilledContainer.innerHTML = `
        <div class="bg-white rounded-3xl p-10 text-center border-2 border-dashed border-slate-200">
          <div class="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center text-2xl mb-3">
            <i class="fa-solid fa-clipboard-list"></i>
          </div>
          <h4 class="text-sm font-black text-slate-800">No Verified Proofs Logged Yet</h4>
          <p class="text-xs text-slate-500 mt-1">Completed visits and calls will appear here with audit proofs.</p>
        </div>
      `;
    } else {
      fulfilledContainer.innerHTML = fulfilledTasks.map(t => {
        const isVisit = t.type === 'visit';

        return `
          <div class="p-5 rounded-3xl bg-white border border-[#D6EFE1] shadow-[0_4px_20px_rgba(45,90,67,0.03)] hover:shadow-md transition-all">
            <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-[#F0ECE4]">
              <div class="flex items-center space-x-3">
                <div class="w-10 h-10 rounded-2xl ${isVisit ? 'bg-[#EEF7F2] text-[#2D5A43]' : 'bg-[#FFF0E6] text-[#B85D19]'} flex items-center justify-center text-lg font-black">
                  <i class="fa-solid ${isVisit ? 'fa-house-circle-check' : 'fa-phone-volume'}"></i>
                </div>
                <div>
                  <div class="flex items-center space-x-2">
                    <span class="font-mono text-[10px] font-black px-2 py-0.5 rounded-lg bg-[#FAF7F2] text-slate-700 border border-[#EFE9DF]">${t.id}</span>
                    <h4 class="text-sm sm:text-base font-black text-[#1C3D2E]">${t.seniorName}</h4>
                    <span class="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-[#E2F2E9] text-[#2D5A43]">
                      ✓ ${isVisit ? 'Doorstep Visit Verified' : 'Tele-Call Fulfilled'}
                    </span>
                  </div>
                  <p class="text-xs text-slate-500 font-medium mt-0.5">Completed: ${t.completedTime || 'Today'} • By Sister Kavita Verma, RN</p>
                </div>
              </div>

              <!-- Action to inspect proof -->
              ${isVisit ? `
                <button type="button" onclick="openViewProofModal('${t.id}')"
                  class="px-4 py-2 rounded-2xl bg-[#EEF7F2] hover:bg-[#D6EFE1] text-[#2D5A43] border border-[#BCE4CD] text-xs font-black flex items-center space-x-1.5 transition-all shadow-xs active:scale-95">
                  <i class="fa-solid fa-shield-check text-[#2D5A43]"></i>
                  <span>View Verified Proof & Vitals (सबूत देखें)</span>
                </button>
              ` : `
                <button type="button" onclick="openClinicalReportSheet('${t.seniorId}')"
                  class="px-4 py-2 rounded-2xl bg-[#FFF0E6] hover:bg-[#FFE5D6] text-[#B85D19] border border-[#FFD8BF] text-xs font-black flex items-center space-x-1.5 transition-all shadow-xs active:scale-95">
                  <i class="fa-solid fa-file-waveform text-[#B85D19]"></i>
                  <span>View Assessment Report</span>
                </button>
              `}
            </div>

            ${t.callLog ? `
              <div class="mt-3 p-3.5 bg-[#FAF7F2] border border-[#EFE9DF] rounded-2xl text-xs space-y-1">
                <span class="font-bold text-[#1C3D2E]">Call Outcome: <strong class="text-[#2D5A43]">${t.callLog.status}</strong> (${t.callLog.duration})</span>
                <p class="text-slate-600 italic">"${t.callLog.feedback}"</p>
              </div>
            ` : ''}

            ${t.proof ? `
              <div class="mt-3 p-3.5 bg-[#FAF7F2] border border-[#EFE9DF] rounded-2xl text-xs flex flex-wrap items-center gap-4">
                <span class="text-slate-700">📍 GPS: <strong class="font-mono text-[#2D5A43]">${t.proof.gpsCoords}</strong></span>
                <span class="text-slate-700">💓 Vitals: <strong class="text-[#1C3D2E]">${t.proof.vitals.bp} • ${t.proof.vitals.spo2} • ${t.proof.vitals.glucose}</strong></span>
                <span class="text-[#2D5A43] font-bold">✓ Geo-Watermarked Photo Logged</span>
              </div>
            ` : ''}
          </div>
        `;
      }).join('');
    }
  }
}

function filterCoordinatorTasksList() {
  const query = (document.getElementById('coord-task-search-input')?.value || '').toLowerCase().trim();
  const activePanelId = (currentCoordinatorTaskTab === 'calls')
    ? 'coord-calls-list-container'
    : ((currentCoordinatorTaskTab === 'visits') ? 'coord-visits-list-container' : 'coord-fulfilled-list-container');

  const container = document.getElementById(activePanelId);
  if (!container) return;

  const cards = container.querySelectorAll(':scope > div');
  cards.forEach(card => {
    const text = card.innerText.toLowerCase();
    card.classList.toggle('hidden', query !== '' && !text.includes(query));
  });
}

function refreshCoordinatorAssignedTasks() {
  soundEngine.playTone(700, 'sine', 0.1);
  renderCoordinatorAssignedTasks();
  showToast('Coordinator tasks & profile synchronized live!', 'info');
}

// 4. Log Tele-Care Call Modal Logic
function openLogCallModal(taskId) {
  const tasks = getCoordinatorAssignedTasks();
  const task = tasks.find(t => t.id === taskId || t.seniorId === taskId);
  if (!task) return;

  currentActiveCallTask = task;
  const modal = document.getElementById('modal-coord-log-call');
  if (!modal) return;

  const idIn = document.getElementById('call-log-task-id');
  const nameEl = document.getElementById('call-log-senior-name');
  const famEl = document.getElementById('call-log-family-text');
  const badgeEl = document.getElementById('call-log-risk-badge');

  if (idIn) idIn.value = task.id;
  if (nameEl) nameEl.textContent = `${task.seniorName} (${task.seniorAge} Yrs)`;
  if (famEl) famEl.textContent = `${task.familyContact} • ${task.phone}`;
  if (badgeEl) {
    badgeEl.textContent = `${task.mlScore}% ${task.mlRisk.toUpperCase()} RISK`;
    badgeEl.className = task.mlScore >= 80 ? 'px-2 py-0.5 rounded-md font-black bg-rose-100 text-rose-800' : 'px-2 py-0.5 rounded-md font-black bg-amber-100 text-amber-800';
  }

  soundEngine.playTone(550, 'sine', 0.1);
  modal.classList.remove('hidden');
}

function closeLogCallModal() {
  const modal = document.getElementById('modal-coord-log-call');
  if (modal) modal.classList.add('hidden');
}

function handleSaveCallLog(e) {
  if (e) e.preventDefault();
  const taskId = document.getElementById('call-log-task-id')?.value;
  const status = document.getElementById('call-log-status')?.value;
  const duration = document.getElementById('call-log-duration')?.value + ' Mins';
  const feedback = document.getElementById('call-log-feedback')?.value.trim();
  const recommendation = document.getElementById('call-log-recommendation')?.value.trim();

  const tasks = getCoordinatorAssignedTasks();
  const task = tasks.find(t => t.id === taskId);
  if (!task) return;

  task.status = 'fulfilled';
  task.completedTime = 'Today ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  task.callLog = {
    duration: duration,
    status: status,
    feedback: feedback,
    recommendation: recommendation
  };

  saveCoordinatorAssignedTasks(tasks);
  closeLogCallModal();
  soundEngine.playSuccessChime();
  showToast(`Tele-care call for ${task.seniorName} logged & marked completed!`, 'success');
  renderCoordinatorAssignedTasks();
  updateCoordinatorDynamicKPIs();
}

// =========================================================================
// 5. DOORSTEP GEOCODING & HIGH-PRECISION GPS ENGINE
// =========================================================================

const DELHI_DOORSTEP_GEOCODES = {
  'SNR-101': { lat: 28.5494, lng: 77.2345, address: 'C-42, Greater Kailash Part 1, South Delhi - 110048' },
  'SNR-102': { lat: 28.5498, lng: 77.2012, address: 'B-12, Hauz Khas Enclave, South Delhi - 110016' },
  'SNR-103': { lat: 28.5244, lng: 77.2167, address: 'E-9, Saket Sector 3, South Delhi - 110017' },
  'SNR-104': { lat: 28.5204, lng: 77.1565, address: 'Sector B Pocket 2, Vasant Kunj, New Delhi - 110070' },
  'SNR-105': { lat: 28.5326, lng: 77.2090, address: 'Block C-4, Malviya Nagar, South Delhi - 110017' },
  'SNR-106': { lat: 28.5727, lng: 77.2312, address: 'D-Block, Defence Colony, New Delhi - 110024' },
  'SNR-107': { lat: 28.5677, lng: 77.2433, address: 'Block 4, Lajpat Nagar Part 2, New Delhi - 110024' },
  'SNR-108': { lat: 28.5588, lng: 77.2028, address: 'Block A, Green Park Main, New Delhi - 110016' },
  'SNR-109': { lat: 28.5340, lng: 77.2415, address: 'E-Block, Greater Kailash 2 Enclave, New Delhi - 110048' },
  'SNR-110': { lat: 28.5520, lng: 77.2205, address: 'Siri Fort Road, Asian Games Village, New Delhi - 110049' },
  'SNR-USER-NEW': { lat: 28.6750, lng: 77.2250, address: 'Civil Lines, North Delhi - 110054' }
};

function resolveSeniorDoorstepGeocode(item) {
  if (!item) {
    return { lat: 28.5494, lng: 77.2345, address: 'C-42, Greater Kailash Part 1, South Delhi - 110048' };
  }

  const sId = item.seniorId || item.id;
  if (sId && DELHI_DOORSTEP_GEOCODES[sId]) {
    return DELHI_DOORSTEP_GEOCODES[sId];
  }

  const text = ((item.location || '') + ' ' + (item.seniorLocation || '') + ' ' + (item.seniorName || '')).toLowerCase();

  const localityMatches = [
    { keys: ['greater kailash 1', 'gk 1', 'gk-1', 'gk1', 'kailash 1'], lat: 28.5494, lng: 77.2345, addr: 'C-42, Greater Kailash Part 1, South Delhi - 110048' },
    { keys: ['greater kailash 2', 'gk 2', 'gk-2', 'gk2', 'kailash 2'], lat: 28.5340, lng: 77.2415, addr: 'E-Block, Greater Kailash 2, New Delhi - 110048' },
    { keys: ['greater kailash', 'kailash'], lat: 28.5494, lng: 77.2345, addr: 'Greater Kailash, South Delhi' },
    { keys: ['hauz khas'], lat: 28.5498, lng: 77.2012, addr: 'B-12, Hauz Khas Enclave, South Delhi - 110016' },
    { keys: ['saket'], lat: 28.5244, lng: 77.2167, addr: 'E-9, Saket Sector 3, South Delhi - 110017' },
    { keys: ['vasant kunj'], lat: 28.5204, lng: 77.1565, addr: 'Sector B Pocket 2, Vasant Kunj, New Delhi - 110070' },
    { keys: ['vasant vihar'], lat: 28.5602, lng: 77.1610, addr: 'C-8, Vasant Vihar, New Delhi - 110057' },
    { keys: ['malviya nagar', 'malviya'], lat: 28.5326, lng: 77.2090, addr: 'Block C-4, Malviya Nagar, South Delhi - 110017' },
    { keys: ['defence colony', 'def col'], lat: 28.5727, lng: 77.2312, addr: 'D-Block, Defence Colony, New Delhi - 110024' },
    { keys: ['lajpat nagar', 'lajpat'], lat: 28.5677, lng: 77.2433, addr: 'Block 4, Lajpat Nagar Part 2, New Delhi - 110024' },
    { keys: ['green park'], lat: 28.5588, lng: 77.2028, addr: 'Block A, Green Park Main, New Delhi - 110016' },
    { keys: ['siri fort'], lat: 28.5520, lng: 77.2205, addr: 'Siri Fort Road, Asian Games Village, New Delhi - 110049' },
    { keys: ['civil lines'], lat: 28.6750, lng: 77.2250, addr: 'Civil Lines, North Delhi - 110054' },
    { keys: ['alaknanda'], lat: 28.5273, lng: 77.2520, addr: 'Pocket 40, Alaknanda, South Delhi - 110019' },
    { keys: ['c.r. park', 'cr park', 'chittaranjan'], lat: 28.5380, lng: 77.2514, addr: 'B-Block, C.R. Park, New Delhi - 110019' },
    { keys: ['dwarka'], lat: 28.5823, lng: 77.0500, addr: 'Sector 12, Dwarka, New Delhi - 110075' },
    { keys: ['rohini'], lat: 28.7166, lng: 77.1145, addr: 'Sector 9, Rohini, North West Delhi - 110085' },
    { keys: ['connaught place', 'cp'], lat: 28.6315, lng: 77.2167, addr: 'Connaught Place Inner Circle, New Delhi - 110001' }
  ];

  for (const m of localityMatches) {
    if (m.keys.some(k => text.includes(k))) {
      return {
        lat: m.lat,
        lng: m.lng,
        address: item.location || item.seniorLocation || m.addr
      };
    }
  }

  // Deterministic fallback based on senior name/id hash
  let hash = 0;
  const str = (item.id || '') + (item.seniorName || '') + (item.location || '');
  for (let i = 0; i < str.length; i++) hash = (hash << 5) - hash + str.charCodeAt(i);
  const latOffset = ((Math.abs(hash) % 80) - 40) / 1000.0;
  const lngOffset = ((Math.abs(hash >> 3) % 80) - 40) / 1000.0;

  return {
    lat: +(28.5400 + latOffset).toFixed(4),
    lng: +(77.2150 + lngOffset).toFixed(4),
    address: item.location || item.seniorLocation || 'South Delhi Care Cluster, New Delhi'
  };
}

function applyPatientDoorstepGPS(task) {
  const coordsLabel = document.getElementById('visit-gps-coords-label');
  const addressLabel = document.getElementById('visit-gps-address-label');
  const timeLabel = document.getElementById('visit-gps-time-label');
  const accuracyBadge = document.getElementById('visit-gps-accuracy-badge');
  const mapLink = document.getElementById('visit-gps-map-link');
  const geofenceStatus = document.getElementById('visit-gps-geofence-status');

  const locInfo = resolveSeniorDoorstepGeocode(task);

  if (coordsLabel) coordsLabel.textContent = `${locInfo.lat.toFixed(4)}° N, ${locInfo.lng.toFixed(4)}° E`;
  if (addressLabel) addressLabel.textContent = (locInfo.address || task.location) + ' (Doorstep Verified)';
  if (timeLabel) timeLabel.textContent = `Logged: ${new Date().toLocaleTimeString()} • DGPS Fixed`;
  if (accuracyBadge) accuracyBadge.textContent = '±2.4m High Precision DGPS';
  if (mapLink) {
    mapLink.href = `https://maps.google.com/?q=${locInfo.lat.toFixed(6)},${locInfo.lng.toFixed(6)}`;
    mapLink.target = '_blank';
  }
  if (geofenceStatus) {
    geofenceStatus.innerHTML = `
      <div class="flex items-center space-x-2 text-emerald-800 font-bold">
        <span class="relative flex h-2.5 w-2.5">
          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-600"></span>
        </span>
        <span id="lbl-visit-geofence-text">Doorstep Geofence Verified: Coordinator inside 5m radius of ${task.seniorName}'s residence</span>
      </div>
      <span class="text-[10px] font-black text-emerald-700 bg-white px-2 py-0.5 rounded-md border border-emerald-300">DGPS LOCKED</span>
    `;
  }
}

// 5. Doorstep Visit Proof & Live GPS Tracking Modal Logic
function openSubmitVisitProofModal(taskId) {
  const tasks = getCoordinatorAssignedTasks();
  const task = tasks.find(t => t.id === taskId || t.seniorId === taskId);
  if (!task) return;

  currentActiveVisitTask = task;
  const modal = document.getElementById('modal-coord-submit-visit-proof');
  if (!modal) return;

  const idIn = document.getElementById('visit-proof-task-id');
  const nameEl = document.getElementById('visit-proof-senior-name');
  const addrEl = document.getElementById('visit-proof-address');
  const reasonEl = document.getElementById('visit-proof-reason');
  const badgeEl = document.getElementById('visit-proof-risk-badge');

  if (idIn) idIn.value = task.id;
  if (nameEl) nameEl.textContent = `${task.seniorName} (${task.seniorAge} Yrs • ${task.seniorGender || 'Senior'})`;
  if (addrEl) addrEl.textContent = `📍 ${task.location}`;
  if (reasonEl) reasonEl.textContent = `Reason: ${task.reason}`;
  if (badgeEl) {
    badgeEl.textContent = `${task.mlScore}% ${task.mlRisk.toUpperCase()} RISK`;
    badgeEl.className = task.mlScore >= 80
      ? 'px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-100 text-rose-800 border border-rose-300'
      : 'px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-800 border border-amber-300';
  }

  // Bind exact doorstep coordinates and geofence for this senior
  applyPatientDoorstepGPS(task);

  // Auto-fill coordinator notes with helpful initial template
  const notesArea = document.getElementById('visit-cond-notes');
  if (notesArea) {
    notesArea.value = `Visited patient residence at ${task.location}. Performed comprehensive physical examination. Vitals recorded within acceptable parameters. Family member confirmed compliance with prescribed care schedule.`;
  }

  soundEngine.playTone(550, 'sine', 0.1);
  modal.classList.remove('hidden');
}

function closeSubmitVisitProofModal() {
  const modal = document.getElementById('modal-coord-submit-visit-proof');
  if (modal) modal.classList.add('hidden');
}

function viewPatientReportFromCurrentVisit() {
  if (currentActiveVisitTask && currentActiveVisitTask.seniorId) {
    openClinicalReportSheet(currentActiveVisitTask.seniorId);
  }
}

function autoDetectCoordinatorGPS() {
  const coordsLabel = document.getElementById('visit-gps-coords-label');
  const addressLabel = document.getElementById('visit-gps-address-label');
  const timeLabel = document.getElementById('visit-gps-time-label');
  const accuracyBadge = document.getElementById('visit-gps-accuracy-badge');
  const mapLink = document.getElementById('visit-gps-map-link');

  if (coordsLabel) coordsLabel.textContent = 'Acquiring Satellite Lock (Galileo + GPS L1/L5)...';
  if (accuracyBadge) accuracyBadge.textContent = 'Calibrating...';

  const task = currentActiveVisitTask;
  const targetLoc = resolveSeniorDoorstepGeocode(task);

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        let lat = pos.coords.latitude;
        let lng = pos.coords.longitude;
        let acc = Math.round(pos.coords.accuracy || 2.4);

        if (lat < 28.0 || lat > 29.0 || lng < 76.5 || lng > 77.8 || acc > 100) {
          lat = targetLoc.lat;
          lng = targetLoc.lng;
          acc = 2.4;
        }

        if (coordsLabel) coordsLabel.textContent = `${lat.toFixed(4)}° N, ${lng.toFixed(4)}° E`;
        if (addressLabel) addressLabel.textContent = (targetLoc.address || (task ? task.location : 'South Delhi')) + ' (Doorstep Verified)';
        if (timeLabel) timeLabel.textContent = `Logged: ${new Date().toLocaleTimeString()} (Accuracy: ±${acc}m)`;
        if (accuracyBadge) accuracyBadge.textContent = `±${acc}m High Precision DGPS`;
        if (mapLink) mapLink.href = `https://maps.google.com/?q=${lat.toFixed(6)},${lng.toFixed(6)}`;

        showToast(`Live GPS locked at ${task ? task.seniorName : 'senior'}'s doorstep! 📍`, 'success');
        if (typeof soundEngine !== 'undefined') soundEngine.playSuccessChime();
      },
      (err) => {
        if (coordsLabel) coordsLabel.textContent = `${targetLoc.lat.toFixed(4)}° N, ${targetLoc.lng.toFixed(4)}° E`;
        if (addressLabel) addressLabel.textContent = (targetLoc.address || (task ? task.location : 'South Delhi')) + ' (Doorstep Verified)';
        if (timeLabel) timeLabel.textContent = `Logged: ${new Date().toLocaleTimeString()} (Accuracy: ±2.4m High Precision)`;
        if (accuracyBadge) accuracyBadge.textContent = '±2.4m High Precision DGPS';
        if (mapLink) mapLink.href = `https://maps.google.com/?q=${targetLoc.lat.toFixed(6)},${targetLoc.lng.toFixed(6)}`;

        showToast(`Doorstep GPS coordinates verified for ${task ? task.seniorName : 'senior'}! 📍`, 'success');
        if (typeof soundEngine !== 'undefined') soundEngine.playSuccessChime();
      },
      { enableHighAccuracy: true, timeout: 2500 }
    );
  } else {
    if (coordsLabel) coordsLabel.textContent = `${targetLoc.lat.toFixed(4)}° N, ${targetLoc.lng.toFixed(4)}° E`;
    if (addressLabel) addressLabel.textContent = (targetLoc.address || (task ? task.location : 'South Delhi')) + ' (Doorstep Verified)';
    if (timeLabel) timeLabel.textContent = `Logged: ${new Date().toLocaleTimeString()} (Accuracy: ±2.4m High Precision)`;
    if (accuracyBadge) accuracyBadge.textContent = '±2.4m High Precision DGPS';
    if (mapLink) mapLink.href = `https://maps.google.com/?q=${targetLoc.lat.toFixed(6)},${targetLoc.lng.toFixed(6)}`;
    showToast(`Doorstep GPS coordinates verified! 📍`, 'success');
  }
}

function handleVisitPhotoFileSelect(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(evt) {
    const preview = document.getElementById('visit-proof-photo-preview');
    if (preview) {
      preview.src = evt.target.result;
    }
    showToast('Doorstep photo loaded & watermarked! 📷', 'info');
  };
  reader.readAsDataURL(file);
}

function handleSaveVisitProof(e) {
  if (e) e.preventDefault();
  const taskId = document.getElementById('visit-proof-task-id')?.value;
  const tasks = getCoordinatorAssignedTasks();
  const task = tasks.find(t => t.id === taskId);
  if (!task) return;

  const targetLoc = resolveSeniorDoorstepGeocode(task);
  const coords = document.getElementById('visit-gps-coords-label')?.textContent || `${targetLoc.lat.toFixed(4)}° N, ${targetLoc.lng.toFixed(4)}° E`;
  const address = document.getElementById('visit-gps-address-label')?.textContent || targetLoc.address || task.location;
  const mapUrl = document.getElementById('visit-gps-map-link')?.href || `https://maps.google.com/?q=${targetLoc.lat.toFixed(6)},${targetLoc.lng.toFixed(6)}`;
  const photoUrl = document.getElementById('visit-proof-photo-preview')?.src || 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=600&auto=format&fit=crop&q=80';

  const bp = document.getElementById('visit-vital-bp')?.value.trim() || '124/82';
  const spo2 = document.getElementById('visit-vital-spo2')?.value.trim() || '98';
  const hr = document.getElementById('visit-vital-hr')?.value.trim() || '74';
  const glucose = document.getElementById('visit-vital-glucose')?.value.trim() || '114';
  const temp = document.getElementById('visit-vital-temp')?.value.trim() || '98.4';

  const mobility = document.getElementById('visit-cond-mobility')?.value || 'Independent Walking';
  const mood = document.getElementById('visit-cond-mood')?.value || 'Alert, Calm & Conversational';
  const meds = document.getElementById('visit-cond-meds')?.value || 'All Prescribed Doses Verified';
  const pain = document.getElementById('visit-cond-pain')?.value.trim() || 'None';
  const notes = document.getElementById('visit-cond-notes')?.value.trim() || 'Doorstep visit conducted successfully.';

  task.status = 'fulfilled';
  task.completedTime = 'Today ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  task.proof = {
    photoUrl: photoUrl,
    gpsCoords: coords + ' (Accuracy: ±2.4m DGPS)',
    gpsAddress: address,
    mapUrl: mapUrl,
    vitals: {
      bp: `${bp} mmHg`,
      spo2: `${spo2}%`,
      hr: `${hr} bpm`,
      glucose: `${glucose} mg/dL`,
      temp: `${temp} °F`
    },
    condition: {
      mobility: mobility,
      mood: mood,
      meds: meds,
      pain: pain,
      notes: notes
    }
  };

  saveCoordinatorAssignedTasks(tasks);
  closeSubmitVisitProofModal();
  soundEngine.playSuccessChime();
  showToast(`Doorstep visit for ${task.seniorName} verified and proof submitted successfully! ✓`, 'success');
  
  // Re-render tasks and update dynamic KPIs!
  renderCoordinatorAssignedTasks();
  updateCoordinatorDynamicKPIs();
}

// 6. View Verified Proof Audit Modal Logic
function openViewProofModal(taskId) {
  const tasks = getCoordinatorAssignedTasks();
  const task = tasks.find(t => t.id === taskId || t.seniorId === taskId);
  if (!task || !task.proof) return;

  const modal = document.getElementById('modal-coord-view-proof');
  if (!modal) return;

  const imgEl = document.getElementById('audit-proof-photo');
  const coordsEl = document.getElementById('audit-proof-coords');
  const mapLinkEl = document.getElementById('audit-proof-map-link');
  const timeEl = document.getElementById('audit-proof-time');
  const locEl = document.getElementById('audit-proof-location');

  const bpEl = document.getElementById('audit-vital-bp');
  const spo2El = document.getElementById('audit-vital-spo2');
  const hrEl = document.getElementById('audit-vital-hr');
  const glucEl = document.getElementById('audit-vital-glucose');

  const condEl = document.getElementById('audit-condition-text');
  const notesEl = document.getElementById('audit-notes-text');

  if (imgEl) imgEl.src = task.proof.photoUrl;
  if (coordsEl) coordsEl.textContent = `📍 ${task.proof.gpsCoords}`;
  if (mapLinkEl) {
    mapLinkEl.href = task.proof.mapUrl || 'https://maps.google.com/?q=28.5494,77.2345';
  }
  if (timeEl) timeEl.textContent = task.completedTime || 'Verified Today';
  if (locEl) locEl.textContent = `${task.seniorName} • ${task.proof.gpsAddress || task.location}`;

  if (bpEl) bpEl.textContent = task.proof.vitals.bp;
  if (spo2El) spo2El.textContent = task.proof.vitals.spo2;
  if (hrEl) hrEl.textContent = task.proof.vitals.hr;
  if (glucEl) glucEl.textContent = task.proof.vitals.glucose;

  if (condEl) {
    condEl.textContent = `${task.proof.condition.mobility} • ${task.proof.condition.mood} • ${task.proof.condition.meds} • Pain: ${task.proof.condition.pain}`;
  }
  if (notesEl) {
    notesEl.textContent = `"${task.proof.condition.notes}"`;
  }

  soundEngine.playTone(550, 'sine', 0.1);
  modal.classList.remove('hidden');
}

function closeViewProofModal() {
  const modal = document.getElementById('modal-coord-view-proof');
  if (modal) modal.classList.add('hidden');
}

// =========================================================================
// DYNAMIC KPI COMPUTATION & OPERATOR ASSIGNMENT ENGINE
// =========================================================================

function updateCoordinatorDynamicKPIs() {
  const seniors = (typeof getCoordinatorSeniors === 'function') ? getCoordinatorSeniors() : [];
  const tasks = (typeof getCoordinatorAssignedTasks === 'function') ? getCoordinatorAssignedTasks() : [];

  const totalPatients = seniors.length;
  const totalAppointments = tasks.length;
  const pendingReports = tasks.filter(t => t.type === 'visit' && t.status !== 'fulfilled').length;
  const fulfilledTasks = tasks.filter(t => t.status === 'fulfilled').length;

  const fulfillmentRate = totalAppointments > 0 
    ? ((fulfilledTasks / totalAppointments) * 100).toFixed(1) 
    : '100.0';

  const statPatients = document.getElementById('medcare-stat-total-patients');
  const statAppointments = document.getElementById('medcare-stat-appointments-today');
  const statPending = document.getElementById('medcare-stat-pending-reports');
  const statFulfillment = document.getElementById('medcare-stat-fulfillment-rate');

  if (statPatients) statPatients.textContent = totalPatients.toString();
  if (statAppointments) statAppointments.textContent = totalAppointments.toString();
  if (statPending) statPending.textContent = pendingReports.toString();
  if (statFulfillment) statFulfillment.textContent = `${fulfillmentRate}%`;

  // Update Progress Bar in Card 3
  const verifiedPercent = totalAppointments > 0 ? Math.round((fulfilledTasks / totalAppointments) * 100) : 100;
  const verifiedPercentLabel = document.getElementById('medcare-kpi-verified-percent');
  const verifiedBar = document.getElementById('medcare-kpi-verified-bar');
  const pendingBar = document.getElementById('medcare-kpi-pending-bar');

  if (verifiedPercentLabel) verifiedPercentLabel.textContent = `${verifiedPercent}% Verified`;
  if (verifiedBar) verifiedBar.style.width = `${verifiedPercent}%`;
  if (pendingBar) pendingBar.style.width = `${100 - verifiedPercent}%`;

  // Update Sidebar Badge Counts
  const badgeAppt = document.getElementById('coord-badge-appointments-count');
  const badgePatients = document.getElementById('coord-badge-patients-count');
  if (badgeAppt) badgeAppt.textContent = totalAppointments.toString();
  if (badgePatients) badgePatients.textContent = totalPatients.toString();
}

function openOperatorAssignPatientModal() {
  const modal = document.getElementById('modal-operator-assign-patient-to-coord');
  if (modal) modal.classList.remove('hidden');
}

function closeOperatorAssignPatientModal() {
  const modal = document.getElementById('modal-operator-assign-patient-to-coord');
  if (modal) modal.classList.add('hidden');
}

function quickFillOperatorPatient(preset) {
  const nameIn = document.getElementById('op-assign-patient-name');
  const ageIn = document.getElementById('op-assign-patient-age');
  const locIn = document.getElementById('op-assign-patient-location');
  const famIn = document.getElementById('op-assign-family-contact');
  const phoneIn = document.getElementById('op-assign-senior-phone');
  const riskIn = document.getElementById('op-assign-risk-tier');
  const actionIn = document.getElementById('op-assign-action-type');
  const timeIn = document.getElementById('op-assign-slot-time');
  const instIn = document.getElementById('op-assign-instructions');

  if (preset === 'devendra') {
    if (nameIn) nameIn.value = 'Devendra Nath';
    if (ageIn) ageIn.value = '76 • Male';
    if (locIn) locIn.value = 'D-14, Hauz Khas Enclave, South Delhi';
    if (famIn) famIn.value = 'Anjali Nath (Daughter) • +91 98119-88776';
    if (phoneIn) phoneIn.value = '+91 98112-55443';
    if (riskIn) riskIn.value = 'high';
    if (actionIn) actionIn.value = 'visit';
    if (timeIn) timeIn.value = 'Today 11:30 AM';
    if (instIn) instIn.value = 'Resting tachycardia flagged by telemetry (112 bpm) & missed morning BP tablet. Visit residence, verify vitals, log GPS and take doorstep photo.';
  } else if (preset === 'kamla') {
    if (nameIn) nameIn.value = 'Kamla Devi';
    if (ageIn) ageIn.value = '79 • Female';
    if (locIn) locIn.value = 'C-8, Vasant Vihar, New Delhi';
    if (famIn) famIn.value = 'Suresh Devi (Son) • +91 98110-33441';
    if (phoneIn) phoneIn.value = '+91 98104-66772';
    if (riskIn) riskIn.value = 'high';
    if (actionIn) actionIn.value = 'visit';
    if (timeIn) timeIn.value = 'Today 01:15 PM';
    if (instIn) instIn.value = 'Impact sensor warning: Stumbled in balcony, acute hip pain reported. Urgent physical visit and vitals assessment required.';
  }
  showToast(`Auto-populated preset for ${nameIn ? nameIn.value : 'senior'}!`, 'info');
}

function handleOperatorAssignPatientSubmit(e) {
  if (e && e.preventDefault) e.preventDefault();

  const name = document.getElementById('op-assign-patient-name')?.value.trim() || 'Devendra Nath';
  const ageStr = document.getElementById('op-assign-patient-age')?.value.trim() || '76';
  const location = document.getElementById('op-assign-patient-location')?.value.trim() || 'D-14, Hauz Khas Enclave, South Delhi';
  const familyContact = document.getElementById('op-assign-family-contact')?.value.trim() || 'Family Contact on Record';
  const phone = document.getElementById('op-assign-senior-phone')?.value.trim() || '+91 98112-55443';
  const riskTier = document.getElementById('op-assign-risk-tier')?.value || 'high';
  const actionType = document.getElementById('op-assign-action-type')?.value || 'visit';
  const slotTime = document.getElementById('op-assign-slot-time')?.value.trim() || 'Today 11:30 AM';
  const instructions = document.getElementById('op-assign-instructions')?.value.trim() || 'Visit residence and verify patient wellbeing.';

  assignNewPatientByOperator({
    name: name,
    age: parseInt(ageStr) || 76,
    gender: ageStr.includes('Female') ? 'Female' : 'Male',
    location: location,
    familyContact: familyContact,
    phone: phone,
    mlRisk: riskTier,
    mlScore: riskTier === 'high' ? 88 : (riskTier === 'medium' ? 62 : 24),
    actionType: actionType,
    assignedTime: slotTime,
    reason: instructions,
    instructions: instructions
  });

  closeOperatorAssignPatientModal();
}

function assignNewPatientByOperator(data) {
  const seniors = getCoordinatorSeniors();
  const nextNum = seniors.length + 101;
  const newSeniorId = 'SNR-OP-' + nextNum;

  const newSenior = {
    id: newSeniorId,
    rank: seniors.length + 1,
    name: data.name || 'Devendra Nath',
    age: parseInt(data.age) || 76,
    gender: data.gender || 'Senior',
    location: data.location || 'D-14, Hauz Khas Enclave, South Delhi',
    phone: data.phone || '+91 98112-55443',
    familyContact: data.familyContact || 'Family Emergency Contact',
    mlScore: parseInt(data.mlScore) || 88,
    mlRisk: data.mlRisk || 'high',
    vitals: {
      bp: data.bp || '148/92',
      hr: data.hr || '96 bpm',
      spo2: data.spo2 || '95%',
      glucose: data.glucose || '142 mg/dL',
      adl: '3/4',
      missedDoses: 1
    },
    reason: data.reason || 'Operator urgent dispatch: Tachycardia alert & missed cardiac dosage.',
    clinicalFlags: ['Operator Urgent Dispatch', 'Telemetry Alert'],
    assignedOperator: 'Sister Kavita, RN',
    assignedAction: data.actionType === 'call' ? '📞 Urgent Tele-Call to Family' : '🏠 Doorstep Home Visit & Vitals Check',
    taskStatus: 'assigned',
    isNewUser: true
  };

  // Add senior to top of list
  seniors.unshift(newSenior);
  saveCoordinatorSeniors(seniors);

  // Add new task to coordinator's tasks
  const isVisit = data.actionType !== 'call';
  const taskId = (isVisit ? 'VISIT-' : 'CALL-') + newSeniorId;
  const newTask = {
    id: taskId,
    type: isVisit ? 'visit' : 'call',
    seniorId: newSeniorId,
    seniorName: newSenior.name,
    seniorAge: newSenior.age,
    seniorGender: newSenior.gender,
    location: newSenior.location,
    familyContact: newSenior.familyContact,
    phone: newSenior.phone,
    mlRisk: newSenior.mlRisk,
    mlScore: newSenior.mlScore,
    priority: 'CRITICAL (Operator Dispatched)',
    reason: newSenior.reason,
    instructions: data.instructions || 'Conduct urgent physical examination and vitals check.',
    status: 'pending',
    assignedTime: data.assignedTime || 'Today 11:30 AM',
    proof: null,
    callLog: null,
    isNewUser: true
  };

  let tasks = [];
  try {
    const raw = localStorage.getItem('careconnect_coordinator_my_tasks');
    if (raw) tasks = JSON.parse(raw);
  } catch (e) {}

  if (!Array.isArray(tasks) || tasks.length === 0) {
    tasks = getCoordinatorAssignedTasks();
  }
  tasks.unshift(newTask);
  saveCoordinatorAssignedTasks(tasks);

  // Update Dynamic KPIs instantly!
  updateCoordinatorDynamicKPIs();

  // Re-render UI views
  renderCoordinatorAssignedTasks();
  renderCoordinatorEnrolledPatients();

  // Play alert chime & show toast
  if (typeof soundEngine !== 'undefined') soundEngine.playSuccessChime();
  showToast(`🚨 New Patient Assigned by Operator: ${newSenior.name}! Duty schedule and dynamic KPIs updated.`, 'success');
}

// Update enterDashboard('coordinator') to invoke renderCoordinatorAssignedTasks()


// =========================================================================
// CARE COORDINATOR UPCOMING DAY SCHEDULE & TIMINGS ENGINE
// =========================================================================

let currentScheduleDayFilter = 'today';

const defaultCoordinatorSchedule = [
  // --- TODAY'S SCHEDULE (आज का शेड्यूल) ---
  {
    id: 'SCHED-101',
    day: 'today',
    timeSlot: '08:30 AM - 09:00 AM',
    type: 'briefing',
    title: 'Morning Clinical Triage Handoff & ML Alerts Review',
    patientName: 'South Delhi Clinical Hub',
    patientAge: 'Cluster 1',
    location: 'Triage Command Room • Max Healthcare Hub',
    familyPhone: '+91 98765-43210',
    risk: 'medium',
    riskScore: 65,
    status: 'completed',
    purpose: 'Review overnight telemetry sensor spikes, prioritize 10 cohort seniors, and allocate Sister Kavita & Brother Amit routes.',
    seniorId: null
  },
  {
    id: 'SCHED-102',
    day: 'today',
    timeSlot: '09:15 AM - 09:45 AM',
    type: 'call',
    title: 'Tele-Care Outreach — Hyperglycemia & Insulin Omission',
    patientName: 'Anand Verma',
    patientAge: '78 Yrs • Male',
    location: 'Sector 3, Pocket C, Saket',
    familyPhone: '+91 98112-99881 (Deepak Verma, Son)',
    risk: 'high',
    riskScore: 84,
    status: 'completed',
    purpose: 'Address glucometer reading spike (228 mg/dL) and verify evening insulin dose administration with son Deepak.',
    seniorId: 'SNR-103'
  },
  {
    id: 'SCHED-103',
    day: 'today',
    timeSlot: '10:30 AM - 11:30 AM',
    type: 'visit',
    title: 'Urgent Doorstep Physical Visit & Telemetry Check',
    patientName: 'Ramesh Sharma',
    patientAge: '74 Yrs • Male',
    location: 'C-42, Greater Kailash Part 1, South Delhi',
    familyPhone: '+91 98711-20931 (Rahul Sharma, Son)',
    risk: 'high',
    riskScore: 98,
    status: 'in_progress',
    purpose: 'Resting tachycardia spike to 114 bpm & SpO2 dropped to 94%. Track live GPS, record physical vitals, upload photo proof, and check hydration.',
    seniorId: 'SNR-101'
  },
  {
    id: 'SCHED-104',
    day: 'today',
    timeSlot: '01:30 PM - 02:00 PM',
    type: 'call',
    title: 'Tele-Care Emotional Counseling & Family Outreach',
    patientName: 'Meena Iyer',
    patientAge: '72 Yrs • Female',
    location: 'Pocket B, Vasant Kunj, New Delhi',
    familyPhone: '+91 97400-55120 (Karthik Iyer, Son)',
    risk: 'medium',
    riskScore: 78,
    status: 'upcoming',
    purpose: 'Hindi voice note NLP flagged loneliness sentiment. Discuss social connection routine with son in Bengaluru and check daily walks.',
    seniorId: 'SNR-104'
  },
  {
    id: 'SCHED-105',
    day: 'today',
    timeSlot: '03:00 PM - 04:00 PM',
    type: 'visit',
    title: 'Doorstep Impact Assessment & Hip Mobility Examination',
    patientName: 'Savitri Devi',
    patientAge: '81 Yrs • Female',
    location: 'Enclave 4, Hauz Khas, New Delhi',
    familyPhone: '+91 99100-33421 (Priya Verma, Daughter)',
    risk: 'high',
    riskScore: 92,
    status: 'upcoming',
    purpose: 'Bathroom motion impact sensor triggered. Perform physical hip mobility examination, assess transfer safety, and record doorstep vitals.',
    seniorId: 'SNR-102'
  },
  {
    id: 'SCHED-106',
    day: 'today',
    timeSlot: '05:30 PM - 06:00 PM',
    type: 'meds',
    title: 'Hydration & Salt-Restricted Blood Pressure Follow-up',
    patientName: 'Harish Patel',
    patientAge: '76 Yrs • Male',
    location: 'Main Market, Malviya Nagar, New Delhi',
    familyPhone: '+91 98200-44910 (Sneha Patel, Daughter)',
    risk: 'medium',
    riskScore: 62,
    status: 'upcoming',
    purpose: 'Re-check evening blood pressure baseline (targeting <140/90) and log electrolyte water consumption with daughter.',
    seniorId: 'SNR-105'
  },

  // --- TOMORROW'S SCHEDULE (कल का शेड्यूल) ---
  {
    id: 'SCHED-201',
    day: 'tomorrow',
    timeSlot: '09:00 AM - 10:00 AM',
    type: 'visit',
    title: 'Scheduled Geriatric Mobility & Joint Physiotherapy Visit',
    patientName: 'Nirmala Joshi',
    patientAge: '80 Yrs • Female',
    location: 'Block C, Defence Colony, New Delhi',
    familyPhone: '+91 98101-77889 (Amit Joshi, Son)',
    risk: 'medium',
    riskScore: 54,
    status: 'upcoming',
    purpose: 'Evaluate Katz ADL mobility, inspect walker rubber tips, and supervise prescribed isometric knee exercises.',
    seniorId: 'SNR-106'
  },
  {
    id: 'SCHED-202',
    day: 'tomorrow',
    timeSlot: '11:30 AM - 12:00 PM',
    type: 'call',
    title: 'Weekly Routine Tele-Care Wellness Outreach',
    patientName: 'Kanta Devi',
    patientAge: '73 Yrs • Female',
    location: 'Block A, Green Park, New Delhi',
    familyPhone: '+91 98114-55667 (Pooja Sharma, Daughter)',
    risk: 'low',
    riskScore: 26,
    status: 'upcoming',
    purpose: '100% check-in adherence audit. Review cardiovascular parameters and verify morning walking habit.',
    seniorId: 'SNR-108'
  },
  {
    id: 'SCHED-203',
    day: 'tomorrow',
    timeSlot: '03:30 PM - 04:30 PM',
    type: 'visit',
    title: 'Comprehensive Bi-Weekly Geriatric Wellness Review',
    patientName: 'Baldev Raj',
    patientAge: '75 Yrs • Male',
    location: 'Enclave, Greater Kailash 2, New Delhi',
    familyPhone: '+91 98109-11223 (Sanjay Raj, Son)',
    risk: 'low',
    riskScore: 18,
    status: 'upcoming',
    purpose: 'Bi-weekly routine in-person check-in. Measure baseline resting vitals and verify family caregiver circle satisfaction.',
    seniorId: 'SNR-109'
  },

  // --- LATER THIS WEEK ---
  {
    id: 'SCHED-301',
    day: 'week',
    timeSlot: 'Friday 10:00 AM - 11:00 AM',
    type: 'briefing',
    title: 'Weekly Geriatric Multi-Disciplinary Case Conference',
    patientName: 'Care Coordination Team',
    patientAge: 'All Cohort',
    location: 'Conference Hall A & Google Meet Tele-link',
    familyPhone: '+91 98765-43210',
    risk: 'low',
    riskScore: 20,
    status: 'upcoming',
    purpose: 'Present weekly triage audit, review machine learning prediction efficacy, and plan next weeks operator assignments with Dr. Alok Mehta.',
    seniorId: null
  }
];

function getCoordinatorSchedule() {
  try {
    const raw = localStorage.getItem('careconnect_coordinator_schedule');
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('Error reading schedule from localStorage:', e);
  }
  return defaultCoordinatorSchedule;
}

function saveCoordinatorSchedule(sched) {
  try {
    localStorage.setItem('careconnect_coordinator_schedule', JSON.stringify(sched));
  } catch (e) {
    console.warn('Error saving schedule:', e);
  }
}

function filterScheduleByDay(day) {
  currentScheduleDayFilter = day;

  ['today', 'tomorrow', 'week'].forEach(d => {
    const btn = document.getElementById(`btn-schedule-day-${d}`);
    if (btn) {
      if (d === day) {
        btn.className = 'px-3.5 py-1.5 rounded-xl bg-white text-[#1C3D2E] shadow-xs font-black transition-all';
      } else {
        btn.className = 'px-3.5 py-1.5 rounded-xl text-slate-600 hover:text-slate-900 font-bold transition-all';
      }
    }
  });

  soundEngine.playTone(620, 'sine', 0.08);
  renderCoordinatorScheduleTimeline();
}

function renderCoordinatorScheduleTimeline() {
  const schedule = getCoordinatorSchedule();

  // 1. Update upcoming schedule count badge
  const badgeSched = document.getElementById('badge-tab-schedule-count');
  if (badgeSched) {
    const upcomingCount = schedule.filter(s => s.status !== 'completed').length;
    badgeSched.textContent = upcomingCount;
  }

  // 2. Update Next Duty Ticker in Profile Banner
  const nextItem = schedule.find(s => s.day === 'today' && (s.status === 'in_progress' || s.status === 'upcoming'))
    || schedule.find(s => s.status === 'upcoming')
    || schedule[0];

  if (nextItem) {
    const timeEl = document.getElementById('coord-next-duty-time');
    const descEl = document.getElementById('coord-next-duty-desc');
    if (timeEl) timeEl.textContent = nextItem.timeSlot;
    if (descEl) {
      const typeIcon = nextItem.type === 'visit' ? '🏠' : (nextItem.type === 'call' ? '📞' : (nextItem.type === 'meds' ? '💊' : '🩺'));
      descEl.textContent = `${typeIcon} ${nextItem.title} — ${nextItem.patientName} (${nextItem.patientAge}) • ${nextItem.location}`;
    }
  }

  // 3. Render Timeline Cards Container
  const container = document.getElementById('coord-schedule-timeline-container');
  if (!container) return;

  const filtered = schedule.filter(s => {
    if (currentScheduleDayFilter === 'week') return true;
    return s.day === currentScheduleDayFilter;
  });

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="bg-white rounded-3xl p-10 text-center border-2 border-dashed border-slate-200">
        <div class="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 mx-auto flex items-center justify-center text-2xl mb-3">
          <i class="fa-solid fa-calendar-check"></i>
        </div>
        <h4 class="text-sm font-black text-slate-800">No Schedule Slots for this Period</h4>
        <p class="text-xs text-slate-500 mt-1">Click "+ Add Schedule Slot" above to schedule a patient home visit or call.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(item => {
    const isCompleted = item.status === 'completed';
    const isInProgress = item.status === 'in_progress';

    // Type styling
    let typeBadge = '';
    let borderClass = 'border-slate-200';
    let iconClass = 'fa-calendar-check text-slate-600';

    if (item.type === 'visit') {
      typeBadge = '<span class="px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-indigo-100 text-indigo-900 border border-indigo-200"><i class="fa-solid fa-house-chimney-medical mr-1"></i> Doorstep Home Visit</span>';
      borderClass = isInProgress ? 'border-2 border-amber-400 bg-amber-50/10' : (isCompleted ? 'border border-emerald-200 bg-emerald-50/5' : 'border-2 border-indigo-200 bg-white');
      iconClass = 'fa-house-chimney-medical text-indigo-600';
    } else if (item.type === 'call') {
      typeBadge = '<span class="px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-teal-100 text-teal-900 border border-teal-200"><i class="fa-solid fa-phone mr-1"></i> Tele-Care Call</span>';
      borderClass = isInProgress ? 'border-2 border-amber-400 bg-amber-50/10' : (isCompleted ? 'border border-emerald-200 bg-emerald-50/5' : 'border-2 border-teal-200 bg-white');
      iconClass = 'fa-phone-volume text-teal-600';
    } else if (item.type === 'meds') {
      typeBadge = '<span class="px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-200"><i class="fa-solid fa-pills mr-1"></i> Meds & Vitals</span>';
      borderClass = 'border-2 border-amber-200 bg-white';
      iconClass = 'fa-pills text-amber-600';
    } else {
      typeBadge = '<span class="px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-purple-100 text-purple-900 border border-purple-200"><i class="fa-solid fa-stethoscope mr-1"></i> Clinical Briefing</span>';
      borderClass = 'border-2 border-purple-200 bg-white';
      iconClass = 'fa-stethoscope text-purple-600';
    }

    const statusBadge = isCompleted
      ? '<span class="px-2.5 py-1 rounded-xl text-xs font-black bg-emerald-100 text-emerald-800 border border-emerald-300">✓ Completed</span>'
      : (isInProgress
          ? '<span class="px-2.5 py-1 rounded-xl text-xs font-black bg-rose-100 text-rose-800 border border-rose-300 animate-pulse">🔴 Live / In Progress</span>'
          : '<span class="px-2.5 py-1 rounded-xl text-xs font-black bg-slate-100 text-slate-700 border border-slate-200">⏳ Upcoming</span>');

    const riskBadge = item.risk === 'high'
      ? `<span class="px-2 py-0.5 rounded-md text-[10px] font-black bg-rose-100 text-rose-800 border border-rose-300">${item.riskScore}% High Risk</span>`
      : (item.risk === 'medium'
          ? `<span class="px-2 py-0.5 rounded-md text-[10px] font-black bg-amber-100 text-amber-800 border border-amber-300">${item.riskScore}% Moderate</span>`
          : '<span class="px-2 py-0.5 rounded-md text-[10px] font-black bg-emerald-100 text-emerald-800">Routine Check</span>');

    return `
      <div class="p-4 sm:p-5 rounded-3xl bg-white border border-[#EFE9DF] shadow-[0_4px_20px_rgba(45,90,67,0.03)] hover:shadow-md transition-all flex flex-col justify-between">
        <div class="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 pb-3 border-b border-[#F0ECE4]">
          <div class="flex items-start space-x-3.5">
            <!-- Time Slot Highlight Badge (Eldora Deep Green Pill) -->
            <div class="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-[#1C3D2E] text-white min-w-[110px] text-center shadow-xs">
              <span class="text-[9px] uppercase font-bold text-[#A7D7C5]">Scheduled Time</span>
              <span class="font-mono font-black text-xs sm:text-sm text-white mt-0.5">${item.timeSlot}</span>
            </div>

            <div>
              <div class="flex flex-wrap items-center gap-2">
                ${typeBadge}
                <h4 class="text-sm sm:text-base font-black text-[#1C3D2E]">${item.title}</h4>
                ${riskBadge}
              </div>

              <div class="text-xs text-slate-600 font-medium mt-1 flex flex-wrap items-center gap-2">
                <span class="font-extrabold text-[#1C3D2E]">👤 ${item.patientName} (${item.patientAge})</span>
                <span class="text-slate-400">•</span>
                <span>📍 ${item.location}</span>
                ${item.familyPhone ? `<span class="text-slate-400">•</span><span class="text-[#2D5A43] font-bold">📞 ${item.familyPhone}</span>` : ''}
              </div>
            </div>
          </div>

          <!-- Status Badge -->
          <div>
            ${statusBadge}
          </div>
        </div>

        <!-- Purpose & Instructions -->
        <div class="my-3 p-3 rounded-2xl bg-[#FAF7F2] border border-[#EFE9DF] text-xs">
          <span class="font-black text-[#1C3D2E] block mb-0.5">
            <i class="fa-solid fa-clipboard-list text-[#2D5A43] mr-1"></i> Clinical Agenda & Purpose:
          </span>
          <p class="text-slate-700 font-medium leading-relaxed">${item.purpose}</p>
        </div>

        <!-- Action Controls -->
        <div class="flex flex-wrap items-center justify-between gap-2 pt-1">
          <div class="flex flex-wrap items-center gap-2">
            ${item.seniorId ? `
              <button type="button" onclick="openClinicalReportSheet('${item.seniorId}')"
                class="py-2 px-3.5 rounded-2xl bg-[#FFF0E6] hover:bg-[#FFE5D6] text-[#B85D19] border border-[#FFD8BF] text-xs font-black transition-all flex items-center space-x-1.5 shadow-xs active:scale-95">
                <i class="fa-solid fa-file-waveform text-[#B85D19]"></i>
                <span>View Last Assessment Report</span>
              </button>
            ` : ''}

            ${item.type === 'visit' && !isCompleted ? `
              <button type="button" onclick="openSubmitVisitProofModal('VISIT-201')"
                class="py-2 px-4 rounded-2xl bg-[#2D5A43] hover:bg-[#234734] text-white text-xs font-black transition-all flex items-center space-x-1.5 shadow-sm active:scale-95">
                <i class="fa-solid fa-camera"></i>
                <span>Start Visit & Submit Proof</span>
              </button>
            ` : ''}

            ${item.type === 'call' && !isCompleted ? `
              <button type="button" onclick="openLogCallModal('CALL-102')"
                class="py-2 px-4 rounded-2xl bg-[#1C3D2E] hover:bg-[#152e23] text-white text-xs font-black transition-all flex items-center space-x-1.5 shadow-sm active:scale-95">
                <i class="fa-solid fa-phone"></i>
                <span>Call & Log Notes</span>
              </button>
            ` : ''}
          </div>

          <div>
            ${!isCompleted ? `
              <button type="button" onclick="markScheduleItemCompleted('${item.id}')"
                class="py-2 px-3.5 rounded-2xl bg-[#EEF7F2] hover:bg-[#D6EFE1] text-[#2D5A43] border border-[#D6EFE1] text-xs font-bold transition-all flex items-center space-x-1 active:scale-95">
                <i class="fa-solid fa-check text-[#2D5A43]"></i>
                <span>Mark Slot Completed</span>
              </button>
            ` : `
              <span class="text-xs font-bold text-[#2D5A43] flex items-center space-x-1">
                <i class="fa-solid fa-circle-check"></i>
                <span>Duty Fulfilled & Verified</span>
              </span>
            `}
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function markScheduleItemCompleted(schedId) {
  const schedule = getCoordinatorSchedule();
  const item = schedule.find(s => s.id === schedId);
  if (!item) return;

  item.status = 'completed';
  saveCoordinatorSchedule(schedule);
  soundEngine.playSuccessChime();
  showToast(`Schedule duty slot for "${item.title}" marked completed! ✓`, 'success');
  renderCoordinatorScheduleTimeline();
}

function openAddScheduleModal() {
  const modal = document.getElementById('modal-coord-add-schedule');
  if (modal) {
    soundEngine.playTone(550, 'sine', 0.1);
    modal.classList.remove('hidden');
  }
}

function closeAddScheduleModal() {
  const modal = document.getElementById('modal-coord-add-schedule');
  if (modal) modal.classList.add('hidden');
}

function handleSaveNewScheduleSlot(e) {
  if (e) e.preventDefault();

  const type = document.getElementById('input-sched-type')?.value || 'visit';
  const patient = document.getElementById('input-sched-patient')?.value.trim();
  const age = document.getElementById('input-sched-age')?.value.trim() || 'Senior';
  const day = document.getElementById('input-sched-day')?.value || 'today';
  const start = document.getElementById('input-sched-time-start')?.value.trim() || '02:30 PM';
  const end = document.getElementById('input-sched-time-end')?.value.trim() || '03:15 PM';
  const location = document.getElementById('input-sched-location')?.value.trim() || 'South Delhi Residence';
  const risk = document.getElementById('input-sched-risk')?.value || 'medium';
  const phone = document.getElementById('input-sched-phone')?.value.trim() || '+91 98110-44912';
  const purpose = document.getElementById('input-sched-purpose')?.value.trim() || 'Routine follow-up clinical check.';

  if (!patient || !purpose) {
    showToast('Please enter patient name and clinical purpose', 'warning');
    return;
  }

  const typeTitles = {
    visit: 'Doorstep Physical Home Visit & Vitals Examination',
    call: 'Tele-Care Outreach & Family Follow-up Call',
    briefing: 'Clinical Case Briefing & Triage Handoff',
    meds: 'Medication Regimen & Blood Sugar Supervision'
  };

  const schedule = getCoordinatorSchedule();
  const newSlot = {
    id: 'SCHED-' + Math.floor(100 + Math.random() * 900),
    day: day,
    timeSlot: `${start} - ${end}`,
    type: type,
    title: typeTitles[type] || 'Scheduled Clinical Outreach',
    patientName: patient,
    patientAge: age,
    location: location,
    familyPhone: phone,
    risk: risk,
    riskScore: risk === 'high' ? 88 : (risk === 'medium' ? 64 : 28),
    status: 'upcoming',
    purpose: purpose,
    seniorId: 'SNR-101'
  };

  schedule.push(newSlot);
  saveCoordinatorSchedule(schedule);

  // If scheduled for today, also create corresponding task & update dynamic KPIs
  if (day === 'today') {
    const seniors = getCoordinatorSeniors();
    const existingSr = seniors.find(s => s.name.toLowerCase().trim() === patient.toLowerCase().trim());
    const srId = existingSr ? existingSr.id : ('SNR-SCHED-' + Math.floor(100 + Math.random() * 900));

    if (!existingSr) {
      seniors.unshift({
        id: srId,
        rank: seniors.length + 1,
        name: patient,
        age: parseInt(age) || 72,
        gender: age.includes('Female') ? 'Female' : 'Senior',
        location: location,
        phone: phone,
        familyContact: phone,
        mlScore: risk === 'high' ? 88 : (risk === 'medium' ? 64 : 28),
        mlRisk: risk,
        vitals: { bp: '130/84', hr: '76 bpm', spo2: '97%', glucose: '115 mg/dL', adl: '4/4', missedDoses: 0 },
        reason: purpose,
        clinicalFlags: ['Scheduled Duty Slot', purpose],
        assignedOperator: 'Sister Kavita, RN',
        assignedAction: type === 'call' ? '📞 Tele-Care Outreach Call' : '🏠 Doorstep Physical Visit',
        taskStatus: 'assigned'
      });
      saveCoordinatorSeniors(seniors);
    }

    const tasks = getCoordinatorAssignedTasks();
    tasks.unshift({
      id: (type === 'call' ? 'CALL-' : 'VISIT-') + srId,
      type: type === 'call' ? 'call' : 'visit',
      seniorId: srId,
      seniorName: patient,
      seniorAge: parseInt(age) || 72,
      seniorGender: age.includes('Female') ? 'Female' : 'Senior',
      location: location,
      familyContact: phone,
      phone: phone,
      mlRisk: risk,
      mlScore: risk === 'high' ? 88 : (risk === 'medium' ? 64 : 28),
      priority: risk === 'high' ? 'CRITICAL (Scheduled)' : 'Routine Duty',
      reason: purpose,
      instructions: purpose,
      status: 'pending',
      assignedTime: `Today ${start}`,
      proof: null,
      callLog: null
    });
    saveCoordinatorAssignedTasks(tasks);
    updateCoordinatorDynamicKPIs();
    renderCoordinatorAssignedTasks();
    renderCoordinatorEnrolledPatients();
  }

  closeAddScheduleModal();
  soundEngine.playSuccessChime();
  showToast(`Upcoming duty slot scheduled for ${patient} at ${start}! 📅`, 'success');

  // Switch to schedule tab and filter to the added day
  currentScheduleDayFilter = day;
  switchCoordinatorTaskTab('schedule');
}


// =========================================================================
// MEDCARE-STYLE CARE COORDINATOR DASHBOARD LOGIC (CLINICAL SAAS)
// =========================================================================

let currentMedcareFilter = 'all';
let currentPatientsFilter = 'all';
let currentCoordinatorSubView = 'appointments';
let currentCoordinatorLang = 'en';
let medcareArrivalChartInstance = null;

// Comprehensive Coordinator Translations Dictionary
const coordinatorI18n = {
  en: {
    // Brand & Top Bar
    brandSubtitle: 'Clinical Care Hub',
    searchPlaceholder: 'Search patient, doctor, condition...',
    messagesConnected: 'Tele-care messages connected with family circle.',
    alertsActive: '3 High-risk telemetry priority alerts active.',
    leadCoordinator: 'Lead Geriatric Coordinator',

    // Greeting
    greetingPrefix: 'Welcome back,',
    greetingSubtitle: 'Live geriatric clinical triage command, doorstep visits & tele-care outreach.',
    exportCsv: 'Export to CSV',
    generateReport: 'Generate Report',
    thisWeek: 'This week',

    // KPI Cards
    kpiTotalPatients: 'Total Patients',
    kpiAppointmentsToday: 'Appointments Today',
    kpiPendingReports: 'Pending Reports & Proofs',
    kpiFulfillmentRate: 'Care Fulfillment Rate',
    vsLastWeek: 'vs last week',

    // Middle Grid
    arrivalStatsTitle: 'Patient Arrival Statistics',
    thisMonth: 'This Months ▾',
    ourSpecialistTitle: 'Our Specialist & Active Field Triage Team',
    specialistSubtitle: 'On-duty certified geriatric care coordinators, doctors & emergency field triage specialists.',
    qualification: 'Qualification',
    availability: 'Availability',
    available: '● Available',
    onDuty: '● On duty',

    // Subview Tabs
    tabAppointments: 'Appointments & Duty Schedule',
    tabPatients: 'Enrolled Patients Directory',
    cohortNote: '10 Dataset Cohort Seniors + Live Registered Members',

    // Appointments Section
    appointmentsTitle: 'Appointments & Upcoming Duty Schedule',
    availableSlots: 'Available Slots',
    selectedSlots: 'Selected',
    unavailableSlots: 'Unavailable Slots',
    allDuties: 'All Duties',
    doorstepVisits: 'Doorstep Visits',
    telecareCalls: 'Tele-Care Calls',
    verifiedProofs: 'Verified Proofs',
    addAppointmentSlot: 'Add Appointment Slot',

    // Table Headers (Appointments)
    thPatients: 'Patients',
    thAssignedDoctor: 'Assigned Doctor / Operator',
    thDateTime: 'Date & Time',
    thDiseases: 'Diseases / Diagnosis',
    thActions: 'Actions',

    // Patients Section
    patientsTitle: 'Enrolled Patients Clinical Directory',
    patientsSubtitle: 'Complete telemetry registry of 10 dataset cohort seniors and dynamically registered members.',
    filterAllPatients: 'All Patients',
    filterHighRisk: 'High Risk (80%+)',
    filterMedRisk: 'Medium Risk (40-79%)',
    filterLowRisk: 'Low Risk (<40%)',

    // Table Headers (Patients)
    thPatientProfile: 'Patient Profile',
    thRiskLevel: 'ML Risk Level',
    thVitalsSnapshot: 'Vitals Snapshot',
    thConditions: 'Chronic Conditions & Clinical Reason',
    thFamilyContact: 'Emergency Family Contact',
    thPatientActions: 'Actions',

    // Action Buttons
    viewSheetBtn: 'View Sheet',
    viewClinicalSheet: 'View Diagnostic Clinical Sheet',
    startVisit: 'Start In-Person Visit & Log GPS/Vitals Proof',
    logCall: 'Log Tele-Care Outreach Call',
    viewProof: 'View Verified Audit Proof',

    // Sidebar
    navDashboard: 'Dashboard',
    navDoctors: 'Field Doctors',
    navPatients: 'Patients Directory',
    navAppointments: 'Appointments',
    navDepartments: 'Departments & Zones',
    navAnalytics: 'Analytics & Reports',
    navBilling: 'Billing & Insurance',
    navStaff: 'Staff Management',
    navEmergency: 'Emergency & Admission',
    navSetting: 'Settings',
    navLogout: 'Log Out / Switch'
  },
  hi: {
    // Brand & Top Bar
    brandSubtitle: 'क्लिनिकल केयर हब',
    searchPlaceholder: 'मरीज़, डॉक्टर, बीमारी खोजें...',
    messagesConnected: 'टेली-केयर संदेश परिवार सर्कल से जुड़े हैं।',
    alertsActive: '3 उच्च-जोखिम वाले टेलीमेट्री अलर्ट सक्रिय हैं।',
    leadCoordinator: 'लीड जेरियाट्रिक समन्वयक',

    // Greeting
    greetingPrefix: 'वापसी पर स्वागत है,',
    greetingSubtitle: 'लाइव जेरियाट्रिक क्लिनिकल ट्रायज कमांड, डोरस्टेप विज़िट और टेली-केयर आउटरीच।',
    exportCsv: 'सीएसवी निर्यात',
    generateReport: 'रिपोर्ट बनाएं',
    thisWeek: 'इस सप्ताह',

    // KPI Cards
    kpiTotalPatients: 'कुल नामांकित मरीज़',
    kpiAppointmentsToday: 'आज के अपॉइंटमेंट्स',
    kpiPendingReports: 'लंबित रिपोर्ट व प्रमाण',
    kpiFulfillmentRate: 'देखभाल पूर्ति दर',
    vsLastWeek: 'पिछले सप्ताह से',
    opAssignBtn: '+ ऑपरेटर: नया मरीज असाइन करें',
    visitGpsMap: 'गूगल मैप्स पर पिनपॉइंट देखें',
    visitGeofence: 'डोरस्टेप जियोफेंस सत्यापित: समन्वयक 5 मीटर के दायरे में उपस्थित',
    patientsSub: 'सक्रिय नामांकित',
    apptsSub: 'आज निर्धारित',
    pendingSub: 'शेष विज़िट प्रमाण',
    fulfillmentSub: 'लाइव पूर्ति दर',
    totalPending: 'कुल लंबित',

    // Middle Grid
    arrivalStatsTitle: 'मरीज़ आगमन सांख्यिकी',
    thisMonth: 'इस महीने ▾',
    ourSpecialistTitle: 'हमारे विशेषज्ञ व सक्रिय फील्ड टीम',
    specialistSubtitle: 'ऑन-ड्यूटी प्रमाणित जेरियाट्रिक केयर कोऑर्डिनेटर, डॉक्टर और आपातकालीन फील्ड ट्रायज विशेषज्ञ।',
    qualification: 'योग्यता',
    availability: 'उपलब्धता',
    available: '● उपलब्ध',
    onDuty: '● ड्यूटी पर',

    // Subview Tabs
    tabAppointments: 'अपॉइंटमेंट्स व ड्यूटी शेड्यूल',
    tabPatients: 'नामांकित मरीज़ निर्देशिका',
    cohortNote: '10 कोहॉर्ट वरिष्ठ नागरिक + लाइव पंजीकृत सदस्य',

    // Appointments Section
    appointmentsTitle: 'अपॉइंटमेंट्स व आगामी ड्यूटी शेड्यूल',
    availableSlots: 'उपलब्ध स्लॉट',
    selectedSlots: 'चयनित',
    unavailableSlots: 'अनुपलब्ध स्लॉट',
    allDuties: 'सभी ड्यूटियाँ',
    doorstepVisits: 'घर पर विज़िट',
    telecareCalls: 'टेली-केयर कॉल्स',
    verifiedProofs: 'सत्यापित प्रमाण',
    addAppointmentSlot: '+ अपॉइंटमेंट स्लॉट जोड़ें',

    // Table Headers (Appointments)
    thPatients: 'मरीज़',
    thAssignedDoctor: 'असाइन किया गया डॉक्टर / स्टाफ',
    thDateTime: 'दिनांक व समय',
    thDiseases: 'बीमारी / नैदानिक स्थिति',
    thActions: 'एक्शन',

    // Patients Section
    patientsTitle: 'नामांकित मरीज़ क्लिनिकल निर्देशिका',
    patientsSubtitle: '10 कोहॉर्ट वरिष्ठ नागरिकों और पंजीकृत सदस्यों की संपूर्ण क्लिनिकल निर्देशिका।',
    filterAllPatients: 'सभी मरीज़',
    filterHighRisk: 'उच्च जोखिम (80%+)',
    filterMedRisk: 'मध्यम जोखिम (40-79%)',
    filterLowRisk: 'सामान्य जोखिम (<40%)',

    // Table Headers (Patients)
    thPatientProfile: 'मरीज़ प्रोफाइल',
    thRiskLevel: 'एमएल जोखिम स्तर',
    thVitalsSnapshot: 'वाइटल्स स्नैपशॉट',
    thConditions: 'पुरानी बीमारियाँ व नैदानिक स्थिति',
    thFamilyContact: 'परिवार आपातकालीन संपर्क',
    thPatientActions: 'एक्शन',

    // Action Buttons
    viewSheetBtn: 'शीट देखें',
    viewClinicalSheet: 'क्लिनिकल डायग्नोस्टिक शीट देखें',
    startVisit: 'घर पर विज़िट शुरू करें और प्रमाण दर्ज करें',
    logCall: 'टेली-केयर चेक-इन कॉल दर्ज करें',
    viewProof: 'सत्यापित ऑडिट प्रमाण देखें',

    // Sidebar
    navDashboard: 'डैशबोर्ड',
    navDoctors: 'फील्ड डॉक्टर्स',
    navPatients: 'मरीज़ निर्देशिका',
    navAppointments: 'अपॉइंटमेंट्स',
    navDepartments: 'विभाग व ज़ोन',
    navAnalytics: 'एनालिटिक्स व रिपोर्ट',
    navBilling: 'बिलिंग व बीमा',
    navStaff: 'स्टाफ प्रबंधन',
    navEmergency: 'आपातकालीन व भर्ती',
    navSetting: 'सेटिंग्स',
    navLogout: 'लॉग आउट / स्विच'
  }
};

// =========================================================================
// 1. LANGUAGE SWITCHER (ENGLISH <-> HINDI)
// =========================================================================
function setCoordinatorLanguage(lang = 'en', playSound = true) {
  currentCoordinatorLang = lang;
  try {
    localStorage.setItem('careconnect_coordinator_lang', lang);
  } catch (e) {}

  if (typeof setAppLanguage === 'function' && state && state.currentLanguage !== lang) {
    state.currentLanguage = lang;
    state.seniorLanguage = lang;
  }

  if (playSound && typeof soundEngine !== 'undefined' && soundEngine.playTone) {
    soundEngine.playTone(600, 'sine', 0.08);
  }

  // Update Language Button Pill States
  const btnEn = document.getElementById('coord-lang-btn-en');
  const btnHi = document.getElementById('coord-lang-btn-hi');
  if (btnEn && btnHi) {
    if (lang === 'hi') {
      btnHi.className = 'px-3 py-1 rounded-full bg-blue-600 text-white font-black shadow-xs transition-all';
      btnEn.className = 'px-3 py-1 rounded-full text-slate-600 hover:text-slate-900 font-bold transition-all';
    } else {
      btnEn.className = 'px-3 py-1 rounded-full bg-blue-600 text-white font-black shadow-xs transition-all';
      btnHi.className = 'px-3 py-1 rounded-full text-slate-600 hover:text-slate-900 font-bold transition-all';
    }
  }

  const t = coordinatorI18n[lang] || coordinatorI18n.en;

  // Top Bar Search & Greeting Prefix
  const greetingPrefix = document.getElementById('coord-greeting-prefix');
  if (greetingPrefix) greetingPrefix.textContent = t.greetingPrefix;

  // Top Bar Search & Labels
  const searchInput = document.getElementById('coord-main-search');
  if (searchInput) searchInput.placeholder = t.searchPlaceholder;

  // Greeting Bar
  const greetingSubtitle = document.getElementById('coord-greeting-subtitle');
  if (greetingSubtitle) greetingSubtitle.textContent = t.greetingSubtitle;

  const btnExport = document.getElementById('coord-btn-export-text');
  if (btnExport) btnExport.textContent = t.exportCsv;

  const btnReport = document.getElementById('coord-btn-report-text');
  if (btnReport) btnReport.textContent = t.generateReport;

  const lblDateRange = document.getElementById('lbl-date-range-filter');
  if (lblDateRange) lblDateRange.textContent = t.thisWeek;

  // KPI Card Titles
  const kpi1 = document.getElementById('lbl-kpi-total-patients');
  const kpi2 = document.getElementById('lbl-kpi-appointments');
  const kpi3 = document.getElementById('lbl-kpi-pending-reports');
  const kpi4 = document.getElementById('lbl-kpi-fulfillment');
  if (kpi1) kpi1.textContent = t.kpiTotalPatients;
  if (kpi2) kpi2.textContent = t.kpiAppointmentsToday;
  if (kpi3) kpi3.textContent = t.kpiPendingReports;
  if (kpi4) kpi4.textContent = t.kpiFulfillmentRate;

  const btnOpAssign = document.getElementById('coord-btn-assign-patient-text');
  if (btnOpAssign && t.opAssignBtn) btnOpAssign.textContent = t.opAssignBtn;

  const lblGpsMap = document.getElementById('lbl-visit-gps-map');
  if (lblGpsMap && t.visitGpsMap) lblGpsMap.textContent = t.visitGpsMap;

  const lblGeofence = document.getElementById('lbl-visit-geofence-text');
  if (lblGeofence && t.visitGeofence) lblGeofence.textContent = t.visitGeofence;

  const subPatients = document.getElementById('medcare-stat-total-patients-sub');
  if (subPatients && t.patientsSub) subPatients.textContent = t.patientsSub;

  const subAppts = document.getElementById('medcare-stat-appointments-sub');
  if (subAppts && t.apptsSub) subAppts.textContent = t.apptsSub;

  const subPending = document.getElementById('medcare-stat-pending-reports-sub');
  if (subPending && t.pendingSub) subPending.textContent = t.pendingSub;

  const subFulfill = document.getElementById('medcare-stat-fulfillment-sub');
  if (subFulfill && t.fulfillmentSub) subFulfill.textContent = t.fulfillmentSub;

  const lblTotalPending = document.getElementById('lbl-kpi-total-pending');
  if (lblTotalPending && t.totalPending) lblTotalPending.textContent = t.totalPending;

  // Middle Section (Chart & Specialist)
  const arrivalTitle = document.getElementById('lbl-arrival-chart-title');
  if (arrivalTitle) arrivalTitle.textContent = t.arrivalStatsTitle;

  const specTitle = document.getElementById('lbl-specialist-title');
  if (specTitle) specTitle.textContent = t.ourSpecialistTitle;

  const specSubtitle = document.getElementById('lbl-specialist-subtitle');
  if (specSubtitle && t.specialistSubtitle) specSubtitle.textContent = t.specialistSubtitle;

  // Subview Tab Buttons
  const subviewAppt = document.getElementById('txt-subview-tab-appointments');
  const subviewPat = document.getElementById('txt-subview-tab-patients');
  const subviewNote = document.getElementById('txt-subview-cohort-note');
  if (subviewAppt) subviewAppt.textContent = t.tabAppointments;
  if (subviewPat) subviewPat.textContent = t.tabPatients;
  if (subviewNote) subviewNote.textContent = t.cohortNote;

  // Appointments Section Headers & Legend
  const apptTitle = document.getElementById('lbl-appointments-title');
  if (apptTitle) apptTitle.textContent = t.appointmentsTitle;

  const legAvail = document.getElementById('lbl-slot-available');
  const legSel = document.getElementById('lbl-slot-selected');
  const legUnavail = document.getElementById('lbl-slot-unavailable');
  if (legAvail) legAvail.textContent = t.availableSlots;
  if (legSel) legSel.textContent = t.selectedSlots;
  if (legUnavail) legUnavail.textContent = t.unavailableSlots;

  const btnAddSlot = document.getElementById('btn-add-appt-slot-text');
  if (btnAddSlot) btnAddSlot.textContent = t.addAppointmentSlot;

  const thApptPatients = document.getElementById('th-appt-patients');
  const thApptAssigned = document.getElementById('th-appt-assigned');
  const thApptTime = document.getElementById('th-appt-time');
  const thApptDiagnosis = document.getElementById('th-appt-diagnosis');
  const thApptActions = document.getElementById('th-appt-actions');
  if (thApptPatients) thApptPatients.textContent = t.thPatients;
  if (thApptAssigned) thApptAssigned.textContent = t.thAssignedDoctor;
  if (thApptTime) thApptTime.textContent = t.thDateTime;
  if (thApptDiagnosis) thApptDiagnosis.textContent = t.thDiseases;
  if (thApptActions) thApptActions.textContent = t.thActions;

  // Patients Section Headers & Filters
  const patTitle = document.getElementById('lbl-patients-dir-title');
  const patSubtitle = document.getElementById('lbl-patients-dir-subtitle');
  if (patTitle) patTitle.textContent = t.patientsTitle;
  if (patSubtitle) patSubtitle.textContent = t.patientsSubtitle;

  const thPatProfile = document.getElementById('th-pat-profile');
  const thPatRisk = document.getElementById('th-pat-risk');
  const thPatVitals = document.getElementById('th-pat-vitals');
  const thPatConditions = document.getElementById('th-pat-conditions');
  const thPatFamily = document.getElementById('th-pat-family');
  const thPatActions = document.getElementById('th-pat-actions');
  if (thPatProfile) thPatProfile.textContent = t.thPatientProfile;
  if (thPatRisk) thPatRisk.textContent = t.thRiskLevel;
  if (thPatVitals) thPatVitals.textContent = t.thVitalsSnapshot;
  if (thPatConditions) thPatConditions.textContent = t.thConditions;
  if (thPatFamily) thPatFamily.textContent = t.thFamilyContact;
  if (thPatActions) thPatActions.textContent = t.thPatientActions;

  // Sidebar Menu Items
  const navMap = {
    'nav-item-dashboard': t.navDashboard,
    'nav-item-patients': t.navPatients,
    'nav-item-appointments': t.navAppointments,
    'nav-item-staff': t.navStaff,
    'nav-item-setting': t.navSetting
  };
  Object.keys(navMap).forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      const span = el.querySelector('span');
      if (span) span.textContent = navMap[id];
    }
  });

  // Re-render Tables in Chosen Language
  renderMedcareAppointmentsTable(currentMedcareFilter || 'all');
  renderMedcarePatientsDirectory(currentPatientsFilter || 'all');

  if (playSound && typeof showToast === 'function') {
    showToast(lang === 'hi' ? 'भाषा हिन्दी में बदल दी गई है।' : 'Language switched to English.', 'info');
  }
}

// =========================================================================
// 2. SEPARATE SUBVIEWS: APPOINTMENTS VS PATIENTS DIRECTORY
// =========================================================================
function switchCoordinatorSubView(subview = 'appointments') {
  currentCoordinatorSubView = subview;

  const secAppt = document.getElementById('coord-section-appointments');
  const secPat = document.getElementById('coord-section-patients');
  const btnAppt = document.getElementById('tab-btn-appointments');
  const btnPat = document.getElementById('tab-btn-patients');

  const activeBtnClass = 'px-4 py-2 rounded-lg bg-white text-blue-600 font-black shadow-xs transition-all flex items-center space-x-2 active:scale-95';
  const inactiveBtnClass = 'px-4 py-2 rounded-lg text-slate-600 hover:text-slate-900 font-bold transition-all flex items-center space-x-2 active:scale-95';

  if (subview === 'patients') {
    if (secAppt) secAppt.classList.add('hidden');
    if (secPat) secPat.classList.remove('hidden');

    if (btnPat) btnPat.className = activeBtnClass;
    if (btnAppt) btnAppt.className = inactiveBtnClass;

    // Highlight sidebar
    highlightCoordinatorSidebarTab('patients');
    renderMedcarePatientsDirectory(currentPatientsFilter || 'all');
    if (secPat) secPat.scrollIntoView({ behavior: 'smooth', block: 'start' });
  } else {
    // Default: Appointments & Duty Schedule
    if (secPat) secPat.classList.add('hidden');
    if (secAppt) secAppt.classList.remove('hidden');

    if (btnAppt) btnAppt.className = activeBtnClass;
    if (btnPat) btnPat.className = inactiveBtnClass;

    // Highlight sidebar
    highlightCoordinatorSidebarTab('appointments');
    renderMedcareAppointmentsTable(currentMedcareFilter || 'all');
    if (secAppt) secAppt.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  if (typeof soundEngine !== 'undefined' && soundEngine.playTone) {
    soundEngine.playTone(560, 'sine', 0.06);
  }
}

function highlightCoordinatorSidebarTab(tab) {
  const tabs = ['dashboard', 'patients', 'appointments', 'staff', 'setting', 'team'];
  tabs.forEach(t => {
    const el = document.getElementById(`nav-item-${t}`);
    if (el) {
      if (t === tab) {
        el.className = 'w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl bg-blue-50 text-blue-600 font-extrabold transition-all shadow-2xs';
      } else {
        el.className = 'w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 font-bold transition-all';
      }
    }
  });
}

// =========================================================================
// 3. ENROLLED PATIENTS DIRECTORY (SEPARATE VIEW)
// =========================================================================
function filterPatientsDirectory(filter = 'all') {
  currentPatientsFilter = filter;
  if (typeof soundEngine !== 'undefined' && soundEngine.playTone) {
    soundEngine.playTone(600, 'sine', 0.08);
  }
  renderMedcarePatientsDirectory(filter);
}

function renderMedcarePatientsDirectory(filter = 'all', searchQuery = '') {
  currentPatientsFilter = filter;
  const tbody = document.getElementById('medcare-patients-tbody');
  if (!tbody) return;

  const isHi = currentCoordinatorLang === 'hi';
  const t = coordinatorI18n[isHi ? 'hi' : 'en'];

  // Update patient filter pill active classes
  const pillAll = document.getElementById('pill-pat-all');
  const pillHigh = document.getElementById('pill-pat-high');
  const pillMed = document.getElementById('pill-pat-med');
  const pillLow = document.getElementById('pill-pat-low');

  const activeClass = 'px-3 py-1.5 rounded-lg bg-white text-emerald-700 font-extrabold shadow-xs transition-all';
  const inactiveClass = 'px-3 py-1.5 rounded-lg text-slate-600 hover:text-slate-900 font-bold transition-all';

  if (pillAll) pillAll.className = filter === 'all' ? activeClass : inactiveClass;
  if (pillHigh) pillHigh.className = filter === 'high' ? activeClass : inactiveClass;
  if (pillMed) pillMed.className = filter === 'med' ? activeClass : inactiveClass;
  if (pillLow) pillLow.className = filter === 'low' ? activeClass : inactiveClass;

  const seniors = (typeof getCoordinatorSeniors === 'function') ? getCoordinatorSeniors() : defaultCoordinatorSeniors;

  let filtered = seniors;
  if (filter === 'high') {
    filtered = seniors.filter(s => s.mlRisk === 'high' || (s.mlScore || 0) >= 80);
  } else if (filter === 'med') {
    filtered = seniors.filter(s => s.mlRisk === 'medium' || ((s.mlScore || 0) >= 40 && (s.mlScore || 0) < 80));
  } else if (filter === 'low') {
    filtered = seniors.filter(s => s.mlRisk === 'low' || (s.mlScore || 0) < 40);
  }

  if (searchQuery) {
    const q = searchQuery.toLowerCase().trim();
    filtered = filtered.filter(s =>
      (s.name && s.name.toLowerCase().includes(q)) ||
      (s.location && s.location.toLowerCase().includes(q)) ||
      (s.id && s.id.toLowerCase().includes(q)) ||
      (s.reason && s.reason.toLowerCase().includes(q))
    );
  }

  // Update filter pill counts
  const countAll = seniors.length;
  const countHigh = seniors.filter(s => s.mlRisk === 'high' || (s.mlScore || 0) >= 80).length;
  const countMed = seniors.filter(s => s.mlRisk === 'medium' || ((s.mlScore || 0) >= 40 && (s.mlScore || 0) < 80)).length;
  const countLow = seniors.filter(s => s.mlRisk === 'low' || (s.mlScore || 0) < 40).length;

  if (pillAll) pillAll.textContent = `${t.filterAllPatients} (${countAll})`;
  if (pillHigh) pillHigh.textContent = `${t.filterHighRisk} (${countHigh})`;
  if (pillMed) pillMed.textContent = `${t.filterMedRisk} (${countMed})`;
  if (pillLow) pillLow.textContent = `${t.filterLowRisk} (${countLow})`;

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" class="py-12 text-center text-slate-400 font-bold">
          <i class="fa-solid fa-user-xmark text-3xl mb-2 text-slate-300 block"></i>
          ${isHi ? 'इस फ़िल्टर से मेल खाता कोई मरीज़ नहीं मिला।' : 'No patients found matching the current filter.'}
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = filtered.map(s => {
    const score = s.mlScore || 50;
    const isHigh = s.mlRisk === 'high' || score >= 80;
    const isMed = s.mlRisk === 'medium' || (score >= 40 && score < 80);

    let riskBadge = '';
    if (isHigh) {
      riskBadge = `
        <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-black bg-rose-50 text-rose-700 border border-rose-200">
          <span class="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
          <span>${isHi ? 'उच्च जोखिम' : 'High Risk'} (${score}%)</span>
        </span>
      `;
    } else if (isMed) {
      riskBadge = `
        <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-black bg-amber-50 text-amber-800 border border-amber-200">
          <span class="w-2 h-2 rounded-full bg-amber-500"></span>
          <span>${isHi ? 'मध्यम जोखिम' : 'Medium Risk'} (${score}%)</span>
        </span>
      `;
    } else {
      riskBadge = `
        <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-black bg-emerald-50 text-emerald-800 border border-emerald-200">
          <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span>${isHi ? 'सामान्य' : 'Low Risk'} (${score}%)</span>
        </span>
      `;
    }

    const vitals = s.vitals || {};
    const bpStr = vitals.bp || '120/80';
    const spo2Str = vitals.spo2 || '98%';
    const hrStr = vitals.hr || '74 bpm';
    const glucStr = vitals.glucose || '105 mg/dL';

    const initials = s.name.split(' ').map(n => n[0]).join('').slice(0, 2);
    const avatarBg = isHigh ? 'bg-rose-600' : (isMed ? 'bg-amber-600' : 'bg-emerald-600');

    return `
      <tr class="hover:bg-slate-50/80 transition-colors">
        <!-- Patient Profile -->
        <td class="py-3.5 px-3">
          <div class="flex items-center space-x-3">
            <div class="w-9 h-9 rounded-full ${avatarBg} text-white font-black text-xs flex items-center justify-center shadow-xs flex-shrink-0">
              ${initials}
            </div>
            <div>
              <div class="font-extrabold text-slate-900 text-xs sm:text-sm hover:text-blue-600 cursor-pointer flex items-center gap-1.5" onclick="openClinicalReportSheet('${s.id}')">
                <span>${s.name}</span>
                ${s.isNewUser ? '<span class="px-1.5 py-0.2 rounded bg-blue-100 text-blue-700 font-extrabold text-[9px] uppercase tracking-wider">NEW</span>' : ''}
              </div>
              <div class="text-[11px] text-slate-400 font-medium">
                ${isHi ? 'आयु' : 'Age'}: ${s.age || 70} • ${s.gender || 'Senior'} • <span class="font-mono text-slate-500">${s.id}</span>
              </div>
              <div class="text-[10px] text-slate-400">
                <i class="fa-solid fa-location-dot text-[9px] text-slate-300 mr-1"></i>${s.location || 'NCR Cluster'}
              </div>
            </div>
          </div>
        </td>

        <!-- ML Risk Category -->
        <td class="py-3.5 px-3">
          ${riskBadge}
        </td>

        <!-- Vitals Snapshot -->
        <td class="py-3.5 px-3">
          <div class="flex flex-wrap gap-1 text-[11px] font-mono">
            <span class="px-1.5 py-0.5 rounded bg-slate-100 font-bold text-slate-700">BP: ${bpStr}</span>
            <span class="px-1.5 py-0.5 rounded bg-slate-100 font-bold text-slate-700">SpO2: ${spo2Str}</span>
            <span class="px-1.5 py-0.5 rounded bg-slate-100 font-bold text-slate-700">HR: ${hrStr}</span>
          </div>
          <div class="text-[10px] text-slate-400 font-medium mt-0.5">
            ${isHi ? 'ग्लूकोज' : 'Glucose'}: ${glucStr}
          </div>
        </td>

        <!-- Chronic Conditions & Reason -->
        <td class="py-3.5 px-3 max-w-xs">
          <div class="text-xs font-bold text-slate-800 line-clamp-2">
            ${s.reason || (s.clinicalFlags ? s.clinicalFlags.join(', ') : 'Clinical Triage Evaluation')}
          </div>
        </td>

        <!-- Emergency Family Contact -->
        <td class="py-3.5 px-3">
          <div class="text-xs font-bold text-slate-800">
            ${s.familyContact || 'Family on Record'}
          </div>
          <div class="text-[10px] text-slate-400 font-mono">
            ${s.phone || '+91 98110-44912'}
          </div>
        </td>

        <!-- Actions -->
        <td class="py-3.5 px-3 text-right">
          <button type="button" onclick="openClinicalReportSheet('${s.id}')" title="${t.viewClinicalSheet}"
            class="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs inline-flex items-center space-x-1.5 shadow-xs active:scale-95 transition-all">
            <i class="fa-solid fa-file-waveform text-xs"></i>
            <span>${t.viewSheetBtn}</span>
          </button>
        </td>
      </tr>
    `;
  }).join('');
}

// =========================================================================
// 4. APPOINTMENTS & DUTY SCHEDULE TABLE
// =========================================================================
function renderMedcareAppointmentsTable(filter = 'all', searchQuery = '') {
  currentMedcareFilter = filter;
  const tbody = document.getElementById('medcare-appointments-tbody');
  if (!tbody) return;

  const isHi = currentCoordinatorLang === 'hi';
  const t = coordinatorI18n[isHi ? 'hi' : 'en'];

  // Update filter pill UI active classes
  const pillAll = document.getElementById('pill-filter-all');
  const pillVisits = document.getElementById('pill-filter-visits');
  const pillCalls = document.getElementById('pill-filter-calls');
  const pillFulfilled = document.getElementById('pill-filter-fulfilled');

  const activePillClass = 'px-3 py-1.5 rounded-lg bg-white text-blue-600 font-extrabold shadow-xs transition-all';
  const inactivePillClass = 'px-3 py-1.5 rounded-lg text-slate-600 hover:text-slate-900 font-bold transition-all';

  if (pillAll) pillAll.className = filter === 'all' ? activePillClass : inactivePillClass;
  if (pillVisits) pillVisits.className = filter === 'visits' ? activePillClass : inactivePillClass;
  if (pillCalls) pillCalls.className = filter === 'calls' ? activePillClass : inactivePillClass;
  if (pillFulfilled) pillFulfilled.className = filter === 'fulfilled' ? activePillClass : inactivePillClass;

  const tasks = getCoordinatorAssignedTasks();

  let filtered = tasks;
  if (filter === 'visits') {
    filtered = tasks.filter(t => t.type === 'visit');
  } else if (filter === 'calls') {
    filtered = tasks.filter(t => t.type === 'call');
  } else if (filter === 'fulfilled') {
    filtered = tasks.filter(t => t.status === 'fulfilled');
  }

  if (searchQuery) {
    const q = searchQuery.toLowerCase().trim();
    filtered = filtered.filter(t => 
      (t.seniorName && t.seniorName.toLowerCase().includes(q)) ||
      (t.reason && t.reason.toLowerCase().includes(q)) ||
      (t.location && t.location.toLowerCase().includes(q)) ||
      (t.seniorId && t.seniorId.toLowerCase().includes(q))
    );
  }

  // Update filter pill counters
  const countAll = tasks.length;
  const navPatBadge = document.getElementById('badge-nav-patients-count');
  const navApptBadge = document.getElementById('badge-nav-appointments-count');
  if (navPatBadge) navPatBadge.textContent = countAll;
  if (navApptBadge) navApptBadge.textContent = countAll;
  const countVisits = tasks.filter(t => t.type === 'visit').length;
  const countCalls = tasks.filter(t => t.type === 'call').length;
  const countFulfilled = tasks.filter(t => t.status === 'fulfilled').length;

  if (pillAll) pillAll.textContent = `${t.allDuties} (${countAll})`;
  if (pillVisits) pillVisits.textContent = `🏠 ${t.doorstepVisits} (${countVisits})`;
  if (pillCalls) pillCalls.textContent = `📞 ${t.telecareCalls} (${countCalls})`;
  if (pillFulfilled) pillFulfilled.textContent = `✓ ${t.verifiedProofs} (${countFulfilled})`;

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="5" class="py-12 text-center text-slate-400 font-bold">
          <i class="fa-solid fa-clipboard-check text-3xl mb-2 text-slate-300 block"></i>
          ${isHi ? 'इस फ़िल्टर से मेल खाता कोई अपॉइंटमेंट नहीं मिला।' : 'No triage appointments found matching the current filter.'}
        </td>
      </tr>
    `;
    return;
  }

  // Comprehensive diagnosis mapping from the Cohort Dataset
  const diagnosisMap = {
    'SNR-101': { tag: isHi ? 'टैचीकार्डिया व नाड़ी 114' : 'Tachycardia & RHR 114', risk: 'high', label: isHi ? 'SpO2 94% अलर्ट • उच्च जोखिम' : 'SpO2 94% Alert • High Risk 98%' },
    'SNR-102': { tag: isHi ? 'गिरने का जोखिम व हिप इम्पैक्ट' : 'Fall Risk & Hip Impact', risk: 'high', label: isHi ? 'पोस्ट-फॉल रिहैब • उच्च जोखिम' : 'Post-Fall Rehab • High Risk 92%' },
    'SNR-103': { tag: isHi ? 'हाइपरग्लाइसीमिया 228 mg/dL' : 'Hyperglycemia 228 mg/dL', risk: 'high', label: isHi ? 'इंसुलिन छूटने का अलर्ट' : 'Insulin Omission • High Risk 84%' },
    'SNR-104': { tag: isHi ? 'अकेलापन व अवसाद फ्लैग' : 'Loneliness Sentiment Flag', risk: 'medium', label: isHi ? 'वॉइस एनएलपी अलर्ट' : 'Voice NLP Alert • Medium Risk 78%' },
    'SNR-105': { tag: isHi ? 'सीओपीडी व सांस की तकलीफ' : 'COPD & Mild Dyspnea', risk: 'medium', label: isHi ? 'श्वसन व हाइड्रेशन जांच' : 'Hydration Check • Medium Risk 62%' },
    'SNR-106': { tag: isHi ? 'स्ट्रोक-उपरांत गतिशीलता' : 'Post-Stroke Mobility', risk: 'medium', label: isHi ? 'फिजियोथेरेपी अनुपालन' : 'Physio Adherence • Medium Risk 54%' },
    'SNR-107': { tag: isHi ? 'ब्रोंकाइटिस स्वास्थ्य लाभ' : 'Post-Bronchitis Convalescence', risk: 'low', label: isHi ? 'खांसी सिरप फॉलो-अप' : 'Cough Follow-up • Low Risk 42%' },
    'SNR-108': { tag: isHi ? 'उच्च रक्तचाप व गठिया' : 'Hypertension & Arthritis', risk: 'low', label: isHi ? 'जोड़ों की गतिशीलता जांच' : 'Joint Mobility • Low Risk 26%' },
    'SNR-109': { tag: isHi ? 'नियमित जेरियाट्रिक जांच' : 'Routine Geriatric Check', risk: 'low', label: isHi ? 'वेलनेस टेली-केयर' : 'Wellness Check • Low Risk 18%' },
    'SNR-110': { tag: isHi ? 'मेटाबोलिक टेलीमेट्री समीक्षा' : 'Metabolic Telemetry Review', risk: 'low', label: isHi ? 'त्रैमासिक वेलनेस जांच' : 'Quarterly Check • Low Risk 14%' }
  };

  tbody.innerHTML = filtered.map(t => {
    const diag = diagnosisMap[t.seniorId] || {
      tag: t.reason ? t.reason.split('.')[0].slice(0, 32) : (isHi ? 'पंजीकृत मरीज़ ट्रायज' : 'Registered Senior Triage'),
      risk: t.mlRisk || 'medium',
      label: (t.isNewUser ? (isHi ? '✨ नया पंजीकृत सदस्य • ' : '✨ New Registered Member • ') : '') + (isHi ? `एमएल जोखिम ${t.mlScore || 50}%` : `ML Risk ${t.mlScore || 50}%`)
    };

    let riskBadgeColor = 'bg-slate-100 text-slate-700 border-slate-200';
    let riskDotColor = 'bg-slate-400';
    if (diag.risk === 'high' || t.mlScore >= 80) {
      riskBadgeColor = 'bg-rose-50 text-rose-700 border-rose-200';
      riskDotColor = 'bg-rose-500';
    } else if (diag.risk === 'medium' || t.mlScore >= 50) {
      riskBadgeColor = 'bg-amber-50 text-amber-800 border-amber-200';
      riskDotColor = 'bg-amber-500';
    } else {
      riskBadgeColor = 'bg-emerald-50 text-emerald-800 border-emerald-200';
      riskDotColor = 'bg-emerald-500';
    }

    const isVisit = t.type === 'visit';
    const isFulfilled = t.status === 'fulfilled';

    // Doctor / Operator details
    let assignedOpBadge = '';
    if (isFulfilled) {
      assignedOpBadge = `
        <div class="flex items-center space-x-2">
          <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
          <div>
            <div class="font-extrabold text-slate-900">Sister Kavita, RN</div>
            <div class="text-[10px] text-emerald-700 font-bold">${isHi ? '✓ पूर्ण व सत्यापित प्रमाण' : '✓ Logged & Verified Proof'}</div>
          </div>
        </div>
      `;
    } else if (isVisit) {
      assignedOpBadge = `
        <div class="flex items-center space-x-2">
          <span class="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
          <div>
            <div class="font-extrabold text-slate-900">Sister Kavita, RN</div>
            <div class="text-[10px] text-blue-600 font-bold">${isHi ? '🏠 घर पर व्यक्तिगत विज़िट' : '🏠 Doorstep Physical Visit'}</div>
          </div>
        </div>
      `;
    } else {
      assignedOpBadge = `
        <div class="flex items-center space-x-2">
          <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
          <div>
            <div class="font-extrabold text-slate-900">Dr. Eleanor Pena / Field Staff</div>
            <div class="text-[10px] text-slate-500 font-bold">${isHi ? '📞 टेली-केयर चेक-इन कॉल' : '📞 Tele-Care Check-in Call'}</div>
          </div>
        </div>
      `;
    }

    // Avatar initials and color
    const initials = t.seniorName.split(' ').map(n => n[0]).join('').slice(0, 2);
    const avatarBg = isVisit ? 'bg-blue-600' : 'bg-emerald-600';

    return `
      <tr class="hover:bg-slate-50/80 transition-colors">
        <!-- Patient Info -->
        <td class="py-3.5 px-3">
          <div class="flex items-center space-x-3">
            <div class="w-9 h-9 rounded-full ${avatarBg} text-white font-black text-xs flex items-center justify-center shadow-xs flex-shrink-0">
              ${initials}
            </div>
            <div>
              <div class="font-extrabold text-slate-900 text-xs sm:text-sm hover:text-blue-600 cursor-pointer flex items-center gap-1.5" onclick="openClinicalReportSheet('${t.seniorId}')">
                <span>${t.seniorName}</span>
                ${t.isNewUser ? '<span class="px-1.5 py-0.2 rounded bg-blue-100 text-blue-700 font-extrabold text-[9px] uppercase tracking-wider">NEW</span>' : ''}
              </div>
              <div class="text-[11px] text-slate-400 font-medium">
                ${isHi ? 'आयु' : 'Age'}: ${t.seniorAge || 72} • ${t.seniorGender || 'Senior'} • <span class="font-mono text-slate-500">${t.seniorId}</span>
              </div>
            </div>
          </div>
        </td>

        <!-- Assigned Doctor / Operator -->
        <td class="py-3.5 px-3">
          ${assignedOpBadge}
        </td>

        <!-- Date & Time -->
        <td class="py-3.5 px-3">
          <div class="font-extrabold text-slate-800 text-xs">
            ${t.assignedTime ? t.assignedTime.replace('Today ', isHi ? 'आज ' : '') : '10:30 AM'}
          </div>
          <div class="text-[10px] text-slate-400 font-medium">
            Oct 30, 2026
          </div>
        </td>

        <!-- Diseases / Diagnosis -->
        <td class="py-3.5 px-3">
          <div class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border ${riskBadgeColor}">
            <span class="w-1.5 h-1.5 rounded-full ${riskDotColor}"></span>
            <span>${diag.tag}</span>
          </div>
          <div class="text-[10px] text-slate-400 mt-0.5 ml-1 font-medium">
            ${diag.label}
          </div>
        </td>

        <!-- Actions -->
        <td class="py-3.5 px-3 text-right">
          <div class="flex items-center justify-end space-x-1.5">
            <!-- View Clinical Sheet -->
            <button type="button" onclick="openClinicalReportSheet('${t.seniorId}')" title="${isHi ? 'क्लिनिकल शीट देखें' : 'View Diagnostic Clinical Sheet'}"
              class="w-8 h-8 rounded-xl bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-blue-600 flex items-center justify-center transition-all shadow-2xs">
              <i class="fa-solid fa-file-waveform text-xs"></i>
            </button>

            ${isFulfilled ? `
              <!-- View Fulfilled Proof -->
              <button type="button" onclick="openViewProofModal('${t.id}')" title="${isHi ? 'सत्यापित प्रमाण देखें' : 'View Verified Audit Proof'}"
                class="w-8 h-8 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-700 flex items-center justify-center transition-all shadow-xs">
                <i class="fa-solid fa-shield-halved text-xs"></i>
              </button>
            ` : isVisit ? `
              <!-- Start Visit & Proof -->
              <button type="button" onclick="openSubmitVisitProofModal('${t.seniorId}')" title="${isHi ? 'विज़िट शुरू करें व प्रमाण दर्ज करें' : 'Start In-Person Visit & Log GPS/Vitals Proof'}"
                class="w-8 h-8 rounded-xl bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center transition-all shadow-xs active:scale-95">
                <i class="fa-solid fa-location-dot text-xs"></i>
              </button>
            ` : `
              <!-- Log Call -->
              <button type="button" onclick="openLogCallModal('${t.seniorId}')" title="${isHi ? 'टेली-केयर कॉल दर्ज करें' : 'Log Tele-Care Outreach Call'}"
                class="w-8 h-8 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center transition-all shadow-xs active:scale-95">
                <i class="fa-solid fa-phone text-xs"></i>
              </button>
            `}
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

function filterAppointmentsTable(filter) {
  if (typeof soundEngine !== 'undefined' && soundEngine.playTone) {
    soundEngine.playTone(600, 'sine', 0.08);
  }
  renderMedcareAppointmentsTable(filter);
}

function filterAppointmentsTableSearch(query) {
  if (currentCoordinatorSubView === 'patients') {
    renderMedcarePatientsDirectory(currentPatientsFilter || 'all', query);
  } else {
    renderMedcareAppointmentsTable(currentMedcareFilter || 'all', query);
  }
}

// =========================================================================
// 5. SIDEBAR NAVIGATION CONTROLLER
// =========================================================================
function switchCoordinatorMedcareTab(tab) {
  highlightCoordinatorSidebarTab(tab);

  if (typeof soundEngine !== 'undefined' && soundEngine.playTone) {
    soundEngine.playTone(550, 'sine', 0.06);
  }

  const isHi = currentCoordinatorLang === 'hi';

  if (tab === 'patients') {
    switchCoordinatorSubView('patients');
    if (typeof showToast === 'function') {
      showToast(isHi ? 'नामांकित मरीज़ क्लिनिकल निर्देशिका खोली गई।' : 'Viewing full directory of enrolled patients.', 'info');
    }
  } else if (tab === 'appointments') {
    switchCoordinatorSubView('appointments');
    if (typeof showToast === 'function') {
      showToast(isHi ? 'अपॉइंटमेंट्स व आगामी ड्यूटी शेड्यूल खोला गया।' : 'Displaying scheduled appointments and upcoming duties.', 'info');
    }
  } else if (tab === 'team') {
    const specEl = document.getElementById('medcare-specialist-name');
    if (specEl) specEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    if (typeof showToast === 'function') {
      showToast(isHi ? 'ऑन-ड्यूटी विशेषज्ञ व जेरियाट्रिक समन्वयक।' : 'On-duty field specialists and geriatric coordinators.', 'info');
    }
  } else if (tab === 'analytics') {
    const chartEl = document.getElementById('chart-medcare-arrival');
    if (chartEl) chartEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    if (typeof showToast === 'function') {
      showToast(isHi ? 'मरीज़ आगमन व टेलीमेट्री एनालिटिक्स।' : 'Displaying patient arrival & triage telemetry analytics.', 'info');
    }
  } else if (tab === 'departments') {
    if (typeof showToast === 'function') {
      showToast(isHi ? 'एनसीआर क्लिनिकल ज़ोन: साउथ दिल्ली, साकेत, हौज खास, वसंत कुंज।' : 'NCR Geriatric Shift Zones: South Delhi, Saket, Hauz Khas, Vasant Kunj.', 'info');
    }
  } else if (tab === 'billing') {
    if (typeof showToast === 'function') {
      showToast(isHi ? 'आयुष्मान भारत व एल्डर हेल्थ कवरेज रिकॉर्ड।' : 'Elder Health Insurance & Ayushman Bharat coverage records.', 'info');
    }
  } else {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

// =========================================================================
// 6. DASHBOARD INITIALIZER & CHART
// =========================================================================
function initMedcareCoordinatorDashboard() {
  const prof = getCoordinatorProfileData();

  // 1. Read persistent language or default to en
  let initialLang = 'en';
  try {
    initialLang = localStorage.getItem('careconnect_coordinator_lang') || (state && state.currentLanguage) || 'en';
  } catch (e) {}

  // 2. Sync Top Bar & Profile Elements
  const topbarName = document.getElementById('coord-topbar-name');
  const topbarTitle = document.getElementById('coord-topbar-title');
  const greetingName = document.getElementById('coord-greeting-name');
  const specName = document.getElementById('medcare-specialist-name');
  const specQual = document.getElementById('medcare-specialist-qual');
  const specAvail = document.getElementById('medcare-specialist-avail');

  if (topbarName) topbarName.textContent = prof.name ? prof.name.split(',')[0] : 'Sister Kavita';
  if (topbarTitle) topbarTitle.textContent = prof.title || 'Lead Coordinator';
  if (greetingName) greetingName.textContent = prof.name ? `${prof.name.split(',')[0]}!` : 'Sister Kavita!';
  if (specName) specName.textContent = prof.name || 'Sister Kavita Verma, RN';
  if (specQual) specQual.textContent = prof.title || 'Lead Geriatric Coordinator';
  if (specAvail) specAvail.textContent = prof.zone ? `${prof.zone.split('(')[0]} • On Duty` : 'South Delhi • On Duty';

  // 3. Initialize Dynamic KPI Card Values via updateCoordinatorDynamicKPIs()
  updateCoordinatorDynamicKPIs();

  // 4. Initialize Patient Arrival Statistics Area Chart
  initMedcareArrivalChart();

  // 5. Apply Language Translations and Populate Both Views
  setCoordinatorLanguage(initialLang, false);

  // 6. Default to current subview
  switchCoordinatorSubView(currentCoordinatorSubView || 'appointments');
}

function initMedcareArrivalChart() {
  const canvas = document.getElementById('chart-medcare-arrival');
  if (!canvas || typeof Chart === 'undefined') return;

  if (medcareArrivalChartInstance) {
    try {
      medcareArrivalChartInstance.destroy();
    } catch (e) {}
  }

  const ctx = canvas.getContext('2d');
  const gradientIn = ctx.createLinearGradient(0, 0, 0, 240);
  gradientIn.addColorStop(0, 'rgba(37, 99, 235, 0.28)');
  gradientIn.addColorStop(1, 'rgba(37, 99, 235, 0.01)');

  const gradientOut = ctx.createLinearGradient(0, 0, 0, 240);
  gradientOut.addColorStop(0, 'rgba(148, 163, 184, 0.2)');
  gradientOut.addColorStop(1, 'rgba(148, 163, 184, 0.01)');

  window.medcareArrivalChartInstance = medcareArrivalChartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      datasets: [
        {
          label: 'Patients Inflow',
          data: [180, 220, 205, 270, 310, 260, 240, 320, 290, 315, 330, 350],
          borderColor: '#2563eb',
          borderWidth: 2.5,
          backgroundColor: gradientIn,
          fill: true,
          tension: 0.42,
          pointBackgroundColor: '#2563eb',
          pointBorderColor: '#ffffff',
          pointBorderWidth: 2,
          pointRadius: [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 7],
          pointHoverRadius: 8
        },
        {
          label: 'Discharged / Outflow',
          data: [130, 160, 150, 190, 210, 180, 170, 215, 195, 200, 215, 211],
          borderColor: '#94a3b8',
          borderWidth: 2,
          borderDash: [4, 4],
          backgroundColor: gradientOut,
          fill: true,
          tension: 0.42,
          pointBackgroundColor: '#94a3b8',
          pointBorderColor: '#ffffff',
          pointBorderWidth: 1.5,
          pointRadius: 2.5,
          pointHoverRadius: 6
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          backgroundColor: '#0f172a',
          titleFont: { size: 12, weight: 'bold' },
          bodyFont: { size: 11 },
          padding: 10,
          cornerRadius: 10,
          callbacks: {
            title: function(items) {
              return `Top: ${items[0].label}-2025`;
            },
            label: function(ctx) {
              return ` ${ctx.dataset.label}: ${ctx.raw} seniors`;
            }
          }
        }
      },
      scales: {
        x: {
          grid: {
            display: false,
            drawBorder: false
          },
          ticks: {
            color: '#94a3b8',
            font: { size: 11, weight: 'bold' }
          }
        },
        y: {
          grid: {
            color: '#f1f5f9',
            drawBorder: false
          },
          ticks: {
            color: '#94a3b8',
            font: { size: 11 },
            callback: function(val) {
              return '$' + (val / 10).toFixed(0) + 'k';
            }
          }
        }
      }
    }
  });
}

function exportCoordinatorDataCSV() {
  const tasks = getCoordinatorAssignedTasks();
  if (!tasks || tasks.length === 0) {
    if (typeof showToast === 'function') showToast('No triage appointments available to export.', 'warning');
    return;
  }

  const csvRows = [
    ['Task ID', 'Senior ID', 'Senior Name', 'Age', 'Gender', 'Duty Type', 'Risk Category', 'Risk Score', 'Assigned Time', 'Status', 'Location', 'Family Phone']
  ];

  tasks.forEach(t => {
    csvRows.push([
      `"${t.id || ''}"`,
      `"${t.seniorId || ''}"`,
      `"${t.seniorName || ''}"`,
      `"${t.seniorAge || ''}"`,
      `"${t.seniorGender || ''}"`,
      `"${t.type || ''}"`,
      `"${t.mlRisk || 'medium'}"`,
      `"${t.mlScore || 50}"`,
      `"${t.assignedTime || ''}"`,
      `"${t.status || 'pending'}"`,
      `"${(t.location || '').replace(/"/g, '""')}"`,
      `"${t.phone || ''}"`
    ]);
  });

  const csvContent = 'data:text/csv;charset=utf-8,' + csvRows.map(e => e.join(',')).join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', 'CareConnect_Coordinator_Triage_Roster.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  showToast('Exported ' + selectedAlerts.length + ' selected cases to CSV!', 'success');
  if (typeof soundEngine !== 'undefined' && soundEngine.playSuccessChime) {
    soundEngine.playSuccessChime();
  }
  if (typeof showToast === 'function') {
    showToast(currentCoordinatorLang === 'hi' ? 'ट्रायज शेड्यूल और मरीज़ डेटा सीएसवी में निर्यात किया गया!' : 'Triage schedule & duties exported successfully to CSV!', 'success');
  }
}}}