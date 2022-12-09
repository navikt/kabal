import { Checkbox } from '@navikt/ds-react';
import React, { useMemo } from 'react';
import { useCanEdit } from '../../../../hooks/use-can-edit';
import { IKvalitetsvurderingBooleans } from '../../../../types/kaka-kvalitetsvurdering/v2';
import { ContainerWithHelpText } from './container-with-helptext';

interface Props {
  children: React.ReactNode;
  field: keyof IKvalitetsvurderingBooleans;
  helpText?: string;
}

export const KvalitetsskjemaCheckbox = ({ children, field, helpText }: Props) => {
  const canEdit = useCanEdit();

  const checkbox = useMemo(
    () => (
      <Checkbox value={field} disabled={!canEdit} data-testid={field} size="small">
        {children}
      </Checkbox>
    ),
    [canEdit, children, field]
  );

  if (typeof helpText === 'string') {
    return <ContainerWithHelpText helpText={helpText}>{checkbox}</ContainerWithHelpText>;
  }

  return checkbox;
};
