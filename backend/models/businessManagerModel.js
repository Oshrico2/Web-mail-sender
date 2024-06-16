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
});

const BusinessManager = mongoose.model("BusinessManager", businessManagerSchema);

export default BusinessManager;
