const mongoose = require("mongoose");
const { Schema } = mongoose;

const workoutSchema = new Schema({
  creator: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  workoutName: { type: String, required: true },
  exercises: [
    {
      name: { type: String, required: true },
      sets: { type: String, required: true },
      reps: { type: String, required: true },
      instructions: { type: String },
    },
  ],
  workoutProgress: [
    { type: Schema.Types.ObjectId, required: true, ref: "TrackWorkout" },
  ],
  isArchived: { type: Boolean, required: true },
  date: { type: Date, required: true },
});

const Workout = mongoose.model("Workout", workoutSchema);

module.exports = Workout;

//each workout will have multiple workout progress objects.
