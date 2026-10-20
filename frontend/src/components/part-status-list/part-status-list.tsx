import { FlowerPetalFallingIcon } from '@navikt/aksel-icons';
import { HStack, Tag, type TagProps } from '@navikt/ds-react';
import { isoDateToPretty } from '@/domain/date';
import { type IOrganizationStatus, type IPart, type IPersonStatus, PartStatusEnum } from '@/types/oppgave-common';

interface Props extends Pick<IPart, 'statusList'> {
  size?: TagProps['size'];
}

export const PartStatusList = ({ statusList, size }: Props) => {
  if (statusList === null || statusList.length === 0) {
    return null;
  }

  return (
    <HStack gap="space-4" wrap>
      {statusList.map((status) => (
        <PartStatus status={status} size={size} key={status.status} />
      ))}
    </HStack>
  );
};

interface IStatusProps {
  status: IPersonStatus | IOrganizationStatus;
  size?: TagProps['size'];
}

const PartStatus = ({ status, size }: IStatusProps) => {
  const color = STATUS_COLOR[status.status];

  if (status.date === null) {
    return (
      <Tag data-color={color} size={size}>
        {STATUS_NAMES[status.status]}
      </Tag>
    );
  }

  return (
    <Tag data-color={color} size={size}>
      {STATUS_NAMES[status.status]} ({isoDateToPretty(status.date)})
    </Tag>
  );
};

const STATUS_NAMES: Record<PartStatusEnum, React.ReactNode> = {
  [PartStatusEnum.DEAD]: (
    <>
      <FlowerPetalFallingIcon aria-hidden /> Død
    </>
  ),
  [PartStatusEnum.DELETED]: 'Avviklet',
  [PartStatusEnum.EGEN_ANSATT]: 'Egen ansatt',
  [PartStatusEnum.VERGEMAAL]: 'Vergemål',
  [PartStatusEnum.FULLMAKT]: 'Fullmakt',
  [PartStatusEnum.FORTROLIG]: 'Fortrolig',
  [PartStatusEnum.STRENGT_FORTROLIG]: 'Strengt fortrolig',
  [PartStatusEnum.RESERVERT_I_KRR]: 'Reservert i KRR',
  [PartStatusEnum.DELT_ANSVAR]: 'Delt ansvar',
};

const STATUS_COLOR: Record<PartStatusEnum, TagProps['data-color']> = {
  [PartStatusEnum.DEAD]: 'danger',
  [PartStatusEnum.DELETED]: 'danger',
  [PartStatusEnum.EGEN_ANSATT]: 'warning',
  [PartStatusEnum.VERGEMAAL]: 'success',
  [PartStatusEnum.FULLMAKT]: 'success',
  [PartStatusEnum.FORTROLIG]: 'info',
  [PartStatusEnum.STRENGT_FORTROLIG]: 'meta-purple',
  [PartStatusEnum.RESERVERT_I_KRR]: 'warning',
  [PartStatusEnum.DELT_ANSVAR]: 'info',
};
