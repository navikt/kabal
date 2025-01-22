import { PartStatusList } from '@app/components/part-status-list/part-status-list';
import { formatFoedselsnummer, formatOrgNum } from '@app/functions/format-id';
import { type IPart, IdType, PartStatusEnum } from '@app/types/oppgave-common';
import { Alert, BodyShort, Button, Loader, Tag } from '@navikt/ds-react';
import { styled } from 'styled-components';

interface LookupProps extends Omit<ResultProps, 'part'> {
  part: IPart | undefined;
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
  part: IPart;
  onChange: (part: IPart) => void;
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
    <StyledResult variant={part.type === IdType.FNR ? 'info' : 'warning'} size="medium">
      <BodyShort>
        {part.name} ({part.type === IdType.FNR ? formatFoedselsnummer(part.id) : formatOrgNum(part.id)})
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
    </StyledResult>
  );
};

const StyledResult = styled(Tag)`
  display: flex;
  flex-direction: column;
  align-items: start;
  gap: var(--a-spacing-2);
`;

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
