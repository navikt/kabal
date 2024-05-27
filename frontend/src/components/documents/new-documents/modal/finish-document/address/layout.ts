import { styled } from 'styled-components';

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

export const StyledRecipient = styled.div<{ $accent: string }>`
  display: flex;
  flex-direction: column;
  border-radius: var(--a-border-radius-medium);
  padding: 0;
  margin-bottom: 8px;
  border-top-width: 1px;
  border-bottom-width: 1px;
  border-right-width: 1px;
  border-left-width: 4px;
  border-style: solid;
  border-color: var(--a-border-default);
  border-left-color: ${({ $accent }) => $accent};

  &:last-child {
    margin-bottom: 0;
  }
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
