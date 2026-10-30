# -*- coding: utf-8 -*-
with open('index.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

start_add_rem = -1
end_add_rem = -1

for i, line in enumerate(lines):
    if 'id="view-add-reminder"' in line:
        start_add_rem = i
    if start_add_rem != -1 and 'id="view-family"' in line:
        end_add_rem = i
        break

print(f"view-add-reminder starts at line {start_add_rem+1}, view-family starts at line {end_add_rem+1}")
print("Lines around end:")
for j in range(end_add_rem - 5, end_add_rem + 2):
    print(j+1, repr(lines[j]))

