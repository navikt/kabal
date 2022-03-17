import React from 'react';
import styled from 'styled-components';

interface ToolbarSeparatorProps {
  display?: boolean;
}

export const ToolbarSeparator = ({ display = true }: ToolbarSeparatorProps) =>
  display ? <ToolbarSeparatorStyle /> : null;

const ToolbarSeparatorStyle = styled.div`
  display: flex;
  border-left: 1px solid #c9c9c9;
`;
