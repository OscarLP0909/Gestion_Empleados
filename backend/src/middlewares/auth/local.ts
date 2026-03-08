import { Strategy, type IStrategyOptionsWithRequest } from "passport-local";
import { User } from "../../db/models/user.js";
import bcrypt from "bcrypt";

// Options object, we tell Passport what fields are the ones to use as
// username and password fields, in this case, email and password
const strategyOptions: IStrategyOptionsWithRequest = {
    passReqToCallback: true,
    usernameField: "email",
    passwordField: "password",
    session: false,
};

const strategyName = "local";

export const localStrategy = {
    name: strategyName,
    strategy: new Strategy(
        strategyOptions,
        async (req, email, password, done) => {
            let user;
            try {
                user = await User.findOne({ email }).select("+password");
                if (!user) {
                    return done(null, false, { message: "Wrong credentials" });
                }

                const ok = await bcrypt.compare(password, user.password);
                if (!ok) {
                    return done(null, false, { message: "Wrong credentials" });
                }
                const safeUser = user.toObject();
                delete (safeUser as any).password;

                return done(null, safeUser);
            } catch (error) {
                return done(error);
            }
        }
    )
}