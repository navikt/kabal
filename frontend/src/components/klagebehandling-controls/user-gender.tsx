import React from 'react';
import { Male } from '../../icons/male';
import { Female } from '../../icons/female';
import { Gender } from '../../redux-api/oppgave-state-types';
import { FemaleGenderIcon, MaleGenderIcon } from './styled-components';

interface UserGenderProps {
  gender: Gender | null;
}

export const UserGender = ({ gender }: UserGenderProps) => {
  if (gender === null) {
    return null;
  }
  if (gender === Gender.MALE) {
    return (
      <MaleGenderIcon>
        <Male />
      </MaleGenderIcon>
    );
  }
  if (gender === Gender.FEMALE) {
    return (
      <FemaleGenderIcon>
        <Female />
      </FemaleGenderIcon>
    );
  }
  return null;
};
