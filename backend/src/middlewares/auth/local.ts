import { Strategy as LocalStrategy } from "passport-local";
import type { VerifyFunction } from "passport-local";
import bcrypt from "bcrypt";
import { User } from "../../db/models/user.js";


const strategyName = "local";

const verifyCallback: VerifyFunction = async (email, password, done) => {
    try {
        // Buscar usuario por email
        const user = await User.findOne({ email });

        if (!user) {
            return done(null, false, {
                message: "Email or password incorrect",
            });
        }

        // ✅ ACTUALIZADO: Verificar también que el usuario esté activo
        if (!user.isActive) {
            return done(null, false, {
                message: "User account is deactivated",
            });
        }

        // Comparar contraseñas
        const isPasswordMatch = await bcrypt.compare(password, user.password);

        if (!isPasswordMatch) {
            return done(null, false, {
                message: "Email or password incorrect",
            });
        }

        // ✅ Usuario autenticado correctamente
        const userObject = user.toObject();
        return done(null, {
            ...userObject,
            _id: userObject._id.toString(),
        });
    } catch (error) {
        return done(error);
    }
};

export const localStrategy = {
    name: strategyName,
    strategy: new LocalStrategy(
        {
            usernameField: "email", // Campo del request que contiene el email
            passwordField: "password", // Campo del request que contiene la password
        },
        verifyCallback
    ),
};