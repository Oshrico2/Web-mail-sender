import Employee from "../models/employeeModel.js";
import { logActivity } from "../utils/activity.js";
import { asyncHandler, escapeRegex, HttpError } from "../utils/http.js";

const like = (value) => ({ $regex: escapeRegex(value), $options: "i" });

// @route   GET /api/employees
const getAllEmployees = asyncHandler(async (req, res) => {
  res.json(await Employee.find({}).sort({ name: 1 }));
});

// @route   GET /api/employees/search/:name
const getEmployeeByName = asyncHandler(async (req, res) => {
  res.json(await Employee.find({ name: like(req.params.name) }).sort({ name: 1 }));
});

// @route   GET /api/employees/search-by-subject/:subject
const getEmployeesBySubject = asyncHandler(async (req, res) => {
  res.json(await Employee.find({ subject: like(req.params.subject) }).sort({ name: 1 }));
});

// @route   POST /api/employees/add
const addEmployee = asyncHandler(async (req, res) => {
  const { name, email, subject } = req.body;
  const employee = await Employee.create({
    name,
    email,
    subject,
    createdBy: req.user.username,
  });
  await logActivity(req, {
    title: "הוספת עובד",
    action: "נוסף",
    entityName: employee.name,
    color: "green",
  });
  res.status(201).json(employee);
});

// @route   GET /api/employees/:id
const getEmployeeById = asyncHandler(async (req, res) => {
  const employee = await Employee.findById(req.params.id);
  if (!employee) throw new HttpError(404, "העובד לא נמצא");
  res.json(employee);
});

// @route   PUT /api/employees/:id
const updateEmployeeById = asyncHandler(async (req, res) => {
  const employee = await Employee.findById(req.params.id);
  if (!employee) throw new HttpError(404, "העובד לא נמצא");
  for (const key of ["name", "email", "subject"]) {
    if (req.body[key] !== undefined) employee[key] = req.body[key];
  }
  employee.updatedAt = Date.now();
  employee.updatedBy = req.user.username;
  const updated = await employee.save();
  await logActivity(req, {
    title: "עדכון עובד",
    action: "עודכן",
    entityName: updated.name,
    color: "orange",
  });
  res.json(updated);
});

// @route   DELETE /api/employees/:id
const deleteEmployeeById = asyncHandler(async (req, res) => {
  const employee = await Employee.findByIdAndDelete(req.params.id);
  if (!employee) throw new HttpError(404, "העובד לא נמצא");
  await logActivity(req, {
    title: "הסרת עובד",
    action: "נמחק",
    entityName: employee.name,
    color: "red",
  });
  res.json({ message: "העובד נמחק" });
});

export {
  getAllEmployees,
  getEmployeeByName,
  addEmployee,
  getEmployeeById,
  updateEmployeeById,
  deleteEmployeeById,
  getEmployeesBySubject,
};
