import { getIsRolQuestions } from '@app/components/documents/new-documents/helpers';
import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { type Option, useDistribusjonstypeOptions } from '@app/hooks/use-distribusjonstype-options';
import { useHasDocumentsAccess } from '@app/hooks/use-has-documents-access';
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
import { styled } from 'styled-components';

interface Props {
  document: IMainDocument;
  hasAttachments: boolean;
  showLabel?: boolean;
}

export const SetDocumentType = ({ document, showLabel = false }: Props) => {
  const { id, dokumentTypeId, isMarkertAvsluttet } = document;
  const [setType] = useSetTypeMutation();
  const oppgaveId = useOppgaveId();
  const hasDocumentsAccess = useHasDocumentsAccess();
  const { outgoing, incoming, explanation } = useDistribusjonstypeOptions(document.type);

  const [canChangeType, options, warning] = useMemo<[boolean, Option[], string | null]>(() => {
    if (!hasDocumentsAccess) {
      return [false, [], 'Ingen tilgang'];
    }

    if (isMarkertAvsluttet) {
      return [false, [], 'Du kan ikke endre type på ferdigstilte dokumenter'];
    }

    if (getIsRolQuestions(document)) {
      return [false, [], 'Du kan ikke endre type for dokumenter for ROL-spørsmål'];
    }

    return [true, [...outgoing, ...incoming], null];
  }, [hasDocumentsAccess, isMarkertAvsluttet, document, outgoing, incoming]);

  if (!canChangeType) {
    return (
      <Tooltip content={explanation ?? ''}>
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
    <Tooltip content={warning ?? explanation} maxChar={Number.POSITIVE_INFINITY}>
      <StyledSelect
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
      </StyledSelect>
    </Tooltip>
  );
};

const isDocumentType = (type: string): type is DistribusjonsType => DISTRIBUSJONSTYPER.some((t) => t === type);

const StyledSelect = styled(Select)`
  max-width: 250px;

  select {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;
