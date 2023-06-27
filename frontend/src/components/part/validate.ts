import { dnr, fnr } from '@navikt/fnrvalidator';
import { isValidOrgnr } from '@app/domain/orgnr';

const NUMBER_REGEX = /^([\d]{9}|[\d]{11})$/;

export const cleanAndValidate = (idNumber: string): [string, string | undefined] => {
  const value = idNumber.replaceAll(' ', '');

  const charError = NUMBER_REGEX.test(value) ? undefined : 'Ugyldig fødselsnummer/D-nummer eller organisasjonsnummer';

  if (charError !== undefined) {
    return [value, charError];
  }

  if (value.length === 11) {
    const idNumError =
      fnr(value).status !== 'valid' || dnr(value).status !== 'valid' ? 'Ugyldig fødselsnummer/D-nummer' : undefined;

    return [value, idNumError];
  }

  if (value.length === 9) {
    const orgNumError = !isValidOrgnr(value) ? 'Ugyldig organisasjonsnummer' : undefined;

    return [value, orgNumError];
  }

  return [value, undefined];
};
