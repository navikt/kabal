import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { type DistribusjonsTypeOption, useDistribusjonstypeOptions } from '@app/hooks/use-distribusjonstype-options';
import { useSetTypeMutation } from '@app/redux-api/oppgaver/mutations/documents';
import {
  DISTRIBUSJONSTYPER,
  DISTRIBUTION_TYPE_NAMES,
  type DistribusjonsType,
  type IDocument,
} from '@app/types/documents/documents';
import { Select, Tag, Tooltip } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/query';

interface Props extends React.RefAttributes<HTMLSpanElement> {
  document: IDocument;
  showLabel?: boolean;
  disabled?: boolean;
}

export const SetDocumentType = ({ document, disabled, ...rest }: Props) => {
  const { options, explanation } = useDistribusjonstypeOptions(document.type);

  if (!disabled && options.some(({ value }) => value === document.dokumentTypeId)) {
    return <Options options={options} explanation={explanation} document={document} />;
  }

  return <DocumentTypeTag dokumentTypeId={document.dokumentTypeId} {...rest} />;
};

interface IsOptionProps {
  document: IDocument;
  showLabel?: boolean;
  options: DistribusjonsTypeOption[];
  explanation: string;
}

const Options = ({ options, explanation, document, showLabel = false, ...rest }: IsOptionProps) => {
  const { id, dokumentTypeId } = document;
  const [setType] = useSetTypeMutation();
  const oppgaveId = useOppgaveId();

  const onChange = ({ target }: React.ChangeEvent<HTMLSelectElement>) => {
    if (isDocumentType(target.value) && oppgaveId !== skipToken) {
      setType({ oppgaveId, dokumentId: id, dokumentTypeId: target.value });
    }
  };

  return (
    <Tooltip content={explanation} maxChar={Number.POSITIVE_INFINITY}>
      <Select
        data-testid="document-type-select"
        label="Dokumenttype"
        hideLabel={!showLabel}
        size="small"
        onChange={onChange}
        value={dokumentTypeId}
        {...rest}
      >
        {options.map(({ label, value }) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </Select>
    </Tooltip>
  );
};

const isDocumentType = (type: string): type is DistribusjonsType => DISTRIBUSJONSTYPER.some((t) => t === type);

interface TypeTagProps extends React.RefAttributes<HTMLSpanElement> {
  dokumentTypeId: DistribusjonsType;
}

export const DocumentTypeTag = ({ dokumentTypeId, ...rest }: TypeTagProps) => (
  <Tooltip content={DISTRIBUTION_TYPE_NAMES[dokumentTypeId]}>
    <Tag variant="info" size="small" {...rest}>
      <span className="truncate text-left">{DISTRIBUTION_TYPE_NAMES[dokumentTypeId]}</span>
    </Tag>
  </Tooltip>
);
