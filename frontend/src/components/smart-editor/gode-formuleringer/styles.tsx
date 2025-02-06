import { Skeleton } from '@navikt/ds-react';
import { css, styled } from 'styled-components';

export const OUTLINE_WIDTH = '3px';

export const godFormuleringBaseStyle = css`
  box-shadow: var(--a-shadow-medium);
  border-radius: var(--a-border-radius-medium);

  &:first-child {
    margin-top: ${OUTLINE_WIDTH};
  }

  &:last-child {
    margin-bottom: var(--a-spacing-8);
  }
`;

export const StyledSkeleton = styled(Skeleton)`
  ${godFormuleringBaseStyle}
  flex-shrink: 0;
`;
