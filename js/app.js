const App = (() => {
const $ = id => document.getElementById(id);
let isSignUp = false, plan = null, planChecks = [], drillStep = null, recTimer = null, recSec = 0, recorder = null, chunks = [];

// ══════════ i18n ══════════
const I18N = {
  ru: {
    auth_sub:'Мысли → Действия → Результат', auth_btn:'Войти', auth_user_ph:'Имя пользователя', auth_pass_ph:'Пароль',
    auth_no:'Нет аккаунта?', auth_yes:'Уже есть аккаунт?', auth_create:'Создать', auth_login:'Войти',
    streak_days:'дней подряд', voice_label:'Голосовой ввод', voice_hint:'Удерживай для записи',
    think_ph:'Опиши свою идею или задачу...\n\nНапример: Хочу создать приложение для учёта расходов',
    gen_btn:'Сгенерировать план', improve_label:'Улучшить план', improve_ph:'Что хочешь добавить или изменить?',
    improve_btn:'Улучшить', tpl_title:'Шаблоны', hist_title:'История', hist_search_ph:'Поиск планов...',
    hist_empty:'Пока нет сохранённых планов', an_title:'Аналитика', set_title:'Настройки',
    set_account:'Аккаунт', set_profile:'Ваш профиль', set_lang:'Язык', set_data:'Данные',
    set_export:'Экспорт всех данных', set_clear:'Очистить историю', set_clear_d:'Удалить все планы',
    logout:'Выйти', drill_ph:'Спроси что-нибудь про этот шаг...',
    g_night:'Доброй ночи', g_morn:'Доброе утро', g_day:'Добрый день', g_eve:'Добрый вечер',
    g_msg:'Чем займёмся <span class="gradient-text">сегодня</span>?',
    an_total:'Всего планов', an_done:'Завершено', an_steps:'Шагов выполнено', an_streak:'Макс. серия',
    an_week:'Активность за неделю', an_cats:'По категориям',
    days:['Пн','Вт','Ср','Чт','Пт','Сб','Вс'],
    step_lbl:'Шаг', explore:'Подробнее', total_time:'Общее время',
    copied:'Скопировано!', saved:'Сохранено!', plan_ready:'План готов!', plan_improved:'План улучшен!',
    err_fill:'Заполни все поля', err_key:'Укажи API ключ', err_idea:'Опиши свою идею', err_bio:'Ошибка биометрии',
    welcome:'Добро пожаловать!', created:'Аккаунт создан!', logged_out:'Вы вышли', no_mic:'Нет доступа к микрофону',
    rec_saved:'Запись сохранена', cleared:'История очищена', exported:'Данные экспортированы',
    confirm_clear:'Точно удалить все планы?',
    del:'Удалить', plan_deleted:'План удалён'
  },
  en: {
    auth_sub:'Thoughts → Actions → Results', auth_btn:'Sign In', auth_user_ph:'Username', auth_pass_ph:'Password',
    auth_no:"Don't have an account?", auth_yes:'Already have an account?', auth_create:'Sign Up', auth_login:'Sign In',
    streak_days:'day streak', voice_label:'Voice Input', voice_hint:'Hold to record',
    think_ph:'Describe your idea or task...\n\nExample: I want to build an expense tracker with categories and charts',
    gen_btn:'Generate Plan', improve_label:'Improve Plan', improve_ph:'What would you like to add or change?',
    improve_btn:'Improve', tpl_title:'Templates', hist_title:'History', hist_search_ph:'Search plans...',
    hist_empty:'No saved plans yet', an_title:'Analytics', set_title:'Settings',
    set_account:'Account', set_profile:'Your profile', set_lang:'Language', set_data:'Data',
    set_export:'Export all data', set_clear:'Clear history', set_clear_d:'Delete all plans',
    logout:'Sign Out', drill_ph:'Ask something about this step...',
    g_night:'Good night', g_morn:'Good morning', g_day:'Good afternoon', g_eve:'Good evening',
    g_msg:'What shall we work on <span class="gradient-text">today</span>?',
    an_total:'Total Plans', an_done:'Completed', an_steps:'Steps Done', an_streak:'Best Streak',
    an_week:'Weekly Activity', an_cats:'By Category',
    days:['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
    step_lbl:'Step', explore:'Explore', total_time:'Total time',
    copied:'Copied!', saved:'Saved!', plan_ready:'Plan ready!', plan_improved:'Plan improved!',
    err_fill:'Fill in all fields', err_key:'Set API key in settings', err_idea:'Describe your idea', err_bio:'Biometric error',
    welcome:'Welcome!', created:'Account created!', logged_out:'Signed out', no_mic:'No microphone access',
    rec_saved:'Recording saved', cleared:'History cleared', exported:'Data exported',
    confirm_clear:'Delete all plans?',
    del:'Delete', plan_deleted:'Plan deleted'
  },
  uz: {
    auth_sub:"Fikrlar → Harakatlar → Natija", auth_btn:'Kirish', auth_user_ph:'Foydalanuvchi nomi', auth_pass_ph:'Parol',
    auth_no:"Akkauntingiz yo'qmi?", auth_yes:"Akkauntingiz bormi?", auth_create:"Ro'yxatdan o'tish", auth_login:'Kirish',
    streak_days:"kun ketma-ket", voice_label:'Ovozli kiritish', voice_hint:"Yozib olish uchun bosib turing",
    think_ph:"G'oyangizni yoki vazifangizni tasvirlab bering...",
    gen_btn:'Reja yaratish', improve_label:'Rejani yaxshilash', improve_ph:"Nimani qo'shish yoki o'zgartirish kerak?",
    improve_btn:'Yaxshilash', tpl_title:'Shablonlar', hist_title:'Tarix', hist_search_ph:"Rejalarni qidirish...",
    hist_empty:"Saqlangan rejalar hali yo'q", an_title:'Tahlil', set_title:'Sozlamalar',
    set_account:'Akkaunt', set_profile:'Profilingiz', set_lang:'Til', set_data:"Ma'lumotlar",
    set_export:"Barcha ma'lumotlarni eksport qilish", set_clear:"Tarixni tozalash", set_clear_d:"Barcha rejalarni o'chirish",
    logout:'Chiqish', drill_ph:"Bu qadam haqida so'rang...",
    g_night:'Xayrli tun', g_morn:'Xayrli tong', g_day:'Xayrli kun', g_eve:'Xayrli kech',
    g_msg:"Bugun nima <span class=\"gradient-text\">qilamiz</span>?",
    an_total:'Jami rejalar', an_done:'Bajarilgan', an_steps:'Qadamlar bajarildi', an_streak:"Eng uzun ketma-ketlik",
    an_week:'Haftalik faollik', an_cats:'Toifalar bo\'yicha',
    days:['Du','Se','Ch','Pa','Ju','Sh','Ya'],
    step_lbl:'Qadam', explore:"Batafsil", total_time:"Umumiy vaqt",
    copied:'Nusxalandi!', saved:'Saqlandi!', plan_ready:'Reja tayyor!', plan_improved:'Reja yaxshilandi!',
    err_fill:"Barcha maydonlarni to'ldiring", err_key:"Sozlamalarda API kalitini kiriting", err_idea:"G'oyangizni tasvirlab bering",
    err_bio:'Biometrik xato', welcome:"Xush kelibsiz!", created:"Akkaunt yaratildi!", logged_out:'Chiqdingiz',
    no_mic:"Mikrofonga ruxsat yo'q", rec_saved:'Yozuv saqlandi', cleared:'Tarix tozalandi', exported:"Ma'lumotlar eksport qilindi",
    confirm_clear:"Barcha rejalarni o'chirishni xohlaysizmi?",
    del:"O'chirish", plan_deleted:"Reja o'chirildi"
  }
};

let lang = localStorage.getItem('tf_lang') || 'ru';
const t = k => (I18N[lang] || I18N.ru)[k] || k;

function applyI18n() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const k = el.dataset.i18n;
    if (I18N[lang]?.[k]) el.innerHTML = I18N[lang][k];
  });
  document.querySelectorAll('[data-i18n-ph]').forEach(el => {
    const k = el.dataset.i18nPh;
    if (I18N[lang]?.[k]) el.placeholder = I18N[lang][k];
  });
  updateGreeting();
  updateAuthToggle();
}

