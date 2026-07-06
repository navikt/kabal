export interface CancelButtonProps {
  cancel: () => void;
}

export interface ButtonsProps extends CancelButtonProps {
  finishDisabled: boolean;
}

export interface GosysAwareButtonsProps extends ButtonsProps {
  requiresGosysOppgave: boolean;
}
