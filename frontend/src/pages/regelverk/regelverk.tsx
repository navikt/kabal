import React from 'react';
import { SmartEditorTexts } from '../../components/smart-editor-texts/smart-editor-texts';
import { TextTypes } from '../../types/texts/texts';
import { PageWrapper } from '../page-wrapper';

export const RegelverkPage = () => (
  <PageWrapper>
    <SmartEditorTexts textType={TextTypes.REGELVERK} />
  </PageWrapper>
);