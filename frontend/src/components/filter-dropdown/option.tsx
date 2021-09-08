import React from 'react';
import styled from 'styled-components';

interface FilterProps {
  onChange: (id: string | null, active: boolean) => void;
  active: boolean;
  filterId?: string | null;
}

export const Filter: React.FC<FilterProps> = ({ active, filterId = null, children, onChange }) => (
  <StyledLabel>
    <StyledInput type="checkbox" checked={active} onChange={(event) => onChange(filterId, event.target.checked)} />
    {children}
  </StyledLabel>
);

const StyledLabel = styled.label`
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 0.5em 1em;
  font-size: 1em;
  font-weight: 400;
  user-select: none;
  white-space: nowrap;
  word-break: keep-all;

  &:hover {
    color: #0067c5;
  }
`;

const StyledInput = styled.input`
  cursor: pointer;
  -moz-appearance: none;
  -webkit-appearance: none;
  border: 1px solid #78706a;
  border-radius: 0.25rem;
  box-shadow: none;
  width: 20px;
  height: 20px;
  margin-right: 1rem;

  &:focus,
  &:active {
    outline: 0;
    box-shadow: 0 0 0 3px #254b6d;
  }

  &:checked {
    background: #0067c5
      url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMyAxMCI+ICAgIDxnPiAgICA8cGF0aCBmaWxsPSIjRkZGRkZGIiBkPSJNNCwxMGMtMC40LDAtMC44LTAuMS0xLjEtMC40TDAuNCw3LjFDMC4xLDYuOCwwLDYuNCwwLDZzMC4yLTAuOCwwLjUtMS4xQzEsNC40LDIsNC40LDIuNSw0LjlMNCw2LjRsNi40LTYgICAgQzEwLjgsMC4xLDExLjEsMCwxMS41LDBjMC40LDAsMC44LDAuMiwxLDAuNWMwLjYsMC42LDAuNSwxLjYtMC4xLDIuMXYwTDUsOS42QzQuNyw5LjksNC40LDEwLDQsMTB6IE0xMS44LDEuOUwxMS44LDEuOSAgICBDMTEuOCwxLjksMTEuOCwxLjksMTEuOCwxLjl6IE0xMS4yLDEuMUMxMS4yLDEuMSwxMS4yLDEuMSwxMS4yLDEuMUwxMS4yLDEuMXoiLz4gICAgPC9nPjwvc3ZnPg==)
      no-repeat center center;
    background-size: 75%;
  }
`;
