const mongoose = require("mongoose");
const Workout = require("../models/workout-model");

// do we need to extract  userId from workout. NO. 
const getWorkOutsByUserId = async (req, res, next) => {};

// in the post route need to extract data from req.body. Then need to use the new Workout to create a new workout object.
//now find the user in the db to associate the workout with. If we do not find a user we throw an error.
// then we save the new workout to the db along with the user.

// we will send workout data as json.

// set creator = userId.

const createNewWorkout = async (req, res, next) => {
  const exerciseArray = req.body.map((exercise) => {
    return {
      name: exercise.value.exerciseName,
      reps: exercise.value.repetitions,
      sets: exercise.value.sets,
    };
  });

  const createdWorkout = new Workout({
    exercises: exerciseArray,
    creator: req.userData.userId,
  });

  createdWorkout.save();

  res.status(201).json({ createdWorkout });
};

module.exports = { getWorkOutsByUserId, createNewWorkout };
