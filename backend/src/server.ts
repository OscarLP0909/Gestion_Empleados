import dotenv from 'dotenv';
import { MongooseConnection } from './db/mongodb/mongoose.js';
import app from './index.js';
import { updateContractStatus } from "./jobs/contractStatusJob.js";

dotenv.config();

const PORT = process.env.PORT;


setInterval(updateContractStatus, 24 * 60 * 60 * 1000); // Se ejecuta diariamente a las 00
setInterval(updateContractStatus, 60 * 60 * 1000); // Se ejecuta cada hora
updateContractStatus();


async function startServer() {
    try {
        await MongooseConnection.connect();
        app.listen(PORT, () => {
            console.log(`Servidor corriendo en el puerto ${PORT}`);
        });
    } catch (error) {
        console.error('Error al inciar el servidor: ', error);
        process.exit(1);
    }
}

startServer();