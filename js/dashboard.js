/* Dashboard view, separated from application routing and invoice editing. */
(function (root) {
  'use strict';
  function render(app, context) {
  const { db, today, money, calc, status, esc, loadSample } = context;
  const $ = (selector, root = document) => root.querySelector(selector);
  const STATUSES = window.BillFlowConfig.STATUSES;
  const c = db.profile.currency;
  const totals = BillFlowCalc.summarise(db.invoices, c, today());
  app.innerHTML = `<section class="stats">
    <div class="stat"><span>Paid</span><b>${money(totals.paid, c)}</b></div>
    <div class="stat"><span>Outstanding</span><b>${money(totals.outstanding, c)}</b></div>
    <div class="stat warn"><span>Overdue</span><b>${money(totals.overdue, c)}</b></div></section>
    <div class="bar"><input id="q" type="search" placeholder="Search client or number" aria-label="Search invoices">
    <select id="st" aria-label="Filter by status" class="auto"><option value="">All</option>${STATUSES.map(x => `<option value="${x}">${x}</option>`).join("")}</select></div>
    <div id="list"></div>`;
  const paint = () => {
    const q = $('#q').value.toLowerCase(), f = $('#st').value;
    const L = db.invoices.filter(i => (!f || status(i) === f) && (i.client.name + i.no).toLowerCase().includes(q));
    $('#list').innerHTML = L.length ? L.map(i => `<a class="row" href="#edit-${esc(i.id)}"><div><strong>${esc(i.client.name || 'No client name')}</strong><small>${esc(i.no)}, due ${esc(i.due)}</small></div><div class="r"><b>${money(calc(i).total, i.cur)}</b><em class="tag ${status(i)}">${status(i)}</em></div></a>`).join('')
      : `<div class="card empty"><h2>${db.invoices.length ? 'No matches' : 'No invoices yet'}</h2><p class="mut">${db.invoices.length ? 'Try a different search or filter.' : 'Create your first invoice in under a minute.'}</p>${db.invoices.length ? '' : '<a class="btn primary" href="#new">Create invoice</a> <button id="demo" type="button">Load sample data</button>'}</div>`;
  };
  app.onclick = e => { if (e.target.id === 'demo') loadSample(); };
  $('#q').oninput = paint; $('#st').onchange = paint; paint();
}

  root.BillFlowDashboard = { render: render };
})(window);
