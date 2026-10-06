import { dnr, fnr } from '@navikt/fnrvalidator';

export const isFnr = (str: string): boolean => fnr(str).status === 'valid' || dnr(str).status === 'valid';
