import { styled } from 'styled-components';

export const ValidationSummaryContainer = styled.article`
  margin: 0;
  margin-top: 10px;
  padding: 0;
`;

export const StyledFieldList = styled.ul`
  margin: 0;
  padding: 0;
  padding-left: 1em;
`;

export const SectionTitle = styled.h1`
  margin: 0;
  font-size: 18px;
`;

export const StyledSection = styled.section`
  margin-top: 10px;
`;

export const StyledPopup = styled.div`
  position: absolute;
  width: 400px;
  bottom: 100%;
  right: 0;
  margin-bottom: 8px;
`;

export const StyledButton = styled.button`
  background: transparent;
  border: 0;
  padding: 0;
  margin: 0;
  cursor: pointer;
`;

export const StyledIconButton = styled(StyledButton)`
  position: absolute;
  right: 0;
  padding: 16px;
`;

export const StyledButtons = styled.div`
  display: flex;
  align-items: center;
  align-content: center;
  justify-content: space-between;
  gap: 16px;
`;

export enum FooterType {
  FINISHED = 'FINISHED',
  UNFINISHED_NO_ERRORS = 'UNFINISHED_NO_ERRORS',
  UNFINISHED_WITH_ERRORS = 'UNFINISHED_WITH_ERRORS',
}

const getBorderColor = (type: FooterType): string => {
  switch (type) {
    case FooterType.FINISHED:
      return 'var(--a-border-success)';
    case FooterType.UNFINISHED_NO_ERRORS:
      return 'var(--a-border-info)';
    case FooterType.UNFINISHED_WITH_ERRORS:
      return 'var(--a-border-warning)';
  }
};

const getBackgroundColor = (type: FooterType) => {
  switch (type) {
    case FooterType.FINISHED:
      return 'var(--a-surface-success-subtle)';
    case FooterType.UNFINISHED_NO_ERRORS:
      return 'var(--a-surface-info-subtle)';
    case FooterType.UNFINISHED_WITH_ERRORS:
      return 'var(--a-surface-warning-subtle)';
  }
};

export const StyledFooter = styled.div<{ $type: FooterType }>`
  display: flex;
  position: sticky;
  bottom: 0em;
  left: 0;
  width: 100%;
  padding-left: 1em;
  padding-right: 1em;
  padding-bottom: 0.5em;
  padding-top: 0.5em;
  justify-content: space-between;
  align-items: center;
  align-content: center;
  z-index: 23;
  border-top: ${({ $type }) => `1px solid ${getBorderColor($type)}`};
  background-color: ${({ $type }) => getBackgroundColor($type)};
`;

export const StyledFinishOppgaveButtons = styled.div`
  display: flex;
  justify-content: space-between;
`;
