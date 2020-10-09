let azure = require("./auth/azure");
let config = require("./config");
let routes = require("./routes");
let cors = require("./cors");
let express = require("express");
let helmet = require("helmet");
let passport = require("passport");
let session = require("./session");
let { createProxyMiddleware } = require("http-proxy-middleware");

// for debugging during development
let morganBody = require("morgan-body");
let morgan = require("morgan");

const server = express();
const port = config.server.port;

async function startApp() {
  try {
    morganBody(server);
    morgan("dev");

    session.setup(server);

    server.use(express.json());
    server.use(express.urlencoded({ extended: true }));

    // setup sane defaults for CORS and HTTP headers
    server.use(
      helmet({
        contentSecurityPolicy: false,
      })
    );
    server.use(cors);

    // initialize passport and restore authentication state, if any, = require(the session
    server.use(passport.initialize());
    server.use(passport.session());

    const azureAuthClient = await azure.client();
    const azureOidcStrategy = azure.strategy(azureAuthClient);

    passport.use("azureOidc", azureOidcStrategy);
    passport.serializeUser((user, done) => done(null, user));
    passport.deserializeUser((user, done) => done(null, user));

    // setup proxy
    function proxyHost() {
      return "https://klage-oppgave-api.dev.nav.no";
    }

    server.use(
      "/api",
      createProxyMiddleware({
        target: proxyHost(),
        changeOrigin: true,
        secure: false,
        pathRewrite: function (path, req) {
          console.log({
            from: path,
            to: proxyHost() + path.replace("/api", ""),
          });
          return path.replace("/api", "");
        },
      })
    );

    // setup routes
    server.use("/", routes.setup(azureAuthClient));
    server.listen(port, () => console.log(`Listening on port ${port}`));
  } catch (error) {
    console.error("Error during start-up", error);
  }
}

startApp().catch((err) => console.log(err));
