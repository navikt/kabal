import { AccessErrorsSummary } from '@app/components/documents/new-documents/modal/access-errors-summary';
import { AnnenInngaaende } from '@app/components/documents/new-documents/modal/annen-inngaaende';
import { FinishButton } from '@app/components/documents/new-documents/modal/finish-button';
import { Errors } from '@app/components/documents/new-documents/modal/finish-document/errors';
import { ConfirmInnsendingshjemler } from '@app/components/documents/new-documents/modal/innsendingshjemler';
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
import {
  useFinishDocumentMutation,
  useSetMottakerListMutation,
  useSetTitleMutation,
} from '@app/redux-api/oppgaver/mutations/documents';
import {
  DISTRIBUTION_TYPE_NAMES,
  DistribusjonsType,
  DOCUMENT_TYPE_NAMES,
  DocumentTypeEnum,
  type IDocument,
  type IParentDocument,
} from '@app/types/documents/documents';
import { TemplateIdEnum } from '@app/types/smart-editor/template-enums';
import { CalendarIcon, CheckmarkIcon } from '@navikt/aksel-icons';
import { Button, HStack, Modal, Tag, VStack } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/query';
import { useMemo } from 'react';
import { DeleteDocumentButton } from './delete-button';

interface Props {
  document: IParentDocument;
  renameAccess: string | null;
  changeTypeAccess: string | null;
  finishAccess: string | null;
  removeAccess: string | null;
  removeAttachmentsAccess: string[];
  finishValidationErrors: string[];
  innsendingshjemlerConfirmed: boolean;
  setInnsendingshjemlerConfirmed: (confirmed: boolean) => void;
  isArchiveOnly: boolean;
}

export const DocumentModalContent = ({
  document,
  renameAccess,
  changeTypeAccess,
  finishAccess,
  removeAccess,
  removeAttachmentsAccess,
  finishValidationErrors,
  innsendingshjemlerConfirmed,
  setInnsendingshjemlerConfirmed,
  isArchiveOnly,
}: Props) => {
  const [setMottakerList, { isLoading }] = useSetMottakerListMutation();
  const [, { error: finishError }] = useFinishDocumentMutation({ fixedCacheKey: document.id });
  const sendErrors = useMemo(
    () =>
      isSendError(finishError)
        ? (finishError.data.sections.find((s) => s.section === 'mottakere')?.properties ?? [])
        : [],
    [finishError],
  );
  const { value: pdfWidth, setValue: setPdfWidth } = useDocumentsArchivePdfWidth();
  const [setTitle] = useSetTitleMutation();
  const oppgaveId = useOppgaveId();
  const pdfUrl =
    oppgaveId === skipToken
      ? undefined
      : `/api/kabal-api/behandlinger/${oppgaveId}/dokumenter/mergedocuments/${document.id}/pdf`;
  const { refresh, ...pdfData } = usePdfData(pdfUrl);

  if (oppgaveId === skipToken) {
    return null;
  }

  const icon = <DocumentIcon type={document.type} />;

  const isNotat = document.dokumentTypeId === DistribusjonsType.NOTAT;

  const isInngående = document.type === DocumentTypeEnum.UPLOADED && getIsIncomingDocument(document.dokumentTypeId);

  return (
    <>
      <Modal.Body className="flex h-[80vh] w-full gap-4 overflow-hidden">
        <VStack gap="4" width="400px" height="100%" flexShrink="0" overflow="visible">
          <HStack align="center" gap="2">
            <Tag variant="info" size="small">
              {DISTRIBUTION_TYPE_NAMES[document.dokumentTypeId]}
            </Tag>
            <Tag variant="info" size="small" title="Dokumenttype">
              {icon}&nbsp;{DOCUMENT_TYPE_NAMES[document.type]}
            </Tag>
            <OpprettetTag document={document} />
          </HStack>

          {renameAccess === null ? (
            <HStack align="end" gap="2" wrap={false}>
              <SetFilename
                className="max-w-lg flex-grow"
                tittel={document.tittel}
                setFilename={(title) => setTitle({ oppgaveId, dokumentId: document.id, title })}
              />
              <Button
                size="small"
                variant="secondary-neutral"
                icon={<CheckmarkIcon aria-hidden />}
                title="Endre dokumentnavn"
                data-testid="document-title-edit-save-button"
              />
            </HStack>
          ) : null}

          <AccessErrorsSummary documentErrors={changeTypeAccess === null ? [] : [changeTypeAccess]}>
            <SetDocumentType document={document} showLabel disabled={changeTypeAccess !== null} />
          </AccessErrorsSummary>

          {finishAccess === null && isInngående ? <MottattDato document={document} oppgaveId={oppgaveId} /> : null}

          {document.dokumentTypeId === DistribusjonsType.ANNEN_INNGAAENDE_POST ? (
            <AnnenInngaaende document={document} hasAccess={finishAccess === null} />
          ) : null}

          {finishAccess === null && !isNotat && !isInngående ? (
            <Receivers
              setMottakerList={(mottakerList) => setMottakerList({ oppgaveId, dokumentId: document.id, mottakerList })}
              mottakerList={document.mottakerList}
              templateId={document.templateId}
              dokumentTypeId={document.dokumentTypeId}
              sendErrors={sendErrors}
              isLoading={isLoading}
            />
          ) : null}

          {document.templateId === TemplateIdEnum.EKSPEDISJONSBREV_TIL_TRYGDERETTEN ? (
            <ConfirmInnsendingshjemler
              innsendingshjemlerConfirmed={innsendingshjemlerConfirmed}
              setInnsendingshjemlerConfirmed={setInnsendingshjemlerConfirmed}
            />
          ) : null}

          <Errors updatePdf={refresh} />
        </VStack>

        <SimplePdfPreview width={pdfWidth} setWidth={setPdfWidth} {...pdfData} refresh={refresh} />
      </Modal.Body>

      <Modal.Footer className="items-center">
        <AccessErrorsSummary
          documentErrors={removeAccess === null ? [] : [removeAccess]}
          attachmentErrors={removeAttachmentsAccess}
        >
          <DeleteDocumentButton
            document={document}
            disabled={removeAccess !== null || removeAttachmentsAccess.length !== 0}
          />
        </AccessErrorsSummary>

        <FinishButton
          document={document}
          innsendingshjemlerConfirmed={innsendingshjemlerConfirmed}
          finishAccessError={finishAccess}
          finishValidationErrors={finishValidationErrors}
          isArchiveOnly={isArchiveOnly}
        />
      </Modal.Footer>
    </>
  );
};

const OpprettetTag = ({ document }: { document: IDocument }) => {
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
