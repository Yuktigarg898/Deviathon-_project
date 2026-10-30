with open('app.js', 'r', encoding='utf-8') as f:
    text = f.read()

target = '  renderOpsTeamTable();\n  populateOpsIncidentStream();\n});'
rep = '''  renderOpsTeamTable();
  populateOpsIncidentStream();

  // URL Hash Navigation (#family, #coordinator, #senior, #operations)
  if (window.location.hash) {
    const targetHash = window.location.hash.replace('#', '').toLowerCase();
    if (['coordinator', 'senior', 'family', 'operations'].includes(targetHash)) {
      enterDashboard(targetHash);
    }
  }
});'''

assert target in text, "target not found"
text = text.replace(target, rep, 1)

with open('app.js', 'w', encoding='utf-8') as f:
    f.write(text)

print("Added URL hash auto-navigation to app.js!")

