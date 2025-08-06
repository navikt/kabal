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
  validate?: (part: IdentifikatorPart) => string | null;
}

const Result = ({
  part,
  isLoading,
  onChange,
  buttonText = 'Bruk',
  allowUnreachable = false,
  validate,
}: ResultProps) => {
  const isReachable =
    allowUnreachable ||
    part.statusList === null ||
    !part.statusList.some((s) => s.status === PartStatusEnum.DEAD || s.status === PartStatusEnum.DELETED);

  return (
    <VStack asChild gap="2" align="start" paddingInline="space-12" paddingBlock="space-8">
      <Tag variant={part.type === IdType.FNR ? 'info' : 'neutral'} size="medium">
        <BodyShort>
          <PartNameAndIdentifikator identifikator={part.identifikator} name={part.name} />
        </BodyShort>

        <PartStatusList statusList={part.statusList} size="xsmall" />

        <ActionOrError
          isReachable={isReachable}
          buttonText={buttonText}
          onClick={() => onChange(part)}
          loading={isLoading}
          part={part}
          validate={validate}
        />
      </Tag>
    </VStack>
  );
};

interface ActionOrErrorProps {
  isReachable: boolean;
  buttonText: string;
  onClick: () => void;
  loading?: boolean;
  part: IdentifikatorPart;
  validate?: (part: IdentifikatorPart) => string | null;
}

const ActionOrError = ({ isReachable, buttonText, onClick, loading, part, validate }: ActionOrErrorProps) => {
  const error = validate?.(part) ?? null;

  if (error !== null) {
    return (
      <Alert size="small" variant="info" inline>
        {error}
      </Alert>
    );
  }

  if (isReachable) {
    return (
      <Button size="small" variant="secondary" onClick={onClick} loading={loading}>
        {buttonText}
      </Button>
    );
  }

  return (
    <Alert size="small" variant="warning" inline>
      Parten kan ikke velges som mottaker fordi {getUnreachableText(part.statusList)}.
    </Alert>
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
