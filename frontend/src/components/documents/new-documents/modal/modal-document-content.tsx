import { CalendarIcon, CheckmarkIcon } from '@navikt/aksel-icons';
import { Button, HStack, Modal, Tag, VStack } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/query';
import { useMemo } from 'react';
import { AccessErrorsSummary } from '@/components/documents/new-documents/modal/access-errors-summary';
import { AnnenInngaaende } from '@/components/documents/new-documents/modal/annen-inngaaende';
import { DeleteDocumentButton } from '@/components/documents/new-documents/modal/delete-button';
import { FinishButton } from '@/components/documents/new-documents/modal/finish-button';
import { Errors } from '@/components/documents/new-documents/modal/finish-document/errors';
import { ConfirmInnsendingshjemler } from '@/components/documents/new-documents/modal/innsendingshjemler';
import { MottattDato } from '@/components/documents/new-documents/modal/mottatt-dato';
import { SetDocumentType } from '@/components/documents/new-documents/new-document/set-type';
import { DocumentDate } from '@/components/documents/new-documents/shared/document-date';
import { DocumentIcon } from '@/components/documents/new-documents/shared/document-icon';
import { SetFilename } from '@/components/documents/set-filename';
import { KabalFileViewer } from '@/components/kabal-file-viewer';
import { usePdfData } from '@/components/pdf/pdf';
import { isSendError } from '@/components/receivers/is-send-error';
import { Receivers } from '@/components/receivers/receivers';
import { SimplePdfPreview } from '@/components/simple-pdf-preview/simple-pdf-preview';
import { getIsIncomingDocument } from '@/functions/is-incoming-document';
import { useOppgaveId } from '@/hooks/oppgavebehandling/use-oppgave-id';
import { useDocumentsPdfWidth } from '@/hooks/settings/use-setting';
import {
  useFinishDocumentMutation,
  useSetMottakerListMutation,
  useSetTitleMutation,
} from '@/redux-api/oppgaver/mutations/documents';
import { useNewFileViewerFeatureToggle } from '@/simple-api-state/feature-toggles';
import {
  DISTRIBUTION_TYPE_NAMES,
  DistribusjonsType,
  DOCUMENT_TYPE_NAMES,
  DocumentTypeEnum,
  type IDocument,
  type IParentDocument,
} from '@/types/documents/documents';
import { TemplateIdEnum } from '@/types/smart-editor/template-enums';

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
  const useNewFileViewer = useNewFileViewerFeatureToggle();
  const sendErrors = useMemo(
    () =>
      isSendError(finishError)
        ? (finishError.data.sections.find((s) => s.section === 'mottakere')?.properties ?? [])
        : [],
    [finishError],
  );
  const [setTitle] = useSetTitleMutation();
  const oppgaveId = useOppgaveId();
  const pdfUrl =
    oppgaveId === skipToken
      ? undefined
      : `/api/kabal-api/behandlinger/${oppgaveId}/dokumenter/mergedocuments/${document.id}/pdf`;
  const { refresh, ...pdfData } = usePdfData(pdfUrl);
  const { value: pdfWidth, setValue: setPdfWidth } = useDocumentsPdfWidth();

  if (oppgaveId === skipToken) {
    return null;
  }

  const icon = <DocumentIcon type={document.type} />;

  const isNotat = document.dokumentTypeId === DistribusjonsType.NOTAT;

  const isInngående = document.type === DocumentTypeEnum.UPLOADED && getIsIncomingDocument(document.dokumentTypeId);

  return (
    <>
      <Modal.Body className="flex h-[80vh] w-full gap-4 overflow-hidden">
        <VStack gap="space-16" width="400px" height="100%" flexShrink="0" overflow="visible">
          <HStack align="center" gap="space-8">
            <Tag data-color="info" variant="outline" size="small">
              {DISTRIBUTION_TYPE_NAMES[document.dokumentTypeId]}
            </Tag>
            <Tag data-color="info" variant="outline" size="small" title="Dokumenttype">
              {icon}&nbsp;{DOCUMENT_TYPE_NAMES[document.type]}
            </Tag>
            <OpprettetTag document={document} />
          </HStack>

          {renameAccess === null ? (
            <HStack align="end" gap="space-8" wrap={false}>
              <SetFilename
                className="max-w-lg grow"
                tittel={document.tittel}
                setFilename={async (title) => {
                  await setTitle({ oppgaveId, dokumentId: document.id, title });
                }}
              />
              <Button
                data-color="neutral"
                size="small"
                variant="secondary"
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

          <Errors />
        </VStack>

        {pdfUrl === undefined ? null : (
          <>
            <SimplePdfPreview width={pdfWidth} setWidth={setPdfWidth} {...pdfData} refresh={refresh} />
            {useNewFileViewer.data?.enabled === true ? (
              <KabalFileViewer files={[{ variants: 'PDF', title: document.tittel, url: pdfUrl }]} />
            ) : null}
          </>
        )}
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
    <Tag data-color="info" variant="outline" size="small" title="Opprettet">
      <CalendarIcon aria-hidden />
      <DocumentDate document={document} />
    </Tag>
  );
};
