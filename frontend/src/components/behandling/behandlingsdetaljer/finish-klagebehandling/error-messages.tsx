import Alertstripe from 'nav-frontend-alertstriper';
import React from 'react';
import styled from 'styled-components';
import { IValidationError, IValidationSection } from '../../../../functions/error-type-guard';
import { useFieldName } from '../../../../hooks/use-field-name';
import { useSectionTitle } from '../../../../hooks/use-section-title';

interface Props {
  sections: IValidationSection[];
}

export const ValidationSummary = ({ sections }: Props) => {
  if (sections.length === 0) {
    return null;
  }

  const errorMessages = sections.map(({ section, properties }) => (
    <Section section={section} properties={properties} key={section} />
  ));

  return (
    <StyledAlertStripe type="advarsel">
      <div>Kan ikke fullføre behandling. Dette mangler:</div>
      <ValidationSummaryContainer>{errorMessages}</ValidationSummaryContainer>
    </StyledAlertStripe>
  );
};

const Section = ({ section, properties }: IValidationSection) => (
  <StyledSection>
    <SectionTitle>{useSectionTitle(section)}</SectionTitle>
    <StyledFieldList>
      {properties.map((p) => (
        <Field key={p.field} {...p} />
      ))}
    </StyledFieldList>
  </StyledSection>
);

const Field = ({ field, reason }: IValidationError) => (
  <li>
    <strong>{`${useFieldName(field)}: `}</strong>
    <span>{reason}</span>
  </li>
);

const StyledAlertStripe = styled(Alertstripe)`
  margin-bottom: 1em;
`;

const ValidationSummaryContainer = styled.article`
  margin: 0;
  margin-top: 10px;
  padding: 0;
`;

const StyledFieldList = styled.ul`
  margin: 0;
  padding: 0;
  padding-left: 1em;
`;

const SectionTitle = styled.h1`
  margin: 0;
`;

const StyledSection = styled.section`
  margin-top: 10px;
`;
