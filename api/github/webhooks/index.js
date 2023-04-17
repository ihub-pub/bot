const {createNodeMiddleware, createProbot} = require("probot");

const {defaultApp} = require("probot/lib/apps/default")

const app = require("../../../app");

console.log("Starting probot server");

// module.exports = createNodeMiddleware(app, {
//     probot: createProbot(),
//     webhooksPath: "/api/github/webhooks",
// });

module.exports = defaultApp;
