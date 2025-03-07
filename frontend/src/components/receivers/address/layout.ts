import { styled } from 'styled-components';

export enum AddressState {
  SAVED = 0,
  OVERRIDDEN = 1,
  UNSAVED = 2,
}

export const Container = styled.div<{ $state: AddressState }>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: var(--a-spacing-8);
  gap: var(--a-spacing-2);
  padding: var(--a-spacing-2);
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
