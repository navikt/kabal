import { Table } from '@navikt/ds-react';
import { styled } from 'styled-components';

interface StyledRowProps {
  $hasChanges: boolean;
  $isActive: boolean;
}

const getBackgroundColor = ({ $hasChanges }: StyledRowProps) =>
  $hasChanges ? 'var(--a-surface-warning-subtle)' : undefined;

const getHoverBackgroundColor = ({ $hasChanges }: StyledRowProps) =>
  $hasChanges ? 'var(--a-surface-warning-subtle-hover)' : undefined;

export const StyledTableRow = styled(Table.Row)<StyledRowProps>`
  opacity: ${({ $isActive }) => ($isActive ? 1 : 0.5)};

  &&& {
    background-color: ${getBackgroundColor};

    &:hover {
      background-color: ${getHoverBackgroundColor};
    }
  }
`;

export const Behandlingstid = styled.div`
  display: flex;
  align-items: center;
  width: max-content;
  gap: var(--a-spacing-1);
`;

export const Horizontal = styled.div`
  display: flex;
  align-items: center;
  column-gap: var(--a-spacing-1);
`;

export const Buttons = styled(Horizontal)`
  min-width: ${3 * 32 + 2 * 4}px;
`;

export const NoWrap = styled.span`
  white-space: nowrap;
`;
