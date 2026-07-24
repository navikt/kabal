import { Button, VStack } from '@navikt/ds-react';
import { useCallback, useState } from 'react';
import { INITIAL_FIELDS } from '@/components/send-to-tr/constants';
import { Errors, type IValidationSection, isReduxValidationResponse } from '@/components/send-to-tr/error-summary';
import { Fields } from '@/components/send-to-tr/fields';
import { Person } from '@/components/send-to-tr/person';
import { SelectGosysOppgave } from '@/components/send-to-tr/select-gosys-oppgave';
import type { AnkeFormFields, RegisteredAnke } from '@/components/send-to-tr/types';
import { toast } from '@/components/toast/store';
import { useSendToTrygderettenMutation } from '@/redux-api/send-to-trygderetten';
import type { IYtelse } from '@/types/kodeverk';
import type { ListGosysOppgave } from '@/types/oppgavebehandling/oppgavebehandling';

interface AnkeFormProps {
  fnr: string;
  selectedYtelse: IYtelse;
  onRegistered: (registeredAnke: RegisteredAnke) => void;
}

export const AnkeForm = ({ fnr, selectedYtelse, onRegistered }: AnkeFormProps) => {
  const [selectedGosysOppgave, setSelectedGosysOppgave] = useState<ListGosysOppgave | undefined>(undefined);
  const [formFields, setFormFields] = useState<AnkeFormFields>(INITIAL_FIELDS);
  const [register, { isLoading: isRegistering }] = useSendToTrygderettenMutation();
  const [errors, setErrors] = useState<IValidationSection[]>([]);
  const { innsendingshjemler } = selectedYtelse;

  const onSelectGosysOppgave = useCallback((oppgave: ListGosysOppgave) => {
    setFormFields((prev) => ({ ...prev, gosysOppgaveId: oppgave.id }));
    setSelectedGosysOppgave(oppgave);
  }, []);

  const registerAnke = async () => {
    try {
      const ankeId = await register({
        ...formFields,
        sakenGjelder: fnr,
        ytelseId: selectedYtelse.id,
        sakMottattKlageinstans: formFields.sakMottattKlageinstans ?? '',
        sendtTilTrygderetten: formFields.sendtTilTrygderetten ?? '',
      }).unwrap();

      onRegistered({
        ankeId,
        fnr,
        ytelse: selectedYtelse,
        fields: formFields,
        gosysOppgave: selectedGosysOppgave,
      });
    } catch (e) {
      if (isReduxValidationResponse(e)) {
        setErrors(e.data.sections);
      } else {
        setErrors([]);
        toast.error('Kunne ikke registrere anken. Prøv igjen senere.');
      }
    }
  };

  return (
    <VStack gap="space-16" align="start" marginBlock="space-16 space-0">
      <Person fnr={fnr} size="small" />

      <SelectGosysOppgave
        fnr={fnr}
        ytelseId={selectedYtelse.id}
        selectedGosysOppgave={selectedGosysOppgave}
        onSelect={onSelectGosysOppgave}
      />

      <VStack gap="space-16">
        <Fields hjemler={innsendingshjemler} setFormFields={setFormFields} formFields={formFields} errors={errors} />

        <Errors errors={errors} />

        <Button className="w-fit" onClick={registerAnke} loading={isRegistering}>
          Fullfør registrering
        </Button>
      </VStack>
    </VStack>
  );
};
