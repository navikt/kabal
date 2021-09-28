import React from 'react';
import { useParams } from 'react-router-dom';
import { useGetKlagebehandlingQuery } from '../../redux-api/oppgave';
import { Gender } from '../../redux-api/oppgave-state-types';
import { ControlPanel, User, UserItem } from './styled-components';
import { UserGender } from './user-gender';
import { getFullNameWithFnr } from '../../domain/name';
import { LabelMain } from '../../styled-components/labels';
import { PanelToggles } from '../klagebehandling/types';
import { PanelToggleButtons } from './toggle-buttons';

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
      <UserInfo
        name={sakenGjelderNavn}
        fnr={sakenGjelderFoedselsnummer}
        gender={sakenGjelderKjoenn}
        fortrolig={fortrolig}
        strengtFortrolig={strengtFortrolig}
      />
      <PanelToggleButtons togglePanel={setPanel} toggles={toggles} />
    </ControlPanel>
  );
};

interface Name {
  fornavn?: string;
  etternavn?: string;
  mellomnavn?: string;
}

interface UserInfoProps {
  name: Name | null;
  fnr: string | null;
  gender: Gender | null;
  fortrolig: boolean | null;
  strengtFortrolig: boolean | null;
}

const UserInfo = ({ name, fnr, gender, fortrolig, strengtFortrolig }: UserInfoProps) => {
  if (name === null || fnr === null) {
    return <span>Fant ikke noe data på den saken gjelder.</span>;
  }
  return (
    <User>
      <UserItem>
        <UserGender gender={gender} />
      </UserItem>
      <UserItem>
        <UserNameAndFnr name={name} fnr={fnr} />
      </UserItem>
      <UserItem>
        <FortroligDisplay fortrolig={fortrolig} strengtFortrolig={strengtFortrolig} />
      </UserItem>
    </User>
  );
};

interface UserNameAndFnrProps {
  name: Name | null;
  fnr: string | null;
}

const UserNameAndFnr = ({ name, fnr }: UserNameAndFnrProps) => <span>{getFullNameWithFnr(name, fnr)}</span>;

interface StrengtFortroligDisplayProps {
  fortrolig: boolean | null;
  strengtFortrolig: boolean | null;
}

const FortroligDisplay = ({ fortrolig, strengtFortrolig }: StrengtFortroligDisplayProps) => (
  <>
    {!fortrolig ? <LabelMain>Fortrolig</LabelMain> : null}
    {!strengtFortrolig ? <LabelMain>Strengt fortrolig</LabelMain> : null}
  </>
);
