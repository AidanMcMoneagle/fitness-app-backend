const mongoose = require("mongoose");
const { Schema } = mongoose;

const workoutSchema = new Schema({
  //   creator: { type: Schema.Types.ObjectId, required: true, ref: "User" }, need to make sure this added later
  exercises: [
    {
      name: { type: String, required: true },
      sets: { type: String, required: true },
      reps: { type: String, required: true },
    },
  ],
});

const Workout = mongoose.model("Workout", workoutSchema);

module.exports = Workout;
