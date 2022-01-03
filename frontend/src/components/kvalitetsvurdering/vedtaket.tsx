import { Radio, RadioGruppe } from 'nav-frontend-skjema';
import NavFrontendSpinner from 'nav-frontend-spinner';
import React from 'react';
import { useCanEdit } from '../../hooks/use-can-edit';
import { useFieldName } from '../../hooks/use-field-name';
import { useKvalitetsvurdering } from '../../hooks/use-kvalitetsvurdering';
import { useValidationError } from '../../hooks/use-validation-error';
import { useUpdateKvalitetsvurderingMutation } from '../../redux-api/kaka-kvalitetsvurdering';
import { RadioValg } from '../../types/kaka-kvalitetsvurdering';
import { Reason, Reasons } from './reasons';
import { FormSection, RadioButtonsRow, SubHeader } from './styled-components';

export const Vedtaket = () => {
  const [kvalitetsvurdering, isLoading] = useKvalitetsvurdering();
  const [updateKvalitetsvurdering] = useUpdateKvalitetsvurderingMutation();
  const canEdit = useCanEdit();
  const validationError = useValidationError('vedtaketRadioValg');
  const header = useFieldName('vedtaketRadioValg');

  if (isLoading || typeof kvalitetsvurdering === 'undefined') {
    return <NavFrontendSpinner />;
  }

  const { id, vedtaketRadioValg } = kvalitetsvurdering;

  const reasons: Reason[] = [
    {
      id: 'detErIkkeBruktRiktigHjemmel',
      label: 'Det er ikke brukt riktig hjemmel(er)',
      checked: kvalitetsvurdering.detErIkkeBruktRiktigHjemmel,
    },
    {
      id: 'innholdetIRettsregleneErIkkeTilstrekkeligBeskrevet',
      label: 'Innholdet i rettsreglene er ikke tilstrekkelig beskrevet',
      checked: kvalitetsvurdering.innholdetIRettsregleneErIkkeTilstrekkeligBeskrevet,
    },
    {
      id: 'rettsregelenErBenyttetFeil',
      label: 'Rettsregelen er benyttet eller tolket feil',
      checked: kvalitetsvurdering.rettsregelenErBenyttetFeil,
    },
    {
      id: 'vurderingAvFaktumErMangelfull',
      label: 'Vurdering av faktum / bevisvurdering er mangelfull',
      checked: kvalitetsvurdering.vurderingAvFaktumErMangelfull,
    },
    {
      id: 'detErFeilIKonkretRettsanvendelse',
      label: 'Det er feil i den konkrete rettsanvendelsen',
      checked: kvalitetsvurdering.detErFeilIKonkretRettsanvendelse,
    },
    {
      id: 'begrunnelsenErIkkeKonkretOgIndividuell',
      label: 'Begrunnelsen er ikke konkret og individuell',
      checked: kvalitetsvurdering.begrunnelsenErIkkeKonkretOgIndividuell,
    },
    {
      id: 'spraaketErIkkeTydelig',
      label: 'Språket/Formidlingen er ikke tydelig',
      checked: kvalitetsvurdering.spraaketErIkkeTydelig,
    },
  ];

  return (
    <FormSection>
      <SubHeader>{header}</SubHeader>
      <RadioGruppe feil={vedtaketRadioValg === null ? validationError : undefined}>
        <RadioButtonsRow>
          <Radio
            name="VedtaketBra"
            label="Bra/godt nok"
            onChange={() => updateKvalitetsvurdering({ id, vedtaketRadioValg: RadioValg.BRA })}
            checked={vedtaketRadioValg === RadioValg.BRA}
            disabled={!canEdit}
          />
          <Radio
            name="VedtaketMangelfullt"
            label="Mangelfullt"
            onChange={() => updateKvalitetsvurdering({ id, vedtaketRadioValg: RadioValg.MANGELFULLT })}
            checked={vedtaketRadioValg === RadioValg.MANGELFULLT}
            disabled={!canEdit}
          />
        </RadioButtonsRow>
      </RadioGruppe>
      <Reasons
        error={validationError}
        show={vedtaketRadioValg === RadioValg.MANGELFULLT}
        legendText="Hva er mangelfullt?"
        reasons={reasons}
      />
    </FormSection>
  );
};
