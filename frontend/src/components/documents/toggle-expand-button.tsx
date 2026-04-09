import { ChevronLeftIcon, ChevronRightIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';
import { useCallback } from 'react';
import { useIsExpanded } from '@/components/documents/use-is-expanded';
import { useDocumentsOnlyIncluded } from '@/hooks/settings/use-setting';
import { pushEvent } from '@/observability';

export const ToggleExpandedButton = () => {
  const [isExpanded, setIsExpanded] = useIsExpanded();
  const { setValue } = useDocumentsOnlyIncluded();

  const onToggle = useCallback(() => {
    pushEvent('toggle-expand-documents', 'documents', { expanded: (!isExpanded).toString() });
    setIsExpanded(!isExpanded);
    setValue(isExpanded);
  }, [isExpanded, setIsExpanded, setValue]);

  const Icon = isExpanded ? ChevronLeftIcon : ChevronRightIcon;

  return (
    <Button
      data-color="neutral"
      className="ml-auto"
      variant="secondary"
      size="small"
      onClick={onToggle}
      icon={<Icon aria-hidden />}
      title={isExpanded ? 'Bruk kompakt visning' : 'Bruk detaljert visning'}
    />
  );
};
