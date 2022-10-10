const hex = '[a-f0-9]';
const uuid = `${hex}{8}-${hex}{4}-${hex}{4}-${hex}{4}-${hex}{12}`;
const number = '\\d+';
const navIdent = '[a-z][0-9]{6}';
const idRegex = new RegExp(`\\/${uuid}|\\/${number}|\\/${navIdent}`, 'gi');
const navIdentRegex = new RegExp(navIdent, 'gi');

const API_PREFIX = '/api';
const API_PREFIX_LENGTH = API_PREFIX.length;

export const normalizePath = (path: string) => {
  const decodedPath = decodeURIComponent(path);

  if (decodedPath.startsWith(API_PREFIX)) {
    return decodedPath.substring(API_PREFIX_LENGTH).replaceAll(idRegex, '/:id').replaceAll(navIdentRegex, 'NAVIDENT');
  }

  if (decodedPath === '/error-report') {
    return decodedPath;
  }

  return '/';
};
