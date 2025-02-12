const express = require('express');
const couponRoute = require('../controllers/couponAndDiscount');
const checkAuth = require('../middleware/check-auth');

const router = express.Router();

router.post('/coupon', checkAuth, couponRoute.createCoupon);
router.get('/coupon', checkAuth, couponRoute.getCoupon)
router.post('/coupon/validate', couponRoute.validateCoupon);
router.post('/coupon/apply', couponRoute.applyCoupon);

module.exports = router;
