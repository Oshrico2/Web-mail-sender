import express from "express";
import {
  getAllEmployees,
  getEmployeeByName,
  getEmployeesBySubject,
  addEmployee,
  getEmployeeById,
  updateEmployeeById,
  deleteEmployeeById,
} from "../controllers/employeeController.js";


const router = express.Router();

router.route('/search/:name').get(getEmployeeByName);
router.route('/search-by-subject/:subject').get(getEmployeesBySubject);
router.route('/').get(getAllEmployees);
router.route('/add').post(addEmployee);
router.route('/:id').get(getEmployeeById).put(updateEmployeeById).delete(deleteEmployeeById);

export default router;
