import styled from "styled-components";
import { Checkbox } from "nav-frontend-skjema";

export const DokumentCheckbox = styled(Checkbox)`
  margin-top: 1em;
  margin-bottom: 1em;
  display: block;
`;
export const InfoKnapp = styled.button`
  border-radius: 50%;
  border: 1px solid black;
  background: white;
  margin-left: 0.25em;
  width: 1.5em;
  height: 1.5em;

  &:active {
    color: white;
    background: lightgray;
  }
`;

export const VurderingBeholder = styled.div`
  padding: 0;
  margin: 0;
  display: ${(props) => (!props.theme.vises ? "none" : "block")};
`;
export const Div = styled.div`
  display: block;
  padding: 0;
  margin: 0;
`;

export let Header = styled.h1`
  font-size: 1.2em;
`;

export let SubHeader = styled.h2`
  font-size: 1.1em;
  display: flex;
  flex-flow: row;
  gap: 0.35em;
`;
