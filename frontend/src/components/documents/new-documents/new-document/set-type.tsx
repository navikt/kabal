import { Select, Tag, Tooltip } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/query';
import React, { useMemo } from 'react';
import { styled } from 'styled-components';
import { getIsRolQuestions } from '@app/components/documents/new-documents/helpers';
import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { useDistribusjonstypeOptions } from '@app/hooks/use-distribusjonstype-options';
import { useHasDocumentsAccess } from '@app/hooks/use-has-documents-access';
import { useSetTypeMutation } from '@app/redux-api/oppgaver/mutations/documents';
import { DISTRIBUTION_TYPE_NAMES, DistribusjonsType, IMainDocument } from '@app/types/documents/documents';

interface Props {
  document: IMainDocument;
  hasAttachments: boolean;
}

export const SetDocumentType = ({ document, hasAttachments }: Props) => {
  const { id, dokumentTypeId, isMarkertAvsluttet } = document;
  const [setType] = useSetTypeMutation();
  const oppgaveId = useOppgaveId();
  const hasDocumentsAccess = useHasDocumentsAccess();
  const options = useDistribusjonstypeOptions(document.type);

  const [canChangeType, reason] = useMemo<[boolean, string]>(() => {
    if (!hasDocumentsAccess) {
      return [false, 'Ingen tilgang.'];
    }

    if (isMarkertAvsluttet) {
      return [false, 'Du kan ikke endre type på ferdigstilte dokumenter.'];
    }

    if (getIsRolQuestions(document)) {
      return [false, 'Du kan ikke endre type for dokumenter for ROL-spørsmål.'];
    }

    if (dokumentTypeId === DistribusjonsType.KJENNELSE_FRA_TRYGDERETTEN && hasAttachments) {
      return [false, 'Du kan ikke endre type for kjennelse fra Trygderetten med vedlegg.'];
    }

    return [true, ''];
  }, [document, dokumentTypeId, hasAttachments, hasDocumentsAccess, isMarkertAvsluttet]);

  if (!canChangeType) {
    return (
      <Tooltip content={reason}>
        <Tag variant="info" size="small">
          <NoWrap>{DISTRIBUTION_TYPE_NAMES[dokumentTypeId]}</NoWrap>
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
    <StyledSelect
      data-testid="document-type-select"
      label="Dokumenttype"
      hideLabel
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
  );
};

const DOCUMENT_TYPES = Object.values(DistribusjonsType);

const isDocumentType = (type: string): type is DistribusjonsType => DOCUMENT_TYPES.some((t) => t === type);

const StyledSelect = styled(Select)`
  select {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

const NoWrap = styled.span`
  display: inline-block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;
