const cloudinary = require("cloudinary").v2;

const User = require("../models/user-model");
const HttpError = require("../models/http-error");
const sendEmail = require("../utils/sendEmail");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const signup = async (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || typeof name !== "string") {
    return next(new HttpError("Please provide a valid name"));
  }
  if (!email || typeof email !== "string") {
    return next(new HttpError("Please provide a valid email"));
  }
  if (!password || typeof password !== "string") {
    return next(new HttpError("Please provide a valid password"));
  }
  // checking to see if email already exists.
  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError("Signup failed please try again later", 500);
    return next(error);
  }

  if (existingUser) {
    const error = new HttpError(
      "Could not create user, user already exists",
      422
    );
    return next(error);
  }

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (e) {
    const error = new HttpError("Could not create user please try again", 500);
    next(error);
  }

  const createdUser = new User({
    name,
    email,
    password: hashedPassword,
    image: {
      path: "",
      fileName: "",
    },
    workouts: [],
  });

  try {
    await createdUser.save();
  } catch (err) {
    const error = new HttpError("Sign up failed please try again later", 500);
    return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      { userId: createdUser.id, email: createdUser.email },
      process.env.JWT_KEY,
      { expiresIn: "1h" }
    );
  } catch (err) {
    const error = new HttpError("Sign up failed please try again later", 500);
    return next(error);
  }

  // send the token and userId back to the client. Send the token so we can include in all future requests (allows for authentication) we know who the user is.
  res.status(201).json({
    userId: createdUser.id,
    token,
    userEmail: createdUser.email,
    userName: createdUser.name,
  });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError("Signup failed please try again later", 500);
    return next(error);
  }

  if (!existingUser) {
    const error = new HttpError(
      "Invalid credentials could not log you in",
      403
    );
    return next(error);
  }

  let isValidPassword;
  try {
    //load hash password from DB and compare with plain text password input. returns a boolean(true/false)
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  } catch (e) {
    const error = new HttpError(
      "Could not log you in, something went wrong please try again later",
      500
    );
    return next(error);
  }

  if (!isValidPassword) {
    const error = new HttpError(
      "Invalid credentials could not log you in",
      403
    );
    return next(error);
  }

  let token;
  try {
    token = jwt.sign({ userId: existingUser.id }, process.env.JWT_KEY, {
      expiresIn: "1h",
    });
  } catch (err) {
    const error = new HttpError("Log in failed please try again later", 500);
    return next(error);
  }
  res.json({
    userId: existingUser.id,
    token,
    userImage: existingUser.image.path,
    userEmail: existingUser.email,
    userName: existingUser.name,
  });
};

// need to check if the user exists. Then need to send an email
const forgotPassword = async (req, res, next) => {
  const { email } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      "Something went wrong please try again later",
      500
    );
    return next(error);
  }

  if (!existingUser) {
    const error = new HttpError(
      "Sorry no exisiting account was found with this email.",
      403
    );
    return next(error);
  }

  const resetToken = crypto.randomBytes(20).toString("hex");
  console.log(resetToken);
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  existingUser.resetPasswordToken = resetPasswordToken;
  // set password expire to be 10 minutes in future.
  existingUser.resetPasswordExpire = Date.now() + 10 * (60 * 1000);

  try {
    await existingUser.save();
  } catch (e) {
    const error = new HttpError(
      "Something went wrong with resetting password please try again later",
      500
    );
    return next(error);
  }
  // need to add this as an environment variable at later point.
  // the link should be a route on the frontend. Need to make this a
  const resetUrl = `${process.env.FRONTEND_URL}passwordreset/${resetToken}`;
  const message = `
  <h1>You have requested a password reset</h1>
  <p>Please go to this link to reset your password</p>
  <a href=${resetUrl} clicktracking=off>${resetUrl}</a>`;

  try {
    await sendEmail({
      to: existingUser.email,
      subject: "Password Reset Request",
      text: message,
    });
    res.status(200).json({ success: true, data: "Email Sent" });
  } catch (e) {
    existingUser.resetPasswordToken = undefined;
    existingUser.resetPasswordExpire = undefined;
    try {
      await existingUser.save();
      const error = new HttpError("Email could not be sent.", 500);
      return next(error);
    } catch (e) {
      const error = new HttpError("Email could not be sent.", 500);
      return next(error);
    }
  }
};

//need to send the resettoken in the params.
const resetPassword = async (req, res, next) => {
  const { resetToken } = req.params;
  const { password } = req.body;

  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  let user;
  try {
    user = await User.findOne({
      resetPasswordToken: resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });
  } catch (e) {
    console.log(e);
    const error = new HttpError(
      "Something went wrong please try again later",
      500
    );
    next(error);
  }

  if (!user) {
    console.log("error");
    const error = new HttpError("Invalid reset token", 400);
    return next(error);
  }

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (e) {
    const error = new HttpError("Something went wrong please try again", 500);
    next(error);
  }

  user.password = hashedPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  try {
    await user.save();
  } catch (e) {
    const error = new HttpError(
      "Something went wrong with resetting password please try again later",
      500
    );
    return next(error);
  }

  res.status(201).json({ success: true, data: "password reset success" });
};


const updateProfile = async (req, res, next) => {
  const { userId } = req.userData;
  
  let user;
  try {
    user = await User.findById(userId);
    console.log(user);
  } catch (e) {
    const error = new HttpError(
      "Something went wrong please try again later",
      500
    );
    return next(error);
  }

  // delete old profile pic if exists. 
  if (user.image.path) {
    try {
      await cloudinary.uploader.destroy(user.image.fileName);
    } catch (e) {
      console.log("Could not delete image from cloudinary");
    }
  }

  user.image.path = req.file.path;
  user.image.fileName = req.file.filename;

  try {
    await user.save();
  } catch (e) {
    const error = new HttpError(
      "Something went wrong please try again later",
      500
    );
    return next(error);
  }

  res.status(201).json({ message: "yes it worked", image: user.image.path });
};

module.exports = {
  signup,
  login,
  forgotPassword,
  resetPassword,
  updateProfile,
};
