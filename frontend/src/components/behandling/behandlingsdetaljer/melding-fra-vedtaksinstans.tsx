import { ReadMore } from '@navikt/ds-react';
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
      <ReadMore header="Les melding" size="small" defaultOpen>
        {kommentarFraVedtaksinstans}
      </ReadMore>
    </BehandlingSection>
  );
};
