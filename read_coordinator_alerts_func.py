import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('app.js', 'r', encoding='utf-8') as f:
    app_js = f.read()

pos = app_js.find('function renderCoordinatorAlerts(')
print(app_js[pos:pos+2500])

