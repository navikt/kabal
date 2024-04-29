import React from 'react';
import { SmartEditorTexts } from '@app/components/smart-editor-texts/smart-editor-texts';
import { REGELVERK_TYPE } from '@app/types/common-text-types';
import { PageWrapper } from '../page-wrapper';

export const RegelverkPage = () => (
  <PageWrapper>
    <SmartEditorTexts textType={REGELVERK_TYPE} />
  </PageWrapper>
);
