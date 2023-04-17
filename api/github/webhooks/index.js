const { createNodeMiddleware, createProbot } = require("probot");

const app = require("../../../app");

console.log("Starting probot server");

module.exports = createNodeMiddleware(app, {
    probot: createProbot(),
    webhooksPath: "/api/github/webhooks",
});
