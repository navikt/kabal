import { Skeleton } from '@navikt/ds-react';
import { css, styled } from 'styled-components';

export const StyledGodeFormuleringer = styled.section`
  padding-top: 16px;
  display: flex;
  flex-direction: column;
  position: sticky;
  top: 0;
  gap: 16px;
  width: 350px;
  height: 100%;
`;

export const Top = styled.div`
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  row-gap: 8px;
  padding-right: 16px;
  padding-left: 4px;
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
  row-gap: 16px;
  padding-right: 16px;
  padding-left: 4px;
`;

export const GodeFormuleringerTitle = styled.h1`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
  margin: 0;
  font-size: 20px;
`;

export const OUTLINE_WIDTH = '3px';

export const godFormuleringBaseStyle = css`
  box-shadow: var(--a-shadow-medium);
  border-radius: var(--a-border-radius-medium);

  &:first-child {
    margin-top: ${OUTLINE_WIDTH};
  }

  &:last-child {
    margin-bottom: 32px;
  }
`;

export const StyledSkeleton = styled(Skeleton)`
  ${godFormuleringBaseStyle}
  flex-shrink: 0;
`;
