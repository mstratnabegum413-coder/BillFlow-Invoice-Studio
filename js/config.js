/* Shared application configuration. */
(function (root) {
  'use strict';
  root.BillFlowConfig = Object.freeze({
    CURRENCIES: ['USD', 'EUR', 'GBP', 'BDT', 'INR', 'AED', 'CAD', 'AUD'],
    STATUSES: ['draft', 'sent', 'paid', 'overdue'],
    TOAST_MS: 2400,
    MESSAGES: { saveError: 'Could not save. Browser storage is blocked or full.' }
  });
})(window);

