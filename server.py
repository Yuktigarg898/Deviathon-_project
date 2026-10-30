#!/usr/bin/env python3
"""
CareConnect - Connected Healthcare & Elder Support System
Local Flask Web Server & API Engine
"""

import os
import sys
import json
import webbrowser
import tempfile
import io
from datetime import datetime
from flask import Flask, jsonify, request, send_from_directory
import nlp_extractor as nlp
from patient_data_seed import PATIENTS_DATA, EMERGENCY_NOTIFICATIONS_SEED

app = Flask(__name__, static_folder=".")

# Mock Database / In-Memory State
DB = {
    "alerts": [
        {
            "id": "ALT-1091",
            "rank": 1,
            "priority": "critical",
            "priorityScore": 98,
            "seniorName": "Ramesh Sharma",
            "age": 74,
            "location": "South Delhi (Greater Kailash)",
            "phone": "+91 98110-44912",
            "familyContact": "Rahul Sharma (Son)",
            "assignedNurse": "Sister Kavita, RN",
            "reason": "Missed 08:00 AM check-in + Resting HR spike (114 bpm) + Inactivity > 4 hrs",
            "suggestedAction": "Step 1: Immediate 2-way emergency call. Step 2: Dispatch Nurse Kavita (ETA 12m).",
            "status": "pending"
        },
        {
            "id": "ALT-1088",
            "rank": 2,
            "priority": "critical",
            "priorityScore": 92,
            "seniorName": "Savitri Devi",
            "age": 81,
            "location": "Hauz Khas",
            "phone": "+91 98103-99210",
            "familyContact": "Priya Verma (Daughter)",
            "assignedNurse": "Brother Amit, Paramedic",
            "reason": "Fall risk sensor trigger at 06:45 AM + Hindi voice note: 'चक्कर आ गए थे'",
            "suggestedAction": "Dispatch Paramedic Amit for fracture assessment & tele-radiology.",
            "status": "pending"
        },
        {
            "id": "ALT-1074",
            "rank": 3,
            "priority": "high",
            "priorityScore": 84,
            "seniorName": "Anand Verma",
            "age": 78,
            "location": "Saket",
            "phone": "+91 98734-11823",
            "familyContact": "Deepak Verma (Son)",
            "assignedNurse": "Rajesh Kumar (Buddy)",
            "reason": "2-day missed insulin reminder + elevated sugar reading (228 mg/dL)",
            "suggestedAction": "Doorstep visit by Buddy Rajesh to verify insulin cold chain & dose.",
            "status": "pending"
        }
    ],
    "senior_status": {
        "seniorName": "Ramesh Sharma",
        "checkedIn": False,
        "lastCheckIn": None,
        "method": None,
        "isSerious": True
    },
    "ops_metrics": {
        "city": "Delhi NCR",
        "totalAlerts": 342,
        "activeAlerts": 14,
        "resolvedAlerts": 328,
        "avgResponseMinutes": 6.4,
        "avertedHospitalizations": 24,
        "resolutionRatePercent": 94.8
    },
    "patients": list(PATIENTS_DATA),
    "emergency_notifications": list(EMERGENCY_NOTIFICATIONS_SEED)
}

# --- STATIC ASSET ROUTES ---
@app.route("/")
def index():
    return send_from_directory(".", "index.html")

@app.route("/<path:filename>")
def static_files(filename):
    return send_from_directory(".", filename)

# --- AUTHENTICATION ROUTES ---
@app.route("/api/auth/login", methods=["POST"])
def auth_login():
    data = request.json or {}
    role = data.get("role", "senior")
    email = data.get("email", "")
    return jsonify({
        "success": True,
        "role": role,
        "token": "cc_auth_token_mock_session",
        "user": {
            "email": email,
            "role": role,
            "loginTime": datetime.now().isoformat()
        }
    })

@app.route("/api/auth/register", methods=["POST"])
def auth_register():
    data = request.json or {}
    role = data.get("role", "senior")
    name = data.get("name", "New Member")
    return jsonify({
        "success": True,
        "message": f"Account created successfully for {name}",
        "role": role,
        "user": data
    })

