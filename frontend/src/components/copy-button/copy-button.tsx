import { type CopyButtonProps, CopyButton as InternalCopyBytton } from '@navikt/ds-react';

interface Props {
  text?: string | null;
  copyText?: string | null;
  title?: string;
  className?: string;
  icon?: React.ReactNode;
  size?: CopyButtonProps['size'];
  activeText?: string;
  wrap?: boolean;
  disabled?: boolean;
}

export const CopyButton = ({
  text,
  copyText = text,
  title = 'Klikk for å kopiere',
  className,
  icon,
  size = 'small',
  activeText,
  wrap = false,
  disabled = false,
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
    <InternalCopyBytton
      className={`${wrap ? 'whitespace-normal' : 'whitespace-nowrap'} wrap-anywhere hyphens-auto border-none bg-ax-bg-neutral-moderate text-left hover:bg-ax-bg-neutral-moderate-hover ${className}`}
      activeText={activeText}
      copyText={copyText}
      title={title}
      size={size}
      text={text}
      icon={icon}
      disabled={disabled}
    />
  );
};
