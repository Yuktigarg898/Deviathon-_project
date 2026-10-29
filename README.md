<<<<<<< HEAD
# CareConnect - Connected Healthcare & Elder Support System

> **Better Signals • Safer Tomorrows**  
> *A unified, 4-way healthcare orchestration platform connecting vulnerable seniors, family members, care coordinators, and operations managers in real time.*

Built for **Deviathon**.

---

## 🌟 Executive Overview

**CareConnect** bridges eldercare isolation, proactive medical triage, and family reassurance. The application starts from an intuitive role selection landing page and opens into four specialized perspectives:

```
                              ┌────────────────────────────────────┐
                              │     CareConnect Authentication     │
                              │        (Role Selection Hub)        │
                              └─────────────────┬──────────────────┘
                                                │
         ┌──────────────────────┬───────────────┴───────────────┬──────────────────────┐
         ▼                      ▼                               ▼                      ▼
┌──────────────────┐  ┌──────────────────┐            ┌──────────────────┐  ┌──────────────────┐
│      View 1      │  │      View 2      │            │      View 3      │  │      View 4      │
│ Care Coordinator │  │ Senior (बुज़ुर्ग) │            │  Family Member   │  │Operations Manager│
└──────────────────┘  └──────────────────┘            └──────────────────┘  └──────────────────┘
```

---

## 🎨 Role Selection Landing Page

Designed to match the **CareConnect** design system:
- **Left Side (Brand & Impact Story)**:
  - CareConnect stylized heart & dual-figure logo with *"Better Signals • Safer Tomorrows"*.
  - Headline: *"AI-powered early warnings for **healthier, safer lives** at home."*
  - 4 Key Value Pillars:
    - 💗 *Detect early signs of health decline*
    - 💙 *Support care coordinators*
    - 💜 *Enable timely, preventive action*
    - 💚 *Keep families informed*
  - Photorealistic portrait of an Indian elderly grandmother and caring nurse.
  - Signature badge: *"Because every senior matters"* with heart icon.
- **Right Side (Role Cards)**:
  - 🩺 **Care Coordinator**: Mint card (`#f0fbf7`), view prioritized seniors, manage alerts, and take clinical action.
  - 👓 **Senior (बुज़ुर्ग)**: Sky blue card (`#f0f7ff`), share health updates, voice notes, and missed-call check-in (Hindi / English).
  - 👨‍👩‍👧 **Family Member**: Lavender card (`#f7f3ff`), weekly wellbeing summary and serious alerts only.
  - 📊 **Operations Manager**: Peach card (`#fff5ed`), monitor alert volumes, response times, and city outcomes.

---

## 🎯 The Four Operational Views

### 1. Care Coordinator View
*Requirement: "A ranked daily list of seniors to prioritise, with the reason for each alert and a suggested action"*
- **Ranked Prioritisation Queue**: Seniors sorted by AI **Triage Risk Score** (`#1` to `#5`), highlighting critical cases first.
- **Alert Root Causes**: Clear explanation for every alert (e.g. *“Missed 08:00 AM check-in + Resting HR spike to 114 bpm + zero motion detected for 4 hours”*).
- **Suggested Actions**: Specific clinical steps (e.g. *“Step 1: Initiate immediate 2-way emergency call. Step 2: Dispatch nearest Field Nurse Sister Kavita (ETA 12 mins). Step 3: Notify son Rahul”*).
- **Interactive Actions**:
  - **2-Way Call Senior**: In-browser simulated phone dialer with audio ringtone and live timer.
  - **Dispatch Field Specialist**: Modal to assign RNs, paramedics, or community buddies with live ETA tracking.
  - **Resolve & Mark Safe**: Moves handled cases to resolved history and updates city SLA metrics.
  - **Simulate Incoming Emergency**: Injects an urgent alert live to demonstrate real-time queue re-ranking.

---

### 2. Senior View (बुज़ुर्ग साथी पोर्टल)
*Requirement: "Simple ways to share how they feel: a voice note, a missed-call check-in or a one-tap reply, in Hindi or English"*
- **Bilingual Engine (English & हिन्दी 🇮🇳)**:
  - Instant one-click toggle with complete translation of all prompts, greetings, and labels.
  - **Listen Aloud / बोलकर सुनाएं**: Web Speech API audio synthesis reads instructions aloud in English or Hindi.
- **Three Simple Ways to Share Feelings**:
  1. **One-Tap Reply (एक टैप से बताएं)**: Large tactile emoji cards:
     - 😊 **Feeling Great / सब बढ़िया है**
     - 🥱 **A Bit Tired / थोड़ा थका हुआ**
     - 💊 **Took Medicine / दवा ले ली है**
     - 🤒 **Feeling Unwell / तबियत ठीक नहीं** *(Triggers high-priority coordinator alert)*
  2. **Voice Note (आवाज़ संदेश भेजें)**:
     - Tap-to-record microphone with animated sound wave bars.
     - Simulated Speech-to-Text translation into Hindi and English.
     - AI Emotional sentiment detection badge (*Mood: Tired / Attention Needed*).
     - Direct transmission button to the Care Coordinator.
  3. **Missed-Call Check-in (निःशुल्क मिस्ड कॉल चेक-इन)**:
     - Toll-free number: `1800-202-CARE` (no internet or smartphone required).
     - Interactive **"Simulate Missed Call"** button that logs the check-in with realistic audio confirmation.
