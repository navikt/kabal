import { useDocumentsExpanded } from '@app/hooks/settings/use-setting';

type IsExpanded = [boolean, (isExpanded: boolean) => void];

export const useIsExpanded = (): IsExpanded => {
  const { value: isExpanded = true, setValue: setIsExpanded } = useDocumentsExpanded();

  return [isExpanded, setIsExpanded];
};
