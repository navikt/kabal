import { sendCloseEvent } from '@app/components/toast/toast/helpers';
import { Stack } from '@navikt/ds-react';

interface Props {
  children: React.ReactNode;
  primary?: React.ReactNode;
  secondary?: React.ReactNode;
  attrs?: {
    [key: string]: string;
  };
}

export const ActionToast = ({ children, primary, secondary, attrs }: Props) => (
  <div {...attrs}>
    <span>{children}</span>
    <Stack
      direction="row-reverse"
      justify="space-between"
      gap="space-0 space-8"
      onClick={({ target }) => sendCloseEvent(target)}
    >
      {secondary}
      {primary}
    </Stack>
  </div>
);
