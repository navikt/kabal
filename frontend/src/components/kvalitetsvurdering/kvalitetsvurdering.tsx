import { KvalitetsskjemaV3 } from '@app/components/kvalitetsvurdering/v3/kvalitetsskjema';
import { useHideKvalitetsvurdering } from '@app/components/oppgavebehandling-controls/use-hide-kvalitetsvurdering';
import { SECTION_KEY } from '@app/functions/error-type-guard';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { useKvalitetsvurderingEnabled } from '@app/hooks/settings/use-setting';
import { useSectionTitle } from '@app/hooks/use-section-title';
import { KvalitetsvurderingVersion } from '@app/types/oppgavebehandling/oppgavebehandling';
import { Heading } from '@navikt/ds-react';
import { PanelContainer } from '../oppgavebehandling-panels/styled-components';
import { KvalitetsskjemaV1 } from './v1/kvalitetsskjema';
import { KvalitetsskjemaV2 } from './v2/kvalitetsskjema';

export const Kvalitetsvurdering = (): React.JSX.Element | null => {
  const header = useSectionTitle(SECTION_KEY.KVALITETSVURDERING);

  const { value: shown = true } = useKvalitetsvurderingEnabled();
  const hideKvalitetsvurdering = useHideKvalitetsvurdering();

  if (hideKvalitetsvurdering || !shown) {
    return null;
  }

  return (
    <PanelContainer data-testid="kvalitetsvurdering-panel">
      <div className="w-165 p-4">
        <Heading level="1" size="medium" spacing>
          {header}
        </Heading>

        <Kvalitetsskjema />
      </div>
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
    case KvalitetsvurderingVersion.V3:
      return <KvalitetsskjemaV3 />;
  }
};
