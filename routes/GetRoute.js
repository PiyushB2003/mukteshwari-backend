import express from "express";
import { GetAllUsers, GetBranchById, GetBranches, GetBranchesByCity, GetBranchRequests, GetEvent, GetRequests, GetUserRequestsById, GetUsers, GetUsersByBranchId, GetUserByUserId } from "../controllers/GetDataController.js";

const GetRoutes = express.Router();

GetRoutes.get("/all-users", GetAllUsers);
GetRoutes.get("/users-by-branch-id", GetUsersByBranchId);
GetRoutes.get("/user-by-user-id", GetUserByUserId);
GetRoutes.get("/users", GetUsers);
GetRoutes.get("/get-user-by-id/:userId", GetUserRequestsById);
GetRoutes.get("/get-branches", GetBranches);
GetRoutes.get("/get-branches-by-id/:branchId", GetBranchById);
GetRoutes.get("/events", GetEvent);
GetRoutes.get("/requests", GetRequests);
GetRoutes.get("/branch-requests", GetBranchRequests);
GetRoutes.get("/branches-by-city", GetBranchesByCity); // Changed

export default GetRoutes;
