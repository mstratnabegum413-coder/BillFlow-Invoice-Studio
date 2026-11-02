/* JSON backup export/import with schema and duplicate-ID validation. */
(function (root) {
  'use strict';
  function uid() {
    return (root.crypto && typeof root.crypto.randomUUID === 'function')
      ? root.crypto.randomUUID()
      : Math.random().toString(36).slice(2) + Date.now().toString(36);
  }
  function validate(v) {
    if (!v || typeof v !== 'object' || !Array.isArray(v.invoices)) throw new Error('invalid backup');
    var seen = new Set();
    v.invoices = v.invoices.map(function (source) {
      if (!source || typeof source !== 'object' || !Array.isArray(source.items) || !source.client || typeof source.client !== 'object') throw new Error('invalid invoice');
      var i = Object.assign({}, source);
      i.id = String(i.id || '').replace(/[^a-z0-9-]/gi, '') || uid();
      if (seen.has(i.id)) i.id = uid();
      while (seen.has(i.id)) i.id = uid();
      seen.add(i.id);
      i.no = String(i.no || ''); i.cur = String(i.cur || 'USD');
      i.issued = String(i.issued || ''); i.due = String(i.due || '');
      i.tax = Math.max(0, Math.min(100, +i.tax || 0)); i.discount = Math.max(0, +i.discount || 0); i.notes = String(i.notes || '');
      i.status = ['draft', 'sent', 'paid'].indexOf(i.status) > -1 ? i.status : 'draft';
      i.client = { name: String(i.client.name || ''), email: String(i.client.email || ''), address: String(i.client.address || '') };
      i.items = i.items.map(function (x) { return { d: String((x && x.d) || ''), q: Math.max(0, +(x && x.q) || 0), p: Math.max(0, +(x && x.p) || 0) }; });
      return i;
    });
    v.version = 2;
    v.profile = Object.assign({ name: '', email: '', address: '', currency: 'USD', tax: 0, prefix: 'INV-' }, v.profile || {});
    return v;
  }
  function read(file) {
    return new Promise(function (resolve, reject) {
      var r = new FileReader();
      r.onload = function () { try { resolve(validate(JSON.parse(r.result))); } catch (e) { reject(e); } };
      r.onerror = function () { reject(new Error('read failed')); };
      r.readAsText(file);
    });
  }
  function download(db, name) {
    var a = document.createElement('a'), url = URL.createObjectURL(new Blob([JSON.stringify(db, null, 2)], { type: 'application/json' }));
    a.href = url; a.download = name; a.click(); setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
  }
  root.BillFlowBackup = { validate: validate, read: read, download: download };
})(window);

