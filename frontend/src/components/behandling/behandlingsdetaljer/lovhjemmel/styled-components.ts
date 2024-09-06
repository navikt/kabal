import { styled } from 'styled-components';

export const StyledLovhjemmelSelect = styled.div`
  position: relative;
`;

export const StyledSelectedHjemler = styled.div`
  margin-top: var(--a-spacing-2);
  padding-top: var(--a-spacing-2);
  padding-bottom: var(--a-spacing-2);
  padding-left: 1em;
  border-left: var(--a-spacing-05) solid var(--a-border-divider);
`;

export const StyledNoneSelected = styled.p`
  color: var(--a-text-subtle);
  margin: 0;
`;

export const StyledSelectedList = styled.ul`
  list-style: none;
  padding-left: var(--a-spacing-2);
  margin: 0;
`;

export const StyledListItem = styled.li`
  margin-bottom: var(--a-spacing-2);

  &:last-child {
    margin-bottom: 0;
  }
`;

export const StyledSelectedSectionHeader = styled.h3`
  font-size: 1rem;
  font-weight: bold;
  margin-top: 0;
  margin-bottom: var(--a-spacing-2);
`;

export const StyledSelectedSection = styled.div`
  padding-top: var(--a-spacing-1);

  &:first-of-type {
    padding-top: 0;
  }
`;
