import { type CopyButtonProps, CopyButton as InternalCopyBytton } from '@navikt/ds-react';
import { styled } from 'styled-components';

interface Props {
  text?: string | null;
  copyText?: string | null;
  title?: string;
  className?: string;
  icon?: React.ReactNode;
  size?: CopyButtonProps['size'];
  activeText?: string;
}

export const CopyButton = ({
  text,
  copyText = text,
  title = 'Klikk for å kopiere',
  className,
  icon,
  size = 'small',
  activeText,
}: Props) => {
  if (
    copyText === null ||
    copyText === undefined ||
    copyText.length === 0 ||
    text === null ||
    text === undefined ||
    text.length === 0
  ) {
    return null;
  }

  return (
    <StyledCopyButton
      className={className}
      activeText={activeText}
      copyText={copyText}
      title={title}
      size={size}
      text={text}
      icon={icon}
    />
  );
};

const StyledCopyButton = styled(InternalCopyBytton)`
  border: 1px solid var(--a-border-subtle) inset;
  white-space: nowrap;
  background-color: var(--a-surface-neutral-subtle);

  &:hover {
    background-color: var(--a-surface-neutral-subtle-hover);
  }

  > .navds-label {
    width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;
