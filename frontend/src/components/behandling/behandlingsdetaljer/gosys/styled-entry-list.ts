import { styled } from 'styled-components';

export const StyledEntryList = styled.ul<{ $marginTop?: boolean }>`
  margin: 0;
  margin-top: ${({ $marginTop }) => ($marginTop ? 'var(--a-spacing-2)' : '0')};
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  row-gap: var(--a-spacing-2);
`;