@app.route("/api/auth/otp/send", methods=["POST"])
def auth_send_otp():
    data = request.json or {}
    recipient = data.get("recipient", "")
    # Generated mock OTP
    return jsonify({
        "success": True,
        "otp": "4826",
        "recipient": recipient,
        "message": "Demo OTP dispatched successfully"
    })

@app.route("/api/auth/otp/verify", methods=["POST"])
def auth_verify_otp():
    data = request.json or {}
    otp = str(data.get("otp", "")).strip()
    return jsonify({
        "success": True,
        "verified": True,
        "message": "OTP verified successfully"
    })

@app.route("/api/auth/password/reset", methods=["POST"])
def auth_password_reset():
    data = request.json or {}
    return jsonify({
        "success": True,
        "message": "Password reset successfully. You may now log in with your new password."
    })

# --- REST API ROUTES ---
@app.route("/api/health", methods=["GET"])
def health_check():
    return jsonify({
        "status": "healthy",
        "service": "CareConnect Telemetry Core",
        "timestamp": datetime.now().isoformat(),
        "views": [
            "1. Care Coordinator (Ranked daily prioritisation list & actions)",
            "2. Senior (Voice note, missed-call & one-tap in Hindi/English)",
            "3. Family Member (Weekly wellbeing summary & serious alerts only)",
            "4. Operations Manager (Alert volumes, response times & city SLA)"
        ]
    })


# --- PATIENT & CLINICAL DOSSIER ROUTES ---
@app.route("/api/patients", methods=["GET"])
def get_patients():
    """Returns list of all registered patients with clinical records & inputs"""
    status_filter = request.args.get("status")
    query = (request.args.get("q") or "").strip().lower()
    
    patients = DB.get("patients", [])
    filtered = []
    for p in patients:
        if status_filter and status_filter != "all" and p.get("currentStatus") != status_filter:
            continue
        if query:
            match = (
                query in p.get("name", "").lower() or
                query in p.get("username", "").lower() or
                query in p.get("location", "").lower() or
                query in p.get("phone", "").lower()
            )
            if not match:
                continue
        filtered.append(p)
    return jsonify({
        "success": True,
        "total": len(filtered),
        "patients": filtered
    })

@app.route("/api/patients/<identifier>", methods=["GET"])
def get_patient_detail(identifier):
    """Retrieves comprehensive patient profile by ID or username"""
    ident = str(identifier).strip().lower()
    for p in DB.get("patients", []):
        if p.get("id", "").lower() == ident or p.get("username", "").lower() == ident:
            return jsonify({"success": True, "patient": p})
    # Fallback partial name match
    for p in DB.get("patients", []):
        if ident in p.get("name", "").lower():
            return jsonify({"success": True, "patient": p})
    return jsonify({"success": False, "message": "Patient not found"}), 404

