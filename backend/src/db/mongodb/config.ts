import dotenv from "dotenv";

dotenv.config();

export const mongoConfig = {
    uri: process.env.MONGO_URI,
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || "27017",
    dbName: process.env.DB_NAME || "gestion_empleados",
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,

    getUri: function () {
        if (this.uri) return this.uri;
        if (this.user && this.password) {
            return `mongodb://${this.user}:${this.password}@${this.host}:${this.port}/${this.dbName}`;
        }
        return `mongodb://${this.host}:${this.port}/${this.dbName}`;
    }
}