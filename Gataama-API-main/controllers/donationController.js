const { PrismaClient } = require('@prisma/client');
const Stripe = require('stripe');
const { v4: uuidv4 } = require('uuid');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const prisma = new PrismaClient();

// Create a payment session
exports.createStripePaymentSession = async (req, res) => {
  try {
    const { amount, currency, donationTitle, donationType, email, fullNames } =
      req.body;

    if (Number(amount) > 0) {
      const tx_ref = uuidv4();

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        customer_email: email, // ✅ Ensures `customer_email` is always set
        line_items: [
          {
            price_data: {
              currency,
              product_data: {
                name: donationTitle,
                description: `Donation for ${donationType}`,
              },
              unit_amount: amount * 100, // Stripe uses the smallest currency unit
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${process.env.PAYMENT_URL}/donation-status?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.PAYMENT_URL}/donation-cancelled`,
        metadata: {
          donationType,
          tx_ref,
        },
      });

      // Store the transaction in the database
      await prisma.transaction.create({
        data: {
          tx_ref,
          amount,
          currency,
          donationType,
          email,
          fullNames,
          transactionType: 'deposit',
        },
      });

      res.status(200).send({ url: session.url });
    } else {
      res.status(403).send({ message: 'Invalid amount set' });
    }
  } catch (error) {
    console.error('Error creating payment session:', error);
    res.status(500).send({ message: process.env.ERROR_MESSAGE });
  }
};

// Handle Stripe Webhook
exports.stripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_ENDPOINT_SECRET;

  // Handle manual requests
  if (!sig) {
    console.log('Manual request detected');
    const { session_id } = req.body;

    if (!session_id) {
      return res.status(400).json({ message: 'Session ID is required' });
    }

    try {
      const session = await stripe.checkout.sessions.retrieve(session_id);
      // console.log('Session Data:', JSON.stringify(session, null, 2));

      if (session.payment_status === 'paid') {
        return res
          .status(200)
          .json({ message: 'Payment confirmed successfully!' });
      } else {
        return res.status(400).json({ message: 'Payment not completed' });
      }
    } catch (error) {
      console.error('Error retrieving payment session:', error.message);
      return res.status(500).json({
        message: 'Failed to fetch payment session',
        error: error.message,
      });
    }
  }

  // Handle actual Stripe webhook events
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    console.log('Webhook signature is valid');
  } catch (err) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    console.log('Received headers:', req.headers);
    console.log('Received body:', req.body);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    console.log('Sessions:', session);
    console.log(
      '✔ Stripe Webhook Event Received:',
      JSON.stringify(event, null, 2),
    );

    // Further debugging
    console.log('Raw session data:', JSON.stringify(session, null, 2));

    try {
      // Retrieve metadata and save the transaction to the database
      const { tx_ref, donationType } = session.metadata;
      const { amount_total, currency } = session;

      const email = session.customer_email || session.customer_details?.email; // ✅ Fix missing email issue
      const fullNames = session.customer_details?.name || 'Donor'; // ✅ Ensure name fallback

      console.log(
        `🔍 Extracted Details - Email: ${email}, Name: ${fullNames}, Amount: ${
          amount_total / 100
        }`,
      );

      if (!email) {
        console.error('Error: No email found for session', session);
        return res.status(400).json({ message: 'Missing email in session' });
      }

      const transaction = await prisma.transaction.create({
        data: {
          tx_ref,
          amount: amount_total / 100,
          currency,
          donationType,
          email,
          fullNames,
          transactionType: 'deposit',
        },
      });

      console.log(
        `✅ Transaction recorded in database for ${transaction.email}`,
      );

      // Send a thank-you email
      const transporter = nodemailer.createTransport({
        host: 'mail.spacemail.com',
        port: 465,
        secure: true,
        auth: {
          user: process.env.SENDER_EMAIL || 'donations@gataama.com',
          pass: process.env.SENDER_EMAIL_PASSWORD || 'ABCabc123*#',
        },
      });

      const message = {
        from: `"Gataama" <${process.env.SENDER_EMAIL}>`,
        to: `${transaction.email}`,
        subject: `Thank you for your Donation`,
        html: `<!DOCTYPE html>
          <html lang="en">
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Receipt Gataama</title>
              <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.10.0/css/all.min.css" rel="stylesheet" />
            </head>
            <body>
              <div class="container">
                <p>Dear ${transaction.fullNames},</p>
                <p>Thank you for your generous donation of ${transaction.currency} ${transaction.amount} to support our cause.</p>
                <p>With your support, we can continue our mission to empower communities and drive positive change.</p>
                <p>Once again, thank you for your generosity and support.</p>
                <p>Best regards,</p>
                <h3>The Management of GATAAMA FOUNDATION.</h3>
              </div>
            </body>
          </html>`,
      };

      try {
        let info = await transporter.sendMail(message);
        console.log(`Email sent: ${info.messageId} to ${transaction.email}`);
      } catch (err) {
        console.error('Email sending error:', err);
      }
    } catch (error) {
      console.error('Error handling webhook event:', error.message);
    }
  }

  res.status(200).json({ received: true });
};

// Get available currencies
exports.getCurrencies = async (req, res) => {
  try {
    const currencies = await prisma.wallet.findMany({
      where: { status: 1 },
      orderBy: { currency: 'asc' },
    });

    res.status(200).send({ currencies });
  } catch (error) {
    console.error('Error fetching currencies:', error);
    res.status(500).send({ message: process.env.ERROR_MESSAGE });
  }
};

// Admin analytics
exports.getAdminAnalytics = async (req, res) => {
  try {
    const wallets = await prisma.wallet.findMany({
      where: {
        amount: { gt: 0 },
        status: 1,
      },
      orderBy: { currency: 'asc' },
    });

    const transactions = await prisma.transaction.findMany({
      where: { status: 'successful' },
      orderBy: { createdAt: 'desc' },
      take: 20, // Limit to 20 transactions
    });

    res.status(200).send({ wallets, transactions });
  } catch (error) {
    console.error('Error fetching admin analytics:', error);
    res.status(500).send({ message: process.env.ERROR_MESSAGE });
  }
};
