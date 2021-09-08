import styled from 'styled-components';

export const Klagebehandling = styled.div`
  display: flex;
  font-size: 0.9em;
  background: #ffeccc;
  border: 1px solid #d47b00;
  align-items: center;
  justify-content: center;
  min-width: 8em;
`;

export const IkonHake = styled.img`
  position: absolute;
  display: ${(props) => props.theme.display};
  margin: 0.25em 0 0 -2em;
  -webkit-transition: all 0.4s ease-in-out;
  transition: all 0.4s ease-in-out;
`;
export const IkonLukk = styled.img`
  position: absolute;
  display: ${(props) => props.theme.display};
  margin: 0.25em 0 0 0.2em;
  -webkit-transition: all 0.4s ease-in-out;
  transition: all 0.4s ease-in-out;
`;

export const Kontrollpanel = styled.div`
  display: grid;
  background: #f8f8f8;
  grid-template-columns: auto repeat(3, 1fr);
  grid-template-areas: 'Person Toggles Toggles Knapper';
  height: 3em;

  @media screen and (max-width: 1640px) {
    height: 6.25em;
    grid-template-areas:
      'Person Knapper Knapper Knapper'
      'Toggles Toggles Toggles Toggles';
  }
`;

export const Knapper = styled.div`
  display: flex;
  grid-area: Toggles;
  user-select: none;
  cursor: pointer;
  justify-content: space-between;
  max-width: 47 em;
  justify-self: left;
  @media screen and (max-width: 1640px) {
    justify-content: flex-start;
    justify-self: flex-start;
  }
`;
export const Person = styled.div`
  border: 1px solid #e7e9e9;
  border-left: 0;
  grid-area: Person;
  border-bottom: 0;
  border-top: 0;
  margin: 0.5em 1em;
  white-space: nowrap;
  padding: 0.5em 0;
  overflow: hidden;
  text-overflow: ellipsis;
  @media screen and (max-width: 1640px) {
    padding: 0.5em 0 0 0;
    border: none;
  }
  display: flex;
  gap: 0.5em;
  justify-content: space-between;
  align-items: center;
`;
export const Navn = styled.span`
  font-weight: bold;
  padding-right: 0.1em;
`;
export const Kjonn = styled.span`
  font-weight: bold;
  padding-right: 0.1em;
  background: ${(props) => props.theme.bgColor};
  border-radius: 50%;
  width: 1.3em;
  height: 1.3em;
  padding: 2px;
  color: white;
  justify-content: center;
  display: inline-flex;
  margin: 0 5px 0 0;
`;

export const Personnummer = styled.span`
  padding-left: 0.1em;
`;
export const SjekkboksLabel = styled.div`
  z-index: 5;
`;
