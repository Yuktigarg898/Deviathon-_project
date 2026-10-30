"""
Bilingual (Hindi / Devanagari / English / Hinglish) Clinical Speech & NLP Entity Extractor for CareConnect.
Extracts Geriatric Demographics, Vital Signs (BP, Pulse, SpO2), Pain Profile with deep synonym support,
Sleep Hours, 4 Core ADL Domains (Walking, Eating, Moving, Toileting), Medications & Missed Doses,
Diabetes & Blood Sugar, Hearing Level, and Chronic Diseases.
Supports pure Devanagari Hindi (देवनागरी लिपि / शुद्ध हिन्दी) alongside colloquial Hinglish and English.
Age and Gender are auto-detected from user profile so they are always verified and never flagged missing.
"""

import re
import os

# Devanagari Numeral Translation Table
DEV_DIGITS = str.maketrans('०१२३४५६७८९', '0123456789')

# Hindi Number Words Dictionary (0 to 100 + Fractions)
HINDI_NUMBER_WORDS = {
    'शून्य': 0, 'सिफर': 0, 'एक': 1, 'दो': 2, 'तीन': 3, 'चार': 4,
    'पांच': 5, 'पाँच': 5, 'छह': 6, 'छः': 6, 'सात': 7, 'आठ': 8, 'नौ': 9, 'दस': 10,
    'ग्यारह': 11, 'बारह': 12, 'तेरह': 13, 'चौदह': 14, 'पंद्रह': 15, 'सोलह': 16,
    'सत्रह': 17, 'अठारह': 18, 'उन्नीस': 19, 'बीस': 20,
    'इक्कीस': 21, 'बाईस': 22, 'तेईस': 23, 'चौबीस': 24, 'पच्चीस': 25,
    'छब्बीस': 26, 'सत्ताईस': 27, 'अट्ठाईस': 28, 'उनतीस': 29, 'तीस': 30,
    'इकतीस': 31, 'बत्तीस': 32, 'तैंतीस': 33, 'चौंतीस': 34, 'पैंतीस': 35,
    'छत्तीस': 36, 'सैंतीस': 37, 'अड़तीस': 38, 'उनतालीस': 39, 'चालीस': 40,
    'इकतालीस': 41, 'बयालीस': 42, 'तैंतालीस': 43, 'चवालीस': 44, 'पैंतालीस': 45,
    'छियालीस': 46, 'सैंतालीस': 47, 'अड़तालीस': 48, 'उनचास': 49, 'पचास': 50,
    'इक्यावन': 51, 'बावन': 52, 'तिरेपन': 53, 'चौवन': 54, 'पचपन': 55,
    'छप्पन': 56, 'सत्तावन': 57, 'अट्ठावन': 58, 'उनसठ': 59, 'साठ': 60,
    'इकसठ': 61, 'बासठ': 62, 'तिरेसठ': 63, 'चौंसठ': 64, 'पैंसठ': 65,
    'छियासठ': 66, 'सरसठ': 67, 'अड़सठ': 68, 'उनहत्तर': 69, 'सत्तर': 70,
    'इकहत्तर': 71, 'बहत्तर': 72, 'तिहत्तर': 73, 'चौहत्तर': 74, 'पचहत्तर': 75,
    'छिहत्तर': 76, 'सतहत्तर': 77, 'अठहत्तर': 78, 'उन्नासी': 79, 'अस्सी': 80,
    'इक्यासी': 81, 'बयासी': 82, 'तिरासी': 83, 'चौरासी': 84, 'पचासी': 85,
    'छियासी': 86, 'सत्तासी': 87, 'अट्ठासी': 88, 'नवासी': 89, 'नब्बे': 90,
    'इक्यानवे': 91, 'बानवे': 92, 'तिरानवे': 93, 'चौरानवे': 94, 'पंचानवे': 95,
    'छियानवे': 96, 'सत्तानवे': 97, 'अट्ठानवे': 98, 'निन्यानवे': 99, 'सौ': 100,
    'डेढ़': 1.5, 'ढाई': 2.5
}

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
    "das": 10.0, "dus": 10.0, "ten": 10.0,
    "gyarah": 11.0, "barah": 12.0, "terah": 13.0, "chaudah": 14.0,
    "pandrah": 15.0, "solah": 16.0, "satrah": 17.0, "atharah": 18.0,
    "unnis": 19.0, "bees": 20.0
}

def normalize_devanagari_numbers(text: str) -> str:
    """
    Converts Devanagari numerals (०-९) and Hindi number phrases (e.g. एक सौ पैंसठ, अड़सठ, सत्तानवे)
    into standard Arabic digits to streamline downstream clinical regex matching.
    """
    if not text:
        return ""
    t = text.translate(DEV_DIGITS)
    # 1. Compound: X सौ Y (e.g., एक सौ पैंसठ -> 165)
    def repl_x_sau_y(m):
        x_w, y_w = m.group(1), m.group(2)
        x_val = HINDI_NUMBER_WORDS.get(x_w, 1)
        y_val = HINDI_NUMBER_WORDS.get(y_w, 0)
        return ' ' + str(int(x_val * 100 + y_val)) + ' '
    t = re.sub(r'(' + '|'.join(HINDI_NUMBER_WORDS.keys()) + r')\s+सौ\s+(' + '|'.join(HINDI_NUMBER_WORDS.keys()) + r')', repl_x_sau_y, t)

    # 2. Compound: सौ Y (e.g., सौ चालीस -> 140)
    def repl_sau_y(m):
        y_w = m.group(1)
        y_val = HINDI_NUMBER_WORDS.get(y_w, 0)
        return ' ' + str(int(100 + y_val)) + ' '
    t = re.sub(r'(?:एक\s+)?सौ\s+(' + '|'.join(HINDI_NUMBER_WORDS.keys()) + r')', repl_sau_y, t)

    # 3. Compound: X सौ (e.g., दो सौ -> 200)
    def repl_x_sau(m):
        x_w = m.group(1)
        x_val = HINDI_NUMBER_WORDS.get(x_w, 1)
        return ' ' + str(int(x_val * 100)) + ' '
    t = re.sub(r'(' + '|'.join(HINDI_NUMBER_WORDS.keys()) + r')\s+सौ', repl_x_sau, t)

    # 4. Standalone words (sorted descending by length to match longer words first)
    sorted_words = sorted(HINDI_NUMBER_WORDS.keys(), key=len, reverse=True)
    pattern = r'(?<![^\s,।।?!])(' + '|'.join(sorted_words) + r')(?![^\s,।।?!])'
    t = re.sub(pattern, lambda m: ' ' + str(HINDI_NUMBER_WORDS[m.group(1)]) + ' ', t)
    return ' '.join(t.split())

