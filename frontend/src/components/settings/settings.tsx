import { VStack } from '@navikt/ds-react';
import { ScaleSettings } from '@navikt/klage-file-viewer';
import { Abbreviations } from '@/components/settings/abbreviations/abbreviations';
import { Filters } from '@/components/settings/filters';
import { Signature } from '@/components/settings/signature';

export const Settings = () => (
  <VStack gap="space-16" className="@container">
    <ScaleSettings />

    <div
      style={{
        gridTemplateColumns: '1fr minmax(1030px, 1fr)',
        gridTemplateRows: 'min-content',
        gridTemplateAreas: '"filters other"',
      }}
      className="w-full gap-4 @max-[1800px]:flex @max-[1800px]:flex-col @min-[1800px]:grid @min-[1800px]:items-start"
    >
      <Filters />

      <VStack gap="space-16" gridColumn="other">
        <Abbreviations />
        <Signature />
      </VStack>
    </div>
  </VStack>
);
