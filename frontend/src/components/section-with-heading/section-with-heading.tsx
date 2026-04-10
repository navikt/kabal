import { Heading, type HeadingProps } from '@navikt/ds-react';
import { useId } from 'react';

interface SectionWithHeadingProps extends Omit<HeadingProps, 'children' | 'id'> {
  heading: string;
  children: React.ReactNode;
}

export const SectionWithHeading = ({ heading, children, ...headingProps }: SectionWithHeadingProps) => {
  const headingId = useId();

  return (
    <section aria-labelledby={headingId}>
      <Heading id={headingId} {...headingProps}>
        {heading}
      </Heading>
      {children}
    </section>
  );
};
