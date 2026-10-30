# -*- coding: utf-8 -*-
"""
End-to-End Test Suite for Devanagari Hindi Clinical NLP Entity Extraction & Synonym Recognition.
"""

import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
import json
import nlp_extractor as nlp

# Ensure UTF-8 stdout
sys.stdout.reconfigure(encoding='utf-8')

def run_tests():
    print("==================================================")
    print("Testing Clinical NLP with Pure Devanagari Hindi")
    print("==================================================")

    # Test 1: Full clinical sentence with Devanagari Hindi numerals and words
    hindi_speech_1 = (
        "मेरा वजन अड़सठ किलो है और लंबाई एक सौ पैंसठ सेंटीमीटर है। "
        "रक्तचाप एक सौ चालीस और पचासी है, धड़कन अठहत्तर है, ऑक्सीजन ९७ प्रतिशत है। "
        "मुझे घुटने में दर्द है और दर्द का पैमाना पांच है। "
        "नींद सात घंटे आती है। "
        "मैं बिना सहारे खुद चल लेता हूँ, खाना खुद खा लेता हूँ, बिस्तर से अपने आप उठ जाता हूँ, और शौचालय खुद चला जाता हूँ। "
        "दिन में तीन दवाइयां लेता हूँ और कोई खुराक नहीं छूटी। "
        "मुझे मधुमेह नहीं है और शुगर एक सौ चालीस है। "
        "सुनने में कोई दिक्कत नहीं है बिल्कुल सामान्य सुनता हूँ। "
        "मुझे उच्च रक्तचाप और गठिया की बीमारी है।"
    )

    res1 = nlp.extract_clinical_entities_from_text(hindi_speech_1)
    extracted1 = res1["extracted"]
    missing1 = res1["missing_fields"]
    is_ready1 = res1["is_ready_for_assessment"]

    print(f"\n[Test 1] Missing fields count: {len(missing1)}")
    print(f"[Test 1] Missing fields list: {missing1}")
    print(f"[Test 1] Is ready for assessment: {is_ready1}")
    print(f"[Test 1] Extracted Entities:")
    for k, v in extracted1.items():
        print(f"  - {k}: {v}")

    # Assertions for Test 1
    assert extracted1.get("age") == 74, f"Age expected 74, got {extracted1.get('age')}"
    assert extracted1.get("gender") == "Male", f"Gender expected Male, got {extracted1.get('gender')}"
    assert extracted1.get("weight") == 68.0, f"Weight expected 68.0, got {extracted1.get('weight')}"
    assert extracted1.get("height") == 165.0, f"Height expected 165.0, got {extracted1.get('height')}"
    assert extracted1.get("bp_sys") == 140, f"BP Sys expected 140, got {extracted1.get('bp_sys')}"
    assert extracted1.get("bp_dia") == 85, f"BP Dia expected 85, got {extracted1.get('bp_dia')}"
    assert extracted1.get("heart_rate") == 78, f"Heart rate expected 78, got {extracted1.get('heart_rate')}"
    assert extracted1.get("spo2") == 97.0, f"SpO2 expected 97.0, got {extracted1.get('spo2')}"
    assert extracted1.get("pain_present") == 1, f"Pain present expected 1, got {extracted1.get('pain_present')}"
    assert extracted1.get("pain_loc") == "Knee", f"Pain loc expected Knee, got {extracted1.get('pain_loc')}"
    assert extracted1.get("pain_level") == 5.0, f"Pain level expected 5.0, got {extracted1.get('pain_level')}"
    assert extracted1.get("sleep_hours") == 7.0, f"Sleep hours expected 7.0, got {extracted1.get('sleep_hours')}"
    assert extracted1.get("walk") == 1, f"Walk expected 1, got {extracted1.get('walk')}"
    assert extracted1.get("eat") == 1, f"Eat expected 1, got {extracted1.get('eat')}"
    assert extracted1.get("move") == 1, f"Move expected 1, got {extracted1.get('move')}"
    assert extracted1.get("toilet") == 1, f"Toilet expected 1, got {extracted1.get('toilet')}"
    assert extracted1.get("med_count") == 3, f"Med count expected 3, got {extracted1.get('med_count')}"
    assert extracted1.get("missed_doses") == 0, f"Missed doses expected 0, got {extracted1.get('missed_doses')}"
    assert extracted1.get("sugar_level") == 140, f"Sugar level expected 140, got {extracted1.get('sugar_level')}"
    assert extracted1.get("hearing_level") == 0, f"Hearing level expected 0, got {extracted1.get('hearing_level')}"
    assert extracted1.get("htn") == 1, f"HTN expected 1, got {extracted1.get('htn')}"
    assert extracted1.get("arth") == 1, f"Arth expected 1, got {extracted1.get('arth')}"
    assert len(missing1) == 0, f"Expected 0 missing fields, got {missing1}"
    assert is_ready1 is True, "Expected is_ready_for_assessment to be True"
    print(">>> Test 1 Passed Successfully! All 19 parameters extracted from Devanagari Hindi!")

    # Test 2: Devanagari synonyms for Pain-Free, Dependent ADLs, Severe Pain in Back, etc.
    hindi_speech_2 = (
        "मेरी उम्र बहत्तर वर्ष है और मैं एक महिला हूँ। "
        "वजन बावन किलो और ऊँचाई एक सौ बावन सेमी है। "
        "बीपी ऊपर का एक सौ पचास और नीचे का नब्बे है। नाड़ी बयासी है, ऑक्सीजन छियानवे है। "
        "कमर में तीव्र असहनीय पीड़ा है। रात में चार घंटे सोती हूँ। "
        "चलने के लिए छड़ी का सहारा चाहिए, खाना खिलाना पड़ता है, उठने में सहारा लगता है, और शौचालय में मदद चाहिए। "
        "चार दवाइयां लेती हूँ लेकिन सुबह की खुराक छूट गई। "
        "मधुमेह है और शुगर दो सौ बीस है। "
        "कान की मशीन लगाती हूँ। "
        "दिल की बीमारी और दमा है।"
    )

    res2 = nlp.extract_clinical_entities_from_text(hindi_speech_2)
    extracted2 = res2["extracted"]
    missing2 = res2["missing_fields"]
    is_ready2 = res2["is_ready_for_assessment"]

    print(f"\n[Test 2] Missing fields count: {len(missing2)}")
    print(f"[Test 2] Missing fields list: {missing2}")
    print(f"[Test 2] Extracted Entities:")
    for k, v in extracted2.items():
        print(f"  - {k}: {v}")

    assert extracted2.get("age") == 72, f"Age expected 72, got {extracted2.get('age')}"
    assert extracted2.get("gender") == "Female", f"Gender expected Female, got {extracted2.get('gender')}"
    assert extracted2.get("weight") == 52.0, f"Weight expected 52.0, got {extracted2.get('weight')}"
    assert extracted2.get("height") == 152.0, f"Height expected 152.0, got {extracted2.get('height')}"
    assert extracted2.get("bp_sys") == 150, f"BP Sys expected 150, got {extracted2.get('bp_sys')}"
    assert extracted2.get("bp_dia") == 90, f"BP Dia expected 90, got {extracted2.get('bp_dia')}"
    assert extracted2.get("pain_loc") == "Back", f"Pain loc expected Back, got {extracted2.get('pain_loc')}"
    assert extracted2.get("pain_level") == 8.0, f"Pain level expected 8.0 (severe), got {extracted2.get('pain_level')}"
    assert extracted2.get("walk") == 0, f"Walk expected 0 (dependent), got {extracted2.get('walk')}"
    assert extracted2.get("eat") == 0, f"Eat expected 0 (dependent), got {extracted2.get('eat')}"
    assert extracted2.get("move") == 0, f"Move expected 0 (dependent), got {extracted2.get('move')}"
    assert extracted2.get("toilet") == 0, f"Toilet expected 0 (dependent), got {extracted2.get('toilet')}"
    assert extracted2.get("med_count") == 4, f"Med count expected 4, got {extracted2.get('med_count')}"
    assert extracted2.get("missed_doses") == 1, f"Missed doses expected 1, got {extracted2.get('missed_doses')}"
    assert extracted2.get("diabetic") == 1, f"Diabetic expected 1, got {extracted2.get('diabetic')}"
    assert extracted2.get("hearing_level") == 2, f"Hearing level expected 2 (hearing aid), got {extracted2.get('hearing_level')}"
    assert extracted2.get("heart") == 1, f"Heart expected 1, got {extracted2.get('heart')}"
    assert extracted2.get("resp") == 1, f"Resp expected 1, got {extracted2.get('resp')}"
    assert len(missing2) == 0, f"Expected 0 missing fields, got {missing2}"
    print(">>> Test 2 Passed Successfully! Female demographics, dependent ADLs, severe pain & hearing aid recognized!")

    # Test 3: Pain-free scenario in Devanagari Hindi
    hindi_speech_3 = "कोई दर्द या पीड़ा नहीं है, बिल्कुल स्वस्थ हूँ। कोई बीमारी नहीं है।"
    res3 = nlp.extract_clinical_entities_from_text(hindi_speech_3)
    extracted3 = res3["extracted"]
    assert extracted3.get("pain_present") == 0, f"Pain present expected 0, got {extracted3.get('pain_present')}"
    assert extracted3.get("pain_level") == 0.0, f"Pain level expected 0.0, got {extracted3.get('pain_level')}"
    assert extracted3.get("pain_loc") == "None", f"Pain loc expected None, got {extracted3.get('pain_loc')}"
    assert extracted3.get("htn") == 0 and extracted3.get("arth") == 0, "Expected chronic diseases 0"
    print(">>> Test 3 Passed Successfully! Pain-free and disease-free Devanagari Hindi phrases recognized!")

    print("\n==================================================")
    print("ALL DEVANAGARI HINDI NLP SUITE TESTS PASSED (3/3)!")
    print("==================================================")

if __name__ == "__main__":
    run_tests()
