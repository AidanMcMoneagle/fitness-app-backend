const TrackWorkout = require("../models/trackWorkout-model");
const Workout = require("../models/workout-model");
const HttpError = require("../models/http-error");
const mongoose = require("mongoose");

// need a route to get all workouts that have been tracked by the workoutId.

const getWorkoutProgressByWorkoutId = async (req, res, next) => {
  const { workoutId } = req.params;
  console.log(workoutId);
  // dont need to do this. need to find all
  let allTrackedWorkouts;
  try {
    allTrackedWorkouts = await TrackWorkout.find({ workout: workoutId });
  } catch (e) {
    const error = new HttpError(
      "Fetching workout progress failed please try again later",
      500
    );
    return next(error);
  }

  // we may not want to do this. Might want to handle this on the frontend. Might not be an array need to check this logic.
  if (allTrackedWorkouts.length === 0) {
    const error = new HttpError(
      "Could not find any workout progress for the provided workout id",
      404
    );
    return next(error);
  }

  res.status(201).json({ workOutProgress: allTrackedWorkouts });
};

// need a route to post tracked workouts. First thing we need to do is check if the workout exists.

// then we need to create new trackworkout model.
// we need to push the trackedworkoout object onto the workout model.

const trackWorkout = async (req, res, next) => {
  const { workoutId } = req.params;
  const { exerciseWeights } = req.body; // array of objects each object contains the exercise Id and

  let foundWorkout;
  try {
    foundWorkout = await Workout.findById(workoutId);
  } catch (e) {
    const error = new HttpError(
      "Submitting workout data failed please try again later",
      500
    );
    return next(error);
  }

  if (!foundWorkout) {
    const error = new HttpError(
      "Could not find workout for the provided id",
      404
    );
    return next(error);
  }

  const workoutWeights = new TrackWorkout({
    workout: workoutId,
    exerciseWeights,
    date: new Date(),
  });

  console.log(workoutWeights);
  console.log(foundWorkout);

  try {
    await workoutWeights.save();
    foundWorkout.workoutProgress.push(workoutWeights);
    await foundWorkout.save();
  } catch (err) {
    console.log(err);
    const error = new HttpError("Creating place failed, please try again", 500);
    return next(error);
  }

  res.status(201).json({ message: "it worked" });
};

module.exports = {
  trackWorkout,
  getWorkoutProgressByWorkoutId,
};
