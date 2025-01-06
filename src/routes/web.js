import express from "express";
import { getHomePage, getWebhook, postWebhook } from "../controllers/homepageController.js";
import { getWebhookCMS, postWebhookCMS } from "../controllers/cmspageController.js";

let router = express.Router();

let initWebRoutes = (app)=> {
    router.get("/", getHomePage);
    router.get("/webhook", getWebhook);
    router.post("/webhook", postWebhook);
    router.get("/webhook-cms", getWebhookCMS);
    router.post("/webhook-cms", postWebhookCMS);
    return app.use("/", router);
};

export default initWebRoutes;