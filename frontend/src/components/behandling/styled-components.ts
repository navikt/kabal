import styled from 'styled-components';

export const StyledHeader = styled.h1`
  font-size: 1.5em;
  font-weight: bold;
  margin: 0;
`;

export const StyledContainer = styled.div`
  display: flex;
  min-height: 100%;
`;

export const StyledInfoHeader = styled.h2`
  margin: 1em 0 0;
  font-size: 1em;
  font-weight: bold;
`;

export const StyledInfoLabel = styled.h2`
  margin: 0;
  font-size: 1em;
  font-weight: bold;
`;

export const StyledLabels = styled.div`
  display: flex;
`;

export const StyledInfoDetails = styled.div`
  margin: 0;
`;

export const StyledLabel = styled.div`
  flex: 1;
`;

export const StyledBehandlingsdetaljer = styled.div`
  flex-basis: 100%;
  border-right: 1px solid #c9c9c9;
  min-height: 100%;
  width: 30em;
`;

export const StyledBehandlingsdialog = styled.div`
  flex-basis: 100%;
  height: 100%;
  padding: 1em;
  max-width: 30em;
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

export const StyledFinishKlagebehandlingButtons = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const StyledFinishKlagebehandlingText = styled.p`
  margin: 0 0 1em;
  white-space: normal;
`;

export const StyledFinishKlagebehandlingBox = styled.div`
  border: 1px solid #0067c5;
  padding: 1em;
`;

export const StyledPaddedContent = styled.div`
  padding: 1em;
`;

export const StyledAlertstripe = styled.div`
  margin-bottom: 1em;
`;

export const BehandlingsdialogInputContent = styled.div`
  max-width: 250px;
`;
