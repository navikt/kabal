import React from 'react';
import { IKlagebehandling } from '../../redux-api/klagebehandling-state-types';
import { LabelMain } from '../../styled-components/labels';
import { UserItem } from './styled-components';

export const Fortrolig = ({ fortrolig }: Pick<IKlagebehandling, 'fortrolig'>) =>
  fortrolig === true ? (
    <UserItem>
      <LabelMain>Fortrolig</LabelMain>
    </UserItem>
  ) : null;

export const StrengtFortrolig = ({ strengtFortrolig }: Pick<IKlagebehandling, 'strengtFortrolig'>) =>
  strengtFortrolig === true ? (
    <UserItem>
      <LabelMain>Strengt fortrolig</LabelMain>
    </UserItem>
  ) : null;
