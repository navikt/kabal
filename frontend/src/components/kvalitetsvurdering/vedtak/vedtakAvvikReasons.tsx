import { Checkbox, CheckboxGruppe } from 'nav-frontend-skjema';
import React, { useMemo } from 'react';
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
  const checkedReasons = kvalitetsvurdering.kvalitetsavvikVedtak;
  const checkboxes = useVedtakCheckboxes(checkedReasons);

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
                  kvalitetsavvikVedtak: checkedReasons.filter((reason) => reason !== e.target.value),
                });
              } else {
                updateKvalitetsskjema({
                  ...kvalitetsvurdering,
                  kvalitetsavvikVedtak: checkedReasons.concat(e.target.value),
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
  IKKE_BRUKT_RIKTIG_HJEMMEL = '1',
  INNHOLDET_I_RETTSREGLENE_IKKE_TILSTREKKELIG_BESKREVET = '2',
  VURDERINGEN_AV_FAKTUM_ER_MANGELFULL = '3',
  BEGRUNNELSEN_ER_IKKE_TILSTREKKELIG_KONKRET = '4',
  FORMIDLINGEN_ER_IKKE_TYDELIG = '5',
}

const useVedtakCheckboxes = (checked: string[]) =>
  useMemo(
    () => [
      {
        id: REASONS.IKKE_BRUKT_RIKTIG_HJEMMEL,
        label: 'Det er ikke brukt riktig hjemmel/er',
        value: REASONS.IKKE_BRUKT_RIKTIG_HJEMMEL,
        checked: checked.includes(REASONS.IKKE_BRUKT_RIKTIG_HJEMMEL),
      },
      {
        id: REASONS.INNHOLDET_I_RETTSREGLENE_IKKE_TILSTREKKELIG_BESKREVET,
        label: 'Innholdet i rettsreglene er ikke tilstrekkelig beskrevet',
        value: REASONS.INNHOLDET_I_RETTSREGLENE_IKKE_TILSTREKKELIG_BESKREVET,
        checked: checked.includes(REASONS.INNHOLDET_I_RETTSREGLENE_IKKE_TILSTREKKELIG_BESKREVET),
      },
      {
        id: REASONS.VURDERINGEN_AV_FAKTUM_ER_MANGELFULL,
        label: 'Vurderingen av faktum/bevisvurderingen er mangelfull',
        value: REASONS.VURDERINGEN_AV_FAKTUM_ER_MANGELFULL,
        checked: checked.includes(REASONS.VURDERINGEN_AV_FAKTUM_ER_MANGELFULL),
      },
      {
        id: REASONS.BEGRUNNELSEN_ER_IKKE_TILSTREKKELIG_KONKRET,
        label: 'Begrunnelsen er ikke tilstrekkelig konkret og individuell',
        value: REASONS.BEGRUNNELSEN_ER_IKKE_TILSTREKKELIG_KONKRET,
        checked: checked.includes(REASONS.BEGRUNNELSEN_ER_IKKE_TILSTREKKELIG_KONKRET),
      },
      {
        id: REASONS.FORMIDLINGEN_ER_IKKE_TYDELIG,
        label: 'Formidlingen er ikke tydelig',
        value: REASONS.FORMIDLINGEN_ER_IKKE_TYDELIG,
        checked: checked.includes(REASONS.FORMIDLINGEN_ER_IKKE_TYDELIG),
      },
    ],
    [checked]
  );
