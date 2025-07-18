import { CopyIdButton } from '@app/components/copy-button/copy-id-button';
import { EditPart } from '@app/components/part/edit-part';
import { PartStatusList } from '@app/components/part-status-list/part-status-list';
import { getInitalHandling } from '@app/components/receivers/functions';
import type { IErrorProperty } from '@app/components/receivers/is-send-error';
import { Options } from '@app/components/receivers/options';
import { StyledReceiver } from '@app/components/receivers/styled-components';
import type { IMottaker } from '@app/types/documents/documents';
import { IdType } from '@app/types/oppgave-common';
import type { TemplateIdEnum } from '@app/types/smart-editor/template-enums';
import { Buildings3Icon, PersonIcon, TrashIcon } from '@navikt/aksel-icons';
import { Button, HStack, Label, Tag, Tooltip } from '@navikt/ds-react';
import { styled } from 'styled-components';

interface Props {
  mottakerList: IMottaker[];
  addMottakere: (mottakere: IMottaker[]) => void;
  removeMottakere: (ids: string[]) => void;
  changeMottaker: (mottaker: IMottaker) => void;
  sendErrors: IErrorProperty[];
  templateId: TemplateIdEnum | undefined;
}

const EXTRA_RECEIVERS_ID = 'extra-receivers';

export const CustomReceivers = ({
  mottakerList,
  addMottakere,
  removeMottakere,
  changeMottaker,
  sendErrors,
  templateId,
}: Props) => (
  <section>
    <Label size="small" htmlFor={EXTRA_RECEIVERS_ID}>
      Ekstra mottakere
    </Label>
    <EditPart
      isLoading={false}
      id={EXTRA_RECEIVERS_ID}
      onChange={(part) =>
        addMottakere([{ part, handling: getInitalHandling(part, templateId), overriddenAddress: null }])
      }
      buttonText="Legg til mottaker"
    />
    <Receivers
      mottakerList={mottakerList}
      removeMottakere={removeMottakere}
      changeMottaker={changeMottaker}
      sendErrors={sendErrors}
      templateId={templateId}
    />
  </section>
);

interface ReceiversProps {
  mottakerList: IMottaker[];
  removeMottakere: (ids: string[]) => void;
  changeMottaker: (mottaker: IMottaker) => void;
  sendErrors: IErrorProperty[];
  templateId: TemplateIdEnum | undefined;
}

const Receivers = ({ mottakerList, removeMottakere, changeMottaker, sendErrors, templateId }: ReceiversProps) => {
  if (mottakerList.length === 0) {
    return null;
  }

  return (
    <StyledReceiverList>
      {mottakerList.map(({ part, handling, overriddenAddress }) => {
        const error = sendErrors.find((e) => e.field === part.id)?.reason ?? null;
        const isPerson = part.type === IdType.FNR;

        return (
          <StyledReceiver key={part.id} as="li" $accent="var(--a-border-success)">
            <HStack align="center" gap="1">
              <HStack align="center" gap="2" flexShrink="0" paddingInline="2" minHeight="8">
                <HStack align="center" gap="1" paddingBlock="1">
                  <Tooltip content="Fjern mottaker">
                    <Button
                      size="xsmall"
                      variant="tertiary-neutral"
                      title="Fjern"
                      icon={<TrashIcon color="var(--a-surface-danger)" aria-hidden />}
                      onClick={() => removeMottakere([part.id])}
                    />
                  </Tooltip>
                  <Tooltip content={isPerson ? 'Person' : 'Organisasjon'}>
                    {isPerson ? <PersonIcon aria-hidden /> : <Buildings3Icon aria-hidden />}
                  </Tooltip>
                  <HStack align="center" gap="0 1">
                    <span>{part.name}</span>
                    {part.identifikator === null ? null : <CopyIdButton id={part.identifikator} size="xsmall" />}
                  </HStack>
                  <PartStatusList statusList={part.statusList} size="xsmall" />
                  {error === null ? null : (
                    <Tag variant="error" size="xsmall">
                      {error}
                    </Tag>
                  )}
                </HStack>
              </HStack>
            </HStack>
            <Options
              part={part}
              handling={handling}
              overriddenAddress={overriddenAddress}
              onChange={changeMottaker}
              templateId={templateId}
            />
          </StyledReceiver>
        );
      })}
    </StyledReceiverList>
  );
};

const StyledReceiverList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  margin-top: var(--a-spacing-1);
`;
