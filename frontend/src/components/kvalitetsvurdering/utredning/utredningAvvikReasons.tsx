import { Checkbox, CheckboxGruppe } from 'nav-frontend-skjema';
import React, { useMemo } from 'react';
import { IKvalitetsvurdering } from '../../../redux-api/kvalitetsvurdering';
import { ReasonsField } from '../styled-components';

interface UtredningReasonsProps {
  kvalitetsvurdering: IKvalitetsvurdering;
  updateKvalitetsskjema: (kvalitetsvurdering: IKvalitetsvurdering) => void;
  show: boolean;
}

export const UtredningKvalitetsavvikReasons = ({
  kvalitetsvurdering,
  updateKvalitetsskjema,
  show,
}: UtredningReasonsProps) => {
  const checkedReasons = kvalitetsvurdering.kvalitetsavvikUtredning;
  const checkboxes = useUtredningCheckboxes(checkedReasons);

  if (!show) {
    return null;
  }

  return (
    <ReasonsField>
      <CheckboxGruppe legend={'Hva er kvalitetsavviket? Fyll ut minst 1.'}>
        {checkboxes.map((checkbox) => (
          <Checkbox
            key={checkbox.id}
            label={checkbox.label}
            value={checkbox.value}
            checked={checkbox.checked}
            onChange={(e) => {
              if (checkedReasons.includes(e.target.value)) {
                updateKvalitetsskjema({
                  ...kvalitetsvurdering,
                  kvalitetsavvikUtredning: checkedReasons.filter((reason) => reason !== e.target.value),
                });
              } else {
                updateKvalitetsskjema({
                  ...kvalitetsvurdering,
                  kvalitetsavvikUtredning: checkedReasons.concat(e.target.value),
                });
              }
            }}
          />
        ))}
      </CheckboxGruppe>
    </ReasonsField>
  );

  return null;
};

enum REASONS {
  MANGELFULL_UTREDNING_MEDISINSKE_FORHOLD = '1',
  MANGELFULL_UTREDNING_ARBEIDS_INNTEKTSFORHOLD = '2',
  MANGELFULL_UTREDNING_EOS_UTLANDSPROBLEMATIKK = '3',
  MANGELFULL_BRUK_AV_RAADGIVENDE_LEGE = '4',
  MANGELFULL_UTREDNING_ANDRE_FORHOLD = '5',
}

const useUtredningCheckboxes = (checked: string[]) =>
  useMemo(
    () => [
      {
        id: REASONS.MANGELFULL_UTREDNING_MEDISINSKE_FORHOLD,
        label: 'Mangelfull utredning av medisinske forhold',
        value: REASONS.MANGELFULL_UTREDNING_MEDISINSKE_FORHOLD,
        checked: checked.includes(REASONS.MANGELFULL_UTREDNING_MEDISINSKE_FORHOLD),
      },
      {
        id: REASONS.MANGELFULL_UTREDNING_ARBEIDS_INNTEKTSFORHOLD,
        label: 'Mangelfull utredning av arbeids- og inntektsforhold',
        value: REASONS.MANGELFULL_UTREDNING_ARBEIDS_INNTEKTSFORHOLD,
        checked: checked.includes(REASONS.MANGELFULL_UTREDNING_ARBEIDS_INNTEKTSFORHOLD),
      },
      {
        id: REASONS.MANGELFULL_UTREDNING_EOS_UTLANDSPROBLEMATIKK,
        label: 'Mangelfull utredning av EØS/utlandsproblematikk',
        value: REASONS.MANGELFULL_UTREDNING_EOS_UTLANDSPROBLEMATIKK,
        checked: checked.includes(REASONS.MANGELFULL_UTREDNING_EOS_UTLANDSPROBLEMATIKK),
      },
      {
        id: REASONS.MANGELFULL_BRUK_AV_RAADGIVENDE_LEGE,
        label: 'Mangelfull bruk av rådgivende lege',
        value: REASONS.MANGELFULL_BRUK_AV_RAADGIVENDE_LEGE,
        checked: checked.includes(REASONS.MANGELFULL_BRUK_AV_RAADGIVENDE_LEGE),
      },
      {
        id: REASONS.MANGELFULL_UTREDNING_ANDRE_FORHOLD,
        label: 'Mangelfull utredning av andre aktuelle forhold i saken',
        value: REASONS.MANGELFULL_UTREDNING_ANDRE_FORHOLD,
        checked: checked.includes(REASONS.MANGELFULL_UTREDNING_ANDRE_FORHOLD),
      },
    ],
    [checked]
  );
