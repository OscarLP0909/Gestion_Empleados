import { Contract } from "../db/models/Contract.js";

export const updateContractStatus = async () => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);

        // Buscar contratos APROBADO que empiezan hoy
        const result = await Contract.updateMany(
            {
                status: "APROBADO",
                startDate: {
                    $gte: today,
                    $lt: tomorrow
                }
            },
            { status: "ACTIVO" }
        );

        if (result.modifiedCount > 0) {
            console.log(`✅ ${result.modifiedCount} contrato(s) actualizado(s) a ACTIVO`);
        }
    } catch (error) {
        console.error("❌ Error updating contract status:", error);
    }
};