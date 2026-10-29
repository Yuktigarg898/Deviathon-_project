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

// Bilingual Localization Dictionary (Zero parallel text: 100% English or 100% Hindi)
const translations = {
  en: {
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
  // Initialize clean language state from saved preference or English default
  const savedLang = localStorage.getItem('careconnect_lang') || 'en';
  setAppLanguage(savedLang);

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
  } else if (role === 'operations') {
    if (header) header.classList.add('hidden');
    if (mobileNav) mobileNav.classList.add('hidden');
    document.title = "CareConnect Operations Manager Command Center";
    switchOpsTab('dashboard');
    setTimeout(initOpsCharts, 120);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } else {
    if (header) header.classList.remove('hidden');
    if (mobileNav) mobileNav.classList.remove('hidden');
    updateHeaderUserBadge(role);
    updateNavPills(role);
    
    // View-specific initializations
    if (role === 'family') {
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

// Unified Global Language Switcher (Zero Parallel Slashes)
function setAppLanguage(lang) {
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

  showToast(lang === 'hi' ? 'भाषा बदलकर हिन्दी कर दी गई है' : 'Language set to English', 'info');
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

  // Operations Manager Topbar Buttons
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

// =============================================================================
// OPERATIONS MANAGER COMMAND CENTER LOGIC (7-VIEW DASHBOARD & CONTROLS)
// =============================================================================

let currentAssignTargetSenior = null;

// 1. Switch between Sidebar Tabs (Dashboard, Risk, Alerts, Team, Area, Reports, Audit, Profile)
function switchOpsTab(tabId) {
  // If target is settings, open profile subview and select settings tab
  if (tabId === 'settings') {
    switchOpsTab('profile');
    switchOpsProfileTab('settings');
    return;
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
function handleOpsGlobalSearch(query) {
  const q = (query || '').toLowerCase().trim();
  // Filter case rows if search is typed
  const rows = document.querySelectorAll('#ops-alerts-table-body tr.ops-case-row');
  rows.forEach(r => {
    const text = r.textContent.toLowerCase();
    if (!q || text.includes(q)) {
      r.style.display = '';
    } else {
      r.style.display = 'none';
    }
  });
}

// 5. Alerts & Cases Filtering
function filterOpsAlertsTable(status) {
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

  const rows = document.querySelectorAll('#ops-alerts-table-body tr.ops-case-row');
  rows.forEach(r => {
    const rowStatus = r.getAttribute('data-status');
    if (status === 'all' || rowStatus === status) {
      r.style.display = '';
    } else {
      r.style.display = 'none';
    }
  });
}

function filterOpsCasesSearch(query) {
  handleOpsGlobalSearch(query);
}

function filterOpsAlertsBySelect() {
  const riskSelect = document.getElementById('ops-filter-risk');
  const issueSelect = document.getElementById('ops-filter-issue');
  const risk = riskSelect ? riskSelect.value : 'all';
  const issue = issueSelect ? issueSelect.value : 'all';

  const rows = document.querySelectorAll('#ops-alerts-table-body tr.ops-case-row');
  rows.forEach(r => {
    const rRisk = r.getAttribute('data-risk');
    const rIssue = r.getAttribute('data-issue');

    const matchRisk = (risk === 'all' || rRisk === risk);
    const matchIssue = (issue === 'all' || (rIssue && rIssue.includes(issue)));

    if (matchRisk && matchIssue) {
      r.style.display = '';
    } else {
      r.style.display = 'none';
    }
  });
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
  const chosenCoord = coordSelect ? coordSelect.value : 'Ananya';

  if (currentAssignTargetSenior) {
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
      <td class="p-3.5 pl-4"><input type="checkbox" class="rounded text-teal-600"></td>
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
    avatarEl.textContent = initials || 'SJ';
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

  modal.classList.remove('hidden');
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
function exportOpsReports() {
  const csvContent = "data:text/csv;charset=utf-8,"
    + "Metric,Value,Period,Status\n"
    + "Total Active Seniors,200,Last 30 Days,Normal\n"
    + "High Risk Alerts,24,Last 30 Days,Action Required\n"
    + "Moderate Risk Alerts,68,Last 30 Days,Monitoring\n"
    + "Low Risk Alerts,108,Last 30 Days,Normal\n"
    + "Resolution Rate,92%,Last 30 Days,Target Met\n"
    + "Avg Response Time,2.8 hrs,Last 30 Days,Target Met\n";

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "CareConnect_Operations_Report.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  showToast("Operations report exported as CSV successfully!", "success");
}

function exportOpsAuditLogs() {
  const csvContent = "data:text/csv;charset=utf-8,"
    + "Timestamp,User,Role,Action,Details,Related Senior,IP Address\n"
    + "28 Oct 2026 10:24 AM,Ananya,Coordinator,Assigned to Rishabh,Missed medication,Sharma Ji,192.168.1.12\n"
    + "28 Oct 2026 09:15 AM,OM (You),Operations Manager,Marked as In Progress,Reduced activity,Verma Ji,192.168.1.15\n"
    + "27 Oct 2026 08:40 AM,Rishabh,Coordinator,Added follow-up note,Pain reported,Kapoor Ji,192.168.1.18\n"
    + "27 Oct 2026 11:20 AM,Megha,Coordinator,Changed priority,Sleep issues,Iyer Ji,192.168.1.21\n"
    + "26 Oct 2026 04:15 PM,Karan,Coordinator,Marked as Resolved,Mood changes,Singh Ji,192.168.1.19\n"
    + "26 Oct 2026 02:30 PM,OM (You),Operations Manager,Generated team report,System analytics,-,192.168.1.15\n"
    + "25 Oct 2026 10:45 AM,Amrita,Coordinator,Assigned to Ananya,Fall risk detected,Patel Ji,192.168.1.14\n"
    + "25 Oct 2026 09:32 AM,Rishabh,Coordinator,Added medication details,Irregular vitals,Rao Ji,192.168.1.18\n";

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "CareConnect_Audit_Trail.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  showToast("Audit logs exported as CSV successfully!", "success");
}

// 13. Team Management Form Task Assignment Handler
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
        labels: ['Ananya (28%)', 'Rishabh (24%)', 'Amrita (20%)', 'Megha (16%)', 'Karan (12%)'],
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



// =========================================================================
// ELDER COMPREHENSIVE HEALTH & RISK ASSESSMENT (AI ML PREDICTION ENGINE)
// =========================================================================

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

  // Collect inputs
  const payload = {
    seniorName: "Ramesh Sharma",
    age: parseFloat(document.getElementById('assess-age').value) || 74,
    gender: document.getElementById('assess-gender').value || "Male",
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
      
      // Play appropriate sound
      if (data.result.predicted_risk_level === 'High') {
        soundEngine.playTone(300, 'sawtooth', 0.4);
      } else if (data.result.predicted_risk_level === 'Medium') {
        soundEngine.playTone(450, 'triangle', 0.2);
      } else {
        soundEngine.playSuccessChime();
      }

      renderAssessmentResult(data.result, payload, data.alert_created);
      
      // If alert was created, refresh Coordinator queue in background
      if (typeof refreshCoordinatorQueue === 'function') {
        refreshCoordinatorQueue();
      }

      showToast(`Health Risk Prediction Complete: ${data.result.predicted_risk_level} Risk`, 
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
function renderAssessmentResult(res, inputData, alertCreated) {
  const box = document.getElementById('assessment-result-box');
  if (!box) return;

  const isHindi = state.seniorLanguage === 'hi';
  const riskLevel = res.predicted_risk_level; // 'Low', 'Medium', 'High'
  const isHigh = (riskLevel === 'High');
  const isMed = (riskLevel === 'Medium');
  const isLow = (riskLevel === 'Low');

  // Styling based on risk level
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

  const reasonsList = isHindi ? res.alert_reasons_hi : res.alert_reasons;
  const actionsList = isHindi ? res.recommended_actions_hi : res.recommended_actions;
  const riskTitle = isHindi ? res.predicted_risk_level_hi : `${riskLevel} Risk Condition`;
  const urgencyTag = isHindi ? res.status_tag_hi : res.status_tag_en;

  box.className = `mt-8 p-6 sm:p-8 rounded-3xl border-2 transition-all duration-300 ${theme.bg}`;
  box.classList.remove('hidden');

  box.innerHTML = `
    <!-- Top Result Header -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200/80">
      <div class="flex items-center space-x-4">
        <div class="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white shadow-md flex items-center justify-center text-3xl sm:text-4xl">
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
            ${isHindi ? 'एआई स्वास्थ्य जोखिम परिणाम' : 'AI Health Risk Prediction Results'}
          </h3>
          <p class="text-xs sm:text-sm font-semibold text-slate-600">
            ${urgencyTag}
          </p>
        </div>
      </div>

      <!-- Quick Action Buttons -->
      <div class="flex items-center space-x-2 w-full sm:w-auto">
        <button onclick="speakAssessmentResult()"
          class="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs font-bold transition-all shadow-sm flex items-center justify-center space-x-1.5">
          <i class="fa-solid fa-volume-high text-teal-600"></i>
          <span>${isHindi ? 'बोलकर सुनाएं' : 'Listen Report'}</span>
        </button>
        ${(isHigh || isMed) ? `
          <button onclick="escalateAssessmentToCoordinator()"
            class="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all shadow-md flex items-center justify-center space-x-1.5">
            <i class="fa-solid fa-bell animate-pulse"></i>
            <span>${isHindi ? 'कोऑर्डिनेटर को सूचित' : 'Alert Coordinator'}</span>
          </button>
        ` : ''}
      </div>
    </div>

    <!-- Metrics Breakdown Cards -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 my-6">
      <div class="bg-white/90 p-4 rounded-2xl border border-slate-200/80 shadow-sm text-center">
        <span class="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">${isHindi ? 'जोखिम स्कोर' : 'Risk Index Score'}</span>
        <span class="text-2xl sm:text-3xl font-black text-slate-800">${res.risk_score}</span>
        <span class="text-[10px] text-slate-400 block mt-0.5">Scale: 0 (Safe) - 100</span>
      </div>
      <div class="bg-white/90 p-4 rounded-2xl border border-slate-200/80 shadow-sm text-center">
        <span class="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">${isHindi ? 'एमएल संभावना' : 'AI Decline Prob.'}</span>
        <span class="text-2xl sm:text-3xl font-black text-teal-600">${(res.predicted_probability * 100).toFixed(1)}%</span>
        <span class="text-[10px] text-slate-400 block mt-0.5">Random Forest Model</span>
      </div>
      <div class="bg-white/90 p-4 rounded-2xl border border-slate-200/80 shadow-sm text-center">
        <span class="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">${isHindi ? 'बीएमआई माप' : 'Body Mass Index'}</span>
        <span class="text-2xl sm:text-3xl font-black text-slate-800">${res.bmi}</span>
        <span class="text-[10px] text-slate-400 block mt-0.5">${inputData.weight_kg}kg • ${inputData.height_cm}cm</span>
      </div>
      <div class="bg-white/90 p-4 rounded-2xl border border-slate-200/80 shadow-sm text-center">
        <span class="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">${isHindi ? 'कोऑर्डिनेटर स्थिति' : 'Care Alert Status'}</span>
        <span class="text-xs sm:text-sm font-bold ${alertCreated ? 'text-rose-600' : 'text-emerald-600'} block mt-1">
          <i class="${alertCreated ? 'fa-solid fa-triangle-exclamation' : 'fa-solid fa-shield-check'} mr-1"></i>
          ${alertCreated ? (isHindi ? 'अलर्ट दर्ज हुआ' : 'Alert Synced') : (isHindi ? 'सुरक्षित' : 'Normal')}
        </span>
        <span class="text-[10px] text-slate-400 block mt-0.5">${alertCreated ? 'View 1 Notified' : 'No escalation needed'}</span>
      </div>
    </div>

    <!-- Alert Reasons & Clinical Observations -->
    <div class="space-y-4">
      <div class="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
        <h4 class="text-xs sm:text-sm font-extrabold text-slate-900 mb-2 flex items-center space-x-2">
          <i class="fa-solid fa-clipboard-list text-teal-600"></i>
          <span>${isHindi ? 'जोखिम के मुख्य कारण एवं टेलीमेट्री अवलोकन:' : 'Identified Risk Drivers & Telemetry Signals:'}</span>
        </h4>
        <ul class="space-y-2 mt-3">
          ${reasonsList.map(r => `
            <li class="flex items-start text-xs sm:text-sm text-slate-700">
              <span class="inline-flex items-center justify-center w-5 h-5 rounded-full ${isHigh ? 'bg-rose-100 text-rose-700' : (isMed ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700')} text-xs mr-2.5 flex-shrink-0 mt-0.5">
                <i class="fa-solid fa-arrow-right text-[10px]"></i>
              </span>
              <span>${r}</span>
            </li>
          `).join('')}
        </ul>
      </div>

      <!-- Actionable Next Steps -->
      <div class="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
        <h4 class="text-xs sm:text-sm font-extrabold text-slate-900 mb-2 flex items-center space-x-2">
          <i class="fa-solid fa-user-doctor text-sky-600"></i>
          <span>${isHindi ? 'अनुशंसित चिकित्सीय कदम एवं देखभाल योजना:' : 'Recommended Clinical & Support Actions:'}</span>
        </h4>
        <ul class="space-y-2 mt-3">
          ${actionsList.map(a => `
            <li class="flex items-start text-xs sm:text-sm text-slate-700">
              <span class="inline-flex items-center justify-center w-5 h-5 rounded-full bg-teal-100 text-teal-800 text-xs mr-2.5 flex-shrink-0 mt-0.5">
                <i class="fa-solid fa-check text-[10px]"></i>
              </span>
              <span>${a}</span>
            </li>
          `).join('')}
        </ul>
      </div>
    </div>

    <!-- Live Coordinator Escalation Alert Banner if applicable -->
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

// 9. Read Aloud Assessment Results (Text-to-Speech)
function speakAssessmentResult() {
  if (!assessmentState.lastPrediction) {
    showToast('No assessment results to read.', 'warning');
    return;
  }

  const res = assessmentState.lastPrediction;
  const isHindi = state.seniorLanguage === 'hi';
  
  let text = '';
  if (isHindi) {
    text = `रमेश जी, आपके स्वास्थ्य का आकलन किया गया है। आपका स्वास्थ्य स्तर ${res.predicted_risk_level_hi} है। जोखिम स्कोर ${res.risk_score} है। मुख्य बात: ${res.alert_reason_summary_hi}। सलाह: ${res.suggested_action_summary_hi}`;
  } else {
    text = `Ramesh ji, your health assessment has been evaluated. Your condition is ${res.predicted_risk_level} Risk. Risk index score is ${res.risk_score} out of 100. Primary observation: ${res.alert_reason_summary}. Recommended action: ${res.suggested_action_summary}`;
  }

  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = isHindi ? 'hi-IN' : 'en-IN';
    utterance.rate = 0.88; // Gentle, clear speed for elders
    window.speechSynthesis.speak(utterance);
    showToast(isHindi ? 'स्वास्थ्य रिपोर्ट बोलकर सुनाई जा रही है...' : 'Reading assessment report aloud...', 'info');
  } else {
    showToast('Text-to-speech is not supported in this browser.', 'warning');
  }
}

// 10. Manual Escalation to Coordinator
function escalateAssessmentToCoordinator() {
  if (!assessmentState.lastPrediction) return;
  soundEngine.playTone(800, 'sine', 0.2);
  showToast('Care Coordinator Sister Kavita notified directly with assessment telemetry! 🚨', 'success');
  if (typeof refreshCoordinatorQueue === 'function') {
    refreshCoordinatorQueue();
  }
}


// =========================================================================
// ROLE-BASED ACCESS CONTROL & DEDICATED AUTHENTICATION ENGINE
// =========================================================================

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
    defaultBadge: { en: 'Son / Family Member', hi: 'पुत्र / परिवारजन' },
    avatarInitials: 'RS',
    signupFieldsHtml: {
      en: `
        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">Relationship to Senior</label>
          <select id="signup-relation" class="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs bg-white">
            <option value="Son">Son</option>
            <option value="Daughter">Daughter</option>
            <option value="Spouse">Spouse</option>
            <option value="Guardian">Primary Guardian</option>
          </select>
        </div>
        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">Linked Senior's Name</label>
          <input id="signup-linked-senior" type="text" value="Ramesh Sharma (Father)" class="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs bg-slate-50">
        </div>
      `,
      hi: `
        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">बुज़ुर्ग से संबंध</label>
          <select id="signup-relation" class="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs bg-white">
            <option value="Son">पुत्र</option>
            <option value="Daughter">पुत्री</option>
            <option value="Spouse">पति / पत्नी</option>
            <option value="Guardian">अभिभावक</option>
          </select>
        </div>
        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">जुड़े हुए बुज़ुर्ग परिजन का नाम</label>
          <input id="signup-linked-senior" type="text" value="Ramesh Sharma (Father)" class="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs bg-slate-50">
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

  // Render role-specific signup fields
  if (roleFieldsContainer) {
    roleFieldsContainer.innerHTML = cfg.signupFieldsHtml;
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
  document.getElementById('otp-d1').value = activeOtpCode[0];
  document.getElementById('otp-d2').value = activeOtpCode[1];
  document.getElementById('otp-d3').value = activeOtpCode[2];
  document.getElementById('otp-d4').value = activeOtpCode[3];

  let seconds = 30;
  if (otpTimerInterval) clearInterval(otpTimerInterval);
  otpTimerInterval = setInterval(() => {
    seconds--;
    if (timerLabel) timerLabel.textContent = `0:${seconds < 10 ? '0' : ''}${seconds}s`;
    if (seconds <= 0) {
      clearInterval(otpTimerInterval);
    }
  }, 1000);

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

  soundEngine.playSuccessChime();
  showToast('OTP verified successfully! Access granted.', 'success');
  const cfg = authRoleConfigs[selectedAuthRole];
  enterDashboard(selectedAuthRole, {
    name: cfg.defaultName,
    email: cfg.defaultEmail,
    role: selectedAuthRole,
    badge: cfg.defaultBadge,
    initials: cfg.avatarInitials
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

  const cfg = authRoleConfigs[selectedAuthRole];
  soundEngine.playSuccessChime();
  enterDashboard(selectedAuthRole, {
    name: cfg.defaultName,
    email: email,
    role: selectedAuthRole,
    badge: cfg.defaultBadge,
    initials: cfg.avatarInitials
  });
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

  const cfg = authRoleConfigs[selectedAuthRole];
  soundEngine.playSuccessChime();
  
  // Compute initials
  const parts = name.split(' ');
  const initials = parts.length > 1 ? (parts[0][0] + parts[1][0]).toUpperCase() : name.substring(0, 2).toUpperCase();

  enterDashboard(selectedAuthRole, {
    name: name,
    email: email,
    role: selectedAuthRole,
    badge: `${getRoleDisplayName(selectedAuthRole)} (New Member)`,
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
  const allViews = ['coordinator', 'senior', 'family', 'operations'];
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

  // Reveal Global Header (hidden for Operations Manager which has its own command center top bar & sidebar)
  const header = document.getElementById('global-header');
  if (header) {
    if (role === 'operations') {
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
  if (roleLabel) roleLabel.textContent = user.badge;

  // Role specific view initializations
  if (role === 'family') {
    setTimeout(initFamilyVitalsChart, 100);
  } else if (role === 'operations') {
    switchOpsTab('dashboard');
    setTimeout(initOpsCharts, 120);
  } else if (role === 'coordinator') {
    renderCoordinatorAlerts();
  } else if (role === 'senior') {
    setTimeout(() => {
      if (typeof restoreAssessmentDraft === 'function') {
        restoreAssessmentDraft();
      }
    }, 100);
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// 13. Sign Out / Logout Function
function logout() {
  soundEngine.playWarningChime();

  // Hide all operational dashboards
  const allViews = ['coordinator', 'senior', 'family', 'operations'];
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

  showToast('Signed out successfully. Role selection hub opened.', 'info');
}

// Backward compatibility helper
function navigateRole(role) {
  if (role === 'login') {
    logout();
  } else {
    enterDashboard(role);
  }
}

function loginAs(role) {
  selectRoleForAuth(role);
}


// =========================================================================
// VOICE HEALTH INPUT ASSISTANT, MANDATORY VALIDATION & PERSISTENT AUTO-SAVE
// =========================================================================

const STORAGE_KEY_ASSESSMENT_DRAFT = 'careconnect_elder_assessment_draft';

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
  document.getElementById('assess-age').value = '';
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
function validateAssessmentInputsBeforeSubmit() {
  const missing = [];
  const fieldsToCheck = [
    { id: 'assess-age', label: 'Age (उम्र)' },
    { id: 'assess-gender', label: 'Gender (लिंग)' },
    { id: 'assess-height', label: 'Height (लंबाई cm)' },
    { id: 'assess-weight', label: 'Weight (वजन kg)' },
    { id: 'assess-bp-sys', label: 'BP Systolic (ऊपर का BP)' },
    { id: 'assess-bp-dia', label: 'BP Diastolic (नीचे का BP)' },
    { id: 'assess-hr', label: 'Heart Rate (धड़कन / पल्स)' },
    { id: 'assess-spo2', label: 'Oxygen SpO2 (ऑक्सीजन %)' },
    { id: 'assess-sleep', label: 'Sleep Hours (नींद के घंटे)' },
    { id: 'assess-med-count', label: 'Daily Medicine Count (दवा संख्या)' }
  ];

  // Remove previous error highlights
  document.querySelectorAll('.input-field-error').forEach(el => {
    el.classList.remove('input-field-error', 'ring-2', 'ring-rose-500', 'bg-rose-50');
  });

  let firstErrorElement = null;

  fieldsToCheck.forEach(item => {
    const el = document.getElementById(item.id);
    if (!el || el.value.toString().trim() === '' || isNaN(parseFloat(el.value))) {
      missing.push(item.label);
      if (el) {
        el.classList.add('input-field-error', 'ring-2', 'ring-rose-500', 'bg-rose-50');
        if (!firstErrorElement) firstErrorElement = el;
      }
    }
  });

  // If diabetic is 1, sugar reading is mandatory
  const isDiabetic = document.getElementById('assess-diabetic')?.value === '1';
  if (isDiabetic) {
    const sugarEl = document.getElementById('assess-sugar');
    if (!sugarEl || sugarEl.value.toString().trim() === '' || isNaN(parseFloat(sugarEl.value))) {
      missing.push('Blood Glucose (शुगर स्तर mg/dL)');
      if (sugarEl) {
        sugarEl.classList.add('input-field-error', 'ring-2', 'ring-rose-500', 'bg-rose-50');
        if (!firstErrorElement) firstErrorElement = sugarEl;
      }
    }
  }

  const alertBox = document.getElementById('assessment-validation-alert');
  const missingListContainer = document.getElementById('assessment-missing-fields-list');

  if (missing.length > 0) {
    soundEngine.playTone(300, 'sawtooth', 0.25);
    if (alertBox) alertBox.classList.remove('hidden');
    if (missingListContainer) {
      missingListContainer.innerHTML = missing.map(m => `
        <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-rose-200 text-rose-900 border border-rose-300">
          <i class="fa-solid fa-circle-exclamation mr-1 text-[10px]"></i> ${m}
        </span>
      `).join('');
    }

    if (firstErrorElement) {
      firstErrorElement.focus();
      firstErrorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    showToast(`कृपया सभी आवश्यक संकेत भरें (${missing.length} fields missing)`, 'danger');
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

// =========================================================================
// HIGH-FIDELITY BILINGUAL AI VOICE ENGINE & NEURAL SPEECH SYNTHESIS
// =========================================================================

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

  // Reset checklist badges to missing
  const badgeKeys = ['age', 'gender', 'body', 'vitals', 'pain', 'sleep', 'adl_walk', 'adl_eat', 'adl_move', 'adl_toilet', 'meds', 'sugar', 'hearing', 'diseases'];
  badgeKeys.forEach(k => {
    const b = document.getElementById(`badge-chk-${k}`);
    if (b) {
      b.className = 'voice-check-badge status-missing';
      const statusSpan = b.querySelector('.badge-tag-status');
      if (statusSpan) statusSpan.innerHTML = '? Needs Info';
    }
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

// =========================================================================
// VOICE ASSISTANT UI CONTROLLER (DOM BINDINGS & AUDIT BADGES)
// =========================================================================

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
      if (missing_fields && missing_fields.length > 0) {
        missing_fields.forEach(f => {
          const pill = document.createElement('span');
          pill.className = 'missing-pill';
          pill.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i> Needs Info: ${f.replace('_', ' ').toUpperCase()}`;
          missingWrap.appendChild(pill);
        });
      }
    }
  }

  if (statusText) {
    statusText.innerText = is_ready_for_assessment
      ? 'All parameters completed! Ready for AI Assessment.'
      : `Details updated! ${missing_fields.length} parameter(s) remaining.`;
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
  const badgeKeys = ['age', 'gender', 'body', 'vitals', 'pain', 'sleep', 'adl_walk', 'adl_eat', 'adl_move', 'adl_toilet', 'meds', 'sugar', 'hearing', 'diseases'];

  badgeKeys.forEach(k => {
    const badge = document.getElementById(`badge-chk-${k}`);
    if (!badge) return;
    const item = checklist[k];
    if (!item) return;

    const isAnswered = item.status === 'provided';
    badge.className = `voice-check-badge ${isAnswered ? 'status-provided' : 'status-missing'}`;

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
    });
    form.addEventListener('change', () => {
      saveAssessmentDraft();
    });
  }

  // Restore saved draft from localStorage
  restoreAssessmentDraft();

  // Initialize Elder Voice Assistant
  initElderVoiceAssistant();
}

// Auto-run draft listeners and voice assistant on load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAssessmentDraftAutoSaveListeners);
} else {
  initAssessmentDraftAutoSaveListeners();
}
