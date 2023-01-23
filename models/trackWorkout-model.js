const mongoose = require("mongoose");

const { Schema } = mongoose;

const trackWorkoutSchema = new Schema({
  workout: { type: Schema.Types.ObjectId, required: true, ref: "Workout" },
  exerciseWeights: [
    {
      exerciseId: { type: String, required: true },
      exerciseName: { type: String, required: true },
      exerciseSets: { type: Array, required: true },
    },
  ],
  date: { type: Date, required: true },
});

const TrackWorkout = mongoose.model("TrackWorkout", trackWorkoutSchema);

module.exports = TrackWorkout;
