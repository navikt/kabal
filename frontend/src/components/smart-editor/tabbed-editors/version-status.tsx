import { isoDateTimeToPretty } from '@app/domain/date';
import { useGetSmartDocumentVersionsQuery } from '@app/redux-api/oppgaver/queries/documents';

interface Props {
  oppgaveId: string;
  dokumentId: string;
}

export const VersionStatus = ({ oppgaveId, dokumentId }: Props) => {
  const { data = [] } = useGetSmartDocumentVersionsQuery({ dokumentId, oppgaveId });

  const latest = data.at(0);

  if (latest === undefined) {
    return null;
  }

  return <span>Sist lagret: {isoDateTimeToPretty(latest.timestamp)}</span>;
};
