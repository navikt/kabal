import { styled } from 'styled-components';

export const StyledOppgaverContainer = styled.section`
  grid-area: oppgaver;
  border-top: 1px solid #c6c2bf;
  margin-top: var(--a-spacing-4);
  padding-top: var(--a-spacing-2);
  display: flex;
  flex-direction: column;
  gap: 75px;
  width: fit-content;
`;

export const StyledName = styled.span`
  justify-self: left;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const StyledFnr = styled.span`
  justify-self: left;
`;
