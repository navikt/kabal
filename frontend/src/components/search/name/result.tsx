import { CollapseFilled, ExpandFilled } from '@navikt/ds-icons';
import { Button } from '@navikt/ds-react';
import React, { useState } from 'react';
import { getFullName } from '../../../domain/name';
import { ISearchPerson } from '../../../types/oppgaver';
import { CopyFnrButton } from '../../copy-button/copy-fnr-button';
import { StyledFnr, StyledName, StyledResult } from '../common/styled-components';
import { Oppgaver } from './oppgaver';

export const Result = ({ fnr, navn }: ISearchPerson) => {
  const [open, setOpen] = useState<boolean>(false);

  const Chevron = open ? CollapseFilled : ExpandFilled;

  return (
    <StyledResult data-testid="search-result">
      <StyledName>{getFullName(navn)}</StyledName>
      <StyledFnr>
        <CopyFnrButton fnr={fnr} />
      </StyledFnr>
      <Button
        type="button"
        variant="tertiary"
        size="small"
        onClick={() => setOpen(!open)}
        data-testid="search-result-expand-button"
        icon={<Chevron aria-hidden />}
        iconPosition="right"
      >
        {getOpenText(open)}
      </Button>
      <Oppgaver open={open} fnr={fnr} />
    </StyledResult>
  );
};

const getOpenText = (open: boolean) => (open ? 'Skjul saker' : 'Se saker');
