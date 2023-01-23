const Workout = require("../models/workout-model");
const User = require("../models/user-model");
const TrackWorkout = require("../models/trackWorkout-model");
const HttpError = require("../models/http-error");

const getWorkoutsByUserId = async (req, res, next) => {
  const { userId } = req.userData;
  let foundWorkouts;
  try {
    foundWorkouts = await Workout.find({ creator: userId });
  } catch (e) {
    const error = new HttpError(
      "Something went wrong please try again later",
      500
    );
    return next(error);
  }

  // even if foundWorkouts is an empty array we still send a response back to the client. We then handle this on the frontEnd.
  res.status(201).json({ foundWorkouts });
};

const createNewWorkout = async (req, res, next) => {
  const { exercises, workoutName } = req.body;

  const exerciseArray = exercises.map((exercise) => {
    return {
      name: exercise.value.exerciseName,
      reps: exercise.value.repetitions,
      sets: exercise.value.sets,
    };
  });

  const createdWorkout = new Workout({
    workoutName,
    exercises: exerciseArray,
    creator: req.userData.userId,
    isArchived: false,
    date: new Date(),
  });

  let foundUser;
  try {
    foundUser = await User.findById(req.userData.userId);
  } catch (e) {
    const error = new HttpError(
      "Something went wrong with creating your workout please try again later",
      500
    );
    return next(error);
  }

  try {
    await createdWorkout.save();
    foundUser.workouts.push(createdWorkout);
    await foundUser.save();
  } catch (e) {
    const error = new HttpError(
      "Something went wrong with creating your workout please try again later",
      500
    );
    return next(error);
  }

  res.status(201).json({ createdWorkout });
};

const archiveWorkout = async (req, res, next) => {
  const { workoutId } = req.params;

  let archivedWorkout;
  try {
    archivedWorkout = await Workout.findOneAndUpdate(
      { _id: workoutId },
      { isArchived: true },
      { new: true }
    );
  } catch (e) {
    const error = new HttpError(
      "Submitting workout data failed please try again later",
      500
    );
    return next(error);
  }

  if (!archivedWorkout) {
    const error = new HttpError(
      "Could not find workout for the provided id",
      404
    );
    return next(error);
  }

  res.status(201).json({ archivedWorkout });
};

const unArchiveWorkout = async (req, res, next) => {
  const { workoutId } = req.params;

  let archivedWorkout;
  try {
    archivedWorkout = await Workout.findOneAndUpdate(
      { _id: workoutId },
      { isArchived: false },
      { new: true }
    );
  } catch (e) {
    const error = new HttpError(
      "Submitting workout data failed please try again later",
      500
    );
    return next(error);
  }

  if (!archivedWorkout) {
    const error = new HttpError(
      "Could not find workout for the provided id",
      404
    );
    return next(error);
  }

  res.status(201).json({ archivedWorkout });
};

// when deleting a workout need to ensure that we also delete all trackedworkouts and delete the workout from the workouts array in the user model.

const deleteWorkoutById = async (req, res, next) => {
  const { workoutId } = req.params;

  let toBeDeletedWorkout;
  try {
    toBeDeletedWorkout = await Workout.findById(workoutId).populate("creator");
    // does not throw an error if no documents are matched. if check not required to see if user has not tracked any workouts.
    await TrackWorkout.deleteMany({
      workout: workoutId,
    });
  } catch (e) {
    console.log(e);
    const error = new HttpError(
      "Something went wrong please try again later",
      500
    );
    return next(error);
  }

  try {
    await toBeDeletedWorkout.remove();
    toBeDeletedWorkout.creator.workouts.pull(toBeDeletedWorkout);
    await toBeDeletedWorkout.creator.save();
  } catch (e) {
    console.log(e);
    const error = new HttpError(
      "Something went wrong please try again later",
      500
    );
    return next(error);
  }

  res.json({ toBeDeletedWorkout });
};

module.exports = {
  getWorkoutsByUserId,
  createNewWorkout,
  deleteWorkoutById,
  archiveWorkout,
  unArchiveWorkout,
};
