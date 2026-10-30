import sys
import re
sys.stdout.reconfigure(encoding='utf-8')

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

with open('app.js', 'r', encoding='utf-8') as f:
    app_js = f.read()

print("=== IMG TAGS IN index.html ===")
matches_html = re.findall(r'<img[^>]*>', html, re.IGNORECASE)
for i, m in enumerate(matches_html):
    print(f"[{i+1}] {m}")

print("\n=== IMG TAGS IN app.js ===")
matches_js = re.findall(r'<img[^>]*>', app_js, re.IGNORECASE)
for i, m in enumerate(matches_js):
    print(f"[{i+1}] {m}")

print("\n=== PATIENT/AVATAR IMAGE URL REFERENCES IN app.js ===")
avatar_refs = re.findall(r'(avatar|photo|image|src)\s*[:=]\s*["\'][^"\']+["\']', app_js, re.IGNORECASE)
for r in avatar_refs[:20]:
    print(" -", r)

