const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const workoutRoutes = require("./routes/workout-routes");
const userRoutes = require("./routes/user-routes");

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); // controls which domains have access. * allows any domain to send requests.
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE"); // controls which HTTP methods may be allowed when accessing a resource.

  next();
});

app.use("/api/workouts", workoutRoutes);

app.use("/api/users", userRoutes);

mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.r1k7vjn.mongodb.net/?retryWrites=true&w=majority`
  )
  .then(() => {
    app.listen(process.env.PORT || 5000, () => {
      console.log("listening on port 5000");
    });
  })
  .catch((err) => {
    console.log(err);
  });
