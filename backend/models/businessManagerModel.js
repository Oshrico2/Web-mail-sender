import mongoose from "mongoose";

const businessManagerSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  lettersOfLastNamesUnderCare: {
    type: [String],
    required: true,
    validate: {
      validator: function (array) {
        return array.every((letter) => /^[א-ת]$/.test(letter));
      },
      message: (props) => `${props.value} is not a valid Hebrew letter!`,
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
  },
  createdBy: {
    type: String,
    default: 'admin',
  },
  updatedBy: {
    type: String,
  },
});

const BusinessManager = mongoose.model("BusinessManager", businessManagerSchema);

export default BusinessManager;
