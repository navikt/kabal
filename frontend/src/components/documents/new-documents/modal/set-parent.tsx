import { DocumentIcon, type ModalDocumentType } from '@app/components/documents/new-documents/shared/document-icon';
import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { useLazyCanBeParentOfDocument } from '@app/hooks/use-can-document/use-can-drop-on-document';
import { useSetParentMutation } from '@app/redux-api/oppgaver/mutations/documents';
import { useGetDocumentsQuery } from '@app/redux-api/oppgaver/queries/documents';
import {
  DISTRIBUTION_TYPE_NAMES,
  type DistribusjonsType,
  type IAttachmentDocument,
  isParentDocument,
} from '@app/types/documents/documents';
import { HStack, Radio, RadioGroup, Tag } from '@navikt/ds-react';
import { useMemo } from 'react';

const IS_PARENT_DOCUMENT = 'PARENT_DOCUMENT_VALUE';

interface Props extends React.RefAttributes<HTMLFieldSetElement> {
  document: IAttachmentDocument;
  disabled?: boolean;
}

export const SetParentDocument = ({ document, disabled = false, ...rest }: Props) => {
  const oppgaveId = useOppgaveId();
  const { data, isSuccess } = useGetDocumentsQuery(oppgaveId);
  const [setParent, { isLoading: isSetting }] = useSetParentMutation();
  const canBeSetAsParent = useLazyCanBeParentOfDocument();

  const potentialParents = useMemo(() => {
    if (data === undefined) {
      return [];
    }

    // No main documents may be converted to attachments.
    if (document.parentId === null) {
      return [];
    }

    return data.filter((d) => isParentDocument(d) && (d.id === document.parentId || canBeSetAsParent(d, document))); // Include the current parent document for the select.
  }, [data, document, canBeSetAsParent]);

  if (!isSuccess || potentialParents.length === 0 || typeof oppgaveId !== 'string') {
    return null;
  }

  const setParentFn = (parentId: string | null = null) => setParent({ dokumentId: document.id, oppgaveId, parentId });

  const onChange = (id: string) => setParentFn(id === IS_PARENT_DOCUMENT ? null : id);

  return (
    <RadioGroup
      size="small"
      value={document.parentId ?? IS_PARENT_DOCUMENT}
      onChange={onChange}
      title="Vedlegg til"
      legend="Vedlegg til"
      data-testid="document-set-parent-document"
      disabled={isSetting || disabled}
      {...rest}
    >
      {potentialParents.map(({ tittel, id, type, dokumentTypeId }) => (
        <RadioOption key={id} value={id} type={type} text={tittel} distType={dokumentTypeId} />
      ))}
    </RadioGroup>
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

      <span className="truncate">{text}</span>

      <Tag size="xsmall" variant="info">
        {DISTRIBUTION_TYPE_NAMES[distType]}
      </Tag>
    </HStack>
  </Radio>
);
