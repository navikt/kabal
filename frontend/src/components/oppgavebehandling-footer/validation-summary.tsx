import React from 'react';
import { IValidationError, IValidationSection } from '../../functions/error-type-guard';
import { useFieldName } from '../../hooks/use-field-name';
import { useSectionTitle } from '../../hooks/use-section-title';
import {
  SectionTitle,
  StyledAlertStripe,
  StyledFieldList,
  StyledSection,
  ValidationSummaryContainer,
} from './styled-components';

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
