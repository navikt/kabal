import { Heading, Loader, Radio, RadioGroup } from '@navikt/ds-react';
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
import { FormSection, RadioButtonsRow, StyledHeaderHelpTextWrapper, StyledHelpText } from './styled-components';

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
      <StyledHeaderHelpTextWrapper>
        <Heading level="2" size="small">
          {header}
        </Heading>
        <StyledHelpText>
          Vedtaksinstansen skal gjøre en ny prøving av eget vedtak, vise klagers argumenter og begrunne hvorfor vedtaket
          blir fastholdt.
        </StyledHelpText>
      </StyledHeaderHelpTextWrapper>
      <RadioGroup
        error={klageforberedelsenRadioValg === null ? validationError : undefined}
        legend="Vedtaksinstansen skal gjøre en ny prøving av eget vedtak, vise klagers argumenter og begrunne hvorfor vedtaket blir fastholdt."
        hideLegend
        disabled={!canEdit}
        size="small"
        value={klageforberedelsenRadioValg}
      >
        <RadioButtonsRow>
          <Radio
            value={RadioValg.BRA}
            onChange={() => updateKvalitetsvurdering({ id, klageforberedelsenRadioValg: RadioValg.BRA })}
          >
            Bra/godt nok
          </Radio>
          <Radio
            value={RadioValg.MANGELFULLT}
            onChange={() => updateKvalitetsvurdering({ id, klageforberedelsenRadioValg: RadioValg.MANGELFULLT })}
          >
            Mangelfullt
          </Radio>
        </RadioButtonsRow>
      </RadioGroup>
      <Reasons
        show={klageforberedelsenRadioValg === RadioValg.MANGELFULLT}
        legendText="Hva er mangelfullt?"
        reasons={reasons}
        error={validationError}
      />
    </FormSection>
  );
};
