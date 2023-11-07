import { PencilIcon, TrashIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';
import React from 'react';
import { styled } from 'styled-components';
import { CustomTag } from '@app/components/tags/resolved-tag';
import { useUtfallNameOrLoading } from '@app/hooks/use-utfall-name';
import { UtfallEnum } from '@app/types/kodeverk';

interface ReadUtfallSetProps {
  utfallSet: UtfallEnum[];
  onDelete: () => void;
  editUtfallSet: () => void;
}

export const ReadUtfallSet = ({ utfallSet, onDelete, editUtfallSet }: ReadUtfallSetProps) => (
  <StyledReadUtfallSet>
    <UtfallTags>
      {utfallSet.length === 0 ? (
        <CustomTag variant="utfallIdList">Alle utfall</CustomTag>
      ) : (
        utfallSet.map((u) => <UtfallTag key={u} utfallId={u} />)
      )}
    </UtfallTags>
    <ButtonContainer>
      <Button
        variant="tertiary"
        size="xsmall"
        icon={<PencilIcon aria-hidden />}
        onClick={editUtfallSet}
        title="Endre"
      />
      <Button variant="tertiary" size="xsmall" icon={<TrashIcon aria-hidden />} onClick={onDelete} title="Slett" />
    </ButtonContainer>
  </StyledReadUtfallSet>
);

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: top;
  align-self: flex-start;
`;

const UtfallTag = ({ utfallId }: { utfallId: UtfallEnum }) => {
  const name = useUtfallNameOrLoading(utfallId);

  return <CustomTag variant="utfallIdList">{name}</CustomTag>;
};

const StyledReadUtfallSet = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const UtfallTags = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  gap: 4px;
`;
