"""
Bilingual (Hindi / English / Hinglish) Clinical Speech & NLP Entity Extractor for CareConnect.
Extracts Geriatric Demographics, Vital Signs (BP, Pulse, SpO2), Pain Profile with deep synonym support,
Sleep Hours, 4 Core ADL Domains (Walking, Eating, Moving, Toileting), Medications,
Diabetes & Blood Sugar, Hearing Level, and Chronic Diseases.
Maintains persistent conversational context across multi-turn voice intakes,
and formulates voice assistant prompts in Hindi and English.
"""

import re
import os

NUM_WORDS = {
    "shunya": 0.0, "zero": 0.0, "sunya": 0.0,
    "ek": 1.0, "one": 1.0,
    "do": 2.0, "two": 2.0,
    "teen": 3.0, "tin": 3.0, "three": 3.0,
    "chaar": 4.0, "char": 4.0, "four": 4.0,
    "paanch": 5.0, "panch": 5.0, "five": 5.0,
    "chhah": 6.0, "chhe": 6.0, "che": 6.0, "six": 6.0,
    "saat": 7.0, "sat": 7.0, "seven": 7.0,
    "aath": 8.0, "ath": 8.0, "eight": 8.0,
    "nau": 9.0, "no": 9.0, "nine": 9.0,
    "das": 10.0, "dus": 10.0, "ten": 10.0
}

PAIN_POSITIVE_TERMS = [
    "dard", "peeda", "kasht", "takleef", "taklif", "chot", "jalan", "jakdan", 
    "marod", "soojan", "sujan", "dukh", "dukhna", "dukh raha", "dukh rahi", "dukhta", 
    "dukhti", "kheenchaav", "spasm", "stiffness", "shool", "vedna", "chubhan", "aahat", 
    "ache", "aching", "aches", "pain", "painful", "hurt", "hurting", "hurts", "sore", 
    "soreness", "throbbing", "tender", "tenderness", "cramp", "cramps", "cramping", 
    "agony", "discomfort", "suffering", "stabbing", "stiff", "swollen", "burning", 
    "chubh raha", "jalan ho rahi", "jalan rehti", "kharash", "kashtdayak"
]

PAIN_NEGATIVE_TERMS = [
    "dard nahi", "dard nhi", "koi dard nahi", "koi dard nhi", "pain free", "no pain", 
    "dard bilkul nahi", "dard bilkul nhi", "kuch nahi dukh raha", "kuch nhi dukh raha", 
    "koi takleef nahi", "koi taklif nahi", "koi dikkat nahi", "bilkul theek", "no ache", 
    "no aches", "no hurt", "not hurting", "zero pain", "no discomfort", "dard mukt", 
    "swasth", "fine", "dard vagerah nahi", "dukh nahi raha", "dard se mukt", "no body pain"
]

