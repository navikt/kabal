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

function setToken(res) {
  var token = jwt.sign(
    { exp: new Date(addMinutes(new Date(), 60)).getTime() },
    "shhhh"
  );
  res.cookie("accessToken", token, {
    expires: new Date(addMinutes(new Date(), 60)),
    httpOnly: true,
  });
  res.cookie("refreshToken", "devRefreshToken", {
    expires: new Date(addMinutes(new Date(), 60 * 24)),
    httpOnly: true,
  });
}

const ensureAuthenticated = async (req, res, next) => {
  const token = req.cookies && req.cookies.accessToken;
  if (token) {
    if (isValidIn({ seconds: 600, token })) {
      next();
    } else {
      setToken(res);
      console.log("ensureAuthenticated: genererte nye tokens");
    }
    next();
  } else {
    console.log("ensureAuthenticated: satte init tokens");
    setToken(res);
    next();
  }
};

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

  router.get("/internal/login", (req, res) => {
    setToken(res);
    //res.end("satte tokens");
    res.redirect("/oppgaver");
  });

  router.get("/internal/crash", (req, res) => {
    throw new Error("Express crashed!");
  });

  // log the user out
  router.get("/internal/logout", (req, res) => {
    res.redirect("/internal/utlogget");
  });
  // log the user out
  router.get("/internal/utlogget", (req, res) => {
    res.cookie("accessToken", "", {
      expires: new Date(addMinutes(new Date(), 0)),
      httpOnly: true,
    });
    res.cookie("refreshToken", "", {
      expires: new Date(addMinutes(new Date(), 0)),
      httpOnly: true,
    });
    res.header("Content-type", "text/html");
    res.end(
      'Din sesjon er nå utlogget. <a href="/login">Klikk her</a> for å logge inn på ny'
    );
  });

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
      //setToken(res);
      //res.send({ status: true });
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
