# -*- coding: utf-8 -*-
"""
CareConnect - Seed Database with Real ML Model Tier Predictions
Computed using ApnaSa 90,000 Records Random Forest Triage Model (ml_engine.py)
Tiers:
  - CRITICAL TIER (Alert Raised + Emergency Contacts Notified via SMS & WhatsApp)
  - MODERATE TIER (Care Coordinator Follow-up)
  - NORMAL TIER (Safe & Stable - Routine Monitoring)
"""

PATIENTS_DATA = [
    {
        "id": "PAT-101",
        "username": "senior_ramesh",
        "name": "Ramesh Sharma",
        "age": 74,
        "gender": "Male",
        "avatar": "https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&auto=format&fit=crop&q=80",
        "location": "South Delhi (Greater Kailash, C-42)",
        "phone": "+91 98110-44912",
        "assignedNurse": "Sister Kavita, RN",
        
        # ML MODEL PREDICTED TIER & METRICS
        "predictedTier": "CRITICAL",
        "tierLabel": "🚨 CRITICAL TIER",
        "tierColor": "rose",
        "modelScore": 80,
        "predictedProbability": "64.3%",
        "modelRiskLevel": "High Risk",
        "alertRaised": True,
        "alertId": "ALT-1091",
        "modelDrivers": [
            "Borderline Oxygen Saturation: SpO2 94.0%",
            "Elevated Blood Pressure: 158/96 mmHg",
            "Tachycardia Spike: Resting Heart Rate 114 bpm",
            "Moderate Pain (Level 4/10) in Lower Back & Left Knee",
            "Mobility Dependence: Unable to walk independently (High fall hazard)",
            "Toileting Dependence: Requires grab bar / personal support",
            "Medication Adherence Gap: Missed morning check-in & dose"
        ],
        "suggestedAction": "Step 1: Immediate 2-way emergency call. Step 2: Emergency family notification. Step 3: Dispatch Nurse Kavita (ETA 12m).",
        
        # EMERGENCY CONTACT & NOTIFICATION STATUS
        "emergencyContact": {
            "name": "Rahul Sharma",
            "relation": "Son (Primary Caregiver)",
            "phone": "+91 98711-20931",
            "altPhone": "+91 98110-55441 (Anita Sharma, Daughter-in-law)",
            "email": "rahul.sharma@example.com",
            "address": "C-42, Greater Kailash-1, New Delhi",
            "notificationStatus": "Dispatched & Delivered",
            "channels": ["SMS", "WhatsApp", "App Push"],
            "dispatchedAt": "Today, 08:31 AM",
            "smsDelivered": True,
            "whatsappDelivered": True
        },
        
        # 1. MEDICAL HISTORY
        "medicalHistory": {
            "chronicConditions": [
                "Type-2 Diabetes Mellitus (12 yrs)",
                "Stage-2 Essential Hypertension",
                "Mild Left Knee Osteoarthritis"
            ],
            "allergies": ["Sulfa antibiotics (skin rash / allergic dermatitis)"],
            "surgeries": ["Appendectomy (1998)", "Right Eye Cataract (2021)"],
            "bloodGroup": "B +ve",
            "doctor": "Dr. V.K. Kapoor (Senior Cardiologist, Fortis Escorts)",
            "nextReview": "15 Nov 2026",
            "medications": [
                {"name": "Tab Metformin", "dosage": "500 mg", "schedule": "1-0-1 (After Meals)", "purpose": "Glycemic Control", "adherence": "89%"},
                {"name": "Tab Telmisartan", "dosage": "40 mg", "schedule": "1-0-0 (Morning 8 AM)", "purpose": "Blood Pressure", "adherence": "94%"},
                {"name": "Tab Atorvastatin", "dosage": "10 mg", "schedule": "0-0-1 (Night 9 PM)", "purpose": "Cardiovascular & Lipid", "adherence": "92%"},
                {"name": "Tab Calcium + D3", "dosage": "500 mg", "schedule": "1-0-0 (Afternoon)", "purpose": "Bone Health", "adherence": "95%"}
            ]
        },
        
        # 2. CHECKUPS & VITALS
        "checkups": [
            {
                "date": "Today, 08:30 AM",
                "bp": "158/96 mmHg",
                "bpStatus": "Critical Spike",
                "hr": "114 bpm",
                "hrStatus": "Tachycardia Spike",
                "spo2": "94%",
                "spo2Status": "Borderline Low",
                "glucose": "138 mg/dL",
                "temp": "98.4 °F",
                "weight": "68 kg",
                "bmi": "24.8",
                "conductedBy": "Home Bluetooth IoT Hub & Sister Kavita",
                "notes": "Resting HR spiked suddenly from baseline 74 to 114 bpm with zero motion for 4 hours."
            },
            {
                "date": "Yesterday, 06:00 PM",
                "bp": "134/86 mmHg",
                "bpStatus": "Pre-Hypertension",
                "hr": "78 bpm",
                "hrStatus": "Normal",
                "spo2": "97%",
                "spo2Status": "Healthy",
                "glucose": "128 mg/dL",
                "temp": "98.2 °F",
                "weight": "68 kg",
                "bmi": "24.8",
                "conductedBy": "Sister Kavita (Routine check)",
                "notes": "Evening post-tea reading stable. Advised light stretching."
            }
        ],
        
        # 3. MEDICAL ASSESSMENTS
        "assessments": {
            "adl": {
                "eating": {"score": "10/10", "status": "Fully Independent"},
                "toileting": {"score": "7/10", "status": "Requires Grab Bar Support"},
                "walking": {"score": "6/10", "status": "Walks with Cane / Mild Instability"},
                "moving": {"score": "7/10", "status": "Slight Difficulty Rising from Bed"}
            },
            "pain": {
                "score": 4,
                "location": "Lower Back & Left Knee",
                "duration": "Chronic (Aggravates on cold mornings)",
                "sensation": "Dull ache (धीमा दर्द व जकड़न)"
            },
            "sleep": {
                "hours": 5.2,
                "quality": "Restless (2 nighttime awakenings)"
            }
        },
        
        # 4. USER'S GIVEN INPUTS
        "userInputs": [
            {
                "type": "voice",
                "timestamp": "Today, 08:15 AM",
                "hindiText": "आज सुबह से चक्कर बहुत आ रहे हैं, छाती पर भारीपन महसूस हो रहा है और सीढ़ियां चढ़ने की हिम्मत नहीं हो रही...",
                "englishTranslation": "Feeling severe dizziness since morning, heaviness on chest, and lacking energy to climb stairs...",
                "sentiment": "Distressed / High Anxiety",
                "sentimentBadge": "bg-rose-100 text-rose-800",
                "duration": "18 sec"
            },
            {
                "type": "one_tap",
                "timestamp": "Yesterday, 09:30 AM",
                "selection": "🤒 Tabiyat Theek Nahi (Feeling Unwell)",
                "recordedNote": "Morning medicine delayed by 2 hours due to dizziness",
                "badge": "bg-amber-100 text-amber-800"
            },
            {
                "type": "missed_call",
                "timestamp": "2 Days Ago, 08:02 AM",
                "tollFree": "1800-202-CARE",
                "status": "Logged & Verified Safe"
            }
        ]
    },
    {
        "id": "PAT-102",
        "username": "senior_savitri",
        "name": "Savitri Devi",
        "age": 81,
        "gender": "Female",
        "avatar": "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=150&auto=format&fit=crop&q=80",
        "location": "Hauz Khas (Enclave 4, Flat 12B)",
        "phone": "+91 98103-99210",
        "assignedNurse": "Brother Amit, Paramedic",
        
        # ML MODEL PREDICTED TIER & METRICS
        "predictedTier": "CRITICAL",
        "tierLabel": "🚨 CRITICAL TIER",
        "tierColor": "rose",
        "modelScore": 62,
        "predictedProbability": "63.2%",
        "modelRiskLevel": "High Risk",
        "alertRaised": True,
        "alertId": "ALT-1088",
        "modelDrivers": [
            "Elevated Blood Pressure: 142/88 mmHg",
            "Severe Pain (Level 8/10) reported in Right Hip & Lumbar",
            "Mobility Dependence: Unable to walk independently (High fall hazard)",
            "Toileting Dependence: Supervised required post fall impact",
            "Impact shock sensor triggered in bathroom"
        ],
        "suggestedAction": "Priority dispatch Paramedic Amit for fracture assessment & tele-radiology.",
        
        "emergencyContact": {
            "name": "Priya Verma",
            "relation": "Daughter",
            "phone": "+91 99100-33421",
            "altPhone": "+91 98188-44211 (Dr. Alok Verma, Son-in-law)",
            "email": "priya.verma@example.com",
            "address": "Hauz Khas Enclave, New Delhi",
            "notificationStatus": "Dispatched & Delivered",
            "channels": ["SMS", "WhatsApp", "App Push"],
            "dispatchedAt": "Today, 06:51 AM",
            "smsDelivered": True,
            "whatsappDelivered": True
        },
        
        "medicalHistory": {
            "chronicConditions": [
                "Severe Osteoporosis (T-score -3.1)",
                "Post-Fall Fragility",
                "Mild Cognitive Impairment",
                "Stage-1 Hypertension"
            ],
            "allergies": ["Penicillin & Cephalosporins"],
            "surgeries": ["Left Wrist Colles Fracture Fixation (2022)"],
            "bloodGroup": "O +ve",
            "doctor": "Dr. Sunita Aggarwal (AIIMS)",
            "nextReview": "22 Nov 2026",
            "medications": [
                {"name": "Tab Amlodipine", "dosage": "5 mg", "schedule": "1-0-0 (Morning)", "purpose": "Blood Pressure", "adherence": "96%"},
                {"name": "Tab Alendronate", "dosage": "70 mg", "schedule": "Once Weekly (Sunday)", "purpose": "Bone Mineral", "adherence": "90%"},
                {"name": "Tab Donepezil", "dosage": "5 mg", "schedule": "0-0-1 (Night)", "purpose": "Cognitive Support", "adherence": "91%"}
            ]
        },
        
        "checkups": [
            {
                "date": "Today, 06:50 AM",
                "bp": "142/88 mmHg",
                "bpStatus": "Elevated",
                "hr": "88 bpm",
                "hrStatus": "Normal",
                "spo2": "97%",
                "spo2Status": "Healthy",
                "glucose": "110 mg/dL",
                "temp": "98.2 °F",
                "weight": "54 kg",
                "bmi": "21.6",
                "conductedBy": "Bathroom Sensor & Brother Amit",
                "notes": "Fall impact event detected at 06:45 AM. Senior immobilized on bathroom rug."
            }
        ],
        
        "assessments": {
            "adl": {
                "eating": {"score": "9/10", "status": "Independent"},
                "toileting": {"score": "4/10", "status": "Supervised Required / High Fall Risk"},
                "walking": {"score": "4/10", "status": "Unsteady Gait / High Fall Hazard"},
                "moving": {"score": "5/10", "status": "Needs Bedside Support"}
            },
            "pain": {
                "score": 8,
                "location": "Right Hip & Lumbar Spine",
                "duration": "Acute post-fall impact",
                "sensation": "Sharp stabbing pain (तेज दर्द व चुभन)"
            },
            "sleep": {
                "hours": 4.8,
                "quality": "Frequent waking, nocturia"
            }
        },
        
        "userInputs": [
            {
                "type": "voice",
                "timestamp": "Today, 06:52 AM",
                "hindiText": "बाथरूम में फिसल गई थी, कमर में तेज दर्द है, उठा नहीं जा रहा...",
                "englishTranslation": "Slipped in the bathroom, sharp pain in lower back, unable to get up...",
                "sentiment": "Acute Physical Pain & Distress",
                "sentimentBadge": "bg-rose-100 text-rose-800",
                "duration": "14 sec"
            }
        ]
    },
    {
        "id": "PAT-103",
        "username": "senior_anand",
        "name": "Anand Verma",
        "age": 78,
        "gender": "Male",
        "avatar": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80",
        "location": "Saket (Sector 3, House 104)",
        "phone": "+91 98734-11823",
        "assignedNurse": "Rajesh Kumar (Buddy)",
        
        # ML MODEL PREDICTED TIER & METRICS
        "predictedTier": "CRITICAL",
        "tierLabel": "🚨 CRITICAL TIER",
        "tierColor": "rose",
        "modelScore": 53,
        "predictedProbability": "68.6%",
        "modelRiskLevel": "High Risk",
        "alertRaised": True,
        "alertId": "ALT-1074",
        "modelDrivers": [
            "Severe Hyperglycemia: Fasting Blood Glucose 228 mg/dL",
            "Medication Adherence Gap: Missed 2 consecutive insulin doses",
            "Diabetic Neuropathy tingling in soles",
            "Risk of Diabetic Ketoacidosis / Hyperosmolar state"
        ],
        "suggestedAction": "Doorstep visit by Buddy Rajesh to verify insulin cold chain & dose administration.",
        
        "emergencyContact": {
            "name": "Deepak Verma",
            "relation": "Son",
            "phone": "+91 98112-99881",
            "altPhone": "+91 98733-11223 (Ritu Verma, Daughter)",
            "email": "deepak.verma@example.com",
            "address": "Saket, Sector 3, New Delhi",
            "notificationStatus": "Dispatched & Delivered",
            "channels": ["SMS", "WhatsApp"],
            "dispatchedAt": "Today, 07:20 AM",
            "smsDelivered": True,
            "whatsappDelivered": True
        },
        
        "medicalHistory": {
            "chronicConditions": [
                "Uncontrolled Type-2 Diabetes (HbA1c 9.2%)",
                "Chronic Kidney Disease Stage 2",
                "Diabetic Peripheral Neuropathy"
            ],
            "allergies": ["None documented"],
            "surgeries": ["Coronary Angioplasty (2017)"],
            "bloodGroup": "A +ve",
            "doctor": "Dr. Pradeep Batra (Max Saket)",
            "nextReview": "10 Nov 2026",
            "medications": [
                {"name": "Inj Insulin Glargine", "dosage": "16 units", "schedule": "0-0-1 (Night 10 PM)", "purpose": "Basal Glycemic", "adherence": "72% (Missed 2 days)"},
                {"name": "Tab Linagliptin", "dosage": "5 mg", "schedule": "1-0-0 (Morning)", "purpose": "Glucose Control", "adherence": "95%"},
                {"name": "Tab Pregabalin", "dosage": "75 mg", "schedule": "0-0-1 (Night)", "purpose": "Neuropathy Pain", "adherence": "88%"}
            ]
        },
        
        "checkups": [
            {
                "date": "Today, 07:15 AM",
                "bp": "132/84 mmHg",
                "bpStatus": "Normal",
                "hr": "76 bpm",
                "hrStatus": "Normal",
                "spo2": "98%",
                "spo2Status": "Healthy",
                "glucose": "228 mg/dL",
                "glucoseStatus": "Severe Hyperglycemia",
                "temp": "98.6 °F",
                "weight": "72 kg",
                "bmi": "25.2",
                "conductedBy": "Bluetooth Glucometer Sync",
                "notes": "Fasting blood sugar 228 mg/dL. Consecutive 2-day missed evening insulin reminder."
            }
        ],
        
        "assessments": {
            "adl": {
                "eating": {"score": "10/10", "status": "Independent"},
                "toileting": {"score": "9/10", "status": "Independent"},
                "walking": {"score": "8/10", "status": "Independent"},
                "moving": {"score": "9/10", "status": "Independent"}
            },
            "pain": {
                "score": 3,
                "location": "Bilateral Soles / Feet",
                "duration": "Nightly burning sensation",
                "sensation": "Burning neuropathy (पैरों में जलन)"
            },
            "sleep": {
                "hours": 6.5,
                "quality": "Fair"
            }
        },
        
        "userInputs": [
            {
                "type": "one_tap",
                "timestamp": "Today, 08:30 AM",
                "selection": "💊 Took Medicine (Dawa le li)",
                "recordedNote": "Oral tablets taken; insulin dose compliance pending confirmation",
                "badge": "bg-emerald-100 text-emerald-800"
            },
            {
                "type": "voice",
                "timestamp": "Yesterday, 08:15 PM",
                "hindiText": "पैरों में बहुत झनझनाहट हो रही है और बहुत प्यास लग रही है...",
                "englishTranslation": "Feet are tingling severely and feeling unusually thirsty...",
                "sentiment": "Discomfort / Neuropathy Symptom",
                "sentimentBadge": "bg-amber-100 text-amber-800",
                "duration": "12 sec"
            }
        ]
    },
    {
        "id": "PAT-104",
        "username": "senior_meena",
        "name": "Meena Iyer",
        "age": 72,
        "gender": "Female",
        "avatar": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
        "location": "Vasant Kunj (Pocket B, Apt 302)",
        "phone": "+91 98188-77219",
        "assignedNurse": "Sister Sunita, Counselor",
        
        # ML MODEL PREDICTED TIER & METRICS
        "predictedTier": "MODERATE",
        "tierLabel": "🟡 MODERATE TIER",
        "tierColor": "amber",
        "modelScore": 25,
        "predictedProbability": "38.9%",
        "modelRiskLevel": "Medium Risk",
        "alertRaised": False,
        "modelDrivers": [
            "Severe Sleep Deficit: Only 4.1 hours of sleep",
            "Bereavement anniversary emotional distress voice note",
            "Cardiovascular parameters remain stable (BP 124/80, HR 72, SpO2 98%)"
        ],
        "suggestedAction": "15-minute compassionate reassurance tele-consult with Buddy Sunita & family notification.",
        
        "emergencyContact": {
            "name": "Karthik Iyer",
            "relation": "Son (Bengaluru)",
            "phone": "+91 97400-55120",
            "altPhone": "+91 98188-99001",
            "email": "karthik.iyer@example.com",
            "address": "Indiranagar, Bengaluru (Outstation Family)",
            "notificationStatus": "Monitoring Only (No Alert Raised)",
            "channels": ["Routine Portal"],
            "dispatchedAt": None,
            "smsDelivered": False,
            "whatsappDelivered": False
        },
        
        "medicalHistory": {
            "chronicConditions": [
                "Hypothyroidism",
                "Mild Depressive Episodes (Post-bereavement)",
                "Cervical Spondylosis"
            ],
            "allergies": ["Dust mite & pollen"],
            "surgeries": ["None"],
            "bloodGroup": "B +ve",
            "doctor": "Dr. Rashmi Sen (Medanta)",
            "nextReview": "30 Nov 2026",
            "medications": [
                {"name": "Tab Thyronorm", "dosage": "50 mcg", "schedule": "1-0-0 (7 AM)", "purpose": "Thyroid", "adherence": "98%"},
                {"name": "Tab Escitalopram", "dosage": "10 mg", "schedule": "1-0-0 (Morning)", "purpose": "Mood", "adherence": "93%"}
            ]
        },
        
        "checkups": [
            {
                "date": "Today, 08:00 AM",
                "bp": "124/80 mmHg",
                "bpStatus": "Optimal",
                "hr": "72 bpm",
                "hrStatus": "Normal",
                "spo2": "98%",
                "spo2Status": "Healthy",
                "glucose": "105 mg/dL",
                "temp": "98.1 °F",
                "weight": "58 kg",
                "bmi": "23.2",
                "conductedBy": "Self-Monitoring IoT Cuff",
                "notes": "Hemodynamic parameters stable. Mood assessment flagged low."
            }
        ],
        
        "assessments": {
            "adl": {
                "eating": {"score": "9/10", "status": "Independent"},
                "toileting": {"score": "9/10", "status": "Independent"},
                "walking": {"score": "9/10", "status": "Independent"},
                "moving": {"score": "9/10", "status": "Independent"}
            },
            "pain": {
                "score": 2,
                "location": "Neck / Upper Shoulder",
                "duration": "Postural stiffness",
                "sensation": "Mild tightness (गर्दन में हल्की जकड़न)"
            },
            "sleep": {
                "hours": 4.1,
                "quality": "Insomnia (Difficulty falling asleep)"
            }
        },
        
        "userInputs": [
            {
                "type": "voice",
                "timestamp": "Today, 07:15 AM",
                "hindiText": "आज अकेलापन बहुत लग रहा है, किसी से बात करने का मन है...",
                "englishTranslation": "Feeling very lonely today, wish to speak with someone...",
                "sentiment": "Severe Sadness & Disorientation",
                "sentimentBadge": "bg-purple-100 text-purple-800",
                "duration": "16 sec"
            }
        ]
    },
    {
        "id": "PAT-105",
        "username": "senior_harish",
        "name": "Harish Patel",
        "age": 76,
        "gender": "Male",
        "avatar": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80",
        "location": "Malviya Nagar (Block E-12)",
        "phone": "+91 98199-33812",
        "assignedNurse": "Sister Kavita, RN",
        
        # ML MODEL PREDICTED TIER & METRICS
        "predictedTier": "NORMAL",
        "tierLabel": "🟢 NORMAL TIER",
        "tierColor": "emerald",
        "modelScore": 9,
        "predictedProbability": "18.2%",
        "modelRiskLevel": "Low Risk",
        "alertRaised": False,
        "modelDrivers": [
            "All vital signs, mobility, sleep, and medication adherence are within healthy normal ranges.",
            "Blood pressure normal: 122/80 mmHg, Heart rate: 72 bpm, SpO2: 98%",
            "Functional ADLs 100% independent (Eating, Walking, Toileting, Moving)",
            "Zero missed medication doses in past 30 days"
        ],
        "suggestedAction": "Routine monitoring & Bluetooth cuff weekly sync. No intervention required.",
        
        "emergencyContact": {
            "name": "Sneha Patel",
            "relation": "Daughter",
            "phone": "+91 98200-44910",
            "altPhone": "+91 98199-22110 (Manoj Patel, Son)",
            "email": "sneha.patel@example.com",
            "address": "Malviya Nagar, New Delhi",
            "notificationStatus": "Standby (No Alert Raised - Alarm Fatigue Averted)",
            "channels": ["Routine Portal"],
            "dispatchedAt": None,
            "smsDelivered": False,
            "whatsappDelivered": False
        },
        
        "medicalHistory": {
            "chronicConditions": [
                "Well-Controlled Hypertension",
                "Benign Prostatic Hyperplasia (BPH)",
                "Mild Dyslipidemia"
            ],
            "allergies": ["No known drug allergies"],
            "surgeries": ["None"],
            "bloodGroup": "AB +ve",
            "doctor": "Dr. R.K. Mehta (Max Smart Super)",
            "nextReview": "05 Dec 2026",
            "medications": [
                {"name": "Tab Telmisartan", "dosage": "40 mg", "schedule": "1-0-0 (Morning)", "purpose": "Blood Pressure", "adherence": "98%"},
                {"name": "Tab Silodosin", "dosage": "8 mg", "schedule": "0-0-1 (Night)", "purpose": "Urinary Flow", "adherence": "96%"},
                {"name": "Tab Rosuvastatin", "dosage": "10 mg", "schedule": "0-0-1 (Night)", "purpose": "Lipids", "adherence": "94%"}
            ]
        },
        
        "checkups": [
            {
                "date": "Today, 07:30 AM",
                "bp": "122/80 mmHg",
                "bpStatus": "Optimal Normal",
                "hr": "72 bpm",
                "hrStatus": "Normal",
                "spo2": "98%",
                "spo2Status": "Healthy",
                "glucose": "108 mg/dL",
                "temp": "98.2 °F",
                "weight": "70 kg",
                "bmi": "24.2",
                "conductedBy": "Home Bluetooth IoT Hub",
                "notes": "Morning checkup completed smoothly. Vitals in optimal green range."
            }
        ],
        
        "assessments": {
            "adl": {
                "eating": {"score": "10/10", "status": "Independent"},
                "toileting": {"score": "10/10", "status": "Independent"},
                "walking": {"score": "10/10", "status": "Independent"},
                "moving": {"score": "10/10", "status": "Independent"}
            },
            "pain": {
                "score": 0,
                "location": "None",
                "duration": "None",
                "sensation": "No Pain (दर्द मुक्त)"
            },
            "sleep": {
                "hours": 7.5,
                "quality": "Sound & Peaceful"
            }
        },
        
        "userInputs": [
            {
                "type": "one_tap",
                "timestamp": "Today, 07:45 AM",
                "selection": "😊 Feeling Great (Sab Badhiya Hai)",
                "recordedNote": "Morning tea and walk completed without difficulty",
                "badge": "bg-emerald-100 text-emerald-800"
            },
            {
                "type": "missed_call",
                "timestamp": "Today, 07:46 AM",
                "tollFree": "1800-202-CARE",
                "status": "Logged & Verified Safe"
            }
        ]
    }
]

