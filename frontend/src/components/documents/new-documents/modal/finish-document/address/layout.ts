import { css, styled } from 'styled-components';

export enum AddressState {
  SAVED,
  OVERRIDDEN,
  UNSAVED,
}

export const Container = styled.div<{ $state: AddressState }>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 32px;
  gap: 8px;
  padding: 8px;
  position: relative;
  background-color: ${({ $state }) => getBackgroundColor($state)};
`;

const getBackgroundColor = (state: AddressState) => {
  switch (state) {
    case AddressState.SAVED:
      return 'transparent';
    case AddressState.OVERRIDDEN:
      return 'var(--a-surface-alt-1-subtle)';
    case AddressState.UNSAVED:
      return 'var(--a-surface-warning-subtle)';
  }
};

export const recipientStyle = css`
  display: flex;
  flex-direction: column;
  border: 1px solid var(--a-border-subtle);
  border-left-width: 4px;
  border-radius: var(--a-border-radius-medium);
  padding: 0;
  margin-bottom: 8px;

  &:last-child {
    margin-bottom: 0;
  }
`;

export const StyledRecipient = styled.div`
  ${recipientStyle}
`;

export const Row = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 4px;
`;

export const FieldLabel = styled.span`
  display: flex;
  flex-direction: row;
  align-items: center;
  column-gap: 4px;
  min-height: 24px;
`;
