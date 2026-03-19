import { SmartEditorTexts } from '@/components/smart-editor-texts/smart-editor-texts';
import { PageWrapper } from '@/pages/page-wrapper';
import { GOD_FORMULERING_TYPE } from '@/types/common-text-types';

export const GodeFormuleringerPage = () => (
  <PageWrapper>
    <SmartEditorTexts textType={GOD_FORMULERING_TYPE} />
  </PageWrapper>
);
