import type { NextFunction, Request, Response } from "express";
import passport from "passport";
import bcrypt from "bcrypt";
import { localStrategy } from "../middlewares/auth/local.js";
import { jwtStrategy, withToken } from "../middlewares/auth/jwt.js";
import { User } from "../db/models/user.js";

passport.use(localStrategy.name, localStrategy.strategy);
passport.use(jwtStrategy.name, jwtStrategy.strategy);

export const login = (req: Request, res: Response, next: NextFunction) => {
    console.log("LOGIN BODY: ", req.body);
    passport.authenticate(
        localStrategy.name,
        { session: false },
        (err: any, user?: Express.User | false | null) => {
            if (err) {
                return next(err);
            }
            if (!user) {
                return res.status(401).json({ message: "Wrong credentials" });
            }
            // ✅ ACTUALIZADO: withToken ahora incluye el role automáticamente
            return res.status(200).json(withToken(user as any));
        }
    )(req, res, next);
};

export const register = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    console.log("REGISTER BODY: ", req.body);
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            res.status(401).json({
                message: "Email and password are required",
            });
            return;
        }

        const exists = await User.findOne({ email });
        if (exists) {
            res.status(409).json({ message: "User already exists" });
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // ✅ ACTUALIZADO: Agregar role default
        const user = new User({
            email,
            password: hashedPassword,
            role: "EMPLOYEE", // ← Por defecto, nuevos usuarios son EMPLOYEE
        });
        await user.save();
        return res
            .status(201)
            .json({ message: "User created successfully" });
    } catch (error) {
        next(error);
    }
};