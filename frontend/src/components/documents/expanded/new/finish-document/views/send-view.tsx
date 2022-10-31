import { Close, Send } from '@navikt/ds-icons';
import { Button, Checkbox, CheckboxGroup } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/dist/query';
import React, { useContext, useState } from 'react';
import { useOppgave } from '../../../../../../hooks/oppgavebehandling/use-oppgave';
import { IBrevmottaker, useBrevmottakere } from '../../../../../../hooks/use-brevmottakere';
import { useFinishDocumentMutation } from '../../../../../../redux-api/oppgaver/mutations/documents';
import {
  useGetDocumentsQuery,
  useLazyValidateDocumentQuery,
} from '../../../../../../redux-api/oppgaver/queries/documents';
import { Brevmottakertype } from '../../../../../../types/kodeverk';
import { DocumentTypeEnum } from '../../../../../show-document/types';
import { ShownDocumentContext } from '../../../../context';
import { ERROR_MESSAGES } from './error-messages';
import { Errors, ValidationError } from './errors';
import {
  StyledBrevmottaker,
  StyledBrevmottakerList,
  StyledButtons,
  StyledFinishDocument,
  StyledHeader,
  StyledMainText,
} from './styled-components';
import { FinishProps } from './types';

export const SendView = ({ dokumentId, documentTitle, close }: FinishProps) => {
  const [finish, { isLoading: isFinishing }] = useFinishDocumentMutation();
  const { data, isLoading: oppgaveIsLoading } = useOppgave();
  const { shownDocument, setShownDocument } = useContext(ShownDocumentContext);
  const [brevmottakertypeIds, setBrevmottakertypeIds] = useState<Brevmottakertype[]>([]);
  const brevmottakere = useBrevmottakere();
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [validate, { isFetching: isValidating }] = useLazyValidateDocumentQuery();
  const { data: documents = [] } = useGetDocumentsQuery(
    typeof data !== 'undefined' ? { oppgaveId: data.id } : skipToken
  );

  if (oppgaveIsLoading || typeof data === 'undefined') {
    return null;
  }

  const onClick = async () => {
    if (typeof data?.id !== 'string') {
      return;
    }

    const validation = await validate({ dokumentId, oppgaveId: data.id }).unwrap();

    if (validation?.length !== 0 && validation.some((v) => v.errors.length !== 0)) {
      const validationErrors = validation.map((v) => ({
        dokumentId: v.dokumentId,
        title: documents.find((d) => d.id === v.dokumentId)?.tittel ?? v.dokumentId,
        errors: v.errors.map((e) => ERROR_MESSAGES[e.type]),
      }));

      setErrors(validationErrors);

      return;
    }

    if (
      shownDocument !== null &&
      shownDocument.type !== DocumentTypeEnum.ARCHIVED &&
      shownDocument.documentId === dokumentId
    ) {
      setShownDocument(null);
    }

    const types =
      brevmottakere.length === 1 && typeof brevmottakere[0] !== 'undefined'
        ? brevmottakere[0].brevmottakertyper
        : [...new Set(brevmottakertypeIds.flat())];

    if (types.length === 0) {
      setErrors([{ dokumentId, title: documentTitle, errors: ['Minst én mottaker må velges'] }]);

      return;
    }

    setErrors([]);
    finish({ dokumentId, oppgaveId: data.id, brevmottakertypeIds: types });
  };

  return (
    <StyledFinishDocument>
      <StyledHeader>{documentTitle}</StyledHeader>
      <StyledMainText>{`Send brevet "${documentTitle}" til`}</StyledMainText>
      <Recipients
        recipients={brevmottakere}
        selectedBrevmottakertypeIds={brevmottakertypeIds}
        setSelectedBrevmottakertypeIds={setBrevmottakertypeIds}
      />

      <Errors errors={errors} />

      <StyledButtons>
        <Button
          type="button"
          size="small"
          variant="primary"
          onClick={onClick}
          loading={isFinishing || isValidating}
          data-testid="document-finish-confirm"
          icon={<Send aria-hidden />}
        >
          Send ut
        </Button>
        <Button
          type="button"
          size="small"
          variant="secondary"
          onClick={close}
          data-testid="document-finish-cancel"
          disabled={isFinishing || isValidating}
          icon={<Close aria-hidden />}
        >
          Avbryt
        </Button>
      </StyledButtons>
    </StyledFinishDocument>
  );
};

interface RecipientsProps {
  recipients: IBrevmottaker[];
  selectedBrevmottakertypeIds: Brevmottakertype[];
  setSelectedBrevmottakertypeIds: (recipients: Brevmottakertype[]) => void;
}

const Recipients = ({ recipients, selectedBrevmottakertypeIds, setSelectedBrevmottakertypeIds }: RecipientsProps) => {
  if (recipients.length === 0) {
    return null;
  }

  if (recipients.length === 1 && typeof recipients[0] !== 'undefined') {
    const [{ brevmottakertyper, navn }] = recipients;

    return (
      <StyledBrevmottakerList>
        <StyledBrevmottaker>
          {navn} ({getTypeNames(brevmottakertyper)})
        </StyledBrevmottaker>
      </StyledBrevmottakerList>
    );
  }

  return (
    <CheckboxGroup
      legend="Brevmottakere"
      hideLegend
      value={selectedBrevmottakertypeIds}
      onChange={setSelectedBrevmottakertypeIds}
    >
      {recipients.map(({ id, navn, brevmottakertyper }) => (
        <Checkbox size="small" key={`${id}-${brevmottakertyper.join('-')}`} value={brevmottakertyper}>
          {navn} ({getTypeNames(brevmottakertyper)})
        </Checkbox>
      ))}
    </CheckboxGroup>
  );
};

const getTypeName = (type: Brevmottakertype): string => {
  switch (type) {
    case Brevmottakertype.KLAGER:
      return 'Klager';
    case Brevmottakertype.PROSESSFULLMEKTIG:
      return 'Fullmektig';
    case Brevmottakertype.SAKEN_GJELDER:
      return 'Saken gjelder';
    default:
      return '';
  }
};

const getTypeNames = (types: Brevmottakertype[]): string => {
  const [first, second, third] = types;

  if (typeof first === 'undefined') {
    return 'Ingen saksrolle funnet';
  }

  if (types.length === 1 || typeof second === 'undefined') {
    return getTypeName(first);
  }

  if (types.length === 2 || typeof third === 'undefined') {
    return `${getTypeName(first)} og ${getTypeName(second).toLocaleLowerCase()}`;
  }

  return `${getTypeName(first)}, ${getTypeName(second).toLocaleLowerCase()} og ${getTypeName(
    third
  ).toLocaleLowerCase()}`;
};
