const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const prisma = require("./prismaClient"); // Adjust the path as necessary
const jwt = require("jsonwebtoken");

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
