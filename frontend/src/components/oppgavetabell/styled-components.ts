import styled from 'styled-components';

export const SCTableContainer = styled.div`
  flex-grow: 1;
`;

export const StyledTable = styled.table`
  max-width: 1200px;
`;

export const SCFooter = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: nowrap;
`;

export const SCTableFooter = styled.tfoot`
  display: flex;
  align-items: center;
  justify-content: space-around;

  height: 30px;
  padding: 10px;

  background-color: rgba(0, 0, 0, 0.03);
  border-top-width: 1px;
  border-top-style: solid;
  border-top-color: rgba(0, 0, 0, 0.15);
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: rgba(0, 0, 0, 0.15);
`;

export const SCTableStats = styled.div`
  padding: 10px;
`;
