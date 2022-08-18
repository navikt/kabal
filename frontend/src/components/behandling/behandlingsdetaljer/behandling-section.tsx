import { Label } from '@navikt/ds-react';
import React from 'react';
import { BehandlingSectionChildren, BehandlingSectionHeader } from '../styled-components';

interface SubSectionProps {
  label: string;
  children: React.ReactNode;
}

export const BehandlingSection = ({ label, children }: SubSectionProps) => (
  <label>
    <Label spacing>{label}:</Label>
    <BehandlingSectionChildren>{children}</BehandlingSectionChildren>
  </label>
);
