import { isValid, min, parse, subDays } from 'date-fns';
import { FORMAT } from '@/components/date-picker/constants';
import { Warning } from '@/components/date-picker/warning';

interface Props {
  dates: (string | null)[];
}

export const OldDateWarning = ({ dates }: Props) => {
  const now = new Date();

  const parsed = dates.flatMap((value) => {
    if (value === null) {
      return [];
    }

    const date = parse(value, FORMAT, now);

    // An unparsable date is not an old date - the field shows its own error.
    return isValid(date) ? [date] : [];
  });

  return <Warning date={parsed.length === 0 ? undefined : min(parsed)} threshhold={subDays(now, 360)} />;
};