def extract_clinical_entities_from_text(text: str, lang_hint: str = "auto", current_entities: dict = None) -> dict:
    t = (text or "").strip()
    low = t.lower()

    # Pre-populate with previous accumulated state so multi-turn inputs persist
    extracted = dict(current_entities or {})
    missing_fields = []

    # 1. Age Extraction
    # Matches: "74 saal", "74 years", "umar 74", "age 74", "age is 75", "umer 76", "meri umar 74", "umar 78 kar do"
    age_match = re.search(
        r'(?:(?:(?:meri\s+)?(?:age|umar|umer|varsh)\s*(?:is|hai|meri)?|i\s*am|i\'m|turned)\s*(\d{2})'
        r'|'
        r'(\d{2})\s*(?:saal|years|year|varsh))',
        low
    )
    if age_match:
        raw_val = age_match.group(1) or age_match.group(2)
        if raw_val:
            try:
                val = int(raw_val)
                if 45 <= val <= 115:
                    extracted['age'] = val
            except (ValueError, TypeError):
                pass

    # 2. Gender
    female_re = r'\b(?:mahila|aurat|female|stree|dadi|nani|she|woman|ladki|mataji|aunty|lady|daadi)\b'
    male_re = r'\b(?:purush|aadmi|male|dada|nana|he|man|ladka|pitaji|uncle|gentleman|daada)\b'
    if re.search(female_re, low):
        extracted['gender'] = 'Female'
    elif re.search(male_re, low):
        extracted['gender'] = 'Male'

    # 3. Weight & Height
    wt_match = re.search(r'(\d{2,3}(?:\.\d+)?)\s*(?:kg|kilo|kilogram|weight|vajan|wazan)', low)
    if not wt_match:
        wt_match = re.search(r'(?:weight|vajan|wazan)\s*(?:hai|is)?\s*(\d{2,3}(?:\.\d+)?)', low)
    if wt_match:
        try:
            w_val = float(wt_match.group(1))
            if 30 <= w_val <= 180:
                extracted['weight'] = round(w_val, 1)
        except ValueError:
            pass

    ht_match = re.search(r'(\d{2,3})\s*(?:cm|centimeter|centimetre|height|lambaai|lambai)', low)
    if not ht_match:
        ht_match = re.search(r'(?:height|lambaai|lambai)\s*(?:hai|is)?\s*(\d{2,3})', low)
    if ht_match:
        try:
            h_val = float(ht_match.group(1))
            if 100 <= h_val <= 220:
                extracted['height'] = round(h_val, 1)
        except ValueError:
            pass

    # 4. Blood Pressure (Systolic & Diastolic)
    # Matches: "BP 140 90", "140/90", "140 by 90", "140 aur 90", "BP 130 over 85", "raktchap 120"
    bp_match = re.search(r'(?:bp|blood\s*pressure|raktchap)?\s*(\d{2,3})\s*(?:/|by|over|aur|and|-|\s+)\s*(\d{2,3})', low)
    if bp_match:
        try:
            sys_val = int(bp_match.group(1))
            dia_val = int(bp_match.group(2))
            if 70 <= sys_val <= 240 and 40 <= dia_val <= 140:
                extracted['bp_sys'] = sys_val
                extracted['bp_dia'] = dia_val
        except (ValueError, TypeError):
            pass
    else:
        # Check single systolic or diastolic mentions
        sys_m = re.search(r'(?:systolic|upar\s+ka\s+bp|high\s+bp)\s*(?:hai|is)?\s*(\d{2,3})', low)
        if sys_m:
            try:
                v = int(sys_m.group(1))
                if 70 <= v <= 240:
                    extracted['bp_sys'] = v
            except ValueError:
                pass
        dia_m = re.search(r'(?:diastolic|neeche\s+ka\s+bp|low\s+bp)\s*(?:hai|is)?\s*(\d{2,3})', low)
        if dia_m:
            try:
                v = int(dia_m.group(1))
                if 40 <= v <= 140:
                    extracted['bp_dia'] = v
            except ValueError:
                pass

    # 5. Heart Rate / Pulse
    # Matches: "heart rate 76", "pulse 78", "dhadkan 84", "pulse rate 72"
    hr_match = re.search(r'(?:heart\s*rate|pulse|pulse\s*rate|dhadkan|hr)\s*(?:hai|is)?\s*(\d{2,3})', low)
    if not hr_match:
        hr_match = re.search(r'(\d{2,3})\s*(?:bpm|beats|dhadkan)', low)
    if hr_match:
        try:
            hr_val = int(hr_match.group(1))
            if 40 <= hr_val <= 180:
                extracted['heart_rate'] = hr_val
        except ValueError:
            pass

    # 6. SpO2 / Oxygen
    # Matches: "oxygen 97", "spo2 98", "oxygen level 96", "97 percent oxygen"
    spo2_match = re.search(r'(?:oxygen|spo2|o2|oxygen\s*level)\s*(?:hai|is)?\s*(\d{2,3}(?:\.\d+)?)', low)
    if not spo2_match:
        spo2_match = re.search(r'(\d{2,3}(?:\.\d+)?)\s*(?:%|percent)?\s*(?:oxygen|spo2|o2)', low)
    if spo2_match:
        try:
            sp_val = float(spo2_match.group(1))
            if 70 <= sp_val <= 100:
                extracted['spo2'] = round(sp_val, 1)
        except ValueError:
            pass

    # 7. Pain Profile with Deep Synonym Support
    explicit_no_pain = any(w in low for w in PAIN_NEGATIVE_TERMS)
    has_pain_mention = any(w in low for w in PAIN_POSITIVE_TERMS)

    if explicit_no_pain:
        extracted['pain_present'] = 0
        extracted['pain_level'] = 0.0
        extracted['pain_loc'] = 'None'
    elif has_pain_mention or extracted.get('pain_present') == 1:
        if has_pain_mention:
            extracted['pain_present'] = 1

        # Determine localized site with synonyms
        if any(w in low for w in ["ghutna", "ghutne", "ghutno", "knee", "knees", "patella", "godha", "godhe"]):
            extracted['pain_loc'] = 'Knee'
        elif any(w in low for w in ["kamar", "peeth", "reedh", "spine", "spinal", "back", "lower back", "lumbar", "sciatica", "kamardard"]):
            extracted['pain_loc'] = 'Back'
        elif any(w in low for w in ["kandha", "kandhe", "kandho", "shoulder", "shoulders", "collarbone"]):
            extracted['pain_loc'] = 'Shoulder'
        elif any(w in low for w in ["jod", "jodon", "joint", "joints", "sandhi"]):
            extracted['pain_loc'] = 'Joints'
        elif any(w in low for w in ["chhati", "chest", "seena", "dil"]):
            extracted['pain_loc'] = 'Chest'
        elif any(w in low for w in ["sar", "sir", "head", "headache", "sardard", "gardan", "neck", "haath", "arm", "pair", "leg"]):
            extracted['pain_loc'] = 'Other'
        elif 'pain_loc' not in extracted:
            extracted['pain_loc'] = 'Other'

        # Pain Level: Numerical & Synonym Scales
        pl_match = re.search(r'(?:level|scale|rate|rating|severity|darja|score)\s*[:=]?\s*(\d{1,2}(?:\.\d+)?)', low)
        if not pl_match:
            pl_match = re.search(r'(\d{1,2}(?:\.\d+)?)\s*(?:/10|out of 10|\s*level|\s*darja|\s*scale)', low)
        if not pl_match:
            pl_match = re.search(r'(?:dard|pain|peeda|takleef)\s+(?:hai\s+)?(?:around\s+|lagbhag\s+)?(\d{1,2}(?:\.\d+)?)', low)

        if pl_match:
            try:
                pl_val = float(pl_match.group(1))
                if 1.0 <= pl_val <= 10.0:
                    extracted['pain_level'] = pl_val
            except ValueError:
                pass

        # Hindi/English Number Word check (e.g. "scale saat", "level paanch", "dard char")
        if 'pain_level' not in extracted or has_pain_mention:
            word_num_match = re.search(
                r'(?:level|scale|darja|dard|pain|rating)\s+(?:hai\s+)?(shunya|zero|ek|one|do|two|teen|three|chaar|char|four|paanch|panch|five|chhah|chhe|che|six|saat|sat|seven|aath|ath|eight|nau|nine|das|dus|ten)',
                low
            )
            if word_num_match:
                w_str = word_num_match.group(1)
                if w_str in NUM_WORDS:
                    extracted['pain_level'] = NUM_WORDS[w_str]

        # Qualitative Synonyms for pain
        if has_pain_mention and 'pain_level' not in extracted:
            if any(w in low for w in [
                "bohot zyada", "bahut zyada", "bahut tez", "bohot tez", "bura haal", "severe", 
                "extreme", "unbearable", "asahniya", "bardasht nahi", "bardasht se bahar", 
                "intense", "terrible", "worst", "excruciating", "high pain", "bahot jada", 
                "bahut jyada", "bahut dard", "bohot dard", "killing me", "tez dard"
            ]):
                extracted['pain_level'] = 8.0
            elif any(w in low for w in [
                "moderate", "madhyam", "medium", "theek thaak", "beech ka", "tolerable", 
                "average", "samanya", "thoda bahut", "manageable", "thoda zyada", "moderate pain"
            ]):
                extracted['pain_level'] = 5.0
            elif any(w in low for w in [
                "thoda", "thoda sa", "thodi si", "halka", "halka fulka", "mild", "slight", 
                "low", "kam", "minor", "bearable", "zara sa", "mamooli", "mild pain", "halka dard", "kam dard"
            ]):
                extracted['pain_level'] = 2.5
            elif 'pain_level' not in extracted:
                extracted['pain_level'] = 4.0

    # 8. Sleep Hours
    sleep_match = re.search(r'(\d{1,2}(?:\.\d+)?)\s*(?:ghante|ghanta|hours|hrs|hr)\s*(?:neend|neendh|sleep|soya|soti|sota)', low)
    if not sleep_match:
        sleep_match = re.search(r'(?:neend|neendh|sleep|soya|sota)\s*(?:hai|is)?\s*(\d{1,2}(?:\.\d+)?)\s*(?:ghante|ghanta|hours|hrs)?', low)
    if sleep_match:
        try:
            sl_val = float(sleep_match.group(1))
            if 2.0 <= sl_val <= 16.0:
                extracted['sleep_hours'] = round(sl_val, 1)
        except ValueError:
            pass

    # 9. Daily Living Activities (ADLs)
    # A. Walking (1: Independent, 0: Needs help / wheelchair / unable)
    if any(w in low for w in ["khud chal leta", "apne aap chal", "walk independently", "walk without support", "chalne me koi dikkat nahi", "bina sahare chal", "bina stick chal", "theek chal leta", "chal sakta hu"]):
        extracted['walk'] = 1
    elif any(w in low for w in ["chhadi se", "walker", "sahare se chal", "walk with stick", "need help walking", "walk assist", "stick leke", "lathi", "chhari", "sahara lekar chal", "chal nahi sakta", "wheelchair", "cannot walk", "chalna mushkil"]):
        extracted['walk'] = 0

    # B. Eating (1: Independent, 0: Dependent / Needs help)
    if any(w in low for w in ["khana khud", "apne aap khana", "khana kha leta", "eat independently", "feed myself", "khana khane me koi takleef nahi", "khana kha sakta", "khud khana", "eat myself", "bina madad khana", "khud se khata"]):
        extracted['eat'] = 1
    elif any(w in low for w in ["khana khilane", "khana me madad", "need help eating", "assist eating", "assisted feeding", "khana koi khilata", "khilane me sahara", "cannot eat", "khud nahi kha pata", "khana khilana padta"]):
        extracted['eat'] = 0

    # C. Moving / Transferring out of bed or chair (1: Independent, 0: Needs help)
    if any(w in low for w in ["bistar se khud", "khud uth jata", "transfer independently", "get up independently", "kursi se khud", "apne aap uth", "uth baith leta", "khud khada ho jata"]):
        extracted['move'] = 1
    elif any(w in low for w in ["uthne me madad", "uthne me sahara", "need help getting up", "transfer assist", "uthne baithne me sahara", "khade hone me sahara", "uth nahi pata", "bedridden", "cannot stand"]):
        extracted['move'] = 0

    # D. Toileting (1: Independent, 0: Dependent)
    if any(w in low for w in ["toilet khud", "latrine khud", "toilet independently", "shauchalaya khud", "bathroom khud", "toilet apne aap", "toilet chala jata", "shauch khud"]):
        extracted['toilet'] = 1
    elif any(w in low for w in ["toilet me madad", "toilet sahara", "need help toilet", "toilet assist", "bathroom jane me sahara", "diaper", "bed pan", "toilet nahi ja sakta", "peshab par control nahi"]):
        extracted['toilet'] = 0

    # 10. Daily Medications & Adherence
    if any(w in low for w in ["koi dawai nahi", "no medicine", "no medicines", "zero medicines", "0 medicine", "dawai nahi leta", "no meds"]):
        extracted['med_count'] = 0
        extracted['missed_doses'] = 0
    else:
        med_m = re.search(r'(\d+|zero|shunya|ek|do|teen|chaar|char|panch|paanch|one|two|three|four|five)\s*(?:dawai|dawa|medicine|medicines|tablet|tablets|meds|goli|goliyan)', low)
        if med_m:
            raw_v = med_m.group(1)
            if raw_v in NUM_WORDS:
                extracted['med_count'] = int(NUM_WORDS[raw_v])
            else:
                try:
                    m_val = int(raw_v)
                    if 0 <= m_val <= 25:
                        extracted['med_count'] = m_val
                except ValueError:
                    pass

        # Adherence / Missed doses
        if any(w in low for w in ["sab dawai le li", "all taken", "sari goli le li", "all medicines taken", "time par dawai"]):
            extracted['missed_doses'] = 0
        elif any(w in low for w in ["ek goli chhoot gayi", "1 dose missed", "ek dawai bhool gaya", "missed 1 dose", "1 dawai chhut gayi"]):
            extracted['missed_doses'] = 1
        elif any(w in low for w in ["dawai nahi li", "dawa bhool gaya", "missed 2 doses", "kai goli chhoot gayi"]):
            extracted['missed_doses'] = 2

    # 11. Diabetes & Blood Sugar
    if any(w in low for w in ["sugar nahi hai", "not diabetic", "sugar bilkul nahi", "no diabetes", "sugar normal"]):
        extracted['diabetic'] = 0
    elif any(w in low for w in ["sugar hai", "diabetes hai", "diabetic", "madhumeh hai", "sugar patient"]):
        extracted['diabetic'] = 1

    sugar_m = re.search(r'(?:sugar|glucose|blood\s*sugar)\s*(?:level|hai|is)?\s*(\d{2,3})', low)
    if not sugar_m:
        sugar_m = re.search(r'(\d{2,3})\s*(?:mg/dl|sugar|glucose)', low)
    if sugar_m:
        try:
            s_val = int(sugar_m.group(1))
            if 50 <= s_val <= 500:
                extracted['sugar_level'] = s_val
                extracted['diabetic'] = 1 if s_val > 125 else extracted.get('diabetic', 1)
        except ValueError:
            pass

    # 12. Hearing Level (0: Perfect/Normal, 1: Mild Difficulty, 2: Hearing Aid/Severe)
    if any(w in low for w in ["hearing perfect", "theek sunta hu", "sunne me koi dikkat nahi", "sunai theek deta hai", "normal hearing", "perfect sunai"]):
        extracted['hearing_level'] = 0
    elif any(w in low for w in ["thoda kam sunai", "ooncha sunta hu", "mild hearing", "kam sunta hu", "hearing me thodi dikkat", "unche awaz me"]):
        extracted['hearing_level'] = 1
    elif any(w in low for w in ["hearing aid", "kano ki machine", "kaano ki machine", "bahra", "deaf", "severe hearing loss", "machine lagata hu"]):
        extracted['hearing_level'] = 2

    # 13. Comorbidities / Chronic Diagnosed Conditions
    has_chronic_mention = False
    if any(w in low for w in ["koi bimari nahi", "no disease", "no diseases", "no chronic condition", "bilkul swasth", "koi purani bimari nahi"]):
        has_chronic_mention = True
        extracted['htn'] = 0
        extracted['arth'] = 0
        extracted['heart'] = 0
        extracted['resp'] = 0
        extracted['chronic_conditions_none'] = True
    else:
        if any(w in low for w in ["bp", "blood pressure", "hypertension", "high bp", "bp ki goli", "raktchap"]):
            extracted['htn'] = 1
            has_chronic_mention = True
        if any(w in low for w in ["gathiya", "arthritis", "jodon ka dard", "joint swelling", "joint pain", "sandhivat"]):
            extracted['arth'] = 1
            has_chronic_mention = True
        if any(w in low for w in ["dil ki bimari", "heart", "cardiac", "bypass", "stent", "pacemaker", "heart attack", "angina"]):
            extracted['heart'] = 1
            has_chronic_mention = True
        if any(w in low for w in ["dama", "asthma", "saans phoolna", "respiratory", "inhaler", "saans ki bimari", "copd"]):
            extracted['resp'] = 1
            has_chronic_mention = True

    # 14. Comprehensive Clinical Audit Checklist
    has_chronic_known = (
        has_chronic_mention or 
        extracted.get('chronic_conditions_none') or 
        any(extracted.get(k) is not None for k in ['htn', 'arth', 'heart', 'resp'])
    )

    checklist = {
        "age": {
            "title": "Age (उम्र)",
            "status": "provided" if "age" in extracted and extracted["age"] is not None else "missing",
            "value": extracted.get("age", None),
            "question_hi": "Aapki umar kitne saal hai?",
            "question_en": "What is your age in years?"
        },
        "gender": {
            "title": "Gender (लिंग)",
            "status": "provided" if "gender" in extracted and extracted["gender"] is not None else "missing",
            "value": extracted.get("gender", None),
            "question_hi": "Aapka gender kya hai - Purush (Male) ya Mahila (Female)?",
            "question_en": "What is your biological gender - Male or Female?"
        },
        "body": {
            "title": "Height & Weight (लंबाई व वजन)",
            "status": "provided" if ("height" in extracted and "weight" in extracted) else "missing",
            "value": f"{extracted.get('weight', '')}kg, {extracted.get('height', '')}cm" if ("height" in extracted and "weight" in extracted) else None,
            "question_hi": "Aapka vajan (weight) kitne kilo aur lambai (height) kitne cm hai?",
            "question_en": "What is your current weight in kg and height in cm?"
        },
        "vitals": {
            "title": "Vitals (BP, Pulse, SpO2)",
            "status": "provided" if ("bp_sys" in extracted and "heart_rate" in extracted and "spo2" in extracted) else "missing",
            "value": f"BP {extracted.get('bp_sys', '')}/{extracted.get('bp_dia', '')}, HR {extracted.get('heart_rate', '')}, O2 {extracted.get('spo2', '')}%" if ("bp_sys" in extracted and "heart_rate" in extracted) else None,
            "question_hi": "Aapka Blood Pressure, Pulse dhadkan aur Oxygen SpO2 kitna hai?",
            "question_en": "What are your recent Blood Pressure, Heart Rate pulse, and Oxygen SpO2 readings?"
        },
        "pain": {
            "title": "Pain Status (दर्द)",
            "status": "provided" if ("pain_present" in extracted and (extracted["pain_present"] == 0 or "pain_loc" in extracted)) else "missing",
            "value": f"{extracted.get('pain_loc', '')} (Level {extracted.get('pain_level', 0)})" if extracted.get("pain_present") == 1 else ("No Pain" if extracted.get("pain_present") == 0 else None),
            "question_hi": "Kya shareer me kisi hisse me dard hai jaise ghutne ya kamar me? Aur dard ka level 1 se 10 me kitna hai?",
            "question_en": "Do you have any pain (such as in knees, back, or chest) and what is the severity level from 1 to 10?"
        },
        "sleep": {
            "title": "Sleep Hours (नींद)",
            "status": "provided" if "sleep_hours" in extracted and extracted["sleep_hours"] is not None else "missing",
            "value": f"{extracted.get('sleep_hours')} hrs" if extracted.get("sleep_hours") is not None else None,
            "question_hi": "Aap rozana kitne ghante sote hain?",
            "question_en": "How many hours of sleep do you usually get each night?"
        },
        "adl_walk": {
            "title": "Walking Mobility (चलना)",
            "status": "provided" if "walk" in extracted and extracted["walk"] is not None else "missing",
            "value": "Independent" if extracted.get("walk") == 1 else ("Needs Help" if extracted.get("walk") == 0 else None),
            "question_hi": "Chalna phirna kaisa hai - khud chal lete hain ya walker/chhadi ya sahare ki zaroorat padti hai?",
            "question_en": "Can you walk independently or do you require a walker, stick, or human assistance?"
        },
        "adl_eat": {
            "title": "Eating (खाना खाना)",
            "status": "provided" if "eat" in extracted and extracted["eat"] is not None else "missing",
            "value": "Independent" if extracted.get("eat") == 1 else ("Dependent" if extracted.get("eat") == 0 else None),
            "question_hi": "Khana aap apne aap kha lete hain ya kisi ki madad lagti hai?",
            "question_en": "Are you able to feed yourself independently or do you need help eating meals?"
        },
        "adl_move": {
            "title": "Transferring (उठना-बैठना)",
            "status": "provided" if "move" in extracted and extracted["move"] is not None else "missing",
            "value": "Independent" if extracted.get("move") == 1 else ("Needs Help" if extracted.get("move") == 0 else None),
            "question_hi": "Bistar ya kursi se uthne-baithne me kya kisi ka sahara lagta hai?",
            "question_en": "Can you get in and out of bed or a chair by yourself?"
        },
        "adl_toilet": {
            "title": "Toileting (शौचालय)",
            "status": "provided" if "toilet" in extracted and extracted["toilet"] is not None else "missing",
            "value": "Independent" if extracted.get("toilet") == 1 else ("Dependent" if extracted.get("toilet") == 0 else None),
            "question_hi": "Toilet (shauchalaya) khud ja pate hain ya sahara chahiye?",
            "question_en": "Can you use the toilet independently or do you require assistance?"
        },
        "meds": {
            "title": "Medications (दवाइयां)",
            "status": "provided" if "med_count" in extracted and extracted["med_count"] is not None else "missing",
            "value": f"{extracted.get('med_count')} meds" if extracted.get("med_count") is not None else None,
            "question_hi": "Rozana kitni dawaiyan (tablets/goliyan) lete hain aur kya sabhi samay par le li?",
            "question_en": "How many prescription medicines or tablets do you take daily?"
        },
        "sugar": {
            "title": "Diabetes & Sugar (शुगर)",
            "status": "provided" if "diabetic" in extracted and extracted["diabetic"] is not None else "missing",
            "value": f"Diabetic ({extracted.get('sugar_level', 120)} mg/dL)" if extracted.get("diabetic") == 1 else ("Non-Diabetic" if extracted.get("diabetic") == 0 else None),
            "question_hi": "Kya aapko Diabetes (sugar) ki bimari hai? Agar haan toh sugar level kitna hai?",
            "question_en": "Do you have diabetes? If yes, what is your typical fasting or random blood sugar level?"
        },
        "hearing": {
            "title": "Hearing (सुनने की क्षमता)",
            "status": "provided" if "hearing_level" in extracted and extracted["hearing_level"] is not None else "missing",
            "value": "Normal" if extracted.get("hearing_level") == 0 else ("Mild" if extracted.get("hearing_level") == 1 else ("Hearing Aid" if extracted.get("hearing_level") == 2 else None)),
            "question_hi": "Sunne ki kshamta kaisi hai - bilkul sahi, thoda kam sunai deta hai, ya hearing machine lagate hain?",
            "question_en": "How is your hearing ability - perfect normal, mild difficulty, or do you use a hearing aid?"
        },
        "diseases": {
            "title": "Diseases (पुरानी बीमारियां)",
            "status": "provided" if has_chronic_known else "missing",
            "value": [k for k in ['htn', 'arth', 'heart', 'resp'] if extracted.get(k) == 1] or ('None' if extracted.get('chronic_conditions_none') else None),
            "question_hi": "Kya aapko High BP, Gathiya (Arthritis), Dil ki bimari, ya Dama (Asthma) jaisi koi bimari hai?",
            "question_en": "Do you have any chronic conditions such as High BP, Arthritis, Heart disease, or Asthma?"
        }
    }

    missing_fields = [k for k, v in checklist.items() if v["status"] == "missing"]

    inquiries = [
        {
            "key": k,
            "title": checklist[k]["title"],
            "question_hi": checklist[k]["question_hi"],
            "question_en": checklist[k]["question_en"]
        }
        for k in missing_fields
    ]

    # Formulate conversational voice assistant speech
    if not missing_fields:
        assistant_voice_hindi = "बहुत बढ़िया! आपकी सभी स्वास्थ्य जानकारी, वाइटल्स, दर्द, दिनचर्या और दवाइयां ऑडियो से फॉर्म में भर दी गई हैं। सभी इनपुट पूरे हैं। अब आप 'जोखिम जांचें' पर क्लिक करके अपनी AI रिपोर्ट देख सकते हैं।"
        assistant_voice_english = "Excellent! All your clinical information including vitals, pain, daily activities, and medications have been extracted into the form. All parameters are complete. You can now predict health risk."
        is_ready = True
    else:
        top_inquiries = inquiries[:2]
        hi_questions = " ".join([f"{idx+1}. {inq['question_hi']}" for idx, inq in enumerate(top_inquiries)])
        en_questions = " ".join([f"{idx+1}. {inq['question_en']}" for idx, inq in enumerate(top_inquiries)])

        assistant_voice_hindi = f"मैंने आपकी बोली गई जानकारी फॉर्म में अपडेट कर दी है। सही असेसमेंट के लिए कृपया यह भी बताएं: {hi_questions}"
        assistant_voice_english = f"I have updated your known details in the form. For an accurate assessment, please also tell us: {en_questions}"
        is_ready = False

    return {
        "success": True,
        "transcript": t,
        "extracted": extracted,
        "missing_fields": missing_fields,
        "checklist": checklist,
        "inquiries": inquiries,
        "next_inquiry": inquiries[0] if inquiries else None,
        "is_ready_for_assessment": is_ready,
        "feedback": {
            "hindi": assistant_voice_hindi,
            "english": assistant_voice_english
        }
    }

def transcribe_audio_file(file_path: str, language: str = "hi-IN") -> tuple[bool, str, str]:
    """
    Attempts to transcribe an audio file (.wav, .flac) using SpeechRecognition.
    Returns (success, transcript, error_message).
    """
    try:
        import speech_recognition as sr
        r = sr.Recognizer()
        with sr.AudioFile(file_path) as source:
            audio_data = r.record(source)
            transcript = r.recognize_google(audio_data, language=language)
            return True, transcript, ""
    except Exception as e:
        return False, "", str(e)

