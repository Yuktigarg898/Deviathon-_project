import sys
sys.stdout.reconfigure(encoding='utf-8')

for fname in ['index.html', 'app.js', 'family_portal.js']:
    try:
        with open(fname, 'r', encoding='utf-8') as f:
            text = f.read()
        import re
        matches = [m.start() for m in re.finditer('onboard', text, re.IGNORECASE)]
        print(f"'{fname}': {len(matches)} matches for 'onboard'")
        for m in matches[:10]:
            print("  ", text[max(0, m-50):min(len(text), m+100)].replace('\n', ' '))
    except Exception as e:
        print(f"Error {fname}: {e}")

