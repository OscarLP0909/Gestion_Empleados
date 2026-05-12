"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const passport_1 = __importDefault(require("passport"));
const passport_js_1 = require("./config/passport.js");
const authRouter_js_1 = __importDefault(require("./routes/authRouter.js"));
const cors_1 = __importDefault(require("cors"));
const employeeRouter_js_1 = __importDefault(require("./routes/employeeRouter.js"));
const contractRouter_js_1 = __importDefault(require("./routes/contractRouter.js"));
const userRouter_js_1 = __importDefault(require("./routes/userRouter.js"));
const auditRouter_js_1 = __importDefault(require("./routes/auditRouter.js"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(passport_1.default.initialize());
(0, passport_js_1.setupPassport)();
app.use((0, cors_1.default)({
    origin: ["http://localhost:5173", "http://localhost:4200", /^http:\/\/localhost:\d+$/],
    credentials: true,
}));
// const authLimiter = rateLimit({
//     windowMs: 15*60*1000,
//     max: 10,
//     message: { message: "Demasiados intentos, espera 15 minutos" },
//     standardHeaders: true,
//     legacyHeaders: false,
// });
// const generalLimiter = rateLimit({
//     windowMs: 15 * 60 * 1000,
//     max: 10,
//     message: { message: "Demasiados intentos, espera un momento" },
//     standardHeaders: true,
//     legacyHeaders: false,
// });
app.use((0, helmet_1.default)());
// app.use(generalLimiter);
/// Rutas
app.use("/auth", authRouter_js_1.default);
app.use("/employee", employeeRouter_js_1.default);
app.use("/contract", contractRouter_js_1.default);
app.use("/user", userRouter_js_1.default);
app.use("/audit", auditRouter_js_1.default);
exports.default = app;
//# sourceMappingURL=index.js.map