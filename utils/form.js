import { todayStr } from './date';

export const REQUIRED_TOTAL = 10;

// One fitness activity entry. Days now hold an array of these under
// `fitnessEntries` instead of the seven flat fitness fields.
export function emptyFitnessEntry() {
  return {
    fitnessActivity: '', fitnessActivityOther: '', cardioDistance: '',
    terrain: '', yogaType: '', swimEnvironment: '', swimStroke: '',
  };
}

// Migrate a stored day from the legacy flat fitness fields to the
// `fitnessEntries` array. If the day already has a `fitnessEntries`
// array it is returned unchanged. Otherwise the legacy flat fields are
// wrapped into a single entry (preserving any entered values), and the
// now-obsolete flat keys are stripped. Run only in the form load path.
export function withFitnessMigration(d) {
  if (!d || typeof d !== 'object') return d;
  if (Array.isArray(d.fitnessEntries)) return d;
  const {
    fitnessActivity = '', fitnessActivityOther = '', cardioDistance = '',
    terrain = '', yogaType = '', swimEnvironment = '', swimStroke = '',
    ...rest
  } = d;
  const entry = {
    fitnessActivity, fitnessActivityOther, cardioDistance,
    terrain, yogaType, swimEnvironment, swimStroke,
  };
  return { ...rest, fitnessEntries: [entry] };
}

export function emptyForm(date) {
  return {
    date: date || todayStr(),
    wakeTime: '', weight: '', fitnessYesterday: '', workOff: '', sleepScore: '',
    location: '', pitTimeFrame: '', amWorkout: '',
    meditation: '', meditationDuration: '',
    fitnessEntries: [emptyFitnessEntry()],
    thankful1: '', thankful2: '', thankful3: '',
    oneThing: '', oneThingDone: false, oneThingSetup: '',
    tasks: Array(5).fill(null).map(() => ({ text: '', done: false })),
    nit: '',
    prayerType: 'prayer', prayerDone: false, devotionalNotes: '',
    scriptureQuery: '', scriptureResult: '',
    bookName: '', bookAuthor: '', bookPage: '', bookTopic: '',
    bookNotes: '', bookCompleted: false, bookAiQuery: '', bookAiResult: '',
    quotes: '', quotesInspirationQuery: '', quotesInspirationResult: '',
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
