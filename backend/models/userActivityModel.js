import mongoose from "mongoose";

const userActivitySchema = mongoose.Schema({
  action: {
    type: String,
    required: true,
  },
  title:{
    type:String,
    required:true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    required: true,
  },
  createdBy: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  entityName: {
    type: String,
    required: false,
  },
  color: {
    type: String,
    required: true,
  },
});

const UserActivity = mongoose.model("UserActivity", userActivitySchema);

export default UserActivity;
