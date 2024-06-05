import { Skeleton } from '@navikt/ds-react';
import { styled } from 'styled-components';
import { Annet } from './annet';
import { BrukAvRaadgivendeLege } from './bruk-av-raadgivende';
import { useKvalitetsvurderingV2 } from './common/use-kvalitetsvurdering-v2';
import { Klageforberedelsen } from './klageforberedelsen';
import { Utredningen } from './utredningen';
import { Vedtaket } from './vedtaket';

export const KvalitetsskjemaV2 = () => {
  const { isLoading } = useKvalitetsvurderingV2();

  if (isLoading) {
    return (
      <StyledKvalitetsskjema data-testid="kvalitetsskjema">
        <div>
          <Skeleton variant="text" height={48} width="50%" />
          <Skeleton variant="rounded" height={32} />
        </div>
        <div>
          <Skeleton variant="text" height={48} width="50%" />
          <Skeleton variant="rounded" height={64} />
        </div>
        <div>
          <Skeleton variant="text" height={48} width="50%" />
          <Skeleton variant="rounded" height={96} />
        </div>
        <div>
          <Skeleton variant="text" height={48} width="50%" />
          <Skeleton variant="rounded" height={132} />
        </div>
      </StyledKvalitetsskjema>
    );
  }

  return (
    <StyledKvalitetsskjema data-testid="kvalitetsskjema">
      <Klageforberedelsen />
      <Utredningen />
      <Vedtaket />
      <BrukAvRaadgivendeLege />
      <Annet />
    </StyledKvalitetsskjema>
  );
};

const StyledKvalitetsskjema = styled.section`
  display: flex;
  flex-direction: column;
  row-gap: 32px;
`;
