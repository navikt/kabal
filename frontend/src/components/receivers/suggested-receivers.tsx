import { PartStatusList } from '@app/components/part-status-list/part-status-list';
import { getTypeNames } from '@app/components/receivers/functions';
import type { IErrorProperty } from '@app/components/receivers/is-send-error';
import { Options } from '@app/components/receivers/options';
import { StyledReceiver } from '@app/components/receivers/styled-components';
import type { IBrevmottaker } from '@app/hooks/use-suggested-brevmottakere';
import type { IMottaker } from '@app/types/documents/documents';
import { IdType } from '@app/types/oppgave-common';
import type { TemplateIdEnum } from '@app/types/smart-editor/template-enums';
import { Buildings3Icon, PersonEnvelopeIcon, PersonIcon } from '@navikt/aksel-icons';
import { Checkbox, CheckboxGroup, HStack, Tag, Tooltip } from '@navikt/ds-react';
import { useCallback } from 'react';

interface ReceiversProps {
  receivers: IBrevmottaker[];
  selectedIds: string[];
  addMottakere: (mottakere: IMottaker[]) => void;
  removeMottakere: (ids: string[]) => void;
  changeMottaker: (mottaker: IMottaker) => void;
  sendErrors: IErrorProperty[];
  templateId: TemplateIdEnum | undefined;
  isLoading: boolean;
}

export const SuggestedReceivers = ({
  receivers,
  selectedIds,
  addMottakere,
  removeMottakere,
  changeMottaker,
  sendErrors,
  templateId,
  isLoading,
}: ReceiversProps) => {
  const onSelectedChange = useCallback(
    (idList: string[]) => {
      const addList: IMottaker[] = [];
      const removeList: string[] = [];

      for (const sm of receivers) {
        if (idList.includes(sm.part.id)) {
          if (!selectedIds.includes(sm.part.id)) {
            addList.push(sm);
          }
        } else if (selectedIds.includes(sm.part.id)) {
          removeList.push(sm.part.id);
        }
      }

      if (addList.length > 0) {
        addMottakere(addList);
      }

      if (removeList.length > 0) {
        removeMottakere(removeList);
      }
    },
    [receivers, selectedIds, addMottakere, removeMottakere],
  );

  if (receivers.length === 0) {
    return null;
  }

  return (
    <CheckboxGroup
      legend="Foreslåtte mottakere fra saken"
      value={selectedIds}
      onChange={onSelectedChange}
      data-testid="document-send-receiver-list"
      size="small"
      disabled={isLoading}
    >
      {receivers.map(({ part, brevmottakertyper, handling, overriddenAddress }) => {
        const { id, name, statusList } = part;
        const error = sendErrors.find((e) => e.field === id)?.reason ?? null;
        const isChecked = selectedIds.includes(id);

        return (
          <StyledReceiver key={id} accent={isChecked ? 'success' : 'info'}>
            <HStack align="center" gap="2" flexShrink="0" paddingInline="2" minHeight="8">
              <Checkbox size="small" value={id} data-testid="document-send-receiver" error={error !== null}>
                <HStack align="center" gap="1">
                  <Tooltip content={getTooltip(part.type)}>
                    <span>
                      <Icon type={part.type} />
                    </span>
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
                </HStack>
              </Checkbox>
            </HStack>
            {isChecked ? (
              <Options
                part={part}
                handling={handling}
                overriddenAddress={overriddenAddress}
                onChange={changeMottaker}
                templateId={templateId}
              />
            ) : null}
          </StyledReceiver>
        );
      })}
    </CheckboxGroup>
  );
};

const Icon = ({ type }: { type: IdType | null }) => {
  switch (type) {
    case IdType.FNR:
      return <PersonIcon aria-hidden />;
    case IdType.ORGNR:
      return <Buildings3Icon aria-hidden />;
    case null:
      return <PersonEnvelopeIcon aria-hidden />;
  }
};

const getTooltip = (type: IdType | null) => {
  switch (type) {
    case IdType.FNR:
      return 'Person';
    case IdType.ORGNR:
      return 'Organisasjon';
    case null:
      return 'Ukjent mottakertype';
  }
};
