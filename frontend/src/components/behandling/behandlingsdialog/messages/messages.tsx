import { FinishedCaseMessages } from '@app/components/behandling/behandlingsdialog/messages/finished';
import { UnfinishedCaseMessages } from '@app/components/behandling/behandlingsdialog/messages/unfinished';
import { useIsFeilregistrert } from '@app/hooks/use-is-feilregistrert';
import { useIsFullfoert } from '@app/hooks/use-is-fullfoert';

export const Messages = () => {
  const isFullfoert = useIsFullfoert();
  const isFeilregistrert = useIsFeilregistrert();

  return isFullfoert || isFeilregistrert ? <FinishedCaseMessages /> : <UnfinishedCaseMessages />;
};
