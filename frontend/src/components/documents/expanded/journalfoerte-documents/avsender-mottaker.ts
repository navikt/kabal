import { AvsenderMottaker } from '../../../../types/arkiverte-documents';

export const formatAvsenderMottaker = (avsenderMottaker: AvsenderMottaker | null): string => {
  if (avsenderMottaker === null) {
    return 'Ingen';
  }
  const { navn, id } = avsenderMottaker;

  return navn ?? id ?? 'Ukjent';
};
