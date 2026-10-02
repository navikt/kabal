import type { TagProps } from '@navikt/ds-react';
import { SaksTypeEnum } from '@/types/kodeverk';

export const SAKSTYPE_TO_TAG_VARIANT: Record<SaksTypeEnum, TagProps['data-color']> = {
  [SaksTypeEnum.KLAGE]: 'meta-purple',
  [SaksTypeEnum.ANKE]: 'success',
  [SaksTypeEnum.ANKE_AFTER_2027]: 'brand-magenta',
  [SaksTypeEnum.ANKE_I_TRYGDERETTEN]: 'danger',
  [SaksTypeEnum.ANKE_I_TRYGDERETTEN_AFTER_2027]: 'brand-beige',
  [SaksTypeEnum.OMGJØRINGSKRAV]: 'info',
  [SaksTypeEnum.BEHANDLING_ETTER_TR_OPPHEVET]: 'meta-lime',
  [SaksTypeEnum.BEGJÆRING_OM_GJENOPPTAK]: 'warning',
  [SaksTypeEnum.BEGJÆRING_OM_GJENOPPTAK_I_TR]: 'neutral',
};
