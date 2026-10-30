with open("app.js", "r", encoding="utf-8", errors="ignore") as f:
    lines = f.readlines()

for i, l in enumerate(lines):
    if "function triggerOpsDispatchNurse" in l or "function switchOpsTab" in l:
        print(f"--- Line {i+1} ---")
        for j in range(i, min(i+45, len(lines))):
            print(lines[j], end="")