@app.route("/api/alerts/raise-critical", methods=["POST"])
def raise_critical_alert():
    """
    Care Coordinator or automated clinical trigger raises a critical alert:
    1. Elevates patient status to Critical
    2. Promotes/Injects alert to Rank #1
    3. Automatically sends simulated emergency notification to Emergency Contacts (SMS & WhatsApp)
    4. Audits dispatch in emergency notification store
    """
    data = request.json or {}
    patient_id = data.get("patientId")
    patient = None
    
    # Locate patient
    for p in DB.get("patients", []):
        if p.get("id") == patient_id or p.get("username") == patient_id or patient_id in p.get("name", ""):
            patient = p
            break
            
    if not patient and DB.get("patients"):
        patient = DB["patients"][0] # Default to first patient if unspecified
        
    senior_name = data.get("seniorName", patient.get("name") if patient else "Ramesh Sharma")
    reason = data.get("reason", "Critical clinical escalation: Biometric arrhythmia & urgent check-in failure.")
    suggested_action = data.get("suggestedAction", f"Step 1: Immediate 2-way call. Step 2: Emergency dispatch to nearest specialist. Step 3: Urgent notification sent to {patient['emergencyContact']['name']}.")
    
    # Update patient status
    if patient:
        patient["currentStatus"] = "critical"
        patient["triageScore"] = 99
    
    # Create or update alert in DB
    new_alert_id = f"ALT-{len(DB['alerts']) + 1100}"
    new_alert = {
        "id": new_alert_id,
        "rank": 1,
        "priority": "critical",
        "priorityScore": 99,
        "seniorName": senior_name,
        "patientId": patient.get("id") if patient else "PAT-101",
        "username": patient.get("username") if patient else "senior_ramesh",
        "age": patient.get("age", 74) if patient else 74,
        "location": patient.get("location", "South Delhi") if patient else "South Delhi",
        "phone": patient.get("phone", "+91 98110-44912") if patient else "+91 98110-44912",
        "familyContact": f"{patient['emergencyContact']['name']} ({patient['emergencyContact']['relation']}) • {patient['emergencyContact']['phone']}" if patient else "Rahul Sharma (Son)",
        "assignedNurse": patient.get("assignedNurse", "Sister Kavita, RN") if patient else "Sister Kavita, RN",
        "reason": reason,
        "suggestedAction": suggested_action,
        "status": "pending",
        "timestamp": datetime.now().strftime("%I:%M:%S %p"),
        "timeAgo": "Just now"
    }
    
    # Push all existing alerts down
    for a in DB["alerts"]:
        a["rank"] += 1
    DB["alerts"].insert(0, new_alert)
    
    if patient:
        patient["activeAlertId"] = new_alert_id
        
    DB["ops_metrics"]["totalAlerts"] += 1
    DB["ops_metrics"]["activeAlerts"] += 1
    DB["senior_status"]["isSerious"] = True
    
    # Automatic Emergency Notification Dispatch to Emergency Contact
    e_contact = patient.get("emergencyContact", {}) if patient else {}
    contact_name = e_contact.get("name", "Rahul Sharma")
    contact_phone = e_contact.get("phone", "+91 98711-20931")
    
    notification_id = f"NOTIF-{len(DB.get('emergency_notifications', [])) + 901}"
    now_str = datetime.now().strftime("%d %b %Y, %I:%M %p")
    
    sms_text = f"🚨 CareConnect CRITICAL ALERT: Emergency alert raised for {senior_name} at {patient.get('location', 'Residence') if patient else 'Residence'}. Reason: {reason[:80]}... Coordinator initiated protocol. Dial senior: {patient.get('phone', '') if patient else ''}"
    whatsapp_text = f"🚨 *CareConnect Urgent Clinical Alert*\n*Patient:* {senior_name} (@{patient.get('username', '') if patient else ''})\n*Severity:* CRITICAL\n*Alert Cause:* {reason}\n*Immediate Action:* {suggested_action}\n*Care Coordinator:* Sister Kavita\n*Emergency Support Line:* 1800-202-CARE"
    
    notification = {
        "id": notification_id,
        "alertId": new_alert_id,
        "seniorId": patient.get("id") if patient else "PAT-101",
        "seniorName": senior_name,
        "username": patient.get("username") if patient else "senior_ramesh",
        "contactName": contact_name,
        "contactPhone": contact_phone,
        "channels": ["SMS", "WhatsApp", "Push Notification"],
        "severity": "CRITICAL",
        "timestamp": now_str,
        "smsMessage": sms_text,
        "whatsappMessage": whatsapp_text,
        "deliveryStatus": "Delivered",
        "readReceipt": True
    }
    
    DB.setdefault("emergency_notifications", []).insert(0, notification)
    
    return jsonify({
        "success": True,
        "message": f"Critical alert raised and emergency contacts notified via SMS & WhatsApp for {senior_name}",
        "alert": new_alert,
        "notification": notification,
        "patient": patient
    })

