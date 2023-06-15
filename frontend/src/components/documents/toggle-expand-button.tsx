import { ChevronLeftIcon, ChevronRightIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';
import React, { useCallback } from 'react';
import { useIsExpanded } from '@app/components/documents/use-is-expanded';
import { useDocumentsFilterIncluded } from '@app/hooks/settings/use-setting';
import { IncludedDocumentFilter } from '@app/types/documents/documents';

export const ToggleExpandedButton = () => {
  const [isExpanded, setIsExpanded] = useIsExpanded();
  const { setValue } = useDocumentsFilterIncluded();

  const onToggle = useCallback(() => {
    setIsExpanded(!isExpanded);
    setValue(isExpanded ? IncludedDocumentFilter.INCLUDED : IncludedDocumentFilter.ALL);
  }, [isExpanded, setIsExpanded, setValue]);

  const Icon = isExpanded ? ChevronLeftIcon : ChevronRightIcon;

  return (
    <Button
      variant="secondary"
      size="small"
      onClick={onToggle}
      data-testid="documents-collapse-view-button"
      icon={<Icon aria-hidden />}
      title={isExpanded ? 'Bruk kompakt visning' : 'Bruk detaljert visning'}
    />
  );
};
