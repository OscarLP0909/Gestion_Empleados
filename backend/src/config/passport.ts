import passport from "passport";
import { localStrategy } from "../middlewares/auth/local.js";
import { jwtStrategy } from "../middlewares/auth/jwt.js";

let initialized = false;

export const setupPassport = () => {
    if (initialized) return;
    passport.use(localStrategy.name, localStrategy.strategy);
    passport.use(jwtStrategy.name, jwtStrategy.strategy);
    initialized = true;
};

export default passport;