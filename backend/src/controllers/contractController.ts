import type { NextFunction, Request, Response } from "express";
import { Types } from "mongoose";
import { Contract } from "../db/models/Contract.js";
import { Employee } from "../db/models/Employee.js";

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
            status: status || "PENDIENTE"
        });

        await contract.save();
        res.status(201).json(contract);

    } catch (error) {
        next(error);
    }
};

export const getContracts = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const contracts = await Contract.find();
        res.status(200).json(contracts);
    } catch (error) {
        next(error);
    }
};

export const getContractById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const contract = await Contract.findById(id);
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
        const contract = await Contract.findByIdAndDelete(id);
        if (!contract) {
            res.status(404).json({ message: "Contract not found" });
            return;
        }
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

        const updatedContract = await Contract.findByIdAndUpdate(
            id,
            { status: status ?? contract.status },
            { new: true }  
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