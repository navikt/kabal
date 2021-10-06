import { Checkbox, CheckboxGruppe } from 'nav-frontend-skjema';
import React, { useMemo } from 'react';
import { IKodeverkVerdi, useGetKodeverkQuery } from '../../../redux-api/kodeverk';
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
  const { data: kodeverk } = useGetKodeverkQuery();
  const kvalitetsAvvik = typeof kodeverk !== 'undefined' ? kodeverk.kvalitetsavvikUtredning : [];

  const checkedReasons = kvalitetsvurdering.kvalitetsavvikUtredning;
  const checkboxes = useUtredningCheckboxes(kvalitetsAvvik, checkedReasons);

  if (!show || !kodeverk) {
    return null;
  }

  return (
    <ReasonsField>
      <CheckboxGruppe legend={'Hva er kvalitetsavviket? Fyll ut minst 1.'}>
        {checkboxes.map((checkbox) => (
          <Checkbox
            key={checkbox.id}
            label={checkbox.label}
            value={checkbox.id}
            checked={checkbox.checked}
            onChange={({ target }) => {
              if (checkedReasons.includes(target.value)) {
                updateKvalitetsskjema({
                  ...kvalitetsvurdering,
                  kvalitetsavvikUtredning: checkedReasons.filter((reason) => reason !== target.value),
                });
              } else {
                updateKvalitetsskjema({
                  ...kvalitetsvurdering,
                  kvalitetsavvikUtredning: checkedReasons.concat(target.value),
                });
              }
            }}
          />
        ))}
      </CheckboxGruppe>
    </ReasonsField>
  );
};

const useUtredningCheckboxes = (kvalitetsAvvik: IKodeverkVerdi[], checked: string[]) =>
  useMemo(
    () =>
      kvalitetsAvvik.map((avvik) => ({
        id: avvik.id,
        label: avvik.beskrivelse,
        value: avvik.id,
        checked: checked.includes(avvik.id),
      })),
    [kvalitetsAvvik, checked]
  );
