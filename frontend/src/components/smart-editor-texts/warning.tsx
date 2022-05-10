import { Warning } from '@navikt/ds-icons';
import React, { useMemo } from 'react';
import styled from 'styled-components';
import { TextMetadata } from '../../types/texts/texts';

export const LimitWarning = (limits: TextMetadata) => {
  const isLimited = useMemo(
    () =>
      Object.entries(limits).some(([key, limit]) => key !== 'templates' && Array.isArray(limit) && limit.length !== 0),
    [limits]
  );

  if (isLimited) {
    return null;
  }

  return <StyledWarning title="Denne teksten har ingen begrensninger!" />;
};

const StyledWarning = styled(Warning)`
  color: var(--navds-button-color-danger-background);
`;
