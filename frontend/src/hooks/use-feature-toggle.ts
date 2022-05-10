import { skipToken } from '@reduxjs/toolkit/dist/query';
import { FeatureToggles, useGetFeatureToggleQuery } from '../redux-api/feature-toggling';

export { FeatureToggles } from '../redux-api/feature-toggling';

export const useFeatureToggle = (feature?: FeatureToggles | typeof skipToken) => {
  const { data } = useGetFeatureToggleQuery(feature ?? skipToken);
  return data ?? false;
};
