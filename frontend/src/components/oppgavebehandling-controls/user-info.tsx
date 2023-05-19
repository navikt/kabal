import { FilesIcon } from '@navikt/aksel-icons';
import { Popover } from '@navikt/ds-react';
import React, { useRef, useState } from 'react';
import { formatFoedselsnummer } from '@app/functions/format-id';
import { SexEnum } from '@app/types/kodeverk';
import { IOppgavebehandlingBase } from '@app/types/oppgavebehandling/oppgavebehandling';
import { Fortrolig, StrengtFortrolig } from './fortrolig';
import { CopyFnrButton, User, UserItem } from './styled-components';
import { UserSex } from './user-sex';

type UserInfoProps = Pick<IOppgavebehandlingBase, 'sakenGjelder' | 'fortrolig' | 'strengtFortrolig'>;

export const UserInfo = ({ fortrolig, strengtFortrolig, sakenGjelder }: UserInfoProps) => (
  <SakenGjelder
    id={sakenGjelder.id}
    name={`${sakenGjelder.name ?? '-'} (${formatFoedselsnummer(sakenGjelder.id)})`}
    sex={sakenGjelder.sex}
    strengtFortrolig={strengtFortrolig}
    fortrolig={fortrolig}
  />
);

interface SakenGjelderProps extends Pick<IOppgavebehandlingBase, 'fortrolig' | 'strengtFortrolig'> {
  id: string;
  name: string;
  sex: SexEnum;
}

const SakenGjelder = ({ id, name, sex, fortrolig, strengtFortrolig }: SakenGjelderProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const button = useRef<HTMLButtonElement>(null);

  const copyToClipboard = (text: string | null) => {
    if (text === null) {
      return;
    }

    navigator.clipboard.writeText(text);
    setIsOpen(true);
  };

  return (
    <>
      <User>
        <UserItem>
          <UserSex sex={sex} />
        </UserItem>
        <UserItem>{name}</UserItem>
        <UserItem>
          <CopyFnrButton ref={button} onClick={() => copyToClipboard(id)}>
            <FilesIcon title="Kopier" />
          </CopyFnrButton>
        </UserItem>
        <Fortrolig fortrolig={fortrolig} />
        <StrengtFortrolig strengtFortrolig={strengtFortrolig} />
      </User>

      <Popover open={isOpen} anchorEl={button.current} onClose={() => setIsOpen(false)} placement="bottom">
        <Popover.Content>Kopiert</Popover.Content>
      </Popover>
    </>
  );
};