function setLang(l) {
  lang = l; localStorage.setItem('tf_lang', l);
  document.querySelectorAll('.lang-btn').forEach(b => b.classList.toggle('active', b.dataset.lang === l));
  applyI18n();
}

// ══════════ TEMPLATES ══════════
const TEMPLATES = [
  { emoji:'💼', key:'business', prompt:{ru:'Запуск нового бизнес-проекта',en:'Launch a new business project',uz:'Yangi biznes loyihani ishga tushirish'}},
  { emoji:'💻', key:'app', prompt:{ru:'Разработка мобильного приложения',en:'Build a mobile application',uz:'Mobil ilova yaratish'}},
  { emoji:'📚', key:'study', prompt:{ru:'План изучения нового навыка',en:'Learn a new skill',uz:'Yangi ko\'nikmani o\'rganish'}},
  { emoji:'🏋️', key:'fitness', prompt:{ru:'Программа тренировок на месяц',en:'Monthly workout program',uz:'Oylik mashq dasturi'}},
  { emoji:'✈️', key:'travel', prompt:{ru:'Планирование путешествия',en:'Plan a trip',uz:'Sayohatni rejalashtirish'}},
  { emoji:'🎨', key:'creative', prompt:{ru:'Творческий проект',en:'Creative project',uz:'Ijodiy loyiha'}},
  { emoji:'📊', key:'career', prompt:{ru:'Развитие карьеры',en:'Career development',uz:'Karyerani rivojlantirish'}},
  { emoji:'🏠', key:'home', prompt:{ru:'Обустройство дома',en:'Home improvement',uz:'Uyni jihozlash'}},
];

