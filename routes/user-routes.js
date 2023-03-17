const express = require("express");
const {
  login,
  signup,
  forgotPassword,
  resetPassword,
  updateProfile,
} = require("../controllers/user-controllers");

const router = express.Router();

const upload = require("../middleware/file-upload");
const checkAuth = require("../middleware/check-auth");

router.post("/signup", signup);

router.post("/login", login);

router.post("/forgotpassword", forgotPassword);

router.put("/resetpassword/:resetToken", resetPassword);

router.use(checkAuth);

//fileUpload.single() accepts a single file with the name fieldname and the single file will be stored in req.files
router.patch("/updateprofile", upload.single("image"), updateProfile);

module.exports = router;
