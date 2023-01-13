const express = require("express");
const {
  createNewWorkout,
  getWorkoutsByUserId,
  deleteWorkoutById,
} = require("../controllers/workouts-controllers");
const checkAuth = require("../middleware/check-auth");

const router = express.Router();

// checkAuth authenticates the user. Extracts the userId. We therefore do not need to extract the user Id from the url.
router.use(checkAuth);

router.get("/", getWorkoutsByUserId);

// in the post route need to extract data from req.body. Then need to use the new Workout to create a new workout object.
//now find the user in the db to associate the workout with. If we do not find a user we throw an error.
// then we save the new workout to the db along with the user.

router.post("/new", createNewWorkout);

router.delete("/:workoutId", deleteWorkoutById);

module.exports = router;
