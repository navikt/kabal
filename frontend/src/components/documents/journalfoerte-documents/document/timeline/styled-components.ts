import { ChevronRightIcon } from '@navikt/aksel-icons';
import { Label } from '@navikt/ds-react';
import { styled } from 'styled-components';

export const StyledSmsContent = styled.blockquote`
  border-left: var(--a-spacing-1) solid var(--a-gray-200);
  padding-left: var(--a-spacing-1);
  border-radius: var(--a-border-radius-medium);
  margin-top: var(--a-spacing-2);
  margin-left: 0;
  margin-right: 0;
  margin-bottom: 0;
`;

export const StyledEmailContent = styled(StyledSmsContent)`
  p,
  ol,
  ul,
  li,
  h1,
  h2,
  h3 {
    margin-top: 0;
    margin-bottom: var(--a-spacing-1);
  }

  h1 {
    font-size: var(--a-spacing-6);
  }

  h2 {
    font-size: var(--a-spacing-5);
  }

  h3,
  h4,
  h5,
  h6 {
    font-size: var(--a-spacing-4);
  }

  ol,
  ul {
    padding-left: var(--a-spacing-4);
  }
`;

interface TimelineItemStyleProps {
  $color: string;
}

export const StyledTimelineItem = styled.li<TimelineItemStyleProps>`
  position: relative;
  display: flex;
  flex-direction: column;
  row-gap: var(--a-spacing-1);
  padding: var(--a-spacing-2);
  border: 1px solid var(--a-border-default);
  border-radius: var(--a-border-radius-medium);
  background-color: ${({ $color }) => $color};
  white-space: nowrap;
`;

export const NextArrow = styled(ChevronRightIcon)`
  position: absolute;
  top: 50%;
  left: 100%;
  transform: translateY(-50%) translateX(-22.5%);
  width: var(--a-spacing-4);
`;

export const StyledLabel = styled(Label)`
  display: flex;
  align-items: center;
  gap: var(--a-spacing-1);
`;
