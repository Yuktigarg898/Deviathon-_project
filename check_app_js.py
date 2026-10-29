with open(r'D:\OneDrive\Desktop\Deviathon\Deviathon\app.js', 'r', encoding='utf-8') as f:
    text = f.read()

import re
print("Length of app.js:", len(text))
funcs = re.findall(r'function\s+([a-zA-Z0-9_]+)\s*\(', text)
print("Total functions in app.js:", len(funcs))
print("Newly added functions:", [f for f in funcs if 'Assess' in f or 'Pain' in f or 'ADL' in f or 'BMI' in f or 'Sugar' in f or 'predict' in f.lower()])



