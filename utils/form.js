import { todayStr } from './date';

export const REQUIRED_TOTAL = 10;

export function emptyForm(date) {
  return {
    date: date || todayStr(),
    wakeTime: '', weight: '', fitnessYesterday: '', workOff: '', sleepScore: '',
    location: '', pitTimeFrame: '', amWorkout: '',
    meditation: '', meditationDuration: '',
    fitnessActivity: '', fitnessActivityOther: '', cardioDistance: '',
    terrain: '', yogaType: '', swimEnvironment: '', swimStroke: '',
    thankful1: '', thankful2: '', thankful3: '',
    oneThing: '', oneThingDone: false, oneThingSetup: '',
    tasks: Array(5).fill(null).map(() => ({ text: '', done: false })),
    nit: '',
    prayerType: 'prayer', prayerDone: false, devotionalNotes: '',
    scriptureQuery: '', scriptureResult: '',
    bookName: '', bookAuthor: '', bookPage: '', bookTopic: '',
    bookNotes: '', bookCompleted: false, bookAiQuery: '', bookAiResult: '',
    quotes: '', quotesInspirationQuery: '', quotesInspirationResult: '',
    appointments: [{ title: '', time: '', duration: '', location: '', prep: '', smsReminder: false, smsTime: '' }],
    futureTasksVisible: 1,
    aiSummary: '', sent: false, neverTwiceRead: false
  };
}

export function isDayComplete(d) {
  if (!d) return false;
  return !!(
    d.wakeTime && d.weight && d.fitnessYesterday && d.workOff && d.sleepScore &&
    (d.thankful1 || '').trim() && (d.thankful2 || '').trim() && (d.thankful3 || '').trim() &&
    (d.oneThing || '').trim() && (d.nit || '').trim()
  );
}

export function countComplete(d) {
  if (!d) return 0;
  return [
    !!d.wakeTime, !!d.weight, !!d.workOff, !!d.sleepScore, !!d.fitnessYesterday,
    !!(d.thankful1 || '').trim(), !!(d.thankful2 || '').trim(), !!(d.thankful3 || '').trim(),
    !!(d.oneThing || '').trim(), !!(d.nit || '').trim()
  ].filter(Boolean).length;
}
