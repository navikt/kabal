import { RootStateOrAny } from "react-redux";

export function velgToaster(state: RootStateOrAny) {
  return state.toaster;
}
export function velgToasterMelding(state: RootStateOrAny) {
  return state.toaster.feilmelding;
}
