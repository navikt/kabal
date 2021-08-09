import path from "path";
import fs from "fs";
import { App } from "@tinyhttp/app";
import { logger } from "@tinyhttp/logger";
import { cors } from "@tinyhttp/cors";
import formidable, { File } from "formidable";
import { filtrerOppgaver, fradelOppgave, tildelOppgave } from "./oppgaver";
import { OppgaveQuery } from "./types";
import { getKlage, saveKlage } from "./klagebehandling/klagebehandling";
import { json, urlencoded } from "body-parser";
import { hentDokumenter } from "./dokumenter/dokumenter";

const app = new App()
  .use(cors({ origin: "*" }))
  .use(logger())
  .use(json())
  .use(urlencoded({ extended: false }));

const port = 3000; // default port to listen

app.get("/kodeverk", (req, res) => {
  let data = fs.readFileSync(path.resolve(__dirname, "../fixtures/kodeverk.json")).toString("utf8");
  const kodeverk = JSON.parse(data);
  res.send(kodeverk);
});

function isNum(value: number | string) {
  return typeof !isNaN(Number(value)) && isFinite(Number(value));
}

app.post("/ansatte/:navIdent/klagebehandlinger/personsoek", (req, res) => {
  const { soekString, start, antall } = req.body;
  if (isNum(soekString)) {
    console.log(`${soekString} er tall`);
  }
  const fileName = isNum(soekString) ? "fnrsok" : "personsok";
  const data = fs
    .readFileSync(path.resolve(__dirname, `../fixtures/${fileName}.json`))
    .toString("utf8");
  res.send(data);
});

app.get("/klagebehandlinger/:id/detaljer", async (req, res) =>
  res.send(getKlage(req.params?.id ?? ""))
);

app.get("/internal/innstillinger/:navident/:enhet", async (req, res) =>
  res.send({
    aktiveHjemler: [{ label: "Folketrygdloven", value: "1000" }],
    aktiveTyper: [],
    aktiveTemaer: [],
    aktiveFaner: {},
  })
);

app.get("/klagebehandlinger/:id/alledokumenter", async (req, res) => {
  const query = req.query;
  const forrigeSide = typeof query.forrigeSide === "string" ? query.forrigeSide : "";
  const parsedOffset = Number.parseInt(forrigeSide, 10);
  const offset = Number.isNaN(parsedOffset) ? 0 : parsedOffset;

  try {
    const alleDokumenter = await hentDokumenter();
    const dokumenter = alleDokumenter.slice(offset, offset + 10);
    res.json({
      dokumenter,
      pageReference: offset + dokumenter.length,
      antall: dokumenter.length,
      totaltAntall: alleDokumenter.length,
    });
  } catch (e) {
    res.status(500).json(e);
  }
});

app.get("/klagebehandlinger/:id/dokumenter", async (req, res) => {
  if (req.params?.id === undefined) {
    res.sendStatus(404);
    return;
  }
  const klage = getKlage(req.params.id);

  const alleDokumenter = await hentDokumenter();

  const dokumenter = alleDokumenter.filter(({ journalpostId, dokumentInfoId, vedlegg }) =>
    klage.tilknyttedeDokumenter.some((t) => {
      return (
        (t.journalpostId === journalpostId && t.dokumentInfoId === dokumentInfoId) ||
        (t.journalpostId === journalpostId &&
          vedlegg.some((v) => v.dokumentInfoId === t.dokumentInfoId))
      );
    })
  );

  await sleep(2000);

  res.json({
    dokumenter,
    pageReference: null,
    antall: dokumenter.length,
    totaltAntall: dokumenter.length,
  });
});

app.get("/ansatte/:id/oppgaver", async (req, res) => {
  const result = await filtrerOppgaver({
    navIdent: req.params?.id,
    ...req.query,
  } as OppgaveQuery);
  res.send(result);
});

app.get("/klagebehandlinger/:id/journalposter/:journalPostId/dokumenter/:dokumentId", (req, res) =>
  res.sendFile(path.resolve(__dirname, "../fixtures/testdocument.pdf"))
);

app.get("/ansatte/:id/klagebehandlinger", async (req, res) => {
  const result = await filtrerOppgaver({
    navIdent: req.params?.id,
    ...req.query,
  } as OppgaveQuery);
  res.send(result);
});

app.post("/internal/elasticadmin/rebuild", async (req, res) => {
  let random = Math.floor(Math.random() * 2);
  if (random === 0) return res.status(403).send("");
  else return res.status(200).send("");
});

app.get("/ansatte/:id/antallklagebehandlingermedutgaattefrister", async (req, res) => res.send([]));

app.get("/ansatte/:id/enheter", async (req, res) =>
  res.send([
    {
      id: "4291",
      navn: "NAV Klageinstans Oslo og Akershus",
      lovligeTemaer: ["43", "27"],
    },
    { id: "4293", navn: "NAV Klageinstans øst", lovligeTemaer: ["27", "43"] },
    { id: "4295", navn: "NAV Klageinstans nord", lovligeTemaer: ["27", "43"] },
    { id: "0118", navn: "NAV Aremark", lovligeTemaer: [] },
  ])
);

app.get("/ansatte/:id/valgtenhet", async (req, res) =>
  res.send({
    id: "4291",
    navn: "NAV Klageinstans Oslo og Akershus",
    lovligeTemaer: ["43", "27"],
  })
);

app.get("/featuretoggle/:feature", (req, res) => {
  if (req.params?.feature === "klage.generellTilgang") res.status(200).send("true");
  else if (req.params?.feature === "klage.admin") res.status(200).send("true");
  else res.status(200).send("false");
});

