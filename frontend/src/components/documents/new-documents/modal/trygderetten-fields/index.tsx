import type { BaseFieldProps } from '@/components/documents/new-documents/modal/trygderetten-fields/base-field-props';
import { ForsterketRettField } from '@/components/documents/new-documents/modal/trygderetten-fields/forsterket-rett-field';
import { LovhenvisningField } from '@/components/documents/new-documents/modal/trygderetten-fields/lovhenvisning-field';
import { PaaanketVedtaksdatoField } from '@/components/documents/new-documents/modal/trygderetten-fields/paaanket-vedtaksdato-field';

interface Props extends BaseFieldProps {
  klagevedtakDatoConfirmed: boolean;
  setKlagevedtakDatoConfirmed: (confirmed: boolean) => void;
  innsendingshjemlerConfirmed: boolean;
  setInnsendingshjemlerConfirmed: (confirmed: boolean) => void;
}

export const TrygderettenFields = ({
  klagevedtakDatoConfirmed,
  setKlagevedtakDatoConfirmed,
  innsendingshjemlerConfirmed,
  setInnsendingshjemlerConfirmed,
  ...rest
}: Props) => (
  <>
    <PaaanketVedtaksdatoField
      klagevedtakDatoConfirmed={klagevedtakDatoConfirmed}
      setKlagevedtakDatoConfirmed={setKlagevedtakDatoConfirmed}
      {...rest}
    />

    <ForsterketRettField {...rest} />

    <LovhenvisningField
      innsendingshjemlerConfirmed={innsendingshjemlerConfirmed}
      setInnsendingshjemlerConfirmed={setInnsendingshjemlerConfirmed}
      {...rest}
    />
  </>
);
