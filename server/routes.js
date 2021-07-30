let authUtils = require("./auth/utils");
let config = require("./config");
let express = require("express");
let passport = require("passport");
let path = require("path");
let session = require("express-session");
const router = express.Router();
const { createProxyMiddleware } = require("http-proxy-middleware");
let { api_client_id, downstream_api } = require("./config");
const { lagreIRedis, hentFraRedis } = require("./cache");
let bodyParser = require("body-parser");
const auth = require("./auth/utils");
const azure = require("./auth/azure");

function addMinutes(date, minutes) {
  return new Date(date.getTime() + minutes * 60000);
}

const claimsFrom = (token) => {
  return JSON.parse(Buffer.from(token.split(".")[1], "base64").toString());
};

const isValidIn = ({ seconds, token }) => {
  if (!token) return false;
  const timeToCheck = Math.floor(Date.now() / 1000) + seconds;
  const expirationTime = parseInt(claimsFrom(token)["exp"]);
  return timeToCheck < expirationTime;
};

const ensureAuthenticated = async (req, res, next) => {
  const token = req.cookies && req.cookies.accessToken;
  if (token) {
    if (isValidIn({ seconds: 30, token })) {
      next();
    } else {
      const kabalId = req.cookies.kabalId;
      const azureAuthClient = await azure.client();
      let tokenSet = await auth.refreshAccessToken(
        azureAuthClient,
        req,
        kabalId
      );
      let expires = addMinutes(new Date(), 30);
      res.cookie("accessToken", tokenSet.access_token, {
        expires: new Date(expires),
        httpOnly: true,
      });
      res.cookie("refreshToken", tokenSet.refresh_token, {
        expires: new Date(expires),
        httpOnly: true,
      });
      next();
    }
  } else {
    console.log("AUTH denied");
    console.log({ token });
    res.redirect("/login");
  }
};

const setup = (authClient) => {
  router.get("/isAlive", (req, res) => res.send("Alive"));
  router.get("/isReady", (req, res) => res.send("Ready"));

  // Routes for passport to handle the authentication flow
  router.get(
    "/login",
    passport.authenticate("azureOidc", { failureRedirect: "/login" })
  );

  router.get("/error", (req, res) => {
    res.send("error");
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
        await lagreIRedis(
          `endret_innstillinger_${navIdent}_${enhetId}`,
          new Date()
        );
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
    "/oauth2/callback",
    passport.authenticate("azureOidc", { failureRedirect: "/error" }),
    async (req, res) => {
      const access_token =
        req.session.passport.user.tokenSets.self.access_token;
      const refresh_token =
        req.session.passport.user.tokenSets.self.refresh_token;
      let expires = addMinutes(new Date(), 30);
      res.cookie("accessToken", access_token, {
        expires: new Date(expires),
        httpOnly: true,
      });
      res.cookie("refreshToken", refresh_token, {
        expires: new Date(expires),
        httpOnly: true,
      });
      if (session.redirectTo) {
        res.redirect(session.redirectTo);
      } else {
        res.redirect("/");
      }
    }
  );

  router.use(ensureAuthenticated);

  router.use(async (req, res, next) => {
    if (req.path.startsWith("/api")) {
      const params = {
        clientId: api_client_id,
        path: "api",
        url: downstream_api,
        scopes: [],
      };
      const token = await new Promise((resolve, reject) =>
        authUtils
          .getOnBehalfOfAccessToken(authClient, req, params)
          .then((userinfo) => {
            resolve(userinfo);
          })
          .catch((err) => reject(err))
      );
      req.headers["Authorization"] = `Bearer ${token}`;
      req.headers["Accept"] = `application/json`;
      next();
    } else {
      next();
    }
  });

  const onProxyReq = function (proxyRes, req, res) {
    console.log("onProxyReq");
  };
  const onProxyRes = function (proxyRes, req, res) {
    console.log("onProxyRes");
  };

  router.use(
    "/api",
    // cacheMiddleWare,
    createProxyMiddleware({
      target: "http://kabal-api",
      pathRewrite: {
        "^/api": "",
      },
      onError: function onError(err, req, res) {
        res.status(500);
        res.json({
          error: "Kunne ikke koble til API. Reason: " + JSON.stringify(err),
        });
      },
      logLevel: "info",
      changeOrigin: true,
    })
  );

  router.get("/", (req, res) => {
    return res
      .status(200)
      .sendFile(path.resolve(__dirname, "../frontend/dist/index.html"));
  });

  router.get("/internal/pdf.worker.js", (req, res) => {
    return res
      .status(200)
      .sendFile(path.resolve(__dirname, "../frontend/dist/pdf.worker.js"));
  });

  router.get("/me", (req, res) => {
    authUtils
      .getUserInfoFromGraphApi(authClient, req)
      .then((userinfo) => res.json(userinfo))
      .catch((err) => res.status(500).json(err));
  });

  // log the user out
  router.get("/internal/logout", (req, res) => {
    req.logOut();
    res.redirect(
      authClient.endSessionUrl({
        post_logout_redirect_uri: config.azureAd.logoutRedirectUri,
      })
    );
  });

  // serve static files
  const buildPath = path.resolve(__dirname, "../frontend/dist");
  router.use("/", express.static(buildPath, { index: false }));

  router.use("*", (req, res) => {
    res.sendFile("index.html", { root: buildPath });
  });
  return router;
};

module.exports = { setup };
