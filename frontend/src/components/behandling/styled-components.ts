import styled from 'styled-components';

export const StyledContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  white-space: normal;
  width: 640px;
  grid-column-gap: 1px;
  background-color: #c9c9c9;
  flex-grow: 1;
`;

export const StyledBehandlingSection = styled.section`
  background-color: white;
  padding: 16px;
  min-height: 100%;
`;

export const StyledUtfallResultat = styled.div`
  margin-bottom: 32px;
`;
