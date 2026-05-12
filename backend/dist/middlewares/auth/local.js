"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.localStrategy = void 0;
const passport_local_1 = require("passport-local");
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_js_1 = require("../../db/models/user.js");
exports.localStrategy = {
    name: "local",
    strategy: new passport_local_1.Strategy({ usernameField: "email", passwordField: "password" }, async (email, password, done) => {
        try {
            console.log("🔍 Buscando usuario:", email);
            const user = await user_js_1.User.findOne({ email }).select("+password");
            if (!user || !user.password) {
                console.log("❌ Usuario no encontrado o sin contraseña");
                return done(null, false);
            }
            console.log("✅ Usuario encontrado");
            console.log("📝 Password enviada:", password);
            console.log("📝 Password en BD:", user.password);
            console.log("📝 Tipo de password en BD:", typeof user.password);
            console.log("📝 Longitud password enviada:", password.length);
            console.log("📝 Longitud password en BD:", user.password.length);
            const isValid = await bcrypt_1.default.compare(password, user.password);
            console.log("🔐 ¿Contraseña válida?:", isValid);
            if (!isValid) {
                console.log("❌ Contraseña inválida");
                return done(null, false);
            }
            console.log("✅ Login exitoso!");
            return done(null, user);
        }
        catch (error) {
            console.error("❌ Error en estrategia local:", error);
            return done(error);
        }
    }),
};
//# sourceMappingURL=local.js.map