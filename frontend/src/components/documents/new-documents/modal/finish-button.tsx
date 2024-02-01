import { Alert } from '@navikt/ds-react';
import React from 'react';
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
  IFileDocument,
  IJournalfoertDokumentReference,
  IMainDocument,
  ISmartDocument,
} from '@app/types/documents/documents';
import { SaksTypeEnum } from '@app/types/kodeverk';
import { FlowState } from '@app/types/oppgave-common';
import { IOppgavebehandling } from '@app/types/oppgavebehandling/oppgavebehandling';

interface Props {
  document: IMainDocument;
  pdfOrSmartDocuments: (IFileDocument | ISmartDocument)[];
  journalfoertDocumentReferences: IJournalfoertDokumentReference[];
}

export const FinishButton = ({ document, pdfOrSmartDocuments, journalfoertDocumentReferences }: Props) => {
  const { data: oppgave } = useOppgave();
  const hasArchiveAccess = useHasArchiveAccess(document);
  const containsRolPDFOrSmartAttachments = useContainsRolAttachments(document, pdfOrSmartDocuments);
  const containsRolJournalfoerteAttachments = useContainsRolAttachments(document, journalfoertDocumentReferences);
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
  const isOppgaveTypeRelevantToRol = oppgave.typeId === SaksTypeEnum.KLAGE || oppgave.typeId === SaksTypeEnum.ANKE;

  if (!isOppgaveTypeRelevantToRol) {
    return false;
  }

  if (getIsRolQuestions(document)) {
    return !(containsRolAttachments && oppgave.rol.flowState === FlowState.RETURNED);
  }

  return false;
};
