import React, { memo } from 'react';
import { ClickableField } from '@app/components/documents/journalfoerte-documents/document/clickable-field';
import { Fields } from '@app/components/documents/journalfoerte-documents/grid';
import { useDocumentsAvsenderMottaker } from '@app/hooks/settings/use-setting';
import { IArkivertDocument, Journalposttype } from '@app/types/arkiverte-documents';
import { formatAvsenderMottaker } from './format-avsender-mottaker';

type AvsenderMottakerProps = Pick<IArkivertDocument, 'journalposttype' | 'avsenderMottaker'>;

export const AvsenderMottaker = memo(
  ({ journalposttype, avsenderMottaker }: AvsenderMottakerProps) => {
    const { setValue } = useDocumentsAvsenderMottaker();

    if (journalposttype === Journalposttype.NOTAT) {
      return null;
    }

    return (
      <ClickableField
        $area={Fields.AvsenderMottaker}
        onClick={() => setValue([avsenderMottaker === null ? 'NONE' : avsenderMottaker.id ?? 'UNKNOWN'])}
      >
        {formatAvsenderMottaker(avsenderMottaker)}
      </ClickableField>
    );
  },
  (prevProps, nextProps) => {
    const propsAreEqual =
      prevProps.journalposttype === nextProps.journalposttype &&
      ((prevProps.avsenderMottaker === null && nextProps.avsenderMottaker === null) ||
        prevProps.avsenderMottaker?.id === nextProps.avsenderMottaker?.id);

    return propsAreEqual;
  }
);

AvsenderMottaker.displayName = 'AvsenderMottaker';
