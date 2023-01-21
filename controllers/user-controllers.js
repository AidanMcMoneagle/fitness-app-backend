const User = require("../models/user-model");
const HttpError = require("../models/http-error");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const signup = async (req, res, next) => {
  const { name, email, password } = req.body;

  // checking to see if email already exists. Custom error handling. Still have this validation within the user schema.
  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    //will throw error if something went wrong with the findOne method. We just use try catch here as good practice whilst carrying out async operations.
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
    workouts: [],
  });

  try {
    await createdUser.save();
  } catch (err) {
    const error = new HttpError("Sign up failed please try again later", 500);
    return next(error);
  }

  console.log(createdUser.id, "userID");

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
  res.status(201).json({ userId: createdUser.id, token });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    //will throw error if something went wrong with the findOne method. We just use try catch here as good practice whilst carrying out async operations.
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

  //create a token. Encode in the token the userId.
  let token;
  try {
    token = jwt.sign({ userId: existingUser.id }, process.env.JWT_KEY, {
      expiresIn: "1h",
    });
  } catch (err) {
    const error = new HttpError("Log in failed please try again later", 500);
    return next(error);
  }
  //token is sent to client.
  res.json({ userId: existingUser.id, token });
};

module.exports = { signup, login };
