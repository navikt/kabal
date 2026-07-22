import { hasLovhenvisning } from '@/components/documents/new-documents/has-tr-fields';
import { ConfirmInnsendingshjemler } from '@/components/documents/new-documents/modal/innsendingshjemler';
import type { BaseFieldProps } from '@/components/documents/new-documents/modal/trygderetten-fields/base-field-props';

interface LovhenvisningFieldProps extends BaseFieldProps {
  innsendingshjemlerConfirmed: boolean;
  setInnsendingshjemlerConfirmed: (confirmed: boolean) => void;
}

export const LovhenvisningField = ({
  templateId,
  dokumentId,
  innsendingshjemlerConfirmed,
  setInnsendingshjemlerConfirmed,
  disabled,
}: LovhenvisningFieldProps) => {
  if (!hasLovhenvisning(templateId)) {
    return null;
  }

  return (
    <ConfirmInnsendingshjemler
      dokumentId={dokumentId}
      innsendingshjemlerConfirmed={innsendingshjemlerConfirmed}
      setInnsendingshjemlerConfirmed={setInnsendingshjemlerConfirmed}
      disabled={disabled}
    />
  );
};
