const { App } = require("@slack/bolt");
const fs = require("fs");

const app = new App({
  token: process.env.slack_e2e_token,
  signingSecret: process.env.slack_signing_secret,
});

let firstMessageResponse = undefined;

const channel = process.env.kabal_notications_channel;

const postMessage = async (message) => {
  let response = await app.client.chat.postMessage({
    token: process.env.slack_e2e_token,
    channel: channel,
    thread_ts: firstMessageResponse ? firstMessageResponse.ts : null,
    text: message,
  });
  if (firstMessageResponse === undefined) {
    firstMessageResponse = response;
  }
};

const updateMessage = async (message) => {
  return await app.client.chat.update({
    token: process.env.slack_e2e_token,
    channel: firstMessageResponse.channel,
    ts: firstMessageResponse.ts,
    text: message,
  });
};

const postFile = async (path) => {
  console.log("Uploading " + path);
  await app.client.files.upload({
    token: process.env.slack_e2e_token,
    file: fs.createReadStream("./output/" + path),
    channels: channel,
    thread_ts: firstMessageResponse.ts,
    filename: path,
    title: path,
  });
};

const postLogData = async (message) => {
  await app.client.files.upload({
    token: process.env.slack_e2e_token,
    content: message,
    channels: channel,
    thread_ts: firstMessageResponse.ts,
    filename: "log.txt",
    title: "log",
  });
};

module.exports = { postMessage, postFile, updateMessage, postLogData };
