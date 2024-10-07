import { styled } from 'styled-components';
import { UnpublishMaltekstseksjonButton } from '@app/components/maltekstseksjoner/maltekstseksjon/unpublish-maltekstseksjon-button';
import { ScalingGroup } from '@app/hooks/settings/use-setting';
import { ScaleContextComponent } from '@app/plate/status-bar/scale-context';
import { IGetMaltekstseksjonParams } from '@app/types/maltekstseksjoner/params';
import { IMaltekstseksjon } from '@app/types/maltekstseksjoner/responses';
import { MaltekstseksjonVersions } from './maltekstseksjon-versions';

interface Props {
  maltekstseksjon: IMaltekstseksjon;
  query: IGetMaltekstseksjonParams;
}

export const Maltekstseksjon = ({ maltekstseksjon, query }: Props) => (
  <MaltekstseksjonContainer data-element="MaltekstseksjonContainer">
    <MaltekstseksjonHeader>
      <UnpublishMaltekstseksjonButton publishedMaltekstseksjon={maltekstseksjon} query={query} />
    </MaltekstseksjonHeader>

    <ScaleContextComponent scalingGroup={ScalingGroup.REDAKTØR}>
      <MaltekstseksjonVersions id={maltekstseksjon.id} query={query} />
    </ScaleContextComponent>
  </MaltekstseksjonContainer>
);

const MaltekstseksjonContainer = styled.div`
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border-radius: var(--a-border-radius-medium);
  box-shadow: var(--a-shadow-medium);
  padding: 8px;
  padding-top: 0;
  padding-right: 0;
  margin-right: 4px;
  margin-bottom: 4px;
  margin-top: 4px;
  grid-area: content;
`;

const MaltekstseksjonHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 16px;
  padding-bottom: 0;
`;
