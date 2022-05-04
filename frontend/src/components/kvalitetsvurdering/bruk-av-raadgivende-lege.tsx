import { Loader } from '@navikt/ds-react';
import { Radio } from 'nav-frontend-skjema';
import React from 'react';
import { useCanEdit } from '../../hooks/use-can-edit';
import { useFieldName } from '../../hooks/use-field-name';
import { useKvalitetsvurdering } from '../../hooks/use-kvalitetsvurdering';
import { useValidationError } from '../../hooks/use-validation-error';
import { useUpdateKvalitetsvurderingMutation } from '../../redux-api/kaka-kvalitetsvurdering';
import { RadioValgExtended } from '../../types/kaka-kvalitetsvurdering';
import { Reason, Reasons } from './reasons';
import { FormSection, RadioButtonsColumn, SubHeader } from './styled-components';

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
      <SubHeader>{header}</SubHeader>
      <RadioButtonsColumn feil={brukAvRaadgivendeLegeRadioValg === null ? validationError : undefined}>
        <Radio
          name="BrukAvRaadgivendeLegeIkkeAktuelt"
          label="Ikke aktuelt for saken"
          onChange={() =>
            updateKvalitetsvurdering({ id, brukAvRaadgivendeLegeRadioValg: RadioValgExtended.IKKE_AKTUELT })
          }
          checked={brukAvRaadgivendeLegeRadioValg === RadioValgExtended.IKKE_AKTUELT}
          disabled={!canEdit}
        />
        <Radio
          name="BrukAvRaadgivendeLegeBra"
          label="Bra/godt nok"
          onChange={() => updateKvalitetsvurdering({ id, brukAvRaadgivendeLegeRadioValg: RadioValgExtended.BRA })}
          checked={brukAvRaadgivendeLegeRadioValg === RadioValgExtended.BRA}
          disabled={!canEdit}
        />
        <Radio
          name="BrukAvRaadgivendeLegeMangelfullt"
          label="Mangelfullt"
          onChange={() =>
            updateKvalitetsvurdering({ id, brukAvRaadgivendeLegeRadioValg: RadioValgExtended.MANGELFULLT })
          }
          checked={brukAvRaadgivendeLegeRadioValg === RadioValgExtended.MANGELFULLT}
          disabled={!canEdit}
        />
      </RadioButtonsColumn>
      <Reasons
        error={validationError}
        show={brukAvRaadgivendeLegeRadioValg === RadioValgExtended.MANGELFULLT}
        legendText="Hva er mangelfullt?"
        reasons={reasons}
      />
    </FormSection>
  );
};
