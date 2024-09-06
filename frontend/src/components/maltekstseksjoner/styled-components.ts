import { styled } from 'styled-components';

interface TextListItemProps {
  $isActive: boolean;
  $isDragging: boolean;
}

const getHoverBackgroundColor = ({ $isActive, $isDragging }: TextListItemProps) => {
  if ($isDragging) {
    return 'var(--a-surface-neutral-subtle)';
  }

  if ($isActive) {
    return 'var(--a-blue-100)';
  }

  return 'var(--a-blue-50)';
};

const getBackgroundColor = ({ $isActive, $isDragging }: TextListItemProps) => {
  if ($isDragging) {
    return 'var(--a-surface-neutral-subtle)';
  }

  if ($isActive) {
    return 'var(--a-blue-100)';
  }

  return 'transparent';
};

export const TextListItem = styled.li<TextListItemProps>`
  display: flex;
  flex-direction: row;
  align-items: center;
  column-gap: var(--a-spacing-2);
  padding-left: var(--a-spacing-2);
  position: relative;
  transition-property: background-color;
  transition-duration: 0.2s;
  transition-timing-function: ease-in-out;
  border-radius: var(--a-border-radius-medium);
  background-color: ${getBackgroundColor};
  box-shadow: ${({ $isDragging }) => ($isDragging ? 'inset 0 0 0 1px rgba(0, 0, 0, 0.2)' : 'none')};
  color: ${({ $isDragging = false }) => ($isDragging ? 'rgba(0, 0, 0, 0.5)' : 'inherit')};

  &:hover {
    background-color: ${getHoverBackgroundColor};
  }
`;

interface ListItemProps {
  $isActive: boolean;
  $isDropTarget?: boolean;
  $isDragOver?: boolean;
  $isDragging?: boolean;
}

export const ListItem = styled.li<ListItemProps>`
  position: relative;
  transition-property: background-color;
  transition-duration: 0.2s;
  transition-timing-function: ease-in-out;
  border-radius: var(--a-border-radius-medium);
  background-color: ${({ $isActive }) => ($isActive ? 'var(--a-blue-100)' : 'transparent')};
  opacity: ${({ $isDragging = false }) => ($isDragging ? 0.5 : 1)};

  &:hover {
    background-color: ${({ $isActive }) => ($isActive ? 'var(--a-blue-100)' : 'var(--a-blue-50)')};
  }

  &::after {
    content: attr(data-dragovertext);
    display: ${({ $isDropTarget = false }) => ($isDropTarget ? 'flex' : 'none')};
    justify-content: center;
    align-items: center;
    position: absolute;
    bottom: 0;
    top: 0;
    left: 0;
    right: 0;
    width: 100%;
    height: 100%;
    border-radius: var(--a-border-radius-medium);
    outline: var(--a-spacing-05) dashed var(--a-border-action);
    background-color: ${({ $isDragOver = false }) =>
      $isDragOver ? 'rgba(153, 195, 255, 0.5)' : 'rgba(230, 240, 255, 0.5)'};
    text-shadow:
      1px 1px white,
      -1px -1px var(--a-bg-default);
    backdrop-filter: blur(2px);
  }
`;
