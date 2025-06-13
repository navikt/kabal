import { getIsRolQuestions } from '@app/components/documents/new-documents/helpers';
import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { useDistribusjonstypeOptions } from '@app/hooks/use-distribusjonstype-options';
import { useHasDocumentAccess } from '@app/hooks/use-has-documents-access';
import { useSetTypeMutation } from '@app/redux-api/oppgaver/mutations/documents';
import {
  DISTRIBUSJONSTYPER,
  DISTRIBUTION_TYPE_NAMES,
  type DistribusjonsType,
  type IMainDocument,
} from '@app/types/documents/documents';
import { Select, Tag, Tooltip } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/query';
import { useMemo } from 'react';

interface Props {
  document: IMainDocument;
  showLabel?: boolean;
}

export const SetDocumentType = ({ document, showLabel = false }: Props) => {
  const { id, dokumentTypeId, isMarkertAvsluttet } = document;
  const [setType] = useSetTypeMutation();
  const oppgaveId = useOppgaveId();
  const hasDocumentsAccess = useHasDocumentAccess(document);
  const { options, explanation } = useDistribusjonstypeOptions(document.type);

  const warning = useMemo<string | null>(() => {
    if (!hasDocumentsAccess) {
      return 'Ingen tilgang';
    }

    if (isMarkertAvsluttet) {
      return 'Du kan ikke endre type på ferdigstilte dokumenter';
    }

    if (getIsRolQuestions(document)) {
      return 'Du kan ikke endre type for dokumenter for ROL-spørsmål';
    }

    return null;
  }, [hasDocumentsAccess, isMarkertAvsluttet, document]);

  if (warning !== null) {
    return (
      <Tooltip content={warning}>
        <Tag variant="info" size="small">
          <span className="inline-block overflow-hidden text-ellipsis whitespace-nowrap">
            {DISTRIBUTION_TYPE_NAMES[dokumentTypeId]}
          </span>
        </Tag>
      </Tooltip>
    );
  }

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
