"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupPassport = void 0;
const passport_1 = __importDefault(require("passport"));
const local_js_1 = require("../middlewares/auth/local.js");
const jwt_js_1 = require("../middlewares/auth/jwt.js");
let initialized = false;
const setupPassport = () => {
    if (initialized)
        return;
    passport_1.default.use(local_js_1.localStrategy.name, local_js_1.localStrategy.strategy);
    passport_1.default.use(jwt_js_1.jwtStrategy.name, jwt_js_1.jwtStrategy.strategy);
    initialized = true;
};
exports.setupPassport = setupPassport;
exports.default = passport_1.default;
//# sourceMappingURL=passport.js.map