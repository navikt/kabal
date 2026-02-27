import { type IdentifikatorPart, PartStatusEnum } from '@app/types/oppgave-common';

export const isPartSelectable = (part: IdentifikatorPart, allowUnreachable: boolean): boolean => {
  if (allowUnreachable) {
    return true;
  }

  if (part.statusList.length === 0) {
    return true;
  }

  const hasDeadOrDeleted = part.statusList.some(
    (s) => s.status === PartStatusEnum.DEAD || s.status === PartStatusEnum.DELETED,
  );

  return !hasDeadOrDeleted;
};
