import React from 'react';
import { SmartEditorTexts } from '@app/components/smart-editor-texts/smart-editor-texts';
import { PlainTextTypes } from '@app/types/common-text-types';
import { PageWrapper } from '../page-wrapper';

export const ToppteksterPage = () => (
  <PageWrapper>
    <SmartEditorTexts textType={PlainTextTypes.HEADER} />
  </PageWrapper>
);

// eslint-disable-next-line import/no-default-export
export default ToppteksterPage;