@app.route("/api/notifications/dispatch-emergency", methods=["POST"])
def dispatch_emergency_notification():
    """Allows manual dispatch or resend of SMS/WhatsApp to emergency contact"""
    data = request.json or {}
    patient_id = data.get("patientId")
    patient = None
    for p in DB.get("patients", []):
        if p.get("id") == patient_id or p.get("username") == patient_id:
            patient = p
            break
            
    if not patient and DB.get("patients"):
        patient = DB["patients"][0]
        
    senior_name = patient.get("name", "Senior")
    contact = patient.get("emergencyContact", {})
    custom_msg = data.get("customMessage") or f"🚨 CareConnect Emergency Update for {senior_name}: Care team active on site."
    channels = data.get("channels") or ["SMS", "WhatsApp"]
    
    notif_id = f"NOTIF-{len(DB.get('emergency_notifications', [])) + 901}"
    notif = {
        "id": notif_id,
        "alertId": patient.get("activeAlertId", "ALT-MANUAL"),
        "seniorId": patient.get("id"),
        "seniorName": senior_name,
        "username": patient.get("username"),
        "contactName": contact.get("name", "Emergency Contact"),
        "contactPhone": contact.get("phone", "+91 98711-20931"),
        "channels": channels,
        "severity": "CRITICAL",
        "timestamp": datetime.now().strftime("%d %b %Y, %I:%M %p"),
        "smsMessage": custom_msg,
        "whatsappMessage": f"🚨 *CareConnect Emergency Update*\n{custom_msg}",
        "deliveryStatus": "Delivered",
        "readReceipt": True
    }
    DB.setdefault("emergency_notifications", []).insert(0, notif)
    
    return jsonify({
        "success": True,
        "message": f"Notification successfully sent to {contact.get('name')} via {', '.join(channels)}",
        "notification": notif
    })

@app.route("/api/notifications/log", methods=["GET"])
def get_emergency_notifications_log():
    """Returns audit trail of notifications dispatched to emergency contacts"""
    return jsonify({
        "success": True,
        "total": len(DB.get("emergency_notifications", [])),
        "notifications": DB.get("emergency_notifications", [])
    })

@app.route("/api/patients/<patient_id>/input", methods=["POST"])
def add_patient_user_input(patient_id):
    """Adds a new direct user input (voice note / one-tap / symptom) to patient record"""
    data = request.json or {}
    patient = None
    for p in DB.get("patients", []):
        if p.get("id") == patient_id or p.get("username") == patient_id:
            patient = p
            break
    if not patient:
        return jsonify({"success": False, "message": "Patient not found"}), 404
        
    input_item = {
        "type": data.get("type", "one_tap"),
        "timestamp": datetime.now().strftime("Today, %I:%M %p"),
        "hindiText": data.get("hindiText"),
        "englishTranslation": data.get("englishTranslation"),
        "selection": data.get("selection"),
        "recordedNote": data.get("recordedNote"),
        "sentiment": data.get("sentiment", "Normal"),
        "sentimentBadge": data.get("sentimentBadge", "bg-emerald-100 text-emerald-800")
    }
    patient.setdefault("userInputs", []).insert(0, input_item)
    return jsonify({"success": True, "input": input_item, "totalInputs": len(patient["userInputs"])})

@app.route("/api/alerts", methods=["GET"])
def get_alerts():
    return jsonify({
        "total": len(DB["alerts"]),
        "alerts": DB["alerts"]
    })

@app.route("/api/alerts/trigger", methods=["POST"])
def trigger_alert():
    data = request.json or {}
    new_id = f"ALT-{len(DB['alerts']) + 1100}"
    new_alert = {
        "id": new_id,
        "rank": 1,
        "priority": "critical",
        "priorityScore": 99,
        "seniorName": data.get("seniorName", "Emergency Senior"),
        "reason": data.get("reason", "Sudden distress signal triggered"),
        "suggestedAction": data.get("suggestedAction", "Immediate coordinator call & dispatch"),
        "status": "pending",
        "timestamp": datetime.now().strftime("%H:%M:%S")
    }
    # Re-rank
    for a in DB["alerts"]:
        a["rank"] += 1
    DB["alerts"].insert(0, new_alert)
    DB["ops_metrics"]["totalAlerts"] += 1
    DB["ops_metrics"]["activeAlerts"] += 1
    return jsonify({"success": True, "alert": new_alert})

