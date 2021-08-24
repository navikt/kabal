import React from "react";
import styled from "styled-components";
import { temaOversettelse, typeOversettelse } from "../../../../domene/forkortelser";
import { HeaderRow, Section } from "../../../../styled-components/Row-styled";
import { useAppSelector } from "../../../../tilstand/konfigurerTilstand";
import { velgKlagebehandling } from "../../../../tilstand/moduler/klagebehandling/selectors";
import { FraNavEnhet } from "./FraNavEnhet";
import { MottattFoersteinstans } from "./MottattFoersteinstans";
import { OversendtKA } from "./OversendtKA";
import { faaFulltNavnMedFnr } from "./navn";
import { InfofeltStatisk } from "../InfofeltStatisk";
import { IKlagebehandling } from "../../../../tilstand/moduler/klagebehandling/stateTypes";

export const Behandling = () => (
  <>
    <HeaderRow>
      <h1>Behandling</h1>
    </HeaderRow>
    <div>
      <Section>
        <Klager />
      </Section>
      <Section>
        <TyperTemaer />
      </Section>
      <Section>
        <MottattFoersteinstans />
      </Section>
      <Section>
        <FraNavEnhet />
      </Section>
      <Section>
        <OversendtKA />
      </Section>
      <Section>
        <VurderingFraFoersteinstans />
      </Section>
    </div>
  </>
);

const Klager = () => {
  const klagebehandling = useAppSelector(velgKlagebehandling);
  const info = getKlager(klagebehandling);
  return <InfofeltStatisk header="Klager" info={info} />;
};

const getKlager = (klagebehandling: IKlagebehandling | null): string => {
  if (klagebehandling === null) {
    return "-";
  }
  const { klagerNavn, klagerFoedselsnummer, klagerVirksomhetsnavn, klagerVirksomhetsnummer } =
    klagebehandling;
  if (klagerNavn !== null && klagerFoedselsnummer !== null) {
    return faaFulltNavnMedFnr(klagerNavn, klagerFoedselsnummer);
  }
  if (klagerVirksomhetsnavn !== null && klagerVirksomhetsnummer !== null) {
    return `${klagerVirksomhetsnavn} (${klagerVirksomhetsnummer})`;
  }
  return "-";
};

const VurderingFraFoersteinstans = () => {
  const klagebehandling = useAppSelector(velgKlagebehandling);
  return (
    <InfofeltStatisk
      header="Melding fra førsteinstans for intern bruk"
      info={klagebehandling?.kommentarFraFoersteinstans || "-"}
    />
  );
};

const TyperTemaer = () => {
  const klagebehandling = useAppSelector(velgKlagebehandling);

  return (
    <Behandlingsinformasjon>
      <div>
        <b>Type:</b>
        <ul className={"detaljliste"}>
          <li>
            <div className={"etikett etikett--type"}>
              {typeOversettelse(klagebehandling?.type) ?? "-"}
            </div>
          </li>
        </ul>
      </div>

      <div>
        <b>Tema:</b>
        <ul className={"detaljliste"}>
          <li>
            <div className={"etikett etikett--sykepenger"}>
              {temaOversettelse(klagebehandling?.tema) ?? "-"}
            </div>
          </li>
        </ul>
      </div>
    </Behandlingsinformasjon>
  );
};

const Behandlingsinformasjon = styled.div`
  display: flex;
  justify-content: space-between;
`;
