import sys
import os
sys.path.insert(0, os.path.abspath('Deviathon'))
import nlp_extractor

# Test 1: Spoken input without age and gender
res1 = nlp_extractor.extract_clinical_entities_from_text(
    "mujhe ghutno me bahut tez dard hai aur chalne me lathi chahiye, bp 150 aur 90 hai, pulse 80 hai, oxygen 96 hai, sugar 160 hai, 6 ghante neend aayi, kal ki dawa bhool gaya tha, saans phoolti hai",
    lang_hint="hi-IN"
)

print("Test 1:")
print("Extracted Age:", res1['extracted'].get('age'))
print("Extracted Gender:", res1['extracted'].get('gender'))
print("Extracted BP:", res1['extracted'].get('bp_sys'), "/", res1['extracted'].get('bp_dia'))
print("Extracted HR:", res1['extracted'].get('heart_rate'))
print("Extracted SpO2:", res1['extracted'].get('spo2'))
print("Extracted Pain:", res1['extracted'].get('pain_loc'), "Level:", res1['extracted'].get('pain_level'))
print("Extracted Walk:", res1['extracted'].get('walk'))
print("Extracted Missed Doses:", res1['extracted'].get('missed_doses'))
print("Extracted Respiratory (saans phoolna):", res1['extracted'].get('resp'))
print("Missing Fields:", res1['missing_fields'])
assert 'age' not in res1['missing_fields'], "age should NOT be in missing fields!"
assert 'gender' not in res1['missing_fields'], "gender should NOT be in missing fields!"
print("Age and Gender auto-detection and missing fields check PASSED!")

# Test 2: English synonyms
res2 = nlp_extractor.extract_clinical_entities_from_text(
    "Severe back pain scale 8, cannot walk without stick, missed 1 dose of medicine, blood pressure 140 over 90, heart rate 82, oxygen 97, sleep 5 hours",
    lang_hint="en-US"
)
print("\nTest 2 (English):")
print("Pain loc:", res2['extracted'].get('pain_loc'), "level:", res2['extracted'].get('pain_level'))
print("Walk:", res2['extracted'].get('walk'))
print("Missed doses:", res2['extracted'].get('missed_doses'))
print("BP:", res2['extracted'].get('bp_sys'), "/", res2['extracted'].get('bp_dia'))
print("Missing Fields:", res2['missing_fields'])
assert 'age' not in res2['missing_fields']
assert 'gender' not in res2['missing_fields']
print("ALL TESTS PASSED!")

