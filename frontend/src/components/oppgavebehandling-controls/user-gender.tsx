import React from 'react';
import { FemaleGenderIcon } from '../../icons/female-gender';
import { MaleGenderIcon } from '../../icons/male-gender';
import { NeutralGenderIcon } from '../../icons/neutral-gender';
import { Gender } from '../../redux-api/klagebehandling-state-types';

interface UserGenderProps {
  gender: Gender | null;
}

export const UserGender = ({ gender }: UserGenderProps) => {
  if (gender === Gender.MALE) {
    return <MaleGenderIcon alt="Mann" />;
  }

  if (gender === Gender.FEMALE) {
    return <FemaleGenderIcon alt="Kvinne" />;
  }

  return <NeutralGenderIcon alt="Nøytral" />;
};
