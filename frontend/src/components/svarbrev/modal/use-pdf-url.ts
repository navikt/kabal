import { type PreviewRequestsBody, getPdfUrl } from '@app/components/svarbrev/modal/get-pdf-url';
import type { SaksTypeEnum } from '@app/types/kodeverk';
import type { BehandlingstidUnitType } from '@app/types/svarbrev';
import { useEffect, useRef, useState } from 'react';

interface Props {
  isOpen: boolean;
  ytelseId: string;
  typeId: SaksTypeEnum.KLAGE | SaksTypeEnum.ANKE;
  behandlingstidUnits: number;
  behandlingstidUnitTypeId: BehandlingstidUnitType;
  customText: string | null;
}

export const usePdfUrl = ({
  isOpen,
  behandlingstidUnitTypeId,
  behandlingstidUnits,
  customText,
  typeId,
  ytelseId,
}: Props) => {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  const isInitialized = useRef(false);

  // On close.
  useEffect(() => {
    if (isOpen) {
      return;
    }
    setPdfUrl(null);
    isInitialized.current = false;
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const params: PreviewRequestsBody = {
      ytelseId,
      typeId,
      behandlingstidUnits,
      behandlingstidUnitTypeId,
      customText,
    };

    const abortController = new AbortController();

    if (!isInitialized.current) {
      isInitialized.current = true;
      getPdfUrl(params, abortController.signal).then(setPdfUrl).catch(catchPdfLoadingError);

      return () => {
        abortController.abort();
        setPdfUrl(null);
      };
    }

    const timeout = setTimeout(() => {
      getPdfUrl(params, abortController.signal).then(setPdfUrl).catch(catchPdfLoadingError);
    }, 300);

    return () => {
      abortController.abort();
      clearTimeout(timeout);
    };
  }, [behandlingstidUnitTypeId, behandlingstidUnits, customText, isOpen, typeId, ytelseId]);

  return pdfUrl;
};

const catchPdfLoadingError = (error: unknown) => {
  if (error instanceof DOMException && error.name === 'AbortError') {
    return;
  }

  console.warn('Failed to fetch PDF URL:', error);
};
