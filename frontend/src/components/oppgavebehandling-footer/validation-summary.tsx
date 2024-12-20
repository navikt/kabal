import type { IValidationError, IValidationSection } from '@app/functions/error-type-guard';
import { useFieldName } from '@app/hooks/use-field-name';
import { useSectionTitle } from '@app/hooks/use-section-title';
import { Alert } from '@navikt/ds-react';
import { styled } from 'styled-components';
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
    <StyledAlert variant="warning" size="small" data-testid="validation-summary">
      <div>Kan ikke fullføre behandling. Dette mangler:</div>
      <ValidationSummaryContainer>{errorMessages}</ValidationSummaryContainer>
    </StyledAlert>
  );
};

const Section = ({ section, properties }: IValidationSection) => (
  <StyledSection>
    <SectionTitle>{useSectionTitle(section)}</SectionTitle>
    <StyledFieldList>
      {properties.map((p) => (
        <Field key={`${p.field}-${p.reason}`} {...p} />
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

const StyledAlert = styled(Alert)`
  width: fit-content;
`;
