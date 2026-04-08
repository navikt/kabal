import { type IPersonStatus, type ISakenGjelder, PartStatusEnum } from '@/types/oppgave-common';

export const hasFortroligStatus = (statusList: IPersonStatus[]) =>
  statusList.some(({ status }) => status === PartStatusEnum.FORTROLIG || status === PartStatusEnum.STRENGT_FORTROLIG);

export const hasFortroligFamily = ({ protectedFamilyMembers }: ISakenGjelder) =>
  protectedFamilyMembers.some(({ statusList }) => hasFortroligStatus(statusList));
