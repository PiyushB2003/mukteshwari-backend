import express from 'express';
import { AdminLogin, AdminRegister } from '../controllers/AdminAuthController.js';

const AuthAdminRoute = express.Router();

AuthAdminRoute.post("/admin-register", AdminRegister);
AuthAdminRoute.post("/admin-login", AdminLogin)

export default AuthAdminRoute;
