import { DocumentIcon, type ModalDocumentType } from '@app/components/documents/new-documents/shared/document-icon';
import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { useSetParentMutation } from '@app/redux-api/oppgaver/mutations/documents';
import { useGetDocumentsQuery } from '@app/redux-api/oppgaver/queries/documents';
import {
  DISTRIBUTION_TYPE_NAMES,
  type DistribusjonsType,
  DocumentTypeEnum,
  type IMainDocument,
} from '@app/types/documents/documents';
import { HStack, Heading, Radio, RadioGroup, Tag, VStack } from '@navikt/ds-react';
import { useMemo } from 'react';

const IS_PARENT_DOCUMENT = 'PARENT_DOCUMENT_VALUE';

interface Props {
  document: IMainDocument;
}

export const SetParentDocument = ({ document }: Props) => {
  const oppgaveId = useOppgaveId();
  const { data, isLoading: isLoadingDocuments } = useGetDocumentsQuery(oppgaveId);
  const [setParent, { isLoading: isSetting }] = useSetParentMutation();

  const potentialParents = useMemo(() => {
    if (data === undefined) {
      return [];
    }

    // No main documents may be converted to attachments.
    if (document.parentId === null) {
      return [];
    }

    // Uploaded documents can only be attachments to other uploaded documents.
    if (document.type === DocumentTypeEnum.UPLOADED) {
      return data.filter((d) => document.id !== d.id && d.parentId === null && d.type === DocumentTypeEnum.UPLOADED);
    }

    // Archived documents can only be attachments to smart documents.
    if (document.type === DocumentTypeEnum.JOURNALFOERT) {
      return data.filter((d) => d.isSmartDokument && d.parentId === null);
    }

    return [];
  }, [data, document.id, document.type, document.parentId]);

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
      <span className="overflow-hidden text-ellipsis whitespace-nowrap">{text}</span>
      <Tag size="xsmall" variant="info">
        {DISTRIBUTION_TYPE_NAMES[distType]}
      </Tag>
    </HStack>
  </Radio>
);
