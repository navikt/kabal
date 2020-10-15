import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
const port = 3000; // default port to listen

app.get("/oppgaver", (req, res) => {
  res.send([
    {
      id: 315993178,
      bruker: { fnr: "mangler", navn: "mangler" },
      type: "klage",
      ytelse: "SYK",
      hjemmel: ["8-1"],
      frist: "2008-05-19",
      saksbehandler: "TODO saksbehandler",
    },
    {
      id: 315993177,
      bruker: { fnr: "mangler", navn: "mangler" },
      type: "klage",
      ytelse: "SYK",
      hjemmel: ["mangler"],
      frist: "2008-05-19",
      saksbehandler: "TODO saksbehandler",
    },
    {
      id: 203592807,
      bruker: { fnr: "mangler", navn: "mangler" },
      type: "klage",
      ytelse: "SYK",
      hjemmel: ["8-1"],
      frist: "2018-04-23",
      saksbehandler: "TODO saksbehandler",
    },
    {
      id: 209074926,
      bruker: { fnr: "mangler", navn: "mangler" },
      type: "klage",
      ytelse: "SYK",
      hjemmel: ["mangler"],
      frist: "2018-09-10",
      saksbehandler: "TODO saksbehandler",
    },
    {
      id: 209464368,
      bruker: { fnr: "mangler", navn: "mangler" },
      type: "klage",
      ytelse: "SYK",
      hjemmel: ["mangler"],
      frist: "2018-10-31",
      saksbehandler: "TODO saksbehandler",
    },
    {
      id: 213097415,
      bruker: { fnr: "mangler", navn: "mangler" },
      type: "klage",
      ytelse: "SYK",
      hjemmel: ["mangler"],
      frist: "2018-11-21",
      saksbehandler: "TODO saksbehandler",
    },
    {
      id: 213206601,
      bruker: { fnr: "mangler", navn: "mangler" },
      type: "klage",
      ytelse: "SYK",
      hjemmel: ["mangler"],
      frist: "2018-12-01",
      saksbehandler: "TODO saksbehandler",
    },
    {
      id: 205086396,
      bruker: { fnr: "mangler", navn: "mangler" },
      type: "klage",
      ytelse: "SYK",
      hjemmel: ["mangler"],
      frist: "2019-01-03",
      saksbehandler: "TODO saksbehandler",
    },
    {
      id: 217733769,
      bruker: { fnr: "mangler", navn: "mangler" },
      type: "klage",
      ytelse: "SYK",
      hjemmel: ["mangler"],
      frist: "2019-01-25",
      saksbehandler: "TODO saksbehandler",
    },
    {
      id: 300449338,
      bruker: { fnr: "mangler", navn: "mangler" },
      type: "klage",
      ytelse: "SYK",
      hjemmel: ["mangler"],
      frist: "2019-03-14",
      saksbehandler: "TODO saksbehandler",
    },
  ]);
});

// define a route handler for the default home page
app.get("/token", (req, res) => {
  res.send(
    "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6ImppYk5ia0ZTU2JteFBZck45Q0ZxUms0SzRndyJ9.eyJhdWQiOiIwYmMxOTllZi0zNWRkLTRhYTMtODdlNi0wMTUwNmRhM2RkOTAiLCJpc3MiOiJodHRwczovL2xvZ2luLm1pY3Jvc29mdG9ubGluZS5jb20vOTY2YWM1NzItZjViNy00YmJlLWFhODgtYzc2NDE5YzBmODUxL3YyLjAiLCJpYXQiOjE2MDE0NTMyNjUsIm5iZiI6MTYwMTQ1MzI2NSwiZXhwIjoxNjAxNDU3MTYzLCJhaW8iOiJBVFFBeS84UkFBQUF3bHAwWTVyL3EvVHZjOS9OT2wrOEczamJMbmVVM0kxYXRIaEEyTE1GY0JFYTI3OUdPNjZRbkpoZlkxTjRDZUt5IiwiYXpwIjoiOTRjMzcxOTctOTNhOC00NWQ5LTg4ZjUtOThjNmI2NmM3ZTc3IiwiYXpwYWNyIjoiMiIsImdyb3VwcyI6WyI5Mjg2MzZmNC1mZDBkLTQxNDktOTc4ZS1hNmZiNjhiYjE5ZGUiXSwibmFtZSI6IkZfWjk5NDQ4OCBFX1o5OTQ0ODgiLCJvaWQiOiJkYzRmN2RkOS0zNmNmLTQ2MGEtYTg4Ny02NDcyYWRhOGQzOTkiLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJGX1o5OTQ0ODguRV9aOTk0NDg4QHRyeWdkZWV0YXRlbi5ubyIsInJoIjoiMC5BQUFBY3NWcWxyZjF2a3VxaU1ka0djRDRVWmR4dzVTb2s5bEZpUFdZeHJac2ZuZEhBR28uIiwic2NwIjoiZGVmYXVsdGFjY2VzcyIsInN1YiI6IjBsdUdoQWFtSS1XUlJhUVMyanR3Q1BlVW9UYmJCQWRiZFBFYkVwTkZXbmsiLCJ0aWQiOiI5NjZhYzU3Mi1mNWI3LTRiYmUtYWE4OC1jNzY0MTljMGY4NTEiLCJ1dGkiOiJfU0JPWUFJUTYwZXhWaElUQ2ViY0FBIiwidmVyIjoiMi4wIn0.DBbqqIPi28XhCDnBTMsGHl_TSt-qeQsiOgQJN0Tdr5I01gufbVAfkJ81zsIArKg53RBmednaubmkShUmJ2QgZPULlYsh5U-G0DEgzOGC8VTcxznjze9MFSVoGn9O8UcD_MfCzU7Dbwv3ets94NMsD7z2m3X213jwfYZxHyxCLK_Fvx2CYaasOJ7R3bcxu-FOkx0C4kRu858ZJWCGQaWFO-GpVDBnoneb6TEbLqAXUZ0Uq7vwlWKB7zcJQbokvZgTYTqY24o3JiU4GcElrAqVN1ONynviqZv5RIBsVLckpxHEyKFv2dubw35girvspGfhox9LEN5bDJHWuAzjKncUFQ"
  );
});

// start the Express server
app.listen(port, () => {
  /*tslint:disable*/
  console.log(`server started at http://localhost:${port}`);
});
