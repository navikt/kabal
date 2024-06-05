import { Alert } from '@navikt/ds-react';
import { styled } from 'styled-components';
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
      <Alert size="small" variant="warning">
        Det finnes ingen historikk før <Time dateTime={START_DATE} />.
      </Alert>
    </li>
  );
};

interface TimeProps {
  dateTime: string;
}

const Time = ({ dateTime }: TimeProps) => <StyledTime dateTime={dateTime}>{isoDateTimeToPretty(dateTime)}</StyledTime>;

const StyledTime = styled.time`
  font-weight: bold;
`;
