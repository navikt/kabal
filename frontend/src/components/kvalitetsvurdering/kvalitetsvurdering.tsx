import { Heading } from '@navikt/ds-react';
import React from 'react';
import { styled } from 'styled-components';
import { SECTION_KEY } from '@app/functions/error-type-guard';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { useKvalitetsvurderingEnabled } from '@app/hooks/settings/use-setting';
import { useSectionTitle } from '@app/hooks/use-section-title';
import { SaksTypeEnum, UtfallEnum } from '@app/types/kodeverk';
import { KvalitetsvurderingVersion } from '@app/types/oppgavebehandling/oppgavebehandling';
import { PanelContainer } from '../oppgavebehandling-panels/styled-components';
import { KvalitetsskjemaV1 } from './v1/kvalitetsskjema';
import { KvalitetsskjemaV2 } from './v2/kvalitetsskjema';

export const Kvalitetsvurdering = (): JSX.Element | null => {
  const header = useSectionTitle(SECTION_KEY.KVALITETSVURDERING);
  const { data: oppgave, isLoading: oppgaveIsLoading } = useOppgave();

  const { value: shown = true, isLoading } = useKvalitetsvurderingEnabled();

  if (oppgaveIsLoading || typeof oppgave === 'undefined') {
    return null;
  }

  const { utfallId } = oppgave.resultat;
  const { typeId } = oppgave;

  const hideKvalitetsvurdering =
    oppgave.kvalitetsvurderingReference === null ||
    typeId === SaksTypeEnum.ANKE_I_TRYGDERETTEN ||
    utfallId === UtfallEnum.TRUKKET ||
    utfallId === UtfallEnum.RETUR ||
    utfallId === UtfallEnum.UGUNST ||
    oppgave?.feilregistrering !== null;

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

  if (isLoading || typeof data === 'undefined' || data.kvalitetsvurderingReference === null) {
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
