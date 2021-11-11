import express from "express";
import * as path from "path";
import { index } from "./routes/index";
import * as dotenv from "dotenv";
import cors from "cors";
import compressions from "compression";
import helmet from "helmet";
import { room } from "./routes/room";
dotenv.config();
export const app = express();

console.log(process.env.PORT);
app.set("port", process.env.PORT || 8080);
// app.set('views', './views')
app.use(express.json({
    limit: '20mb'
}));
app.use(express.urlencoded({
    limit: '20mb',
    extended: true
}));
app.set("views", path.join(__dirname, "./views"));
app.set("view engine", "ejs");

app.use("/", index);
app.use("/room", room);
app.use(cors());
app.use(compressions());
app.use(helmet());
