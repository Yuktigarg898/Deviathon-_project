with open('app.js', 'r', encoding='utf-8') as f:
    text = f.read()

pos = text.find('function renderOpsDashboardEldersTable(')
if pos != -1:
    print(text[pos:pos+700])
else:
    print("renderOpsDashboardEldersTable not found")

