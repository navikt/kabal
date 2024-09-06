import { css, styled } from 'styled-components';

interface Props extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  active?: boolean;
  disabled?: boolean;
}

export const DocumentLink = ({ active = false, disabled = false, children, href, ...rest }: Props) => {
  if (disabled) {
    return <DisabledDocumentLink {...rest}>{children}</DisabledDocumentLink>;
  }

  return (
    <StyledDocumentLink href={href} $isActive={active} {...rest}>
      {children}
    </StyledDocumentLink>
  );
};

const sharedCss = css`
  display: flex;
  gap: var(--a-spacing-2);
  align-items: center;
  border: none;
  padding: 0;
  font-size: inherit;
  background-color: transparent;
  padding-top: 0;
  padding-bottom: 0;
  line-height: 1.25;
  font-size: 1em;
  overflow: hidden;
  text-align: left;
  height: 100%;
`;

const DisabledDocumentLink = styled.span`
  ${sharedCss}
  color: var(--a-text-subtle);
  cursor: not-allowed;
  opacity: 0.5;
`;

const StyledDocumentLink = styled.a<{ $isActive: boolean }>`
  ${sharedCss}
  cursor: pointer;
  text-decoration: none;
  color: ${({ $isActive }) => ($isActive ? 'var(--a-text-action-selected)' : 'var(--a-text-action)')};
  text-shadow: ${({ $isActive }) => ($isActive ? '0 0 1px var(--a-text-action-selected)' : 'none')};
  user-select: text;

  &:hover {
    color: var(--a-text-action-hover);
  }

  &:visited {
    color: ${({ $isActive }) => ($isActive ? 'var(--a-text-action-selected)' : 'var(--a-text-visited)')};
  }
`;

export const EllipsisTitle = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
`;
