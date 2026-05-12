"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteEmployee = exports.updateEmployee = exports.getEmployeeByNif = exports.getEmployeeById = exports.getEmployees = exports.createEmployee = void 0;
const Employee_js_1 = require("../db/models/Employee.js");
const auditService_js_1 = require("../services/auditService.js");
const createEmployee = async (req, res, next) => {
    try {
        const { name, surname, nif, email, phone, city, province, country } = req.body;
        if (typeof name !== "string" ||
            typeof surname !== "string" ||
            typeof nif !== "string" ||
            typeof email !== "string" ||
            name.trim() === "" ||
            surname.trim() === "" ||
            nif.trim() === "" ||
            email.trim() === "") {
            res.status(400).json({ message: "Invalid data types" });
            return;
        }
        const exists = await Employee_js_1.Employee.findOne({ $or: [{ email }, { nif }] });
        if (exists) {
            res.status(409).json({ message: "Employee with this email or NIF already exists" });
            return;
        }
        const employee = new Employee_js_1.Employee({
            name: name.trim(),
            surname: surname.trim(),
            nif: nif.trim(),
            email: email.trim().toLowerCase(),
            phone,
            city: city.trim(),
            province: province.trim(),
            country: country.trim()
        });
        await employee.save();
        // ← AGREGAR AUDITORÍA
        await (0, auditService_js_1.createAuditLog)(req.user._id.toString(), req.user.name, "CREATE", "EMPLOYEE", employee._id.toString(), `${employee.name} ${employee.surname}`, req, { after: req.body }, `Empleado ${employee.name} ${employee.surname} creado`);
        return res.status(201).json(employee);
    }
    catch (error) {
        next(error);
    }
};
exports.createEmployee = createEmployee;
const getEmployees = async (req, res, next) => {
    try {
        const employees = await Employee_js_1.Employee.find();
        res.status(200).send(employees);
    }
    catch (error) {
        next(error);
    }
};
exports.getEmployees = getEmployees;
const getEmployeeById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const employee = await Employee_js_1.Employee.findById(id);
        console.log("Empleado", employee);
        if (!employee) {
            res.status(404).json({ message: "Employee not found" });
            return;
        }
        return res.status(200).json(employee);
    }
    catch (error) {
        next(error);
    }
};
exports.getEmployeeById = getEmployeeById;
const getEmployeeByNif = async (req, res, next) => {
    try {
        const { nif } = req.params;
        if (typeof (nif) !== "string" || nif === "") {
            res.status(400).json({ message: "NIF has to be a string" });
            return;
        }
        const employee = await Employee_js_1.Employee.findOne({ nif });
        if (!employee) {
            res.status(404).json({ message: "Employee not found" });
            return;
        }
        return res.status(200).json(employee);
    }
    catch (error) {
        next(error);
    }
};
exports.getEmployeeByNif = getEmployeeByNif;
const updateEmployee = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, surname, nif, email, phone, city, province, country } = req.body;
        const employee = await Employee_js_1.Employee.findById(id);
        if (!employee) {
            res.status(404).json({ message: "Employee not found" });
            return;
        }
        // Guardar datos antes del cambio para auditoría
        const before = employee.toObject();
        // Verificar si el email o NIF ya existen en otro empleado
        if (email || nif) {
            const existingEmployee = await Employee_js_1.Employee.findOne({
                $or: [{ email }, { nif }],
                _id: { $ne: id }
            });
            if (existingEmployee) {
                res.status(409).json({ message: "Email or NIF already in use by another employee" });
                return;
            }
        }
        const updatedEmployee = await Employee_js_1.Employee.findByIdAndUpdate(id, {
            name: name?.trim() ?? employee.name,
            surname: surname?.trim() ?? employee.surname,
            nif: nif?.trim() ?? employee.nif,
            email: email?.trim().toLowerCase() ?? employee.email,
            phone: phone ?? employee.phone,
            city: city ?? employee.city,
            province: province ?? employee.province,
            country: country ?? employee.country,
        }, { new: true });
        // ← AGREGAR AUDITORÍA
        await (0, auditService_js_1.createAuditLog)(req.user._id.toString(), req.user.name, "UPDATE", "EMPLOYEE", updatedEmployee?._id.toString(), `${updatedEmployee?.name} ${updatedEmployee?.surname}`, req, { before, after: req.body }, `Empleado ${updatedEmployee?.name} ${updatedEmployee?.surname} actualizado`);
        res.status(200).json(updatedEmployee);
    }
    catch (error) {
        next(error);
    }
};
exports.updateEmployee = updateEmployee;
const deleteEmployee = async (req, res, next) => {
    try {
        const { id } = req.params;
        const employee = await Employee_js_1.Employee.findById(id);
        if (!employee) {
            res.status(404).json({ message: "Employee not found" });
            return;
        }
        // ← AGREGAR AUDITORÍA
        await (0, auditService_js_1.createAuditLog)(req.user._id.toString(), req.user.name, "DELETE", "EMPLOYEE", employee._id.toString(), `${employee.name} ${employee.surname}`, req, { before: employee.toObject() }, `Empleado ${employee.name} ${employee.surname} eliminado`);
        await Employee_js_1.Employee.findByIdAndDelete(id);
        res.status(200).json({ message: "Employee deleted successfully" });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteEmployee = deleteEmployee;
//# sourceMappingURL=employeeController.js.map