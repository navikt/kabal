import React from 'react';
import { MaleGenderIcon } from '../../icons/male-gender';
import { FemaleGenderIcon } from '../../icons/female-gender';
import { NeutralGenderIcon } from '../../icons/neutral-gender';
import { Gender } from '../../redux-api/oppgave-state-types';

interface UserGenderProps {
  gender: Gender | null;
}

export const UserGender = ({ gender }: UserGenderProps) => {
  if (gender === null) {
    return <NeutralGenderIcon />;
  }
  if (gender === Gender.MALE) {
    return <MaleGenderIcon />;
  }
  if (gender === Gender.FEMALE) {
    return <FemaleGenderIcon />;
  }
  return null;
};
