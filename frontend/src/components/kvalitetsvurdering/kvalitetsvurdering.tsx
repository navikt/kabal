import NavFrontendSpinner from 'nav-frontend-spinner';
import React from 'react';
import { useParams } from 'react-router-dom';
import { useGetKvalitetsvurderingQuery } from '../../redux-api/kvalitetsvurdering';
import { PanelContainer } from '../klagebehandling-panels/panel';
import { Annet } from './annet';
import { Avvik } from './avvik';
import { Oversendelsesbrev } from './oversendelsesbrev/oversendelsesbrev';
import { Header, KvalitetsVurderingContainer } from './styled-components';
import { Utredning } from './utredning/utredning';
import { Vedtak } from './vedtak/vedtak';

interface KvalitetsvurderingProps {
  shown: boolean;
}

export const Kvalitetsvurdering = ({ shown }: KvalitetsvurderingProps): JSX.Element | null => {
  const { id } = useParams<{ id: string }>();
  const { data: kvalitetsvurdering, isLoading } = useGetKvalitetsvurderingQuery(id);

  if (!shown) {
    return null;
  }

  if (isLoading || typeof kvalitetsvurdering === 'undefined') {
    return <NavFrontendSpinner />;
  }

  const showAvvik: boolean =
    kvalitetsvurdering.kvalitetUtredningBra === false || kvalitetsvurdering.kvalitetVedtakBra === false;

  const showAnnet: boolean =
    kvalitetsvurdering.kvalitetUtredningBra === true || kvalitetsvurdering.kvalitetVedtakBra === true;

  return (
    <PanelContainer width={47}>
      <KvalitetsVurderingContainer>
        <Header>Kvalitetsskjema</Header>
        <Oversendelsesbrev />
        <Utredning />
        <Vedtak />
        <Avvik show={showAvvik} />
        <Annet show={showAnnet} />
      </KvalitetsVurderingContainer>
    </PanelContainer>
  );
};
