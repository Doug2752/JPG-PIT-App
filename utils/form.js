import { todayStr } from './date';

export const REQUIRED_TOTAL = 10;

// One fitness activity entry. Days now hold an array of these under
// `fitnessEntries` instead of the seven flat fitness fields.
export function emptyFitnessEntry() {
  return {
    fitnessActivity: '', fitnessActivityOther: '', cardioDistance: '',
    terrain: '', yogaType: '', swimEnvironment: '', swimStroke: '',
    recurringId: '', recurringName: '', distanceOrDuration: 'distance',
    defaultDuration: '', confirmedDone: false,
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

// Build the parallel `toAccomplishItems` array from the existing
// To Accomplish fields on read. Migration-on-read only: it leaves
// oneThing / oneThingDone / oneThingSetup / tasks[] untouched and
// derives item-ID records (id, slot, origin_date, resolution tracking,
// carry history) for the future carryover engine. Only slots with
// content (non-empty text or done === true) are included. A day that
// already carries a toAccomplishItems array is returned unchanged.
// Pure — takes d, returns a new object, no side effects.
export function withCarryoverMigration(d) {
  if (!d || typeof d !== 'object') return d;
  if (Array.isArray(d.toAccomplishItems)) return d;

  const originDate = d.date || todayStr();
  const tasks = Array.isArray(d.tasks) ? d.tasks : [];

  const sources = [
    { slot: 'one_thing', text: d.oneThing || '',      done: !!d.oneThingDone },
    { slot: 'daily_2',   text: tasks[0]?.text || '',  done: !!tasks[0]?.done },
    { slot: 'daily_3',   text: tasks[1]?.text || '',  done: !!tasks[1]?.done },
    { slot: 'future_4',  text: tasks[2]?.text || '',  done: !!tasks[2]?.done },
    { slot: 'future_5',  text: tasks[3]?.text || '',  done: !!tasks[3]?.done },
    { slot: 'future_6',  text: tasks[4]?.text || '',  done: !!tasks[4]?.done },
  ];

  const toAccomplishItems = sources
    .filter(s => s.text.trim() !== '' || s.done === true)
    .map(s => ({
      id: `${Date.now()}_${Math.random().toString(36).slice(2)}`,
      slot: s.slot,
      text: s.text,
      done: s.done,
      origin_date: originDate,
      resolution_status: s.done ? 'done' : null,
      resolution_date: null,
      carried_dates: [],
    }));

  return { ...d, toAccomplishItems };
}

// Rebuild the parallel `toAccomplishItems` array from the current
// To Accomplish field values. Called on every save so the parallel
// field stays in sync with the source-of-truth oneThing / tasks[]
// fields. Preserves prior item metadata (id, origin_date, resolution
// tracking, carry history) for any slot that already had an entry,
// refreshing only text/done. New content with no prior entry gets a
// fresh id and origin_date = today. Slots that are now empty (blank
// text and not done) are dropped. Pure — returns the rebuilt array,
// not the full day object.
export function rebuildToAccomplishItems(d) {
  if (!d || typeof d !== 'object') return [];
  const prior = Array.isArray(d.toAccomplishItems) ? d.toAccomplishItems : [];
  const priorBySlot = {};
  for (const item of prior) {
    if (item && item.slot) priorBySlot[item.slot] = item;
  }
  const tasks = Array.isArray(d.tasks) ? d.tasks : [];

  const sources = [
    { slot: 'one_thing', text: d.oneThing || '',      done: !!d.oneThingDone },
    { slot: 'daily_2',   text: tasks[0]?.text || '',  done: !!tasks[0]?.done },
    { slot: 'daily_3',   text: tasks[1]?.text || '',  done: !!tasks[1]?.done },
    { slot: 'future_4',  text: tasks[2]?.text || '',  done: !!tasks[2]?.done },
    { slot: 'future_5',  text: tasks[3]?.text || '',  done: !!tasks[3]?.done },
    { slot: 'future_6',  text: tasks[4]?.text || '',  done: !!tasks[4]?.done },
  ];

  return sources
    .filter(s => s.text.trim() !== '' || s.done === true)
    .map(s => {
      const existing = priorBySlot[s.slot];
      if (existing) {
        return { ...existing, text: s.text, done: s.done };
      }
      return {
        id: `${Date.now()}_${Math.random().toString(36).slice(2)}`,
        slot: s.slot,
        text: s.text,
        done: s.done,
        origin_date: todayStr(),
        resolution_status: s.done ? 'done' : null,
        resolution_date: null,
        carried_dates: [],
      };
    });
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
