import { AdminButton } from '@/components/admin/admin-button';
import type { ApiHook } from '@/components/admin/types';

interface Props {
  useApi: ApiHook;
  children: React.ReactNode;
}

export const ApiButton = ({ children, useApi }: Props): React.JSX.Element => {
  const [callApi, props] = useApi();

  return (
    <AdminButton onClick={callApi} {...props}>
      {children}
    </AdminButton>
  );
};
