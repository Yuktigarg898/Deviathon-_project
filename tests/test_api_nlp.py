import urllib.request
import json

url = "http://127.0.0.1:5000/api/audio/extract-form"

# Test 1: Hindi input with synonyms
data1 = {
    "transcript": "mujhe sir me bahut tez dard hai aur chakkar aa rahe hain, bp 150/90 hai, dhadkan 84 hai, oxygen 96 hai, 5 ghante neend aayi, sugar 165 hai",
    "language": "hi-IN",
    "current_entities": {}
}

req1 = urllib.request.Request(
    url,
    data=json.dumps(data1).encode('utf-8'),
    headers={"Content-Type": "application/json"}
)

resp1 = json.loads(urllib.request.urlopen(req1).read().decode('utf-8'))
print("=== API NLP Extraction Test 1 (Hindi Synonyms) ===")
print("Success:", resp1.get('success'))
print("Extracted Age:", resp1['extracted'].get('age'), "(Auto-detected from profile)")
print("Extracted Gender:", resp1['extracted'].get('gender'), "(Auto-detected from profile)")
print("Extracted BP:", resp1['extracted'].get('bp_sys'), "/", resp1['extracted'].get('bp_dia'))
print("Extracted Heart Rate:", resp1['extracted'].get('heart_rate'))
print("Extracted SpO2:", resp1['extracted'].get('spo2'))
print("Extracted Pain Loc:", resp1['extracted'].get('pain_loc'), "Level:", resp1['extracted'].get('pain_level'))
print("Extracted Sleep:", resp1['extracted'].get('sleep_hours'))
print("Extracted Sugar:", resp1['extracted'].get('sugar_level'))
print("Missing Fields:", resp1.get('missing_fields'))

assert 'age' not in resp1.get('missing_fields', []), "Age must NOT be in missing fields!"
assert 'gender' not in resp1.get('missing_fields', []), "Gender must NOT be in missing fields!"
assert resp1['extracted'].get('bp_sys') == 150
assert resp1['extracted'].get('bp_dia') == 90
assert resp1['extracted'].get('heart_rate') == 84
assert resp1['extracted'].get('spo2') == 96.0
assert resp1['extracted'].get('pain_level') == 8.0
print("Test 1 PASSED!\n")

# Test 2: Hindi input with mobility & missed doses & breathing synonyms
data2 = {
    "transcript": "ghutno me dard hai aur chalne me lathi chahiye, kal ki dawa bhool gaya tha, saans phoolti hai",
    "language": "hi-IN",
    "current_entities": resp1['extracted']
}

req2 = urllib.request.Request(
    url,
    data=json.dumps(data2).encode('utf-8'),
    headers={"Content-Type": "application/json"}
)

resp2 = json.loads(urllib.request.urlopen(req2).read().decode('utf-8'))
print("=== API NLP Extraction Test 2 (Mobility, Missed Meds, Respiratory) ===")
print("Extracted Walk:", resp2['extracted'].get('walk'), "(0 = Needs help / stick)")
print("Extracted Missed Doses:", resp2['extracted'].get('missed_doses'))
print("Extracted Respiratory (saans phoolna):", resp2['extracted'].get('resp'))
print("Extracted Pain Loc:", resp2['extracted'].get('pain_loc'))
print("Missing Fields:", resp2.get('missing_fields'))

assert resp2['extracted'].get('walk') == 0
assert resp2['extracted'].get('missed_doses') in (1, 2)
assert resp2['extracted'].get('resp') == 1
assert 'age' not in resp2.get('missing_fields', [])
assert 'gender' not in resp2.get('missing_fields', [])
print("Test 2 PASSED!")

