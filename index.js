import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import db from "./db/DbConnect.js";
import AuthAdminRoute from "./routes/AdminAuth.js";
import GetRoutes from "./routes/GetRoute.js";
import AuthBranchRoute from "./routes/BranchAuth.js";
import AuthUserRoute from "./routes/UserAuth.js";
import RequestsRoute from "./routes/RequestsRoute.js";
import EventRoute from "./routes/EventRoute.js";

dotenv.config();

db.query("SELECT 1", (err, results) => {
    if (err) {
        console.error("Error connecting to the database:", err.message);
    } else {
        console.log("Connected to the MySQL database.");
    }
});

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.use("/auth", AuthAdminRoute);
app.use("/auth", AuthBranchRoute);
app.use("/auth", AuthUserRoute);
app.use("/", EventRoute);
app.use("/", GetRoutes);
app.use("/", RequestsRoute);

app.listen(process.env.PORT || 3000, () => {
    console.log(`App listening on port ${process.env.PORT || 3000}`);
});