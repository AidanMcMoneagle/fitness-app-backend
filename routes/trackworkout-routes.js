const express = require("express");
const { trackWorkout } = require("../controllers/trackworkout-controllers");

const router = express.Router();

router.post("/:workoutId", trackWorkout);

module.exports = router;
