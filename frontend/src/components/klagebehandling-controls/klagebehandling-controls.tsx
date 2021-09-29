import React from 'react';
import { useParams } from 'react-router-dom';
import { useGetKlagebehandlingQuery } from '../../redux-api/oppgave';
import { ControlPanel, ControlPanelLeftSide, ControlPanelRightSide } from './styled-components';
import { PanelToggles } from '../klagebehandling/types';
import { PanelToggleButtons } from './toggle-buttons';
import { UserInfo } from './user-info';
interface Params {
  id: string;
}

interface KlagebehandlingControlsProps {
  toggles: PanelToggles;
  setPanel: (panel: keyof PanelToggles, checked: boolean) => void;
}

export const KlagebehandlingControls = ({ toggles, setPanel }: KlagebehandlingControlsProps) => {
  const { id } = useParams<Params>();
  const { data: klagebehandling } = useGetKlagebehandlingQuery(id);

  if (typeof klagebehandling === 'undefined') {
    return <ControlPanel>Laster...</ControlPanel>;
  }

  const { sakenGjelderNavn, sakenGjelderFoedselsnummer, sakenGjelderKjoenn, fortrolig, strengtFortrolig } =
    klagebehandling;

  return (
    <ControlPanel>
      <ControlPanelLeftSide>
        <UserInfo
          name={sakenGjelderNavn}
          fnr={sakenGjelderFoedselsnummer}
          gender={sakenGjelderKjoenn}
          fortrolig={fortrolig}
          strengtFortrolig={strengtFortrolig}
        />
        <PanelToggleButtons togglePanel={setPanel} toggles={toggles} />
      </ControlPanelLeftSide>
      <ControlPanelRightSide>hello</ControlPanelRightSide>
    </ControlPanel>
  );
};
