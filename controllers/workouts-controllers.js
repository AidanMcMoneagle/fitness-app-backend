const Workout = require("../models/workout-model");

// do we need to extract  userId from workout. NO.
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
  // we want to respond with all the data including the id. This allows us to include in the url when we send a request to delete/update a workout.
  res.status(201).json({ foundWorkouts }); // even if foundWorkouts is empty we still send back. Then we handle this on the frontEnd.
};

// in the post route need to extract data from req.body. Then need to use the new Workout to create a new workout object.
//now find the user in the db to associate the workout with. If we do not find a user we throw an error.
// then we save the new workout to the db along with the user.

// we will send workout data as json.

// set creator = userId.

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

  createdWorkout.save();

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

// when deleting a workout need to also ensure that we also delete from the trackworkouts.

const deleteWorkoutById = async (req, res, next) => {
  const { workoutId } = req.params;

  let deletedWorkout;
  try {
    deletedWorkout = await Workout.findByIdAndDelete(workoutId);
  } catch (e) {
    const error = new HttpError(
      "Something went wrong please try again later",
      500
    );
    return next(error);
  }
  res.json({ deletedWorkout });
};

module.exports = {
  getWorkoutsByUserId,
  createNewWorkout,
  deleteWorkoutById,
  archiveWorkout,
  unArchiveWorkout,
};
