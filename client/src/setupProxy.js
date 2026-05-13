const { createProxyMiddleware } = require("http-proxy-middleware");

/**
 * Explicit /api proxy for Create React App (more reliable than package.json "proxy" alone).
 * Target must match where Express runs (default 5000).
 */
module.exports = function (app) {
  const target =
    process.env.REACT_APP_PROXY_TARGET ||
    `http://127.0.0.1:${process.env.REACT_APP_DEV_API_PORT || "5000"}`;

  app.use(
    "/api",
    createProxyMiddleware({
      target,
      changeOrigin: true,
    })
  );
};
