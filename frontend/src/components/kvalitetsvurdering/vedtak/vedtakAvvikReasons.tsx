import { Checkbox, CheckboxGruppe } from 'nav-frontend-skjema';
import React, { useMemo } from 'react';
import { useCanEdit } from '../../../hooks/use-can-edit';
import { useKlagebehandlingId } from '../../../hooks/use-klagebehandling-id';
import { IKodeverkVerdi, useGetKodeverkQuery } from '../../../redux-api/kodeverk';
import { IKvalitetsvurdering } from '../../../redux-api/kvalitetsvurdering';
import { ReasonsField } from '../styled-components';

interface VedtakReasonsProps {
  kvalitetsvurdering: IKvalitetsvurdering;
  updateKvalitetsskjema: (kvalitetsvurdering: IKvalitetsvurdering) => void;
  show: boolean;
}

export const VedtakKvalitetsavvikReasons = ({
  kvalitetsvurdering,
  updateKvalitetsskjema,
  show,
}: VedtakReasonsProps) => {
  const { data: kodeverk } = useGetKodeverkQuery();
  const klagebehandlingId = useKlagebehandlingId();
  const canEdit = useCanEdit(klagebehandlingId);
  const kvalitetsAvvik = typeof kodeverk !== 'undefined' ? kodeverk.kvalitetsavvikVedtak : [];
  const checkedReasons = kvalitetsvurdering.kvalitetsavvikVedtak;

  const checkboxes = useVedtakCheckboxes(kvalitetsAvvik, checkedReasons);

  if (!show || !kodeverk) {
    return null;
  }

  return (
    <ReasonsField>
      <CheckboxGruppe legend={'Hva er kvalitetsavviket?'}>
        {checkboxes.map((checkbox) => (
          <Checkbox
            key={checkbox.id}
            label={checkbox.label}
            value={checkbox.id}
            checked={checkbox.checked}
            disabled={!canEdit}
            onChange={({ target }) => {
              if (checkedReasons.includes(target.value)) {
                updateKvalitetsskjema({
                  ...kvalitetsvurdering,
                  kvalitetsavvikVedtak: checkedReasons.filter((reason) => reason !== target.value),
                });
              } else {
                updateKvalitetsskjema({
                  ...kvalitetsvurdering,
                  kvalitetsavvikVedtak: checkedReasons.concat(target.value),
                });
              }
            }}
          />
        ))}
      </CheckboxGruppe>
    </ReasonsField>
  );
};

const useVedtakCheckboxes = (kvalitetsAvvik: IKodeverkVerdi[], checked: string[]) =>
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
