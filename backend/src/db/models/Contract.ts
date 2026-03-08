import { ObjectId } from "mongodb";
import { model, Schema, Types } from "mongoose";

export const contractSchema = new Schema(
    {
        employeeId: {
            type: Types.ObjectId,
            ref: "Employee",
            required: true
        },
        status: {
            type: String,
            enum: ["PENDIENTE", "ACTIVO", "FINALIZADO"],
            default: "PENDIENTE"
        },
        contractType: {
            type: String,
            required: true,
            enum: [ "Indefinido", "Prácticas", "Formación", "Eventual" ],
        },
        temporaryType: {
            type: String,
            default: null
        },
        workdayType: {
            type: String,
            required: true,
            enum: [ "Completa", "Parcial" ],
        },
        salaryType: {
            type: String,
            required: true,
            enum: [ "Bruto", "Neto" ],
        },
        salaryAmount: {
            type: Number,
            required: true,
            min: 0,
        },
        startDate: {
            type: Date,
            required: true,
        },
        endDate: {
            type: Date,
            default: null,
        },
        department: {
            type: String,
            required: true,
            trim: true,
        },
        category: {
            type: String,
            required: true,
            trim: true,
        },
        position: {
            type: String,
            required: true,
            trim: true,
        },
    },
    {
        timestamps: true,
        virtuals: {
            id: {
                get() {
                    return this._id.toString();
                },
                set(value: string) {
                    this._id = new ObjectId;
                }
            }
        },
        toJSON: {
            virtuals: true,
            transform: (doc, ret) => {
                delete (ret as Partial<typeof ret>)._id;
                delete (ret as Partial<typeof ret>).__v;
            }
        },
        toObject: {
            virtuals: true,
            transform: (doc, ret) => {
                delete (ret as Partial<typeof ret>)._id;
                delete (ret as Partial<typeof ret>).__v;
            }
        }
    }
);

export const Contract = model("Contracts", contractSchema, "contracts");