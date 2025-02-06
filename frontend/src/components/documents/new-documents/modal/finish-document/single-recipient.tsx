import { StyledRecipient } from '@app/components/documents/new-documents/modal/finish-document/address/layout';
import { getTypeNames } from '@app/components/documents/new-documents/modal/finish-document/functions';
import { Options } from '@app/components/documents/new-documents/modal/finish-document/options';
import { PartStatusList } from '@app/components/part-status-list/part-status-list';
import type { IBrevmottaker } from '@app/hooks/use-suggested-brevmottakere';
import type { IMottaker } from '@app/types/documents/documents';
import { IdType } from '@app/types/oppgave-common';
import type { TemplateIdEnum } from '@app/types/smart-editor/template-enums';
import { Buildings3Icon, PersonIcon } from '@navikt/aksel-icons';
import { HStack, Label, Tooltip, VStack } from '@navikt/ds-react';

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
    <VStack as="section">
      <Label size="small" spacing as="h1">
        Mottaker fra saken
      </Label>

      <StyledRecipient $accent="var(--a-border-success)">
        <HStack align="center" gap="2" flexShrink="0" paddingInline="2" minHeight="8">
          <HStack align="center" gap="1">
            <Tooltip content={isPerson ? 'Person' : 'Organisasjon'}>
              {isPerson ? <PersonIcon aria-hidden /> : <Buildings3Icon aria-hidden />}
            </Tooltip>
            <span>
              {name} ({getTypeNames(brevmottakertyper)})
            </span>
            <PartStatusList statusList={statusList} size="xsmall" />
          </HStack>
        </HStack>
        <Options
          part={part}
          handling={handling}
          overriddenAddress={overriddenAddress}
          onChange={changeMottaker}
          templateId={templateId}
        />
      </StyledRecipient>
    </VStack>
  );
};
