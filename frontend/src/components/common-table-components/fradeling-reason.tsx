import { StaticDataContext } from '@app/components/app/static-data-context';
import { isoDateTimeToPretty } from '@app/domain/date';
import { formatEmployeeNameAndIdFallback } from '@app/domain/employee-name';
import { useGetFradelingReasonQuery } from '@app/redux-api/oppgaver/queries/behandling/behandling';
import { FradelReason, FradelReasonText } from '@app/types/oppgaver';
import { InformationSquareIcon } from '@navikt/aksel-icons';
import { Button, Loader, Popover } from '@navikt/ds-react';
import { useContext, useRef, useState } from 'react';

interface Props {
  oppgaveId: string;
}

export const FradelingReason = ({ oppgaveId }: Props) => {
  const { data, isFetching } = useGetFradelingReasonQuery(oppgaveId);
  const { user } = useContext(StaticDataContext);
  const [openState, setOpenState] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  if (isFetching) {
    return <Loader size="small" title="Laster..." />;
  }

  if (data === undefined || data === null) {
    return null;
  }

  return (
    <>
      <Button
        ref={buttonRef}
        onClick={() => setOpenState(!openState)}
        aria-expanded={openState}
        icon={<InformationSquareIcon aria-hidden />}
        variant="tertiary-neutral"
        size="small"
      />

      <Popover open={openState} onClose={() => setOpenState(false)} anchorEl={buttonRef.current}>
        <Popover.Content>
          <p className="m-0">
            {user.navIdent === data.actor?.navIdent ? 'Du' : formatEmployeeNameAndIdFallback(data.actor, 'Ukjent')} la
            saken tilbake i felles kø{' '}
            <time className="font-normal" dateTime={data.timestamp}>
              {isoDateTimeToPretty(data.timestamp)}
            </time>
            .
          </p>
          {data.event.fradelingReasonId === null || data.event.fradelingReasonId === FradelReason.LEDER ? null : (
            <p className="m-0">
              Årsak: <b>{FradelReasonText[data.event.fradelingReasonId]}</b>
            </p>
          )}
        </Popover.Content>
      </Popover>
    </>
  );
};
