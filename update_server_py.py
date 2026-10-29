# -*- coding: utf-8 -*-
import re

with open("server.py", "r", encoding="utf-8") as f:
    code = f.read()

# 1. Add import after `import nlp_extractor as nlp`
import_target = "import nlp_extractor as nlp"
import_replacement = """import nlp_extractor as nlp
from patient_data_seed import PATIENTS_DATA, EMERGENCY_NOTIFICATIONS_SEED"""

code = code.replace(import_target, import_replacement, 1)

# 2. Add patients and emergency_notifications to DB
db_target = """        "avertedHospitalizations": 24,
        "resolutionRatePercent": 94.8
    }
}"""

db_replacement = """        "avertedHospitalizations": 24,
        "resolutionRatePercent": 94.8
    },
    "patients": list(PATIENTS_DATA),
    "emergency_notifications": list(EMERGENCY_NOTIFICATIONS_SEED)
}"""

code = code.replace(db_target, db_replacement, 1)

# 3. Add routes for patients, raise-critical, emergency notification dispatch, notification logs
routes_code = '''
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
    whatsapp_text = f"🚨 *CareConnect Urgent Clinical Alert*\\n*Patient:* {senior_name} (@{patient.get('username', '') if patient else ''})\\n*Severity:* CRITICAL\\n*Alert Cause:* {reason}\\n*Immediate Action:* {suggested_action}\\n*Care Coordinator:* Sister Kavita\\n*Emergency Support Line:* 1800-202-CARE"
    
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
        "whatsappMessage": f"🚨 *CareConnect Emergency Update*\\n{custom_msg}",
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
'''

# Place routes_code right before `@app.route("/api/alerts", methods=["GET"])`
code = code.replace('@app.route("/api/alerts", methods=["GET"])', routes_code + '\n@app.route("/api/alerts", methods=["GET"])', 1)

with open("server.py", "w", encoding="utf-8") as f:
    f.write(code)

print("server.py updated successfully!")

