const express = require("express");
const UserController = require("../controllers/users");
const checkAuth = require("../middleware/check-auth");
const validation = require("../middleware/validation");
const passport = require("passport");
const router = express.Router();
const verifyToken = require("../middleware/auth");
const { isAdmin } = require("../middleware/role");

router.post(
  "/register",
  verifyToken,
  isAdmin,
  validation.registerUserPolicy,
  UserController.register
);

router.post("/login", validation.loginUserPolicy, UserController.login);

router.patch(
  "/forgotPassword",
  validation.forgotPasswordPolicy,
  UserController.forgotPassword
);

router.put(
  "/profile/:id",
  verifyToken,
  isAdmin,
  UserController.updateUser
);

router.delete("/:id",verifyToken, isAdmin, UserController.deleteUser);

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/admins", checkAuth, UserController.getAdmin)

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/login",
  }),
  (req, res) => {
    const { token } = req.user;
    res.redirect(`${process.env.CLIENT_URL}?token=${token}`);
  }
);

router.get("/check-user", verifyToken, UserController.getUserFromToken);

module.exports = router;
