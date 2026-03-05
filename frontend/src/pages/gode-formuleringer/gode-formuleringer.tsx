import { SmartEditorTexts } from '@app/components/smart-editor-texts/smart-editor-texts';
import { PageWrapper } from '@app/pages/page-wrapper';
import { GOD_FORMULERING_TYPE } from '@app/types/common-text-types';

export const GodeFormuleringerPage = () => (
  <PageWrapper>
    <SmartEditorTexts textType={GOD_FORMULERING_TYPE} />
  </PageWrapper>
);
