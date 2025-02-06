import { FileTextIcon } from '@navikt/aksel-icons';
import { Link } from 'react-router-dom';
import { styled } from 'styled-components';

export const StyledHeaders = styled.div`
  display: grid;
  grid-template-columns: 1fr 85px 160px var(--a-spacing-12);
  gap: var(--a-spacing-2);
  padding-left: var(--a-spacing-2);
  padding-right: var(--a-spacing-2);
  position: sticky;
  top: 0;
  z-index: 1;
  background-color: var(--a-bg-default);
  box-shadow: 0px 5px 5px -3px rgb(0, 0, 0, 20%);
  border-bottom-left-radius: var(--a-spacing-1);
  border-bottom-right-radius: var(--a-spacing-1);
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
  grid-template-columns: 1fr 85px 160px var(--a-spacing-12);
  gap: var(--a-spacing-2);
  align-content: center;
  align-items: center;
  width: 100%;
  color: inherit;
  text-decoration: none;
  padding: var(--a-spacing-2);
`;

export const StyledTitleIcon = styled(FileTextIcon)`
  flex-shrink: 0;
`;

export const StyledTitleText = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;
