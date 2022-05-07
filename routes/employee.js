const express = require("express");
const router = express.Router();

const {
  getEmployeeById,
  getEmployee,
  getAllEmployees,
  updateEmployee,
  createEmployee,
  deleteEmployee,
  signinEmployee,
} = require("../controllers/employee");
// const { isSignedIn, isAdmin, isAuthenticated } = require("../controllers/auth");

router.param("employeeId", getEmployeeById);

router.post("/employee/create", createEmployee);

router.post("/employee/signin", signinEmployee);

// router.get("/employee/:employeeId", isSignedIn, isAuthenticated, getEmployee);
router.get("/employee/:employeeId", getEmployee);
router.get("/employees", getAllEmployees);
router.put("/employee/:employeeId", updateEmployee);
router.delete("/employee/:employeeId", deleteEmployee);

module.exports = router;
