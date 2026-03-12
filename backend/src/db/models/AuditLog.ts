import mongoose from "mongoose";
 
const auditLogSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
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
        entityId: mongoose.Schema.Types.ObjectId,
        entityName: String, // Nombre del empleado/usuario afectado
        changes: {
            before: mongoose.Schema.Types.Mixed, // Datos antes del cambio
            after: mongoose.Schema.Types.Mixed, // Datos después del cambio
        },
        ipAddress: String,
        userAgent: String,
        description: String, // Descripción legible de la acción
        createdAt: {
            type: Date,
            default: Date.now,
            index: true,
        },
    },
    { timestamps: false }
);
 
export const AuditLog = mongoose.model("AuditLog", auditLogSchema);