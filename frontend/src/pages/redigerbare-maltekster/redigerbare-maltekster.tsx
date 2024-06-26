import { SmartEditorTexts } from '@app/components/smart-editor-texts/smart-editor-texts';
import { RichTextTypes } from '@app/types/common-text-types';
import { PageWrapper } from '../page-wrapper';

export const RedigerbareMalteksterPage = () => (
  <PageWrapper>
    <SmartEditorTexts textType={RichTextTypes.REDIGERBAR_MALTEKST} />
  </PageWrapper>
);
