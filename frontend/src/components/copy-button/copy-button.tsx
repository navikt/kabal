import { type CopyButtonProps, CopyButton as InternalCopyBytton } from '@navikt/ds-react';

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
    <InternalCopyBytton
      className={`whitespace-nowrap border-none bg-(--a-surface-neutral-subtle) hover:bg-(--a-surface-neutral-subtle-hover) ${className}`}
      activeText={activeText}
      copyText={copyText}
      title={title}
      size={size}
      text={text}
      icon={icon}
    />
  );
};
