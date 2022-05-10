import React from 'react';
import { LabelMain } from '../../styled-components/labels';
import { IOppgavebehandlingBase } from '../../types/oppgavebehandling/oppgavebehandling';
import { UserItem } from './styled-components';

export const Fortrolig = ({ fortrolig }: Pick<IOppgavebehandlingBase, 'fortrolig'>) =>
  fortrolig === true ? (
    <UserItem>
      <LabelMain>Fortrolig</LabelMain>
    </UserItem>
  ) : null;

export const StrengtFortrolig = ({ strengtFortrolig }: Pick<IOppgavebehandlingBase, 'strengtFortrolig'>) =>
  strengtFortrolig === true ? (
    <UserItem>
      <LabelMain>Strengt fortrolig</LabelMain>
    </UserItem>
  ) : null;
