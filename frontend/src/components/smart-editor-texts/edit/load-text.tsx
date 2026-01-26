import { StandaloneTextVersions } from '@app/components/smart-editor-texts/edit/standalone-text-versions';
import { ScalingGroup } from '@app/hooks/settings/use-setting';
import { getScaleVar, ScaleContextComponent } from '@app/plate/status-bar/scale-context';
import { FileTextIcon } from '@navikt/aksel-icons';
import { Box, VStack } from '@navikt/ds-react';
import { useParams } from 'react-router';

const SCALING_VAR = getScaleVar(ScalingGroup.REDAKTØR);

export const LoadText = () => {
  const { id } = useParams<{ id: string }>();

  if (id === undefined) {
    return (
      <ScaleContextComponent scalingGroup={ScalingGroup.REDAKTØR}>
        <VStack
          asChild
          position="relative"
          align="center"
          justify="center"
          width={`calc(210mm * ${SCALING_VAR} + var(--ax-space-64))`}
          minWidth="calc(210mm + var(--ax-space-64))"
          data-textid={id}
        >
          <Box
            shadow="dialog"
            borderRadius="4"
            marginBlock="space-0 space-1"
            className="text-ax-text-neutral-decoration [grid-area:content]"
          >
            <FileTextIcon fontSize={400} aria-hidden />
          </Box>
        </VStack>
      </ScaleContextComponent>
    );
  }

  return (
    <ScaleContextComponent scalingGroup={ScalingGroup.REDAKTØR}>
      <VStack
        asChild
        position="relative"
        width={`calc(210mm * ${SCALING_VAR} + var(--ax-space-64))`}
        minWidth="calc(210mm + var(--ax-space-64))"
        data-textid={id}
      >
        <Box shadow="dialog" borderRadius="4" marginBlock="space-0 space-1" className="[grid-area:content]">
          <StandaloneTextVersions id={id} />
        </Box>
      </VStack>
    </ScaleContextComponent>
  );
};
