with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

import re
matches = re.findall(r'<section[^>]*id=\"view-coordinator\"[^>]*>.*?</section>', text, re.DOTALL)
if matches:
    print("Found view-coordinator, length:", len(matches[0]))
    # Search for tasks / visits in view-coordinator
    v_text = matches[0]
    tasks_matches = re.findall(r'id=\"[^\"]*(?:task|visit|patient|senior|call)[^\"]*\"', v_text)
    print("Coordinator task/visit IDs:", set(tasks_matches[:20]))
else:
    print("view-coordinator not found")

