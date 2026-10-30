with open('app.js', 'r', encoding='utf-8') as f:
    text = f.read()

target = """    if (['coordinator', 'senior', 'family', 'operations'].includes(targetHash)) {
      enterDashboard(targetHash);
    }"""

rep = """    if (['coordinator', 'senior', 'family', 'operations'].includes(targetHash)) {
      enterDashboard(targetHash);
    } else if (targetHash === 'family-report') {
      enterDashboard('family');
      switchFamilyTab('report');
    } else if (targetHash === 'family-history') {
      enterDashboard('family');
      switchFamilyTab('history');
    }"""

assert target in text
text = text.replace(target, rep, 1)

with open('app.js', 'w', encoding='utf-8') as f:
    f.write(text)

print("Added family tab subhash support to app.js!")

