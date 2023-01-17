const express = require("express");
const {
  trackWorkout,
  getWorkoutProgressByWorkoutId,
} = require("../controllers/trackworkout-controllers");
const checkAuth = require("../middleware/check-auth");

const router = express.Router();

router.use(checkAuth);

router.get("/:workoutId", getWorkoutProgressByWorkoutId);

router.post("/:workoutId", trackWorkout);

module.exports = router;
