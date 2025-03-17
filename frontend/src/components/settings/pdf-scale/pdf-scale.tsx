import { DEFAULT_PDF_SCALE, DEFAULT_PDF_SCALE_MODE } from '@app/components/settings/pdf-scale/constants';
import { CustomScale } from '@app/components/settings/pdf-scale/custom';
import { PdfScaleModeToggle } from '@app/components/settings/pdf-scale/toggle';
import { SectionHeader, SettingsSection } from '@app/components/settings/styled-components';
import { PdfScaleMode, useNewTabPdfCustomScale, useNewTabPdfScaleMode } from '@app/hooks/settings/use-setting';
import {
  CaretLeftRightIcon,
  CaretUpDownIcon,
  ExpandIcon,
  FileSearchIcon,
  LaptopIcon,
  PersonIcon,
} from '@navikt/aksel-icons';
import { BodyShort, HelpText, VStack } from '@navikt/ds-react';
import { useCallback } from 'react';

export const PdfScale = () => {
  const { value: customScale = DEFAULT_PDF_SCALE, setValue: setCustomScale } = useNewTabPdfCustomScale();
  const { value: scaleMode = DEFAULT_PDF_SCALE_MODE, setValue: setScaleMode } = useNewTabPdfScaleMode();

  const onCustomScaleChange = useCallback(
    (value: number): number => {
      setCustomScale(value);
      setScaleMode(PdfScaleMode.CUSTOM);

      return value;
    },
    [setCustomScale, setScaleMode],
  );

  return (
    <SettingsSection>
      <SectionHeader>
        <FileSearchIcon aria-hidden />

        <span>Skalering av PDF åpnet i ny fane</span>

        <HelpText>
          <BodyShort spacing>
            Setter skalering for PDF åpnet i ny fane. Du kan også tilpasse skaleringen i PDF-visningen.
          </BodyShort>

          <BodyShort>Denne innstillingen huskes per nettleser.</BodyShort>
        </HelpText>
      </SectionHeader>

      <VStack gap="4">
        <PdfScaleModeToggle
          value={scaleMode}
          onChange={setScaleMode}
          options={[
            {
              label: 'Tilpass til skjermen',
              description: 'Tilpasser PDF til skjermbredden og -høyden',
              icon: <ExpandIcon aria-hidden />,
              scaleMode: PdfScaleMode.PAGE_FIT,
            },
            {
              label: 'Tilpass til skjermhøyden',
              description: 'Tilpasser PDF til skjermhøyden',
              icon: <CaretUpDownIcon aria-hidden />,
              scaleMode: PdfScaleMode.PAGE_HEIGHT,
            },
            {
              label: 'Tilpass til skjermbredden',
              description: 'Tilpasser PDF til skjermbredden',
              icon: <CaretLeftRightIcon aria-hidden />,
              scaleMode: PdfScaleMode.PAGE_WIDTH,
            },
            {
              label: 'Egendefinert',
              description: `${customScale} % skalering av PDF`,
              interactiveContent: <CustomScale scale={customScale} onChange={onCustomScaleChange} />,
              icon: <PersonIcon aria-hidden />,
              scaleMode: PdfScaleMode.CUSTOM,
              customScale: customScale,
            },
            {
              label: 'Nettleserstyrt',
              description: 'Nettleserstyrt skalering av PDF',
              icon: <LaptopIcon aria-hidden />,
              scaleMode: PdfScaleMode.NONE,
            },
          ]}
        />
      </VStack>
    </SettingsSection>
  );
};