EMERGENCY_NOTIFICATIONS_SEED = [
    {
        "id": "NOTIF-901",
        "alertId": "ALT-1091",
        "seniorId": "PAT-101",
        "seniorName": "Ramesh Sharma",
        "username": "senior_ramesh",
        "contactName": "Rahul Sharma (Son)",
        "contactPhone": "+91 98711-20931",
        "predictedTier": "CRITICAL TIER",
        "channels": ["SMS", "WhatsApp", "Push Notification"],
        "severity": "CRITICAL",
        "timestamp": "Today, 08:31 AM",
        "smsMessage": "🚨 CareConnect CRITICAL ALERT: Ramesh Sharma (@senior_ramesh, 74y) classified in CRITICAL TIER by AI ML model (Risk Score 80/100). Resting HR spike 114 bpm + SpO2 94% + Missed check-in. Coordinator Sister Kavita dispatched. Dial: +91 98110-44912",
        "whatsappMessage": "🚨 *CareConnect CRITICAL TIER ALERT*\n*Patient:* Ramesh Sharma (@senior_ramesh, Age 74)\n*ML Model Predicted Tier:* CRITICAL (Score 80/100 • 64.3% Risk)\n*Drivers:* Tachycardia (114 bpm) + SpO2 94% + Missed check-in + 4hr immobility\n*Action:* Sister Kavita dispatched (ETA 12m)\n*Direct Dial Senior:* +91 98110-44912",
        "deliveryStatus": "Delivered",
        "readReceipt": True
    },
    {
        "id": "NOTIF-902",
        "alertId": "ALT-1088",
        "seniorId": "PAT-102",
        "seniorName": "Savitri Devi",
        "username": "senior_savitri",
        "contactName": "Priya Verma (Daughter)",
        "contactPhone": "+91 99100-33421",
        "predictedTier": "CRITICAL TIER",
        "channels": ["SMS", "WhatsApp", "Push Notification"],
        "severity": "CRITICAL",
        "timestamp": "Today, 06:51 AM",
        "smsMessage": "🚨 CareConnect CRITICAL ALERT: Savitri Devi (@senior_savitri, 81y) classified in CRITICAL TIER. Fall sensor triggered + Acute pain 8/10 reported via voice note. Paramedic Amit dispatched. Dial: +91 98103-99210",
        "whatsappMessage": "🚨 *CareConnect CRITICAL TIER ALERT*\n*Patient:* Savitri Devi (@senior_savitri, Age 81)\n*ML Model Predicted Tier:* CRITICAL (Score 62/100)\n*Drivers:* Bathroom fall sensor trigger + Voice Note: 'चक्कर आ गए थे और कमर में तेज दर्द है'\n*Action:* Paramedic Amit dispatched (ETA 18m)",
        "deliveryStatus": "Delivered",
        "readReceipt": True
    },
    {
        "id": "NOTIF-903",
        "alertId": "ALT-1074",
        "seniorId": "PAT-103",
        "seniorName": "Anand Verma",
        "username": "senior_anand",
        "contactName": "Deepak Verma (Son)",
        "contactPhone": "+91 98112-99881",
        "predictedTier": "CRITICAL TIER",
        "channels": ["SMS", "WhatsApp"],
        "severity": "CRITICAL",
        "timestamp": "Today, 07:20 AM",
        "smsMessage": "🚨 CareConnect CRITICAL ALERT: Anand Verma (@senior_anand, 78y) classified in CRITICAL TIER. Severe Hyperglycemia (228 mg/dL) + 2 missed insulin doses. Buddy Rajesh dispatched. Dial: +91 98734-11823",
        "whatsappMessage": "🚨 *CareConnect CRITICAL TIER ALERT*\n*Patient:* Anand Verma (@senior_anand, Age 78)\n*ML Model Predicted Tier:* CRITICAL (Score 53/100 • 68.6% Risk)\n*Drivers:* Blood Sugar 228 mg/dL + 2 Missed Insulin Doses\n*Action:* Buddy Rajesh dispatched for insulin verification",
        "deliveryStatus": "Delivered",
        "readReceipt": True
    }
]

print("Seed database refreshed with ML Model Tier Predictions (Critical vs Normal).")
