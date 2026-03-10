import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcrypt";
import { User } from "../../db/models/user.js";

export const localStrategy = {
    name: "local",
    strategy: new LocalStrategy(
        { usernameField: "email", passwordField: "password" },
        async (email, password, done) => {
            try {
                const user = await User.findOne({ email }).select("+password").lean();
                if (!user || !user.password) {
                    return done(null, false);
                }

                const isValid = await bcrypt.compare(password, user.password);
                if (!isValid) {
                    return done(null, false);
                }

                const { password: _password, ...safeUser } = user;
                return done(null, safeUser as any);
            } catch (error) {
                return done(error as Error);
            }
        }
    ),
};