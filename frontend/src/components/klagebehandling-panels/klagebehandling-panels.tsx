import React, { useCallback, useState } from 'react';
import styled from 'styled-components';
import { useKlagebehandlingId } from '../../hooks/use-klagebehandling-id';
import { useKlagebehandlingUpdater } from '../../hooks/use-klagebehandling-update';
import { useGetKlagebehandlingQuery } from '../../redux-api/oppgave';
import { IKlagebehandlingUpdate } from '../../redux-api/oppgave-types';
import { Behandling } from '../behandling/behandling';
import { Dokumenter } from '../dokumenter/dokumenter';
import { PanelToggles } from '../klagebehandling/types';
import { Kvalitetsvurdering } from '../kvalitetsvurdering/kvalitetsvurdering';

interface KlagebehandlingPanelsProps {
  toggles: PanelToggles;
}

export const KlagebehandlingPanels = ({ toggles }: KlagebehandlingPanelsProps): JSX.Element => {
  const klagebehandlingId = useKlagebehandlingId();
  const { data: klagebehandling, isLoading } = useGetKlagebehandlingQuery(klagebehandlingId);
  const [stateUpdate, setUpdate] = useState<IKlagebehandlingUpdate | null>(null);

  useKlagebehandlingUpdater(klagebehandlingId, stateUpdate);

  const onChange = useCallback(
    (update: Partial<IKlagebehandlingUpdate>) => {
      if (typeof klagebehandling === 'undefined') {
        return;
      }

      console.debug('UPDATE', klagebehandling.klagebehandlingVersjon, update);

      const fullUpdate: IKlagebehandlingUpdate = {
        klagebehandlingId,
        hjemler: klagebehandling.vedtaket.hjemler,
        klagebehandlingVersjon: klagebehandling.klagebehandlingVersjon,
        tilknyttedeDokumenter: klagebehandling.tilknyttedeDokumenter,
        utfall: klagebehandling.vedtaket.utfall,
        ...stateUpdate,
        ...update,
      };

      setUpdate(fullUpdate);
    },
    [klagebehandlingId, klagebehandling, stateUpdate]
  );

  return (
    <PageContainer data-testid={'behandlingsdetaljer'}>
      <Dokumenter shown={toggles.documents} onChange={onChange} />
      <Behandling
        shown={toggles.behandling}
        klagebehandling={klagebehandling}
        onChange={onChange}
        isLoading={isLoading}
      />
      <Kvalitetsvurdering shown={toggles.kvalitetsvurdering} />
    </PageContainer>
  );
};

const PageContainer = styled.main`
  /* display: grid;
  grid-auto-flow: column;
  grid-auto-columns: max-content; */
  display: flex;
  width: 100%;
  margin: 0 0.25em 0 0;
  height: calc(100vh - 9em);
  overflow-x: scroll;
  overflow-y: hidden;
  padding-bottom: 1em;
  padding-left: 8px;
  padding-right: 8px;

  @media screen and (max-width: 1400px) {
    height: calc(100vh - 6.25em);
  }
`;
