import { styled } from 'styled-components';

export const Container = styled.section`
  display: flex;
  flex-direction: column;
  position: relative;
  padding-top: var(--a-spacing-2);
`;

export const Header = styled.header`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--a-spacing-1);
`;

export const HeaderGroup = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  column-gap: var(--a-spacing-2);
`;
