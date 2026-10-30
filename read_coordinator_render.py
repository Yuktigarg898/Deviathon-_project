import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('app.js', 'r', encoding='utf-8') as f:
    app_js = f.read()

import re
pos = app_js.find('renderCoordinatorAlerts')
if pos == -1: pos = app_js.find('function filterCoordinatorAlerts')
print("Coordinator render section:")
print(app_js[pos:pos+1500])

