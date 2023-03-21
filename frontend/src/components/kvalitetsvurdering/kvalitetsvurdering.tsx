import { Heading } from '@navikt/ds-react';
import React from 'react';
import styled from 'styled-components';
import { SECTION_KEY } from '../../functions/error-type-guard';
import { useOppgave } from '../../hooks/oppgavebehandling/use-oppgave';
import { useKvalitetsvurderingEnabled } from '../../hooks/settings/use-setting';
import { useSectionTitle } from '../../hooks/use-section-title';
import { SaksTypeEnum, UtfallEnum } from '../../types/kodeverk';
import { KvalitetsvurderingVersion } from '../../types/oppgavebehandling/oppgavebehandling';
import { PanelContainer } from '../oppgavebehandling-panels/styled-components';
import { KvalitetsskjemaV1 } from './v1/kvalitetsskjema';
import { KvalitetsskjemaV2 } from './v2/kvalitetsskjema';

export const Kvalitetsvurdering = (): JSX.Element | null => {
  const header = useSectionTitle(SECTION_KEY.KVALITETSVURDERING);
  const { data: oppgave } = useOppgave();

  const utfall = oppgave?.resultat.utfall;
  const type = oppgave?.type;

  const { value: shown = true, isLoading } = useKvalitetsvurderingEnabled();

  const hideKvalitetsvurdering =
    type === SaksTypeEnum.ANKE_I_TRYGDERETTEN ||
    utfall === UtfallEnum.TRUKKET ||
    utfall === UtfallEnum.RETUR ||
    utfall === UtfallEnum.UGUNST;

  if (hideKvalitetsvurdering || !shown || isLoading) {
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

const Kvalitetsskjema = () => {
  const { data, isLoading } = useOppgave();

  if (isLoading || typeof data === 'undefined') {
    return null;
  }

  switch (data.kvalitetsvurderingReference.version) {
    case KvalitetsvurderingVersion.V1:
      return <KvalitetsskjemaV1 />;
    case KvalitetsvurderingVersion.V2:
      return <KvalitetsskjemaV2 />;
  }
};

const KvalitetsVurderingContainer = styled.div`
  padding: 16px;
  width: 400px;
`;
