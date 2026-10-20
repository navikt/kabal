import { LocalAlert as AkselLocalAlert, type LocalAlertProps } from '@navikt/ds-react';

interface Props extends Omit<LocalAlertProps, 'size' | 'title' | 'children'> {
  title: React.ReactNode;
  children?: React.ReactNode;
}

export const LocalAlert = ({ title, children, ...props }: Props) => (
  <AkselLocalAlert size="small" {...props}>
    <AkselLocalAlert.Header>
      <AkselLocalAlert.Title>{title}</AkselLocalAlert.Title>
    </AkselLocalAlert.Header>
    {children === undefined ? null : <AkselLocalAlert.Content>{children}</AkselLocalAlert.Content>}
  </AkselLocalAlert>
);
