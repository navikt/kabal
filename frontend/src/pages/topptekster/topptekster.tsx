import React from 'react';
import { SmartEditorTexts } from '../../components/smart-editor-texts/smart-editor-texts';
import { TextTypes } from '../../types/texts/texts';
import { PageWrapper } from '../page-wrapper';

export const ToppteksterPage = () => (
  <PageWrapper>
    <SmartEditorTexts textType={TextTypes.HEADER} />
  </PageWrapper>
);

// eslint-disable-next-line import/no-default-export
export default ToppteksterPage;
