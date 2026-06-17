function getStore() {
  if (typeof window !== 'undefined' && window.storage && typeof window.storage.get === 'function') {
    return window.storage;
  }
  return {
    get(k) {
      try {
        const v = localStorage.getItem(k);
        return Promise.resolve(v != null ? { key: k, value: v } : null);
      } catch { return Promise.resolve(null); }
    },
    set(k, v) {
      try { localStorage.setItem(k, String(v)); } catch {}
      return Promise.resolve({ key: k, value: v });
    },
    delete(k) {
      try { localStorage.removeItem(k); } catch {}
      return Promise.resolve({ key: k, deleted: true });
    },
    list(pfx) {
      try {
        const keys = Object.keys(localStorage).filter(k => !pfx || k.startsWith(pfx));
        return Promise.resolve({ keys });
      } catch { return Promise.resolve({ keys: [] }); }
    },
  };
}

export const storage = {
  get:    (k)    => getStore().get(k),
  set:    (k, v) => getStore().set(k, v),
  delete: (k)    => getStore().delete(k),
  list:   (pfx)  => getStore().list(pfx),
};
