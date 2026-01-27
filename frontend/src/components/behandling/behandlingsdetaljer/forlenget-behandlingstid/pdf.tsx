import { validateBehandlingstid } from '@app/components/behandling/behandlingsdetaljer/forlenget-behandlingstid/validate';
import { KabalFileViewer } from '@app/components/kabal-file-viewer';
import {
  useGetOrCreateQuery,
  useSetBehandlingstidDateMutation,
  useSetBehandlingstidUnitsMutation,
  useSetBehandlingstidUnitTypeMutation,
  useSetCustomTextMutation,
  useSetFullmektigFritekstMutation,
  useSetPreviousBehandlingstidInfoMutation,
  useSetReasonMutation,
  useSetTitleMutation,
} from '@app/redux-api/forlenget-behandlingstid';
import { FilePdfIcon } from '@navikt/aksel-icons';
import { Alert, HStack, Loader, VStack } from '@navikt/ds-react';
import { useEffect, useState } from 'react';

interface VarsletFristProps {
  id: string;
  varsletFrist: string | null;
}

export const Pdf = ({ id, varsletFrist }: VarsletFristProps) => {
  const { data, isLoading, isSuccess, isError } = useGetOrCreateQuery(id);

  if (isLoading) {
    return (
      <div className="flex w-full justify-center">
        <Loader title="Laster..." size="3xlarge" />
      </div>
    );
  }

  if (isError || !isSuccess) {
    return (
      <div>
        <Alert size="small" variant="error">
          Kunne ikke hente forhåndsvisning PDF for forlenget saksbehandlingstid
        </Alert>
      </div>
    );
  }

  if (data.doNotSendLetter) {
    return null;
  }

  if (data.behandlingstid.varsletBehandlingstidUnits === null && data.behandlingstid.varsletFrist === null) {
    return <PdfPlaceholder>Fyll inn ny behandlingstid eller ny frist for å generere en forhåndsvisning</PdfPlaceholder>;
  }

  const error = validateBehandlingstid(data.behandlingstid, varsletFrist, data.varselTypeIsOriginal);

  if (error !== undefined) {
    return <PdfPlaceholder>{error}</PdfPlaceholder>;
  }

  return <PdfBody id={id} />;
};

const PdfPlaceholder = ({ children }: { children: string }) => (
  <HStack align="center" justify="center" width="100%">
    <VStack align="center">
      <FilePdfIcon fontSize={300} color="var(--ax-text-neutral-decoration)" />
      <Alert variant="info" inline size="small">
        {children}
      </Alert>
    </VStack>
  </HStack>
);

const PdfBody = ({ id }: { id: string }) => {
  const units = useFulfilledTimestamp(useSetBehandlingstidUnitsMutation({ fixedCacheKey: id })[1]);
  const typeId = useFulfilledTimestamp(useSetBehandlingstidUnitTypeMutation({ fixedCacheKey: id })[1]);
  const date = useFulfilledTimestamp(useSetBehandlingstidDateMutation({ fixedCacheKey: id })[1]);
  const title = useFulfilledTimestamp(useSetTitleMutation({ fixedCacheKey: id })[1]);
  const fullmektig = useFulfilledTimestamp(useSetFullmektigFritekstMutation({ fixedCacheKey: id })[1]);
  const prevInfo = useFulfilledTimestamp(useSetPreviousBehandlingstidInfoMutation({ fixedCacheKey: id })[1]);
  const reason = useFulfilledTimestamp(useSetReasonMutation({ fixedCacheKey: id })[1]);
  const customText = useFulfilledTimestamp(useSetCustomTextMutation({ fixedCacheKey: id })[1]);

  const [refreshKey, setRefreshKey] = useState(0);

  // Trigger refresh when any mutation completes successfully
  // biome-ignore lint/correctness/useExhaustiveDependencies: Refetch PDF when server has responded OK
  useEffect(() => {
    setRefreshKey((prev) => prev + 1);
  }, [id, units, typeId, date, title, fullmektig, prevInfo, reason, customText]);

  const pdfUrl = `/api/kabal-api/behandlinger/${id}/forlenget-behandlingstid-draft/pdf`;

  return (
    <KabalFileViewer
      files={[
        {
          variants: 'PDF',
          title: 'Forlenget behandlingstid',
          url: pdfUrl,
          query: { refreshKey: refreshKey.toString(10) },
        },
      ]}
    />
  );
};

interface Props {
  isLoading: boolean;
  isSuccess: boolean;
}

// RTKQ hook changes after both optimistic update and server response.
// We only want to react after server has responded - only then can we expect the PDF to be updated.
const useFulfilledTimestamp = ({ isLoading, isSuccess }: Props): number | undefined => {
  const [isReady, setIsReady] = useState(false);
  const [returnValue, setReturnValue] = useState<number>();

  // Only set ready after network request is started (and optimistic update is done)
  useEffect(() => {
    if (isLoading) {
      setIsReady(true);
    }
  }, [isLoading]);

  // Set return value when request is done
  useEffect(() => {
    if (isReady && !isLoading && isSuccess) {
      setReturnValue(Date.now());
      setIsReady(false);
    }
  }, [isLoading, isReady, isSuccess]);

  return returnValue;
};
