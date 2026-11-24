import { HelpText, HStack, Label, Skeleton, VStack } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/query';
import { useId, useMemo } from 'react';
import { PermitteringsårsakWarning } from '@/components/behandling/behandlingsdetaljer/permitteringsårsak-warning';
import { useKvalitetsvurderingAnkeAfter2027State } from '@/components/kvalitetsvurdering/anke-after-2027/hooks';
import { useKvalitetsvurderingAnkeITRAfter2027State } from '@/components/kvalitetsvurdering/anke-i-tr-after-2027/hooks';
import { useKvalitetsvurderingV3State } from '@/components/kvalitetsvurdering/v3/common/use-kvalitetsvurdering-v3';
import { BegrunnelsespliktenSaksdataHjemlerLists } from '@/components/kvalitetsvurdering/v3/saksbehandlingsreglene/data';
import { SærregelverketSaksdataHjemlerList } from '@/components/kvalitetsvurdering/v3/særregelverket/data';
import { usePanelContainerRef } from '@/components/oppgavebehandling-panels/panel-container-ref-context';
import { SearchableMultiSelect } from '@/components/searchable-select/searchable-multi-select/searchable-multi-select';
import type { Entry } from '@/components/searchable-select/virtualized-option-list';
import { toast } from '@/components/toast/store';
import { useOppgave } from '@/hooks/oppgavebehandling/use-oppgave';
import { useCanEditBehandling } from '@/hooks/use-can-edit';
import { useLovkildeToRegistreringshjemmelForYtelse } from '@/hooks/use-kodeverk-value';
import { useValidationError } from '@/hooks/use-validation-error';
import { useUpdateRegistreringshjemlerMutation } from '@/redux-api/oppgaver/mutations/set-registreringshjemler';
import { SaksTypeEnum } from '@/types/kodeverk';
import type {
  Section as AnkeAfter2027Section,
  KvalitetsvurderingDataAnkeAfter2027,
  OmgjortIKlageomgangen,
} from '@/types/kvalitetsvurdering/anke-after-2027';
import type {
  Section as AnkeITRAfter2027Section,
  KvalitetsvurderingDataAnkeITRAfter2027,
  OmgjortIAnkeomgangen,
} from '@/types/kvalitetsvurdering/anke-i-tr-after-2027';
import { isKakaKvalitetsvurdering, isKantKvalitetsvurdering } from '@/types/kvalitetsvurdering/common';
import { KvalitetsvurderingVersion } from '@/types/oppgavebehandling/oppgavebehandling';

interface HjemmelOption {
  id: string;
  navn: string;
  lovkildeNavn: string;
}

export const Lovhjemmel = () => {
  const containerRef = usePanelContainerRef();
  const [updateHjemler] = useUpdateRegistreringshjemlerMutation();
  const { data: oppgave, isSuccess } = useOppgave();
  const canEdit = useCanEditBehandling();
  const validationError = useValidationError('hjemmel');
  const lovKildeToRegistreringshjemler = useLovkildeToRegistreringshjemmelForYtelse(oppgave?.ytelseId ?? skipToken);
  const {
    update: updateKvalitetsvurdering,
    isLoading: v3IsLoading,
    isSuccess: v3IsSuccess,
  } = useKvalitetsvurderingV3State();
  const {
    update: updateAnkeAfter2027,
    kvalitetsvurdering: ankeAfter2027,
    isLoading: ankeAfter2027IsLoading,
    isSuccess: ankeAfter2027IsSuccess,
  } = useKvalitetsvurderingAnkeAfter2027State();
  const {
    update: updateAnkeITRAfter2027,
    kvalitetsvurdering: ankeITRAfter2027,
    isLoading: ankeITRAfter2027IsLoading,
    isSuccess: ankeITRAfter2027IsSuccess,
  } = useKvalitetsvurderingAnkeITRAfter2027State();

  const isLoading = v3IsLoading || ankeAfter2027IsLoading || ankeITRAfter2027IsLoading;

  const options = useMemo<Entry<HjemmelOption>[]>(
    () =>
      lovKildeToRegistreringshjemler.flatMap(({ lovkilde, registreringshjemler }) =>
        registreringshjemler.map(({ id, navn }) => {
          const hjemmel: HjemmelOption = { id, navn, lovkildeNavn: lovkilde.navn };

          return {
            value: hjemmel,
            key: id,
            plainText: `${lovkilde.navn} - ${navn}`,
            label: (
              <span className="truncate">
                <span className="text-ax-text-neutral-subtle">{lovkilde.navn}</span>
                {' - '}
                {navn}
              </span>
            ),
          };
        }),
      ),
    [lovKildeToRegistreringshjemler],
  );

  const selected = oppgave?.resultat.hjemmelIdSet;

  const value = useMemo(() => options.filter(({ key }) => selected?.includes(key) === true), [options, selected]);

  const selectId = useId();

  if (!isSuccess) {
    return null;
  }

  const hasHjemmelDependantKvalitetsvurdering = isKantKvalitetsvurdering(oppgave) || isKakaKvalitetsvurdering(oppgave);

  const handleChange = (values: HjemmelOption[]) => {
    if (oppgave === undefined || !hasHjemmelDependantKvalitetsvurdering) {
      return;
    }

    const ids = values.map(({ id }) => id);

    updateHjemler({ oppgaveId: oppgave.id, hjemmelIdSet: ids });

    /* Update hjemler in kvalitetsvurdering.
     * If one: Select it
     * If multiple or zero: Reset all selected
     */
    const kvalitetsvurderingHjemler = ids.length === 1 ? ids : [];

    if (
      isKantKvalitetsvurdering(oppgave) &&
      oppgave.typeId === SaksTypeEnum.ANKE_AFTER_2027 &&
      ankeAfter2027IsSuccess
    ) {
      return updateAnkeAfter2027(
        getAnkeAfter2027Update(kvalitetsvurderingHjemler, ankeAfter2027.omgjortIKlageomgangen),
      );
    }

    if (
      isKantKvalitetsvurdering(oppgave) &&
      oppgave.typeId === SaksTypeEnum.ANKE_I_TRYGDERETTEN_AFTER_2027 &&
      ankeITRAfter2027IsSuccess
    ) {
      return updateAnkeITRAfter2027(
        getAnkeITRAfter2027Update(kvalitetsvurderingHjemler, ankeITRAfter2027.omgjortIAnkeomgangen),
      );
    }

    if (
      isKakaKvalitetsvurdering(oppgave) &&
      oppgave.kvalitetsvurderingReference.version === KvalitetsvurderingVersion.V3 &&
      v3IsSuccess
    ) {
      return updateKvalitetsvurdering(getUpdate(kvalitetsvurderingHjemler));
    }

    toast.error(`Kunne ikke oppdatere kvalitetsvurdering${ids.length === 1 ? ' med valgt hjemmel' : ''}.`);
  };

  if (oppgave === undefined) {
    return null;
  }

  if (hasHjemmelDependantKvalitetsvurdering && isLoading) {
    return <Skeleton width="100%" height="64px" variant="rounded" />;
  }

  return (
    <VStack align="start">
      <HStack align="center" gap="space-8" marginBlock="space-0 space-8" wrap={false}>
        <Label size="small" htmlFor={selectId}>
          Utfallet er basert på lovhjemmel
        </Label>

        <HelpText>
          Her setter du hjemlene som utfallet i saken er basert på. Hjemlene du setter her påvirker også hvilke gode
          formuleringer du kan sette inn i brevet, og hvilket regelverk som dukker opp i vedlegget nederst.
        </HelpText>
      </HStack>

      <SearchableMultiSelect
        id={selectId}
        label="Hjemmel"
        options={options}
        value={value}
        emptyLabel="Velg hjemler"
        onChange={handleChange}
        error={validationError}
        scrollContainerRef={containerRef}
        readOnly={!canEdit}
      />

      {selected?.includes(FTRL_4_7_FØRSTE_LEDD_PERMITTERINGSÅRSAK) ? (
        <PermitteringsårsakWarning className="mt-2" />
      ) : null}
    </VStack>
  );
};

