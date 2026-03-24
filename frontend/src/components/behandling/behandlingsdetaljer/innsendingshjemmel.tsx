import { Label, Loader, VStack } from '@navikt/ds-react';
import { useCallback, useId, useMemo, useRef } from 'react';
import { usePanelContainerRef } from '@/components/oppgavebehandling-panels/panel-container-ref-context';
import { SearchableMultiSelect } from '@/components/searchable-select/searchable-multi-select/searchable-multi-select';
import type { Entry } from '@/components/searchable-select/virtualized-option-list';
import { useKodeverkYtelse } from '@/hooks/use-kodeverk-value';
import { useSetInnsendingshjemlerMutation } from '@/redux-api/oppgaver/mutations/behandling';
import type { IKodeverkValue } from '@/types/kodeverk';
import type { IOppgavebehandling } from '@/types/oppgavebehandling/oppgavebehandling';

interface Props {
  oppgavebehandling: IOppgavebehandling;
}

export const Innsendingshjemmel = ({ oppgavebehandling }: Props) => {
  const hjemmelCount = oppgavebehandling.hjemmelIdList.length;

  const selectId = useId();

  return (
    <VStack align="start">
      <Label htmlFor={selectId} size="small" spacing>
        {`Saken er sendt inn med ${hjemmelCount > 1 ? 'lovhjemler' : 'lovhjemmel'}`}
      </Label>

      <Innsendingshjemler oppgavebehandling={oppgavebehandling} id={selectId} />
    </VStack>
  );
};

type HjemmelOption = IKodeverkValue & { utfases: boolean };

interface InnsendingshjemlerProps extends Props {
  id?: string;
}

export const Innsendingshjemler = ({ oppgavebehandling, id }: InnsendingshjemlerProps) => {
  const containerRef = usePanelContainerRef();
  const [setInnsendingshjemler, { isError }] = useSetInnsendingshjemlerMutation();
  const [ytelse, isLoading] = useKodeverkYtelse(oppgavebehandling.ytelseId);

  const selectedUtfasesIds = useRef(
    oppgavebehandling.hjemmelIdList.filter(
      (id) => ytelse?.innsendingshjemler.find((h) => h.id === id)?.utfases === true,
    ),
  );

  const options: Entry<HjemmelOption>[] = useMemo(() => {
    if (ytelse === undefined) {
      return [];
    }

    const activeOptions = ytelse.innsendingshjemler.filter(({ utfases }) => !utfases);

    const selectedUtfasesOptions = selectedUtfasesIds.current
      .map((id) => ytelse.innsendingshjemler.find((h) => h.id === id))
      .filter((h): h is HjemmelOption => h !== undefined);

    return [...activeOptions, ...selectedUtfasesOptions]
      .toSorted((a, b) => a.navn.localeCompare(b.navn))
      .map((option) => ({
        value: option,
        key: option.id,
        label: (
          <span className="truncate">
            {option.navn}
            {option.utfases ? ' (utfases)' : ''}
          </span>
        ),
        plainText: option.navn,
      }));
  }, [ytelse]);

  const value = useMemo(
    () => options.filter(({ value: { id } }) => oppgavebehandling.hjemmelIdList.includes(id)),
    [options, oppgavebehandling.hjemmelIdList],
  );

  const handleChange = useCallback(
    (values: HjemmelOption[]) => {
      setInnsendingshjemler({
        oppgaveId: oppgavebehandling.id,
        hjemmelIdList: values.map((v) => v.id),
      });
    },
    [setInnsendingshjemler, oppgavebehandling.id],
  );

  if (isLoading) {
    return <Loader size="small" title="Laster hjemler..." />;
  }

  return (
    <SearchableMultiSelect
      id={id}
      label="Endre innsendingshjemler"
      options={options}
      value={value}
      emptyLabel="Ingen hjemler valgt"
      onChange={handleChange}
      error={isError ? 'Kunne ikke sette innsendingshjemler' : undefined}
      scrollContainerRef={containerRef}
      readOnly={oppgavebehandling.isAvsluttetAvSaksbehandler}
    />
  );
};