@app.route("/api/alerts/resolve", methods=["POST"])
def resolve_alert():
    data = request.json or {}
    alert_id = data.get("id")
    for a in DB["alerts"]:
        if a["id"] == alert_id:
            a["status"] = "resolved"
            DB["ops_metrics"]["activeAlerts"] = max(0, DB["ops_metrics"]["activeAlerts"] - 1)
            DB["ops_metrics"]["resolvedAlerts"] += 1
            return jsonify({"success": True, "resolved": a})
    return jsonify({"success": False, "message": "Alert not found"}), 404

@app.route("/api/senior/checkin", methods=["POST"])
def senior_checkin():
    data = request.json or {}
    method = data.get("method", "one_tap") # 'one_tap' | 'voice' | 'missed_call'
    status = data.get("status", "great")
    
    DB["senior_status"]["checkedIn"] = True
    DB["senior_status"]["method"] = method
    DB["senior_status"]["lastCheckIn"] = datetime.now().strftime("%I:%M %p")
    DB["senior_status"]["isSerious"] = (status == "unwell")
    
    return jsonify({
        "success": True,
        "senior": DB["senior_status"]
    })

@app.route("/api/senior/assessment-predict", methods=["POST"])
def senior_assessment_predict():
    data = request.json or {}
    try:
        from ml_engine import predict_elder_risk
        result = predict_elder_risk(data)
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500
    
    senior_name = data.get("seniorName", "Ramesh Sharma")
    risk_level = result["predicted_risk_level"]
    
    # Update senior live state in in-memory DB
    DB["senior_status"]["checkedIn"] = True
    DB["senior_status"]["method"] = "Health Assessment"
    DB["senior_status"]["lastCheckIn"] = datetime.now().strftime("%I:%M %p")
    DB["senior_status"]["isSerious"] = (risk_level == "High")
    DB["senior_status"]["lastRisk"] = result
    
    alert_created = False
    # If High or Medium, create or escalate real-time alert for Care Coordinator
    if risk_level in ["High", "Medium"] and data.get("sync_coordinator", True):
        new_id = f"ALT-{len(DB['alerts']) + 1100}"
        priority = "critical" if risk_level == "High" else "high"
        new_alert = {
            "id": new_id,
            "rank": 1,
            "priority": priority,
            "priorityScore": result["risk_score"],
            "seniorName": senior_name,
            "age": int(data.get("age", 74)),
            "location": data.get("location", "South Delhi (Greater Kailash)"),
            "phone": "+91 98110-44912",
            "familyContact": "Rahul Sharma (Son)",
            "assignedNurse": "Sister Kavita, RN" if risk_level == "High" else "Brother Amit, Paramedic",
            "reason": f"Assessment ({risk_level} Risk): " + result["alert_reason_summary"],
            "suggestedAction": result["suggested_action_summary"],
            "status": "pending",
            "timestamp": datetime.now().strftime("%H:%M:%S"),
            "assessmentDetails": result
        }
        for a in DB["alerts"]:
            a["rank"] += 1
        DB["alerts"].insert(0, new_alert)
        DB["ops_metrics"]["totalAlerts"] += 1
        DB["ops_metrics"]["activeAlerts"] += 1
        alert_created = True

    return jsonify({
        "success": True,
        "result": result,
        "alert_created": alert_created,
        "senior_status": DB["senior_status"]
    })

@app.route("/api/ops/metrics", methods=["GET"])
def get_ops_metrics():
    return jsonify(DB["ops_metrics"])


# =========================================================================
# AUDIO INTAKE, VOICE AUTO-FILL & BILINGUAL CLINICAL NLP
# =========================================================================

@app.route("/api/audio/extract-form", methods=["POST"])
def audio_extract_form():
    """
    Parses speech transcript (Hindi, English, or Hinglish) and extracts
    elder assessment parameters, updates cumulative context, and audits checklist.
    """
    try:
        data = request.get_json() or {}
        transcript = data.get("transcript", "").strip()
        lang_hint = data.get("language", "hi-IN")
        current_entities = data.get("current_entities") or {}
        result = nlp.extract_clinical_entities_from_text(transcript, lang_hint=lang_hint, current_entities=current_entities)
        return jsonify(result)
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 400

