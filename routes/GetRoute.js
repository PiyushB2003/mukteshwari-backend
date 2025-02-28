import express from "express";
import {
    GetAllUsers,
    GetBranches,
    GetBranchesByCity,
    GetBranchRequests, GetEvent, GetRequests, GetUsers
} from "../controller/GetDataController.js";

const GetRoutes = express.Router();

GetRoutes.get("/all-users", GetAllUsers);
GetRoutes.get("/users", GetUsers);
GetRoutes.get("/get-branches", GetBranches);
GetRoutes.get("/events", GetEvent);
GetRoutes.get("/requests", GetRequests);
GetRoutes.get("/branch-requests", GetBranchRequests);
GetRoutes.get("/get-cities", GetBranchesByCity);

export default GetRoutes;