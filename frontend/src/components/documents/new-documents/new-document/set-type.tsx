import { Select, Tag, Tooltip } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/query';
import React, { useMemo } from 'react';
import { styled } from 'styled-components';
import { getIsRolQuestions } from '@app/components/documents/new-documents/helpers';
import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import {
  ANNEN_INNGAAENDE_POST,
  KJENNELSE_FRA_TRYGDERETTEN,
  Option,
  useDistribusjonstypeOptions,
} from '@app/hooks/use-distribusjonstype-options';
import { useHasDocumentsAccess } from '@app/hooks/use-has-documents-access';
import { useIsSaksbehandler } from '@app/hooks/use-is-saksbehandler';
import { useSetTypeMutation } from '@app/redux-api/oppgaver/mutations/documents';
import { DISTRIBUTION_TYPE_NAMES, DistribusjonsType, IMainDocument } from '@app/types/documents/documents';

interface Props {
  document: IMainDocument;
  hasAttachments: boolean;
  showLabel?: boolean;
}

export const SetDocumentType = ({ document, hasAttachments, showLabel = false }: Props) => {
  const { id, dokumentTypeId, isMarkertAvsluttet } = document;
  const [setType] = useSetTypeMutation();
  const oppgaveId = useOppgaveId();
  const isSaksbehandler = useIsSaksbehandler();
  const hasDocumentsAccess = useHasDocumentsAccess();
  const { outgoing, incoming } = useDistribusjonstypeOptions(document.type);

  const [canChangeType, options, reason] = useMemo<[boolean, Option[], string | null]>(() => {
    if (!hasDocumentsAccess) {
      return [false, [], 'Ingen tilgang'];
    }

    if (isMarkertAvsluttet) {
      return [false, [], 'Du kan ikke endre type på ferdigstilte dokumenter'];
    }

    if (getIsRolQuestions(document)) {
      return [false, [], 'Du kan ikke endre type for dokumenter for ROL-spørsmål'];
    }

    if (dokumentTypeId === DistribusjonsType.KJENNELSE_FRA_TRYGDERETTEN) {
      return hasAttachments
        ? [
            true,
            [KJENNELSE_FRA_TRYGDERETTEN, ANNEN_INNGAAENDE_POST],
            'Kan kun endres til «Annen inngående post» fordi dokumentet har opplastede vedlegg',
          ]
        : [true, [...outgoing, ...incoming], null];
    }

    if (dokumentTypeId === DistribusjonsType.ANNEN_INNGAAENDE_POST) {
      return hasAttachments
        ? [
            true,
            [ANNEN_INNGAAENDE_POST, KJENNELSE_FRA_TRYGDERETTEN],
            'Kan kun endres til «Kjennelse fra TR» fordi dokumentet har opplastede vedlegg',
          ]
        : [true, [...outgoing, ...incoming], null];
    }

    if (hasAttachments) {
      return [true, outgoing, 'Kan kun endres til andre utgående typer fordi dokumentet har vedlegg fra arkivet'];
    }

    if (isSaksbehandler) {
      return [true, [...outgoing, ...incoming], null];
    }

    return [false, [], 'Du kan ikke endre utgående dokumenter uten å være tildelt saken'];
  }, [
    hasDocumentsAccess,
    isMarkertAvsluttet,
    document,
    dokumentTypeId,
    hasAttachments,
    isSaksbehandler,
    outgoing,
    incoming,
  ]);

  if (!canChangeType) {
    return (
      <Tooltip content={reason ?? ''}>
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
    <Tooltip content={reason ?? 'Kan endres til alle typer'} maxChar={Infinity}>
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

const DOCUMENT_TYPES = Object.values(DistribusjonsType);

const isDocumentType = (type: string): type is DistribusjonsType => DOCUMENT_TYPES.some((t) => t === type);

const StyledSelect = styled(Select)`
  max-width: 250px;

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
