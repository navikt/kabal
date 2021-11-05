import React from 'react';
import styled from 'styled-components';

interface ToolbarSeparatorProps {
  display?: boolean;
}

export const ToolbarSeparator = ({ display = true }: ToolbarSeparatorProps) =>
  display ? <ToolbarSeparatorStyle /> : null;

const ToolbarSeparatorStyle = styled.div`
  display: flex;
  margin-right: 0.5em;
  border-left: 1px solid #c9c9c9;
`;
