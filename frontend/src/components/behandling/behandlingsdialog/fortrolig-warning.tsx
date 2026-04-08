import { LocalAlert } from '@navikt/ds-react';

interface Props {
  heading: string;
  children: React.ReactNode;
}

export const FortroligWarning = ({ heading, children }: Props) => (
  <LocalAlert status="warning" size="small" className="my-2">
    <LocalAlert.Header>
      <LocalAlert.Title>{heading}</LocalAlert.Title>
    </LocalAlert.Header>
    <LocalAlert.Content>{children}</LocalAlert.Content>
  </LocalAlert>
);
