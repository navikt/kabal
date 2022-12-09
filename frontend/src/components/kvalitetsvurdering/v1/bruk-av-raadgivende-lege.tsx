import { Heading, Loader, Radio, RadioGroup } from '@navikt/ds-react';
import React from 'react';
import { useCanEdit } from '../../../hooks/use-can-edit';
import { useFieldName } from '../../../hooks/use-field-name';
import { useKvalitetsvurdering } from '../../../hooks/use-kvalitetsvurdering';
import { useValidationError } from '../../../hooks/use-validation-error';
import { useUpdateKvalitetsvurderingMutation } from '../../../redux-api/kaka-kvalitetsvurdering';
import { RadioValgExtended } from '../../../types/kaka-kvalitetsvurdering';
import { Reason, Reasons } from './reasons';
import { FormSection } from './styled-components';

export const BrukAvRaadgivendeLege = () => {
  const [kvalitetsvurdering, isLoading] = useKvalitetsvurdering();
  const [updateKvalitetsvurdering] = useUpdateKvalitetsvurderingMutation();
  const validationError = useValidationError('brukAvRaadgivendeLegeRadioValg');
  const canEdit = useCanEdit();
  const header = useFieldName('brukAvRaadgivendeLegeRadioValg');

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
          value={RadioValgExtended.IKKE_AKTUELT}
          onChange={() =>
            updateKvalitetsvurdering({ id, brukAvRaadgivendeLegeRadioValg: RadioValgExtended.IKKE_AKTUELT })
          }
        >
          Ikke aktuelt for saken
        </Radio>
        <Radio
          value={RadioValgExtended.BRA}
          onChange={() => updateKvalitetsvurdering({ id, brukAvRaadgivendeLegeRadioValg: RadioValgExtended.BRA })}
        >
          Bra/godt nok
        </Radio>
        <Radio
          value={RadioValgExtended.MANGELFULLT}
          onChange={() =>
            updateKvalitetsvurdering({ id, brukAvRaadgivendeLegeRadioValg: RadioValgExtended.MANGELFULLT })
          }
        >
          Mangelfullt
        </Radio>
      </RadioGroup>
      <Reasons
        error={validationError}
        show={brukAvRaadgivendeLegeRadioValg === RadioValgExtended.MANGELFULLT}
        legendText="Hva er mangelfullt?"
        reasons={reasons}
      />
    </FormSection>
  );
};
