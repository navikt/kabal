import { Address } from '@app/components/documents/new-documents/modal/finish-document/address/address';
import { StyledRecipient } from '@app/components/documents/new-documents/modal/finish-document/address/layout';
import { getTypeNames } from '@app/components/documents/new-documents/modal/finish-document/functions';
import { PartStatusList } from '@app/components/part-status-list/part-status-list';
import { formatIdNumber } from '@app/functions/format-id';
import type { IBrevmottaker } from '@app/hooks/use-suggested-brevmottakere';
import { type IPart, IdType, PartStatusEnum } from '@app/types/oppgave-common';
import { Buildings3Icon, PersonIcon } from '@navikt/aksel-icons';
import { Alert, CopyButton, HStack, HelpText, Label, Tooltip } from '@navikt/ds-react';
import { styled } from 'styled-components';

interface RecipientsProps {
  recipients: IBrevmottaker[];
}

export const UnreachableSuggestedRecipients = ({ recipients }: RecipientsProps) => {
  if (recipients.length === 0) {
    return null;
  }

  return (
    <section>
      <Label size="small" spacing as="h1">
        Utilgjengelige parter fra saken
      </Label>

      <List>
        {recipients.map(({ part, brevmottakertyper, overriddenAddress, handling }) => {
          const { id, name, statusList } = part;
          const isPerson = part.type === IdType.FNR;

          const alertText = getUnreachableText(statusList);
          const helpText = getUnreachableHelpText(statusList);

          return (
            <StyledRecipient key={id} $accent="var(--a-border-danger)" as="li">
              <HStack align="center" gap="2" flexShrink="0" paddingInline="2" minHeight="8">
                <HStack align="center" gap="1">
                  <Tooltip content={isPerson ? 'Person' : 'Organisasjon'}>
                    {isPerson ? <PersonIcon aria-hidden /> : <Buildings3Icon aria-hidden />}
                  </Tooltip>
                  <CopyButton
                    size="xsmall"
                    copyText={name ?? id}
                    text={`${name} (${getTypeNames(brevmottakertyper)})`}
                  />
                  <PartStatusList statusList={statusList} size="xsmall" />
                </HStack>
              </HStack>
              <HStack align="center" gap="0 2" paddingInline="2" paddingBlock="0 1">
                <CopyButton size="xsmall" copyText={id} text={formatIdNumber(id)} />
              </HStack>
              <Address part={part} address={part.address} overriddenAddress={overriddenAddress} handling={handling} />
              {alertText === null ? null : (
                <HStack align="center" gap="0 2" paddingInline="2" paddingBlock="0 1">
                  <Alert variant="warning" size="small">
                    <HStack align="center" gap="2">
                      Parten kan ikke velges som mottaker fordi {alertText}.
                      {helpText === null ? null : <HelpText>{helpText}</HelpText>}
                    </HStack>
                  </Alert>
                </HStack>
              )}
            </StyledRecipient>
          );
        })}
      </List>
    </section>
  );
};

const getUnreachableText = (statusList: IPart['statusList']): string | null => {
  if (statusList.some((s) => s.status === PartStatusEnum.DEAD)) {
    return 'personen er død';
  }

  if (statusList.some((s) => s.status === PartStatusEnum.DELETED)) {
    return 'selskapet er avviklet';
  }

  return null;
};

const getUnreachableHelpText = (statusList: IPart['statusList']): string | null => {
  if (statusList.some((s) => s.status === PartStatusEnum.DELETED)) {
    return 'Ta kontakt med parten for å få nytt organisasjonsnummer eller oppdatert adresse.';
  }

  return null;
};

const List = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;
