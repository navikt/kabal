import { DuaAccessCreator } from '@app/hooks/dua-access/access';
import { CreatorRole } from '@app/types/documents/documents';

export const CREATOR_ROLE_TO_DUA_ACCESS_CREATOR: Record<CreatorRole, DuaAccessCreator> = {
  [CreatorRole.KABAL_SAKSBEHANDLING]: DuaAccessCreator.KABAL_SAKSBEHANDLING,
  [CreatorRole.KABAL_ROL]: DuaAccessCreator.KABAL_ROL,
  [CreatorRole.KABAL_MEDUNDERSKRIVER]: DuaAccessCreator.KABAL_MEDUNDERSKRIVER,
  [CreatorRole.NONE]: DuaAccessCreator.NONE,
};
