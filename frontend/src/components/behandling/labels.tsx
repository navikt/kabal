import NavFrontendSpinner from 'nav-frontend-spinner';
import React from 'react';
import { useTemaFromId, useTypeFromId } from '../../hooks/use-kodeverk-ids';
import { useGetKodeverkQuery } from '../../redux-api/kodeverk';
import { LabelTema, LabelType } from '../../styled-components/labels';
import { StyledInfoDetails, StyledInfoLabel, StyledLabel, StyledLabels } from './styled-components';

interface LabelsProps {
  typeId: string;
  temaId: string;
}

export const Labels = ({ typeId, temaId }: LabelsProps) => {
  const { data: kodeverk, isLoading } = useGetKodeverkQuery();
  const temaName = useTemaFromId(temaId);
  const typeName = useTypeFromId(typeId);

  if (typeof kodeverk === 'undefined' || isLoading) {
    return <NavFrontendSpinner />;
  }

  const TypeName = <LabelType>{typeName}</LabelType>;
  const TemaName = <LabelTema>{temaName}</LabelTema>;

  return (
    <StyledLabels>
      <StyledLabel>
        <StyledInfoLabel>Type:</StyledInfoLabel>
        <StyledInfoDetails>{TypeName}</StyledInfoDetails>
      </StyledLabel>

      <StyledLabel>
        <StyledInfoLabel>Tema:</StyledInfoLabel>
        <StyledInfoDetails>{TemaName}</StyledInfoDetails>
      </StyledLabel>
    </StyledLabels>
  );
};
