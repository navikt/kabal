export type ApiHookResult = readonly [
  () => unknown,
  { readonly isLoading: boolean; readonly isSuccess: boolean; readonly isUninitialized: boolean }
];

export type ApiHook = () => ApiHookResult;
