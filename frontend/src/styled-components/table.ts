import { Table } from '@navikt/ds-react';
import styled from 'styled-components';

export const StyledCaption = styled.caption`
  text-align: left;
  font-weight: bold;
  font-style: normal;
  color: black;
  caption-side: top;
`;

export const StyledFooterContent = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
`;

export const StyledMineOppgaverTable = styled(Table)`
  max-width: 2500px;
  width: 100%;
`;
