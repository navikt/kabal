import { Alert } from '@navikt/ds-react';
import React from 'react';
import styled from 'styled-components';

export const MISSING_TITLE = 'TITTEL MANGLER';

interface Props {
  title: string;
}

export const Title = ({ title }: Props): JSX.Element => {
  if (title === MISSING_TITLE) {
    return <StyledWarning variant="warning">Tittel mangler</StyledWarning>;
  }

  return <div>{title}</div>;
};

const StyledWarning = styled(Alert)`
  margin-top: 4px;
`;