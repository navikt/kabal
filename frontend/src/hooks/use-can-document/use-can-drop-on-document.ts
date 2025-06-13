import { DragAndDropContext } from '@app/components/documents/drag-context';
import { canDistributeAny } from '@app/components/documents/filetype';
import { getIsRolQuestions } from '@app/components/documents/new-documents/helpers';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { useIsFeilregistrert } from '@app/hooks/use-is-feilregistrert';
import { useIsAssignedRolAndSent } from '@app/hooks/use-is-rol';
import { useIsTildeltSaksbehandler } from '@app/hooks/use-is-saksbehandler';
import { DistribusjonsType, DocumentTypeEnum, type IMainDocument } from '@app/types/documents/documents';
import { FlowState } from '@app/types/oppgave-common';
import type { IOppgavebehandling } from '@app/types/oppgavebehandling/oppgavebehandling';
import { useContext } from 'react';

export const useCanDropOnDocument = (targetDocument: IMainDocument) => {
  const { draggedDocument, draggedJournalfoertDocuments } = useContext(DragAndDropContext);
  const isRol = useIsAssignedRolAndSent();
  const isTildeltSaksbehandler = useIsTildeltSaksbehandler();
  const isFeilregistrert = useIsFeilregistrert();
  const { data: oppgave, isSuccess } = useOppgave();

  if (
    targetDocument.isMarkertAvsluttet ||
    isFeilregistrert ||
    !isSuccess ||
    oppgave.medunderskriver.flowState === FlowState.SENT
  ) {
    return false;
  }

  // Journalførte dokumenter.
  if (draggedJournalfoertDocuments.length > 0) {
    if (!targetDocument.isSmartDokument) {
      // Journalførte dokumenter kan kun legges som vedlegg til smartdokumenter.
      return false;
    }

    if (isRol) {
      // ROL kan legge journalførte dokumenter som vedlegg til ROL-spørsmål. Kun når saken er sendt til ROL.
      return canRolActOnDocument(targetDocument, oppgave);
    }

    if (!isTildeltSaksbehandler) {
      // Kun tildelt saksbehandler kan legge journalførte dokumenter som vedlegg til smartdokumenter.
      return false;
    }

    if (
      draggedJournalfoertDocuments.some((d) => !canDistributeAny(d.varianter)) &&
      targetDocument.dokumentTypeId !== DistribusjonsType.NOTAT
    ) {
      // Journalførte dokumenter med varianter som ikke kan distribueres, kan kun legges som vedlegg til dokumenter av typen NOTAT.
      return false;
    }

    return true;
  }

  if (draggedDocument === null) {
    return false;
  }

  if (draggedDocument.parentId === null) {
    // Hoveddokumenter kan ikke gjøres om til vedlegg.
    return false;
  }

  if (targetDocument.id === draggedDocument.parentId) {
    // Vedlegg kan ikke flyttes til samme hoveddokument. Ingen endring.
    return false;
  }

  // Smartdokument
  if (draggedDocument.isSmartDokument) {
    // Smartdokumenter som allerede er vedlegg kan kun flyttes mellom andre ROL-spørsmål.
    return getIsRolQuestions(targetDocument);
  }

  // Opplastet dokument.
  if (draggedDocument.type === DocumentTypeEnum.UPLOADED) {
    // Opplastede dokumenter kan kun være vedlegg til andre opplastede dokumenter.
    return targetDocument.type === DocumentTypeEnum.UPLOADED;
  }

  // Journalført dokumentreferanse.
  if (draggedDocument.type === DocumentTypeEnum.JOURNALFOERT) {
    if (isRol) {
      // ROL kan flytte journalførte dokumentreferanser mellom ROL-spørsmål. Kun når saken er sendt til ROL.
      return canRolActOnDocument(targetDocument, oppgave);
    }

    // Journalførte dokumentreferanser kan kun være vedlegg til smartdokumenter.
    // Kun tildelt saksbehandler kan legge journalførte dokumentreferanser som vedlegg til smartdokumenter.
    return targetDocument.isSmartDokument && isTildeltSaksbehandler;
  }

  return false;
};

const canRolActOnDocument = (document: IMainDocument, oppgave: IOppgavebehandling) =>
  getIsRolQuestions(document) && oppgave.rol.flowState === FlowState.SENT;
