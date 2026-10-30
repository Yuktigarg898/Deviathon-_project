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
  currentCoordinatorTab: 'queue',
  currentDossierSubtab: 'history',
  patients: [{"id": "PAT-101", "username": "senior_ramesh", "name": "Ramesh Sharma", "age": 74, "gender": "Male", "avatar": "https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&auto=format&fit=crop&q=80", "location": "South Delhi (Greater Kailash, C-42)", "phone": "+91 98110-44912", "assignedNurse": "Sister Kavita, RN", "predictedTier": "CRITICAL", "tierLabel": "🚨 CRITICAL TIER", "tierColor": "rose", "modelScore": 80, "predictedProbability": "64.3%", "modelRiskLevel": "High Risk", "alertRaised": true, "alertId": "ALT-1091", "modelDrivers": ["Borderline Oxygen Saturation: SpO2 94.0%", "Elevated Blood Pressure: 158/96 mmHg", "Tachycardia Spike: Resting Heart Rate 114 bpm", "Moderate Pain (Level 4/10) in Lower Back & Left Knee", "Mobility Dependence: Unable to walk independently (High fall hazard)", "Toileting Dependence: Requires grab bar / personal support", "Medication Adherence Gap: Missed morning check-in & dose"], "suggestedAction": "Step 1: Immediate 2-way emergency call. Step 2: Emergency family notification. Step 3: Dispatch Nurse Kavita (ETA 12m).", "emergencyContact": {"name": "Rahul Sharma", "relation": "Son (Primary Caregiver)", "phone": "+91 98711-20931", "altPhone": "+91 98110-55441 (Anita Sharma, Daughter-in-law)", "email": "rahul.sharma@example.com", "address": "C-42, Greater Kailash-1, New Delhi", "notificationStatus": "Dispatched & Delivered", "channels": ["SMS", "WhatsApp", "App Push"], "dispatchedAt": "Today, 08:31 AM", "smsDelivered": true, "whatsappDelivered": true}, "medicalHistory": {"chronicConditions": ["Type-2 Diabetes Mellitus (12 yrs)", "Stage-2 Essential Hypertension", "Mild Left Knee Osteoarthritis"], "allergies": ["Sulfa antibiotics (skin rash / allergic dermatitis)"], "surgeries": ["Appendectomy (1998)", "Right Eye Cataract (2021)"], "bloodGroup": "B +ve", "doctor": "Dr. V.K. Kapoor (Senior Cardiologist, Fortis Escorts)", "nextReview": "15 Nov 2026", "medications": [{"name": "Tab Metformin", "dosage": "500 mg", "schedule": "1-0-1 (After Meals)", "purpose": "Glycemic Control", "adherence": "89%"}, {"name": "Tab Telmisartan", "dosage": "40 mg", "schedule": "1-0-0 (Morning 8 AM)", "purpose": "Blood Pressure", "adherence": "94%"}, {"name": "Tab Atorvastatin", "dosage": "10 mg", "schedule": "0-0-1 (Night 9 PM)", "purpose": "Cardiovascular & Lipid", "adherence": "92%"}, {"name": "Tab Calcium + D3", "dosage": "500 mg", "schedule": "1-0-0 (Afternoon)", "purpose": "Bone Health", "adherence": "95%"}]}, "checkups": [{"date": "Today, 08:30 AM", "bp": "158/96 mmHg", "bpStatus": "Critical Spike", "hr": "114 bpm", "hrStatus": "Tachycardia Spike", "spo2": "94%", "spo2Status": "Borderline Low", "glucose": "138 mg/dL", "temp": "98.4 °F", "weight": "68 kg", "bmi": "24.8", "conductedBy": "Home Bluetooth IoT Hub & Sister Kavita", "notes": "Resting HR spiked suddenly from baseline 74 to 114 bpm with zero motion for 4 hours."}, {"date": "Yesterday, 06:00 PM", "bp": "134/86 mmHg", "bpStatus": "Pre-Hypertension", "hr": "78 bpm", "hrStatus": "Normal", "spo2": "97%", "spo2Status": "Healthy", "glucose": "128 mg/dL", "temp": "98.2 °F", "weight": "68 kg", "bmi": "24.8", "conductedBy": "Sister Kavita (Routine check)", "notes": "Evening post-tea reading stable. Advised light stretching."}], "assessments": {"adl": {"eating": {"score": "10/10", "status": "Fully Independent"}, "toileting": {"score": "7/10", "status": "Requires Grab Bar Support"}, "walking": {"score": "6/10", "status": "Walks with Cane / Mild Instability"}, "moving": {"score": "7/10", "status": "Slight Difficulty Rising from Bed"}}, "pain": {"score": 4, "location": "Lower Back & Left Knee", "duration": "Chronic (Aggravates on cold mornings)", "sensation": "Dull ache (धीमा दर्द व जकड़न)"}, "sleep": {"hours": 5.2, "quality": "Restless (2 nighttime awakenings)"}}, "userInputs": [{"type": "voice", "timestamp": "Today, 08:15 AM", "hindiText": "आज सुबह से चक्कर बहुत आ रहे हैं, छाती पर भारीपन महसूस हो रहा है और सीढ़ियां चढ़ने की हिम्मत नहीं हो रही...", "englishTranslation": "Feeling severe dizziness since morning, heaviness on chest, and lacking energy to climb stairs...", "sentiment": "Distressed / High Anxiety", "sentimentBadge": "bg-rose-100 text-rose-800", "duration": "18 sec"}, {"type": "one_tap", "timestamp": "Yesterday, 09:30 AM", "selection": "🤒 Tabiyat Theek Nahi (Feeling Unwell)", "recordedNote": "Morning medicine delayed by 2 hours due to dizziness", "badge": "bg-amber-100 text-amber-800"}, {"type": "missed_call", "timestamp": "2 Days Ago, 08:02 AM", "tollFree": "1800-202-CARE", "status": "Logged & Verified Safe"}]}, {"id": "PAT-102", "username": "senior_savitri", "name": "Savitri Devi", "age": 81, "gender": "Female", "avatar": "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=150&auto=format&fit=crop&q=80", "location": "Hauz Khas (Enclave 4, Flat 12B)", "phone": "+91 98103-99210", "assignedNurse": "Brother Amit, Paramedic", "predictedTier": "CRITICAL", "tierLabel": "🚨 CRITICAL TIER", "tierColor": "rose", "modelScore": 62, "predictedProbability": "63.2%", "modelRiskLevel": "High Risk", "alertRaised": true, "alertId": "ALT-1088", "modelDrivers": ["Elevated Blood Pressure: 142/88 mmHg", "Severe Pain (Level 8/10) reported in Right Hip & Lumbar", "Mobility Dependence: Unable to walk independently (High fall hazard)", "Toileting Dependence: Supervised required post fall impact", "Impact shock sensor triggered in bathroom"], "suggestedAction": "Priority dispatch Paramedic Amit for fracture assessment & tele-radiology.", "emergencyContact": {"name": "Priya Verma", "relation": "Daughter", "phone": "+91 99100-33421", "altPhone": "+91 98188-44211 (Dr. Alok Verma, Son-in-law)", "email": "priya.verma@example.com", "address": "Hauz Khas Enclave, New Delhi", "notificationStatus": "Dispatched & Delivered", "channels": ["SMS", "WhatsApp", "App Push"], "dispatchedAt": "Today, 06:51 AM", "smsDelivered": true, "whatsappDelivered": true}, "medicalHistory": {"chronicConditions": ["Severe Osteoporosis (T-score -3.1)", "Post-Fall Fragility", "Mild Cognitive Impairment", "Stage-1 Hypertension"], "allergies": ["Penicillin & Cephalosporins"], "surgeries": ["Left Wrist Colles Fracture Fixation (2022)"], "bloodGroup": "O +ve", "doctor": "Dr. Sunita Aggarwal (AIIMS)", "nextReview": "22 Nov 2026", "medications": [{"name": "Tab Amlodipine", "dosage": "5 mg", "schedule": "1-0-0 (Morning)", "purpose": "Blood Pressure", "adherence": "96%"}, {"name": "Tab Alendronate", "dosage": "70 mg", "schedule": "Once Weekly (Sunday)", "purpose": "Bone Mineral", "adherence": "90%"}, {"name": "Tab Donepezil", "dosage": "5 mg", "schedule": "0-0-1 (Night)", "purpose": "Cognitive Support", "adherence": "91%"}]}, "checkups": [{"date": "Today, 06:50 AM", "bp": "142/88 mmHg", "bpStatus": "Elevated", "hr": "88 bpm", "hrStatus": "Normal", "spo2": "97%", "spo2Status": "Healthy", "glucose": "110 mg/dL", "temp": "98.2 °F", "weight": "54 kg", "bmi": "21.6", "conductedBy": "Bathroom Sensor & Brother Amit", "notes": "Fall impact event detected at 06:45 AM. Senior immobilized on bathroom rug."}], "assessments": {"adl": {"eating": {"score": "9/10", "status": "Independent"}, "toileting": {"score": "4/10", "status": "Supervised Required / High Fall Risk"}, "walking": {"score": "4/10", "status": "Unsteady Gait / High Fall Hazard"}, "moving": {"score": "5/10", "status": "Needs Bedside Support"}}, "pain": {"score": 8, "location": "Right Hip & Lumbar Spine", "duration": "Acute post-fall impact", "sensation": "Sharp stabbing pain (तेज दर्द व चुभन)"}, "sleep": {"hours": 4.8, "quality": "Frequent waking, nocturia"}}, "userInputs": [{"type": "voice", "timestamp": "Today, 06:52 AM", "hindiText": "बाथरूम में फिसल गई थी, कमर में तेज दर्द है, उठा नहीं जा रहा...", "englishTranslation": "Slipped in the bathroom, sharp pain in lower back, unable to get up...", "sentiment": "Acute Physical Pain & Distress", "sentimentBadge": "bg-rose-100 text-rose-800", "duration": "14 sec"}]}, {"id": "PAT-103", "username": "senior_anand", "name": "Anand Verma", "age": 78, "gender": "Male", "avatar": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80", "location": "Saket (Sector 3, House 104)", "phone": "+91 98734-11823", "assignedNurse": "Rajesh Kumar (Buddy)", "predictedTier": "CRITICAL", "tierLabel": "🚨 CRITICAL TIER", "tierColor": "rose", "modelScore": 53, "predictedProbability": "68.6%", "modelRiskLevel": "High Risk", "alertRaised": true, "alertId": "ALT-1074", "modelDrivers": ["Severe Hyperglycemia: Fasting Blood Glucose 228 mg/dL", "Medication Adherence Gap: Missed 2 consecutive insulin doses", "Diabetic Neuropathy tingling in soles", "Risk of Diabetic Ketoacidosis / Hyperosmolar state"], "suggestedAction": "Doorstep visit by Buddy Rajesh to verify insulin cold chain & dose administration.", "emergencyContact": {"name": "Deepak Verma", "relation": "Son", "phone": "+91 98112-99881", "altPhone": "+91 98733-11223 (Ritu Verma, Daughter)", "email": "deepak.verma@example.com", "address": "Saket, Sector 3, New Delhi", "notificationStatus": "Dispatched & Delivered", "channels": ["SMS", "WhatsApp"], "dispatchedAt": "Today, 07:20 AM", "smsDelivered": true, "whatsappDelivered": true}, "medicalHistory": {"chronicConditions": ["Uncontrolled Type-2 Diabetes (HbA1c 9.2%)", "Chronic Kidney Disease Stage 2", "Diabetic Peripheral Neuropathy"], "allergies": ["None documented"], "surgeries": ["Coronary Angioplasty (2017)"], "bloodGroup": "A +ve", "doctor": "Dr. Pradeep Batra (Max Saket)", "nextReview": "10 Nov 2026", "medications": [{"name": "Inj Insulin Glargine", "dosage": "16 units", "schedule": "0-0-1 (Night 10 PM)", "purpose": "Basal Glycemic", "adherence": "72% (Missed 2 days)"}, {"name": "Tab Linagliptin", "dosage": "5 mg", "schedule": "1-0-0 (Morning)", "purpose": "Glucose Control", "adherence": "95%"}, {"name": "Tab Pregabalin", "dosage": "75 mg", "schedule": "0-0-1 (Night)", "purpose": "Neuropathy Pain", "adherence": "88%"}]}, "checkups": [{"date": "Today, 07:15 AM", "bp": "132/84 mmHg", "bpStatus": "Normal", "hr": "76 bpm", "hrStatus": "Normal", "spo2": "98%", "spo2Status": "Healthy", "glucose": "228 mg/dL", "glucoseStatus": "Severe Hyperglycemia", "temp": "98.6 °F", "weight": "72 kg", "bmi": "25.2", "conductedBy": "Bluetooth Glucometer Sync", "notes": "Fasting blood sugar 228 mg/dL. Consecutive 2-day missed evening insulin reminder."}], "assessments": {"adl": {"eating": {"score": "10/10", "status": "Independent"}, "toileting": {"score": "9/10", "status": "Independent"}, "walking": {"score": "8/10", "status": "Independent"}, "moving": {"score": "9/10", "status": "Independent"}}, "pain": {"score": 3, "location": "Bilateral Soles / Feet", "duration": "Nightly burning sensation", "sensation": "Burning neuropathy (पैरों में जलन)"}, "sleep": {"hours": 6.5, "quality": "Fair"}}, "userInputs": [{"type": "one_tap", "timestamp": "Today, 08:30 AM", "selection": "💊 Took Medicine (Dawa le li)", "recordedNote": "Oral tablets taken; insulin dose compliance pending confirmation", "badge": "bg-emerald-100 text-emerald-800"}, {"type": "voice", "timestamp": "Yesterday, 08:15 PM", "hindiText": "पैरों में बहुत झनझनाहट हो रही है और बहुत प्यास लग रही है...", "englishTranslation": "Feet are tingling severely and feeling unusually thirsty...", "sentiment": "Discomfort / Neuropathy Symptom", "sentimentBadge": "bg-amber-100 text-amber-800", "duration": "12 sec"}]}, {"id": "PAT-104", "username": "senior_meena", "name": "Meena Iyer", "age": 72, "gender": "Female", "avatar": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80", "location": "Vasant Kunj (Pocket B, Apt 302)", "phone": "+91 98188-77219", "assignedNurse": "Sister Sunita, Counselor", "predictedTier": "MODERATE", "tierLabel": "🟡 MODERATE TIER", "tierColor": "amber", "modelScore": 25, "predictedProbability": "38.9%", "modelRiskLevel": "Medium Risk", "alertRaised": false, "modelDrivers": ["Severe Sleep Deficit: Only 4.1 hours of sleep", "Bereavement anniversary emotional distress voice note", "Cardiovascular parameters remain stable (BP 124/80, HR 72, SpO2 98%)"], "suggestedAction": "15-minute compassionate reassurance tele-consult with Buddy Sunita & family notification.", "emergencyContact": {"name": "Karthik Iyer", "relation": "Son (Bengaluru)", "phone": "+91 97400-55120", "altPhone": "+91 98188-99001", "email": "karthik.iyer@example.com", "address": "Indiranagar, Bengaluru (Outstation Family)", "notificationStatus": "Monitoring Only (No Alert Raised)", "channels": ["Routine Portal"], "dispatchedAt": null, "smsDelivered": false, "whatsappDelivered": false}, "medicalHistory": {"chronicConditions": ["Hypothyroidism", "Mild Depressive Episodes (Post-bereavement)", "Cervical Spondylosis"], "allergies": ["Dust mite & pollen"], "surgeries": ["None"], "bloodGroup": "B +ve", "doctor": "Dr. Rashmi Sen (Medanta)", "nextReview": "30 Nov 2026", "medications": [{"name": "Tab Thyronorm", "dosage": "50 mcg", "schedule": "1-0-0 (7 AM)", "purpose": "Thyroid", "adherence": "98%"}, {"name": "Tab Escitalopram", "dosage": "10 mg", "schedule": "1-0-0 (Morning)", "purpose": "Mood", "adherence": "93%"}]}, "checkups": [{"date": "Today, 08:00 AM", "bp": "124/80 mmHg", "bpStatus": "Optimal", "hr": "72 bpm", "hrStatus": "Normal", "spo2": "98%", "spo2Status": "Healthy", "glucose": "105 mg/dL", "temp": "98.1 °F", "weight": "58 kg", "bmi": "23.2", "conductedBy": "Self-Monitoring IoT Cuff", "notes": "Hemodynamic parameters stable. Mood assessment flagged low."}], "assessments": {"adl": {"eating": {"score": "9/10", "status": "Independent"}, "toileting": {"score": "9/10", "status": "Independent"}, "walking": {"score": "9/10", "status": "Independent"}, "moving": {"score": "9/10", "status": "Independent"}}, "pain": {"score": 2, "location": "Neck / Upper Shoulder", "duration": "Postural stiffness", "sensation": "Mild tightness (गर्दन में हल्की जकड़न)"}, "sleep": {"hours": 4.1, "quality": "Insomnia (Difficulty falling asleep)"}}, "userInputs": [{"type": "voice", "timestamp": "Today, 07:15 AM", "hindiText": "आज अकेलापन बहुत लग रहा है, किसी से बात करने का मन है...", "englishTranslation": "Feeling very lonely today, wish to speak with someone...", "sentiment": "Severe Sadness & Disorientation", "sentimentBadge": "bg-purple-100 text-purple-800", "duration": "16 sec"}]}, {"id": "PAT-105", "username": "senior_harish", "name": "Harish Patel", "age": 76, "gender": "Male", "avatar": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80", "location": "Malviya Nagar (Block E-12)", "phone": "+91 98199-33812", "assignedNurse": "Sister Kavita, RN", "predictedTier": "NORMAL", "tierLabel": "🟢 NORMAL TIER", "tierColor": "emerald", "modelScore": 9, "predictedProbability": "18.2%", "modelRiskLevel": "Low Risk", "alertRaised": false, "modelDrivers": ["All vital signs, mobility, sleep, and medication adherence are within healthy normal ranges.", "Blood pressure normal: 122/80 mmHg, Heart rate: 72 bpm, SpO2: 98%", "Functional ADLs 100% independent (Eating, Walking, Toileting, Moving)", "Zero missed medication doses in past 30 days"], "suggestedAction": "Routine monitoring & Bluetooth cuff weekly sync. No intervention required.", "emergencyContact": {"name": "Sneha Patel", "relation": "Daughter", "phone": "+91 98200-44910", "altPhone": "+91 98199-22110 (Manoj Patel, Son)", "email": "sneha.patel@example.com", "address": "Malviya Nagar, New Delhi", "notificationStatus": "Standby (No Alert Raised - Alarm Fatigue Averted)", "channels": ["Routine Portal"], "dispatchedAt": null, "smsDelivered": false, "whatsappDelivered": false}, "medicalHistory": {"chronicConditions": ["Well-Controlled Hypertension", "Benign Prostatic Hyperplasia (BPH)", "Mild Dyslipidemia"], "allergies": ["No known drug allergies"], "surgeries": ["None"], "bloodGroup": "AB +ve", "doctor": "Dr. R.K. Mehta (Max Smart Super)", "nextReview": "05 Dec 2026", "medications": [{"name": "Tab Telmisartan", "dosage": "40 mg", "schedule": "1-0-0 (Morning)", "purpose": "Blood Pressure", "adherence": "98%"}, {"name": "Tab Silodosin", "dosage": "8 mg", "schedule": "0-0-1 (Night)", "purpose": "Urinary Flow", "adherence": "96%"}, {"name": "Tab Rosuvastatin", "dosage": "10 mg", "schedule": "0-0-1 (Night)", "purpose": "Lipids", "adherence": "94%"}]}, "checkups": [{"date": "Today, 07:30 AM", "bp": "122/80 mmHg", "bpStatus": "Optimal Normal", "hr": "72 bpm", "hrStatus": "Normal", "spo2": "98%", "spo2Status": "Healthy", "glucose": "108 mg/dL", "temp": "98.2 °F", "weight": "70 kg", "bmi": "24.2", "conductedBy": "Home Bluetooth IoT Hub", "notes": "Morning checkup completed smoothly. Vitals in optimal green range."}], "assessments": {"adl": {"eating": {"score": "10/10", "status": "Independent"}, "toileting": {"score": "10/10", "status": "Independent"}, "walking": {"score": "10/10", "status": "Independent"}, "moving": {"score": "10/10", "status": "Independent"}}, "pain": {"score": 0, "location": "None", "duration": "None", "sensation": "No Pain (दर्द मुक्त)"}, "sleep": {"hours": 7.5, "quality": "Sound & Peaceful"}}, "userInputs": [{"type": "one_tap", "timestamp": "Today, 07:45 AM", "selection": "😊 Feeling Great (Sab Badhiya Hai)", "recordedNote": "Morning tea and walk completed without difficulty", "badge": "bg-emerald-100 text-emerald-800"}, {"type": "missed_call", "timestamp": "Today, 07:46 AM", "tollFree": "1800-202-CARE", "status": "Logged & Verified Safe"}]}],
  emergencyNotifications: [{"id": "NOTIF-901", "alertId": "ALT-1091", "seniorId": "PAT-101", "seniorName": "Ramesh Sharma", "username": "senior_ramesh", "contactName": "Rahul Sharma (Son)", "contactPhone": "+91 98711-20931", "predictedTier": "CRITICAL TIER", "channels": ["SMS", "WhatsApp", "Push Notification"], "severity": "CRITICAL", "timestamp": "Today, 08:31 AM", "smsMessage": "🚨 CareConnect CRITICAL ALERT: Ramesh Sharma (@senior_ramesh, 74y) classified in CRITICAL TIER by AI ML model (Risk Score 80/100). Resting HR spike 114 bpm + SpO2 94% + Missed check-in. Coordinator Sister Kavita dispatched. Dial: +91 98110-44912", "whatsappMessage": "🚨 *CareConnect CRITICAL TIER ALERT*\n*Patient:* Ramesh Sharma (@senior_ramesh, Age 74)\n*ML Model Predicted Tier:* CRITICAL (Score 80/100 • 64.3% Risk)\n*Drivers:* Tachycardia (114 bpm) + SpO2 94% + Missed check-in + 4hr immobility\n*Action:* Sister Kavita dispatched (ETA 12m)\n*Direct Dial Senior:* +91 98110-44912", "deliveryStatus": "Delivered", "readReceipt": true}, {"id": "NOTIF-902", "alertId": "ALT-1088", "seniorId": "PAT-102", "seniorName": "Savitri Devi", "username": "senior_savitri", "contactName": "Priya Verma (Daughter)", "contactPhone": "+91 99100-33421", "predictedTier": "CRITICAL TIER", "channels": ["SMS", "WhatsApp", "Push Notification"], "severity": "CRITICAL", "timestamp": "Today, 06:51 AM", "smsMessage": "🚨 CareConnect CRITICAL ALERT: Savitri Devi (@senior_savitri, 81y) classified in CRITICAL TIER. Fall sensor triggered + Acute pain 8/10 reported via voice note. Paramedic Amit dispatched. Dial: +91 98103-99210", "whatsappMessage": "🚨 *CareConnect CRITICAL TIER ALERT*\n*Patient:* Savitri Devi (@senior_savitri, Age 81)\n*ML Model Predicted Tier:* CRITICAL (Score 62/100)\n*Drivers:* Bathroom fall sensor trigger + Voice Note: 'चक्कर आ गए थे और कमर में तेज दर्द है'\n*Action:* Paramedic Amit dispatched (ETA 18m)", "deliveryStatus": "Delivered", "readReceipt": true}, {"id": "NOTIF-903", "alertId": "ALT-1074", "seniorId": "PAT-103", "seniorName": "Anand Verma", "username": "senior_anand", "contactName": "Deepak Verma (Son)", "contactPhone": "+91 98112-99881", "predictedTier": "CRITICAL TIER", "channels": ["SMS", "WhatsApp"], "severity": "CRITICAL", "timestamp": "Today, 07:20 AM", "smsMessage": "🚨 CareConnect CRITICAL ALERT: Anand Verma (@senior_anand, 78y) classified in CRITICAL TIER. Severe Hyperglycemia (228 mg/dL) + 2 missed insulin doses. Buddy Rajesh dispatched. Dial: +91 98734-11823", "whatsappMessage": "🚨 *CareConnect CRITICAL TIER ALERT*\n*Patient:* Anand Verma (@senior_anand, Age 78)\n*ML Model Predicted Tier:* CRITICAL (Score 53/100 • 68.6% Risk)\n*Drivers:* Blood Sugar 228 mg/dL + 2 Missed Insulin Doses\n*Action:* Buddy Rajesh dispatched for insulin verification", "deliveryStatus": "Delivered", "readReceipt": true}],
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
  // Initialize clean language state from saved preference or English default
  const savedLang = localStorage.getItem('careconnect_lang') || 'en';
  setAppLanguage(savedLang);

  // Start on the Login / Role Selection Page
  navigateRole('login');
  renderCoordinatorAlerts();
  renderOpsTeamTable();
  populateOpsIncidentStream();
  if (typeof renderFamilyCareCircle === 'function') renderFamilyCareCircle();
  if (typeof autoFillSeniorProfileData === 'function') autoFillSeniorProfileData();
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
    if (role === 'coordinator') {
      if (typeof renderCoordinatorAlerts === 'function') renderCoordinatorAlerts();
      if (typeof renderCoordinatorPatients === 'function') renderCoordinatorPatients();
      if (typeof updateCoordinatorCriticalBanner === 'function') updateCoordinatorCriticalBanner();
    } else if (role === 'family') {
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

// VIEW 1: CARE COORDINATOR LOGIC - AI ML TIER CLASSIFICATION ENGINE
// Powered by Random Forest Model (ApnaSa 90,000 Records Dataset)
// Evaluates: Patient Data + Medical History + Medical Assessment + Senior Inputs
// Classifies into: CRITICAL TIER (Alert Raised + Family Notified) vs NORMAL TIER (Safe Baseline)

let currentDossierPatient = null;
let currentTierFilter = 'all';

function setTierFilter(tier) {
  currentTierFilter = tier;
  const sel = document.getElementById('coord-patient-status-filter');
  if (sel) sel.value = tier;

  // Update pills visual state
  const pills = ['all', 'CRITICAL', 'NORMAL', 'MODERATE'];
  pills.forEach(p => {
    const el = document.getElementById('tier-pill-' + p.toLowerCase());
    if (el) {
      if (p === tier) {
        el.className = "px-3 py-1.5 rounded-xl text-xs font-extrabold bg-white text-slate-900 border border-white shadow-sm transition-all";
      } else {
        const color = p === 'CRITICAL' ? 'rose' : (p === 'NORMAL' ? 'emerald' : (p === 'MODERATE' ? 'amber' : 'slate'));
        el.className = `px-3 py-1.5 rounded-xl text-xs font-extrabold bg-${color}-600/30 text-${color}-300 hover:bg-${color}-600 hover:text-white border border-${color}-500/50 transition-all flex items-center space-x-1`;
      }
    }
  });

  renderCoordinatorPatients();
}

function getPatientByNameOrId(identifier) {
  if (!state.patients || state.patients.length === 0) return null;
  const target = String(identifier || '').toLowerCase().trim();
  return state.patients.find(p => 
    p.id.toLowerCase() === target || 
    p.username.toLowerCase() === target || 
    target.includes(p.name.toLowerCase()) || 
    p.name.toLowerCase().includes(target)
  ) || state.patients[0];
}

// 1. Tab Switching: Priority Queue vs Patients vs Notifications Log
function switchCoordinatorTab(tabName) {
  state.currentCoordinatorTab = tabName;
  const tabQueue = document.getElementById('coord-tab-content-queue');
  const tabPatients = document.getElementById('coord-tab-content-patients');
  const tabNotifs = document.getElementById('coord-tab-content-notifications');

  const btnQueue = document.getElementById('coord-tab-btn-queue');
  const btnPatients = document.getElementById('coord-tab-btn-patients');
  const btnNotifs = document.getElementById('coord-tab-btn-notifications');

  if (tabQueue) tabQueue.classList.add('hidden');
  if (tabPatients) tabPatients.classList.add('hidden');
  if (tabNotifs) tabNotifs.classList.add('hidden');

  [btnQueue, btnPatients, btnNotifs].forEach(b => {
    if (b) {
      b.classList.remove('bg-teal-600', 'text-white', 'shadow-sm');
      b.classList.add('text-slate-600', 'hover:text-slate-900', 'hover:bg-slate-100');
    }
  });

  if (tabName === 'queue') {
    if (tabQueue) tabQueue.classList.remove('hidden');
    if (btnQueue) {
      btnQueue.classList.remove('text-slate-600', 'hover:text-slate-900', 'hover:bg-slate-100');
      btnQueue.classList.add('bg-teal-600', 'text-white', 'shadow-sm');
    }
    renderCoordinatorAlerts();
  } else if (tabName === 'patients') {
    if (tabPatients) tabPatients.classList.remove('hidden');
    if (btnPatients) {
      btnPatients.classList.remove('text-slate-600', 'hover:text-slate-900', 'hover:bg-slate-100');
      btnPatients.classList.add('bg-teal-600', 'text-white', 'shadow-sm');
    }
    renderCoordinatorPatients();
  } else if (tabName === 'notifications') {
    if (tabNotifs) tabNotifs.classList.remove('hidden');
    if (btnNotifs) {
      btnNotifs.classList.remove('text-slate-600', 'hover:text-slate-900', 'hover:bg-slate-100');
      btnNotifs.classList.add('bg-teal-600', 'text-white', 'shadow-sm');
    }
    renderEmergencyNotificationsLog();
  }
}

// 2. Render Ranked Priority Queue (Tab 1)
function renderCoordinatorAlerts() {
  const container = document.getElementById('coordinator-alert-list');
  if (!container) return;

  const searchInput = document.getElementById('coordinator-search-input');
  const priorityFilter = document.getElementById('coordinator-priority-filter');
  
  const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
  const filter = priorityFilter ? priorityFilter.value : 'all';

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

  list.sort((a, b) => a.rank - b.rank);

  const critCount = state.alerts.filter(a => a.priority === 'critical' && a.status !== 'resolved').length;
  const highCount = state.alerts.filter(a => a.priority === 'high' && a.status !== 'resolved').length;
  const totalActive = state.alerts.filter(a => a.status !== 'resolved').length;
  const totalResolved = state.resolvedAlerts.length;

  const elCrit = document.getElementById('stat-critical-count');
  if (elCrit) elCrit.textContent = critCount;
  const elHigh = document.getElementById('stat-high-count');
  if (elHigh) elHigh.textContent = highCount;
  const elActive = document.getElementById('stat-active-cases');
  if (elActive) elActive.textContent = totalActive;
  const elRes = document.getElementById('stat-resolved-count');
  if (elRes) elRes.textContent = totalResolved;

  const bQueue = document.getElementById('coord-badge-queue');
  if (bQueue) bQueue.textContent = totalActive;
  const bPatients = document.getElementById('coord-badge-patients');
  if (bPatients) bPatients.textContent = state.patients ? state.patients.length : 5;
  const bNotifs = document.getElementById('coord-badge-notifications');
  if (bNotifs) bNotifs.textContent = state.emergencyNotifications ? state.emergencyNotifications.length : 3;

  updateCoordinatorCriticalBanner();

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
    const matchedPatient = getPatientByNameOrId(item.patientId || item.seniorName);
    const username = matchedPatient ? matchedPatient.username : (item.username || 'senior_' + item.seniorName.toLowerCase().replace(/[^a-z]/g, ''));
    const patientId = matchedPatient ? matchedPatient.id : 'PAT-101';
    const emergencyContactStr = matchedPatient ? `${matchedPatient.emergencyContact.name} (${matchedPatient.emergencyContact.relation}) • ${matchedPatient.emergencyContact.phone}` : item.familyContact;

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
        <!-- Top Row: ML Predicted Tier Banner & Senior Info -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div class="flex items-center space-x-3.5">
            <div class="w-10 h-10 rounded-xl ${rankBadgeClass} flex items-center justify-center font-extrabold text-sm flex-shrink-0" title="Daily Priority Rank #${item.rank}">
              #${item.rank}
            </div>

            <div>
              <div class="flex flex-wrap items-center gap-2">
                <h3 class="text-base sm:text-lg font-bold text-slate-900">${item.seniorName}</h3>
                <span class="px-2 py-0.5 rounded-md text-xs font-mono font-bold bg-slate-100 text-slate-700 border border-slate-200" title="Senior Username">
                  @${username}
                </span>
                <span class="text-xs text-slate-500">(${item.age} Yrs • ${item.gender || 'Senior'})</span>
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-rose-600 text-white shadow-sm">
                  ${pulseEffect} 🚨 ML PREDICTED: CRITICAL TIER
                </span>
              </div>
              <div class="text-xs text-slate-500 mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
                <span><i class="fa-solid fa-location-dot text-teal-600 mr-1"></i>${item.location}</span>
                <span class="text-indigo-700 font-medium"><i class="fa-solid fa-shield-heart text-rose-500 mr-1"></i>${emergencyContactStr}</span>
                <span><i class="fa-solid fa-clock text-slate-400 mr-1"></i>${item.timeAgo}</span>
                <span class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                  <i class="fa-solid fa-check-double mr-1 text-emerald-600"></i>SMS & WhatsApp Dispatched
                </span>
              </div>
            </div>
          </div>

          <div class="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100">
            <div class="text-xs font-semibold text-slate-500">ML Risk Score:</div>
            <div class="font-extrabold text-sm sm:text-base text-rose-600">
              ${item.priorityScore} / 100
            </div>
          </div>
        </div>

        <!-- Middle Row: ROOT CAUSE ALERT REASON & SUGGESTED ACTION -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
          <div class="bg-slate-50 rounded-xl p-3.5 border border-slate-200/80">
            <div class="flex items-center space-x-1.5 text-xs font-bold text-rose-700 uppercase tracking-wider mb-1.5">
              <i class="fa-solid fa-circle-exclamation"></i>
              <span>ML Model Trigger & Root Cause:</span>
            </div>
            <p class="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
              ${item.reason}
            </p>
            ${item.vitals ? `
              <div class="mt-3 flex flex-wrap items-center gap-1.5 text-[11px]">
                <span class="bg-white px-2 py-0.5 rounded border border-slate-200 font-mono text-slate-600">BP: <strong class="text-slate-900">${item.vitals.bp}</strong></span>
                <span class="bg-white px-2 py-0.5 rounded border border-slate-200 font-mono text-slate-600">HR: <strong class="text-rose-600 font-bold">${item.vitals.hr}</strong></span>
                <span class="bg-white px-2 py-0.5 rounded border border-slate-200 font-mono text-slate-600">SpO2: <strong class="text-slate-900">${item.vitals.spo2}</strong></span>
              </div>
            ` : ''}
          </div>

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

        <!-- Action Buttons -->
        <div class="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
          <div class="flex flex-wrap items-center gap-2">
            <button onclick="openPatientDossier('${patientId}')" class="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center space-x-1.5">
              <i class="fa-solid fa-folder-open"></i>
              <span>View Medical Record & Inputs</span>
            </button>
            <button onclick="openCallModal('${item.id}', '${item.seniorName}', '${item.phone}')" class="px-3.5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center space-x-1.5">
              <i class="fa-solid fa-phone"></i>
              <span>2-Way Call</span>
            </button>
            <button onclick="openDispatchModal('${item.id}', '${item.seniorName}')" class="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 rounded-xl text-xs font-semibold transition-all flex items-center space-x-1.5">
              <i class="fa-solid fa-person-walking-arrow-right"></i>
              <span>Dispatch</span>
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
  const searchInput = document.getElementById('coordinator-search-input');
  const priorityFilter = document.getElementById('coordinator-priority-filter');
  if (searchInput) searchInput.value = '';
  if (priorityFilter) priorityFilter.value = 'all';
  renderCoordinatorAlerts();
  showToast('Priority Queue refreshed and synced with ML inference engine.', 'info');
}

// 3. Render Patient Directory & ML Predicted Tiers Cards (Tab 2)
function renderCoordinatorPatients() {
  const container = document.getElementById('coordinator-patients-grid');
  if (!container) return;

  const searchInput = document.getElementById('coord-patient-search');
  const statusFilter = document.getElementById('coord-patient-status-filter');
  const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
  const filter = currentTierFilter !== 'all' ? currentTierFilter : (statusFilter ? statusFilter.value : 'all');

  let list = (state.patients || []).filter(p => {
    if (filter !== 'all' && p.predictedTier !== filter) return false;
    if (query) {
      const match = p.name.toLowerCase().includes(query) ||
                    p.username.toLowerCase().includes(query) ||
                    p.location.toLowerCase().includes(query) ||
                    (p.medicalHistory && p.medicalHistory.chronicConditions.some(c => c.toLowerCase().includes(query)));
      if (!match) return false;
    }
    return true;
  });

  if (list.length === 0) {
    container.innerHTML = `
      <div class="col-span-2 bg-white rounded-2xl p-12 text-center border border-slate-200">
        <i class="fa-solid fa-users-slash text-slate-300 text-3xl mb-3"></i>
        <h4 class="text-sm font-bold text-slate-800">No matching patients in this tier</h4>
        <p class="text-xs text-slate-500 mt-1">Try selecting 'All Tiers' or changing search keyword.</p>
        <button onclick="setTierFilter('all')" class="mt-4 px-4 py-2 bg-teal-600 text-white rounded-xl text-xs font-bold shadow-sm">
          Show All Patients
        </button>
      </div>
    `;
    return;
  }

  container.innerHTML = list.map(p => {
    const isCritical = (p.predictedTier === 'CRITICAL');
    const isNormal = (p.predictedTier === 'NORMAL');

    // 1. TIER BANNER HTML
    let tierBannerHtml = '';
    if (isCritical) {
      tierBannerHtml = `
        <div class="bg-gradient-to-r from-rose-600 to-red-700 text-white rounded-2xl p-3.5 mb-4 shadow-md shadow-rose-600/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border border-rose-400">
          <div class="flex items-center space-x-2.5">
            <span class="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center font-bold text-base flex-shrink-0">
              <i class="fa-solid fa-triangle-exclamation animate-bounce"></i>
            </span>
            <div>
              <div class="text-[10px] uppercase tracking-wider text-rose-200 font-extrabold">ML Model Predicted Tier:</div>
              <div class="text-sm sm:text-base font-extrabold">🚨 CRITICAL TIER (गंभीर जोखिम)</div>
            </div>
          </div>
          <div class="flex items-center space-x-2 sm:text-right">
            <span class="px-2.5 py-1 rounded-lg text-xs font-mono font-extrabold bg-white text-rose-800 shadow-sm">
              Score: ${p.modelScore}/100
            </span>
            <span class="text-xs text-rose-100 font-mono font-bold">${p.predictedProbability} Risk</span>
          </div>
        </div>
      `;
    } else if (isNormal) {
      tierBannerHtml = `
        <div class="bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-2xl p-3.5 mb-4 shadow-md shadow-emerald-600/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border border-emerald-400">
          <div class="flex items-center space-x-2.5">
            <span class="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center font-bold text-base flex-shrink-0">
              <i class="fa-solid fa-circle-check"></i>
            </span>
            <div>
              <div class="text-[10px] uppercase tracking-wider text-emerald-200 font-extrabold">ML Model Predicted Tier:</div>
              <div class="text-sm sm:text-base font-extrabold">🟢 NORMAL TIER (सामान्य / सुरक्षित)</div>
            </div>
          </div>
          <div class="flex items-center space-x-2 sm:text-right">
            <span class="px-2.5 py-1 rounded-lg text-xs font-mono font-extrabold bg-white text-emerald-800 shadow-sm">
              Score: ${p.modelScore}/100
            </span>
            <span class="text-xs text-emerald-100 font-mono font-bold">Stable (${p.predictedProbability})</span>
          </div>
        </div>
      `;
    } else {
      tierBannerHtml = `
        <div class="bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-2xl p-3.5 mb-4 shadow-md shadow-amber-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border border-amber-400">
          <div class="flex items-center space-x-2.5">
            <span class="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center font-bold text-base flex-shrink-0">
              <i class="fa-solid fa-bell"></i>
            </span>
            <div>
              <div class="text-[10px] uppercase tracking-wider text-amber-100 font-extrabold">ML Model Predicted Tier:</div>
              <div class="text-sm sm:text-base font-extrabold">🟡 MODERATE TIER (मध्यम निगरानी)</div>
            </div>
          </div>
          <div class="flex items-center space-x-2 sm:text-right">
            <span class="px-2.5 py-1 rounded-lg text-xs font-mono font-extrabold bg-white text-amber-800 shadow-sm">
              Score: ${p.modelScore}/100
            </span>
            <span class="text-xs text-amber-100 font-mono font-bold">${p.predictedProbability}</span>
          </div>
        </div>
      `;
    }

    const latestCheckup = (p.checkups && p.checkups.length > 0) ? p.checkups[0] : null;
    const latestInput = (p.userInputs && p.userInputs.length > 0) ? p.userInputs[0] : null;
    const conditionsList = (p.medicalHistory && p.medicalHistory.chronicConditions) || [];
    const driversList = p.modelDrivers || [];

    return `
      <div class="bg-white rounded-3xl border-2 ${isCritical ? 'border-rose-300 ring-2 ring-rose-200' : (isNormal ? 'border-emerald-300' : 'border-slate-200')} p-5 sm:p-6 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between">
        <div>
          <!-- 1. Model Tier Header -->
          ${tierBannerHtml}

          <!-- 2. Patient Identity Row: Avatar, Username, Demographics -->
          <div class="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
            <div class="flex items-center space-x-3">
              <img src="${p.avatar}" alt="${p.name}" class="w-14 h-14 rounded-2xl object-cover border-2 border-slate-200 shadow-sm flex-shrink-0">
              <div>
                <div class="flex items-center space-x-2">
                  <h4 class="text-base sm:text-lg font-extrabold text-[#0e294b]">${p.name}</h4>
                  <span class="px-2.5 py-0.5 rounded-lg text-xs font-mono font-extrabold bg-slate-100 text-slate-800 border border-slate-300 shadow-xs">
                    @${p.username}
                  </span>
                </div>
                <div class="text-xs text-slate-500 mt-0.5">
                  ${p.age} Yrs • ${p.gender} • <i class="fa-solid fa-location-dot text-teal-600 mr-1"></i>${p.location}
                </div>
              </div>
            </div>

            <button onclick="evaluatePatientTierLive('${p.id}')"
              class="px-2.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-xl text-xs font-bold transition-all flex items-center space-x-1" title="Re-run Random Forest ML inference on current vitals">
              <i class="fa-solid fa-rotate text-[11px]"></i>
              <span class="hidden sm:inline">Re-evaluate Tier</span>
            </button>
          </div>

          <!-- 3. THE 4 INPUT PILLARS FED INTO THE MODEL -->
          <div class="my-4 bg-slate-50/80 rounded-2xl p-3.5 border border-slate-200/80 text-xs space-y-2.5">
            <div class="text-[11px] font-extrabold text-slate-700 uppercase tracking-wider flex items-center justify-between border-b border-slate-200 pb-1.5">
              <span>Data Fed to Model (मॉडल इनपुट्स):</span>
              <span class="font-mono text-indigo-600 font-bold">4 Key Dimensions</span>
            </div>

            <!-- Pillar A: Vitals -->
            ${latestCheckup ? `
              <div class="flex items-start space-x-2">
                <span class="w-5 h-5 rounded-md bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5">1</span>
                <div class="flex-grow">
                  <span class="font-bold text-slate-800">Checkup Vitals:</span>
                  <div class="grid grid-cols-4 gap-1.5 text-center mt-1 font-mono text-[11px]">
                    <span class="bg-white px-1.5 py-1 rounded border border-slate-200">BP: <strong class="${latestCheckup.bpStatus.includes('Critical') ? 'text-rose-600 font-bold' : 'text-slate-900'}">${latestCheckup.bp.split(' ')[0]}</strong></span>
                    <span class="bg-white px-1.5 py-1 rounded border border-slate-200">HR: <strong class="${latestCheckup.hrStatus.includes('Spike') ? 'text-rose-600 font-bold' : 'text-slate-900'}">${latestCheckup.hr}</strong></span>
                    <span class="bg-white px-1.5 py-1 rounded border border-slate-200">SpO2: <strong class="text-slate-900">${latestCheckup.spo2}</strong></span>
                    <span class="bg-white px-1.5 py-1 rounded border border-slate-200">Sugar: <strong class="${parseInt(latestCheckup.glucose) > 180 ? 'text-rose-600 font-bold' : 'text-slate-900'}">${latestCheckup.glucose}</strong></span>
                  </div>
                </div>
              </div>
            ` : ''}

            <!-- Pillar B: Medical History -->
            <div class="flex items-start space-x-2">
              <span class="w-5 h-5 rounded-md bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5">2</span>
              <div class="flex-grow">
                <span class="font-bold text-slate-800">Medical History:</span>
                <div class="flex flex-wrap gap-1 mt-1">
                  ${conditionsList.map(c => `<span class="px-2 py-0.5 rounded bg-white border border-slate-200 text-[10px] font-semibold text-slate-700">${c}</span>`).join('')}
                </div>
              </div>
            </div>

            <!-- Pillar C: Medical Assessment -->
            <div class="flex items-start space-x-2">
              <span class="w-5 h-5 rounded-md bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5">3</span>
              <div class="flex-grow text-[11px] text-slate-700">
                <span class="font-bold text-slate-800">Medical Assessment:</span>
                <span class="ml-1 font-medium">ADL: ${p.assessments.adl.walking.status} • Pain: <strong class="${p.assessments.pain.score >= 5 ? 'text-rose-600' : 'text-slate-900'}">${p.assessments.pain.score}/10</strong> (${p.assessments.pain.location}) • Sleep: ${p.assessments.sleep.hours}h</span>
              </div>
            </div>

            <!-- Pillar D: User's Given Input -->
            ${latestInput ? `
              <div class="flex items-start space-x-2">
                <span class="w-5 h-5 rounded-md bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5">4</span>
                <div class="flex-grow">
                  <div class="flex items-center justify-between text-[11px]">
                    <span class="font-bold text-purple-900">User's Given Input (${latestInput.type === 'voice' ? 'Voice Note' : 'One-Tap'}):</span>
                    ${latestInput.type === 'voice' ? `
                      <button onclick="playSeniorAudioNote('${latestInput.hindiText.replace(/'/g, "\\'")}')" class="text-purple-700 font-bold hover:underline flex items-center space-x-1">
                        <i class="fa-solid fa-volume-high"></i>
                        <span>Listen Voice</span>
                      </button>
                    ` : ''}
                  </div>
                  <p class="text-slate-800 font-medium italic mt-0.5 bg-white p-2 rounded-lg border border-purple-100">
                    "${latestInput.hindiText || latestInput.selection}"
                  </p>
                </div>
              </div>
            ` : ''}
          </div>

          <!-- 4. ML MODEL DECISION DRIVERS (कारण) -->
          <div class="my-3">
            <div class="text-[11px] font-extrabold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center space-x-1.5">
              <i class="fa-solid fa-brain text-indigo-600"></i>
              <span>ML Model Decision Drivers (मॉडल वर्गीकरण के कारण):</span>
            </div>
            <div class="bg-white p-3 rounded-xl border border-slate-200 text-xs space-y-1">
              ${driversList.slice(0, 3).map(d => `
                <div class="flex items-start space-x-2 text-slate-700">
                  <i class="fa-solid ${isCritical ? 'fa-triangle-exclamation text-rose-500' : 'fa-check text-emerald-500'} mt-0.5 flex-shrink-0 text-[11px]"></i>
                  <span class="font-medium">${d}</span>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- 5. EMERGENCY CONTACT & NOTIFICATION STATUS -->
          ${isCritical ? `
            <div class="bg-rose-50 p-3 rounded-2xl border-2 border-rose-300 text-xs text-rose-950 mt-3 space-y-1.5 animate-pulse">
              <div class="flex items-center justify-between">
                <span class="font-extrabold text-rose-900 flex items-center space-x-1.5">
                  <i class="fa-solid fa-bell text-rose-600"></i>
                  <span>CRITICAL ALERT RAISED — FAMILY NOTIFIED:</span>
                </span>
                <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                  Delivered 🟢
                </span>
              </div>
              <div class="flex items-center justify-between pt-1 border-t border-rose-200">
                <div>
                  <strong>${p.emergencyContact.name}</strong> (${p.emergencyContact.relation}) • <span class="font-mono">${p.emergencyContact.phone}</span>
                </div>
                <button onclick="dossierCallEmergencyContact('${p.id}')" class="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-[11px] font-bold shadow-xs">
                  <i class="fa-solid fa-phone mr-1"></i> Call Contact
                </button>
              </div>
            </div>
          ` : `
            <div class="bg-emerald-50/70 p-3 rounded-2xl border border-emerald-200 text-xs text-emerald-950 mt-3 flex items-center justify-between">
              <div class="flex items-center space-x-2">
                <i class="fa-solid fa-shield-check text-emerald-600 text-base"></i>
                <div>
                  <div class="font-extrabold text-emerald-900">Normal Baseline — No Emergency Alert Needed</div>
                  <div class="text-[11px] text-emerald-700">Emergency contact (${p.emergencyContact.name}) on standby. Zero alarm fatigue.</div>
                </div>
              </div>
              <span class="font-mono text-xs font-bold text-emerald-800">${p.emergencyContact.phone}</span>
            </div>
          `}
        </div>

        <!-- 6. Action Buttons -->
        <div class="pt-4 mt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
          <button onclick="openPatientDossier('${p.id}')"
            class="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-extrabold shadow-sm transition-all flex items-center space-x-1.5">
            <i class="fa-solid fa-folder-open"></i>
            <span>View Medical History & Inputs</span>
          </button>

          <div class="flex items-center space-x-2">
            ${isCritical ? `
              <button onclick="showToast('Emergency SMS & WhatsApp re-dispatched to ${p.emergencyContact.name}', 'success')"
                class="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-300 rounded-xl text-xs font-bold transition-all flex items-center space-x-1">
                <i class="fa-solid fa-paper-plane"></i>
                <span>Resend Notice</span>
              </button>
            ` : `
              <button onclick="simulateVitalSpike('${p.id}')"
                class="px-3 py-2 bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-700 border border-slate-200 rounded-xl text-xs font-bold transition-all flex items-center space-x-1" title="Simulate a vital spike to test ML model re-classification to Critical Tier">
                <i class="fa-solid fa-flask text-amber-500"></i>
                <span>Simulate Vital Spike</span>
              </button>
            `}
            <button onclick="openCallModal('CALL-${p.id}', '${p.name}', '${p.phone}')"
              class="px-3.5 py-2 bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 rounded-xl text-xs font-bold transition-all" title="Call Senior">
              <i class="fa-solid fa-phone"></i>
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function filterCoordinatorPatients() {
  renderCoordinatorPatients();
}

// 4. Live ML Model Tier Evaluation Function
async function evaluatePatientTierLive(patientId) {
  const patient = getPatientByNameOrId(patientId);
  if (!patient) return;

  showToast(`Running Random Forest ML inference on ${patient.name}'s data...`, 'info');

  const checkup = (patient.checkups && patient.checkups.length > 0) ? patient.checkups[0] : {};
  const asmt = patient.assessments || {};
  const adl = asmt.adl || {};
  const med = patient.medicalHistory || {};

  const bp_str = checkup.bp || '120/80';
  const bp_sys = parseFloat(bp_str.split('/')[0]) || 120;
  const bp_dia = parseFloat(bp_str.split('/')[1]) || 80;
  const hr = parseFloat((checkup.hr || '75').split(' ')[0]) || 75;
  const spo2 = parseFloat((checkup.spo2 || '98').replace('%', '')) || 98;
  const glucose = parseFloat((checkup.glucose || '110').split(' ')[0]) || 110;

  const payload = {
    patientId: patient.id,
    age: patient.age,
    gender: patient.gender,
    weight_kg: parseFloat((checkup.weight || '65').split(' ')[0]) || 65,
    height_cm: 165,
    bp_systolic: bp_sys,
    bp_diastolic: bp_dia,
    heart_rate: hr,
    spo2: spo2,
    blood_glucose: glucose,
    pain_level: asmt.pain ? asmt.pain.score : 0,
    pain_present: (asmt.pain && asmt.pain.score > 0) ? 1 : 0,
    sleep_hours: asmt.sleep ? asmt.sleep.hours : 7.0,
    walking_independent: (adl.walking && adl.walking.status.toLowerCase().includes('independent')) ? 1 : 0,
    eating_independent: (adl.eating && adl.eating.status.toLowerCase().includes('independent')) ? 1 : 0,
    moving_independent: (adl.moving && adl.moving.status.toLowerCase().includes('independent')) ? 1 : 0,
    toileting_independent: (adl.toileting && adl.toileting.status.toLowerCase().includes('independent')) ? 1 : 0,
    medication_count: med.medications ? med.medications.length : 3,
    missed_doses: (patient.name.includes('Anand') ? 2 : (patient.name.includes('Ramesh') ? 1 : 0)),
    is_diabetic: (med.chronicConditions && med.chronicConditions.some(c => c.toLowerCase().includes('diabetes'))) ? 1 : 0,
    has_hypertension: (med.chronicConditions && med.chronicConditions.some(c => c.toLowerCase().includes('hypertension'))) ? 1 : 0
  };

  try {
    const resp = await fetch('/api/coordinator/evaluate-tier', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await resp.json();
    if (data.success) {
      patient.predictedTier = data.predictedTier;
      patient.tierLabel = data.tierLabel;
      patient.tierColor = data.tierColor;
      patient.modelScore = data.modelScore;
      patient.predictedProbability = data.predictedProbability;
      patient.modelRiskLevel = data.modelRiskLevel;
      patient.modelDrivers = data.modelDrivers;
      patient.alertRaised = data.alertRaised;

      if (data.alertRaised) {
        soundEngine.playEmergencySiren();
        if (data.alert) state.alerts.unshift(data.alert);
        if (data.notification) state.emergencyNotifications.unshift(data.notification);
        state.seniorStatus.isSerious = true;
        updateFamilyAlertBanner();
        showToast(`🚨 CRITICAL TIER CONFIRMED! Alert raised & SMS/WhatsApp dispatched to ${patient.emergencyContact.name}.`, 'danger');
      } else {
        soundEngine.playSuccessChime();
        showToast(`🟢 Model Classified: ${patient.name} is in ${data.predictedTier} TIER (${data.modelScore}/100). Safe & sound!`, 'success');
      }

      renderCoordinatorPatients();
      renderCoordinatorAlerts();
      renderEmergencyNotificationsLog();
    }
  } catch (err) {
    console.warn('Live ML tier evaluate fetch error, falling back locally:', err);
    showToast(`Model evaluated ${patient.name}: ${patient.predictedTier} TIER (${patient.modelScore}/100)`, 'info');
  }
}

// 5. Simulate a Vital Spike to demonstrate Model re-classifying from Normal to Critical
async function simulateVitalSpike(patientId) {
  const patient = getPatientByNameOrId(patientId);
  if (!patient) return;

  showToast(`Simulating acute vital spike on ${patient.name} (BP 168/98, HR 118 bpm)...`, 'warning');
  soundEngine.playTone(400, 'sawtooth', 0.3);

  if (patient.checkups && patient.checkups.length > 0) {
    patient.checkups[0].bp = '168/98 mmHg';
    patient.checkups[0].bpStatus = 'Severe Spike Alert';
    patient.checkups[0].hr = '118 bpm';
    patient.checkups[0].hrStatus = 'Tachycardia Spike';
    patient.checkups[0].spo2 = '93%';
    patient.checkups[0].notes = 'Sudden acute hemodynamic spike simulated for AI Model triage demonstration.';
  }

  await evaluatePatientTierLive(patientId);
}

// 6. Open Comprehensive Patient Dossier Modal
function openPatientDossier(patientId) {
  const patient = getPatientByNameOrId(patientId);
  if (!patient) return;
  currentDossierPatient = patient;

  document.getElementById('dossier-avatar').src = patient.avatar;
  document.getElementById('dossier-patient-name').textContent = patient.name;
  document.getElementById('dossier-username-badge').textContent = '@' + patient.username;
  document.getElementById('dossier-patient-sub').textContent = `${patient.age} Yrs • ${patient.gender} • ${patient.location} • Assigned: ${patient.assignedNurse}`;
  document.getElementById('dossier-triage-score').textContent = `${patient.modelScore || 80} / 100`;

  const statusPill = document.getElementById('dossier-status-pill');
  if (patient.predictedTier === 'CRITICAL') {
    statusPill.className = 'px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-600 text-white animate-pulse';
    statusPill.textContent = '🚨 ML PREDICTED: CRITICAL TIER';
  } else if (patient.predictedTier === 'MODERATE') {
    statusPill.className = 'px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500 text-white';
    statusPill.textContent = '🟡 ML PREDICTED: MODERATE TIER';
  } else {
    statusPill.className = 'px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-600 text-white';
    statusPill.textContent = '🟢 ML PREDICTED: NORMAL TIER';
  }

  document.getElementById('dossier-emergency-contact-text').textContent = 
    `${patient.emergencyContact.name} (${patient.emergencyContact.relation}) • ${patient.emergencyContact.phone}`;

  populateDossierHistory(patient);
  populateDossierCheckups(patient);
  populateDossierAssessments(patient);
  populateDossierUserInputs(patient);

  switchDossierSubtab(state.currentDossierSubtab || 'history');

  const modal = document.getElementById('modal-patient-dossier');
  if (modal) modal.classList.remove('hidden');
}

function openPatientDossierBySeniorName(seniorName) {
  openPatientDossier(seniorName);
}

function closePatientDossier() {
  const modal = document.getElementById('modal-patient-dossier');
  if (modal) modal.classList.add('hidden');
}

// 7. Dossier Subtabs Navigation
function switchDossierSubtab(subtabName) {
  state.currentDossierSubtab = subtabName;
  const subtabs = ['history', 'checkups', 'assessments', 'inputs'];

  subtabs.forEach(st => {
    const content = document.getElementById(`dossier-subcontent-${st}`);
    const btn = document.getElementById(`dossier-subtab-btn-${st}`);
    if (content) content.classList.add('hidden');
    if (btn) {
      btn.classList.remove('border-teal-600', 'text-teal-800');
      btn.classList.add('border-transparent', 'text-slate-500');
    }
  });

  const activeContent = document.getElementById(`dossier-subcontent-${subtabName}`);
  const activeBtn = document.getElementById(`dossier-subtab-btn-${subtabName}`);
  if (activeContent) activeContent.classList.remove('hidden');
  if (activeBtn) {
    activeBtn.classList.remove('border-transparent', 'text-slate-500');
    activeBtn.classList.add('border-teal-600', 'text-teal-800');
  }
}

// 8. Populate Subtab 1: Medical History
function populateDossierHistory(patient) {
  const med = patient.medicalHistory || {};

  const condContainer = document.getElementById('dossier-conditions-container');
  if (condContainer) {
    condContainer.innerHTML = (med.chronicConditions || []).map(c => `
      <span class="px-3 py-1.5 rounded-xl text-xs font-bold bg-indigo-50 text-indigo-900 border border-indigo-200 flex items-center space-x-1.5 shadow-sm">
        <i class="fa-solid fa-heart-pulse text-indigo-500"></i>
        <span>${c}</span>
      </span>
    `).join('');
  }

  const medTable = document.getElementById('dossier-medications-table');
  if (medTable) {
    medTable.innerHTML = (med.medications || []).map(m => `
      <tr class="hover:bg-slate-50 transition-colors">
        <td class="py-2 px-3 font-bold text-slate-900">${m.name}</td>
        <td class="py-2 px-3 font-mono text-slate-700">${m.dosage}</td>
        <td class="py-2 px-3 text-slate-600">${m.schedule}</td>
        <td class="py-2 px-3 text-slate-600">${m.purpose}</td>
        <td class="py-2 px-3 text-right">
          <span class="px-2 py-0.5 rounded text-[11px] font-bold ${parseInt(m.adherence) > 85 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}">
            ${m.adherence}
          </span>
        </td>
      </tr>
    `).join('');
  }

  document.getElementById('dossier-allergies-text').textContent = (med.allergies || []).join(', ') || 'No known allergies.';
  document.getElementById('dossier-surgeries-text').textContent = (med.surgeries || []).join(', ') || 'No previous surgeries documented.';
  document.getElementById('dossier-doctor-text').textContent = med.doctor || 'Dr. V.K. Kapoor';
  document.getElementById('dossier-review-text').textContent = med.nextReview || '15 Nov 2026';
}

// 9. Populate Subtab 2: Checkups & Vitals
function populateDossierCheckups(patient) {
  const checkups = patient.checkups || [];
  const latestCards = document.getElementById('dossier-latest-vitals-cards');
  const timeline = document.getElementById('dossier-checkup-timeline');

  if (checkups.length > 0 && latestCards) {
    const cur = checkups[0];
    latestCards.innerHTML = `
      <div class="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
        <div class="text-[11px] text-slate-400 font-bold uppercase">Blood Pressure</div>
        <div class="text-base font-extrabold ${cur.bpStatus.includes('Critical') ? 'text-rose-600' : 'text-slate-900'} mt-0.5">${cur.bp}</div>
        <div class="text-[10px] text-slate-500">${cur.bpStatus}</div>
      </div>
      <div class="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
        <div class="text-[11px] text-slate-400 font-bold uppercase">Heart Rate / Pulse</div>
        <div class="text-base font-extrabold ${cur.hrStatus.includes('Spike') ? 'text-rose-600' : 'text-slate-900'} mt-0.5">${cur.hr}</div>
        <div class="text-[10px] text-slate-500">${cur.hrStatus}</div>
      </div>
      <div class="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
        <div class="text-[11px] text-slate-400 font-bold uppercase">Blood Oxygen (SpO2)</div>
        <div class="text-base font-extrabold text-slate-900 mt-0.5">${cur.spo2}</div>
        <div class="text-[10px] text-slate-500">${cur.spo2Status}</div>
      </div>
      <div class="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
        <div class="text-[11px] text-slate-400 font-bold uppercase">Blood Glucose</div>
        <div class="text-base font-extrabold ${parseInt(cur.glucose) > 180 ? 'text-amber-600' : 'text-slate-900'} mt-0.5">${cur.glucose}</div>
        <div class="text-[10px] text-slate-500">${cur.temp} • BMI: ${cur.bmi}</div>
      </div>
    `;
  }

  if (timeline) {
    timeline.innerHTML = checkups.map(c => `
      <div class="bg-white p-3.5 rounded-xl border border-slate-200 text-xs shadow-sm">
        <div class="flex items-center justify-between pb-2 border-b border-slate-100">
          <div class="flex items-center space-x-2">
            <span class="font-bold text-slate-900">${c.date}</span>
            <span class="text-slate-400">•</span>
            <span class="text-slate-500">${c.conductedBy}</span>
          </div>
          <span class="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-100 text-slate-700">${c.temp}</span>
        </div>
        <div class="grid grid-cols-4 gap-2 my-2 font-mono text-center">
          <div>BP: <strong class="${c.bpStatus.includes('Critical') ? 'text-rose-600 font-bold' : ''}">${c.bp}</strong></div>
          <div>Pulse: <strong class="${c.hrStatus.includes('Spike') ? 'text-rose-600 font-bold' : ''}">${c.hr}</strong></div>
          <div>SpO2: <strong>${c.spo2}</strong></div>
          <div>Glucose: <strong>${c.glucose}</strong></div>
        </div>
        <p class="text-slate-600 italic bg-slate-50 p-2 rounded-lg mt-1 font-sans">${c.notes}</p>
      </div>
    `).join('');
  }
}

// 10. Populate Subtab 3: Assessments
function populateDossierAssessments(patient) {
  const as = patient.assessments || {};

  const adlGrid = document.getElementById('dossier-adl-grid');
  if (adlGrid && as.adl) {
    const domains = [
      { key: 'eating', label: 'Eating (भोजन)', icon: 'fa-utensils' },
      { key: 'walking', label: 'Walking (चलना)', icon: 'fa-person-walking' },
      { key: 'toileting', label: 'Toileting (शौचालय)', icon: 'fa-restroom' },
      { key: 'moving', label: 'Moving (स्थानांतरण)', icon: 'fa-arrows-up-down' }
    ];
    adlGrid.innerHTML = domains.map(d => {
      const val = as.adl[d.key] || { score: '10/10', status: 'Independent' };
      return `
        <div class="bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
          <i class="fa-solid ${d.icon} text-teal-600 text-lg mb-1"></i>
          <div class="text-[11px] font-bold text-slate-700">${d.label}</div>
          <div class="text-sm font-extrabold text-[#0e294b] my-0.5">${val.score}</div>
          <div class="text-[10px] text-slate-500 line-clamp-1">${val.status}</div>
        </div>
      `;
    }).join('');
  }

  if (as.pain) {
    document.getElementById('dossier-pain-score-badge').textContent = as.pain.score + '/10';
    document.getElementById('dossier-pain-location').textContent = as.pain.location;
    document.getElementById('dossier-pain-sensation').textContent = as.pain.sensation;
  }
  if (as.sleep) {
    document.getElementById('dossier-sleep-badge').textContent = as.sleep.hours + 'h';
    document.getElementById('dossier-sleep-quality').textContent = as.sleep.quality;
  }

  const badge = document.getElementById('dossier-ai-risk-badge');
  badge.textContent = `${patient.predictedTier} TIER (${patient.predictedProbability || 'High'} Risk)`;
  badge.className = `px-3 py-1 rounded-lg text-xs font-extrabold ${patient.predictedTier === 'CRITICAL' ? 'bg-rose-600 text-white animate-pulse' : (patient.predictedTier === 'NORMAL' ? 'bg-emerald-600 text-white' : 'bg-amber-500 text-white')}`;
  document.getElementById('dossier-ai-risk-reasons').textContent = (patient.modelDrivers || []).join('; ') || 'All parameters evaluated by Random Forest model.';
}

// 11. Populate Subtab 4: User's Direct Inputs
function populateDossierUserInputs(patient) {
  const container = document.getElementById('dossier-user-inputs-list');
  if (!container) return;
  const inputs = patient.userInputs || [];

  if (inputs.length === 0) {
    container.innerHTML = `
      <div class="bg-white p-8 rounded-2xl text-center border border-slate-200">
        <i class="fa-solid fa-microphone-slash text-slate-300 text-2xl mb-2"></i>
        <p class="text-xs text-slate-500">No self-reported inputs received yet from this senior.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = inputs.map(inp => {
    if (inp.type === 'voice') {
      return `
        <div class="bg-white p-4 rounded-2xl border-2 border-indigo-200/80 shadow-sm space-y-2">
          <div class="flex items-center justify-between pb-2 border-b border-slate-100">
            <div class="flex items-center space-x-2">
              <span class="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm">
                <i class="fa-solid fa-microphone-lines"></i>
              </span>
              <div>
                <div class="text-xs font-bold text-slate-900">Audio Voice Note Submission</div>
                <div class="text-[10px] text-slate-400 font-mono">${inp.timestamp} • Duration: ${inp.duration}</div>
              </div>
            </div>
            <div class="flex items-center space-x-2">
              <span class="px-2 py-0.5 rounded text-[10px] font-bold ${inp.sentimentBadge}">
                ${inp.sentiment}
              </span>
              <button onclick="playSeniorAudioNote('${inp.hindiText.replace(/'/g, "\\'")}')"
                class="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-all flex items-center space-x-1 shadow-sm">
                <i class="fa-solid fa-play text-[10px]"></i>
                <span>Listen Audio</span>
              </button>
            </div>
          </div>
          
          <div class="bg-indigo-50/50 p-3 rounded-xl border border-indigo-100">
            <div class="text-[10px] font-bold text-indigo-900 uppercase tracking-wider mb-1">Verbatim Hindi Speech Transcript:</div>
            <p class="text-xs sm:text-sm font-semibold text-slate-900 font-sans leading-relaxed">"${inp.hindiText}"</p>
          </div>

          <div class="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs">
            <div class="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Clinical English Translation:</div>
            <p class="text-xs text-slate-700 font-medium">${inp.englishTranslation}</p>
          </div>
        </div>
      `;
    } else if (inp.type === 'one_tap') {
      return `
        <div class="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1.5">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-2 text-xs">
              <span class="w-7 h-7 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center">
                <i class="fa-solid fa-hand-pointer"></i>
              </span>
              <span class="font-bold text-slate-900">One-Tap Mood Check-in</span>
              <span class="text-slate-400">•</span>
              <span class="text-slate-500 font-mono text-[11px]">${inp.timestamp}</span>
            </div>
            <span class="px-2.5 py-0.5 rounded-full text-xs font-bold ${inp.badge}">
              ${inp.selection}
            </span>
          </div>
          <p class="text-xs text-slate-600 italic bg-slate-50 p-2 rounded-lg mt-1 font-sans">
            Note recorded: "${inp.recordedNote}"
          </p>
        </div>
      `;
    } else {
      return `
        <div class="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between text-xs">
          <div class="flex items-center space-x-2.5">
            <span class="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <i class="fa-solid fa-phone-volume"></i>
            </span>
            <div>
              <div class="font-bold text-slate-900">Toll-Free Missed Call Logged (1800-202-CARE)</div>
              <div class="text-[10px] text-slate-500">${inp.status}</div>
            </div>
          </div>
          <span class="font-mono text-slate-400 text-[11px]">${inp.timestamp}</span>
        </div>
      `;
    }
  }).join('');
}

// 12. Audio Player for Senior Voice Note
function playSeniorAudioNote(hindiText) {
  if (!hindiText) return;
  soundEngine.playSuccessChime();
  showToast('Playing Senior Voice Note Audio...', 'info');

  try {
    const audio = new Audio(`/api/tts?lang=hi&text=${encodeURIComponent(hindiText)}`);
    audio.play().catch(e => {
      if ('speechSynthesis' in window) {
        const u = new SpeechSynthesisUtterance(hindiText);
        u.lang = 'hi-IN';
        window.speechSynthesis.speak(u);
      }
    });
  } catch (err) {
    if ('speechSynthesis' in window) {
      const u = new SpeechSynthesisUtterance(hindiText);
      u.lang = 'hi-IN';
      window.speechSynthesis.speak(u);
    }
  }
}

// 13. Raise Critical Alert Modal Controls
function openRaiseCriticalModal(preselectPatientId) {
  const modal = document.getElementById('modal-raise-critical');
  if (!modal) return;

  const select = document.getElementById('raise-critical-patient-select');
  if (select && state.patients) {
    select.innerHTML = state.patients.map(p => `
      <option value="${p.id}" ${preselectPatientId === p.id ? 'selected' : ''}>
        ${p.name} (@${p.username}) - Current Tier: ${p.predictedTier}
      </option>
    `).join('');
  }

  onRaiseCriticalPatientChange();
  modal.classList.remove('hidden');
}

function closeRaiseCriticalModal() {
  const modal = document.getElementById('modal-raise-critical');
  if (modal) modal.classList.add('hidden');
}

function onRaiseCriticalPatientChange() {
  const select = document.getElementById('raise-critical-patient-select');
  const patientId = select ? select.value : 'PAT-101';
  const patient = getPatientByNameOrId(patientId);
  if (!patient) return;

  const contactDiv = document.getElementById('raise-critical-contact-info');
  if (contactDiv) {
    contactDiv.innerHTML = `<strong>${patient.emergencyContact.name} (${patient.emergencyContact.relation})</strong> • ${patient.emergencyContact.phone} (${patient.location})`;
  }

  updateCriticalPreviewText();
}

function onPredefinedReasonChange() {
  const sel = document.getElementById('raise-critical-predefined-reason');
  const textarea = document.getElementById('raise-critical-reason');
  if (sel && textarea && sel.value !== 'custom') {
    textarea.value = sel.value;
  }
  updateCriticalPreviewText();
}

function updateCriticalPreviewText() {
  const select = document.getElementById('raise-critical-patient-select');
  const textarea = document.getElementById('raise-critical-reason');
  const preview = document.getElementById('raise-critical-preview-text');
  const patient = getPatientByNameOrId(select ? select.value : 'PAT-101');
  if (!preview || !patient) return;

  const reason = (textarea && textarea.value.trim()) || 'Resting heart rate arrhythmia spike (114 bpm) & zero motion for 4 hrs';
  preview.textContent = `🚨 CareConnect CRITICAL TIER ALERT: Emergency alert raised for ${patient.name} (@${patient.username}) at ${patient.location}. Reason: ${reason}. Care Coordinator Sister Kavita dispatched. Direct phone: ${patient.phone}`;
}

async function confirmRaiseCriticalAlert() {
  const select = document.getElementById('raise-critical-patient-select');
  const textarea = document.getElementById('raise-critical-reason');
  const patientId = select ? select.value : 'PAT-101';
  const patient = getPatientByNameOrId(patientId);
  const reason = (textarea && textarea.value.trim()) || 'Acute clinical escalation: High resting HR spike + senior reported dizziness.';

  soundEngine.playEmergencySiren();

  try {
    const resp = await fetch('/api/alerts/raise-critical', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        patientId: patientId,
        seniorName: patient ? patient.name : 'Ramesh Sharma',
        reason: reason
      })
    });
    const data = await resp.json();
    if (data.success) {
      if (data.alert) state.alerts.unshift(data.alert);
      if (data.notification) state.emergencyNotifications.unshift(data.notification);
    }
  } catch (err) {
    console.warn('API error during raise-critical, using client state:', err);
  }

  if (patient) {
    patient.predictedTier = 'CRITICAL';
    patient.tierLabel = '🚨 CRITICAL TIER';
    patient.modelScore = 95;
    patient.predictedProbability = '89.4%';
    patient.alertRaised = true;
    if (patient.emergencyContact) {
      patient.emergencyContact.notificationStatus = 'Dispatched & Delivered';
      patient.emergencyContact.smsDelivered = true;
      patient.emergencyContact.whatsappDelivered = true;
    }
  }

  state.seniorStatus.isSerious = true;
  updateFamilyAlertBanner();

  closeRaiseCriticalModal();
  renderCoordinatorAlerts();
  renderCoordinatorPatients();
  renderEmergencyNotificationsLog();

  const receiptDesc = document.getElementById('receipt-contact-desc');
  if (receiptDesc && patient) {
    receiptDesc.textContent = `SMS & WhatsApp dispatched to ${patient.emergencyContact.name} (${patient.emergencyContact.phone}).`;
  }
  const modalReceipt = document.getElementById('modal-notif-receipt');
  if (modalReceipt) modalReceipt.classList.remove('hidden');

  showToast(`🚨 CRITICAL TIER ALERT RAISED: Emergency contacts notified via SMS & WhatsApp for ${patient ? patient.name : 'Senior'}!`, 'danger');
}

function dossierRaiseCriticalAlert() {
  if (currentDossierPatient) {
    closePatientDossier();
    openRaiseCriticalModal(currentDossierPatient.id);
  }
}

function dossierCallEmergencyContact(patientId) {
  const p = patientId ? getPatientByNameOrId(patientId) : currentDossierPatient;
  if (p && p.emergencyContact) {
    openCallModal('CONTACT-CALL', p.emergencyContact.name, p.emergencyContact.phone);
  }
}

function dossierSendNotificationToContact() {
  if (currentDossierPatient) {
    soundEngine.playSuccessChime();
    showToast(`Dispatched emergency WhatsApp update to ${currentDossierPatient.emergencyContact.name}!`, 'success');
  }
}

function closeNotifReceiptModal() {
  const modal = document.getElementById('modal-notif-receipt');
  if (modal) modal.classList.add('hidden');
}

// 14. Render Emergency Notifications Dispatch Log (Tab 3)
function renderEmergencyNotificationsLog() {
  const container = document.getElementById('coordinator-notifications-list');
  if (!container) return;

  const notifs = state.emergencyNotifications || [];
  if (notifs.length === 0) {
    container.innerHTML = `
      <div class="bg-white p-8 rounded-xl text-center text-slate-400">
        <i class="fa-solid fa-inbox text-2xl mb-2"></i>
        <p class="text-xs">No emergency family notifications logged yet.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = notifs.map(n => `
    <div class="bg-slate-50 rounded-2xl border border-slate-200 p-4 shadow-sm space-y-2 hover:bg-slate-100/60 transition-all">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-200">
        <div class="flex items-center space-x-2.5">
          <span class="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-sm">
            <i class="fa-solid fa-bell"></i>
          </span>
          <div>
            <div class="flex items-center space-x-2">
              <h5 class="text-xs sm:text-sm font-extrabold text-slate-900">${n.seniorName} (@${n.username})</h5>
              <span class="px-2.5 py-0.5 rounded text-[10px] font-extrabold bg-rose-600 text-white">🚨 CRITICAL TIER NOTIFICATION</span>
            </div>
            <div class="text-[11px] text-slate-500 mt-0.5">
              Recipient: <strong class="text-slate-800">${n.contactName}</strong> • Phone: <span class="font-mono text-indigo-700 font-bold">${n.contactPhone}</span>
            </div>
          </div>
        </div>

        <div class="flex items-center space-x-2 text-right">
          <span class="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center space-x-1">
            <i class="fa-solid fa-circle-check text-emerald-600"></i>
            <span>${n.deliveryStatus} (Read Receipt Verified)</span>
          </span>
          <span class="text-[11px] text-slate-400 font-mono">${n.timestamp}</span>
        </div>
      </div>

      <!-- SMS & WhatsApp Message Preview -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-1">
        <div class="bg-white p-3 rounded-xl border border-slate-200">
          <div class="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center space-x-1">
            <i class="fa-solid fa-comment-sms text-teal-600"></i>
            <span>SMS Message Dispatched:</span>
          </div>
          <p class="text-slate-700 font-mono text-[11px] leading-relaxed">${n.smsMessage}</p>
        </div>

        <div class="bg-white p-3 rounded-xl border border-slate-200">
          <div class="text-[10px] font-bold text-emerald-700 uppercase tracking-wider mb-1 flex items-center space-x-1">
            <i class="fa-brands fa-whatsapp text-emerald-600"></i>
            <span>WhatsApp Emergency Payload:</span>
          </div>
          <p class="text-slate-700 font-sans text-[11px] whitespace-pre-line leading-relaxed">${n.whatsappMessage || n.smsMessage}</p>
        </div>
      </div>

      <div class="flex items-center justify-end space-x-2 pt-1 text-xs">
        <button onclick="openCallModal('${n.id}', '${n.contactName}', '${n.contactPhone}')"
          class="px-3 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg font-bold">
          <i class="fa-solid fa-phone mr-1"></i> Call Contact
        </button>
        <button onclick="showToast('Emergency notification resent to ' + '${n.contactName}', 'success')"
          class="px-3 py-1 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-bold">
          <i class="fa-solid fa-arrows-rotate mr-1"></i> Resend Notice
        </button>
      </div>
    </div>
  `).join('');
}

// 15. Update Top Critical Broadcast Banner
function updateCoordinatorCriticalBanner() {
  const banner = document.getElementById('coordinator-critical-emergency-banner');
  if (!banner) return;

  const criticalAlert = (state.alerts || []).find(a => a.priority === 'critical' && a.status !== 'resolved');
  if (criticalAlert) {
    banner.classList.remove('hidden');
    const matchedPatient = getPatientByNameOrId(criticalAlert.seniorName);
    const username = matchedPatient ? matchedPatient.username : 'senior_ramesh';
    const patientName = criticalAlert.seniorName;

    document.getElementById('banner-critical-title').textContent = `${patientName} (@${username}) • 🚨 CRITICAL TIER ACTIVE`;
    document.getElementById('banner-critical-desc').textContent = `${criticalAlert.reason} — Emergency SMS & WhatsApp dispatched to ${matchedPatient ? matchedPatient.emergencyContact.name : 'family'}.`;
    document.getElementById('banner-critical-time').textContent = criticalAlert.timeAgo || 'Live Incident';
  } else {
    banner.classList.add('hidden');
  }
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


