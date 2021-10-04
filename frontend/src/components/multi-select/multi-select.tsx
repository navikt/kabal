import React from 'react';
import { StyledButton, StyledExpandedChildren, StyledMultiSelect } from './styled-components';

interface MultiSelectProps {
  collapsedChildren: React.ReactNode;
  expandedChildren: React.ReactNode;
}

export const MultiSelect = ({ collapsedChildren, expandedChildren }: MultiSelectProps) => (
  //   const [open, setOpen] = useState(false);

  <StyledMultiSelect>
    <StyledButton>{collapsedChildren}</StyledButton>

    <StyledExpandedChildren>{expandedChildren}</StyledExpandedChildren>
  </StyledMultiSelect>
);
