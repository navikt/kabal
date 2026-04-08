import { type IPersonStatus, PartStatusEnum } from '@/types/oppgave-common';

export const hasFortroligStatus = (statusList: IPersonStatus[]) =>
  statusList.some(({ status }) => status === PartStatusEnum.FORTROLIG);
