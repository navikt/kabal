export enum FieldName {
  behandling = 'behandling',
  forlengetBehandlingstidDraft = 'forlengetBehandlingstidDraft',
  behandlingstid = 'behandlingstid',
  doNotSendLetter = 'doNotSendLetter',
  reasonNoLetter = 'reasonNoLetter',
  mottakere = 'mottakere',
}

export const FIELD_LABELS: Record<FieldName, string> = {
  [FieldName.behandling]: 'Behandling',
  [FieldName.forlengetBehandlingstidDraft]: 'Forlenget behandlingstid',
  [FieldName.behandlingstid]: 'Ny behandlingstid',
  [FieldName.doNotSendLetter]: 'Endre varslet frist uten å sende brev',
  [FieldName.reasonNoLetter]: 'Hvordan du har varslet på annen måte',
  [FieldName.mottakere]: 'Mottakere',
};
