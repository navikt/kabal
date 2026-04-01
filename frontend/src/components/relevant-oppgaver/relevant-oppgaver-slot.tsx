import type { ComponentType } from 'react';

interface RelevantOppgaverProps {
  oppgaveId: string;
}

let Component: ComponentType<RelevantOppgaverProps> | null = null;

export const setRelevantOppgaverComponent = (component: ComponentType<RelevantOppgaverProps>) => {
  Component = component;
};

export const RelevantOppgaverSlot = ({ oppgaveId }: RelevantOppgaverProps) => {
  if (Component === null) {
    return null;
  }

  return <Component oppgaveId={oppgaveId} />;
};
