import { Strategy, ExtractJwt } from "passport-jwt";
import type { VerifiedCallback } from "passport-jwt";
import jwt, { type JwtPayload } from "jsonwebtoken";
import passport from "passport";
import dotenv from "dotenv";
import { User } from "../../db/models/user.js";

dotenv.config();

const jwtSecret = process.env.JWT_SECRET as string;

type JSONObject = { [key: string]: any };

interface UserPayload {
    _id: string;
    email: string;
    role: 'admin' | 'writer';
}

export const withToken = (data: JSONObject): JSONObject => {
    const plainData = data instanceof Object && data.toObject ? data.toObject() : data;
    return { ...plainData, token: jwt.sign({ _id: plainData.id, email: plainData.email }, jwtSecret, { expiresIn: "1d" }) };
};

const strategyName = "jwt";

export const jwtStrategy = {
    name: strategyName,

    strategy: new Strategy(
        {
            // Indicates extractor where to obtain the token from
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            // Secret key to verify the signature of the token
            secretOrKey: jwtSecret,
        },
        async (jwt_payload: UserPayload, done: VerifiedCallback) => {
            // This is a verification callback
            // It gets called for every request to verify that the user is authenticated
            try {
                const user = await User.findById(jwt_payload._id);
                return done(null, user || false);
            } catch (error) {
                return done(error, false);
            }
        }
    ),
};

export const ensureAuthenticated = passport.authenticate(jwtStrategy.name, {
    session: false,
});
