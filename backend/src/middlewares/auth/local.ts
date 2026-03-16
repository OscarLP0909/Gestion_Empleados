import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcrypt";
import { User } from "../../db/models/user.js";

export const localStrategy = {
    name: "local",
    strategy: new LocalStrategy(
        { usernameField: "email", passwordField: "password" },
        async (email, password, done) => {
            try {
                console.log("🔍 Buscando usuario:", email);
                
                const user = await User.findOne({ email }).select("+password");
                
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
                
                const isValid = await bcrypt.compare(password, user.password);
                
                console.log("🔐 ¿Contraseña válida?:", isValid);
                
                if (!isValid) {
                    console.log("❌ Contraseña inválida");
                    return done(null, false);
                }

                console.log("✅ Login exitoso!");
                return done(null, user);
            } catch (error) {
                console.error("❌ Error en estrategia local:", error);
                return done(error as Error);
            }
        }
    ),
};