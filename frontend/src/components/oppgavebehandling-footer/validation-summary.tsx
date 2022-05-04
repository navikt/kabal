import { Alert } from '@navikt/ds-react';
import React from 'react';
import { IValidationError, IValidationSection } from '../../functions/error-type-guard';
import { useFieldName } from '../../hooks/use-field-name';
import { useSectionTitle } from '../../hooks/use-section-title';
import { SectionTitle, StyledFieldList, StyledSection, ValidationSummaryContainer } from './styled-components';

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
    <Alert variant="warning" size="small" data-testid="validation-summary">
      <div>Kan ikke fullføre behandling. Dette mangler:</div>
      <ValidationSummaryContainer>{errorMessages}</ValidationSummaryContainer>
    </Alert>
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
