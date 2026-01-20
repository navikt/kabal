import { SimpleApiState, useSimpleApiState } from '@app/simple-api-state/simple-api-state';

type FeatureToggle = {
  enabled: boolean;
};

const createEkspedisjonsbrevToTR = new SimpleApiState<FeatureToggle>('/feature-toggle/createEkspedisjonsbrevToTR');

export const useCreateEkspedisjonsbrevToTRFeatureToggle = () => useSimpleApiState(createEkspedisjonsbrevToTR);
