import subprocess
import time
import os

chrome = r'C:\Program Files\Google\Chrome\Application\chrome.exe'

# 1. Family Portal Screenshot
subprocess.run([
    chrome, '--headless=new', '--disable-gpu',
    '--screenshot=C:\\Users\\hp\\Deviathon\\screenshot_family_portal.png',
    '--window-size=1280,1100',
    'http://127.0.0.1:5000'
], capture_output=True, timeout=10)

print("screenshot_family_portal.png exists:", os.path.exists('screenshot_family_portal.png'))

