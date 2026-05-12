"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Employee = exports.employeeSchema = void 0;
const mongodb_1 = require("mongodb");
const mongoose_1 = require("mongoose");
exports.employeeSchema = new mongoose_1.Schema({
    name: { type: String, trim: true },
    surname: { type: String, trim: true },
    nif: { type: String, trim: true },
    city: String,
    province: String,
    country: String,
    email: { type: String, trim: true, unique: true, lowercase: true },
    phone: { type: String, trim: true },
}, {
    timestamps: true,
    virtuals: {
        id: {
            get() {
                return this._id.toString();
            },
            set(_value) {
                this._id = new mongodb_1.ObjectId();
            }
        }
    },
    toJSON: {
        virtuals: true,
        transform: (_doc, ret) => {
            delete ret._id;
            delete ret.__v;
        }
    },
    toObject: {
        virtuals: true,
        transform: (_doc, ret) => {
            delete ret._id;
            delete ret.__v;
        }
    }
});
exports.Employee = (0, mongoose_1.model)("Employee", exports.employeeSchema, "employees");
//# sourceMappingURL=Employee.js.map