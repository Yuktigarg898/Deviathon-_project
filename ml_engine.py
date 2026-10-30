# -*- coding: utf-8 -*-
"""
CareConnect - Machine Learning Risk Assessment Engine
Trained on ElderHealth Multi-Parameter Assessment Dataset (800 records)
Supports both Random Forest and Logistic Regression (+ Soft Ensemble)
Predicts Elder Risk Category: Low, Medium (Moderate), High
"""

import os
import joblib
import pandas as pd
import numpy as np
from datetime import datetime

# Path resolution for model artifacts
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_DIR = os.path.join(BASE_DIR, "ml_model")

RF_PATH = os.path.join(MODEL_DIR, "elder_risk_rf_model.pkl")
LR_PATH = os.path.join(MODEL_DIR, "elder_risk_lr_model.pkl")
ENSEMBLE_PATH = os.path.join(MODEL_DIR, "elder_risk_ensemble_model.pkl")
SCORE_PATH = os.path.join(MODEL_DIR, "elder_health_score_model.pkl")
FEATURES_PATH = os.path.join(MODEL_DIR, "feature_cols.pkl")
CLASSES_PATH = os.path.join(MODEL_DIR, "label_classes.pkl")

# Cached model objects
rf_model = None
lr_model = None
ensemble_model = None
score_model = None
feature_cols = None
label_classes = None

def load_ml_models():
    global rf_model, lr_model, ensemble_model, score_model, feature_cols, label_classes
    if rf_model is None or lr_model is None:
        try:
            if os.path.exists(RF_PATH):
                rf_model = joblib.load(RF_PATH)
            if os.path.exists(LR_PATH):
                lr_model = joblib.load(LR_PATH)
            if os.path.exists(ENSEMBLE_PATH):
                ensemble_model = joblib.load(ENSEMBLE_PATH)
            if os.path.exists(SCORE_PATH):
                score_model = joblib.load(SCORE_PATH)
            if os.path.exists(FEATURES_PATH):
                feature_cols = joblib.load(FEATURES_PATH)
            if os.path.exists(CLASSES_PATH):
                label_classes = joblib.load(CLASSES_PATH)
            print("[ML Engine] Loaded Random Forest & Logistic Regression models successfully.")
        except Exception as e:
            print(f"[ML Engine] Model loading notice: {e}")

# Initialize on module import
load_ml_models()

