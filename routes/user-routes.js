const express = require("express");
const {
  login,
  signup,
  forgotPassword,
  resetPassword,
} = require("../controllers/user-controllers");

const router = express.Router();

router.post("/signup", signup);

router.post("/login", login);

router.post("/forgotpassword", forgotPassword);

router.put("/resetpassword/:resetToken", resetPassword);

module.exports = router;
