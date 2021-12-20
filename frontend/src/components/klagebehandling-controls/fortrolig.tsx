import React from 'react';
import { LabelMain } from '../../styled-components/labels';
import { UserItem } from './styled-components';

interface FortroligProps {
  fortrolig: boolean;
}
interface StrengtFortroligProps {
  strengtFortrolig: boolean;
}

export const Fortrolig = ({ fortrolig }: FortroligProps) =>
  fortrolig === true ? (
    <UserItem>
      <LabelMain>Fortrolig</LabelMain>
    </UserItem>
  ) : null;

export const StrengtFortrolig = ({ strengtFortrolig }: StrengtFortroligProps) =>
  strengtFortrolig === true ? (
    <UserItem>
      <LabelMain>Strengt fortrolig</LabelMain>
    </UserItem>
  ) : null;
