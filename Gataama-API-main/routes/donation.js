const express = require('express');
const DonationsController = require('../controllers/donations');
const checkAuth = require('../middleware/check-auth');
const validation = require('../middleware/validation');

const router = express.Router();

router.post('/getPaymentUrl', validation.getPaymentUrlPolicy, DonationsController.getPaymentUrl);

router.get('/webhook', DonationsController.webhookUrl);

router.get('/getCurrencies', DonationsController.getCurrencies);

router.get('/adminAnalytics', checkAuth, DonationsController.getAdminAnalytics);

module.exports = router;
