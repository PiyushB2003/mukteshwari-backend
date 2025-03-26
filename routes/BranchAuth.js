import express from 'express';
import { BranchLogin, BranchPasswordUpdate, BranchRegister, BranchUpdate } from '../controllers/BranchAuthController.js';


const AuthBranchRoute = express.Router();

AuthBranchRoute.post("/branch-register", BranchRegister);
AuthBranchRoute.post("/branch-login", BranchLogin);
AuthBranchRoute.put("/update-branches-by-id/:id", BranchUpdate);
AuthBranchRoute.put("/update-branch-password/:branch_id", BranchPasswordUpdate);

export default AuthBranchRoute;