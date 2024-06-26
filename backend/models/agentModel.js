import mongoose from "mongoose";

const agentSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  firstName: {
    type: String,
    required: false,
    unique: false,
  },
  lastName: {
    type: String,
    required: true,
    unique: false,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  additionalMail: {
    type: String,
    required: false,
  },
  agentNumber: {
    type: String,
    required: false,
  },
  customerStatus: {
    type: Boolean,
    required: true,
    default: true,
  },
  weeklyStatus: {
    type: Boolean,
    required: true,
    default: false,
  },
  confirmedMailing: {
    type: Boolean,
    required: false,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
  },
  updatedBy: {
    type: String,
  },
  createdBy: {
    type: String,
    default: 'admin',
  },
});

const Agent = mongoose.model("Agent", agentSchema);

export default Agent;
