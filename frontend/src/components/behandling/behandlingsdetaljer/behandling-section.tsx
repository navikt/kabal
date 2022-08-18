import React from 'react';
import { BehandlingSectionChildren, BehandlingSectionHeader } from '../styled-components';

interface SubSectionProps {
  label: string;
  children: React.ReactNode;
}

export const BehandlingSection = ({ label, children }: SubSectionProps) => (
  <div>
    <BehandlingSectionHeader>{label}:</BehandlingSectionHeader>
    <BehandlingSectionChildren>{children}</BehandlingSectionChildren>
  </div>
);
