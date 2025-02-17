const { v4: uuidv4 } = require("uuid");
const nodemailer = require("nodemailer");
const url = require("url");
const axios = require("axios");
const https = require("https");
const db = require("../middleware/db");

exports.getPaymentUrl = async (req, res) => {
  try {
    
    // Validating the inputs.
    if (!req.body.amount || Number(req.body.amount) <= 0) {
      return res.status(400).send({ message: "Invalid amount set" }); 
    }
    
    // Enhanced the required fields
    if (!req.body.email || !req.body.currency || !req.body.fullNames) {
      return res.status(400).send({ message: "Missing required fields" }); 
    }

    const formData = {
      tx_ref: uuidv4(),
      amount: req.body.amount,
      currency: req.body.currency,
      redirect_url: `${process.env.PAYMENT_URL}/donation-status`,
      customer: {
        email: req.body.email,
        name: req.body.fullNames,
      },
      meta: {
        donationType: req.body.donationType,
      },
      customizations: {
        title: "Gataama",
        logo: "https://gatamaapi.tickets2go.net/avatars/logo.jpg",
        description: `Donation for ${req.body.donationTitle}`,
      },
    };

    const axiosInstance = axios.create({
      headers: {
        Authorization: `Bearer ${process.env.FLWV_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      httpsAgent: new https.Agent({ keepAlive: true }),
    });

    let baseURL = `https://api.flutterwave.com/v3/payments`;

    const response = await axiosInstance.post(baseURL, formData);

    // API response validation
    if (response.data.data && response.data.data.link) {
      const dt = {
        tx_ref: formData.tx_ref,
        amount: formData.amount,
        currency: formData.currency,
        donationType: req.body.donationType,
        email: formData.customer.email,
        fullNames: formData.customer.name,
        transactionType: "deposit",
      };

      const transaction = await prisma.transaction.create({
        data: dt,
      });

      res.status(200).send({
        url: response.data.data.link,
      });
    } else {
      res.status(500).send({
        message: "Failed to load payment screen, kindly try again",
      });
    }
  } catch (error) {
    console.error("Error in getPaymentUrl:", error); // Catching errors while emailing the donor.
    res.status(500).send({
      message: process.env.ERROR_MESSAGE,
    });
  }
};

exports.webhookUrl = async (req, res) => {
  try {
    const current_url = new URL(
      `${process.env.PAYMENT_URL}/${req.originalUrl}`
    );
    const search_params = current_url.searchParams;

    if (search_params.get("status") === "successful") {
      const axiosInstance = axios.create({
        headers: {
          Authorization: `Bearer ${process.env.FLWV_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
        httpsAgent: new https.Agent({ keepAlive: true }),
      });

      let baseURL = `https://api.flutterwave.com/v3/transactions/${search_params.get(
        "transaction_id"
      )}/verify`;

      const response = await axiosInstance.get(baseURL);

      // Update transaction status and details in database
      const transaction = await prisma.transaction.update({
        where: {
          tx_ref: search_params.get("tx_ref"),
        },
        data: {
          status: search_params.get("status"),
          transactionId: search_params.get("transaction_id"),
          transactionSummary: JSON.stringify(response.data.data),
        },
      });

      // Ensuring wallet exists before updating balance
      const wallet = await prisma.wallet.findUnique({
        where: {
          symbol: transaction.currency,
        },
      });

      if (!wallet) {
        return res.status(404).send({
          message: "Wallet not found",
        });
      }

      const updatedAmount = Number(wallet.amount) + Number(transaction.amount);

      await prisma.wallet.update({
        where: {
          id: wallet.id,
        },
        data: {
          amount: updatedAmount,
        },
      });

      // Wrapped email sending in try/catch block
      try {
        const transporter = nodemailer.createTransport({
          host: "smtp.ionos.com",
          port: 587,
          auth: {
            user: process.env.SENDER_EMAIL,
            pass: process.env.SENDER_EMAIL_PASSWORD,
          },
        });

        const message = {
          from: `Gataama <${process.env.SENDER_EMAIL}>`,
          to: transaction.email,
          subject: "Thank you for your Donation",
          html: `<!DOCTYPE html>
            <html lang="en">
              <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Receipt Gataama</title>
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.2.2/css/bootstrap.min.css"
                  integrity="sha512-CpIKUSyh9QX2+zSdfGP+eWLx23C8Dj9/XmHjZY2uDtfkdLGo0uY12jgcnkX9vXOgYajEKb/jiw67EYm+kBf+6g=="
                  crossorigin="anonymous" referrerpolicy="no-referrer" />
                <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.10.0/css/all.min.css" rel="stylesheet" />
              </head>
              <body>
                <div class="container">
                  <div class="row">
                    <div class="col">
                      <p>Dear ${transaction.fullNames}</p>
                      <p>I hope this message finds you well. On behalf of Gataama, I want to express our deepest gratitude for your generous donation of ${transaction.currency} ${transaction.amount} to support our cause.</p>
                      <p>Your contribution means more than words can express. With your support, we can continue our efforts to promote unity, empowerment, and progress across the African continent and its diaspora. Your belief in our mission is truly inspiring, and it reaffirms our commitment to making a positive impact in the lives of people throughout Africa and beyond.</p>
                      <p>Your donation will directly contribute to initiatives aimed at fostering social, economic, and political development, as well as promoting cultural exchange and solidarity among African communities worldwide.</p>
                      <p>Once again, thank you for your generosity and support. Together, we can work towards a brighter future for all Africans.</p>
                      <p>With heartfelt thanks,</p>
                      <br />
                      <p>Best,</p>
                      <h3>The Management of GATAAMA FOUNDATION.</h3>
                    </div>
                  </div>
                </div>
              </body>
            </html>`,
        };

        await transporter.sendMail(message);
      } catch (emailError) {
        console.error("Error sending email:", emailError);
        return res.status(500).send({
          message: "Error sending email, but your donation was successful.",
        });
      }

      res.status(200).send({
        message: `Thank you for your Donation, check your email (${transaction.email})`,
      });
    } else {
      // Payment status is not successful
      await prisma.transaction.update({
        where: {
          tx_ref: search_params.get("tx_ref"),
        },
        data: {
          status: search_params.get("status"),
          transactionId: search_params.get("transaction_id"),
        },
      });

      res.status(200).send({
        message: "Payment failed, kindly retry",
      });
    }
  } catch (error) {
    console.error("Error in webhookUrl:", error); 
    res.status(500).send({
      message: "Error with payment, kindly contact support",
    });
  }
};

exports.getCurrencies = async (req, res) => {
  try {
    const currencies = await prisma.wallet.findMany({
      where: {
        status: 1,
      },
      orderBy: {
        currency: "asc",
      },
    });

    res.status(200).send({
      currencies: currencies,
    });
  } catch (error) {
    console.error("Error in getCurrencies:", error); 
    res.status(500).send({
      message: process.env.ERROR_MESSAGE,
    });
  }
};

exports.getAdminAnalytics = async (req, res) => {
  try {
    const wallets = await prisma.wallet.findMany({
      where: {
        amount: {
          gt: 0,
        },
        status: 1,
      },
      orderBy: {
        currency: "asc",
      },
    });

    const transactions = await prisma.transaction.findMany({
      where: {
        status: "successful",
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 20, // Limit to 20 transactions
    });

    res.status(200).send({
      wallets: wallets,
      transactions: transactions,
    });
  } catch (error) {
    console.error("Error in getAdminAnalytics:", error); 
    res.status(500).send({
      message: process.env.ERROR_MESSAGE,
    });
  }
};
