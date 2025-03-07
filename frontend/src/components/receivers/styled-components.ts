import { styled } from 'styled-components';

export const StyledRecipient = styled.div<{ $accent: string }>`
  display: flex;
  flex-direction: column;
  border-radius: var(--a-border-radius-medium);
  padding: 0;
  margin-bottom: var(--a-spacing-2);
  border-top-width: 1px;
  border-bottom-width: 1px;
  border-right-width: 1px;
  border-left-width: var(--a-spacing-1);
  border-style: solid;
  border-color: var(--a-border-default);
  border-left-color: ${({ $accent }) => $accent};

  &:last-child {
    margin-bottom: 0;
  }
`;
