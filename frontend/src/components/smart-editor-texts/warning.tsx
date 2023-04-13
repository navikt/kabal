import { ExclamationmarkTriangleIcon } from '@navikt/aksel-icons';
import React, { useMemo } from 'react';
import styled from 'styled-components';
import { AppQuery } from '@app/types/texts/texts';

export const LimitWarning = (limits: AppQuery) => {
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

const StyledWarning = styled(ExclamationmarkTriangleIcon)`
  color: var(--a-surface-danger);
`;
