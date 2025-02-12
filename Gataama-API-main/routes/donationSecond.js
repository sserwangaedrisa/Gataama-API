const express = require('express');
const donationController = require('../controllers/donationController');
const checkAuth = require('../middleware/check-auth');
const validation = require('../middleware/validation');
const bodyParser = require('body-parser');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const router = express.Router();

router.post(
  '/stripe-payment',
  validation.getPaymentUrlPolicys,
  donationController.createStripePaymentSession,
);
router.post(
  '/webhook',
  bodyParser.raw({ type: 'application/json' }),
  // express.raw({ type: 'application/json' }),
  donationController.stripeWebhook,
);

router.get('/getCurrencies', donationController.getCurrencies);

router.get('/adminAnalytics', checkAuth, donationController.getAdminAnalytics);



module.exports = router;
