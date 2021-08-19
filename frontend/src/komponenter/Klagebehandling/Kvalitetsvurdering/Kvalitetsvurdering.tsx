import React, { useCallback, useEffect, useRef } from "react";
import Hjelpetekst from "nav-frontend-hjelpetekst";
import { Beholder } from "../FullfoerVedtak/styled-components/beholder";
import { Title } from "../FullfoerVedtak/styled-components/title";
import { Row } from "../../../styled-components/Row";
import { useAppDispatch, useAppSelector } from "../../../tilstand/konfigurerTilstand";
import {
  hentKvalitetsvurdering,
  IKvalitetsvurdering,
  lagreKvalitetsvurdering,
} from "../../../tilstand/moduler/kvalitetsvurdering";
import NavFrontendSpinner from "nav-frontend-spinner";
import { velgKvalitetsvurdering } from "../../../tilstand/moduler/kvalitetsvurdering.velgere";
import { velgKodeverk } from "../../../tilstand/moduler/kodeverk.velgere";
import {
  DokumentCheckbox,
  Header,
  InfoKnapp,
  SubHeader,
} from "../../../styled-components/Kvalitetsvurdering";
import { FullforVedtakProps } from "../../../tilstand/moduler/klagebehandling/types";
import { Vurderingspunkter } from "./Vurderingspunkter";
import { toggleKodeverk } from "./toggleKodeverk";

export const Kvalitetsvurdering = ({ skjult, klagebehandling }: FullforVedtakProps) => {
  if (skjult) {
    return null;
  }
  const dispatch = useAppDispatch();
  const kvalitetsvurdering: IKvalitetsvurdering = useAppSelector(velgKvalitetsvurdering);
  const refListe1 = useRef(null);
  const refListe2 = useRef(null);
  const refListe3 = useRef(null);
  const kodeverk = useAppSelector(velgKodeverk);

  useEffect(() => {
    dispatch(hentKvalitetsvurdering(klagebehandling.id));
  }, [klagebehandling.id]);

  const lagre = useCallback((navn, verdi) => {
    dispatch(
      lagreKvalitetsvurdering({
        klagebehandlingId: klagebehandling.id,
        [navn]: verdi,
      })
    );
  }, []);

  if (!kvalitetsvurdering.hentet) {
    return (
      <Beholder>
        <Title>Kvalitetsvurdering</Title>
        <NavFrontendSpinner />
      </Beholder>
    );
  }

  return (
    <Beholder>
      <Title>Kvalitetsvurdering</Title>

      <Vurderingspunkter
        refHandler={refListe1}
        tittel={"Oversendelsesbrev"}
        undertittel={"Kvalitet på oversendelsesbrev"}
        felt={"kvalitetOversendelsesbrevBra"}
        kvalitetsvurdering={kvalitetsvurdering}
        tekstfelt={"kommentarOversendelsesbrev"}
        avviksNavn={"kvalitetsavvikOversendelsesbrev"}
        avviksTittel={"Hva er kvalitetsavviket i oversendelsesbrevet?"}
        kodeverkFelter={kodeverk.kodeverk.kvalitetsavvikOversendelsesbrev}
        lagre={lagre}
        toggleKodeverk={toggleKodeverk}
      />

      <Vurderingspunkter
        refHandler={refListe2}
        tittel={"Utredning"}
        undertittel={"Kvalitet på utredningen"}
        felt={"kvalitetUtredningBra"}
        kvalitetsvurdering={kvalitetsvurdering}
        tekstfelt={"kommentarUtredning"}
        avviksNavn={"kvalitetsavvikUtredning"}
        avviksTittel={"Hva er kvalitetsavviket i utredningen?"}
        kodeverkFelter={kodeverk.kodeverk.kvalitetsavvikUtredning}
        lagre={lagre}
        toggleKodeverk={toggleKodeverk}
      />

      <Vurderingspunkter
        refHandler={refListe3}
        tittel={"Vedtak"}
        undertittel={"Kvalitet på vedtak"}
        felt={"kvalitetVedtakBra"}
        kvalitetsvurdering={kvalitetsvurdering}
        tekstfelt={"kommentarVedtak"}
        avviksNavn={"kvalitetsavvikVedtak"}
        avviksTittel={"Hva er kvalitetsavviket i vedtaket?"}
        kodeverkFelter={kodeverk.kodeverk.kvalitetsavvikVedtak}
        lagre={lagre}
        toggleKodeverk={toggleKodeverk}
      />

      <SubHeader>
        Avvik <Hjelpetekst>Innholdet vil vises når brukeren klikker på knappen.</Hjelpetekst>
      </SubHeader>
      <DokumentCheckbox
        label={"Betydelig avvik med konsekvens for søker"}
        onChange={() => lagre("avvikStorKonsekvens", !kvalitetsvurdering.avvikStorKonsekvens)}
        defaultChecked={kvalitetsvurdering.avvikStorKonsekvens === true}
      />
      {(() => {
        /**
         * Forutsetning: Vises hvis enten Vedtak eller Utredningen er markert med “Bra/Godt nok”
         * */
        if (
          kvalitetsvurdering.kvalitetVedtakBra === false ||
          kvalitetsvurdering.kvalitetUtredningBra === false
        ) {
          return (
            <>
              <SubHeader>
                Annet{" "}
                <Hjelpetekst>Innholdet vil vises når brukeren klikker på knappen.</Hjelpetekst>
              </SubHeader>
              <DokumentCheckbox
                label={"Bruk gjerne dette som eksempel i opplæring"}
                onChange={() =>
                  lagre(
                    "brukSomEksempelIOpplaering",
                    !kvalitetsvurdering.brukSomEksempelIOpplaering
                  )
                }
                defaultChecked={kvalitetsvurdering.brukSomEksempelIOpplaering === true}
              />
            </>
          );
        }
        return null;
      })()}
    </Beholder>
  );
};
