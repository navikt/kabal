import { Fields } from '@app/components/documents/journalfoerte-documents/grid';
import { useDocumentsAvsenderMottaker } from '@app/hooks/settings/use-setting';
import { type IArkivertDocument, Journalposttype } from '@app/types/arkiverte-documents';
import { Button } from '@navikt/ds-react';
import { memo } from 'react';
import { styled } from 'styled-components';
import { formatAvsenderMottaker } from './format-avsender-mottaker';

type AvsenderMottakerProps = Pick<IArkivertDocument, 'journalposttype' | 'avsenderMottaker'>;

export const AvsenderMottaker = memo(
  ({ journalposttype, avsenderMottaker }: AvsenderMottakerProps) => {
    const { setValue } = useDocumentsAvsenderMottaker();

    if (journalposttype === Journalposttype.NOTAT) {
      return null;
    }

    return (
      <AvsenderMottakerButton
        onClick={() => setValue([avsenderMottaker === null ? 'NONE' : (avsenderMottaker.id ?? 'UNKNOWN')])}
        size="small"
        variant="tertiary"
      >
        {formatAvsenderMottaker(avsenderMottaker)}
      </AvsenderMottakerButton>
    );
  },
  (prevProps, nextProps) => {
    const propsAreEqual =
      prevProps.journalposttype === nextProps.journalposttype &&
      ((prevProps.avsenderMottaker === null && nextProps.avsenderMottaker === null) ||
        prevProps.avsenderMottaker?.id === nextProps.avsenderMottaker?.id);

    return propsAreEqual;
  },
);

AvsenderMottaker.displayName = 'AvsenderMottaker';

const AvsenderMottakerButton = styled(Button)`
  grid-area: ${Fields.AvsenderMottaker};
  white-space: nowrap;
  text-align: left;

  > .navds-label {
    width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;
