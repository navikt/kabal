import { ptToEm } from '@app/plate/components/get-scaled-em';
import { Alert } from '@navikt/ds-react';

export const MISSING_TITLE = 'TITTEL MANGLER';

interface Props {
  title: string;
}

export const Title = ({ title }: Props): React.JSX.Element => {
  if (title === MISSING_TITLE) {
    return (
      <Alert variant="warning" style={{ marginTop: MARGIN_TOP }}>
        Tittel mangler
      </Alert>
    );
  }

  return <div>{title}</div>;
};

const MARGIN_TOP = ptToEm(5);
