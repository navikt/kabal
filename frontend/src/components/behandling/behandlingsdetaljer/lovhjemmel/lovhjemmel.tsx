import { usePanelContainerRef } from '@app/components/oppgavebehandling-panels/panel-container-ref-context';
import { SearchableMultiSelect } from '@app/components/searchable-select/searchable-multi-select/searchable-multi-select';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { useCanEditBehandling } from '@app/hooks/use-can-edit';
import { useLovkildeToRegistreringshjemmelForYtelse } from '@app/hooks/use-kodeverk-value';
import { useValidationError } from '@app/hooks/use-validation-error';
import { useUpdateRegistreringshjemlerMutation } from '@app/redux-api/oppgaver/mutations/set-registreringshjemler';
import { HelpText, HStack, Label, VStack } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/query';
import { useCallback, useId, useMemo } from 'react';

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

  const options = useMemo<HjemmelOption[]>(
    () =>
      lovKildeToRegistreringshjemler.flatMap(({ lovkilde, registreringshjemler }) =>
        registreringshjemler.map(({ id, navn }) => ({
          id,
          navn,
          lovkildeNavn: lovkilde.navn,
        })),
      ),
    [lovKildeToRegistreringshjemler],
  );

  const selected = oppgave?.resultat.hjemmelIdSet;

  const value = useMemo(() => options.filter(({ id }) => selected?.includes(id) === true), [options, selected]);

  const handleChange = useCallback(
    (values: HjemmelOption[]) => {
      if (oppgave === undefined) {
        return;
      }

      updateHjemler({ oppgaveId: oppgave.id, hjemmelIdSet: values.map(({ id }) => id) });
    },
    [updateHjemler, oppgave],
  );

  const selectId = useId();

  if (oppgave === undefined) {
    return null;
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
        valueKey={hjemmelValueKey}
        formatOption={formatHjemmelOption}
        emptyLabel="Velg hjemler"
        filterText={hjemmelFilterText}
        onChange={handleChange}
        error={validationError}
        confirmLabel="Sett hjemler"
        scrollContainerRef={containerRef}
        readOnly={!canEdit}
      />
    </VStack>
  );
};

const hjemmelValueKey = (option: HjemmelOption): string => option.id;

const formatHjemmelOption = (option: HjemmelOption) => (
  <span className="truncate">
    <span className="text-ax-text-neutral-subtle">{option.lovkildeNavn}</span>
    {' - '}
    {option.navn}
  </span>
);

const hjemmelFilterText = (option: HjemmelOption): string => `${option.lovkildeNavn} ${option.navn}`;
