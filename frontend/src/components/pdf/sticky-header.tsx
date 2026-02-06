import type { NewTabProps } from '@app/components/pdf/types';
import { ReloadButton } from '@app/components/view-pdf/reload-button';
import { Variant, type VariantProps } from '@app/components/view-pdf/variant';
import { ExternalLinkIcon } from '@navikt/aksel-icons';
import { Box, Button, HStack, Tag, Tooltip } from '@navikt/ds-react';

interface StickyHeaderProps {
  title: string;
  currentPage: number | null;
  numPages: number | null;
  newTab?: NewTabProps;
  variant?: VariantProps;
  isLoading: boolean;
  refresh: () => void;
}

export const StickyHeader = ({
  title,
  currentPage,
  numPages,
  newTab,
  variant,
  isLoading,
  refresh,
}: StickyHeaderProps) => (
  <HStack asChild align="center" justify="space-between" gap="space-4" width="calc(100% - 1em)" wrap={false}>
    <Box background="neutral-moderate" padding="space-8" className="sticky top-0 z-20" shadow="dialog" borderRadius="8">
      <HStack wrap={false} justify="start" align="center" gap="space-4">
        <ReloadButton isLoading={isLoading} onClick={refresh} />

        <Tooltip content={title}>
          <h2 className="truncate font-ax-bold text-base">{title}</h2>
        </Tooltip>

        {newTab !== undefined ? (
          <Tooltip content="Åpne dokument i ny fane" describesChild>
            <Button
              as="a"
              href={newTab.url}
              target={newTab.id}
              icon={<ExternalLinkIcon aria-hidden />}
              onClick={newTab.onClick}
              onAuxClick={newTab.onClick}
              size="xsmall"
              variant="tertiary"
              data-color="neutral"
            />
          </Tooltip>
        ) : null}
      </HStack>

      <HStack gap="space-4" align="center" wrap={false}>
        {variant !== undefined ? <Variant {...variant} /> : null}

        <Tag data-color="brand-blue" variant="strong" size="xsmall">
          {currentPage === null || numPages === null
            ? '…'
            : `Side ${currentPage.toString(10)} av ${numPages.toString(10)}`}
        </Tag>
      </HStack>
    </Box>
  </HStack>
);
