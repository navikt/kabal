import { useCanEdit } from '@app/hooks/use-can-edit';
import { useKvalitetsvurdering } from '@app/hooks/use-kvalitetsvurdering';
import { useValidationError } from '@app/hooks/use-validation-error';
import { useUpdateKvalitetsvurderingMutation } from '@app/redux-api/kaka-kvalitetsvurdering/v1';
import { RadiovalgExtended } from '@app/types/kaka-kvalitetsvurdering/radio';
import { Heading, Loader, Radio, RadioGroup } from '@navikt/ds-react';
import { type Reason, Reasons } from './reasons';
import { FormSection } from './styled-components';
import { useKvalitetsvurderingV1FieldName } from './use-field-name';

export const BrukAvRaadgivendeLege = () => {
  const [kvalitetsvurdering, isLoading] = useKvalitetsvurdering();
  const [updateKvalitetsvurdering] = useUpdateKvalitetsvurderingMutation();
  const validationError = useValidationError('brukAvRaadgivendeLegeRadioValg');
  const canEdit = useCanEdit();
  const header = useKvalitetsvurderingV1FieldName('brukAvRaadgivendeLegeRadioValg');

  if (isLoading || typeof kvalitetsvurdering === 'undefined') {
    return <Loader size="xlarge" />;
  }

  const { id, brukAvRaadgivendeLegeRadioValg } = kvalitetsvurdering;

  const reasons: Reason[] = [
    {
      id: 'raadgivendeLegeErIkkeBrukt',
      label: 'Rådgivende lege er ikke brukt',
      checked: kvalitetsvurdering.raadgivendeLegeErIkkeBrukt,
    },
    {
      id: 'raadgivendeLegeErBruktFeilSpoersmaal',
      label: 'Rådgivende lege er brukt, men saksbehandler har stilt feil spørsmål og får derfor feil svar',
      checked: kvalitetsvurdering.raadgivendeLegeErBruktFeilSpoersmaal,
    },
    {
      id: 'raadgivendeLegeHarUttaltSegUtoverTrygdemedisin',
      label: 'Rådgivende lege har uttalt seg om tema utover trygdemedisin',
      checked: kvalitetsvurdering.raadgivendeLegeHarUttaltSegUtoverTrygdemedisin,
    },
    {
      id: 'raadgivendeLegeErBruktMangelfullDokumentasjon',
      label: 'Rådgivende lege er brukt, men dokumentasjonen er mangelfull / ikke skriftliggjort',
      checked: kvalitetsvurdering.raadgivendeLegeErBruktMangelfullDokumentasjon,
    },
  ];

  return (
    <FormSection>
      <Heading level="2" size="small">
        {header}
      </Heading>
      <RadioGroup
        error={brukAvRaadgivendeLegeRadioValg === null ? validationError : undefined}
        legend={header}
        hideLegend
        disabled={!canEdit}
        size="small"
        value={brukAvRaadgivendeLegeRadioValg}
      >
        <Radio
          value={RadiovalgExtended.IKKE_AKTUELT}
          onChange={() =>
            updateKvalitetsvurdering({ id, brukAvRaadgivendeLegeRadioValg: RadiovalgExtended.IKKE_AKTUELT })
          }
        >
          Ikke aktuelt for saken
        </Radio>
        <Radio
          value={RadiovalgExtended.BRA}
          onChange={() => updateKvalitetsvurdering({ id, brukAvRaadgivendeLegeRadioValg: RadiovalgExtended.BRA })}
        >
          Bra/godt nok
        </Radio>
        <Radio
          value={RadiovalgExtended.MANGELFULLT}
          onChange={() =>
            updateKvalitetsvurdering({ id, brukAvRaadgivendeLegeRadioValg: RadiovalgExtended.MANGELFULLT })
          }
        >
          Mangelfullt
        </Radio>
      </RadioGroup>
      <Reasons
        error={validationError}
        show={brukAvRaadgivendeLegeRadioValg === RadiovalgExtended.MANGELFULLT}
        legendText="Hva er mangelfullt?"
        reasons={reasons}
      />
    </FormSection>
  );
};
