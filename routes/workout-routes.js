const express = require("express");
const {
  createNewWorkout,
  getWorkoutsByUserId,
  deleteWorkoutById,
  archiveWorkout,
  unArchiveWorkout,
} = require("../controllers/workouts-controllers");

const checkAuth = require("../middleware/check-auth");

const router = express.Router();

// checkAuth middleware authenticates the user. Extracts the userId from the jwt. We therefore do not need to include the user Id in the url/body of any requests.
router.use(checkAuth);

router.get("/", getWorkoutsByUserId);

router.patch("/archive/:workoutId", archiveWorkout);

router.patch("/unarchive/:workoutId", unArchiveWorkout);

router.post("/new", createNewWorkout);

router.delete("/:workoutId", deleteWorkoutById);

module.exports = router;
