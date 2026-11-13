import { Skeleton, VStack } from '@navikt/ds-react';
import { useKvalitetsvurderingAnkeAfter2027State } from '@/components/kvalitetsvurdering/anke-after-2027/hooks';
import { Omgjøring } from '@/components/kvalitetsvurdering/anke-after-2027/omgjøring';
import { Saksbehandlingsfeil } from '@/components/kvalitetsvurdering/anke-after-2027/saksbehandlingsfeil';

export const KvalitetsskjemaAnkeAfter2027 = () => {
  const { isLoading } = useKvalitetsvurderingAnkeAfter2027State();

  if (isLoading) {
    return (
      <VStack gap="space-32 space-0">
        <div>
          <Skeleton variant="text" height={48} width="50%" />
          <Skeleton variant="rounded" height={32} />
        </div>
        <div>
          <Skeleton variant="text" height={48} width="50%" />
          <Skeleton variant="rounded" height={196} />
        </div>
      </VStack>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <Omgjøring />
      <Saksbehandlingsfeil />
    </div>
  );
};
