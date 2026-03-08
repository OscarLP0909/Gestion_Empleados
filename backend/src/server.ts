import dotenv from 'dotenv';
import { MongooseConnection } from './db/mongodb/mongoose.js';
import app from './index.js';

dotenv.config();

const PORT = process.env.PORT;

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