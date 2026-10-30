import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('app.js', 'r', encoding='utf-8') as f:
    text = f.read()

import re
matches = re.findall(r'\{"id":\s*"(PAT-\d+)",\s*"username":\s*"([^"]+)",\s*"name":\s*"([^"]+)"', text)
print("Found patients:")
for m in matches:
    print(" -", m)

