const express = require("express");
const { createNewWorkout } = require("../controllers/workouts-controllers");
const { getWorkOutsByUserId } = require("../controllers/workouts-controllers");

const router = express.Router();

router.get("/", getWorkOutsByUserId);

// in the post route need to extract data from req.body. Then need to use the new Workout to create a new workout object.
//now find the user in the db to associate the workout with. If we do not find a user we throw an error.
// then we save the new workout to the db along with the user.
router.post("/new", createNewWorkout);

module.exports = router;
