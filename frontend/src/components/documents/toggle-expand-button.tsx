import { ChevronLeftIcon, ChevronRightIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';
import React, { useCallback } from 'react';
import { styled } from 'styled-components';
import { useIsExpanded } from '@app/components/documents/use-is-expanded';
import { useDocumentsOnlyIncluded } from '@app/hooks/settings/use-setting';
import { pushEvent } from '@app/observability';

export const ToggleExpandedButton = () => {
  const [isExpanded, setIsExpanded] = useIsExpanded();
  const { setValue } = useDocumentsOnlyIncluded();

  const onToggle = useCallback(() => {
    pushEvent('toggle-expand-documents', undefined, 'documents', { skipDedupe: true });
    setIsExpanded(!isExpanded);
    setValue(isExpanded);
  }, [isExpanded, setIsExpanded, setValue]);

  const Icon = isExpanded ? ChevronLeftIcon : ChevronRightIcon;

  return (
    <StyledButton
      variant="secondary"
      size="small"
      onClick={onToggle}
      data-testid="documents-collapse-view-button"
      icon={<Icon aria-hidden />}
      title={isExpanded ? 'Bruk kompakt visning' : 'Bruk detaljert visning'}
    />
  );
};

const StyledButton = styled(Button)`
  margin-left: auto;
`;
