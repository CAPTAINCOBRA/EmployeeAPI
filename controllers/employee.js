const Employee = require("../models/employee");
var jwt = require("jsonwebtoken");
var expressJwt = require("express-jwt");

exports.getEmployeeById = (req, res, next, id) => {
  Employee.findById(id).exec((err, employee) => {
    if (err || !employee) {
      return res.status(400).json({
        error: "No employee was found in DB",
      });
    }
    req.profile = employee;
    next();
  });
};

exports.createEmployee = (req, res) => {
  const employee = new Employee(req.body);
  employee.save((err, employee) => {
    if (err) {
      return res.status(400).json({
        error: err,
      });
    }
    res.json({
      name: employee.name,
      email: employee.email,
      department: employee.department,
      age: employee.age,
    });
  });
};

exports.signinEmployee = (req, res) => {
  const { email, password } = req.body;

  Employee.findOne({ email }, (err, employee) => {
    if (err || !employee) {
      return res.status(400).json({
        error: "User with that email does not exist",
      });
    }

    if (!employee.authenticate(password)) {
      return res.status(401).json({
        error: "Email and password do not match",
      });
    }

    const token = jwt.sign({ _id: employee._id }, process.env.SECRET);

    res.cookie("token", token, { expire: new Date() + 9999 });

    const { _id, name, email, age, department } = employee;
    return res.json({ token, user: { _id, name, email, age, department } });
  });
};

exports.getEmployee = (req, res) => {
  req.profile.salt = undefined;
  req.profile.encry_password = undefined;
  req.profile.createdAt = undefined;
  req.profile.updatedAt = undefined;

  return res.json(req.profile);
};

exports.getAllEmployees = (req, res) => {
  Employee.find({ Employee })
    .then((employees) => {
      employees.map((employee) => {
        employee.salt = undefined;
        employee.encry_password = undefined;
        employee.createdAt = undefined;
        employee.updatedAt = undefined;
      });
      res.json(employees);
    })
    .catch((err) => res.status(401).json({ error: "No employee FOund" }));
};

exports.updateEmployee = (req, res) => {
  Employee.findByIdAndUpdate(
    { _id: req.profile._id },
    { $set: req.body },
    { new: true, useFindAndModify: false },
    (err, employee) => {
      if (err) {
        return res.status(400).json({
          error: "You are not authorized to update this employee",
        });
      }
      employee.salt = undefined;
      employee.encry_password = undefined;
      employee.createdAt = undefined;
      employee.updatedAt = undefined;
      res.json(employee);
    }
  );
};

exports.deleteEmployee = (req, res) => {
  const employee = req.profile;
  employee.remove((err, employee) => {
    if (err) {
      return res.status(400).json({
        error: err,
      });
    }
    res.json({
      message: "Employee deleted successfully",
    });
  });
};
