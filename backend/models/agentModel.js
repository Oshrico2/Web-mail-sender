import mongoose from "mongoose";

const agentSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique:true,
  },
  additionalMail: {
    type: String,
    required: false,
  },
  agentNumber: {
    type: String,
    required: false,
  },
  weeklyStatus:{
    type:Boolean,
    required:true,
    default:false,
  },
  confirmedMailing:{
    type: Boolean,
    required:false,
    default:true,
  }
});

const Agent = mongoose.model("Agent", agentSchema);

export default Agent;
