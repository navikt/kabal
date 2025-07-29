import { PartNameAndIdentifikator } from '@app/components/part-name-and-identifikator/part-name-and-identifikator';
import { PartStatusList } from '@app/components/part-status-list/part-status-list';
import { type IdentifikatorPart, IdType, PartStatusEnum } from '@app/types/oppgave-common';
import { Alert, BodyShort, Button, Loader, Tag, VStack } from '@navikt/ds-react';

interface LookupProps extends Omit<ResultProps, 'part'> {
  part: IdentifikatorPart | undefined;
  isSearching: boolean;
}

export const Lookup = ({ part, isSearching, ...rest }: LookupProps) => {
  if (isSearching) {
    return <Loader title="Laster..." />;
  }

  if (typeof part === 'undefined') {
    return null;
  }

  return <Result part={part} {...rest} />;
};

interface ResultProps {
  part: IdentifikatorPart;
  onChange: (part: IdentifikatorPart) => void;
  isLoading: boolean;
  buttonText?: string;
  allowUnreachable?: boolean;
}

const Result = ({ part, isLoading, onChange, buttonText = 'Bruk', allowUnreachable = false }: ResultProps) => {
  const isReachable =
    allowUnreachable ||
    part.statusList === null ||
    !part.statusList.some((s) => s.status === PartStatusEnum.DEAD || s.status === PartStatusEnum.DELETED);

  return (
    <VStack asChild gap="2" align="start" marginBlock="space-16" paddingInline="space-12" paddingBlock="space-8">
      <Tag variant={part.type === IdType.FNR ? 'info' : 'neutral'} size="medium">
        <BodyShort>
          <PartNameAndIdentifikator identifikator={part.identifikator} name={part.name} />
        </BodyShort>

        <PartStatusList statusList={part.statusList} size="xsmall" />

        {isReachable ? (
          <Button onClick={() => onChange(part)} loading={isLoading} size="small" variant="secondary">
            {buttonText}
          </Button>
        ) : (
          <Alert size="small" variant="warning">
            Parten kan ikke velges som mottaker fordi {getUnreachableText(part.statusList)}.
          </Alert>
        )}
      </Tag>
    </VStack>
  );
};

const getUnreachableText = (statusList: IdentifikatorPart['statusList']): string | null => {
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
