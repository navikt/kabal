import { Copy } from '@navikt/ds-icons';
import Popover, { PopoverOrientering } from 'nav-frontend-popover';
import React, { useRef, useState } from 'react';
import { getFullNameWithFnr } from '../../domain/name';
import { formatOrgNum } from '../../functions/format-id';
import { Gender } from '../../types/kodeverk';
import { IOppgavebehandlingBase, IVirksomhet } from '../../types/oppgavebehandling';
import { Fortrolig, StrengtFortrolig } from './fortrolig';
import { CopyFnrButton, User, UserItem } from './styled-components';
import { UserGender } from './user-gender';

type UserInfoProps = Pick<IOppgavebehandlingBase, 'sakenGjelder' | 'fortrolig' | 'strengtFortrolig'>;

export const UserInfo = ({ fortrolig, strengtFortrolig, sakenGjelder }: UserInfoProps) => {
  const { person, virksomhet } = sakenGjelder;

  if (person !== null) {
    return (
      <SakenGjelder
        id={person.foedselsnummer}
        name={getFullNameWithFnr(person.navn, person.foedselsnummer)}
        gender={person.kjoenn}
        strengtFortrolig={strengtFortrolig}
        fortrolig={fortrolig}
      />
    );
  }

  if (virksomhet !== null) {
    return (
      <SakenGjelder
        id={virksomhet.virksomhetsnummer}
        name={orgNameAndOrgnr(virksomhet)}
        gender={null}
        strengtFortrolig={strengtFortrolig}
        fortrolig={fortrolig}
      />
    );
  }

  return <span>Fant ikke noe data på den saken gjelder.</span>;
};

interface SakenGjelderProps extends Pick<IOppgavebehandlingBase, 'fortrolig' | 'strengtFortrolig'> {
  id: string | null;
  name: string;
  gender: Gender | null;
}

const SakenGjelder = ({ id, name, gender, fortrolig, strengtFortrolig }: SakenGjelderProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const button = useRef<HTMLButtonElement>(null);

  const copyToClipboard = (text: string | null) => {
    if (text === null) {
      return;
    }

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
        <UserItem>{name}</UserItem>
        <UserItem>
          <CopyFnrButton ref={button} onClick={() => copyToClipboard(id)}>
            <Copy title="Kopier" />
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

const orgNameAndOrgnr = ({ navn, virksomhetsnummer }: IVirksomhet): string => {
  if (navn !== null && virksomhetsnummer !== null) {
    return `${navn} ${formatOrgNum(virksomhetsnummer)}`;
  }

  if (virksomhetsnummer !== null) {
    return formatOrgNum(virksomhetsnummer);
  }

  if (navn !== null) {
    return navn;
  }

  return '';
};
