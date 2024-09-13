import { StyledRecipient } from '@app/components/documents/new-documents/modal/finish-document/address/layout';
import { getTypeNames } from '@app/components/documents/new-documents/modal/finish-document/functions';
import type { IErrorProperty } from '@app/components/documents/new-documents/modal/finish-document/is-send-error';
import { Options } from '@app/components/documents/new-documents/modal/finish-document/options';
import { PartStatusList } from '@app/components/part-status-list/part-status-list';
import type { IBrevmottaker } from '@app/hooks/use-suggested-brevmottakere';
import type { IMottaker } from '@app/types/documents/documents';
import { IdType } from '@app/types/oppgave-common';
import type { TemplateIdEnum } from '@app/types/smart-editor/template-enums';
import { Buildings3Icon, PersonIcon } from '@navikt/aksel-icons';
import { Checkbox, CheckboxGroup, Tag, Tooltip } from '@navikt/ds-react';
import { useCallback } from 'react';
import { StyledBrevmottaker, StyledRecipientContent } from './styled-components';

interface RecipientsProps {
  recipients: IBrevmottaker[];
  selectedIds: string[];
  addMottakere: (mottakere: IMottaker[]) => void;
  removeMottakere: (ids: string[]) => void;
  changeMottaker: (mottaker: IMottaker) => void;
  sendErrors: IErrorProperty[];
  templateId: TemplateIdEnum | undefined;
}

export const SuggestedRecipients = ({
  recipients,
  selectedIds,
  addMottakere,
  removeMottakere,
  changeMottaker,
  sendErrors,
  templateId,
}: RecipientsProps) => {
  const onSelectedChange = useCallback(
    (idList: string[]) => {
      const addList: IMottaker[] = [];
      const removeList: string[] = [];

      for (const sm of recipients) {
        if (idList.includes(sm.part.id)) {
          if (!selectedIds.includes(sm.part.id)) {
            addList.push(sm);
          }
        } else if (selectedIds.includes(sm.part.id)) {
          removeList.push(sm.part.id);
        }
      }

      if (addList.length !== 0) {
        addMottakere(addList);
      }

      if (removeList.length !== 0) {
        removeMottakere(removeList);
      }
    },
    [recipients, selectedIds, addMottakere, removeMottakere],
  );

  if (recipients.length === 0) {
    return null;
  }

  return (
    <CheckboxGroup
      legend="Foreslåtte mottakere fra saken"
      value={selectedIds}
      onChange={onSelectedChange}
      data-testid="document-send-recipient-list"
      size="small"
    >
      {recipients.map(({ part, brevmottakertyper, handling, overriddenAddress }) => {
        const { id, name, statusList } = part;
        const error = sendErrors.find((e) => e.field === id)?.reason ?? null;
        const isPerson = part.type === IdType.FNR;
        const isChecked = selectedIds.includes(id);

        return (
          <StyledRecipient key={id} $accent={isChecked ? 'var(--a-border-success)' : 'var(--a-border-info)'}>
            <StyledBrevmottaker>
              <Checkbox size="small" value={id} data-testid="document-send-recipient" error={error !== null}>
                <StyledRecipientContent>
                  <Tooltip content={isPerson ? 'Person' : 'Organisasjon'}>
                    {isPerson ? <PersonIcon aria-hidden /> : <Buildings3Icon aria-hidden />}
                  </Tooltip>
                  <span>
                    {name} ({getTypeNames(brevmottakertyper)})
                  </span>
                  <PartStatusList statusList={statusList} size="xsmall" />
                  {error === null ? null : (
                    <Tag variant="error" size="xsmall">
                      {error}
                    </Tag>
                  )}
                </StyledRecipientContent>
              </Checkbox>
            </StyledBrevmottaker>
            {isChecked ? (
              <Options
                part={part}
                handling={handling}
                overriddenAddress={overriddenAddress}
                onChange={changeMottaker}
                templateId={templateId}
              />
            ) : null}
          </StyledRecipient>
        );
      })}
    </CheckboxGroup>
  );
};
