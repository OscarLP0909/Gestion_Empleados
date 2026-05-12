"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditLog = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const auditLogSchema = new mongoose_1.default.Schema({
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    userName: String, // Copiar nombre para no perder auditoría si se elimina usuario
    action: {
        type: String,
        enum: ["CREATE", "UPDATE", "DELETE", "STATUS_CHANGE", "ROLE_CHANGE"],
        required: true,
    },
    entityType: {
        type: String,
        enum: ["EMPLOYEE", "CONTRACT", "USER"],
        required: true,
    },
    entityId: mongoose_1.default.Schema.Types.ObjectId,
    entityName: String, // Nombre del empleado/usuario afectado
    changes: {
        before: mongoose_1.default.Schema.Types.Mixed, // Datos antes del cambio
        after: mongoose_1.default.Schema.Types.Mixed, // Datos después del cambio
    },
    ipAddress: String,
    userAgent: String,
    description: String, // Descripción legible de la acción
    createdAt: {
        type: Date,
        default: Date.now,
        index: true,
    },
}, { timestamps: false });
exports.AuditLog = mongoose_1.default.model("AuditLog", auditLogSchema);
//# sourceMappingURL=AuditLog.js.map