import sys
import re
sys.stdout.reconfigure(encoding='utf-8')

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Search within each of the 4 views
for view_id in ['view-coordinator', 'view-senior', 'view-family', 'view-operations', 'global-header']:
    pos = html.find(f'id="{view_id}"')
    if pos != -1:
        pos_end = html.find('</section>', pos)
        if pos_end == -1: pos_end = pos + 25000
        section = html[pos:pos_end]
        imgs = re.findall(r'<img[^>]*>', section, re.IGNORECASE)
        print(f"=== {view_id} has {len(imgs)} <img> tags ===")
        for img in imgs:
            print("  ", img)
    else:
        print(f"=== {view_id} not found ===")

