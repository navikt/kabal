import { styled } from 'styled-components';

export const Container = styled.section`
  display: flex;
  flex-direction: column;
  position: relative;
  padding-top: 8px;
`;

export const Header = styled.header`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
`;

export const HeaderGroup = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  column-gap: 8px;
`;
