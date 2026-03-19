import { Heading, InfoCard } from '@navikt/ds-react';
import type { ReactElement } from 'react';
import { KvalitetsskjemaV1 } from '@/components/kvalitetsvurdering/v1/kvalitetsskjema';
import { KvalitetsskjemaV2 } from '@/components/kvalitetsvurdering/v2/kvalitetsskjema';
import { KvalitetsskjemaV3 } from '@/components/kvalitetsvurdering/v3/kvalitetsskjema';
import { useKvalitetsvurderingSupported } from '@/components/oppgavebehandling-controls/use-hide-kvalitetsvurdering';
import { PanelContainer } from '@/components/oppgavebehandling-panels/panel-container';
import { useFocusPanelShortcut } from '@/components/oppgavebehandling-panels/panel-shortcuts-context';
import { SECTION_TITLES, SectionKey } from '@/functions/error-type-guard';
import { useOppgave } from '@/hooks/oppgavebehandling/use-oppgave';
import { useKvalitetsvurderingEnabled } from '@/hooks/settings/use-setting';
import { type IOppgavebehandling, KvalitetsvurderingVersion } from '@/types/oppgavebehandling/oppgavebehandling';

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
    <ContentInner>{children}</ContentInner>
  </PanelContainer>
);

const ContentInner = ({ children }: { children: ReactElement }) => {
  useFocusPanelShortcut(6);

  return (
    <div className="w-165 p-4">
      <Heading level="1" size="medium" spacing>
        {SECTION_TITLES[SectionKey.KVALITETSVURDERING]}
      </Heading>

      {children}
    </div>
  );
};
