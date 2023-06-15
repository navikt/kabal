import { Checkbox, CheckboxGroup } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/dist/query';
import React, { useState } from 'react';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { IBrevmottaker, useBrevmottakere } from '@app/hooks/use-brevmottakere';
import { useRemoveDocument } from '@app/hooks/use-remove-document';
import { useFinishDocumentMutation } from '@app/redux-api/oppgaver/mutations/documents';
import { useGetDocumentsQuery, useLazyValidateDocumentQuery } from '@app/redux-api/oppgaver/queries/documents';
import { Brevmottakertype } from '@app/types/kodeverk';
import { Confirm } from './confirm';
import { ERROR_MESSAGES } from './error-messages';
import { Errors, ValidationError } from './errors';
import { StyledBrevmottaker, StyledBrevmottakerList, StyledFinishDocument } from './styled-components';
import { FinishProps } from './types';

export const SendView = ({ document }: FinishProps) => {
  const { id: dokumentId, tittel: documentTitle } = document;
  const [finish, { isLoading: isFinishing }] = useFinishDocumentMutation();
  const { data, isLoading: oppgaveIsLoading } = useOppgave();
  const [brevmottakertypeIds, setBrevmottakertypeIds] = useState<Brevmottakertype[]>([]);
  const brevmottakere = useBrevmottakere();
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [validate, { isFetching: isValidating }] = useLazyValidateDocumentQuery();
  const { data: documents = [] } = useGetDocumentsQuery(typeof data !== 'undefined' ? data.id : skipToken);
  const remove = useRemoveDocument();

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

    const types =
      brevmottakere.length === 1 && typeof brevmottakere[0] !== 'undefined'
        ? brevmottakere[0].brevmottakertyper
        : [...new Set(brevmottakertypeIds.flat())];

    if (types.length === 0) {
      setErrors([{ dokumentId, title: documentTitle, errors: ['Minst én mottaker må velges'] }]);

      return;
    }

    setErrors([]);
    await finish({ dokumentId, oppgaveId: data.id, brevmottakertypeIds: types });
    remove(dokumentId, document);
  };

  return (
    <StyledFinishDocument>
      <Recipients
        recipients={brevmottakere}
        selectedBrevmottakertypeIds={brevmottakertypeIds}
        setSelectedBrevmottakertypeIds={setBrevmottakertypeIds}
        label={`Send brevet "${documentTitle}" til`}
      />

      <Confirm actionText="Send ut" onClick={onClick} isValidating={isValidating} isFinishing={isFinishing} />

      <Errors errors={errors} />
    </StyledFinishDocument>
  );
};

interface RecipientsProps {
  recipients: IBrevmottaker[];
  selectedBrevmottakertypeIds: Brevmottakertype[];
  setSelectedBrevmottakertypeIds: (recipients: Brevmottakertype[]) => void;
  label: string;
}

const Recipients = ({
  recipients,
  selectedBrevmottakertypeIds,
  setSelectedBrevmottakertypeIds,
  label,
}: RecipientsProps) => {
  if (recipients.length === 0) {
    return null;
  }

  if (recipients.length === 1 && typeof recipients[0] !== 'undefined') {
    const [{ brevmottakertyper, navn, id }] = recipients;

    return (
      <StyledBrevmottakerList>
        <StyledBrevmottaker data-testid="document-send-recipient" data-userid={id}>
          {navn} ({getTypeNames(brevmottakertyper)})
        </StyledBrevmottaker>
      </StyledBrevmottakerList>
    );
  }

  return (
    <CheckboxGroup
      legend={label}
      value={selectedBrevmottakertypeIds}
      onChange={setSelectedBrevmottakertypeIds}
      data-testid="document-send-recipient-list"
    >
      {recipients.map(({ id, navn, brevmottakertyper }) => (
        <Checkbox
          size="small"
          key={`${id}-${brevmottakertyper.join('-')}`}
          value={brevmottakertyper}
          data-testid="document-send-recipient"
        >
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
