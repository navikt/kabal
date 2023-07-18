import { FlowerPetalFallingIcon } from '@navikt/aksel-icons';
import { Tag, TagProps } from '@navikt/ds-react';
import React from 'react';
import { styled } from 'styled-components';
import { isoDateToPretty } from '@app/domain/date';
import { IOrganizationStatus, IPart, IPersonStatus, PartStatusEnum } from '@app/types/oppgave-common';

interface Props extends Pick<IPart, 'statusList'> {
  size?: TagProps['size'];
  /**
   * @default undefined
   * The variant of the tag. If undefined, the variant will be automatically set.
   */
  variant?: TagProps['variant'];
}

export const PartStatusList = ({ statusList, size, variant }: Props) => (
  <Container>
    {statusList.map((status) => (
      <PartStatus status={status} size={size} variant={variant} key={status.status} />
    ))}
  </Container>
);

interface IStatusProps {
  status: IPersonStatus | IOrganizationStatus;
  size?: TagProps['size'];
  variant?: TagProps['variant'];
}

const PartStatus = ({ status, size, variant = STATUS_VARIANT[status.status] }: IStatusProps) => {
  if (status.date === null) {
    return (
      <Tag variant={variant} size={size}>
        {STATUS_NAMES[status.status]}
      </Tag>
    );
  }

  return (
    <Tag variant={variant} size={size}>
      {STATUS_NAMES[status.status]} ({isoDateToPretty(status.date)})
    </Tag>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 4px;
`;

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
};

const STATUS_VARIANT: Record<PartStatusEnum, TagProps['variant']> = {
  [PartStatusEnum.DEAD]: 'error',
  [PartStatusEnum.DELETED]: 'error',
  [PartStatusEnum.EGEN_ANSATT]: 'warning',
  [PartStatusEnum.VERGEMAAL]: 'success',
  [PartStatusEnum.FULLMAKT]: 'success',
  [PartStatusEnum.FORTROLIG]: 'info',
  [PartStatusEnum.STRENGT_FORTROLIG]: 'alt1',
};
