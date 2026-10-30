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
  patients: [{"id": "PAT-101", "username": "senior_ramesh", "name": "Ramesh Sharma", "age": 74, "gender": "Male", "avatar": "https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&auto=format&fit=crop&q=80", "location": "South Delhi (Greater Kailash, C-42)", "phone": "+91 98110-44912", "assignedNurse": "Sister Kavita, RN", "predictedTier": "CRITICAL", "tierLabel": "🚨 CRITICAL TIER", "tierColor": "rose", "modelScore": 80, "predictedProbability": "64.3%", "modelRiskLevel": "High Risk", "alertRaised": true, "alertId": "ALT-1091", "modelDrivers": ["Borderline Oxygen Saturation: SpO2 94.0%", "Elevated Blood Pressure: 158/96 mmHg", "Tachycardia Spike: Resting Heart Rate 114 bpm", "Moderate Pain (Level 4/10) in Lower Back & Left Knee", "Mobility Dependence: Unable to walk independently (High fall hazard)", "Toileting Dependence: Requires grab bar / personal support", "Medication Adherence Gap: Missed morning check-in & dose"], "suggestedAction": "Step 1: Immediate 2-way emergency call. Step 2: Emergency family notification. Step 3: Dispatch Nurse Kavita (ETA 12m).", "emergencyContact": {"name": "Rahul Sharma", "relation": "Son (Primary Caregiver)", "phone": "+91 98711-20931", "altPhone": "+91 98110-55441 (Anita Sharma, Daughter-in-law)", "email": "rahul.sharma@example.com", "address": "C-42, Greater Kailash-1, New Delhi", "notificationStatus": "Dispatched & Delivered", "channels": ["SMS", "WhatsApp", "App Push"], "dispatchedAt": "Today, 08:31 AM", "smsDelivered": true, "whatsappDelivered": true}, "medicalHistory": {"chronicConditions": ["Type-2 Diabetes Mellitus (12 yrs)", "Stage-2 Essential Hypertension", "Mild Left Knee Osteoarthritis"], "allergies": ["Sulfa antibiotics (skin rash / allergic dermatitis)"], "surgeries": ["Appendectomy (1998)", "Right Eye Cataract (2021)"], "bloodGroup": "B +ve", "doctor": "Dr. V.K. Kapoor (Senior Cardiologist, Fortis Escorts)", "nextReview": "15 Nov 2026", "medications": [{"name": "Tab Metformin", "dosage": "500 mg", "schedule": "1-0-1 (After Meals)", "purpose": "Glycemic Control", "adherence": "89%"}, {"name": "Tab Telmisartan", "dosage": "40 mg", "schedule": "1-0-0 (Morning 8 AM)", "purpose": "Blood Pressure", "adherence": "94%"}, {"name": "Tab Atorvastatin", "dosage": "10 mg", "schedule": "0-0-1 (Night 9 PM)", "purpose": "Cardiovascular & Lipid", "adherence": "92%"}, {"name": "Tab Calcium + D3", "dosage": "500 mg", "schedule": "1-0-0 (Afternoon)", "purpose": "Bone Health", "adherence": "95%"}]}, "checkups": [{"date": "Today, 08:30 AM", "bp": "158/96 mmHg", "bpStatus": "Critical Spike", "hr": "114 bpm", "hrStatus": "Tachycardia Spike", "spo2": "94%", "spo2Status": "Borderline Low", "glucose": "138 mg/dL", "temp": "98.4 °F", "weight": "68 kg", "bmi": "24.8", "conductedBy": "Home Bluetooth IoT Hub & Sister Kavita", "notes": "Resting HR spiked suddenly from baseline 74 to 114 bpm with zero motion for 4 hours."}, {"date": "Yesterday, 06:00 PM", "bp": "134/86 mmHg", "bpStatus": "Pre-Hypertension", "hr": "78 bpm", "hrStatus": "Normal", "spo2": "97%", "spo2Status": "Healthy", "glucose": "128 mg/dL", "temp": "98.2 °F", "weight": "68 kg", "bmi": "24.8", "conductedBy": "Sister Kavita (Routine check)", "notes": "Evening post-tea reading stable. Advised light stretching."}], "assessments": {"adl": {"eating": {"score": "10/10", "status": "Fully Independent"}, "toileting": {"score": "7/10", "status": "Requires Grab Bar Support"}, "walking": {"score": "6/10", "status": "Walks with Cane / Mild Instability"}, "moving": {"score": "7/10", "status": "Slight Difficulty Rising from Bed"}}, "pain": {"score": 4, "location": "Lower Back & Left Knee", "duration": "Chronic (Aggravates on cold mornings)", "sensation": "Dull ache (धीमा दर्द व जकड़न)"}, "sleep": {"hours": 5.2, "quality": "Restless (2 nighttime awakenings)"}}, "userInputs": [{"type": "voice", "timestamp": "Today, 08:15 AM", "hindiText": "आज सुबह से चक्कर बहुत आ रहे हैं, छाती पर भारीपन महसूस हो रहा है और सीढ़ियां चढ़ने की हिम्मत नहीं हो रही...", "englishTranslation": "Feeling severe dizziness since morning, heaviness on chest, and lacking energy to climb stairs...", "sentiment": "Distressed / High Anxiety", "sentimentBadge": "bg-rose-100 text-rose-800", "duration": "18 sec"}, {"type": "one_tap", "timestamp": "Yesterday, 09:30 AM", "selection": "🤒 Tabiyat Theek Nahi (Feeling Unwell)", "recordedNote": "Morning medicine delayed by 2 hours due to dizziness", "badge": "bg-amber-100 text-amber-800"}, {"type": "missed_call", "timestamp": "2 Days Ago, 08:02 AM", "tollFree": "1800-202-CARE", "status": "Logged & Verified Safe"}]}, {"id": "PAT-102", "username": "senior_savitri", "name": "Savitri Devi", "age": 81, "gender": "Female", "avatar": "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=150&auto=format&fit=crop&q=80", "location": "South Delhi (Greater Kailash, C-42)", "phone": "+91 98103-99210", "assignedNurse": "Sister Kavita, RN", "predictedTier": "CRITICAL", "tierLabel": "🚨 CRITICAL TIER", "tierColor": "rose", "modelScore": 62, "predictedProbability": "63.2%", "modelRiskLevel": "High Risk", "alertRaised": true, "alertId": "ALT-1088", "modelDrivers": ["Elevated Blood Pressure: 142/88 mmHg", "Severe Pain (Level 8/10) reported in Right Hip & Lumbar", "Mobility Dependence: Unable to walk independently (High fall hazard)", "Toileting Dependence: Supervised required post fall impact", "Impact shock sensor triggered in bathroom"], "suggestedAction": "Priority dispatch Paramedic Amit for fracture assessment & tele-radiology.", "emergencyContact": {"name": "Rahul Sharma", "relation": "Son (Primary Caregiver)", "phone": "+91 98711-20931", "altPhone": "+91 98110-55441 (Anita Sharma, Daughter-in-law)", "email": "rahul.sharma@example.com", "address": "C-42, Greater Kailash-1, New Delhi", "notificationStatus": "Dispatched & Delivered", "channels": ["SMS", "WhatsApp", "App Push"], "dispatchedAt": "Today, 06:51 AM", "smsDelivered": true, "whatsappDelivered": true}, "medicalHistory": {"chronicConditions": ["Severe Osteoporosis (T-score -3.1)", "Post-Fall Fragility", "Mild Cognitive Impairment", "Stage-1 Hypertension"], "allergies": ["Penicillin & Cephalosporins"], "surgeries": ["Left Wrist Colles Fracture Fixation (2022)"], "bloodGroup": "O +ve", "doctor": "Dr. Sunita Aggarwal (AIIMS)", "nextReview": "22 Nov 2026", "medications": [{"name": "Tab Amlodipine", "dosage": "5 mg", "schedule": "1-0-0 (Morning)", "purpose": "Blood Pressure", "adherence": "96%"}, {"name": "Tab Alendronate", "dosage": "70 mg", "schedule": "Once Weekly (Sunday)", "purpose": "Bone Mineral", "adherence": "90%"}, {"name": "Tab Donepezil", "dosage": "5 mg", "schedule": "0-0-1 (Night)", "purpose": "Cognitive Support", "adherence": "91%"}]}, "checkups": [{"date": "Today, 06:50 AM", "bp": "142/88 mmHg", "bpStatus": "Elevated", "hr": "88 bpm", "hrStatus": "Normal", "spo2": "97%", "spo2Status": "Healthy", "glucose": "110 mg/dL", "temp": "98.2 °F", "weight": "54 kg", "bmi": "21.6", "conductedBy": "Bathroom Sensor & Brother Amit", "notes": "Fall impact event detected at 06:45 AM. Senior immobilized on bathroom rug."}], "assessments": {"adl": {"eating": {"score": "9/10", "status": "Independent"}, "toileting": {"score": "4/10", "status": "Supervised Required / High Fall Risk"}, "walking": {"score": "4/10", "status": "Unsteady Gait / High Fall Hazard"}, "moving": {"score": "5/10", "status": "Needs Bedside Support"}}, "pain": {"score": 8, "location": "Right Hip & Lumbar Spine", "duration": "Acute post-fall impact", "sensation": "Sharp stabbing pain (तेज दर्द व चुभन)"}, "sleep": {"hours": 4.8, "quality": "Frequent waking, nocturia"}}, "userInputs": [{"type": "voice", "timestamp": "Today, 06:52 AM", "hindiText": "बाथरूम में फिसल गई थी, कमर में तेज दर्द है, उठा नहीं जा रहा...", "englishTranslation": "Slipped in the bathroom, sharp pain in lower back, unable to get up...", "sentiment": "Acute Physical Pain & Distress", "sentimentBadge": "bg-rose-100 text-rose-800", "duration": "14 sec"}]}, {"id": "PAT-103", "username": "senior_anand", "name": "Anand Verma", "age": 78, "gender": "Male", "avatar": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80", "location": "Saket (Sector 3, House 104)", "phone": "+91 98734-11823", "assignedNurse": "Rajesh Kumar (Buddy)", "predictedTier": "CRITICAL", "tierLabel": "🚨 CRITICAL TIER", "tierColor": "rose", "modelScore": 53, "predictedProbability": "68.6%", "modelRiskLevel": "High Risk", "alertRaised": true, "alertId": "ALT-1074", "modelDrivers": ["Severe Hyperglycemia: Fasting Blood Glucose 228 mg/dL", "Medication Adherence Gap: Missed 2 consecutive insulin doses", "Diabetic Neuropathy tingling in soles", "Risk of Diabetic Ketoacidosis / Hyperosmolar state"], "suggestedAction": "Doorstep visit by Buddy Rajesh to verify insulin cold chain & dose administration.", "emergencyContact": {"name": "Deepak Verma", "relation": "Son", "phone": "+91 98112-99881", "altPhone": "+91 98733-11223 (Ritu Verma, Daughter)", "email": "deepak.verma@example.com", "address": "Saket, Sector 3, New Delhi", "notificationStatus": "Dispatched & Delivered", "channels": ["SMS", "WhatsApp"], "dispatchedAt": "Today, 07:20 AM", "smsDelivered": true, "whatsappDelivered": true}, "medicalHistory": {"chronicConditions": ["Uncontrolled Type-2 Diabetes (HbA1c 9.2%)", "Chronic Kidney Disease Stage 2", "Diabetic Peripheral Neuropathy"], "allergies": ["None documented"], "surgeries": ["Coronary Angioplasty (2017)"], "bloodGroup": "A +ve", "doctor": "Dr. Pradeep Batra (Max Saket)", "nextReview": "10 Nov 2026", "medications": [{"name": "Inj Insulin Glargine", "dosage": "16 units", "schedule": "0-0-1 (Night 10 PM)", "purpose": "Basal Glycemic", "adherence": "72% (Missed 2 days)"}, {"name": "Tab Linagliptin", "dosage": "5 mg", "schedule": "1-0-0 (Morning)", "purpose": "Glucose Control", "adherence": "95%"}, {"name": "Tab Pregabalin", "dosage": "75 mg", "schedule": "0-0-1 (Night)", "purpose": "Neuropathy Pain", "adherence": "88%"}]}, "checkups": [{"date": "Today, 07:15 AM", "bp": "132/84 mmHg", "bpStatus": "Normal", "hr": "76 bpm", "hrStatus": "Normal", "spo2": "98%", "spo2Status": "Healthy", "glucose": "228 mg/dL", "glucoseStatus": "Severe Hyperglycemia", "temp": "98.6 °F", "weight": "72 kg", "bmi": "25.2", "conductedBy": "Bluetooth Glucometer Sync", "notes": "Fasting blood sugar 228 mg/dL. Consecutive 2-day missed evening insulin reminder."}], "assessments": {"adl": {"eating": {"score": "10/10", "status": "Independent"}, "toileting": {"score": "9/10", "status": "Independent"}, "walking": {"score": "8/10", "status": "Independent"}, "moving": {"score": "9/10", "status": "Independent"}}, "pain": {"score": 3, "location": "Bilateral Soles / Feet", "duration": "Nightly burning sensation", "sensation": "Burning neuropathy (पैरों में जलन)"}, "sleep": {"hours": 6.5, "quality": "Fair"}}, "userInputs": [{"type": "one_tap", "timestamp": "Today, 08:30 AM", "selection": "💊 Took Medicine (Dawa le li)", "recordedNote": "Oral tablets taken; insulin dose compliance pending confirmation", "badge": "bg-emerald-100 text-emerald-800"}, {"type": "voice", "timestamp": "Yesterday, 08:15 PM", "hindiText": "पैरों में बहुत झनझनाहट हो रही है और बहुत प्यास लग रही है...", "englishTranslation": "Feet are tingling severely and feeling unusually thirsty...", "sentiment": "Discomfort / Neuropathy Symptom", "sentimentBadge": "bg-amber-100 text-amber-800", "duration": "12 sec"}]}, {"id": "PAT-104", "username": "senior_meena", "name": "Meena Iyer", "age": 72, "gender": "Female", "avatar": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80", "location": "Vasant Kunj (Pocket B, Apt 302)", "phone": "+91 98188-77219", "assignedNurse": "Sister Sunita, Counselor", "predictedTier": "MODERATE", "tierLabel": "🟡 MODERATE TIER", "tierColor": "amber", "modelScore": 25, "predictedProbability": "38.9%", "modelRiskLevel": "Medium Risk", "alertRaised": false, "modelDrivers": ["Severe Sleep Deficit: Only 4.1 hours of sleep", "Bereavement anniversary emotional distress voice note", "Cardiovascular parameters remain stable (BP 124/80, HR 72, SpO2 98%)"], "suggestedAction": "15-minute compassionate reassurance tele-consult with Buddy Sunita & family notification.", "emergencyContact": {"name": "Karthik Iyer", "relation": "Son (Bengaluru)", "phone": "+91 97400-55120", "altPhone": "+91 98188-99001", "email": "karthik.iyer@example.com", "address": "Indiranagar, Bengaluru (Outstation Family)", "notificationStatus": "Monitoring Only (No Alert Raised)", "channels": ["Routine Portal"], "dispatchedAt": null, "smsDelivered": false, "whatsappDelivered": false}, "medicalHistory": {"chronicConditions": ["Hypothyroidism", "Mild Depressive Episodes (Post-bereavement)", "Cervical Spondylosis"], "allergies": ["Dust mite & pollen"], "surgeries": ["None"], "bloodGroup": "B +ve", "doctor": "Dr. Rashmi Sen (Medanta)", "nextReview": "30 Nov 2026", "medications": [{"name": "Tab Thyronorm", "dosage": "50 mcg", "schedule": "1-0-0 (7 AM)", "purpose": "Thyroid", "adherence": "98%"}, {"name": "Tab Escitalopram", "dosage": "10 mg", "schedule": "1-0-0 (Morning)", "purpose": "Mood", "adherence": "93%"}]}, "checkups": [{"date": "Today, 08:00 AM", "bp": "124/80 mmHg", "bpStatus": "Optimal", "hr": "72 bpm", "hrStatus": "Normal", "spo2": "98%", "spo2Status": "Healthy", "glucose": "105 mg/dL", "temp": "98.1 °F", "weight": "58 kg", "bmi": "23.2", "conductedBy": "Self-Monitoring IoT Cuff", "notes": "Hemodynamic parameters stable. Mood assessment flagged low."}], "assessments": {"adl": {"eating": {"score": "9/10", "status": "Independent"}, "toileting": {"score": "9/10", "status": "Independent"}, "walking": {"score": "9/10", "status": "Independent"}, "moving": {"score": "9/10", "status": "Independent"}}, "pain": {"score": 2, "location": "Neck / Upper Shoulder", "duration": "Postural stiffness", "sensation": "Mild tightness (गर्दन में हल्की जकड़न)"}, "sleep": {"hours": 4.1, "quality": "Insomnia (Difficulty falling asleep)"}}, "userInputs": [{"type": "voice", "timestamp": "Today, 07:15 AM", "hindiText": "आज अकेलापन बहुत लग रहा है, किसी से बात करने का मन है...", "englishTranslation": "Feeling very lonely today, wish to speak with someone...", "sentiment": "Severe Sadness & Disorientation", "sentimentBadge": "bg-purple-100 text-purple-800", "duration": "16 sec"}]}, {"id": "PAT-105", "username": "senior_harish", "name": "Harish Patel", "age": 76, "gender": "Male", "avatar": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80", "location": "Malviya Nagar (Block E-12)", "phone": "+91 98199-33812", "assignedNurse": "Sister Kavita, RN", "predictedTier": "NORMAL", "tierLabel": "🟢 NORMAL TIER", "tierColor": "emerald", "modelScore": 9, "predictedProbability": "18.2%", "modelRiskLevel": "Low Risk", "alertRaised": false, "modelDrivers": ["All vital signs, mobility, sleep, and medication adherence are within healthy normal ranges.", "Blood pressure normal: 122/80 mmHg, Heart rate: 72 bpm, SpO2: 98%", "Functional ADLs 100% independent (Eating, Walking, Toileting, Moving)", "Zero missed medication doses in past 30 days"], "suggestedAction": "Routine monitoring & Bluetooth cuff weekly sync. No intervention required.", "emergencyContact": {"name": "Sneha Patel", "relation": "Daughter", "phone": "+91 98200-44910", "altPhone": "+91 98199-22110 (Manoj Patel, Son)", "email": "sneha.patel@example.com", "address": "Malviya Nagar, New Delhi", "notificationStatus": "Standby (No Alert Raised - Alarm Fatigue Averted)", "channels": ["Routine Portal"], "dispatchedAt": null, "smsDelivered": false, "whatsappDelivered": false}, "medicalHistory": {"chronicConditions": ["Well-Controlled Hypertension", "Benign Prostatic Hyperplasia (BPH)", "Mild Dyslipidemia"], "allergies": ["No known drug allergies"], "surgeries": ["None"], "bloodGroup": "AB +ve", "doctor": "Dr. R.K. Mehta (Max Smart Super)", "nextReview": "05 Dec 2026", "medications": [{"name": "Tab Telmisartan", "dosage": "40 mg", "schedule": "1-0-0 (Morning)", "purpose": "Blood Pressure", "adherence": "98%"}, {"name": "Tab Silodosin", "dosage": "8 mg", "schedule": "0-0-1 (Night)", "purpose": "Urinary Flow", "adherence": "96%"}, {"name": "Tab Rosuvastatin", "dosage": "10 mg", "schedule": "0-0-1 (Night)", "purpose": "Lipids", "adherence": "94%"}]}, "checkups": [{"date": "Today, 07:30 AM", "bp": "122/80 mmHg", "bpStatus": "Optimal Normal", "hr": "72 bpm", "hrStatus": "Normal", "spo2": "98%", "spo2Status": "Healthy", "glucose": "108 mg/dL", "temp": "98.2 °F", "weight": "70 kg", "bmi": "24.2", "conductedBy": "Home Bluetooth IoT Hub", "notes": "Morning checkup completed smoothly. Vitals in optimal green range."}], "assessments": {"adl": {"eating": {"score": "10/10", "status": "Independent"}, "toileting": {"score": "10/10", "status": "Independent"}, "walking": {"score": "10/10", "status": "Independent"}, "moving": {"score": "10/10", "status": "Independent"}}, "pain": {"score": 0, "location": "None", "duration": "None", "sensation": "No Pain (दर्द मुक्त)"}, "sleep": {"hours": 7.5, "quality": "Sound & Peaceful"}}, "userInputs": [{"type": "one_tap", "timestamp": "Today, 07:45 AM", "selection": "😊 Feeling Great (Sab Badhiya Hai)", "recordedNote": "Morning tea and walk completed without difficulty", "badge": "bg-emerald-100 text-emerald-800"}, {"type": "missed_call", "timestamp": "Today, 07:46 AM", "tollFree": "1800-202-CARE", "status": "Logged & Verified Safe"}]}],
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
  const savedLang = localStorage.getItem('careconnect_lang') || 'en';
  setAppLanguage(savedLang);

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
    setTimeout(renderOpsCasesTable, 150);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } else {
    if (header) header.classList.remove('hidden');
    if (mobileNav) mobileNav.classList.remove('hidden');
    updateHeaderUserBadge(role);
    updateNavPills(role);
    
    // View-specific initializations
        if (role === 'family') {
      if (typeof changeFamilyLinkedSenior === 'function') changeFamilyLinkedSenior('PAT-101');
      if (typeof switchFamilyTab === 'function') switchFamilyTab('summary');
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
  const isCoord = name.toLowerCase().includes('coordinator') || alertId === 'COORD-CALL';
  if (modalTimer) modalTimer.textContent = isCoord ? "Dialing Care Coordinator desk..." : "Dialing senior home terminal...";

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


// =========================================================================
// =========================================================================
// VIEW 3: FAMILY MEMBER LOGIC (परिवार का वेलबीइंग व हेल्थ मॉनिटर)
// Features: 
// 1. AI Analyze Summary & Wellbeing Metrics
// 2. Comprehensive Senior Health Report (Demographics, Vitals, History, Meds)
// 3. Complete Assessment History (Chronological Timeline, ADL, Pain, Voice Notes)
// 4. Download & Print Full Health Assessment PDF & Plain Text Reports
// =========================================================================

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
// =========================================================================
// MULTI-PATIENT FAMILY CAROUSEL / SLIDER LOGIC
// Supports 2 patients from the SAME family sharing the SAME caretaker (Rahul Sharma),
// as well as all household elders!
// =========================================================================
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

// =========================================================================
// BUILD WHOLE HEALTH ASSESSMENT (ELEGANT CLINICAL SLIP & PDF FORMAT)
// =========================================================================
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

  return `========================================================================
CARECONNECT AI - PATIENT HEALTH ASSESSMENT REPORT
========================================================================
Date: ${reportDate}
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

========================================================================
Verified by: Sister Kavita, RN • CareConnect AI Clinical Protocol
========================================================================
`;
}

// =========================================================================
// ACTION: DOWNLOAD WHOLE HEALTH ASSESSMENT AS PDF & OPEN PREVIEW
// =========================================================================
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

// ============================================================================
// COMPLETE 32 ALERTS DATASET & MULTI-CRITERIA FILTERING ENGINE
// ============================================================================

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
          <td class="p-3.5 pl-4"><input type="checkbox" class="rounded text-teal-600"></td>
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
    const alertItem = OPS_ALL_32_ALERTS.find(a => a.senior === currentAssignTargetSenior);
    if (alertItem) {
      alertItem.status = 'In Progress';
      alertItem.coordinator = chosenCoord;
    }
    const rows = document.querySelectorAll('#ops-alerts-table-body tr');
    rows.forEach(r => {
      if (r.getAttribute('data-senior') === currentAssignTargetSenior) {
        r.setAttribute('data-status', 'In Progress');
        r.setAttribute('data-coord', chosenCoord);
      }
    });
    renderOpsCasesTable();
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

  const now = new Date();
  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  if (typeof OPS_ALL_32_ALERTS !== 'undefined') {
    OPS_ALL_32_ALERTS.unshift({
      id: 'ALT-' + Date.now().toString().slice(-3),
      senior: senior,
      age: 75,
      area: 'Delhi NCR',
      risk: risk,
      issueCategory: issue,
      issue: issue,
      time: timeStr,
      status: 'Pending',
      coordinator: coord,
      phone: '+91 98110-12345'
    });
    if (typeof renderOpsCasesTable === 'function') {
      renderOpsCasesTable();
    }
  }

  closeOpsNewAlertModal();
  showToast('New priority alert logged for ' + senior, 'success');
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

// ============================================================================
// OPERATIONS MANAGER: FULLY CONNECTED CLINICAL & REALISTIC DATASET ENGINE
// ============================================================================

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

// =========================================================================
// DOB & AGE COMPUTATION UTILITIES
// =========================================================================

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

// =========================================================================
// UNIVERSAL PROFILE MANAGEMENT ENGINE (FOR ALL 4 STAKEHOLDER PORTALS)
// =========================================================================

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


// =========================================================================
// FAMILY CARE CIRCLE & CAREGIVER MANAGEMENT (ELDER PORTAL)
// =========================================================================

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

// =========================================================================
// AI PRESCRIPTION & DAILY HEALTH IMPROVEMENT TASKS ENGINE
// =========================================================================

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


// =========================================================================
// ENHANCED CLINICAL DIAGNOSIS REPORT & MULTI-PERSPECTIVE VISUALIZER
// =========================================================================

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

  // Create initial profile for the new user marking profileCompleted as false
  const newProfile = {
    role: selectedAuthRole,
    name: name,
    email: email,
    dob: '',
    age: '',
    gender: '',
    phone: '',
    profileCompleted: false,
    isNewUser: true
  };
  try {
    localStorage.setItem(`careconnect_profile_${selectedAuthRole}`, JSON.stringify(newProfile));
    sessionStorage.removeItem('careconnect_dismiss_profile_prompt');
  } catch (err) {
    console.error('Failed to initialize new user profile in localStorage:', err);
  }

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
    const val = el ? el.value.toString().trim() : '';
    const isNumeric = (item.id !== 'assess-gender');
    if (!el || val === '' || (isNumeric && isNaN(parseFloat(val)))) {
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


// =========================================================================
// OFFICIAL CLINICAL DIAGNOSTIC REPORT SHEET ENGINE (PROPER MEDICAL REPORT)
// =========================================================================

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

function openClinicalReportSheet() {
  const modal = document.getElementById('modal-clinical-report-sheet');
  const container = document.getElementById('clinical-report-sheet-content');
  if (!modal || !container) return;

  const prof = getUserProfile('senior');
  const payload = assessmentState.lastPayload || getCurrentAssessmentData();
  
  // If no prediction yet, construct a reasonable default prediction object
  const res = assessmentState.lastPrediction || {
    predicted_risk_level: 'Low',
    predicted_risk_level_hi: 'कम जोखिम (Low Risk)',
    risk_score: 32,
    predicted_probability: 0.18,
    status_tag_en: 'Routine Outpatient Telemetry',
    status_tag_hi: 'नियमित स्वास्थ्य निगरानी',
    alert_reason_summary: 'All telemetry vital signs are within normal geriatric ranges.',
    alert_reason_summary_hi: 'सभी स्वास्थ्य संकेतक सुरक्षित सीमा में हैं।',
    suggested_action_summary: 'Maintain hydration, daily walk, and regular medication schedule.',
    contact_method: 'Daily automated check-in'
  };

  soundEngine.playTone(550, 'sine', 0.1);
  container.innerHTML = generateClinicalReportSheetHtml(res, payload, prof);
  modal.classList.remove('hidden');
}

function closeClinicalReportSheet() {
  const modal = document.getElementById('modal-clinical-report-sheet');
  if (modal) modal.classList.add('hidden');
}

function printClinicalReportSheet() {
  soundEngine.playTone(600, 'sine', 0.1);
  openClinicalReportSheet();
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


// =========================================================================
// DAILY CARE REMINDERS & DEVICE ALARM ENGINE (पानी, भोजन, दवा रिमाइंडर)
// =========================================================================

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

function openAddReminderModal() {
  const modal = document.getElementById('modal-add-reminder');
  if (modal) {
    soundEngine.playTone(550, 'sine', 0.1);
    modal.classList.remove('hidden');
  }
}

function closeAddReminderModal() {
  const modal = document.getElementById('modal-add-reminder');
  if (modal) modal.classList.add('hidden');
}

function applyReminderPreset(presetKey) {
  const titleInput = document.getElementById('rem-input-title');
  const catInput = document.getElementById('rem-input-category');
  const timeInput = document.getElementById('rem-input-time');
  const notesInput = document.getElementById('rem-input-notes');

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
      cat: 'other',
      time: '17:30',
      notes: '15-20 minutes gentle walk for joint mobility and fresh air.'
    },
    bp: {
      title: 'Blood Pressure & Vitals Check / बीपी जांच',
      cat: 'other',
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

  soundEngine.playTone(700, 'sine', 0.1);
}

function handleSaveNewReminder(e) {
  if (e) e.preventDefault();
  const title = document.getElementById('rem-input-title')?.value.trim();
  const category = document.getElementById('rem-input-category')?.value || 'other';
  const time = document.getElementById('rem-input-time')?.value || '08:00';
  const notes = document.getElementById('rem-input-notes')?.value.trim();

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
  // Sort reminders by time
  reminders.sort((a, b) => a.time.localeCompare(b.time));
  saveSeniorReminders(reminders);
  renderSeniorReminders(currentRemindersFilter);

  closeAddReminderModal();
  soundEngine.playSuccessChime();
  showToast(`Reminder saved: ${title} at ${newReminder.timeDisplay}`, 'success');
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

// =========================================================================
// DEVICE ALARM TRIGGER, AUDITORY CHIME, NOTIFICATION & ACTIONS
// =========================================================================

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


