import { InlineMessage } from '@navikt/ds-react';

export const MISSING_TITLE = 'TITTEL MANGLER';

interface Props {
  title: string;
}

export const Title = ({ title }: Props): React.JSX.Element => {
  if (title === MISSING_TITLE) {
    return (
      <InlineMessage status="warning" size="small">
        Tittel mangler
      </InlineMessage>
    );
  }

  return <div>{title}</div>;
};
