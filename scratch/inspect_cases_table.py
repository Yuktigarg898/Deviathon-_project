with open("app.js", "r", encoding="utf-8", errors="ignore") as f:
    lines = f.readlines()

for i, l in enumerate(lines):
    if "function renderOpsCasesTable" in l:
        print(f"renderOpsCasesTable at line {i+1}")
        for j in range(i, min(i+60, len(lines))):
            print(lines[j], end="")
        break

