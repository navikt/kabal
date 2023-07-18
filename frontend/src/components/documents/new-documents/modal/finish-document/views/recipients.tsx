import { Checkbox, CheckboxGroup, Tag } from '@navikt/ds-react';
import React from 'react';
import { IErrorProperty } from '@app/components/documents/new-documents/modal/finish-document/views/is-send-error';
import { PartStatusList } from '@app/components/part-status-list/part-status-list';
import { IBrevmottaker } from '@app/hooks/use-brevmottakere';
import { Brevmottakertype } from '@app/types/kodeverk';
import { StyledBrevmottaker, StyledBrevmottakerItem, StyledBrevmottakerList } from './styled-components';

interface RecipientsProps {
  recipients: IBrevmottaker[];
  selectedBrevmottakertypeIds: Brevmottakertype[];
  setSelectedBrevmottakertypeIds: (recipients: Brevmottakertype[]) => void;
  label: string;
  sendErrors: IErrorProperty[];
}

export const Recipients = ({
  recipients,
  selectedBrevmottakertypeIds,
  setSelectedBrevmottakertypeIds,
  label,
  sendErrors,
}: RecipientsProps) => {
  if (recipients.length === 0) {
    return null;
  }

  if (recipients.length === 1 && typeof recipients[0] !== 'undefined') {
    const [{ brevmottakertyper, navn, id, statusList }] = recipients;

    const error = sendErrors?.find((e) => e.field === id)?.reason ?? null;

    return (
      <StyledBrevmottakerList>
        <StyledBrevmottakerItem data-testid="document-send-recipient" data-userid={id}>
          <span>
            {navn} ({getTypeNames(brevmottakertyper)})
          </span>
          <PartStatusList statusList={statusList} size="xsmall" variant="neutral" />
          {error === null ? null : (
            <Tag variant="error" size="xsmall">
              {error}
            </Tag>
          )}
        </StyledBrevmottakerItem>
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
      {recipients.map(({ id, navn, brevmottakertyper, statusList }) => {
        const error = sendErrors?.find((e) => e.field === id)?.reason ?? null;

        return (
          <Checkbox
            size="small"
            key={`${id}-${brevmottakertyper.join('-')}`}
            value={brevmottakertyper}
            data-testid="document-send-recipient"
          >
            <StyledBrevmottaker>
              <span>
                {navn} ({getTypeNames(brevmottakertyper)})
              </span>
              <PartStatusList statusList={statusList} size="xsmall" variant="neutral" />
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
