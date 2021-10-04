import styled from 'styled-components';

export const StyledMultiSelect = styled.div``;

export const StyledButton = styled.button`
  font-family: 'Source Sans Pro', Arial, sans-serif;
  font-size: 1rem;
  font-weight: 400;
  padding: 0.5rem;
  background-color: #fff;
  border-radius: 4px;
  border: 1px solid #6a6a6a;
  box-sizing: border-box;
  /* line-height: 1.375rem; */
  height: fit-content;
  min-width: 300px;
  text-align: left;
  cursor: pointer;

  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const StyledExpandedChildren = styled.ul`
  position: relative;
  list-style: none;
  margin: 0;
  padding: 0.5rem 1rem 0.5rem 0.75rem;
  border-radius: 0.25rem;
  background: #fff;
  border: 1px solid #c6c2bf;
  box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.3);

  overflow: auto;
  max-height: 20em;
`;

export const StyledExpandedChild = styled.li`
  margin: 0.5rem 0;
`;

export const StyledTitle = styled.div``;
