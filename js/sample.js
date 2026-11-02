/* Demo fixtures kept separate from UI/controller code. */
(function (root) {
  'use strict';
  function create(today, addDays, uid) {
    const mk = (no, name, status, due, items) => ({
      id: uid(), no, cur: 'USD',
      client: { name, email: '', address: '' },
      issued: today, due, items, tax: 5, discount: 0,
      notes: 'Thank you for your business.', status
    });
    return {
      profile: { name: 'Sample Studio', email: 'hello@example.com', address: '12 Example Street' },
      invoices: [
        mk('INV-0003', 'Sample Client C', 'draft', addDays(today, 14), [{ d: 'Logo design', q: 1, p: 350 }]),
        mk('INV-0002', 'Sample Client B', 'sent', addDays(today, 7), [{ d: 'Website pages', q: 4, p: 120 }, { d: 'Hosting setup', q: 1, p: 60 }]),
        mk('INV-0001', 'Sample Client A', 'paid', addDays(today, -20), [{ d: 'Monthly retainer', q: 1, p: 900 }])
      ]
    };
  }
  root.BillFlowSampleData = { create: create };
})(window);

