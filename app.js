const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");

const workoutRoutes = require("./routes/workout-routes");
const userRoutes = require("./routes/user-routes");
const trackWorkoutRoutes = require("./routes/trackworkout-routes");
const connectToDb = require("./utils/db");

dotenv.config();

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); // controls which domains have access. * allows any domain to send requests.
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE"); // controls which HTTP methods may be allowed when accessing a resource.

  next();
});

// api endpoints refer to collections. we have a workouts collection, trackworkouts collection and users collection.

app.use("/api/workouts", workoutRoutes);

app.use("/api/trackworkouts", trackWorkoutRoutes);

app.use("/api/users", userRoutes);

app.use((err, req, res, next) => {
  res.status(err.statuscode || 500).json({ message: err.message });
});

connectToDb(app);
