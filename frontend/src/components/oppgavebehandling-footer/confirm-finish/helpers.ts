import { SaksTypeEnum, UtfallEnum } from '@/types/kodeverk';

const LEADS_TO_ANKE_I_TRYGDERETTEN = [
  UtfallEnum.DELVIS_MEDHOLD,
  UtfallEnum.INNSTILLING_STADFESTELSE,
  UtfallEnum.INNSTILLING_AVVIST,
];

export const isAnkeToTrygderettenUtfall = (typeId: SaksTypeEnum, utfallId: UtfallEnum | null): boolean =>
  typeId === SaksTypeEnum.ANKE && utfallId !== null && LEADS_TO_ANKE_I_TRYGDERETTEN.includes(utfallId);
