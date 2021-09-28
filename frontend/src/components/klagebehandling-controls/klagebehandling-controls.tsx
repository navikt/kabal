import React from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { useGetKlagebehandlingQuery } from '../../redux-api/oppgave';
import { Gender } from '../../redux-api/oppgave-state-types';
import { UserItem } from './styled-components';
import { UserGender } from './user-gender';
import { getFullNameWithFnr } from '../../domain/name';
import { LabelMain } from '../../styled-components/labels';

interface Params {
  id: string;
}

export const KlagebehandlingControls: React.FC = () => {
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
    </ControlPanel>
  );
};

const ControlPanel = styled.header`
  padding-top: 1em;
  padding-bottom: 1em;
  background-color: #e5e5e5;
`;

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

interface UserNameProps {
  name: Name | null;
  fnr: string | null;
}

const UserNameAndFnr = ({ name, fnr }: UserNameProps) => <span>{getFullNameWithFnr(name, fnr)}</span>;

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

const User = styled.ul`
  display: flex;
  list-style: none;
`;
