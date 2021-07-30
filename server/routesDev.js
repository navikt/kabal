let express = require("express");
let path = require("path");
let session = require("express-session");
const axios = require("axios");
const {
  lagreIRedis,
  hentFraRedis,
  cacheMiddleWare,
  handleProxyRes,
} = require("./cache");
const router = express.Router();
const { createProxyMiddleware } = require("http-proxy-middleware");
let bodyParser = require("body-parser");
const uuid = require("uuid/v4");

const setup = (authClient) => {
  router.get("/", async (req, res) => {
    // Cookies that have not been signed
    console.log("Cookies: ", req.cookies);

    // Cookies that have been signed
    console.log("Signed Cookies: ", req.signedCookies);

    if (req.cookies && req.cookies.kabalId) {
      return res.end(`Welcome back, ${req.cookies.kabalId}!`);
    }
    const kabalId = uuid();
    console.dir(req.cookies.cookieName);
    res.cookie("kabalId", kabalId, { httpOnly: true });
    res.end(`Welcome, ${kabalId}!`);
  });

  router.post(
    "/internal/innstillinger",
    bodyParser.json(),
    async (req, res) => {
      const { navIdent, enhetId, innstillinger } = req.body;
      let settings = "";
      try {
        await lagreIRedis(
          `innstillinger_${navIdent}_${enhetId}`,
          innstillinger
        );
        settings = await hentFraRedis(`innstillinger_${navIdent}_${enhetId}`);
        res.status(200).json(JSON.parse(settings));
      } catch (e) {
        res.status(500).json({ err: e });
      }
    }
  );
  router.get(
    "/internal/innstillinger/:navIdent/:enhetId",
    bodyParser.json(),
    async (req, res) => {
      const { navIdent, enhetId } = req.params;
      let settings = "";
      try {
        settings = await hentFraRedis(`innstillinger_${navIdent}_${enhetId}`);
        res.status(200).json(JSON.parse(settings));
      } catch (e) {
        res.status(500).json({ err: e });
      }
    }
  );

  router.use(
    "/api",
    cacheMiddleWare,
    createProxyMiddleware({
      target: "http://apimock:3000",
      //target: "https://kabal-api.dev.nav.no/",
      pathRewrite: {
        "^/api": "",
      },
      onError: function onError(err, req, res) {
        res.status(500);
        res.json({ error: "Kunne ikke koble til API" });
      },
      onProxyReq(proxyReq, req, res) {
        const token = ""; // legg inn ved beov
        proxyReq.setHeader("Authorization", `Bearer ${token}`);
      },
      async onProxyRes(proxyRes, req, res) {
        await handleProxyRes(proxyRes, req, res);
      },
      logLevel: "debug",
      changeOrigin: true,
    })
  );

  router.use(
    "/me",
    createProxyMiddleware({
      target: "http://apimock:3000",
      onError: function onError(err, req, res) {
        res.status(500);
        res.json({ error: "Kunne ikke koble til API" });
      },
      logLevel: "debug",
      changeOrigin: true,
    })
  );

  return router;
};

module.exports = { setup };
