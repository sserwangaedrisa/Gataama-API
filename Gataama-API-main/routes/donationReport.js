const express = require('express');
const router = express.Router();
const DonationReportController = require('../controllers/donationReport');

router.get(
  '/reports/total-donations',
  DonationReportController.getTotalDonations,
);
router.get('/reports/donor-growth', DonationReportController.getDonorGrowth);
router.get(
  '/reports/recurring-breakdown',
  DonationReportController.getRecurringDonationsBreakdown,
);
router.get(
  '/reports/campaign-data',
  DonationReportController.getCampaignDonationData,
);
router.get(
  '/reports/transaction-statuses',
  DonationReportController.getTransactionStatuses,
);
router.get('/reports/top-donors', DonationReportController.getTopDonors);

module.exports = router;
