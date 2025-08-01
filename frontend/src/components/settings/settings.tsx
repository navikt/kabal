import { PdfScale } from '@app/components/settings/pdf-scale/pdf-scale';
import { VStack } from '@navikt/ds-react';
import { Abbreviations } from './abbreviations/abbreviations';
import { Filters } from './filters';
import { Signature } from './signature';

export const Settings = () => (
  <VStack gap="4" className="@container">
    <PdfScale />

    <div
      style={{
        gridTemplateColumns: '1fr minmax(1030px, 1fr)',
        gridTemplateRows: 'min-content',
        gridTemplateAreas: '"filters other"',
      }}
      className="@max-[1800px]:flex @min-[1800px]:grid w-full @max-[1800px]:flex-col @min-[1800px]:items-start gap-4"
    >
      <Filters />

      <VStack gap="4" gridColumn="other">
        <Abbreviations />
        <Signature />
      </VStack>
    </div>
  </VStack>
);
