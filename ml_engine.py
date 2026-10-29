"""
CareConnect - Machine Learning Risk Assessment Engine
Trained on ApnaSa Diverse Seniors Multi-Parameter Dataset (90,000 records)
Predicts Elder Risk Condition: Low, Medium, High
"""

import os
import joblib
import pandas as pd
import numpy as np

# Load trained model artifacts
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "ml_model", "elder_risk_rf_model.pkl")
FEATURES_PATH = os.path.join(BASE_DIR, "ml_model", "feature_cols.pkl")

clf = None
feature_cols = None

def load_model():
    global clf, feature_cols
    if clf is None:
        if os.path.exists(MODEL_PATH) and os.path.exists(FEATURES_PATH):
            clf = joblib.load(MODEL_PATH)
            feature_cols = joblib.load(FEATURES_PATH)
            print(f"[ML Engine] Loaded Random Forest model with {len(feature_cols)} features.")
        else:
            print("[ML Engine] Model file not found, will load fallback heuristic.")

# Initialize on load
try:
    load_model()
except Exception as e:
    print(f"[ML Engine] Initialization error: {e}")


def predict_elder_risk(data):
    """
    Evaluates elder assessment inputs using both Random Forest ML inference
    and clinical triage guidelines.
    Returns structured risk prediction with reasons and recommendations.
    """
    load_model()
    
    # 1. Parse & normalize inputs
    try:
        age = float(data.get("age", 74))
    except (ValueError, TypeError):
        age = 74.0

    gender_str = str(data.get("gender", "Female")).strip().lower()
    is_female = 1 if gender_str in ["female", "f", "woman", "महिला"] else 0

    try:
        weight_kg = float(data.get("weight_kg", 65.0))
    except (ValueError, TypeError):
        weight_kg = 65.0

    try:
        height_cm = float(data.get("height_cm", 162.0))
    except (ValueError, TypeError):
        height_cm = 162.0

    bmi = round(weight_kg / ((height_cm / 100) ** 2), 1) if height_cm > 40 else 24.0

    try:
        sleep_hours = float(data.get("sleep_hours", 7.0))
    except (ValueError, TypeError):
        sleep_hours = 7.0

    # Vitals
    try:
        bp_sys = float(data.get("bp_systolic", 125.0))
    except (ValueError, TypeError):
        bp_sys = 125.0

    try:
        bp_dia = float(data.get("bp_diastolic", 80.0))
    except (ValueError, TypeError):
        bp_dia = 80.0

    try:
        hr = float(data.get("heart_rate", 75.0))
    except (ValueError, TypeError):
        hr = 75.0

    try:
        spo2 = float(data.get("spo2", 98.0))
    except (ValueError, TypeError):
        spo2 = 98.0

    # Diabetes & Sugar
    is_diabetic = 1 if str(data.get("is_diabetic", "0")).lower() in ["1", "true", "yes", "हाँ"] else 0
    try:
        blood_glucose = float(data.get("blood_glucose", 110.0 if not is_diabetic else 165.0))
    except (ValueError, TypeError):
        blood_glucose = 110.0 if not is_diabetic else 165.0

    # Pain
    try:
        pain_level = float(data.get("pain_level", 0.0))
    except (ValueError, TypeError):
        pain_level = 0.0

    pain_present = 1 if (str(data.get("pain_present", "0")).lower() in ["1", "true", "yes", "हाँ"] or pain_level > 0) else 0
    pain_location = str(data.get("pain_location", "None")).strip()
    if not pain_location or pain_location.lower() == "none":
        pain_location = "Joints / Body" if pain_level > 0 else "None"

    # Medication
    try:
        med_count = int(data.get("medication_count", 3))
    except (ValueError, TypeError):
        med_count = 3

    try:
        missed_doses = int(data.get("missed_doses", 0))
    except (ValueError, TypeError):
        missed_doses = 0

    # ADL Independence
    walking_indep = 1 if str(data.get("walking_independent", "1")).lower() in ["1", "true", "yes", "independent", "हाँ"] else 0
    eating_indep = 1 if str(data.get("eating_independent", "1")).lower() in ["1", "true", "yes", "independent", "हाँ"] else 0
    moving_indep = 1 if str(data.get("moving_independent", "1")).lower() in ["1", "true", "yes", "independent", "हाँ"] else 0
    toileting_indep = 1 if str(data.get("toileting_independent", "1")).lower() in ["1", "true", "yes", "independent", "हाँ"] else 0
    able_to_walk = 1 if str(data.get("able_to_walk_independently", str(walking_indep))).lower() in ["1", "true", "yes", "independent", "हाँ"] else 0

    adl_score = (eating_indep + toileting_indep + moving_indep + walking_indep + able_to_walk + (1 if pain_level < 5 else 0))

    # Chronic conditions
    diseases = data.get("diseases", [])
    if isinstance(diseases, str):
        diseases = [d.strip() for d in diseases.split(",") if d.strip()]

    has_htn = 1 if (bp_sys >= 140 or "hypertension" in str(diseases).lower() or data.get("has_hypertension")) else 0
    has_arthritis = 1 if ("arthritis" in str(diseases).lower() or "osteoarthritis" in str(diseases).lower() or data.get("has_arthritis")) else 0
    has_heart = 1 if ("heart" in str(diseases).lower() or "cardiac" in str(diseases).lower() or data.get("has_heart_disease")) else 0

    # Hearing
    hearing_diff = 1 if (str(data.get("hearing_difficulty", "0")).lower() in ["1", "true", "yes", "impaired", "हाँ"] or "hearing" in str(data.get("hearing_status", "")).lower()) else 0
    hearing_aid = 1 if (str(data.get("hearing_aid_used", "0")).lower() in ["1", "true", "yes", "हाँ"]) else 0

    # 2. ML Model Prediction
    ml_prob = 0.05
    if clf is not None and feature_cols is not None:
        try:
            row = {
                'age': age,
                'is_female': is_female,
                'weight_kg': weight_kg,
                'sleep_hours': sleep_hours,
                'bp_systolic_mmhg': bp_sys,
                'bp_diastolic_mmhg': bp_dia,
                'heart_rate_bpm': hr,
                'spo2_percent': spo2,
                'blood_glucose_mg_dl': blood_glucose,
                'pain_level_0_to_10': pain_level,
                'pain_mentioned': pain_present,
                'missed_doses_reported': missed_doses,
                'medication_count': med_count,
                'eating_independent': eating_indep,
                'toileting_independent': toileting_indep,
                'moving_independent': moving_indep,
                'walking_independent': walking_indep,
                'able_to_walk_independently': able_to_walk,
                'adl_score_synthetic_0_to_6': adl_score,
                'diabetes_reported': is_diabetic,
                'hypertension_reported': has_htn,
                'osteoarthritis_reported': has_arthritis,
                'hearing_difficulty_reported': hearing_diff,
                'hearing_aid_used_reported': hearing_aid
            }
            df_row = pd.DataFrame([row])[feature_cols]
            ml_prob = float(clf.predict_proba(df_row)[0, 1])
        except Exception as e:
            print(f"[ML Engine] Inference warning: {e}")
            ml_prob = 0.30

    # 3. Clinical Rule Triage & Factor Explanations
    reasons_en = []
    reasons_hi = []
    actions_en = []
    actions_hi = []
    risk_points = 0
    critical_vital_alarm = False

    # Oxygen Saturation SpO2
    if spo2 < 90:
        reasons_en.append(f"Critical Hypoxia: SpO2 {spo2:.1f}% is below emergency threshold (90%)")
        reasons_hi.append(f"ऑक्सीजन (SpO2 {spo2:.1f}%) अत्यंत कम है - तुरंत ऑक्सीजन की आवश्यकता")
        actions_en.append("Immediate supplemental oxygen and priority paramedic dispatch")
        actions_hi.append("तुरंत आपातकालीन पैरामेडिक व ऑक्सीजन सहायता भेजें")
        risk_points += 45
        critical_vital_alarm = True
    elif spo2 <= 94:
        reasons_en.append(f"Borderline Oxygen Saturation: SpO2 {spo2:.1f}%")
        reasons_hi.append(f"ऑक्सीजन स्तर सीमा पर है ({spo2:.1f}%) - निगरानी आवश्यक")
        actions_en.append("Repeat SpO2 check in 30 minutes and monitor breathing effort")
        actions_hi.append("30 मिनट में ऑक्सीजन स्तर दोबारा जांचें")
        risk_points += 15

    # Blood Pressure
    if bp_sys >= 160 or bp_dia >= 100:
        reasons_en.append(f"Severe Hypertension Alert: {int(bp_sys)}/{int(bp_dia)} mmHg")
        reasons_hi.append(f"उच्च रक्तचाप संकट: {int(bp_sys)}/{int(bp_dia)} mmHg")
        actions_en.append("Urgent physician tele-consultation to adjust antihypertensive regimen")
        actions_hi.append("डॉक्टर से तुरंत परामर्श लेकर बीपी की दवा व्यवस्थित करें")
        risk_points += 30
        critical_vital_alarm = True
    elif bp_sys >= 140 or bp_dia >= 90:
        reasons_en.append(f"Elevated Blood Pressure: {int(bp_sys)}/{int(bp_dia)} mmHg")
        reasons_hi.append(f"बढ़ा हुआ रक्तचाप: {int(bp_sys)}/{int(bp_dia)} mmHg")
        actions_en.append("Reduce sodium intake, rest calmly, and re-check BP in the evening")
        actions_hi.append("नमक कम करें, आराम करें और शाम को बीपी दोबारा नापें")
        risk_points += 15
    elif bp_sys < 95:
        reasons_en.append(f"Hypotension Warning: Low blood pressure ({int(bp_sys)}/{int(bp_dia)} mmHg)")
        reasons_hi.append(f"कम रक्तचाप (लो बीपी): {int(bp_sys)}/{int(bp_dia)} mmHg")
        actions_en.append("Increase oral electrolyte fluids and monitor for postural dizziness")
        actions_hi.append("ओआरएस या पानी का सेवन बढ़ाएं और चक्कर आने पर ध्यान दें")
        risk_points += 20

    # Heart Rate
    if hr > 110:
        reasons_en.append(f"Tachycardia Spike: Resting Heart Rate {int(hr)} bpm")
        reasons_hi.append(f"दिल की धड़कन तेज है: {int(hr)} bpm")
        actions_en.append("Perform 12-lead ECG review and field nurse doorstep triage")
        actions_hi.append("ईसीजी जांच और नर्स द्वारा व्यक्तिगत जांच कराएं")
        risk_points += 25
    elif hr < 52:
        reasons_en.append(f"Bradycardia Warning: Low Heart Rate {int(hr)} bpm")
        reasons_hi.append(f"दिल की धड़कन धीमी है: {int(hr)} bpm")
        actions_en.append("Review cardiac and beta-blocker medications with cardiologist")
        actions_hi.append("हृदय विशेषज्ञ से दवाओं की समीक्षा कराएं")
        risk_points += 20

    # Blood Glucose
    if is_diabetic or blood_glucose > 140:
        if blood_glucose >= 220:
            reasons_en.append(f"Severe Hyperglycemia: Blood Glucose {int(blood_glucose)} mg/dL")
            reasons_hi.append(f"अत्यधिक शुगर स्तर: {int(blood_glucose)} mg/dL")
            actions_en.append("Immediate insulin/medication verification and urine ketone check")
            actions_hi.append("इंसुलिन/दवा की खुराक जांचें व पर्याप्त पानी पिएं")
            risk_points += 30
            critical_vital_alarm = True
        elif blood_glucose >= 160:
            reasons_en.append(f"Elevated Sugar Reading: {int(blood_glucose)} mg/dL")
            reasons_hi.append(f"शुगर स्तर सामान्य से अधिक: {int(blood_glucose)} mg/dL")
            actions_en.append("Monitor post-meal blood sugar and regulate carbohydrate intake")
            actions_hi.append("भोजन के बाद का शुगर नापें और मीठे से परहेज करें")
            risk_points += 15
        elif blood_glucose < 70:
            reasons_en.append(f"Hypoglycemia Emergency: Critical Low Sugar {int(blood_glucose)} mg/dL")
            reasons_hi.append(f"शुगर खतरनाक रूप से कम: {int(blood_glucose)} mg/dL (हाइपोग्लाइसीमिया)")
            actions_en.append("Administer 15-20g fast-acting oral carbohydrates (juice/glucose) immediately")
            actions_hi.append("तुरंत मीठा पानी, फल का रस या ग्लूकोज दें")
            risk_points += 40
            critical_vital_alarm = True

    # Pain
    if pain_level >= 7:
        reasons_en.append(f"Severe Pain (Level {int(pain_level)}/10) reported in {pain_location}")
        reasons_hi.append(f"अत्यधिक दर्द ({int(pain_level)}/10) - {pain_location} में")
        actions_en.append("Physician analgesia review and cold/warm compress relief")
        actions_hi.append("दर्द निवारक योजना एवं फिजियोथेरेपी सहायता लें")
        risk_points += 25
    elif pain_level >= 4:
        reasons_en.append(f"Moderate Pain (Level {int(pain_level)}/10) in {pain_location}")
        reasons_hi.append(f"मध्यम दर्द ({int(pain_level)}/10) - {pain_location} में")
        actions_en.append("Gentle mobility exercises and local pain relief ointment")
        actions_hi.append("हल्का व्यायाम और दर्द निवारक मलहम लगाएं")
        risk_points += 10

    # Functional Independence / ADLs
    if not able_to_walk or not walking_indep:
        reasons_en.append("Mobility Dependence: Unable to walk independently (High fall hazard)")
        reasons_hi.append("चलने-फिरने में असमर्थ या सहारे की जरूरत (गिरने का खतरा)")
        actions_en.append("Supply walking frame/wheelchair and conduct home fall-prevention audit")
        actions_hi.append("वॉकर या व्हीलचेयर सहायता एवं कमरे में सुरक्षा जांच कराएं")
        risk_points += 25
    if not eating_indep:
        reasons_en.append("Nutrition Assistance: Dependent on caregiver for meals")
        reasons_hi.append("खाना खाने के लिए दूसरे पर निर्भर")
        actions_en.append("Arrange meal assistance and dietary intake monitoring")
        actions_hi.append("भोजन में सहायता और पोषण आहार सुनिश्चित करें")
        risk_points += 20
    if not toileting_indep:
        reasons_en.append("Toileting Dependence: Requires personal assistance")
        reasons_hi.append("शौचालय हेतु सहायता आवश्यक")
        risk_points += 15

    # Medication Adherence
    if missed_doses > 0:
        reasons_en.append(f"Medication Adherence Gap: Missed {missed_doses} dose(s) today")
        reasons_hi.append(f"दवा नहीं ली: आज {missed_doses} खुराक छूट गई")
        actions_en.append("Care Buddy doorstep visit to verify pill organizer & supervise dosage")
        actions_hi.append("केयर बडी द्वारा दवा बॉक्स की जांच और दवा लेना सुनिश्चित करें")
        risk_points += 20

    if med_count >= 5:
        reasons_en.append(f"Polypharmacy Risk: Taking {med_count} daily medications")
        reasons_hi.append(f"दवाओं का अधिक बोझ: प्रतिदिन {med_count} दवाइयां")
        actions_en.append("Schedule comprehensive clinical pharmacist prescription review")
        actions_hi.append("फार्मासिस्ट से सभी दवाओं के आपसी प्रभाव की समीक्षा कराएं")
        risk_points += 10

    # Sleep
    if sleep_hours < 4.5:
        reasons_en.append(f"Severe Sleep Deficit: Only {sleep_hours:.1f} hours of sleep")
        reasons_hi.append(f"नींद की कमी: रात में केवल {sleep_hours:.1f} घंटे सोए")
        actions_en.append("Sleep hygiene counseling and daytime resting schedule")
        actions_hi.append("नींद का रूटीन सुधारें व दिन में आराम करें")
        risk_points += 15
    elif sleep_hours > 11:
        reasons_en.append(f"Excessive Daytime Lethargy / Hypersomnia ({sleep_hours:.1f} hrs)")
        reasons_hi.append(f"अत्यधिक सुस्ती व ज्यादा सोना ({sleep_hours:.1f} घंटे)")
        risk_points += 10

    # Hearing
    if hearing_diff:
        reasons_en.append("Hearing Impairment reported: Audio accessibility support required")
        reasons_hi.append("सुनने में परेशानी: तेज आवाज़ या श्रवण यंत्र की आवश्यकता")
        actions_en.append("Configure phone on loud speakerphone and enable visual alert notifications")
        actions_hi.append("फोन को लाउडस्पीकर पर रखें और स्क्रीन अलर्ट चालू करें")
        risk_points += 5

    # 4. Final Risk Category Classification (Low, Medium, High)
    combined_score = min(100, int(ml_prob * 50 + (risk_points / 130.0) * 50))
    
    if critical_vital_alarm or risk_points >= 55 or ml_prob >= 0.62 or combined_score >= 60:
        risk_level = "High"
        risk_color = "rose"
        risk_hi = "गंभीर जोखिम (High Risk)"
        status_tag_hi = "तुरंत ध्यान देने योग्य"
        status_tag_en = "Immediate Action Required"
    elif risk_points >= 18 or ml_prob >= 0.20 or combined_score >= 28:
        risk_level = "Medium"
        risk_color = "amber"
        risk_hi = "मध्यम जोखिम (Medium Risk)"
        status_tag_hi = "देखभाल और फॉलोअप की जरूरत"
        status_tag_en = "Coordinator Follow-up Recommended"
    else:
        risk_level = "Low"
        risk_color = "emerald"
        risk_hi = "कम जोखिम (Low Risk)"
        status_tag_hi = "स्वास्थ्य सामान्य और सुरक्षित"
        status_tag_en = "Stable & Safe"

    if not reasons_en:
        reasons_en.append("All vital signs, mobility, sleep, and medication adherence are within healthy normal ranges.")
        reasons_hi.append("सभी जीवन संकेत (बीपी, ऑक्सीजन, पल्स), नींद और दिनचर्या बिल्कुल सामान्य और स्वस्थ हैं।")

    if not actions_en:
        actions_en.append("Maintain regular hydration, balanced nutrition, daily walking, and timely medications.")
        actions_hi.append("रोज़ाना समय पर दवा लें, पर्याप्त पानी पिएं और नियमित दिनचर्या बनाए रखें।")

    # Follow-up template conforming structure
    return {
        "model_version": "apnasa_v3_rf_triage_v1.0",
        "predicted_risk_level": risk_level,
        "predicted_risk_level_hi": risk_hi,
        "risk_color": risk_color,
        "status_tag_en": status_tag_en,
        "status_tag_hi": status_tag_hi,
        "predicted_probability": round(ml_prob, 3),
        "risk_score": combined_score,
        "bmi": bmi,
        "alert_reasons": reasons_en,
        "alert_reasons_hi": reasons_hi,
        "alert_reason_summary": "; ".join(reasons_en[:2]),
        "alert_reason_summary_hi": " • ".join(reasons_hi[:2]),
        "recommended_actions": actions_en,
        "recommended_actions_hi": actions_hi,
        "suggested_action_summary": "; ".join(actions_en[:2]),
        "suggested_action_summary_hi": " • ".join(actions_hi[:2]),
        "escalation_required": (risk_level == "High"),
        "contact_method": "Immediate 2-way call & field visit" if risk_level == "High" else "Daily coordinator check-in",
        "timestamp": pd.Timestamp.now().isoformat()
    }
