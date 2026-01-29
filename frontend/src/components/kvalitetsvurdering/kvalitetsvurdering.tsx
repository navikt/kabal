import { KvalitetsskjemaV3 } from '@app/components/kvalitetsvurdering/v3/kvalitetsskjema';
import { useKvalitetsvurderingSupported } from '@app/components/oppgavebehandling-controls/use-hide-kvalitetsvurdering';
import { SECTION_TITLES, SectionKey } from '@app/functions/error-type-guard';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { useKvalitetsvurderingEnabled } from '@app/hooks/settings/use-setting';
import { type IOppgavebehandling, KvalitetsvurderingVersion } from '@app/types/oppgavebehandling/oppgavebehandling';
import { Heading, InfoCard } from '@navikt/ds-react';
import type { ReactElement } from 'react';
import { PanelContainer } from '../oppgavebehandling-panels/styled-components';
import { KvalitetsskjemaV1 } from './v1/kvalitetsskjema';
import { KvalitetsskjemaV2 } from './v2/kvalitetsskjema';

export const Kvalitetsvurdering = (): React.JSX.Element | null => {
  const { data: oppgave } = useOppgave();

  return oppgave === undefined ? null : <KvalitetsvurderingLoaded oppgave={oppgave} />;
};
export const KvalitetsvurderingLoaded = ({ oppgave }: { oppgave: IOppgavebehandling }): React.JSX.Element | null => {
  const { featureEnabled, panelDefaultEnabled, reason } = useKvalitetsvurderingSupported(oppgave);
  const { value: shown = panelDefaultEnabled } = useKvalitetsvurderingEnabled();

  if (!featureEnabled || !shown) {
    return null;
  }

  if (reason !== null) {
    return (
      <Content>
        <InfoCard data-color="info" size="small">
          <InfoCard.Header>
            <InfoCard.Title>Ingen kvalitetsvurdering</InfoCard.Title>
          </InfoCard.Header>
          <InfoCard.Content>{reason}</InfoCard.Content>
        </InfoCard>
      </Content>
    );
  }

  return (
    <Content>
      <Kvalitetsskjema />
    </Content>
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

const Content = ({ children }: { children: ReactElement }) => (
  <PanelContainer data-testid="kvalitetsvurdering-panel">
    <div className="w-165 p-4">
      <Heading level="1" size="medium" spacing>
        {SECTION_TITLES[SectionKey.KVALITETSVURDERING]}
      </Heading>

      {children}
    </div>
  </PanelContainer>
);
