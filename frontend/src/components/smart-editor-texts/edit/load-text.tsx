import { FileTextIcon } from '@navikt/aksel-icons';
import { useParams } from 'react-router';
import { styled } from 'styled-components';
import { StandaloneTextVersions } from '@app/components/smart-editor-texts/edit/standalone-text-versions';
import { ScalingGroup } from '@app/hooks/settings/use-setting';
import { ScaleContextComponent } from '@app/plate/status-bar/scale-context';

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
    <ScaleContextComponent zoomGroup={ScalingGroup.REDAKTØR}>
      <Container data-textid={id}>
        <StandaloneTextVersions id={id} />
      </Container>
    </ScaleContextComponent>
  );
};

const Container = styled.article`
  position: relative;
  display: flex;
  flex-direction: column;
  width: calc(210mm * var(--kabal-editor-scale) + 64px);
  min-width: calc(210mm + 64px);
  flex-shrink: 0;
  height: 100%;
  box-shadow: var(--a-shadow-small);
  border-radius: var(--a-border-radius-medium);
`;

const EmptyContainer = styled(Container)`
  justify-content: center;
  align-items: center;
  color: var(--a-surface-subtle);
  min-width: calc(210mm + 64px);
`;
