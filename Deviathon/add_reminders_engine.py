import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('app.js', 'r', encoding='utf-8') as f:
    code = f.read()

# 1. Update soundEngine to support continuous reminder alarm
old_sound_engine = """const soundEngine = {
  ctx: null,
  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
  },"""

new_sound_engine = """const soundEngine = {
  ctx: null,
  alarmInterval: null,
  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
  },
  startReminderAlarm() {
    this.stopReminderAlarm();
    this.init();
    const playAlarmBeeps = () => {
      // 3 melodic medical alarm tones: G5 (784Hz) -> A5 (880Hz) -> C6 (1046Hz)
      this.playTone(784, 'sine', 0.16, 0);
      this.playTone(880, 'sine', 0.16, 0.20);
      this.playTone(1046, 'sine', 0.22, 0.40);
    };
    playAlarmBeeps();
    this.alarmInterval = setInterval(playAlarmBeeps, 2000);
  },
  stopReminderAlarm() {
    if (this.alarmInterval) {
      clearInterval(this.alarmInterval);
      this.alarmInterval = null;
    }
  },"""

if old_sound_engine in code:
    code = code.replace(old_sound_engine, new_sound_engine, 1)
    print("1. Added startReminderAlarm() and stopReminderAlarm() to soundEngine!")
else:
    print("Warning: old_sound_engine not found in app.js")

# 2. Update enterDashboard() to initialize reminders
old_enter_dashboard_senior = """      if (typeof autoFillSeniorProfileData === 'function') {
        autoFillSeniorProfileData();
      }"""

new_enter_dashboard_senior = """      if (typeof autoFillSeniorProfileData === 'function') {
        autoFillSeniorProfileData();
      }
      if (typeof initSeniorRemindersHub === 'function') {
        initSeniorRemindersHub();
      }"""

if old_enter_dashboard_senior in code:
    code = code.replace(old_enter_dashboard_senior, new_enter_dashboard_senior, 1)
    print("2. Added initSeniorRemindersHub() to enterDashboard('senior')!")
else:
    print("Warning: old_enter_dashboard_senior not found in app.js")

