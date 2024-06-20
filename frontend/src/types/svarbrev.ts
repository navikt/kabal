import { INavEmployee } from '@app/types/bruker';

interface BaseSvarbrevSetting {
  id: string;
  behandlingstidWeeks: number;
  customText: string | null;
  shouldSend: boolean;
}

export interface SvarbrevSetting extends BaseSvarbrevSetting {
  ytelseId: string;
  created: string;
  modified: string;
  createdBy: INavEmployee;
}

export interface UpdateSvarbrevSettingParams extends BaseSvarbrevSetting {}
