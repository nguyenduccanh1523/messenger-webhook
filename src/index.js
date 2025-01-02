import express from "express";
import bodyParser from "body-parser";
import configViewEngine from "./config/viewEngine.js";
import initWebRoutes from "./routes/web.js";
// import initAPIRoutes from "./routes/api.js";
import dotenv from "dotenv";
import { getMessages } from "./controllers/homepageController.js";

dotenv.config();

let app = express();

//config body-parser to post data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//config view engine
configViewEngine(app);

//init web routes
initWebRoutes(app);
// initAPIRoutes(app);

app.get("/messages", getMessages);

let port = process.env.PORT || 8080;

app.listen(port, () => {
    console.log(`Messenger tech shop is running at the port ${port}`);
});
