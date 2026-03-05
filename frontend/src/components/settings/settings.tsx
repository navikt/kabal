import { Abbreviations } from '@app/components/settings/abbreviations/abbreviations';
import { Filters } from '@app/components/settings/filters';
import { PdfScale } from '@app/components/settings/pdf-scale/pdf-scale';
import { Signature } from '@app/components/settings/signature';
import { VStack } from '@navikt/ds-react';

export const Settings = () => (
  <VStack gap="space-16" className="@container">
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

      <VStack gap="space-16" gridColumn="other">
        <Abbreviations />
        <Signature />
      </VStack>
    </div>
  </VStack>
);