function renderTemplates() {
  $('tplScroll').innerHTML = TEMPLATES.map(t =>
    `<div class="tpl-card" onclick="App.useTpl('${t.key}')"><span class="tpl-emoji">${t.emoji}</span>${t.prompt[lang]||t.prompt.en}</div>`
  ).join('');
}

function useTpl(key) {
  const tpl = TEMPLATES.find(t => t.key === key);
  if (tpl) { $('thinkInput').value = tpl.prompt[lang] || tpl.prompt.en; $('thinkInput').focus(); }
}

// ══════════ STORAGE ══════════
function getPlans() { try { return JSON.parse(localStorage.getItem('tf_plans')||'[]'); } catch { return []; } }
function savePlans(p) { localStorage.setItem('tf_plans', JSON.stringify(p)); }
function getStreakData() { try { return JSON.parse(localStorage.getItem('tf_streak')||'{}'); } catch { return {}; } }
function saveStreakData(d) { localStorage.setItem('tf_streak', JSON.stringify(d)); }

// ══════════ STREAKS ══════════
function updateStreak() {
  const data = getStreakData();
  const today = new Date().toISOString().slice(0,10);
  if (!data.lastDate) { data.lastDate = today; data.count = 1; data.max = 1; data.days = [today]; }
  else if (data.lastDate !== today) {
    const last = new Date(data.lastDate), now = new Date(today);
    const diff = (now - last) / 86400000;
    if (diff === 1) { data.count++; } else { data.count = 1; }
    data.lastDate = today;
    if (data.count > (data.max||0)) data.max = data.count;
    if (!data.days) data.days = [];
    data.days.push(today);
    if (data.days.length > 30) data.days = data.days.slice(-30);
  }
  saveStreakData(data);
  $('streakCount').textContent = data.count || 0;
  renderStreakDots(data);
}

function renderStreakDots(data) {
  const today = new Date(); const dots = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today); d.setDate(d.getDate() - i);
    const ds = d.toISOString().slice(0,10);
    const active = (data.days||[]).includes(ds);
    const isToday = i === 0;
    dots.push(`<div class="streak-dot${active?' active':''}${isToday?' today':''}"></div>`);
  }
  $('streakDots').innerHTML = dots.join('');
}

