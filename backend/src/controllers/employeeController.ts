import type { NextFunction, Request, Response } from "express";
import { Employee } from "../db/models/Employee.js";
import { Types } from "mongoose";

export const createEmployee = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, surname, nif, address, email, phone, hireDate } = req.body;

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

        const exists = await Employee.findOne({ $or: [{ email }, { nif }] });
        if (exists) {
            res.status(409).json({ message: "Employee with this email or NIF already exists" });
            return;
        }

        const employee = new Employee({
            name: name.trim(),
            surname: surname.trim(),
            nif: nif.trim(),
            address,
            email: email.trim().toLowerCase(),
            phone,
            hireDate
        });
        await employee.save();
        return res.status(201).json(employee);

    } catch (error) {
        next(error);
    }
};

export const getEmployees = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const employees = await Employee.find();
        res.status(200).send(employees);
    } catch (error) {
        next(error);
    }
};

export const getEmployeeById = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        const employee = await Employee.findById(id);
        
        if(!employee) {
            res.status(404).json({message: "Employee not found"});
            return;
        }
        return res.status(200).json(employee);
    } catch (error) {
        next(error);
    }
};

export const getEmployeeByNif = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const { nif } = req.params;

        if (typeof(nif) !== "string" || nif === "") {
            res.status(400).json({message: "NIF has to be a string"});
            return;
        }
        const employee = await Employee.findOne({nif});

        if (!employee) {
            res.status(404).json({message: "Employee not found"});
            return;
        }
        return res.status(200).json(employee);
    } catch (error) {
        next(error);
    }
};

export const updateEmployee = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { name, surname, nif, address, email, phone } = req.body;

        const employee = await Employee.findById(id);
        if (!employee) {
            res.status(404).json({ message: "Employee not found" });
            return;
        }

        // Verificar si el email o NIF ya existen en otro empleado
        if (email || nif) {
            const existingEmployee = await Employee.findOne({
                $or: [{ email }, { nif }],
                _id: { $ne: id }
            });
            if (existingEmployee) {
                res.status(409).json({ message: "Email or NIF already in use by another employee" });
                return;
            }
        }

        const updatedEmployee = await Employee.findByIdAndUpdate(
            id,
            {
                name: name?.trim() ?? employee.name,
                surname: surname?.trim() ?? employee.surname,
                nif: nif?.trim() ?? employee.nif,
                address: address ?? employee.address,
                email: email?.trim().toLowerCase() ?? employee.email,
                phone: phone ?? employee.phone
            },
            { new: true }
        );

        res.status(200).json(updatedEmployee);
    } catch (error) {
        next(error);
    }
};

export const deleteEmployee = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        const employee = await Employee.findByIdAndDelete(id);

        if (!employee) {
            res.status(404).json({ message: "Employee not found" });
            return;
        }

        res.status(200).json({ message: "Employee deleted successfully" });
    } catch (error) {
        next(error);
    }
};

