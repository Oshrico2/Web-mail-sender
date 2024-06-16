import mongoose from "mongoose";

const campaignSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
});

const Campaign = mongoose.model("Campaign", campaignSchema);

export default Campaign;
