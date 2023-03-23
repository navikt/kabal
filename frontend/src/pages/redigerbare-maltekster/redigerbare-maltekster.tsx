import React from 'react';
import { SmartEditorTexts } from '@app/components/smart-editor-texts/smart-editor-texts';
import { RichTextTypes } from '@app/types/texts/texts';
import { PageWrapper } from '../page-wrapper';

export const RedigerbareMalteksterPage = () => (
  <PageWrapper>
    <SmartEditorTexts textType={RichTextTypes.REDIGERBAR_MALTEKST} />
  </PageWrapper>
);

// eslint-disable-next-line import/no-default-export
export default RedigerbareMalteksterPage;
