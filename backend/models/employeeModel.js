import mongoose from "mongoose";

const employeeSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: false,
  },
  email: {
    type: String,
    required: false,
  },
  subject:{
    type:String,
    required:true,
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

const Employee = mongoose.model("Employee", employeeSchema);

export default Employee;
