import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import passport from 'passport';
import { setupPassport } from './config/passport.js';
import authRouter from './routes/authRouter.js';
import cors from "cors";
import employeeRouter from './routes/employeeRouter.js';
import contractRouter from './routes/contractRouter.js';
import userRouter from './routes/userRouter.js';

const app = express();

app.use(express.json());

app.use(passport.initialize());
setupPassport();

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));


// const authLimiter = rateLimit({
//     windowMs: 15*60*1000,
//     max: 10,
//     message: { message: "Demasiados intentos, espera 15 minutos" },
//     standardHeaders: true,
//     legacyHeaders: false,
// });

// const generalLimiter = rateLimit({
//     windowMs: 15 * 60 * 1000,
//     max: 10,
//     message: { message: "Demasiados intentos, espera un momento" },
//     standardHeaders: true,
//     legacyHeaders: false,
// });



app.use(helmet());
// app.use(generalLimiter);


/// Rutas
app.use("/auth", authRouter);
app.use("/employee", employeeRouter);
app.use("/contract", contractRouter);
app.use("/user", userRouter);



export default app;
