export const getMimeType = (filePath: string): string | undefined => {
  const extension = filePath.split('.').at(-1);

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
    default:
      return undefined;
  }
};
