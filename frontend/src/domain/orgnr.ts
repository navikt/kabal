// https://www.brreg.no/om-oss/registrene-vare/om-enhetsregisteret/organisasjonsnummeret/
const WEIGHTS: [number, number, number, number, number, number, number, number] = [3, 2, 7, 6, 5, 4, 3, 2];

export const isValidOrgnr = (orgnr: string): boolean => {
  if (orgnr.length !== 9) {
    return false;
  }

  const parts = orgnr.split('') as [string, string, string, string, string, string, string, string, string];

  const productsSum = parts.reduce((acc, curr, index) => {
    if (indexIsInRange(index)) {
      return acc + Number.parseInt(curr, 10) * WEIGHTS[index];
    }

    return acc;
  }, 0);

  const controlNumber = 11 - (productsSum % 11);

  if (controlNumber === 10) {
    return false;
  }

  const last = Number.parseInt(parts[8], 10);

  if (controlNumber === 11) {
    return last === 0;
  }

  if (controlNumber === last) {
    return true;
  }

  return false;
};

const indexIsInRange = (index: number): index is 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 => index < 8 && index >= 0;
