import styled from 'styled-components';

export const DokumenterMinivisning = styled.ul`
  display: block;
  list-style: none;
  padding: 0;
  margin: 0;
`;

export const Tilknyttet = styled.li`
  padding: 0.5em 1em;
`;

export const TilknyttetDato = styled.time`
  display: block;
  font-size: 14px;
`;

export const TilknyttetKnapp = styled.button<{ tilknyttet: boolean }>`
  display: block;
  cursor: pointer;
  padding: 0;
  border: none;
  background-color: transparent;
  color: #0067c5;
  font-size: 16px;
  text-decoration: ${(props) => (props.tilknyttet ? 'none' : 'line-through')};
  text-align: left;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
`;

export const StyledSubHeader = styled.h2`
  font-size: 1em;
  font-weight: bold;
  margin-top: 2em;
  margin-bottom: 0; 

  &:first-of-type {
    margin-top: 8px;
  }
`