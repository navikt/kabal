import { ScalingGroup } from '@app/hooks/settings/use-setting';
import { ScaleContextComponent } from '@app/plate/status-bar/scale-context';
import type { IGetMaltekstseksjonParams } from '@app/types/maltekstseksjoner/params';
import { BoxNew, VStack } from '@navikt/ds-react';
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
    className="[grid-area:content]"
    data-element="MaltekstseksjonContainer"
  >
    <BoxNew borderRadius="medium" shadow="dialog">
      <ScaleContextComponent scalingGroup={ScalingGroup.REDAKTØR}>
        <MaltekstseksjonVersions id={maltekstseksjonId} query={query} />
      </ScaleContextComponent>
    </BoxNew>
  </VStack>
);
