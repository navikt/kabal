import { skipToken } from '@reduxjs/toolkit/query';
import { FeatureToggles, useGetFeatureToggleQuery } from '@app/redux-api/feature-toggling';

export { FeatureToggles } from '@app/redux-api/feature-toggling';

export const useFeatureToggle = (feature?: FeatureToggles | typeof skipToken) => {
  const { data } = useGetFeatureToggleQuery(feature ?? skipToken);

  return data ?? false;
};
