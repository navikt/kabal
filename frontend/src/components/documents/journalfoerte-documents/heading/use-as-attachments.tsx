import { canDistributeAny } from '@app/components/documents/filetype';
import { SelectContext } from '@app/components/documents/journalfoerte-documents/select-context/select-context';
import { DuaActionEnum } from '@app/hooks/dua-access/access';
import { useCreatorRole } from '@app/hooks/dua-access/use-creator-role';
import { useLazyDuaAccess } from '@app/hooks/dua-access/use-dua-access';
import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { useIsFullfoert } from '@app/hooks/use-is-fullfoert';
import { useCreateVedleggFromJournalfoertDocumentMutation } from '@app/redux-api/oppgaver/mutations/documents';
import { useGetDocumentsQuery } from '@app/redux-api/oppgaver/queries/documents';
import type { IArkivertDocument } from '@app/types/arkiverte-documents';
import { DistribusjonsType, DocumentTypeEnum, type IDocument } from '@app/types/documents/documents';
import { Select } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/query';
import { useContext } from 'react';

const NONE_SELECTED = 'NONE_SELECTED';

export const UseAsAttachments = () => {
  const { getSelectedDocuments } = useContext(SelectContext);
  const selectedDocuments = getSelectedDocuments();
  const options = useOptions(selectedDocuments);
  const attachFn = useAttachVedleggFn();

  if (attachFn === null) {
    return null;
  }

  return (
    <div className="mx-4 mt-1 mb-3">
      <Select
        size="small"
        label="Bruk som vedlegg for"
        onChange={({ target }) => attachFn(target.value, ...selectedDocuments)}
        value={NONE_SELECTED}
      >
        <option key={NONE_SELECTED} value={NONE_SELECTED} label="Velg dokument" />

        {options.map(({ id, tittel }) => (
          <option value={id} key={id}>
            {tittel}
          </option>
        ))}
      </Select>
    </div>
  );
};

export const useOptions = (selectedDocuments: IArkivertDocument[]): IDocument[] => {
  const oppgaveId = useOppgaveId();
  const { data = [] } = useGetDocumentsQuery(oppgaveId);
  const getAccess = useLazyDuaAccess();
  const creatorRole = useCreatorRole();

  return data.filter((d) => {
    if (d.parentId !== null) {
      return false; // Cannot attach to attachments.
    }

    if (d.dokumentTypeId !== DistribusjonsType.NOTAT && selectedDocuments.some((s) => !canDistributeAny(s.varianter))) {
      // File types that cannot be distributed, can only be dropped on documents of type NOTAT.
      return false;
    }

    const accessError = getAccess(
      { creator: { creatorRole }, type: DocumentTypeEnum.JOURNALFOERT },
      DuaActionEnum.CREATE,
      d,
    );

    return accessError === null;
  });
};

export const useAttachVedleggFn = () => {
  const oppgaveId = useOppgaveId();
  const [createVedlegg] = useCreateVedleggFromJournalfoertDocumentMutation();
  const isFinished = useIsFullfoert();

  if (oppgaveId === skipToken) {
    return null;
  }

  return (parentId: string, ...vedlegg: IArkivertDocument[]) =>
    createVedlegg({
      oppgaveId,
      parentId,
      journalfoerteDokumenter: vedlegg,
      isFinished,
    });
};
