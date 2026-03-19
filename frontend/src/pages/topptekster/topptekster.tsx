import { SmartEditorTexts } from '@/components/smart-editor-texts/smart-editor-texts';
import { PageWrapper } from '@/pages/page-wrapper';
import { PlainTextTypes } from '@/types/common-text-types';

export const ToppteksterPage = () => (
  <PageWrapper>
    <SmartEditorTexts textType={PlainTextTypes.HEADER} />
  </PageWrapper>
);
