let express = require("express");
let path = require("path");
let jwt = require("jsonwebtoken");
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
const { isValidIn, addMinutes } = require("./routes");

const setup = () => {
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

  router.get("/internal/isauthenticated", (req, res) => {
    const token = req.cookies && req.cookies.accessToken;
    if (token) {
      if (isValidIn({ seconds: 30, token })) {
        res.send({ status: true });
      } else {
        res.send({ status: false, token });
      }
    } else {
      res.send({ status: false, token });
    }
  });

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

  const ensureAuthenticated = async (req, res, next) => {
    const token = req.cookies && req.cookies.accessToken;

    function setToken() {
      var token = jwt.sign({ exp: new Date().getTime() + 60000 }, "shhhh");
      res.cookie("accessToken", token, {
        expires: new Date(addMinutes(new Date(), 60)),
        httpOnly: true,
      });
      res.cookie("refreshToken", "devRefreshToken", {
        expires: new Date(addMinutes(new Date(), 60 * 24)),
        httpOnly: true,
      });
    }

    if (token) {
      if (isValidIn({ seconds: 600, token })) {
        next();
      } else {
        setToken();
        console.log("ensureAuthenticated: genererte nye tokens");
      }
      next();
    } else {
      console.log("ensureAuthenticated: satte init tokens");
      setToken();
      next();
    }
  };

  router.get("/internal/refresh", ensureAuthenticated, async (req, res) => {
    res.status(200).json({ status: "OK" });
  });

  router.use(
    "/api",
    cacheMiddleWare,
    createProxyMiddleware({
      target: "http://apimock:3000",
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
