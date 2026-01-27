import { Abbreviations } from '@app/components/settings/abbreviations/abbreviations';
import { Filters } from '@app/components/settings/filters';
import { Signature } from '@app/components/settings/signature';
import { VStack } from '@navikt/ds-react';
import { ScaleSettings } from '@navikt/klage-file-viewer';

export const Settings = () => (
  <VStack gap="space-16" className="@container">
    <ScaleSettings />

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
