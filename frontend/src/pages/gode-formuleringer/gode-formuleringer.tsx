import React from 'react';
import { SmartEditorTexts } from '@app/components/smart-editor-texts/smart-editor-texts';
import { RichTextTypes } from '@app/types/texts/texts';
import { PageWrapper } from '../page-wrapper';

export const GodeFormuleringerPage = () => (
  <PageWrapper>
    <SmartEditorTexts textType={RichTextTypes.GOD_FORMULERING} />
  </PageWrapper>
);

// eslint-disable-next-line import/no-default-export
export default GodeFormuleringerPage;
