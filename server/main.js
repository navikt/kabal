let azure = require("./auth/azure");
let config = require("./config");
let cors = require("./cors");
let express = require("express");
let helmet = require("helmet");
let passport = require("passport");
let session = require("./session");

let morganBody = require("morgan-body");
let morgan = require("morgan");
let morganJson = require("morgan-json");
const refresh = require("passport-oauth2-refresh");

const morganJsonFormat = morganJson({
  short: ":method :url :status",
  length: ":res[content-length]",
  "response-time": ":response-time ms",
});

const server = express();
const port = config.server.port;

async function startApp() {
  try {
    //ikke bruk global bodyParser, det gir timeout på spørringer mot API
    server.use(
      morgan(morganJsonFormat, {
        skip: (req, res) => {
          if (req.originalUrl === "/metrics") {
            return true;
          }
          return req.originalUrl === "/login";
        },
      })
    );
    session.setup(server);

    server.use(
      helmet({
        contentSecurityPolicy: false,
      })
    );
    server.use(cors);

    morganBody(server);

    if (process.env.NODE_ENV === "production") {
      server.use(passport.initialize());
      server.use(passport.session());
      const azureAuthClient = await azure.client();
      const azureOidcStrategy = azure.strategy(azureAuthClient);
      passport.use("azureOidc", azureOidcStrategy);
      refresh.use(azure, {
        setRefreshOAuth2(azureOidcStrategy) {
          // These named parameters are set for most strategies.
          // The `refreshOAuth2` instance is a clone of the one supplied by the strategy, inheriting most of its config.
          // Customise it here and return if necessary.
          // For example, to set a proxy:
          console.log(azureOidcStrategy);
          return azureOidcStrategy;
          //refreshOAuth2.setAgent(new HttpsProxyAgent(azureAuthClient));
          //return refreshOAuth2;
        },
      });
      passport.serializeUser((user, done) => done(null, user));
      passport.deserializeUser((user, done) => done(null, user));
      server.use("/", require("./routes").setup(azureAuthClient));
      server.listen(8080, () => console.log(`Listening on port ${port}`));
    } else {
      server.use("/", require("./routesDev").setup());
      server.listen(
        8090,
        () => console.log(`Listening on port ${port}`),
        "0.0.0.0"
      );
    }
  } catch (error) {
    console.error("Error during start-up", error);
  }
}

startApp().catch((err) => console.log(err));
