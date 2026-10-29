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
    }
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

if __name__ == "__main__":
    main()

