import { Contract } from "../db/models/Contract.js";

export const updateContractStatus = async () => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);

        // ============================================
        // 1. APROBADO → ACTIVO (cuando llega la fecha de inicio)
        // ============================================
        const resultActivate = await Contract.updateMany(
            {
                status: "APROBADO",
                startDate: {
                    $gte: today,
                    $lt: tomorrow
                }
            },
            { status: "ACTIVO" }
        );

        if (resultActivate.modifiedCount > 0) {
            console.log(`✅ ${resultActivate.modifiedCount} contrato(s) activado(s) (APROBADO → ACTIVO)`);
        }

        // ============================================
        // 2. ACTIVO → FINALIZADO (cuando llega la fecha de fin)
        // ============================================
        const resultFinalize = await Contract.updateMany(
            {
                status: "ACTIVO",
                endDate: {
                    $gte: today,
                    $lt: tomorrow,
                    $exists: true
                }
            },
            { status: "FINALIZADO" }
        );

        if (resultFinalize.modifiedCount > 0) {
            console.log(`✅ ${resultFinalize.modifiedCount} contrato(s) finalizado(s) (ACTIVO → FINALIZADO)`);
        }

        if (resultActivate.modifiedCount === 0 && resultFinalize.modifiedCount === 0) {
            console.log("ℹ️ No hay contratos para actualizar");
        }
    } catch (error) {
        console.error("❌ Error updating contract status:", error);
    }
};