import React, { useRef, useState } from 'react';
import { Gender } from '../../redux-api/oppgave-state-types';
import { User, UserItem, CopyFnrButton } from './styled-components';
import { UserGender } from './user-gender';
import { getFullNameWithFnr } from '../../domain/name';
import { LabelMain } from '../../styled-components/labels';
import { CopyIcon } from '../../icons/copy';
import { Name } from '../../domain/types';
import Popover, { PopoverOrientering } from 'nav-frontend-popover';

interface UserInfoProps {
  name: Name | null;
  fnr: string | null;
  gender: Gender | null;
  fortrolig: boolean | null;
  strengtFortrolig: boolean | null;
}

export const UserInfo = ({ name, fnr, gender, fortrolig, strengtFortrolig }: UserInfoProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const button = useRef<HTMLButtonElement>(null);

  if (name === null || fnr === null) {
    return <span>Fant ikke noe data på den saken gjelder.</span>;
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setIsOpen(true);
  };

  const ankerEl = isOpen ? button.current ?? undefined : undefined;

  return (
    <>
      <User>
        <UserItem>
          <UserGender gender={gender} />
        </UserItem>
        <UserItem>
          <UserNameAndFnr name={name} fnr={fnr} />
        </UserItem>
        <UserItem>
          <CopyFnrButton ref={button} onClick={() => copyToClipboard(fnr)}>
            <CopyIcon alt="Kopier fødselsnummer" />
          </CopyFnrButton>
        </UserItem>
        <Fortrolig fortrolig={fortrolig} />
        <StrengtFortrolig strengtFortrolig={strengtFortrolig} />
      </User>

      <Popover
        ankerEl={ankerEl}
        onRequestClose={() => setIsOpen(false)}
        orientering={PopoverOrientering.Under}
        autoFokus={false}
      >
        <span style={{ padding: '.5rem', display: 'block' }}>Kopiert</span>
      </Popover>
    </>
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

const Fortrolig = ({ fortrolig }: FortroligProps) =>
  fortrolig ? (
    <UserItem>
      <LabelMain>Fortrolig</LabelMain>
    </UserItem>
  ) : null;
const StrengtFortrolig = ({ strengtFortrolig }: StrengtFortroligProps) =>
  strengtFortrolig ? (
    <UserItem>
      <LabelMain>Strengt fortrolig</LabelMain>
    </UserItem>
  ) : null;
