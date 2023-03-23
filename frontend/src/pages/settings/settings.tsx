import React from 'react';
import { Settings } from '@app/components/settings/settings';
import { StyledArticle } from '../page-wrapper';

export const SettingsPage = () => (
  <StyledArticle>
    <Settings />
  </StyledArticle>
);

// eslint-disable-next-line import/no-default-export
export default SettingsPage;
