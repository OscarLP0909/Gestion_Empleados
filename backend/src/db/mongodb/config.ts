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
            const shards = [
                'ac-yhleppa-shard-00-00.lsqgev1.mongodb.net:27017',
                'ac-yhleppa-shard-00-01.lsqgev1.mongodb.net:27017',
                'ac-yhleppa-shard-00-02.lsqgev1.mongodb.net:27017'
            ].join(',');
            return `mongodb://${this.user}:${this.password}@${shards}/${this.dbName}?ssl=true&replicaSet=atlas-ofimyz-shard-0&authSource=admin&retryWrites=true&w=majority`;
        } else {
            return `mongodb://${this.host}/${this.dbName}?${urlParams}`;
        }
    }

}