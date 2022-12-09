import { Heading } from '@navikt/ds-react';
import React from 'react';
import { SECTION_KEY } from '../../functions/error-type-guard';
import { useSectionTitle } from '../../hooks/use-section-title';
import { PanelContainer } from '../oppgavebehandling-panels/styled-components';
import { Kvalitetsskjema } from './v1/kvalitetsskjema';
import { KvalitetsVurderingContainer } from './v1/styled-components';

interface KvalitetsvurderingProps {
  shown: boolean;
}

export const Kvalitetsvurdering = ({ shown }: KvalitetsvurderingProps): JSX.Element | null => {
  const header = useSectionTitle(SECTION_KEY.KVALITETSVURDERING);

  if (!shown) {
    return null;
  }

  return (
    <PanelContainer data-testid="kvalitetsvurdering-panel">
      <KvalitetsVurderingContainer>
        <Heading level="1" size="medium" spacing>
          {header}
        </Heading>

        <Kvalitetsskjema />
      </KvalitetsVurderingContainer>
    </PanelContainer>
  );
};
