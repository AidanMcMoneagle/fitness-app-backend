const express = require("express");
const {
  trackWorkout,
  getWorkoutProgressByWorkoutId,
} = require("../controllers/trackworkout-controllers");
const checkAuth = require("../middleware/check-auth");

const router = express.Router();

// checkAuth middleware authenticates the user. Extracts the userId from the jwt. We therefore do not need to include the user Id in the url/body of any requests.

router.use(checkAuth);

router.get("/:workoutId", getWorkoutProgressByWorkoutId);

router.post("/:workoutId", trackWorkout);

module.exports = router;
