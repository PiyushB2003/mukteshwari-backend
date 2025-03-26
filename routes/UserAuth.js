import express from 'express';
import { UserLogin, UserRegister } from '../controllers/UserAuthController.js';

const AuthUserRoute = express.Router();

AuthUserRoute.post("/user-register", UserRegister);
AuthUserRoute.post("/user-login", UserLogin);

export default AuthUserRoute;