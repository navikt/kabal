import { PencilIcon } from '@navikt/aksel-icons';
import { BodyShort, Button, Search, Tag, TagProps } from '@navikt/ds-react';
import { dnr, fnr } from '@navikt/fnrvalidator';
import React, { useState } from 'react';
import styled from 'styled-components';
import { isValidOrgnr } from '@app/domain/orgnr';
import { formatFoedselsnummer, formatOrgNum } from '@app/functions/format-id';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { useCanEdit } from '@app/hooks/use-can-edit';
import { useLazySearchFullmektigQuery } from '@app/redux-api/oppgaver/mutations/behandling';
import { IPart, IdType } from '@app/types/oppgave-common';
import { BehandlingSection } from '../behandling-section';
import { DeleteButton } from './delete-button';
import { Lookup } from './lookup';

export const Fullmektig = () => {
  const { data: oppgave } = useOppgave();
  const [isEditing, setIsEditing] = useState(false);
  const canEdit = useCanEdit();

  if (typeof oppgave === 'undefined') {
    return null;
  }

  const toggleEditing = () => setIsEditing(!isEditing);
  const close = () => setIsEditing(false);

  return (
    <BehandlingSection label="Fullmektig">
      <StyledFullmektig>
        {getFullmektig(oppgave.prosessfullmektig)}
        <div>
          <DeleteButton show={isEditing} close={close} />
          <EditButton show={canEdit} onClick={toggleEditing} />
        </div>
      </StyledFullmektig>

      <EditFullmektig show={isEditing} close={close} />
    </BehandlingSection>
  );
};

interface EditButtonProps {
  show: boolean;
  onClick: () => void;
}

const EditButton = ({ show, onClick }: EditButtonProps) => {
  if (!show) {
    return null;
  }

  return <Button variant="tertiary" icon={<PencilIcon aria-hidden />} onClick={onClick} size="small" />;
};

const getFullmektig = (part: IPart | null): string => {
  if (part === null) {
    return 'Ikke satt';
  }

  return part.name ?? '-';
};

interface EditFullmektigProps {
  show: boolean;
  close: () => void;
}

const NUMBER_REGEX = /([\d]{9}|[\d]{11})/;

const EditFullmektig = ({ close, show }: EditFullmektigProps) => {
  const [rawValue, setValue] = useState('');
  const [error, setError] = useState<string>();
  const [search, { data, isLoading }] = useLazySearchFullmektigQuery();

  if (!show) {
    return null;
  }

  const onClick = () => {
    const value = rawValue.replaceAll(' ', '');

    const idNumError =
      value.length === 11 && (fnr(value).status !== 'valid' || dnr(value).status !== 'valid')
        ? 'Ugyldig fødselsnummer/D-nummer'
        : undefined;

    const orgNumError = value.length === 9 && !isValidOrgnr(value) ? 'Ugyldig organisasjonsnummer' : undefined;

    const charError = NUMBER_REGEX.test(value) ? undefined : 'Ugyldig fødselsnummer/D-nummer eller organisasjonsnummer';

    const inputError = charError ?? idNumError ?? orgNumError;

    setError(inputError);

    if (typeof inputError === 'undefined') {
      search(value);
    }
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      onClick();
    }
  };

  return (
    <StyledEditFullmektig>
      <Search label="Søk" size="small" value={rawValue} onChange={setValue} error={error} onKeyDown={onKeyDown}>
        <Search.Button onClick={onClick} />
      </Search>
      <Label part={data} />
      <Lookup close={close} isSearching={isLoading} data={data} />
    </StyledEditFullmektig>
  );
};

interface LabelProps {
  part: IPart | undefined;
}

const Label = ({ part }: LabelProps) => {
  if (typeof part === 'undefined') {
    return null;
  }

  if (part.type === IdType.FNR) {
    return <LabelWrapper variant="info">{formatFoedselsnummer(part.id)}</LabelWrapper>;
  }

  if (part.type === IdType.ORGNR) {
    return <LabelWrapper variant="warning">{formatOrgNum(part.id)}</LabelWrapper>;
  }

  return null;
};

interface LabelWrapperProps {
  children: string;
  variant: TagProps['variant'];
}

const LabelWrapper = ({ children, variant }: LabelWrapperProps) => (
  <BodyShort>
    Treff på:{' '}
    <Tag variant={variant} size="small">
      {children}
    </Tag>
  </BodyShort>
);

const StyledFullmektig = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const StyledEditFullmektig = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 8px;
  margin-top: 16px;
`;
