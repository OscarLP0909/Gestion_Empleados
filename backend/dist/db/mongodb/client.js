"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
const config_js_1 = require("./config.js");
const client = new mongodb_1.MongoClient(config_js_1.mongoConfig.getUri(), {
    serverApi: {
        version: mongodb_1.ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
});
if (require.main === module && process.argv.includes("--test")) {
    async function main() {
        try {
            await client.connect();
            console.log("Connected successfully to MongoDB");
            const dbs = await client.db().admin().listDatabases();
            console.log("Databases: ", dbs.databases);
        }
        catch (error) {
            console.error("Failed to connect: ", error);
        }
        finally {
            await client.close();
        }
    }
    main().catch(console.error);
}
//# sourceMappingURL=client.js.map