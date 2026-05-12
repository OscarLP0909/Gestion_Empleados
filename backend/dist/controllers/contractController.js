"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getContractsPending = exports.updateStatus = exports.updateContract = exports.getContractActiveOfEmployee = exports.getContractsOfEmployee = exports.deleteContract = exports.getContractById = exports.getContracts = exports.createContract = void 0;
const mongoose_1 = require("mongoose");
const Contract_js_1 = require("../db/models/Contract.js");
const Employee_js_1 = require("../db/models/Employee.js");
const auditService_js_1 = require("../services/auditService.js");
const createContract = async (req, res, next) => {
    try {
        const { employeeId, contractType, temporaryType, workdayType, salaryType, salaryAmount, startDate, endDate, department, category, position, status } = req.body;
        const employee = await Employee_js_1.Employee.findById(employeeId);
        if (!employee) {
            res.status(404).json({ message: "Employee not found" });
            return;
        }
        if (!contractType || !workdayType || !salaryType || salaryAmount === undefined || !startDate || !department?.trim() || !category?.trim() || !position?.trim()) {
            res.status(400).json({ message: "Missing required fields" });
            return;
        }
        const contract = new Contract_js_1.Contract({
            employeeId,
            contractType,
            temporaryType: temporaryType || null,
            workdayType,
            salaryType,
            salaryAmount,
            startDate,
            endDate: endDate || null,
            department: department.trim(),
            category: category.trim(),
            position: position.trim(),
            status: status || "PENDIENTE"
        });
        await contract.save();
        // ← AGREGAR AUDITORÍA
        await (0, auditService_js_1.createAuditLog)(req.user._id.toString(), req.user.name, "CREATE", "CONTRACT", contract._id.toString(), `${position.trim()} - ${employee.name} ${employee.surname}`, req, { after: req.body }, `Contrato ${position.trim()} para ${employee.name} ${employee.surname} creado`);
        res.status(201).json(contract);
    }
    catch (error) {
        next(error);
    }
};
exports.createContract = createContract;
const getContracts = async (req, res, next) => {
    try {
        const contracts = await Contract_js_1.Contract.find().populate("employeeId", "name surname nif email");
        res.status(200).json(contracts);
    }
    catch (error) {
        next(error);
    }
};
exports.getContracts = getContracts;
const getContractById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const contract = await Contract_js_1.Contract.findById(id).populate("employeeId", "name surname nif email");
        if (!contract) {
            res.status(404).json({ message: "Contract not found" });
            return;
        }
        return res.status(200).json(contract);
    }
    catch (error) {
        next(error);
    }
};
exports.getContractById = getContractById;
const deleteContract = async (req, res, next) => {
    try {
        const { id } = req.params;
        const contract = await Contract_js_1.Contract.findById(id);
        if (!contract) {
            res.status(404).json({ message: "Contract not found" });
            return;
        }
        // ← AGREGAR AUDITORÍA
        await (0, auditService_js_1.createAuditLog)(req.user._id.toString(), req.user.name, "DELETE", "CONTRACT", contract._id.toString(), contract.position, req, { before: contract.toObject() }, `Contrato ${contract.position} eliminado`);
        await Contract_js_1.Contract.findByIdAndDelete(id);
        return res.status(200).json({ message: "Contract deleted successfully" });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteContract = deleteContract;
const getContractsOfEmployee = async (req, res, next) => {
    try {
        const rawEmployeeId = req.params.employeeId;
        const employeeId = Array.isArray(rawEmployeeId) ? rawEmployeeId[0] : rawEmployeeId;
        if (!employeeId || !mongoose_1.Types.ObjectId.isValid(employeeId)) {
            res.status(400).json({ message: "Invalid employeeId" });
            return;
        }
        const contracts = await Contract_js_1.Contract.find({ employeeId: new mongoose_1.Types.ObjectId(employeeId) });
        if (contracts.length === 0) {
            res.status(404).json({ message: "The Employee doesn't have any Contract" });
            return;
        }
        res.status(200).json(contracts);
    }
    catch (error) {
        next(error);
    }
};
exports.getContractsOfEmployee = getContractsOfEmployee;
const getContractActiveOfEmployee = async (req, res, next) => {
    try {
        const rawEmployeeId = req.params.employeeId;
        const employeeId = Array.isArray(rawEmployeeId) ? rawEmployeeId[0] : rawEmployeeId;
        if (!employeeId || !mongoose_1.Types.ObjectId.isValid(employeeId)) {
            res.status(400).json({ message: "Invalid employeeId" });
            return;
        }
        const contract = await Contract_js_1.Contract.find({
            employeeId: new mongoose_1.Types.ObjectId(employeeId),
            status: "ACTIVO"
        });
        if (contract.length === 0) {
            res.status(404).json({ message: "This Employee doesn't have an active contract" });
            return;
        }
        res.status(200).json(contract);
    }
    catch (error) {
        next(error);
    }
};
exports.getContractActiveOfEmployee = getContractActiveOfEmployee;
const updateContract = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { employeeId, contractType, temporaryType, workdayType, salaryType, salaryAmount, startDate, endDate, department, category, position, status } = req.body;
        const contract = await Contract_js_1.Contract.findById(id);
        if (!contract) {
            res.status(404).json({ message: "Contract not found" });
            return;
        }
        // Guardar datos antes del cambio para auditoría
        const before = contract.toObject();
        const updatedContract = await Contract_js_1.Contract.findByIdAndUpdate(id, {
            employeeId: employeeId?.trim() ?? contract.employeeId,
            contractType: contractType ?? contract.contractType,
            temporaryType: temporaryType ?? contract.temporaryType,
            workdayType: workdayType ?? contract.workdayType,
            salaryType: salaryType ?? contract.salaryType,
            salaryAmount: salaryAmount ?? contract.salaryAmount,
            startDate: startDate ?? contract.startDate,
            endDate: endDate ?? contract.endDate,
            department: department?.trim() ?? contract.department,
            category: category?.trim() ?? contract.category,
            position: position?.trim() ?? contract.position,
            status: status ?? contract.status
        }, { new: true });
        // ← AGREGAR AUDITORÍA
        await (0, auditService_js_1.createAuditLog)(req.user._id.toString(), req.user.name, "UPDATE", "CONTRACT", updatedContract?._id.toString(), updatedContract?.position, req, { before, after: req.body }, `Contrato ${updatedContract?.position} actualizado`);
        res.status(200).json(updatedContract);
    }
    catch (error) {
        next(error);
    }
};
exports.updateContract = updateContract;
const updateStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const contract = await Contract_js_1.Contract.findById(id);
        if (!contract) {
            res.status(404).json({ message: "Contract not found" });
            return;
        }
        const oldStatus = contract.status;
        const updatedContract = await Contract_js_1.Contract.findByIdAndUpdate(id, { status: status ?? contract.status }, { new: true });
        // ← AGREGAR AUDITORÍA
        await (0, auditService_js_1.createAuditLog)(req.user._id.toString(), req.user.name, "STATUS_CHANGE", "CONTRACT", updatedContract?._id.toString(), updatedContract?.position, req, { before: { status: oldStatus }, after: { status: updatedContract?.status } }, `Estado del contrato ${updatedContract?.position} cambió de ${oldStatus} a ${updatedContract?.status}`);
        res.status(200).json(updatedContract);
    }
    catch (error) {
        next(error);
    }
};
exports.updateStatus = updateStatus;
const getContractsPending = async (req, res, next) => {
    try {
        const contracts = await Contract_js_1.Contract.find({ status: "PENDIENTE" }).populate("employeeId");
        if (contracts.length === 0) {
            res.status(404).json({ message: "There aren´t any PENDING contract" });
            return;
        }
        res.status(200).json(contracts);
    }
    catch (error) {
        next(error);
    }
};
exports.getContractsPending = getContractsPending;
//# sourceMappingURL=contractController.js.map