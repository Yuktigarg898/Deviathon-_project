import subprocess

old_html = subprocess.check_output(['git', 'show', '1dbe60a:index.html'], encoding='utf-8')
c_start = old_html.find('<section id="view-coordinator"')
c_end = old_html.find('</section>', c_start) + 10
print('Original coordinator section length:', c_end - c_start)

with open('orig_coordinator_html.txt', 'w', encoding='utf-8') as f:
    f.write(old_html[c_start:c_end])
print('Saved original coordinator HTML')

old_js = subprocess.check_output(['git', 'show', '1dbe60a:app.js'], encoding='utf-8')
js_start = old_js.find('// VIEW 1: CARE COORDINATOR LOGIC')
js_end = old_js.find('// VIEW 2: SENIOR LOGIC')
print('Original coordinator JS length:', js_end - js_start)

with open('orig_coordinator_js.txt', 'w', encoding='utf-8') as f:
    f.write(old_js[js_start:js_end])
print('Saved original coordinator JS')

