with open('app.js', 'r', encoding='utf-8') as f:
    text = f.read()

target = 'if (roleLabel) roleLabel.textContent = user.badge;'
rep = 'if (roleLabel) roleLabel.textContent = typeof user.badge === "object" ? (user.badge.en || "Family Member") : (user.badge || "Family Member");'

assert target in text
text = text.replace(target, rep)

with open('app.js', 'w', encoding='utf-8') as f:
    f.write(text)

print("Fixed [OBJECT OBJECT] badge display in app.js!")

