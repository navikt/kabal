import { Checkbox, CheckboxGruppe } from 'nav-frontend-skjema';
import React, { useMemo } from 'react';
import { IKvalitetsvurdering } from '../../../redux-api/kvalitetsvurdering';
import { ReasonsField } from '../styled-components';

interface OversendelsesbrevReasonsProps {
  kvalitetsvurdering: IKvalitetsvurdering;
  updateKvalitetsskjema: (kvalitetsvurdering: IKvalitetsvurdering) => void;
  show: boolean;
}

export const OversendelsesbrevKvalitetsavvikReasons = ({
  kvalitetsvurdering,
  updateKvalitetsskjema,
  show,
}: OversendelsesbrevReasonsProps) => {
  const checkedReasons = kvalitetsvurdering.kvalitetsavvikOversendelsesbrev;
  const checkboxes = useOversendelsesbrevCheckboxes(checkedReasons);

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
                  kvalitetsavvikOversendelsesbrev: checkedReasons.filter((reason) => reason !== e.target.value),
                });
              } else {
                updateKvalitetsskjema({
                  ...kvalitetsvurdering,
                  kvalitetsavvikOversendelsesbrev: checkedReasons.concat(e.target.value),
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
  OVERSITTET_FRIST_IKKE_KOMMENTERT = '1',
  IKKE_GJENGITT = '2',
  MANGLER_BEGRUNNELSE = '3',
  ANFORSLER_IKKE_TILSTREKKELIG = '4',
  MANGLER_KONKLUSJON = '5',
}

const useOversendelsesbrevCheckboxes = (checked: string[]) =>
  useMemo(
    () => [
      {
        id: REASONS.OVERSITTET_FRIST_IKKE_KOMMENTERT,
        label: 'Oversittet klagefrist er ikke kommentert',
        value: REASONS.OVERSITTET_FRIST_IKKE_KOMMENTERT,
        checked: checked.includes(REASONS.OVERSITTET_FRIST_IKKE_KOMMENTERT),
      },
      {
        id: REASONS.IKKE_GJENGITT,
        label: 'Hovedinnholdet i klagen er ikke gjengitt',
        value: REASONS.IKKE_GJENGITT,
        checked: checked.includes(REASONS.IKKE_GJENGITT),
      },
      {
        id: REASONS.MANGLER_BEGRUNNELSE,
        label: 'Mangler begrunnelse for hvorfor vedtaket opprettholdes/hvorfor klager ikke oppfyller villkår',
        value: REASONS.MANGLER_BEGRUNNELSE,
        checked: checked.includes(REASONS.MANGLER_BEGRUNNELSE),
      },
      {
        id: REASONS.ANFORSLER_IKKE_TILSTREKKELIG,
        label: 'Klagers anførsler er ikke tilstrekkelig kommentert/imøtegått',
        value: REASONS.ANFORSLER_IKKE_TILSTREKKELIG,
        checked: checked.includes(REASONS.ANFORSLER_IKKE_TILSTREKKELIG),
      },
      {
        id: REASONS.MANGLER_KONKLUSJON,
        label: 'Mangler konklusjon',
        value: REASONS.MANGLER_KONKLUSJON,
        checked: checked.includes(REASONS.MANGLER_KONKLUSJON),
      },
    ],
    [checked]
  );
