const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  name: { type: "String", required: true },
  email: { type: "String", required: true },
  password: { type: "String", required: true },
  image: {
    path: { type: "String" },
    fileName: { type: "String" },
  },
  workouts: [{ type: Schema.Types.ObjectId, required: true, ref: "Workout" }],
  resetPasswordToken: String,
  resetPasswordExpire: Date,
});

const User = mongoose.model("User", userSchema);

module.exports = User;
