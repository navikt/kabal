import styled from 'styled-components';

export const StyledInput = styled.input`
  display: block;
  width: 100%;
  font-size: 16px;
  border: none;
  border-bottom: 1px solid #d8d8d8;
  padding: 0;
  margin: 0;
  padding-bottom: 1px;
  border-left: 2em solid transparent;
  border-right: 2em solid transparent;
  height: 2em;
  font-family: inherit;
  transition-duration: 0.2s;
  transition-timing-function: ease-in-out;
  transition-property: border-bottom-color;

  :focus {
    outline: none;
    padding-bottom: 0;
    border-bottom-color: #0067c5;
    border-bottom-width: 2px;
  }
`;
