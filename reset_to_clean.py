# -*- coding: utf-8 -*-
import subprocess

# 1. Read clean original index.html from commit 1dbe60a
clean_index = subprocess.check_output(['git', 'show', '1dbe60a:index.html'], encoding='utf-8')

# Let's verify that clean_index has the original simple coordinator view
assert 'id="view-coordinator"' in clean_index
assert 'Daily Senior Priority Triage Queue' in clean_index
print("Clean index.html loaded from 1dbe60a, length:", len(clean_index))

# 2. Read clean original app.js from commit 1dbe60a
clean_app = subprocess.check_output(['git', 'show', '1dbe60a:app.js'], encoding='utf-8')
assert 'function renderCoordinatorAlerts' in clean_app
print("Clean app.js loaded from 1dbe60a, length:", len(clean_app))

# Save them as our base
with open('index.html', 'w', encoding='utf-8') as f:
    f.write(clean_index)

with open('app.js', 'w', encoding='utf-8') as f:
    f.write(clean_app)

print("index.html and app.js reset to original state (1dbe60a) successfully!")

