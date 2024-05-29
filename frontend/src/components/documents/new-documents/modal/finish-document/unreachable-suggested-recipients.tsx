import { Buildings3Icon, PersonIcon } from '@navikt/aksel-icons';
import { Alert, CopyButton, HelpText, Label, Tooltip } from '@navikt/ds-react';
import React from 'react';
import { styled } from 'styled-components';
import { Address } from '@app/components/documents/new-documents/modal/finish-document/address/address';
import { StyledRecipient } from '@app/components/documents/new-documents/modal/finish-document/address/layout';
import { getTypeNames } from '@app/components/documents/new-documents/modal/finish-document/functions';
import { PartStatusList } from '@app/components/part-status-list/part-status-list';
import { formatIdNumber } from '@app/functions/format-id';
import { IBrevmottaker } from '@app/hooks/use-suggested-brevmottakere';
import { IPart, IdType, PartStatusEnum } from '@app/types/oppgave-common';
import { StyledBrevmottaker, StyledRecipientContent } from './styled-components';

interface RecipientsProps {
  recipients: IBrevmottaker[];
}

export const UnreachableSuggestedRecipients = ({ recipients }: RecipientsProps) => {
  if (recipients.length === 0) {
    return null;
  }

  return (
    <Container>
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
              <StyledBrevmottaker>
                <StyledRecipientContent>
                  <Tooltip content={isPerson ? 'Person' : 'Organisasjon'}>
                    {isPerson ? <PersonIcon aria-hidden /> : <Buildings3Icon aria-hidden />}
                  </Tooltip>
                  <CopyButton
                    size="xsmall"
                    copyText={name ?? id}
                    text={`${name} (${getTypeNames(brevmottakertyper)})`}
                  />
                  <PartStatusList statusList={statusList} size="xsmall" />
                </StyledRecipientContent>
              </StyledBrevmottaker>
              <Row>
                <CopyButton size="xsmall" copyText={id} text={formatIdNumber(id)} />
              </Row>
              <Address part={part} address={part.address} overriddenAddress={overriddenAddress} handling={handling} />
              {alertText === null ? null : (
                <Row>
                  <Alert variant="warning" size="small">
                    <AlertContent>
                      Parten kan ikke velges som mottaker fordi {alertText}.
                      {helpText === null ? null : <HelpText>{helpText}</HelpText>}
                    </AlertContent>
                  </Alert>
                </Row>
              )}
            </StyledRecipient>
          );
        })}
      </List>
    </Container>
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

const Container = styled.section``;

const List = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  column-gap: 8px;
  padding-left: 8px;
  padding-right: 8px;
  padding-bottom: 4px;
`;

const AlertContent = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;
