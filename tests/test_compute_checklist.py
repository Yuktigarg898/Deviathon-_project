compute_checklist_js = '''
// Compute real-time checklist state from current DOM inputs & assessmentState
function computeChecklistFromFormDom() {
  const prof = (typeof getUserProfile === 'function') ? getUserProfile('senior') : { age: 74, gender: 'Male' };
  const hVal = parseFloat(document.getElementById('assess-height')?.value);
  const wVal = parseFloat(document.getElementById('assess-weight')?.value);
  const bpSys = parseFloat(document.getElementById('assess-bp-sys')?.value);
  const bpDia = parseFloat(document.getElementById('assess-bp-dia')?.value);
  const hrVal = parseFloat(document.getElementById('assess-hr')?.value);
  const spo2Val = parseFloat(document.getElementById('assess-spo2')?.value);
  const sleepVal = parseFloat(document.getElementById('assess-sleep')?.value);
  const walkVal = document.getElementById('assess-walk')?.value;
  const eatVal = document.getElementById('assess-eat')?.value;
  const moveVal = document.getElementById('assess-move')?.value;
  const toiletVal = document.getElementById('assess-toilet')?.value;
  const medVal = document.getElementById('assess-med-count')?.value;
  const missedVal = document.getElementById('assess-missed-doses')?.value;
  const diabVal = document.getElementById('assess-diabetic')?.value;
  const sugarVal = parseFloat(document.getElementById('assess-sugar')?.value);
  const hearVal = document.getElementById('assess-hearing')?.value;

  const painLoc = document.getElementById('assess-pain-loc')?.value || 'None';
  const painPres = assessmentState.painPresent;
  const painLvl = assessmentState.painLevel;

  const hasHtn = document.getElementById('chk-htn')?.checked;
  const hasArth = document.getElementById('chk-arth')?.checked;
  const hasHeart = document.getElementById('chk-heart')?.checked;
  const hasResp = document.getElementById('chk-resp')?.checked;

  const hasBody = (!isNaN(hVal) && hVal >= 100 && hVal <= 230 && !isNaN(wVal) && wVal >= 30 && wVal <= 200);
  const hasVitals = (!isNaN(bpSys) && !isNaN(bpDia) && !isNaN(hrVal) && !isNaN(spo2Val));
  const hasPain = (!painPres) || (painPres && painLoc !== 'None' && painLoc !== '' && painLvl >= 1);
  const hasSleep = (!isNaN(sleepVal) && sleepVal >= 2 && sleepVal <= 16);
  const hasWalk = (walkVal !== '' && walkVal !== undefined && walkVal !== null);
  const hasEat = (eatVal !== '' && eatVal !== undefined && eatVal !== null);
  const hasMove = (moveVal !== '' && moveVal !== undefined && moveVal !== null);
  const hasToilet = (toiletVal !== '' && toiletVal !== undefined && toiletVal !== null);
  const hasMeds = (medVal !== '' && !isNaN(parseFloat(medVal)) && missedVal !== '');
  const hasSugar = (diabVal === '0') || (diabVal === '1' && !isNaN(sugarVal) && sugarVal >= 40);
  const hasHearing = (hearVal !== '' && hearVal !== undefined && hearVal !== null);
  const hasDiseases = (hasHtn || hasArth || hasHeart || hasResp || cumulativeExtracted.chronic_conditions_none);

  return {
    age: { title: "Age (उम्र)", status: "provided", value: `${prof.age || 74} Yrs` },
    gender: { title: "Gender (लिंग)", status: "provided", value: prof.gender || "Male" },
    body: {
      title: "Body (लंबाई व वजन)",
      status: hasBody ? "provided" : "missing",
      value: hasBody ? `${wVal}kg, ${hVal}cm` : null,
      question_hi: "Aapka vajan (weight) kitne kilo aur lambai (height) kitne cm hai?",
      question_en: "What is your weight in kg and height in cm?"
    },
    vitals: {
      title: "Vitals (BP/O2)",
      status: hasVitals ? "provided" : "missing",
      value: hasVitals ? `BP ${bpSys}/${bpDia}, HR ${hrVal}, O2 ${spo2Val}%` : null,
      question_hi: "Aapka Blood Pressure, Pulse aur Oxygen SpO2 kitna hai?",
      question_en: "What are your Blood Pressure, Heart Rate pulse, and Oxygen SpO2 readings?"
    },
    pain: {
      title: "Pain Status (दर्द)",
      status: hasPain ? "provided" : "missing",
      value: painPres ? `${painLoc} (Level ${painLvl})` : "No Pain",
      question_hi: "Kya shareer me dard hai jaise ghutne ya kamar me, aur severity level kitna hai?",
      question_en: "Do you have any pain (such as in knees, back, or chest) and what is the severity level?"
    },
    sleep: {
      title: "Sleep (नींद)",
      status: hasSleep ? "provided" : "missing",
      value: hasSleep ? `${sleepVal} hrs` : null,
      question_hi: "Aap rozana kitne ghante sote hain?",
      question_en: "How many hours of sleep do you get each night?"
    },
    adl_walk: {
      title: "Walking (चलना)",
      status: hasWalk ? "provided" : "missing",
      value: walkVal === '1' ? "Independent" : "Needs Help",
      question_hi: "Chalna kaisa hai - khud chal lete hain ya walker/lathi lagti hai?",
      question_en: "Can you walk independently or do you require a walker or stick?"
    },
    adl_eat: {
      title: "Eating (खाना)",
      status: hasEat ? "provided" : "missing",
      value: eatVal === '1' ? "Independent" : "Dependent",
      question_hi: "Khana khud kha lete hain ya kisi ki madad lagti hai?",
      question_en: "Can you eat meals independently or do you need assistance?"
    },
    adl_move: {
      title: "Transfer (उठना)",
      status: hasMove ? "provided" : "missing",
      value: moveVal === '1' ? "Independent" : "Needs Help",
      question_hi: "Bistar ya kursi se uthne baithne me kya sahara lagta hai?",
      question_en: "Can you get out of bed or a chair by yourself?"
    },
    adl_toilet: {
      title: "Toilet (शौचालय)",
      status: hasToilet ? "provided" : "missing",
      value: toiletVal === '1' ? "Independent" : "Dependent",
      question_hi: "Toilet khud ja pate hain ya sahara chahiye?",
      question_en: "Can you use the toilet independently or do you require help?"
    },
    meds: {
      title: "Meds & Doses (दवाइयां)",
      status: hasMeds ? "provided" : "missing",
      value: hasMeds ? `${medVal} meds (${missedVal === '0' ? 'All taken' : missedVal + ' missed'})` : null,
      question_hi: "Rozana kitni dawai lete hain aur kya sab samay par le li?",
      question_en: "How many daily medicines do you take and were all doses taken today?"
    },
    sugar: {
      title: "Diabetes & Sugar (शुगर)",
      status: hasSugar ? "provided" : "missing",
      value: diabVal === '1' ? `Diabetic (${sugarVal || '--'} mg/dL)` : "Non-Diabetic",
      question_hi: "Kya aapko Diabetes (sugar) hai aur sugar level kitna hai?",
      question_en: "Do you have diabetes and what is your current blood sugar level?"
    },
    hearing: {
      title: "Hearing (सुनना)",
      status: hasHearing ? "provided" : "missing",
      value: hearVal === '0' ? "Normal" : (hearVal === '1' ? "Mild Difficulty" : "Hearing Aid"),
      question_hi: "Sunne ki kshamta kaisi hai - normal, thoda kam ya hearing aid lagate hain?",
      question_en: "How is your hearing ability - normal, mild difficulty, or hearing aid?"
    },
    diseases: {
      title: "Diseases (पुरानी बीमारियां)",
      status: hasDiseases ? "provided" : "missing",
      value: [hasHtn ? 'HTN' : null, hasArth ? 'Arthritis' : null, hasHeart ? 'Heart' : null, hasResp ? 'Asthma' : null].filter(Boolean).join(', ') || 'None',
      question_hi: "Kya aapko High BP, Gathiya, Dil ki bimari ya Dama jaisi koi bimari hai?",
      question_en: "Do you have conditions such as High BP, Arthritis, Heart disease, or Asthma?"
    }
  };
}
'''
print("computeChecklistFromFormDom defined, length:", len(compute_checklist_js))

