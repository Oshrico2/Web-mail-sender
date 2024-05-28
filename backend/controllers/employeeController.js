import Employee from "../models/employeeModel.js";

// @desc    Get all employees
// @route   GET /api/employees
// @access  Private
const getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find({}).sort({ name: 1 }); // 1 for ascending order
    // return employees
    res.json(employees);
  } catch (error) {
    console.error("Error fetching employees:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Get employee by name
// @route   GET /api/employees/search/:name
// @access  Private
const getEmployeeByName = async (req, res) => {
  try {
    const { name } = req.params;
    const employee = await Employee.find({
      name: { $regex: name, $options: "i" },
    });
    res.json(employee);
  } catch (error) {
    console.error("Error searching employee by name:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Get employee by subject
// @route   GET /api/employees/search/:subject
// @access  Private
const getEmployeesBySubject = async (req, res) => {
  try {
    const { subject } = req.params;
    const employees = await Employee.find({
      subject: { $regex: subject, $options: "i" },
    });
    res.json(employees);
  } catch (error) {
    console.error("Error searching employee by subject:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Add an employee
// @route   POST /api/employees/add
// @access  Private
const addEmployee = async (req, res) => {
  const { name, email, subject } = req.body;
  const employee = new Employee({
    name: name,
    email: email,
    subject: subject,
  });

  await employee.save();
  res.status(200).json({ message: "Employee added successfully" });
};

// @desc    Get employee by ID
// @route   GET /api/employees/:id
// @access  Private
const getEmployeeById = async (req, res) => {
  const employee = await Employee.findById(req.params.id);

  if (employee) {
    res.json(employee);
  } else {
    res.status(404);
    throw new Error("Employee not found");
  }
};

// @desc    Update employee by ID
// @route   PUT /api/employees/:id
// @access  Private
const updateEmployeeById = async (req, res) => {
  const { name, email, subject } = req.body;

  const employee = await Employee.findById(req.params.id);

  if (employee) {
    employee.name = name !== undefined ? name : employee.name;
    employee.email = email !== undefined ? email : employee.email;
    employee.subject = subject !== undefined ? subject : employee.subject;

    const updatedEmployee = await employee.save();
    res.json(updatedEmployee);
  } else {
    res.status(404);
    throw new Error("Employee not found");
  }
};

// @desc    Delete employee by ID
// @route   DELETE /api/employees/:id
// @access  Private
const deleteEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);
    if (!employee) {
      res.status(404).json({ message: "Employee not found" });
      return;
    }
    res.json({ message: "Employee removed successfully" });
  } catch (error) {
    console.error("Error deleting employee:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export {
  getAllEmployees,
  getEmployeeByName,
  addEmployee,
  getEmployeeById,
  updateEmployeeById,
  deleteEmployeeById,
  getEmployeesBySubject,
};
