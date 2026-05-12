"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Contract = exports.contractSchema = void 0;
const mongodb_1 = require("mongodb");
const mongoose_1 = require("mongoose");
exports.contractSchema = new mongoose_1.Schema({
    employeeId: {
        type: mongoose_1.Types.ObjectId,
        ref: "Employee",
        required: true
    },
    contractType: {
        type: String,
        required: true,
        enum: ["Indefinido", "Prácticas", "Formación", "Eventual"],
    },
    temporaryType: {
        type: String,
        default: null
    },
    workdayType: {
        type: String,
        required: true,
        enum: ["Completa", "Parcial"],
    },
    salaryType: {
        type: String,
        required: true,
        enum: ["Bruto", "Neto"],
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
    status: {
        type: String,
        enum: ["PENDIENTE", "APROBADO", "RECHAZADO", "FINALIZADO"],
        default: "PENDIENTE"
    },
}, {
    timestamps: true,
    virtuals: {
        id: {
            get() {
                return this._id.toString();
            },
            set(value) {
                this._id = new mongodb_1.ObjectId;
            }
        }
    },
    toJSON: {
        virtuals: true,
        transform: (doc, ret) => {
            delete ret._id;
            delete ret.__v;
        }
    },
    toObject: {
        virtuals: true,
        transform: (doc, ret) => {
            delete ret._id;
            delete ret.__v;
        }
    }
});
exports.Contract = (0, mongoose_1.model)("Contracts", exports.contractSchema, "contracts");
//# sourceMappingURL=Contract.js.map