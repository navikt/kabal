import { SaksTypeEnum } from '@app/types/kodeverk';

export const filterTyper = (typer: SaksTypeEnum[] | undefined) => {
  if (typer === undefined || typer.length === 0) {
    return [SaksTypeEnum.ANKE_I_TRYGDERETTEN, SaksTypeEnum.BEGJÆRING_OM_GJENOPPTAK_I_TR];
  }

  return typer.filter(
    (type) => type === SaksTypeEnum.ANKE_I_TRYGDERETTEN || type === SaksTypeEnum.BEGJÆRING_OM_GJENOPPTAK_I_TR,
  );
};
