export interface IOption<T> {
  value: T;
  label: string;
  disabled?: boolean;
  tags?: React.ReactNode[];
}

export interface BaseProps<T extends string, O = IOption<T>> {
  selected: T[];
  options: O[];
  onChange: (selected: T[]) => void;
  focused?: IOption<T> | null;
}

export interface DropdownProps {
  open: boolean;
  close: () => void;
}
