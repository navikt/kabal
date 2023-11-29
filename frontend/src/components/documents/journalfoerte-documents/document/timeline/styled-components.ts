import { ChevronRightIcon } from '@navikt/aksel-icons';
import { Heading, Label } from '@navikt/ds-react';
import { styled } from 'styled-components';

export const StyledHeading = styled(Heading)`
  display: flex;
  align-items: center;
  gap: 4px;
`;

export const StyledSmsContent = styled.blockquote`
  border-left: 4px solid var(--a-gray-200);
  padding-left: 4px;
  border-radius: var(--a-border-radius-medium);
  margin-top: 8px;
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
    margin-bottom: 4px;
  }

  h1 {
    font-size: 24px;
  }

  h2 {
    font-size: 20px;
  }

  h3,
  h4,
  h5,
  h6 {
    font-size: 16px;
  }

  ol,
  ul {
    padding-left: 16px;
  }
`;

interface TimelineItemStyleProps {
  $color: string;
}

export const StyledTimelineItem = styled.li<TimelineItemStyleProps>`
  position: relative;
  display: flex;
  flex-direction: column;
  row-gap: 4px;
  padding: 8px;
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
  width: 16px;
`;

export const StyledLabel = styled(Label)`
  display: flex;
  align-items: center;
  gap: 4px;
`;
