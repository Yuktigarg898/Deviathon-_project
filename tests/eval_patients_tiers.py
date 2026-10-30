# -*- coding: utf-8 -*-
from patient_data_seed import PATIENTS_DATA
from ml_engine import predict_elder_risk

print("--- EVALUATING REAL ML MODEL PREDICTIONS FOR ALL PATIENTS ---")
for p in PATIENTS_DATA:
    checkup = p['checkups'][0] if p.get('checkups') else {}
    asmt = p.get('assessments', {})
    adl = asmt.get('adl', {})
    med = p.get('medicalHistory', {})
    
    bp_str = checkup.get('bp', '120/80')
    bp_sys = float(bp_str.split('/')[0])
    bp_dia = float(bp_str.split('/')[1].split()[0])
    hr = float(checkup.get('hr', '75').split()[0])
    spo2 = float(checkup.get('spo2', '98').replace('%', ''))
    glucose = float(checkup.get('glucose', '110').split()[0])
    pain = float(asmt.get('pain', {}).get('score', 0))
    sleep = float(asmt.get('sleep', {}).get('hours', 7.0))
    
    walking_indep = 1 if 'independent' in adl.get('walking', {}).get('status', '').lower() else 0
    eating_indep = 1 if 'independent' in adl.get('eating', {}).get('status', '').lower() else 0
    moving_indep = 1 if 'independent' in adl.get('moving', {}).get('status', '').lower() else 0
    toileting_indep = 1 if 'independent' in adl.get('toileting', {}).get('status', '').lower() else 0
    
    is_diabetic = 1 if any('diabetes' in c.lower() for c in med.get('chronicConditions', [])) else 0
    has_htn = 1 if any('hypertension' in c.lower() for c in med.get('chronicConditions', [])) else 0
    has_arth = 1 if any('osteoarthritis' in c.lower() or 'arthritis' in c.lower() for c in med.get('chronicConditions', [])) else 0
    missed_doses = 2 if 'anand' in p['name'].lower() else (1 if 'ramesh' in p['name'].lower() else 0)
    
    payload = {
        'age': p['age'],
        'gender': p['gender'],
        'weight_kg': float(checkup.get('weight', '65').split()[0]),
        'height_cm': 165,
        'bp_systolic': bp_sys,
        'bp_diastolic': bp_dia,
        'heart_rate': hr,
        'spo2': spo2,
        'blood_glucose': glucose,
        'pain_level': pain,
        'pain_present': 1 if pain > 0 else 0,
        'sleep_hours': sleep,
        'walking_independent': walking_indep,
        'eating_independent': eating_indep,
        'moving_independent': moving_indep,
        'toileting_independent': toileting_indep,
        'medication_count': len(med.get('medications', [])),
        'missed_doses': missed_doses,
        'is_diabetic': is_diabetic,
        'has_hypertension': has_htn,
        'has_arthritis': has_arth
    }
    pred = predict_elder_risk(payload)
    tier = 'CRITICAL' if pred['predicted_risk_level'] == 'High' else ('NORMAL' if pred['predicted_risk_level'] == 'Low' else 'MODERATE')
    print(f"Patient: {p['name']} (@{p['username']}) -> PREDICTED TIER: {tier} | Score: {pred['risk_score']} | Prob: {pred['predicted_probability']:.1%}")
    print(f"  Drivers: {pred['alert_reasons']}")

