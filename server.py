#!/usr/bin/env python3
"""
CareConnect - Connected Healthcare & Elder Support System
Local Flask Web Server & API Engine
"""

import os
import sys
import json
import webbrowser
from datetime import datetime
from flask import Flask, jsonify, request, send_from_directory

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

@app.route("/api/ops/metrics", methods=["GET"])
def get_ops_metrics():
    return jsonify(DB["ops_metrics"])

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

