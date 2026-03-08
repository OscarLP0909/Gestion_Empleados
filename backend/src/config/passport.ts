import passport from "passport";
import { localStrategy } from "../middlewares/auth/local.js";
import { jwtStrategy } from "../middlewares/auth/jwt.js";

export const setupPassport = () => {
passport.use(localStrategy.name, localStrategy.strategy);
passport.use(jwtStrategy.name, jwtStrategy.strategy);
};