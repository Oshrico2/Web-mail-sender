import mongoose from "mongoose";

const employeeSchema = mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true,
    unique: false,
  },
  email: {
    type: String,
    trim: true,
    required: false,
  },
  subject:{
    type: String,
    trim: true,
    required: true,
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

employeeSchema.index({ subject: 1, name: 1 });

const Employee = mongoose.model("Employee", employeeSchema);

export default Employee;
