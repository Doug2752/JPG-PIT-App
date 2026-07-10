import React, { useState, useEffect } from 'react';
import { GOLD, GOLD_LIGHT, DARK, BG, BORDER, DEFAULT_USERS, WEBAPP_URL } from '../utils/constants';
import { todayStr, localDateStr } from '../utils/date';
import { emptyForm, emptyFitnessEntry, withFitnessMigration, withCarryoverMigration, rebuildToAccomplishItems, isDayComplete, countComplete, REQUIRED_TOTAL } from '../utils/form';
import { storage } from '../services/storage';
import { callSheet } from '../services/sheet';
import {
  fetchScriptureAI,
  fetchBookAI as fetchBookAIService,
  fetchQuotesInspirationAI,
  generateSummaryAI,
} from '../services/ai';

import LoginScreen        from '../components/LoginScreen';
import Header             from '../components/Header';
import BrandBar           from '../components/BrandBar';
import WeekTracker        from '../components/WeekTracker';
import HelpPanel          from '../components/HelpPanel';
import DailyTrackingSection from '../components/DailyTrackingSection';
import GratitudeSection   from '../components/GratitudeSection';
import ToAccomplishSection from '../components/ToAccomplishSection';
import NotesSection       from '../components/NotesSection';
import DevotionalSection  from '../components/DevotionalSection';
import BookSection        from '../components/BookSection';
import QuotesSection      from '../components/QuotesSection';
import AppointmentsSection from '../components/AppointmentsSection';
import SummarySection     from '../components/SummarySection';
import ArchiveView        from '../components/ArchiveView';
import BooksView          from '../components/BooksView';
import { gbtn }           from '../components/styles';

// Storage key helpers
const sk          = (uid, d) => `pit_${uid}_${d}`;
const ak          = (uid)    => `pit_arch_${uid}`;
const sentKey     = (uid)    => `pit_sent_${uid}`;
const booksKey    = (uid)    => `pit_books_${uid}`;
const apptKey     = (uid)    => `pit_appts_${uid}`;
const devTypeKey  = (uid)    => `pit_devtype_${uid}`;

