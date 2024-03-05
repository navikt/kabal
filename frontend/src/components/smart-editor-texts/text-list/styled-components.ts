import { FileTextIcon } from '@navikt/aksel-icons';
import { Link } from 'react-router-dom';
import { styled } from 'styled-components';

export const LoaderOverlay = styled.div`
  width: 700px;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-color: #fafafa;
`;

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow-y: auto;
  width: 700px;
  flex-grow: 1;
`;

export const StyledHeaders = styled.div`
  display: grid;
  grid-template-columns: 1fr 70px 160px 48px;
  gap: 8px;
  padding-left: 8px;
  padding-right: 8px;
  position: sticky;
  top: 0;
  background-color: #fff;
  box-shadow: 0px 5px 5px -3px rgb(0, 0, 0, 20%);
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
`;

export const StyledList = styled.ul`
  display: flex;
  flex-direction: column;
  row-gap: 4px;
  width: 100%;
  list-style: none;
  padding: 0;
  margin: 0;
`;

export const ListItem = styled.li<{ $active: boolean }>`
  background-color: ${({ $active }) => ($active ? 'var(--a-blue-100)' : '#fff')};
  transition-property: background-color;
  transition-duration: 0.2s;
  transition-timing-function: ease-in-out;
  border-radius: var(--a-border-radius-medium);

  &:hover {
    background-color: ${({ $active }) => ($active ? 'var(--a-blue-100)' : 'var(--a-blue-50)')};
  }
`;

export const StyledLink = styled(Link)`
  display: grid;
  grid-template-columns: 1fr 70px 160px 48px;
  gap: 8px;
  align-content: center;
  align-items: center;
  width: 100%;
  color: inherit;
  text-decoration: none;
  padding: 8px;
`;

export const StyledTitle = styled.span`
  display: flex;
  align-items: center;
  gap: 2px;
  overflow: hidden;
  white-space: nowrap;
`;

export const StyledTitleIcon = styled(FileTextIcon)`
  flex-shrink: 0;
`;

export const StyledTitleText = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;
