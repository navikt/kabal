import { FileTextIcon } from '@navikt/aksel-icons';
import { useParams } from 'react-router';
import { styled } from 'styled-components';
import { EDITOR_SCALE_CSS_VAR } from '@app/components/smart-editor/hooks/use-scale';
import { StandaloneTextVersions } from '@app/components/smart-editor-texts/edit/standalone-text-versions';
import { ScalingGroup } from '@app/hooks/settings/use-setting';
import { ScaleContextComponent, getScaleVar } from '@app/plate/status-bar/scale-context';

export const LoadText = () => {
  const { id } = useParams<{ id: string }>();

  if (id === undefined) {
    return (
      <EmptyContainer data-textid={id}>
        <FileTextIcon fontSize={400} aria-hidden />
      </EmptyContainer>
    );
  }

  return (
    <ScaleContextComponent scalingGroup={ScalingGroup.REDAKTØR}>
      <Container data-textid={id} style={{ [EDITOR_SCALE_CSS_VAR.toString()]: getScaleVar(ScalingGroup.REDAKTØR) }}>
        <StandaloneTextVersions id={id} />
      </Container>
    </ScaleContextComponent>
  );
};

const Container = styled.article`
  position: relative;
  display: flex;
  flex-direction: column;
  width: calc(210mm * var(--kabal-editor-scale) + var(--a-spacing-16));
  min-width: calc(210mm + var(--a-spacing-16));
  flex-shrink: 0;
  height: 100%;
  box-shadow: var(--a-shadow-small);
  border-radius: var(--a-border-radius-medium);
`;

const EmptyContainer = styled(Container)`
  justify-content: center;
  align-items: center;
  color: var(--a-surface-subtle);
  min-width: calc(210mm + var(--a-spacing-16));
`;
