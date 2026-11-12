import { HelpText, HStack, Label, Skeleton, VStack } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/query';
import { useCallback, useId, useMemo } from 'react';
import { PermitteringsårsakWarning } from '@/components/behandling/behandlingsdetaljer/permitteringsårsak-warning';
import { OmgjøringSaksdataHjemlerList as AnkeAfter2027HjemlerList } from '@/components/kvalitetsvurdering/anke-after-2027/data';
import { useKvalitetsvurderingAnkeAfter2027State } from '@/components/kvalitetsvurdering/anke-after-2027/hooks';
import { OmgjøringSaksdataHjemlerList as AnkeITRAfter2027HjemlerList } from '@/components/kvalitetsvurdering/anke-i-tr-after-2027/data';
import { useKvalitetsvurderingAnkeITRAfter2027State } from '@/components/kvalitetsvurdering/anke-i-tr-after-2027/hooks';
import { useKvalitetsvurderingV3State } from '@/components/kvalitetsvurdering/v3/common/use-kvalitetsvurdering-v3';
import { BegrunnelsespliktenSaksdataHjemlerLists } from '@/components/kvalitetsvurdering/v3/saksbehandlingsreglene/data';
import { SærregelverketSaksdataHjemlerList } from '@/components/kvalitetsvurdering/v3/særregelverket/data';
import { usePanelContainerRef } from '@/components/oppgavebehandling-panels/panel-container-ref-context';
import { SearchableMultiSelect } from '@/components/searchable-select/searchable-multi-select/searchable-multi-select';
import type { Entry } from '@/components/searchable-select/virtualized-option-list';
import { useOppgave } from '@/hooks/oppgavebehandling/use-oppgave';
import { useCanEditBehandling } from '@/hooks/use-can-edit';
import { useLovkildeToRegistreringshjemmelForYtelse } from '@/hooks/use-kodeverk-value';
import { useValidationError } from '@/hooks/use-validation-error';
import { useUpdateRegistreringshjemlerMutation } from '@/redux-api/oppgaver/mutations/set-registreringshjemler';
import { SaksTypeEnum } from '@/types/kodeverk';
import { KvalitetsvurderingVersion } from '@/types/oppgavebehandling/oppgavebehandling';

interface HjemmelOption {
  id: string;
  navn: string;
  lovkildeNavn: string;
}

export const Lovhjemmel = () => {
  const containerRef = usePanelContainerRef();
  const [updateHjemler] = useUpdateRegistreringshjemlerMutation();
  const { data: oppgave } = useOppgave();
  const canEdit = useCanEditBehandling();
  const validationError = useValidationError('hjemmel');
  const lovKildeToRegistreringshjemler = useLovkildeToRegistreringshjemmelForYtelse(oppgave?.ytelseId ?? skipToken);
  const { update: updateKvalitetsvurdering, isLoading: kvalitetsvurderingV3IsLoading } = useKvalitetsvurderingV3State();
  const { update: updateAnkeAfter2027, isLoading: ankeAfter2027IsLoading } = useKvalitetsvurderingAnkeAfter2027State();
  const { update: updateAnkeITRAfter2027, isLoading: ankeITRAfter2027IsLoading } =
    useKvalitetsvurderingAnkeITRAfter2027State();

  const kvalitetsvurderingVersion = oppgave?.kvalitetsvurderingReference?.version;

  const hasHjemmelDependantKvalitetsvurdering =
    kvalitetsvurderingVersion === KvalitetsvurderingVersion.V3 ||
    kvalitetsvurderingVersion === KvalitetsvurderingVersion.ANKE_AFTER_2027 ||
    kvalitetsvurderingVersion === KvalitetsvurderingVersion.ANKE_I_TRYGDERETTEN_AFTER_2027;

  const isLoading = kvalitetsvurderingV3IsLoading || ankeAfter2027IsLoading || ankeITRAfter2027IsLoading;

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

  const handleChange = useCallback(
    (values: HjemmelOption[]) => {
      if (oppgave === undefined) {
        return;
      }

      const ids = values.map(({ id }) => id);

      updateHjemler({ oppgaveId: oppgave.id, hjemmelIdSet: ids });

      /* Update hjemler in kvalitetsvurdering.
       * If one: Select it
       * If multiple or zero: Reset all selected
       */
      const kvalitetsvurderingHjemler = ids.length === 1 ? ids : [];

      if (oppgave.kvalitetsvurderingReference !== null && !isLoading) {
        if (oppgave.typeId === SaksTypeEnum.ANKE_AFTER_2027) {
          updateAnkeAfter2027(getAnkeAfter2027Update(kvalitetsvurderingHjemler));
        }
        if (oppgave.typeId === SaksTypeEnum.ANKE_I_TRYGDERETTEN_AFTER_2027) {
          updateAnkeITRAfter2027(getAnkeITRAfter2027Update(kvalitetsvurderingHjemler));
        }

        updateKvalitetsvurdering(getUpdate(kvalitetsvurderingHjemler));
      }
    },
    [updateHjemler, oppgave, updateKvalitetsvurdering, isLoading, updateAnkeAfter2027, updateAnkeITRAfter2027],
  );

  const selectId = useId();

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

const getAnkeAfter2027Update = (ids: string[]) => ({
  [AnkeAfter2027HjemlerList.omgjøringFeilILovtolkningenHjemlerList]: ids,
  [AnkeAfter2027HjemlerList.omgjøringFeilIFaktagrunnlagetHjemlerList]: ids,
  [AnkeAfter2027HjemlerList.omgjøringFeilIRettsanvendelsenHjemlerList]: ids,
});

const getAnkeITRAfter2027Update = (ids: string[]) => ({
  [AnkeITRAfter2027HjemlerList.omgjøringFeilILovtolkningenHjemlerList]: ids,
  [AnkeITRAfter2027HjemlerList.omgjøringFeilIFaktagrunnlagetHjemlerList]: ids,
  [AnkeITRAfter2027HjemlerList.omgjøringFeilIRettsanvendelsenHjemlerList]: ids,
});
