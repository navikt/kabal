import { StaticDataContext } from '@app/components/app/static-data-context';
import { canDistributeAny } from '@app/components/documents/filetype';
import { SelectContext } from '@app/components/documents/journalfoerte-documents/select-context/select-context';
import { useCanEditDocument } from '@app/components/documents/journalfoerte-documents/use-can-edit';
import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { useIsFullfoert } from '@app/hooks/use-is-fullfoert';
import { useIsRol } from '@app/hooks/use-is-rol';
import {
  useCreateVedleggFromJournalfoertDocumentMutation,
  useDeleteDocumentMutation,
} from '@app/redux-api/oppgaver/mutations/documents';
import { useGetDocumentsQuery } from '@app/redux-api/oppgaver/queries/documents';
import type { IArkivertDocument } from '@app/types/arkiverte-documents';
import { CreatorRole, DistribusjonsType, type IMainDocument } from '@app/types/documents/documents';
import { TemplateIdEnum } from '@app/types/smart-editor/template-enums';
import { Select } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/query';
import { useContext } from 'react';

const NONE_SELECTED = 'NONE_SELECTED';

export const UseAsAttachments = () => {
  const canEdit = useCanEditDocument();
  const { getSelectedDocuments } = useContext(SelectContext);
  const selectedDocuments = getSelectedDocuments();
  const options = useOptions(selectedDocuments);
  const attachFn = useAttachVedleggFn();

  if (!canEdit || attachFn === null) {
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

export const useOptions = (selectedDocuments: IArkivertDocument[]): IMainDocument[] => {
  const oppgaveId = useOppgaveId();
  const { data = [] } = useGetDocumentsQuery(oppgaveId);
  const isRol = useIsRol();

  return data.filter((d) => {
    if (selectedDocuments.some((s) => !canDistributeAny(s.varianter) && d.dokumentTypeId !== DistribusjonsType.NOTAT)) {
      // File types that cannot be distributed, can only be dropped on documents of type NOTAT.
      return false;
    }

    if (isRol) {
      return d.parentId === null && d.isSmartDokument && d.templateId === TemplateIdEnum.ROL_QUESTIONS;
    }

    return d.parentId === null;
  });
};

export const useAttachVedleggFn = () => {
  const oppgaveId = useOppgaveId();
  const [createVedlegg] = useCreateVedleggFromJournalfoertDocumentMutation();
  const { user } = useContext(StaticDataContext);
  const { navIdent, navn } = user;
  const isFinished = useIsFullfoert();
  const isRol = useIsRol();

  if (oppgaveId === skipToken) {
    return null;
  }

  return (parentId: string, ...vedlegg: IArkivertDocument[]) =>
    createVedlegg({
      oppgaveId,
      parentId,
      journalfoerteDokumenter: vedlegg,
      creator: {
        employee: { navIdent, navn },
        creatorRole: isRol ? CreatorRole.KABAL_ROL : CreatorRole.KABAL_SAKSBEHANDLING,
      },
      isFinished,
    });
};

export const useRemoveVedleggFn = () => {
  const oppgaveId = useOppgaveId();
  const [deleteDocument] = useDeleteDocumentMutation();

  if (oppgaveId === skipToken) {
    return null;
  }

  return (...ids: string[]) =>
    Promise.all(
      ids.map((dokumentId) =>
        deleteDocument({
          oppgaveId,
          dokumentId,
        }),
      ),
    );
};
