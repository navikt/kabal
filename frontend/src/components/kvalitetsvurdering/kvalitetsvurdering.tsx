import NavFrontendSpinner from 'nav-frontend-spinner';
import React from 'react';
import { useKlagebehandlingId } from '../../hooks/use-klagebehandling-id';
import { useGetKvalitetsvurderingQuery } from '../../redux-api/kvalitetsvurdering';
import { PanelContainer } from '../klagebehandling-panels/panel';
import { Annet } from './annet/annet';
import { Avvik } from './avvik';
import { Oversendelsesbrev } from './oversendelsesbrev/oversendelsesbrev';
import { Header, KvalitetsVurderingContainer } from './styled-components';
import { Utredning } from './utredning/utredning';
import { Vedtak } from './vedtak/vedtak';

interface KvalitetsvurderingProps {
  shown: boolean;
}

export const Kvalitetsvurdering = ({ shown }: KvalitetsvurderingProps): JSX.Element | null => {
  const klagebehandlingId = useKlagebehandlingId();
  const { data: kvalitetsvurdering, isLoading } = useGetKvalitetsvurderingQuery(klagebehandlingId);

  if (!shown) {
    return null;
  }

  if (isLoading || typeof kvalitetsvurdering === 'undefined') {
    return (
      <PanelContainer data-testid="kvalitetsvurdering-panel">
        <KvalitetsVurderingContainer>
          <Header>Kvalitetsvurdering</Header>
          <NavFrontendSpinner />
        </KvalitetsVurderingContainer>
      </PanelContainer>
    );
  }

  const showAvvik: boolean =
    kvalitetsvurdering.kvalitetUtredningBra === false || kvalitetsvurdering.kvalitetVedtakBra === false;

  const showAnnet: boolean =
    kvalitetsvurdering.kvalitetUtredningBra === true || kvalitetsvurdering.kvalitetVedtakBra === true;

  return (
    <PanelContainer data-testid="kvalitetsvurdering-panel">
      <KvalitetsVurderingContainer>
        <Header>Kvalitetsvurdering</Header>
        <Oversendelsesbrev />
        <Utredning />
        <Vedtak />
        <Avvik show={showAvvik} />
        <Annet show={showAnnet} />
      </KvalitetsVurderingContainer>
    </PanelContainer>
  );
};
