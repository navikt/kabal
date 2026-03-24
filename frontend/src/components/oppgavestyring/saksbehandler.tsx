import { Box, ErrorMessage, HStack, Tooltip } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/query';
import { useMemo } from 'react';
import { LoadingCellContent } from '@/components/common-table-components/loading-cell-content';
import { useTildel } from '@/components/oppgavestyring/use-tildel';
import { toNavEmployeeEntry } from '@/components/searchable-select/searchable-single-select/searchable-nav-employee-select';
import { SearchableSelect } from '@/components/searchable-select/searchable-single-select/searchable-single-select';
import type { Entry } from '@/components/searchable-select/virtualized-option-list';
import { useOppgaveActions } from '@/hooks/use-oppgave-actions';
import { useGetSignatureQuery } from '@/redux-api/bruker';
import { useGetPotentialSaksbehandlereQuery } from '@/redux-api/oppgaver/queries/behandling/behandling';
import type { INavEmployee } from '@/types/bruker';
import type { IOppgave } from '@/types/oppgaver';

const NONE_LABEL = 'Ikke tildelt';
const NONE_ENTRY: Entry<INavEmployee | null> = {
  value: null,
  key: '__none__',
  plainText: NONE_LABEL,
  label: NONE_LABEL,
};

export const Saksbehandler = (oppgave: IOppgave) => (
  <HStack align="center" justify="start" height="34px" width="100%" className="[grid-area:saksbehandler]">
    <SaksbehandlerContent {...oppgave} />
  </HStack>
);

const SaksbehandlerContent = (oppgave: IOppgave) => {
  const [access, isLoading] = useOppgaveActions(
    oppgave.tildeltSaksbehandlerident,
    oppgave.medunderskriver.employee?.navIdent ?? null,
    oppgave.medunderskriver.flowState,
    oppgave.rol.flowState,
    oppgave.ytelseId,
  );
  const { data: signature, isLoading: signatureIsLoading } = useGetSignatureQuery(
    oppgave.tildeltSaksbehandlerident ?? skipToken,
  );

  if (signatureIsLoading || isLoading) {
    return <LoadingCellContent variant="rectangle" />;
  }

  const name = signature?.customLongName ?? signature?.longName ?? null;

  if (access.assignOthers) {
    return <SelectSaksbehandler {...oppgave} tildeltSaksbehandlerNavn={name} />;
  }

  if (oppgave.tildeltSaksbehandlerident === null) {
    return <SaksbehandlerName>Ikke tildelt</SaksbehandlerName>;
  }

  const saksbehandler = `${name ?? 'Laster...'} (${oppgave.tildeltSaksbehandlerident})`;

  return <SaksbehandlerName>{saksbehandler}</SaksbehandlerName>;
};

interface ISelectSaksbehandlerProps extends Pick<IOppgave, 'id' | 'typeId' | 'ytelseId' | 'tildeltSaksbehandlerident'> {
  tildeltSaksbehandlerNavn: string | null;
}

const SelectSaksbehandler = ({
  id,
  typeId,
  ytelseId,
  tildeltSaksbehandlerident,
  tildeltSaksbehandlerNavn,
}: ISelectSaksbehandlerProps) => {
  const {
    data,
    isLoading: potentialSaksbehandlereIsLoading,
    isError: saksbehandlereIsError,
  } = useGetPotentialSaksbehandlereQuery(id);
  const [tildel, { isLoading }] = useTildel(id, typeId, ytelseId);

  const options = useMemo((): Entry<INavEmployee | null>[] => {
    if (data === undefined) {
      return [NONE_ENTRY];
    }

    const employees = (() => {
      const isCurrentInList =
        tildeltSaksbehandlerident === null ||
        data.saksbehandlere.some(({ navIdent }) => navIdent === tildeltSaksbehandlerident);

      if (isCurrentInList) {
        return data.saksbehandlere;
      }

      return [
        ...data.saksbehandlere,
        {
          navIdent: tildeltSaksbehandlerident,
          navn: tildeltSaksbehandlerNavn ?? 'Ugyldig saksbehandler',
        },
      ];
    })();

    return [NONE_ENTRY, ...employees.map(toNavEmployeeEntry)];
  }, [data, tildeltSaksbehandlerident, tildeltSaksbehandlerNavn]);

  const selectedEntry = useMemo((): Entry<INavEmployee | null> | null => {
    if (tildeltSaksbehandlerident === null) {
      return null;
    }

    return options.find((e) => e.key === tildeltSaksbehandlerident) ?? null;
  }, [options, tildeltSaksbehandlerident]);

  if (saksbehandlereIsError) {
    return <ErrorMessage className="w-full truncate">Feil ved lasting</ErrorMessage>;
  }

  if (potentialSaksbehandlereIsLoading || data === undefined) {
    return <LoadingCellContent variant="rectangle" />;
  }

  return (
    <SearchableSelect
      label="Velg saksbehandler"
      options={options}
      value={selectedEntry}
      onChange={(employee) => {
        if (employee !== null) {
          tildel(employee);
        }
      }}
      disabled={isLoading}
      nullLabel={NONE_LABEL}
      confirmLabel="Tildel"
      flip
      requireConfirmation
    />
  );
};

interface SaksbehandlerNameProps {
  children: string;
}

const SaksbehandlerName = ({ children }: SaksbehandlerNameProps) => (
  <Tooltip content={children}>
    <Box
      as="span"
      width="100%"
      overflow="hidden"
      padding="space-4"
      borderWidth="1"
      borderColor="neutral"
      borderRadius="4"
      background="default"
      className="truncate"
    >
      {children}
    </Box>
  </Tooltip>
);
