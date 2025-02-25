import { Button } from '@navikt/ds-react';
import { StatusIcon } from './status-icon';

interface Props {
  isLoading: boolean;
  isSuccess: boolean;
  isUninitialized: boolean;
  children: React.ReactNode;
  onClick: () => void;
}

export const AdminButton = ({ children, isLoading, isSuccess, isUninitialized, onClick }: Props): React.JSX.Element => (
  <Button
    type="button"
    variant="primary"
    size="small"
    onClick={onClick}
    loading={isLoading}
    disabled={isLoading}
    icon={<StatusIcon success={isSuccess} init={!isUninitialized} isLoading={isLoading} />}
    iconPosition="right"
  >
    {children}
  </Button>
);
