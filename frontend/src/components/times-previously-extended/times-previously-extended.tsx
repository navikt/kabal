import { ExclamationmarkTriangleFillIconColored } from '@app/components/colored-icons/colored-icons';
import { Tooltip } from '@navikt/ds-react';

export const TimesPreviouslyExtended = ({ timesPreviouslyExtended }: { timesPreviouslyExtended: number }) => {
  if (timesPreviouslyExtended === 0) {
    return null;
  }

  return (
    <Tooltip
      content={`Varslet frist i Kabal har blitt endret ${timesPreviouslyExtended} ${timesPreviouslyExtended === 1 ? 'gang' : 'ganger.'}`}
    >
      <ExclamationmarkTriangleFillIconColored aria-hidden />
    </Tooltip>
  );
};
