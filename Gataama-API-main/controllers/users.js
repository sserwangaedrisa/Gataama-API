const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const nodemailer = require("nodemailer");
const db = require("../middleware/db");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

exports.register = async (req, res) => {
  try {
    if (req.body.password == "") {
      return res.status(403).send({
        message: "please add password",
      });
    }
    const existingUser = await prisma.user.findFirst({
      where: { email: req.body.email },
    });

    if (existingUser) {
      return res.status(403).send({
        message: "Email taken, use a different one",
      });
    }
    const hash = await bcrypt.hash(req.body.password, 10);

    const user = await prisma.user.create({
      data: {
        fullNames: req.body.fullNames,
        email: req.body.email,
        password: hash,
        role: req.body.role,
      },
    });

    return res.status(201).send({
      message: `Created account for ${user.fullNames} successfully`,
    });
  } catch (error) {
    return res.status(400).send({
      message: error.message,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const user = await prisma.user.findFirst({
      where: { email: req.body.email },
    });

    if (!user) {
      return res.status(406).send({
        message: "Account issue, contact a website admin",
      });
    }

    const isPasswordValid = await bcrypt.compare(
      req.body.password.toString(),
      user.password
    );
    console.log(isPasswordValid);
    if (!isPasswordValid) {
      return res.status(406).send({
        message: "Invalid Email or Password",
      });
    }

    if (Number(user.status) === 0) {
      return res.status(403).send({
        message: "Your Account is locked, contact a website admin",
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        status: user.status,
      },
      process.env.JWT_SECRET
    );

    return res.status(200).send({
      message: "logged in successfully",
      token: token,
      user: {
        id: user.id,
        fullNames: user.fullNames,
        email: user.email,
        status: user.status,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    return res.status(500).send({
      message: error.message,
    });
  }
};

exports.getAdmin = async (req, res) => {
  try {
    const admins = await prisma.user.findMany({
      where: {
        role: {
          in: ['admin', 'countryAdmin']
        }
      }
    });

    return res.status(200).send({
      message: 'Admins retrieved successfully',
      admins: admins.map(admin => ({
        id: admin.id,
        fullNames: admin.fullNames,
        email: admin.email,
        role: admin.role,
        createdAt: admin.createdAt,
      }))
    });
  } catch (error) {
    return res.status(500).send({
      message: error.message,
    });
  }
}


exports.forgotPassword = async (req, res) => {
  // Generate a temporary password
  const pwd = `${Math.floor(1000 + Math.random() * 9000)}rfh`;
  const hash = await bcrypt.hash(pwd, 10);

  try {
    // Check if the user with the given email exists
    const user = await prisma.user.findUnique({
      where: {
        email: req.body.email,
      },
    });

    if (user) {
      // Update user's password with the hashed temporary password
      await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          password: hash,
        },
      });

      // Send an email with the new temporary password
      const transporter = nodemailer.createTransport({
        host: "smtp.ionos.com",
        port: 587,
        auth: {
          user: process.env.SENDER_EMAIL,
          pass: process.env.SENDER_EMAIL_PASSWORD,
        },
      });

      const message = {
        from: `"Gataama" <${process.env.SENDER_EMAIL}>`,
        to: req.body.email,
        subject: "Gataama - Password Reset",
        html: `<!DOCTYPE html>
          <html lang="en">
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Gataama - Password Reset</title>
              <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.2.2/css/bootstrap.min.css"
                integrity="sha512-CpIKUSyh9QX2+zSdfGP+eWLx23C8Dj9/XmHjZY2uDtfkdLGo0uY12jgcnkX9vXOgYajEKb/jiw67EYm+kBf+6g=="
                crossorigin="anonymous" referrerpolicy="no-referrer" />
            </head>
            <body>
              <div class="container">
                <div class="row">
                  <div class="col">
                    <p>Your new account password is ${pwd}</p>
                    <p>Access your account <a href='https://admin.gataama.com/' target='_blank'>here</a></p>
                    <p>Best,</p>
                    <p>The Gataama Team.</p>
                  </div>
                </div>
              </div>
              <script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.2.2/js/bootstrap.min.js"
                integrity="sha512-5BqtYqlWfJemW5+v+TZUs22uigI8tXeVah5S/1Z6qBLVO7gakAOtkOzUtgq6dsIo5c0NJdmGPs0H9I+2OHUHVQ=="
                crossorigin="anonymous" referrerpolicy="no-referrer"></script>
            </body>
          </html>`,
      };

      transporter.sendMail(message, (err3, info) => {
        if (err3) {
          console.error("Error sending email:", err3);
          return res.status(500).send({
            success: false,
            error: err3,
          });
        }
        return res.status(200).send({
          success: true,
          message: "Check your email for further instructions",
        });
      });
    } else {
      // User with the given email does not exist
      res.status(403).send({
        message: "Account issue, contact a website admin",
      });
    }
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).send({
      message: process.env.ERROR_MESSAGE,
    });
  }
};


exports.updateUser = async (req, res) => {
  try {
    const userId = req.params.id;

    // Find the user by ID
    const existingUser = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
    });

    if (!existingUser) {
      return res.status(404).send({
        message: "User not found",
      });
    }

    // Update user details
    const updatedData = {
      fullNames: req.body.fullNames || existingUser.fullNames,
      email: req.body.email || existingUser.email,
      role: req.body.role || existingUser.role,
    };

    // If a new password is provided, hash it
    if (req.body.password) {
      const hash = await bcrypt.hash(req.body.password, 10);
      updatedData.password = hash;
    }

    const updatedUser = await prisma.user.update({
      where: { id: parseInt(userId) },
      data: updatedData,
    });

    return res.status(200).send({
      message: `Updated user ${updatedUser.fullNames} successfully`,
    });
  } catch (error) {
    return res.status(400).send({
      message: error.message,
    });
  }
};


exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    // Check if the user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
    });

    if (!existingUser) {
      return res.status(404).send({
        message: "User not found",
      });
    }

    // Delete the user
    await prisma.user.delete({
      where: { id: parseInt(userId) },
    });

    return res.status(200).send({
      message: `Deleted user ${existingUser.fullNames} successfully`,
    });
  } catch (error) {
    return res.status(400).send({
      message: error.message,
    });
  }
};


const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      fullNames: user.fullNames,
      googleId: user.googleId,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
};

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (token, tokenSecret, profile, done) => {
      try {
        let user = await prisma.user.findUnique({
          where: { googleId: profile.id },
        });

        if (!user) {
          user = await prisma.user.findUnique({
            where: { email: profile.emails[0].value },
          });
          if (user) {
            user = await prisma.user.update({
              where: { id: user.id },
              data: { googleId: profile.id },
            });
          } else {
            user = await prisma.user.create({
              data: {
                fullNames: profile.displayName,
                email: profile.emails[0].value,
                googleId: profile.id,
              },
            });
          }
        }

        const token = generateToken(user);
        return done(null, { user, token });
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

exports.getUserFromToken = (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    res.status(200).json(decoded);
  } catch (error) {
    console.error("Token verification error:", error);
    res.status(401).json({ error: "Invalid token" });
  }
};
