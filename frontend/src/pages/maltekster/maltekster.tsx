import React from 'react';
import { SmartEditorTexts } from '@app/components/smart-editor-texts/smart-editor-texts';
import { RichTextTypes } from '@app/types/common-text-types';
import { PageWrapper } from '../page-wrapper';

export const MalteksterPage = () => (
  <PageWrapper>
    <SmartEditorTexts textType={RichTextTypes.MALTEKST} />
  </PageWrapper>
);

// eslint-disable-next-line import/no-default-export
export default MalteksterPage;
