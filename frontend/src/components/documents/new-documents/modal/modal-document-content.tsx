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
import type { DuaAccessMap } from '@app/hooks/dua-access/access-map';
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
} from '@app/types/documents/documents';
import { TemplateIdEnum } from '@app/types/smart-editor/template-enums';
import { CalendarIcon, CheckmarkIcon } from '@navikt/aksel-icons';
import { Alert, Button, HStack, Modal, Tag, VStack } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/query';
import { useMemo, useState } from 'react';
import { DeleteDocumentButton } from './delete-button';

interface Props {
  document: IDocument;
  access: DuaAccessMap;
}

export const DocumentModalContent = ({ document, access }: Props) => {
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
  const [innsendingshjemlerConfirmed, setInnsendingshjemlerConfirmed] = useState(false);

  if (oppgaveId === skipToken) {
    return null;
  }

  const icon = <DocumentIcon type={document.type} />;

  const isNotat = document.dokumentTypeId === DistribusjonsType.NOTAT;

  const isInngående = document.type === DocumentTypeEnum.UPLOADED && getIsIncomingDocument(document.dokumentTypeId);

  return (
    <>
      <Modal.Body className="flex h-[80vh] w-full gap-4 overflow-hidden">
        <VStack gap="4" minWidth="400px" flexShrink="0" overflowY="auto">
          <HStack align="center" gap="2">
            <Tag variant="info" size="small">
              {DISTRIBUTION_TYPE_NAMES[document.dokumentTypeId]}
            </Tag>
            <Tag variant="info" size="small" title="Dokumenttype">
              {icon}&nbsp;{DOCUMENT_TYPE_NAMES[document.type]}
            </Tag>
            <OpprettetTag document={document} />
          </HStack>

          {access.RENAME === null ? (
            <HStack align="end" gap="2" wrap={false}>
              <SetFilename
                className="max-w-lg flex-grow"
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

          {access.CHANGE_TYPE === null ? (
            <SetDocumentType document={document} showLabel />
          ) : (
            <AccessAlert access={access.CHANGE_TYPE} />
          )}

          {access.FINISH === null && isInngående ? <MottattDato document={document} oppgaveId={oppgaveId} /> : null}

          {document.dokumentTypeId === DistribusjonsType.ANNEN_INNGAAENDE_POST ? (
            <AnnenInngaaende document={document} hasAccess={access.FINISH === null} />
          ) : null}

          {access.FINISH === null && !isNotat && !isInngående ? (
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
        {access.REMOVE === null ? <DeleteDocumentButton document={document} /> : <AccessAlert access={access.REMOVE} />}

        {access.FINISH === null ? (
          <FinishButton document={document} innsendingshjemlerConfirmed={innsendingshjemlerConfirmed} />
        ) : (
          <AccessAlert access={access.FINISH} />
        )}
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

interface AccessAlertProps {
  access: string | null;
}

const AccessAlert = ({ access }: AccessAlertProps) => {
  if (access === null) {
    return null;
  }

  return (
    <Alert variant="info" size="small" inline>
      {access}
    </Alert>
  );
};
