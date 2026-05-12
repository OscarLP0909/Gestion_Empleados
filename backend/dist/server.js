"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_js_1 = require("./db/mongodb/mongoose.js");
const index_js_1 = __importDefault(require("./index.js"));
const contractStatusJob_js_1 = require("./jobs/contractStatusJob.js");
dotenv_1.default.config();
const PORT = process.env.PORT;
setInterval(contractStatusJob_js_1.updateContractStatus, 24 * 60 * 60 * 1000); // Se ejecuta diariamente a las 00
setInterval(contractStatusJob_js_1.updateContractStatus, 60 * 60 * 1000); // Se ejecuta cada hora
(0, contractStatusJob_js_1.updateContractStatus)();
async function startServer() {
    try {
        await mongoose_js_1.MongooseConnection.connect();
        index_js_1.default.listen(PORT, () => {
            console.log(`Servidor corriendo en el puerto ${PORT}`);
        });
    }
    catch (error) {
        console.error('Error al inciar el servidor: ', error);
        process.exit(1);
    }
}
startServer();
//# sourceMappingURL=server.js.map