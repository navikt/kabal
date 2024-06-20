import { ModalEnum } from '@app/components/svarbrev/row/row';
import { Svarbrev } from '@app/components/svarbrev/svarbrev';
import { PageWrapper } from '@app/pages/page-wrapper';

interface Props {
  modal?: ModalEnum;
}

export const SvarbrevPage = (props: Props) => (
  <PageWrapper>
    <Svarbrev {...props} />
  </PageWrapper>
);
