import { ScalingGroup } from '@app/hooks/settings/use-setting';
import { ScaleContextComponent } from '@app/plate/status-bar/scale-context';
import type { IGetMaltekstseksjonParams } from '@app/types/maltekstseksjoner/params';
import { Box, VStack } from '@navikt/ds-react';
import { MaltekstseksjonVersions } from './maltekstseksjon-versions';

interface Props {
  maltekstseksjonId: string;
  query: IGetMaltekstseksjonParams;
}

export const Maltekstseksjon = ({ maltekstseksjonId, query }: Props) => (
  <VStack
    asChild
    overflow="hidden"
    paddingBlock="0 2"
    paddingInline="2 0"
    marginBlock="1"
    marginInline="0 1"
    gridColumn="content"
    data-element="MaltekstseksjonContainer"
  >
    <Box borderRadius="medium" shadow="medium">
      <ScaleContextComponent scalingGroup={ScalingGroup.REDAKTØR}>
        <MaltekstseksjonVersions id={maltekstseksjonId} query={query} />
      </ScaleContextComponent>
    </Box>
  </VStack>
);
