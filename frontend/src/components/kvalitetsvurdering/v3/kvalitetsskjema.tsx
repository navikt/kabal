import { Annet } from '@app/components/kvalitetsvurdering/v3/annet/annet';
import { useKvalitetsvurderingV3 } from '@app/components/kvalitetsvurdering/v3/common/use-kvalitetsvurdering-v3';
import { Saksbehandlingsreglene } from '@app/components/kvalitetsvurdering/v3/saksbehandlingsreglene/saksbehandlingsreglene';
import { Særregelverket } from '@app/components/kvalitetsvurdering/v3/særregelverket/særregelverket';
import { Trygdemedisin } from '@app/components/kvalitetsvurdering/v3/trygdemedisin/trygdemedisin';
import { Skeleton, VStack } from '@navikt/ds-react';
import { styled } from 'styled-components';

export const KvalitetsskjemaV3 = () => {
  const { isLoading } = useKvalitetsvurderingV3();

  if (isLoading) {
    return (
      <VStack gap="8 0" data-testid="kvalitetsskjema">
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
      </VStack>
    );
  }

  return (
    <StyledKvalitetsskjema data-testid="kvalitetsskjema">
      <Særregelverket />
      <Saksbehandlingsreglene />
      <Trygdemedisin />
      <Annet />
    </StyledKvalitetsskjema>
  );
};

const StyledKvalitetsskjema = styled.section`
  display: flex;
  flex-direction: column;
  row-gap: 32px;
`;
