import { SmartEditorTexts } from '@/components/smart-editor-texts/smart-editor-texts';
import { PageWrapper } from '@/pages/page-wrapper';
import { REGELVERK_TYPE } from '@/types/common-text-types';

export const RegelverkPage = () => (
  <PageWrapper>
    <SmartEditorTexts textType={REGELVERK_TYPE} />
  </PageWrapper>
);
