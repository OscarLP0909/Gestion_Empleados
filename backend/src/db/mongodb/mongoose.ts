import mongoose from "mongoose"
import { mongoConfig } from "./config.js"

export const MongooseConnection = {
    connect: async () => {
        try {
            await mongoose.connect(mongoConfig.getUri(), {});
            console.log("Connected to MongoDB");
        } catch (error) {
            console.error("Error connecting to MongoDB: ", error);
        }
    },
    disconnect: async () => {
        await mongoose.disconnect();
    }
}