- **Emergency SOS (आपातकालीन मदद)**: Immediate siren alert that notifies the family and coordinator.

---

### 3. Family Member View
*Requirement: "A short weekly wellbeing summary and an immediate alert only when something is serious"*
- **Immediate Serious Alert Only**:
  - Prevents alarm fatigue: only displays a high-priority red alert card **when something is genuinely critical** (e.g. *“Ramesh did not check in & Blood Pressure Spiked to 158/96 mmHg”*).
  - Quick action buttons: **[Call Dad]**, **[Talk to Coordinator Sister Kavita]**, and **[Acknowledge]**.
  - When stable, automatically shows a calm green status (*“Dad is Safe & Peaceful”*).
- **Short Weekly Wellbeing Summary**:
  - **Health Stability Index**: Radial score (e.g. `88/100 - Healthy & Stable`).
  - **7-Day Consistency Strip**: Day-by-day badges (Mon–Sun) tracking check-ins.
  - **4 Core Metrics**: Medication adherence (`93%`), sleep duration (`7.2 hrs/night`), mood sentiment (`86% Positive`), and resting heart rate (`72 bpm`).
  - **Weekly Trend Chart**: Interactive Chart.js graph comparing daily systolic blood pressure (mmHg) against senior mood ratings (1–5).
  - **Personal Coordinator Note**: Weekly written update from Nurse Kavita.
  - **Send Love to Dad**: Message box that sends text messages to be read aloud on the senior's device.

---

### 4. Operations Manager View
*Requirement: "A view of alert volumes, response times and outcomes across a city or team"*
- **Filters**:
  - City: `Delhi NCR`, `Mumbai Metro`, `Bengaluru Urban`, `Hyderabad`, `All Metros`.
  - Team: `Team Alpha (South Delhi)`, `Team Beta (Central)`, `Rapid Squad`.
  - Time Range: `Today (Real-time)`, `Last 7 Days`, `This Month`.
- **Alert Volumes**: Total alerts (`342`), active queue (`14`), critical (`18`), high (`64`), routine (`260`).
- **Response Times & SLA**: Average first response (`6.4 mins` vs `< 15 min` target), critical response (`2.1 mins`), 95th percentile (`11.4 mins`).
- **Outcomes Across City**:
  - Hospital emergency admissions averted: `24 prevented`.
  - Breakdown: Tele-Triage (`58%`), Field Nurse Visit (`26%`), Family Resolved (`12%`), ER Transfer (`4%`).
  - Senior satisfaction score: `4.88 / 5.0`.
- **Analytical Visualizations**:
  - Hourly Alert Inflow vs. Resolution Velocity (Chart.js bar/line).
  - Resolution Outcome Distribution (Chart.js donut).
- **Care Team Performance Table**: Real-time roster tracking team names, assigned seniors, alerts handled, average response velocity, and SLA compliance.
- **Live Incident Feed**: Terminal-style stream of municipal triage dispatches and resolutions.

---

## ⚡ Cross-Perspective Real-Time Interactivity

All four views share reactive state:
1. When a senior taps **"Feeling Unwell"** or triggers **SOS** in the Senior View:
   - A critical alert is dynamically injected at Rank `#1` on the **Care Coordinator** queue.
   - The serious alert card lights up in red on the **Family Member** view.
   - The active alert count increments by 1 on the **Operations Manager** view.
2. When the **Care Coordinator** clicks **"Resolve & Mark Safe"**:
   - The alert moves to the resolved log.
   - The **Family Member** view transitions back to a calm green banner (*“Resolved by Nurse Kavita”*).
   - The Operations Manager resolved counter increments.
3. **Web Audio Sound Synthesizer**: Uses browser Web Audio API oscillators to generate telephone rings, success chimes, and emergency sirens offline with zero external audio assets.

---

## 🚀 How to Run and Test

* **Option 1 (One-Click Launcher)**: Double-click [run.bat](file:///c:/Users/krish/OneDrive/Desktop/Deviathon/run.bat) in the project folder.
* **Option 2 (Instant in Browser)**: Double-click [index.html](file:///c:/Users/krish/OneDrive/Desktop/Deviathon/index.html) in your browser.
* **Option 3 (Python Server)**: Run `python server.py` and open [http://127.0.0.1:5000](http://127.0.0.1:5000).

---

## 📁 Project File Directory

```
c:\Users\krish\OneDrive\Desktop\Deviathon\
├── index.html               # Main portal with exact role selection landing page & 4 views
├── app.js                   # State engine, Hindi/English dictionary, audio synthesis & charts
├── styles.css               # Animations, waveforms, custom scrollbars, styling
├── server.py                # Python Flask web server & mock REST API backend
├── run.bat                  # One-click Windows launcher
├── senior-nurse-photo.png   # Clean, photorealistic photo of senior & nurse (text-free)
├── leaf-top-right.png       # Botanical corner accent
├── leaf-bottom-right.png    # Botanical corner accent
└── README.md                # Full technical & user guide documentation
```
=======
# Deviathon-_project
Early Warning for Seniors Living at Home
>>>>>>> 1d017627ab1122cb85051809160649f445c91008
