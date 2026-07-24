import { dnr, fnr } from '@navikt/fnrvalidator';
import { WHITESPACE_REGEX } from '@/components/send-to-tr/constants';

export const removeWhitespace = (str: string) => str.replaceAll(WHITESPACE_REGEX, '');
export const isFnr = (str: string) => fnr(str).status === 'valid' || dnr(str).status === 'valid';
