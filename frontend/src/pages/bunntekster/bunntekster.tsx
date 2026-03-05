import { SmartEditorTexts } from '@app/components/smart-editor-texts/smart-editor-texts';
import { PageWrapper } from '@app/pages/page-wrapper';
import { PlainTextTypes } from '@app/types/common-text-types';

export const BunnteksterPage = () => (
  <PageWrapper>
    <SmartEditorTexts textType={PlainTextTypes.FOOTER} />
  </PageWrapper>
);
