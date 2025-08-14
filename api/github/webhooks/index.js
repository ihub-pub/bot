import { createNodeMiddleware, createProbot } from "probot";
import app from "../../../app.js";

console.log("Starting probot server");

export default createNodeMiddleware(app, {
    probot: createProbot(),
    webhooksPath: "/api/github/webhooks",
});