// ══════════ INIT ══════════
function init() {
  applyI18n(); renderTemplates();
  const user = localStorage.getItem('tf_user');
  if (user) {
    showScreen('mainScreen');
    $('setUser').textContent = user;
    $('setApiKey').value = localStorage.getItem('tf_apikey')||'';
    updateStreak();
    if (window.PublicKeyCredential) $('biometricBtn').style.display = 'flex';
  }
  // Shared plan via URL hash
  if (location.hash.startsWith('#plan=')) {
    try {
      const d = JSON.parse(atob(decodeURIComponent(location.hash.slice(6))));
      if (d.title && d.steps) { plan = d; planChecks = d.steps.map(()=>false); displayPlan(); showScreen('mainScreen'); }
    } catch{}
  }
  if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(()=>{});
}

// ══════════ AUTH ══════════
function updateGreeting() {
  const h = new Date().getHours();
  const k = h<6?'g_night':h<12?'g_morn':h<18?'g_day':'g_eve';
  $('greetingTime').textContent = t(k);
  $('greetingMsg').innerHTML = t('g_msg');
}

function updateAuthToggle() {
  $('authToggle').innerHTML = isSignUp
    ? `${t('auth_yes')} <a onclick="App.toggleAuth()">${t('auth_login')}</a>`
    : `${t('auth_no')} <a onclick="App.toggleAuth()">${t('auth_create')}</a>`;
}

function toggleAuth() {
  isSignUp = !isSignUp;
  $('apiKeyGroup').style.display = isSignUp ? 'block' : 'none';
  $('authBtn').textContent = isSignUp ? t('auth_create') : t('auth_btn');
  updateAuthToggle();
}

function handleAuth() {
  const u = $('authUser').value.trim(), p = $('authPass').value.trim();
  if (!u||!p) return toast(t('err_fill'),'error');
  if (isSignUp) {
    const k = $('authApiKey').value.trim();
    if (!k) return toast(t('err_key'),'error');
    localStorage.setItem('tf_user',u); localStorage.setItem('tf_pass',btoa(p)); localStorage.setItem('tf_apikey',k);
    toast(t('created'),'success');
  } else {
    if (u!==localStorage.getItem('tf_user')||btoa(p)!==localStorage.getItem('tf_pass')) return toast(t('err_fill'),'error');
    toast(t('welcome'),'success');
  }
  $('setUser').textContent = u; $('setApiKey').value = localStorage.getItem('tf_apikey')||'';
  showScreen('mainScreen'); updateStreak();
}

async function biometricAuth() {
  try {
    const c = await navigator.credentials.get({publicKey:{challenge:new Uint8Array(32),timeout:60000,userVerification:'required',rpId:location.hostname}});
    if (c) { toast(t('welcome'),'success'); showScreen('mainScreen'); updateStreak(); }
  } catch { toast(t('err_bio'),'error'); }
}

function logout() { ['tf_user','tf_pass','tf_apikey'].forEach(k=>localStorage.removeItem(k)); showScreen('authScreen'); toast(t('logged_out'),'info'); }

// ══════════ SCREENS ══════════
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
  $(id).classList.add('active');
  if (id==='historyScreen') renderHistory();
  if (id==='analyticsScreen') renderAnalytics();
  if (id==='mainScreen') { renderTemplates(); updateStreak(); }
}

// ══════════ VOICE ══════════
async function startRec(e) {
  e.preventDefault();
  try {
    const stream = await navigator.mediaDevices.getUserMedia({audio:true});
    recorder = new MediaRecorder(stream); chunks = [];
    recorder.ondataavailable = ev => chunks.push(ev.data);
    recorder.onstop = () => { stream.getTracks().forEach(t=>t.stop()); toast(t('rec_saved'),'success'); };
    recorder.start();
    $('voiceBtn').classList.add('recording'); $('waveContainer').classList.add('show');
    $('voiceHint').textContent = '...'; $('voiceTime').classList.add('show');
    recSec = 0;
    recTimer = setInterval(()=>{recSec++;$('voiceTime').textContent=`${String(Math.floor(recSec/60)).padStart(2,'0')}:${String(recSec%60).padStart(2,'0')}`;},1000);
  } catch { toast(t('no_mic'),'error'); }
}

