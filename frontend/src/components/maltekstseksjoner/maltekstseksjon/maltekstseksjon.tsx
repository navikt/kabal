import { Box, VStack } from '@navikt/ds-react';
import { MaltekstseksjonVersions } from '@/components/maltekstseksjoner/maltekstseksjon/maltekstseksjon-versions';
import { ScalingGroup } from '@/hooks/settings/use-setting';
import { ScaleContextComponent } from '@/plate/status-bar/scale-context';
import type { IGetMaltekstseksjonParams } from '@/types/maltekstseksjoner/params';

interface Props {
  maltekstseksjonId: string;
  query: IGetMaltekstseksjonParams;
}

export const Maltekstseksjon = ({ maltekstseksjonId, query }: Props) => (
  <VStack
    asChild
    overflow="hidden"
    paddingBlock="space-0 space-8"
    paddingInline="space-8 space-0"
    marginBlock="space-4"
    marginInline="space-0 space-4"
    className="[grid-area:content]"
    data-element="MaltekstseksjonContainer"
  >
    <Box borderRadius="4" shadow="dialog">
      <ScaleContextComponent scalingGroup={ScalingGroup.REDAKTØR}>
        <MaltekstseksjonVersions id={maltekstseksjonId} query={query} />
      </ScaleContextComponent>
    </Box>
  </VStack>
);
