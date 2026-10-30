with open("app.js", "r", encoding="utf-8", errors="ignore") as f:
    text = f.read()

import re
matches = re.findall(r'function (triggerOpsDispatch[A-Za-z0-9_]*|openOpsAlert[A-Za-z0-9_]*|switchOps[A-Za-z0-9_]*|renderOps[A-Za-z0-9_]*)\(', text)
print("Ops functions in app.js:", set(matches))

