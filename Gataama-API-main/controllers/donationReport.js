const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


// DonationReportController
class DonationReportController {
  // Total Donations: The sum of all donations over a specific period
  static async getTotalDonations(req, res) {
    try {
      const { startDate, endDate } = req.query; // Get date range from query params

      const totalDonations = await prisma.donation.aggregate({
        _sum: {
          amount: true,
        },
        where: {
          createdAt: {
            gte: new Date(startDate), // Start Date
            lte: new Date(endDate), // End Date
          },
        },
      });

      res.json({
        success: true,
        totalDonations: totalDonations._sum.amount,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: `Error fetching total donations: ${error.message}`,
      });
    }
  }

  // Donor Growth: The number of new donors over a period
  static async getDonorGrowth(req, res) {
    try {
      const { startDate, endDate } = req.query; // Get date range from query params

      const newDonors = await prisma.donation.count({
        distinct: ['email'], // Assuming email is unique for donors
        where: {
          createdAt: {
            gte: new Date(startDate),
            lte: new Date(endDate),
          },
        },
      });

      res.json({
        success: true,
        newDonors,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: `Error fetching donor growth: ${error.message}`,
      });
    }
  }

  // Recurring vs One-Time Donations: Breakdown of donations by type
  static async getRecurringDonationsBreakdown(req, res) {
    try {
      const { startDate, endDate } = req.query;

      const recurringDonations = await prisma.donation.aggregate({
        _sum: {
          amount: true,
        },
        where: {
          isRecurring: true,
          createdAt: {
            gte: new Date(startDate),
            lte: new Date(endDate),
          },
        },
      });

      const oneTimeDonations = await prisma.donation.aggregate({
        _sum: {
          amount: true,
        },
        where: {
          isRecurring: false,
          createdAt: {
            gte: new Date(startDate),
            lte: new Date(endDate),
          },
        },
      });

      res.json({
        success: true,
        recurring: recurringDonations._sum.amount,
        oneTime: oneTimeDonations._sum.amount,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: `Error fetching donation breakdown: ${error.message}`,
      });
    }
  }

  // Campaign-Specific Data: Amount raised for a specific campaign
  static async getCampaignDonationData(req, res) {
    try {
      const { campaignId, startDate, endDate } = req.query;

      const campaignDonations = await prisma.donation.aggregate({
        _sum: {
          amount: true,
        },
        where: {
          campaignId: campaignId,
          createdAt: {
            gte: new Date(startDate),
            lte: new Date(endDate),
          },
        },
      });

      res.json({
        success: true,
        campaignDonations: campaignDonations._sum.amount,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: `Error fetching campaign donations: ${error.message}`,
      });
    }
  }

  // Transaction Statuses: Number of successful, pending, or failed transactions
  static async getTransactionStatuses(req, res) {
    try {
      const { startDate, endDate } = req.query;

      const transactionStatuses = await prisma.transaction.groupBy({
        by: ['status'],
        where: {
          createdAt: {
            gte: new Date(startDate),
            lte: new Date(endDate),
          },
        },
        _count: {
          status: true,
        },
      });

      const statusCount = transactionStatuses.reduce((acc, status) => {
        acc[status.status] = status._count.status;
        return acc;
      }, {});

      res.json({
        success: true,
        transactionStatuses: statusCount,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: `Error fetching transaction statuses: ${error.message}`,
      });
    }
  }

  // Top Donors: A list of the top donors based on total donation amount
  static async getTopDonors(req, res) {
    try {
      const { limit, startDate, endDate } = req.query;

      const topDonors = await prisma.donation.findMany({
        select: {
          donorName: true,
          amount: true,
        },
        where: {
          createdAt: {
            gte: new Date(startDate),
            lte: new Date(endDate),
          },
        },
        orderBy: {
          amount: 'desc', // Sort by total donation amount
        },
        take: parseInt(limit) || 10, // Limit the number of results
      });

      res.json({
        success: true,
        topDonors,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: `Error fetching top donors: ${error.message}`,
      });
    }
  }
}

module.exports = DonationReportController;
