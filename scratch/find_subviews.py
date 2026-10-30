with open("index.html", "r", encoding="utf-8", errors="ignore") as f:
    lines = f.readlines()

for i, l in enumerate(lines):
    if 'class="ops-subview' in l or 'id="ops-subview-' in l:
        print(f"Line {i+1}: {l.strip()[:100]}")