app.get("/aapenfeaturetoggle/:feature", (req, res) => {
  console.log(req.params?.feature);
  if (req.params?.feature === "klage.generellTilgang") res.status(200).send("true");
  else res.status(200).send("false");
});

// Slette vedtak.
app.delete("/klagebehandlinger/:klagebehandlingId/vedtak/:vedtakId/vedlegg", async (req, res) => {
  await sleep(1000);
  res.sendStatus(200);
});

//tildeling saksbehandler oppgave
app.post(
  "/ansatte/:navIdent/klagebehandlinger/:oppgaveId/saksbehandlertildeling",
  async (req, res) => {
    const err = await tildelOppgave(req.params!.oppgaveId, req.params!.navIdent);
    if (err) res.status(500).send(JSON.stringify(err));
    else res.send("OK");
  }
);
//tildeling saksbehandler oppgave
app.post(
  "/ansatte/:navIdent/klagebehandlinger/:oppgaveId/saksbehandlerfradeling",
  async (req, res) => {
    const err = await fradelOppgave(req.params!.oppgaveId);
    if (err) res.status(500).send(JSON.stringify(err));
    else res.send("OK");
  }
);

// Opplasting av vedtak.
app.post(
  "/klagebehandlinger/:klagebehandlingId/vedtak/:vedtakId/vedlegg",
  async (req, res, next) => {
    const form = formidable({
      multiples: true,
      allowEmptyFiles: true,
      keepExtensions: true,
      maxFields: 3,
    });
    // @ts-ignore
    form.parse(req, async (err, fields, files) => {
      if (typeof err !== "undefined" && err !== null) {
        console.error("Upload error", err);
        if (next) {
          next(err);
        }
        return;
      }

      let vedlegg: File | null = null;

      if (Array.isArray(files.vedlegg)) {
        if (files.vedlegg.length !== 1) {
          res.status(400).send(`Too many files uploaded. ${files.vedlegg.length}`);
          return;
        }
        vedlegg = files.vedlegg[0];
      } else {
        vedlegg = files.vedlegg;
      }

      if (!vedlegg.name?.endsWith(".pdf") ?? false) {
        res.status(400).send(`Wrong file extension. ${vedlegg.name}`);
        return;
      }

      const { journalfoerendeEnhet, klagebehandlingVersjon } = fields;

      if (typeof journalfoerendeEnhet === "undefined" || journalfoerendeEnhet.length === 0) {
        res.status(400).send("Missing journalfoerendeEnhet.");
        return;
      }

      if (typeof klagebehandlingVersjon === "undefined" || klagebehandlingVersjon.length === 0) {
        res.status(400).send("Missing klagebehandlingVersjon.");
        return;
      }

      await sleep(1000);

      res.status(200).json({
        id: "UUID",
        modified: new Date().toISOString(),
        klagebehandlingVersjon: 0,
        file: {
          name: vedlegg.name,
          size: vedlegg.size,
          opplastet: new Date().toISOString(),
        },
      });
    });
  }
);

app.put("/klagebehandlinger/:klagebehandlingid/detaljer/editerbare", async (req, res) => {
  try {
    res.status(200).json(saveKlage(req.body));
  } catch (e) {
    res.status(409).json({
      message: e.message,
    });
  }
});

app.post("/klagebehandlinger/:klagebehandlingid/vedtak/:vedtakid/fullfoer", async (req, res) => {
  await sleep(500);
  const { journalfoerendeEnhet, klagebehandlingVersjon } = req.body;
  if (typeof journalfoerendeEnhet !== "string" || journalfoerendeEnhet.length === 0) {
    res.sendStatus(400);
    return;
  }
  if (typeof klagebehandlingVersjon !== "number") {
    res.sendStatus(400);
    return;
  }
  if (
    typeof req.params?.klagebehandlingid !== "string" ||
    req.params.klagebehandlingid.length === 0
  ) {
    res.status(404).send(`Klagebehandling med id "${req.params?.klagebehandlingid}" ikke funnet.`);
    return;
  }
  const klage = getKlage(req.params.klagebehandlingid);
  res.json({
    ...klage,
    avsluttetAvSaksbehandler: "2021-05-17T15:00:59",
  });
});

app.get("/ansatte/:id/medunderskrivere/:tema", (req, res) =>
  delay(
    () =>
      res.json({
        tema: req.params?.tema ?? "UKJENT_TEMA",
        medunderskrivere: [
          {
            navn: "Ingrid Oksavik",
            ident: "123",
          },
          {
            navn: "Saksbehandler A",
            ident: "a",
          },
          {
            navn: "Saksbehandler B",
            ident: "b",
          },
          {
            navn: "Saksbehandler C",
            ident: "c",
          },
        ],
      }),
    500
  )
);

app.put("/klagebehandlinger/:id/detaljer/medunderskriverident", (req, res) =>
  delay(
    () =>
      res.json({
        medunderskriverident: req.body.medunderskriverident,
      }),
    500
  )
);

// define a route handler for the default home page
app.get("/token", (req, res) => {
  res.send(require("../fixtures/token.txt"));
});
// define a route handler for the default home page
app.get("/me", (req, res) => {
  res.send(require("../fixtures/me.json"));
});

// start the Express server
app.listen(
  port,
  () => {
    console.log(`server started at http://localhost:${port}`);
  },
  "0.0.0.0"
);

const delay = async (fn: () => void, ms: number) => {
  await sleep(ms);
  return fn();
};

const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));
