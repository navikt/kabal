import { Header } from '@app/components/view-pdf/header';
import { NoFlickerReloadPdf, type UseNoFlickerReloadPdf } from '@app/components/view-pdf/no-flicker-reload';
import { useDocumentsArchivePdfWidth } from '@app/hooks/settings/use-setting';
import { ArrowCirclepathIcon, ZoomMinusIcon, ZoomPlusIcon } from '@navikt/aksel-icons';
import { Box, Button, type ButtonProps, VStack } from '@navikt/ds-react';
import { useEffect } from 'react';

const MIN_PDF_WIDTH = 400;
const ZOOM_STEP = 150;
const MAX_PDF_WIDTH = MIN_PDF_WIDTH + ZOOM_STEP * 10;
const BUTTON_PROPS: ButtonProps = {
  size: 'xsmall',
  variant: 'tertiary-neutral',
};

interface Props {
  isLoading: boolean;
  noFlickerReload: UseNoFlickerReloadPdf;
}

export const PDFPreview = ({ isLoading, noFlickerReload }: Props) => {
  const { value: pdfWidth = 1000, setValue: setPdfWidth } = useDocumentsArchivePdfWidth();
  const decrease = () => setPdfWidth(Math.max(pdfWidth - ZOOM_STEP, MIN_PDF_WIDTH));
  const increase = () => setPdfWidth(Math.min(pdfWidth + ZOOM_STEP, MAX_PDF_WIDTH));

  const { onLoaded, versions, onReload, setVersions } = noFlickerReload;

  useEffect(() => {
    setVersions([]);
    onReload();
  }, [onReload, setVersions]);

  return (
    <div className="grow">
      <VStack asChild height="100%" flexGrow="1" width={`${pdfWidth}px`}>
        <Box shadow="medium">
          <Header>
            <Button onClick={decrease} title="Smalere PDF" icon={<ZoomMinusIcon aria-hidden />} {...BUTTON_PROPS} />
            <Button onClick={increase} title="Bredere PDF" icon={<ZoomPlusIcon aria-hidden />} {...BUTTON_PROPS} />
            <Button
              onClick={onReload}
              title="Oppdater PDF"
              icon={<ArrowCirclepathIcon aria-hidden />}
              loading={isLoading}
              {...BUTTON_PROPS}
            />
          </Header>

          <NoFlickerReloadPdf versions={versions} isLoading={isLoading} onVersionLoaded={onLoaded} />
        </Box>
      </VStack>
    </div>
  );
};
