"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongooseConnection = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const config_js_1 = require("./config.js");
exports.MongooseConnection = {
    connect: async () => {
        try {
            await mongoose_1.default.connect(config_js_1.mongoConfig.getUri(), {});
            console.log("Connected to MongoDB");
        }
        catch (error) {
            console.error("Error connecting to MongoDB: ", error);
        }
    },
    disconnect: async () => {
        await mongoose_1.default.disconnect();
    }
};
//# sourceMappingURL=mongoose.js.map