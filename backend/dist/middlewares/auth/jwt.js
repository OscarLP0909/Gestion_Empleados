"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureAuthenticated = exports.jwtStrategy = exports.withToken = void 0;
const passport_jwt_1 = require("passport-jwt");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const passport_1 = __importDefault(require("passport"));
const dotenv_1 = __importDefault(require("dotenv"));
const user_js_1 = require("../../db/models/user.js");
dotenv_1.default.config();
const jwtSecret = process.env.JWT_SECRET;
const withToken = (data) => {
    const plainData = data instanceof Object && data.toObject ? data.toObject() : data;
    const token = jsonwebtoken_1.default.sign({
        _id: plainData._id || plainData.id,
        email: plainData.email,
        role: plainData.role || "EMPLOYEE",
    }, jwtSecret, { expiresIn: "7d" });
    return {
        ...plainData,
        token,
    };
};
exports.withToken = withToken;
const strategyName = "jwt";
exports.jwtStrategy = {
    name: strategyName,
    strategy: new passport_jwt_1.Strategy({
        // Indica dónde obtener el token de la request
        jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
        // Secret para verificar la firma del token
        secretOrKey: jwtSecret,
    }, async (jwt_payload, done) => {
        // Este callback se ejecuta para cada request
        // Verifica que el usuario esté autenticado
        try {
            const user = await user_js_1.User.findById(jwt_payload._id).select("-password");
            if (!user) {
                return done(null, false);
            }
            // Asegurarse de que el user tiene el role
            // (en caso de que la BD no lo tenga)
            if (!user.role) {
                user.role = "EMPLOYEE";
            }
            return done(null, user);
        }
        catch (error) {
            return done(error, false);
        }
    }),
};
exports.ensureAuthenticated = passport_1.default.authenticate(exports.jwtStrategy.name, {
    session: false,
});
//# sourceMappingURL=jwt.js.map