const getUpdate = (ids: string[]) => ({
  [SærregelverketSaksdataHjemlerList.saerregelverkDetErLagtTilGrunnFeilFaktumHjemlerList]: ids,
  [SærregelverketSaksdataHjemlerList.saerregelverkVedtaketByggerPaaFeilKonkretRettsanvendelseEllerSkjoennHjemlerList]:
    ids,
  [BegrunnelsespliktenSaksdataHjemlerLists.saksbehandlingsreglerBegrunnelsespliktenBegrunnelsenNevnerIkkeAvgjoerendeHensynHjemlerList]:
    ids,
  [BegrunnelsespliktenSaksdataHjemlerLists.saksbehandlingsreglerBegrunnelsespliktenBegrunnelsenNevnerIkkeFaktumHjemlerList]:
    ids,
  [BegrunnelsespliktenSaksdataHjemlerLists.saksbehandlingsreglerBegrunnelsespliktenBegrunnelsenViserIkkeTilRegelverketHjemlerList]:
    ids,
});

const FTRL_4_7_FØRSTE_LEDD_PERMITTERINGSÅRSAK = '240';

const getAnkeAfter2027Update = (
  ids: string[],
  omgjortIKlageomgangen: OmgjortIKlageomgangen,
): Pick<KvalitetsvurderingDataAnkeAfter2027, AnkeAfter2027Section.OmgjortIKlageomgangen> => ({
  omgjortIKlageomgangen: {
    ...omgjortIKlageomgangen,
    feilILovtolkningen: { ...omgjortIKlageomgangen.feilILovtolkningen, registreringshjemler: ids },
    feilIFaktagrunnlaget: { ...omgjortIKlageomgangen.feilIFaktagrunnlaget, registreringshjemler: ids },
    feilIRettsanvendelsen: { ...omgjortIKlageomgangen.feilIRettsanvendelsen, registreringshjemler: ids },
  },
});

const getAnkeITRAfter2027Update = (
  ids: string[],
  omgjortIAnkeomgangen: OmgjortIAnkeomgangen,
): Pick<KvalitetsvurderingDataAnkeITRAfter2027, AnkeITRAfter2027Section.OmgjortIAnkeomgangen> => ({
  omgjortIAnkeomgangen: {
    ...omgjortIAnkeomgangen,
    feilILovtolkningen: { ...omgjortIAnkeomgangen.feilILovtolkningen, registreringshjemler: ids },
    feilIFaktagrunnlaget: { ...omgjortIAnkeomgangen.feilIFaktagrunnlaget, registreringshjemler: ids },
    feilIRettsanvendelsen: { ...omgjortIAnkeomgangen.feilIRettsanvendelsen, registreringshjemler: ids },
  },
});
