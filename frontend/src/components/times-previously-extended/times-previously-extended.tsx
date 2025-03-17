import { ClockIcon } from '@navikt/aksel-icons';
import { Tooltip } from '@navikt/ds-react';

export const TimesPreviouslyExtended = ({ timesPreviouslyExtended }: { timesPreviouslyExtended: number }) => {
  if (timesPreviouslyExtended === 0) {
    return null;
  }

  return (
    <Tooltip
      content={`Varslet frist i Kabal har blitt endret ${timesPreviouslyExtended} ${timesPreviouslyExtended === 1 ? 'gang' : 'ganger.'}`}
    >
      <ClockIcon aria-hidden fontSize={24} />
    </Tooltip>
  );
};
