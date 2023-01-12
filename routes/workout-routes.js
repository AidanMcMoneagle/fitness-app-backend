const express = require("express");
const {
  createNewWorkout,
  getWorkOutsByUserId,
} = require("../controllers/workouts-controllers");
const checkAuth = require("../middleware/check-auth");

const router = express.Router();

router.get("/", getWorkOutsByUserId);

// in the post route need to extract data from req.body. Then need to use the new Workout to create a new workout object.
//now find the user in the db to associate the workout with. If we do not find a user we throw an error.
// then we save the new workout to the db along with the user.

router.use(checkAuth)

router.post("/new", createNewWorkout);

module.exports = router;
