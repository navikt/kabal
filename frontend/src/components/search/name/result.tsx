import { Table } from '@navikt/ds-react';
import React, { useState } from 'react';
import { IPartBase } from '@app/types/oppgave-common';
import { CopyIdButton } from '../../copy-button/copy-id-button';
import { StyledFnr, StyledName } from '../common/styled-components';
import { Oppgaver } from './oppgaver';

export const Result = ({ id, name }: IPartBase) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Table.ExpandableRow
      content={isOpen ? <Oppgaver fnr={id} /> : null}
      onOpenChange={setIsOpen}
      data-testid="search-result"
    >
      <Table.DataCell>
        <StyledName>{name}</StyledName>
      </Table.DataCell>

      <Table.DataCell>
        <StyledFnr>
          <CopyIdButton id={id} />
        </StyledFnr>
      </Table.DataCell>
    </Table.ExpandableRow>
  );
};
