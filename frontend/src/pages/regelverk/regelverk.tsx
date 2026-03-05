import { SmartEditorTexts } from '@app/components/smart-editor-texts/smart-editor-texts';
import { PageWrapper } from '@app/pages/page-wrapper';
import { REGELVERK_TYPE } from '@app/types/common-text-types';

export const RegelverkPage = () => (
  <PageWrapper>
    <SmartEditorTexts textType={REGELVERK_TYPE} />
  </PageWrapper>
);
