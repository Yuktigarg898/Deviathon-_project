# -*- coding: utf-8 -*-
with open('index.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

start_rem = -1
end_rem = -1

for i, line in enumerate(lines):
    if 'id="senior-reminders-section"' in line:
        start_rem = i
    if start_rem != -1 and 'id="senior-assessment-section"' in line:
        end_rem = i
        break

print(f"senior-reminders-section starts at line {start_rem+1}, assessment starts at line {end_rem+1}")
print("Lines before assessment:")
for j in range(end_rem - 5, end_rem + 2):
    print(j+1, repr(lines[j]))

