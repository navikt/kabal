type Action = () => unknown;
type Result = { readonly isLoading: boolean; readonly isSuccess: boolean; readonly isUninitialized: boolean };

type ApiHookResult = readonly [Action, Result];

export type ApiHook = () => ApiHookResult;
