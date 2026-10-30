import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

import re
matches = re.findall(r'id="family-[^"]+"', html)
print("Family IDs in index.html:")
for m in matches:
    print(" -", m)

