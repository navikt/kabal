import React from 'react';
import { SmartEditorTexts } from '../../components/smart-editor-texts/smart-editor-texts';
import { PlainTextTypes } from '../../types/texts/texts';
import { PageWrapper } from '../page-wrapper';

export const BunnteksterPage = () => (
  <PageWrapper>
    <SmartEditorTexts textType={PlainTextTypes.FOOTER} />
  </PageWrapper>
);

// eslint-disable-next-line import/no-default-export
export default BunnteksterPage;
