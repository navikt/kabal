import { InfoCard } from '@navikt/ds-react';
import type { ReactElement } from 'react';
import { KvalitetsskjemaAnkeAfter2027 } from '@/components/kvalitetsvurdering/anke-after-2027/kvalitetsskjema';
import { KvalitetsskjemaAnkeITRAfter2027 } from '@/components/kvalitetsvurdering/anke-i-tr-after-2027/kvalitetsskjema';
import { KvalitetsskjemaV1 } from '@/components/kvalitetsvurdering/v1/kvalitetsskjema';
import { KvalitetsskjemaV2 } from '@/components/kvalitetsvurdering/v2/kvalitetsskjema';
import { KvalitetsskjemaV3 } from '@/components/kvalitetsvurdering/v3/kvalitetsskjema';
import { useKvalitetsvurderingSupported } from '@/components/oppgavebehandling-controls/use-hide-kvalitetsvurdering';
import { PanelContainer } from '@/components/oppgavebehandling-panels/panel-container';
import { useFocusPanelShortcut } from '@/components/oppgavebehandling-panels/panel-shortcuts-context';
import { SECTION_TITLES, SectionKey } from '@/functions/error-type-guard';
import { useOppgave } from '@/hooks/oppgavebehandling/use-oppgave';
import { useKvalitetsvurderingEnabled } from '@/hooks/settings/use-setting';
import { SaksTypeEnum } from '@/types/kodeverk';
import { isKakaKvalitetsvurdering, isKantKvalitetsvurdering } from '@/types/kvalitetsvurdering/common';
import { KvalitetsvurderingVersion } from '@/types/oppgavebehandling/oppgavebehandling';

export const Kvalitetsvurdering = (): React.JSX.Element | null => {
  const { featureEnabled, panelDefaultEnabled, reason } = useKvalitetsvurderingSupported();
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
  const { data, isSuccess } = useOppgave();

  if (!isSuccess) {
    return null;
  }

  if (isKakaKvalitetsvurdering(data)) {
    switch (data.kvalitetsvurderingReference.version) {
      case KvalitetsvurderingVersion.V1:
        return <KvalitetsskjemaV1 />;
      case KvalitetsvurderingVersion.V2:
        return <KvalitetsskjemaV2 />;
      case KvalitetsvurderingVersion.V3:
        return <KvalitetsskjemaV3 />;
    }
  }

  if (isKantKvalitetsvurdering(data)) {
    switch (data.typeId) {
      case SaksTypeEnum.ANKE_AFTER_2027:
      case SaksTypeEnum.ANKE:
        return <KvalitetsskjemaAnkeAfter2027 />;
      case SaksTypeEnum.ANKE_I_TRYGDERETTEN_AFTER_2027:
      case SaksTypeEnum.ANKE_I_TRYGDERETTEN:
        return <KvalitetsskjemaAnkeITRAfter2027 />;
    }
  }
};

const Content = ({ children }: { children: ReactElement }) => (
  <PanelContainer heading={SECTION_TITLES[SectionKey.KVALITETSVURDERING]}>
    <ContentInner>{children}</ContentInner>
  </PanelContainer>
);

const ContentInner = ({ children }: { children: ReactElement }) => {
  useFocusPanelShortcut(6);

  return <div className="w-165 px-4 pb-4">{children}</div>;
};
