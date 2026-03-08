import { MongoClient, ServerApiVersion } from "mongodb";
import { mongoConfig } from "./config.js";

const client = new MongoClient(mongoConfig.getUri(), {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
});

if (require.main === module && process.argv.includes("--test")) {
    async function main () {
        try {
            await client.connect();
            console.log("Connected successfully to MongoDB");
            const dbs = await client.db().admin().listDatabases();
            console.log("Databases: ", dbs.databases);
        } catch (error) {
            console.error("Failed to connect: ", error);
        } finally {
            await client.close();
        }
    }

    main().catch(console.error);
}