# 3. Append the Complete Reminders & Device Alarm Engine
reminders_engine_code = """
// =========================================================================
// DAILY CARE REMINDERS & DEVICE ALARM ENGINE (पानी, भोजन, दवा रिमाइंडर)
// =========================================================================

const defaultSeniorReminders = [
  {
    id: 'rem-water-1',
    title: 'Drink 1 Glass Warm Water / सुबह 1 गिलास पानी',
    category: 'water',
    time: '08:00',
    timeDisplay: '08:00 AM',
    notes: 'Warm water supports hydration, gentle gut motility and kidney vitality.',
    enabled: true,
    completedToday: false,
    lastTriggeredDate: '',
    icon: 'fa-solid fa-glass-water',
    color: 'text-sky-600 bg-sky-50 border-sky-200'
  },
  {
    id: 'rem-med-1',
    title: 'BP Medicine (Amlodipine 5mg) / सुबह की दवा',
    category: 'medicine',
    time: '08:30',
    timeDisplay: '08:30 AM',
    notes: 'Take with warm water after food to stabilize morning cardiovascular pressure.',
    enabled: true,
    completedToday: false,
    lastTriggeredDate: '',
    icon: 'fa-solid fa-pills',
    color: 'text-purple-600 bg-purple-50 border-purple-200'
  },
  {
    id: 'rem-food-1',
    title: 'Nutritious Breakfast / पौष्टिक नाश्ता',
    category: 'food',
    time: '09:00',
    timeDisplay: '09:00 AM',
    notes: 'Oats / dalia / boiled egg or warm khichdi with fruit.',
    enabled: true,
    completedToday: false,
    lastTriggeredDate: '',
    icon: 'fa-solid fa-utensils',
    color: 'text-amber-600 bg-amber-50 border-amber-200'
  },
  {
    id: 'rem-water-2',
    title: 'Mid-Day Hydration (1 Glass) / दोपहर का पानी',
    category: 'water',
    time: '11:30',
    timeDisplay: '11:30 AM',
    notes: 'Regular fluid intake prevents dehydration headaches and blood viscosity spikes.',
    enabled: true,
    completedToday: false,
    lastTriggeredDate: '',
    icon: 'fa-solid fa-glass-water',
    color: 'text-sky-600 bg-sky-50 border-sky-200'
  },
  {
    id: 'rem-food-2',
    title: 'Balanced Lunch / दोपहर का भोजन',
    category: 'food',
    time: '13:30',
    timeDisplay: '01:30 PM',
    notes: 'Low-sodium roti, steamed seasonal vegetables, dal, and fresh curd.',
    enabled: true,
    completedToday: false,
    lastTriggeredDate: '',
    icon: 'fa-solid fa-bowl-food',
    color: 'text-amber-600 bg-amber-50 border-amber-200'
  },
  {
    id: 'rem-med-2',
    title: 'Afternoon Calcium & Multivitamin / दोपहर की दवा',
    category: 'medicine',
    time: '14:00',
    timeDisplay: '02:00 PM',
    notes: 'Bone strength supplement as advised by Dr. Alok Mehta.',
    enabled: true,
    completedToday: false,
    lastTriggeredDate: '',
    icon: 'fa-solid fa-capsules',
    color: 'text-purple-600 bg-purple-50 border-purple-200'
  },
  {
    id: 'rem-water-3',
    title: 'Evening Hydration & Herbal Tea / शाम का पानी',
    category: 'water',
    time: '16:30',
    timeDisplay: '04:30 PM',
    notes: 'Warm water or mild herbal green tea for comfortable circulation.',
    enabled: true,
    completedToday: false,
    lastTriggeredDate: '',
    icon: 'fa-solid fa-glass-water',
    color: 'text-sky-600 bg-sky-50 border-sky-200'
  },
  {
    id: 'rem-food-3',
    title: 'Light Dinner / रात्रि का हल्का भोजन',
    category: 'food',
    time: '20:00',
    timeDisplay: '08:00 PM',
    notes: 'Easily digestible soup, steamed vegetables, and light multigrain roti.',
    enabled: true,
    completedToday: false,
    lastTriggeredDate: '',
    icon: 'fa-solid fa-utensils',
    color: 'text-amber-600 bg-amber-50 border-amber-200'
  },
  {
    id: 'rem-med-3',
    title: 'Night Medicine & Cardiac Regimen / रात की दवा',
    category: 'medicine',
    time: '21:30',
    timeDisplay: '09:30 PM',
    notes: 'Night regimen for sustained blood pressure regulation during sleep.',
    enabled: true,
    completedToday: false,
    lastTriggeredDate: '',
    icon: 'fa-solid fa-pills',
    color: 'text-purple-600 bg-purple-50 border-purple-200'
  }
];

let currentRemindersFilter = 'all';
let remindersTickerInterval = null;
let liveClockInterval = null;
let activeAlarmReminder = null;

function getSeniorReminders() {
  try {
    const raw = localStorage.getItem('careconnect_senior_reminders');
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.warn('Error reading reminders from localStorage:', e);
  }
  return defaultSeniorReminders.slice();
}

function saveSeniorReminders(reminders) {
  try {
    localStorage.setItem('careconnect_senior_reminders', JSON.stringify(reminders));
  } catch (e) {
    console.error('Failed to save reminders:', e);
  }
}

function format24to12Time(time24) {
  if (!time24) return '--:--';
  const parts = time24.split(':');
  let h = parseInt(parts[0], 10);
  const m = parts[1] || '00';
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12;
  h = h ? h : 12;
  return `${h < 10 ? '0' + h : h}:${m} ${ampm}`;
}

function getTodayWaterLogged() {
  const todayKey = 'careconnect_water_' + new Date().toISOString().split('T')[0];
  return parseInt(localStorage.getItem(todayKey)) || 4;
}

function setTodayWaterLogged(count) {
  const todayKey = 'careconnect_water_' + new Date().toISOString().split('T')[0];
  localStorage.setItem(todayKey, count.toString());
  updateWaterTrackerDisplay();
}

function updateWaterTrackerDisplay() {
  const counter = document.getElementById('water-logged-counter');
  const iconsContainer = document.getElementById('water-glasses-icons');
  if (!counter || !iconsContainer) return;

  const count = getTodayWaterLogged();
  const total = 8;
  const liters = (count * 0.25).toFixed(1);
  counter.textContent = `${count} / ${total} Glasses (${liters}L of 2.0L)`;

  let iconsHtml = '';
  for (let i = 1; i <= total; i++) {
    if (i <= count) {
      iconsHtml += `<span class="inline-block transition-transform hover:scale-125" title="Glass ${i}: Logged ✓">💧</span>`;
    } else {
      iconsHtml += `<span class="inline-block opacity-40 hover:opacity-80 transition-opacity" title="Glass ${i}: Pending">🥛</span>`;
    }
  }
  iconsContainer.innerHTML = iconsHtml;
}

function logWaterGlass() {
  let count = getTodayWaterLogged();
  if (count < 12) {
    count++;
    setTodayWaterLogged(count);
    soundEngine.playTone(880, 'sine', 0.15);
    setTimeout(() => soundEngine.playTone(1174, 'sine', 0.2), 120);
    showToast(`Hydration logged! ${count} / 8 glasses completed today. 💧`, 'success');
  } else {
    showToast('Daily water goal achieved! Excellent hydration! 💧', 'info');
  }
}

function renderSeniorReminders(filter = 'all') {
  currentRemindersFilter = filter;
  const grid = document.getElementById('senior-reminders-grid');
  if (!grid) return;

  const reminders = getSeniorReminders();
  const filtered = (filter === 'all') ? reminders : reminders.filter(r => r.category === filter);

  // Update filter pill UI
  ['all', 'water', 'food', 'medicine', 'other'].forEach(f => {
    const btn = document.getElementById(`rem-filter-${f}`);
    if (btn) {
      if (f === filter) {
        btn.className = 'px-3 py-1.5 rounded-xl text-xs font-bold transition-all bg-slate-900 text-white shadow-sm';
      } else {
        btn.className = 'px-3 py-1.5 rounded-xl text-xs font-bold transition-all bg-white text-slate-700 border border-slate-200 hover:bg-slate-50';
      }
    }
  });

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div class="col-span-1 sm:col-span-2 text-center py-8 text-slate-400 bg-white rounded-2xl border border-dashed border-slate-300">
        <i class="fa-solid fa-bell-slash text-3xl mb-2 text-slate-300"></i>
        <p class="text-xs font-bold text-slate-600">No reminders found in this category / कोई रिमाइंडर नहीं मिला</p>
        <button onclick="openAddReminderModal()" class="mt-2 text-xs font-bold text-amber-600 hover:underline">
          + Add your first reminder now
        </button>
      </div>
    `;
    return;
  }

  grid.innerHTML = filtered.map(r => {
    const isDone = r.completedToday;
    const isEnabled = r.enabled;
    const catBadge = (r.category === 'water') 
      ? 'bg-sky-100 text-sky-800' 
      : (r.category === 'medicine' ? 'bg-purple-100 text-purple-800' : (r.category === 'food' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'));
    
    return `
      <div id="rem-card-${r.id}"
        class="p-4 rounded-2xl bg-white border-2 ${isDone ? 'border-emerald-300 bg-emerald-50/40' : (isEnabled ? 'border-slate-200 shadow-sm' : 'border-slate-200 opacity-60')} flex flex-col justify-between transition-all">
        
        <div>
          <div class="flex items-center justify-between pb-2 border-b border-slate-100 mb-2.5">
            <div class="flex items-center space-x-2">
              <span class="w-8 h-8 rounded-xl ${r.color || 'bg-amber-100 text-amber-700'} flex items-center justify-center text-sm shadow-xs flex-shrink-0">
                <i class="${r.icon || 'fa-solid fa-bell'}"></i>
              </span>
              <span class="font-mono text-xs sm:text-sm font-black text-slate-900 bg-slate-100 px-2 py-0.5 rounded-lg border border-slate-200">
                ${r.timeDisplay || format24to12Time(r.time)}
              </span>
            </div>

            <div class="flex items-center space-x-2">
              <span class="text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${catBadge}">
                ${r.category}
              </span>
              <!-- Enable / Disable Switch -->
              <button onclick="toggleReminderStatus('${r.id}')"
                class="text-xs font-bold px-2 py-0.5 rounded-md border transition-all ${isEnabled ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-500 border-slate-200'}"
                title="${isEnabled ? 'Click to Pause / रोकें' : 'Click to Enable / चालू करें'}">
                ${isEnabled ? 'Active' : 'Paused'}
              </button>
            </div>
          </div>

          <h4 class="text-xs sm:text-sm font-black text-slate-900 ${isDone ? 'line-through text-slate-500' : ''}">
            ${r.title}
          </h4>
          <p class="text-xs text-slate-500 font-medium mt-1 leading-relaxed">
            ${r.notes || 'Care reminder scheduled for daily wellbeing.'}
          </p>
        </div>

        <div class="flex items-center justify-between pt-3 border-t border-slate-100 mt-3">
          <button onclick="markReminderDone('${r.id}')"
            class="px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all flex items-center space-x-1 ${isDone ? 'bg-emerald-600 text-white shadow-sm' : 'bg-slate-100 hover:bg-emerald-100 text-slate-700 hover:text-emerald-800'}"
            title="Mark Completed for Today / आज पूरा किया">
            <i class="fa-solid fa-check text-xs"></i>
            <span>${isDone ? 'Completed ✓' : 'Mark Done'}</span>
          </button>

          <div class="flex items-center space-x-1.5">
            <button onclick="triggerDeviceReminderAlarm(getSeniorReminders().find(x => x.id === '${r.id}'))"
              class="px-2.5 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold transition-all border border-amber-200"
              title="Test Alarm Sound for this reminder / अलार्म बजाएं">
              <i class="fa-solid fa-bell text-xs"></i>
              <span class="hidden sm:inline ml-1">Ring</span>
            </button>
            <button onclick="deleteReminder('${r.id}')"
              class="w-7 h-7 rounded-xl bg-slate-100 hover:bg-rose-100 text-slate-400 hover:text-rose-600 transition-all flex items-center justify-center text-xs"
              title="Delete Reminder / हटाएं">
              <i class="fa-solid fa-trash-can"></i>
            </button>
          </div>
        </div>

      </div>
    `;
  }).join('');
}

function filterReminders(cat) {
  renderSeniorReminders(cat);
}

function toggleReminderStatus(id) {
  const reminders = getSeniorReminders();
  const target = reminders.find(r => r.id === id);
  if (!target) return;
  target.enabled = !target.enabled;
  saveSeniorReminders(reminders);
  renderSeniorReminders(currentRemindersFilter);
  soundEngine.playTone(600, 'sine', 0.1);
  showToast(target.enabled ? 'Reminder activated / रिमाइंडर सक्रिय किया गया' : 'Reminder paused / रिमाइंडर रोक दिया गया', 'info');
}

function markReminderDone(id) {
  const reminders = getSeniorReminders();
  const target = reminders.find(r => r.id === id);
  if (!target) return;
  target.completedToday = !target.completedToday;
  saveSeniorReminders(reminders);
  renderSeniorReminders(currentRemindersFilter);
  if (target.completedToday) {
    soundEngine.playSuccessChime();
    showToast(`Great job! Completed: ${target.title}`, 'success');
  }
}

function deleteReminder(id) {
  let reminders = getSeniorReminders();
  reminders = reminders.filter(r => r.id !== id);
  saveSeniorReminders(reminders);
  renderSeniorReminders(currentRemindersFilter);
  showToast('Reminder deleted / रिमाइंडर हटाया गया', 'info');
}

function openAddReminderModal() {
  const modal = document.getElementById('modal-add-reminder');
  if (modal) {
    soundEngine.playTone(550, 'sine', 0.1);
    modal.classList.remove('hidden');
  }
}

function closeAddReminderModal() {
  const modal = document.getElementById('modal-add-reminder');
  if (modal) modal.classList.add('hidden');
}

function applyReminderPreset(presetKey) {
  const titleInput = document.getElementById('rem-input-title');
  const catInput = document.getElementById('rem-input-category');
  const timeInput = document.getElementById('rem-input-time');
  const notesInput = document.getElementById('rem-input-notes');

  const presets = {
    water_morning: {
      title: 'Morning Warm Water (1 Glass) / सुबह का गुनगुना पानी',
      cat: 'water',
      time: '08:00',
      notes: 'Hydration supports circulation, kidney vitality and regulates blood pressure.'
    },
    med_morning: {
      title: 'Morning BP Medicine / सुबह की रक्तचाप की दवा',
      cat: 'medicine',
      time: '08:30',
      notes: 'Take with warm water after morning meal.'
    },
    food_breakfast: {
      title: 'Nutritious Breakfast / पौष्टिक नाश्ता',
      cat: 'food',
      time: '09:00',
      notes: 'Oats, dalia, or light multigrain breakfast with fruit.'
    },
    food_lunch: {
      title: 'Balanced Low-Sodium Lunch / दोपहर का भोजन',
      cat: 'food',
      time: '13:30',
      notes: 'Warm roti, steamed vegetables, dal, and fresh curd.'
    },
    water_afternoon: {
      title: 'Midday Hydration / दोपहर 1 गिलास पानी',
      cat: 'water',
      time: '11:30',
      notes: 'Stay hydrated to prevent fatigue and headaches.'
    },
    med_night: {
      title: 'Night Medicine & Cardiac Regimen / रात की दवा',
      cat: 'medicine',
      time: '21:30',
      notes: 'Prescribed night dose for restful sleep.'
    }
  };

  const p = presets[presetKey];
  if (!p) return;

  if (titleInput) titleInput.value = p.title;
  if (catInput) catInput.value = p.cat;
  if (timeInput) timeInput.value = p.time;
  if (notesInput) notesInput.value = p.notes;

  soundEngine.playTone(700, 'sine', 0.1);
}

function handleSaveNewReminder(e) {
  if (e) e.preventDefault();
  const title = document.getElementById('rem-input-title')?.value.trim();
  const category = document.getElementById('rem-input-category')?.value || 'other';
  const time = document.getElementById('rem-input-time')?.value || '08:00';
  const notes = document.getElementById('rem-input-notes')?.value.trim();

  if (!title) {
    showToast('Please enter reminder title / कृपया शीर्षक दर्ज करें', 'warning');
    return;
  }

  const iconMap = {
    water: 'fa-solid fa-glass-water',
    food: 'fa-solid fa-utensils',
    medicine: 'fa-solid fa-pills',
    walk: 'fa-solid fa-person-walking',
    bp: 'fa-solid fa-heart-pulse',
    other: 'fa-solid fa-bell'
  };

  const colorMap = {
    water: 'text-sky-600 bg-sky-50 border-sky-200',
    food: 'text-amber-600 bg-amber-50 border-amber-200',
    medicine: 'text-purple-600 bg-purple-50 border-purple-200',
    walk: 'text-emerald-600 bg-emerald-50 border-emerald-200',
    bp: 'text-rose-600 bg-rose-50 border-rose-200',
    other: 'text-slate-600 bg-slate-50 border-slate-200'
  };

  const newReminder = {
    id: 'rem-' + Date.now(),
    title: title,
    category: category,
    time: time,
    timeDisplay: format24to12Time(time),
    notes: notes || 'Care reminder scheduled for daily wellbeing.',
    enabled: true,
    completedToday: false,
    lastTriggeredDate: '',
    icon: iconMap[category] || 'fa-solid fa-bell',
    color: colorMap[category] || 'text-amber-600 bg-amber-50 border-amber-200'
  };

  const reminders = getSeniorReminders();
  reminders.push(newReminder);
  // Sort reminders by time
  reminders.sort((a, b) => a.time.localeCompare(b.time));
  saveSeniorReminders(reminders);
  renderSeniorReminders(currentRemindersFilter);

  closeAddReminderModal();
  soundEngine.playSuccessChime();
  showToast(`Reminder saved: ${title} at ${newReminder.timeDisplay}`, 'success');
}

function scrollToRemindersSection() {
  const el = document.getElementById('senior-reminders-section');
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    el.classList.add('ring-4', 'ring-amber-400');
    setTimeout(() => {
      el.classList.remove('ring-4', 'ring-amber-400');
    }, 1800);
  }
}

// =========================================================================
// DEVICE ALARM TRIGGER, AUDITORY CHIME, NOTIFICATION & ACTIONS
// =========================================================================

function triggerDeviceReminderAlarm(reminder) {
  if (!reminder) return;
  activeAlarmReminder = reminder;

  // 1. Start continuous audio alarm chime
  soundEngine.startReminderAlarm();

  // 2. Populate and show alarm modal
  const modal = document.getElementById('modal-reminder-alarm');
  const iconEl = document.getElementById('alarm-dialog-icon');
  const timeEl = document.getElementById('alarm-dialog-time');
  const titleEl = document.getElementById('alarm-dialog-title');
  const notesEl = document.getElementById('alarm-dialog-notes');

  if (iconEl) iconEl.className = reminder.icon || 'fa-solid fa-bell';
  if (timeEl) timeEl.textContent = reminder.timeDisplay || format24to12Time(reminder.time);
  if (titleEl) titleEl.textContent = reminder.title;
  if (notesEl) notesEl.textContent = reminder.notes || 'It is time for your scheduled care reminder!';

  if (modal) modal.classList.remove('hidden');

  // 3. Text to Speech announcement
  if ('speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
      const isHi = state.seniorLanguage === 'hi';
      const prof = getUserProfile('senior');
      const seniorFirstName = prof.name ? prof.name.split(' ')[0] : 'Ramesh';
      let spokenText = '';
      if (isHi) {
        const catText = (reminder.category === 'water') ? 'पानी पीने' : (reminder.category === 'medicine' ? 'दवा लेने' : 'भोजन');
        spokenText = `नमस्ते ${seniorFirstName} जी। यह आपके ${catText} का समय है। कृपया ${reminder.title} पर ध्यान दें।`;
      } else {
        spokenText = `Attention ${seniorFirstName} ji. It is time for your scheduled reminder: ${reminder.title}.`;
      }
      const utterance = new SpeechSynthesisUtterance(spokenText);
      utterance.lang = isHi ? 'hi-IN' : 'en-IN';
      utterance.rate = 0.88;
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Speech synthesis error on alarm:', e);
    }
  }

  // 4. Device Native Notification
  if ('Notification' in window && Notification.permission === 'granted') {
    try {
      new Notification(`⏰ CareConnect Alarm: ${reminder.title}`, {
        body: reminder.notes || 'Scheduled health reminder alert!',
        icon: 'careconnect-emblem.png',
        tag: `careconnect-rem-${reminder.id}`,
        requireInteraction: true
      });
    } catch (e) {
      console.warn('Native notification error:', e);
    }
  }
}

function completeAlarmAction() {
  soundEngine.stopReminderAlarm();
  const modal = document.getElementById('modal-reminder-alarm');
  if (modal) modal.classList.add('hidden');

  if (activeAlarmReminder) {
    markReminderDone(activeAlarmReminder.id);
    if (activeAlarmReminder.category === 'water') {
      logWaterGlass();
    }
  }

  soundEngine.playSuccessChime();
  showToast('Task completed successfully! / कार्य पूरा कर लिया गया। बहुत बढ़िया! 🙏', 'success');
  activeAlarmReminder = null;
}

function snoozeAlarmAction() {
  soundEngine.stopReminderAlarm();
  const modal = document.getElementById('modal-reminder-alarm');
  if (modal) modal.classList.add('hidden');

  const snoozedRem = activeAlarmReminder;
  showToast('Alarm snoozed for 10 minutes. / अलार्म 10 मिनट के लिए स्नूज़ किया गया।', 'info');

  setTimeout(() => {
    if (snoozedRem) {
      triggerDeviceReminderAlarm(snoozedRem);
    }
  }, 10 * 60 * 1000); // 10 minutes

  activeAlarmReminder = null;
}

function dismissAlarmAction() {
  soundEngine.stopReminderAlarm();
  const modal = document.getElementById('modal-reminder-alarm');
  if (modal) modal.classList.add('hidden');
  showToast('Alarm dismissed. / अलार्म बंद किया गया।', 'info');
  activeAlarmReminder = null;
}

function testSampleReminderAlarm() {
  const sample = {
    id: 'test-alarm-sample',
    title: '💧 Hydration: Drink 1 Glass Warm Water / 1 गिलास गुनगुना पानी पिएं',
    category: 'water',
    time: 'Now',
    timeDisplay: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    notes: 'Hydration aids circulation, kidney health, and regulates blood pressure.',
    icon: 'fa-solid fa-glass-water',
    color: 'text-sky-600 bg-sky-50 border-sky-200'
  };
  triggerDeviceReminderAlarm(sample);
}

function requestDeviceNotificationPermission() {
  if (!('Notification' in window)) {
    showToast('Notifications not supported by this browser.', 'warning');
    return;
  }
  Notification.requestPermission().then(permission => {
    const permCard = document.getElementById('device-notif-permission-card');
    if (permission === 'granted') {
      soundEngine.playSuccessChime();
      showToast('Device notifications enabled successfully! / डिवाइस नोटिफिकेशन सक्षम हो गई।', 'success');
      if (permCard) permCard.classList.add('hidden');
    } else {
      showToast('Notification permission was not granted.', 'info');
    }
  });
}

function checkRemindersAlarmTicker() {
  const now = new Date();
  const h = String(now.getHours()).padStart(2, '0');
  const m = String(now.getMinutes()).padStart(2, '0');
  const currentTime = `${h}:${m}`;
  const todayStr = now.toISOString().split('T')[0];

  const reminders = getSeniorReminders();
  let updated = false;

  reminders.forEach(r => {
    if (r.enabled && r.time === currentTime && r.lastTriggeredDate !== todayStr) {
      r.lastTriggeredDate = todayStr;
      updated = true;
      triggerDeviceReminderAlarm(r);
    }
  });

  if (updated) {
    saveSeniorReminders(reminders);
  }
}

function updateRemindersLiveClock() {
  const clockEl = document.getElementById('reminders-live-clock');
  if (!clockEl) return;
  const now = new Date();
  clockEl.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

function initSeniorRemindersHub() {
  renderSeniorReminders('all');
  updateWaterTrackerDisplay();

  // Hide notification card if already granted
  if ('Notification' in window && Notification.permission === 'granted') {
    const permCard = document.getElementById('device-notif-permission-card');
    if (permCard) permCard.classList.add('hidden');
  }

  if (!liveClockInterval) {
    updateRemindersLiveClock();
    liveClockInterval = setInterval(updateRemindersLiveClock, 1000);
  }

  if (!remindersTickerInterval) {
    checkRemindersAlarmTicker();
    remindersTickerInterval = setInterval(checkRemindersAlarmTicker, 15000);
  }
}

// Start ticker on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    if (typeof initSeniorRemindersHub === 'function') {
      initSeniorRemindersHub();
    }
  }, 300);
});
"""

# Append to app.js
code += "\n" + reminders_engine_code

with open('app.js', 'w', encoding='utf-8') as f:
    f.write(code)

print("SUCCESS: app.js fully updated with Reminders & Device Alarm Engine!")

