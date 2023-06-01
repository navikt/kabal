import React from 'react';

export interface Variant {
  variant: 'secondary-neutral' | 'secondary';
}

export interface Position {
  $position: 'over' | 'below';
}

export interface OppgaveId {
  oppgaveId: string;
}

export interface Children {
  children: React.ReactNode;
}

export interface FagsystemId {
  fagsystemId: string;
}
