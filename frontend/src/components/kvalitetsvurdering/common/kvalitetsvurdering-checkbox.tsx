import { useIsTildeltSaksbehandler } from '@app/hooks/use-is-saksbehandler';
import type { IKvalitetsvurderingBooleans } from '@app/types/kaka-kvalitetsvurdering/v2';
import type { KvalitetsvurderingV3Boolean } from '@app/types/kaka-kvalitetsvurdering/v3';
import { Checkbox, type CheckboxProps, HelpText, Radio, type RadioProps } from '@navikt/ds-react';

export const HelpTextRadio = ({ children, helpText, ...props }: RadioProps & { helpText?: string }) => (
  <Radio size="small" className="[&_.aksel-help-text]:inline-flex [&_.aksel-help-text]:align-middle" {...props}>
    {children}
    {helpText === undefined ? null : <HelpText className="ml-1">{helpText}</HelpText>}
  </Radio>
);

export const HelpTextCheckBox = ({ children, helpText, ...props }: CheckboxProps & { helpText?: string }) => (
  <Checkbox size="small" className="[&_.aksel-help-text]:inline-flex [&_.aksel-help-text]:align-middle" {...props}>
    {children}
    {helpText === undefined ? null : <HelpText className="ml-1">{helpText}</HelpText>}
  </Checkbox>
);

interface Props {
  children: React.ReactNode;
  field: keyof IKvalitetsvurderingBooleans | keyof KvalitetsvurderingV3Boolean;
  helpText?: string;
}

export const KvalitetsskjemaCheckbox = ({ children, field, helpText }: Props) => {
  const canEdit = useIsTildeltSaksbehandler();

  return (
    <HelpTextCheckBox value={field} disabled={!canEdit} data-testid={field} helpText={helpText}>
      {children}
    </HelpTextCheckBox>
  );
};
