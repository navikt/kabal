import { SmartEditorTexts } from '@app/components/smart-editor-texts/smart-editor-texts';
import { GOD_FORMULERING_TYPE } from '@app/types/common-text-types';
import { PageWrapper } from '../page-wrapper';

export const GodeFormuleringerPage = () => (
  <PageWrapper>
    <SmartEditorTexts textType={GOD_FORMULERING_TYPE} />
  </PageWrapper>
);
