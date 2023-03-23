import React from 'react';
import { Gender } from '@app/types/kodeverk';
import { FemaleGenderIcon } from './icons/female-gender';
import { MaleGenderIcon } from './icons/male-gender';
import { NeutralGenderIcon } from './icons/neutral-gender';

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
