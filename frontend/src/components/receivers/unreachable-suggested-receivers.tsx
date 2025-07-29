import { PartStatusList } from '@app/components/part-status-list/part-status-list';
import { Address } from '@app/components/receivers/address/address';
import { getTypeNames } from '@app/components/receivers/functions';
import { StyledReceiver } from '@app/components/receivers/styled-components';
import { formatIdNumber } from '@app/functions/format-id';
import type { IBrevmottaker } from '@app/hooks/use-suggested-brevmottakere';
import { IdType, type IPart, PartStatusEnum } from '@app/types/oppgave-common';
import { Buildings3Icon, PersonIcon } from '@navikt/aksel-icons';
import { Alert, CopyButton, HelpText, HStack, Label, Tooltip } from '@navikt/ds-react';

interface ReceiversProps {
  receivers: IBrevmottaker[];
}

export const UnreachableSuggestedReceivers = ({ receivers }: ReceiversProps) => {
  if (receivers.length === 0) {
    return null;
  }

  return (
    <section>
      <Label size="small" spacing as="h1">
        Utilgjengelige parter fra saken
      </Label>

      <ul className="m-0 list-none p-0">
        {receivers.map(({ part, brevmottakertyper, overriddenAddress, handling }) => {
          const { identifikator, id, name, statusList } = part;
          const isPerson = part.type === IdType.FNR;

          const alertText = getUnreachableText(statusList);
          const helpText = getUnreachableHelpText(statusList);

          return (
            <StyledReceiver key={id} as="li" accent="danger">
              <HStack align="center" gap="2" flexShrink="0" paddingInline="2" minHeight="8">
                <HStack align="center" gap="1">
                  <Tooltip content={isPerson ? 'Person' : 'Organisasjon'}>
                    {isPerson ? <PersonIcon aria-hidden /> : <Buildings3Icon aria-hidden />}
                  </Tooltip>
                  {(name ?? identifikator === null) ? null : (
                    <CopyButton
                      size="xsmall"
                      copyText={name ?? identifikator}
                      text={`${name} (${getTypeNames(brevmottakertyper)})`}
                    />
                  )}
                  <PartStatusList statusList={statusList} size="xsmall" />
                </HStack>
              </HStack>
              <HStack align="center" gap="0 2" paddingInline="2" paddingBlock="0 1">
                {identifikator === null ? null : (
                  <CopyButton size="xsmall" copyText={id} text={formatIdNumber(identifikator)} />
                )}
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
            </StyledReceiver>
          );
        })}
      </ul>
    </section>
  );
};

const getUnreachableText = (statusList: IPart['statusList']): string | null => {
  if (statusList === null || statusList.length === 0) {
    return null;
  }

  if (statusList.some((s) => s.status === PartStatusEnum.DEAD)) {
    return 'personen er død';
  }

  if (statusList.some((s) => s.status === PartStatusEnum.DELETED)) {
    return 'selskapet er avviklet';
  }

  return null;
};

const getUnreachableHelpText = (statusList: IPart['statusList']): string | null => {
  if (statusList === null || statusList.length === 0) {
    return null;
  }

  if (statusList.some((s) => s.status === PartStatusEnum.DELETED)) {
    return 'Ta kontakt med parten for å få nytt organisasjonsnummer eller oppdatert adresse.';
  }

  return null;
};
