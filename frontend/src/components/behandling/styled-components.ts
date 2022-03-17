import styled from 'styled-components';

export const StyledContainer = styled.div`
  display: flex;
  flex-basis: 100%;
  white-space: normal;
`;

export const BehandlingSectionHeader = styled.h2`
  margin-bottom: 8px;
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

export const BehandlingSectionChildren = styled.div`
  margin-bottom: 32px;
`;

export const StyledUtfallResultat = styled.div`
  margin-bottom: 32px;
`;

export const StyledPaddedContent = styled.div`
  padding: 1em;
`;
