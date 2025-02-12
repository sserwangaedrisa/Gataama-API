const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

module.exports = {
  async createCoupon(req, res) {
    const { code, discount, type, expiresAt, usageLimit } = req.body;

    try {
      const coupon = await prisma.coupon.create({
        data: {
          code,
          discount,
          type,
          expiresAt: new Date(expiresAt), // Make sure the date is properly formatted
          usageLimit,
          usedCount: 0, // Initially, no coupon has been used
          active: true,
        },
      });

      res.json({
        success: true,
        message: 'Coupon created successfully',
        coupon,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: `Error creating coupon: ${error.message}`,
      });
    }
  },

  async validateCoupon(req, res) {
    const { couponCode } = req.body;

    try {
      const coupon = await prisma.coupon.findUnique({
        where: {
          code: couponCode,
        },
      });

      if (!coupon) {
        return res.status(400).json({
          success: false,
          message: 'Invalid coupon code',
        });
      }

      if (!coupon.active) {
        return res.status(400).json({
          success: false,
          message: 'This coupon is no longer active',
        });
      }

      if (new Date() > new Date(coupon.expiresAt)) {
        return res.status(400).json({
          success: false,
          message: 'This coupon has expired',
        });
      }

      if (coupon.usedCount >= coupon.usageLimit) {
        return res.status(400).json({
          success: false,
          message: 'This coupon has reached its usage limit',
        });
      }

      // Coupon is valid
      res.json({
        success: true,
        coupon,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: `Error validating coupon: ${error.message}`,
      });
    }
  },

  async applyCoupon(req, res) {
    const { couponCode, totalAmount } = req.body;

    try {
      const coupon = await prisma.coupon.findUnique({
        where: {
          code: couponCode,
        },
      });

      if (!coupon) {
        return res.status(400).json({
          success: false,
          message: 'Invalid coupon code',
        });
      }

      // Calculate the discount based on coupon type
      let discountAmount = 0;
      if (coupon.type === 'percentage') {
        discountAmount = (totalAmount * coupon.discount) / 100; // For percentage discount
      } else if (coupon.type === 'fixed') {
        discountAmount = coupon.discount; // For fixed amount discount
      }

      // Ensure the discount does not exceed the total amount
      discountAmount = Math.min(discountAmount, totalAmount);

      // Apply the discount and calculate the final amount
      const finalAmount = totalAmount - discountAmount;

      // Optionally, update the coupon usage count
      await prisma.coupon.update({
        where: { code: couponCode },
        data: {
          usedCount: { increment: 1 },
        },
      });

      res.json({
        success: true,
        message: 'Coupon applied successfully',
        discountAmount,
        finalAmount,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: `Error applying coupon: ${error.message}`,
      });
    }
  },
  async getCoupon(req, res) {
    const { couponCode } = req.params;

    try {
      const coupon = await prisma.coupon.findUnique({
        where: {
          code: couponCode,
        },
      });

      if (!coupon) {
        return res.status(404).json({
          success: false,
          message: 'Coupon not found',
        });
      }

      res.json({
        success: true,
        coupon,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: `Error fetching coupon: ${error.message}`,
      });
    }
  },
};
