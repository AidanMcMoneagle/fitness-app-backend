const mongoose = require("mongoose");
const { Schema } = mongoose;

const workoutSchema = new Schema({
  creator: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  exercises: [
    {
      name: { type: String, required: true },
      sets: { type: String, required: true },
      reps: { type: String, required: true },
    },
  ],
  workoutProgress: [
    { type: Schema.Types.ObjectId, required: true, ref: "TrackWorkout" },
  ],
});

const Workout = mongoose.model("Workout", workoutSchema);

module.exports = Workout;

//each workout will have multiple workout progress objects.
