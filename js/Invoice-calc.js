/* Pure invoice maths and dashboard aggregation. */
(function (root) {
  'use strict';
  function round(n) { return Math.round((n + Number.EPSILON) * 100) / 100; }
  function calc(inv) {
    const sub = round((inv.items || []).reduce((s, x) => s + (+x.q || 0) * (+x.p || 0), 0));
    const disc = round(Math.min(Math.max(0, +inv.discount || 0), sub));
    const tax = round((sub - disc) * Math.min(100, Math.max(0, +inv.tax || 0)) / 100);
    return { sub, disc, tax, total: round(sub - disc + tax) };
  }
  function status(inv, today) {
    return inv.status === 'paid' ? 'paid' : (inv.due && inv.due < today ? 'overdue' : inv.status);
  }
  function nextInvoiceNumber(invoices, prefix) {
    const escaped = String(prefix || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const re = new RegExp('^' + escaped + '(\\d+)$');
    const max = (invoices || []).reduce((m, inv) => {
      const match = re.exec(String(inv.no || ''));
      return Math.max(m, match ? Number(match[1]) : 0);
    }, 0);
    return String(prefix || 'INV-') + String(max + 1).padStart(4, '0');
  }
  function summarise(invoices, currency, today) {
    const totals = { paid: 0, outstanding: 0, overdue: 0 };
    (invoices || []).filter(i => (i.cur || currency) === currency).forEach(i => {
      const s = status(i, today), amount = calc(i).total;
      if (s === 'paid') totals.paid = round(totals.paid + amount);
      else if (s === 'overdue') totals.overdue = round(totals.overdue + amount);
      else if (s === 'sent' || s === 'draft') totals.outstanding = round(totals.outstanding + amount);
    });
    return totals;
  }
  const api = { round, calc, status, nextInvoiceNumber, summarise };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.BillFlowCalc = api;
})(typeof window !== 'undefined' ? window : globalThis);

