import { RootState } from "../root";

export function velgAuth(state: RootState) {
  return state.auth.isAuth;
}