export default function PITApp() {
  const [currentUser,    setCU]            = useState(() => {
    const username = new URLSearchParams(window.location.search).get('hub_user');
    if (username) {
      const id = username.toLowerCase();
      const u = DEFAULT_USERS[id];
      return u ? { ...u, id } : null;
    }
    return null;
  });
  const [view,           setView]          = useState('form');
  const [fd,             setFd]            = useState(emptyForm());
  const [archive,        setArchive]       = useState([]);
  const [archiveMode,    setAM]            = useState(false);
  const [noEntryDate,    setNoEntryDate]   = useState(null);
  const [aiLoad,         setAL]            = useState({});
  const [weekData,       setWD]            = useState({ completeDays: [], sentDates: [], canSend: false });
  const [coachMsg,       setCM]            = useState({ hasMessage: false, message: '', dismissed: false });
  const [replyText,      setRT]            = useState('');
  const [submitting,     setSub]           = useState(false);
  const [submitMsg,      setSMsg]          = useState('');
  const [streak,         setStreak]        = useState(0);
  const [completedBooks, setCompletedBooks] = useState([]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showHelp,       setShowHelp]      = useState(false);
  const [appointments,   setAppointments]  = useState([]);
  const [showClearModal, setShowClearModal] = useState(false);
  const [toastMessage,   setToastMessage]   = useState('');

  useEffect(() => {
    if (currentUser) {
      loadToday();
      loadArchive();
      loadCompletedBooks();
      loadAppointments();
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser && archive.length >= 0) {
      calcWeekStatus();
      calcStreak();
    }
  }, [archive, currentUser]);

  useEffect(() => {
    if (currentUser && WEBAPP_URL !== 'PASTE_YOUR_WEBAPP_URL_HERE') {
      checkCoachMsg();
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser && !localStorage.getItem('pit_instructions_seen')) {
      setShowHelp(true);
    }
  }, [currentUser]);


  // ── Data loaders ──────────────────────────────────────────────────────────

  async function loadToday() {
    setNoEntryDate(null);
    try {
      const r = await storage.get(sk(currentUser.id, todayStr()));
      if (r) {
        setFd(withCarryoverMigration(withFitnessMigration(JSON.parse(r.value))));
      } else {
        const pref = await storage.get(devTypeKey(currentUser.id));
        const carried = await applyCarryover(currentUser.id, todayStr());
        const base = carried || emptyForm();
        setFd({ ...base, prayerType: pref ? pref.value : 'prayer' });
      }
    } catch {
      setFd(emptyForm());
    }
  }

  // Pull unresolved To Accomplish items forward from the most recent
  // prior PIT day into a fresh today form, preserving each carried
  // item's identity (id / origin_date / resolution fields / carry
  // history) so origin-day memorialization can resolve back to source.
  // Writes today's date into each carried item's carried_dates on the
  // SOURCE day's record. Returns the merged today form, or null when
  // there is no prior record or nothing unresolved to carry.
  async function applyCarryover(uid, todayDate) {
    try {
      const ar = await storage.get(ak(uid)).catch(() => null);
      const list = ar ? JSON.parse(ar.value) : [];
      const priorDates = list.filter(d => d < todayDate).sort();
      const priorDate = priorDates.length ? priorDates[priorDates.length - 1] : null;
      if (!priorDate) return null;

      const pr = await storage.get(sk(uid, priorDate)).catch(() => null);
      if (!pr) return null;
      const priorDay = withCarryoverMigration(withFitnessMigration(JSON.parse(pr.value)));
      const items = Array.isArray(priorDay.toAccomplishItems) ? priorDay.toAccomplishItems : [];

      const unresolved = items.filter(it => it && it.resolution_status === null);
      if (unresolved.length === 0) return null;

      const today = emptyForm(todayDate);
      const slotToTaskIndex = { daily_2: 0, daily_3: 1, future_4: 2, future_5: 3, future_6: 4 };
      const carriedItems = [];
      for (const it of unresolved) {
        if (it.slot === 'one_thing') {
          today.oneThing = it.text;
          today.oneThingDone = false;
        } else if (slotToTaskIndex[it.slot] != null) {
          today.tasks[slotToTaskIndex[it.slot]] = { text: it.text, done: false };
        } else {
          continue;
        }
        carriedItems.push({
          id: it.id,
          slot: it.slot,
          text: it.text,
          done: false,
          origin_date: it.origin_date,
          resolution_status: it.resolution_status,
          resolution_date: it.resolution_date,
          carried_dates: Array.isArray(it.carried_dates) ? [...it.carried_dates] : [],
        });
      }
      today.toAccomplishItems = carriedItems;

      const updatedItems = items.map(it => {
        if (it && it.resolution_status === null) {
          const carried = Array.isArray(it.carried_dates) ? it.carried_dates : [];
          if (!carried.includes(todayDate)) {
            return { ...it, carried_dates: [...carried, todayDate] };
          }
        }
        return it;
      });
      await storage.set(sk(uid, priorDate), JSON.stringify({ ...priorDay, toAccomplishItems: updatedItems }));

      return today;
    } catch {
      return null;
    }
  }

  async function loadArchive() {
    try {
      const r = await storage.get(ak(currentUser.id));
      if (r) setArchive(JSON.parse(r.value));
    } catch {
      setArchive([]);
    }
  }

  async function loadCompletedBooks() {
    try {
      const r = await storage.get(booksKey(currentUser.id));
      if (r) setCompletedBooks(JSON.parse(r.value));
    } catch {
      setCompletedBooks([]);
    }
  }

  async function loadAppointments() {
    try {
      const r = await storage.get(apptKey(currentUser.id));
      const parsed = r ? JSON.parse(r.value) : [];
      setAppointments(parsed.filter(a => !(a.title === '' && (a.date === '' || a.date === todayStr()))));
    } catch {
      setAppointments([]);
    }
  }

  async function saveAppointments(list) {
    if (!currentUser) return;
    try {
      await storage.set(apptKey(currentUser.id), JSON.stringify(list));
    } catch {}
  }

  async function getSentDates() {
    try {
      const r = await storage.get(sentKey(currentUser.id));
      return r ? JSON.parse(r.value) : [];
    } catch {
      return [];
    }
  }

  async function calcWeekStatus() {
    const sent = await getSentDates();
    const days = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      days.push(localDateStr(d));
    }
    const completeDays = [];
    for (const d of days) {
      if (sent.includes(d)) continue;
      try {
        const r = await storage.get(sk(currentUser.id, d));
        if (r) {
          const entry = JSON.parse(r.value);
          if (isDayComplete(entry)) completeDays.push(d);
        }
      } catch {}
    }
    setWD({ completeDays, sentDates: sent, canSend: completeDays.length >= 7 });
  }

  async function calcStreak() {
    let s = 0;
    const today = new Date();
    for (let i = 0; i < 365; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const ds = localDateStr(d);
      try {
        const r = await storage.get(sk(currentUser.id, ds));
        if (r && isDayComplete(JSON.parse(r.value))) {
          s++;
        } else {
          break;
        }
      } catch {
        break;
      }
    }
    setStreak(s);
  }

  // ── Persistence ───────────────────────────────────────────────────────────

  async function save(data) {
    if (!currentUser) return;
    try {
      data.toAccomplishItems = rebuildToAccomplishItems(data);
      await storage.set(sk(currentUser.id, data.date), JSON.stringify(data));
      const r = await storage.get(ak(currentUser.id)).catch(() => null);
      let list = r ? JSON.parse(r.value) : [];
      if (!list.includes(data.date)) {
        list = [data.date, ...list].slice(0, 90);
        await storage.set(ak(currentUser.id), JSON.stringify(list));
        setArchive(list);
      }
    } catch {}
  }

  function upd(f, v) {
    if (archiveMode) return;
    if (f === 'oneThingDone') {
      const item = (fd.toAccomplishItems || []).find(it => it && it.slot === 'one_thing');
      if (item && item.origin_date < todayStr()) {
        resolveCarriedItem('one_thing', v);
        return;
      }
    }
    const n = { ...fd, [f]: v };
    setFd(n);
    save(n);
    if (f === 'prayerType' && currentUser) {
      storage.set(devTypeKey(currentUser.id), v);
    }
  }

  function updMulti(pairs) {
    if (archiveMode) return;
    const n = { ...fd, ...Object.fromEntries(pairs) };
    setFd(n);
    save(n);
  }

  function updTask(i, f, v) {
    if (archiveMode) return;
    if (f === 'done') {
      const slot = { 0: 'daily_2', 1: 'daily_3', 2: 'future_4', 3: 'future_5', 4: 'future_6' }[i];
      const item = (fd.toAccomplishItems || []).find(it => it && it.slot === slot);
      if (item && item.origin_date < todayStr()) {
        resolveCarriedItem(slot, v);
        return;
      }
    }
    const tasks = fd.tasks.map((x, j) => j === i ? { ...x, [f]: v } : x);
    const n = { ...fd, tasks };
    setFd(n);
    save(n);
  }

  // Resolve a CARRIED To Accomplish item (origin_date < today) from
  // today's screen. Option A: checking done memorializes the resolution
  // on the ORIGIN day's record (matched by id) and clears today's slot
  // so it is freed and will not re-carry. No in-place uncheck for
  // carried items — once done, the slot is empty and available.
  async function resolveCarriedItem(slot, done) {
    const items = fd.toAccomplishItems || [];
    const item = items.find(it => it && it.slot === slot);
    const isCarried = !!(item && item.origin_date < todayStr());
    const slotToTaskIndex = { daily_2: 0, daily_3: 1, future_4: 2, future_5: 3, future_6: 4 };

    let n;
    if (slot === 'one_thing') {
      n = done ? { ...fd, oneThing: '', oneThingDone: false } : { ...fd, oneThingDone: false };
    } else {
      const i = slotToTaskIndex[slot];
      const tasks = fd.tasks.map((x, j) => j === i
        ? (done ? { text: '', done: false } : { ...x, done: false })
        : x);
      n = { ...fd, tasks };
    }

    if (isCarried && done) {
      try {
        const pr = await storage.get(sk(currentUser.id, item.origin_date)).catch(() => null);
        if (pr) {
          const originDay = withCarryoverMigration(withFitnessMigration(JSON.parse(pr.value)));
          const originItems = Array.isArray(originDay.toAccomplishItems) ? originDay.toAccomplishItems : [];
          const updatedOriginItems = originItems.map(oi =>
            oi && oi.id === item.id
              ? { ...oi, resolution_status: 'done', resolution_date: todayStr() }
              : oi
          );
          await storage.set(sk(currentUser.id, item.origin_date), JSON.stringify({ ...originDay, toAccomplishItems: updatedOriginItems }));
        }
      } catch {}
    }

    setFd(n);
    save(n);
  }

  // Clear selected To Accomplish slots. Carried items (origin_date <
  // today) are memorialized as 'cleared' on their origin day (matched
  // by id); today's slots are emptied and save() rebuild drops them.
  async function handleClearConfirm(selectedSlots) {
    if (archiveMode) return;
    const slots = selectedSlots || [];
    if (slots.length === 0) {
      setShowClearModal(false);
      return;
    }
    const items = fd.toAccomplishItems || [];
    const slotToTaskIndex = { daily_2: 0, daily_3: 1, future_4: 2, future_5: 3, future_6: 4 };
    const n = { ...fd, tasks: fd.tasks.map(t => ({ ...t })) };
    let cleared = 0;
    for (const slot of slots) {
      if (slot === 'one_thing') {
        n.oneThing = '';
        n.oneThingDone = false;
      } else if (slotToTaskIndex[slot] != null) {
        n.tasks[slotToTaskIndex[slot]] = { text: '', done: false };
      } else {
        continue;
      }
      const item = items.find(it => it && it.slot === slot);
      if (item && item.origin_date < todayStr()) {
        try {
          const pr = await storage.get(sk(currentUser.id, item.origin_date)).catch(() => null);
          if (pr) {
            const originDay = withCarryoverMigration(withFitnessMigration(JSON.parse(pr.value)));
            const originItems = Array.isArray(originDay.toAccomplishItems) ? originDay.toAccomplishItems : [];
            const updatedOriginItems = originItems.map(oi =>
              oi && oi.id === item.id
                ? { ...oi, resolution_status: 'cleared', resolution_date: todayStr() }
                : oi
            );
            await storage.set(sk(currentUser.id, item.origin_date), JSON.stringify({ ...originDay, toAccomplishItems: updatedOriginItems }));
          }
        } catch {}
      }
      cleared++;
    }
    setFd(n);
    save(n);
    setShowClearModal(false);
    setToastMessage(`${cleared} item${cleared === 1 ? '' : 's'} cleared`);
    setTimeout(() => setToastMessage(''), 2500);
  }

  function removeTask(absoluteIndex) {
    if (archiveMode) return;
    const tasks = [...fd.tasks];
    for (let j = absoluteIndex; j <= 3; j++) {
      tasks[j] = { ...fd.tasks[j + 1] };
    }
    tasks[4] = { text: '', done: false };
    const futureTasksVisible = Math.max(0, (fd.futureTasksVisible ?? 1) - 1);
    const n = { ...fd, tasks, futureTasksVisible };
    setFd(n);
    save(n);
  }

  function updFitnessEntry(i, patch) {
    if (archiveMode) return;
    const fitnessEntries = fd.fitnessEntries.map((e, j) => j === i ? { ...e, ...patch } : e);
    const n = { ...fd, fitnessEntries };
    setFd(n);
    save(n);
  }

  function addFitnessEntry() {
    if (archiveMode) return;
    const fitnessEntries = [...fd.fitnessEntries, emptyFitnessEntry()];
    const n = { ...fd, fitnessEntries };
    setFd(n);
    save(n);
  }

  function removeFitnessEntry(i) {
    if (archiveMode) return;
    if (fd.fitnessEntries.length <= 1) return;
    const fitnessEntries = fd.fitnessEntries.filter((_, j) => j !== i);
    const n = { ...fd, fitnessEntries };
    setFd(n);
    save(n);
  }

  function updAppt(id, f, v) {
    if (archiveMode) return;
    const updated = appointments.map(a => a.id === id ? { ...a, [f]: v } : a);
    setAppointments(updated);
    saveAppointments(updated);
  }

  function addAppt() {
    if (archiveMode) return;
    const today = todayStr();
    if (appointments.filter(a => a.date >= today).length >= 5) return;
    const updated = [...appointments, { id: Date.now(), date: today, title: '', time: '', duration: '', location: '', prep: '', smsReminder: false, smsTime: '', resolved: false }];
    setAppointments(updated);
    saveAppointments(updated);
  }

  function removeAppt(id) {
    if (archiveMode) return;
    const updated = appointments.filter(a => a.id !== id);
    setAppointments(updated);
    saveAppointments(updated);
  }

  function resolveAppt(id) {
    if (archiveMode) return;
    const updated = appointments.map(a => a.id === id ? { ...a, resolved: true, resolution_date: todayStr() } : a);
    setAppointments(updated);
    saveAppointments(updated);
  }

  async function markBookComplete() {
    if (archiveMode) return;
    if (!fd.bookName.trim()) return;
    const entry = { title: fd.bookName.trim(), author: fd.bookAuthor || '', date: fd.date };
    const updated = [entry, ...completedBooks.filter(b => b.title !== fd.bookName.trim())].slice(0, 50);
    setCompletedBooks(updated);
    await storage.set(booksKey(currentUser.id), JSON.stringify(updated));
    upd('bookCompleted', true);
  }

  function toggleHelp() {
    setShowHelp(prev => {
      if (prev) localStorage.setItem('pit_instructions_seen', '1');
      return !prev;
    });
  }

  // ── Auth ──────────────────────────────────────────────────────────────────

  function login(username) {
    const id = username.toLowerCase();
    const u = DEFAULT_USERS[id];
    if (u) setCU({ ...u, id });
  }

  // ── Coach / Submit ────────────────────────────────────────────────────────

  async function checkCoachMsg() {
    const res = await callSheet({ action: 'check_messages', userId: currentUser.id });
    if (res && res.hasMessage) {
      setCM({ hasMessage: true, message: res.message, dismissed: false });
    }
  }

  async function dismissMsg() {
    await callSheet({ action: 'read_receipt', userId: currentUser.id });
    setCM(p => ({ ...p, dismissed: true }));
  }

  async function sendReply() {
    if (!replyText.trim()) return;
    await callSheet({ action: 'send_reply', userId: currentUser.id, reply: replyText.trim() });
    setRT('');
    setCM(p => ({ ...p, dismissed: true, hasMessage: false }));
    setSMsg('Reply sent to coach.');
    setTimeout(() => setSMsg(''), 3000);
  }

  async function doSubmit(partial = false) {
    setSub(true);
    setSMsg('');
    const sent   = await getSentDates();
    const toSend = weekData.completeDays;
    if (toSend.length === 0) {
      setSMsg('No complete days to submit.');
      setSub(false);
      return;
    }
    const entries = [];
    for (const d of toSend) {
      try {
        const r = await storage.get(sk(currentUser.id, d));
        if (r) entries.push({ date: d, data: JSON.parse(r.value) });
      } catch {}
    }
    const payload = { action: 'submit_data', userId: currentUser.id, userName: currentUser.name, entries, submissionType: partial ? 'partial' : 'full' };
    const res = await callSheet(payload);
    if ((res && res.status === 'success') || WEBAPP_URL === 'PASTE_YOUR_WEBAPP_URL_HERE') {
      const newSent = [...new Set([...sent, ...toSend])];
      await storage.set(sentKey(currentUser.id), JSON.stringify(newSent));
      await calcWeekStatus();
      setSMsg(partial ? `Partial submission sent (${toSend.length} days).` : `Week complete! ${toSend.length} days submitted.`);
    } else {
      setSMsg('Submission error. Check connection and try again.');
    }
    setSub(false);
  }

  // ── AI ────────────────────────────────────────────────────────────────────

  async function callAI(fetchFn, field, ...args) {
    setAL(p => ({ ...p, [field]: true }));
    try {
      const result = await fetchFn(...args);
      upd(field, result);
    } catch (e) {
      upd(field, 'Error: ' + e.message);
    }
    setAL(p => ({ ...p, [field]: false }));
  }

  function fetchScripture() {
    if (!fd.scriptureQuery.trim()) return;
    callAI(fetchScriptureAI, 'scriptureResult', fd.scriptureQuery);
  }

  function fetchBookAI() {
    if (!fd.bookAiQuery.trim()) return;
    callAI(fetchBookAIService, 'bookAiResult', fd.bookAiQuery, fd.bookName, fd.bookAuthor, fd.bookTopic);
  }

  function fetchQuotesInspiration() {
    if (!fd.quotesInspirationQuery.trim()) return;
    callAI(fetchQuotesInspirationAI, 'quotesInspirationResult', fd.quotesInspirationQuery);
  }

  async function genSummary() {
    setAL(p => ({ ...p, aiSummary: true }));
    try {
      const dopUser  = currentUser.id.charAt(0).toUpperCase() + currentUser.id.slice(1);
      const dates    = [fd.date, ...archive.filter(d => d !== fd.date)].slice(0, 8);
      const entries  = await Promise.all(dates.map(async d => {
        try {
          const r    = await storage.get(sk(currentUser.id, d));
          const rDop = await storage.get(`${dopUser}_dop7_form_${d}`).catch(() => null);
          return r ? { date: d, data: JSON.parse(r.value), dop: rDop ? JSON.parse(rDop.value) : null } : null;
        } catch { return null; }
      }));
      const rAppts       = await storage.get(apptKey(currentUser.id)).catch(() => null);
      const allAppts     = rAppts ? JSON.parse(rAppts.value) : [];
      const upcomingAppts = allAppts
        .filter(a => a.date >= todayStr())
        .sort((a, b) => a.date.localeCompare(b.date));
      const result = await generateSummaryAI(entries, upcomingAppts);
      upd('aiSummary', result);
    } catch (e) {
      upd('aiSummary', 'Error: ' + e.message);
    }
    setAL(p => ({ ...p, aiSummary: false }));
  }

  // ── Archive navigation ────────────────────────────────────────────────────

  async function openArchive(date) {
    try {
      const r = await storage.get(sk(currentUser.id, date));
      if (r) {
        setFd(withCarryoverMigration(withFitnessMigration(JSON.parse(r.value))));
        setNoEntryDate(null);
        setAM(true);
        setView('form');
      } else {
        setFd(emptyForm(date));
        setNoEntryDate(date);
        setAM(true);
        setView('form');
      }
    } catch {}
  }

  function backToday() {
    setAM(false);
    loadToday();
  }

  // ── DOP button ────────────────────────────────────────────────────────────

  function DOPBtn({ top = false }) {
    return (
      <button
        style={{ ...gbtn({ width: '100%', padding: '5px 14px', fontSize: 15, fontWeight: 900, letterSpacing: 1, background: GOLD_LIGHT }), marginBottom: top ? 14 : 0, marginTop: top ? 0 : 14 }}
        onClick={() => window.open(`http://localhost:5174/?hub_user=${currentUser.id}`, '_blank')}
      >
        Open Daily Operational Process (DOP)
      </button>
    );
  }

  // ── Render ────────────────────────────────────────────────────────────────

  if (!currentUser) {
    return (
      <LoginScreen onLogin={login} />
    );
  }

  if (view === 'archive') {
    return (
      <ArchiveView
        archive={archive}
        weekData={weekData}
        completedBooks={completedBooks}
        streak={streak}
        currentUser={currentUser}
        setCU={setCU}
        setView={setView}
        openArchive={openArchive}
      />
    );
  }

  if (view === 'books') {
    return (
      <BooksView
        completedBooks={completedBooks}
        streak={streak}
        currentUser={currentUser}
        setCU={setCU}
        setView={setView}
      />
    );
  }

  if (archiveMode && noEntryDate) {
    return (
      <div style={{ minHeight: '100vh', background: BG, fontFamily: 'sans-serif', overflowX: 'hidden' }}>
        <Header
          view={view} setView={setView}
          archiveMode={archiveMode} backToday={backToday}
          streak={streak}
          complete={false}
          fd={fd}
          completedBooks={completedBooks}
          showHelp={showHelp} onHelpToggle={toggleHelp}
          currentUser={currentUser} setCU={setCU}
          coachMsg={coachMsg}
          replyText={replyText} setRT={setRT}
          sendReply={sendReply} dismissMsg={dismissMsg}
        />
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '16px 20px' }}>
          <div style={{ fontSize: 16, color: '#888', textAlign: 'center', padding: '40px 0' }}>
            No PIT entry for this day
          </div>
        </div>
      </div>
    );
  }

  // Main form view
  const complete = isDayComplete(fd);
  const clearSlotDefs = [
    { slot: 'one_thing', label: 'The One Thing', text: fd.oneThing || '' },
    { slot: 'daily_2',   label: 'Daily Task 2',  text: fd.tasks[0]?.text || '' },
    { slot: 'daily_3',   label: 'Daily Task 3',  text: fd.tasks[1]?.text || '' },
    { slot: 'future_4',  label: 'Future Task 4', text: fd.tasks[2]?.text || '' },
    { slot: 'future_5',  label: 'Future Task 5', text: fd.tasks[3]?.text || '' },
    { slot: 'future_6',  label: 'Future Task 6', text: fd.tasks[4]?.text || '' },
  ];
  const clearModalItems = clearSlotDefs
    .filter(s => s.text.trim() !== '')
    .map(s => {
      const it = (fd.toAccomplishItems || []).find(x => x && x.slot === s.slot);
      return { slot: s.slot, label: s.label, text: s.text, originDay: it ? it.origin_date : 'Today' };
    });
  const visibleAppointments = appointments
    .filter(a => a.resolved !== true)
    .sort((a, b) => (a.date || '').localeCompare(b.date || ''));

  return (
    <div style={{ minHeight: '100vh', background: BG, fontFamily: 'sans-serif', overflowX: 'hidden' }}>
      <Header
        view={view} setView={setView}
        archiveMode={archiveMode} backToday={backToday}
        streak={streak}
        complete={complete}
        fd={fd}
        completedBooks={completedBooks}
        showHelp={showHelp} onHelpToggle={toggleHelp}
        currentUser={currentUser} setCU={setCU}
        coachMsg={coachMsg}
        replyText={replyText} setRT={setRT}
        sendReply={sendReply} dismissMsg={dismissMsg}
      />

      <BrandBar
        fd={fd} upd={upd}
        showDatePicker={showDatePicker}
        setShowDatePicker={setShowDatePicker}
      />

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '16px 20px', boxSizing: 'border-box', width: '100%' }}>
        <WeekTracker
          weekData={weekData}
          submitting={submitting}
          doSubmit={doSubmit}
          submitMsg={submitMsg}
        />

        {showHelp && <HelpPanel onClose={toggleHelp} />}

        <DOPBtn top />

        <DailyTrackingSection fd={fd} upd={upd} updMulti={updMulti}
          updFitnessEntry={updFitnessEntry} addFitnessEntry={addFitnessEntry} removeFitnessEntry={removeFitnessEntry} />

        <GratitudeSection
          thankful1={fd.thankful1} thankful2={fd.thankful2} thankful3={fd.thankful3}
          upd={upd}
        />

        <ToAccomplishSection
          fd={fd} upd={upd} updTask={updTask} removeTask={removeTask}
          showClearModal={showClearModal}
          onClearModalOpen={() => setShowClearModal(true)}
          clearModalItems={clearModalItems}
          onClearConfirm={handleClearConfirm}
          onClearCancel={() => setShowClearModal(false)}
          toastMessage={toastMessage}
          archiveMode={archiveMode}
          archiveDateStr={archiveMode ? (fd.date || '') : ''}
        />

        <NotesSection nit={fd.nit} upd={upd} />

        <DevotionalSection
          fd={fd} upd={upd} updMulti={updMulti}
          fetchScripture={fetchScripture}
          aiLoadScripture={!!aiLoad.scriptureResult}
        />

        <BookSection
          fd={fd} upd={upd} updMulti={updMulti}
          markBookComplete={markBookComplete}
          fetchBookAI={fetchBookAI}
          aiLoadBook={!!aiLoad.bookAiResult}
        />

        <QuotesSection
          fd={fd} upd={upd} updMulti={updMulti}
          fetchQuotesInspiration={fetchQuotesInspiration}
          aiLoadQuotes={!!aiLoad.quotesInspirationResult}
        />

        <AppointmentsSection
          appointments={visibleAppointments}
          updAppt={updAppt}
          addAppt={addAppt}
          removeAppt={removeAppt}
          resolveAppt={resolveAppt}
        />

        <SummarySection
          fd={fd}
          genSummary={genSummary}
          aiLoadSummary={!!aiLoad.aiSummary}
          weekData={weekData}
          submitting={submitting}
          submitMsg={submitMsg}
          doSubmit={doSubmit}
          setSMsg={setSMsg}
        />

        <DOPBtn />

        <div style={{ textAlign: 'center', padding: '20px 0', marginTop: 16, fontSize: 10, color: '#aaa', borderTop: `1px solid ${BORDER}` }}>
          JPG-PIT-001-v9 &nbsp;·&nbsp; Jones Performance Group LLC &nbsp;·&nbsp; Personal Investment Time &nbsp;·&nbsp; CONFIDENTIAL
        </div>
      </div>
    </div>
  );
}
