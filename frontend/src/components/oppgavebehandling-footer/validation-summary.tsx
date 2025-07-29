import type { IValidationError, IValidationSection } from '@app/functions/error-type-guard';
import { useFieldName } from '@app/hooks/use-field-name';
import { useSectionTitle } from '@app/hooks/use-section-title';
import { Alert, Heading, VStack } from '@navikt/ds-react';

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
      <Heading level="1" size="xsmall" spacing className="pr-8">
        Kan ikke fullføre behandlingen
      </Heading>

      <VStack as="article" gap="4">
        {errorMessages}
      </VStack>
    </Alert>
  );
};

const Section = ({ section, properties }: IValidationSection) => (
  <section>
    <Heading level="2" size="xsmall">
      {useSectionTitle(section)}
    </Heading>

    <ul className="pl-4">
      {properties.map((p) => (
        <Field key={`${p.field}-${p.reason}`} {...p} />
      ))}
    </ul>
  </section>
);

const Field = ({ field, reason }: IValidationError) => (
  <li>
    <strong>{`${useFieldName(field)}: `}</strong>
    <span>{reason}</span>
  </li>
);
