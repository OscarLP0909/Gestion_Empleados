import type { NextFunction, Request, Response } from "express";
import { Types } from "mongoose";
import { Contract } from "../db/models/Contract.js";
import { Employee } from "../db/models/Employee.js";
import { createAuditLog } from "../services/auditService.js";

export const createContract = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { employeeId, contractType, temporaryType, workdayType, salaryType, salaryAmount, startDate, endDate, department, category, position, status } = req.body;

        const employee = await Employee.findById(employeeId);
        if (!employee) {
            res.status(404).json({ message: "Employee not found" });
            return;
        }

        if (!contractType || !workdayType || !salaryType || salaryAmount === undefined || !startDate || !department?.trim() || !category?.trim() || !position?.trim()) {
            res.status(400).json({ message: "Missing required fields" });
            return;
        }

        let initialStatus = status || "PENDIENTE";
        if (initialStatus === "APROBADO") {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const start = new Date(startDate);
            start.setHours(0, 0, 0, 0);
            if (start <= today) initialStatus = "ACTIVO";
        }

        const contract = new Contract({
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
            status: initialStatus
        });

        await contract.save();

        // ← AGREGAR AUDITORÍA
        await createAuditLog(
            (req as any).user._id.toString(),
            (req as any).user.name,
            "CREATE",
            "CONTRACT",
            contract._id.toString(),
            `${position.trim()} - ${employee.name} ${employee.surname}`,
            req,
            { after: req.body },
            `Contrato ${position.trim()} para ${employee.name} ${employee.surname} creado`
        );

        res.status(201).json(contract);

    } catch (error) {
        next(error);
    }
};

export const getContracts = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const contracts = await Contract.find().populate("employeeId", "name surname nif email");
        res.status(200).json(contracts);
    } catch (error) {
        next(error);
    }
};

export const getContractById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const contract = await Contract.findById(id).populate("employeeId", "name surname nif email");
        if (!contract) {
            res.status(404).json({ message: "Contract not found" });
            return;
        }
        return res.status(200).json(contract);
    } catch (error) {
        next(error);
    }
};

export const deleteContract = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const contract = await Contract.findById(id);
        if (!contract) {
            res.status(404).json({ message: "Contract not found" });
            return;
        }

        // ← AGREGAR AUDITORÍA
        await createAuditLog(
            (req as any).user._id.toString(),
            (req as any).user.name,
            "DELETE",
            "CONTRACT",
            contract._id.toString(),
            contract.position as string | undefined,
            req,
            { before: contract.toObject() },
            `Contrato ${contract.position} eliminado`
        );

        await Contract.findByIdAndDelete(id);
        return res.status(200).json({ message: "Contract deleted successfully" });
    } catch (error) {
        next(error);
    }
};

export const getContractsOfEmployee = async (
    req: Request<{ employeeId?: string | string[] }>,
    res: Response,
    next: NextFunction
) => {
    try {
        const rawEmployeeId = req.params.employeeId;
        const employeeId = Array.isArray(rawEmployeeId) ? rawEmployeeId[0] : rawEmployeeId;

        if (!employeeId || !Types.ObjectId.isValid(employeeId)) {
            res.status(400).json({ message: "Invalid employeeId" });
            return;
        }

        const contracts = await Contract.find({ employeeId: new Types.ObjectId(employeeId) });
        if (contracts.length === 0) {
            res.status(404).json({ message: "The Employee doesn't have any Contract" });
            return;
        }
        res.status(200).json(contracts);
    } catch (error) {
        next(error);
    }
};

export const getContractActiveOfEmployee = async (
    req: Request<{ employeeId?: string | string[] }>,
    res: Response,
    next: NextFunction
) => {
    try {
        const rawEmployeeId = req.params.employeeId;
        const employeeId = Array.isArray(rawEmployeeId) ? rawEmployeeId[0] : rawEmployeeId;

        if (!employeeId || !Types.ObjectId.isValid(employeeId)) {
            res.status(400).json({ message: "Invalid employeeId" });
            return;
        }

        const contract = await Contract.find({
            employeeId: new Types.ObjectId(employeeId),
            status: "ACTIVO"
        });

        if (contract.length === 0) {
            res.status(404).json({ message: "This Employee doesn't have an active contract" });
            return;
        }

        res.status(200).json(contract);
    } catch (error) {
        next(error);
    }
};

export const updateContract = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { employeeId, contractType, temporaryType, workdayType, salaryType, salaryAmount, startDate, endDate, department, category, position, status } = req.body;

        const contract = await Contract.findById(id);
        if (!contract) {
            res.status(404).json({ message: "Contract not found" });
            return;
        }

        // Guardar datos antes del cambio para auditoría
        const before = contract.toObject();

        const updatedContract = await Contract.findByIdAndUpdate(
            id,
            {
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
            },
            { new: true }
        );

        // ← AGREGAR AUDITORÍA
        await createAuditLog(
            (req as any).user._id.toString(),
            (req as any).user.name,
            "UPDATE",
            "CONTRACT",
            updatedContract?._id.toString(),
            (updatedContract?.position as string | undefined),
            req,
            { before, after: req.body },
            `Contrato ${updatedContract?.position} actualizado`
        );

        res.status(200).json(updatedContract);
    } catch (error) {
        next(error);
    }
};

export const updateStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const contract = await Contract.findById(id);
        if (!contract) {
            res.status(404).json({ message: "Contract not found" });
            return;
        }

        const oldStatus = contract.status;

        let finalStatus = status ?? contract.status;
        if (finalStatus === "APROBADO") {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const start = new Date(contract.startDate as string);
            start.setHours(0, 0, 0, 0);
            if (start <= today) finalStatus = "ACTIVO";
        }

        const updatedContract = await Contract.findByIdAndUpdate(
            id,
            { status: finalStatus },
            { new: true }
        );

        // ← AGREGAR AUDITORÍA
        await createAuditLog(
            (req as any).user._id.toString(),
            (req as any).user.name,
            "STATUS_CHANGE",
            "CONTRACT",
            updatedContract?._id.toString(),
            (updatedContract?.position as string | undefined),
            req,
            { before: { status: oldStatus }, after: { status: updatedContract?.status } },
            `Estado del contrato ${updatedContract?.position} cambió de ${oldStatus} a ${updatedContract?.status}`
        );

        res.status(200).json(updatedContract);
    } catch (error) {
        next(error);
    }
};

export const getContractsPending = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const contracts = await Contract.find({ status: "PENDIENTE" }).populate("employeeId");
        if (contracts.length === 0) {
            res.status(404).json({ message: "There aren´t any PENDING contract" });
            return;
        }
        res.status(200).json(contracts);
    } catch (error) {
        next(error);
    }
};