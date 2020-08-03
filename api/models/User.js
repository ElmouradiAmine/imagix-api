const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      min: 6,
      max: 255,
      required: true,
    },
    email: {
        type: String,
        min: 6,
        max: 255,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        min: 6,
        max: 255,
        required: true,
    }
  },
  {
    timestamps: true,
  }
);


module.exports = mongoose.model('User', userSchema);