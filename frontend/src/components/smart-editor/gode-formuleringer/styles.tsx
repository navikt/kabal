import { Skeleton } from '@navikt/ds-react';
import { css, styled } from 'styled-components';

export const StyledGodeFormuleringer = styled.section`
  padding-top: var(--a-spacing-4);
  display: flex;
  flex-direction: column;
  position: sticky;
  top: 0;
  gap: var(--a-spacing-4);
  width: 350px;
  height: 100%;
  background-color: var(--a-bg-default);
  padding-left: var(--a-spacing-3);
`;

export const Top = styled.div`
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  row-gap: var(--a-spacing-2);
  padding-right: var(--a-spacing-4);
  padding-left: var(--a-spacing-1);
`;

export const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  flex-grow: 1;
  row-gap: var(--a-spacing-4);
  padding-right: var(--a-spacing-4);
  padding-left: var(--a-spacing-1);
`;

export const GodeFormuleringerTitle = styled.h1`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: var(--a-spacing-2);
  margin: 0;
  font-size: var(--a-spacing-5);
`;

export const OUTLINE_WIDTH = '3px';

export const godFormuleringBaseStyle = css`
  box-shadow: var(--a-shadow-medium);
  border-radius: var(--a-border-radius-medium);

  &:first-child {
    margin-top: ${OUTLINE_WIDTH};
  }

  &:last-child {
    margin-bottom: var(--a-spacing-8);
  }
`;

export const StyledSkeleton = styled(Skeleton)`
  ${godFormuleringBaseStyle}
  flex-shrink: 0;
`;
