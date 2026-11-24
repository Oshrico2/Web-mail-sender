import mongoose from "mongoose";

const agentSchema = mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true,
    unique: true,
  },
  firstName: {
    type: String,
    trim: true,
    required: false,
    unique: false,
  },
  lastName: {
    type: String,
    trim: true,
    required: true,
    unique: false,
  },
  email: {
    type: String,
    trim: true,
    required: true,
    unique: true,
  },
  additionalMail: {
    type: String,
    trim: true,
    required: false,
  },
  agentNumber: {
    type: String,
    trim: true,
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

agentSchema.index({ customerStatus: 1, weeklyStatus: 1 });
agentSchema.index({ confirmedMailing: 1 });
agentSchema.index({ lastName: 1 });
agentSchema.index({ createdAt: -1 });

const Agent = mongoose.model("Agent", agentSchema);

export default Agent;
