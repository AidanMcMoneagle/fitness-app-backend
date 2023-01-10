const signup = async (req, res, next) => {
  const { name, password, email } = req.body;

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
    image: {
      path: req.file.path,
      filename: req.file.filename,
    },
    places: [],
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

  res
    .status(201)
    .json({ userId: createdUser.id, email: createdUser.email, token });
};
