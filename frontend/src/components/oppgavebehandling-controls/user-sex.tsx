import { FigureCombinationFillIcon, FigureInwardFillIcon, FigureOutwardFillIcon } from '@navikt/aksel-icons';
import { type TagProps, Tooltip } from '@navikt/ds-react';
import { SexEnum } from '@/types/kodeverk';

interface Props {
  sex: SexEnum;
  size?: TagProps['size'];
}

export const UserSex = ({ sex, size = 'medium' }: Props) => {
  const className = getSize(size);

  switch (sex) {
    case SexEnum.FEMALE:
      return (
        <Tooltip content="Kvinne">
          <FigureOutwardFillIcon aria-hidden role="presentation" className={className} />
        </Tooltip>
      );
    case SexEnum.MALE:
      return (
        <Tooltip content="Mann">
          <FigureInwardFillIcon aria-hidden role="presentation" className={className} />
        </Tooltip>
      );
    case SexEnum.UNKNOWN:
      return (
        <Tooltip content="Nøytral">
          <FigureCombinationFillIcon aria-hidden role="presentation" className={className} />
        </Tooltip>
      );
  }
};

const getSize = (size: TagProps['size']) => {
  switch (size) {
    case 'xsmall':
      return 'size-5';
    case 'small':
      return 'size-6';
    case 'medium':
      return 'size-8';
  }
};
