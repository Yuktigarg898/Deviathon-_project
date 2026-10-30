import nlp_extractor

res = nlp_extractor.extract_clinical_entities_from_text(
    "mujhe ghutne me bahut tez dard hai aur chalne me lathi chahiye, bp 150/90 hai, oxygen 96 hai, sugar 160 hai, 6 ghante neend aayi, ek dawai bhool gaya",
    lang_hint="hi-IN"
)
print("Extracted keys:", list(res['extracted'].keys()))
print("Extracted values:", res['extracted'])
print("Missing fields:", res['missing_fields'])
print("Feedback Hi:", res['feedback']['hindi'])

