export enum DistribusjonsType {
  BREV = '1',
  NOTAT = '2',
  // VEDLEGG = '3', // Old and unused
  VEDTAKSBREV = '4',
  BESLUTNING = '5',
  KJENNELSE_FRA_TRYGDERETTEN = '6',
  ANNEN_INNGAAENDE_POST = '7',
  SVARBREV = '8',
  FORLENGET_BEHANDLINGSTIDBREV = '9',
  EKSPEDISJONSBREV_TIL_TRYGDERETTEN = '10',
}

export const getIsIncomingDocument = (dokumentTypeId: DistribusjonsType | undefined): boolean =>
  dokumentTypeId === DistribusjonsType.KJENNELSE_FRA_TRYGDERETTEN ||
  dokumentTypeId === DistribusjonsType.ANNEN_INNGAAENDE_POST;
