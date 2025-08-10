// Use dynamic import for probot since it's an ES Module
let createNodeMiddleware;
let createProbot;

// Initialize probot with dynamic import
(async () => {
  const probot = await import('probot');
  createNodeMiddleware = probot.createNodeMiddleware;
  createProbot = probot.createProbot;
})();

const app = require("../../../app");

console.log("Starting probot server");

// Export the middleware with a slight delay to ensure probot is loaded
module.exports = (req, res) => {
  if (!createNodeMiddleware || !createProbot) {
    res.statusCode = 503;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Probot is still initializing');
    return;
  }

  const middleware = createNodeMiddleware(app, {
    probot: createProbot(),
    webhooksPath: "/api/github/webhooks",
  });

  middleware(req, res);
};
