import { PencilIcon } from '@navikt/aksel-icons';
import { BodyShort, Button, Search, Tag, TagProps } from '@navikt/ds-react';
import { dnr, fnr } from '@navikt/fnrvalidator';
import React, { useState } from 'react';
import styled from 'styled-components';
import { isValidOrgnr } from '@app/domain/orgnr';
import { formatFoedselsnummer, formatOrgNum } from '@app/functions/format-id';
import { useCanEdit } from '@app/hooks/use-can-edit';
import { useLazySearchPersonQuery } from '@app/redux-api/oppgaver/mutations/behandling';
import { IPart, IdType } from '@app/types/oppgave-common';
import { BehandlingSection } from '../behandling/behandlingsdetaljer/behandling-section';
import { DeleteButton } from './delete-button';
import { Lookup } from './lookup';

interface DeletableProps {
  isDeletable: true;
  label: string;
  part: IPart | null;
  onChange: (part: IPart | null) => void;
  isLoading: boolean;
}

interface NonDeletabelProps {
  isDeletable: false;
  label: string;
  part: IPart;
  onChange: (part: IPart) => void;
  isLoading: boolean;
}

export const Part = ({ part, isDeletable, label, onChange, isLoading }: DeletableProps | NonDeletabelProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const canEdit = useCanEdit();

  const toggleEditing = () => setIsEditing(!isEditing);

  return (
    <BehandlingSection label={label}>
      <StyledPart>
        {getPart(part)}
        <div>
          {isDeletable && isEditing ? (
            <DeleteButton
              onDelete={() => {
                onChange(null);
                setIsEditing(false);
              }}
            />
          ) : null}
          {canEdit ? <EditButton onClick={toggleEditing} /> : null}
        </div>
      </StyledPart>

      {isEditing ? (
        <EditPart
          onChange={(newPart) => {
            onChange(newPart);
            setIsEditing(false);
          }}
          isLoading={isLoading}
        />
      ) : null}
    </BehandlingSection>
  );
};

interface EditButtonProps {
  onClick: () => void;
}

const EditButton = ({ onClick }: EditButtonProps) => (
  <Button variant="tertiary" icon={<PencilIcon aria-hidden />} onClick={onClick} size="small" />
);

const getPart = (part: IPart | null): string => {
  if (part === null) {
    return 'Ikke satt';
  }

  return part.name ?? '-';
};

interface EditPartProps {
  onChange: (part: IPart) => void;
  isLoading: boolean;
}

const NUMBER_REGEX = /([\d]{9}|[\d]{11})/;

const EditPart = ({ onChange, isLoading }: EditPartProps) => {
  const [rawValue, setValue] = useState('');
  const [error, setError] = useState<string>();
  const [search, { data, isLoading: isSearching }] = useLazySearchPersonQuery();

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
    <StyledEditPart>
      <Search label="Søk" size="small" value={rawValue} onChange={setValue} error={error} onKeyDown={onKeyDown}>
        <Search.Button onClick={onClick} />
      </Search>
      <Label part={data} />
      <Lookup isSearching={isSearching} part={data} onChange={onChange} isLoading={isLoading} />
    </StyledEditPart>
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

const StyledPart = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const StyledEditPart = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 8px;
  margin-top: 16px;
`;
