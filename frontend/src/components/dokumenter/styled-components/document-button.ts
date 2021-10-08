import styled from "styled-components";

export const DocumentButton = styled.button`
  display: block;
  cursor: pointer;
  border: none;
  padding: 0;
  color: inherit;
  font-size: inherit;
  background-color: transparent;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: left;
  text-decoration: underline;

  &:hover {
    color: #262626;
  }
`;