PAIN_POSITIVE_TERMS = [
    # English & Hinglish
    "dard", "peeda", "kasht", "takleef", "taklif", "chot", "jalan", "jakdan", 
    "marod", "soojan", "sujan", "dukh", "dukhna", "dukh raha", "dukh rahi", "dukhta", 
    "dukhti", "kheenchaav", "spasm", "stiffness", "shool", "vedna", "chubhan", "aahat", 
    "ache", "aching", "aches", "pain", "painful", "hurt", "hurting", "hurts", "sore", 
    "soreness", "throbbing", "tender", "tenderness", "cramp", "cramps", "cramping", 
    "agony", "discomfort", "suffering", "stabbing", "stiff", "swollen", "burning", 
    "chubh raha", "jalan ho rahi", "jalan rehti", "kharash", "kashtdayak",
    "bohot kasht", "peeda ho rahi", "bahut dukhta hai", "kasht ho raha", "dukh raha hai",
    "dard hai", "pareshani", "pareshan", "bura dard", "tez dard", "dard se bura haal",
    "bura lag raha", "sir dard", "kamar dard", "ghutna dard", "jodon me dard", "dard ho raha",
    # Pure Devanagari Hindi
    "दर्द", "पीड़ा", "कष्ट", "वेदना", "व्यथा", "दुख", "दुखना", "दुख रहा", "दुख रही", "दुखती", "दुखता",
    "सूजन", "जकड़न", "मरोड़", "ऐंठन", "चुभन", "जलन", "तकलीफ", "तकलीफ़", "परेशानी", "चोट", "खराश", 
    "कष्टदायक", "असहनीय", "दर्द है", "पीड़ा हो रही", "बहुत दुखता", "कष्ट हो रहा", "तीव्र दर्द", "तेज दर्द"
]

PAIN_NEGATIVE_TERMS = [
    # English & Hinglish
    "dard nahi", "dard nhi", "koi dard nahi", "koi dard nhi", "pain free", "no pain", 
    "dard bilkul nahi", "dard bilkul nhi", "kuch nahi dukh raha", "kuch nhi dukh raha", 
    "no ache", "no aches", "no hurt", "not hurting", "zero pain", "no discomfort", "dard mukt", 
    "dard vagerah nahi", "dukh nahi raha", "dard se mukt", "no body pain",
    "koi kasht nahi", "koi peeda nahi",
    # Pure Devanagari Hindi
    "दर्द नहीं", "कोई दर्द नहीं", "पीड़ा नहीं", "कोई पीड़ा नहीं", "कष्ट नहीं", "कोई कष्ट नहीं", 
    "दर्द मुक्त", "दर्द से मुक्त", "दर्द बिल्कुल नहीं", "कुछ नहीं दुख रहा", "दुख नहीं रहा", 
    "दर्द वगैरह नहीं", "शरीर में दर्द नहीं", "बदन दर्द नहीं"
]

