import { Heading, Loader, Radio, RadioGroup } from '@navikt/ds-react';
import React from 'react';
import { useCanEdit } from '../../../hooks/use-can-edit';
import { useFieldName } from '../../../hooks/use-field-name';
import { useKvalitetsvurdering } from '../../../hooks/use-kvalitetsvurdering';
import { useValidationError } from '../../../hooks/use-validation-error';
import { useUpdateKvalitetsvurderingMutation } from '../../../redux-api/kaka-kvalitetsvurdering';
import { RadioValg } from '../../../types/kaka-kvalitetsvurdering';
import { Reason, Reasons } from './reasons';
import { FormSection, RadioButtonsRow } from './styled-components';

export const Vedtaket = () => {
  const [kvalitetsvurdering, isLoading] = useKvalitetsvurdering();
  const [updateKvalitetsvurdering] = useUpdateKvalitetsvurderingMutation();
  const canEdit = useCanEdit();
  const validationError = useValidationError('vedtaketRadioValg');
  const header = useFieldName('vedtaketRadioValg');

  if (isLoading || typeof kvalitetsvurdering === 'undefined') {
    return <Loader size="xlarge" />;
  }

  const { id, vedtaketRadioValg } = kvalitetsvurdering;

  const reasons: Reason[] = [
    {
      id: 'detErIkkeBruktRiktigHjemmel',
      label: 'Det er ikke brukt riktig hjemmel/hjemler',
      checked: kvalitetsvurdering.detErIkkeBruktRiktigHjemmel,
      helpText: 'Gjelder også når det mangler hjemler.',
    },
    {
      id: 'rettsregelenErBenyttetFeil',
      label: 'Lovbestemmelsen er tolket feil',
      checked: kvalitetsvurdering.rettsregelenErBenyttetFeil,
    },
    {
      id: 'innholdetIRettsregleneErIkkeTilstrekkeligBeskrevet',
      label: 'Innholdet i rettsreglene er ikke tilstrekkelig beskrevet',
      checked: kvalitetsvurdering.innholdetIRettsregleneErIkkeTilstrekkeligBeskrevet,
      helpText: 'Det er ikke forståelig for bruker hvordan NAV tolker lovbestemmelsen/innholdet i rettsregelen.',
    },
    {
      id: 'vurderingAvFaktumErMangelfull',
      label: 'Relevant faktum mangler eller er vurdert feil',
      checked: kvalitetsvurdering.vurderingAvFaktumErMangelfull,
      helpText: 'Har ikke sett relevante opplysninger. Har vektet eller tolket faktum feil.',
    },
    {
      id: 'detErFeilIKonkretRettsanvendelse',
      label: 'Det er feil i den konkrete rettsanvendelsen',
      checked: kvalitetsvurdering.detErFeilIKonkretRettsanvendelse,
      helpText: 'Rettsregelen og faktum er riktig, men likevel kommet til feil resultat - subsumsjonen er feil.',
    },
    {
      id: 'begrunnelsenErIkkeKonkretOgIndividuell',
      label: 'Begrunnelsen er ikke konkret og individuell',
      checked: kvalitetsvurdering.begrunnelsenErIkkeKonkretOgIndividuell,
      helpText: 'Mye standardtekst som ikke er tilpasset saken.',
    },
    {
      id: 'spraaketErIkkeTydelig',
      label: 'Språket/formidlingen er ikke tydelig',
      checked: kvalitetsvurdering.spraaketErIkkeTydelig,
      helpText: 'Språk som ikke er tilpasset mottaker, ulogisk oppbygging av innhold.',
    },
  ];

  return (
    <FormSection>
      <Heading level="2" size="small">
        {header}
      </Heading>
      <RadioGroup
        error={vedtaketRadioValg === null ? validationError : undefined}
        legend={header}
        hideLegend
        disabled={!canEdit}
        size="small"
        value={vedtaketRadioValg}
      >
        <RadioButtonsRow>
          <Radio
            onChange={() => updateKvalitetsvurdering({ id, vedtaketRadioValg: RadioValg.BRA })}
            value={RadioValg.BRA}
          >
            Bra/godt nok
          </Radio>
          <Radio
            onChange={() => updateKvalitetsvurdering({ id, vedtaketRadioValg: RadioValg.MANGELFULLT })}
            value={RadioValg.MANGELFULLT}
          >
            Mangelfullt
          </Radio>
        </RadioButtonsRow>
      </RadioGroup>
      <Reasons
        error={validationError}
        show={vedtaketRadioValg === RadioValg.MANGELFULLT}
        legendText="Hva er mangelfullt?"
        reasons={reasons}
      />
    </FormSection>
  );
};
