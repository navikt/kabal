import { useIsExpanded } from '@app/components/documents/use-is-expanded';
import { useDocumentsOnlyIncluded } from '@app/hooks/settings/use-setting';
import { pushEvent } from '@app/observability';
import { ChevronLeftIcon, ChevronRightIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';
import { useCallback } from 'react';

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
      className="ml-auto"
      variant="secondary-neutral"
      size="small"
      onClick={onToggle}
      data-testid="documents-collapse-view-button"
      icon={<Icon aria-hidden />}
      title={isExpanded ? 'Bruk kompakt visning' : 'Bruk detaljert visning'}
    />
  );
};
