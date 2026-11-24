import express from "express";
import {
  getAllEmployees,
  getEmployeeByName,
  getEmployeesBySubject,
  addEmployee,
  getEmployeeById,
  updateEmployeeById,
  deleteEmployeeById,
  getEmployeeSubjects,
} from "../controllers/employeeController.js";


const router = express.Router();

router.route('/search/:name').get(getEmployeeByName);
router.route('/search-by-subject/:subject').get(getEmployeesBySubject);
router.route('/').get(getAllEmployees);
router.route('/subjects').get(getEmployeeSubjects);
router.route('/add').post(addEmployee);
router.route('/:id').get(getEmployeeById).put(updateEmployeeById).delete(deleteEmployeeById);

export default router;
