import express from "express";
import { AddRequests, UpdateBulkRequests, UpdateRequests } from "../controller/RequestsController.js";

const RequestsRoute = express.Router();

RequestsRoute.post("/requests", AddRequests);
RequestsRoute.put("/requests", UpdateRequests);
RequestsRoute.put("/requests/bulk", UpdateBulkRequests);

export default RequestsRoute;