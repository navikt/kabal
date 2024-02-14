import { Checkbox, CheckboxGroup, Tag } from '@navikt/ds-react';
import React from 'react';
import { IErrorProperty } from '@app/components/documents/new-documents/modal/finish-document/is-send-error';
import { PartStatusList } from '@app/components/part-status-list/part-status-list';
import { IBrevmottaker } from '@app/hooks/use-brevmottakere';
import { Brevmottakertype } from '@app/types/kodeverk';
import { StyledBrevmottaker } from './styled-components';

interface RecipientsProps {
  recipients: IBrevmottaker[];
  selectedBrevmottakerIds: string[];
  setSelectedBrevmottakerIds: (ids: string[]) => void;
  sendErrors: IErrorProperty[];
}

export const SelectRecipients = ({
  recipients,
  selectedBrevmottakerIds,
  setSelectedBrevmottakerIds,
  sendErrors,
}: RecipientsProps) => {
  if (recipients.length === 0) {
    return null;
  }

  return (
    <CheckboxGroup
      legend="Mottakere"
      hideLegend
      value={selectedBrevmottakerIds}
      onChange={setSelectedBrevmottakerIds}
      data-testid="document-send-recipient-list"
    >
      {recipients.map(({ id, navn, brevmottakertyper, statusList }) => {
        const error = sendErrors?.find((e) => e.field === id)?.reason ?? null;

        return (
          <Checkbox size="small" key={id} value={id} data-testid="document-send-recipient" error={error !== null}>
            <StyledBrevmottaker>
              <span>
                {navn} ({getTypeNames(brevmottakertyper)})
              </span>
              <PartStatusList statusList={statusList} size="xsmall" />
              {error === null ? null : (
                <Tag variant="error" size="xsmall">
                  {error}
                </Tag>
              )}
            </StyledBrevmottaker>
          </Checkbox>
        );
      })}
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
    third,
  ).toLocaleLowerCase()}`;
};
