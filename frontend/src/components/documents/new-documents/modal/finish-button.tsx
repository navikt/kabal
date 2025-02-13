import { getIsRolQuestions } from '@app/components/documents/new-documents/helpers';
import { ArchiveButtons } from '@app/components/documents/new-documents/modal/finish-document/archive-buttons';
import { SendButtons } from '@app/components/documents/new-documents/modal/finish-document/send-buttons';
import { getIsIncomingDocument } from '@app/functions/is-incoming-document';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { useContainsRolAttachments } from '@app/hooks/use-contains-rol-attachments';
import { useHasArchiveAccess } from '@app/hooks/use-has-documents-access';
import {
  DistribusjonsType,
  DocumentTypeEnum,
  type IFileDocument,
  type IMainDocument,
  type ISmartDocument,
  type JournalfoertDokument,
} from '@app/types/documents/documents';
import { FlowState } from '@app/types/oppgave-common';
import type { IOppgavebehandling } from '@app/types/oppgavebehandling/oppgavebehandling';
import { Alert } from '@navikt/ds-react';

interface Props {
  document: IMainDocument;
  pdfOrSmartDocuments: (IFileDocument | ISmartDocument)[];
  journalfoerteDocuments: JournalfoertDokument[];
}

export const FinishButton = ({ document, pdfOrSmartDocuments, journalfoerteDocuments }: Props) => {
  const { data: oppgave } = useOppgave();
  const hasArchiveAccess = useHasArchiveAccess(document);
  const containsRolPDFOrSmartAttachments = useContainsRolAttachments(document, pdfOrSmartDocuments);
  const containsRolJournalfoerteAttachments = useContainsRolAttachments(document, journalfoerteDocuments);
  const containsRolAttachments = containsRolPDFOrSmartAttachments || containsRolJournalfoerteAttachments;

  if (!hasArchiveAccess || document.parentId !== null || oppgave === undefined) {
    return null;
  }

  if (getMustWaitForRolToReturn(oppgave, document, containsRolAttachments)) {
    return (
      <Alert variant="info" size="small" inline>
        Kan ikke arkiveres før rådgivende overlege har svart og returnert saken.
      </Alert>
    );
  }

  if (
    document.dokumentTypeId === DistribusjonsType.ANNEN_INNGAAENDE_POST &&
    document.type === DocumentTypeEnum.UPLOADED &&
    (document.avsender === null || document.inngaaendeKanal === null)
  ) {
    return (
      <Alert variant="info" size="small" inline>
        Kan ikke arkiveres før avsender og inngående kanal er satt.
      </Alert>
    );
  }

  return document.dokumentTypeId === DistribusjonsType.NOTAT || getIsIncomingDocument(document) ? (
    <ArchiveButtons document={document} />
  ) : (
    <SendButtons document={document} />
  );
};

const getMustWaitForRolToReturn = (
  oppgave: IOppgavebehandling,
  document: IMainDocument,
  containsRolAttachments: boolean,
) => {
  if (getIsRolQuestions(document)) {
    return !(containsRolAttachments && oppgave.rol.flowState === FlowState.RETURNED);
  }

  return false;
};
