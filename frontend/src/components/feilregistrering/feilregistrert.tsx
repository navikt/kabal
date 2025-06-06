import { isoDateTimeToPretty } from '@app/domain/date';

interface Props {
  feilregistrert: string | null;
}

export const Feilregistrert = ({ feilregistrert }: Props) => {
  if (feilregistrert === null) {
    return null;
  }

  return <time dateTime={feilregistrert}>{isoDateTimeToPretty(feilregistrert)}</time>;
};
