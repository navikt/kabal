import { SimplePdfPreview } from '@app/components/simple-pdf-preview/simple-pdf-preview';
import { useNoFlickerReloadPdf } from '@app/components/view-pdf/no-flicker-reload';
import { useForlengetFristPdfWidth } from '@app/hooks/settings/use-setting';
import {
  useGetOrCreateQuery,
  useSetBehandlingstidDateMutation,
  useSetBehandlingstidUnitTypeMutation,
  useSetBehandlingstidUnitsMutation,
  useSetCustomTextMutation,
  useSetFullmektigFritekstMutation,
  useSetPreviousBehandlingstidInfoMutation,
  useSetReasonMutation,
  useSetTitleMutation,
} from '@app/redux-api/forlenget-behandlingstid';
import { FilePdfIcon } from '@navikt/aksel-icons';
import { Alert, Loader } from '@navikt/ds-react';
import { useMemo, useState } from 'react';

export const Pdf = ({ id }: { id: string }) => {
  const { data } = useGetOrCreateQuery(id);

  return data?.doNotSendLetter === true ? null : <PdfBody id={id} />;
};

const PdfBody = ({ id }: { id: string }) => {
  const [pdfLoading, setPdfLoading] = useState(false);
  const { value: width, setValue: setWidth } = useForlengetFristPdfWidth();
  const { data, isLoading, isSuccess, isError } = useGetOrCreateQuery(id);

  const [, { fulfilledTimeStamp: units }] = useSetBehandlingstidUnitsMutation({ fixedCacheKey: id });
  const [, { fulfilledTimeStamp: typeId }] = useSetBehandlingstidUnitTypeMutation({ fixedCacheKey: id });
  const [, { fulfilledTimeStamp: date }] = useSetBehandlingstidDateMutation({ fixedCacheKey: id });
  const [, { fulfilledTimeStamp: title }] = useSetTitleMutation({ fixedCacheKey: id });
  const [, { fulfilledTimeStamp: fullmektig }] = useSetFullmektigFritekstMutation({ fixedCacheKey: id });
  const [, { fulfilledTimeStamp: prevInfo }] = useSetPreviousBehandlingstidInfoMutation({ fixedCacheKey: id });
  const [, { fulfilledTimeStamp: reason }] = useSetReasonMutation({ fixedCacheKey: id });
  const [, { fulfilledTimeStamp: customText }] = useSetCustomTextMutation({ fixedCacheKey: id });

  // biome-ignore lint/correctness/useExhaustiveDependencies: Refetch PDF when server has responded OK
  const pdfUrl = useMemo(
    () => `/api/kabal-api/behandlinger/${id}/forlenget-behandlingstid-draft/pdf?version=${Date.now()}`,
    [id, units, typeId, date, title, fullmektig, prevInfo, reason, customText],
  );

  const noFlickerReload = useNoFlickerReloadPdf(pdfUrl, setPdfLoading);

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

  if (data.behandlingstid.varsletBehandlingstidUnits === null && data.behandlingstid.varsletFrist === null) {
    return (
      <div className="flex w-full items-center justify-center">
        <div className="flex flex-col items-center">
          <FilePdfIcon fontSize={300} color="var(--a-gray-300)" />
          <Alert variant="info" inline size="small">
            Fyll inn ny behandlingstid eller ny frist for å generere en forhåndsvisning
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <SimplePdfPreview noFlickerReload={noFlickerReload} isLoading={pdfLoading} width={width} setWidth={setWidth} />
  );
};
