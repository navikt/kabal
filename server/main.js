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
const ecsFormat = require("@elastic/ecs-morgan-format");

const server = express();
const port = config.server.port;

const SLACKURL = process.env.slackhookurl;

async function startApp() {
  if (SLACKURL && process.env.NODE_ENV !== "development") {
    await axios.post(SLACKURL, {
      channel: "#klage-notifications",
      text: `Kjører opp  KABAL frontend`,
      icon_emoji: ":star-struck:",
    });
  }

  try {
    //ikke bruk global bodyParser, det gir timeout på spørringer mot API
    server.use(
      morgan(ecsFormat(), {
        skip: (req) => {
          if (req.originalUrl === "/metrics") {
            return true;
          }
          if (req.originalUrl.endsWith(".svg")) {
            return true;
          }
          if (req.originalUrl.endsWith(".js")) {
            return true;
          }
          if (req.originalUrl.startsWith("/me")) {
            return true;
          }
          if (req.originalUrl.startsWith("/oauth2")) {
            return true;
          }
          if (req.originalUrl.startsWith("/internal")) {
            return true;
          }
          return req.originalUrl === "/login";
        },
      })
    );

    session.setup(server);

    server.use(cors());

    server.use(cookieParser());

    morganBody(server, {
      noColors: true,
      prettify: false,
      includeNewLine: false,
      logReqUserAgent: false,
      logRequestBody: false, //så slipper vi å se tokens i loggen
      maxBodyLength: 5000,
      logIP: false,
    });

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
          await axios.post(SLACKURL, {
            channel: "#klage-notifications",
            text: `frontend crash i produksjon ${JSON.stringify(e)}`,
            icon_emoji: ":scream:",
          });
        }
        process.exit(1);
      }
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

process
  .on("unhandledRejection", (reason, p) => {
    console.log(`Process ${process.pid} received a unhandledRejection signal`);
    process.exit(0);
  })
  .on("uncaughtException", (e) => {
    console.log(`Process ${process.pid} received a uncaughtException signal`);
    process.exit(0);
  })
  .on("SIGTERM", (signal) => {
    console.log(`Process ${process.pid} received a SIGTERM signal`);
    process.exit(0);
  })

  .on("SIGINT", (signal) => {
    console.log(`Process ${process.pid} has been interrupted`);
    process.exit(0);
  })
  .on("beforeExit", async (code) => {
    await axios.post(SLACKURL, {
      channel: "#klage-notifications",
      text: `frontend crash ${JSON.stringify(code)}`,
      icon_emoji: ":scream:",
    });
  });

startApp().catch((err) => console.log(err));
