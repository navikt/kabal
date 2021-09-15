import styled from 'styled-components';

export const StyledTableContainer = styled.div`
  padding-left: 1em;
  padding-right: 1em;
  flex-grow: 1;
`;

export const StyledTable = styled.table`
  max-width: 1200px;
`;

export const StyledTableStats = styled.div`
  padding: 10px;
`;

export const StyledCaption = styled.caption`
  && {
    text-align: left;
    font-weight: bold;
    font-style: normal;
    color: black;
    margin-top: 3em;
    caption-side: top;
  }
`;
