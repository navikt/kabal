import { Box, ErrorMessage, HStack, Tooltip } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/query';
import { useMemo } from 'react';
import { LoadingCellContent } from '@/components/common-table-components/loading-cell-content';
import { useTildel } from '@/components/oppgavestyring/use-tildel';
import { SearchableNavEmployeeSelect } from '@/components/searchable-select/searchable-single-select/searchable-nav-employee-select';
import { useOppgaveActions } from '@/hooks/use-oppgave-actions';
import { useGetSignatureQuery } from '@/redux-api/bruker';
import { useGetPotentialSaksbehandlereQuery } from '@/redux-api/oppgaver/queries/behandling/behandling';
import type { INavEmployee } from '@/types/bruker';
import type { IOppgave } from '@/types/oppgaver';

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

  const options = useMemo((): INavEmployee[] => {
    if (data === undefined) {
      return [];
    }

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
  }, [data, tildeltSaksbehandlerident, tildeltSaksbehandlerNavn]);

  const selectedValue = useMemo((): INavEmployee | null => {
    if (tildeltSaksbehandlerident === null) {
      return null;
    }

    return options.find(({ navIdent }) => navIdent === tildeltSaksbehandlerident) ?? null;
  }, [options, tildeltSaksbehandlerident]);

  if (saksbehandlereIsError) {
    return <ErrorMessage className="w-full truncate">Feil ved lasting</ErrorMessage>;
  }

  if (potentialSaksbehandlereIsLoading || data === undefined) {
    return <LoadingCellContent variant="rectangle" />;
  }

  return (
    <SearchableNavEmployeeSelect
      label="Velg saksbehandler"
      options={options}
      value={selectedValue}
      onChange={tildel}
      disabled={isLoading}
      nullLabel="Ikke tildelt"
      confirmLabel="Tildel"
      flip
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
