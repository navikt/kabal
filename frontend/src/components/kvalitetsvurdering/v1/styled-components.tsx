import { HelpText } from '@navikt/ds-react';

interface FormSectionProps {
  children: React.ReactNode;
}

export const FormSection = ({ children }: FormSectionProps) => <section className="mb-8">{children}</section>;

interface StyledHelpTextProps {
  title?: string;
  children?: React.ReactNode;
}

export const StyledHelpText = ({ title, children }: StyledHelpTextProps) => (
  <HelpText title={title} className="max-w-full">
    <span className="whitespace-normal">{children}</span>
  </HelpText>
);
