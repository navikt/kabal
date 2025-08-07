type Action = () => unknown;
type Result = { readonly isLoading: boolean; readonly isSuccess: boolean; readonly isUninitialized: boolean };

type MutationHook = readonly [Action, Result];
type QueryHook = readonly [Action, Result, unknown];

type ApiHookResult = QueryHook | MutationHook;

export type ApiHook = () => ApiHookResult;
