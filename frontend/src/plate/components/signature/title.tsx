import { InlineMessage } from '@navikt/ds-react';
import { ptToEm } from '@/plate/components/get-scaled-em';

export const MISSING_TITLE = 'TITTEL MANGLER';

interface Props {
  title: string;
}

export const Title = ({ title }: Props): React.JSX.Element => {
  if (title === MISSING_TITLE) {
    return (
      <InlineMessage status="warning" style={{ marginTop: MARGIN_TOP }}>
        Tittel mangler
      </InlineMessage>
    );
  }

  return <div>{title}</div>;
};

const MARGIN_TOP = ptToEm(5);
