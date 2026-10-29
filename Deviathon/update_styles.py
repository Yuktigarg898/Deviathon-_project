import sys
sys.stdout.reconfigure(encoding='utf-8')

css_additions = '''
/* =========================================================================
   PROFILE MANAGEMENT & FAMILY CARE CIRCLE STYLES
   ========================================================================= */

.profile-field-label {
  display: block;
  font-size: 0.72rem;
  font-weight: 700;
  color: #334155;
  margin-bottom: 0.25rem;
}

.profile-field-input {
  width: 100%;
  padding: 0.55rem 0.85rem;
  border-radius: 0.75rem;
  border: 1px solid #cbd5e1;
  font-size: 0.75rem;
  background-color: #f8fafc;
  color: #0f172a;
  transition: all 0.2s ease;
}

.profile-field-input:focus {
  outline: none;
  background-color: #ffffff;
  border-color: #00a896;
  box-shadow: 0 0 0 3px rgba(0, 168, 150, 0.15);
}

/* =========================================================================
   DAILY HEALTH IMPROVEMENT TASKS & RX STYLES
   ========================================================================= */

.rx-task-card {
  transition: all 0.22s ease-in-out;
  border: 1.5px solid #e2e8f0;
}

.rx-task-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(14, 41, 75, 0.06);
}

.rx-task-card.task-completed {
  background: #f0fdf4 !important;
  border-color: #86efac !important;
}

.rx-task-card.task-completed .task-title-text {
  text-decoration: line-through;
  color: #15803d;
}

.rx-task-checkbox {
  width: 1.45rem;
  height: 1.45rem;
  border-radius: 0.45rem;
  cursor: pointer;
  accent-color: #10b981;
}

.streak-flame {
  display: inline-block;
  animation: pulseFlame 1.8s infinite ease-in-out;
}

@keyframes pulseFlame {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.15) rotate(-3deg); }
}

/* =========================================================================
   SENIOR DIAGNOSTIC REPORT PRINT STYLES
   ========================================================================= */

@media print {
  /* Hide non-report chrome during print */
  #global-header,
  #view-login,
  #view-coordinator,
  #view-family,
  #view-operations,
  #mobile-role-nav,
  footer,
  .no-print,
  #voice-assistant-card,
  #senior-greeting,
  #senior-subgreeting,
  #senior-family-members-list,
  button {
    display: none !important;
  }

  body {
    background: #ffffff !important;
    color: #000000 !important;
    font-size: 12pt;
  }

  #view-senior {
    display: block !important;
    max-width: 100% !important;
    padding: 0 !important;
    margin: 0 !important;
  }

  #assessment-result-box {
    display: block !important;
    border: 1px solid #94a3b8 !important;
    box-shadow: none !important;
    background: #ffffff !important;
    padding: 1.5rem !important;
    page-break-inside: avoid;
  }

  .print-only-header {
    display: block !important;
    border-bottom: 2px solid #00a896;
    margin-bottom: 1rem;
    padding-bottom: 0.5rem;
  }
}
'''

with open('styles.css', 'r', encoding='utf-8') as f:
    existing = f.read()

if 'PROFILE MANAGEMENT & FAMILY CARE CIRCLE STYLES' not in existing:
    with open('styles.css', 'a', encoding='utf-8') as f:
        f.write(css_additions)
    print("SUCCESS: styles.css appended with profile, rx tasks, and print styles!")
else:
    print("Already present in styles.css")

