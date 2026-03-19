import type { CopyButtonProps } from '@navikt/ds-react';
import { useMemo } from 'react';
import { CopyButton } from '@/components/copy-button/copy-button';
import { formatIdNumber } from '@/functions/format-id';

interface Props extends Omit<CopyButtonProps, 'id' | 'copyText' | 'text' | 'activeText'> {
  id: string;
}

export const CopyIdButton = ({ id, ...props }: Props) => {
  const formatted = useMemo(() => formatIdNumber(id), [id]);

  return <CopyButton copyText={id} text={formatted} activeText={formatted} {...props} />;
};
