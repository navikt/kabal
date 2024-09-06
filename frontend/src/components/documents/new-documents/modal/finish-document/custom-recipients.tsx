import { Buildings3Icon, PersonIcon, TrashIcon } from '@navikt/aksel-icons';
import { Button, Label, Tag, Tooltip } from '@navikt/ds-react';
import { styled } from 'styled-components';
import { CopyIdButton } from '@app/components/copy-button/copy-id-button';
import { StyledRecipient } from '@app/components/documents/new-documents/modal/finish-document/address/layout';
import { getInitalHandling } from '@app/components/documents/new-documents/modal/finish-document/functions';
import { Options } from '@app/components/documents/new-documents/modal/finish-document/options';
import {
  StyledBrevmottaker,
  StyledRecipientContent,
} from '@app/components/documents/new-documents/modal/finish-document/styled-components';
import { EditPart } from '@app/components/part/edit-part';
import { PartStatusList } from '@app/components/part-status-list/part-status-list';
import { IMottaker } from '@app/types/documents/documents';
import { IdType } from '@app/types/oppgave-common';
import { TemplateIdEnum } from '@app/types/smart-editor/template-enums';
import { IErrorProperty } from './is-send-error';

interface Props {
  mottakerList: IMottaker[];
  addMottakere: (mottakere: IMottaker[]) => void;
  removeMottakere: (ids: string[]) => void;
  changeMottaker: (mottaker: IMottaker) => void;
  sendErrors: IErrorProperty[];
  templateId: TemplateIdEnum | undefined;
}

export const CustomRecipients = ({
  mottakerList,
  addMottakere,
  removeMottakere,
  changeMottaker,
  sendErrors,
  templateId,
}: Props) => (
  <section>
    <Label size="small" htmlFor="extra-recipients">
      Ekstra mottakere
    </Label>
    <EditPart
      isLoading={false}
      id="extra-recipients"
      onChange={(part) =>
        addMottakere([{ part, handling: getInitalHandling(part, templateId), overriddenAddress: null }])
      }
      buttonText="Legg til mottaker"
    />
    <Recipients
      mottakerList={mottakerList}
      removeMottakere={removeMottakere}
      changeMottaker={changeMottaker}
      sendErrors={sendErrors}
      templateId={templateId}
    />
  </section>
);

interface RecipientsProps {
  mottakerList: IMottaker[];
  removeMottakere: (ids: string[]) => void;
  changeMottaker: (mottaker: IMottaker) => void;
  sendErrors: IErrorProperty[];
  templateId: TemplateIdEnum | undefined;
}

const Recipients = ({ mottakerList, removeMottakere, changeMottaker, sendErrors, templateId }: RecipientsProps) => {
  if (mottakerList.length === 0) {
    return null;
  }

  return (
    <StyledRecipientList>
      {mottakerList.map(({ part, handling, overriddenAddress }) => {
        const error = sendErrors.find((e) => e.field === part.id)?.reason ?? null;
        const isPerson = part.type === IdType.FNR;

        return (
          <StyledRecipient key={part.id} as="li" $accent="var(--a-border-success)">
            <StyledRecipientContent>
              <StyledBrevmottaker>
                <StyledRecipientInnerContent>
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
                  <StyledName>
                    <span>{part.name}</span>
                    <CopyIdButton id={part.id} size="xsmall" />
                  </StyledName>
                  <PartStatusList statusList={part.statusList} size="xsmall" />
                  {error === null ? null : (
                    <Tag variant="error" size="xsmall">
                      {error}
                    </Tag>
                  )}
                </StyledRecipientInnerContent>
              </StyledBrevmottaker>
            </StyledRecipientContent>
            <Options
              part={part}
              handling={handling}
              overriddenAddress={overriddenAddress}
              onChange={changeMottaker}
              templateId={templateId}
            />
          </StyledRecipient>
        );
      })}
    </StyledRecipientList>
  );
};

const StyledRecipientInnerContent = styled.div`
  display: flex;
  align-items: center;
  padding-top: var(--a-spacing-1);
  padding-bottom: var(--a-spacing-1);
  gap: var(--a-spacing-1);
`;

const StyledRecipientList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  margin-top: var(--a-spacing-1);
`;

const StyledName = styled.span`
  display: flex;
  flex-direction: row;
  align-items: center;
  column-gap: var(--a-spacing-1);
`;
