import { ChevronDownIcon, ChevronUpIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';
import React, { useState } from 'react';
import { IPartBase } from '@app/types/oppgave-common';
import { CopyFnrButton } from '../../copy-button/copy-fnr-button';
import { StyledFnr, StyledName, StyledNameResult } from '../common/styled-components';
import { Oppgaver } from './oppgaver';

export const Result = ({ id, name }: IPartBase) => {
  const [open, setOpen] = useState<boolean>(false);

  const Chevron = open ? ChevronUpIcon : ChevronDownIcon;

  return (
    <StyledNameResult data-testid="search-result">
      <StyledName>{name}</StyledName>
      <StyledFnr>
        <CopyFnrButton fnr={id} />
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
      <Oppgaver open={open} fnr={id} />
    </StyledNameResult>
  );
};

const getOpenText = (open: boolean) => (open ? 'Skjul saker' : 'Se saker');
