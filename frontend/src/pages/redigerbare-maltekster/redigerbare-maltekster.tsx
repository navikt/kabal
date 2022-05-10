import React from 'react';
import { SmartEditorTexts } from '../../components/smart-editor-texts/smart-editor-texts';
import { TextTypes } from '../../types/texts/texts';
import { PageWrapper } from '../page-wrapper';

export const RedigerbareMalteksterPage = () => (
  <PageWrapper>
    <SmartEditorTexts textType={TextTypes.REDIGERBAR_MALTEKST} />
  </PageWrapper>
);
