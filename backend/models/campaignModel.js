import mongoose from "mongoose";

const campaignSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  createdBy: {
    type: String,
    default: 'admin',
  },
});

const Campaign = mongoose.model("Campaign", campaignSchema);

export default Campaign;
