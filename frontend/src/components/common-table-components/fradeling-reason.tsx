import { InformationSquareIcon } from '@navikt/aksel-icons';
import { Button, Loader, Popover } from '@navikt/ds-react';
import React, { useContext, useRef, useState } from 'react';
import { styled } from 'styled-components';
import { StaticDataContext } from '@app/components/app/static-data-context';
import { isoDateTimeToPretty } from '@app/domain/date';
import { formatEmployeeName } from '@app/domain/employee-name';
import { useGetFradelingReasonQuery } from '@app/redux-api/oppgaver/queries/behandling/behandling';
import { FradelReason, FradelReasonText } from '@app/types/oppgaver';

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
        variant="tertiary"
        size="small"
      />

      <Popover open={openState} onClose={() => setOpenState(false)} anchorEl={buttonRef.current}>
        <Popover.Content>
          <Line>
            {user.navIdent === data.actor?.navIdent ? 'Du' : formatEmployeeName(data.actor, 'Ukjent')} la saken tilbake
            i felles kø <Time dateTime={data.timestamp}>{isoDateTimeToPretty(data.timestamp)}</Time>.
          </Line>
          {data.event.fradelingReasonId === null || data.event.fradelingReasonId === FradelReason.LEDER ? null : (
            <Line>
              Årsak: <b>{FradelReasonText[data.event.fradelingReasonId]}</b>
            </Line>
          )}
        </Popover.Content>
      </Popover>
    </>
  );
};

const Time = styled.time`
  font-weight: normal;
`;

const Line = styled.p`
  margin: 0;
`;
