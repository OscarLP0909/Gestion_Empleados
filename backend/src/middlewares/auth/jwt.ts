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
    role: "ADMIN" | "HR_MANAGER" | "MANAGER" | "EMPLOYEE";
}


export const withToken = (data: JSONObject): JSONObject => {
    const plainData =
        data instanceof Object && data.toObject ? data.toObject() : data;
    
    const token = jwt.sign(
        {
            _id: plainData._id || plainData.id,
            email: plainData.email,
            role: plainData.role || "EMPLOYEE", 
        },
        jwtSecret,
        { expiresIn: "7d" } 
    );

    return {
        ...plainData,
        token,
    };
};

const strategyName = "jwt";

export const jwtStrategy = {
    name: strategyName,

    strategy: new Strategy(
        {
            // Indica dónde obtener el token de la request
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            // Secret para verificar la firma del token
            secretOrKey: jwtSecret,
        },
        async (jwt_payload: UserPayload, done: VerifiedCallback) => {
            // Este callback se ejecuta para cada request
            // Verifica que el usuario esté autenticado
            try {
                const user = await User.findById(jwt_payload._id).select("-password");
                
                if (!user) {
                    return done(null, false);
                }

                // Asegurarse de que el user tiene el role
                // (en caso de que la BD no lo tenga)
                if (!user.role) {
                    user.role = "EMPLOYEE";
                }

                return done(null, user);
            } catch (error) {
                return done(error, false);
            }
        }
    ),
};

export const ensureAuthenticated = passport.authenticate(jwtStrategy.name, {
    session: false,
});