import { SaksTypeEnum } from '../../../../types/kodeverk';

export const getTitleLowercase = (type: SaksTypeEnum) =>
  type === SaksTypeEnum.ANKE_I_TRYGDERETTEN ? 'fagansvarlig' : 'medunderskriver';

export const getTitleCapitalized = (type: SaksTypeEnum) =>
  type === SaksTypeEnum.ANKE_I_TRYGDERETTEN ? 'Fagansvarlig' : 'Medunderskriver';

export const getTitlePlural = (type: SaksTypeEnum) =>
  type === SaksTypeEnum.ANKE_I_TRYGDERETTEN ? 'fagansvarlige' : 'medunderskrivere';
