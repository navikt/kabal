import styled from 'styled-components';

export const StyledTable = styled.table`
  border-spacing: 0;
  border-collapse: collapse;
  margin-bottom: 32px;
  min-width: 900px;

  td,
  th {
    padding: 16px;
    width: auto;
    text-align: left;
    white-space: nowrap;
  }

  thead {
    border-bottom: 1px solid rgba(0, 0, 0, 0.55);
  }

  tbody,
  tfoot {
    tr {
      border-bottom: 1px solid rgba(0, 0, 0, 0.15);

      :nth-child(odd) {
        background-color: rgba(0, 0, 0, 0.03);
      }
    }
  }
`;

export const StyledCaption = styled.caption`
  text-align: left;
  font-weight: bold;
  font-style: normal;
  color: black;
  caption-side: top;
  padding-top: 16px;
`;

export const StyledFooterContent = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
`;
