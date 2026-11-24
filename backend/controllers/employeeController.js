import Employee from "../models/employeeModel.js";
import { logActivity } from "../utils/activity.js";
import { asyncHandler, escapeRegex, HttpError } from "../utils/http.js";
import { and, paginate, readListParams } from "../utils/paginate.js";

const like = (value) => ({ $regex: escapeRegex(value), $options: "i" });
const LIST_OPTIONS = { sortable: ["name", "subject", "email"], defaultSort: "name", searchFields: ["name", "subject", "email"] };

// @route   GET /api/employees?page=&limit=&sort=&q=&subject=
const getAllEmployees = asyncHandler(async (req, res) => {
  const params = readListParams(req, LIST_OPTIONS);
  const subject = req.query.subject ? { subject: String(req.query.subject) } : null;
  res.json(await paginate(Employee, and(params.search, subject), params));
});

// @desc    Distinct subjects with their employee counts
// @route   GET /api/employees/subjects
const getEmployeeSubjects = asyncHandler(async (req, res) => {
  const rows = await Employee.aggregate([
    { $group: { _id: "$subject", count: { $sum: 1 } } },
    { $sort: { _id: 1 } },
  ]).collation({ locale: "he" });
  const total = rows.reduce((s, r) => s + r.count, 0);
  res.json({ total, subjects: rows.filter((r) => r._id).map((r) => ({ subject: r._id, count: r.count })) });
});

// @route   GET /api/employees/search/:name  (kept; paginated)
const getEmployeeByName = asyncHandler(async (req, res) => {
  res.json(await paginate(Employee, { name: like(req.params.name) }, readListParams(req, LIST_OPTIONS)));
});

// @route   GET /api/employees/search-by-subject/:subject  (kept; paginated)
const getEmployeesBySubject = asyncHandler(async (req, res) => {
  res.json(await paginate(Employee, { subject: like(req.params.subject) }, readListParams(req, LIST_OPTIONS)));
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
  getEmployeeSubjects,
};
