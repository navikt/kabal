import { SaksTypeEnum } from '@app/types/kodeverk';
import type { TagProps } from '@navikt/ds-react';

export const SAKSTYPE_TO_TAG_VARIANT: Record<SaksTypeEnum, TagProps['variant']> = {
  [SaksTypeEnum.KLAGE]: 'alt1-filled',
  [SaksTypeEnum.ANKE]: 'success-filled',
  [SaksTypeEnum.ANKE_I_TRYGDERETTEN]: 'error-filled',
  [SaksTypeEnum.OMGJØRINGSKRAV]: 'info-filled',
  [SaksTypeEnum.BEHANDLING_ETTER_TR_OPPHEVET]: 'alt2-filled',
  [SaksTypeEnum.BEGJÆRING_OM_GJENOPPTAK]: 'warning-filled',
  [SaksTypeEnum.BEGJÆRING_OM_GJENOPPTAK_I_TR]: 'alt3-filled',
};
