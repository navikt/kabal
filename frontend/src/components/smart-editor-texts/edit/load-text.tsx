import { StandaloneTextVersions } from '@app/components/smart-editor-texts/edit/standalone-text-versions';
import { EDITOR_SCALE_CSS_VAR } from '@app/components/smart-editor/hooks/use-scale';
import { ScalingGroup } from '@app/hooks/settings/use-setting';
import { ScaleContextComponent, getScaleVar } from '@app/plate/status-bar/scale-context';
import { FileTextIcon } from '@navikt/aksel-icons';
import { Box, VStack } from '@navikt/ds-react';
import { useParams } from 'react-router';

export const LoadText = () => {
  const { id } = useParams<{ id: string }>();

  if (id === undefined) {
    return (
      <VStack
        asChild
        position="relative"
        align="center"
        justify="center"
        width="calc(210mm * var(--kabal-editor-scale) + var(--a-spacing-16))"
        minWidth="calc(210mm + var(--a-spacing-16))"
        data-textid={id}
        className="text-surface-subtle"
      >
        <Box shadow="small" borderRadius="medium" marginBlock="0 4" className="[grid-area:content]">
          <FileTextIcon fontSize={400} aria-hidden />
        </Box>
      </VStack>
    );
  }

  return (
    <ScaleContextComponent scalingGroup={ScalingGroup.REDAKTØR}>
      <VStack
        asChild
        position="relative"
        width="calc(210mm * var(--kabal-editor-scale) + var(--a-spacing-16))"
        minWidth="calc(210mm + var(--a-spacing-16))"
        data-textid={id}
        style={{ [EDITOR_SCALE_CSS_VAR.toString()]: getScaleVar(ScalingGroup.REDAKTØR) }}
      >
        <Box shadow="small" borderRadius="medium" marginBlock="0 4" className="[grid-area:content]">
          <StandaloneTextVersions id={id} />
        </Box>
      </VStack>
    </ScaleContextComponent>
  );
};
