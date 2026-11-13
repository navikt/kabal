import { Checkbox, type CheckboxProps, HelpText, Radio, type RadioProps } from '@navikt/ds-react';
import type { ReactElement } from 'react';
import { useIsTildeltSaksbehandler } from '@/hooks/use-is-saksbehandler';
import type { KvalitetsvurderingAnkeAfter2027Boolean } from '@/types/kaka-kvalitetsvurdering/anke-after-2027';
import type { KvalitetsvurderingAnkeITRAfter2027Boolean } from '@/types/kaka-kvalitetsvurdering/anke-i-tr-after-2027';
import type { IKvalitetsvurderingBooleans } from '@/types/kaka-kvalitetsvurdering/v2';
import type { KvalitetsvurderingV3Boolean } from '@/types/kaka-kvalitetsvurdering/v3';

export const HelpTextRadio = ({ children, helpText, ...props }: RadioProps & { helpText?: string }) => (
  <Radio size="small" className="[&_.aksel-help-text]:inline-flex [&_.aksel-help-text]:align-middle" {...props}>
    {children}
    {helpText === undefined ? null : <HelpText className="ml-1">{helpText}</HelpText>}
  </Radio>
);

export const HelpTextCheckBox = ({
  children,
  helpText,
  ...props
}: CheckboxProps & { helpText?: string | ReactElement }) => (
  <Checkbox size="small" className="[&_.aksel-help-text]:inline-flex [&_.aksel-help-text]:align-middle" {...props}>
    {children}
    {helpText === undefined ? null : <HelpText className="ml-1">{helpText}</HelpText>}
  </Checkbox>
);

interface Props {
  children: React.ReactNode;
  field:
    | keyof IKvalitetsvurderingBooleans
    | keyof KvalitetsvurderingV3Boolean
    | keyof KvalitetsvurderingAnkeAfter2027Boolean
    | keyof KvalitetsvurderingAnkeITRAfter2027Boolean;
  helpText?: string | ReactElement;
}

export const KvalitetsskjemaCheckbox = ({ children, field, helpText }: Props) => {
  const canEdit = useIsTildeltSaksbehandler();

  return (
    <HelpTextCheckBox value={field} disabled={!canEdit} helpText={helpText}>
      {children}
    </HelpTextCheckBox>
  );
};
