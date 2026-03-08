import dotenv from "dotenv";

dotenv.config();


export const mongoConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    dbName: process.env.DB_NAME,
    connectionOptions: {
        retryWrites: "true",
        w: "majority",
        appName: "Cluster0",
    },

    getUri: function () {
        const urlParams = new URLSearchParams(this.connectionOptions);
        const isAtlas = this.host?.includes('mongodb.net') ?? false;

        if(isAtlas) {
            return `mongodb+srv://${this.user}:${this.password}@${this.host}/${this.dbName}?${urlParams}`;
        } else {
            return `mongodb://${this.host}/${this.dbName}?${urlParams}`;
        }
    }

}