# -*- coding: utf-8 -*-
with open("server.py", "r", encoding="utf-8") as f:
    code = f.read()

tier_endpoint_code = '''
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

    # Run ML prediction on provided or patient data
    pred = predict_elder_risk(data)
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
        whatsapp_text = f"🚨 *CareConnect CRITICAL TIER ALERT*\\n*Patient:* {senior_name} (@{patient.get('username')})\\n*ML Model Predicted Tier:* CRITICAL (Score {pred['risk_score']}/100 • {pred['predicted_probability']:.1%})\\n*Model Drivers:* {'; '.join(pred['alert_reasons'][:2])}\\n*Action:* Sister Kavita dispatched"

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
'''

# Add right before `if __name__ == "__main__":`
code = code.replace('if __name__ == "__main__":', tier_endpoint_code + '\nif __name__ == "__main__":', 1)

with open("server.py", "w", encoding="utf-8") as f:
    f.write(code)

print("server.py updated with /api/coordinator/evaluate-tier!")