@app.route("/api/audio/upload", methods=["POST"])
def audio_upload_and_extract():
    """
    Accepts uploaded audio file (.wav, .flac, etc.), transcribes speech,
    and extracts clinical entities into form fields with bilingual voice feedback.
    """
    try:
        if "audio" not in request.files and "file" not in request.files:
            return jsonify({"success": False, "error": "No audio file uploaded."}), 400
        audio_file = request.files.get("audio") or request.files.get("file")
        if not audio_file or not audio_file.filename:
            return jsonify({"success": False, "error": "Empty audio file."}), 400

        language = request.form.get("language", "hi-IN")
        import json
        current_entities = {}
        if "current_entities" in request.form:
            try:
                current_entities = json.loads(request.form["current_entities"])
            except Exception:
                pass

        ext = os.path.splitext(audio_file.filename)[1].lower() or ".wav"
        with tempfile.NamedTemporaryFile(suffix=ext, delete=False) as tmp:
            tmp_path = tmp.name
            audio_file.save(tmp_path)

        try:
            ok, transcript, err_msg = nlp.transcribe_audio_file(tmp_path, language=language)
            if not ok or not transcript:
                return jsonify({
                    "success": False,
                    "error": f"Audio transcription could not be completed: {err_msg}. Please speak clearly into the microphone or test with provided speech samples."
                }), 400
            result = nlp.extract_clinical_entities_from_text(transcript, lang_hint=language, current_entities=current_entities)
            return jsonify(result)
        finally:
            if os.path.exists(tmp_path):
                os.remove(tmp_path)
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 400

@app.route("/api/tts", methods=["GET"])
def text_to_speech_stream():
    """
    High-fidelity neural Text-to-Speech audio streaming endpoint using gTTS.
    Returns authentic MP3 audio stream for Hindi and English voice instructions.
    """
    try:
        from gtts import gTTS
        from flask import send_file

        text = (request.args.get("text") or "").strip()
        lang = (request.args.get("lang") or "hi").lower()
        if not text:
            return jsonify({"error": "No text provided"}), 400

        tts_lang = "hi" if (lang in ["hi", "hi-in", "hindi"]) else "en"
        tld = "co.in"  # Authentic Indian accent phonetics

        tts = gTTS(text=text, lang=tts_lang, tld=tld, slow=False)
        fp = io.BytesIO()
        tts.write_to_fp(fp)
        fp.seek(0)
        return send_file(fp, mimetype="audio/mpeg", as_attachment=False)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


def main():
    port = int(os.environ.get("PORT", 5000))
    print(f"\n==================================================================")
    print(f"  CareConnect - Connected Healthcare & Elder Support System")
    print(f"  Server running at: http://127.0.0.1:{port}")
    print(f"  Includes all 4 views:")
    print(f"  1. Care Coordinator | 2. Senior | 3. Family | 4. Operations")
    print(f"==================================================================\n")
    
    # Optionally open browser automatically
    if "--no-browser" not in sys.argv:
        try:
            webbrowser.open(f"http://127.0.0.1:{port}")
        except Exception:
            pass

    app.run(host="0.0.0.0", port=port, debug=False)


