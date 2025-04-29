import { DocumentIcon, type ModalDocumentType } from '@app/components/documents/new-documents/shared/document-icon';
import { getIsIncomingDocument } from '@app/functions/is-incoming-document';
import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { useIsRol } from '@app/hooks/use-is-rol';
import { useIsSaksbehandler } from '@app/hooks/use-is-saksbehandler';
import { useSetParentMutation } from '@app/redux-api/oppgaver/mutations/documents';
import { useGetDocumentsQuery } from '@app/redux-api/oppgaver/queries/documents';
import {
  DISTRIBUTION_TYPE_NAMES,
  type DistribusjonsType,
  DocumentTypeEnum,
  type IMainDocument,
} from '@app/types/documents/documents';
import { TemplateIdEnum } from '@app/types/smart-editor/template-enums';
import { Alert, Button, HStack, Heading, Radio, RadioGroup, Tag, VStack } from '@navikt/ds-react';
import { useMemo } from 'react';
import { styled } from 'styled-components';

const IS_PARENT_DOCUMENT = 'PARENT_DOCUMENT_VALUE';

interface Props {
  document: IMainDocument;
  parentDocument: IMainDocument | undefined;
  hasAttachments: boolean;
}

export const SetParentDocument = ({ document, parentDocument, hasAttachments }: Props) => {
  const oppgaveId = useOppgaveId();
  const { data, isLoading: isLoadingDocuments } = useGetDocumentsQuery(oppgaveId);
  const [setParent, { isLoading: isSetting }] = useSetParentMutation();
  const isRol = useIsRol();

  const isIncomingDocument =
    getIsIncomingDocument(document.dokumentTypeId) || getIsIncomingDocument(parentDocument?.dokumentTypeId);

  const potentialParents = useMemo(() => {
    if (data === undefined) {
      return [];
    }

    if (document.type === DocumentTypeEnum.UPLOADED || isIncomingDocument) {
      return data.filter((d) => document.id !== d.id && d.parentId === null && getIsIncomingDocument(d.dokumentTypeId));
    }

    if (hasAttachments) {
      return [];
    }

    if (isRol || document.type !== DocumentTypeEnum.JOURNALFOERT) {
      return data.filter(
        (d) => d.isSmartDokument && document.id !== d.id && d.templateId === TemplateIdEnum.ROL_QUESTIONS,
      );
    }

    return data.filter((d) => document.id !== d.id && d.parentId === null);
  }, [data, document.id, document.type, hasAttachments, isIncomingDocument, isRol]);

  if (
    isLoadingDocuments ||
    typeof data === 'undefined' ||
    potentialParents.length === 0 ||
    typeof oppgaveId !== 'string'
  ) {
    return null;
  }

  const setParentFn = (parentId: string | null = null) => setParent({ dokumentId: document.id, oppgaveId, parentId });

  const onChange = (id: string) => setParentFn(id === IS_PARENT_DOCUMENT ? null : id);

  return (
    <VStack align="start" gap="4 0">
      <Heading level="1" size="xsmall">
        Vedlegg eller hoveddokument
      </Heading>

      <MainDocument
        document={document}
        isIncomingDocument={isIncomingDocument}
        onClick={() => setParentFn(null)}
        isLoading={isSetting}
      />

      <RadioGroup
        size="small"
        value={document.parentId ?? IS_PARENT_DOCUMENT}
        onChange={onChange}
        title="Vedlegg til"
        legend="Vedlegg til"
        data-testid="document-set-parent-document"
        disabled={isSetting}
      >
        {potentialParents.map(({ tittel, id, type, dokumentTypeId }) => (
          <RadioOption key={id} value={id} type={type} text={tittel} distType={dokumentTypeId} />
        ))}
      </RadioGroup>
    </VStack>
  );
};

interface MainDocumentProps {
  document: IMainDocument;
  isIncomingDocument: boolean;
  onClick: () => void;
  isLoading: boolean;
}

const MainDocument = ({ document, isIncomingDocument, onClick, isLoading }: MainDocumentProps) => {
  const isJournalfoert = document.type === DocumentTypeEnum.JOURNALFOERT;
  const isSaksbehandler = useIsSaksbehandler();

  if (document.parentId === null) {
    return (
      <Alert variant="info" size="small" inline>
        Dette dokumentet er et hoveddokument.
      </Alert>
    );
  }

  if (isJournalfoert) {
    return (
      <Alert variant="info" size="small" inline>
        Journalførte dokumenter kan kun være vedlegg.
      </Alert>
    );
  }

  if (!(isSaksbehandler || isIncomingDocument)) {
    return (
      <Alert variant="info" size="small" inline>
        Bare tildelt saksbehandler kan gjøre dette dokumentet til et hoveddokument.
      </Alert>
    );
  }

  return (
    <Button size="small" variant="secondary-neutral" onClick={onClick} loading={isLoading}>
      Gjør til hoveddokument
    </Button>
  );
};

interface RadioOptionProps {
  value: string;
  type: ModalDocumentType;
  distType: DistribusjonsType;
  text: string;
}

const RadioOption = ({ value, type, distType, text }: RadioOptionProps) => (
  <Radio key={value} value={value} title={text}>
    <HStack align="center" justify="start" gap="0 1">
      <DocumentIcon type={type} />
      <RadioText>{text}</RadioText>
      <Tag size="xsmall" variant="info">
        {DISTRIBUTION_TYPE_NAMES[distType]}
      </Tag>
    </HStack>
  </Radio>
);

const RadioText = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;
