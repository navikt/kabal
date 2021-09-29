import React from "react";
import { useGetKlagebehandlingQuery } from "../../../redux-api/oppgave";
import { IKlagebehandling } from "../../../redux-api/oppgave-state-types";

interface BehandlingProps {
  klagebehandling: IKlagebehandling;
}

export const Behandling = ({ klagebehandling }: BehandlingProps) => {
  const {
    klagerNavn,
    klagerVirksomhetsnavn,
    klagerVirksomhetsnummer,
    type,
    tema,
    mottattFoersteinstans,
    fraNAVEnhet,
    mottattKlageinstans,
  } = klagebehandling;

  return (
    <div>
      <h1>Behandling</h1>

      <Info label="Klager" details={klagerVirksomhetsnavn} />
    </div>
  );
};

interface InfoProps {
  label: string;
  details: string;
}

const Info = ({ label, details }: InfoProps) => (
  <div>
    <h2>{label}:</h2>
    <p>{details}</p>
  </div>
);