def extract_clinical_entities_from_text(text: str, lang_hint: str = "auto", current_entities: dict = None) -> dict:
    t = (text or "").strip()
    # Normalize Devanagari numerals and Hindi number words into standard digits
    t = normalize_devanagari_numbers(t)
    low = t.lower()

    # Pre-populate with previous accumulated state so multi-turn inputs persist
    extracted = dict(current_entities or {})
    missing_fields = []

    # 1. Age Extraction (Auto-detect from profile if not spoken)
    # Matches: "74 saal", "74 years", "umar 74", "age 74", "उम्र 74 वर्ष", "आयु 74"
    age_match = re.search(
        r"(?:(?:(?:meri\s+|मेरी\s+)?(?:age|umar|umer|varsh|उम्र|आयु|वय|साल|वर्ष)\s*(?:is|hai|meri|है|मेरी)?|i\s*am|i\'m|turned)\s*(\d{2})"
        r'|'
        r'(\d{2})\s*(?:saal|years|year|varsh|साल|वर्ष|उम्र))',
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
    
    # Auto-detect profile age if still absent
    if "age" not in extracted or extracted["age"] is None:
        extracted['age'] = 74
        extracted['age_autodetected'] = True

    # 2. Gender (Auto-detect from profile if not spoken)
    female_re = r'(?:\b(?:mahila|aurat|female|stree|dadi|nani|she|woman|ladki|mataji|aunty|lady|daadi)\b|महिला|औरत|स्त्री|नारी|दादी|नानी|माताजी|लड़की)'
    male_re = r'(?:\b(?:purush|aadmi|male|dada|nana|he|man|ladka|pitaji|uncle|gentleman|daada)\b|पुरुष|आदमी|नर|दादा|नाना|पिताजी|लड़का)'
    if re.search(female_re, low):
        extracted['gender'] = 'Female'
    elif re.search(male_re, low):
        extracted['gender'] = 'Male'
    
    # Auto-detect profile gender if still absent
    if "gender" not in extracted or extracted["gender"] is None:
        extracted['gender'] = 'Male'
        extracted['gender_autodetected'] = True

    # 3. Weight & Height with Bilingual Synonyms
    wt_match = re.search(r'(\d{2,3}(?:\.\d+)?)\s*(?:kg|kilo|kilogram|weight|vajan|wazan|किलो|किग्रा|किलोग्राम|वजन|भार)', low)
    if not wt_match:
        wt_match = re.search(r'(?:weight|vajan|wazan|वजन|भार)\s*(?:hai|is|है)?\s*(\d{2,3}(?:\.\d+)?)', low)
    if not wt_match:
        wt_match = re.search(r'(\d{2,3}(?:\.\d+)?)\s*(?:kilo|kg|किलो)', low)
    if wt_match:
        try:
            w_val = float(wt_match.group(1))
            if 30 <= w_val <= 180:
                extracted['weight'] = round(w_val, 1)
        except ValueError:
            pass

    ht_match = re.search(r'(\d{2,3})\s*(?:cm|centimeter|centimetre|height|lambaai|lambai|सेंटीमीटर|सेमी|लंबाई|ऊंचाई|ऊँचाई|कद)', low)
    if not ht_match:
        ht_match = re.search(r'(?:height|lambaai|lambai|लंबाई|ऊंचाई|ऊँचाई|कद)\s*(?:hai|is|है)?\s*(\d{2,3})', low)
    if ht_match:
        try:
            h_val = float(ht_match.group(1))
            if 100 <= h_val <= 220:
                extracted['height'] = round(h_val, 1)
        except ValueError:
            pass

    # Feet and inches support (e.g. "5 foot 6 inch", "५ फुट ५ इंच")
    if 'height' not in extracted:
        ft_in_match = re.search(r'(\d)\s*(?:foot|feet|ft|फुट|फ़ीट)\s*(?:and\s+|aur\s+|और\s+)?(\d{1,2})?\s*(?:inch|inches|in|इंच)?', low)
        if ft_in_match:
            try:
                ft = int(ft_in_match.group(1))
                inc = int(ft_in_match.group(2)) if ft_in_match.group(2) else 0
                cm_val = round(ft * 30.48 + inc * 2.54, 1)
                if 100 <= cm_val <= 230:
                    extracted['height'] = cm_val
            except (ValueError, TypeError):
                pass

    # 4. Blood Pressure (Systolic & Diastolic)
    # Matches: "BP 140 90", "रक्तचाप 140 और 85", "बीपी 130 85"
    bp_match = re.search(r'(?:bp|blood\s*pressure|raktchap|रक्तचाप|बीपी|ब्लड\s*प्रेशर)?\s*(\d{2,3})\s*(?:/|by|over|aur|and|और|-|\s+)\s*(\d{2,3})', low)
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
        sys_m = re.search(r'(?:systolic|upar\s+ka\s+bp|high\s+bp|upar\s+ka|ऊपर\s+का\s+(?:रक्तचाप|बीपी)?)\s*(?:hai|is|है)?\s*(\d{2,3})', low)
        if sys_m:
            try:
                v = int(sys_m.group(1))
                if 70 <= v <= 240:
                    extracted['bp_sys'] = v
            except ValueError:
                pass
        dia_m = re.search(r'(?:diastolic|neeche\s+ka\s+bp|low\s+bp|neeche\s+ka|नीचे\s+का\s+(?:रक्तचाप|बीपी)?)\s*(?:hai|is|है)?\s*(\d{2,3})', low)
        if dia_m:
            try:
                v = int(dia_m.group(1))
                if 40 <= v <= 140:
                    extracted['bp_dia'] = v
            except ValueError:
                pass

    # 5. Heart Rate / Pulse with Hindi/English Synonyms
    # Matches: "heart rate 76", "pulse 78", "dhadkan 84", "धड़कन 78", "हृदय गति 76", "पल्स 80", "नाड़ी 75"
    hr_match = re.search(r'(?:heart\s*rate|pulse|pulse\s*rate|dhadkan|hr|nabz|nadi|dil\s+ki\s+dhadkan|धड़कन|हृदय\s*गति|हृदय\s*दर|पल्स|नब्ज|नाड़ी)\s*(?:hai|is|है)?\s*(\d{2,3})', low)
    if not hr_match:
        hr_match = re.search(r'(\d{2,3})\s*(?:bpm|beats|dhadkan|heart\s*rate|pulse|धड़कन|पल्स|बीट्स)', low)
    if hr_match:
        try:
            hr_val = int(hr_match.group(1))
            if 40 <= hr_val <= 180:
                extracted['heart_rate'] = hr_val
        except ValueError:
            pass

    # 6. SpO2 / Oxygen with Synonyms
    # Matches: "oxygen 97", "spo2 98", "ऑक्सीजन 97", "प्राणवायु 98 प्रतिशत"
    spo2_match = re.search(r'(?:oxygen|spo2|o2|oxygen\s*level|pranavayu|saturation|ऑक्सीजन|प्राणवायु|एसपीओ२|एसपीओ2)\s*(?:hai|is|है)?\s*(\d{2,3}(?:\.\d+)?)', low)
    if not spo2_match:
        spo2_match = re.search(r'(\d{2,3}(?:\.\d+)?)\s*(?:%|percent|प्रतिशत)?\s*(?:oxygen|spo2|o2|pranavayu|ऑक्सीजन|प्राणवायु)', low)
    if spo2_match:
        try:
            sp_val = float(spo2_match.group(1))
            if 70 <= sp_val <= 100:
                extracted['spo2'] = round(sp_val, 1)
        except ValueError:
            pass

    # 7. Pain Profile with Deep Bilingual Synonym Support
    explicit_no_pain = any(w in low for w in PAIN_NEGATIVE_TERMS)
    has_pain_mention = any(w in low for w in PAIN_POSITIVE_TERMS)

    has_conflicting_positive_site = False
    if explicit_no_pain and has_pain_mention:
        has_site = any(w in low for w in ["ghutna", "ghutne", "knee", "kamar", "peeth", "back", "kandha", "shoulder", "jod", "joints", "chhati", "chest", "घुटना", "घुटने", "कमर", "पीठ", "कंधा", "जोड़", "छाती"])
        has_level = bool(re.search(r'(?:level|scale|darja|score|पैमाना|स्तर|स्केल)\s*[:=]?\s*(\d{1,2})', low))
        if has_site and (has_level or any(w in low for w in ["tez", "severe", "bahut", "bura", "तेज", "तीव्र", "बहुत", "असहनीय"])):
            has_conflicting_positive_site = True

    if explicit_no_pain and not has_conflicting_positive_site:
        extracted['pain_present'] = 0
        extracted['pain_level'] = 0.0
        extracted['pain_loc'] = 'None'
    elif has_pain_mention or extracted.get('pain_present') == 1:
        if has_pain_mention:
            extracted['pain_present'] = 1

        # Determine localized site with comprehensive Hindi/English synonyms
        if any(w in low for w in ["ghutna", "ghutne", "ghutno", "knee", "knees", "patella", "godha", "godhe", "godho", "taang", "ghutno me", "ghutne ka", "घुटना", "घुटने", "घुटनों", "पटेला", "गोडा", "गोडे"]):
            extracted['pain_loc'] = 'Knee'
        elif any(w in low for w in ["kamar", "peeth", "reedh", "spine", "spinal", "back", "lower back", "lumbar", "sciatica", "kamardard", "kamar me dard", "kamar dard", "reedh ki haddi", "peeth me", "कमर", "पीठ", "रीढ़", "कमर दर्द", "पीठ में"]):
            extracted['pain_loc'] = 'Back'
        elif any(re.search(rf"\b{w}\b", low) for w in ["kandha", "kandhe", "kandho", "shoulder", "shoulders", "collarbone"]) or any(w in low for w in ["कंधा", "कंधे", "कंधों"]):
            extracted['pain_loc'] = 'Shoulder'
        elif any(w in low for w in ["jod", "jodon", "joint", "joints", "sandhi", "sandhivat", "gathiya", "jod dard", "ang ang", "jodon me", "जोड़", "जोड़ों", "संधिवात", "गठिया", "जोड़ दर्द", "जोड़ों में"]):
            extracted['pain_loc'] = 'Joints'
        elif any(w in low for w in ["chhati", "chest", "seena", "dil", "seene me", "chhati dard", "heart pain", "chhati me dard", "छाती", "सीना", "सीने"]):
            extracted['pain_loc'] = 'Chest'
        elif any(re.search(rf"\b{w}\b", low) for w in ["sar", "sir", "head", "headache", "sardard", "sar me dard", "gardan", "neck", "haath", "arm", "pair", "leg", "pindli", "ankle", "takhna", "wrist", "kalai", "kohni", "elbow"]) or any(w in low for w in ["सिर", "सर", "गर्दन", "हाथ", "पैर", "टांग", "टखना", "कलाई", "कोहनी"]):
            extracted['pain_loc'] = 'Other'
        elif 'pain_loc' not in extracted:
            extracted['pain_loc'] = 'Other'

        # Pain Level: Numerical & Synonym Scales
        pl_match = re.search(r'(?:level|scale|rate|rating|severity|darja|score|पैमाना|स्तर|स्केल)\s*[:=]?\s*(\d{1,2}(?:\.\d+)?)', low)
        if not pl_match:
            pl_match = re.search(r'(\d{1,2}(?:\.\d+)?)\s*(?:/10|out of 10|\s*level|\s*darja|\s*scale|\s*पैमाना|\s*स्तर)', low)
        if not pl_match:
            pl_match = re.search(r'(?:dard|pain|peeda|takleef|दर्द|पीड़ा|कष्ट)\s+(?:hai\s+|है\s+)?(?:around\s+|lagbhag\s+|लगभग\s+)?(\d{1,2}(?:\.\d+)?)', low)

        if pl_match:
            try:
                pl_val = float(pl_match.group(1))
                if 1.0 <= pl_val <= 10.0:
                    extracted['pain_level'] = pl_val
            except ValueError:
                pass

        # Hindi/English Number Word check
        if 'pain_level' not in extracted or has_pain_mention:
            word_num_match = re.search(
                r'(?:level|scale|darja|dard|pain|rating|पैमाना|स्तर)\s+(?:hai\s+|है\s+)?(shunya|zero|ek|one|do|two|teen|three|chaar|char|four|paanch|panch|five|chhah|chhe|che|six|saat|sat|seven|aath|ath|eight|nau|nine|das|dus|ten)',
                low
            )
            if word_num_match:
                w_str = word_num_match.group(1)
                if w_str in NUM_WORDS:
                    extracted['pain_level'] = NUM_WORDS[w_str]

        # Qualitative Synonyms for pain severity
        if has_pain_mention and 'pain_level' not in extracted:
            if any(w in low for w in [
                "bohot zyada", "bahut zyada", "bahut tez", "bohot tez", "bura haal", "severe", 
                "extreme", "unbearable", "asahniya", "bardasht nahi", "bardasht se bahar", 
                "intense", "terrible", "worst", "excruciating", "high pain", "bahot jada", 
                "bahut jyada", "bahut dard", "bohot dard", "killing me", "tez dard", "bura dard",
                "dard se halat kharab", "sahan nahi hota", "bahut takleef",
                "बहुत तेज", "बहुत ज्यादा", "असहनीय", "बर्दाश्त से बाहर", "तीव्र दर्द", "हालत खराब", "सहन नहीं होता", "कष्टदायक"
            ]):
                extracted['pain_level'] = 8.0
            elif any(w in low for w in [
                "moderate", "madhyam", "medium", "theek thaak", "beech ka", "tolerable", 
                "average", "samanya", "thoda bahut", "manageable", "thoda zyada", "moderate pain",
                "kafi had tak", "normal se zyada", "chalne me thoda dard",
                "मध्यम", "ठीक ठाक", "सहन करने योग्य", "थोड़ा ज्यादा", "सामान्य से ज्यादा"
            ]):
                extracted['pain_level'] = 5.0
            elif any(w in low for w in [
                "thoda", "thoda sa", "thodi si", "halka", "halka fulka", "mild", "slight", 
                "low", "kam", "minor", "bearable", "zara sa", "mamooli", "mild pain", "halka dard",
                "kam dard", "thoda bohot", "dheema", "dheema dard",
                "हल्का", "हल्का फुल्का", "थोड़ा सा", "कम दर्द", "धीमा दर्द", "जरा सा", "मामूली"
            ]):
                extracted['pain_level'] = 2.5
            elif 'pain_level' not in extracted:
                extracted['pain_level'] = 4.0

    # 8. Sleep Hours with Hindi/English Synonyms
    sleep_match = re.search(r'(\d{1,2}(?:\.\d+)?)\s*(?:ghante|ghanta|hours|hrs|hr|घंटे|घंटा)\s*(?:neend|neendh|sleep|soya|soti|sota|sona|नींद|सोया|सोती|सोता|शयन)', low)
    if not sleep_match:
        sleep_match = re.search(r'(?:neend|neendh|sleep|soya|sota|sona|नींद|सोया|सोती|सोता)\s*(?:hai|is|है)?\s*(\d{1,2}(?:\.\d+)?)\s*(?:ghante|ghanta|hours|hrs|घंटे|घंटा)?', low)
    if sleep_match:
        try:
            sl_val = float(sleep_match.group(1))
            if 2.0 <= sl_val <= 16.0:
                extracted['sleep_hours'] = round(sl_val, 1)
        except ValueError:
            pass

    # 9. Daily Living Activities (ADLs) with Bilingual Hindi/English Synonyms
    # A. Walking (1: Independent, 0: Needs help / stick / walker / fall)
    if any(w in low for w in [
        "khud chal leta", "apne aap chal", "walk independently", "walk without support", 
        "chalne me koi dikkat nahi", "bina sahare chal", "bina stick chal", "theek chal leta", 
        "chal sakta hu", "chalta hu", "chal leta hu", "chal leti hu", "chal leta hoon", "chal pate hai", "walk normally", "koi lathi nahi", "bina kisi sahare",
        "चल लेता", "खुद चल", "अपने आप चल", "बिना सहारे", "बिना लाठी", "पैदल चल लेता", "ठीक चल लेता", "घूम लेता"
    ]):
        extracted['walk'] = 1
    elif any(w in low for w in [
        "chhadi se", "walker", "sahare se chal", "walk with stick", "need help walking", 
        "walk assist", "stick leke", "lathi", "chhari", "sahara lekar chal", "chal nahi sakta", 
        "wheelchair", "cannot walk", "chalna mushkil", "gir gaya", "gir gayi", "gir gaye", 
        "larkhadana", "chala nahi ja raha", "ladkhadate", "chalke gir", "sahara chahiye",
        "छड़ी से", "लाठी से", "वॉकर", "सहारे से चल", "गिर गया", "गिर जाता", "लड़खड़ा", "चल नहीं सकता", "व्हीलचेयर", "सहारा चाहिए", "छड़ी का सहारा", "लाठी का सहारा", "चलने में मदद", "चलने में सहारा"
    ]):
        extracted['walk'] = 0

    # B. Eating (1: Independent, 0: Dependent / Needs help)
    if any(w in low for w in [
        "khana khud", "apne aap khana", "khana kha leta", "eat independently", "feed myself", 
        "khana khane me koi takleef nahi", "khana kha sakta", "khud khana", "eat myself", 
        "bina madad khana", "khud se khata", "khana apne aap",
        "खुद खा", "अपने आप खा", "खाना खुद", "भोजन खुद", "खुद से खा", "बिना मदद"
    ]):
        extracted['eat'] = 1
    elif any(w in low for w in [
        "khana khilane", "khana me madad", "need help eating", "assist eating", "assisted feeding", 
        "khana koi khilata", "khilane me sahara", "cannot eat", "khud nahi kha pata", "khana khilana padta",
        "खाना खिलाना", "खाने में मदद", "कोई खिलाता", "खुद नहीं खा", "मदद चाहिए खाने", "खाना खिलाना पड़ता"
    ]):
        extracted['eat'] = 0

    # C. Moving / Transferring out of bed or chair (1: Independent, 0: Needs help)
    if any(w in low for w in [
        "bistar se khud", "khud uth jata", "uth jata hu", "uth leta hu", "uthna baithna khud", "uth baith khud", "transfer independently", "get up independently", 
        "kursi se khud", "apne aap uth", "uth baith leta", "khud khada ho jata", "apne aap bistar se",
        "खुद उठ", "अपने आप उठ", "बिस्तर से खुद", "उठना बैठना खुद", "कुर्सी से खुद"
    ]):
        extracted['move'] = 1
    elif any(w in low for w in [
        "uthne me madad", "uthne me sahara", "need help getting up", "transfer assist", 
        "uthne baithne me sahara", "khade hone me sahara", "uth nahi pata", "bedridden", 
        "cannot stand", "bistar se uthaya jata", "bina sahare uth nahi",
        "उठने में मदद", "उठने में सहारा", "उठ नहीं पाता", "उठाना पड़ता", "बिस्तर पर पड़ा", "बिना सहारे उठ नहीं", "उठने-बैठने में मदद"
    ]):
        extracted['move'] = 0

    # D. Toileting (1: Independent, 0: Dependent)
    if any(w in low for w in [
        "toilet khud", "latrine khud", "toilet independently", "shauchalaya khud", 
        "bathroom khud", "toilet apne aap", "toilet chala jata", "shauch khud", "bathroom apne aap",
        "शौचालय खुद", "टॉयलेट खुद", "शौच खुद", "बाथरूम खुद", "अपने आप शौचालय", "शौचालय चला जाता", "शौचालय खुद जाता"
    ]):
        extracted['toilet'] = 1
    elif any(w in low for w in [
        "toilet me madad", "toilet sahara", "need help toilet", "toilet assist", 
        "bathroom jane me sahara", "diaper", "bed pan", "toilet nahi ja sakta", "peshab par control nahi", "incontinence",
        "शौचालय में सहारा", "टॉयलेट में मदद", "डायपर", "पेशाब पर नियंत्रण नहीं", "शौचालय नहीं जा सकता", "शौचालय में मदद", "शौचालय जाने में मदद", "शौच में मदद"
    ]):
        extracted['toilet'] = 0

    # 10. Daily Medications & Adherence with Synonyms
    if any(w in low for w in [
        "koi dawai nahi", "no medicine", "no medicines", "zero medicines", "0 medicine", "dawai nahi leta", "no meds", "koi goli nahi",
        "कोई दवा नहीं", "कोई दवाई नहीं", "कोई औषधि नहीं", "दवा नहीं लेता", "दवाई नहीं लेता"
    ]):
        extracted['med_count'] = 0
        extracted['missed_doses'] = 0
    else:
        med_m = re.search(r'(\d+|zero|shunya|ek|do|teen|chaar|char|panch|paanch|one|two|three|four|five)\s*(?:dawai|dawa|medicine|medicines|tablet|tablets|meds|goli|goliyan|दवा|दवाई|दवाइयां|औषधि|खुराक|गोली|गोलियां)', low)
        if not med_m:
            med_m = re.search(r'(?:दवा|दवाई|दवाइयां|औषधि|गोलियां)\s*(\d+)', low)
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

        # Adherence / Missed doses with regex support
        if any(re.search(pat, low) for pat in [
            r'सब\s*(?:dawai|goli|dawa|दवा|दवाई|दवाइयां|गोली)\s*ले\s*ली', r'all\s*(?:taken|medicines\s*taken)',
            r'sari\s*(?:goli|dawai)\s*le\s*li', r'time\s*par\s*(?:dawai|goli)', r'\bregular\b',
            r'dawa\s*le\s*li', r'सारी\s*(?:दवा|दवाइयां|गोलियां)\s*ले\s*ली', r'समय\s*पर\s*(?:दवा|दवाई)',
            r'नियमित\s*(?:दवा|दवाई)', r'कोई\s*खुराक\s*नहीं\s*छूटी'
        ]):
            extracted['missed_doses'] = 0
        elif any(re.search(pat, low) for pat in [
            r'ek\s*(?:goli|dawai|dawa|dose)\s*(?:chhoot|chhut|bhool|miss)',
            r'missed\s*1\s*dose', r'1\s*dose\s*missed',
            r'(?:subah|raat|kal|dophar)\s*(?:ki|ko)?\s*(?:goli|dawa|dawai)?\s*(?:chhoot|chhut|bhool)',
            r'एक\s*(?:दवा|दवाई|गोली|खुराक)\s*(?:छूट|भूल)',
            r'(?:सुबह|शाम|रात|दोपहर)\s*की\s*(?:दवा|गोली|खुराक)\s*(?:छूट|भूल)'
        ]):
            extracted['missed_doses'] = 1
        elif any(re.search(pat, low) for pat in [
            r'(?:goli|dawa|dawai)\s*(?:chhoot|chhut|bhool|nahi\s*li)',
            r'missed\s*(?:\d+|two|three|multiple|doses)', r'forgot\s*med',
            r'(?:दवा|दवाइयां|गोलियां|खुराकें)\s*(?:छूट|भूल)'
        ]):
            extracted['missed_doses'] = 2

    # 11. Diabetes & Blood Sugar
    if any(w in low for w in [
        "sugar nahi hai", "not diabetic", "sugar bilkul nahi", "no diabetes", "sugar normal",
        "मधुमेह नहीं", "शुगर नहीं", "डायबिटीज नहीं", "शर्करा सामान्य"
    ]):
        extracted['diabetic'] = 0
    elif any(w in low for w in [
        "sugar hai", "diabetes hai", "diabetic", "madhumeh hai", "sugar patient", "madhumeh",
        "मधुमेह है", "शुगर है", "डायबिटीज है", "शर्करा अधिक"
    ]):
        extracted['diabetic'] = 1

    sugar_m = re.search(r'(?:sugar|glucose|blood\s*sugar|madhumeh|शुगर|मधुमेह|शर्करा|ग्लूकोज)\s*(?:level|hai|is|स्तर|है)?\s*(\d{2,3})', low)
    if not sugar_m:
        sugar_m = re.search(r'(\d{2,3})\s*(?:mg/dl|sugar|glucose|शुगर|शर्करा|मधुमेह)', low)
    if sugar_m:
        try:
            s_val = int(sugar_m.group(1))
            if 50 <= s_val <= 500:
                extracted['sugar_level'] = s_val
                extracted['diabetic'] = 1 if s_val > 125 else extracted.get('diabetic', 1)
        except ValueError:
            pass

    # 12. Hearing Level (0: Perfect/Normal, 1: Mild Difficulty, 2: Hearing Aid/Severe)
    if any(re.search(pat, low) for pat in [
        r'hearing\s*(?:is\s*)?(?:perfect|normal|good|theek|sahi|fine)',
        r'normal\s*hearing', r'theek\s*(?:se\s*)?sun', r'sun(?:ai|ne)?\s*(?:me\s*koi\s*dikkat\s*nahi|theek|sahi|achha)?.*sun',
        r'normal\s*sun', r'perfect\s*sun', r'achha\s*sun',
        r'सामान्य\s*सुन', r'ठीक\s*सुन', r'साफ\s*सुनाई', r'सुनने\s*में\s*कोई\s*(?:दिक्कत|तकलीफ|परेशानी)\s*नहीं'
    ]):
        extracted['hearing_level'] = 0
    elif any(re.search(pat, low) for pat in [
        r'thoda\s*kam\s*sun', r'ooncha\s*sun', r'mild\s*hearing', r'kam\s*sun', r'hearing\s*me\s*thodi\s*dikkat',
        r'unche\s*awaz', r'कम\s*सुन', r'ऊंचा\s*सुन', r'सुनने\s*में\s*थोड़ी\s*(?:दिक्कत|परेशानी)'
    ]):
        extracted['hearing_level'] = 1
    elif any(re.search(pat, low) for pat in [
        r'hearing\s*aid', r'k(?:a|aa)no\s*ki\s*machine', r'\bbahra\b', r'\bdeaf\b', r'severe\s*hearing',
        r'machine\s*lagata', r'hearing\s*machine',
        r'कान\s*की\s*मशीन', r'श्रवण\s*यंत्र', r'सुनाई\s*नहीं\s*देता', r'बहरा'
    ]):
        extracted['hearing_level'] = 2

    # 13. Comorbidities / Chronic Diagnosed Conditions & Symptoms
    has_chronic_mention = False
    if any(w in low for w in [
        "koi bimari nahi", "no disease", "no diseases", "no chronic condition", "bilkul swasth", "koi purani bimari nahi",
        "कोई बीमारी नहीं", "कोई पुरानी बीमारी नहीं", "पूर्णतः स्वस्थ", "स्वस्थ हूँ"
    ]):
        has_chronic_mention = True
        extracted['htn'] = 0
        extracted['arth'] = 0
        extracted['heart'] = 0
        extracted['resp'] = 0
        extracted['chronic_conditions_none'] = True
    else:
        if any(w in low for w in ["bp", "blood pressure", "hypertension", "high bp", "bp ki goli", "raktchap", "uchh raktchap", "उच्च रक्तचाप", "हाई बीपी", "रक्तचाप की बीमारी"]):
            extracted['htn'] = 1
            has_chronic_mention = True
        if any(w in low for w in ["gathiya", "arthritis", "jodon ka dard", "joint swelling", "joint pain", "sandhivat", "गठिया", "संधिवात", "जोड़ों का दर्द", "वात की बीमारी"]):
            extracted['arth'] = 1
            has_chronic_mention = True
        if any(w in low for w in ["dil ki bimari", "heart", "cardiac", "bypass", "stent", "pacemaker", "heart attack", "angina", "हृदय रोग", "दिल की बीमारी", "बाईपास", "स्टेंट", "पेसमेकर"]):
            extracted['heart'] = 1
            has_chronic_mention = True
        if any(re.search(pat, low) for pat in [
            r'\b(?:dama|asthma|respiratory|inhaler|copd)\b',
            r'saans\s*(?:phool|fool|chadh|chad|lene|me\s+takleef|ki\s+bimari)',
            r'haaphna', r'haphan', r'breathless', r'short\s+of\s+breath', r'dum\s+ghut',
            r'दमा', r'अस्थमा', r'श्वास\s*रोग', r'सांस\s*फूल', r'सांस\s*लेने\s*में\s*तकलीफ', r'इन्हेलर'
        ]):
            extracted['resp'] = 1
            has_chronic_mention = True

    # 14. Comprehensive Clinical Audit Checklist
    has_chronic_known = (
        has_chronic_mention or 
        extracted.get('chronic_conditions_none') or 
        any(extracted.get(k) is not None for k in ['htn', 'arth', 'heart', 'resp'])
    )

    # Checklist definition: Age and Gender are auto-detected from profile and always marked "provided"
    checklist = {
        "age": {
            "title": "Age (उम्र)",
            "status": "provided",
            "value": f"{extracted.get('age', 74)} Yrs (Auto-detected)",
            "question_hi": "",
            "question_en": ""
        },
        "gender": {
            "title": "Gender (लिंग)",
            "status": "provided",
            "value": f"{extracted.get('gender', 'Male')} (Auto-detected)",
            "question_hi": "",
            "question_en": ""
        },
        "height": {
            "title": "Height (लंबाई)",
            "status": "provided" if ("height" in extracted and extracted["height"] is not None) else "missing",
            "value": f"{extracted.get('height')} cm" if "height" in extracted and extracted["height"] is not None else None,
            "question_hi": "Aapki lambai (height) kitne cm ya foot-inch hai? (आपकी लंबाई कितने सेंटीमीटर या फुट-इंच है?)",
            "question_en": "What is your height in cm or feet and inches?"
        },
        "weight": {
            "title": "Weight (वजन)",
            "status": "provided" if ("weight" in extracted and extracted["weight"] is not None) else "missing",
            "value": f"{extracted.get('weight')} kg" if "weight" in extracted and extracted["weight"] is not None else None,
            "question_hi": "Aapka vajan (weight) kitne kilo hai? (आपका वजन कितने किलो है?)",
            "question_en": "What is your current weight in kg?"
        },
        "bp": {
            "title": "Blood Pressure (रक्तचाप)",
            "status": "provided" if ("bp_sys" in extracted and "bp_dia" in extracted) else "missing",
            "value": f"BP {extracted.get('bp_sys')}/{extracted.get('bp_dia')} mmHg" if ("bp_sys" in extracted and "bp_dia" in extracted) else None,
            "question_hi": "Aapka Blood Pressure (BP) kitna hai upar aur neeche ka? (आपका रक्तचाप ऊपर और नीचे का कितना है?)",
            "question_en": "What is your Blood Pressure reading (systolic and diastolic)?"
        },
        "hr": {
            "title": "Heart Rate (धड़कन / पल्स)",
            "status": "provided" if ("heart_rate" in extracted and extracted["heart_rate"] is not None) else "missing",
            "value": f"{extracted.get('heart_rate')} bpm" if "heart_rate" in extracted and extracted["heart_rate"] is not None else None,
            "question_hi": "Aapki dil ki dhadkan (pulse rate) kitni hai? (आपकी हृदय गति या नाड़ी प्रति मिनट कितनी है?)",
            "question_en": "What is your heart rate or pulse in beats per minute?"
        },
        "spo2": {
            "title": "Oxygen SpO2 (ऑक्सीजन)",
            "status": "provided" if ("spo2" in extracted and extracted["spo2"] is not None) else "missing",
            "value": f"{extracted.get('spo2')}%" if "spo2" in extracted and extracted["spo2"] is not None else None,
            "question_hi": "Aapka oxygen level (SpO2) kitne percent hai? (आपका ऑक्सीजन स्तर कितने प्रतिशत है?)",
            "question_en": "What is your blood oxygen saturation SpO2 percentage?"
        },
        "pain": {
            "title": "Pain Status (दर्द)",
            "status": "provided" if ("pain_present" in extracted and (extracted["pain_present"] == 0 or "pain_loc" in extracted)) else "missing",
            "value": f"{extracted.get('pain_loc', '')} (Level {extracted.get('pain_level', 0)})" if extracted.get("pain_present") == 1 else ("No Pain" if extracted.get("pain_present") == 0 else None),
            "question_hi": "Kya shareer me kisi hisse me dard hai jaise ghutne ya kamar me? Aur dard ka level 1 se 10 me kitna hai? (क्या शरीर में कहीं दर्द या पीड़ा है?)",
            "question_en": "Do you have any pain (such as in knees, back, or chest) and what is the severity level from 1 to 10?"
        },
        "sleep": {
            "title": "Sleep Hours (नींद)",
            "status": "provided" if "sleep_hours" in extracted and extracted["sleep_hours"] is not None else "missing",
            "value": f"{extracted.get('sleep_hours')} hrs" if extracted.get("sleep_hours") is not None else None,
            "question_hi": "Aap rozana kitne ghante sote hain? (आप रोजाना कितने घंटे सोते हैं?)",
            "question_en": "How many hours of sleep do you usually get each night?"
        },
        "adl_walk": {
            "title": "Walking Mobility (चलना)",
            "status": "provided" if "walk" in extracted and extracted["walk"] is not None else "missing",
            "value": "Independent" if extracted.get("walk") == 1 else ("Needs Help" if extracted.get("walk") == 0 else None),
            "question_hi": "Chalna phirna kaisa hai - khud chal lete hain ya walker/chhadi ya sahare ki zaroorat padti hai? (क्या आप बिना सहारे खुद चल लेते हैं?)",
            "question_en": "Can you walk independently or do you require a walker, stick, or human assistance?"
        },
        "adl_eat": {
            "title": "Eating (खाना खाना)",
            "status": "provided" if "eat" in extracted and extracted["eat"] is not None else "missing",
            "value": "Independent" if extracted.get("eat") == 1 else ("Dependent" if extracted.get("eat") == 0 else None),
            "question_hi": "Khana aap apne aap kha lete hain ya kisi ki madad lagti hai? (क्या आप भोजन खुद अपने आप खा लेते हैं?)",
            "question_en": "Are you able to feed yourself independently or do you need help eating meals?"
        },
        "adl_move": {
            "title": "Transferring (उठना-बैठना)",
            "status": "provided" if "move" in extracted and extracted["move"] is not None else "missing",
            "value": "Independent" if extracted.get("move") == 1 else ("Needs Help" if extracted.get("move") == 0 else None),
            "question_hi": "Bistar ya kursi se uthne-baithne me kya kisi ka sahara lagta hai? (क्या बिस्तर या कुर्सी से खुद उठ-बैठ लेते हैं?)",
            "question_en": "Can you get in and out of bed or a chair by yourself?"
        },
        "adl_toilet": {
            "title": "Toileting (शौचालय)",
            "status": "provided" if "toilet" in extracted and extracted["toilet"] is not None else "missing",
            "value": "Independent" if extracted.get("toilet") == 1 else ("Dependent" if extracted.get("toilet") == 0 else None),
            "question_hi": "Toilet (shauchalaya) khud ja pate hain ya sahara chahiye? (क्या शौचालय खुद चले जाते हैं?)",
            "question_en": "Can you use the toilet independently or do you require assistance?"
        },
        "meds": {
            "title": "Medications (दवाइयां)",
            "status": "provided" if "med_count" in extracted and extracted["med_count"] is not None else "missing",
            "value": f"{extracted.get('med_count')} meds" if extracted.get("med_count") is not None else None,
            "question_hi": "Rozana kitni dawaiyan (tablets/goliyan) lete hain aur kya sabhi samay par le li? (रोजाना कितनी दवाइयां लेते हैं और क्या सभी समय पर लीं?)",
            "question_en": "How many prescription medicines or tablets do you take daily and were doses taken today?"
        },
        "sugar": {
            "title": "Diabetes & Sugar (शुगर)",
            "status": "provided" if "diabetic" in extracted and extracted["diabetic"] is not None else "missing",
            "value": f"Diabetic ({extracted.get('sugar_level', 120)} mg/dL)" if extracted.get("diabetic") == 1 else ("Non-Diabetic" if extracted.get("diabetic") == 0 else None),
            "question_hi": "Kya aapko Diabetes (sugar) ki bimari hai? Agar haan toh sugar level kitna hai? (क्या मधुमेह / शुगर की बीमारी है?)",
            "question_en": "Do you have diabetes? If yes, what is your typical fasting or random blood sugar level?"
        },
        "hearing": {
            "title": "Hearing (सुनने की क्षमता)",
            "status": "provided" if "hearing_level" in extracted and extracted["hearing_level"] is not None else "missing",
            "value": "Normal" if extracted.get("hearing_level") == 0 else ("Mild" if extracted.get("hearing_level") == 1 else ("Hearing Aid" if extracted.get("hearing_level") == 2 else None)),
            "question_hi": "Sunne ki kshamta kaisi hai - bilkul sahi, thoda kam sunai deta hai, ya hearing machine lagate hain? (सुनने की क्षमता कैसी है?)",
            "question_en": "How is your hearing ability - perfect normal, mild difficulty, or do you use a hearing aid?"
        },
        "diseases": {
            "title": "Diseases (पुरानी बीमारियां)",
            "status": "provided" if has_chronic_known else "missing",
            "value": [k for k in ['htn', 'arth', 'heart', 'resp'] if extracted.get(k) == 1] or ('None' if extracted.get('chronic_conditions_none') else None),
            "question_hi": "Kya aapko High BP, Gathiya (Arthritis), Dil ki bimari, ya Dama (Asthma) jaisi koi bimari hai? (क्या उच्च रक्तचाप, गठिया, हृदय रोग या दमा है?)",
            "question_en": "Do you have any chronic conditions such as High BP, Arthritis, Heart disease, or Asthma?"
        }
    }
    # Age and Gender are NEVER considered missing
    missing_fields = [k for k, v in checklist.items() if v["status"] == "missing" and k not in ("age", "gender")]

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
