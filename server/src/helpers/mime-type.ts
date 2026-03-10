import { getLogger } from '@app/logger';

const log = getLogger('mime-types');

export const getMimeType = (fileName: string, quiet = false): string => {
  const extension = fileName.split('.').at(-1);

  switch (extension) {
    case 'css':
      return 'text/css';
    case 'js':
      return 'application/javascript';
    case 'woff2':
      return 'font/woff2';
    case 'woff':
      return 'font/woff';
    case 'html':
      return 'text/html';
    case 'json':
      return 'application/json';
    case 'png':
      return 'image/png';
    case 'svg':
      return 'image/svg+xml';
    case 'ico':
      return 'image/x-icon';
    case 'map':
      return 'application/json';
    default: {
      if (!quiet) {
        log.warn({
          msg: `Unknown MIME type for asset file "${fileName}", extension: "${extension}"`,
          data: { fileName, extension },
        });
      }

      return 'text/plain';
    }
  }
};
