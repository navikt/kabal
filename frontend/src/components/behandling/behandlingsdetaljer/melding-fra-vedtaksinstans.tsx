import React from 'react';
import { BehandlingSection } from './behandling-section';

interface Props {
  kommentarFraVedtaksinstans: string | null;
}

export const MeldingFraVedtaksinstans = ({ kommentarFraVedtaksinstans }: Props) => {
  if (kommentarFraVedtaksinstans === null || kommentarFraVedtaksinstans.length === 0) {
    return null;
  }

  return (
    <BehandlingSection label="Melding fra vedtaksinstans for intern bruk">
      {kommentarFraVedtaksinstans}
    </BehandlingSection>
  );
};
