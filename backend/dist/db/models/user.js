"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = exports.userSchema = void 0;
const mongoose_1 = require("mongoose");
const mongodb_1 = require("mongodb");
const bcrypt_1 = __importDefault(require("bcrypt"));
exports.userSchema = new mongoose_1.Schema({
    email: { type: String, required: true },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ["ADMIN", "HR_MANAGER", "MANAGER", "EMPLOYEE"], default: "EMPLOYEE", required: true },
    isActive: { type: Boolean, default: true },
    name: { type: String },
}, {
    virtuals: {
        id: {
            get() {
                return this._id.toString();
            },
            set(value) {
                this._id = new mongodb_1.ObjectId(value);
            },
        },
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
exports.userSchema.pre("save", async function () {
    if (!this.isModified("password"))
        return;
    try {
        const salt = await bcrypt_1.default.genSalt(10);
        this.password = await bcrypt_1.default.hash(this.password, salt);
    }
    catch (error) {
        throw error;
    }
});
exports.userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt_1.default.compare(candidatePassword, this.password);
};
exports.User = (0, mongoose_1.model)("User", exports.userSchema, "users");
//# sourceMappingURL=user.js.map