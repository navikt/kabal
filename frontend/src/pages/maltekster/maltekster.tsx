import { SmartEditorTexts } from '@/components/smart-editor-texts/smart-editor-texts';
import { PageWrapper } from '@/pages/page-wrapper';
import { RichTextTypes } from '@/types/common-text-types';

export const MalteksterPage = () => (
  <PageWrapper>
    <SmartEditorTexts textType={RichTextTypes.MALTEKST} />
  </PageWrapper>
);
