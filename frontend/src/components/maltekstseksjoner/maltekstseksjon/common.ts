import { Heading } from '@navikt/ds-react';
import { styled } from 'styled-components';

export const Container = styled.section`
  display: grid;
  grid-template-rows: min-content 1fr;
  grid-template-columns: 440px min-content;
  grid-template-areas:
    'header header'
    'sidebar text-list';
  row-gap: var(--a-spacing-2);
  column-gap: var(--a-spacing-2);
  overflow-y: hidden;
  height: 100%;
  border-radius: var(--a-border-radius-medium);
  box-shadow: var(--a-shadow-medium);
  flex-grow: 1;
  overflow: hidden;
`;

export const Header = styled.header`
  grid-area: header;
  display: grid;
  gap: var(--a-spacing-2);
  grid-template-areas:
    'title actions'
    'metadata actions'
    'filters actions'
    'tags tags';
  grid-template-columns: 1fr fit-content;
  white-space: nowrap;
  padding-right: var(--a-spacing-2);
`;

export const MetadataContainer = styled.div`
  grid-area: metadata;
  display: flex;
  flex-direction: row;
  align-items: center;
  column-gap: var(--a-spacing-1);
`;

export const StyledHeading = styled(Heading)`
  white-space: nowrap;
`;

export const SidebarContainer = styled.div`
  position: sticky;
  top: 0;
  height: fit-content;
  overflow: auto;
  grid-area: sidebar;
  display: flex;
  flex-direction: column;
  row-gap: var(--a-spacing-2);
  padding-top: var(--a-spacing-1);
`;

export const List = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  white-space: nowrap;
  overflow-x: hidden;
  overflow-y: auto;
`;

export const DateTimeContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  column-gap: var(--a-spacing-1);
`;

export const ActionsContainer = styled.div`
  grid-area: actions;
  display: flex;
  flex-direction: column;
  gap: var(--a-spacing-2);
`;
