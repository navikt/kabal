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

export const NoWrap = styled.span`
  white-space: nowrap;
`;
