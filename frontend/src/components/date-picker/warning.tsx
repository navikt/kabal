import { isAfter, isValid } from 'date-fns';
import { Alert } from '@/components/alert/alert';

interface Props {
  date: Date | undefined;
  threshhold: Date | undefined;
  className?: string;
}

export const Warning = ({ date, threshhold, className }: Props) => {
  if (date === undefined || threshhold === undefined) {
    return null;
  }

  // An unparsable date is not an old date - the field shows its own error.
  if (!isValid(date)) {
    return null;
  }

  if (isAfter(date, threshhold)) {
    return null;
  }

  return (
    <Alert className={className} variant="warning">
      Du har satt en dato som ligger langt tilbake i tid. Er du sikker på at du har fylt ut riktig dato?
    </Alert>
  );
};
