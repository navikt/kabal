import { SaksTypeEnum } from '@app/types/kodeverk';
import { BehandlingstidUnitType } from '@app/types/svarbrev';

export interface PreviewRequestsBody {
  typeId: SaksTypeEnum.KLAGE | SaksTypeEnum.ANKE;
  ytelseId: string;
  behandlingstidUnits: number;
  behandlingstidUnitTypeId: BehandlingstidUnitType;
  customText: string | null;
}

const CACHE: Map<string, string> = new Map();

/**
 * Clears the cache of PDFs.
 * @see https://developer.mozilla.org/en-US/docs/Web/API/URL/revokeObjectURL
 * @see https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL_static#memory_management
 */
export const clearPdfCache = () => {
  for (const url of CACHE.values()) {
    URL.revokeObjectURL(url);
  }

  CACHE.clear();
};

export const getPdfUrl = async (body: PreviewRequestsBody, signal?: AbortSignal): Promise<string> => {
  const key = JSON.stringify(body);
  const cached = CACHE.get(key);

  if (cached !== undefined) {
    return cached;
  }

  const res = await fetch(`/api/kabal-api/svarbrev-preview/anonymous${PDF_PARAMS}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    signal,
  });

  const blob = await res.blob();
  const url = URL.createObjectURL(blob);

  CACHE.set(key, url);

  return url;
};

const PDF_PARAMS = '#toolbar=1&view=fitH&zoom=page-width';
