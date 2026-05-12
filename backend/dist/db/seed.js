"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const config_js_1 = require("./mongodb/config.js");
const user_js_1 = require("./models/user.js");
const Employee_js_1 = require("./models/Employee.js");
const Contract_js_1 = require("./models/Contract.js");
dotenv_1.default.config();
const employees = [
    { name: "Juan", surname: "García López", nif: "12345678A", email: "juan.garcia@empresa.com", phone: "600123456", city: "Madrid", province: "Madrid", country: "España" },
    { name: "María", surname: "López García", nif: "87654321B", email: "maria.lopez@empresa.com", phone: "600234567", city: "Barcelona", province: "Barcelona", country: "España" },
    { name: "Carlos", surname: "Martínez Ruiz", nif: "11111111C", email: "carlos.martinez@empresa.com", phone: "600345678", city: "Valencia", province: "Valencia", country: "España" },
    { name: "Ana", surname: "Rodríguez Santos", nif: "22222222D", email: "ana.rodriguez@empresa.com", phone: "600456789", city: "Sevilla", province: "Sevilla", country: "España" },
    { name: "Pedro", surname: "Sánchez López", nif: "33333333E", email: "pedro.sanchez@empresa.com", phone: "600567890", city: "Bilbao", province: "Vizcaya", country: "España" },
];
const contractData = [
    { index: 0, contractType: "Indefinido", workdayType: "Completa", salaryType: "Bruto", salaryAmount: 3500, department: "Tecnología", category: "Senior Developer", position: "Desarrollador Backend" },
    { index: 1, contractType: "Indefinido", workdayType: "Completa", salaryType: "Bruto", salaryAmount: 3200, department: "Ventas", category: "Gerente de Ventas", position: "Representante de Ventas" },
    { index: 2, contractType: "Eventual", workdayType: "Completa", salaryType: "Bruto", salaryAmount: 2200, department: "Tecnología", category: "Junior Developer", position: "Desarrollador Frontend" },
    { index: 3, contractType: "Indefinido", workdayType: "Completa", salaryType: "Bruto", salaryAmount: 2800, department: "Ventas", category: "Ejecutivo de Ventas", position: "Ejecutivo de Cuentas" },
    { index: 4, contractType: "Indefinido", workdayType: "Completa", salaryType: "Bruto", salaryAmount: 2600, department: "Recursos Humanos", category: "Especialista Senior", position: "Especialista en RRHH" },
];
async function seed() {
    await mongoose_1.default.connect(config_js_1.mongoConfig.getUri());
    console.log("Conectado a MongoDB");
    // --- Usuarios ---
    const userCount = await user_js_1.User.countDocuments();
    if (userCount === 0) {
        await user_js_1.User.create({
            name: "Admin",
            email: "admin@gestion-empleados.com",
            password: "Admin1234!",
            role: "ADMIN",
            isActive: true,
        });
        console.log("Usuario admin creado  →  admin@gestion-empleados.com / Admin1234!");
    }
    else {
        console.log(`Usuarios: ${userCount} ya existentes, omitido`);
    }
    // --- Empleados ---
    const employeeCount = await Employee_js_1.Employee.countDocuments();
    if (employeeCount === 0) {
        const inserted = await Employee_js_1.Employee.insertMany(employees);
        console.log(`${inserted.length} empleados insertados`);
        // --- Contratos ---
        const contractDocs = contractData.map(({ index, ...fields }) => ({
            ...fields,
            employeeId: inserted[index]._id,
            startDate: new Date("2026-03-24"),
            status: "APROBADO",
        }));
        await Contract_js_1.Contract.insertMany(contractDocs);
        console.log(`${contractDocs.length} contratos insertados`);
    }
    else {
        console.log(`Empleados: ${employeeCount} ya existentes, omitido`);
    }
    await mongoose_1.default.disconnect();
    console.log("Seed completado");
}
seed().catch((err) => {
    console.error(err);
    process.exit(1);
});
//# sourceMappingURL=seed.js.map