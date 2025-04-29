import { getIsRolQuestions } from '@app/components/documents/new-documents/helpers';
import { AnnenInngaaende } from '@app/components/documents/new-documents/modal/annen-inngaaende';
import { FinishButton } from '@app/components/documents/new-documents/modal/finish-button';
import { Errors } from '@app/components/documents/new-documents/modal/finish-document/errors';
import { MottattDato } from '@app/components/documents/new-documents/modal/mottatt-dato';
import { SetDocumentType } from '@app/components/documents/new-documents/new-document/set-type';
import { DocumentDate } from '@app/components/documents/new-documents/shared/document-date';
import { DocumentIcon } from '@app/components/documents/new-documents/shared/document-icon';
import { SetFilename } from '@app/components/documents/set-filename';
import { usePdfData } from '@app/components/pdf/pdf';
import { isSendError } from '@app/components/receivers/is-send-error';
import { Receivers } from '@app/components/receivers/receivers';
import { SimplePdfPreview } from '@app/components/simple-pdf-preview/simple-pdf-preview';
import { getIsIncomingDocument } from '@app/functions/is-incoming-document';
import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { useDocumentsArchivePdfWidth } from '@app/hooks/settings/use-setting';
import { useCanEditDocument } from '@app/hooks/use-can-document/use-can-edit-document';
import { useAttachments } from '@app/hooks/use-parent-document';
import {
  useFinishDocumentMutation,
  useSetMottakerListMutation,
  useSetTitleMutation,
} from '@app/redux-api/oppgaver/mutations/documents';
import {
  DISTRIBUTION_TYPE_NAMES,
  DOCUMENT_TYPE_NAMES,
  DistribusjonsType,
  DocumentTypeEnum,
  type IMainDocument,
} from '@app/types/documents/documents';
import { CalendarIcon, CheckmarkIcon } from '@navikt/aksel-icons';
import { Button, HStack, Modal, Tag, VStack } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/query';
import { useMemo } from 'react';
import { styled } from 'styled-components';
import { DeleteDocumentButton } from './delete-button';
import { SetParentDocument } from './set-parent';

interface Props {
  document: IMainDocument;
  parentDocument?: IMainDocument;
  containsRolAttachments: boolean;
}

// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: ¯\_(ツ)_/¯
export const DocumentModalContent = ({ document, parentDocument, containsRolAttachments }: Props) => {
  const [setMottakerList] = useSetMottakerListMutation();
  const [, { error: finishError }] = useFinishDocumentMutation({ fixedCacheKey: document.id });
  const sendErrors = useMemo(
    () =>
      isSendError(finishError)
        ? (finishError.data.sections.find((s) => s.section === 'mottakere')?.properties ?? [])
        : [],
    [finishError],
  );
  const { value: pdfWidth, setValue: setPdfWidth } = useDocumentsArchivePdfWidth();
  const canEditDocument = useCanEditDocument(document, parentDocument);
  const { pdfOrSmartDocuments, journalfoerteDocuments } = useAttachments(document.id);
  const [setTitle] = useSetTitleMutation();
  const oppgaveId = useOppgaveId();
  const pdfUrl =
    oppgaveId === skipToken
      ? undefined
      : `/api/kabal-api/behandlinger/${oppgaveId}/dokumenter/mergedocuments/${document.id}/pdf`;
  const isMainDocument = document.parentId === null;
  const { refresh, ...pdfData } = usePdfData(pdfUrl, !isMainDocument);

  if (oppgaveId === skipToken) {
    return null;
  }

  const icon = <DocumentIcon type={document.type} />;

  const isNotat = document.dokumentTypeId === DistribusjonsType.NOTAT;
  const isRolQuestions = getIsRolQuestions(document);

  const hasAttachments = pdfOrSmartDocuments.length > 0 || journalfoerteDocuments.length > 0;

  const canDelete = isMainDocument && containsRolAttachments ? false : canEditDocument;

  const isInngående =
    isMainDocument && document.type === DocumentTypeEnum.UPLOADED && getIsIncomingDocument(document.dokumentTypeId);

  return (
    <>
      <ModalBody $isMainDocument={isMainDocument}>
        <VStack gap="4" width="400px" flexShrink="0" overflowY="auto">
          <HStack align="center" gap="2">
            <Tag variant="info" size="small">
              {isMainDocument ? DISTRIBUTION_TYPE_NAMES[document.dokumentTypeId] : 'Vedlegg'}
            </Tag>
            <Tag variant="info" size="small" title="Dokumenttype">
              {icon}&nbsp;{DOCUMENT_TYPE_NAMES[document.type]}
            </Tag>
            <OpprettetTag document={document} />
          </HStack>

          {canEditDocument && document.type !== DocumentTypeEnum.JOURNALFOERT ? (
            <HStack align="end" gap="2" wrap={false}>
              <StyledSetFilename
                tittel={document.tittel}
                setFilename={(title) => setTitle({ oppgaveId, dokumentId: document.id, title })}
              />
              <Button
                size="small"
                variant="secondary"
                icon={<CheckmarkIcon aria-hidden />}
                title="Endre dokumentnavn"
                data-testid="document-title-edit-save-button"
              />
            </HStack>
          ) : null}

          {canEditDocument && isMainDocument && !isRolQuestions ? (
            <SetDocumentType document={document} hasAttachments={hasAttachments} showLabel />
          ) : null}

          {canEditDocument && !isRolQuestions ? (
            <SetParentDocument document={document} parentDocument={parentDocument} hasAttachments={hasAttachments} />
          ) : null}

          {canEditDocument && isInngående ? <MottattDato document={document} oppgaveId={oppgaveId} /> : null}

          {isMainDocument && document.dokumentTypeId === DistribusjonsType.ANNEN_INNGAAENDE_POST ? (
            <AnnenInngaaende document={document} canEditDocument={canEditDocument} />
          ) : null}

          {canEditDocument && !isNotat && !isInngående && isMainDocument ? (
            <Receivers
              setMottakerList={(mottakerList) => setMottakerList({ oppgaveId, dokumentId: document.id, mottakerList })}
              mottakerList={document.mottakerList}
              templateId={document.templateId}
              sendErrors={sendErrors}
            />
          ) : null}

          <Errors updatePdf={refresh} />
        </VStack>

        {isMainDocument ? (
          <SimplePdfPreview width={pdfWidth} setWidth={setPdfWidth} {...pdfData} refresh={refresh} />
        ) : null}
      </ModalBody>

      <Modal.Footer>
        {canDelete ? <DeleteDocumentButton document={document} /> : null}
        <FinishButton
          document={document}
          journalfoerteDocuments={journalfoerteDocuments}
          pdfOrSmartDocuments={pdfOrSmartDocuments}
        />
      </Modal.Footer>
    </>
  );
};

const OpprettetTag = ({ document }: { document: IMainDocument }) => {
  if (document.type !== DocumentTypeEnum.JOURNALFOERT) {
    return null;
  }

  return (
    <Tag variant="alt3" size="small" title="Opprettet">
      <CalendarIcon aria-hidden />
      &nbsp;
      <DocumentDate document={document} />
    </Tag>
  );
};

const ModalBody = styled(Modal.Body)<{ $isMainDocument: boolean }>`
  display: flex;
  width: 100%;
  height: ${({ $isMainDocument }) => ($isMainDocument ? '80vh' : 'auto')};
  gap: var(--a-spacing-4);
  overflow: hidden;
`;

const StyledSetFilename = styled(SetFilename)`
  flex-grow: 1;
  max-width: 512px;
`;
