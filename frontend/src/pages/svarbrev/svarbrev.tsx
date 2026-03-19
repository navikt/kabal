import type { ModalEnum } from '@/components/svarbrev/row/row';
import { Svarbrev } from '@/components/svarbrev/svarbrev';
import { PageWrapper } from '@/pages/page-wrapper';

interface Props {
  modal?: ModalEnum;
}

export const SvarbrevPage = (props: Props) => (
  <PageWrapper>
    <Svarbrev {...props} />
  </PageWrapper>
);
