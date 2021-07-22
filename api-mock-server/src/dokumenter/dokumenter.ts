import sqlite3 from "sqlite3";
import { IDbDokument, IDokument, IDokumentVedlegg } from "./types";

export async function hentDokumenter(): Promise<IDokument[]> {
  const db = new sqlite3.Database("./oppgaver.db");
  const query =
    `SELECT journalpostId, dokumentInfoId, tittel, tema, registrert, harTilgangTilArkivvariant FROM Dokumenter ORDER BY registrert DESC`.trim();
  console.debug("hentDokumenter query", query);

  const dokumenter = await new Promise<IDbDokument[]>((resolve, reject) => {
    db.all(query, (err, rows) => {
      if (err) {
        reject(err);
      }
      resolve(rows);
    });
    db.close((err) => {
      if (err !== null) {
        console.error(err.message);
      }
      console.log("Close the database connection.");
    });
  });

  return dokumenter
    .map<IDokument>((d) => ({
      ...d,
      vedlegg: [],
      harTilgangTilArkivvariant: d.harTilgangTilArkivvariant === 1,
    }))
    .reduce<IDokument[]>((nested, current) => {
      const dokument = nested.find(({ journalpostId }) => journalpostId === current.journalpostId);
      if (dokument === undefined) {
        return [...nested, current];
      }
      const vedlegg: IDokumentVedlegg = {
        dokumentInfoId: current.dokumentInfoId,
        harTilgangTilArkivvariant: current.harTilgangTilArkivvariant,
        tittel: current.tittel,
      };
      dokument.vedlegg.push(vedlegg);
      return nested;
    }, []);
}
