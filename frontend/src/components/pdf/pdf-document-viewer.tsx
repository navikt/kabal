import { Pdf } from '@app/components/pdf/pdf';
import { usePdfData } from '@app/components/pdf/use-pdf-data';
import { ReloadButton } from '@app/components/view-pdf/reload-button';
import { Variant, type VariantProps } from '@app/components/view-pdf/variant';
import { usePdfRotation } from '@app/hooks/settings/use-setting';
import { usePrevious } from '@app/hooks/use-previous';
import { ExternalLinkIcon, XMarkIcon } from '@navikt/aksel-icons';
import { Box, Button, HStack, Tooltip, VStack } from '@navikt/ds-react';

export interface NewTabProps {
  url: string;
  id: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

export interface PdfDocumentViewerProps {
  /** PDF source URL - changes to this trigger a re-fetch */
  url: string;
  /** Optional query parameters to be sent with the PDF request - changes to this trigger a re-fetch */
  query?: Record<string, string>;
  /** Shows close button when provided - called when the user clicks the close button */
  onClose?: () => void;
  /** Shows title when provided */
  title?: string;
  /** Shows new tab button when provided */
  newTab?: NewTabProps;
  /** Shows variant/redaction controls when provided */
  variant?: VariantProps;
}

export const PdfDocumentViewer = ({ url, query, onClose, title, newTab, variant }: PdfDocumentViewerProps) => {
  const { value: rotation = 0, setValue: setRotation } = usePdfRotation(url);
  const { data, loading, error, refresh } = usePdfData(url, query);
  const previousUrl = usePrevious(url);

  const showLoadingOverlay = loading && previousUrl !== url;

  const showHeader = onClose !== undefined || title !== undefined || newTab !== undefined || variant !== undefined;

  return (
    <VStack asChild width="min-content" height="100%" flexGrow="1" align="center" justify="center">
      <Box as="section" background="default" shadow="dialog" borderRadius="4" position="relative">
        {showHeader ? (
          <Header>
            <HStack wrap={false} justify="start" align="center">
              {onClose !== undefined ? (
                <Tooltip content="Lukk dokumentet" describesChild>
                  <Button
                    onClick={onClose}
                    icon={<XMarkIcon aria-hidden />}
                    size="xsmall"
                    variant="tertiary"
                    data-color="neutral"
                  />
                </Tooltip>
              ) : null}

              <ReloadButton isLoading={loading} onClick={refresh} />

              {title !== undefined ? (
                <Tooltip content={title}>
                  <h1 className="truncate pl-1 font-ax-bold text-base">{title}</h1>
                </Tooltip>
              ) : null}

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

            {variant !== undefined ? <Variant {...variant} /> : null}
          </Header>
        ) : null}

        <Pdf
          data={data}
          loading={showLoadingOverlay}
          error={error}
          refresh={refresh}
          rotation={rotation}
          setRotation={setRotation}
        />
      </Box>
    </VStack>
  );
};

interface HeaderProps {
  children: React.ReactNode;
}

const Header = ({ children }: HeaderProps) => (
  <HStack asChild align="center" justify="space-between" gap="space-4" position="relative" width="100%" wrap={false}>
    <Box background="success-soft" padding="space-8" className="z-1">
      {children}
    </Box>
  </HStack>
);
