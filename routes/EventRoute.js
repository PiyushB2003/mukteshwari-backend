import express from "express";
import { AddEvent } from "../controllers/EventController.js";

const EventRoute = express.Router();

EventRoute.post("/add-event", AddEvent);

export default EventRoute;