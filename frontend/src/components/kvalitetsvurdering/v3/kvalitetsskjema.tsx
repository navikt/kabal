import { Skeleton, VStack } from '@navikt/ds-react';
import { Annet } from '@/components/kvalitetsvurdering/v3/annet/annet';
import { useKvalitetsvurderingV3 } from '@/components/kvalitetsvurdering/v3/common/use-kvalitetsvurdering-v3';
import { Saksbehandlingsreglene } from '@/components/kvalitetsvurdering/v3/saksbehandlingsreglene/saksbehandlingsreglene';
import { Særregelverket } from '@/components/kvalitetsvurdering/v3/særregelverket/særregelverket';
import { Trygdemedisin } from '@/components/kvalitetsvurdering/v3/trygdemedisin/trygdemedisin';

export const KvalitetsskjemaV3 = () => {
  const { isLoading } = useKvalitetsvurderingV3();

  if (isLoading) {
    return (
      <VStack gap="space-32 space-0" data-testid="kvalitetsskjema">
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
    <div className="flex flex-col gap-8">
      <Særregelverket />
      <Saksbehandlingsreglene />
      <Trygdemedisin />
      <Annet />
    </div>
  );
};
