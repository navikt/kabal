import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { useCanEdit } from '@app/hooks/use-can-edit';
import { useKvalitetsvurdering } from '@app/hooks/use-kvalitetsvurdering';
import { useValidationError } from '@app/hooks/use-validation-error';
import { useUpdateKvalitetsvurderingMutation } from '@app/redux-api/kaka-kvalitetsvurdering/v1';
import { Radiovalg } from '@app/types/kaka-kvalitetsvurdering/radio';
import { SaksTypeEnum } from '@app/types/kodeverk';
import { Heading, HStack, Loader, Radio, RadioGroup } from '@navikt/ds-react';
import { type Reason, Reasons } from './reasons';
import { FormSection, StyledHelpText } from './styled-components';
import { useKvalitetsvurderingV1FieldName } from './use-field-name';

export const Klageforberedelsen = () => {
  const [kvalitetsvurdering, isLoading] = useKvalitetsvurdering();
  const [updateKvalitetsvurdering] = useUpdateKvalitetsvurderingMutation();
  const canEdit = useCanEdit();
  const validationError = useValidationError('klageforberedelsenRadioValg');
  const header = useKvalitetsvurderingV1FieldName('klageforberedelsenRadioValg');
  const { data: oppgave, isLoading: isOppgavebehandlingLoading } = useOppgave();

  if (
    isLoading ||
    typeof kvalitetsvurdering === 'undefined' ||
    isOppgavebehandlingLoading ||
    typeof oppgave === 'undefined'
  ) {
    return <Loader size="xlarge" />;
  }

  if (oppgave.typeId === SaksTypeEnum.ANKE) {
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
      <HStack align="center" gap="2">
        <Heading level="2" size="small">
          {header}
        </Heading>
        <StyledHelpText>
          Vedtaksinstansen skal gjøre en ny prøving av eget vedtak, vise klagers argumenter og begrunne hvorfor vedtaket
          blir fastholdt.
        </StyledHelpText>
      </HStack>
      <RadioGroup
        error={klageforberedelsenRadioValg === null ? validationError : undefined}
        legend="Vedtaksinstansen skal gjøre en ny prøving av eget vedtak, vise klagers argumenter og begrunne hvorfor vedtaket blir fastholdt."
        hideLegend
        disabled={!canEdit}
        size="small"
        value={klageforberedelsenRadioValg}
      >
        <HStack justify="space-between" width="300px">
          <Radio
            value={Radiovalg.BRA}
            onChange={() => updateKvalitetsvurdering({ id, klageforberedelsenRadioValg: Radiovalg.BRA })}
          >
            Bra/godt nok
          </Radio>
          <Radio
            value={Radiovalg.MANGELFULLT}
            onChange={() => updateKvalitetsvurdering({ id, klageforberedelsenRadioValg: Radiovalg.MANGELFULLT })}
          >
            Mangelfullt
          </Radio>
        </HStack>
      </RadioGroup>
      <Reasons
        show={klageforberedelsenRadioValg === Radiovalg.MANGELFULLT}
        legendText="Hva er mangelfullt?"
        reasons={reasons}
        error={validationError}
      />
    </FormSection>
  );
};
