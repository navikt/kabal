import { Buildings3Icon, PersonIcon } from '@navikt/aksel-icons';
import { HStack, Label, Tooltip, VStack } from '@navikt/ds-react';
import { PartStatusList } from '@/components/part-status-list/part-status-list';
import { getTypeNames } from '@/components/receivers/functions';
import { Options } from '@/components/receivers/options';
import { StyledReceiver } from '@/components/receivers/styled-components';
import type { IBrevmottaker } from '@/hooks/use-suggested-brevmottakere';
import type { IMottaker } from '@/types/documents/documents';
import { IdType } from '@/types/oppgave-common';
import type { TemplateIdEnum } from '@/types/smart-editor/template-enums';

interface Props {
  receiver: IBrevmottaker;
  templateId: TemplateIdEnum | undefined;
  changeMottaker: (mottaker: IMottaker) => void;
}

export const SingleReceiver = ({ receiver, changeMottaker, templateId }: Props) => {
  const { part, handling, overriddenAddress, brevmottakertyper } = receiver;
  const { name, statusList } = part;
  const isPerson = part.type === IdType.FNR;

  return (
    <VStack as="section">
      <Label size="small" spacing as="h1">
        Mottaker fra saken
      </Label>

      <StyledReceiver accent="success">
        <HStack align="center" gap="space-8" flexShrink="0" paddingInline="space-8" minHeight="8">
          <HStack align="center" gap="space-4">
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
      </StyledReceiver>
    </VStack>
  );
};
