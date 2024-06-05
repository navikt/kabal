import { Heading } from '@navikt/ds-react';
import { styled } from 'styled-components';
import { useHideKvalitetsvurdering } from '@app/components/oppgavebehandling-controls/use-hide-kvalitetsvurdering';
import { SECTION_KEY } from '@app/functions/error-type-guard';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { useKvalitetsvurderingEnabled } from '@app/hooks/settings/use-setting';
import { useSectionTitle } from '@app/hooks/use-section-title';
import { KvalitetsvurderingVersion } from '@app/types/oppgavebehandling/oppgavebehandling';
import { PanelContainer } from '../oppgavebehandling-panels/styled-components';
import { KvalitetsskjemaV1 } from './v1/kvalitetsskjema';
import { KvalitetsskjemaV2 } from './v2/kvalitetsskjema';

export const Kvalitetsvurdering = (): JSX.Element | null => {
  const header = useSectionTitle(SECTION_KEY.KVALITETSVURDERING);

  const { value: shown = true } = useKvalitetsvurderingEnabled();
  const hideKvalitetsvurdering = useHideKvalitetsvurdering();

  if (hideKvalitetsvurdering || !shown) {
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
