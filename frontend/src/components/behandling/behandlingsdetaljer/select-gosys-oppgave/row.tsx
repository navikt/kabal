import { TableRowContent } from '@/components/gosys-oppgave-table/table-row-content';
import { usePushEvent } from '@/observability';
import { useSetGosysOppgaveMutation } from '@/redux-api/oppgaver/mutations/set-gosys-oppgave';
import type { ListGosysOppgave } from '@/types/oppgavebehandling/oppgavebehandling';

export interface Props {
  oppgaveId: string;
  selectedGosysOppgave: ListGosysOppgave | undefined;
  gosysOppgave: ListGosysOppgave;
  showFerdigstilt: boolean;
  canEdit?: boolean;
}

export const Row = ({ gosysOppgave, selectedGosysOppgave, oppgaveId, showFerdigstilt, canEdit }: Props) => {
  const [setGosysOppgave, { isLoading }] = useSetGosysOppgaveMutation({ fixedCacheKey: oppgaveId });
  const pushEvent = usePushEvent();

  const onSelect = () => {
    pushEvent('select-gosys-oppgave', {
      oppgaveId,
      nextGosysOppgaveStatus: gosysOppgave.status,
      previousGosysOppgaveStatus: selectedGosysOppgave?.status ?? 'NONE',
    });
    setGosysOppgave({ oppgaveId, gosysOppgaveId: gosysOppgave.id });
  };

  const selected = selectedGosysOppgave !== undefined && selectedGosysOppgave.id === gosysOppgave.id;

  return (
    <TableRowContent
      onSelect={onSelect}
      gosysOppgave={gosysOppgave}
      selected={selected}
      showFerdigstilt={showFerdigstilt}
      isLoading={isLoading}
      canEdit={canEdit}
    />
  );
};
