import styled from 'styled-components';

export const StyledTableContainer = styled.div`
  padding-left: 1em;
  padding-right: 1em;
  flex-grow: 1;
`;

export const StyledTable = styled.table`
  max-width: 1400px;
`;

interface StyledTableHeaderProps {
  width?: string;
}

export const StyledTableHeader = styled.th<StyledTableHeaderProps>`
  width: ${({ width = 'auto' }) => width};
`;

export const StyledFooter = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: nowrap;
`;

export const StyledTableFooter = styled.tfoot`
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

export const StyledTableStats = styled.div`
  padding: 10px;
`;

interface StyledAgeProps {
  age: number;
}

export const StyledAge = styled.span<StyledAgeProps>`
  color: ${({ age }) => (age >= 120 ? '#C30000' : '#54483F')};
`;

export const StyledDeadline = styled.time<StyledAgeProps>`
  color: ${({ age }) => (age >= 120 ? '#C30000' : '#54483F')};
`;
