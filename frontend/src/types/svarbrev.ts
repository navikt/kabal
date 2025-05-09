import type { INavEmployee } from '@app/types/bruker';
import type { SaksTypeEnum } from '@app/types/kodeverk';

export enum BehandlingstidUnitType {
  WEEKS = '1',
  MONTHS = '2',
}

export const BEHANDLINGSTID_UNIT_TYPES = Object.values(BehandlingstidUnitType);

export const BEHANDLINGSTID_UNIT_TYPE_NAMES: Record<BehandlingstidUnitType, string> = {
  [BehandlingstidUnitType.WEEKS]: 'uker',
  [BehandlingstidUnitType.MONTHS]: 'måneder',
};
export const BEHANDLINGSTID_UNIT_TYPE_NAMES_SINGULAR: Record<BehandlingstidUnitType, string> = {
  [BehandlingstidUnitType.WEEKS]: 'uke',
  [BehandlingstidUnitType.MONTHS]: 'måned',
};

export const isBehandlingstidUnitType = (value: string): value is BehandlingstidUnitType =>
  BEHANDLINGSTID_UNIT_TYPES.some((t) => t === value);

interface SvarbrevSettingData {
  behandlingstidUnitTypeId: BehandlingstidUnitType;
  behandlingstidUnits: number;
  customText: string | null;
  shouldSend: boolean;
}

interface SvarbrevSettingId {
  id: string;
}

export interface SvarbrevSetting extends SvarbrevSettingId, SvarbrevSettingData {
  typeId: SaksTypeEnum.KLAGE | SaksTypeEnum.ANKE;
  ytelseId: string;
  created: string;
  modified: string;
  modifiedBy: INavEmployee;
}

export interface UpdateSvarbrevSettingParams extends SvarbrevSettingId, SvarbrevSettingData {}
