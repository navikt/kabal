import { isAfter } from 'date-fns';
import { Alert } from '@/components/alert/alert';

interface Props {
  date: Date | undefined;
  threshhold: Date | undefined;
}

export const Warning = ({ date, threshhold }: Props) => {
  if (date === undefined || threshhold === undefined) {
    return null;
  }

  if (isAfter(date, threshhold)) {
    return null;
  }

  return (
    <Alert className="mt-2" variant="warning">
      Du har satt en dato som ligger langt tilbake i tid. Er du sikker på at du har fylt ut riktig dato?
    </Alert>
  );
};
