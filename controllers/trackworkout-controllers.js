const TrackWorkout = require("../models/trackWorkout-model");
const Workout = require("../models/workout-model");
const HttpError = require("../models/http-error");


const getWorkoutProgressByWorkoutId = async (req, res, next) => {
  const { workoutId } = req.params;

  let foundWorkout;
  try {
    foundWorkout = await Workout.findById(workoutId);
  } catch (e) {
    const error = new HttpError(
      "Fetching workout progress failed please try again later",
      500
    );
    return next(error);
  }

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

  res.status(201).json({ workOutProgress: allTrackedWorkouts, foundWorkout });
};


const trackWorkout = async (req, res, next) => {
  const { workoutId } = req.params;
  const { exerciseWeights } = req.body; 

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
