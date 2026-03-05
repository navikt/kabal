import { SmartEditorTexts } from '@app/components/smart-editor-texts/smart-editor-texts';
import { PageWrapper } from '@app/pages/page-wrapper';
import { RichTextTypes } from '@app/types/common-text-types';

export const RedigerbareMalteksterPage = () => (
  <PageWrapper>
    <SmartEditorTexts textType={RichTextTypes.REDIGERBAR_MALTEKST} />
  </PageWrapper>
);
