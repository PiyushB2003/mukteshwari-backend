import express from "express";
import { AddRequests, InsertRequests, InsertRequestsInBulk, UpdateBulkRequests, UpdateRequests } from "../controller/RequestsController.js";

const RequestsRoute = express.Router();

RequestsRoute.post("/requests", AddRequests);
RequestsRoute.post("/register-requests", InsertRequests);
RequestsRoute.post("/register-requests/bulk", InsertRequestsInBulk);
RequestsRoute.put("/requests", UpdateRequests);
RequestsRoute.put("/requests/bulk", UpdateBulkRequests);

export default RequestsRoute;