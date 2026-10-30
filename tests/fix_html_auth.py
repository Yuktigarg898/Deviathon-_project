# -*- coding: utf-8 -*-
with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace escaped quotes
old1 = 'switchAuthTab(\\\'signin\\\')'
new1 = "switchAuthTab('signin')"
old2 = 'switchAuthTab(\\\'signup\\\')'
new2 = "switchAuthTab('signup')"

assert old1 in content, f"Target {old1} not found"
assert old2 in content, f"Target {old2} not found"

content = content.replace(old1, new1).replace(old2, new2)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Successfully replaced escaped switchAuthTab calls in index.html")

