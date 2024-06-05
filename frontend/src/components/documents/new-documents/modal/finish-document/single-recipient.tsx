import { Buildings3Icon, PersonIcon } from '@navikt/aksel-icons';
import { Label, Tooltip } from '@navikt/ds-react';
import { styled } from 'styled-components';
import { StyledRecipient } from '@app/components/documents/new-documents/modal/finish-document/address/layout';
import { getTypeNames } from '@app/components/documents/new-documents/modal/finish-document/functions';
import { Options } from '@app/components/documents/new-documents/modal/finish-document/options';
import {
  StyledBrevmottaker,
  StyledRecipientContent,
} from '@app/components/documents/new-documents/modal/finish-document/styled-components';
import { PartStatusList } from '@app/components/part-status-list/part-status-list';
import { IBrevmottaker } from '@app/hooks/use-suggested-brevmottakere';
import { IMottaker } from '@app/types/documents/documents';
import { IdType } from '@app/types/oppgave-common';
import { TemplateIdEnum } from '@app/types/smart-editor/template-enums';

interface Props {
  recipient: IBrevmottaker;
  templateId: TemplateIdEnum | undefined;
  changeMottaker: (mottaker: IMottaker) => void;
}

export const SingleRecipient = ({ recipient, changeMottaker, templateId }: Props) => {
  const { part, handling, overriddenAddress, brevmottakertyper } = recipient;
  const { name, statusList } = part;
  const isPerson = part.type === IdType.FNR;

  return (
    <Container>
      <Label size="small" spacing as="h1">
        Mottaker fra saken
      </Label>

      <StyledRecipient $accent="var(--a-border-success)">
        <StyledBrevmottaker>
          <StyledRecipientContent>
            <Tooltip content={isPerson ? 'Person' : 'Organisasjon'}>
              {isPerson ? <PersonIcon aria-hidden /> : <Buildings3Icon aria-hidden />}
            </Tooltip>
            <span>
              {name} ({getTypeNames(brevmottakertyper)})
            </span>
            <PartStatusList statusList={statusList} size="xsmall" />
          </StyledRecipientContent>
        </StyledBrevmottaker>
        <Options
          part={part}
          handling={handling}
          overriddenAddress={overriddenAddress}
          onChange={changeMottaker}
          templateId={templateId}
        />
      </StyledRecipient>
    </Container>
  );
};

const Container = styled.section`
  display: flex;
  flex-direction: column;
`;
