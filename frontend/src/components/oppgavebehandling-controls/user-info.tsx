import { CopyButton } from '@navikt/ds-react';
import React from 'react';
import styled from 'styled-components';
import { formatFoedselsnummer } from '@app/functions/format-id';
import { IOppgavebehandlingBase } from '@app/types/oppgavebehandling/oppgavebehandling';
import { Dead, EgenAnsatt, Fortrolig, StrengtFortrolig, Verge } from './status';
import { UserSex } from './user-sex';

export const UserInfo = ({
  sakenGjelder,
  fortrolig,
  strengtFortrolig,
  dead,
  vergemaalEllerFremtidsfullmakt,
  egenansatt,
}: IOppgavebehandlingBase) => (
  <>
    <User>
      <UserSex sex={sakenGjelder.sex} />
      <span>{sakenGjelder.name ?? '-'}</span>
      <CopyButton size="small" copyText={sakenGjelder.id} text={formatFoedselsnummer(sakenGjelder.id)} />
      <Fortrolig fortrolig={fortrolig} />
      <StrengtFortrolig strengtFortrolig={strengtFortrolig} />
      <EgenAnsatt egenansatt={egenansatt} />
      <Dead dead={dead} />
      <Verge vergemaalEllerFremtidsfullmakt={vergemaalEllerFremtidsfullmakt} />
    </User>
  </>
);

const User = styled.section`
  display: flex;
  align-items: center;
  column-gap: 8px;
  border-right: 1px solid #c9c9c9;
  padding-right: 16px;
`;
