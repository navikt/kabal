import React from 'react';
import { StyledInfoChildren, StyledInfoHeader } from '../styled-components';

interface SubSectionProps {
  label: string;
  children: React.ReactNode;
}

export const SubSection = ({ label, children }: SubSectionProps) => (
  <label>
    <StyledInfoHeader>{label}:</StyledInfoHeader>
    <StyledInfoChildren>{children}</StyledInfoChildren>
  </label>
);
