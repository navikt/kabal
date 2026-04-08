import { HStack, Tag, type TagProps } from '@navikt/ds-react';
import type { IFamilyMemberStatus, ISakenGjelder } from '@/types/oppgave-common';
import { PartStatusEnum } from '@/types/oppgave-common';

interface Props extends Pick<ISakenGjelder, 'protectedFamilyMembers'> {}

export const ProtectedFamilyMemberStatuses = ({ protectedFamilyMembers }: Props) => {
  const statuses = getUniqueStatuses(protectedFamilyMembers.flatMap((member) => member.statusList));

  if (statuses.length === 0) {
    return null;
  }

  return (
    <HStack gap="space-4" wrap>
      {statuses.map((status) => (
        <Tag key={status} variant={STATUS_VARIANT[status]} size="small">
          {STATUS_NAMES[status]} (familieforhold)
        </Tag>
      ))}
    </HStack>
  );
};

const getUniqueStatuses = (statuses: IFamilyMemberStatus[]): IFamilyMemberStatus['status'][] => {
  const unique = new Set<IFamilyMemberStatus['status']>();

  for (const { status } of statuses) {
    unique.add(status);
  }

  return unique.values().toArray();
};

const STATUS_NAMES: Record<IFamilyMemberStatus['status'], string> = {
  [PartStatusEnum.EGEN_ANSATT]: 'Egen ansatt',
  [PartStatusEnum.FORTROLIG]: 'Fortrolig',
  [PartStatusEnum.STRENGT_FORTROLIG]: 'Strengt fortrolig',
};

const STATUS_VARIANT: Record<IFamilyMemberStatus['status'], TagProps['variant']> = {
  [PartStatusEnum.EGEN_ANSATT]: 'warning',
  [PartStatusEnum.FORTROLIG]: 'info',
  [PartStatusEnum.STRENGT_FORTROLIG]: 'alt1',
};
