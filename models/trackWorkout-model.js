const mongoose = require("mongoose");

const { Schema } = mongoose;

const trackWorkoutSchema = new Schema({
  workout: { type: Schema.Types.ObjectId, required: true, ref: "Workout" }, // equal to the workout id.
  exerciseWeights: [
    {
      exerciseId: { type: String, required: true }, // it is an id.
      exerciseName: { type: String, required: true },
      exerciseSets: { type: Array, required: true }, // equals array of weights user has lifted.
    },
  ],
  date: { type: Date, required: true },
});

const TrackWorkout = mongoose.model("TrackWorkout", trackWorkoutSchema);

module.exports = TrackWorkout;
