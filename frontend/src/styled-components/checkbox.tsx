import React from 'react';
import styled from 'styled-components';

const Checkbox = React.forwardRef<
  HTMLInputElement,
  React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>
>((props, ref) => <input {...props} type="checkbox" ref={ref} />);

Checkbox.displayName = 'Checkbox';

export const StyledCheckbox = styled(Checkbox)`
  appearance: none;
  border-radius: 4px;
  box-shadow: none;
  width: 24px;
  height: 24px;
  margin: 0;
  flex-shrink: 0;
  border-width: 1px;
  border-style: solid;

  box-shadow: ${({ theme }: { theme: { focused: boolean } }) => (theme.focused ? '0 0 0 3px #254b6d' : 'none')};

  &:focus,
  &:active {
    outline: 0;
    box-shadow: 0 0 0 3px #254b6d;
  }

  &:enabled {
    cursor: pointer;
    background-color: #fff;
    border-color: #6a6a6a;
  }

  &:disabled {
    cursor: not-allowed;
    background-color: #f1f1f1;
    border-color: #6a6a6a;
  }

  &:checked {
    background-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMyAxMCI+ICAgIDxnPiAgICA8cGF0aCBmaWxsPSIjRkZGRkZGIiBkPSJNNCwxMGMtMC40LDAtMC44LTAuMS0xLjEtMC40TDAuNCw3LjFDMC4xLDYuOCwwLDYuNCwwLDZzMC4yLTAuOCwwLjUtMS4xQzEsNC40LDIsNC40LDIuNSw0LjlMNCw2LjRsNi40LTYgICAgQzEwLjgsMC4xLDExLjEsMCwxMS41LDBjMC40LDAsMC44LDAuMiwxLDAuNWMwLjYsMC42LDAuNSwxLjYtMC4xLDIuMXYwTDUsOS42QzQuNyw5LjksNC40LDEwLDQsMTB6IE0xMS44LDEuOUwxMS44LDEuOSAgICBDMTEuOCwxLjksMTEuOCwxLjksMTEuOCwxLjl6IE0xMS4yLDEuMUMxMS4yLDEuMSwxMS4yLDEuMSwxMS4yLDEuMUwxMS4yLDEuMXoiLz4gICAgPC9nPjwvc3ZnPg==);
    background-position: center center;
    background-repeat: no-repeat;
    background-size: 75%;

    &:enabled {
      background-color: #0067c5;
      border-color: #0067c5;
    }

    &:disabled {
      background-color: #a0a0a0;
      border-color: #a0a0a0;
    }
  }
`;