@app.route("/api/coordinator/evaluate-tier", methods=["POST"])
def evaluate_patient_tier():
    """
    Evaluates patient data, medical history, checkup vitals, and assessment
    using the Random Forest ML model (predict_elder_risk).
    Categorizes patient into:
      - CRITICAL TIER: Raises alert & auto-dispatches SMS/WhatsApp to emergency contact
      - NORMAL TIER: Marks patient safe, no emergency alarm
      - MODERATE TIER: Flags for coordinator check
    """
    from ml_engine import predict_elder_risk
    data = request.json or {}
    patient_id = data.get("patientId")
    patient = None
    for p in DB.get("patients", []):
        if p.get("id") == patient_id or p.get("username") == patient_id or (patient_id and patient_id in p.get("name", "")):
            patient = p
            break
            
    if not patient and DB.get("patients"):
        patient = DB["patients"][0]

    # Build complete feature set from patient's medical history, vitals, and assessments
    features = {}
    if patient:
        features['age'] = patient.get('age', 70)
        features['gender'] = patient.get('gender', 'Female')
        
        checkups = patient.get('checkups', [])
        if checkups:
            recent = checkups[0]
            bp_str = str(recent.get('bp', '120/80')).split()[0]
            if '/' in bp_str:
                parts = bp_str.split('/')
                try:
                    features['bp_systolic'] = float(parts[0])
                    features['bp_diastolic'] = float(parts[1])
                except Exception: pass
            hr_str = str(recent.get('hr', '75')).split()[0]
            try: features['heart_rate'] = float(hr_str)
            except Exception: pass
            spo2_str = str(recent.get('spo2', '98')).replace('%', '').strip()
            try: features['spo2'] = float(spo2_str)
            except Exception: pass
            glu_str = str(recent.get('glucose', '110')).split()[0]
            try: features['blood_glucose'] = float(glu_str)
            except Exception: pass
            wt_str = str(recent.get('weight', '65')).split()[0]
            try: features['weight_kg'] = float(wt_str)
            except Exception: pass

        med_hist = patient.get('medicalHistory', {})
        conditions = med_hist.get('chronicConditions', [])
        features['diseases'] = conditions
        features['is_diabetic'] = 1 if any('diabet' in str(c).lower() for c in conditions) or features.get('blood_glucose', 110) > 160 else 0
        medications = med_hist.get('medications', [])
        features['medication_count'] = len(medications)
        features['missed_doses'] = 0
        
        # 3. Medical Assessments (ADL, Pain, Sleep)
        assessments = patient.get('assessments', {}) or patient.get('medicalAssessment', {})
        pain_info = assessments.get('pain', {})
        if isinstance(pain_info, dict):
            features['pain_level'] = float(pain_info.get('score', 0))
            features['pain_location'] = pain_info.get('location', 'None')
        else:
            try: features['pain_level'] = float(str(pain_info).split('/')[0].strip())
            except Exception: features['pain_level'] = 0.0
        features['pain_present'] = 1 if features['pain_level'] > 0 else 0
        
        sleep_info = assessments.get('sleep', {})
        if isinstance(sleep_info, dict):
            features['sleep_hours'] = float(sleep_info.get('hours', 7.0))
        else:
            try: features['sleep_hours'] = float(str(sleep_info).split()[0].strip())
            except Exception: features['sleep_hours'] = 7.0
            
        adl_info = assessments.get('adl', {})
        if isinstance(adl_info, dict):
            walking = adl_info.get('walking', {})
            status = walking.get('status', '').lower() if isinstance(walking, dict) else str(walking).lower()
            features['walking_independent'] = 0 if any(w in status for w in ['cane', 'walker', 'wheelchair', 'bed', 'instab', 'diffic']) else 1
        else:
            mobility = str(assessments.get('mobility', '')).lower()
            features['walking_independent'] = 0 if any(w in mobility for w in ['diffic', 'walker', 'bed', 'wheelchair', 'fall']) else 1
        features['able_to_walk_independently'] = features['walking_independent']

    # Incoming request overrides patient defaults
    features.update({k: v for k, v in data.items() if k != 'patientId'})

    # Run ML prediction on provided or patient data
    pred = predict_elder_risk(features)
    risk_level = pred["predicted_risk_level"] # "High", "Medium", "Low"
    
    if risk_level == "High":
        tier = "CRITICAL"
        tier_label = "🚨 CRITICAL TIER"
        tier_color = "rose"
        alert_raised = True
    elif risk_level == "Medium":
        tier = "MODERATE"
        tier_label = "🟡 MODERATE TIER"
        tier_color = "amber"
        alert_raised = False
    else:
        tier = "NORMAL"
        tier_label = "🟢 NORMAL TIER"
        tier_color = "emerald"
        alert_raised = False

    if patient:
        patient["predictedTier"] = tier
        patient["tierLabel"] = tier_label
        patient["tierColor"] = tier_color
        patient["modelScore"] = pred["risk_score"]
        patient["predictedProbability"] = f"{pred['predicted_probability']:.1%}"
        patient["modelRiskLevel"] = f"{risk_level} Risk"
        patient["modelDrivers"] = pred["alert_reasons"]
        patient["alertRaised"] = alert_raised

    notification = None
    new_alert = None

    if alert_raised:
        # Raise Critical Alert & Send Emergency Contact Notification
        new_alert_id = f"ALT-{len(DB['alerts']) + 1100}"
        senior_name = patient["name"] if patient else "Senior"
        e_contact = patient.get("emergencyContact", {}) if patient else {}
        
        new_alert = {
            "id": new_alert_id,
            "rank": 1,
            "priority": "critical",
            "priorityScore": pred["risk_score"],
            "seniorName": senior_name,
            "username": patient.get("username", "senior_ramesh") if patient else "senior",
            "patientId": patient.get("id", "PAT-101") if patient else "PAT-101",
            "age": patient.get("age", 74) if patient else 74,
            "location": patient.get("location", "South Delhi") if patient else "South Delhi",
            "phone": patient.get("phone", "+91 98110-44912") if patient else "+91 98110-44912",
            "familyContact": f"{e_contact.get('name', 'Family')} • {e_contact.get('phone', '')}",
            "assignedNurse": patient.get("assignedNurse", "Sister Kavita, RN") if patient else "Sister Kavita, RN",
            "reason": f"AI ML Model Classified into CRITICAL TIER: " + "; ".join(pred["alert_reasons"][:2]),
            "suggestedAction": pred["suggested_action_summary"],
            "status": "pending",
            "timestamp": datetime.now().strftime("%I:%M:%S %p"),
            "timeAgo": "Just now"
        }
        for a in DB["alerts"]:
            a["rank"] += 1
        DB["alerts"].insert(0, new_alert)
        DB["senior_status"]["isSerious"] = True

        # Generate notification for emergency contact
        notif_id = f"NOTIF-{len(DB.get('emergency_notifications', [])) + 901}"
        sms_text = f"🚨 CareConnect CRITICAL ALERT: {senior_name} classified in CRITICAL TIER by ML Model ({pred['risk_score']}/100). {pred['alert_reasons'][0] if pred['alert_reasons'] else ''}. Coordinator Sister Kavita initiated response. Dial senior: {patient.get('phone')}"
        whatsapp_text = f"🚨 *CareConnect CRITICAL TIER ALERT*\n*Patient:* {senior_name} (@{patient.get('username')})\n*ML Model Predicted Tier:* CRITICAL (Score {pred['risk_score']}/100 • {pred['predicted_probability']:.1%})\n*Model Drivers:* {'; '.join(pred['alert_reasons'][:2])}\n*Action:* Sister Kavita dispatched"

        notification = {
            "id": notif_id,
            "alertId": new_alert_id,
            "seniorId": patient.get("id"),
            "seniorName": senior_name,
            "username": patient.get("username"),
            "contactName": e_contact.get("name", "Emergency Contact"),
            "contactPhone": e_contact.get("phone", "+91 98711-20931"),
            "channels": ["SMS", "WhatsApp", "App Push"],
            "severity": "CRITICAL",
            "timestamp": datetime.now().strftime("%d %b %Y, %I:%M %p"),
            "smsMessage": sms_text,
            "whatsappMessage": whatsapp_text,
            "deliveryStatus": "Delivered",
            "readReceipt": True
        }
        DB.setdefault("emergency_notifications", []).insert(0, notification)
        e_contact["notificationStatus"] = "Dispatched & Delivered"
        e_contact["dispatchedAt"] = "Just now"
        e_contact["smsDelivered"] = True
        e_contact["whatsappDelivered"] = True

    return jsonify({
        "success": True,
        "predictedTier": tier,
        "tierLabel": tier_label,
        "tierColor": tier_color,
        "modelScore": pred["risk_score"],
        "predictedProbability": f"{pred['predicted_probability']:.1%}",
        "modelRiskLevel": f"{risk_level} Risk",
        "modelDrivers": pred["alert_reasons"],
        "alertRaised": alert_raised,
        "alert": new_alert,
        "notification": notification,
        "patient": patient
    })

if __name__ == "__main__":
    main()

