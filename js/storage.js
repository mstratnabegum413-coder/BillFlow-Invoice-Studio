/* Versioned localStorage persistence with a safe v1 -> v2 migration. */
(function (root) {
  'use strict';
  var KEY = 'billflow.v1';
  var VERSION = 2;
  function fresh() {
    return { version: VERSION, profile: { name: '', email: '', address: '', currency: 'USD', tax: 0, prefix: 'INV-' }, invoices: [] };
  }
  function migrate(value) {
    var v = value && typeof value === 'object' ? value : fresh();
    if (!Array.isArray(v.invoices)) v.invoices = [];
    if (!v.profile || typeof v.profile !== 'object') v.profile = fresh().profile;
    if (!v.version || v.version < 2) v.version = 2;
    return v;
  }
  function load() {
    try {
      var raw = localStorage.getItem(KEY);
      if (!raw) return fresh();
      return migrate(JSON.parse(raw));
    } catch (e) { return fresh(); }
  }
  function save(db) {
    try { db.version = VERSION; localStorage.setItem(KEY, JSON.stringify(db)); return true; }
    catch (e) { return false; }
  }
  root.BillFlowStorage = { KEY: KEY, VERSION: VERSION, fresh: fresh, load: load, save: save };
})(window);

