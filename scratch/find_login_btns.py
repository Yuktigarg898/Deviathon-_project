with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

import re
matches = re.findall(r'<button[^>]*id=\"[^\"]*login[^\"]*\"[^>]*>', text)
print(matches)

matches2 = re.findall(r'<button[^>]*onclick=\"[^\"]*loginAs[^\"]*\"[^>]*>', text)
print(matches2)

