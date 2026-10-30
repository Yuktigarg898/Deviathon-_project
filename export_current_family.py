with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

f_start = html.find('id="view-family"')
f_end = html.find('id="view-operations"')
with open('current_family_view.html', 'w', encoding='utf-8') as f_out:
    f_out.write(html[f_start-9:f_end-20])

print("Written current_family_view.html, lines:", html[f_start-9:f_end-20].count('\n'))

