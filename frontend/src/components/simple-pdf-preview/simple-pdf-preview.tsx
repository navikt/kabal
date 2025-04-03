import { Pdf, type UsePdfData } from '@app/components/pdf/pdf';
import { Header } from '@app/components/view-pdf/header';
import { ArrowCirclepathIcon, ZoomMinusIcon, ZoomPlusIcon } from '@navikt/aksel-icons';
import { Box, Button, type ButtonProps, VStack } from '@navikt/ds-react';

const DEFAULT_WIDTH = 1000;
const MIN_PDF_WIDTH = 400;
const ZOOM_STEP = 150;
const MAX_PDF_WIDTH = MIN_PDF_WIDTH + ZOOM_STEP * 10;
const BUTTON_PROPS: ButtonProps = {
  size: 'xsmall',
  variant: 'tertiary-neutral',
};

interface Props extends UsePdfData {
  width: number | undefined;
  setWidth: (width: number) => void;
}

export const SimplePdfPreview = ({ refresh, loading, data, error, width = DEFAULT_WIDTH, setWidth }: Props) => {
  const decrease = () => setWidth(Math.max(width - ZOOM_STEP, MIN_PDF_WIDTH));
  const increase = () => setWidth(Math.min(width + ZOOM_STEP, MAX_PDF_WIDTH));

  return (
    <div className="grow">
      <VStack asChild height="100%" flexGrow="1" width={`${width}px`}>
        <Box shadow="medium">
          <Header>
            <Button onClick={decrease} title="Forstørr" icon={<ZoomMinusIcon aria-hidden />} {...BUTTON_PROPS} />
            <Button onClick={increase} title="Forminsk" icon={<ZoomPlusIcon aria-hidden />} {...BUTTON_PROPS} />
            <Button
              onClick={refresh}
              title="Oppdater PDF"
              icon={<ArrowCirclepathIcon aria-hidden />}
              loading={loading}
              {...BUTTON_PROPS}
            />
          </Header>

          <Pdf loading={loading} data={data} error={error} refresh={refresh} />
        </Box>
      </VStack>
    </div>
  );
};
