import { useCallback } from "react";
import { lagreKvalitetsvurdering } from "../../../tilstand/moduler/kvalitetsvurdering";

export const toggleKodeverk = (dispatch: any, klagebehandling: any) =>
  useCallback(
    ({
      kodeverkFelt,
      liste,
      id,
    }: {
      kodeverkFelt: Array<string>;
      liste: string;
      id: string;
      navn: string;
      verdi: string;
    }) => {
      let funnet = kodeverkFelt.filter((felt_id: string) => felt_id === id);
      let nyListe: string[] = [];
      if (!funnet.length) {
        nyListe = nyListe.concat(kodeverkFelt);
        nyListe.push(id);
      } else {
        nyListe = kodeverkFelt.filter((felt_id: string) => felt_id !== id);
      }
      dispatch(
        lagreKvalitetsvurdering({
          klagebehandlingId: klagebehandling.id,
          [liste]: nyListe,
        })
      );
    },
    []
  );