function stopRec(e) {
  e.preventDefault();
  if (recorder&&recorder.state==='recording') {
    recorder.stop(); $('voiceBtn').classList.remove('recording'); $('waveContainer').classList.remove('show');
    $('voiceHint').textContent = t('voice_hint'); $('voiceTime').classList.remove('show'); clearInterval(recTimer);
  }
}

// ══════════ AI CALLS ══════════
async function aiCall(prompt) {
  const key = localStorage.getItem('tf_apikey');
  if (!key) throw new Error(t('err_key'));
  const r = await fetch('https://api.anthropic.com/v1/messages',{
    method:'POST',
    headers:{'Content-Type':'application/json','x-api-key':key,'anthropic-version':'2023-06-01','anthropic-dangerous-direct-browser-access':'true'},
    body:JSON.stringify({model:'claude-haiku-4-5-20251001',max_tokens:1500,messages:[{role:'user',content:prompt}]})
  });
  const d = await r.json();
  if (d.error) throw new Error(d.error.message);
  return d.content[0].text.replace(/```json|```/g,'').trim();
}

async function generate() {
  const input = $('thinkInput').value.trim();
  if (!input) return toast(t('err_idea'),'error');
  const btn = $('generateBtn');
  btn.disabled = true; btn.classList.add('loading');
  btn.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10" stroke-dasharray="30 70"><animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="1s" repeatCount="indefinite"/></circle></svg> ...`;
  try {
    const langName = {ru:'Russian',en:'English',uz:'Uzbek'}[lang]||'Russian';
    const txt = await aiCall(`You are ThinkFlow AI. Create an action plan. Answer ONLY valid JSON (no markdown):\n{"title":"Plan title","steps":[{"title":"Step","description":"Description","time_min":15}]}\n\n5-8 concrete steps with time estimates in minutes. Answer in ${langName}.\n\nIdea: ${input}`);
    plan = JSON.parse(txt);
    planChecks = plan.steps.map(()=>false);
    displayPlan(); savePlanToHistory(plan, input); updateStreak();
    toast(t('plan_ready'),'success');
  } catch(e) { toast(e.message,'error'); }
  finally {
    btn.disabled = false; btn.classList.remove('loading');
    btn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg><span data-i18n="gen_btn">${t('gen_btn')}</span>`;
  }
}

function displayPlan() {
  $('planTitle').textContent = plan.title;
  const total = plan.steps.reduce((s,st)=>s+(st.time_min||15),0);
  const hrs = Math.floor(total/60), mins = total%60;
  $('planTime').innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg> ${t('total_time')}: ${hrs?hrs+'ч ':''}${mins} мин`;
  updateProgress();
  $('planSteps').innerHTML = plan.steps.map((st,i) => `
    <div class="plan-step" draggable="true" data-idx="${i}" ondragstart="App.dragStart(event)" ondragover="App.dragOver(event)" ondragleave="App.dragLeave(event)" ondrop="App.drop(event)" style="animation:fadeUp .5s ${i*.08}s cubic-bezier(.16,1,.3,1) both">
      <div class="plan-step-line">
        <div class="plan-step-dot${planChecks[i]?' checked':''}" onclick="App.toggleCheck(${i})"></div>
        <div class="plan-step-connector"></div>
      </div>
      <div class="plan-step-content${planChecks[i]?' done':''}">
        <div class="plan-step-top">
          <div class="plan-step-num">${t('step_lbl')} ${i+1}</div>
          ${st.time_min?`<div class="plan-step-time"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg>${st.time_min} мин</div>`:''}
        </div>
        <div class="plan-step-title">${st.title}</div>
        <div class="plan-step-desc">${st.description}</div>
        <button class="plan-step-drill" onclick="App.openDrill(${i})"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><circle cx="12" cy="8" r=".5" fill="currentColor"/></svg>${t('explore')}</button>
      </div>
    </div>`).join('');
  $('planOutput').classList.add('show');
  $('improveSection').classList.add('show');
  $('planOutput').scrollIntoView({behavior:'smooth',block:'start'});
}

function toggleCheck(i) {
  planChecks[i] = !planChecks[i];
  updateProgress();
  // Re-render step visual
  const steps = document.querySelectorAll('.plan-step');
  const dot = steps[i]?.querySelector('.plan-step-dot');
  const content = steps[i]?.querySelector('.plan-step-content');
  if (dot) dot.classList.toggle('checked', planChecks[i]);
  if (content) content.classList.toggle('done', planChecks[i]);
  // Update plan in history
  updatePlanInHistory();
}

function updateProgress() {
  const done = planChecks.filter(Boolean).length, total = planChecks.length;
  const pct = total ? (done/total*100) : 0;
  $('progressFill').style.width = pct+'%';
  $('progressTxt').textContent = `${done} / ${total}`;
}

function updatePlanInHistory() {
  if (!plan) return;
  const plans = getPlans();
  const idx = plans.findIndex(p => p.title === plan.title);
  if (idx >= 0) { plans[idx].checks = [...planChecks]; savePlans(plans); }
}

// ══════════ DRAG & DROP ══════════
let dragIdx = null;
function dragStart(e) { dragIdx = +e.currentTarget.dataset.idx; e.currentTarget.classList.add('dragging'); e.dataTransfer.effectAllowed = 'move'; }
function dragOver(e) { e.preventDefault(); e.currentTarget.classList.add('drag-over'); }
function dragLeave(e) { e.currentTarget.classList.remove('drag-over'); }
function drop(e) {
  e.preventDefault(); e.currentTarget.classList.remove('drag-over');
  const dropIdx = +e.currentTarget.dataset.idx;
  if (dragIdx !== null && dragIdx !== dropIdx && plan) {
    const [step] = plan.steps.splice(dragIdx, 1);
    const [check] = planChecks.splice(dragIdx, 1);
    plan.steps.splice(dropIdx, 0, step);
    planChecks.splice(dropIdx, 0, check);
    displayPlan();
  }
  document.querySelectorAll('.dragging').forEach(el => el.classList.remove('dragging'));
  dragIdx = null;
}

// ══════════ IMPROVE ══════════
async function improve() {
  const fb = $('improveFeedback').value.trim();
  if (!fb || !plan) return toast(t('err_idea'),'error');
  const btn = $('improveBtn'); btn.disabled = true; btn.textContent = '...';
  try {
    const langName = {ru:'Russian',en:'English',uz:'Uzbek'}[lang]||'Russian';
    const txt = await aiCall(`Improve this plan based on feedback. Answer ONLY valid JSON (no markdown):\n{"title":"Title","steps":[{"title":"Step","description":"Desc","time_min":15}]}\n\nCurrent plan: ${JSON.stringify(plan)}\nFeedback: ${fb}\nAnswer in ${langName}.`);
    plan = JSON.parse(txt); planChecks = plan.steps.map(()=>false);
    displayPlan(); $('improveFeedback').value = '';
    toast(t('plan_improved'),'success');
  } catch(e) { toast(e.message,'error'); }
  finally { btn.disabled = false; btn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M23 4l-6 6m0-6l6 6M1 20l6-6m0 6l-6-6M12 2v4m0 12v4M2 12h4m12 0h4"/></svg><span data-i18n="improve_btn">${t('improve_btn')}</span>`; }
}

// ══════════ DRILL-DOWN ══════════
function openDrill(i) {
  if (!plan) return;
  drillStep = plan.steps[i];
  $('drillTitle').textContent = `${t('step_lbl')} ${i+1}`;
  $('drillCard').innerHTML = `<div class="drill-card-title">${drillStep.title}</div><div class="drill-card-desc">${drillStep.description}</div>`;
  $('drillChat').innerHTML = '';
  $('drillInput').value = '';
  showScreen('drillScreen');
}

async function drillAsk() {
  const q = $('drillInput').value.trim();
  if (!q || !drillStep) return;
  $('drillInput').value = '';
  const chat = $('drillChat');
  chat.innerHTML += `<div class="drill-msg user">${q}</div>`;
  chat.innerHTML += `<div class="drill-msg ai" id="drillLoading"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10" stroke-dasharray="30 70"><animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="1s" repeatCount="indefinite"/></circle></svg></div>`;
  chat.scrollTop = chat.scrollHeight;
  try {
    const langName = {ru:'Russian',en:'English',uz:'Uzbek'}[lang]||'Russian';
    const resp = await aiCall(`You are ThinkFlow AI assistant. The user is working on a plan step:\nTitle: ${drillStep.title}\nDescription: ${drillStep.description}\n\nAnswer the user's question concisely in ${langName}. No JSON, just natural text.\n\nQuestion: ${q}`);
    $('drillLoading')?.remove();
    chat.innerHTML += `<div class="drill-msg ai">${resp.replace(/\n/g,'<br>')}</div>`;
  } catch(e) {
    $('drillLoading')?.remove();
    chat.innerHTML += `<div class="drill-msg ai" style="color:var(--rose)">${e.message}</div>`;
  }
  chat.scrollTop = chat.scrollHeight;
}

// ══════════ HISTORY ══════════
function savePlanToHistory(p, input) {
  const plans = getPlans();
  const tpl = TEMPLATES.find(t => input.includes(t.prompt[lang]||t.prompt.en));
  plans.unshift({
    title: p.title, steps: p.steps, checks: planChecks,
    date: new Date().toISOString(), category: tpl?.key || 'custom',
    emoji: tpl?.emoji || '📝', input
  });
  if (plans.length > 100) plans.pop();
  savePlans(plans);
}

function renderHistory() {
  const plans = getPlans();
  const q = ($('histSearch')?.value || '').toLowerCase();
  const filtered = q ? plans.filter(p => p.title.toLowerCase().includes(q) || (p.input||'').toLowerCase().includes(q)) : plans;
  if (!filtered.length) { $('histList').innerHTML = ''; $('histEmpty').style.display = 'block'; return; }
  $('histEmpty').style.display = 'none';
  $('histList').innerHTML = filtered.map((p,i) => {
    const done = (p.checks||[]).filter(Boolean).length;
    const total = p.steps?.length || 0;
    const d = new Date(p.date);
    const dateStr = `${d.getDate()}.${d.getMonth()+1}.${d.getFullYear()}`;
    return `<div class="hist-card" onclick="App.loadPlan(${plans.indexOf(p)})">
      <div class="hist-emoji">${p.emoji||'📝'}</div>
      <div class="hist-info">
        <div class="hist-title">${p.title}</div>
        <div class="hist-meta"><span>${dateStr}</span><span>${done}/${total} ${t('step_lbl').toLowerCase()}</span></div>
      </div>
      <button class="hist-del" onclick="event.stopPropagation();App.delPlan(${plans.indexOf(p)})"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="3,6 5,6 21,6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/></svg></button>
    </div>`;
  }).join('');
}

function filterHist() { renderHistory(); }

function loadPlan(idx) {
  const plans = getPlans();
  if (!plans[idx]) return;
  plan = { title: plans[idx].title, steps: plans[idx].steps };
  planChecks = plans[idx].checks || plans[idx].steps.map(()=>false);
  displayPlan(); showScreen('mainScreen');
}

function delPlan(idx) {
  const plans = getPlans();
  plans.splice(idx, 1);
  savePlans(plans);
  renderHistory();
  toast(t('plan_deleted'),'info');
}

// ══════════ ANALYTICS ══════════
function renderAnalytics() {
  const plans = getPlans();
  const streak = getStreakData();
  const totalSteps = plans.reduce((s,p) => s + (p.steps?.length||0), 0);
  const doneSteps = plans.reduce((s,p) => s + (p.checks||[]).filter(Boolean).length, 0);
  const completed = plans.filter(p => p.checks && p.checks.length > 0 && p.checks.every(Boolean)).length;

  // Weekly chart
  const today = new Date();
  const weekData = [];
  const dayNames = t('days') || I18N.ru.days;
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today); d.setDate(d.getDate() - i);
    const ds = d.toISOString().slice(0,10);
    const count = plans.filter(p => p.date && p.date.startsWith(ds)).length;
    const dow = (d.getDay() + 6) % 7; // Mon=0
    weekData.push({ label: dayNames[dow], count });
  }
  const maxCount = Math.max(...weekData.map(d=>d.count), 1);

  // Categories
  const cats = {};
  plans.forEach(p => { const c = p.category||'custom'; cats[c] = (cats[c]||0)+1; });

  $('anContent').innerHTML = `
    <div class="an-cards">
      <div class="an-card"><div class="an-card-num" style="color:var(--accent2)">${plans.length}</div><div class="an-card-label">${t('an_total')}</div></div>
      <div class="an-card"><div class="an-card-num" style="color:var(--mint)">${completed}</div><div class="an-card-label">${t('an_done')}</div></div>
      <div class="an-card"><div class="an-card-num" style="color:var(--warm)">${doneSteps}</div><div class="an-card-label">${t('an_steps')}</div></div>
      <div class="an-card"><div class="an-card-num" style="color:var(--gold)">${streak.max||0}</div><div class="an-card-label">${t('an_streak')}</div></div>
    </div>
    <div class="section-label-sm">${t('an_week')}</div>
    <div class="an-chart">${weekData.map(d=>`<div class="an-bar-wrap"><div class="an-bar" style="height:${Math.max(d.count/maxCount*100,4)}%"></div><div class="an-bar-label">${d.label}</div></div>`).join('')}</div>
    ${Object.keys(cats).length ? `<div class="section-label-sm">${t('an_cats')}</div>${Object.entries(cats).sort((a,b)=>b[1]-a[1]).map(([k,v])=>{
      const tpl = TEMPLATES.find(t=>t.key===k);
      return `<div class="an-cat"><div class="an-cat-emoji">${tpl?.emoji||'📝'}</div><div class="an-cat-name">${tpl?.prompt[lang]||tpl?.prompt?.en||k}</div><div class="an-cat-count">${v}</div></div>`;
    }).join('')}` : ''}
  `;
}

