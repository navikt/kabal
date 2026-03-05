import { FemaleIcon } from '@app/components/oppgavebehandling-controls/icons/female';
import { MaleIcon } from '@app/components/oppgavebehandling-controls/icons/male';
import { NeutralIcon } from '@app/components/oppgavebehandling-controls/icons/neutral';
import { SexEnum } from '@app/types/kodeverk';

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
