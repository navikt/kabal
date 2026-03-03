import { Alert } from '@app/components/alert/alert';
import { isoDateTimeToPretty } from '@app/domain/date';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';

const START_DATE = '2023-12-08T15:30:00.00000';

export const MissingHistoryWarning = () => {
  const { data } = useOppgave();

  if (data === undefined || data.created === data.modified || data.created > START_DATE) {
    return null;
  }

  return (
    <li>
      <Alert variant="warning">
        Det finnes ingen historikk før <Time dateTime={START_DATE} />.
      </Alert>
    </li>
  );
};

interface TimeProps {
  dateTime: string;
}

const Time = ({ dateTime }: TimeProps) => (
  <time className="font-ax-bold" dateTime={dateTime}>
    {isoDateTimeToPretty(dateTime)}
  </time>
);
