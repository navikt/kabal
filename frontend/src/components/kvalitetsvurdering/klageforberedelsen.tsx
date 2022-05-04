import { Loader } from '@navikt/ds-react';
import { Radio, RadioGruppe } from 'nav-frontend-skjema';
import React from 'react';
import { useOppgave } from '../../hooks/oppgavebehandling/use-oppgave';
import { useCanEdit } from '../../hooks/use-can-edit';
import { useFieldName } from '../../hooks/use-field-name';
import { useKvalitetsvurdering } from '../../hooks/use-kvalitetsvurdering';
import { useValidationError } from '../../hooks/use-validation-error';
import { useUpdateKvalitetsvurderingMutation } from '../../redux-api/kaka-kvalitetsvurdering';
import { RadioValg } from '../../types/kaka-kvalitetsvurdering';
import { OppgaveType } from '../../types/kodeverk';
import { Reason, Reasons } from './reasons';
import { FormSection, RadioButtonsRow, SubHeader } from './styled-components';

export const Klageforberedelsen = () => {
  const [kvalitetsvurdering, isLoading] = useKvalitetsvurdering();
  const [updateKvalitetsvurdering] = useUpdateKvalitetsvurderingMutation();
  const canEdit = useCanEdit();
  const validationError = useValidationError('klageforberedelsenRadioValg');
  const header = useFieldName('klageforberedelsenRadioValg');
  const { data: oppgave, isLoading: isOppgavebehandlingLoading } = useOppgave();

  if (
    isLoading ||
    typeof kvalitetsvurdering === 'undefined' ||
    isOppgavebehandlingLoading ||
    typeof oppgave === 'undefined'
  ) {
    return <Loader size="xlarge" />;
  }

  if (oppgave.type === OppgaveType.ANKE) {
    return null;
  }

  const { id, klageforberedelsenRadioValg } = kvalitetsvurdering;

  const reasons: Reason[] = [
    {
      id: 'sakensDokumenter',
      label: 'Sakens dokumenter',
      checked: kvalitetsvurdering.sakensDokumenter,
      helpText:
        'Dokumentene er ikke komplette; f.eks. mangler fysisk saksmappe, feil eller mangelfull journalføring av relevante opplysninger i klagebehandlingen.',
    },
    {
      id: 'oversittetKlagefristIkkeKommentert',
      label: 'Oversittet klagefrist er ikke kommentert',
      checked: kvalitetsvurdering.oversittetKlagefristIkkeKommentert,
    },
    {
      id: 'klagerensRelevanteAnfoerslerIkkeKommentert',
      label: 'Klagerens relevante anførseler er ikke tilstrekkelig kommentert/imøtegått',
      checked: kvalitetsvurdering.klagerensRelevanteAnfoerslerIkkeKommentert,
    },
    {
      id: 'begrunnelseForHvorforAvslagOpprettholdes',
      label: 'Begrunnelse for hvorfor avslag opprettholdes / klager ikke oppfyller vilkår',
      checked: kvalitetsvurdering.begrunnelseForHvorforAvslagOpprettholdes,
    },
    {
      id: 'konklusjonen',
      label: 'Konklusjonen',
      checked: kvalitetsvurdering.konklusjonen,
      helpText: 'Mangler konklusjon eller konklusjonen er feil.',
    },
    {
      id: 'oversendelsesbrevetsInnholdIkkeISamsvarMedTema',
      label: 'Oversendelsesbrevets innhold er ikke i samsvar med sakens tema',
      checked: kvalitetsvurdering.oversendelsesbrevetsInnholdIkkeISamsvarMedTema,
      helpText:
        'Misforstått tema for saken og dermed treffer ikke behandlingen problemstillingen, tar opp nye forhold som ikke er behandlet i det opprinnelige vedtaket.',
    },
  ];

  return (
    <FormSection>
      <SubHeader>{header}</SubHeader>
      <RadioGruppe feil={klageforberedelsenRadioValg === null ? validationError : undefined}>
        <RadioButtonsRow>
          <Radio
            name="KlageforberedelsenBra"
            label="Bra/godt nok"
            onChange={() => updateKvalitetsvurdering({ id, klageforberedelsenRadioValg: RadioValg.BRA })}
            checked={klageforberedelsenRadioValg === RadioValg.BRA}
            disabled={!canEdit}
          />
          <Radio
            name="KlageforberedelsenMangelfullt"
            label="Mangelfullt"
            onChange={() => updateKvalitetsvurdering({ id, klageforberedelsenRadioValg: RadioValg.MANGELFULLT })}
            checked={klageforberedelsenRadioValg === RadioValg.MANGELFULLT}
            disabled={!canEdit}
          />
        </RadioButtonsRow>
      </RadioGruppe>
      <Reasons
        show={klageforberedelsenRadioValg === RadioValg.MANGELFULLT}
        legendText="Hva er mangelfullt?"
        reasons={reasons}
        error={validationError}
      />
    </FormSection>
  );
};
