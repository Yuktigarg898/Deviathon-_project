with open('app.js', 'r', encoding='utf-8') as f:
    text = f.read()

pos = text.find('if (nameLabel) nameLabel.textContent = user.name;')
print(text[pos-200:pos+300])