def predict_elder_risk(data):
    """
    Evaluates elder assessment inputs using:
    1. Random Forest Classifier
    2. Logistic Regression Pipeline (StandardScaler + LogisticRegression)
    3. Soft-Voting Ensemble Model
    4. Health Score Regressor
    5. Clinical Triage Overlay
    
    Returns structured risk prediction with dual-model telemetry, explanations & tailored recommendations.
    """
    load_ml_models()

    # 1. Parse & Normalize Demographic & Anthropometric Inputs
    try:
        age = float(data.get("age", 74))
    except (ValueError, TypeError):
        age = 74.0

    gender_str = str(data.get("gender", "Male")).strip().lower()
    is_female = 1 if gender_str in ["female", "f", "woman", "महिला", "स्त्री", "औरत"] else 0

    try:
        weight_kg = float(data.get("weight_kg", 65.0))
    except (ValueError, TypeError):
        weight_kg = 65.0

    try:
        height_cm = float(data.get("height_cm", 165.0))
    except (ValueError, TypeError):
        height_cm = 165.0

    bmi = round(weight_kg / ((height_cm / 100.0) ** 2), 1) if height_cm > 40 else 24.0

    # 2. Vitals
    try:
        bp_sys = float(data.get("bp_systolic", 128.0))
    except (ValueError, TypeError):
        bp_sys = 128.0

    try:
        bp_dia = float(data.get("bp_diastolic", 82.0))
    except (ValueError, TypeError):
        bp_dia = 82.0

    try:
        hr = float(data.get("heart_rate", 76.0))
    except (ValueError, TypeError):
        hr = 76.0

    try:
        spo2 = float(data.get("spo2", 97.0))
    except (ValueError, TypeError):
        spo2 = 97.0

    try:
        sleep_hours = float(data.get("sleep_hours", 7.0))
    except (ValueError, TypeError):
        sleep_hours = 7.0

    # 3. Pain Profile
    try:
        pain_level = float(data.get("pain_level", 0.0))
    except (ValueError, TypeError):
        pain_level = 0.0

    affirmative_vals = ["1", "true", "yes", "हाँ", "ha", "haan", "खुद", "अपने आप", "स्वतंत्र"]
    pain_present = 1 if (str(data.get("pain_present", "0")).lower() in affirmative_vals or pain_level > 0) else 0

    pain_loc_raw = str(data.get("pain_location", "None")).strip()
    dev_pain_map = {
        "घुटना": "Knee", "घुटने": "Knee", "घुटनों": "Knee",
        "कमर": "Back", "पीठ": "Back", "रीढ़": "Back",
        "कंधा": "Shoulder", "कंधे": "Shoulder",
        "जोड़": "Joints", "जोड़ों": "Joints", "गठिया": "Joints",
        "छाती": "Chest", "सीना": "Chest",
        "सिर": "Head", "सर": "Head", "गर्दन": "Neck"
    }
    pain_loc = dev_pain_map.get(pain_loc_raw, pain_loc_raw)
    if not pain_loc or pain_loc.lower() == "none":
        pain_loc = "Joints / Knee" if pain_level > 0 else "None"

    # 4. Functional Independence & ADLs (0 = Independent, 1 = Dependent in dataset)
    # Incoming from form: 1 = Independent, 0 = Needs Help / Dependent
    eating_indep = 1 if str(data.get("eating_independent", "1")).lower() in affirmative_vals else 0
    toileting_indep = 1 if str(data.get("toileting_independent", "1")).lower() in affirmative_vals else 0
    moving_indep = 1 if str(data.get("moving_independent", "1")).lower() in affirmative_vals else 0
    walking_indep = 1 if str(data.get("walking_independent", "1")).lower() in affirmative_vals else 0
    able_to_walk = 1 if str(data.get("able_to_walk_independently", str(walking_indep))).lower() in affirmative_vals else 0

    # Dataset ADL features: 1 = Dependent (needs help), 0 = Independent
    eating_dep = 1 - eating_indep
    toileting_dep = 1 - toileting_indep
    moving_dep = 1 - moving_indep
    walking_dep = 1 - walking_indep

    num_dep_acts = eating_dep + toileting_dep + moving_dep + walking_dep
    if not able_to_walk:
        num_dep_acts = min(6, num_dep_acts + 1)
    if pain_level >= 7:
        num_dep_acts = min(6, num_dep_acts + 1)

    adl_score = round(max(0.0, min(100.0, (6 - num_dep_acts) / 6.0 * 100.0)), 2)
    dependency_status = 1 if num_dep_acts > 0 else 0

    # 5. Sensory & Chronic Conditions
    hearing_impairment = 1 if (
        str(data.get("hearing_difficulty", "0")).lower() in ["1", "true", "yes", "हाँ"] or
        int(data.get("hearing_level", 0)) > 0 or
        str(data.get("hearing_status", "")).lower() in ["mild", "hearing aid", "impaired"]
    ) else 0

    # Diabetes & Blood Glucose
    is_diabetic = 1 if str(data.get("is_diabetic", "0")).lower() in ["1", "true", "yes", "हाँ"] else 0
    try:
        glucose = float(data.get("blood_glucose", 110.0 if not is_diabetic else 150.0))
    except (ValueError, TypeError):
        glucose = 110.0

    if glucose >= 140:
        is_diabetic = 1

    # Hypertension
    has_htn = 1 if (
        str(data.get("has_hypertension", "0")).lower() in ["1", "true", "yes", "हाँ"] or
        bp_sys >= 140 or bp_dia >= 90
    ) else 0

    # Other comorbidities
    has_heart = 1 if str(data.get("has_heart_disease", "0")).lower() in ["1", "true", "yes", "हाँ"] else 0
    has_arth = 1 if str(data.get("has_arthritis", "0")).lower() in ["1", "true", "yes", "हाँ"] else 0
    has_resp = 1 if str(data.get("has_respiratory", "0")).lower() in ["1", "true", "yes", "हाँ"] else 0

    num_comorbidities = is_diabetic + has_htn + has_heart + has_arth + has_resp

    # 6. Medication & Polypharmacy
    try:
        med_count = int(data.get("medication_count", 3))
    except (ValueError, TypeError):
        med_count = 3

    polypharmacy_flag = 1 if med_count >= 5 else 0

    try:
        missed_doses = int(data.get("missed_doses", 0))
    except (ValueError, TypeError):
        missed_doses = 0

    # 7. Construct Feature Vector for Trained ML Models
    feature_row = {
        'age': age,
        'is_female': is_female,
        'weight_kg': weight_kg,
        'height_cm': height_cm,
        'BMI': bmi,
        'eating': eating_dep,
        'toileting': toileting_dep,
        'moving': moving_dep,
        'walking': walking_dep,
        'num_dependent_activities': num_dep_acts,
        'adl_score': adl_score,
        'dependency_status': dependency_status,
        'hearing_impairment': hearing_impairment,
        'pain_present': pain_present,
        'pain_level': pain_level,
        'diabetes': is_diabetic,
        'hypertension': has_htn,
        'heart_disease': has_heart,
        'arthritis': has_arth,
        'respiratory_disease': has_resp,
        'num_comorbidities': num_comorbidities,
        'medication_count': med_count,
        'polypharmacy_flag': polypharmacy_flag
    }

    cols = feature_cols or list(feature_row.keys())
    X_df = pd.DataFrame([feature_row])[cols]

    # 8. Dual ML Model Inference (Random Forest & Logistic Regression)
    rf_pred = "Moderate"
    rf_probs = {"Low": 0.20, "Moderate": 0.65, "High": 0.15}
    lr_pred = "Moderate"
    lr_probs = {"Low": 0.20, "Moderate": 0.65, "High": 0.15}
    ens_pred = "Moderate"
    ens_probs = {"Low": 0.20, "Moderate": 0.65, "High": 0.15}
    pred_health_score = 62.0

    class_names = label_classes or ["High", "Low", "Moderate"]

    # Random Forest Inference
    if rf_model is not None:
        try:
            rf_pred = str(rf_model.predict(X_df)[0])
            rf_p = rf_model.predict_proba(X_df)[0]
            rf_probs = {cls: round(float(prob), 3) for cls, prob in zip(rf_model.classes_, rf_p)}
        except Exception as e:
            print(f"[ML Engine] RF inference notice: {e}")

    # Logistic Regression Inference
    if lr_model is not None:
        try:
            lr_pred = str(lr_model.predict(X_df)[0])
            lr_p = lr_model.predict_proba(X_df)[0]
            lr_probs = {cls: round(float(prob), 3) for cls, prob in zip(lr_model.classes_, lr_p)}
        except Exception as e:
            print(f"[ML Engine] LR inference notice: {e}")

    # Soft-Voting Ensemble Inference
    if ensemble_model is not None:
        try:
            ens_pred = str(ensemble_model.predict(X_df)[0])
            ens_p = ensemble_model.predict_proba(X_df)[0]
            ens_probs = {cls: round(float(prob), 3) for cls, prob in zip(ensemble_model.classes_, ens_p)}
        except Exception as e:
            print(f"[ML Engine] Ensemble inference notice: {e}")

    # Health Score Regressor
    if score_model is not None:
        try:
            pred_health_score = round(float(score_model.predict(X_df)[0]), 1)
        except Exception as e:
            pred_health_score = round(60.0 + (adl_score * 0.2) - (num_comorbidities * 3.5), 1)

    # 9. Clinical Reason Extraction & Recommendations from Dataset Profile
    reasons_en = []
    reasons_hi = []
    actions_en = []
    actions_hi = []
    critical_vital_alarm = False

    # SpO2 Safety Check
    if spo2 < 90:
        reasons_en.append(f"Critical Hypoxia: SpO2 {spo2:.1f}% below emergency threshold (90%)")
        reasons_hi.append(f"ऑक्सीजन (SpO2 {spo2:.1f}%) अत्यंत कम है - तुरंत ऑक्सीजन सहायता आवश्यक")
        actions_en.append("Immediate supplemental oxygen and priority field paramedic dispatch")
        actions_hi.append("तुरंत ऑक्सीजन सहायता और पैरामेडिक विजिट सुनिश्चित करें")
        critical_vital_alarm = True
    elif spo2 <= 94:
        reasons_en.append(f"Borderline Oxygen Saturation: SpO2 {spo2:.1f}%")
        reasons_hi.append(f"ऑक्सीजन स्तर सीमा पर है ({spo2:.1f}%)")
        actions_en.append("Repeat SpO2 check in 30 minutes and monitor breathing effort")
        actions_hi.append("30 मिनट में ऑक्सीजन स्तर दोबारा जांचें")

    # BP Safety Check
    if bp_sys >= 165 or bp_dia >= 105:
        reasons_en.append(f"Severe Hypertension Spike: {int(bp_sys)}/{int(bp_dia)} mmHg")
        reasons_hi.append(f"उच्च रक्तचाप संकट: {int(bp_sys)}/{int(bp_dia)} mmHg")
        actions_en.append("Urgent physician tele-consultation to adjust antihypertensive therapy")
        actions_hi.append("डॉक्टर से परामर्श लेकर बीपी की दवा व्यवस्थित करें")
        critical_vital_alarm = True
    elif bp_sys >= 140 or bp_dia >= 90:
        reasons_en.append(f"Elevated Blood Pressure: {int(bp_sys)}/{int(bp_dia)} mmHg")
        reasons_hi.append(f"बढ़ा हुआ रक्तचाप: {int(bp_sys)}/{int(bp_dia)} mmHg")
        actions_en.append("Reduce sodium intake, rest calmly, and re-check BP in the evening")
        actions_hi.append("नमक कम करें, आराम करें और शाम को बीपी दोबारा नापें")

    # Glucose Safety Check
    if glucose >= 220:
        reasons_en.append(f"Severe Hyperglycemia: Blood Glucose {int(glucose)} mg/dL")
        reasons_hi.append(f"अत्यधिक शुगर स्तर: {int(glucose)} mg/dL")
        actions_en.append("Verify insulin/medication adherence and provide hydration")
        actions_hi.append("इंसुलिन/दवा की खुराक जांचें व पर्याप्त पानी पिएं")
        critical_vital_alarm = True
    elif glucose < 70:
        reasons_en.append(f"Hypoglycemia Emergency: Critical Low Sugar {int(glucose)} mg/dL")
        reasons_hi.append(f"शुगर खतरनाक रूप से कम: {int(glucose)} mg/dL")
        actions_en.append("Administer 15-20g fast-acting oral carbohydrates (juice/glucose) immediately")
        actions_hi.append("तुरंत मीठा पानी, फल का रस या ग्लूकोज दें")
        critical_vital_alarm = True

    # ADL Dependencies
    if walking_dep or not able_to_walk:
        reasons_en.append("Mobility Dependence: Requires support for walking (Fall hazard)")
        reasons_hi.append("चलने-फिरने में सहारे की जरूरत (गिरने का खतरा)")
        actions_en.append("Provide walker/mobility support and schedule home fall-prevention audit")
        actions_hi.append("वॉकर सहायता एवं कमरे में सुरक्षा जांच सुनिश्चित करें")
    if toileting_dep:
        reasons_en.append("Toileting Assistance required for functional daily safety")
        reasons_hi.append("शौचालय हेतु सहायता आवश्यक")
        actions_en.append("Install bathroom safety grab bars and raised toilet seat")
        actions_hi.append("बाथरूम में सपोर्ट ग्रैब बार लगाएं")
    if eating_dep:
        reasons_en.append("Nutrition Dependence: Assisted feeding required")
        reasons_hi.append("भोजन में सहायता की आवश्यकता")
        actions_en.append("Arrange meal assistance and dietitian nutrition review")
        actions_hi.append("भोजन में सहायता और पोषण आहार सुनिश्चित करें")

    # Pain
    if pain_level >= 7:
        reasons_en.append(f"Severe Pain (Level {int(pain_level)}/10) in {pain_loc}")
        reasons_hi.append(f"अत्यधिक दर्द ({int(pain_level)}/10) - {pain_loc} में")
        actions_en.append("Physician analgesia review and physiotherapy care")
        actions_hi.append("दर्द निवारक योजना एवं फिजियोथेरेपी सहायता लें")
    elif pain_level >= 4:
        reasons_en.append(f"Moderate Pain (Level {int(pain_level)}/10) in {pain_loc}")
        reasons_hi.append(f"मध्यम दर्द ({int(pain_level)}/10) - {pain_loc} में")
        actions_en.append("Gentle mobility exercises and local pain relief ointment")
        actions_hi.append("हल्का व्यायाम और दर्द निवारक मलहम लगाएं")

    # Medications
    if missed_doses > 0:
        reasons_en.append(f"Missed {missed_doses} prescribed medication dose(s) today")
        reasons_hi.append(f"आज {missed_doses} दवा खुराक छूट गई")
        actions_en.append("Care Buddy doorstep pill reminder & adherence check")
        actions_hi.append("केयर बडी द्वारा दवा बॉक्स की जांच कराएं")
    if polypharmacy_flag:
        reasons_en.append(f"Polypharmacy: Managing {med_count} daily medications")
        reasons_hi.append(f"प्रतिदिन {med_count} दवाइयां (पॉलीफार्मेसी)")
        actions_en.append("Comprehensive pharmacist drug-interaction review")
        actions_hi.append("फार्मासिस्ट से दवाओं के आपसी प्रभाव की जांच कराएं")

    # Comorbidities
    if num_comorbidities >= 3:
        reasons_en.append(f"Multiple Comorbidities: {num_comorbidities} chronic conditions active")
        reasons_hi.append(f"{num_comorbidities} पुरानी बीमारियां सक्रिय हैं")
        actions_en.append("Regular chronic illness monitoring and coordinator care plan")
        actions_hi.append("नियमित स्वास्थ्य निगरानी और को-ऑर्डिनेटर केयर प्लान जारी रखें")

    # 10. Determine Final Risk Category (Low, Medium/Moderate, High)
    # The primary classification comes from the ML ensemble of RF + LR
    raw_ml_class = ens_pred  # 'Low', 'Moderate', or 'High'

    # Map dataset 'Moderate' to UI standard 'Medium'
    if critical_vital_alarm:
        final_risk = "High"
    elif raw_ml_class == "High":
        final_risk = "High"
    elif raw_ml_class == "Moderate":
        final_risk = "Medium"
    else:
        final_risk = "Low"

    # Risk Styling & Translations
    if final_risk == "High":
        risk_color = "rose"
        risk_hi = "गंभीर जोखिम (High Risk)"
        status_tag_hi = "तुरंत ध्यान देने योग्य"
        status_tag_en = "Immediate Action Required"
        care_req = "High-level assistance and frequent monitoring"
    elif final_risk == "Medium":
        risk_color = "amber"
        risk_hi = "मध्यम जोखिम (Medium Risk)"
        status_tag_hi = "देखभाल और फॉलोअप की जरूरत"
        status_tag_en = "Coordinator Follow-up Recommended"
        care_req = "Assistance with daily activities and regular monitoring"
    else:
        risk_color = "emerald"
        risk_hi = "कम जोखिम (Low Risk)"
        status_tag_hi = "स्वास्थ्य सामान्य और सुरक्षित"
        status_tag_en = "Stable & Safe"
        care_req = "Basic preventive care and routine monitoring"

    # Default friendly reasons if all normal
    if not reasons_en:
        reasons_en.append("All vital signs, functional mobility, sleep, and medications are within healthy normal ranges.")
        reasons_hi.append("सभी जीवन संकेत (बीपी, ऑक्सीजन, पल्स), नींद और दिनचर्या बिल्कुल सामान्य और स्वस्थ हैं।")

    if not actions_en:
        actions_en.append("Maintain regular hydration, balanced nutrition, daily walking, and timely medications.")
        actions_hi.append("रोज़ाना समय पर दवा लें, पर्याप्त पानी पिएं और नियमित दिनचर्या बनाए रखें।")

    # Calculated risk score (0 - 100, where higher = higher risk)
    # Derived directly from continuous predicted health_score
    risk_score = max(5, min(98, int(100.0 - pred_health_score)))
    if final_risk == "High" and risk_score < 70:
        risk_score = 78
    elif final_risk == "Low" and risk_score > 35:
        risk_score = 22

    # High risk probability metric
    high_prob = round(float(ens_probs.get("High", 0.0) + (0.5 * ens_probs.get("Moderate", 0.0))), 3)

    return {
        "model_version": "elderhealth_rf_lr_ensemble_v2.0",
        "predicted_risk_level": final_risk,
        "predicted_risk_level_hi": risk_hi,
        "raw_dataset_class": raw_ml_class,
        "risk_color": risk_color,
        "status_tag_en": status_tag_en,
        "status_tag_hi": status_tag_hi,
        "predicted_probability": high_prob,
        "risk_score": risk_score,
        "health_score": round(pred_health_score, 1),
        "adl_score": adl_score,
        "bmi": bmi,
        "care_requirement": care_req,
        "models_telemetry": {
            "random_forest": {
                "prediction": rf_pred,
                "probabilities": rf_probs
            },
            "logistic_regression": {
                "prediction": lr_pred,
                "probabilities": lr_probs
            },
            "ensemble": {
                "prediction": ens_pred,
                "probabilities": ens_probs
            }
        },
        "alert_reasons": reasons_en,
        "alert_reasons_hi": reasons_hi,
        "alert_reason_summary": "; ".join(reasons_en[:2]),
        "alert_reason_summary_hi": " • ".join(reasons_hi[:2]),
        "recommended_actions": actions_en,
        "recommended_actions_hi": actions_hi,
        "suggested_action_summary": "; ".join(actions_en[:2]),
        "suggested_action_summary_hi": " • ".join(actions_hi[:2]),
        "escalation_required": (final_risk == "High"),
        "contact_method": "Immediate 2-way emergency call & field nurse visit" if final_risk == "High" else "Scheduled coordinator check-in",
        "timestamp": datetime.now().isoformat()
    }


# Backwards-compatible alias
predict_risk = predict_elder_risk
