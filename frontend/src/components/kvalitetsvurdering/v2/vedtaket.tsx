import { Alert, Checkbox, Radio } from '@navikt/ds-react';
import React from 'react';
import { useCanEdit } from '@app/hooks/use-can-edit';
import { Radiovalg } from '@app/types/kaka-kvalitetsvurdering/radio';
import { Checkboxes } from './common/checkboxes';
import { ContainerWithHelpText } from './common/container-with-helptext';
import { RadioButtonsRow, StyledHeading, StyledRadioGroup } from './common/styled-components';
import { ICheckboxParams } from './common/types';
import { useKvalitetsvurderingV2FieldName } from './common/use-field-name';
import { useKvalitetsvurderingV2 } from './common/use-kvalitetsvurdering-v2';
import { useValidationError } from './common/use-validation-error';

const AUTOMATISK_VEDTAK_HELPTEXT =
  'Du skal gjøre de samme kvalitetsvurderingene for automatiske vedtak som for andre vedtak. Du kan krysse av for automatisk vedtak dersom det er tydelig merket i vedtaket.';

export const Vedtaket = () => {
  const { isLoading, kvalitetsvurdering, update } = useKvalitetsvurderingV2();

  const canEdit = useCanEdit();
  const validationError = useValidationError('vedtaket');
  const header = useKvalitetsvurderingV2FieldName('vedtaket');

  if (isLoading) {
    return null;
  }

  const { vedtaket, vedtaketAutomatiskVedtak: vedtakAutomatiskVedtak } = kvalitetsvurdering;

  const onChange = (value: Radiovalg) => update({ vedtaket: value });

  return (
    <section>
      <StyledHeading size="small">{header}</StyledHeading>

      {vedtakAutomatiskVedtak === true ? (
        <Alert variant="info" size="small">
          {AUTOMATISK_VEDTAK_HELPTEXT}
        </Alert>
      ) : null}
      <ContainerWithHelpText helpText={AUTOMATISK_VEDTAK_HELPTEXT}>
        <Checkbox
          value="vedtakAutomatiskVedtak"
          checked={vedtakAutomatiskVedtak}
          onChange={({ target }) => update({ vedtaketAutomatiskVedtak: target.checked })}
          size="small"
          disabled={!canEdit}
        >
          Automatisk vedtak
        </Checkbox>
      </ContainerWithHelpText>

      <StyledRadioGroup
        legend={header}
        hideLegend
        value={vedtaket}
        error={validationError}
        onChange={onChange}
        id="vedtaket"
        size="small"
      >
        <RadioButtonsRow>
          <Radio value={Radiovalg.BRA} disabled={!canEdit}>
            Bra/godt nok
          </Radio>
          <Radio value={Radiovalg.MANGELFULLT} disabled={!canEdit}>
            Mangelfullt
          </Radio>
        </RadioButtonsRow>
      </StyledRadioGroup>

      <Checkboxes
        kvalitetsvurdering={kvalitetsvurdering}
        update={update}
        checkboxes={CHECKBOXES}
        show={vedtaket === Radiovalg.MANGELFULLT}
        groupErrorField="vedtaketGroup"
        label="Hva er mangelfullt?"
      />
    </section>
  );
};

const CHECKBOXES: ICheckboxParams[] = [
  {
    field: 'vedtaketBruktFeilHjemmelEllerAlleRelevanteHjemlerErIkkeVurdert',
    label: 'Det er brukt feil hjemmel eller alle relevante hjemler er ikke vurdert.',
    hjemler: 'vedtaketBruktFeilHjemmelEllerAlleRelevanteHjemlerErIkkeVurdertHjemlerList',
    helpText: 'Du registrerer også her dersom EØS-/utenlandsproblematikk ikke er fanget opp.',
  },
  {
    field: 'vedtaketLovbestemmelsenTolketFeil',
    label: 'Lovbestemmelsen er tolket feil.',
    hjemler: 'vedtaketLovbestemmelsenTolketFeilHjemlerList',
    helpText: 'F.eks. er «en vesentlig medvirkende årsak» tolket som et krav om hovedårsak.',
  },
  {
    field: 'vedtaketInnholdetIRettsregleneErIkkeTilstrekkeligBeskrevet',
    label: 'Innholdet i rettsreglene er ikke tilstrekkelig beskrevet.',
    hjemler: 'vedtaketInnholdetIRettsregleneErIkkeTilstrekkeligBeskrevetHjemlerList',
    helpText:
      'F.eks. er ikke alle relevante momenter eller unntak beskrevet som er nødvendige for at bruker skal forstå innholdet i regelen.',
  },
  {
    field: 'vedtaketDetErLagtTilGrunnFeilFaktum',
    label: 'Det er lagt til grunn feil faktum.',
    helpText:
      'Med faktum mener vi de faktiske forhold du legger til grunn etter å ha vurdert og vektet bevisene i saken. Du registrerer her dersom alle relevante bevis ikke er sett/vurdert, herunder informasjon fra andre fagsystemer NAV har tilgang til. Du registrerer også her dersom bevis er tolket eller vektlagt feil.',
  },
  {
    field: 'vedtaketFeilKonkretRettsanvendelse',
    label: 'Feil i den konkrete rettsanvendelsen.',
    hjemler: 'vedtaketFeilKonkretRettsanvendelseHjemlerList',
    helpText:
      'Det er lagt til grunn riktig tolkning av rettsregelen og riktig faktum, men likevel kommet til feil resultat/subsumsjonen er feil.',
  },
  {
    field: 'vedtaketIkkeKonkretIndividuellBegrunnelse',
    label: 'Begrunnelsen er ikke konkret og individuell nok.',
    groupErrorField: 'vedtaketIkkeKonkretIndividuellBegrunnelseGroup',
    checkboxes: [
      {
        field: 'vedtaketIkkeKonkretIndividuellBegrunnelseIkkeGodtNokFremFaktum',
        label: 'Det går ikke godt nok frem hva slags faktum som er lagt til grunn.',
      },
      {
        field: 'vedtaketIkkeKonkretIndividuellBegrunnelseIkkeGodtNokFremHvordanRettsregelenErAnvendtPaaFaktum',
        label: 'Det går ikke godt nok frem hvordan rettsregelen er anvendt på faktum.',
      },
      {
        field: 'vedtaketIkkeKonkretIndividuellBegrunnelseMyeStandardtekst',
        label: 'Det er mye standardtekst.',
      },
    ],
  },
  {
    field: 'vedtaketSpraakOgFormidlingErIkkeTydelig',
    label: 'Språket og formidlingen er ikke tydelig.',
    helpText:
      'F.eks. er ikke språket tilpasset mottaker, oppbyggingen av innholdet er ulogisk, det er mye gjentagelser eller det er ikke mellomrom mellom ordene i brevet.',
  },
];
