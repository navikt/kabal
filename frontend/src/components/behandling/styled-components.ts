import styled from 'styled-components';

export const StyledHeader = styled.h1`
  font-size: 1.5em;
  font-weight: bold;
  margin: 0;
`;

export const StyledContainer = styled.div`
  display: flex;
  flex-basis: 100%;
  white-space: normal;
`;

export const StyledInfoHeader = styled.h2`
  margin: 1em 0 0;
  font-size: 1em;
  font-weight: bold;
`;

export const StyledBehandlingsdetaljer = styled.div`
  border-right: 1px solid #c9c9c9;
  width: 24em;
  padding-bottom: 1em;
`;

export const StyledBehandlingsdialog = styled.div`
  padding: 1em;
  width: 24em;
`;

export const StyledLovhjemmelLabel = styled.span`
  margin: 0.25em;

  &:last-of-type {
    margin-right: 0;
  }
`;

export const StyledLovhjemmelLabels = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin: -0.25em;
`;

export const StyledInfoChildren = styled.div`
  min-height: 2em;
`;

export const StyledUtfallResultat = styled.div`
  margin-bottom: 1em;
  margin-top: 1em;
`;

export const StyledSubHeader = styled.h3`
  margin-top: 0;
  margin-bottom: 0.5em;
  font-size: 20px;
  line-height: 25px;
  font-weight: 600;
`;

export const StyledPaddedContent = styled.div`
  padding: 1em;
`;
