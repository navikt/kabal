import { CopyButton } from '@app/components/copy-button/copy-button';
import { formatIdNumber } from '@app/functions/format-id';
import type { CopyButtonProps } from '@navikt/ds-react';
import { useMemo } from 'react';

interface Props extends Omit<CopyButtonProps, 'id' | 'copyText' | 'text' | 'activeText'> {
  id: string;
}

export const CopyIdButton = ({ id, ...props }: Props) => {
  const formatted = useMemo(() => formatIdNumber(id), [id]);

  return <CopyButton copyText={id} text={formatted} activeText={formatted} {...props} />;
};
