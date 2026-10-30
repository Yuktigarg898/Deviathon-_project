with open('styles.css', 'r', encoding='utf-8') as f:
    lines = f.readlines()

# keep lines up to line 690 (index 690)
cleaned_lines = lines[:690]

with open('styles_patch.css', 'r', encoding='utf-8') as f:
    patch = f.read()

new_content = "".join(cleaned_lines) + "\n" + patch

with open('styles.css', 'w', encoding='utf-8') as f:
    f.write(new_content)

print("styles.css cleaned and updated!")

