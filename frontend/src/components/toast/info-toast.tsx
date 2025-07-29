import { Heading } from '@navikt/ds-react';

interface Props {
  title: string;
  children: React.ReactNode;
  attrs?: {
    [key: string]: string;
  };
}

export const InfoToast = ({ title, children, attrs }: Props) => (
  <div {...attrs} className="whitespace-normal break-normal">
    <Heading level="1" size="xsmall">
      {title}
    </Heading>
    {children}
  </div>
);
