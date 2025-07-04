import { useIsTildeltSaksbehandler } from '@app/hooks/use-is-saksbehandler';
import type { IKvalitetsvurderingBooleans } from '@app/types/kaka-kvalitetsvurdering/v2';
import { Checkbox } from '@navikt/ds-react';
import { useMemo } from 'react';
import { ContainerWithHelpText } from './container-with-helptext';

interface Props {
  children: React.ReactNode;
  field: keyof IKvalitetsvurderingBooleans;
  helpText?: string;
}

export const KvalitetsskjemaCheckbox = ({ children, field, helpText }: Props) => {
  const canEdit = useIsTildeltSaksbehandler();

  const checkbox = useMemo(
    () => (
      <Checkbox value={field} disabled={!canEdit} data-testid={field} size="small">
        {children}
      </Checkbox>
    ),
    [canEdit, children, field],
  );

  if (typeof helpText === 'string') {
    return <ContainerWithHelpText helpText={helpText}>{checkbox}</ContainerWithHelpText>;
  }

  return checkbox;
};
