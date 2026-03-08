import { type NextFunction, type Request, type Response } from "express";
import passport from "passport";
import bcrypt from "bcrypt";
import { localStrategy } from "../middlewares/auth/local.js";
import { jwtStrategy, withToken } from "../middlewares/auth/jwt.js";
import { User } from "../db/models/user.js";

passport.use(localStrategy.name, localStrategy.strategy);
passport.use(jwtStrategy.name, jwtStrategy.strategy);


// Esto se usa cuando Passport usa sesiones.

// Sirve para decidir:

// “¿Qué información del usuario guardamos en la sesión?”

// En lugar de guardar todo el usuario, normalmente se guarda solo el id.
// passport.serializeUser((user: any, done) => {
//     process.nextTick(() => done(null, user.id));
// });

// Esto es lo contrario de serializeUser.

// Sirve para:

// “Convertir el id guardado en la sesión en el usuario real”.
// passport.deserializeUser(async (id: string, done) => {
//     try {
//         const user = await User.findById(id);
//         done(null, user);
//     } catch (error) {
//         done(error);
//     }
// });

export const login = (req: Request, res: Response, next: NextFunction) => {
    console.log("LOGIN BODY: ", req.body)
    passport.authenticate(
        localStrategy.name,
        { session: false },
        (err: any, user?: Express.User | false | null) => {
            if (err) {
                return next(err);
            }
            if (!user) {
                return res.status(401).json({ message: 'Wrong credentials' });
            }
            return res.status(200).json(withToken(user));
        }
    )(req, res, next);
};

export const register = async (req: Request, res: Response, next: NextFunction) => {
    console.log("REGISTER BODY: ", req.body);
    console.log("TIPO EMAIL: ", typeof req.body.email, "value: ", req.body.email);
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            res.status(401).json({ message: "Email and password are required" });
            return;
        }

        const exists = await User.findOne({ email });
        if (exists) {
            res.status(409).json({ message: "User already exists" });
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({ email, password: hashedPassword });
        await user.save();
        return res.status(201).json({ message: "User created successfully" });
    } catch (error) {
        next(error);
    }
};