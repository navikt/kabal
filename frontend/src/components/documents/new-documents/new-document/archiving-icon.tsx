import { HourglassIcon } from '@navikt/aksel-icons';
import { memo } from 'react';
import { css, styled } from 'styled-components';
import { Fields } from '@app/components/documents/new-documents/grid';
import { DistribusjonsType } from '@app/types/documents/documents';

const GRID_CSS = css`
  grid-area: ${Fields.Action};
`;

const IconContainer = styled.span`
  ${GRID_CSS}
  width: var(--a-spacing-8);
  height: var(--a-spacing-8);
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const ArchivingIcon = memo(
  ({ dokumentTypeId }: { dokumentTypeId: DistribusjonsType }) => (
    <IconContainer
      title={
        dokumentTypeId === DistribusjonsType.NOTAT
          ? 'Dokumentet er under journalføring.'
          : 'Dokumentet er under journalføring og utsending.'
      }
      data-testid="document-archiving"
    >
      <HourglassIcon aria-hidden />
    </IconContainer>
  ),
  (p, n) => p.dokumentTypeId === n.dokumentTypeId,
);

ArchivingIcon.displayName = 'ArchivingIcon';
