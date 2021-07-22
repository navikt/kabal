import { klagebehandlingDetaljerView } from "./klagebehandlingDetaljerView";
import { Editerbare, IKlagebehandling } from "./types";

const klager: Map<string, IKlagebehandling> = new Map();

export const getKlage = (id: string): IKlagebehandling => {
  const klage = klager.get(id);
  if (klage !== undefined) {
    return klage;
  }
  const newKlage = { ...klagebehandlingDetaljerView, id };
  klager.set(id, newKlage);
  return newKlage;
};

export const saveKlage = (oppdatering: Editerbare) => {
  if (
    typeof oppdatering.klagebehandlingId !== "string" ||
    oppdatering.klagebehandlingId.length === 0
  ) {
    throw new Error("KlagebehandlingID mangler");
  }
  const klage = getKlage(oppdatering.klagebehandlingId);
  if (klage.klagebehandlingVersjon !== oppdatering.klagebehandlingVersjon) {
    throw new Error("Feil klageversjon");
  }

  const oppdatert: IKlagebehandling = {
    ...klage,
    klagebehandlingVersjon: klage.klagebehandlingVersjon + 1,
    modified: new Date().toISOString(),
    internVurdering: oppdatering.internVurdering,
    tilknyttedeDokumenter: oppdatering.tilknyttedeDokumenter,
    vedtak: [
      {
        ...klage.vedtak[0],
        grunn: oppdatering.grunn,
        hjemler: oppdatering.hjemler,
        utfall: oppdatering.utfall,
      },
    ],
  };

  klager.set(oppdatering.klagebehandlingId, oppdatert);

  return {
    klagebehandlingVersjon: oppdatert.klagebehandlingVersjon,
    modified: oppdatert.modified,
  };
};
