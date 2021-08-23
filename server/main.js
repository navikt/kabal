let azure = require("./auth/azure");
let config = require("./config");
let express = require("express");
let cors = require("cors");
let passport = require("passport");
let session = require("./session");
let axios = require("axios");

const cookieParser = require("cookie-parser");

let morganBody = require("morgan-body");
let morgan = require("morgan");
let morganJson = require("morgan-json");

const morganJsonFormat = morganJson({
  short: ":method :url :status",
  length: ":res[content-length]",
  "response-time": ":response-time ms",
});

const server = express();
const port = config.server.port;

let SLACKURL = process.env.slackhookurl;

async function startApp() {
  //await slackPoster.postMessage("Kjører opp KABAL frontend i dev");
  if (SLACKURL) {
    axios.post(SLACKURL, {
      channel: "#klage-notifications",
      text: "Kjører opp KABAL frontend i dev",
      icon_emoji: ":star-struck:",
    });
  }

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

    server.use(cors());

    server.use(cookieParser());

    morganBody(server);

    if (process.env.NODE_ENV === "production") {
      try {
        server.use(passport.initialize());
        server.use(passport.session());
        const azureAuthClient = await azure.client();
        const azureOidcStrategy = azure.strategy(azureAuthClient);
        passport.use("azureOidc", azureOidcStrategy);
        passport.serializeUser((user, done) => done(null, user));
        passport.deserializeUser((user, done) => done(null, user));
        server.use("/", require("./routes").setup(azureAuthClient));
        server.listen(8080, () => console.log(`Listening on port ${port}`));
      } catch (e) {
        if (SLACKURL) {
          axios.post(SLACKURL, {
            channel: "#klage-notifications",
            text: ":scream::scream::scream: frontend crash",
            icon_emoji: ":scream:",
          });
        }
        process.exit(1);
      }
    } else {
      server.use("/", require("./routesDev").setup());
      server.listen(
        process.env.PORT || 8090,
        () => console.log(`Listening on port ${port}`),
        "0.0.0.0"
      );
    }
  } catch (error) {
    console.error("Error during start-up", error);
  }
}

startApp().catch((err) => console.log(err));
