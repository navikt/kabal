import { SexEnum } from '@app/types/kodeverk';
import { FemaleIcon } from './icons/female';
import { MaleIcon } from './icons/male';
import { NeutralIcon } from './icons/neutral';

interface Props {
  sex: SexEnum;
}

export const UserSex = ({ sex }: Props) => {
  switch (sex) {
    case SexEnum.FEMALE:
      return <FemaleIcon alt="Kvinne" />;
    case SexEnum.MALE:
      return <MaleIcon alt="Mann" />;
    case SexEnum.UNKNOWN:
      return <NeutralIcon alt="Nøytral" />;
  }
};
