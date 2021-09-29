import React from 'react';
import { Gender } from '../../redux-api/oppgave-state-types';
import { User, UserItem } from './styled-components';
import { UserGender } from './user-gender';
import { getFullNameWithFnr } from '../../domain/name';
import { LabelMain } from '../../styled-components/labels';

interface UserInfoProps {
  name: Name | null;
  fnr: string | null;
  gender: Gender | null;
  fortrolig: boolean | null;
  strengtFortrolig: boolean | null;
}

interface Name {
  fornavn?: string;
  etternavn?: string;
  mellomnavn?: string;
}

export const UserInfo = ({ name, fnr, gender, fortrolig, strengtFortrolig }: UserInfoProps) => {
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
        <Fortrolig fortrolig={fortrolig} />
        <StrengtFortrolig strengtFortrolig={strengtFortrolig} />
      </UserItem>
    </User>
  );
};

interface UserNameAndFnrProps {
  name: Name | null;
  fnr: string | null;
}

const UserNameAndFnr = ({ name, fnr }: UserNameAndFnrProps) => <span>{getFullNameWithFnr(name, fnr)}</span>;
interface FortroligProps {
  fortrolig: boolean | null;
}
interface StrengtFortroligProps {
  strengtFortrolig: boolean | null;
}

const Fortrolig = ({ fortrolig }: FortroligProps) => (fortrolig ? <LabelMain>Fortrolig</LabelMain> : null);
const StrengtFortrolig = ({ strengtFortrolig }: StrengtFortroligProps) =>
  strengtFortrolig ? <LabelMain>Strengt fortrolig</LabelMain> : null;
