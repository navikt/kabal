import React from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { useGetKlagebehandlingQuery, useUpdateKlagebehandlingMutation } from '../../redux-api/oppgave';
import { IKlagebehandlingUpdate } from '../../redux-api/oppgave-types';
import { Behandling } from '../behandling/behandling';
import { Dokumenter } from '../dokumenter/dokumenter';
import { PanelToggles } from '../klagebehandling/types';
import { Kvalitetsvurdering } from '../kvalitetsvurdering/kvalitetsvurdering';

interface KlagebehandlingPanelsProps {
  toggles: PanelToggles;
}

export const KlagebehandlingPanels = ({ toggles }: KlagebehandlingPanelsProps): JSX.Element => {
  //   const [fullvisning, settFullvisning] = useState<boolean>(true);
  //   useKlagebehandlingUpdater(klagebehandling);
  const { id } = useParams<{ id: string }>();
  const { data: klagebehandling, isLoading } = useGetKlagebehandlingQuery(id);
  const [updateKlagebehandling, updateState] = useUpdateKlagebehandlingMutation();

  const onChange = (update: Partial<IKlagebehandlingUpdate>) => {
    if (typeof klagebehandling === 'undefined') {
      return;
    }

    const fullUpdate: IKlagebehandlingUpdate = {
      klagebehandlingId: klagebehandling.id,
      hjemler: klagebehandling.hjemler,
      tilknyttedeDokumenter: klagebehandling.tilknyttedeDokumenter,
      utfall: klagebehandling.vedtaket.utfall,
      ...update,
      klagebehandlingVersjon: klagebehandling.klagebehandlingVersjon,
    };

    if (updateState.isLoading) {
      return;
    }

    updateKlagebehandling(fullUpdate);
  };

  return (
    <PageContainer data-testid={'behandlingsdetaljer'}>
      <Dokumenter shown={toggles.documents} onCheck={onChange} />
      <Behandling
        shown={toggles.behandling}
        klagebehandling={klagebehandling}
        onChange={onChange}
        isLoading={isLoading}
      />
      <Kvalitetsvurdering shown={toggles.kvalitetsvurdering} />

      {/*
      <Kvalitetsvurdering skjult={!faner.kvalitetsvurdering.checked} klagebehandling={klagebehandling} />
      <FullforVedtak skjult={!faner.vedtak.checked} klagebehandling={klagebehandling} />
    */}
    </PageContainer>
  );
};

const PageContainer = styled.main`
  display: flex;
  margin: 0 0.25em 0 0;
  height: calc(100% - 3em);
  overflow-x: scroll;
  overflow-y: hidden;
  padding-bottom: 0.5em;
  padding-left: 8px;
  padding-right: 8px;

  @media screen and (max-width: 1400px) {
    height: calc(100% - 6.25em);
  }
`;
