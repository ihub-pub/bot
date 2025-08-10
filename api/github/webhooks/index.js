import { createNodeMiddleware, createProbot } from "probot";

const app = require("../../../app");

console.log("Starting probot server");

module.exports = createNodeMiddleware(app, {
    probot: createProbot(),
    webhooksPath: "/api/github/webhooks",
});