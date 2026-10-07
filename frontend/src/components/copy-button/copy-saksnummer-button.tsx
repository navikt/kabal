import type { ComponentProps } from 'react';
import { CopyButton } from '@/components/copy-button/copy-button';

interface Props extends Omit<ComponentProps<typeof CopyButton>, 'copyText' | 'text' | 'activeText' | 'title'> {
  saksnummer: string;
}

export const CopySaksnummerButton = ({ saksnummer, className = '', ...props }: Props) => (
  <CopyButton
    copyText={saksnummer}
    text={saksnummer}
    activeText={saksnummer}
    title={saksnummer}
    className={`[&>.aksel-label]:truncate ${className}`}
    {...props}
  />
);