// ══════════ EXPORT / SHARE ══════════
function exportPlan() {
  if (!plan) return;
  const md = `# ${plan.title}\n\n${plan.steps.map((s,i)=>`## ${t('step_lbl')} ${i+1}: ${s.title}\n${s.description}${s.time_min?` (${s.time_min} мин)`:''}\n`).join('\n')}`;
  if (navigator.clipboard) { navigator.clipboard.writeText(md); toast(t('copied'),'success'); }
}

function sharePlan() {
  if (!plan) return;
  const data = btoa(JSON.stringify({title:plan.title,steps:plan.steps}));
  const url = `${location.origin}${location.pathname}#plan=${encodeURIComponent(data)}`;
  if (navigator.share) {
    navigator.share({title:'ThinkFlow: '+plan.title, url}).catch(()=>{});
  } else if (navigator.clipboard) {
    navigator.clipboard.writeText(url); toast(t('copied'),'success');
  }
}

// ══════════ SETTINGS ══════════
function saveKey() {
  const k = $('setApiKey').value.trim();
  if (k) { localStorage.setItem('tf_apikey', k); toast(t('saved'),'success'); }
}

function exportAll() {
  const data = { plans: getPlans(), streak: getStreakData(), lang, user: localStorage.getItem('tf_user') };
  const blob = new Blob([JSON.stringify(data,null,2)],{type:'application/json'});
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
  a.download = `thinkflow-export-${new Date().toISOString().slice(0,10)}.json`;
  a.click(); toast(t('exported'),'success');
}

function clearAll() {
  if (!confirm(t('confirm_clear'))) return;
  localStorage.removeItem('tf_plans'); localStorage.removeItem('tf_streak');
  toast(t('cleared'),'info');
}

// ══════════ TOAST ══════════
const ICONS = {
  success:`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M20 6L9 17l-5-5"/></svg>`,
  error:`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><path d="M15 9l-6 6M9 9l6 6"/></svg>`,
  info:`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/></svg>`
};
function toast(msg,type='info') {
  const el=$('toast'); el.className=`toast ${type}`; el.innerHTML=`${ICONS[type]||''} ${msg}`;
  el.classList.add('show'); setTimeout(()=>el.classList.remove('show'),3000);
}

// ══════════ BOOT ══════════
init();

return { handleAuth, toggleAuth, biometricAuth, logout, showScreen, startRec, stopRec,
  generate, improve, toggleCheck, openDrill, drillAsk, exportPlan, sharePlan,
  loadPlan, delPlan, filterHist, setLang, saveKey, exportAll, clearAll, useTpl,
  dragStart, dragOver, dragLeave, drop };
})();
