import { ENVIRONMENT } from '@app/environment';
import { TRACEPARENT_HEADER, generateTraceParent } from '@app/functions/generate-request-id';

export const getDataUrl = async (url: string, abortController: AbortController): Promise<string> => {
  const res = await fetch(url, {
    method: 'GET',
    cache: 'no-cache',
    headers: { 'x-kabal-version': ENVIRONMENT.version, [TRACEPARENT_HEADER]: generateTraceParent() },
    signal: abortController.signal,
  });

  if (!res.ok) {
    throw new Error('Could not fetch PDF.');
  }

  const blob = await res.blob();

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.addEventListener('error', () => {
      reader.abort();
      reject(reader.error);
    });

    reader.addEventListener('loadend', () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Could not read PDF.'));
      }
    });

    reader.readAsDataURL(blob);
  });
};
