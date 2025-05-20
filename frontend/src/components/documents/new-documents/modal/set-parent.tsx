import { DocumentIcon, type ModalDocumentType } from '@app/components/documents/new-documents/shared/document-icon';
import { getIsIncomingDocument } from '@app/functions/is-incoming-document';
import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { useIsRol } from '@app/hooks/use-is-rol';
import { useSetParentMutation } from '@app/redux-api/oppgaver/mutations/documents';
import { useGetDocumentsQuery } from '@app/redux-api/oppgaver/queries/documents';
import {
  DISTRIBUTION_TYPE_NAMES,
  DistribusjonsType,
  DocumentTypeEnum,
  type IMainDocument,
} from '@app/types/documents/documents';
import { TemplateIdEnum } from '@app/types/smart-editor/template-enums';
import { HStack, Heading, Radio, RadioGroup, Tag, VStack } from '@navikt/ds-react';
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
      if (document.parentId === null) {
        return [];
      }

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

    return data.filter(
      (d) =>
        document.id !== d.id &&
        d.parentId === null &&
        d.dokumentTypeId !== DistribusjonsType.KJENNELSE_FRA_TRYGDERETTEN &&
        d.dokumentTypeId !== DistribusjonsType.ANNEN_INNGAAENDE_POST,
    );
  }, [data, document.id, document.type, document.parentId, isIncomingDocument, hasAttachments, isRol]);

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
