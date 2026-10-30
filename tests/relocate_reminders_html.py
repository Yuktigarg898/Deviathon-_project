import sys

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Extract senior-reminders-section block
    start_tag = '<div id="senior-reminders-section"'
    end_tag = '<!-- Dynamic Reminders Grid -->\n          <div id="senior-reminders-grid" class="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mt-4">\n            <!-- Populated by renderSeniorReminders() -->\n          </div>\n        </div>'
    
    start_pos = content.find(start_tag)
    if start_pos == -1:
        print(f"Warning: {start_tag} not found in {filepath}")
        return False
    
    end_pos = content.find(end_tag, start_pos)
    if end_pos == -1:
        print(f"Warning: {end_tag} not found in {filepath}")
        return False
    
    end_pos += len(end_tag)
    
    reminders_block = content[start_pos:end_pos].strip()
    
    # Remove from above assessment section
    content_without = content[:start_pos] + content[end_pos:]
    
    # 2. Insert into view-add-reminder before </section>
    add_rem_closing = '      </div>\n    </section>\n\n<section id="view-family"'
    if add_rem_closing not in content_without:
        # try more flexible match
        add_rem_closing_alt = '      </div>\n    </section>'
        pos = content_without.find('id="view-add-reminder"')
        sec_end = content_without.find('    </section>', pos)
        if sec_end == -1:
            print(f"Warning: cannot find end of view-add-reminder in {filepath}")
            return False
        
        replacement = '\n\n      <!-- ALL SENIOR CARE REMINDERS & ALARM CONTROLS -->\n      ' + reminders_block + '\n    </section>'
        content_with_rem = content_without[:sec_end] + replacement + content_without[sec_end + len('    </section>'):]
    else:
        replacement = '      </div>\n\n      <!-- ALL SENIOR CARE REMINDERS & ALARM CONTROLS -->\n      ' + reminders_block + '\n    </section>\n\n<section id="view-family"'
        content_with_rem = content_without.replace(add_rem_closing, replacement)

    # 3. Add Manage Reminders button to Upcoming Routine Schedule card
    test_alarm_btn = '''          <button onclick="testSampleReminderAlarm()"
            class="flex-1 sm:flex-none px-3.5 py-2 rounded-xl bg-white hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-black shadow-xs transition-all flex items-center justify-center space-x-1.5 active:scale-95">
            <i class="fa-solid fa-bell text-amber-600"></i>
            <span>Test Alarm / बजाएं</span>
          </button>'''

    new_btns = '''          <button onclick="testSampleReminderAlarm()"
            class="flex-1 sm:flex-none px-3.5 py-2 rounded-xl bg-white hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-black shadow-xs transition-all flex items-center justify-center space-x-1.5 active:scale-95">
            <i class="fa-solid fa-volume-high text-amber-600"></i>
            <span>Test Alarm / बजाएं</span>
          </button>
          <button onclick="openAddReminderPage()"
            class="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white border border-amber-500 text-xs font-black shadow-xs transition-all flex items-center justify-center space-x-1.5 active:scale-95">
            <i class="fa-solid fa-bell"></i>
            <span>Manage Reminders / रिमाइंडर देखें</span>
          </button>'''

    if test_alarm_btn in content_with_rem:
        content_with_rem = content_with_rem.replace(test_alarm_btn, new_btns, 1)

    # 4. Update tile 2 click action
    old_tile2 = "onclick=\"document.getElementById('senior-reminders-section').scrollIntoView({ behavior: 'smooth' })\""
    new_tile2 = "onclick=\"openAddReminderPage()\""
    content_with_rem = content_with_rem.replace(old_tile2, new_tile2)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content_with_rem)
    print(f"Successfully processed {filepath}")
    return True

if __name__ == '__main__':
    process_file('index.html')
    import os
    if os.path.exists('Deviathon/index.html'):
        process_file('Deviathon/index.html')

